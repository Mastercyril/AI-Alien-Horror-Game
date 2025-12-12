# DESTINY: SERIAL KILLER ALIEN
## Technical Architecture Document

**Status**: Phase 1 Core Systems Implementation  
**Last Updated**: December 12, 2025  
**Version**: 1.0.0-alpha

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Core Systems](#core-systems)
3. [Data Flow](#data-flow)
4. [Event Architecture](#event-architecture)
5. [Integration Points](#integration-points)
6. [Performance Targets](#performance-targets)
7. [Future Extensions](#future-extensions)

---

## SYSTEM OVERVIEW

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VIVERSE PLATFORM                         │
├─────────────────────────────────────────────────────────────┤
│                        UI LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  HUD  │  Dialogue UI  │  Inventory  │  Pause Menu   │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    GAME LOGIC LAYER                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Game State Manager (Singleton)              │  │
│  │  • Central authority for all game state             │  │
│  │  • Event dispatch system                            │  │
│  │  • Save/load management                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────────────────┐    │
│  │  AI Killer       │  │   Dialogue Engine            │    │
│  │  System          │  │   • Conversation trees       │    │
│  │  • Countdown     │  │   • Intent parsing           │    │
│  │  • Decision-     │  │   • Sentiment analysis       │    │
│  │    making        │  │   • NPC relationships        │    │
│  │  • Learning      │  │   • Alignment tracking       │    │
│  │  • Emotional     │  │                              │    │
│  │    states        │  └──────────────────────────────┘    │
│  └──────────────────┘                                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Survival Mechanics System                    │  │
│  │  • Hiding (stress management, discovery)            │  │
│  │  • Combat (weapons, attacks, durability)            │  │
│  │  • Psychology (tactics, success rates)              │  │
│  │  • Escape (routes, success conditions)              │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    WORLD LAYER                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Location System   │   NPC System   │   Environment │  │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  GRAPHICS & AUDIO LAYER                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Three.js Scene    │  Audio System  │  Particles   │   │
│  └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                  BACKEND INTEGRATION                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Perplexity Sonar API (Optional hard mode)           │  │
│  │  Save/Load Service                                   │  │
│  │  Analytics & Telemetry                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## CORE SYSTEMS

### 1. AI KILLER SYSTEM

**File**: `src/core/AIKillerSystem.js` (492 lines)

**Responsibilities**:
- Manage 5-8 minute countdown timer
- Make intelligent decisions based on player state
- Learn and adapt from repeated encounters
- Manage emotional states and behavioral shifts
- Trigger government response events
- Handle location mobility

**Key Classes**:
```javascript
class AIKillerSystem {
  // Properties
  state: 'HUNTING' | 'HUNTING_PLAYER' | 'NEGOTIATING' | 'LEARNING' | 'FEEDING'
  threatLevel: 1-10
  hunterInstinct: 0-1
  emotionalState: 'PREDATORY' | 'CURIOUS' | 'SATISFIED' | 'ANGRY'
  
  // Methods
  initiateEngagement(playerData)
  makeDecision(playerData)
  startCountdown()
  escalateHunt(phase)
  playerResponds(responseType, responseText)
  learnFromEncounter(encounterData)
  moveToLocation(location)
  triggerGovernmentResponse(severity)
}
```

**Event Emissions**:
- `TIMER_TICK` - Every second
- `KILLER_ESCALATION` - Hunt phases
- `KILLER_ACTION` - Decision executed
- `KILLER_REACTION` - Response to player
- `GOVERNMENT_RESPONSE` - Authority involvement
- `ENDING_REACHED` - Alien planet arrival

### 2. DIALOGUE ENGINE

**File**: `src/systems/DialogueEngine.js` (458 lines)

**Responsibilities**:
- Manage Skyrim-style dialogue trees
- Parse free-text player responses
- Detect intent and sentiment
- Track alignment shifts
- Maintain NPC relationships
- Handle conversation history

**Key Classes**:
```javascript
class DialogueEngine {
  // Properties
  currentConversation: ConversationState | null
  playerAlignment: 'HERO' | 'NEUTRAL' | 'VILLAIN'
  relationshipScores: Map<npcId, number>
  dialogueNodes: Map<nodeId, DialogueNode>
  responsePatterns: Map<patternName, ResponsePattern>
  
  // Methods
  startConversation(npcId, nodeId)
  selectDialogueChoice(choiceId)
  parsePlayerResponse(playerText)
  analyzeSentiment(text)
  getNPCReaction(npcId, choiceId)
  getAIReactionToText(playerText, parsedResponse)
  endConversation()
}
```

**Intent Detection**:
- `THREAT` - Attack/fight/destroy language
- `FLEE` - Run/escape/hide language
- `NEGOTIATE` - Deal/compromise language
- `SUBMIT` - Join/accept/serve language
- `PSYCHOLOGY` - Challenge/question language
- `QUESTION` - Question mark or interrogative

**Sentiment Analysis**:
- `AGGRESSIVE` - Kill/destroy/attack
- `FEARFUL` - Scared/afraid/help
- `POSITIVE` - Good/yes/thank you
- `NEGATIVE` - Bad/no/hate
- `NEUTRAL` - Neutral tone

### 3. SURVIVAL MECHANICS SYSTEM

**File**: `src/systems/SurvivalMechanics.js` (517 lines)

**Responsibilities**:
- Provide hiding spots and management
- Enable combat with weapons
- Facilitate psychology tactics
- Manage stress and injury
- Enable escape routes
- Track player skills

**Key Classes**:
```javascript
class SurvivalMechanics {
  // Properties
  hideLevel: 0-100
  stressLevel: 0-100
  injuries: 0-3
  skills: { stealth, combat, psychology, endurance }
  weaponArray: Weapon[]
  hidingSpots: HidingSpot[]
  
  // Methods
  searchHidingSpots(location)
  executeHiding(spotId)
  findWeapons(location)
  attackKiller(weaponId)
  analyzeKillerPsychology()
  executePsychologyTactic(tactic, message)
  findEscapeRoute(location)
  attemptEscape(routeId)
}
```

**Hiding Spot Properties**:
- `id`: Unique identifier
- `name`: Display name
- `hidingPower`: 0-100 effectiveness
- `duration`: Max hiding time in seconds
- `discoverChance`: 0-1 discovery probability
- `requirements`: Minimum skill levels

**Psychology Tactics**:
- **Temptation** (35% base success): "Join me"
- **Intimidation** (20% base success): "You're weak"
- **Reasoning** (25% base success): "Let's negotiate"
- **Flattery** (35% base success): "You're powerful"

### 4. GAME STATE MANAGER

**File**: `src/core/GameStateManager.js` (376 lines)

**Responsibilities**:
- Maintain central game state
- Coordinate between systems
- Dispatch events
- Manage save/load
- Track statistics
- Handle settings

**Key Singleton**:
```javascript
class GameStateManager {
  // Global State
  player: PlayerState
  killer: AIKillerSystem | null
  locations: Map<locationId, Location>
  npcs: Map<npcId, NPC>
  
  // Game Flow
  currentGamePhase: 'MENU' | 'TUTORIAL' | 'MAIN_GAME' | 'ENDING'
  isCountdownActive: boolean
  isPaused: boolean
  
  // Methods
  startGame(difficulty)
  pauseGame() / resumeGame()
  updatePlayerState(updates)
  changeLocation(newLocation)
  updateGovernmentAwareness(amount)
  triggerEnding(endingType)
  saveGame(slotNumber)
  loadGame(slotNumber)
}
```

---

## DATA FLOW

### Engagement Sequence

```
1. Player detects or is detected by killer
   ↓
2. AIKillerSystem.initiateEngagement(playerData) called
   ↓
3. Countdown timer starts (5-8 minutes)
   ↓
4. Killer makes initial decision (PURSUE/NEGOTIATE/STALK)
   ↓
5. Event emitted: KILLER_ACTION
   ↓
6. Player has 3 options:
   ├─ HIDE: SurvivalMechanics.executeHiding()
   ├─ COMBAT: SurvivalMechanics.attackKiller()
   ├─ PSYCHOLOGY: SurvivalMechanics.executePsychologyTactic()
   └─ NEGOTIATE: DialogueEngine.startConversation()
   ↓
7. Killer reacts: AIKillerSystem.playerResponds()
   ↓
8. If countdown expires:
   → Player escapes? (Yes: ENGAGEMENT_SUCCESS)
   → Player captured? (Yes: ENDING_TRIGGER)
   → Killer defeated? (Yes: ENDING_TRIGGER)
```

### Save/Load Flow

```
GameStateManager.saveGame(slotNumber)
  ↓
Serialize player, stats, relationships, state
  ↓
JSON.stringify()
  ↓
localStorage.setItem()
  ↓
Emit GAME_SAVED event

---

User clicks Load
  ↓
localStorage.getItem()
  ↓
JSON.parse()
  ↓
Restore all game state
  ↓
Emit GAME_LOADED event
```

---

## EVENT ARCHITECTURE

### Core Event Bus

The GameStateManager implements a publish-subscribe event system:

```javascript
// Register listener
gameState.on('KILLER_ENCOUNTER', (data) => {
  console.log('Killer appeared!', data.killerState);
});

// Emit event
gameState.emit('KILLER_ENCOUNTER', {
  encounterNumber: 1,
  killerState: killer.getStatus()
});
```

### Event List

**Game Lifecycle**:
- `GAME_START` - Game initialized
- `GAME_PAUSE` / `GAME_RESUME` - Pause state changed
- `GAME_RESET` - New playthrough started
- `GAME_ENDING` - Ending triggered

**Combat Events**:
- `KILLER_ENCOUNTER` - Killer detected
- `COUNTDOWN_START` - Timer begins
- `COUNTDOWN_END` - Timer expired
- `ATTACK_HIT` / `ATTACK_MISS` - Combat resolution
- `WEAPON_BROKEN` - Weapon durability exhausted

**Dialogue Events**:
- `DIALOGUE_START` - Conversation begins
- `DIALOGUE_REACTION` - NPC responds
- `ALIGNMENT_CHANGE` - Player shifted alignment
- `NPC_RELATIONSHIP_CHANGE` - Relationship modified

**World Events**:
- `LOCATION_CHANGE` - Player moved
- `GOVERNMENT_AWARENESS_CHANGE` - Wanted level updated
- `CORRUPTION_THRESHOLD_REACHED` - Player >= 50% corrupt
- `PLAYER_DEATH` - Player eliminated

---

## INTEGRATION POINTS

### Perplexity Sonar Backend (Hard Mode)

**Optional Integration**:
```javascript
const killer = new AIKillerSystem({
  learningEnabled: true,
  sonarBackendURL: 'https://api.perplexity.com/killer-ai'
});
```

**API Endpoint**: `/killer-decision`

**Request Body**:
```json
{
  "killerState": "HUNTING_PLAYER",
  "playerBehavior": { ...playerData },
  "memory": [...lastEncounters],
  "threatAssessment": {
    "hunterInstinct": 0.95,
    "psychopathy": 0.95,
    "adaptability": 0.88
  }
}
```

**Response**:
```json
{
  "type": "CHASE" | "PSYCH_ATTACK" | "STALK" | "NEGOTIATE",
  "message": "...",
  "parameters": { ...behavior }
}
```

**Fallback**: Uses strategy-based decisions if API unavailable

### VIVERSE Platform Integration

**Entry Points**:
- VIVERSE SDK initialization in main app
- User authentication
- Avatar system integration
- Multiplayer networking (future)
- Leaderboard submission (future)

---

## PERFORMANCE TARGETS

### Memory
- **Heap Usage**: < 100MB (game state)
- **Bundle Size**: < 500KB (minified core)
- **Asset Cache**: < 2MB (compressed)

### CPU
- **Frame Rate**: 60 FPS desktop, 90 FPS VR
- **Countdown Loop**: 1ms per tick
- **Decision Loop**: 50-100ms per decision
- **Dialogue Parsing**: < 20ms per player input

### Disk
- **Save File**: < 100KB per slot
- **Settings**: < 5KB
- **Total Storage**: < 500KB (3 save slots + settings)

---

## FUTURE EXTENSIONS

### Phase 2: Gameplay Expansion
- NPC behavior trees
- Advanced location systems
- Procedural dialogue generation
- Real-time Sonar AI integration
- Multiplayer support

### Phase 3: Polish & Optimization
- Graphics pipeline optimization
- Audio 3D spatialization
- VR controller support
- Accessibility features
- Performance profiling

### Planned Systems
- **Location System**: Dynamic world with 6+ locations
- **NPC System**: 10+ unique characters
- **Audio System**: Dynamic music and sound effects
- **Graphics System**: Three.js rendering with LOD
- **Input System**: Keyboard, mouse, VR controllers

---

## DEPLOYMENT ARCHITECTURE

### Development
```
Vite Dev Server
└─ http://localhost:5173
   └─ Hot Module Replacement (HMR)
   └─ Source maps for debugging
```

### Production
```
Vite Build
├─ dist/index.html (5KB)
├─ dist/js/app.js (~400KB minified)
├─ dist/js/vendor.js (~100KB)
└─ dist/assets/

↓ Upload to VIVERSE

VIVERSE CDN
├─ Global distribution
├─ Cross-origin policy
├─ Automatic gzip compression
└─ WebXR headers configured
```

---

**Document Version**: 1.0.0  
**Last Review**: December 12, 2025  
**Next Review**: December 15, 2025
