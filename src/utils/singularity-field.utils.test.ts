import { describe, it, expect } from 'vitest';
import {
  createSingularityField,
  calculateSingularityForce,
  getSingularityStrength,
} from './singularity-field.utils';

describe('singularity-field.utils', () => {
  describe('createSingularityField', () => {
    it('should create singularity field', () => {
      const field = createSingularityField({ x: 100, y: 100 }, 10);
      expect(field).toBeDefined();
      expect(field.x).toBe(100);
      expect(field.y).toBe(100);
      expect(field.strength).toBe(10);
    });
  });

  describe('calculateSingularityForce', () => {
    it('should calculate force towards singularity', () => {
      const field = createSingularityField({ x: 100, y: 100 }, 10);
      const force = calculateSingularityForce(field, { x: 110, y: 100 });
      expect(force).toBeDefined();
      expect(force.x).toBeDefined();
      expect(force.y).toBeDefined();
    });

    it('should have stronger force closer to singularity', () => {
      const field = createSingularityField({ x: 100, y: 100 }, 10);
      const force1 = calculateSingularityForce(field, { x: 101, y: 100 });
      const force2 = calculateSingularityForce(field, { x: 110, y: 100 });
      const mag1 = Math.sqrt(force1.x ** 2 + force1.y ** 2);
      const mag2 = Math.sqrt(force2.x ** 2 + force2.y ** 2);
      expect(mag1).toBeGreaterThan(mag2);
    });
  });

  describe('getSingularityStrength', () => {
    it('should get strength at distance', () => {
      const field = createSingularityField({ x: 100, y: 100 }, 10);
      const strength = getSingularityStrength(field, 5);
      expect(strength).toBeGreaterThan(0);
    });
  });
});
