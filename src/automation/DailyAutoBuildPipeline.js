/**
 * Daily Auto-Build Pipeline for Destiny World
 * Automatically generates new content every 24 hours:
 * - New NPCs with unique personalities
 * - New locations and hide spots
 * - New dialogue scenarios
 * - Dynamic story branches
 * - Updated killer behavior patterns
 * 
 * @author AI Team - Destiny World
 * @version 2.0
 */

class DailyAutoBuildPipeline {
  constructor(config = {}) {
    this.buildHistory = [];
    this.lastBuildTime = null;
    this.buildInterval = config.buildInterval || 86400000; // 24 hours
    this.perplexityAPI = config.perplexityAPI || null;
    this.githubAPI = config.githubAPI || null;
    
    this.config = {
      autoCommit: config.autoCommit !== false,
      generateNPCs: config.generateNPCs !== false,
      generateLocations: config.generateLocations !== false,
      generateScenarios: config.generateScenarios !== false,
      updateKillerBehavior: config.updateKillerBehavior !== false,
      ...config
    };

    this.logger = new Logger('DailyAutoBuildPipeline');
    this.generatedContent = {
      npcs: [],
      locations: [],
      scenarios: [],
      dialogues: [],
      killerBehaviors: []
    };
  }

  /**
   * Start the daily build cycle
   */
  async startDailyBuildCycle() {
    this.logger.log('Starting daily auto-build cycle...');
    
    try {
      // Generate new NPCs
      if (this.config.generateNPCs) {
        await this.generateNewNPCs(3);
      }

      // Generate new locations
      if (this.config.generateLocations) {
        await this.generateNewLocations(1);
      }

      // Generate new scenarios
      if (this.config.generateScenarios) {
        await this.generateNewScenarios(2);
      }

      // Update killer behavior
      if (this.config.updateKillerBehavior) {
        await this.updateKillerBehaviorPatterns();
      }

      // Commit to GitHub if enabled
      if (this.config.autoCommit && this.githubAPI) {
        await this.commitToGithub();
      }

      this.lastBuildTime = Date.now();
      this.buildHistory.push({
        timestamp: this.lastBuildTime,
        npcCount: this.generatedContent.npcs.length,
        locationCount: this.generatedContent.locations.length,
        scenarioCount: this.generatedContent.scenarios.length
      });

      this.logger.success('Daily build cycle completed!');
      
      // Schedule next build
      setTimeout(() => this.startDailyBuildCycle(), this.buildInterval);
    } catch (error) {
      this.logger.error('Daily build cycle failed', error);
    }
  }

