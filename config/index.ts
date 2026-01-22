// Re-export from dedicated config files
export { BASE_CONFIG, DEFAULT_WAVE_CONFIG } from './wave.config';
export { WAVE_COLORS, THEME_COLORS, CATEGORIES, OPACITY, withOpacity } from './colors.config';
export { 
  DEFAULT_VISUAL_EFFECTS, 
  PERFORMANCE_VISUAL_EFFECTS, 
  MINIMAL_VISUAL_EFFECTS, 
  ULTRA_VISUAL_EFFECTS,
  type VisualEffectsConfig,
  type ParticleTrailConfig,
  type ChromaticAberrationConfig,
  type AtmosphericDepthConfig,
  type ConstellationPatternsConfig,
  type ParticleEvolutionConfig,
  type WaveInterferenceConfig,
  type WaveTextureVariationConfig,
  type CausticReflectionsConfig,
  type NebulaBackgroundConfig,
  type GridFieldVisualizationConfig,
  type BloomGlareConfig,
  type DistortionFieldsConfig,
  type ParticleHaloConfig
} from './visual-effects.config';
