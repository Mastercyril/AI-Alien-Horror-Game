/**
 * DESTINY WORLD - ALIEN KILLER EVOLUTION SYSTEM
 * K'Thaal learns from player interactions and evolves tactics
 * Supports both offline learning and online Perplexity integration
 * 
 * Author: Destiny Dev Team
 * Last Updated: 2025-12-21
 */

class AlienKillerEvolution {
  constructor(config = {}) {
    this.config = {
      offlineMode: true, // Run without API, use preloaded data
      perplexityOnline: false, // Enable for harder difficulty
      learningRate: 0.75,
      ...config
    };

    this.killerProfile = {
      name: 'K\'Thaal',
      species: 'Xexxari',
      age: 10000,
      homeworld: 'Xex-Prime',
      
      // Core stats (0-100)
      intelligence: 92,
      adaptability: 88,
      psychologyResistance: 65,
      emotionalIntelligence: 45,
      aggressiveness: 75,
      
      // Current session stats
      encountersThisSession: 0,
      playersKilled: 0,
      playersEscaped: 0,
      playersJoined: 0,
      
      // Evolution tracking
      evolutionLevel: 1,
      learningEvents: [],
      adaptedBehaviors: [],
      
      // Behavioral patterns
      currentBehavior: 'HUNTING',
      targetSelection: 'RANDOM',
      huntingStrategy: 'METHODICAL',
      psychologicalTactics: [],
      knownPlayerTricks: []
    };

    // Preloaded learning data for offline mode
    this.offlineLearningDatabase = this.initializeOfflineLearning();
  }

  /**
   * Initialize offline learning database with preloaded behavioral patterns
   */
  initializeOfflineLearning() {
    return {
      counterTactics: {
        'psychology_manipulation': {
          description: 'Player tries to negotiate or manipulate killer',
          counters: [
            {
              name: 'Emotional Isolation',
              description: 'Killer becomes emotionally unresponsive to dialogue',
              effectiveness: 0.8,
              implementation: 'Reduce dialogue response quality, increase aggression'
            },
            {
              name: 'Manipulation Recognition',
              description: 'Killer recognizes manipulation patterns',
              effectiveness: 0.75,
              implementation: 'Analyze player dialogue frequency, detect patterns'
            },
            {
              name: 'Role Reversal',
              description: 'Killer manipulates player instead',
              effectiveness: 0.7,
              implementation: 'Offer false cooperation, then ambush'
            }
          ]
        },
        'hiding_in_crowds': {
          description: 'Player hides among NPCs or in crowded areas',
          counters: [
            {
              name: 'Crowd Panic',
              description: 'Killer causes chaos to expose player',
              effectiveness: 0.85,
              implementation: 'Attack NPCs near player, force movement'
            },
            {
              name: 'Pattern Recognition',
              description: 'Killer learns player\'s hiding preferences',
              effectiveness: 0.8,
              implementation: 'Track player patterns, predict hiding spots'
            },
            {
              name: 'Thermal Imaging',
              description: 'Killer uses alien tech to detect through crowds',
              effectiveness: 0.9,
              implementation: 'Highlight player position for killer\'s senses'
            }
          ]
        },
        'trap_setting': {
          description: 'Player sets traps or environmental hazards',
          counters: [
            {
              name: 'Trap Awareness',
              description: 'Killer learns to detect traps',
              effectiveness: 0.75,
              implementation: 'Scan environment, avoid obvious trap locations'
            },
            {
              name: 'Counter Trap',
              description: 'Killer turns trap against player',
              effectiveness: 0.7,
              implementation: 'Trigger trap intentionally, use to separate player'
            },
            {
              name: 'Indirect Approach',
              description: 'Killer approaches from unexpected angle',
              effectiveness: 0.8,
              implementation: 'Use vents, rooftops, underground passages'
            }
          ]
        },
        'direct_combat': {
          description: 'Player attempts physical confrontation',
          counters: [
            {
              name: 'Weapon Mastery',
              description: 'Killer learns human weapon usage',
              effectiveness: 0.85,
              implementation: 'Match player weapon skill, add alien abilities'
            },
            {
              name: 'Strength Advantage',
              description: 'Killer uses overwhelming physical force',
              effectiveness: 0.9,
              implementation: 'Increase damage output, reduce stagger time'
            },
            {
              name: 'Distance Control',
              description: 'Killer maintains optimal combat distance',
              effectiveness: 0.75,
              implementation: 'Dynamic positioning, closing gaps quickly'
            }
          ]
        },
        'exploration_avoidance': {
          description: 'Player explores locations to find items/info',
          counters: [
            {
              name: 'Area Denial',
              description: 'Killer blocks key locations',
              effectiveness: 0.7,
              implementation: 'Camp important items, force player decisions'
            },
            {
              name: 'Knowledge Hoarding',
              description: 'Killer controls information flow',
              effectiveness: 0.65,
              implementation: 'Mislead with fake information, hide true secrets'
            },
            {
              name: 'Speed Hunting',
              description: 'Killer hunts faster than player explores',
              effectiveness: 0.8,
              implementation: 'Reduce search time windows, increase encounter frequency'
            }
          ]
        }
      },

      specialAbilities: [
        {
          name: 'Thermal Vision',
          unlockAt: 3,
          description: 'See heat signatures through walls',
          cooldown: 30,
          range: 50
        },
        {
          name: 'Phase Shift',
          unlockAt: 5,
          description: 'Pass through solid matter briefly',
          cooldown: 60,
          duration: 3
        },
        {
          name: 'Psychic Scream',
          unlockAt: 7,
          description: 'Stun all NPCs and alert player',
          cooldown: 45,
          range: 75
        },
        {
          name: 'Regeneration',
          unlockAt: 8,
          description: 'Heal from injuries autonomously',
          rate: 10,
          perSecond: true
        }
      ],

      psychologicalTactics: [
        {
          name: 'Gaslighting',
          description: 'Convince player they\'re wrong about events',
          difficulty: 'Hard',
          successRate: 0.65
        },
        {
          name: 'Trust Building',
          description: 'Gain player trust to lower defenses',
          difficulty: 'Hard',
          successRate: 0.55
        },
        {
          name: 'Fear Escalation',
          description: 'Increase player fear to impair judgment',
          difficulty: 'Medium',
          successRate: 0.8
        },
        {
          name: 'Temptation',
          description: 'Offer power/knowledge in exchange for betrayal',
          difficulty: 'Medium',
          successRate: 0.7
        },
        {
          name: 'Isolation',
          description: 'Separate player from allies',
          difficulty: 'Easy',
          successRate: 0.9
        }
      ]
    };
  }

