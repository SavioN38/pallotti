import { Sparkles } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export function ThemeSwitcher() {
  const { isChristmas, toggleSeason } = useTheme();

  return (
    <button
      onClick={toggleSeason}
      title={isChristmas ? 'Switch to Classic Teal Theme' : 'Switch to Christmas Burgundy & Gold Theme'}
      className="group relative flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold transition-all duration-300 active:scale-95 shadow-sm"
      style={{
        borderColor: isChristmas ? 'rgba(215, 183, 109, 0.6)' : 'rgba(255, 255, 255, 0.25)',
        background: isChristmas ? 'rgba(110, 26, 41, 0.45)' : 'rgba(255, 255, 255, 0.08)',
        color: isChristmas ? '#f2d48e' : 'rgba(255, 255, 255, 0.9)',
      }}
      aria-label="Toggle seasonal theme"
    >
      <span className="text-xs transition-transform duration-300 group-hover:scale-125">
        {isChristmas ? '🎄' : '🏛️'}
      </span>
      <span className="hidden sm:inline font-sans uppercase tracking-[0.12em] text-[10px]">
        {isChristmas ? 'Festive' : 'Classic'}
      </span>
      <Sparkles
        size={11}
        className={`transition-opacity duration-300 ${
          isChristmas ? 'text-[#f2d48e] opacity-100 animate-pulse' : 'opacity-40 group-hover:opacity-100'
        }`}
      />
    </button>
  );
}
