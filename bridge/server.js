#!/usr/bin/env node
/**
 * Q Genesis ⇄ Unity Bridge — Destiny's World: The Ancient One
 * ------------------------------------------------------------
 * A local bridge server on port 8777 (the same port the 13th Chamber Puter
 * site's Quantum Bridge already pings). Two clients connect through it:
 *
 *   1. The Unity Editor (Assets/Scripts/UnityBridge/QGenesisUnityBridge.cs)
 *      POSTs game-design prompts here and receives generated content JSON:
 *      NPCs, locations, dialogue, story branches, alien behavior, and a
 *      one-click "high level graphics" preset for URP (teal horror grade,
 *      bloom, vignette, fog, flickering lights).
 *
 *   2. The 13thchamberinc.puter.site page can call the same endpoints from
 *      the browser (CORS is open for localhost) to push designs into Unity.
 *
 * No API keys, no external services — all generation is deterministic and
 * procedural, seeded from the prompt.
 *
 * Run:  node bridge/server.js          (then open the Unity window)
 */
const http = require('node:http');

const PORT = process.env.BRIDGE_PORT || 8777;

/* ---------- seeded RNG ---------- */
function seedFrom(str) {
  let h = 1779033703;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
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
const pick = (r, a) => a[Math.floor(r() * a.length)];
function pickN(r, a, n) {
  const c = [...a];
  const out = [];
  while (out.length < n && c.length) out.push(c.splice(Math.floor(r() * c.length), 1)[0]);
  return out;
}

/* ---------- pools (shared spirit with scripts/daily-generate.mjs) ---------- */
const POOLS = {
  first: ['Sarah', 'Elias', 'Mira', 'Dahlia', 'Marcus', 'Yuki', 'Nadia', 'Tobias', 'Rosa', 'Kade', 'Ivy', 'Silas', 'June', 'Roman', 'Wren'],
  last: ['Vance', 'Okafor', 'Reyes', 'Lindqvist', 'Mercer', 'Ito', 'Petrov', 'Hale', 'Nakamura', 'Cruz', 'Ashford', 'Voss'],
  roles: ['survivor', 'scientist', 'guard', 'medic', 'engineer', 'cultist', 'child', 'informant'],
  personalities: ['paranoid but kind', 'coldly rational', 'hysterical', 'unnervingly calm', 'sarcastic under pressure', 'devout', 'fatalistic', 'obsessive'],
  fears: ['the dark', 'enclosed spaces', 'the sound of breathing', 'mirrors', 'being forgotten', 'water', 'the whispers in the vents', 'their own reflection'],
  secrets: [
    'knows a hidden route through the maintenance tunnels',
    'was paid to keep the containment logs quiet',
    'saw the Ancient One imitate a colleague',
    'has the key to the east wing barricade',
    'is slowly turning into something else',
    'made a deal with the entity in the Heart',
  ],
  locNames: ['Observation Ward B', 'Flooded Sublevel', 'Chapel of Static', 'The Sculpture Garden', 'Old Boiler Room', 'Quarantine Ring', 'Memory Vault', 'The Whispering Stairwell', 'Containment Mezzanine', 'Garden of False Dawn'],
  atmos: [
    'Emergency lights pulse like a slow heartbeat; the walls sweat condensation that never dries.',
    'A low drone vibrates through the floor. The air tastes of copper and old rain.',
    'Bioluminescent mold traces the ceiling in patterns that almost form words.',
    'Every surface is covered in thin scratches — all at exactly eye height.',
  ],
  hazards: [
    'collapsing floor sections (slow movement required)',
    'residual temporal discharge (sanity drains near the walls)',
    'the Ancient One patrols this ring every few minutes',
    'mimic zones: voices here are not who they claim to be',
  ],
  dialogue: [
    '"You shouldn\'t have come back here. It remembers you now."',
    '"The doors only lock from the inside. Think about what that means."',
    '"It wears faces. If you see someone you lost — run."',
    '"If you hear your own voice calling from the vents, do not answer it."',
  ],
  branches: [
    'A survivor offers you a working radio — if you\'ll retrieve a locket from the Flooded Sublevel.',
    'The quarantine door is open for the first time. Nobody who enters has aged since.',
    'All the clocks reset to 3:04 AM. Something wants that moment to happen again.',
  ],
  kthaal: [
    'hunts by sound tonight — sprinting is suicide',
    'has learned the locker routes; hiding spots shift value',
    'is mimicking Sarah\'s voice near the chapel',
    'abandons chases after 20 seconds unless you look back',
  ],
};

/* ---------- generators ---------- */
function generateContent(prompt) {
  const r = rng(seedFrom(prompt || 'default'));
  return {
    prompt,
    npcs: pickN(r, POOLS.first, 3).map((first, i) => ({
      id: `npc-${i}`,
      name: `${first} ${pick(r, POOLS.last)}`,
      role: pick(r, POOLS.roles),
      personality: pick(r, POOLS.personalities),
      fears: pickN(r, POOLS.fears, 2),
      secret: pick(r, POOLS.secrets),
      spawnHint: pick(r, POOLS.locNames),
    })),
    locations: pickN(r, POOLS.locNames, 2).map((name, i) => ({
      id: `loc-${i}`,
      name,
      atmosphere: pick(r, POOLS.atmos),
      hazards: pickN(r, POOLS.hazards, 2),
    })),
    dialogue: pickN(r, POOLS.dialogue, 3),
    storyBranch: pick(r, POOLS.branches),
    alienBehavior: pick(r, POOLS.kthaal),
  };
}

/** URP "high level graphics" preset the Unity window applies in one click. */
function graphicsPreset(style) {
  const styles = {
    'teal-horror': {
      name: 'Teal Horror (Destiny\'s World)',
      exposure: 1.05,
      bloom: { intensity: 1.35, threshold: 0.85, scatter: 0.55 },
      vignette: { intensity: 0.42, smoothness: 0.45, roundness: 0.9 },
      colorGrading: { shadows: [-0.02, 0.06, 0.09], midtones: [0.0, 0.02, 0.03], highlights: [0.06, 0.03, -0.02], saturation: -6 },
      chromaticAberration: 0.28,
      filmGrain: { intensity: 0.45, size: 1 },
      fog: { color: '#0a1a1e', density: 0.045 },
      ambient: '#132225',
      keyLight: { color: '#3fd8c4', intensity: 1.1 },
      flickerLights: { color: '#ffd9a0', intensity: 2.2, count: 6 },
    },
    'moonlit-ward': {
      name: 'Moonlit Ward (abandoned asylum)',
      exposure: 0.92,
      bloom: { intensity: 1.8, threshold: 0.7, scatter: 0.7 },
      vignette: { intensity: 0.55, smoothness: 0.35, roundness: 0.85 },
      colorGrading: { shadows: [-0.01, 0.03, 0.08], midtones: [0.0, 0.01, 0.05], highlights: [0.04, 0.05, 0.02], saturation: -12 },
      chromaticAberration: 0.4,
      filmGrain: { intensity: 0.6, size: 2 },
      fog: { color: '#08141c', density: 0.06 },
      ambient: '#0d1c26',
      keyLight: { color: '#7fb8d8', intensity: 0.85 },
      flickerLights: { color: '#cfe8f2', intensity: 1.6, count: 8 },
    },
    'red-alert': {
      name: 'Red Alert (containment breach)',
      exposure: 1.0,
      bloom: { intensity: 2.2, threshold: 0.6, scatter: 0.8 },
      vignette: { intensity: 0.6, smoothness: 0.4, roundness: 1.0 },
      colorGrading: { shadows: [0.06, -0.01, -0.01], midtones: [0.05, 0.0, 0.0], highlights: [0.1, 0.02, 0.0], saturation: 4 },
      chromaticAberration: 0.5,
      filmGrain: { intensity: 0.7, size: 1 },
      fog: { color: '#1a0808', density: 0.05 },
      ambient: '#200d0d',
      keyLight: { color: '#ff4a3c', intensity: 1.4 },
      flickerLights: { color: '#ff6a5a', intensity: 2.6, count: 5 },
    },
  };
  return styles[style] || styles['teal-horror'];
}

/* ---------- server ---------- */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const send = (code, body) => {
    res.writeHead(code, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end(JSON.stringify(body, null, 2));
  };
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/health') {
    send(200, { ok: true, service: 'qgenesis-unity-bridge', version: 1, port: PORT });
    return;
  }
  if (req.method === 'GET' && url.pathname === '/graphics-presets') {
    send(200, {
      presets: ['teal-horror', 'moonlit-ward', 'red-alert'],
      note: 'GET /graphics-preset?style=teal-horror for the full preset.',
    });
    return;
  }
  if (req.method === 'GET' && url.pathname === '/graphics-preset') {
    send(200, graphicsPreset(url.searchParams.get('style')));
    return;
  }
  if (req.method === 'POST' && url.pathname === '/generate') {
    let body = '';
    req.on('data', (c) => (body += c));
    req.on('end', () => {
      try {
        const { prompt } = JSON.parse(body || '{}');
        send(200, generateContent(prompt));
      } catch (e) {
        send(400, { error: 'invalid JSON body' });
      }
    });
    return;
  }
  send(404, { error: `unknown route ${req.method} ${url.pathname}` });
});

server.listen(PORT, () => {
  console.log(`Q Genesis ⇄ Unity bridge listening on http://localhost:${PORT}`);
  console.log('Unity: open Window ▸ Q Genesis ▸ Game Builder (run bridge/server.js first).');
  console.log('Site : the 13thchamberinc.puter.site Quantum Bridge ping (port 8777) will now find this server.');
});
