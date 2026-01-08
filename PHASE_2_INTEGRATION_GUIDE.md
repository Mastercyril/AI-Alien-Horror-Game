# Destiny World: Phase 2 Integration Guide
## Advanced World Building, Adaptive AI, Daily Auto-Generation

---

## 📋 What's New in Phase 2 (Jan 8, 2026)

### **Core Additions**
1. **VIVERSE Integration** (`VIVERSEIntegration.js`) - Cloud-based 3D rendering
2. **Advanced Location System** (`LocationSystem.js`) - 7 locations, 100+ hide spots
3. **Enhanced Killer AI v2** (`AlienKillerAI_v2.js`) - Learning, psychology, memory
4. **Dynamic Dialogue System** (`DynamicDialogueSystem.js`) - NPC branching + player-typed responses
5. **Daily Auto-Build Pipeline** (`DailyAutoBuildPipeline.js`) - 24-hour automated content

---

## 🎮 Game Architecture

```
Destiny World (VIVERSE Cloud)
│
├─ Frontend (Three.js / WebGL)
│  ├─ Player Controller
│  ├─ Countdown Timer UI (5-8 min)
│  ├─ Dialogue System UI
│  └─ Map Rendering
│
├─ Backend (Node.js / Express)
│  ├─ GameManager (State)
│  ├─ LocationSystem (7 maps, dynamic)
│  ├─ AlienKillerAI_v2 (Adaptive)
│  ├─ DynamicDialogueSystem
│  └─ DailyAutoBuildPipeline
│
├─ AI Layer (Multi-Source)
│  ├─ Perplexity Sonar (Hard Mode - Real-time decisions)
│  ├─ Pre-trained AI Data (Killer behaviors)
│  └─ Memory & Learning System
│
├─ Data Storage
│  ├─ GitHub (Source control + auto-commits)
│  ├─ Google Drive (Save files, media)
│  ├─ Gmail (Notifications)
│  └─ Linear (Task tracking)
│
└─ Cloud Platform
   └─ VIVERSE (Multiplayer ready, CDN assets)
```

---

## 🔧 Configuration & Setup

### **1. Environment Variables**

Create `.env` file:

```bash
# VIVERSE Cloud
VIVERSE_API_KEY=your_viverse_api_key
VIVERSE_INSTANCE_ID=destiny-world-2026

# Perplexity Sonar (AI for Killer)
PERPLEXITY_API_KEY=your_perplexity_api_key
SOLAR_MODEL=sonar-reasoning

# GitHub Automation
GITHUB_TOKEN=your_github_token
GITHUB_REPO=Mastercyril/AI-Alien-Horror-Game
GITHUB_BRANCH=main

# Google APIs
GOOGLE_DRIVE_API_KEY=your_google_drive_key
GOOGLE_SHEETS_API_KEY=your_sheets_key

# Game Config
GAME_DIFFICULTY=hard  # 'easy', 'normal', 'hard'
AI_SONAR_ENABLED=true
AUTO_BUILD_ENABLED=true
AUTO_BUILD_INTERVAL=86400000  # 24 hours in ms
```

### **2. Installation**

```bash
# Clone repo
git clone https://github.com/Mastercyril/AI-Alien-Horror-Game.git
cd AI-Alien-Horror-Game

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API keys

# Start development server
npm run dev

# Build for VIVERSE
npm run build:viverse
```

---

## 🌍 Location System Details

### **7 Dynamic Locations**

| Location | Type | Hide Spots | Risk | NPCs | Audio Amp |
|----------|------|-----------|------|------|----------|
| Downtown City | Urban | 8 | Medium | High | 1.2x |
| Subway Station | Underground | 12 | High | Medium | 2.0x |
| Residential Area | Suburban | 10 | Low | Medium | 0.8x |
| Abandoned Warehouse | Industrial | 20 | High | Low | 1.5x |
| Forest Outskirts | Natural | 25 | Extreme | Very Low | 0.6x |
| Cave System | Cave | 30 | Extreme | None | 1.8x |
| Apartment Complex | Residential | 40 | High | Low | 0.7x |

### **Hide Spot System**

Each location has unique hide spots:

```javascript
{
  id: 'hidespot_downtown_city_1',
  name: 'Dark Alley',
  type: 'alley',
  effectiveness: 0.7,        // 0-1 scale
  soundProof: false,
  riskOfDiscovery: 0.2,
  healthDamage: 0,
  playerVisible: true
}
```

**Effectiveness by Type:**
- Tree: 0.6 | Alley: 0.7 | Closet: 0.8 | Container: 0.85
- Bathtub: 0.4 | Cave: 0.9 | Train Car: 0.7

---

## 🧠 Alien Killer AI - K'Thaal v2

### **Learning System**

