import { describe, it, expect } from 'vitest';
import {
  getToken,
  setToken,
  getDesignToken,
  resolveToken,
} from './tokens.utils';

describe('tokens.utils', () => {
  describe('getToken', () => {
    it('should get token value', () => {
      const value = getToken('color.primary');
      expect(value).toBeDefined();
    });

    it('should return default for missing token', () => {
      const value = getToken('color.missing', '#000000');
      expect(value).toBe('#000000');
    });
  });

  describe('setToken', () => {
    it('should set token value', () => {
      setToken('color.test', '#ff0000');
      expect(getToken('color.test')).toBe('#ff0000');
    });
  });

  describe('getDesignToken', () => {
    it('should get design token', () => {
      const token = getDesignToken('spacing.small');
      expect(token).toBeDefined();
    });
  });

  describe('resolveToken', () => {
    it('should resolve token reference', () => {
      const resolved = resolveToken('var(--color-primary)');
      expect(resolved).toBeDefined();
    });
  });
});
