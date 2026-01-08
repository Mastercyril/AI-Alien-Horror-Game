/**
 * Dynamic Dialogue System for Destiny World
 * Supports NPC conversations with branching paths, player-typed responses
 * Integrates with Perplexity AI for contextual NPC reactions
 * 
 * @author AI Team - Destiny World
 * @version 2.0
 */

class DynamicDialogueSystem {
  constructor(config = {}) {
    this.currentDialogue = null;
    this.dialogueHistory = [];
    this.npcResponses = new Map();
    this.playerResponses = [];
    this.consequenceLog = [];
    this.perplexityAPI = config.perplexityAPI || null;
    this.dialogueTrees = new Map();
    
    this.config = {
      useAIResponses: config.useAIResponses !== false,
      maxDialogueLength: config.maxDialogueLength || 10,
      consequenceTracking: config.consequenceTracking !== false,
      ...config
    };
    
    this.logger = new Logger('DynamicDialogueSystem');
    this.initializeDialogueTrees();
  }

  /**
   * Start conversation with NPC
   */
  startDialogue(npc, gameState) {
    const dialogue = {
      npcId: npc.id,
      npcName: npc.name,
      npcRole: npc.role,
      startTime: Date.now(),
      lines: [],
      choices: [],
      playerResponseTypes: ['listen', 'question', 'accuse', 'lie', 'seduce', 'intimidate', 'custom'],
      context: {
        playerMorality: gameState.player.morality,
        playerReputation: gameState.player.reputation,
        npcKnowledge: npc.knowledge || [],
        gameState: gameState
      },
      chosenPath: null
    };

    // Get initial NPC greeting based on role and context
    const greeting = this.getInitialGreeting(npc);
    dialogue.lines.push({
      speaker: npc.name,
      text: greeting,
      emotion: 'neutral',
      timestamp: Date.now()
    });

    // Generate dialogue choices
    dialogue.choices = this.generateDialogueChoices(npc, dialogue.context);

    this.currentDialogue = dialogue;
    this.logger.log(`Started dialogue with ${npc.name}`);
    
    return dialogue;
  }

  /**
   * Player selects a dialogue option or types custom response
   */
  async selectDialogueOption(optionIndex, customText = null, gameState) {
    if (!this.currentDialogue) return null;

    const dialogue = this.currentDialogue;
    let selectedOption = customText ? { type: 'custom', text: customText } : dialogue.choices[optionIndex];

    if (!selectedOption) {
      this.logger.error('Invalid dialogue option');
      return null;
    }

    // Add player response to dialogue
    dialogue.lines.push({
      speaker: 'You',
      text: selectedOption.text || customText,
      type: selectedOption.type,
      emotion: selectedOption.emotion || 'neutral',
      timestamp: Date.now()
    });

    // Track response for consequences
    this.trackPlayerResponse(selectedOption, dialogue);

    // Get NPC reaction - use AI if custom response
    let npcReaction;
    if (customText || selectedOption.type === 'custom') {
      npcReaction = await this.generateAINPCReaction(customText || selectedOption.text, dialogue, gameState);
    } else {
      npcReaction = this.getPredefinedNPCReaction(selectedOption, dialogue);
    }

    // Add NPC response
    dialogue.lines.push({
      speaker: dialogue.npcName,
      text: npcReaction.text,
      emotion: npcReaction.emotion,
      consequence: npcReaction.consequence,
      timestamp: Date.now(),
      trustChange: npcReaction.trustChange,
      suspicion: npcReaction.suspicion
    });

    // Generate next set of choices or end dialogue
    if (dialogue.lines.length < this.config.maxDialogueLength) {
      dialogue.choices = this.generateFollowUpChoices(selectedOption, npcReaction, dialogue);
    } else {
      dialogue.choices = [{ type: 'end', text: 'End conversation', isEnd: true }];
    }

    // Apply consequences immediately
    if (npcReaction.consequence) {
      this.applyConsequence(npcReaction.consequence, gameState);
    }

    return dialogue;
  }

