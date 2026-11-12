// PlayerController.cs
// Destiny's World: The Ancient One — Unity game script.
// Extracted from COMPLETE_UNITY_SCRIPTS_FIXED.md into the repo by scripts/extract-unity-scripts.mjs.

using UnityEngine;
using UnityEngine.InputSystem;
using System;

/// <summary>
/// Handles player movement, interaction, and input.
/// First-person perspective with stealth mechanics.
/// </summary>
public class PlayerController : MonoBehaviour
{
    // Movement
    [SerializeField] private float walkSpeed = 5f;
    [SerializeField] private float sprintSpeed = 10f;
    [SerializeField] private float crouchSpeed = 2.5f;
    [SerializeField] private float groundDrag = 5f;
    
    // Look
    [SerializeField] private float mouseXSensitivity = 2f;
    [SerializeField] private float mouseYSensitivity = 2f;
    [SerializeField] private float maxLookAngle = 90f;
    
    // Stealth
    [SerializeField] private float maxNoiseDistance = 50f;
    [SerializeField] private float groundLayerMask;
    
    // Components
    private CharacterController characterController;
    private Camera mainCamera;
    private GameManager gameManager;
    
    // State
    private float verticalLookRotation = 0f;
    private Vector3 velocity = Vector3.zero;
    private bool isCrouching = false;
    private bool isHiding = false;
    private bool isGrounded = true;
    private float noiseLevel = 0f;
    private HidingSpot currentHidingSpot;
    
    // Input
    private InputAction moveAction;
    private InputAction lookAction;
    private InputAction sprintAction;
    private InputAction crouchAction;
    private InputAction interactAction;
    private InputAction pauseAction;
    
    // Events
    public event Action<float> OnNoiseChanged;
    public event Action<bool> OnHidingChanged;
    
    private void Start()
    {
        // Get components
        characterController = GetComponent<CharacterController>();
        mainCamera = GetComponentInChildren<Camera>();
        gameManager = GameManager.Instance;
        
        if (characterController == null)
            Debug.LogError("CharacterController not found on player!");
        if (mainCamera == null)
            Debug.LogError("Camera not found on player!");
        if (gameManager == null)
            Debug.LogError("GameManager not found in scene!");
        
        // Setup input
        SetupInputActions();
        
        // Lock and hide cursor
        Cursor.lockState = CursorLockMode.Locked;
    }
    
    private void SetupInputActions()
    {
        if (TryGetComponent<PlayerInput>(out var playerInput))
        {
            var actions = playerInput.actions;
            moveAction = actions["Move"];
            lookAction = actions["Look"];
            sprintAction = actions["Sprint"];
            crouchAction = actions["Crouch"];
            interactAction = actions["Interact"];
            pauseAction = actions["Pause"];
        }
        else
        {
            Debug.LogWarning("PlayerInput component not found. Using keyboard fallback.");
        }
    }
    
    private void Update()
    {
        if (gameManager.IsGameOver() || gameManager.IsPaused())
            return;
        
        // Check ground
        CheckGround();
        
        // Process input
        HandleMovement();
        HandleLook();
        HandleActions();
        UpdateNoiseLevel();
    }
    
    private void CheckGround()
    {
        isGrounded = characterController.isGrounded;
        
        if (isGrounded && velocity.y < 0)
            velocity.y = -2f;
    }
    
    private void HandleMovement()
    {
        Vector3 moveDirection = Vector3.zero;
        
        if (moveAction != null)
        {
            Vector2 moveInput = moveAction.ReadValue<Vector2>();
            moveDirection = (transform.right * moveInput.x + transform.forward * moveInput.y).normalized;
        }
        
        // Determine speed
        float currentSpeed = walkSpeed;
        
        if (isCrouching)
        {
            currentSpeed = crouchSpeed;
            gameManager.DecreaseSanity(0); // Crouch is safe
        }
        else if (sprintAction != null && sprintAction.IsPressed() && moveDirection.magnitude > 0)
        {
            currentSpeed = sprintSpeed;
            gameManager.DecreaseSanity(1); // Sprinting increases fear
        }
        
        moveDirection *= currentSpeed;
        
        // Apply gravity
        velocity.y += Physics.gravity.y * Time.deltaTime;
        moveDirection.y = velocity.y;
        
        // Move character
        characterController.Move(moveDirection * Time.deltaTime);
    }
    
    private void HandleLook()
    {
        if (lookAction != null)
        {
            Vector2 lookInput = lookAction.ReadValue<Vector2>();
            
            // Horizontal rotation
            transform.Rotate(Vector3.up * lookInput.x * mouseXSensitivity);
            
            // Vertical rotation
            verticalLookRotation -= lookInput.y * mouseYSensitivity;
            verticalLookRotation = Mathf.Clamp(verticalLookRotation, -maxLookAngle, maxLookAngle);
            
            mainCamera.transform.localRotation = Quaternion.Euler(verticalLookRotation, 0, 0);
        }
    }
    
    private void HandleActions()
    {
        // Crouch toggle
        if (crouchAction != null && crouchAction.WasPressedThisFrame())
        {
            isCrouching = !isCrouching;
        }
        
        // Interact
        if (interactAction != null && interactAction.WasPressedThisFrame())
        {
            HandleInteraction();
        }
        
        // Pause
        if (pauseAction != null && pauseAction.WasPressedThisFrame())
        {
            gameManager.TogglePause();
        }
    }
    
    private void HandleInteraction()
    {
        RaycastHit hit;
        Ray ray = new Ray(mainCamera.transform.position, mainCamera.transform.forward);
        
        if (Physics.Raycast(ray, out hit, 3f))
        {
            GameObject hitObject = hit.collider.gameObject;
            
            // Fragment
            if (hitObject.CompareTag("Fragment"))
            {
                Fragment fragment = hitObject.GetComponent<Fragment>();
                if (fragment != null)
                {
                    fragment.Collect();
                }
            }
            
            // Hiding spot
            else if (hitObject.CompareTag("HidingSpot"))
            {
                HidingSpot hidingSpot = hitObject.GetComponent<HidingSpot>();
                if (hidingSpot != null)
                {
                    SetHiding(!isHiding, hidingSpot);
                }
            }
        }
    }
    
    private void UpdateNoiseLevel()
    {
        float targetNoise = 0.3f; // Default: crouching
        
        if (!isCrouching)
        {
            if (sprintAction != null && sprintAction.IsPressed())
                targetNoise = 1f; // Max: sprinting
            else
                targetNoise = 0.6f; // Medium: walking
        }
        
        noiseLevel = Mathf.Lerp(noiseLevel, targetNoise, Time.deltaTime * 5f);
        OnNoiseChanged?.Invoke(noiseLevel);
    }
    
    private void SetHiding(bool hiding, HidingSpot spot)
    {
        isHiding = hiding;
        currentHidingSpot = hiding ? spot : null;
        
        if (spot != null)
            spot.SetPlayerHiding(hiding);
        
        OnHidingChanged?.Invoke(hiding);
    }
    
    // Getters
    public float GetNoiseLevel() => noiseLevel;
    public bool IsHiding() => isHiding;
    public bool IsCrouching() => isCrouching;
    public Vector3 GetPosition() => transform.position;
    public Vector3 GetForward() => transform.forward;
}
