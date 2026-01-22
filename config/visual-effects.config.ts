import { RangeConfig } from '../types/wave.types';

// Visual Effects Configuration
// All visual enhancements are configurable and toggleable from here

export interface ParticleTrailConfig {
  enabled: boolean;
  maxTrailLength: number; // Number of previous positions to track
  fadeSpeed: number; // 0-1, how quickly trails fade
  glowIntensity: number; // 0-1, brightness of trail
  width: number; // Trail line width
}

export interface ChromaticAberrationConfig {
  enabled: boolean;
  intensity: number; // 0-1, how much color separation
  minDensity: number; // Min particle density to trigger effect
  wavelength: number; // Distance between color channels in pixels
}

export interface AtmosphericDepthConfig {
  enabled: boolean;
  fogIntensity: number; // 0-1, fog opacity
  fogColor: string; // Hex color
  bokehBlur: number; // 0-30, blur radius for background
  vignetteStrength: number; // 0-1, vignette darkness
}

export interface ConstellationPatternsConfig {
  enabled: boolean;
  minClusterSize: number; // Min particles to form constellation
  connectionDistance: number; // Max distance to connect particles
  lineOpacity: number; // 0-1, constellation line opacity
  nodeSize: number; // Size of node points
  rotationSpeed: number; // 0-1, speed of orbital rings
}

export interface ParticleEvolutionConfig {
  enabled: boolean;
  maxAge: number; // Time in ms before particle ages
  saturationFade: boolean; // Fade color saturation over time
  growthRate: number; // How fast particles grow when absorbed
  maxGrowth: number; // Max size multiplier (1.5 = 50% larger)
  fusionEnabled: boolean; // Allow particle merging
  fusionDistance: number; // Distance threshold for merging
}

export interface WaveInterferenceConfig {
  enabled: boolean;
  sampleDistance: number; // Pixels between samples
  detectionRange: number; // How close waves must be to detect interference
  glowIntensity: number; // 0-1, interference glow brightness
  radius: number; // Glow radius in pixels
  moirePattern: boolean; // Show moiré effects
}

export interface WaveTextureVariationConfig {
  enabled: boolean;
  particleChains: boolean; // Render waves as particle chains
  energyPulses: boolean; // Show energy flowing along waves
  pulseSpeed: number; // 0-1, speed of energy pulses
  pulseSize: number; // Size of pulse dots
  breathing: boolean; // Wave amplitude breathing
  breathingCycle: number; // Milliseconds for full cycle
}

export interface CausticReflectionsConfig {
  enabled: boolean;
  causticOpacity: number; // 0-1
  causticScale: number; // Size of caustic patterns
  lensFlareEnabled: boolean;
  lensFlareSize: number;
  rainbowDispersion: boolean;
  rainbowSpread: number; // 0-1
}

export interface NebulaBackgroundConfig {
  enabled: boolean;
  gradientLayers: number; // 2-5, number of overlapping gradients
  gradientSpeed: number; // 0-0.5, how fast gradients move
  starField: boolean;
  starCount: number;
  starParallax: number; // 0-1, parallax effect
  auroraEffects: boolean;
}

export interface GridFieldVisualizationConfig {
  enabled: boolean;
  gridType: 'hexagonal' | 'square' | 'voronoi'; // Grid pattern type
  gridOpacity: number; // 0-0.3, should be subtle
  gridWarp: boolean; // Warp grid near gravity wells
  fieldLines: boolean; // Show electromagnetic field lines
  cellColor: string; // Grid color
}

export interface BloomGlareConfig {
  enabled: boolean;
  hdrBloom: boolean;
  bloomIntensity: number; // 0-1
  bloomRadius: number; // Pixels
  lensFlareStreaks: boolean;
  godRaysEnabled: boolean;
  godRayIntensity: number; // 0-1
}

export interface DistortionFieldsConfig {
  enabled: boolean;
  heatHaze: boolean;
  heatHazeIntensity: number; // 0-1
  gravitationalLensing: boolean;
  lensingStrength: number; // 0-1
  pixelDisplacement: boolean;
  displacementAmount: number; // 0-5 pixels
}

export interface ParticleHaloConfig {
  enabled: boolean;
  baseSize: number; // Base halo radius multiplier
  velocityScale: boolean; // Scale halo with particle velocity
  coronaDischarge: boolean; // Electric corona effects
  coronaDistance: number; // Distance to detect opposite colors
  solarWind: boolean; // Streaming effects when moving fast
  streamLength: number; // Length of solar wind streams
}

/**
 * Configuration for large particle behavior and lifecycle events
 */
export interface LargeParticleConfig {
  enabled: boolean; // Master toggle - disable entire large particle system
  
  // Size thresholds
  minMassForLarge: number; // Minimum mass to be considered "large" (default 1.3)
  maxSize: number; // Maximum size before degradation triggers
  minSize: number; // Minimum size before particle is removed
  
