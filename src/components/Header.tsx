import React from 'react';
import { Volume2, VolumeX, Flag, RotateCcw } from 'lucide-react';
import { GameStatus } from '../types/minesweeper';

interface HeaderProps {
  status: GameStatus;
  minesRemaining: number;
  timer: number;
  flagMode: boolean;
  isMuted: boolean;
  onReset: () => void;
  onToggleFlagMode: () => void;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  minesRemaining,
  timer,
  flagMode,
  isMuted,
  onReset,
  onToggleFlagMode,
  onToggleMute,
}) => {
  // Format numbers to 3 digits like classic LED
  const formatNumber = (num: number): string => {
    if (num < 0) {
      const positive = Math.min(Math.abs(num), 99);
      return `-${positive.toString().padStart(2, '0')}`;
    }
    return Math.min(num, 999).toString().padStart(3, '0');
  };

  // Status Emoji Face
  const getFaceEmoji = () => {
    switch (status) {
      case 'won':
        return '😎';
      case 'lost':
        return '😵';
      case 'playing':
        return '🙂';
      case 'idle':
      default:
        return '😊';
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 sm:p-4 mb-4 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        {/* Mine Counter Display */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Ranjau
          </span>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 shadow-inner flex items-center justify-center min-w-[70px]">
            <span className="digital-display text-rose-500 font-bold text-xl sm:text-2xl tracking-widest">
              {formatNumber(minesRemaining)}
            </span>
          </div>
        </div>

        {/* Center: Face Button & Mobile Controls */}
        <div className="flex items-center gap-2">
          {/* Face Reset Button */}
          <button
            type="button"
            onClick={onReset}
            className="w-12 h-12 rounded-xl bg-gradient-to-b from-slate-700 to-slate-800 border-2 border-slate-600/80 hover:border-amber-400/80 shadow-md flex items-center justify-center text-2xl transition-transform active:scale-90 hover:scale-105 focus:outline-none"
            title="Mulai Ulang (Restart)"
            aria-label="Restart game"
          >
            {getFaceEmoji()}
          </button>

          {/* Touch Flag Mode Toggle */}
          <button
            type="button"
            onClick={onToggleFlagMode}
            className={`sm:hidden w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              flagMode
                ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title={flagMode ? 'Mode Bendera Aktif' : 'Mode Buka Kotak Aktif'}
          >
            <Flag className={`w-5 h-5 ${flagMode ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Waktu
          </span>
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800/80 shadow-inner flex items-center justify-center min-w-[70px]">
            <span className="digital-display text-rose-500 font-bold text-xl sm:text-2xl tracking-widest">
              {formatNumber(timer)}
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Controls bar */}
      <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleMute}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors text-slate-300"
            title={isMuted ? 'Suara Mati' : 'Suara Aktif'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isMuted ? 'Mute' : 'Audio'}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors text-slate-300"
            title="Reset"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-slate-400">
          <span className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono border border-slate-700">Klik Kiri</span> Buka
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono border border-slate-700">Klik Kanan</span> Bendera
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1">
            <span className="px-1.5 py-0.5 bg-slate-800 rounded text-[10px] font-mono border border-slate-700">Dbl-Klik</span> Chord
          </span>
        </div>
      </div>
    </div>
  );
};
