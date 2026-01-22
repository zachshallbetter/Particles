import type { Theme, ThemeMode } from '@/types/theme.types';

/**
 * Resolve theme mode to actual theme
 */
export const resolveTheme = (mode: ThemeMode): Theme => {
  if (mode === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark'; // Default to dark on server
  }
  return mode;
};

/**
 * Get system theme preference
 */
export const getSystemTheme = (): Theme => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'dark';
};
