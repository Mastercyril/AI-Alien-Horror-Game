#!/usr/bin/env node
/**
 * Daily Auto-Build — Destiny's World: The Ancient One
 * Procedurally generates fresh game content every day (deterministic, seeded by date):
 *   - 3 new NPCs with personalities, fears, and secrets
 *   - 3 new locations with atmosphere + hazards
 *   - New dialogue lines for the terminal web demo
 *   - A daily "K'Thaal behavior shift" for the alien AI
 *   - A story-branch scenario of the day
 * Output: generated/content.json (+ build log printed to stdout).
 * No API keys required. Runs in CI (GitHub Actions, daily cron) and locally.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'generated');
const OUT = join(OUT_DIR, 'content.json');

/* ---------- seeded RNG (mulberry32) ---------- */
function seedFromDate(dateStr) {
  let h = 1779033703;
  for (let i = 0; i < dateStr.length; i++) {
    h = Math.imul(h ^ dateStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}
function rng(seed) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function pickN(r, arr, n) {
  const copy = [...arr];
  const out = [];
  while (out.length < n && copy.length) out.push(copy.splice(Math.floor(r() * copy.length), 1)[0]);
  return out;
}

/* ---------- content pools ---------- */
const FIRST = ['Sarah', 'Elias', 'Mira', 'Dahlia', 'Marcus', 'Yuki', 'Nadia', 'Tobias', 'Rosa', 'Kade', 'Ivy', 'Silas', 'June', 'Roman', 'Wren'];
const LAST = ['Vance', 'Okafor', 'Reyes', 'Lindqvist', 'Mercer', 'Ito', 'Petrov', 'Hale', 'Nakamura', 'Cruz', 'Ashford', 'Voss'];
const ROLES = ['survivor', 'scientist', 'guard', 'medic', 'engineer', 'cultist', 'child', 'informant'];
const PERSONALITIES = ['paranoid but kind', 'coldly rational', 'hysterical', 'unnervingly calm', 'sarcastic under pressure', 'devout', 'fatalistic', 'obsessive'];
const FEARS = ['the dark', 'enclosed spaces', 'the sound of breathing', 'mirrors', 'being forgotten', 'water', 'the whispers in the vents', 'their own reflection'];
const SECRETS = [
  'knows a hidden route through the maintenance tunnels',
  'was paid to keep the containment logs quiet',
  'saw the Ancient One imitate a colleague',
  'has the key to the east wing barricade',
  'is slowly turning into something else',
  'made a deal with the entity in the Heart',
  'remembers a world where none of this happened',
];
const TRAITS = ['brave', 'fast', 'quiet', 'lucky', 'observant', 'resilient'];

const LOC_NAMES = ['Observation Ward B', 'Flooded Sublevel', 'Chapel of Static', 'The Sculpture Garden', 'Old Boiler Room', 'Quarantine Ring', 'Memory Vault', 'The Whispering Stairwell', 'Containment Mezzanine', 'Garden of False Dawn'];
const ATMOS = [
  'Emergency lights pulse like a slow heartbeat; the walls sweat condensation that never dries.',
  'A low drone vibrates through the floor. The air tastes of copper and old rain.',
  'Bioluminescent mold traces the ceiling in patterns that almost form words.',
  'Every surface is covered in thin scratches — all at exactly eye height.',
  'The temperature drops sharply. Your breath fogs. Something in the dark breathes with you.',
  'Dust hangs motionless in the air, refusing to settle, as if time here has stopped.',
];
const HAZARDS = [
  'collapsing floor sections (slow movement required)',
  'residual temporal discharge (sanity drains near the walls)',
  'the Ancient One patrols this ring every few minutes',
  'biohazard mist (health drain without a filter)',
  'unstable lighting — the dark comes without warning',
  'mimic zones: voices here are not who they claim to be',
];

const DIALOGUE = [
  '"You shouldn\'t have come back here. It remembers you now."',
  '"The doors only lock from the inside. Think about what that means."',
  '"I counted the screams last night. There were more than there are of us."',
  '"It wears faces. If you see someone you lost — run."',
  '"Day 52. The lights went out at 3:04 and never came back properly."',
  '"Don\'t trust the version of me that\'s kind. I\'ve never been kind."',
  '"The Heart isn\'t the source. It\'s the wound. Something else did the cutting."',
  '"If you hear your own voice calling from the vents, do not answer it."',
];

const KTHAAL_STATES = [
  'hunts by sound tonight — sprinting is suicide',
  'has learned the locker routes; hiding spots shift value',
  'moves slower in the cold zones but sees farther',
  'is mimicking Sarah\'s voice near the chapel',
  'abandons chases after 20 seconds unless you look back',
  'patrols in counter-clockwise loops, faster after each kill',
];

const BRANCHES = [
  'A survivor offers you a working radio — if you\'ll retrieve a locket from the Flooded Sublevel.',
  'The quarantine door is open for the first time. Nobody who enters has aged since.',
  'A power fluctuation reveals a corridor that isn\'t on any map. It smells of your childhood home.',
  'The entity leaves a gift outside the safe room: a photograph of you, taken from behind, tonight.',
  'All the clocks reset to 3:04 AM. Something wants that moment to happen again.',
];

/* ---------- generate ---------- */
const today = new Date().toISOString().slice(0, 10);
const r = rng(seedFromDate(today));

const content = {
  build: {
    date: today,
    generator: 'scripts/daily-generate.mjs',
    version: 2,
    source: 'deterministic daily generation (no external APIs)',
  },
  npcs: pickN(r, FIRST, 3).map((first, i) => ({
    id: `npc-${today}-${i}`,
    name: `${first} ${pick(r, LAST)}`,
    role: pick(r, ROLES),
    personality: pick(r, PERSONALITIES),
    fears: pickN(r, FEARS, 2),
    secret: pick(r, SECRETS),
    traits: pickN(r, TRAITS, 2),
    spawnHint: pick(r, LOC_NAMES),
  })),
  locations: pickN(r, LOC_NAMES, 3).map((name, i) => ({
    id: `loc-${today}-${i}`,
    name,
    atmosphere: pick(r, ATMOS),
    hazards: pickN(r, HAZARDS, 2),
  })),
  dialogue: pickN(r, DIALOGUE, 4),
  alienBehavior: `K'Thaal update: ${pick(r, KTHAAL_STATES)}.`,
  storyBranch: pick(r, BRANCHES),
};

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, JSON.stringify(content, null, 2) + '\n');

/* ---------- history log ---------- */
const LOG = join(OUT_DIR, 'build-log.json');
let history = [];
if (existsSync(LOG)) {
  try {
    history = JSON.parse(readFileSync(LOG, 'utf8'));
    if (!Array.isArray(history)) history = [];
  } catch { history = []; }
}
if (!history.some((e) => e.date === today)) {
  history.push({ date: today, npcs: content.npcs.length, locations: content.locations.length, dialogue: content.dialogue.length });
  history = history.slice(-60); // keep last 60 days
  writeFileSync(LOG, JSON.stringify(history, null, 2) + '\n');
}

console.log(`Daily build ${today}:`);
console.log(`  NPCs:      ${content.npcs.map((n) => n.name).join(', ')}`);
console.log(`  Locations: ${content.locations.map((l) => l.name).join(', ')}`);
console.log(`  Dialogue:  ${content.dialogue.length} new lines`);
console.log(`  Alien:     ${content.alienBehavior}`);
console.log(`  Branch:    ${content.storyBranch}`);
console.log(`  History:   ${history.length} logged builds`);
