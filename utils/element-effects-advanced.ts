import type { ElementEffectConfig } from '@/hooks/useElementEffects';

/**
 * Advanced Element Effects Integration Guide
 * 
 * This module provides TypeScript interfaces and utilities for integrating
 * element effects with complex component systems and state management.
 */

/**
 * Configuration for element effect groups (multiple elements with effects)
 */
export interface ElementEffectGroupConfig {
  name: string;
  description?: string;
  effects: {
    selector: string; // CSS selector for targeting
    config: ElementEffectConfig;
  }[];
}

/**
 * Effect trigger that responds to application state
 */
export interface StateTriggeredEffect {
  selector: string;
  config: ElementEffectConfig;
  trigger: (state: any) => boolean; // Function that returns true when effect should activate
  onTrigger?: (element: HTMLElement) => void;
}

/**
 * Lifecycle-aware effect configuration
 */
export interface LifecycleAwareEffect {
  mount?: ElementEffectConfig;      // Effect when component mounts
  focus?: ElementEffectConfig;       // Effect on focus
  hover?: ElementEffectConfig;       // Effect on hover
  active?: ElementEffectConfig;      // Effect while active
  disabled?: ElementEffectConfig;    // Effect when disabled
  unmount?: ElementEffectConfig;     // Effect when unmounting
}

/**
 * Theme-specific effect configurations
 */
export interface ThemeAwareEffects {
  light: ElementEffectConfig;
  dark: ElementEffectConfig;
  highContrast?: ElementEffectConfig;
}

/**
 * Create effects that adapt to the current theme
 */
export function createThemeAwareEffect(configs: ThemeAwareEffects, currentTheme: 'light' | 'dark'): ElementEffectConfig {
  return configs[currentTheme] || configs.light;
}

/**
 * Semantic effect presets organized by use case
 */
export const SEMANTIC_EFFECTS = {
  // Form validation
  form: {
    valid: {
      particleHue: 120,
      glowIntensity: 0.7,
      particleSize: 1.5,
    } as ElementEffectConfig,
    invalid: {
      particleHue: 0,
      glowIntensity: 0.9,
      particleSize: 2,
    } as ElementEffectConfig,
    warning: {
      particleHue: 40,
      glowIntensity: 0.8,
      particleSize: 1.8,
    } as ElementEffectConfig,
  },

  // Loading states
  loading: {
    subtle: {
      emitOnHover: true,
      particlesPerEvent: 1,
      particleHue: 200,
      glowIntensity: 0.5,
    } as ElementEffectConfig,
    active: {
      emitOnHover: true,
      particlesPerEvent: 3,
      particleHue: 200,
      glowIntensity: 0.8,
    } as ElementEffectConfig,
  },

  // User interaction feedback
  feedback: {
    confirm: {
      emitOnClick: true,
      particleHue: 120,
      particlesPerEvent: 8,
      glowIntensity: 1.0,
    } as ElementEffectConfig,
    cancel: {
      emitOnClick: true,
      particleHue: 0,
      particlesPerEvent: 6,
      glowIntensity: 0.9,
    } as ElementEffectConfig,
    copy: {
      emitOnClick: true,
      particleHue: 280,
      particlesPerEvent: 5,
      glowIntensity: 0.8,
    } as ElementEffectConfig,
  },

  // Accessibility
  accessibility: {
    focusIndicator: {
      emitOnFocus: true,
      particlesPerEvent: 3,
      particleHue: 240,
      glowIntensity: 1.0,
      duration: 200,
    } as ElementEffectConfig,
    keyboardAccess: {
      emitOnClick: true,
      particlesPerEvent: 4,
      particleHue: 60,
      glowIntensity: 0.9,
    } as ElementEffectConfig,
  },

  // Data states
  data: {
    empty: {
      emitOnHover: true,
      particlesPerEvent: 2,
      particleHue: 240,
      glowIntensity: 0.4,
    } as ElementEffectConfig,
    loading: {
      emitOnHover: true,
      particlesPerEvent: 4,
      particleHue: 200,
      glowIntensity: 0.7,
    } as ElementEffectConfig,
    error: {
      emitOnHover: true,
      particlesPerEvent: 6,
      particleHue: 0,
      glowIntensity: 0.9,
    } as ElementEffectConfig,
    success: {
      emitOnHover: true,
      particlesPerEvent: 5,
      particleHue: 120,
      glowIntensity: 0.8,
    } as ElementEffectConfig,
  },
};

/**
 * Animation effect libraries for specific patterns
 */
