/**
 * Location System for Destiny World
 * Manages dynamic locations: cities, subways, homes, caves, abandoned places
 * Features: hiding spots, environmental hazards, NPC generation, item discovery
 * 
 * @author AI Team - Destiny World
 * @version 2.0
 */

class LocationSystem {
  constructor(gameManager) {
    this.gameManager = gameManager;
    this.currentLocation = null;
    this.locations = new Map();
    this.hideSpots = new Map();
    this.NPCs = [];
    this.items = new Map();
    this.environmentalHazards = [];
    this.acousticMap = new Map(); // Sound propagation for AI tracking
    
    this.logger = new Logger('LocationSystem');
    this.initializeLocations();
  }

  /**
   * Initialize all game locations
   */
  initializeLocations() {
    // Location templates
    const locationData = [
      {
        id: 'downtown_city',
        name: 'Downtown City Center',
        type: 'urban',
        description: 'Busy downtown area with shops, offices, streets',
        area: 'large',
        riskLevel: 'medium',
        hideSpotCount: 8,
        npcDensity: 'high',
        soundAmplification: 1.2,
        neighbors: ['subway_main', 'apartment_complex', 'police_station']
      },
      {
        id: 'subway_main',
        name: 'Underground Subway Station',
        type: 'subway',
        description: 'Dark, echoing subway tunnels with trains',
        area: 'large',
        riskLevel: 'high',
        hideSpotCount: 12,
        npcDensity: 'medium',
        soundAmplification: 2.0,
        darkness: 0.8,
        neighbors: ['downtown_city', 'subway_tunnel_north', 'abandoned_station']
      },
      {
        id: 'residential_area',
        name: 'Residential Neighborhood',
        type: 'suburban',
        description: 'Quiet suburban homes with yards and streets',
        area: 'medium',
        riskLevel: 'low',
        hideSpotCount: 10,
        npcDensity: 'medium',
        soundAmplification: 0.8,
        neighbors: ['apartment_complex', 'park', 'school']
      },
      {
        id: 'abandoned_warehouse',
        name: 'Abandoned Industrial Warehouse',
        type: 'industrial',
        description: 'Huge warehouse with stacks, machinery, dark corners',
        area: 'very_large',
        riskLevel: 'high',
        hideSpotCount: 20,
        npcDensity: 'low',
        soundAmplification: 1.5,
        neighbors: ['industrial_district', 'subway_tunnel_north']
      },
      {
        id: 'forest_outskirts',
        name: 'Forest at City Outskirts',
        type: 'natural',
        description: 'Dense forest with trees, caves, wildlife',
        area: 'very_large',
        riskLevel: 'extreme',
        hideSpotCount: 25,
        npcDensity: 'very_low',
        soundAmplification: 0.6,
        darkness: 0.9,
        wildlife: true,
        neighbors: ['caves_system', 'abandoned_warehouse', 'rural_area']
      },
      {
        id: 'caves_system',
        name: 'Underground Cave System',
        type: 'cave',
        description: 'Massive caves with tunnels, underground lake, fossils',
        area: 'very_large',
        riskLevel: 'extreme',
        hideSpotCount: 30,
        npcDensity: 'none',
        soundAmplification: 1.8,
        darkness: 1.0,
        hazards: ['collapse', 'flooding'],
        neighbors: ['forest_outskirts', 'subway_tunnel_north']
      },
      {
        id: 'apartment_complex',
        name: 'Abandoned Apartment Building',
        type: 'residential',
        description: '20-story apartment building, many rooms',
        area: 'large',
        riskLevel: 'high',
        hideSpotCount: 40,
        npcDensity: 'low',
        soundAmplification: 0.7,
        floors: 20,
        neighbors: ['downtown_city', 'residential_area']
      }
    ];

    // Create location instances
    locationData.forEach(data => {
      const location = new Location(data);
      this.locations.set(data.id, location);
    });

    this.logger.success(`Initialized ${this.locations.size} locations`);
  }

  /**
   * Enter a new location
   */
  enterLocation(locationId) {
    const location = this.locations.get(locationId);
    if (!location) {
      this.logger.error(`Location not found: ${locationId}`);
      return false;
    }

    this.currentLocation = location;
    this.generateLocationContent();
    
    this.logger.log(`Entered: ${location.name}`);
    return {
      locationId,
      name: location.name,
      description: location.description,
      hideSpots: this.generateHideSpots(locationId, location.hideSpotCount),
      npcs: this.NPCs,
      items: Array.from(this.items.values()),
      hazards: this.environmentalHazards
    };
  }

