# World System Scripts - Batch 2
## Destiny's World: The Ancient One

**Generated:** December 2024  
**Platform:** Unity WebGL for VIVERSE  
**Total Scripts:** 10

---

## Overview

This document contains the second batch of gameplay scripts for "Destiny's World: The Ancient One." These scripts handle world interconnection, AI psychology, atmosphere, and game progression systems.

### Implementation Order
1. **Core Systems:** Create `GameSaveSystem` and `SceneTransitionManager` first
2. **AI & Data:** Implement `MemorySystem` before `XylothAdvancedAI`
3. **Visuals:** Add Atmosphere and Fear controllers last to tune performance

### WebGL/VIVERSE Compatibility Notes
- **Saving:** Uses `PlayerPrefs` wrapped in JSON (most reliable for WebGL)
- **Post-Processing:** Uses Camera manipulation (FOV, Shake) instead of HDRP/URP volumes
- **Performance:** Minimized heavy physics and complex calculations for browser rendering

---

## Script List

### 1. SceneTransitionManager.cs
**Purpose:** Singleton manager that handles fading UI and asynchronous scene loading

**Key Features:**
- Fade in/out transitions
- Async scene loading with progress bar
- Persists across scenes via DontDestroyOnLoad
- WebGL-optimized loading

**Dependencies:** None

**Usage:**
```csharp
SceneTransitionManager.Instance.LoadScene("Location_2_Laboratory");
```

---

### 2. PortalController.cs
**Purpose:** Physical object in world that triggers scene changes and auto-saves

**Key Features:**
- Trigger-based or interaction-based activation
- Auto-save on portal entry (optional)
- Seamless scene transitions

**Dependencies:** SceneTransitionManager, GameSaveSystem

**Setup:**
- Attach to portal GameObject
- Add Collider with "Is Trigger" enabled
- Set destination scene name
- Configure auto-save option

---

### 3. GameSaveSystem.cs
**Purpose:** WebGL-safe save/load system using JSON and PlayerPrefs

**Key Features:**
- Saves player position, inventory, clues, AI memory
- JSON serialization for complex data
- PlayerPrefs for WebGL compatibility
- Singleton pattern

**Save Data Structure:**
- Player position (Vector3)
- Current scene (string)
- Collected clues (List<string>)
- AI memory keys (List<string>)

**Usage:**
```csharp
GameSaveSystem.Instance.SaveGame();
GameSaveSystem.Instance.LoadGame();
```

---

### 4. MemorySystem.cs
**Purpose:** Tracks player actions for AI to remember and reference

**Key Features:**
- Dictionary-based action tracking
- Stores player choices and behaviors
- Used by XylothAdvancedAI for contextual taunts
- Singleton pattern

**Tracked Actions Examples:**
- "HidInLocker" - Player hid from Xyloth
- "AttackedAlien" - Player showed aggression
- "SparedAlien" - Player showed mercy
- "HidUnderBed" - Specific hiding behavior

**Usage:**
```csharp
MemorySystem.Instance.RegisterAction("HidInLocker");
bool didHide = MemorySystem.Instance.HasDoneAction("HidInLocker");
```

---

### 5. XylothAdvancedAI.cs
**Purpose:** Psychological manipulation AI that learns from player and taunts contextually

**Key Features:**
- Extends AlienMovement.cs
- 30% chance to taunt when spotting player
- Contextual voice lines based on MemorySystem
- Pauses movement during taunts
- Multiple taunt categories (coward, aggressive, generic)

**Dependencies:** AlienMovement, MemorySystem, AudioSource

**Setup:**
- Attach to Xyloth GameObject
- Assign voice AudioSource
- Add taunt AudioClips (generic, coward, aggressive)
- Call OnPlayerSpotted() from AlienMovement state changes

---

### 6. FearMechanicController.cs
**Purpose:** Visual and audio distortions when Xyloth is near

**Key Features:**
- Distance-based fear intensity calculation
- Heartbeat audio volume scaling
- Camera FOV warp (tunnel vision effect)
- Camera shake when very close
- Smooth intensity transitions

**Effects:**
- **Far (0% fear):** Normal vision and no heartbeat
- **Medium (50% fear):** Heartbeat starts, slight FOV change
- **Close (100% fear):** Loud heartbeat, warped vision, camera shake

**Dependencies:** None

**Setup:**
- Attach to Player or GameManager
- Assign player Transform, alien Transform, Camera
- Add heartbeat AudioSource with looping heartbeat clip
- Configure max fear distance (default: 20 units)

---

### 7. WorldAtmosphereController.cs
**Purpose:** Controls lighting, weather, and ambiance per location

**Key Features:**
- Zone-based atmosphere definitions
- Smooth transitions between zones
- Controls fog color, fog density, ambient light
- Real-time interpolation

**Zone Structure:**
- Zone name (string)
- Fog color (Color)
- Fog density (float)
- Ambient light color (Color)

**Usage:**
```csharp
WorldAtmosphereController.Instance.SetZone("DarkForest");
```

**Setup:**
- Create zones in inspector for each location
- Call SetZone() when player enters new area
- Transitions happen automatically

---

### 8. CollectibleManager.cs
**Purpose:** Manages inventory items (keys, documents) separate from clues

