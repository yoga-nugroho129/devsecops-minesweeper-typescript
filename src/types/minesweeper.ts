export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Difficulty = 'beginner' | 'intermediate' | 'expert' | 'custom';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborMines: number;
  isExploded?: boolean;
  isWrongFlag?: boolean;
}

export type BoardMatrix = CellData[][];

export interface BestScores {
  [key: string]: number; // key e.g. "8x8-10" -> best time in seconds
}

