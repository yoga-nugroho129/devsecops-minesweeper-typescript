import React from 'react';
import { BoardMatrix } from '../types/minesweeper';
import { Cell } from './Cell';

interface BoardProps {
  board: BoardMatrix;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
  onChord: (row: number, col: number) => void;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onReveal,
  onFlag,
  onChord,
  disabled = false,
}) => {
  const cols = board[0]?.length || 0;

  // Determine ideal cell size depending on column count
  let cellSizeClass = 'w-10 h-10 text-lg';
  if (cols > 24) {
    cellSizeClass = 'w-7 h-7 text-xs';
  } else if (cols > 14) {
    cellSizeClass = 'w-8 h-8 text-sm';
  } else if (cols > 10) {
    cellSizeClass = 'w-9 h-9 text-base';
  }

  return (
    <div className="w-full overflow-auto max-h-[70vh] p-2 flex justify-center items-start rounded-lg scrollbar-thin">
      <div
        className="grid gap-1 p-3 bg-slate-950/80 rounded-xl border border-slate-800 shadow-inner inline-block"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, max-content))`,
        }}
      >
        {board.map((row, rIdx) =>
          row.map((cell, cIdx) => (
            <Cell
              key={`${rIdx}-${cIdx}`}
              data={cell}
              cellSizeClass={cellSizeClass}
              onReveal={onReveal}
              onFlag={onFlag}
              onChord={onChord}
              disabled={disabled}
            />
          ))
        )}
      </div>
    </div>
  );
};
