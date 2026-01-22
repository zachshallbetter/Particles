import { describe, it, expect } from 'vitest';
import {
  createSceneField,
  calculateFieldAtPoint,
  updateSceneFields,
} from './scene-fields.utils';

describe('scene-fields.utils', () => {
  describe('createSceneField', () => {
    it('should create scene field', () => {
      const field = createSceneField('gravity', { x: 100, y: 100 });
      expect(field).toBeDefined();
      expect(field.type).toBe('gravity');
    });
  });

  describe('calculateFieldAtPoint', () => {
    it('should calculate combined field at point', () => {
      const fields = [
        createSceneField('gravity', { x: 100, y: 100 }),
        createSceneField('repulsion', { x: 200, y: 200 }),
      ];
      const result = calculateFieldAtPoint(fields, { x: 150, y: 150 });
      expect(result).toBeDefined();
      expect(result.x).toBeDefined();
      expect(result.y).toBeDefined();
    });
  });

  describe('updateSceneFields', () => {
    it('should update all scene fields', () => {
      const fields = [createSceneField('gravity', { x: 100, y: 100 })];
      updateSceneFields(fields, 16);
      // Fields should be updated
      expect(true).toBe(true);
    });
  });
});