K'Thaal learns from every encounter:

```javascript
const killerAI = new AlienKillerAI_v2({
  hardMode: true,              // Enable Sonar
  sonarEnabled: true,
  learningEnabled: true,
  psychologyEnabled: true,
  sonarAPI: perplexityAPI
});
```

### **Hunting States**

1. **Idle** - Waiting, analyzing past hunts, moving through known areas
2. **Searching** - Awareness > 30%, actively hunting
3. **Chasing** - Direct pursuit (Awareness > 60%)
4. **Learned** - Using memory to predict player behavior
5. **Psychology** - Mind games, taunts, deals

### **Awareness Mechanics**

Killer's awareness increases from:
- Sound: +20 per event (intensity-based)
- Movement: +5 per speed unit
- Fear Detection: +15 per fear level unit
- Blood Scent: +30 when victim found

**Awareness decays by 2% per frame when player hidden**

### **Hard Mode - Perplexity Sonar**

When enabled, killer consults Sonar every frame:

```javascript
const sonarDecision = await consultSonar({
  playerPosition: gameState.player.position,
  playerHealth: gameState.player.health,
  killerAwareness: this.awarenessLevel,
  bloodStored: this.bloodStored,
  pastPatterns: this.memory.getTopPatterns(3),
  currentLocation: gameState.player.currentLocation
});
// Returns: corner, psychology, trap, learn, or custom tactic
```

---

## 💬 Dialogue System

### **NPC Interaction Flow**

```
1. Player encounters NPC
2. NPC gives greeting based on role/context
3. Player chooses:
   - Listen
   - Question
   - Accuse
   - Lie
   - Intimidate
   - Seduce
   - Custom (type response)
4. AI generates NPC reaction (if custom)
5. Consequence applied
6. Next dialogue options generated
7. Trust/Suspicion tracked
```

### **Player Response Types**

```javascript
{
  'listen': { npcAppreciation: +0.1, trust: +0.2 },
  'question': { npcAppreciation: -0.05, trust: -0.05 },
  'accuse': { npcAppreciation: -0.3, violent: true },
  'lie': { npcAppreciation: +0.05, deception: true },
  'intimidate': { npcAppreciation: -0.2, dangerous: true },
  'seduce': { npcAppreciation: +0.15, charisma: true },
  'custom': { AIGenerated: true }
}
```

### **AI NPC Reactions**

When custom response given, Sonar generates reaction:

```
Prompt to Sonar:
- NPC role & knowledge
- Player's morality/reputation
- Recent dialogue history
- Player's response

Response Format:
RESPONSE: [NPC dialogue]
EMOTION: [scared/happy/suspicious]
TRUST_CHANGE: [-1 to 1]
SUSPICION: [0-1]
CONSEQUENCE: [optional]
```

---

## 🤖 Daily Auto-Build Pipeline

### **24-Hour Cycle**

Every 24 hours automatically:

**Generate New Content:**
```
✓ 3 new NPCs (unique personalities, secrets)
✓ 1 new location (with 5-10 hide spots)
✓ 2 new scenarios (missions with branching paths)
✓ Updated killer behavior patterns (from Sonar)
✓ Auto-commit to GitHub with changelog
```

### **NPC Generation Prompt**

```
Generate 3 unique NPCs for horror investigation game:
- Name, role, personality traits
- What they know about the killer
- Secrets they're hiding
- How they react to player

Output: JSON array with unique characters
```

### **Location Generation Prompt**

```
Generate new location for horror game:
- Name, description, type
- 5-10 unique hide spots
- Environmental hazards
- NPCs that would be there
- Evidence/clues that exist there
- Connection to killer's story

Output: JSON object with full location data
```

### **Scenario Generation Prompt**

```
Generate mission scenario for horror investigation:
- Clear objective (find evidence, interview, escape)
- Complications & moral choices
- Success/failure conditions
- Multiple story branches

Output: JSON with complete scenario structure
```

---

## 📊 Game State Management

### **Player State**

```javascript
const playerState = {
  health: 100,
  fear: 0.3,                    // 0-1 scale
  morality: 50,                 // 0-100 scale
  reputation: 0,                // NPC opinion aggregation
  inventory: [...],
  investigationProgress: 0.45,
  evidence: [...],
  encounterCount: 3,
  lastPosition: { x, y, z },
  currentLocation: 'downtown_city',
  soundEmitted: 0.2,            // Last second's noise
  psychologyState: {
    fearLevel: 0.5,
    suspicion: 0.3,
    hope: 0.2
  }
};
```

### **Killer State**

