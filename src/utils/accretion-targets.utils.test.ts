import { describe, it, expect } from 'vitest';
import {
  createAccretionTarget,
  findNearestTarget,
  updateTarget,
} from './accretion-targets.utils';

describe('accretion-targets.utils', () => {
  describe('createAccretionTarget', () => {
    it('should create accretion target', () => {
      const target = createAccretionTarget({ x: 100, y: 100 }, 50);
      expect(target).toBeDefined();
      expect(target.x).toBe(100);
      expect(target.y).toBe(100);
      expect(target.radius).toBe(50);
    });
  });

  describe('findNearestTarget', () => {
    it('should find nearest target', () => {
      const targets = [
        createAccretionTarget({ x: 100, y: 100 }, 50),
        createAccretionTarget({ x: 200, y: 200 }, 50),
      ];
      const nearest = findNearestTarget(targets, { x: 110, y: 110 });
      expect(nearest).toBeDefined();
      expect(nearest.x).toBe(100);
    });
  });

  describe('updateTarget', () => {
    it('should update target state', () => {
      const target = createAccretionTarget({ x: 100, y: 100 }, 50);
      updateTarget(target, { x: 150, y: 150 });
      expect(target.x).toBe(150);
      expect(target.y).toBe(150);
    });
  });
});
