# Complete NPC Visual Designs
## Destiny's World: The Ancient One
### Created: November 26, 2025

This document provides complete visual design specifications for all 8 NPCs in the game, created using VIVERSE Avatar Creator.

---

## ✅ NPC 1: SARAH - The Traumatized Survivor

**Location:** Crash Site (Location 1)  
**Status:** COMPLETED - Designed in VIVERSE Avatar Creator

### Visual Design
- **Gender:** Female
- **Age Appearance:** Young adult (20s-30s)
- **Hair:** Dark, shoulder-length, slightly disheveled
- **Face:** Fearful expression, tired eyes
- **Outfit:** Distressed urban survival look
  - Black/pink torn bomber jacket (damaged)
  - Dark crop top underneath
  - Black cargo pants with utility pockets
  - Red/black sneakers
  - Overall appearance: survivor who's been through trauma

### Character Notes
- Posture should convey fear/anxiety
- Animation states: Fearful idle, cautious walking, hiding (crouched), nervous talking
- Perfect for conveying "I've witnessed something terrible"

---

## ✅ NPC 2: DR. ARIS - The Dying Scientist

**Location:** Research Laboratory (Location 2)  
**Status:** COMPLETED - Designed in VIVERSE Avatar Creator

### Visual Design
- **Gender:** Male
- **Age Appearance:** Middle-aged (40s-50s)
- **Hair:** Blonde, professional style
- **Face:** Wears glasses (intelligent look), pale/exhausted expression
- **Outfit:** Professional scientist appearance
  - Dark professional jacket with purple/teal accents
  - Blue shirt underneath
  - Dark pants
  - Professional shoes
  - Overall appearance: intellectual, exhausted, dying

### Character Notes
- Should appear weakened but determined
- Animation states: Labored breathing, clutching wounds, urgent gestures
- Glasses are KEY visual element - instantly reads as "scientist"
- Could add blood/damage effects in Unity

---

## 📋 NPC 3: SECURITY CHIEF MILLER - The Corrupted Official

**Location:** Underground Facility (Location 3)  
**Status:** DESIGN SPECIFICATION READY

### Visual Design (Recommended)
- **Gender:** Male
- **Age Appearance:** Middle-aged (40s)
- **Hair:** Short military/security style, graying at temples
- **Face:** Initially professional, increasingly disheveled throughout encounter
- **Outfit:** Security uniform
  - Dark security officer uniform (navy/black)
  - Badge/ID visible
  - Equipment belt with tactical gear
  - Boots
  - As game progresses: uniform becomes more disheveled, tie loosened

### Character Notes
- Starts authoritative, becomes erratic
- Should show signs of mental deterioration
- Facial expressions shift from professional to manic
- Animation states: Professional stance → Twitchy movements → Full corruption

---

## 📋 NPC 4: SUBJECT ZERO - The Failed Hybrid

**Location:** Alien Ship Interior (Location 4)  
**Status:** DESIGN SPECIFICATION READY - May require custom 3D modeling

### Visual Design (Concept)
- **Gender:** Ambiguous (was human, now transforming)
- **Age Appearance:** Indeterminate
- **Appearance:** HORRIFYING hybrid state
  - Half-human, half-alien transformation
  - Exposed alien biomechanical elements
  - Distorted human features still visible
  - Bioluminescent alien growths on skin
  - Partially transparent/translucent areas
  - Asymmetrical (one side more alien than other)

### Technical Notes
- **May exceed VIVERSE Avatar Creator capabilities**
- Recommended approach:
  1. Start with base human character
  2. Add custom alien textures/shaders in Unity
  3. Use particle effects for bioluminescence
  4. Blend human and alien 3D models
- Alternative: Use VIVERSE 3D Object AI to create custom alien-hybrid model

### Character Notes
- Should evoke horror and pity
- Movements: Jerky, unnatural, painful-looking
- Sounds: Mix of human speech and alien noises

---

## 📋 NPC 5: THE HERMIT - The Survivalist

**Location:** Dark Forest Zone (Location 5)  
**Status:** DESIGN SPECIFICATION READY

### Visual Design (Recommended)
- **Gender:** Male
- **Age Appearance:** Older (50s-60s)
- **Hair:** Long, unkempt, gray/white beard
- **Face:** Weathered, scarred, paranoid eyes, gaunt
- **Outfit:** Practical survival gear
  - Layered clothing (multiple jackets/vests)
  - Earth tones: browns, greens, grays
  - Tactical vest with pouches
  - Worn boots
  - Makeshift armor pieces
  - Camouflage elements
  - Weathered, dirty appearance

### Character Notes
- Should look like he's been living off-grid for months
- Carries survival equipment
- Movements: Quick, alert, paranoid
- Knows how to disappear into shadows

---

## 📋 NPC 6: SHERPA SPIRIT - The Ghost Guide

**Location:** Mountain Pass (Location 6)  
**Status:** DESIGN SPECIFICATION READY - Requires transparency effects