  // Degradation and lifecycle
  degradationRate: number; // Mass loss per millisecond (0.0001)
  degradationAcceleration: boolean; // Accelerate degradation over time
  maxLifetime: number; // Max lifetime in ms before forced removal (0 = infinite)
  
  // Size-based effects
  coronaEnabled: boolean; // Show repulsion zone corona
  coronaMinMass: number; // Minimum mass to show corona
  coronaMaxRadius: number; // Maximum corona radius at high mass
  coronaPulseSpeed: number; // Speed of breathing effect (ms per cycle)
  
  glowEnabled: boolean; // Size-based halo glow
  glowScaleWithSize: boolean; // Halo size proportional to particle size
  glowMaxIntensity: number; // Maximum glow intensity (0-1)
  
  // Behavioral effects based on size
  repulsionEnabled: boolean; // Particles push others away
  repulsionForce: number; // Force multiplier for repulsion
  repulsionRadius: number; // Radius of repulsion influence
  
  // Visual modifiers based on size
  saturationBoost: boolean; // Larger particles have more saturated colors
  saturationMax: number; // Maximum saturation (50-100)
  opacityBoost: boolean; // Larger particles are more opaque
  opacityMax: number; // Maximum opacity (0.5-1.0)
  
  // Size-dependent speed modifications
  dragIncreaseWithSize: boolean; // Larger particles drag more
  gravityReduction: boolean; // Larger particles less affected by gravity
}


export interface VisualEffectsConfig {
  // Master toggle for all visual effects
  enabled: boolean;

  // Individual effect configs
  particleTrails: ParticleTrailConfig;
  chromaticAberration: ChromaticAberrationConfig;
  atmosphericDepth: AtmosphericDepthConfig;
  constellationPatterns: ConstellationPatternsConfig;
  particleEvolution: ParticleEvolutionConfig;
  waveInterference: WaveInterferenceConfig;
  waveTextureVariation: WaveTextureVariationConfig;
  causticReflections: CausticReflectionsConfig;
  nebulaBackground: NebulaBackgroundConfig;
  gridFieldVisualization: GridFieldVisualizationConfig;
  bloomGlare: BloomGlareConfig;
  distortionFields: DistortionFieldsConfig;
  particleHalos: ParticleHaloConfig;
  largeParticles: LargeParticleConfig;

  // Global settings
  overallIntensity: number; // 0-1, multiplier for all effects
  performanceMode: boolean; // Disable expensive effects
}

// Default visual effects configuration
export const DEFAULT_VISUAL_EFFECTS: VisualEffectsConfig = {
  enabled: true,

  particleTrails: {
    enabled: false, // Disabled - no tails
    maxTrailLength: 0,
    fadeSpeed: 0.1,
    glowIntensity: 0.0,
    width: 0
  },

  chromaticAberration: {
    enabled: true,
    intensity: 0.15,
    minDensity: 3,
    wavelength: 3
  },

  atmosphericDepth: {
    enabled: false,
    fogIntensity: 0.08,
    fogColor: '#000000',
    bokehBlur: 8,
    vignetteStrength: 0.15
  },

  constellationPatterns: {
    enabled: true,
    minClusterSize: 5,
    connectionDistance: 80,
    lineOpacity: 0.3,
    nodeSize: 2,
    rotationSpeed: 0.2
  },

  particleEvolution: {
    enabled: false, // Disabled by default - too chaotic
    maxAge: 1000,
    saturationFade: false,
    growthRate: 0.01,
    maxGrowth: 1.5,
    fusionEnabled: false,
    fusionDistance: 25
  },

  waveInterference: {
    enabled: true,
    sampleDistance: 40,
    detectionRange: 12,
    glowIntensity: 0.12,
    radius: 18,
    moirePattern: false
  },

  waveTextureVariation: {
    enabled: true,
    particleChains: false,
    energyPulses: true,
    pulseSpeed: 0.3,
    pulseSize: 2,
    breathing: true,
    breathingCycle: 4000
  },

  causticReflections: {
    enabled: false, // Expensive effect, disabled by default
    causticOpacity: 0.1,
    causticScale: 40,
    lensFlareEnabled: true,
    lensFlareSize: 15,
    rainbowDispersion: true,
    rainbowSpread: 0.5
  },

  nebulaBackground: {
    enabled: false, // Disabled - causing visual artifacts
    gradientLayers: 3,
    gradientSpeed: 0.05,
    starField: true,
    starCount: 100,
    starParallax: 0.3,
    auroraEffects: false
  },

  gridFieldVisualization: {
    enabled: false, // Optional overlay
    gridType: 'hexagonal',
    gridOpacity: 0.1,
    gridWarp: true,
    fieldLines: true,
    cellColor: '#00FFFF'
  },

  bloomGlare: {
    enabled: false, // Disabled by default - can be very intense
    hdrBloom: true,
    bloomIntensity: 0.4,
    bloomRadius: 10,
    lensFlareStreaks: false,
    godRaysEnabled: false,
    godRayIntensity: 0.1
  },

  distortionFields: {
    enabled: false, // Disabled by default - too subtle when enabled
    heatHaze: false,
    heatHazeIntensity: 0.05,
    gravitationalLensing: false,
    lensingStrength: 0.08,
    pixelDisplacement: false,
    displacementAmount: 1
  },

  particleHalos: {
    enabled: true,
    baseSize: 2,
    velocityScale: true,
    coronaDischarge: false,
    coronaDistance: 60,
    solarWind: false,
    streamLength: 20
  },

  largeParticles: {
    enabled: true,
    minMassForLarge: 1.5,
    maxSize: 6,
    minSize: 0.4,
    degradationRate: 0.00015,
    degradationAcceleration: false,
    maxLifetime: 0, // Infinite by default
    coronaEnabled: false, // Disabled by default - subtle effect
    coronaMinMass: 1.5,
    coronaMaxRadius: 40,
    coronaPulseSpeed: 1500,
    glowEnabled: true,
    glowScaleWithSize: true,
    glowMaxIntensity: 0.5,
    repulsionEnabled: true,
    repulsionForce: 0.8,
    repulsionRadius: 35,
    saturationBoost: false, // Disabled by default
    saturationMax: 80,
    opacityBoost: false, // Disabled by default
    opacityMax: 0.8,
    dragIncreaseWithSize: false,
    gravityReduction: false
  },

  overallIntensity: 0.8,
  performanceMode: false
};

