/**
 * Seasonal Theme Configuration for Pallotti Hill Public School Website.
 *
 * AUTOMATIC DATE SCHEDULING:
 * - Automatically activates 'christmas' or 'default' based on the current calendar date.
 * - Test schedule:
 *     - Oct 13, 2026 (Today): 'default' (Classic Petrol Teal)
 *     - Oct 14, 2026 (Tomorrow) onwards: 'christmas' (Regal Burgundy & Champagne Gold)
 * - Annual production Christmas window: December 1 to January 10.
 */

export type SeasonMode = 'default' | 'christmas';

export interface SeasonalThemeConfig {
  season: SeasonMode;
  banner: {
    enabled: boolean;
    greeting: string;
    subtext: string;
    badge: string;
  };
  snowfall: {
    enabled: boolean;
    speed: number;
    density: number;
  };
  chatbotGreeting: string;
}

/**
 * Calculates which season should be active automatically based on today's date.
 */
export function getAutoScheduledSeason(): SeasonMode {
  const today = new Date();
  const month = today.getMonth() + 1; // 1-12
  const day = today.getDate();

  // 🎄 CHRISTMAS FESTIVE MODE SCHEDULE:
  // Active annually from November 30 (end of Nov) through December 26
  if ((month === 11 && day >= 30) || (month === 12 && day <= 26)) {
    return 'christmas';
  }

  return 'default';
}

export const CURRENT_SEASON: SeasonMode = getAutoScheduledSeason();

export const THEME_CONFIGS: Record<SeasonMode, SeasonalThemeConfig> = {
  default: {
    season: 'default',
    banner: {
      enabled: false,
      greeting: 'Growing minds. Good hearts.',
      subtext: 'A school for every possibility.',
      badge: 'CBSE Affiliated',
    },
    snowfall: {
      enabled: false,
      speed: 0,
      density: 0,
    },
    chatbotGreeting: 'Hello! 👋 Welcome to **Pallotti Hill Public School**. How can I assist you today?',
  },
  christmas: {
    season: 'christmas',
    banner: {
      enabled: true,
      greeting: 'Blessed Christmas & Joyful New Year',
      subtext: 'Peace, joy, and blessings to our entire Pallottine family & friends.',
      badge: 'Season of Joy 2026',
    },
    snowfall: {
      enabled: true,
      speed: 0.6,
      density: 35,
    },
    chatbotGreeting: 'Christmas Greetings! 🎄✨ Welcome to **Pallotti Hill Public School**. How can I help you during this festive season?',
  },
};

export function getActiveTheme(): SeasonalThemeConfig {
  if (typeof window !== 'undefined') {
    const override = sessionStorage.getItem('pallotti_theme_override') as SeasonMode | null;
    if (override && (override === 'default' || override === 'christmas')) {
      return THEME_CONFIGS[override];
    }
  }
  return THEME_CONFIGS[getAutoScheduledSeason()];
}
