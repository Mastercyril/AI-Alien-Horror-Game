/**
 * GAME STATE MANAGER
 * Central singleton managing all game state
 * Coordinates between AI, Dialogue, Survival, and UI systems
 * 
 * @author AI Development Team
 * @version 1.0.0
 * @date December 12, 2025
 */

class GameStateManager {
  static instance = null;

  constructor() {
    if (GameStateManager.instance) {
      return GameStateManager.instance;
    }

    // PLAYER STATE
    this.player = {
      name: 'Unknown',
      health: 100,
      maxHealth: 100,
      alignment: 'NEUTRAL', // HERO, NEUTRAL, VILLAIN
      corruptionLevel: 0, // 0-100
      skills: {
        stealth: 5,
        combat: 3,
        psychology: 6,
        endurance: 4
      },
      inventory: [],
      location: 'SUBWAY_STATION_A',
      position: { x: 0, y: 0, z: 0 },
      kills: 0,
      joinedKiller: false
    };

    // KILLER STATE
    this.killer = null; // Reference to AIKillerSystem
    this.killerEncounters = 0;
    this.killerDefeated = false;

    // WORLD STATE
    this.locations = new Map();
    this.npcs = new Map();
    this.visitedLocations = new Set();
    this.discoveredSecrets = [];

    // GAMEPLAY STATE
    this.currentGamePhase = 'MENU'; // MENU, TUTORIAL, MAIN_GAME, ENDING
    this.isCountdownActive = false;
    this.countdownTimer = null;
    this.isPaused = false;

    // GOVERNMENT STATE
    this.governmentAwareness = 0; // 0-100
    this.wantedLevel = 0; // 0-5 stars
    this.policePursuing = false;
    this.militaryInvolved = false;

    // DIALOGUE STATE
    this.currentConversation = null;
    this.npcRelationships = new Map();
    this.conversationHistory = [];

    // ENDING STATE
    this.endingReached = false;
    this.endingType = null; // HERO, VILLAIN, NEUTRAL, GOVERNMENT, SYMBIOSIS
    this.playthrough = 1;

    // EVENT SYSTEM
    this.eventListeners = new Map();
    this.eventHistory = [];

    // SAVE DATA
    this.saveSlots = [null, null, null]; // 3 save slots
    this.autoSaveEnabled = true;

    // SETTINGS
    this.settings = {
      difficulty: 'NORMAL', // EASY, NORMAL, HARD, NIGHTMARE
      aiLearning: false,
      soundEnabled: true,
      subtitles: true,
      vr: false,
      graphicsQuality: 'HIGH'
    };

    // STATISTICS
    this.stats = {
      timePlayed: 0,
      encountersCompleted: 0,
      choicesMade: 0,
      itemsFound: 0,
      killsCommitted: 0,
      deathCount: 0,
      escapeCount: 0
    };

    // INITIALIZE
    this.initializeEventSystem();
    this.loadSettings();

    console.log('✅ Game State Manager initialized');
    GameStateManager.instance = this;
  }

