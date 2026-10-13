import { useEffect, useState, ReactNode } from 'react';
import { SeasonMode, THEME_CONFIGS, getAutoScheduledSeason } from '@/config/themeConfig';
import { ThemeContext } from './themeContextDef';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [season, setSeasonState] = useState<SeasonMode>(() => {
    if (typeof window !== 'undefined') {
      // Clean up legacy localStorage override so it doesn't block the automated schedule
      localStorage.removeItem('pallotti_theme_override');

      // Check current session override (if user clicked toggle button during this visit)
      const sessionSaved = sessionStorage.getItem('pallotti_theme_override') as SeasonMode | null;
      if (sessionSaved === 'default' || sessionSaved === 'christmas') {
        return sessionSaved;
      }
    }
    // Automatically determined by calendar date
    return getAutoScheduledSeason();
  });

  useEffect(() => {
    const root = document.documentElement;
    if (season === 'christmas') {
      root.setAttribute('data-theme', 'christmas');
      root.classList.add('theme-christmas');
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('theme-christmas');
    }
  }, [season]);

  const setSeason = (mode: SeasonMode) => {
    setSeasonState(mode);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pallotti_theme_override', mode);
    }
  };

  const toggleSeason = () => {
    setSeason(season === 'christmas' ? 'default' : 'christmas');
  };

  const themeConfig = THEME_CONFIGS[season];
  const isChristmas = season === 'christmas';

  return (
    <ThemeContext.Provider value={{ season, isChristmas, themeConfig, setSeason, toggleSeason }}>
      {children}
    </ThemeContext.Provider>
  );
}
