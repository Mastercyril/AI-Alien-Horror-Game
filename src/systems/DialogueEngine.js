/**
 * DIALOGUE ENGINE
 * Skyrim-like conversation system with dynamic NPC dialogue trees
 * Supports free-text player responses parsed for intent
 * 
 * @author AI Development Team  
 * @version 1.0.0
 * @date December 12, 2025
 */

class DialogueEngine {
  constructor(config = {}) {
    this.currentConversation = null;
    this.conversationHistory = [];
    this.relationshipScores = {}; // NPC rapport
    this.killerMood = 'PREDATORY';
    this.playerAlignment = 'NEUTRAL'; // HERO, NEUTRAL, VILLAIN
    this.dialogueNodes = new Map();
    this.responsePatterns = new Map();
    
    this.initializeDialogueTrees();
    this.initializeResponsePatterns();
    
    console.log('📝 Dialogue Engine initialized');
  }
  
  /**
   * INITIALIZE DIALOGUE TREES
   * Static dialogue trees for NPCs and killer
   */
  initializeDialogueTrees() {
    // SERIAL KILLER DIALOGUE TREES
    this.dialogueNodes.set('killer_first_encounter', {
      speaker: 'K-7 (Reaper)',
      lines: [
        "A new face... how delightful. I am K-7. Your blood smells... *interesting*.",
        "I've been hunting on this wretched world for 10,000 years. You could be... different.",
        "Tell me, little prey... do you fear death? Or do you fear something worse?"
      ],
      choices: [
        {
          text: "I don't know who you are, but stay away from me!",
          id: 'hostile',
          alignment: 'HERO'
        },
        {
          text: "What do you want from me?",
          id: 'curious',
          alignment: 'NEUTRAL'
        },
        {
          text: "You seem... powerful. What if I joined you?",
          id: 'tempted',
          alignment: 'VILLAIN'
        }
      ]
    });
    
    this.dialogueNodes.set('killer_aggressive', {
      speaker: 'K-7',
      lines: [
        "Ah, defiance! How long has it been since prey showed such... courage?",
        "No matter. Your defiance makes the hunt sweeter.",
        "*laughs, voice echoing unnaturally* Time to run, little one..."
      ],
      choices: [
        {
          text: "I'll fight you if I have to!",
          id: 'combat_stance',
          alignment: 'HERO'
        },
        {
          text: "Please... I have a family...",
          id: 'beg_mercy',
          alignment: 'NEUTRAL'
        },
        {
          text: "Bring it on. I want to see what you're really capable of.",
          id: 'taunt',
          alignment: 'VILLAIN'
        }
      ]
    });
    
    this.dialogueNodes.set('killer_negotiation', {
      speaker: 'K-7',
      lines: [
        "Interesting... you wish to bargain with a god?",
        "I respect cunning. Perhaps there IS a place for you at my side.",
        "But first, prove your worth. Hunt with me. Kill with me. BECOME me."
      ],
      choices: [
        {
          text: "I'll never kill for you.",
          id: 'refuse_evil',
          alignment: 'HERO'
        },
        {
          text: "What if we could find a middle ground?",
          id: 'negotiate_terms',
          alignment: 'NEUTRAL'
        },
        {
          text: "Show me your power. Teach me. I'll do whatever you want.",
          id: 'accept_evil',
          alignment: 'VILLAIN'
        }
      ]
    });
    
    // NPC DIALOGUE TREES
    this.dialogueNodes.set('cop_detective', {
      speaker: 'Detective Martinez',
      lines: [
        "We've got 47 bodies. No weapon. No pattern. Except... whatever's doing this isn't human.",
        "We found evidence of something *alien* at the crime scenes. The government's getting involved.",
        "If you know anything, you need to tell me NOW. This thing is still out there."
      ],
      choices: [
        {
          text: "I've seen the creature. It's hunting people.",
          id: 'cooperate_police',
          alignment: 'HERO'
        },
        {
          text: "I don't know anything about this.",
          id: 'stay_silent',
          alignment: 'NEUTRAL'
        },
        {
          text: "Maybe the government made this thing. Maybe you're the real threat.",
          id: 'distrust_authority',
          alignment: 'VILLAIN'
        }
      ]
    });
    
    this.dialogueNodes.set('government_agent', {
      speaker: 'Agent Black (Unknown Agency)',
      lines: [
        "We know what's happening here. We've known for years.",
        "An extraterrestrial entity has been on Earth for a very long time.",
        "The question is: are you a threat... or an asset?"
      ],
      choices: [
        {
          text: "I want to help you stop it.",
          id: 'ally_with_government',
          alignment: 'HERO'
        },
        {
          text: "What do you want from me?",
          id: 'bargain_agent',
          alignment: 'NEUTRAL'
        },
        {
          text: "I'm leaving this planet with K-7. You can't stop us.",
          id: 'reject_government',
          alignment: 'VILLAIN'
        }
      ]
    });
    
    // SUBWAY CIVILIAN
    this.dialogueNodes.set('subway_survivor', {
      speaker: 'Frightened Commuter',
      lines: [
        "*whispering* Did you see it? The thing on the platform?",
        "It wasn't human. Its eyes... they glowed like nothing I've ever seen.",
        "I think it was looking for something... or someone..."
      ],
      choices: [
        {
          text: "You're safe now. Come with me.",
          id: 'protect_survivor',
          alignment: 'HERO'
        },
        {
          text: "Did it say anything?",
          id: 'gather_intel',
          alignment: 'NEUTRAL'
        },
        {
          text: "It was hunting prey. Just like nature intended.",
          id: 'accept_predation',
          alignment: 'VILLAIN'
        }
      ]
    });
  }
  
