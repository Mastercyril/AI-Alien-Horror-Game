/**
 * VIVERSE Integration Module
 * Connects Destiny World to VIVERSE.com for cloud-based 3D gaming
 * Handles asset loading, scene synchronization, and multi-player ready architecture
 * 
 * @author AI Team - Destiny World Project
 * @version 2.0
 */

class VIVERSEIntegration {
  constructor(apiKey, gameInstanceId) {
    this.apiKey = apiKey;
    this.gameInstanceId = gameInstanceId;
    this.baseUrl = 'https://api.viverse.com/v1';
    this.scene = null;
    this.renderer = null;
    this.assetCache = new Map();
    this.connectionStatus = 'disconnected';
    this.syncInterval = null;
    this.lastSyncTime = 0;
    this.syncFrequency = 100; // ms between syncs
    
    // Performance monitoring
    this.metrics = {
      fps: 0,
      latency: 0,
      assetsLoaded: 0,
      npcsActive: 0
    };

    this.logger = new Logger('VIVERSEIntegration');
  }

  /**
   * Initialize VIVERSE connection and setup scene
   */
  async initialize() {
    try {
      this.logger.log('Initializing VIVERSE connection...');
      
      // Authenticate with VIVERSE
      await this.authenticate();
      
      // Create/get game instance on VIVERSE
      await this.createGameInstance();
      
      // Setup Three.js scene for VIVERSE rendering
      this.setupScene();
      
      // Start sync loop
      this.startSyncLoop();
      
      this.logger.success('VIVERSE integration ready');
      return true;
    } catch (error) {
      this.logger.error('VIVERSE initialization failed', error);
      return false;
    }
  }

  /**
   * Authenticate with VIVERSE API
   */
  async authenticate() {
    const response = await fetch(`${this.baseUrl}/auth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: this.apiKey,
        clientId: 'destiny-world-game'
      })
    });

    if (!response.ok) throw new Error('VIVERSE authentication failed');
    
    const data = await response.json();
    this.accessToken = data.token;
    this.connectionStatus = 'authenticated';
    this.logger.success('Authenticated with VIVERSE');
  }

  /**
   * Create or retrieve game instance on VIVERSE
   */
  async createGameInstance() {
    const response = await fetch(`${this.baseUrl}/instances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: JSON.stringify({
        gameId: 'destiny-world',
        name: 'Destiny World - Serial Killer Hunt',
        description: 'Investigation horror game with AI-driven alien killer',
        maxPlayers: 1,
        visibility: 'private',
        metadata: {
          genre: 'horror',
          mechanic: 'investigation',
          alienAI: true,
          countdownMechanic: true
        }
      })
    });

    if (!response.ok) throw new Error('Failed to create game instance');
    