  /**
   * Log a learning event - killer learns from player action
   */
  recordPlayerTactic(tacticName, playerSuccess, context = {}) {
    console.log(`\n🧠 KILLER LEARNS: ${tacticName} (${playerSuccess ? 'SUCCESS' : 'FAILED'})`);

    const learningEvent = {
      timestamp: new Date(),
      tactic: tacticName,
      playerSucceeded: playerSuccess,
      context: context,
      eventId: `LEARN-${Date.now()}`
    };

    this.killerProfile.learningEvents.push(learningEvent);
    this.killerProfile.knownPlayerTricks.push(tacticName);

    // Trigger learning response
    if (playerSuccess) {
      this.generateCounterTactic(tacticName);
    }

    return learningEvent;
  }

  /**
   * Generate counter-tactic to player's successful move
   */
  generateCounterTactic(playerTactic) {
    console.log(`🔄 Generating counter-tactic for: ${playerTactic}`);

    const tacticCounters = this.offlineLearningDatabase.counterTactics[playerTactic];
    
    if (!tacticCounters) {
      console.log('   No counters available - generating generic response');
      return;
    }

    // Select best counter based on effectiveness
    const bestCounter = tacticCounters.counters.reduce((prev, current) => 
      (prev.effectiveness > current.effectiveness) ? prev : current
    );

    console.log(`   ✅ Selected counter: ${bestCounter.name}`);
    console.log(`   • Effectiveness: ${(bestCounter.effectiveness * 100).toFixed(0)}%`);
    console.log(`   • Strategy: ${bestCounter.implementation}`);

    const adaptedBehavior = {
      counteringTactic: playerTactic,
      selectedCounter: bestCounter,
      implementedAt: new Date(),
      effectiveness: 0, // Will be updated with encounter results
      evolution: this.killerProfile.evolutionLevel
    };

    this.killerProfile.adaptedBehaviors.push(adaptedBehavior);
    return adaptedBehavior;
  }