### Visual Design (Concept)
- **Gender:** Male or Female (player choice based on available models)
- **Age Appearance:** Timeless/Ancient
- **Appearance:** Ethereal mountain guide
  - Traditional mountain sherpa clothing
  - Flowing robes/wraps in earth tones
  - Prayer flags/spiritual elements
  - **SEMI-TRANSPARENT** (50-70% opacity)
  - Slight glow/aura effect
  - Edges slightly blurred/soft

### Technical Requirements
- Base character in VIVERSE Avatar Creator
- **Critical Unity shader requirements:**
  - Transparency/Alpha channel
  - Emission/glow shader
  - Particle effects (wisps, floating elements)
  - Optional: Fade in/out animations

### Character Notes
- Movements should be smooth, floating
- Appears and disappears mysteriously
- Speaks in calm, knowing tones
- Not threatening despite being supernatural

---

## 📋 NPC 7: THE MAYOR - The Hologram Glitch

**Location:** Abandoned Town (Location 7)  
**Status:** DESIGN SPECIFICATION READY - Requires hologram effects

### Visual Design (Concept)
- **Gender:** Male (typical mayor figure)
- **Age Appearance:** 50s-60s (formal authority figure)
- **Base Appearance:** Professional politician
  - Formal suit and tie
  - Clean-cut, professional hairstyle
  - Mayoral appearance
  
### Hologram Effects Required
- **Flickering/Glitching:**
  - Random visual corruption
  - Scan lines
  - Digital artifacts
  - Color distortion (cyan/magenta separation)
  - Occasional pixelation
- **Semi-transparency** (hologram appearance)
- **Blue/cyan tint** to entire character
- **Emission shader** (glowing effect)

### Technical Implementation
- Create normal character in Avatar Creator
- Apply hologram shader in Unity:
  - Fresnel rim lighting
  - Scan line animation
  - Random glitch intervals
  - Audio distortion to match visual glitches

### Character Notes
- Stuck in recording loop
- Repeats phrases, stutters
- Occasionally "breaks character" with useful info
- Not hostile, just malfunctioning

---

## 📋 NPC 8: XYLOTH'S AVATAR - The Gatekeeper

**Location:** Homeworld Portal (Location 8)  
**Status:** DESIGN SPECIFICATION READY - Requires custom alien modeling

### Visual Design (Concept)
- **Gender:** None (alien entity)
- **Appearance:** Humanoid alien form
  - Tall, slender humanoid proportions
  - Elongated limbs
  - **Bioluminescent skin** (pulsing patterns)
  - Smooth, almost metallic texture
  - Large, otherworldly eyes
  - No visible mouth (communicates telepathically or through gestures)
  - Elegant, graceful appearance (not grotesque)
  
### Color Palette
- Primary: Deep purple/indigo
- Secondary: Cyan/teal bioluminescence
- Accents: Gold/amber energy patterns
- Should appear ancient and powerful

### Technical Requirements
- **Custom 3D Model recommended**
- Alternative: Heavily modified VIVERSE base character with:
  - Custom alien textures
  - Emissive materials
  - Animated light patterns
  - Particle effects for energy aura
  - Shape-shifting capabilities (morphs into other NPCs)

### Character Notes
- Movements: Fluid, almost floating
- Can shape-shift to appear as other characters
- Final boss/ultimate persuader
- Should be beautiful yet unsettling
- Represents Xyloth's true nature

---

## Implementation Summary

### Ready for Direct VIVERSE Creation
1. ✅ Sarah (COMPLETED)
2. ✅ Dr. Aris (COMPLETED)
3. 📋 Security Chief Miller
4. 📋 The Hermit

### Require Special Unity Effects
5. 📋 Subject Zero (hybrid model + effects)
6. 📋 Sherpa Spirit (transparency shader)
7. 📋 The Mayor (hologram shader)
8. 📋 Xyloth's Avatar (custom alien model)

---

## Next Steps

1. **Create remaining basic NPCs** (3, 5) in VIVERSE Avatar Creator
2. **Export all character models** to Unity
3. **Apply special effects shaders** for characters 6-8
4. **Create custom hybrid model** for Subject Zero (NPC 4)
5. **Implement animation controllers** for each NPC
6. **Test all character appearances** in Unity scene
7. **Add character-specific particle effects**
8. **Integrate with dialogue/AI systems**

---

## Technical Notes

### VIVERSE Avatar Creator Limitations
- Cannot create: Heavy gore/blood, extreme body horror, full transparency
- Can create: Professional characters, casual wear, some fantasy elements
- Workaround: Use Unity shaders and post-processing for special effects

### Unity Enhancement Requirements
- **Shader Graph** for custom effects (hologram, ghost, bioluminescence)
- **Particle Systems** for ambient effects
- **Animation Blending** for smooth state transitions
- **LOD Groups** for performance optimization
- **Facial Animation** support (if available in VIVERSE exports)

---

**Created:** November 26, 2025  
**Design Phase:** Phase 4 - Asset Generation  
**Tool Used:** VIVERSE Avatar Creator + Unity Integration  
**Total NPCs:** 8 (2 completed visually, 6 specified)  
**Status:** Ready for full implementation
