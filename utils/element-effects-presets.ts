import type { ElementEffectConfig } from '@/hooks/useElementEffects';

/**
 * Preset effect configurations for common UI elements
 */

/**
 * Energetic button effect - particles burst outward on click
 */
export const BUTTON_PRESET_ENERGETIC: ElementEffectConfig = {
  emitOnClick: true,
  particlesPerEvent: 8,
  particleHue: 280,
  particleSize: 2,
  particleLifetime: 1500,
  particleVelocity: 3,
  particleSpread: 360,
  glowIntensity: 1.0,
  scaleOnInteract: 1.08,
  rotateOnInteract: 5,
  duration: 200,
};

/**
 * Subtle hover effect - gentle particles and glow
 */
export const BUTTON_PRESET_SUBTLE: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 2,
  particleHue: 200,
  particleSize: 1.5,
  particleLifetime: 800,
  particleVelocity: 1,
  particleSpread: 30,
  glowIntensity: 0.5,
  scaleOnInteract: 1.02,
  duration: 150,
};

/**
 * Mystical effect - larger particles with high glow
 */
export const BUTTON_PRESET_MYSTICAL: ElementEffectConfig = {
  emitOnClick: true,
  emitOnHover: true,
  particlesPerEvent: 5,
  particleHue: 260,
  particleSize: 3,
  particleLifetime: 2000,
  particleVelocity: 2.5,
  particleSpread: 45,
  glowIntensity: 0.9,
  scaleOnInteract: 1.1,
  rotateOnInteract: 10,
  duration: 300,
};

/**
 * Submit button effect - explosive green particles
 */
export const BUTTON_PRESET_SUBMIT: ElementEffectConfig = {
  emitOnClick: true,
  particlesPerEvent: 12,
  particleHue: 120,
  particleSize: 2.5,
  particleLifetime: 1800,
  particleVelocity: 3.5,
  particleSpread: 360,
  glowIntensity: 1.1,
  scaleOnInteract: 1.15,
  rotateOnInteract: 15,
  duration: 250,
};

/**
 * Danger/delete button effect - aggressive red particles
 */
export const BUTTON_PRESET_DANGER: ElementEffectConfig = {
  emitOnClick: true,
  emitOnHover: true,
  particlesPerEvent: 10,
  particleHue: 0,
  particleSize: 2,
  particleLifetime: 1500,
  particleVelocity: 3,
  particleSpread: 360,
  glowIntensity: 0.95,
  scaleOnInteract: 1.12,
  rotateOnInteract: 8,
  duration: 280,
};

/**
 * Input field effect - particles on focus/input
 */
export const INPUT_PRESET_FOCUS: ElementEffectConfig = {
  emitOnFocus: true,
  particlesPerEvent: 4,
  particleHue: 180,
  particleSize: 1,
  particleLifetime: 1000,
  particleVelocity: 2,
  particleSpread: 360,
  glowIntensity: 0.7,
  scaleOnInteract: 1.01,
  duration: 100,
};

/**
 * Card/container effect - subtle animation on hover
 */
export const CARD_PRESET_HOVER: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 3,
  particleHue: 220,
  particleSize: 1.5,
  particleLifetime: 1200,
  particleVelocity: 1.5,
  particleSpread: 90,
  glowIntensity: 0.6,
  scaleOnInteract: 1.02,
  duration: 200,
};

/**
 * Text link effect - directional particles toward cursor
 */
export const LINK_PRESET_DIRECTIONAL: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 3,
  particleHue: 40,
  particleSize: 1.2,
  particleLifetime: 900,
  particleVelocity: 2,
  particleSpread: 45,
  glowIntensity: 0.7,
  scaleOnInteract: 1.05,
  duration: 150,
};

/**
 * Success notification effect - green particles
 */
export const NOTIFICATION_PRESET_SUCCESS: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 6,
  particleHue: 140,
  particleSize: 2,
  particleLifetime: 1600,
  particleVelocity: 2,
  particleSpread: 180,
  glowIntensity: 0.85,
  scaleOnInteract: 1.02,
  duration: 200,
};

/**
 * Warning notification effect - orange particles
 */
export const NOTIFICATION_PRESET_WARNING: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 5,
  particleHue: 35,
  particleSize: 1.8,
  particleLifetime: 1400,
  particleVelocity: 1.8,
  particleSpread: 180,
  glowIntensity: 0.8,
  duration: 180,
};

/**
 * Error notification effect - red particles
 */