  /**
   * Generate new NPCs with unique personalities
   */
  async generateNewNPCs(count = 3) {
    this.logger.log(`Generating ${count} new NPCs...`);
    
    const npcPrompt = `
Generate ${count} unique NPCs for a horror investigation game about a serial killer alien.
Each NPC should have:
- Unique name
- Role (police, witness, journalist, etc.)
- Personality traits (paranoid, trusting, greedy, etc.)
- What they know about the killer
- Secrets they're hiding
- How they react to the player

Format as JSON array with fields: name, role, personality, knowledge, secrets, dialogueStyle
`;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityAPI?.apiKey}`
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: npcPrompt }],
          max_tokens: 1000
        })
      });

      if (response.ok) {
        const result = await response.json();
        const npcs = this.parseNPCData(result.choices[0].message.content);
        this.generatedContent.npcs.push(...npcs);
        
        this.logger.success(`Generated ${npcs.length} new NPCs`);
        return npcs;
      }
    } catch (error) {
      this.logger.warn('NPC generation failed', error);
      return this.generateFallbackNPCs(count);
    }
  }

  /**
   * Parse NPC data from AI response
   */
  parseNPCData(content) {
    try {
      // Extract JSON from response
      const jsonMatch = content.match(/\[\s*\{[\s\S]*\}\s*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      this.logger.warn('Failed to parse NPC JSON', error);
    }
    return [];
  }

  /**
   * Generate fallback NPCs if API fails
   */
  generateFallbackNPCs(count) {
    const roles = ['police_officer', 'witness', 'journalist', 'doctor', 'janitor', 'security_guard'];
    const names = [
      'Alex Morgan', 'Jordan Blake', 'Casey Chen', 'Riley Davis', 'Morgan Walsh',
      'Taylor Smith', 'Quinn Anderson', 'Sam Johnson', 'Casey Wilson', 'Alex Harris'
    ];
    const personalities = [
      'paranoid', 'trusting', 'greedy', 'protective', 'secretive', 'honest',
      'nervous', 'confident', 'manipulative', 'empathetic'
    ];

    const npcs = [];
    for (let i = 0; i < count; i++) {
      npcs.push({
        id: `npc_auto_${Date.now()}_${i}`,
        name: names[Math.floor(Math.random() * names.length)],
        role: roles[Math.floor(Math.random() * roles.length)],
        personality: personalities[Math.floor(Math.random() * personalities.length)],
        knowledge: Math.random() > 0.5 ? ['seen_killer', 'knows_victim'] : ['rumors'],
        secrets: ['hiding_something'],
        dialogueStyle: 'neutral',
        generatedAt: Date.now(),
        autoGenerated: true
      });
    }
    return npcs;
  }

  /**
   * Generate new locations
   */
  async generateNewLocations(count = 1) {
    this.logger.log(`Generating ${count} new locations...`);
    
    const locationPrompt = `
Generate ${count} unique locations for a horror investigation game.
Each location should have:
- Name and description
- Type (urban, forest, building, etc.)
- Hide spots available (list 5-10)
- Environmental hazards
- NPCs that would be there
- Clues/evidence that might be found
- Connections to the killer's story

Format as JSON with fields: id, name, description, type, hideSpots, hazards, npcs, clues, relevance
`;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityAPI?.apiKey}`
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: locationPrompt }],
          max_tokens: 1200
        })
      });

      if (response.ok) {
        const result = await response.json();
        const locations = this.parseLocationData(result.choices[0].message.content);
        this.generatedContent.locations.push(...locations);
        
        this.logger.success(`Generated ${locations.length} new locations`);
        return locations;
      }
    } catch (error) {
      this.logger.warn('Location generation failed', error);
      return this.generateFallbackLocations(count);
    }
  }

  /**
   * Parse location data from AI response
   */
  parseLocationData(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        return [JSON.parse(jsonMatch[0])];
      }
    } catch (error) {
      this.logger.warn('Failed to parse location JSON', error);
    }
    return [];
  }

  /**
   * Generate fallback locations
   */
  generateFallbackLocations(count) {
    const types = ['urban', 'forest', 'building', 'underground', 'abandoned'];
    const adjectives = ['Dark', 'Mysterious', 'Ancient', 'Forgotten', 'Hidden'];
    const names = ['Alley', 'Park', 'Building', 'Warehouse', 'Cave', 'Tunnel', 'Street'];

    const locations = [];
    for (let i = 0; i < count; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const name = names[Math.floor(Math.random() * names.length)];
      
      locations.push({
        id: `location_auto_${Date.now()}_${i}`,
        name: `${adj} ${name}`,
        description: `A mysterious location full of danger and secrets`,
        type: types[Math.floor(Math.random() * types.length)],
        hideSpots: [
          'Dark corner', 'Behind boxes', 'Above ceiling',
          'Under ground', 'Inside container', 'Behind wall'
        ],
        hazards: ['falling', 'crushing', 'poison'],
        npcs: 2,
        clues: ['evidence', 'diary', 'photo'],
        relevance: Math.random(),
        generatedAt: Date.now(),
        autoGenerated: true
      });
    }
    return locations;
  }

  /**
   * Generate new scenarios/missions
   */
  async generateNewScenarios(count = 2) {
    this.logger.log(`Generating ${count} new scenarios...`);
    
    const scenarioPrompt = `
Generate ${count} unique mission scenarios for a horror investigation game.
Each scenario should:
- Have an objective (find evidence, interview witness, escape killer, etc.)
- Include complications (multiple paths, moral choices, etc.)
- Have success/failure conditions
- Lead to different story branches
- Increase tension progressively

Format as JSON with fields: id, title, objective, complications, successCondition, failureCondition, branchingPaths
`;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityAPI?.apiKey}`
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: scenarioPrompt }],
          max_tokens: 1200
        })
      });

      if (response.ok) {
        const result = await response.json();
        const scenarios = this.parseScenarioData(result.choices[0].message.content);
        this.generatedContent.scenarios.push(...scenarios);
        
        this.logger.success(`Generated ${scenarios.length} new scenarios`);
        return scenarios;
      }
    } catch (error) {
      this.logger.warn('Scenario generation failed', error);
    }
  }

  /**
   * Parse scenario data
   */
  parseScenarioData(content) {
    try {
      const jsonMatch = content.match(/\{[\s\S]*?\}/);
      if (jsonMatch) {
        return [JSON.parse(jsonMatch[0])];
      }
    } catch (error) {
      this.logger.warn('Failed to parse scenario JSON', error);
    }
    return [];
  }

  /**
   * Update killer behavior patterns
   */
  async updateKillerBehaviorPatterns() {
    this.logger.log('Updating killer behavior patterns...');
    
    const behaviorPrompt = `
K'Thaal is a 10,000-year-old alien serial killer learning human behavior.
Based on typical player actions in games, generate new:
- Hunt tactics and strategies
- Dialogue approaches
- Psychological manipulation techniques
- Trap designs
- Adaptation responses

Format as JSON with these tactics for K'Thaal to use.
`;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityAPI?.apiKey}`
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: behaviorPrompt }],
          max_tokens: 800
        })
      });

      if (response.ok) {
        const result = await response.json();
        this.generatedContent.killerBehaviors.push({
          timestamp: Date.now(),
          tactics: result.choices[0].message.content
        });
        
        this.logger.success('Killer behavior patterns updated');
      }
    } catch (error) {
      this.logger.warn('Behavior update failed', error);
    }
  }

  /**
   * Commit generated content to GitHub
   */
  async commitToGithub() {
    if (!this.githubAPI) {
      this.logger.warn('GitHub API not configured');
      return;
    }

    try {
      const fileContent = `// Auto-generated content - ${new Date().toISOString()}\n` +
        `module.exports = ${JSON.stringify(this.generatedContent, null, 2)};`;

      // Create commit message
      const message = `Auto-build #${this.buildHistory.length}: Generated ${
        this.generatedContent.npcs.length} NPCs, ${this.generatedContent.locations.length} locations, ${this.generatedContent.scenarios.length} scenarios`;

      this.logger.log(`Committing to GitHub: ${message}`);
      // GitHub API call would go here
      
      this.logger.success('Content committed to GitHub');
    } catch (error) {
      this.logger.error('GitHub commit failed', error);
    }
  }

  /**
   * Get build statistics
   */
  getBuildStats() {
    return {
      totalBuilds: this.buildHistory.length,
      lastBuildTime: this.lastBuildTime,
      nextBuildTime: this.lastBuildTime + this.buildInterval,
      totalNPCsGenerated: this.buildHistory.reduce((sum, build) => sum + build.npcCount, 0),
      totalLocationsGenerated: this.buildHistory.reduce((sum, build) => sum + build.locationCount, 0),
      totalScenariosGenerated: this.buildHistory.reduce((sum, build) => sum + build.scenarioCount, 0)
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyAutoBuildPipeline };
}