    const instance = await response.json();
    this.instanceId = instance.id;
    this.instanceUrl = instance.url;
    this.connectionStatus = 'connected';
    this.logger.success(`Game instance created: ${this.instanceUrl}`);
  }

  /**
   * Setup Three.js scene for VIVERSE rendering
   */
  setupScene() {
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);
    this.scene.fog = new THREE.Fog(0x000000, 50, 500);

    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.camera.position.set(0, 1.6, 0); // Player eye height

    // Create WebGL renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      precision: 'highp'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

    // Add to DOM
    document.body.appendChild(this.renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    this.scene.add(directionalLight);

    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());

    this.logger.success('Scene setup complete');
  }

  /**
   * Start continuous sync loop with VIVERSE server
   */
  startSyncLoop() {
    this.syncInterval = setInterval(() => {
      this.syncGameState();
    }, this.syncFrequency);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene, this.camera);
      this.updateMetrics();
    };
    animate();
  }

  /**
   * Sync game state with VIVERSE cloud
   */
  async syncGameState() {
    const now = Date.now();
    if (now - this.lastSyncTime < this.syncFrequency) return;

    try {
      const gameState = {
        timestamp: now,
        playerPosition: this.camera.position.toArray(),
        activeNPCs: this.getActiveNPCs(),
        killerPosition: window.gameManager?.alienKiller?.position || null,
        countdownTimer: window.gameManager?.countdownTimer?.getRemainingTime() || 0,
        morality: window.gameManager?.playerMorality || 0,
        investigationProgress: window.gameManager?.investigationProgress || 0
      };

      const response = await fetch(`${this.baseUrl}/instances/${this.instanceId}/state`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify(gameState)
      });

      if (response.ok) {
        this.lastSyncTime = now;
        this.metrics.latency = Date.now() - now;
      }
    } catch (error) {
      this.logger.warn('State sync failed', error);
    }
  }

  /**
   * Load asset from VIVERSE CDN with caching
   */
  async loadAsset(assetId, type = 'model') {
    if (this.assetCache.has(assetId)) {
      return this.assetCache.get(assetId);
    }

    try {
      const url = `${this.baseUrl}/assets/${assetId}/download`;
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${this.accessToken}` }
      });

      if (!response.ok) throw new Error(`Asset load failed: ${assetId}`);

      let asset;
      if (type === 'model') {
        const arrayBuffer = await response.arrayBuffer();
        asset = this.parseModel(arrayBuffer);
      } else if (type === 'texture') {
        const blob = await response.blob();
        asset = await this.createTexture(blob);
      }

      this.assetCache.set(assetId, asset);
      this.metrics.assetsLoaded++;
      return asset;
    } catch (error) {
      this.logger.error(`Failed to load asset ${assetId}`, error);
      return null;
    }
  }

  /**
   * Parse 3D model from array buffer (supports .glb, .gltf)
   */
  parseModel(arrayBuffer) {
    // GLTFLoader integration
    const loader = new THREE.GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.parse(arrayBuffer, '', (gltf) => {
        resolve(gltf.scene);
      }, reject);
    });
  }

  /**
   * Create texture from blob
   */
  async createTexture(blob) {
    const url = URL.createObjectURL(blob);
    const texture = new THREE.TextureLoader().load(url);
    return texture;
  }

  /**
   * Get list of active NPCs in scene
   */
  getActiveNPCs() {
    return this.scene.children
      .filter(obj => obj.userData.isNPC)
      .map(npc => ({
        id: npc.userData.id,
        name: npc.userData.name,
        position: npc.position.toArray(),
        state: npc.userData.state
      }));
  }

  /**
   * Update performance metrics
   */
  updateMetrics() {
    // FPS calculation
    if (!this.lastFrameTime) this.lastFrameTime = Date.now();
    const now = Date.now();
    const delta = now - this.lastFrameTime;
    this.metrics.fps = Math.round(1000 / delta);
    this.lastFrameTime = now;
  }

  /**
   * Handle window resize
   */
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Publish event to other players/instances
   */
  async publishEvent(eventType, eventData) {
    try {
      await fetch(`${this.baseUrl}/instances/${this.instanceId}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        body: JSON.stringify({
          type: eventType,
          data: eventData,
          timestamp: Date.now()
        })
      });
    } catch (error) {
      this.logger.warn('Event publish failed', error);
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return { ...this.metrics };
  }

  /**
   * Cleanup and disconnect
   */
  disconnect() {
    clearInterval(this.syncInterval);
    this.renderer.dispose();
    this.logger.log('Disconnected from VIVERSE');
    this.connectionStatus = 'disconnected';
  }
}

class Logger {
  constructor(module) {
    this.module = module;
  }
  
  log(msg, data = '') {
    console.log(`[${this.module}] ${msg}`, data);
  }
  
  success(msg, data = '') {
    console.log(`%c[${this.module}] ✓ ${msg}`, 'color: #2ecc71', data);
  }
  
  error(msg, error) {
    console.error(`%c[${this.module}] ✗ ${msg}`, 'color: #e74c3c', error);
  }
  
  warn(msg, data = '') {
    console.warn(`%c[${this.module}] ⚠ ${msg}`, 'color: #f39c12', data);
  }
}

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { VIVERSEIntegration, Logger };
}
