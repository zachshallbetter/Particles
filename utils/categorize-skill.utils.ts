/**
 * Utility functions for categorizing and color-coding skills
 */

export type SkillCategory = 'technical' | 'leadership' | 'business' | 'design' | 'other';

interface SkillColor {
  border: string;
  text: string;
  bg: string;
}

/**
 * Categorizes a skill based on keywords
 */
export function categorizeSkill(skillName: string): SkillCategory {
  const name = skillName.toLowerCase();
  
  // Technical/Product skills
  if (
    name.includes('technical') ||
    name.includes('architecture') ||
    name.includes('development') ||
    name.includes('integration') ||
    name.includes('ai/ml') ||
    name.includes('platform') ||
    name.includes('system') ||
    name.includes('web') ||
    name.includes('code') ||
    name.includes('engineering')
  ) {
    return 'technical';
  }
  
  // Leadership/Management skills
  if (
    name.includes('leadership') ||
    name.includes('management') ||
    name.includes('team') ||
    name.includes('cross-functional') ||
    name.includes('mentorship') ||
    name.includes('stakeholder') ||
    name.includes('strategic planning') ||
    name.includes('vision') ||
    name.includes('strategy')
  ) {
    return 'leadership';
  }
  
  // Business skills
  if (
    name.includes('business') ||
    name.includes('e-commerce') ||
    name.includes('growth') ||
    name.includes('data analysis') ||
    name.includes('product development') ||
    name.includes('manufacturing') ||
    name.includes('crowdfunding') ||
    name.includes('operations') ||
    name.includes('client') ||
    name.includes('partnership')
  ) {
    return 'business';
  }
  
  // Design skills
  if (
    name.includes('design') ||
    name.includes('ux') ||
    name.includes('ui') ||
    name.includes('creative') ||
    name.includes('visual')
  ) {
    return 'design';
  }
  
  return 'other';
}

/**
 * Gets color scheme for a skill category
 */
export function getSkillColor(category: SkillCategory, isDark: boolean): SkillColor {
  const colors: Record<SkillCategory, { light: SkillColor; dark: SkillColor }> = {
    technical: {
      light: {
        border: '#3b82f6', // Blue
        text: '#1e40af',
        bg: 'rgba(59, 130, 246, 0.1)',
      },
      dark: {
        border: '#60a5fa', // Light blue
        text: '#93c5fd',
        bg: 'rgba(96, 165, 250, 0.15)',
      },
    },
    leadership: {
      light: {
        border: '#8b5cf6', // Purple
        text: '#6d28d9',
        bg: 'rgba(139, 92, 246, 0.1)',
      },
      dark: {
        border: '#a78bfa', // Light purple
        text: '#c4b5fd',
        bg: 'rgba(167, 139, 250, 0.15)',
      },
    },
    business: {
      light: {
        border: '#10b981', // Green
        text: '#047857',
        bg: 'rgba(16, 185, 129, 0.1)',
      },
      dark: {
        border: '#34d399', // Light green
        text: '#6ee7b7',
        bg: 'rgba(52, 211, 153, 0.15)',
      },
    },
    design: {
      light: {
        border: '#f59e0b', // Amber
        text: '#b45309',
        bg: 'rgba(245, 158, 11, 0.1)',
      },
      dark: {
        border: '#fbbf24', // Light amber
        text: '#fcd34d',
        bg: 'rgba(251, 191, 36, 0.15)',
      },
    },
    other: {
      light: {
        border: '#6b7280', // Gray
        text: '#374151',
        bg: 'rgba(107, 114, 128, 0.1)',
      },
      dark: {
        border: '#9ca3af', // Light gray
        text: '#d1d5db',
        bg: 'rgba(156, 163, 175, 0.15)',
      },
    },
  };
  
  return isDark ? colors[category].dark : colors[category].light;
}