  /**
   * SINGLETON GETTER
   */
  static getInstance() {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  /**
   * EVENT SYSTEM
   */
  initializeEventSystem() {
    // Core events to listen for
    const coreEvents = [
      'GAME_START',
      'GAME_PAUSE',
      'GAME_RESUME',
      'GAME_END',
      'KILLER_ENCOUNTER',
      'COUNTDOWN_START',
      'COUNTDOWN_END',
      'PLAYER_HIDE',
      'PLAYER_COMBAT',
      'PLAYER_PSYCHOLOGY',
      'DIALOGUE_START',
      'DIALOGUE_END',
      'GOVERNMENT_RESPONSE',
      'ALIGNMENT_CHANGE',
      'LOCATION_CHANGE',
      'NPC_INTERACTION',
      'PLAYER_DEATH',
      'GAME_ENDING'
    ];

    coreEvents.forEach(event => {
      this.eventListeners.set(event, []);
    });
  }

  /**
   * REGISTER EVENT LISTENER
   */
  on(eventName, callback) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, []);
    }
    this.eventListeners.get(eventName).push(callback);
  }

  /**
   * EMIT EVENT
   */
  emit(eventName, data = {}) {
    console.log(`📢 Event: ${eventName}`, data);

    this.eventHistory.push({
      event: eventName,
      data: data,
      timestamp: Date.now()
    });

    const listeners = this.eventListeners.get(eventName);
    if (listeners) {
      listeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in event listener for ${eventName}:`, error);
        }
      });
    }
  }

  /**
   * START GAME
   */
  startGame(difficulty = 'NORMAL') {
    console.log(`\n🎮 GAME STARTED - Difficulty: ${difficulty}`);

    this.settings.difficulty = difficulty;
    this.currentGamePhase = 'MAIN_GAME';
    this.stats.timePlayed = 0;

    this.emit('GAME_START', {
      difficulty: difficulty,
      playerName: this.player.name
    });
  }

  /**
   * PAUSE GAME
   */
  pauseGame() {
    this.isPaused = true;
    console.log('⏸️  Game paused');
    this.emit('GAME_PAUSE');
  }

  /**
   * RESUME GAME
   */
  resumeGame() {
    this.isPaused = false;
    console.log('▶️  Game resumed');
    this.emit('GAME_RESUME');
  }

  /**
   * UPDATE PLAYER STATE
   */
  updatePlayerState(updates) {
    const oldAlignment = this.player.alignment;
    const oldCorruption = this.player.corruptionLevel;

    Object.assign(this.player, updates);

    // Check for alignment shift
    if (oldAlignment !== this.player.alignment) {
      this.emit('ALIGNMENT_CHANGE', {
        oldAlignment,
        newAlignment: this.player.alignment
      });
    }

    // Check for corruption threshold
    if (this.player.corruptionLevel >= 50 && oldCorruption < 50) {
      console.log('\n⚫ Player corruption reaches critical level!');
      this.emit('CORRUPTION_THRESHOLD_REACHED');
    }
  }

  /**
   * REGISTER KILLER
   */
  registerKiller(killerSystem) {
    this.killer = killerSystem;
    console.log('🔗 Killer system registered with Game State Manager');
  }

  /**
   * ENCOUNTER KILLER
   */
  encounterKiller() {
    this.killerEncounters++;
    this.isCountdownActive = true;

    console.log(`\n⚠️  Killer Encounter #${this.killerEncounters}`);
    this.emit('KILLER_ENCOUNTER', {
      encounterNumber: this.killerEncounters,
      killerState: this.killer?.getStatus()
    });
  }

  /**
   * GOVERNMENT RESPONSE
   */
  updateGovernmentAwareness(amount) {
    this.governmentAwareness = Math.min(100, this.governmentAwareness + amount);

    // Update wanted level
    if (this.governmentAwareness >= 25) this.wantedLevel = 1;
    if (this.governmentAwareness >= 50) this.wantedLevel = 2;
    if (this.governmentAwareness >= 75) this.wantedLevel = 3;
    if (this.governmentAwareness >= 90) {
      this.wantedLevel = 4;
      this.militaryInvolved = true;
    }

    console.log(`🚨 Government Awareness: ${this.governmentAwareness}% (Wanted: ${this.wantedLevel}⭐)`);

    this.emit('GOVERNMENT_AWARENESS_CHANGE', {
      awareness: this.governmentAwareness,
      wantedLevel: this.wantedLevel
    });
  }

  /**
   * CHANGE LOCATION
   */
  changeLocation(newLocation) {
    const oldLocation = this.player.location;
    this.player.location = newLocation;
    this.visitedLocations.add(newLocation);

    console.log(`📍 Location changed: ${oldLocation} → ${newLocation}`);

    this.emit('LOCATION_CHANGE', {
      from: oldLocation,
      to: newLocation,
      visitCount: this.visitedLocations.size
    });
  }

  /**
   * REGISTER NPC
   */
  registerNPC(npcId, npcData) {
    this.npcs.set(npcId, npcData);
    this.npcRelationships.set(npcId, 0); // Neutral relationship
  }

  /**
   * UPDATE NPC RELATIONSHIP
   */
  updateNPCRelationship(npcId, amount) {
    const current = this.npcRelationships.get(npcId) || 0;
    this.npcRelationships.set(npcId, current + amount);

    this.emit('NPC_RELATIONSHIP_CHANGE', {
      npcId,
      amount,
      newValue: this.npcRelationships.get(npcId)
    });
  }

  /**
   * TRIGGER ENDING
   */
  triggerEnding(endingType) {
    this.endingReached = true;
    this.endingType = endingType;
    this.currentGamePhase = 'ENDING';

    console.log(`\n✨ ENDING REACHED: ${endingType}`);

    this.emit('GAME_ENDING', {
      endingType,
      playerAlignment: this.player.alignment,
      corruptionLevel: this.player.corruptionLevel,
      stats: this.stats
    });
  }

  /**
   * SAVE GAME
   */
  saveGame(slotNumber = 0) {
    const saveData = {
      timestamp: Date.now(),
      playthrough: this.playthrough,
      player: this.player,
      stats: this.stats,
      governmentAwareness: this.governmentAwareness,
      killerEncounters: this.killerEncounters,
      visitedLocations: Array.from(this.visitedLocations),
      npcRelationships: Object.fromEntries(this.npcRelationships)
    };

    this.saveSlots[slotNumber] = saveData;

    // Also save to localStorage
    localStorage.setItem(`destiny_save_${slotNumber}`, JSON.stringify(saveData));

    console.log(`💾 Game saved to slot ${slotNumber + 1}`);
    this.emit('GAME_SAVED', { slotNumber, saveData });
  }

  /**
   * LOAD GAME
   */
  loadGame(slotNumber = 0) {
    const saveData = localStorage.getItem(`destiny_save_${slotNumber}`);

    if (!saveData) {
      console.warn(`No save found in slot ${slotNumber + 1}`);
      return false;
    }

    try {
      const data = JSON.parse(saveData);
      this.player = data.player;
      this.stats = data.stats;
      this.governmentAwareness = data.governmentAwareness;
      this.killerEncounters = data.killerEncounters;
      this.visitedLocations = new Set(data.visitedLocations);
      this.npcRelationships = new Map(Object.entries(data.npcRelationships));

      console.log(`📂 Game loaded from slot ${slotNumber + 1}`);
      this.emit('GAME_LOADED', { slotNumber, data });

      return true;
    } catch (error) {
      console.error('Error loading game:', error);
      return false;
    }
  }

  /**
   * DELETE SAVE
   */
  deleteSave(slotNumber = 0) {
    this.saveSlots[slotNumber] = null;
    localStorage.removeItem(`destiny_save_${slotNumber}`);
    console.log(`🗑️  Save slot ${slotNumber + 1} deleted`);
  }

  /**
   * GET SAVE INFO
   */
  getSaveInfo(slotNumber) {
    const saveData = localStorage.getItem(`destiny_save_${slotNumber}`);
    if (!saveData) return null;

    try {
      const data = JSON.parse(saveData);
      return {
        timestamp: new Date(data.timestamp).toLocaleString(),
        playthrough: data.playthrough,
        playerAlignment: data.player.alignment,
        timePlayed: Math.floor(data.stats.timePlayed / 3600) + 'h',
        location: data.player.location,
        corruptionLevel: data.player.corruptionLevel
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * LOAD SETTINGS
   */
  loadSettings() {
    const saved = localStorage.getItem('destiny_settings');
    if (saved) {
      this.settings = JSON.parse(saved);
      console.log('⚙️  Settings loaded');
    }
  }

  /**
   * SAVE SETTINGS
   */
  saveSettings() {
    localStorage.setItem('destiny_settings', JSON.stringify(this.settings));
    console.log('⚙️  Settings saved');
  }

  /**
   * GET FULL STATE
   */
  getFullState() {
    return {
      player: this.player,
      killer: this.killer?.getStatus(),
      world: {
        locations: Array.from(this.visitedLocations),
        npcCount: this.npcs.size
      },
      game: {
        phase: this.currentGamePhase,
        isPaused: this.isPaused,
        endingReached: this.endingReached,
        endingType: this.endingType
      },
      government: {
        awareness: this.governmentAwareness,
        wantedLevel: this.wantedLevel
      },
      stats: this.stats
    };
  }

  /**
   * RESET GAME
   */
  resetGame() {
    console.log('\n🔄 Resetting game state...');

    this.player = {
      name: 'Unknown',
      health: 100,
      maxHealth: 100,
      alignment: 'NEUTRAL',
      corruptionLevel: 0,
      skills: { stealth: 5, combat: 3, psychology: 6, endurance: 4 },
      inventory: [],
      location: 'SUBWAY_STATION_A',
      position: { x: 0, y: 0, z: 0 },
      kills: 0,
      joinedKiller: false
    };

    this.killerEncounters = 0;
    this.killerDefeated = false;
    this.visitedLocations = new Set();
    this.currentGamePhase = 'MENU';
    this.isCountdownActive = false;
    this.isPaused = false;
    this.governmentAwareness = 0;
    this.wantedLevel = 0;
    this.endingReached = false;
    this.endingType = null;

    this.playthrough++;
    this.stats = {
      timePlayed: 0,
      encountersCompleted: 0,
      choicesMade: 0,
      itemsFound: 0,
      killsCommitted: 0,
      deathCount: 0,
      escapeCount: 0
    };

    console.log(`Playthrough: ${this.playthrough}`);
    this.emit('GAME_RESET');
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameStateManager;
}
