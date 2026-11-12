// AlienAI.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from COMPLETE_UNITY_SCRIPTS_FIXED.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using UnityEngine.AI;
using System.Collections.Generic;
using System;

/// <summary>
/// AI controller for the alien hunter.
/// Implements adaptive behavior tree:
/// - Patrol → Search → Chase → Ambush
/// - Learns from player behavior
/// - Psychological profiling
/// </summary>
public class AlienAI : MonoBehaviour
{
    [SerializeField] private float detectionRange = 30f;
    [SerializeField] private float searchSpeed = 4f;
    [SerializeField] private float chaseSpeed = 8f;
    [SerializeField] private float updateInterval = 0.5f;
    [SerializeField] private AudioClip[] tauntClips;
    
    private enum AIState { Patrol, Search, Chase, Ambush, Retreat }
    
    // Components
    private NavMeshAgent agent;
    private GameManager gameManager;
    private PlayerController player;
    private AudioSource audioSource;
    
    // State
    private AIState currentState = AIState.Patrol;
    private Vector3 lastKnownPlayerPos;
    private float lastUpdateTime;
    
    // Learning
    private float aggressionLevel = 0.5f;
    private int hideSpotFrequency = 0;
    private List<Vector3> frequentHidingSpots = new List<Vector3>();
    private Dictionary<string, int> playerBehaviors = new Dictionary<string, int>();
    
    // Patrol points
    private List<Vector3> patrolPoints = new List<Vector3>();
    private int currentPatrolIndex = 0;
    
    private void Start()
    {
        agent = GetComponent<NavMeshAgent>();
        gameManager = GameManager.Instance;
        player = FindObjectOfType<PlayerController>();
        audioSource = GetComponent<AudioSource>();
        
        if (agent == null)
            Debug.LogError("NavMeshAgent not found on alien!");
        if (player == null)
            Debug.LogError("PlayerController not found in scene!");
        
        InitializePatrolPoints();
    }
    
    private void Update()
    {
        if (gameManager == null || gameManager.IsGameOver())
            return;
        
        // Update AI logic at intervals
        if (Time.time - lastUpdateTime >= updateInterval)
        {
            UpdateAILogic();
            lastUpdateTime = Time.time;
        }
        
        ExecuteCurrentState();
    }
    
    private void UpdateAILogic()
    {
        if (player == null) return;
        
        float distanceToPlayer = Vector3.Distance(transform.position, player.GetPosition());
        float playerNoiseLevel = player.GetNoiseLevel();
        bool playerHiding = player.IsHiding();
        
        // Detection logic
        float detectionChance = (1f - playerHiding ? 0f : 1f) * (playerNoiseLevel * 0.5f + (1f - distanceToPlayer / detectionRange));
        
        if (distanceToPlayer < detectionRange && !playerHiding && UnityEngine.Random.value < detectionChance)
        {
            lastKnownPlayerPos = player.GetPosition();
            
            // Close range = chase
            if (distanceToPlayer < 10f)
            {
                currentState = AIState.Chase;
                aggressionLevel = Mathf.Min(1f, aggressionLevel + 0.1f);
            }
            // Medium range = search
            else
            {
                currentState = AIState.Search;
                aggressionLevel = Mathf.Min(0.8f, aggressionLevel + 0.05f);
            }
        }
        else if (playerHiding)
        {
            hideSpotFrequency++;
            
            // If player hides frequently, check there
            if (hideSpotFrequency > 2 && Vector3.Distance(transform.position, lastKnownPlayerPos) < 15f)
            {
                currentState = AIState.Ambush;
            }
            else
            {
                currentState = AIState.Search;
            }
        }
        else
        {
            // Return to patrol
            currentState = AIState.Patrol;
            aggressionLevel = Mathf.Max(0.3f, aggressionLevel - 0.02f);
        }
        
        // Psychological effect on player
        if (currentState == AIState.Chase)
        {
            gameManager.DecreaseSanity((int)(aggressionLevel * 3));
        }
    }
    
    private void ExecuteCurrentState()
    {
        switch (currentState)
        {
            case AIState.Patrol:
                Patrol();
                break;
            case AIState.Search:
                Search();
                break;
            case AIState.Chase:
                Chase();
                break;
            case AIState.Ambush:
                Ambush();
                break;
            case AIState.Retreat:
                Retreat();
                break;
        }
    }
    
    private void Patrol()
    {
        if (agent.remainingDistance < 1f)
        {
            currentPatrolIndex = (currentPatrolIndex + 1) % patrolPoints.Count;
        }
        agent.speed = searchSpeed * 0.5f;
        agent.SetDestination(patrolPoints[currentPatrolIndex]);
    }
    
    private void Search()
    {
        agent.speed = searchSpeed;
        if (lastKnownPlayerPos != Vector3.zero)
        {
            agent.SetDestination(lastKnownPlayerPos);
        }
    }
    
    private void Chase()
    {
        agent.speed = chaseSpeed * (0.8f + aggressionLevel * 0.4f);
        
        if (player != null)
        {
            agent.SetDestination(player.GetPosition());
            
            // Taunt occasionally
            if (UnityEngine.Random.value < aggressionLevel * 0.05f)
            {
                PlayTaunt();
            }
        }
    }
    
    private void Ambush()
    {
        // Wait near last known position
        agent.speed = 0.5f;
        agent.SetDestination(lastKnownPlayerPos);
    }
    
    private void Retreat()
    {
        // Run to patrol point
        agent.speed = chaseSpeed * 1.2f;
        agent.SetDestination(patrolPoints[0]);
    }
    
    private void InitializePatrolPoints()
    {
        // Generate patrol points around spawn
        Vector3 center = transform.position;
        patrolPoints.Add(center + Vector3.right * 20);
        patrolPoints.Add(center + Vector3.forward * 20);
        patrolPoints.Add(center - Vector3.right * 20);
        patrolPoints.Add(center - Vector3.forward * 20);
    }
    
    private void PlayTaunt()
    {
        if (audioSource != null && tauntClips.Length > 0)
        {
            AudioClip clip = tauntClips[UnityEngine.Random.Range(0, tauntClips.Length)];
            audioSource.PlayOneShot(clip);
        }
    }
    
    public AIState GetCurrentState() => currentState;
    public float GetAggressionLevel() => aggressionLevel;
}
