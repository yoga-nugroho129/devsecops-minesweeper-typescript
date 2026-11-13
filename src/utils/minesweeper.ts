import { BoardMatrix, CellData, GameConfig } from '../types/minesweeper';

export const PRESETS: Record<string, GameConfig> = {
  beginner: { rows: 8, cols: 8, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
};

// Neighbor offsets
const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

/**
 * Creates an initial empty board without mines
 */
export function createEmptyBoard(rows: number, cols: number): BoardMatrix {
  const board: BoardMatrix = [];
  for (let r = 0; r < rows; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }
  return board;
}

/**
 * Checks if coordinates are within the board bounds
 */
export function isValidCell(row: number, col: number, rows: number, cols: number): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

/**
 * Populates mines ensuring first click (and ideally its surrounding cells) is safe
 */
export function populateMines(
  emptyBoard: BoardMatrix,
  rows: number,
  cols: number,
  totalMines: number,
  startRow: number,
  startCol: number
): BoardMatrix {
  // Deep clone to avoid mutating directly
  const board: BoardMatrix = emptyBoard.map(row => row.map(cell => ({ ...cell })));
  const totalCells = rows * cols;
  const clampedMines = Math.max(1, Math.min(totalMines, totalCells - 1));

  // Determine forbidden cells (first click cell, plus neighbors if space permits)
  const forbidden = new Set<string>();
  forbidden.add(`${startRow},${startCol}`);

  if (totalCells - 9 >= clampedMines) {
    for (const [dr, dc] of DIRECTIONS) {
      const nr = startRow + dr;
      const nc = startCol + dc;
      if (isValidCell(nr, nc, rows, cols)) {
        forbidden.add(`${nr},${nc}`);
      }
    }
  }

  // Available cells for mine placement
  const candidates: [number, number][] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!forbidden.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  // Fallback if candidate pool is smaller than mines needed (e.g. extremely dense custom games)
  if (candidates.length < clampedMines) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (r === startRow && c === startCol) continue;
        if (!candidates.some(([cr, cc]) => cr === r && cc === c)) {
          candidates.push([r, c]);
        }
      }
    }
  }

  // Shuffle candidates (Fisher-Yates) and pick mines
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  for (let i = 0; i < clampedMines && i < candidates.length; i++) {
    const [mr, mc] = candidates[i];
    board[mr][mc].isMine = true;
  }

  // Calculate neighbor mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (isValidCell(nr, nc, rows, cols) && board[nr][nc].isMine) {
          count++;
        }
      }
      board[r][c].neighborMines = count;
    }
  }

  return board;
}

/**
 * Reveals a cell with flood-fill BFS for cells with 0 neighbor mines
 */
export function revealCell(
  board: BoardMatrix,
  row: number,
  col: number
): { board: BoardMatrix; hitMine: boolean; revealedCellsCount: number } {
  const rows = board.length;
  const cols = board[0].length;
  const newBoard = board.map(r => r.map(c => ({ ...c })));

  const target = newBoard[row][col];
  if (target.isRevealed || target.isFlagged) {
    return { board: newBoard, hitMine: false, revealedCellsCount: 0 };
  }

  if (target.isMine) {
    target.isRevealed = true;
    target.isExploded = true;
    return { board: newBoard, hitMine: true, revealedCellsCount: 1 };
  }

  // Flood-fill BFS
  const queue: [number, number][] = [[row, col]];
  target.isRevealed = true;
  let revealedCellsCount = 1;

  while (queue.length > 0) {
    const [currR, currC] = queue.shift()!;
    const currCell = newBoard[currR][currC];

    // Only expand neighbors if this cell has 0 neighboring mines
    if (currCell.neighborMines === 0) {
      for (const [dr, dc] of DIRECTIONS) {
        const nr = currR + dr;
        const nc = currC + dc;
        if (isValidCell(nr, nc, rows, cols)) {
          const neighbor = newBoard[nr][nc];
          if (!neighbor.isRevealed && !neighbor.isFlagged && !neighbor.isMine) {
            neighbor.isRevealed = true;
            revealedCellsCount++;
            if (neighbor.neighborMines === 0) {
              queue.push([nr, nc]);
            }
          }
        }
      }
    }
  }

  return { board: newBoard, hitMine: false, revealedCellsCount };
}

/**
 * Chord action: if revealed cell has matching number of neighbor flags, reveal all non-flagged neighbors
 */
export function chordCell(
  board: BoardMatrix,
  row: number,
  col: number
): { board: BoardMatrix; hitMine: boolean; changed: boolean } {
  const rows = board.length;
  const cols = board[0].length;
  const cell = board[row][col];

  if (!cell.isRevealed || cell.neighborMines === 0) {
    return { board, hitMine: false, changed: false };
  }

  // Count flags around
  let flagCount = 0;
  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr;
    const nc = col + dc;
    if (isValidCell(nr, nc, rows, cols) && board[nr][nc].isFlagged) {
      flagCount++;
    }
  }

  // Only chord if flags match neighbor count
  if (flagCount !== cell.neighborMines) {
    return { board, hitMine: false, changed: false };
  }

  let currentBoard = board;
  let hitMine = false;
  let changed = false;

  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr;
    const nc = col + dc;
    if (isValidCell(nr, nc, rows, cols)) {
      const neighbor = currentBoard[nr][nc];
      if (!neighbor.isRevealed && !neighbor.isFlagged) {
        changed = true;
        const result = revealCell(currentBoard, nr, nc);
        currentBoard = result.board;
        if (result.hitMine) {
          hitMine = true;
          break;
        }
      }
    }
  }

  return { board: currentBoard, hitMine, changed };
}

/**
 * Toggles a flag on an unrevealed cell
 */
export function toggleFlagOnBoard(board: BoardMatrix, row: number, col: number): { board: BoardMatrix; flagAdded: boolean } {
  const newBoard = board.map(r => r.map(c => ({ ...c })));
  const cell = newBoard[row][col];

  if (cell.isRevealed) {
    return { board: newBoard, flagAdded: false };
  }

  cell.isFlagged = !cell.isFlagged;
  return { board: newBoard, flagAdded: cell.isFlagged };
}

/**
 * Exposes all mines on game over and marks incorrect flags
 */
export function revealAllOnLoss(board: BoardMatrix): BoardMatrix {
  return board.map(row =>
    row.map(cell => {
      const updated = { ...cell };
      if (cell.isMine) {
        if (!cell.isFlagged) {
          updated.isRevealed = true;
        }
      } else if (cell.isFlagged) {
        // Flag placed on a non-mine cell
        updated.isWrongFlag = true;
      }
      return updated;
    })
  );
}

/**
 * Flags all remaining mines when player wins
 */
export function flagAllOnWin(board: BoardMatrix): BoardMatrix {
  return board.map(row =>
    row.map(cell => {
      if (cell.isMine) {
        return { ...cell, isFlagged: true };
      }
      return cell;
    })
  );
}

/**
 * Checks if the board meets the win condition:
 * All non-mine cells are revealed
 */
export function checkWin(board: BoardMatrix): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Counts total placed flags
 */
export function countFlags(board: BoardMatrix): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) count++;
    }
  }
  return count;
}
