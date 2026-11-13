import React from 'react';
import { Language } from '../types/minesweeper';

interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  return (
    <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl shadow-sm">
      <button
        type="button"
        onClick={() => onLanguageChange('en')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          currentLanguage === 'en'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
        }`}
        title="Switch to English"
        aria-label="Switch to English"
      >
        <span className="text-base leading-none select-none">🇬🇧</span>
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => onLanguageChange('id')}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
          currentLanguage === 'id'
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
        }`}
        title="Ganti ke Bahasa Indonesia"
        aria-label="Ganti ke Bahasa Indonesia"
      >
        <span className="text-base leading-none select-none">🇮🇩</span>
        <span>ID</span>
      </button>
    </div>
  );
};

