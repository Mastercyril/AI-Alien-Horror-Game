/**
 * SURVIVAL MECHANICS SYSTEM
 * Core gameplay loops: Hide, Attack, Psychology, Escape
 * 
 * @author AI Development Team
 * @version 1.0.0  
 * @date December 12, 2025
 */

class SurvivalMechanics {
  constructor(player, killer) {
    this.player = player;
    this.killer = killer;
    
    // Player State
    this.hideLevel = 0; // 0-100 (100 = fully hidden)
    this.stressLevel = 50; // 0-100 (impacts visibility/sound)
    this.injuries = 0; // 0-3
    this.inventory = [];
    this.skills = {
      stealth: 5,
      combat: 3,
      psychology: 6,
      endurance: 4
    };
    
    // Environment State
    this.currentLocation = 'SUBWAY';
    this.hidingSpots = [];
    this.breakableObjects = [];
    this.weaponArray = [];
    
    // Counters
    this.timeHidden = 0;
    this.timeVisible = 0;
    this.numberOfCombatActions = 0;
    
    console.log('💃 Survival Mechanics initialized');
  }
  
  /**
   * ==================== HIDING SYSTEM ====================
   */
  
  /**
   * SEARCH FOR HIDING SPOTS
   * Player looks for places to hide
   */
  searchHidingSpots(location) {
    const spotsByLocation = {
      'SUBWAY': [
        {
          id: 'subway_bench',
          name: 'Under the Platform Bench',
          hidingPower: 40,
          description: 'Cramped, but the killer might not check here.',
          duration: 120,
          discoverChance: 0.3,
          requirements: { stealth: 2 }
        },
        {
          id: 'subway_locker',
          name: 'Maintenance Locker',
          hidingPower: 70,
          description: 'Tight, but very hard to find.',
          duration: 300,
          discoverChance: 0.15,
          requirements: { stealth: 4 }
        },
        {
          id: 'subway_ventshaft',
          name: 'Ventilation Shaft',
          hidingPower: 85,
          description: 'Silent. Deadly. Perfect.',
          duration: 400,
          discoverChance: 0.05,
          requirements: { stealth: 7, endurance: 5 }
        }
      ],
      'RESIDENTIAL_HOME': [
        {
          id: 'closet',
          name: 'Bedroom Closet',
          hidingPower: 50,
          description: 'Dark and cramped.',
          duration: 180,
          discoverChance: 0.25,
          requirements: { stealth: 3 }
        },
        {
          id: 'basement',
          name: 'Basement Corner',
          hidingPower: 60,
          description: 'Cold and damp, but isolated.',
          duration: 250,
          discoverChance: 0.2,
          requirements: { stealth: 4 }
        },
        {
          id: 'attic',
          name: 'Attic Crawlspace',
          hidingPower: 75,
          description: 'Cramped. Few people ever check here.',
          duration: 350,
          discoverChance: 0.1,
          requirements: { stealth: 5, endurance: 6 }
        }
      ],
      'STREET': [
        {
          id: 'dumpster',
          name: 'Dumpster Behind Building',
          hidingPower: 45,
          description: 'Disgusting, but effective.',
          duration: 200,
          discoverChance: 0.35,
          requirements: { stealth: 2 }
        },
        {
          id: 'car_trunk',
          name: 'Abandoned Car Trunk',
          hidingPower: 65,
          description: 'Suffocating, but well-hidden.',
          duration: 280,
          discoverChance: 0.15,
          requirements: { stealth: 4 }
        },
        {
          id: 'parking_garage',
          name: 'Parking Garage Level -3',
          hidingPower: 55,
          description: 'Maze-like. Easy to get lost... or lose your pursuer.',
          duration: 300,
          discoverChance: 0.25,
          requirements: { stealth: 3 }
        }
      ]
    };
    
    const spots = spotsByLocation[location] || spotsByLocation['STREET'];
    
    console.log(`\n🔍 Searching for hiding spots in ${location}...`);
    console.log('Available hiding spots:');
    spots.forEach((spot, index) => {
      console.log(`${index + 1}. ${spot.name} (Power: ${spot.hidingPower})`);
    });
    
    window.dispatchEvent(new CustomEvent('HIDING_SPOTS_FOUND', {
      detail: { spots, location }
    }));
    
    this.hidingSpots = spots;
    return spots;
  }
  