```javascript
const killerState = {
  position: { x, y, z },
  awarenessLevel: 45,           // 0-100
  bloodStored: 35,              // Current reserves
  bloodNeeded: 100,             // Per cycle
  huntingState: 'searching',
  memory: MemorySystem,         // Past encounters
  psychology: PsychologyEngine,  // Fear observations
  failedAttempts: [...],
  adaptation: 0.7,              // Learning factor
  lastPlayerSighting: timestamp
};
```

---

## 🎯 Countdown Mechanics (5-8 Minutes)

### **Confrontation Timer**

When killer contacts player:

```javascript
const timer = new CountdownTimer({
  duration: 300000 + Math.random() * 180000,  // 5-8 min
  onTick: (remaining) => {
    // Update UI, increase pressure
  },
  onExpired: () => {
    // Killer catches player or escapes
    triggerGameOverOrProgression();
  }
});
```

**During Countdown:**
- Player can hide, fight, use psychology
- Sound amplified (killer hunting)
- NPCs may help/hinder
- Killer AI actively hunting
- Morality choices available

---

## 🔗 API Integrations

### **Perplexity Sonar (Hard Mode)**

```javascript
const sonarConfig = {
  endpoint: 'https://api.perplexity.ai/chat/completions',
  model: 'sonar-reasoning',
  maxTokens: 200,
  temperature: 0.7
};

// Uses for:
// - K'Thaal's next hunting tactic
// - NPC reactions to custom responses
// - Scenario generation
// - Killer behavior adaptation
```

### **GitHub Auto-Commit**

```javascript
const commitMessage = `
Auto-build #${buildNumber}:
- Generated 3 new NPCs
- Created 1 new location
- Added 2 scenarios
- Updated killer AI patterns
- Timestamp: ${new Date().toISOString()}
`;
```

### **Google Drive Storage**

```javascript
// Save game states
const saveFile = {
  gameId: 'destiny-world-save-001',
  timestamp: Date.now(),
  playerState: {...},
  killerState: {...},
  locationData: {...},
  dialogueHistory: [...]
};
// Uploaded to Google Drive for backup
```

---

## 🚀 Deployment to VIVERSE

### **Build for Cloud**

```bash
npm run build:viverse
```

### **Deploy Steps**

1. Build production bundle
2. Compress assets
3. Upload to VIVERSE CDN
4. Initialize game instance
5. Load user save data
6. Start synchronization loop

### **Performance Targets**

- 60 FPS (Three.js rendering)
- <100ms network latency
- Sync interval: 100ms
- Asset cache: Enabled
- Compression: GZIP

---

## 📈 Daily Build Statistics

```javascript
const stats = pipeline.getBuildStats();
// {
//   totalBuilds: 7,
//   lastBuildTime: 1673462400000,
//   nextBuildTime: 1673548800000,
//   totalNPCsGenerated: 21,
//   totalLocationsGenerated: 7,
//   totalScenariosGenerated: 14
// }
```

---

## 🔄 Continuous Development Workflow

```
24 Hours in Development Cycle:

8:00 AM - Daily Build Starts
  ├─ Generate NPCs (Perplexity)
  ├─ Generate Location (Perplexity)
  ├─ Generate Scenarios (Perplexity)
  ├─ Update Killer Behavior
  ├─ Commit to GitHub
  └─ Deploy to VIVERSE

8:30 AM - Game Available with New Content

Players Experience:
  ├─ New NPCs to meet
  ├─ New locations to explore
  ├─ New missions to complete
  ├─ Killer with new tactics
  └─ Fresh story branches

8:00 AM Tomorrow - Repeat
```

---

## 🐛 Debugging & Monitoring

### **Enable Debug Logging**

```javascript
const logger = new Logger('ModuleName');
logger.log('Info message');
logger.success('Success message');
logger.warn('Warning message');
logger.error('Error message');
```

### **Monitor Game State**

```javascript
console.table(gameManager.getGameState());
console.table(alienKiller.memory.chaseAttempts);
console.log('Killer awareness:', alienKiller.awarenessLevel);
```

---

## 📝 Next Steps (Phase 3)

- [ ] VIVERSE multiplayer support
- [ ] Advanced physics (Ammo.js integration)
- [ ] Player controller fine-tuning
- [ ] 3D asset importing
- [ ] Sound design & audio cues
- [ ] Save/load system persistence
- [ ] Achievements & leaderboards
- [ ] Cross-platform support

---

## 📞 Support & Questions

**Repository:** [github.com/Mastercyril/AI-Alien-Horror-Game](https://github.com/Mastercyril/AI-Alien-Horror-Game)
**Issues:** File on GitHub
**Author:** AI Development Team - Joseph Dougherty
**Last Updated:** January 8, 2026

---

**Remember:** Every 24 hours, the game world evolves with new NPCs, locations, and challenges. K'Thaal learns. The investigation deepens. Your morality is tested. Can you survive?