  /**
   * INITIALIZE RESPONSE PATTERNS
   * For parsing free-text player responses
   */
  initializeResponsePatterns() {
    this.responsePatterns.set('threat', {
      patterns: [
        /\b(fight|attack|kill|destroy|eliminate|stop you)\b/i,
        /\b(i'll crush|i'll end|prepare to die)\b/i
      ],
      intent: 'THREAT',
      alignmentShift: 'HERO'
    });
    
    this.responsePatterns.set('flee', {
      patterns: [
        /\b(run|escape|flee|hide|get away)\b/i,
        /\b(i'm outta here|goodbye|see you later)\b/i
      ],
      intent: 'FLEE',
      alignmentShift: 'NEUTRAL'
    });
    
    this.responsePatterns.set('negotiate', {
      patterns: [
        /\b(negotiate|deal|compromise|agreement|bargain)\b/i,
        /\b(what if|could we|perhaps|maybe we could)\b/i
      ],
      intent: 'NEGOTIATE',
      alignmentShift: 'NEUTRAL'
    });
    
    this.responsePatterns.set('submit', {
      patterns: [
        /\b(yes|okay|i'll join|i accept|i'm yours)\b/i,
        /\b(teach me|make me like you|i want power)\b/i
      ],
      intent: 'SUBMIT',
      alignmentShift: 'VILLAIN'
    });
    
    this.responsePatterns.set('psychology', {
      patterns: [
        /\b(you're not|you can't|why do you|what drives you)\b/i,
        /\b(something hurt you|you're lonely|you're afraid)\b/i
      ],
      intent: 'PSYCHOLOGY',
      alignmentShift: 'NEUTRAL'
    });
    
    this.responsePatterns.set('question', {
      patterns: [
        /\?$/,
        /\b(why|how|what|who|when|where)\b/i
      ],
      intent: 'QUESTION',
      alignmentShift: 'NEUTRAL'
    });
  }
  
  /**
   * START CONVERSATION
   */
  startConversation(npcId, nodeId) {
    const node = this.dialogueNodes.get(nodeId);
    if (!node) {
      console.error(`Dialogue node not found: ${nodeId}`);
      return null;
    }
    
    this.currentConversation = {
      npcId: npcId,
      currentNode: nodeId,
      startTime: Date.now(),
      responses: []
    };
    
    console.log(`\n🗣️  CONVERSATION STARTED: ${node.speaker}`);
    console.log(node.lines.join('\n'));
    
    window.dispatchEvent(new CustomEvent('DIALOGUE_START', {
      detail: {
        speaker: node.speaker,
        lines: node.lines,
        choices: node.choices
      }
    }));
    
    return node;
  }
  
  /**
   * PLAYER SELECTS DIALOGUE CHOICE
   */
  selectDialogueChoice(choiceId) {
    if (!this.currentConversation) return;
    
    const node = this.dialogueNodes.get(this.currentConversation.currentNode);
    const choice = node.choices.find(c => c.id === choiceId);
    
    if (!choice) return;
    
    console.log(`\n👤 Player: ${choice.text}`);
    
    // Update alignment
    this.playerAlignment = this.calculateAlignment(this.playerAlignment, choice.alignment);
    
    this.currentConversation.responses.push({
      choiceId: choiceId,
      choiceText: choice.text,
      timestamp: Date.now()
    });
    
    // Get NPC reaction
    const reaction = this.getNPCReaction(this.currentConversation.npcId, choiceId);
    
    return {
      reaction: reaction,
      playerAlignment: this.playerAlignment,
      consequence: this.calculateConsequence(choiceId)
    };
  }
  
  /**
   * PARSE FREE-TEXT RESPONSE
   * Player types their own response
   */
  parsePlayerResponse(playerText) {
    console.log(`\n👤 Player (free-text): "${playerText}"`);
    
    let intent = 'UNKNOWN';
    let intentScore = 0;
    let alignmentShift = 'NEUTRAL';
    
    // Match against patterns
    for (const [pattern, config] of this.responsePatterns) {
      for (const regex of config.patterns) {
        if (regex.test(playerText)) {
          intent = config.intent;
          intentScore += 1;
          alignmentShift = config.alignmentShift;
          break;
        }
      }
      if (intentScore > 0) break;
    }
    
    // Fallback to question if ends with ?
    if (playerText.trim().endsWith('?')) {
      intent = 'QUESTION';
    }
    
    // Parse sentiment (basic)
    const sentiment = this.analyzeSentiment(playerText);
    
    const parsedResponse = {
      originalText: playerText,
      intent: intent,
      sentiment: sentiment,
      alignmentShift: alignmentShift
    };
    
    console.log(`\n🧠 Parsed Intent: ${intent} | Sentiment: ${sentiment}`);
    
    // Update alignment
    this.playerAlignment = this.calculateAlignment(this.playerAlignment, alignmentShift);
    
    // Get NPC reaction to free-text
    const reaction = this.getAIReactionToText(playerText, parsedResponse);
    
    this.currentConversation.responses.push({
      freeText: playerText,
      intent: intent,
      timestamp: Date.now()
    });
    
    return {
      parsedResponse: parsedResponse,
      npcReaction: reaction,
      playerAlignment: this.playerAlignment
    };
  }
  
  /**
   * ANALYZE SENTIMENT
   */
  analyzeSentiment(text) {
    const positive = /\b(good|yes|okay|fine|love|beautiful|thank you)\b/i;
    const negative = /\b(bad|no|never|hate|ugly|disgusting|awful)\b/i;
    const aggressive = /\b(kill|destroy|attack|fight|crush|eliminate)\b/i;
    const fearful = /\b(scared|afraid|help|please|mercy|forgive)\b/i;
    
    if (aggressive.test(text)) return 'AGGRESSIVE';
    if (fearful.test(text)) return 'FEARFUL';
    if (positive.test(text)) return 'POSITIVE';
    if (negative.test(text)) return 'NEGATIVE';
    
    return 'NEUTRAL';
  }
  
  /**
   * GET NPC REACTION
   */
  getNPCReaction(npcId, choiceId) {
    const reactions = {
      'killer_first_encounter': {
        'hostile': {
          speaker: 'K-7',
          response: '"Hostility? How DELICIOUS! Finally, prey with spirit!"',
          consequence: 'COMBAT_ENGAGED',
          relationship: -20
        },
        'curious': {
          speaker: 'K-7',
          response: '"A reasonable question. I hunt because I must. Your blood calls to me."',
          consequence: 'STALEMATE',
          relationship: 0
        },
        'tempted': {
          speaker: 'K-7',
          response: '"YES! At last, one who understands! Together, we shall paint worlds red!"',
          consequence: 'CORRUPTION_BEGIN',
          relationship: 50
        }
      }
    };
    
    const reaction = reactions[npcId]?.[choiceId];
    
    if (reaction) {
      console.log(`\n🗣️  ${reaction.speaker}: ${reaction.response}`);
      
      window.dispatchEvent(new CustomEvent('DIALOGUE_REACTION', {
        detail: reaction
      }));
      
      return reaction;
    }
    
    return null;
  }
  
  /**
   * GET AI REACTION TO FREE-TEXT
   */
  getAIReactionToText(playerText, parsedResponse) {
    // Map free-text response to killer reaction
    const reactions = {
      'THREAT': {
        response: '"You threaten me? How amusing. Your fists will break on my flesh, and I will drink your fear."',
        consequence: 'COMBAT',
        relationship: -30
      },
      'FLEE': {
        response: '"Run, little prey! The hunt is more enjoyable when you resist! *laughs*"',
        consequence: 'CHASE',
        relationship: -10
      },
      'NEGOTIATE': {
        response: '"Interesting. Few prey attempt reason. Speak. What would you propose?"',
        consequence: 'NEGOTIATION',
        relationship: 10
      },
      'SUBMIT': {
        response: '"YES! YES! You understand! We shall become legends together!"',
        consequence: 'CORRUPTION',
        relationship: 40
      },
      'PSYCHOLOGY': {
        response: '"Psychology? You think you can understand what I am? I've lived 10,000 years!"',
        consequence: 'MENTAL_BATTLE',
        relationship: 5
      },
      'QUESTION': {
        response: '"Questions? An intelligent prey. I appreciate that. Ask, and maybe I will answer."',
        consequence: 'DIALOGUE',
        relationship: 5
      },
      'UNKNOWN': {
        response: '"What are you babbling about? Speak clearly, little thing."',
        consequence: 'CONFUSION',
        relationship: -5
      }
    };
    
    const reaction = reactions[parsedResponse.intent] || reactions['UNKNOWN'];
    
    console.log(`\n🗣️  K-7: ${reaction.response}`);
    
    window.dispatchEvent(new CustomEvent('DIALOGUE_REACTION', {
      detail: reaction
    }));
    
    return reaction;
  }
  
  /**
   * CALCULATE ALIGNMENT SHIFT
   */
  calculateAlignment(currentAlignment, shift) {
    const alignments = ['HERO', 'NEUTRAL', 'VILLAIN'];
    const currentIndex = alignments.indexOf(currentAlignment);
    
    if (shift === 'HERO' && currentIndex > 0) return alignments[currentIndex - 1];
    if (shift === 'VILLAIN' && currentIndex < 2) return alignments[currentIndex + 1];
    
    return currentAlignment;
  }
  
  /**
   * CALCULATE CONSEQUENCE
   */
  calculateConsequence(choiceId) {
    // Determine what happens based on choice
    const consequences = {
      'protect_survivor': 'KARMA_GOOD',
      'accept_predation': 'CORRUPTION_POINTS',
      'cooperate_police': 'GOVERNMENT_AWARE',
      'reject_government': 'HUNTED_BY_FEDS',
      'accept_evil': 'POINT_OF_NO_RETURN'
    };
    
    return consequences[choiceId] || 'NO_CONSEQUENCE';
  }
  
  /**
   * GET CONVERSATION HISTORY
   */
  getConversationHistory() {
    return this.currentConversation;
  }
  
  /**
   * END CONVERSATION
   */
  endConversation() {
    if (this.currentConversation) {
      console.log('\n✓ Conversation ended');
      this.conversationHistory.push(this.currentConversation);
      this.currentConversation = null;
    }
  }
  
  /**
   * GET PLAYER ALIGNMENT
   */
  getPlayerAlignment() {
    return this.playerAlignment;
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DialogueEngine;
}
