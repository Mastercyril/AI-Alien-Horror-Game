# DESTINY: SERIAL KILLER ALIEN GAME
## Development Roadmap | December 12 - February 20, 2025

**Project Status**: 🔴 ACTIVE DEVELOPMENT - Phase 1 Commencing

---

## 📋 PROJECT OVERVIEW

**Core Concept**: Survival horror game on VIVERSE featuring an alien serial killer (K-7) stranded on Earth for 10,000 years. Player must survive 5-8 minute encounters using hiding, combat, psychology, or negotiation. Multiple endings based on moral choices.

**Target Platform**: VIVERSE WebXR (Cross-platform: VR, Desktop, Mobile, Browser)

**Technology Stack**:
- Frontend: React 18 + TypeScript
- 3D Engine: Three.js
- AI Backend: Perplexity Sonar (optional hard mode)
- Build: Vite 5.0
- Version Control: GitHub (Mastercyril/AI-Alien-Horror-Game)

---

## 🎯 PHASE 1: CORE MECHANICS (Dec 12 - Dec 24, 2025)

### Week 1: Foundation Systems

#### Day 1-2 (Dec 12-13): AI Killer Foundation ✅
- [x] AIKillerSystem class created
- [x] Countdown timer (5-8 min) implemented
- [x] State machine (HUNTING → HUNTING_PLAYER → NEGOTIATING)
- [x] Decision-making framework (strategy-based + AI-ready)
- [x] Learning system hooks for Sonar backend

**Deliverable**: `src/core/AIKillerSystem.js` (492 lines)

#### Day 3 (Dec 13): Dialogue System
- [x] Skyrim-style dialogue trees
- [x] Free-text response parsing
- [x] Intent detection (THREAT, FLEE, NEGOTIATE, SUBMIT, PSYCHOLOGY, QUESTION)
- [x] Sentiment analysis
- [x] Alignment tracking (HERO → NEUTRAL → VILLAIN)

**Deliverable**: `src/systems/DialogueEngine.js` (458 lines)

#### Day 4 (Dec 13): Survival Mechanics
- [x] Hiding system (6+ location-specific spots)
- [x] Combat system (weapon finding & attack resolution)
- [x] Psychology system (4 tactics with success rates)
- [x] Escape routes
- [x] Stress & injury tracking

**Deliverable**: `src/systems/SurvivalMechanics.js` (517 lines)

#### Day 5-6 (Dec 14-15): Game State Manager
- [ ] Global game state singleton
- [ ] Save/load system
- [ ] Event dispatch system
- [ ] Player profile (skills, alignment, corruption level)
- [ ] World state (NPC relationships, location discovery)

**Tasks**:
```
Create src/core/GameStateManager.js
Implement state persistence to localStorage
Create event-driven architecture for systems
Document game state schema
```

#### Day 7 (Dec 16): UI/HUD System
- [ ] Countdown timer display
- [ ] Stress level indicator
- [ ] Inventory UI
- [ ] Dialogue UI
- [ ] Location UI
- [ ] Player alignment display

**Tasks**:
```
Create src/ui/HUD.js
Create src/ui/DialogueUI.js
Create src/ui/InventoryUI.js
Style with dark horror theme
Responsive design for mobile/VR
```

### Week 2: Environment & Integration

#### Day 8-9 (Dec 17-18): Location System
- [ ] Subway Station A (first encounter location)
- [ ] Residential Home (mid-game)
- [ ] Police Station (authority interaction)
- [ ] Downtown Street (civilian encounters)
- [ ] Abandoned Warehouse (optional)
- [ ] Alien Ship (final location)

**Tasks**:
```
Create src/world/Locations.js
Define hiding spots per location
Define NPCs per location  
Define loot/weapons per location
Define atmosphere/music per location
```

#### Day 10-11 (Dec 19-20): NPC System
- [ ] Detective Martinez (antagonist to killer)
- [ ] Police Officers (multiple)
- [ ] Civilians (subway, homes)
- [ ] Government Agent (mysterious)
- [ ] Victims (environmental storytelling)

**Tasks**:
```
Create src/characters/NPCs.js
Implement NPC behavior trees
Create NPC relationships to player
Implement NPC dialogue loops
```