  /**
   * EXECUTE HIDING
   */
  executeHiding(spotId) {
    const spot = this.hidingSpots.find(s => s.id === spotId);
    if (!spot) {
      console.error('Hiding spot not found');
      return { success: false };
    }
    
    // Check skill requirements
    for (const [skill, required] of Object.entries(spot.requirements)) {
      if (this.skills[skill] < required) {
        console.log(`\n❌ Insufficient ${skill} skill (have ${this.skills[skill]}, need ${required})`);
        return {
          success: false,
          reason: `Not skilled enough. Need ${skill}: ${required}`
        };
      }
    }
    
    console.log(`\n🚫 HIDING: ${spot.name}`);
    console.log(`Description: ${spot.description}`);
    
    this.hideLevel = spot.hidingPower;
    this.stressLevel = Math.max(0, this.stressLevel - 10); // Calm down
    this.timeHidden = 0;
    
    // Stress increases over time if hiding
    const stressInterval = setInterval(() => {
      this.timeHidden++;
      if (this.timeHidden % 10 === 0) {
        this.stressLevel = Math.min(100, this.stressLevel + 1);
      }
      
      // Random killer discovery check
      if (Math.random() < (spot.discoverChance / spot.duration)) {
        clearInterval(stressInterval);
        this.discoverHiding();
      }
    }, 1000);
    
    window.dispatchEvent(new CustomEvent('PLAYER_HIDING', {
      detail: {
        spot: spot.name,
        hidingPower: this.hideLevel,
        duration: spot.duration,
        stressLevel: this.stressLevel
      }
    }));
    
    return {
      success: true,
      spot: spot.name,
      duration: spot.duration
    };
  }
  
  /**
   * HIDING DISCOVERED
   */
  discoverHiding() {
    console.log('\n🚨 HIDING SPOT DISCOVERED!');
    this.hideLevel = 0;
    this.stressLevel = 100;
    
    window.dispatchEvent(new CustomEvent('HIDING_DISCOVERED', {
      detail: {
        killerNearby: true,
        stressLevel: this.stressLevel
      }
    }));
  }
  
  /**
   * ==================== COMBAT SYSTEM ====================
   */
  
  /**
   * FIND WEAPONS
   */
  findWeapons(location) {
    const weaponsByLocation = {
      'RESIDENTIAL_HOME': [
        {
          id: 'kitchen_knife',
          name: 'Kitchen Knife',
          damage: 15,
          accuracy: 0.7,
          breakChance: 0.1,
          description: 'Sharp but fragile.'
        },
        {
          id: 'baseball_bat',
          name: 'Baseball Bat',
          damage: 25,
          accuracy: 0.8,
          breakChance: 0.05,
          description: 'Heavy. Solid. Makes a great sound.'
        },
        {
          id: 'gun_pistol',
          name: '.38 Revolver',
          damage: 50,
          accuracy: 0.6,
          breakChance: 0.02,
          ammo: 4,
          description: 'Real firepower. Limited ammo.'
        }
      ],
      'STREET': [
        {
          id: 'metal_pipe',
          name: 'Metal Pipe',
          damage: 20,
          accuracy: 0.75,
          breakChance: 0.08,
          description: 'Rusted but effective.'
        },
        {
          id: 'broken_glass',
          name: 'Broken Glass Shard',
          damage: 10,
          accuracy: 0.5,
          breakChance: 0.3,
          description: 'Fragile. Could injure you.'
        }
      ],
      'SUBWAY': [
        {
          id: 'subway_tool',
          name: 'Maintenance Tool',
          damage: 18,
          accuracy: 0.7,
          breakChance: 0.15,
          description: 'Heavy and awkward.'
        }
      ]
    };
    
    const weapons = weaponsByLocation[location] || [];
    
    console.log(`\n🗡️ Searching for weapons in ${location}...`);
    console.log('Available weapons:');
    weapons.forEach((w, i) => {
      console.log(`${i + 1}. ${w.name} (Damage: ${w.damage})`);
    });
    
    window.dispatchEvent(new CustomEvent('WEAPONS_FOUND', {
      detail: { weapons, location }
    }));
    
    this.weaponArray = weapons;
    return weapons;
  }
  
