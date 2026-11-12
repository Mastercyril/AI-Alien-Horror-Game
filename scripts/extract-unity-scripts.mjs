#!/usr/bin/env node
/**
 * Extract Unity C# scripts embedded in markdown docs into real Assets/Scripts files.
 * Deterministic: same docs in, same files out.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';

const ROOT = process.cwd();
const DOCS = [
  'COMPLETE_UNITY_SCRIPTS_FIXED.md',
  'FINAL_COMPLETION_AND_INTEGRATION_PHASE.md',
  'FINAL_FIX_AND_COMPLETION_SPRINT.md',
  'UNITY_GAME_SCRIPTS_COMPLETE.md',
  'VIVERSE_DEPLOYMENT_GUIDE.md',
  'WORLD_SYSTEM_SCRIPTS_BATCH2.md',
  'Assets/Scripts/SCRIPTS_PACKAGE.md',
];

const AREA_BY_NAME = {
  ai: ['AI', 'Xyloth', 'PsychologicalProfile', 'ManipulationEngine', 'KillerEvolution', 'AlienKiller'],
  viverse: ['VIVERSE'],
  world: ['World', 'Location', 'FastTravel', 'DynamicEvent', 'Weather', 'Portal', 'SceneTransition', 'Zone'],
  narrative: ['Ending', 'Morality', 'Quest', 'Dialogue', 'Memory', 'Story'],
  npcs: ['NPC', 'Sarah', 'Nexus'],
  gameplay: ['Stealth', 'Flashlight', 'Fear', 'Player', 'Interaction', 'Clue', 'Door', 'Collectible', 'Health', 'Inventory', 'Sanity', 'Save', 'GameManager', 'Audio', 'Sound', 'Light', 'Ambient', 'UI', 'HUD', 'Menu'],
};

function classify(name) {
  for (const [area, keys] of Object.entries(AREA_BY_NAME)) {
    if (keys.some((k) => name.toLowerCase().includes(k.toLowerCase()))) return area;
  }
  return 'core';
}

function findDocs() {
  const out = [];
  for (const d of DOCS) {
    try {
      if (statSync(join(ROOT, d)).isFile()) out.push(d);
    } catch { /* missing doc, skip */ }
  }
  // also scan Assets/Scripts recursively
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.md')) out.push(p);
    }
  };
  try { walk(join(ROOT, 'Assets/Scripts')); } catch { /* no dir */ }
  return [...new Set(out)];
}

function extractBlocks(md) {
  const blocks = [];
  const lines = md.split('\n');
  let inBlock = false;
  let fence = null;
  let buf = [];
  for (const line of lines) {
    const m = line.match(/^\s*```\s*(csharp|cs|c#)\s*$/i);
    if (!inBlock && m) {
      inBlock = true;
      fence = '```';
      buf = [];
      continue;
    }
    if (inBlock && line.trim() === fence) {
      blocks.push(buf.join('\n').trim());
      inBlock = false;
      continue;
    }
    if (inBlock) buf.push(line);
  }
  return blocks;
}

function scriptName(code) {
  // Prefer class/struct/enum/interface declaration name.
  const m =
    code.match(/^\s*public\s+(?:sealed\s+|abstract\s+|partial\s+)*(?:class|struct|enum|interface)\s+([A-Za-z_][A-Za-z0-9_]*)/m) ||
    code.match(/^\s*(?:class|struct|enum|interface)\s+([A-Za-z_][A-Za-z0-9_]*)/m);
  if (m) return m[1];
  return null;
}

const seen = new Map(); // name -> { area, code }
let dupes = 0;
const report = [];

const resolve = (p) => (p.startsWith('/') ? p : join(ROOT, p));

for (const doc of findDocs()) {
  const md = readFileSync(resolve(doc), 'utf8');
  const blocks = extractBlocks(md);
  for (const code of blocks) {
    if (code.length < 200) continue; // snippets, not full scripts
    const name = scriptName(code);
    if (!name) continue;
    const area = classify(name);
    const prev = seen.get(name);
    if (prev) {
      dupes++;
      if (code.length > prev.code.length) seen.set(name, { area, code, doc });
      continue;
    }
    seen.set(name, { area, code, doc });
  }
}

for (const [name, { area, code, doc }] of seen) {
  const dir = join(ROOT, 'Assets/Scripts', area);
  mkdirSync(dir, { recursive: true });
  const header = `// ${name}.cs\n// Destiny's World: The Ancient One — Unity game script.\n// Extracted from ${doc.split('/').pop()} into the repo by scripts/extract-unity-scripts.mjs.\n\n`;
  writeFileSync(join(dir, `${name}.cs`), header + code + '\n');
  report.push(`Assets/Scripts/${area}/${name}.cs  (from ${doc})`);
}

console.log(`Extracted ${seen.size} unique scripts (${dupes} duplicates skipped).`);
for (const line of report) console.log('  ' + line);
