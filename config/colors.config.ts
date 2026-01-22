/**
 * Color System Configuration
 * 
 * This file defines the complete color system for the application, organized into three
 * interconnected systems:
 * 
 * 1. WAVE_COLORS - Brand accent colors (primary, secondary, tertiary, quaternary)
 *    - Used for: Work categories (Product, Design, Development, Strategy)
 *    - Purpose: Brand identity, primary accents, wave animations
 * 
 * 2. THEME_COLORS - Text hierarchy and UI surfaces (light/dark themes)
 *    - Used for: All text content, backgrounds, borders, panels
 *    - Purpose: Visual hierarchy, readability, theme support
 *    - Text hierarchy: primary (most important) → quaternary (least important)
 * 
 * 3. CATEGORIES - Content categorization colors
 *    - Used for: Project tags, technology categories, content filtering
 *    - Purpose: Semantic meaning for content organization
 */

import type {
    WaveColors,
    ThemeColors,
    CategoryColors,
    OpacityLevels
} from '../types/colors.types';

/**
 * Wave Colors - Brand accent colors for primary UI elements
 * 
 * Semantic mapping:
 * - primary: Product work, main focus, primary actions
 * - secondary: Design work, secondary actions, supporting elements
 * - tertiary: Development work, technical elements
 * - quaternary: Strategy work, subtle accents
 */
export const WAVE_COLORS: WaveColors = {
    primary: {
        light: '#ff99ad',
        base: '#FF6384',
        dark: '#FF3D68',
        bg: '#2D1F24',
        hover: '#FF4F73'
    },
    secondary: {
        light: '#64B5FF',
        base: '#36A2EB',
        dark: '#1488DC',
        bg: '#1F242D',
        hover: '#4DACEF'
    },
    tertiary: {
        light: '#7cd3d3',
        base: '#4BC0C0',
        dark: '#359a9a',
        bg: '#1F2D2D',
        hover: '#5CC6C6'
    },
    quaternary: {
        light: '#ffeb3b',
        base: '#FFD700',
        dark: '#ffc107',
        bg: '#2A2419',
        hover: '#FFE082'
    }
} as const;

// Helper function to apply opacity to colors
export const withOpacity = (color: string, opacity: string) => `${color}${opacity}`;

/**
 * Theme Colors - Text hierarchy and UI surfaces
 * 
 * Text hierarchy (most to least important):
 * - primary: Headings, critical content, main information
 * - secondary: Supporting content, subheadings, descriptions
 * - tertiary: Metadata, captions, less important details
 * - quaternary: Placeholders, hints, decorative text
 * 
 * Each text color has two context variants:
 * - default: For text on main background surfaces
 * - container: For text inside containers/panels
 */
export const THEME_COLORS: ThemeColors = {
    light: {
        background: '#ffffff',
        panel: 'rgba(255, 255, 255, 0.95)',
        border: 'rgba(0, 0, 0, 0.1)',
        text: {
            primary: {
                default: '#0f172a',
                container: '#0f172a'
            },
            secondary: {
                default: '#334155',
                container: '#334155'
            },
            tertiary: {
                default: '#64748b',
                container: '#64748b'
            },
            quaternary: {
                default: '#94a3b8',
                container: '#94a3b8'
            },
            heading: {
                light: '#0f172a',
                dark: '#ffffff'
            },
            body: {
                light: '#334155',
                dark: '#f3f4f6'
            }
        },
        hover: {
            background: 'rgba(0, 0, 0, 0.05)',
            text: {
                default: '#000000',
                container: '#000000'
            }
        }
    },
    dark: {
        background: '#0f1219',
        panel: 'rgba(17, 24, 39, 0.95)',
        border: 'rgba(255, 255, 255, 0.1)',
        text: {
            primary: {
                default: '#ffffff',
                container: '#f3f4f6'
            },
            secondary: {
                default: '#9CA3AF',
                container: '#D1D5DB'
            },
            tertiary: {
                default: '#D1D5DB',
                container: '#9CA3AF'
            },
            quaternary: {
                default: '#e2e8f0',
                container: '#cbd5e1'
            },
            heading: {
                light: '#ffffff',
                dark: '#0f172a'
            },
            body: {
                light: '#f3f4f6',
                dark: '#334155'
            }
        },
        hover: {
            background: 'rgba(255, 255, 255, 0.05)',
            text: {
                default: '#ffffff',
                container: '#ffffff'
            }
        }
    },
    primary: WAVE_COLORS.primary,
    secondary: WAVE_COLORS.secondary,
    tertiary: WAVE_COLORS.tertiary,
    quaternary: WAVE_COLORS.quaternary,
    background: {
        light: '#ffffff',
        dark: '#0f1219',
        container: {
            light: 'rgba(255, 255, 255, 0.95)',
            dark: 'rgba(17, 24, 39, 0.95)'
        }
    },
    text: {
        primary: {
            default: '#0f172a',
            container: '#0f172a'
        },
        secondary: {
            default: '#334155',
            container: '#334155'
        },
        tertiary: {
            default: '#64748b',
            container: '#64748b'
        },
        quaternary: {
            default: '#94a3b8',
            container: '#94a3b8'
        },
        heading: {
            light: '#0f172a',
            dark: '#ffffff'
        },
        body: {
            light: '#334155',
            dark: '#f3f4f6'
        }
    },
    wave: WAVE_COLORS
} as const;