  /**
   * ATTACK KILLER
   */
  attackKiller(weaponId) {
    const weapon = this.weaponArray.find(w => w.id === weaponId);
    if (!weapon) return { success: false, reason: 'Weapon not found' };
    
    console.log(`\n💥 ATTACKING with ${weapon.name}!`);
    
    // Roll for hit
    const hitRoll = Math.random();
    const hit = hitRoll < weapon.accuracy;
    
    if (hit) {
      const criticalHit = hitRoll < weapon.accuracy * 0.3;
      const actualDamage = criticalHit ? weapon.damage * 1.5 : weapon.damage;
      
      console.log(`✅ HIT! Damage: ${actualDamage}`);
      
      this.numberOfCombatActions++;
      
      // Weapon might break
      if (Math.random() < weapon.breakChance) {
        console.log(`🚫 ${weapon.name} broke!`);
        this.weaponArray = this.weaponArray.filter(w => w.id !== weaponId);
        
        window.dispatchEvent(new CustomEvent('WEAPON_BROKEN', {
          detail: { weapon: weapon.name }
        }));
      }
      
      window.dispatchEvent(new CustomEvent('ATTACK_HIT', {
        detail: {
          weapon: weapon.name,
          damage: actualDamage,
          critical: criticalHit
        }
      }));
      
      return {
        success: true,
        hit: true,
        damage: actualDamage,
        critical: criticalHit
      };
    } else {
      console.log(`❌ MISS!`);
      this.stressLevel = Math.min(100, this.stressLevel + 15);
      
      window.dispatchEvent(new CustomEvent('ATTACK_MISS', {
        detail: { weapon: weapon.name }
      }));
      
      return {
        success: true,
        hit: false,
        stressIncrease: 15
      };
    }
  }
  
  /**
   * ==================== PSYCHOLOGY SYSTEM ====================
   */
  
  /**
   * PSYCHOLOGICAL ANALYSIS
   * Understand what might work against the killer
   */
  analyzeKillerPsychology() {
    console.log('\n🧠 Analyzing killer psychology...');
    
    const analysis = {
      killerType: 'PREDATORY_ALIEN',
      motivations: [
        'Sustenance through human blood',
        'Extended existence on Earth',
        'Thrill of the hunt',
        'Possible loneliness after 10,000 years'
      ],
      vulnerabilities: [
        'Appeals to connection/companionship',
        'Challenges to predatory dominance',
        'Intellectual engagement (rare prey)',
        'Possibility of corruption/alliance'
      ],
      strengths: [
        'Superhuman physical abilities',
        'Ancient intelligence and cunning',
        'Lack of human moral constraints',
        'Knowledge of multiple kill methods'
      ],
      tactics: {
        temptation: {
          description: 'Offer to join him, learn from him, serve him',
          successChance: 0.3,
          riskLevel: 'VERY_HIGH',
          consequence: 'Possible corruption into villain ending'
        },
        intimidation: {
          description: 'Challenge his status, question his power',
          successChance: 0.2,
          riskLevel: 'EXTREME',
          consequence: 'Immediate combat engagement'
        },
        reasoning: {
          description: 'Appeal to logic, negotiate terms, propose mutual benefit',
          successChance: 0.25,
          riskLevel: 'HIGH',
          consequence: 'Time to escape or hide'
        },
        flattery: {
          description: 'Praise his intelligence, age, power, immortality',
          successChance: 0.35,
          riskLevel: 'MEDIUM',
          consequence: 'Distraction, possible escape window'
        }
      }
    };
    
    window.dispatchEvent(new CustomEvent('PSYCHOLOGY_ANALYSIS', {
      detail: analysis
    }));
    
    return analysis;
  }
  
  /**
   * EXECUTE PSYCHOLOGY CHECK
   */
  executePsychologyTactic(tactic, message) {
    console.log(`\n🧠 Psychology Tactic: ${tactic}`);
    console.log(`Message: "${message}"`);
    
    const tactics = {
      'temptation': {
        baseChance: 0.3,
        skillBonus: this.skills.psychology * 0.03,
        stressBonus: (100 - this.stressLevel) * 0.001
      },
      'intimidation': {
        baseChance: 0.2,
        skillBonus: this.skills.psychology * 0.02,
        stressBonus: 0 // Stress hurts here
      },
      'reasoning': {
        baseChance: 0.25,
        skillBonus: this.skills.psychology * 0.04,
        stressBonus: (100 - this.stressLevel) * 0.0015
      },
      'flattery': {
        baseChance: 0.35,
        skillBonus: this.skills.psychology * 0.035,
        stressBonus: (100 - this.stressLevel) * 0.001
      }
    };
    
    const tacticData = tactics[tactic];
    if (!tacticData) return { success: false, reason: 'Unknown tactic' };
    
    const successChance = tacticData.baseChance + tacticData.skillBonus + tacticData.stressBonus;
    const roll = Math.random();
    const success = roll < Math.min(0.95, successChance); // Cap at 95%
    
    if (success) {
      console.log(`✅ Psychology check SUCCEEDED!`);
      this.skills.psychology += 0.1; // Gain skill
      
      window.dispatchEvent(new CustomEvent('PSYCHOLOGY_SUCCESS', {
        detail: {
          tactic: tactic,
          result: 'Killer distracted or intrigued',
          escapeWindow: 30 // seconds
        }
      }));
      
      return { success: true, escapeWindow: 30 };
    } else {
      console.log(`❌ Psychology check FAILED!`);
      this.stressLevel = Math.min(100, this.stressLevel + 20);
      
      window.dispatchEvent(new CustomEvent('PSYCHOLOGY_FAILED', {
        detail: { tactic: tactic }
      }));
      
      return {
        success: false,
        stressIncrease: 20,
        consequence: 'Killer is ANGRY'
      };
    }
  }
  
