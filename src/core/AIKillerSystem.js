/**
 * AI SERIAL KILLER SYSTEM
 * Core behavioral engine for the alien serial killer antagonist
 * Integrates with Perplexity Sonar for advanced NLP and reasoning
 * 
 * @author AI Development Team
 * @version 1.0.0
 * @date December 12, 2025
 */

class AIKillerSystem {
  constructor(config = {}) {
    this.name = 'K-7 (Codename: Reaper)';
    this.originPlanet = 'Void-Sector-9';
    this.yearsOnEarth = 10000;
    this.bloodNeeded = true;
    
    // AI Learning System
    this.learningEnabled = config.learningEnabled || false; // true = harder mode (links to Sonar)
    this.sonarBackendURL = config.sonarBackendURL || null;
    this.threatLevel = 1; // 1-10 scale
    this.playerBehaviorProfile = {};
    this.recentEncounters = [];
    this.strategies = new Map();
    this.memory = [];
    
    // Current State
    this.state = 'HUNTING'; // HUNTING, FEEDING, LEARNING, HUNTING_PLAYER, NEGOTIATING
    this.location = 'SUBWAY_STATION_A';
    this.hunterInstinct = 0.9;
    this.emotionalState = 'PREDATORY'; // Can shift based on interaction
    
    // Countdown Timer
    this.engagementActive = false;
    this.countdownSeconds = 300; // 5 minutes default
    this.countdownInterval = null;
    
    // Behavioral Traits (10,000 years of existence)
    this.psychopathyScore = 0.95;
    this.adaptability = 0.88;
    this.resourcefulness = 0.92;
    this.patience = 0.85;
    this.cruelty = 0.90;
    
    console.log('🔪 AI Killer System initialized...');
  }
  
  /**
   * ENGAGEMENT TRIGGER
   * Starts when player makes contact or killer detects player
   */
  initiateEngagement(playerData) {
    if (this.engagementActive) return; // Already engaged
    
    this.engagementActive = true;
    this.state = 'HUNTING_PLAYER';
    this.countdownSeconds = Math.random() * 180 + 300; // 5-8 min in seconds
    
    console.log(`🚨 ENGAGEMENT INITIATED with player: ${playerData.name}`);
    console.log(`⏱️  Countdown started: ${Math.floor(this.countdownSeconds / 60)}m ${this.countdownSeconds % 60}s`);
    
    // Profile the player
    this.playerBehaviorProfile = {
      firstEncounter: true,
      reactions: [],
      choices: [],
      psychology: playerData.psychology || 'unknown',
      fear_level: 5
    };
    
    // Start countdown
    this.startCountdown();
    
    // Begin AI decision-making
    this.makeDecision(playerData);
    
    return {
      timerActive: true,
      countdownSeconds: this.countdownSeconds,
      killerState: this.state,
      message: `"Found you... let's play a game." *eyes glow with otherworldly hunger*`
    };
  }
  
