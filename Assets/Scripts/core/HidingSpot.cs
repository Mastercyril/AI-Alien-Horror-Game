// HidingSpot.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from COMPLETE_UNITY_SCRIPTS_FIXED.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;

/// <summary>
/// Hiding spot for player to conceal from alien.
/// Reduces noise and prevents detection.
/// </summary>
public class HidingSpot : MonoBehaviour
{
    [SerializeField] private float concealment = 0.95f; // 95% reduction
    [SerializeField] private Material hiddenMaterial;
    private Material originalMaterial;
    private bool playerHiding = false;
    
    private void Start()
    {
        if (GetComponent<Collider>() == null)
            gameObject.AddComponent<BoxCollider>();
        
        GetComponent<Collider>().isTrigger = true;
        gameObject.tag = "HidingSpot";
        
        // Store original material
        Renderer renderer = GetComponent<Renderer>();
        if (renderer != null)
            originalMaterial = renderer.material;
    }
    
    public void SetPlayerHiding(bool hiding)
    {
        playerHiding = hiding;
        
        if (hiding && hiddenMaterial != null)
        {
            GetComponent<Renderer>().material = hiddenMaterial;
        }
        else if (originalMaterial != null)
        {
            GetComponent<Renderer>().material = originalMaterial;
        }
    }
    
    public bool IsPlayerHiding() => playerHiding;
    public float GetConcealmentValue() => playerHiding ? concealment : 0f;
}
