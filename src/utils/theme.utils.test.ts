import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  getTheme,
  setTheme,
  toggleTheme,
  isDarkMode,
  getThemeColor,
} from './theme.utils';

describe('theme.utils', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('getTheme', () => {
    it('should get theme from localStorage', () => {
      localStorage.setItem('theme', 'dark');
      expect(getTheme()).toBe('dark');
    });

    it('should default to light theme', () => {
      expect(getTheme()).toBe('light');
    });
  });

  describe('setTheme', () => {
    it('should set theme in localStorage', () => {
      setTheme('dark');
      expect(localStorage.getItem('theme')).toBe('dark');
    });

    it('should update data-theme attribute', () => {
      setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      setTheme('light');
      toggleTheme();
      expect(getTheme()).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      setTheme('dark');
      toggleTheme();
      expect(getTheme()).toBe('light');
    });
  });

  describe('isDarkMode', () => {
    it('should return true for dark theme', () => {
      setTheme('dark');
      expect(isDarkMode()).toBe(true);
    });

    it('should return false for light theme', () => {
      setTheme('light');
      expect(isDarkMode()).toBe(false);
    });
  });

  describe('getThemeColor', () => {
    it('should return color for theme', () => {
      const color = getThemeColor('primary');
      expect(color).toBeDefined();
    });
  });
});