  /**
   * Generate hide spots for current location
   */
  generateHideSpots(locationId, count) {
    const hideSpots = [];
    const hideSpotTypes = {
      'downtown_city': ['alley', 'store_closet', 'parked_car', 'building_roof', 'dumpster', 'basement', 'crowd'],
      'subway_main': ['train_car', 'tunnel_alcove', 'maintenance_room', 'platform_gap', 'track_tunnel', 'equipment_closet'],
      'abandoned_warehouse': ['container', 'stack', 'machinery', 'roof_beam', 'ventilation_shaft', 'office_room', 'loading_dock'],
      'forest_outskirts': ['tree', 'dense_bush', 'ravine', 'cave', 'fallen_logs', 'rock_formation'],
      'caves_system': ['side_chamber', 'under_rocks', 'water_cave', 'narrow_passage', 'ceiling_crack'],
      'apartment_complex': ['closet', 'bathroom', 'under_bed', 'bathtub', 'balcony', 'stairwell', 'elevator_shaft', 'wall_gap'],
      'residential_area': ['shed', 'garage', 'basement', 'attic', 'garden_shed', 'fence_gap', 'storm_drain']
    };

    const types = hideSpotTypes[locationId] || ['generic_spot'];

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      hideSpots.push({
        id: `hidespot_${locationId}_${i}`,
        name: this.getHideSpotName(type),
        type,
        effectiveness: this.getHideSpotEffectiveness(type, locationId),
        soundProof: this.isSpotSoundProof(type),
        riskOfDiscovery: Math.random() * 0.5,
        healthDamage: this.getHealthDamageFromHiding(type),
        playerVisible: Math.random() > 0.3
      });
    }

