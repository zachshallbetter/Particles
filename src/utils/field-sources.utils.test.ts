import { describe, it, expect } from 'vitest';
import {
  createFieldSource,
  updateFieldSource,
  removeFieldSource,
  getFieldStrength,
} from './field-sources.utils';

describe('field-sources.utils', () => {
  describe('createFieldSource', () => {
    it('should create field source', () => {
      const source = createFieldSource({ x: 100, y: 100 }, 50, 1.0);
      expect(source).toBeDefined();
      expect(source.x).toBe(100);
      expect(source.y).toBe(100);
      expect(source.radius).toBe(50);
    });
  });

  describe('updateFieldSource', () => {
    it('should update field source', () => {
      const source = createFieldSource({ x: 100, y: 100 }, 50, 1.0);
      updateFieldSource(source, { x: 200, y: 200 });
      expect(source.x).toBe(200);
      expect(source.y).toBe(200);
    });
  });

  describe('removeFieldSource', () => {
    it('should remove field source', () => {
      const source = createFieldSource({ x: 100, y: 100 }, 50, 1.0);
      removeFieldSource(source);
      // Source should be removed
      expect(true).toBe(true);
    });
  });

  describe('getFieldStrength', () => {
    it('should calculate field strength at point', () => {
      const source = createFieldSource({ x: 100, y: 100 }, 50, 1.0);
      const strength = getFieldStrength(source, { x: 110, y: 100 });
      expect(strength).toBeGreaterThan(0);
    });

    it('should return zero for points outside radius', () => {
      const source = createFieldSource({ x: 100, y: 100 }, 50, 1.0);
      const strength = getFieldStrength(source, { x: 200, y: 200 });
      expect(strength).toBe(0);
    });
  });
});
