import { BaseConfig, WaveParticleConfig } from '../types/wave.types';
import { THEME_COLORS, WAVE_COLORS } from './colors.config';

// Base configuration that applies to both themes
export const BASE_CONFIG: BaseConfig = {
  speed: {
    min: 0.005,
    max: 0.03,
    default: 0.01,
    relaxed: 0.01
  },
  particleSpeed: {
    min: 0.1,
    max: 0.4,
    default: 0.3
  },
  amplitude: {
    min: 10,
    max: 50,
    default: 30
  },
  frequency: {
    min: 0.01,
    max: 0.06,
    default: 0.02
  },
  lineWidth: {
    min: 0.5,
    max: 2,
    default: 2
  },
  glow: {
    probability: 0.15,
    blur: {
      min: 5,
      max: 15,
      default: 10
    },
    brightness: {
      min: 0.6,
      max: 1.0,
      default: 0.8
    }
  },
  particles: {
    perLine: {
      min: 50,
      max: 150,
      default: 100
    },
    size: {
      min: 1,
      max: 3.5,
      default: 2
    },
    range: {
      min: 15,
      max: 40,
      default: 25
    },
    hueVariation: {
      min: 5,
      max: 30,
      default: 15
    }
  },
  rogueParticles: {
    count: {
      min: 10,
      max: 150,
      default: 80
    },
    speed: {
      min: 0.1,
      max: 0.5,
      default: 0.3
    },
    size: {
      min: 0.5,
      max: 4
    },
    opacity: {
      min: 0.2,
      max: 0.8
    },
    verticalBounds: {
      min: 0,
      max: 100,
      default: 50
    }
  },
  parallax: {
    baseFactor: {
      min: 0.05,
      max: 0.3,
      default: 0.15
    },
    exponential: {
      min: 1.2,
      max: 2.5,
      default: 1.8
    },
    smoothing: {
      min: 0.05,
      max: 0.2,
      default: 0.1
    },
    scrollDirection: {
      multiplier: -1
    }
  },
  stableProperties: {
    glow: true,
    hue: true,
    brightness: true
  },
  lines: [
    {
      color: WAVE_COLORS.primary.base,
      amplitude: 50,
      frequency: 0.015,
      speed: 0.5,
      hue: 348,
      verticalPosition: {
        min: 30,
        max: 70,
        current: 10,
        default: 10
      },
      parallaxIndex: 2
    },
    {
      color: WAVE_COLORS.secondary.base,
      amplitude: 30,
      frequency: 0.015,
      speed: 0.3,
      hue: 204,
      verticalPosition: {
        min: 20,
        max: 80,
        current: 10,
        default: 10
      },
      parallaxIndex: 1
    },
    {
      color: WAVE_COLORS.tertiary.base,
      amplitude: 20,
      frequency: 0.05,
      speed: 0.7,
      hue: 180,
      verticalPosition: {
        min: 20,
        max: 90,
        current: 10,
        default: 10
      },
      parallaxIndex: 0
    }
    // Quaternary (yellow) wave disabled temporarily
    // {
    //   color: '#FFD700',
    //   amplitude: 35,
    //   frequency: 0.025,
    //   speed: 0.4,
    //   hue: 60,
    //   verticalPosition: {
    //     min: 25,
    //     max: 75,
    //     current: 25,
    //     default: 50
    //   },
    //   parallaxIndex: 3
    // }
  ],
  lineSpeeds: {
    front: 0.5,
    middle: 0.3,
    back: 0.7
  }
};

// Default wave particle configuration
export const DEFAULT_WAVE_CONFIG: WaveParticleConfig = {
  canvasWidthFactor: 1.0,
  canvasHeightFactor: 1.0,
  lineWidth: BASE_CONFIG.lineWidth.default,
  lines: BASE_CONFIG.lines.map(line => ({
    ...line,
    amplitude: typeof line.amplitude === 'number' ? {
      min: line.amplitude,
      max: line.amplitude,
      default: line.amplitude
    } : line.amplitude,
    frequency: typeof line.frequency === 'number' ? {
      min: line.frequency,
      max: line.frequency,
      default: line.frequency
    } : line.frequency
  })),
  particlesPerLine: BASE_CONFIG.particles.perLine.default,
  particleSize: BASE_CONFIG.particles.size,
  particleSpeed: BASE_CONFIG.particleSpeed,
  particleRange: BASE_CONFIG.particles.range,
  glowProbability: BASE_CONFIG.glow.probability,
  rogueParticles: {
    count: BASE_CONFIG.rogueParticles.count.default,
    speed: BASE_CONFIG.rogueParticles.speed,
    size: BASE_CONFIG.rogueParticles.size,
    opacity: BASE_CONFIG.rogueParticles.opacity,
    color: THEME_COLORS.dark.text.primary.default,
    verticalBounds: BASE_CONFIG.rogueParticles.verticalBounds
  },
  explosion: {
    duration: 1000,
    distance: {
      min: 30,
      max: 70,
      default: 50
    },
    popProbability: 0.1,
    popDistance: 40
  },
  scrollY: 0,
  parallaxFactor: BASE_CONFIG.parallax.baseFactor.default,
  parallaxSmoothing: BASE_CONFIG.parallax.smoothing.default,
  backgroundColor: THEME_COLORS.dark.background
};
