import React, { memo } from 'react';
import { Flag, Bomb, X } from 'lucide-react';
import { CellData } from '../types/minesweeper';

interface CellProps {
  data: CellData;
  cellSizeClass?: string;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  disabled?: boolean;
}

const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-400',
  2: 'text-emerald-400',
  3: 'text-rose-400',
  4: 'text-indigo-400',
  5: 'text-amber-500',
  6: 'text-cyan-400',
  7: 'text-violet-300',
  8: 'text-slate-400',
};

export const Cell: React.FC<CellProps> = memo(({
  data,
  cellSizeClass = 'w-9 h-9 sm:w-10 sm:h-10 text-base sm:text-lg',
  onReveal,
  onFlag,
  onChord,
  disabled = false,
}) => {
  const { row, col, isMine, isRevealed, isFlagged, neighborMines, isExploded, isWrongFlag } = data;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    if (isRevealed && neighborMines > 0) {
      onChord(row, col);
    } else {
      onReveal(row, col);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled || isRevealed) return;
    onFlag(row, col);
  };

  // Rendering content inside the cell
  const renderContent = () => {
    if (isWrongFlag) {
      return (
        <div className="relative flex items-center justify-center">
          <Bomb className="w-5 h-5 text-slate-400 opacity-60" />
          <X className="w-6 h-6 text-rose-500 absolute stroke-[3]" />
        </div>
      );
    }

    if (isFlagged) {
      return (
        <Flag className="w-5 h-5 text-rose-400 fill-rose-500 filter drop-shadow-[0_0_6px_rgba(244,63,94,0.6)] animate-pulse" />
      );
    }

    if (!isRevealed) {
      return null;
    }

    if (isMine) {
      return (
        <Bomb
          className={`w-5 h-5 ${
            isExploded
              ? 'text-white fill-white filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-bounce'
              : 'text-rose-400 fill-rose-500/80'
          }`}
        />
      );
    }

    if (neighborMines > 0) {
      const colorClass = NUMBER_COLORS[neighborMines] || 'text-slate-200';
      return (
        <span className={`font-mono font-extrabold select-none ${colorClass}`}>
          {neighborMines}
        </span>
      );
    }

    return null;
  };

  // Dynamic cell styling
  let bgClasses = '';
  if (!isRevealed) {
    bgClasses = `bg-gradient-to-b from-slate-700 to-slate-800 border-t border-l border-white/20 border-r border-b border-black/40 shadow-md ${
      disabled ? 'cursor-default' : 'hover:from-slate-600 hover:to-slate-700 active:scale-95 cursor-pointer'
    }`;
  } else if (isExploded) {
    bgClasses = 'bg-rose-600 border border-rose-700 animate-pulse';
  } else if (isMine) {
    bgClasses = 'bg-slate-950/80 border border-rose-900/40';
  } else {
    bgClasses = 'bg-slate-900/90 border border-slate-800/80 inset-shadow';
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      onDoubleClick={() => !disabled && isRevealed && onChord(row, col)}
      className={`${cellSizeClass} rounded flex items-center justify-center font-bold transition-all duration-75 select-none focus:outline-none focus:ring-1 focus:ring-amber-400/40 ${bgClasses}`}
      aria-label={`Baris ${row + 1}, Kolom ${col + 1}${isRevealed ? (isMine ? ', Ranjau' : `, ${neighborMines} ranjau sekitar`) : isFlagged ? ', Bendera' : ', Belum dibuka'}`}
    >
      {renderContent()}
    </button>
  );
});

Cell.displayName = 'Cell';

