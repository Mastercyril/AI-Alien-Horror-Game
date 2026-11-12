// UIManager.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from COMPLETE_UNITY_SCRIPTS_FIXED.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using UnityEngine.UI;
using System;

/// <summary>
/// Manages all HUD elements:
/// - Sanity bar
/// - Fragment counter
/// - Status text
/// - Pause menu
/// </summary>
public class UIManager : MonoBehaviour
{
    [SerializeField] private Image sanityBar;
    [SerializeField] private Text sanityText;
    [SerializeField] private Text fragmentCounter;
    [SerializeField] private Text statusText;
    [SerializeField] private Image cornerCorruption;
    [SerializeField] private CanvasGroup pauseMenuGroup;
    
    private GameManager gameManager;
    private bool menuVisible = false;
    
    private void Start()
    {
        gameManager = GameManager.Instance;
        
        if (gameManager != null)
        {
            gameManager.OnSanityChanged += UpdateSanityBar;
            gameManager.OnFragmentCollected += UpdateFragmentCounter;
        }
        
        if (pauseMenuGroup != null)
            pauseMenuGroup.alpha = 0;
    }
    
    private void Update()
    {
        if (gameManager == null) return;
        
        UpdateStatusDisplay();
        UpdateCorruptionEffect();
    }
    
    private void UpdateSanityBar(int sanity)
    {
        if (sanityBar != null)
        {
            float percent = (float)sanity / gameManager.GetMaxSanity();
            sanityBar.fillAmount = percent;
            
            // Color gradient: green -> red
            sanityBar.color = Color.Lerp(Color.red, Color.green, percent);
        }
        
        if (sanityText != null)
            sanityText.text = $"{sanity}%";
    }
    
    private void UpdateFragmentCounter(int collected)
    {
        if (fragmentCounter != null)
            fragmentCounter.text = $"Fragments: {collected}/8";
    }
    
    private void UpdateStatusDisplay()
    {
        if (statusText != null)
        {
            float time = gameManager.GetGameTime();
            int sanity = gameManager.GetCurrentSanity();
            statusText.text = $"Time: {time:F1}s | Sanity: {sanity}%";
        }
    }
    
    private void UpdateCorruptionEffect()
    {
        if (cornerCorruption == null) return;
        
        float sanityPercent = gameManager.GetSanityPercent();
        float corruption = Mathf.Clamp01(1f - sanityPercent);
        
        cornerCorruption.color = new Color(1, 0, 0, corruption * 0.5f);
    }
    
    public void TogglePauseMenu()
    {
        menuVisible = !menuVisible;
        
        if (pauseMenuGroup != null)
        {
            pauseMenuGroup.alpha = menuVisible ? 1 : 0;
            pauseMenuGroup.interactable = menuVisible;
        }
    }
    
    private void OnDestroy()
    {
        if (gameManager != null)
        {
            gameManager.OnSanityChanged -= UpdateSanityBar;
            gameManager.OnFragmentCollected -= UpdateFragmentCounter;
        }
    }
}
