// Base range configurations
export interface RangeConfig {
  min: number;
  max: number;
  default: number;
}

export interface MinMaxRange {
  min: number;
  max: number;
}

// Particle configurations
export interface ParticleConfig {
  progress: number;
  offset: number;
  size: number;
  speedX: number;
  hueOffset: number;
  brightness: number;
  parentLine: number;
  glow: boolean;
  exploding: boolean;
  explosionTime: number;
  explosionDuration: number;
  explosionDirection: number;
  explosionDistance: number;
  isPop: boolean;
  popDistance: number;
}

export interface RogueParticle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  verticalBounds: { min: number; max: number };
  updatePosition: (canvasWidth: number, canvasHeight: number) => void;
  draw: (ctx: CanvasRenderingContext2D, color: string) => void;
}

// Position configurations
export interface VerticalPosition {
  min: number;      // Percentage from top (0-100)
  max: number;      // Percentage from top (0-100)
  current: number;  // Current position
  default: number;  // Default position to return to
}

export interface VerticalBounds {
  min: number;      // Percentage from top (0-100)
  max: number;      // Percentage from top (0-100)
  default: number;  // Default position
}

// Wave configurations
export interface WaveLine {
  color: string;
  amplitude: number | {
    min: number;
    max: number;
    default: number;
  };
  frequency: number | {
    min: number;
    max: number;
    default: number;
  };
  speed: number;
  hue: number;
  lineWidth?: RangeConfig & {
    variation?: {
      frequency: number;
      speed: number;
    };
  };
  verticalPosition: VerticalPosition;
  parallaxIndex: number;
}

export interface RogueParticleConfig {
  count: number;
  speed: RangeConfig;
  size: MinMaxRange;
  opacity: MinMaxRange;
  color: string;
  verticalBounds: VerticalBounds;
}

export interface ExplosionConfig {
  duration: number;
  distance: RangeConfig;
  popProbability: number;
  popDistance: number;
}

export interface GravityWellConfig {
  enabled: boolean;
  x: number; // Percentage (0-100)
  y: number; // Percentage (0-100)
  strength: number; // 0-2
  radius: number; // pixels
}

export interface RoamingConfig {
  enabled: boolean;
  speed: number; // 0-2
  range: number; // pixels
}

// Base configuration interface
export interface BaseConfig {
  speed: RangeConfig & {
    relaxed: number;  // Initial relaxed speed
  };
  particleSpeed: RangeConfig;
  amplitude: RangeConfig;
  frequency: RangeConfig;
  lineWidth: RangeConfig;
  glow: {
    probability: number;
    blur: RangeConfig;
    brightness: RangeConfig;
  };
  particles: {
    perLine: RangeConfig;
    size: RangeConfig;
    range: RangeConfig;
    hueVariation: RangeConfig;
  };
  rogueParticles: {
    count: RangeConfig;
    speed: RangeConfig;
    size: MinMaxRange;
    opacity: MinMaxRange;
    verticalBounds: RangeConfig;
  };
  parallax: {
    baseFactor: RangeConfig;
    exponential: RangeConfig;
    smoothing: RangeConfig;
    scrollDirection: {
      multiplier: number;
    };
  };
  stableProperties: {
    glow: boolean;
    hue: boolean;
    brightness: boolean;
  };
  lines: WaveLine[];
  lineSpeeds: {
    front: number;
    middle: number;
    back: number;
  };
}

// Wave particle configuration
export interface WaveParticleConfig {
  canvasWidthFactor: number;
  canvasHeightFactor: number;
  lineWidth: number;
  lines: WaveLine[];
  particlesPerLine: number;
  particleSize: RangeConfig;
  particleSpeed: RangeConfig;
  particleRange: RangeConfig;
  glowProbability: number;
  rogueParticles: RogueParticleConfig;
  explosion: ExplosionConfig;
  scrollY: number;
  parallaxFactor: number;
  parallaxSmoothing: number;
  backgroundColor: string;
  gravityWell?: GravityWellConfig;
  roaming?: RoamingConfig;
  // Dynamic config support - allows runtime updates
  _dynamic?: {
    enabled: boolean;
    lastUpdate?: number;
  };
}

// Animation state
export interface WaveState {
  verticalOffset: number;
  targetOffset: number;
  speed: number;
  growthProgress: number; // 0 to 1, controls how much of the wave has grown
  growthDirection: 'left' | 'right'; // Direction the wave grows from
  growthSpeed: number; // Speed at which the wave grows (0-1 per frame)
}

export interface AnimationState {
  offset: number;
  particles: ParticleConfig[];
  rogueParticles: RogueParticle[];
  waveStates: WaveState[];
  lastScrollY: number;
  lastTime: number;
  frameCount: number;
  fps: number;
  fpsInterval: number;
  startTime: number;
  now: number;
  then: number;
  elapsed: number;
  animationFrame: number;
}

// Theme configurations
export interface ThemeLineConfig {
  color: string;
  hue: number;
}

export interface ThemeRogueParticleConfig {
  color: string;
}

export interface ThemeGlowConfig {
  probability: number;
  blur: RangeConfig;
  brightness: RangeConfig;
}

export interface WaveThemeConfig {
  backgroundColor: string;
  lines: ThemeLineConfig[];
  rogueParticles: ThemeRogueParticleConfig;
  glow: ThemeGlowConfig;
}