#### Day 12 (Dec 21): Three.js Integration
- [ ] Set up Three.js scene
- [ ] Basic player character model/camera
- [ ] Subway environment mesh
- [ ] Lighting and atmosphere
- [ ] Audio system initialization

**Tasks**:
```
Create src/graphics/SceneManager.js
Create src/graphics/ModelLoader.js
Load GLTF models for locations
Implement ambient audio system
```

#### Day 13-14 (Dec 22-23): Integration Testing
- [ ] Test AI killer countdown mechanics
- [ ] Test dialogue parsing with free-text
- [ ] Test survival mechanics workflows
- [ ] Test state persistence
- [ ] Console logging & debugging

**Tasks**:
```
Create test scenarios
Debug event dispatch chain
Optimize performance
Fix edge cases
```

#### Day 15 (Dec 24): Holiday Checkpoint
- [x] Core systems COMPLETE
- [ ] Documentation updated
- [ ] GitHub issues created for Phase 2
- [ ] Performance baseline established

---

## 🎮 PHASE 2: GAMEPLAY LOOPS (Dec 25 - Jan 20, 2026)

### Week 1: First Encounter (Dec 25-31)

#### Day 16-17 (Dec 25-26): Tutorial Scenario
- [ ] Player wakes up in subway
- [ ] AI killer enters scene
- [ ] Tutorial dialogue sequence
- [ ] First choice (hide/fight/flee)
- [ ] Countdown timer activation
- [ ] Learn survival mechanics

#### Day 18-20 (Dec 27-29): Hiding Mechanics Full Implementation
- [ ] Hiding spot discovery
- [ ] Stress system during hiding
- [ ] Killer searching behavior
- [ ] Discovery consequences
- [ ] Safe escape from hiding

#### Day 21 (Dec 30-31): Combat Mechanics Full Implementation
- [ ] Weapon findingWorkflow
- [ ] Attack mechanics & rolling
- [ ] Damage system
- [ ] Weapon durability
- [ ] Killer AI dodge/react

### Week 2: Dialogue & Psychology (Jan 1-7)

#### Day 22-24 (Jan 1-3): Free-Text Response Full Chain
- [ ] Input field for player text
- [ ] Intent parsing refinement
- [ ] Killer response generation
- [ ] Alignment shift consequences
- [ ] Multiple playthroughs tracking

#### Day 25-27 (Jan 4-6): Psychology Mechanics
- [ ] Psychology check resolution
- [ ] Killer mood shifts
- [ ] Corruption progression
- [ ] Mental battle system
- [ ] Sanity effects on gameplay

#### Day 28 (Jan 7): Negotiation Path
- [ ] Killer negotiation dialogue tree
- [ ] Join killer option introduction
- [ ] Consequences of agreement
- [ ] Allied gameplay path begins

### Week 3: Multiple Locations (Jan 8-14)

#### Day 29-30 (Jan 8-9): Location Transitions
- [ ] Travel system between locations
- [ ] Loading states
- [ ] Location-specific NPCs
- [ ] Environmental storytelling

#### Day 31-32 (Jan 10-11): Police Investigation
- [ ] Government awareness system
- [ ] Roadblocks and checkpoints
- [ ] Detective questioning
- [ ] Wanted level mechanics

#### Day 33-34 (Jan 12-13): Civilian Encounters
- [ ] Witness interactions
- [ ] Help vs. hide decision
- [ ] Reputation system
- [ ] NPC relationships

#### Day 35 (Jan 14): Testing & Balancing
- [ ] Difficulty tuning
- [ ] Pacing adjustments
- [ ] Bug fixes

### Week 4: Endings Preview (Jan 15-20)

#### Day 36-38 (Jan 15-17): Good Ending Path
- [ ] Defeat killer
- [ ] Escape planet
- [ ] Government capture but alive
- [ ] Truth revealed

#### Day 39-40 (Jan 18-19): Evil Ending Path
- [ ] Join killer
- [ ] Hunt with killer
- [ ] Government pursuits
- [ ] Alien planet arrival
- [ ] Corruption complete

