import { createContext } from 'react';
import { SeasonMode, SeasonalThemeConfig } from '@/config/themeConfig';

export interface ThemeContextType {
  season: SeasonMode;
  isChristmas: boolean;
  themeConfig: SeasonalThemeConfig;
  setSeason: (mode: SeasonMode) => void;
  toggleSeason: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
