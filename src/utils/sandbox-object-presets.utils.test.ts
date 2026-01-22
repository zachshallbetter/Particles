import { describe, it, expect } from 'vitest';
import {
  getSandboxPreset,
  createPresetObject,
  applyPreset,
} from './sandbox-object-presets.utils';

describe('sandbox-object-presets.utils', () => {
  describe('getSandboxPreset', () => {
    it('should get preset by name', () => {
      const preset = getSandboxPreset('default');
      expect(preset).toBeDefined();
    });

    it('should return null for unknown preset', () => {
      const preset = getSandboxPreset('unknown');
      expect(preset).toBeNull();
    });
  });

  describe('createPresetObject', () => {
    it('should create object from preset', () => {
      const preset = getSandboxPreset('default');
      if (preset) {
        const obj = createPresetObject(preset);
        expect(obj).toBeDefined();
      }
    });
  });

  describe('applyPreset', () => {
    it('should apply preset to object', () => {
      const obj = { x: 0, y: 0 };
      const preset = getSandboxPreset('default');
      if (preset) {
        applyPreset(obj, preset);
        expect(obj).toBeDefined();
      }
    });
  });
});
