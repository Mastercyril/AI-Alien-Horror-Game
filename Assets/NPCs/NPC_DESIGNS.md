# NPC Character Designs
## Destiny's World: The Ancient One

This document tracks all NPC character designs created using VIVERSE Avatar Creator.

---

## NPC 1: Sarah - The Traumatized Survivor

**Location:** Location 1 - Crash Site  
**Role:** Traumatized survivor, first human contact  
**Status:** ✅ COMPLETED

### Character Description
- **Appearance:** Female character with dark hair, wearing distressed dark outfit (black pants, torn pink/black jacket)
- **Personality:** Traumatized, fearful, paranoid from witnessing the crash and Xyloth
- **Backstory:** Survived the initial alien escape pod crash. Witnessed Xyloth emerge and kill others. Hiding in the wreckage.
- **Dialogue Style:** Fragmented, anxious, warning the player about "the thing that came out"

### Key Interactions
- **First Meeting:** Player finds Sarah hiding in debris, whispering warnings
- **Information:** Provides crucial early information about Xyloth's appearance and abilities
- **Fear Level:** Can sense Xyloth nearby, becomes more erratic when the alien is close
- **Quest:** Asks player to help her escape or find other survivors

### Design Notes
- Created in VIVERSE Avatar Creator
- Base model: Mature female character type
- Outfit: Dark distressed clothing (black/pink jacket, dark pants, sneakers)
- Hair: Dark, shoulder-length
- Expression: Fearful, traumatized look

### Implementation Requirements
- Uses NPCMovement.cs for patrol/hide behavior
- Dialogue system integration for conversation trees
- Fear response system when Xyloth is nearby
- Animation states: Idle (fearful), Walking (cautious), Hiding (crouched), Talking (anxious gestures)

---

## NPC 2: Dr. Aris - The Dying Scientist

**Location:** Location 2 - Research Laboratory  
**Role:** Dying scientist with critical information  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Older male scientist in torn lab coat, bloodied
- **Personality:** Dying but determined to pass on knowledge
- **Backstory:** Was studying the alien artifacts when Xyloth attacked the facility
- **Dialogue Style:** Urgent, scientific, revealing key lore about Xyloth's origins

### Key Interactions
- **Critical Information:** Reveals Xyloth is an "Ancient One" - millennia-old entity
- **Weakness Hint:** Mentions ancient texts about containing such beings
- **Death Scene:** Dies mid-conversation, adding urgency and horror

---

## NPC 3: Security Chief Miller - The Corrupted Official

**Location:** Location 3 - Underground Facility  
**Role:** Compromised security chief  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Security uniform, increasingly disheveled appearance
- **Personality:** Initially authoritative, slowly reveals mental corruption by Xyloth
- **Backstory:** Responsible for facility security, now under Xyloth's psychological influence
- **Dialogue Style:** Starts professional, becomes increasingly erratic and manipulative

### Key Interactions
- **Deceptive Ally:** Appears to help but may be leading player into traps
- **Moral Choice:** Player can try to save him or eliminate the threat
- **Xyloth Connection:** Has been partially mind-controlled, speaks Xyloth's words

---

## NPC 4: Subject Zero - The Failed Hybrid

**Location:** Location 4 - Alien Ship Interior  
**Role:** Failed human-alien hybrid experiment  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Grotesque human-alien hybrid, half-transformed
- **Personality:** Tragic, suffering, caught between human and alien
- **Backstory:** One of Xyloth's early experimental subjects
- **Dialogue Style:** Distorted, painful, switching between human speech and alien sounds

### Key Interactions
- **Horrifying Reveal:** Shows the fate of those who "join" Xyloth
- **Warning:** Begs player not to trust Xyloth's promises
- **Mercy Choice:** Player can end their suffering or try to help

---

## NPC 5: The Hermit - The Survivalist

**Location:** Location 5 - Dark Forest Zone  
**Role:** Long-term survivor living off-grid  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Rugged, weathered, survival gear
- **Personality:** Paranoid but resourceful, knows the terrain
- **Backstory:** Escaped early incidents with Xyloth, living in hiding for months
- **Dialogue Style:** Cryptic, survivalist wisdom, warning riddles

