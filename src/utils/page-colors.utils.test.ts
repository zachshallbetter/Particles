import { describe, it, expect } from 'vitest';
import {
  getPageColors,
  extractColorsFromImage,
  generateColorPalette,
  getContrastColor,
} from './page-colors.utils';

describe('page-colors.utils', () => {
  describe('getPageColors', () => {
    it('should return color palette for page', () => {
      const colors = getPageColors('/projects');
      expect(colors).toBeDefined();
      expect(colors.primary).toBeDefined();
      expect(colors.secondary).toBeDefined();
    });

    it('should return default colors for unknown page', () => {
      const colors = getPageColors('/unknown');
      expect(colors).toBeDefined();
    });
  });

  describe('extractColorsFromImage', () => {
    it('should extract colors from image', async () => {
      // Mock image element
      const img = document.createElement('img');
      const colors = await extractColorsFromImage(img);
      expect(colors).toBeDefined();
      expect(Array.isArray(colors)).toBe(true);
    });
  });

  describe('generateColorPalette', () => {
    it('should generate color palette from base color', () => {
      const palette = generateColorPalette('#ff0000');
      expect(palette).toBeDefined();
      expect(palette.length).toBeGreaterThan(0);
    });
  });

  describe('getContrastColor', () => {
    it('should return white for dark backgrounds', () => {
      expect(getContrastColor('#000000')).toBe('#ffffff');
    });

    it('should return black for light backgrounds', () => {
      expect(getContrastColor('#ffffff')).toBe('#000000');
    });
  });
});
