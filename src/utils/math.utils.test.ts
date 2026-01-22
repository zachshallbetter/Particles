import { describe, it, expect } from 'vitest';
import {
  clamp,
  lerp,
  mapRange,
  random,
  randomInt,
  degToRad,
  radToDeg,
  distance,
  normalize,
  dot,
  cross,
} from './math.utils';

describe('math.utils', () => {
  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });

    it('should handle edge cases', () => {
      expect(clamp(0, 0, 10)).toBe(0);
      expect(clamp(10, 0, 10)).toBe(10);
    });
  });

  describe('lerp', () => {
    it('should interpolate between two values', () => {
      expect(lerp(0, 10, 0)).toBe(0);
      expect(lerp(0, 10, 1)).toBe(10);
      expect(lerp(0, 10, 0.5)).toBe(5);
    });

    it('should handle negative values', () => {
      expect(lerp(-10, 10, 0.5)).toBe(0);
    });
  });

  describe('mapRange', () => {
    it('should map value from one range to another', () => {
      expect(mapRange(5, 0, 10, 0, 100)).toBe(50);
      expect(mapRange(0, 0, 10, 0, 100)).toBe(0);
      expect(mapRange(10, 0, 10, 0, 100)).toBe(100);
    });

    it('should handle different ranges', () => {
      expect(mapRange(25, 0, 100, 0, 1)).toBe(0.25);
    });
  });

  describe('random', () => {
    it('should generate random number within range', () => {
      const value = random(0, 10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
    });

    it('should handle single argument', () => {
      const value = random(10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
    });
  });

  describe('randomInt', () => {
    it('should generate random integer within range', () => {
      const value = randomInt(0, 10);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(10);
      expect(Number.isInteger(value)).toBe(true);
    });
  });

  describe('degToRad', () => {
    it('should convert degrees to radians', () => {
      expect(degToRad(0)).toBe(0);
      expect(degToRad(180)).toBeCloseTo(Math.PI);
      expect(degToRad(360)).toBeCloseTo(2 * Math.PI);
    });
  });

  describe('radToDeg', () => {
    it('should convert radians to degrees', () => {
      expect(radToDeg(0)).toBe(0);
      expect(radToDeg(Math.PI)).toBeCloseTo(180);
      expect(radToDeg(2 * Math.PI)).toBeCloseTo(360);
    });
  });

  describe('distance', () => {
    it('should calculate distance between two points', () => {
      expect(distance(0, 0, 3, 4)).toBe(5);
      expect(distance(0, 0, 0, 0)).toBe(0);
    });
  });

  describe('normalize', () => {
    it('should normalize a vector', () => {
      const normalized = normalize(3, 4);
      expect(normalized.x).toBeCloseTo(0.6);
      expect(normalized.y).toBeCloseTo(0.8);
    });

    it('should handle zero vector', () => {
      const normalized = normalize(0, 0);
      expect(normalized.x).toBe(0);
      expect(normalized.y).toBe(0);
    });
  });

  describe('dot', () => {
    it('should calculate dot product', () => {
      expect(dot(1, 2, 3, 4)).toBe(11);
      expect(dot(0, 0, 1, 1)).toBe(0);
    });
  });

  describe('cross', () => {
    it('should calculate cross product', () => {
      expect(cross(1, 2, 3, 4)).toBe(-2);
      expect(cross(0, 0, 1, 1)).toBe(0);
    });
  });
});