### Key Interactions
- **Survival Tips:** Teaches player how to avoid Xyloth's detection
- **Equipment:** Can provide survival gear and weapons
- **Secret Knowledge:** Knows hidden paths through the forest

---

## NPC 6: Sherpa Spirit - The Ghost Guide

**Location:** Location 6 - Mountain Pass  
**Role:** Mysterious supernatural guide  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Ethereal, traditional mountain guide clothing, semi-transparent
- **Personality:** Calm, knowing, speaks in riddles and wisdom
- **Backstory:** Ancient spirit of the mountain, witnessed other "Ancient Ones" before
- **Dialogue Style:** Poetic, mysterious, offers cryptic guidance

### Key Interactions
- **Lore Keeper:** Provides deep backstory about the Ancient Ones
- **Path Guidance:** Shows safe routes through dangerous mountain terrain
- **Xyloth Knowledge:** Knows Xyloth's true nature and purpose

---

## NPC 7: The Mayor - The Hologram Glitch

**Location:** Location 7 - Abandoned Town  
**Role:** Corrupted AI hologram of former mayor  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Flickering hologram, formal attire, glitching effects
- **Personality:** Stuck in loop, providing fragmented town history
- **Backstory:** AI recording of mayor, corrupted by Xyloth's influence
- **Dialogue Style:** Glitchy, repeating, occasionally reveals useful information between corruptions

### Key Interactions
- **Town History:** Reveals what happened to the abandoned town
- **Code Access:** Glitches may reveal facility access codes
- **Warning System:** Alerts player to danger in unpredictable ways

---

## NPC 8: Xyloth's Avatar - The Gatekeeper

**Location:** Location 8 - Homeworld Portal  
**Role:** Xyloth's manifestation, final conversation  
**Status:** ⏳ PENDING

### Character Description
- **Appearance:** Humanoid alien form, bioluminescent, otherworldly
- **Personality:** Persuasive, ancient, intelligent beyond human comprehension
- **Backstory:** Direct manifestation of Xyloth's will at the portal
- **Dialogue Style:** Hypnotic, multilayered meanings, psychologically manipulative

### Key Interactions
- **Final Choice:** Presents all three ending options to player
- **Psychological Battle:** Uses everything learned about player against them
- **Shape-Shifting:** May appear as previous NPCs or loved ones
- **Truth Reveal:** Finally explains Xyloth's true purpose and plan

---

## Implementation Status

- ✅ NPC 1: Sarah (Completed - Design and Documentation)
- ⏳ NPC 2: Dr. Aris (Pending - Need to create in Avatar Creator)
- ⏳ NPC 3: Security Chief Miller (Pending)
- ⏳ NPC 4: Subject Zero (Pending - May require special custom modeling)
- ⏳ NPC 5: The Hermit (Pending)
- ⏳ NPC 6: Sherpa Spirit (Pending - May require transparency/ghost effects)
- ⏳ NPC 7: The Mayor (Pending - Hologram effects needed)
- ⏳ NPC 8: Xyloth's Avatar (Pending - Custom alien model required)

## Technical Requirements

### Scripts Needed
- NPCMovement.cs ✅ (Generated in Gemini)
- NPCAnimationController.cs ⏳ (Pending)
- NPCDialogueController.cs ⏳ (Pending)
- NPCFearResponse.cs ⏳ (Pending)
- NPCInteractionSystem.cs ⏳ (Pending)

### Assets Needed
- 8 NPC character models from VIVERSE Avatar Creator
- Animation sets for each NPC
- Dialogue audio files
- Facial expression animations
- Special effects (ghost effect, hologram glitch, alien bioluminescence)

---

**Last Updated:** Phase 4 - Asset Generation & Unity Setup  
**Created By:** VIVERSE Avatar Creator + Documentation  
**Next Steps:** Continue creating remaining 7 NPCs in Avatar Creator
