import type { Theme, ThemeMode } from '@/types/theme.types';
import type { ColorShade } from '@/types/colors.types';
import { WAVE_COLORS } from '@/config/colors.config';
import { resolveTheme } from './theme.utils';
import type { WaveParticleConfig, WaveLine } from "@/types/wave.types";
import type { CSSProperties } from "react";

/**
 * Gets a wave color based on variant and theme
 * @param variant - Wave variant (primary, secondary, tertiary, quaternary)
 * @param theme - Current theme ('light' or 'dark')
 * @returns The appropriate wave color
 */
export const getWaveColor = (
    variant: keyof typeof WAVE_COLORS,
    theme: Theme | ThemeMode
): string => {
    const resolvedTheme = typeof theme === 'string' ? resolveTheme(theme as ThemeMode) : theme;
    return WAVE_COLORS[variant][resolvedTheme];
};

/**
 * Gets a wave color with a specific shade
 * @param variant - Wave variant (primary, secondary, tertiary, quaternary)
 * @param shade - Color shade ('light', 'base', 'dark', 'bg', 'hover')
 * @returns The wave color with the specified shade
 */
export const getWaveColorWithShade = (
    variant: keyof typeof WAVE_COLORS,
    shade: keyof typeof WAVE_COLORS.primary
): string => {
    return WAVE_COLORS[variant][shade];
};

/**
 * Gets a wave color based on variant, shade, and theme
 * @param variant - Wave variant (primary, secondary, tertiary, quaternary)
 * @param shade - Color shade (light, base, dark, bg)
 * @returns The appropriate wave color
 */
export const getWaveColorByShade = (
    variant: keyof typeof WAVE_COLORS,
    shade: keyof ColorShade
): string => {
    // Use the utility function for theme-based colors
    if (shade === 'light' || shade === 'dark' || shade === 'base') {
        return WAVE_COLORS[variant][shade];
    }

    // For bg shade, use the theme-specific background
    if (shade === 'bg') {
        return WAVE_COLORS[variant].bg;
    }

    // Default to base color
    return WAVE_COLORS[variant].base;
};

/**
 * Gets the background color for a wave variant
 * @param variant - Wave variant (primary, secondary, tertiary, quaternary)
 * @returns The background color for the wave variant
 */
export const getWaveBackgroundColor = (variant: keyof typeof WAVE_COLORS): string => {
    return WAVE_COLORS[variant].bg;
};

/**
 * Gets the hover color for a wave variant
 * @param variant - Wave variant (primary, secondary, tertiary, quaternary)
 * @returns The hover color for the wave variant
 */
export const getWaveHoverColor = (variant: keyof typeof WAVE_COLORS): string => {
    return WAVE_COLORS[variant].hover;
};

/**
 * Creates a wave configuration based on the current theme
 * @param isDark - Whether the current theme is dark
 * @param baseConfig - The base wave configuration
 * @returns A theme-appropriate wave configuration
 */
export const createWaveConfig = (isDark: boolean, baseConfig: WaveParticleConfig): WaveParticleConfig => {
    return {
        ...baseConfig,
        lines: baseConfig.lines.map((line: WaveLine) => ({
            ...line,
            // Preserve the original color from BASE_CONFIG - colors are explicitly set there
            // Don't override explicit hex colors, only apply theme colors if needed
            opacity: isDark ? 0.8 : 0.6,  // Keep waves visible in light mode
            blur: isDark ? 0.5 : 0.6,     // Slight blur in light mode
            speed: isDark ? 1 : 0.9       // Similar speed in both modes
        }))
    };
};

/**
 * Gets the appropriate canvas style based on the current theme
 * @param isDark - Whether the current theme is dark
 * @returns Canvas style object
 */
export const getCanvasStyle = (isDark: boolean): CSSProperties => ({
    opacity: isDark ? 0.9 : 0.8,  // Keep good visibility in light mode
    mixBlendMode: isDark ? 'normal' : 'multiply' as const,  // Better blend in light mode
    filter: `blur(${isDark ? '0' : '0.5px'})`,  // Minimal blur in light mode
    zIndex: 1,  // Canvas should be below emitters (zIndex 10)
    pointerEvents: 'none',  // Don't interfere with DOM elements above
});
