// Fragment.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from COMPLETE_UNITY_SCRIPTS_FIXED.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using System;

/// <summary>
/// Collectible fragment item.
/// Objective: collect all 8 fragments to win.
/// </summary>
public class Fragment : MonoBehaviour
{
    [SerializeField] private string fragmentId;
    [SerializeField] private AudioClip collectSound;
    private GameManager gameManager;
    private bool collected = false;
    
    public event Action OnFragmentCollected;
    
    private void Start()
    {
        gameManager = GameManager.Instance;
        gameObject.tag = "Fragment";
        
        if (string.IsNullOrEmpty(fragmentId))
            fragmentId = $"Fragment_{Random.Range(1000, 9999)}";
        
        // Add glow effect
        GetComponent<Renderer>().material.color = Color.cyan;
    }
    
    public void Collect()
    {
        if (collected) return;
        collected = true;
        
        gameManager.CollectFragment(fragmentId);
        
        if (collectSound != null)
        {
            AudioSource.PlayClipAtPoint(collectSound, transform.position);
        }
        
        OnFragmentCollected?.Invoke();
        Destroy(gameObject);
    }
    
    public string GetFragmentId() => fragmentId;
    public bool IsCollected() => collected;
}