export const NOTIFICATION_PRESET_ERROR: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 7,
  particleHue: 0,
  particleSize: 1.8,
  particleLifetime: 1500,
  particleVelocity: 2.2,
  particleSpread: 180,
  glowIntensity: 0.9,
  duration: 200,
};

/**
 * Hero/header ambient effect - continuous subtle particles
 */
export const HERO_PRESET_AMBIENT: ElementEffectConfig = {
  emitOnHover: true,
  particlesPerEvent: 2,
  particleHue: 300,
  particleSize: 2,
  particleLifetime: 2500,
  particleVelocity: 1,
  particleSpread: 360,
  glowIntensity: 0.4,
  scaleOnInteract: 1.01,
  duration: 100,
};

/**
 * Utility function to merge effect presets
 */
export function mergeEffects(
  baseEffect: ElementEffectConfig,
  overrides: Partial<ElementEffectConfig>
): ElementEffectConfig {
  return {
    ...baseEffect,
    ...overrides,
  };
}

/**
 * Utility function to create a random effect with variation
 */
export function createRandomEffect(
  baseEffect: ElementEffectConfig,
  variation: number = 0.2
): ElementEffectConfig {
  const randomize = (value: number | undefined) => {
    if (value === undefined) return undefined;
    const variance = value * variation;
    return value + (Math.random() - 0.5) * variance * 2;
  };

  return {
    ...baseEffect,
    particlesPerEvent: Math.round(randomize(baseEffect.particlesPerEvent) || 3),
    particleHue: ((randomize(baseEffect.particleHue) || 0) + 360) % 360,
    particleSize: Math.max(0.5, randomize(baseEffect.particleSize) || 1.5),
    particleLifetime: Math.round(randomize(baseEffect.particleLifetime) || 1500),
    particleVelocity: Math.max(0.1, randomize(baseEffect.particleVelocity) || 2),
    glowIntensity: Math.max(0, Math.min(1, randomize(baseEffect.glowIntensity) || 0.8)),
    scaleOnInteract: Math.max(1, randomize(baseEffect.scaleOnInteract) || 1.05),
  };
}

/**
 * Utility function to create gradient effects transitioning between hues
 */
export function createGradientEffect(
  baseEffect: ElementEffectConfig,
  startHue: number,
  endHue: number,
  steps: number
): ElementEffectConfig[] {
  const effects: ElementEffectConfig[] = [];
  
  for (let i = 0; i < steps; i++) {
    const progress = steps === 1 ? 0 : i / (steps - 1);
    const currentHue = startHue + (endHue - startHue) * progress;
    
    effects.push(
      mergeEffects(baseEffect, {
        particleHue: ((currentHue % 360) + 360) % 360,
      })
    );
  }
  
  return effects;
}

/**
 * Utility function to apply a callback when specific effects trigger
 */
export function createCallbackEffect(
  baseEffect: ElementEffectConfig,
  callback: (type: 'hover' | 'click' | 'focus') => void
): ElementEffectConfig {
  return {
    ...baseEffect,
    onHover: baseEffect.emitOnHover ? () => callback('hover') : undefined,
    onClick: baseEffect.emitOnClick ? () => callback('click') : undefined,
    onFocus: baseEffect.emitOnFocus ? () => callback('focus') : undefined,
  };
}

/**
 * Semantic effect themes for common use cases
 */
export const EFFECT_THEMES = {
  // Action buttons
  action: BUTTON_PRESET_ENERGETIC,
  primary: BUTTON_PRESET_ENERGETIC,
  secondary: BUTTON_PRESET_SUBTLE,
  
  // Form elements
  input: INPUT_PRESET_FOCUS,
  textField: INPUT_PRESET_FOCUS,
  
  // Containers
  card: CARD_PRESET_HOVER,
  container: CARD_PRESET_HOVER,
  
  // Status indicators
  success: NOTIFICATION_PRESET_SUCCESS,
  error: NOTIFICATION_PRESET_ERROR,
  warning: NOTIFICATION_PRESET_WARNING,
  
  // Navigation
  link: LINK_PRESET_DIRECTIONAL,
  navigation: LINK_PRESET_DIRECTIONAL,
  
  // Special
  mystical: BUTTON_PRESET_MYSTICAL,
  ambient: HERO_PRESET_AMBIENT,
} as const;

/**
 * Get effect by semantic name
 */
export function getThemeEffect(name: keyof typeof EFFECT_THEMES): ElementEffectConfig {
  return EFFECT_THEMES[name];
}