    this.hideSpots.set(locationId, hideSpots);
    return hideSpots;
  }

  /**
   * Generate NPCs for location
   */
  generateLocationContent() {
    this.NPCs = [];
    const npcCount = this.getNPCCountForLocation(this.currentLocation.npcDensity);

    for (let i = 0; i < npcCount; i++) {
      const npc = {
        id: `npc_${this.currentLocation.id}_${i}`,
        name: this.generateNPCName(),
        role: this.getRandomNPCRole(),
        attitude: Math.random() > 0.5 ? 'suspicious' : 'neutral',
        knowledge: this.getRandomKnowledge(),
        health: 100,
        position: this.getRandomPositionInLocation(),
        canHelp: Math.random() > 0.4,
        canBeLied: Math.random() > 0.3
      };
      this.NPCs.push(npc);
    }

    this.generateItems();
    this.addEnvironmentalHazards();
  }

  /**
   * Generate items scattered in location
   */
  generateItems() {
    this.items.clear();
    const itemTypes = [
      { type: 'weapon', subtype: ['knife', 'crowbar', 'pipe'], usefulAgainstKiller: true },
      { type: 'evidence', subtype: ['bloody_cloth', 'alien_artifact', 'victim_diary', 'police_file'], usefulForInvestigation: true },
      { type: 'utility', subtype: ['flashlight', 'rope', 'lock_pick', 'phone', 'first_aid_kit'] },
      { type: 'distraction', subtype: ['flare', 'noise_maker', 'chemical_compound'], helpfulForEscape: true },
      { type: 'information', subtype: ['newspaper', 'computer', 'security_footage', 'witness_statement'] }
    ];

    const itemCount = Math.floor(Math.random() * 5) + 3;
    for (let i = 0; i < itemCount; i++) {
      const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
      const subtype = itemType.subtype[Math.floor(Math.random() * itemType.subtype.length)];
      
      const item = {
        id: `item_${this.currentLocation.id}_${i}`,
        name: subtype,
        type: itemType.type,
        subtype,
        position: this.getRandomPositionInLocation(),
        value: Math.random() * 100,
        discovered: false,
        usedUp: false,
        ...itemType
      };
      this.items.set(item.id, item);
    }
  }

  /**
   * Add environmental hazards
   */
  addEnvironmentalHazards() {
    this.environmentalHazards = [];
    
    if (this.currentLocation.type === 'subway') {
      this.environmentalHazards.push({
        type: 'incoming_train',
        damage: 100,
        warning: 8000,
        avoidable: true
      });
    }

    if (this.currentLocation.hazards) {
      this.currentLocation.hazards.forEach(hazard => {
        this.environmentalHazards.push({
          type: hazard,
          damage: Math.random() * 50 + 25,
          warning: Math.random() * 10000 + 3000,
          avoidable: true
        });
      });
    }
  }

  /**
   * Hide in a specific spot
   */
  hideInSpot(hideSpotId) {
    const hideSpots = this.hideSpots.get(this.currentLocation.id);
    const spot = hideSpots?.find(s => s.id === hideSpotId);

    if (!spot) {
      return { success: false, message: 'Hide spot not found' };
    }

    return {
      success: true,
      spot: {
        id: spot.id,
        name: spot.name,
        effectiveness: spot.effectiveness,
        soundProof: spot.soundProof,
        riskOfDiscovery: spot.riskOfDiscovery,
        healthImpact: spot.healthDamage
      },
      message: `Hiding in ${spot.name}`,
      killersAwarenessReduction: spot.soundProof ? 0.7 : 0.4,
      playerVisibility: spot.playerVisible ? 0.3 : 0.05
    };
  }

  /**
   * Create sound event that propagates through location
   */
  createSoundEvent(location, intensity, frequency = 'loud') {
    const propagation = {
      locationId: location.id,
      intensity,
      frequency,
      amplification: location.soundAmplification,
      propagatesTo: location.neighbors,
      propagationDelay: 500
    };

    if (this.gameManager.alienKiller) {
      this.gameManager.alienKiller.onSoundDetected(propagation);
    }

    return propagation;
  }

  // Helper methods
  getRandomNPCRole() {
    const roles = ['civilian', 'police_officer', 'janitor', 'security_guard', 'homeless_person', 'witness', 'journalist', 'shopkeeper', 'doctor', 'investigator'];
    return roles[Math.floor(Math.random() * roles.length)];
  }

  generateNPCName() {
    const firstNames = ['Sarah', 'John', 'Maria', 'David', 'Lisa', 'James', 'Emma', 'Michael', 'Anna', 'Robert'];
    const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Garcia', 'Martinez', 'Taylor', 'Anderson', 'Thomas'];
    return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
  }

  getHideSpotEffectiveness(type, locationId) {
    const effectiveness = {
      'tree': 0.6, 'alley': 0.7, 'store_closet': 0.8, 'parked_car': 0.75,
      'train_car': 0.7, 'container': 0.85, 'bathtub': 0.4, 'closet': 0.8,
      'cave': 0.9, 'dense_bush': 0.75, 'tunnel_alcove': 0.8
    };
    return effectiveness[type] || 0.5;
  }

  isSpotSoundProof(type) {
    const soundProof = ['closet', 'store_closet', 'maintenance_room', 'bathroom', 'under_bed', 'bathtub', 'stairwell'];
    return soundProof.includes(type);
  }

  getHealthDamageFromHiding(type) {
    const damage = {
      'dumpster': 10, 'bathtub': 5, 'cave': 3, 'dense_bush': 2,
      'bathroom': 0, 'closet': 1, 'container': 5, 'tree': 2
    };
    return damage[type] || 0;
  }

  getNPCCountForLocation(density) {
    const counts = {
      'very_low': 1,
      'low': Math.floor(Math.random() * 2) + 2,
      'medium': Math.floor(Math.random() * 2) + 4,
      'high': Math.floor(Math.random() * 3) + 6,
      'none': 0
    };
    return counts[density] || 2;
  }

  getRandomKnowledge() {
    const knowledge = ['murder_rumors', 'strange_sightings', 'government_cover_up', 'alien_conspiracy', 'victim_information', 'killer_location', 'safe_haven_info', 'weapon_cache', 'police_investigation_details'];
    return knowledge.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  getRandomPositionInLocation() {
    return {
      x: Math.random() * 100 - 50,
      y: Math.random() * 20,
      z: Math.random() * 100 - 50
    };
  }

  getHideSpotName(type) {
    const names = {
      'alley': 'Dark Alley', 'store_closet': 'Storage Closet', 'parked_car': 'Abandoned Car', 'building_roof': 'Rooftop',
      'dumpster': 'Dumpster', 'basement': 'Basement', 'crowd': 'Crowd', 'train_car': 'Train Car',
      'tunnel_alcove': 'Tunnel Alcove', 'maintenance_room': 'Maintenance Room', 'platform_gap': 'Platform Gap', 'track_tunnel': 'Tunnel',
      'equipment_closet': 'Equipment Closet', 'container': 'Shipping Container', 'stack': 'Cargo Stack', 'machinery': 'Heavy Machinery',
      'roof_beam': 'Roof Beam', 'ventilation_shaft': 'Ventilation Shaft', 'office_room': 'Office Room', 'loading_dock': 'Loading Dock',
      'tree': 'Dense Tree', 'dense_bush': 'Dense Bushes', 'ravine': 'Ravine', 'cave': 'Cave Opening',
      'fallen_logs': 'Fallen Logs', 'rock_formation': 'Rock Formation', 'side_chamber': 'Side Chamber', 'under_rocks': 'Under Rocks',
      'water_cave': 'Water Cave', 'narrow_passage': 'Narrow Passage', 'ceiling_crack': 'Ceiling Crack', 'closet': 'Closet',
      'bathroom': 'Bathroom', 'under_bed': 'Under Bed', 'bathtub': 'Bathtub', 'balcony': 'Balcony',
      'stairwell': 'Stairwell', 'elevator_shaft': 'Elevator Shaft', 'wall_gap': 'Wall Gap', 'shed': 'Garden Shed',
      'garage': 'Garage', 'attic': 'Attic', 'garden_shed': 'Garden Shed', 'fence_gap': 'Fence Gap', 'storm_drain': 'Storm Drain'
    };
    return names[type] || 'Unknown Spot';
  }
}

class Location {
  constructor(data) {
    Object.assign(this, data);
  }
}

class PathfindingAI {
  constructor() {
    this.waypoints = [];
    this.currentWaypoint = 0;
  }
  
  getNextPosition() {
    this.currentWaypoint = (this.currentWaypoint + 1) % Math.max(this.waypoints.length, 1);
    return this.waypoints[this.currentWaypoint] || { x: 0, y: 0, z: 0 };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LocationSystem, Location, PathfindingAI };
}