#### Day 41 (Jan 20): Multiple Endings Testing
- [ ] Test all ending branches
- [ ] Verify save states
- [ ] Performance checkpoint

---

## 🚀 PHASE 3: POLISH & AI INTEGRATION (Jan 21 - Feb 20, 2026)

### Week 1: Perplexity Sonar Integration (Jan 21-27)

#### Day 42-44: Backend API Setup
- [ ] Create Perplexity Sonar backend hooks
- [ ] Implement killer decision API endpoint
- [ ] Connection authentication
- [ ] Error handling & fallbacks

#### Day 45-47: Advanced AI Mode
- [ ] Enable AI learning from player behavior
- [ ] Implement dynamic strategy adjustment
- [ ] Real-time response generation
- [ ] Conversation depth enhancement

### Week 2: Content Expansion (Jan 28 - Feb 3)

#### Day 48-50: Extended Dialogue Trees
- [ ] 50+ unique dialogue branches
- [ ] NPC relationship consequences
- [ ] Easter eggs and hidden dialogue
- [ ] Skill-based dialogue checks

#### Day 51-53: Environmental Storytelling
- [ ] Hidden documents in locations
- [ ] Audio logs from previous victims
- [ ] Killer's origin story hints
- [ ] World lore expansion

### Week 3: Optimization & VR (Feb 4-10)

#### Day 54-56: Performance Optimization
- [ ] Reduce bundle size
- [ ] Optimize Three.js rendering
- [ ] Mobile performance pass
- [ ] VR controller support

#### Day 57-59: VR Features
- [ ] VR hand presence
- [ ] Weapon grabbing in VR
- [ ] Teleport vs. smooth movement
- [ ] Comfort settings

### Week 4: Final Polish (Feb 11-20)

#### Day 60-62: Audio/Music
- [ ] Ambient soundtrack
- [ ] Tension music escalation
- [ ] Sound effects library
- [ ] Voice acting (if possible)

#### Day 63-64: UI Polish
- [ ] Menu systems
- [ ] Settings panel
- [ ] Credits/about
- [ ] Accessibility options

#### Day 65: Gold Master
- [ ] Final testing pass
- [ ] Performance baseline (60 FPS)
- [ ] Bug fixes
- [ ] Ready for VIVERSE upload

---

## 🔧 TECHNICAL ARCHITECTURE

### File Structure (Target)
```
Destiny-Serial-Killer-Game/
├── src/
│   ├── core/
│   │   ├── AIKillerSystem.js          ✅
│   │   ├── GameStateManager.js        📋
│   │   └── EventSystem.js             📋
│   ├── systems/
│   │   ├── DialogueEngine.js          ✅
│   │   ├── SurvivalMechanics.js       ✅
│   │   ├── LocationSystem.js          📋
│   │   └── NPCSystem.js               📋
│   ├── graphics/
│   │   ├── SceneManager.js            📋
│   │   └── ModelLoader.js             📋
│   ├── ui/
│   │   ├── HUD.js                     📋
│   │   ├── DialogueUI.js              📋
│   │   └── InventoryUI.js             📋
│   ├── world/
│   │   ├── Locations.js               📋
│   │   └── Environment.js             📋
│   ├── characters/
│   │   ├── NPCs.js                    📋
│   │   └── Player.js                  📋
│   ├── utils/
│   │   ├── storage.js                 📋
│   │   └── helpers.js                 📋
│   ├── api/
│   │   └── PerplexitySonarAPI.js      📋
│   └── index.js                        📋
├── tests/
│   ├── unit/                          📋
│   └── integration/                   📋
├── assets/
│   ├── models/                        📋
│   ├── audio/                         📋
│   └── textures/                      📋
├── package.json                        📋
├── vite.config.js                      📋
├── index.html                          📋
├── style.css                           📋
└── DEVELOPMENT_ROADMAP.md              ✅
```

### Key Systems Architecture