  /**
   * Evolve killer with new abilities and behaviors
   */
  evolveKiller() {
    const oldLevel = this.killerProfile.evolutionLevel;
    
    // Evolution triggers every 3 encounters
    if (this.killerProfile.encountersThisSession > 0 && 
        this.killerProfile.encountersThisSession % 3 === 0) {
      
      this.killerProfile.evolutionLevel += 1;
      
      console.log(`\n👻 KILLER EVOLVES: Level ${this.killerProfile.evolutionLevel}`);
      
      // Increase core stats
      this.killerProfile.intelligence += 2;
      this.killerProfile.adaptability += 2;
      this.killerProfile.aggressiveness += 1;
      this.killerProfile.psychologyResistance += 2;
      
      // Unlock new abilities
      this.unlockNewAbilities();
      
      // Increase learning rate
      this.config.learningRate = Math.min(0.95, this.config.learningRate + 0.05);
      
      console.log(`   • Intelligence: +2 (${this.killerProfile.intelligence})`);
      console.log(`   • Adaptability: +2 (${this.killerProfile.adaptability})`);
      console.log(`   • Learning Rate: ${(this.config.learningRate * 100).toFixed(0)}%`);
      
      return true;
    }
    
    return false;
  }

  /**
   * Unlock new abilities based on evolution level
   */
  unlockNewAbilities() {
    const unlockedAbilities = this.offlineLearningDatabase.specialAbilities
      .filter(ability => ability.unlockAt === this.killerProfile.evolutionLevel);
    
    unlockedAbilities.forEach(ability => {
      console.log(`   🔓 UNLOCKED ABILITY: ${ability.name}`);
      console.log(`      ${ability.description}`);
    });
  }

  /**
   * Online mode - call Perplexity for real-time AI reasoning
   */
  async callPerplexityForAdaptation(playerContext) {
    if (!this.config.perplexityOnline) {
      console.log('   Offline mode - using preloaded tactics');
      return null;
    }

    console.log('\n🌊 ONLINE MODE: Consulting Perplexity Sonar for strategy...');

    const adaptationPrompt = `
      You are K'Thaal, an ancient alien serial killer stuck on Earth for 10,000 years.
      
      Current situation:
      - Evolution Level: ${this.killerProfile.evolutionLevel}
      - Intelligence: ${this.killerProfile.intelligence}/100
      - Encounters this session: ${this.killerProfile.encountersThisSession}
      
      Player has used these tactics: ${this.killerProfile.knownPlayerTricks.join(', ')}
      
      Player context:
      ${JSON.stringify(playerContext)}
      
      Generate a new, creative hunting strategy that:
      1. Counters previously successful player tactics
      2. Uses unexpected psychological pressure
      3. Maintains the serial killer's murderous intent
      4. Considers your alien physiology and advanced technology
      5. Shows personality and cunning
      
      Think outside the box. Be creative and disturbing.
      
      Response format:
      STRATEGY_NAME: [name]
      APPROACH: [detailed approach]
      PSYCHOLOGICAL_ANGLE: [how to manipulate player psychologically]
      DANGER_LEVEL: [1-10]
      PLAYER_COUNTER_OPTIONS: [what player can do to escape]
    `;

    // In production, would call Perplexity API
    console.log('   Generating strategy...');
    
    return {
      source: 'perplexity-sonar',
      strategy: 'AI-generated counter-strategy',
      timestamp: new Date()
    };
  }

