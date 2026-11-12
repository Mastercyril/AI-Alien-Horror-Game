// PsychologicalProfile.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from UNITY_GAME_SCRIPTS_COMPLETE.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using System.Collections.Generic;

public class PsychologicalProfile : MonoBehaviour
{
    public float FearLevel { get; private set; }
    public float SanityLevel { get; private set; }
    public List<string> Memories { get; private set; } = new List<string>();
    public List<string> HidingSpotsUsed { get; private set; } = new List<string>();
    public float DecisionSpeed { get; private set; }
    public string ExplorationStyle { get; private set; }
    
    private float sanityDecayRate = 0.05f;
    private float lastMoveTime;
    private int moveCount;
    private Queue<string> traumaticEvents = new Queue<string>();
    
    void Awake()
    {
        SanityLevel = 100f;
        FearLevel = 0f;
        lastMoveTime = Time.time;
    }
    
    void Update()
    {
        if (SanityLevel > 0f) SanityLevel -= sanityDecayRate * Time.deltaTime;
        
        if (SanityLevel < 50f) TriggerVisualCorruption();
        if (SanityLevel < 20f) TriggerAudioCorruption();
        
        if (Input.anyKeyDown) RecordDecision();
    }
    
    public void RecordMovement(float speed, bool crouched)
    {
        moveCount++;
        ExplorationStyle = (speed < 2f) ? "Cautious" : "Bold";
        lastMoveTime = Time.time;
    }
    
    public void RecordStealthAction(bool crouching)
    {
        Memories.Add(crouching ? "Crouched" : "Stood up");
    }
    
    public void RegisterHidingSpot(string spotName)
    {
        if (!HidingSpotsUsed.Contains(spotName)) HidingSpotsUsed.Add(spotName);
        Memories.Add($"Hid in {spotName}");
    }
    
    public void RecordMemory(string eventDesc)
    {
        Memories.Add(eventDesc);
        if (eventDesc.Contains("trauma") && traumaticEvents.Count < 10) traumaticEvents.Enqueue(eventDesc);
    }
    
    public void RecordNPCInteraction(string npcName)
    {
        Memories.Add($"Talked to {npcName}");
    }
    
    public void UpdateFear(float change)
    {
        FearLevel = Mathf.Clamp(FearLevel + change, 0f, 100f);
    }
    
    public void UpdateSanity(float change)
    {
        SanityLevel = Mathf.Clamp(SanityLevel + change, 0f, 100f);
    }
    
    public string GetLikelyEscapeRoute()
    {
        if (HidingSpotsUsed.Count == 0) return "";
        return HidingSpotsUsed[HidingSpotsUsed.Count - 1];
    }
    
    void RecordDecision()
    {
        float dt = Time.time - lastMoveTime;
        DecisionSpeed = (DecisionSpeed + dt) / 2f;
        lastMoveTime = Time.time;
    }
    
    void TriggerVisualCorruption() { }
    void TriggerAudioCorruption() { }
}
