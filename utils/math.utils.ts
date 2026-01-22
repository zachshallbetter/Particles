import type { RangeConfig } from '@/types/wave.types';

/**
 * Get numeric value from a value that could be a number or a RangeConfig object
 */
export const getNumericValue = (
  value: number | RangeConfig | { min: number; max: number; default: number }
): number => {
  if (typeof value === 'number') {
    return value;
  }
  return value.default;
};

/**
 * Clamp a value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation between two values
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

/**
 * Map a value from one range to another
 */
export const mapRange = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number => {
  return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
};

/**
 * Generate a random number within a range
 */
export const randomInRange = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Generate a random integer within a range (inclusive)
 */
export const randomIntInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Ease in-out function for smooth transitions
 */
export const easeInOut = (t: number): number => {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
};

/**
 * Calculate distance between two points
 */
export const distance = (x1: number, y1: number, x2: number, y2: number): number => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
};