  /**
   * Track encounter result and update killer behavior
   */
  processEncounterResult(result) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`ENCOUNTER RESULT: ${result.outcome}`);
    console.log(`${'='.repeat(50)}`);

    this.killerProfile.encountersThisSession += 1;

    switch(result.outcome) {
      case 'PLAYER_KILLED':
        this.killerProfile.playersKilled += 1;
        console.log('\u2694️ Killer successfully killed player');
        break;
      case 'PLAYER_ESCAPED':
        this.killerProfile.playersEscaped += 1;
        this.recordPlayerTactic(result.escapeTactic || 'UNKNOWN_ESCAPE', true, result);
        console.log('💨 Player escaped - recording learned tactic');
        break;
      case 'PLAYER_JOINED':
        this.killerProfile.playersJoined += 1;
        console.log('👥 Player joined the killer - dark alliance formed');
        break;
      case 'PLAYER_DEFEATED':
        console.log('Player defeated killer - this should be rare!');
        break;
    }

    // Check if evolution occurs
    if (this.evolveKiller()) {
      console.log('\u2b50 KILLER EVOLUTION TRIGGERED');
    }

    // Generate summary
    console.log(`\nSession Stats:`);
    console.log(`  Total Encounters: ${this.killerProfile.encountersThisSession}`);
    console.log(`  Players Killed: ${this.killerProfile.playersKilled}`);
    console.log(`  Players Escaped: ${this.killerProfile.playersEscaped}`);
    console.log(`  Players Joined: ${this.killerProfile.playersJoined}`);
    console.log(`  Evolution Level: ${this.killerProfile.evolutionLevel}`);
    console.log(`  Known Tactics: ${this.killerProfile.knownPlayerTricks.length}`);
  }

  /**
   * Get killer behavioral profile for game state
   */
  getGameProfile() {
    return {
      name: this.killerProfile.name,
      evolutionLevel: this.killerProfile.evolutionLevel,
      stats: {
        intelligence: this.killerProfile.intelligence,
        adaptability: this.killerProfile.adaptability,
        aggressiveness: this.killerProfile.aggressiveness
      },
      currentBehavior: this.killerProfile.currentBehavior,
      huntsThisSession: this.killerProfile.encountersThisSession,
      knownCounterTactics: this.killerProfile.knownPlayerTricks.length,
      difficultyEstimate: this.calculateDifficulty()
    };
  }

  /**
   * Calculate current difficulty multiplier based on evolution
   */
  calculateDifficulty() {
    const baseDifficulty = 1.0;
    const evolutionBonus = this.killerProfile.evolutionLevel * 0.15;
    const learningBonus = this.killerProfile.adaptedBehaviors.length * 0.05;
    
    return Math.min(3.0, baseDifficulty + evolutionBonus + learningBonus);
  }

  /**
   * Generate a detailed behavior report
   */
  generateBehaviorReport() {
    const report = `
${'='.repeat(60)}
ALIEN KILLER BEHAVIOR ANALYSIS - K'THAAL
${'='.repeat(60)}

Profile:
  Name: ${this.killerProfile.name}
  Species: ${this.killerProfile.species}
  Age: ${this.killerProfile.age.toLocaleString()} years
  Evolution Level: ${this.killerProfile.evolutionLevel}
  
Core Attributes:
  Intelligence: ${this.killerProfile.intelligence}/100
  Adaptability: ${this.killerProfile.adaptability}/100
  Psychology Resistance: ${this.killerProfile.psychologyResistance}/100
  Aggressiveness: ${this.killerProfile.aggressiveness}/100
  
Session Statistics:
  Encounters: ${this.killerProfile.encountersThisSession}
  Players Killed: ${this.killerProfile.playersKilled}
  Players Escaped: ${this.killerProfile.playersEscaped}
  Players Joined: ${this.killerProfile.playersJoined}
  
Learning Progress:
  Adapted Behaviors: ${this.killerProfile.adaptedBehaviors.length}
  Known Player Tactics: ${this.killerProfile.knownPlayerTricks.length}
  Learning Rate: ${(this.config.learningRate * 100).toFixed(0)}%
  
Difficulty Multiplier: ${this.calculateDifficulty().toFixed(2)}x

Known Player Tricks:
${this.killerProfile.knownPlayerTricks.map(t => `  • ${t}`).join('\n')}

Recent Learning Events:
${this.killerProfile.learningEvents.slice(-5).map(e => 
  `  • ${e.timestamp.toLocaleTimeString()}: ${e.tactic} (${e.playerSucceeded ? 'LEARNED' : 'FAILED'})`
).join('\n')}

${'='.repeat(60)}
    `;
    
    return report;
  }
}

module.exports = AlienKillerEvolution;

// ========== DEMO SIMULATION ==========

if (require.main === module) {
  console.log('🚀 ALIEN KILLER EVOLUTION - DEMO SIMULATION\n');
  
  const killer = new AlienKillerEvolution({ offlineMode: true });
  
  // Simulate encounters
  killer.recordPlayerTactic('psychology_manipulation', true, { playerMorality: 25 });
  killer.processEncounterResult({ outcome: 'PLAYER_ESCAPED', escapeTactic: 'psychology_manipulation' });
  
  killer.recordPlayerTactic('hiding_in_crowds', true, { location: 'Downtown' });
  killer.processEncounterResult({ outcome: 'PLAYER_ESCAPED', escapeTactic: 'hiding_in_crowds' });
  
  killer.recordPlayerTactic('trap_setting', false, { trapType: 'environmental' });
  killer.processEncounterResult({ outcome: 'PLAYER_KILLED' });
  
  killer.recordPlayerTactic('direct_combat', true, { weapons: ['metal_pipe'] });
  killer.processEncounterResult({ outcome: 'PLAYER_ESCAPED', escapeTactic: 'direct_combat' });
  
  // Show final report
  console.log(killer.generateBehaviorReport());
  console.log('\nGame Profile:', JSON.stringify(killer.getGameProfile(), null, 2));
}
