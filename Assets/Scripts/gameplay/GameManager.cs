// GameManager.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from COMPLETE_UNITY_SCRIPTS_FIXED.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using UnityEngine.SceneManagement;
using System.Collections.Generic;
using System;

/// <summary>
/// Central game state manager. Handles:
/// - Game flow (play/pause/over/win)
/// - Sanity system
/// - Fragment tracking
/// - Score and stats
/// </summary>
public class GameManager : MonoBehaviour
{
    // Singleton
    public static GameManager Instance { get; private set; }
    
    // Game Parameters
    [SerializeField] private int maxSanity = 100;
    [SerializeField] private float sanityDecayRate = 0.5f;
    [SerializeField] private AudioClip ambientHorrorLoop;
    [SerializeField] private float gameOverDelay = 2f;
    
    // State variables
    private int currentSanity;
    private float gameTime;
    private bool isPaused = false;
    private bool isGameOver = false;
    private int totalScore = 0;
    private Dictionary<string, bool> fragmentsCollected = new Dictionary<string, bool>();
    
    // Events
    public event Action OnGameOver;
    public event Action OnGameWon;
    public event Action<int> OnSanityChanged;
    public event Action<int> OnFragmentCollected;
    
    private void Awake()
    {
        // Singleton pattern
        if (Instance != null && Instance != this)
        {
            Destroy(gameObject);
            return;
        }
        Instance = this;
        DontDestroyOnLoad(gameObject);
    }
    
    private void Start()
    {
        currentSanity = maxSanity;
        gameTime = 0f;
        
        // Initialize audio
        AudioSource audioSource = GetComponent<AudioSource>();
        if (audioSource == null)
        {
            audioSource = gameObject.AddComponent<AudioSource>();
        }
        
        if (ambientHorrorLoop != null)
        {
            audioSource.clip = ambientHorrorLoop;
            audioSource.loop = true;
            audioSource.volume = 0.3f;
            audioSource.Play();
        }
        
        Debug.Log("GameManager initialized. Game started.");
    }
    
    private void Update()
    {
        if (!isPaused && !isGameOver)
        {
            gameTime += Time.deltaTime;
            
            // Natural sanity decay over time
            if (Time.time % 2f < Time.deltaTime) // Every 2 seconds
            {
                DecreaseSanity(1);
            }
        }
    }
    
    /// <summary>
    /// Decrease player sanity
    /// </summary>
    public void DecreaseSanity(int amount = 1)
    {
        if (isGameOver) return;
        
        int oldSanity = currentSanity;
        currentSanity = Mathf.Max(0, currentSanity - amount);
        
        OnSanityChanged?.Invoke(currentSanity);
        
        Debug.Log($"Sanity: {oldSanity} -> {currentSanity}");
        
        if (currentSanity <= 0)
        {
            GameOver("SANITY_BREAKDOWN");
        }
    }
    
    /// <summary>
    /// Increase player sanity (safe rooms, etc)
    /// </summary>
    public void IncreaseSanity(int amount = 5)
    {
        currentSanity = Mathf.Min(maxSanity, currentSanity + amount);
        OnSanityChanged?.Invoke(currentSanity);
    }
    
    /// <summary>
    /// Collect a game fragment
    /// </summary>
    public void CollectFragment(string fragmentId)
    {
        if (isGameOver) return;
        if (fragmentsCollected.ContainsKey(fragmentId)) return;
        
        fragmentsCollected[fragmentId] = true;
        int collected = fragmentsCollected.Count;
        totalScore += 100;
        
        OnFragmentCollected?.Invoke(collected);
        
        Debug.Log($"Fragment collected: {fragmentId}. Total: {collected}/8. Score: {totalScore}");
        
        // Check win condition
        if (collected >= 8)
        {
            GameWon();
        }
    }
    
    /// <summary>
    /// Game over - player death
    /// </summary>
    public void GameOver(string deathReason = "ALIEN_ENCOUNTER")
    {
        if (isGameOver) return;
        
        isGameOver = true;
        isPaused = true;
        Time.timeScale = 0f;
        
        Debug.Log($"GAME OVER: {deathReason} | Score: {totalScore} | Time: {gameTime:F1}s");
        
        OnGameOver?.Invoke();
        
        Invoke(nameof(LoadGameOverScene), gameOverDelay);
    }
    
    /// <summary>
    /// Game won - all fragments collected
    /// </summary>
    public void GameWon()
    {
        if (isGameOver) return;
        
        isGameOver = true;
        isPaused = true;
        Time.timeScale = 0f;
        totalScore += (int)gameTime * 10; // Time bonus
        
        Debug.Log($"GAME WON! Final Score: {totalScore}");
        
        OnGameWon?.Invoke();
        
        Invoke(nameof(LoadWinScene), gameOverDelay);
    }
    
    /// <summary>
    /// Toggle pause state
    /// </summary>
    public void TogglePause()
    {
        if (isGameOver) return;
        
        isPaused = !isPaused;
        Time.timeScale = isPaused ? 0f : 1f;
        Debug.Log($"Game {(isPaused ? "PAUSED" : "RESUMED")}");
    }
    
    // Getters
    public int GetCurrentSanity() => currentSanity;
    public int GetMaxSanity() => maxSanity;
    public float GetSanityPercent() => (float)currentSanity / maxSanity;
    public float GetGameTime() => gameTime;
    public int GetFragmentsCollected() => fragmentsCollected.Count;
    public bool IsGameOver() => isGameOver;
    public bool IsPaused() => isPaused;
    public int GetScore() => totalScore;
    
    private void LoadGameOverScene()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("GameOverScene");
    }
    
    private void LoadWinScene()
    {
        Time.timeScale = 1f;
        SceneManager.LoadScene("WinScene");
    }
    
    private void OnDestroy()
    {
        Time.timeScale = 1f;
    }
}