export const ANIMATION_PATTERNS = {
  // Button state machines
  buttonStates: {
    idle: { scale: 1, rotate: 0 } as const,
    hover: { scale: 1.02, rotate: 0 } as const,
    active: { scale: 0.98, rotate: -2 } as const,
    loading: { scale: 1, rotate: 360 } as const,
    disabled: { scale: 0.95, rotate: 0 } as const,
  },

  // Input focus effects
  inputFocus: {
    idle: { scale: 1, rotate: 0 } as const,
    focused: { scale: 1, rotate: 0 } as const,
    filled: { scale: 1.01, rotate: 0 } as const,
    error: { scale: 1, rotate: 2 } as const,
  },

  // Card interactions
  cardInteractions: {
    idle: { scale: 1, rotate: 0 } as const,
    hover: { scale: 1.03, rotate: 1 } as const,
    selected: { scale: 1.05, rotate: 0 } as const,
  },
};

/**
 * Convert animation pattern to ElementEffectConfig
 */
export function createEffectFromPattern(
  pattern: typeof ANIMATION_PATTERNS.buttonStates[keyof typeof ANIMATION_PATTERNS.buttonStates],
  baseConfig: ElementEffectConfig
): ElementEffectConfig {
  return {
    ...baseConfig,
    scaleOnInteract: pattern.scale,
    rotateOnInteract: pattern.rotate,
  };
}

/**
 * Responsive effect configuration - adjust based on viewport
 */
export interface ResponsiveEffectConfig {
  mobile: ElementEffectConfig;
  tablet: ElementEffectConfig;
  desktop: ElementEffectConfig;
}

export function getResponsiveEffect(
  config: ResponsiveEffectConfig,
  viewport: 'mobile' | 'tablet' | 'desktop'
): ElementEffectConfig {
  return config[viewport];
}

/**
 * Performance-conscious effect for low-end devices
 */
export const PERFORMANCE_PRESETS = {
  high: {
    particlesPerEvent: 8,
    glowIntensity: 1.0,
    duration: 300,
  } as Partial<ElementEffectConfig>,
  
  medium: {
    particlesPerEvent: 4,
    glowIntensity: 0.7,
    duration: 200,
  } as Partial<ElementEffectConfig>,
  
  low: {
    particlesPerEvent: 2,
    glowIntensity: 0.4,
    duration: 100,
  } as Partial<ElementEffectConfig>,
};

/**
 * Get performance preset based on device capabilities
 */
export function getPerformancePreset(fps: number): keyof typeof PERFORMANCE_PRESETS {
  if (fps >= 55) return 'high';
  if (fps >= 30) return 'medium';
  return 'low';
}

/**
 * Combine multiple effects with priority-based selection
 */
export function combineEffects(
  primary: ElementEffectConfig,
  secondary: ElementEffectConfig,
  tertiary?: ElementEffectConfig
): ElementEffectConfig {
  return {
    ...primary,
    ...secondary,
    ...(tertiary || {}),
  };
}

/**
 * Create disabled state effect - reduced visual prominence
 */
export function createDisabledEffect(baseConfig: ElementEffectConfig): ElementEffectConfig {
  return {
    ...baseConfig,
    emitOnHover: false,
    emitOnClick: false,
    glowIntensity: (baseConfig.glowIntensity ?? 1) * 0.3,
    particlesPerEvent: Math.max(1, (baseConfig.particlesPerEvent ?? 3) / 2),
  };
}

/**
 * Create loading animation effect
 */
export function createLoadingEffect(baseConfig: ElementEffectConfig): ElementEffectConfig {
  return {
    ...baseConfig,
    emitOnHover: true,
    emitOnClick: false,
    particlesPerEvent: 2,
    particleLifetime: 1200,
    rotateOnInteract: 360,
    duration: 1000,
  };
}

/**
 * Effect composition for complex interactions
 */
export class EffectComposer {
  private effects: Map<string, ElementEffectConfig> = new Map();

  add(name: string, config: ElementEffectConfig): this {
    this.effects.set(name, config);
    return this;
  }

  remove(name: string): this {
    this.effects.delete(name);
    return this;
  }

  get(name: string): ElementEffectConfig | undefined {
    return this.effects.get(name);
  }

  merge(...names: string[]): ElementEffectConfig {
    const merged: ElementEffectConfig = {};
    names.forEach((name) => {
      const config = this.effects.get(name);
      if (config) {
        Object.assign(merged, config);
      }
    });
    return merged;
  }

  all(): ElementEffectConfig[] {
    return Array.from(this.effects.values());
  }
}

/**
 * Example usage of EffectComposer
 */
export const exampleComposer = new EffectComposer()
  .add('base', { emitOnClick: true, particlesPerEvent: 5 })
  .add('emphasis', { scaleOnInteract: 1.1, duration: 300 })
  .add('glow', { glowIntensity: 0.9 });

// Get combined effect: merges 'base', 'emphasis', and 'glow' configurations
export const composedEffect = exampleComposer.merge('base', 'emphasis', 'glow');