// Performance-optimized preset (fewer expensive effects)
export const PERFORMANCE_VISUAL_EFFECTS: VisualEffectsConfig = {
  ...DEFAULT_VISUAL_EFFECTS,
  performanceMode: true,
  particleTrails: { ...DEFAULT_VISUAL_EFFECTS.particleTrails, enabled: false },
  atmosphericDepth: { ...DEFAULT_VISUAL_EFFECTS.atmosphericDepth, bokehBlur: 0 },
  causticReflections: { ...DEFAULT_VISUAL_EFFECTS.causticReflections, enabled: false },
  gridFieldVisualization: { ...DEFAULT_VISUAL_EFFECTS.gridFieldVisualization, enabled: false },
  bloomGlare: { ...DEFAULT_VISUAL_EFFECTS.bloomGlare, enabled: false },
  largeParticles: { ...DEFAULT_VISUAL_EFFECTS.largeParticles, coronaEnabled: false }
};

// Minimal preset (only essential effects)
export const MINIMAL_VISUAL_EFFECTS: VisualEffectsConfig = {
  ...DEFAULT_VISUAL_EFFECTS,
  particleTrails: { ...DEFAULT_VISUAL_EFFECTS.particleTrails, enabled: false },
  chromaticAberration: { ...DEFAULT_VISUAL_EFFECTS.chromaticAberration, enabled: false },
  atmosphericDepth: { ...DEFAULT_VISUAL_EFFECTS.atmosphericDepth, enabled: false },
  constellationPatterns: { ...DEFAULT_VISUAL_EFFECTS.constellationPatterns, enabled: false },
  waveInterference: { ...DEFAULT_VISUAL_EFFECTS.waveInterference, enabled: false },
  causticReflections: { ...DEFAULT_VISUAL_EFFECTS.causticReflections, enabled: false },
  nebulaBackground: { ...DEFAULT_VISUAL_EFFECTS.nebulaBackground, enabled: false },
  gridFieldVisualization: { ...DEFAULT_VISUAL_EFFECTS.gridFieldVisualization, enabled: false },
  bloomGlare: { ...DEFAULT_VISUAL_EFFECTS.bloomGlare, enabled: false },
  largeParticles: { ...DEFAULT_VISUAL_EFFECTS.largeParticles, enabled: false },
  distortionFields: { ...DEFAULT_VISUAL_EFFECTS.distortionFields, enabled: false }
};

// Ultra preset (all effects enabled at high intensity)
export const ULTRA_VISUAL_EFFECTS: VisualEffectsConfig = {
  ...DEFAULT_VISUAL_EFFECTS,
  enabled: true,
  particleTrails: { ...DEFAULT_VISUAL_EFFECTS.particleTrails, enabled: true, glowIntensity: 0.9 },
  chromaticAberration: { ...DEFAULT_VISUAL_EFFECTS.chromaticAberration, enabled: true, intensity: 0.3 },
  atmosphericDepth: { ...DEFAULT_VISUAL_EFFECTS.atmosphericDepth, enabled: true, fogIntensity: 0.15 },
  constellationPatterns: { ...DEFAULT_VISUAL_EFFECTS.constellationPatterns, enabled: true },
  causticReflections: { ...DEFAULT_VISUAL_EFFECTS.causticReflections, enabled: true },
  nebulaBackground: { ...DEFAULT_VISUAL_EFFECTS.nebulaBackground, enabled: true },
  gridFieldVisualization: { ...DEFAULT_VISUAL_EFFECTS.gridFieldVisualization, enabled: true },
  bloomGlare: { ...DEFAULT_VISUAL_EFFECTS.bloomGlare, enabled: true, bloomIntensity: 1.0 },
  overallIntensity: 1.2
};