  /**
   * Generate initial NPC greeting
   */
  getInitialGreeting(npc) {
    const greetings = {
      'police_officer': 'Hey, I\'m with the police. Have you seen anything unusual lately?',
      'witness': 'Oh god, I saw something... I\'m terrified to say it out loud.',
      'journalist': 'I\'m investigating strange deaths in this city. What do you know?',
      'janitor': 'Just cleanin\' up... seen some weird stuff around here.',
      'security_guard': 'No one gets past me without ID.',
      'civilian': 'Can I help you?',
      'doctor': 'What brings you to the hospital?',
      'investigator': 'I\'m on K\'Thaal\'s case. Anything you can tell me?',
      'shopkeeper': 'Welcome to my shop. Looking for something?',
      'homeless_person': 'You got a dollar? Or... you\'re one of them hunting things...'
    };

    return greetings[npc.role] || 'Hey there.';
  }

  /**
   * Generate dialogue choices for player
   */
  generateDialogueChoices(npc, context) {
    const choices = [
      {
        type: 'listen',
        text: 'Listen to what they have to say',
        emotion: 'curious',
        npcAppreciation: 0.1
      },
      {
        type: 'question',
        text: 'Ask them about the murders',
        emotion: 'serious',
        npcAppreciation: -0.05
      },
      {
        type: 'accuse',
        text: 'Accuse them of involvement',
        emotion: 'aggressive',
        npcAppreciation: -0.3,
        riskOfViolence: true
      },
      {
        type: 'lie',
        text: 'Lie and gain their trust',
        emotion: 'deceptive',
        npcAppreciation: 0.05,
        deceptionCheck: true
      },
      {
        type: 'intimidate',
        text: 'Intimidate them for information',
        emotion: 'threatening',
        npcAppreciation: -0.2,
        physicalDanger: true
      },
      {
        type: 'seduce',
        text: 'Use charm to persuade them',
        emotion: 'charming',
        npcAppreciation: 0.15,
        charismaCheck: true
      },
      {
        type: 'custom',
        text: 'Type custom response...',
        emotion: 'neutral',
        isCustom: true
      }
    ];

    // Filter choices based on NPC role and player stats
    return choices.filter(choice => {
      if (choice.type === 'seduce' && npc.role === 'police_officer') return true;
      if (choice.type === 'intimidate' && npc.canBeLied) return true;
      return !choice.role || choice.role === npc.role;
    });
  }

