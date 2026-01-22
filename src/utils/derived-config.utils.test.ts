import { describe, it, expect } from 'vitest';
import {
  deriveWaveConfig,
  deriveParticleConfig,
  mergeConfigs,
} from './derived-config.utils';

describe('derived-config.utils', () => {
  describe('deriveWaveConfig', () => {
    it('should derive wave config from base config', () => {
      const baseConfig = {
        amplitude: 50,
        frequency: 0.02,
        speed: 0.5,
      };
      const derived = deriveWaveConfig(baseConfig);
      expect(derived).toBeDefined();
      expect(derived.amplitude).toBeDefined();
    });
  });

  describe('deriveParticleConfig', () => {
    it('should derive particle config from base config', () => {
      const baseConfig = {
        count: 100,
        speed: 1,
        size: 2,
      };
      const derived = deriveParticleConfig(baseConfig);
      expect(derived).toBeDefined();
      expect(derived.count).toBeDefined();
    });
  });

  describe('mergeConfigs', () => {
    it('should merge multiple configs', () => {
      const base = { a: 1, b: 2 };
      const override = { b: 3, c: 4 };
      const merged = mergeConfigs(base, override);
      expect(merged.a).toBe(1);
      expect(merged.b).toBe(3);
      expect(merged.c).toBe(4);
    });
  });
});
