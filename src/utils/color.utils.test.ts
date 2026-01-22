import { describe, it, expect } from 'vitest';
import {
  hexToRgb,
  rgbToHex,
  hslToRgb,
  rgbToHsl,
  hexToHsl,
  hslToHex,
  darken,
  lighten,
  alpha,
  mix,
} from './color.utils';

describe('color.utils', () => {
  describe('hexToRgb', () => {
    it('should convert hex to rgb', () => {
      expect(hexToRgb('#000000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#ffffff')).toEqual({ r: 255, g: 255, b: 255 });
      expect(hexToRgb('#ff0000')).toEqual({ r: 255, g: 0, b: 0 });
    });

    it('should handle hex without hash', () => {
      expect(hexToRgb('000000')).toEqual({ r: 0, g: 0, b: 0 });
    });

    it('should handle short hex', () => {
      expect(hexToRgb('#000')).toEqual({ r: 0, g: 0, b: 0 });
      expect(hexToRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    });
  });

  describe('rgbToHex', () => {
    it('should convert rgb to hex', () => {
      expect(rgbToHex(0, 0, 0)).toBe('#000000');
      expect(rgbToHex(255, 255, 255)).toBe('#ffffff');
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
    });
  });

  describe('hslToRgb', () => {
    it('should convert hsl to rgb', () => {
      const rgb = hslToRgb(0, 100, 50);
      expect(rgb.r).toBe(255);
      expect(rgb.g).toBe(0);
      expect(rgb.b).toBe(0);
    });

    it('should handle grayscale', () => {
      const rgb = hslToRgb(0, 0, 50);
      expect(rgb.r).toBe(rgb.g);
      expect(rgb.g).toBe(rgb.b);
    });
  });

  describe('rgbToHsl', () => {
    it('should convert rgb to hsl', () => {
      const hsl = rgbToHsl(255, 0, 0);
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });
  });

  describe('hexToHsl', () => {
    it('should convert hex to hsl', () => {
      const hsl = hexToHsl('#ff0000');
      expect(hsl.h).toBe(0);
      expect(hsl.s).toBe(100);
      expect(hsl.l).toBe(50);
    });
  });

  describe('hslToHex', () => {
    it('should convert hsl to hex', () => {
      expect(hslToHex(0, 100, 50)).toBe('#ff0000');
    });
  });

  describe('darken', () => {
    it('should darken a color', () => {
      const darkened = darken('#ffffff', 50);
      const rgb = hexToRgb(darkened);
      expect(rgb.r).toBeLessThan(255);
      expect(rgb.g).toBeLessThan(255);
      expect(rgb.b).toBeLessThan(255);
    });
  });

  describe('lighten', () => {
    it('should lighten a color', () => {
      const lightened = lighten('#000000', 50);
      const rgb = hexToRgb(lightened);
      expect(rgb.r).toBeGreaterThan(0);
      expect(rgb.g).toBeGreaterThan(0);
      expect(rgb.b).toBeGreaterThan(0);
    });
  });

  describe('alpha', () => {
    it('should add alpha channel to hex', () => {
      expect(alpha('#ff0000', 0.5)).toContain('rgba');
    });

    it('should handle rgb input', () => {
      expect(alpha('rgb(255, 0, 0)', 0.5)).toBe('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('mix', () => {
    it('should mix two colors', () => {
      const mixed = mix('#ff0000', '#0000ff', 0.5);
      const rgb = hexToRgb(mixed);
      expect(rgb.r).toBeGreaterThan(0);
      expect(rgb.b).toBeGreaterThan(0);
    });
  });
});