  /**
   * COUNTDOWN TIMER
   * Player must survive/escape/hide within this window
   */
  startCountdown() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    
    this.countdownInterval = setInterval(() => {
      this.countdownSeconds--;
      
      // Emit tick event for UI
      window.dispatchEvent(new CustomEvent('TIMER_TICK', {
        detail: {
          seconds: this.countdownSeconds,
          minutes: Math.floor(this.countdownSeconds / 60)
        }
      }));
      
      // Critical moments
      if (this.countdownSeconds === 180) {
        this.escalateHunt('aggressive_search');
      }
      if (this.countdownSeconds === 60) {
        this.escalateHunt('closing_in');
      }
      if (this.countdownSeconds === 10) {
        this.escalateHunt('final_moments');
      }
      
      // Time expired
      if (this.countdownSeconds <= 0) {
        this.timeExpired();
      }
    }, 1000);
  }
  
  /**
   * ESCALATE HUNT
   * Killer becomes more dangerous/visible as time runs low
   */
  escalateHunt(phase) {
    console.log(`🔥 Hunt escalated: ${phase}`);
    this.threatLevel = Math.min(this.threatLevel + 2, 10);
    this.hunterInstinct = Math.min(this.hunterInstinct + 0.1, 1.0);
    
    const escalationBehaviors = {
      'aggressive_search': {
        message: 'The shadows seem to breathe... *you hear screams in the distance*',
        visibility: 0.6,
        speed: 1.5
      },
      'closing_in': {
        message: 'You hear footsteps echoing closer... *wet breathing sounds*',
        visibility: 0.8,
        speed: 2.0
      },
      'final_moments': {
        message: '"I CAN SMELL YOUR FEAR, LITTLE PREY. TIME\'S UP."',
        visibility: 1.0,
        speed: 2.5
      }
    };
    
    const behavior = escalationBehaviors[phase];
    if (behavior) {
      window.dispatchEvent(new CustomEvent('KILLER_ESCALATION', {
        detail: behavior
      }));
    }
  }
  
  /**
   * TIME EXPIRED
   * What happens if player doesn't escape
   */
  timeExpired() {
    clearInterval(this.countdownInterval);
    this.engagementActive = false;
    
    // Check player status
    window.dispatchEvent(new CustomEvent('TIMER_EXPIRED', {
      detail: {
        state: this.state,
        message: this.evaluatePlayerFate()
      }
    }));
  }
  
  /**
   * EVALUATE PLAYER FATE
   * Determines outcome based on player actions during countdown
   */
  evaluatePlayerFate() {
    const player = window.gameState?.player;
    if (!player) return 'UNKNOWN_FATE';
    
    const hidingLevel = player.hidingIntensity || 0;
    const distanceFromKiller = player.distanceFromKiller || 0;
    const psychologySuccess = player.psychologyAttemptSuccess || false;
    const attackedKiller = player.attemptedAttack || false;
    
    // Decision tree
    if (hidingLevel > 0.8 && distanceFromKiller > 50) {
      return 'ESCAPED_SAFELY';
    }
    if (psychologySuccess && this.emotionalState !== 'PREDATORY') {
      return 'NEGOTIATION_SUCCESS';
    }
    if (attackedKiller && player.damageDealt > 0) {
      return 'WOUNDED_KILLER_ESCAPED';
    }
    
    // Default: captured
    return 'CAPTURED_OR_KILLED';
  }
  
  /**
   * MAKE DECISION
   * Core AI decision-making - can hook to Perplexity Sonar for harder mode
   */
  async makeDecision(playerData) {
    if (this.learningEnabled && this.sonarBackendURL) {
      // HARD MODE: Use live AI reasoning
      return await this.makeDecisionWithAI(playerData);
    } else {
      // NORMAL MODE: Use precomputed strategies
      return this.makeDecisionWithStrategy(playerData);
    }
  }
  
  /**
   * AI-POWERED DECISION (requires backend)
   */
  async makeDecisionWithAI(playerData) {
    try {
      const response = await fetch(`${this.sonarBackendURL}/killer-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          killerState: this.state,
          playerBehavior: playerData,
          memory: this.memory.slice(-5), // Last 5 interactions
          threatAssessment: {
            hunterInstinct: this.hunterInstinct,
            psychopathy: this.psychopathyScore,
            adaptability: this.adaptability
          }
        })
      });
      
      const decision = await response.json();
      this.executeDecision(decision);
      return decision;
    } catch (error) {
      console.warn('AI backend unavailable, using strategy fallback:', error);
      return this.makeDecisionWithStrategy(playerData);
    }
  }
  
  /**
   * STRATEGY-BASED DECISION (normal/offline mode)
   */
  makeDecisionWithStrategy(playerData) {
    const strategies = [
      {
        name: 'Direct Pursuit',
        likelihood: 0.4,
        action: () => ({
          type: 'CHASE',
          message: '"Your heartbeat gives you away, little creature..."',
          speed: 2.0
        })
      },
      {
        name: 'Psychological Warfare',
        likelihood: 0.3,
        action: () => ({
          type: 'PSYCH_ATTACK',
          message: 'Whispers echo through your mind: "Join me... or die..."',
          effect: 'confusion'
        })
      },
      {
        name: 'Strategic Hunting',
        likelihood: 0.2,
        action: () => ({
          type: 'STALK',
          message: 'The shadows deepen around you...',
          visibility: 0.4
        })
      },
      {
        name: 'Negotiation / Temptation',
        likelihood: 0.1,
        action: () => ({
          type: 'NEGOTIATE',
          message: '"Why fight? Join me instead. Power. Eternal life. All you desire."',
          offerJoin: true
        })
      }
    ];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (let strategy of strategies) {
      cumulative += strategy.likelihood;
      if (random < cumulative) {
        const decision = strategy.action();
        this.executeDecision(decision);
        return decision;
      }
    }
  }
  
  /**
   * EXECUTE DECISION
   */
  executeDecision(decision) {
    console.log(`🧠 Killer Decision: ${decision.type}`, decision);
    
    this.memory.push({
      timestamp: Date.now(),
      decision: decision.type,
      context: decision
    });
    
    // Dispatch event for game to handle
    window.dispatchEvent(new CustomEvent('KILLER_ACTION', {
      detail: decision
    }));
  }
  
  /**
   * PLAYER INTERACTION
   * Player chooses response to killer
   */
  playerResponds(responseType, responseText = '') {
    console.log(`👤 Player Response: ${responseType}`);
    
    const response = {
      type: responseType,
      text: responseText,
      timestamp: Date.now()
    };
    
    this.playerBehaviorProfile.reactions.push(response);
    
    // Update threat assessment
    this.updateThreatAssessment(responseType);
    
    // Killer reacts
    return this.reactToPlayerResponse(responseType, responseText);
  }
  
  /**
   * UPDATE THREAT ASSESSMENT
   * Killer learns from player actions
   */
  updateThreatAssessment(playerAction) {
    const assessments = {
      'HIDE': { threatChange: -15, adaptChange: 5 },
      'ATTACK': { threatChange: 30, adaptChange: 10 },
      'FLEE': { threatChange: 5, adaptChange: 0 },
      'NEGOTIATE': { threatChange: -20, emotionalShift: 'CURIOUS' },
      'JOIN': { threatChange: -50, emotionalShift: 'SATISFIED', stateChange: 'ALLIED' },
      'PSYCHOLOGY': { threatChange: -25, adaptChange: 15 }
    };
    
    const change = assessments[playerAction];
    if (change) {
      this.threatLevel = Math.max(1, Math.min(10, this.threatLevel + change.threatChange));
      if (change.adaptChange) this.adaptability = Math.min(1, this.adaptability + change.adaptChange / 100);
      if (change.emotionalShift) this.emotionalState = change.emotionalShift;
    }
  }
  
  /**
   * KILLER REACTS TO PLAYER
   */
  reactToPlayerResponse(responseType, responseText) {
    const reactions = {
      'HIDE': {
        message: '"Where did you go...? The hunt is more interesting when you resist."',
        result: 'temporary_safety'
      },
      'ATTACK': {
        message: '"YOU DARE?! How delicious... a prey with fangs."',
        result: 'combat_engaged',
        damageToPlayer: 15
      },
      'FLEE': {
        message: '"Run little prey... make this interesting..."',
        result: 'chase_initiated',
        killerSpeed: 1.8
      },
      'NEGOTIATE': {
        message: '"Talking? How... civilized. I might spare you."',
        result: 'negotiation_started',
        psychologyCheck: true
      },
      'JOIN': {
        message: '"YES! FINALLY! We are one now. The hunt begins anew..."',
        result: 'player_corrupted',
        ending: 'JOINED_KILLER'
      },
      'PSYCHOLOGY': {
        message: '"Psychology? How quaint. I\'ve had 10,000 years to master MY mind."',
        result: 'mental_battle',
        psychologyCheck: true,
        difficulty: this.threatLevel
      }
    };
    
    const reaction = reactions[responseType] || reactions['FLEE'];
    
    window.dispatchEvent(new CustomEvent('KILLER_REACTION', {
      detail: reaction
    }));
    
    return reaction;
  }
  
  /**
   * LEARNING SYSTEM
   * Updates killer strategy based on repeated encounters
   */
  learnFromEncounter(encounterData) {
    this.recentEncounters.push(encounterData);
    
    // After 3 encounters, adapt strategy
    if (this.recentEncounters.length >= 3) {
      console.log('🧬 Killer learning from encounters...');
      this.adaptability = Math.min(1, this.adaptability + 0.05);
      this.hunterInstinct = Math.min(1, this.hunterInstinct + 0.03);
      
      // Clear after learning
      this.recentEncounters = [];
    }
  }
  
  /**
   * LOCATION SHIFT
   * Killer can move between subway, homes, streets, etc.
   */
  moveToLocation(location) {
    this.location = location;
    console.log(`📍 Killer moved to: ${location}`);
    
    return {
      location: location,
      atmosphere: this.getLocationAtmosphere(location),
      difficulty: this.calculateLocationDifficulty(location)
    };
  }
  
  /**
   * LOCATION ATMOSPHERE
   */
  getLocationAtmosphere(location) {
    const atmospheres = {
      'SUBWAY_STATION_A': '🚇 Abandoned platform. Wet footsteps echo. Tunnel darkness.',
      'RESIDENTIAL_STREET': '🏘️ Quiet suburb. Flickering streetlights. Front doors locked.',
      'ABANDONED_HOME': '🏚️ Decaying house. Rotting smell. Scratches on walls.',
      'POLICE_STATION': '🚔 Government facility. Paranoid officers. Unexplained murders.',
      'ALIEN_SHIP': '👽 Otherworldly vessel. Bioluminescent walls. Incomprehensible technology.',
      'DOWNTOWN_NIGHTCLUB': '🎭 Crowded venue. Killer blends in. Easy prey.'
    };
    return atmospheres[location] || 'Unknown location...';
  }
  
  /**
   * Calculate location difficulty
   */
  calculateLocationDifficulty(location) {
    const difficulties = {
      'SUBWAY_STATION_A': 6,
      'RESIDENTIAL_STREET': 5,
      'ABANDONED_HOME': 7,
      'POLICE_STATION': 4,
      'ALIEN_SHIP': 10,
      'DOWNTOWN_NIGHTCLUB': 5
    };
    return difficulties[location] || 5;
  }
  
  /**
   * GOVERNMENT DETECTION
   * Police/military response based on killer activities
   */
  triggerGovernmentResponse(severity = 'medium') {
    console.log(`🚨 Government Response Triggered: ${severity}`);
    
    const responses = {
      'low': {
        message: 'Police begin investigating strange disappearances...',
        playerCelebrity: 1,
        hunterDanger: 0.5
      },
      'medium': {
        message: 'FBI arrives. Roadblocks set up. No explanation for deaths.',
        playerCelebrity: 3,
        hunterDanger: 1.5
      },
      'high': {
        message: 'Military lockdown. Martial law. "Something non-human is here."',
        playerCelebrity: 5,
        hunterDanger: 3.0
      }
    };
    
    const response = responses[severity];
    window.dispatchEvent(new CustomEvent('GOVERNMENT_RESPONSE', {
      detail: response
    }));
    
    return response;
  }
  
  /**
   * REACH ALIEN PLANET
   * Escape Earth or be dragged to another dimension
   */
  reachAlienPlanet(playerJoined = false) {
    console.log(`👽 ALIEN PLANET REACHED - Player Joined: ${playerJoined}`);
    
    const outcome = playerJoined ? {
      type: 'CORRUPTED_ENDING',
      message: 'You ascend through the portal. Your humanity fades. You hunger for blood.',
      twist: 'Humanity was always the appetizer. Now the real feast begins...'
    } : {
      type: 'ESCAPED_ENDING',
      message: 'The portal closes behind you. The killer is trapped here. You are safe... or are you?',
      twist: 'But his influence remains... forever etched into your mind...'
    };
    
    window.dispatchEvent(new CustomEvent('ENDING_REACHED', {
      detail: outcome
    }));
    
    return outcome;
  }
  
  // GETTERS
  getStatus() {
    return {
      name: this.name,
      state: this.state,
      threatLevel: this.threatLevel,
      location: this.location,
      countdownActive: this.engagementActive,
      countdownSeconds: this.countdownSeconds,
      learningEnabled: this.learningEnabled,
      emotionalState: this.emotionalState
    };
  }
  
  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
      this.engagementActive = false;
    }
  }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AIKillerSystem;
}
