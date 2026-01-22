'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Theme, ThemeMode, ThemeContext } from '@/types/theme.types';
import { resolveTheme, getSystemTheme } from '@/utils/theme.utils';

/**
 * Hook for managing theme state
 */
export const useTheme = (): ThemeContext => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [theme, setResolvedTheme] = useState<Theme>(() => getSystemTheme());

  // Update theme when mode changes
  useEffect(() => {
    const resolved = resolveTheme(themeMode);
    setResolvedTheme(resolved);
    
    // Update document class for Tailwind dark mode
    if (typeof document !== 'undefined') {
      if (resolved === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [themeMode]);

  // Listen for system theme changes when in system mode
  useEffect(() => {
    if (themeMode !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeMode]);

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => {
      if (prev === 'system') return 'dark';
      if (prev === 'dark') return 'light';
      return 'system';
    });
  }, []);

  return {
    theme,
    themeMode,
    isDark: theme === 'dark',
    setTheme,
    toggleTheme,
  };
};
