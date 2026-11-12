// EnvironmentManager.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from UNITY_GAME_SCRIPTS_COMPLETE.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using System.Collections.Generic;

public class EnvironmentManager : MonoBehaviour
{
    public static EnvironmentManager Instance;
    
    public enum CorruptionZone
    {
        SafeHaven = 0,
        EarlyCorruption = 1,
        DeepCorruption = 2,
        TheHeart = 3
    }
    
    [Header("Current State")]
    [SerializeField] private CorruptionZone currentZone = CorruptionZone.SafeHaven;
    
    [Header("Events")]
    public UnityEvent<CorruptionZone> OnZoneChanged;
    
    void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }
    
    void Start()
    {
        Invoke(nameof(ForceBroadcast), 0.1f);
    }
    
    void ForceBroadcast()
    {
        OnZoneChanged?.Invoke(currentZone);
    }
    
    public void TransitionToZone(CorruptionZone newZone)
    {
        currentZone = newZone;
        OnZoneChanged?.Invoke(newZone);
        ApplyZoneEffects(newZone);
    }
    
    void ApplyZoneEffects(CorruptionZone zone)
    {
        // Trigger visual/audio corruption based on zone
        switch(zone)
        {
            case CorruptionZone.SafeHaven:
                RenderSettings.fogDensity = 0.001f;
                break;
            case CorruptionZone.EarlyCorruption:
                RenderSettings.fogDensity = 0.01f;
                break;
            case CorruptionZone.DeepCorruption:
                RenderSettings.fogDensity = 0.05f;
                break;
            case CorruptionZone.TheHeart:
                RenderSettings.fogDensity = 0.1f;
                break;
        }
    }
}