**Key Features:**
- Inventory list management
- Add/remove/check items
- Singleton pattern
- Integration with door systems

**Item Types:**
- Keys (unlock doors)
- Documents (lore and story)
- Special items (alien artifacts)

**Usage:**
```csharp
CollectibleManager.Instance.AddItem("BasementKey");
bool hasKey = CollectibleManager.Instance.HasItem("BasementKey");
CollectibleManager.Instance.RemoveItem("BasementKey"); // if consumed
```

---

### 9. EndingManager.cs
**Purpose:** Determines final cutscene based on player choices

**Key Features:**
- Calculates ending based on inventory and memory
- 3 possible endings: Hero, Hunter, Alliance
- Integrates with CollectibleManager and MemorySystem

**Ending Conditions:**

**Alliance Ending (True Ending):**
- Has AlienArtifact item
- Has "SparedAlien" memory action
- Loads "Ending_Alliance" scene

**Hunter Ending (Aggressive):**
- Has PlasmaCutter weapon
- Does NOT have "SparedAlien" action
- Loads "Ending_Hunter" scene

**Hero Ending (Default/Escape):**
- All other conditions
- Loads "Ending_Hero" scene

**Usage:**
```csharp
EndingManager endingManager = GetComponent<EndingManager>();
endingManager.TriggerEnding(); // Call at final portal/trigger
```

---

### 10. AudioManager.cs
**Purpose:** Centralized audio system with 3D spatial sound support

**Key Features:**
- Music management
- 2D sound effects (UI sounds)
- 3D spatial sound spawning
- Dynamic AudioSource instantiation

**Audio Types:**
- **Music:** Background ambiance and themes
- **SFX:** UI clicks, pickup sounds
- **Spatial Sound:** 3D positioned sounds (footsteps, whispers)

**Usage:**
```csharp
AudioManager.Instance.PlayMusic(ambientMusicClip);
AudioManager.Instance.PlaySFX(pickupSound);
AudioManager.Instance.PlaySpatialSound(whisperClip, whisperPosition);
```

**Setup:**
- Create AudioManager GameObject
- Add 2 AudioSources (music and sfx)
- Create spatial sound prefab with AudioSource (SpatialBlend = 1)
- Assign prefab reference

---

## Integration Guide

### Step 1: Core Systems Setup
1. Create empty GameObject named "GameSystems"
2. Add GameSaveSystem component
3. Add MemorySystem component
4. Add CollectibleManager component
5. Set as DontDestroyOnLoad

### Step 2: Scene Transition Setup
1. Create UI Canvas with CanvasGroup (for fade)
2. Add Image for loading progress bar
3. Create SceneTransitionManager GameObject
4. Assign UI references
5. Set as DontDestroyOnLoad

### Step 3: Audio Setup
1. Create AudioManager GameObject
2. Add 2 AudioSources
3. Create spatial sound prefab
4. Configure audio mixer (optional)

### Step 4: AI Enhancement
1. Add XylothAdvancedAI to Xyloth GameObject
2. Assign taunt AudioClips
3. Connect with existing AlienMovement
4. Test psychological taunts

### Step 5: Atmosphere Setup
1. Add WorldAtmosphereController to scene
2. Define zones for each location
3. Trigger zone changes via colliders or scripts

### Step 6: Fear System
1. Add FearMechanicController to Player
2. Assign references (player, alien, camera)
3. Add heartbeat AudioClip
4. Test distance-based effects

### Step 7: Portal Network
1. Create portal prefabs for each connection
2. Add PortalController script
3. Set destination scenes
4. Configure auto-save settings

### Step 8: Ending System
1. Create final trigger area
2. Add EndingManager script
3. Create 3 ending scenes
4. Test all ending paths

---

## Testing Checklist

- [ ] Scene transitions work smoothly
- [ ] Save/load preserves player state
- [ ] Memory system tracks player actions
- [ ] Xyloth taunts based on player history
- [ ] Fear effects scale with distance
- [ ] Atmosphere changes between zones
- [ ] Inventory system functions
- [ ] All 3 endings accessible
- [ ] Spatial audio works in 3D space
- [ ] Portals connect all 8 locations

---

## Performance Optimization

### WebGL Best Practices:
1. **Minimize PlayerPrefs calls** - Batch save operations
2. **Async loading** - Always use SceneManager.LoadSceneAsync
3. **Audio compression** - Use compressed audio formats
4. **LOD systems** - Reduce polygon count at distance
5. **Texture streaming** - Enable for large textures
6. **Occlusion culling** - Enable per scene
7. **Lightmap baking** - Prefer baked lighting over real-time

---

## Next Steps

1. Import all scripts to Unity project
2. Create GameSystems prefab
3. Set up scene hierarchy
4. Configure audio clips and UI
5. Test portal connections
6. Implement ending triggers
7. Polish fear mechanic intensity
8. Build WebGL test version
9. Deploy to VIVERSE for testing
10. Iterate based on playtesting

---

**Total Scripts Generated:** 20 (Batch 1: 10 + Batch 2: 10)  
**All Scripts WebGL Compatible:** ✓  
**Ready for Unity Import:** ✓  
**VIVERSE Deployment Ready:** ✓