  /**
   * ==================== ESCAPE SYSTEM ====================
   */
  
  /**
   * FIND ESCAPE ROUTE
   */
  findEscapeRoute(location) {
    const escapesByLocation = {
      'SUBWAY': [
        {
          id: 'tunnel_escape',
          name: 'Subway Tunnel',
          difficulty: 5,
          distance: 500,
          time: 120,
          dangerRating: 'MEDIUM',
          description: 'Dark tunnels lead to the next station. Risky but possible.'
        },
        {
          id: 'surface_stairs',
          name: 'Surface Stairwell',
          difficulty: 3,
          distance: 100,
          time: 45,
          dangerRating: 'HIGH',
          description: 'Straight up to the street. Fast but exposed.'
        }
      ],
      'RESIDENTIAL_HOME': [
        {
          id: 'back_door',
          name: 'Back Door',
          difficulty: 1,
          distance: 50,
          time: 20,
          dangerRating: 'MEDIUM',
          description: 'Simple escape through rear exit.'
        },
        {
          id: 'window_jump',
          name: 'Second Story Window',
          difficulty: 6,
          distance: 20,
          time: 10,
          dangerRating: 'VERY_HIGH',
          description: 'Risky jump. Could injure yourself.'
        }
      ]
    };
    
    const routes = escapesByLocation[location] || [];
    
    console.log(`\n💨 Searching for escape routes...`);
    routes.forEach((r, i) => {
      console.log(`${i + 1}. ${r.name} (Difficulty: ${r.difficulty}, Time: ${r.time}s)`);
    });
    
    return routes;
  }
  
  /**
   * ATTEMPT ESCAPE
   */
  attemptEscape(routeId) {
    const routes = this.findEscapeRoute(this.currentLocation);
    const route = routes.find(r => r.id === routeId);
    
    if (!route) return { success: false };
    
    console.log(`\n💨 ATTEMPTING ESCAPE via ${route.name}`);
    
    // Success roll based on skill and stress
    const baseChance = 0.5 + (this.skills.endurance / 10) - (this.stressLevel / 100);
    const roll = Math.random();
    const success = roll < baseChance;
    
    if (success) {
      console.log(`✅ ESCAPED!`);
      
      window.dispatchEvent(new CustomEvent('ESCAPE_SUCCESS', {
        detail: { route: route.name }
      }));
      
      return {
        success: true,
        route: route.name,
        safeDistance: 500
      };
    } else {
      console.log(`❌ Escape failed! Killer is catching up...`);
      
      window.dispatchEvent(new CustomEvent('ESCAPE_FAILED', {
        detail: { route: route.name }
      }));
      
      return {
        success: false,
        caughtBy: 'Killer is closing in!'
      };
    }
  }
  
  /**
   * ==================== STATUS METHODS ====================
   */
  
  /**
   * GET PLAYER STATUS
   */
  getPlayerStatus() {
    return {
      stressLevel: this.stressLevel,
      hideLevel: this.hideLevel,
      injuries: this.injuries,
      skills: this.skills,
      inventory: this.inventory,
      weapons: this.weaponArray,
      timeHidden: this.timeHidden,
      combatActions: this.numberOfCombatActions
    };
  }
  
  /**
   * TAKE DAMAGE
   */
  takeDamage(damageAmount) {
    this.injuries += Math.ceil(damageAmount / 20);
    console.log(`💔 Player took ${damageAmount} damage! Injuries: ${this.injuries}/3`);
    
    if (this.injuries >= 3) {
      console.log('\n☠️ PLAYER IS DEAD');
      window.dispatchEvent(new CustomEvent('PLAYER_DEAD'));
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SurvivalMechanics;
}
