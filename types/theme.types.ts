export type Theme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContext {
  theme: Theme;
  themeMode: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}