```
┌─────────────────────────────────────────┐
│ VIVERSE Platform Layer                  │
├─────────────────────────────────────────┤
│ Dialogue UI   Inventory UI   HUD        │
├─────────────────────────────────────────┤
│ Dialogue Engine  Survival Mechanics     │
│ AI Killer System  Location System       │
│ NPC System       Event System           │
├─────────────────────────────────────────┤
│ Game State Manager                      │
│ (Persistent, Central Authority)         │
├─────────────────────────────────────────┤
│ Scene Manager (Three.js)                │
│ Audio System   Graphics Renderer        │
├─────────────────────────────────────────┤
│ Backend API (Perplexity Sonar)         │
│ Save/Load System    Event Dispatch      │
└─────────────────────────────────────────┘
```

---

## 🎭 GAME FLOW DIAGRAM

```
Game Start
    ↓
Tutorial Scene (Subway Introduction)
    ↓
AI Killer Encounter
    ↓
5-8 Minute Countdown
    ├→ HIDE Route
    │  ├→ Discovered → Combat/Escape
    │  └→ Safe → Escape Location
    │
    ├→ COMBAT Route  
    │  ├→ Win → Wounded Killer Flees
    │  └→ Lose → Captured/Dead
    │
    ├→ PSYCHOLOGY Route
    │  ├→ Success → Distraction/Escape Window
    │  └→ Failure → Killer Enraged
    │
    └→ NEGOTIATE Route
       ├→ Join Killer → VILLAIN PATH BEGINS
       ├→ Compromise → Temporary Truce
       └→ Reject → Combat Engagement

Continued Gameplay
    ├→ Multiple Locations
    ├→ NPC Interactions
    ├→ Government Detection
    ├→ Killer Learning & Adaptation
    └→ Alignment/Corruption Progression

Ending
    ├→ GOOD: Defeat Killer, Escape
    ├→ NEUTRAL: Hide Forever, Uneasy Truce
    ├→ EVIL: Join Killer, Alien Planet
    └→ GOVERNMENT: Captured, Studied
```

---

## 📊 SUCCESS METRICS

### Performance Targets
- **Frame Rate**: 60 FPS (target 90 FPS for VR)
- **Load Time**: < 3 seconds
- **Bundle Size**: < 5MB (total), < 1MB (core game)
- **Memory**: < 500MB active usage

### Gameplay Targets
- **Playthrough Time**: 30-60 minutes per run
- **Replayability**: 5+ unique paths based on choices
- **Dialogue Branches**: 100+ unique conversations
- **Endings**: 5+ distinct endings

### Quality Targets
- **Bug Count at Launch**: < 5 critical, < 15 minor
- **FPS Stability**: 95% frames delivered on-time
- **Platform Coverage**: Chrome, Firefox, Safari, VR headsets

---

## 🔄 DAILY COMMIT STRUCTURE

Every day at 11:59 PM (EST), automated commit with:

```
[DESTINY] Day X - [System Name]
- Added: [Feature/File]
- Modified: [Changes]
- Fixed: [Bugs]
- Status: [Completion %]
```

Example:
```
[DESTINY] Day 1 - AI Killer Foundation
- Added: AIKillerSystem.js (492 lines)
- Added: Countdown timer system
- Added: Decision-making framework
- Status: 33% Phase 1 Complete
```

---

## 🚦 PHASE STATUS LEGEND

- ✅ COMPLETE
- 📋 PLANNED  
- 🔄 IN PROGRESS
- ⏸️ BLOCKED
- ❌ CANCELLED

---

## 🤝 COLLABORATION NOTES

**Team**: AI Development Collective
- Multiple AIs coordinate on daily tasks
- Code review via GitHub PRs
- Shared state through version control
- Daily standup via commit messages

**GitHub Workflow**:
1. Create feature branch: `feature/day-X-system-name`
2. Implement with full documentation
3. Commit with detailed message
4. Merge to main (auto-deploy to test environment)
5. Log progress in this roadmap

---

## 📞 COMMUNICATION CHANNELS

- **GitHub Issues**: Feature requests, bugs, discussions
- **Commits**: Daily progress updates
- **This Document**: Master roadmap source of truth

---

**Last Updated**: December 12, 2025, 1:37 PM EST
**Next Review**: December 15, 2025
**Project Lead**: Mastercyril (Joseph Cyril Dougherty IV)