/**
 * Category Colors - Semantic colors for content categorization
 * 
 * Each category represents a technology domain or content type:
 * - frontend: Client-side development, UI/UX
 * - backend: Server-side development, APIs
 * - database: Data storage, data science
 * - cloud: Cloud infrastructure, distributed systems
 * - testing: Quality assurance, testing frameworks
 * - ai: Artificial intelligence, machine learning
 * - product: Product design, product management
 * - protocol: Protocols, standards, networking
 */
export const CATEGORIES: CategoryColors = {
    frontend: {
        light: '#f87171',
        base: '#EF4444',
        dark: '#dc2626',
        bg: {
            light: 'rgba(239, 68, 68, 0.1)',
            dark: '#2A1F1F'
        }
    },
    backend: {
        light: '#66b5f0',
        base: '#36A2EB',
        dark: '#1a87d1',
        bg: {
            light: 'rgba(54, 162, 235, 0.1)',
            dark: '#1F2A33'
        }
    },
    database: {
        light: '#7cd3d3',
        base: '#4BC0C0',
        dark: '#359a9a',
        bg: {
            light: 'rgba(75, 192, 192, 0.1)',
            dark: '#1F2D2D'
        }
    },
    cloud: {
        light: '#b899ff',
        base: '#9966FF',
        dark: '#7a33ff',
        bg: {
            light: 'rgba(153, 102, 255, 0.1)',
            dark: '#252133'
        }
    },
    testing: {
        light: '#ffbc73',
        base: '#FF9F40',
        dark: '#ff820d',
        bg: {
            light: 'rgba(255, 159, 64, 0.1)',
            dark: '#2A2419'
        }
    },
    ai: {
        light: '#c084fc',
        base: '#A855F7',
        dark: '#9333ea',
        bg: {
            light: 'rgba(168, 85, 247, 0.1)',
            dark: '#2A1F33'
        }
    },
    product: {
        light: '#ffdb89',
        base: '#FFCD56',
        dark: '#ffbf23',
        bg: {
            light: 'rgba(255, 205, 86, 0.1)',
            dark: '#2A2419'
        }
    },
    protocol: {
        light: '#34d399',
        base: '#10B981',
        dark: '#059669',
        bg: {
            light: 'rgba(16, 185, 129, 0.1)',
            dark: '#064E3B'
        }
    }
} as const;

/**
 * Opacity Levels - Standardized transparency values
 * 
 * Used for consistent hover effects, overlays, and transparency:
 * - hover: 15% - Subtle hover backgrounds
 * - selected: 20% - Selected state backgrounds
 * - border: 40% - Border opacity
 * - overlay: 60% - Overlay backgrounds
 * - transparent: 0% - Fully transparent
 * - solid: 100% - Fully opaque
 * 
 * Values are hex strings (00-ff) for appending to color hex codes
 */
export const OPACITY: OpacityLevels = {
    hover: '26',
    selected: '33',
    border: '66',
    overlay: '95',
    transparent: '00',
    solid: 'ff'
} as const;