  /**
   * Generate AI NPC reaction to custom player response
   */
  async generateAINPCReaction(playerText, dialogue, gameState) {
    if (!this.config.useAIResponses || !this.perplexityAPI) {
      return this.getDefaultReaction(playerText);
    }

    try {
      const prompt = `
You are ${dialogue.npcName}, a ${dialogue.npcRole} in a horror game about a serial killer.
Player just said: "${playerText}"

Context:
- NPC knowledge: ${JSON.stringify(dialogue.context.npcKnowledge)}
- Player morality: ${dialogue.context.playerMorality}
- Dialogue history: ${dialogue.lines.slice(-3).map(l => l.speaker + ': ' + l.text).join('\n')}

Respond as this NPC in character. Your response should be natural, 1-2 sentences max.
Then indicate: Emotion (scared/happy/suspicious/confused), trust change (-1 to 1), suspicion level (0-1).

Format:
RESPONSE: [Your dialogue]
EMOTION: [emotion]
TRUST_CHANGE: [number]
SUSPICION: [number]
`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityAPI.apiKey}`
        },
        body: JSON.stringify({
          model: 'sonar',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 100
        })
      });

      if (response.ok) {
        const result = await response.json();
        return this.parseAIReaction(result.choices[0].message.content);
      }
    } catch (error) {
      this.logger.warn('AI reaction generation failed', error);
    }

    return this.getDefaultReaction(playerText);
  }

  /**
   * Parse AI-generated reaction
   */
  parseAIReaction(content) {
    const lines = content.split('\n');
    const reaction = {
      text: '',
      emotion: 'neutral',
      trustChange: 0,
      suspicion: 0.5
    };

    lines.forEach(line => {
      if (line.startsWith('RESPONSE:')) {
        reaction.text = line.replace('RESPONSE:', '').trim();
      } else if (line.startsWith('EMOTION:')) {
        reaction.emotion = line.replace('EMOTION:', '').trim();
      } else if (line.startsWith('TRUST_CHANGE:')) {
        reaction.trustChange = parseFloat(line.replace('TRUST_CHANGE:', '').trim());
      } else if (line.startsWith('SUSPICION:')) {
        reaction.suspicion = parseFloat(line.replace('SUSPICION:', '').trim());
      }
    });

    return reaction;
  }

  /**
   * Get predefined NPC reaction
   */
  getPredefinedNPCReaction(option, dialogue) {
    const reactions = {
      'listen': {
        text: 'Good, I\'ll tell you everything I know...',
        emotion: 'relieved',
        trustChange: 0.2,
        suspicion: -0.1
      },
      'question': {
        text: 'What do you want to know? I\'m scared...',
        emotion: 'nervous',
        trustChange: -0.05,
        suspicion: 0.1
      },
      'accuse': {
        text: 'ME?! No way, I\'m just as terrified as everyone else!',
        emotion: 'defensive',
        trustChange: -0.3,
        suspicion: 0.3,
        consequence: { type: 'npc_refuses_to_help' }
      },
      'lie': {
        text: 'Oh, I believe you. That makes sense...',
        emotion: 'trusting',
        trustChange: 0.1,
        suspicion: -0.05
      },
      'intimidate': {
        text: '...Fine, fine. Just don\'t hurt me.',
        emotion: 'frightened',
        trustChange: -0.4,
        suspicion: 0.5
      },
      'seduce': {
        text: 'Oh... well, that\'s... I\'ll help you.',
        emotion: 'flustered',
        trustChange: 0.25,
        suspicion: -0.2
      }
    };

    return reactions[option.type] || { text: 'Hmm...', emotion: 'confused', trustChange: 0, suspicion: 0.5 };
  }

  /**
   * Track player response for consequences
   */
  trackPlayerResponse(option, dialogue) {
    this.playerResponses.push({
      npcId: dialogue.npcId,
      npcRole: dialogue.npcName,
      responseType: option.type,
      timestamp: Date.now(),
      gameTime: Date.now()
    });
  }

  /**
   * Apply consequence from dialogue choice
   */
  applyConsequence(consequence, gameState) {
    this.consequenceLog.push({
      type: consequence.type,
      timestamp: Date.now(),
      affectedArea: consequence.affectedArea || 'general'
    });

    this.logger.log(`Consequence applied: ${consequence.type}`);
  }

  /**
   * Generate follow-up dialogue choices
   */
  generateFollowUpChoices(lastOption, npcReaction, dialogue) {
    // Simple follow-up options
    if (npcReaction.trustChange > 0.1) {
      return [
        { type: 'ask_for_help', text: 'Will you help me?' },
        { type: 'ask_for_location', text: 'Where did you last see the killer?' },
        { type: 'ask_for_evidence', text: 'Do you have any evidence?' },
        { type: 'end', text: 'Thank you. I have to go.', isEnd: true }
      ];
    } else if (npcReaction.suspicion > 0.6) {
      return [
        { type: 'leave', text: 'I\'m leaving.', isEnd: true },
        { type: 'negotiate', text: 'Wait, let me explain...' }
      ];
    } else {
      return [
        { type: 'continue', text: 'Tell me more...' },
        { type: 'end', text: 'I have to go.', isEnd: true }
      ];
    }
  }

  /**
   * Get default reaction if AI unavailable
   */
  getDefaultReaction(playerText) {
    return {
      text: '...That\'s... interesting.',
      emotion: 'confused',
      trustChange: 0,
      suspicion: 0.5
    };
  }

  /**
   * Initialize dialogue trees
   */
  initializeDialogueTrees() {
    // Can be expanded with branching dialogue JSON structures
    this.logger.success('Dialogue system initialized');
  }

  /**
   * End current dialogue
   */
  endDialogue() {
    if (this.currentDialogue) {
      this.dialogueHistory.push(this.currentDialogue);
      this.logger.log(`Dialogue ended with ${this.currentDialogue.npcName}`);
    }
    this.currentDialogue = null;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DynamicDialogueSystem };
}
