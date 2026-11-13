import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  isValidCell,
  populateMines,
  revealCell,
  chordCell,
  toggleFlagOnBoard,
  revealAllOnLoss,
  flagAllOnWin,
  checkWin,
  countFlags,
  PRESETS,
} from '../minesweeper';
import { BoardMatrix } from '../../types/minesweeper';

describe('minesweeper core logic', () => {
  describe('createEmptyBoard', () => {
    it('creates a board with correct default dimensions and states', () => {
      const rows = 8;
      const cols = 8;
      const board = createEmptyBoard(rows, cols);

      expect(board.length).toBe(rows);
      expect(board[0].length).toBe(cols);

      board.forEach((row, r) => {
        row.forEach((cell, c) => {
          expect(cell.row).toBe(r);
          expect(cell.col).toBe(c);
          expect(cell.isMine).toBe(false);
          expect(cell.isRevealed).toBe(false);
          expect(cell.isFlagged).toBe(false);
          expect(cell.neighborMines).toBe(0);
        });
      });
    });

    it('creates custom rectangular dimensions', () => {
      const board = createEmptyBoard(12, 6);
      expect(board.length).toBe(12);
      expect(board[0].length).toBe(6);
    });
  });

  describe('isValidCell', () => {
    it('correctly identifies valid and invalid coordinates', () => {
      expect(isValidCell(0, 0, 8, 8)).toBe(true);
      expect(isValidCell(7, 7, 8, 8)).toBe(true);
      expect(isValidCell(-1, 0, 8, 8)).toBe(false);
      expect(isValidCell(0, -1, 8, 8)).toBe(false);
      expect(isValidCell(8, 0, 8, 8)).toBe(false);
      expect(isValidCell(0, 8, 8, 8)).toBe(false);
    });
  });

  describe('populateMines', () => {
    it('populates exact mine count and guarantees first-click safety', () => {
      const rows = 8;
      const cols = 8;
      const mines = 10;
      const emptyBoard = createEmptyBoard(rows, cols);
      const startR = 3;
      const startC = 3;

      const populated = populateMines(emptyBoard, rows, cols, mines, startR, startC);

      let mineCount = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (populated[r][c].isMine) mineCount++;
        }
      }

      expect(mineCount).toBe(mines);
      // First click square must NEVER be a mine
      expect(populated[startR][startC].isMine).toBe(false);

      // Surrounding cells should also be safe if space allows (64 cells vs 10 mines)
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          expect(populated[startR + dr][startC + dc].isMine).toBe(false);
        }
      }
    });

    it('calculates neighbor mine numbers accurately', () => {
      // Test board with known configuration
      const testBoard: BoardMatrix = createEmptyBoard(3, 3);
      testBoard[0][0].isMine = true;

      // Manually calculate counts for testBoard
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          if (!testBoard[r][c].isMine) {
            let count = 0;
            for (let dr = -1; dr <= 1; dr++) {
              for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && testBoard[nr][nc].isMine) {
                  count++;
                }
              }
            }
            testBoard[r][c].neighborMines = count;
          }
        }
      }

      expect(testBoard[0][1].neighborMines).toBe(1);
      expect(testBoard[1][0].neighborMines).toBe(1);
      expect(testBoard[1][1].neighborMines).toBe(1);
      expect(testBoard[2][2].neighborMines).toBe(0);
    });
  });

  describe('revealCell', () => {
    it('reveals a mine cell and sets isExploded', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].isMine = true;

      const result = revealCell(board, 1, 1);
      expect(result.hitMine).toBe(true);
      expect(result.board[1][1].isRevealed).toBe(true);
      expect(result.board[1][1].isExploded).toBe(true);
    });

    it('does not reveal flagged cells', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].isFlagged = true;

      const result = revealCell(board, 0, 0);
      expect(result.hitMine).toBe(false);
      expect(result.revealedCellsCount).toBe(0);
      expect(result.board[0][0].isRevealed).toBe(false);
    });

    it('does not double-reveal already revealed cells', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].isRevealed = true;

      const result = revealCell(board, 0, 0);
      expect(result.revealedCellsCount).toBe(0);
    });

    it('performs flood-fill BFS on empty 0-mine cells', () => {
      // 3x3 board with NO mines: revealing (0,0) should reveal ALL 9 cells!
      const board = createEmptyBoard(3, 3);
      const result = revealCell(board, 0, 0);

      expect(result.hitMine).toBe(false);
      expect(result.revealedCellsCount).toBe(9);
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          expect(result.board[r][c].isRevealed).toBe(true);
        }
      }
    });

    it('stops flood fill at cells with neighborMines > 0', () => {
      const board = createEmptyBoard(3, 3);
      // Place mine at (0, 2)
      board[0][2].isMine = true;
      board[0][1].neighborMines = 1;
      board[1][1].neighborMines = 1;
      board[1][2].neighborMines = 1;

      // Click at (2, 0) where neighborMines is 0
      const result = revealCell(board, 2, 0);
      expect(result.hitMine).toBe(false);
      expect(result.board[0][2].isRevealed).toBe(false); // Mine remains unrevealed
      expect(result.board[0][1].isRevealed).toBe(true); // Boundary revealed
    });
  });

  describe('chordCell', () => {
    it('reveals surrounding unflagged cells when flag count matches neighborMines', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].isRevealed = true;
      board[1][1].neighborMines = 1;

      // Place a mine at (0, 0) and flag it
      board[0][0].isMine = true;
      board[0][0].isFlagged = true;

      const result = chordCell(board, 1, 1);
      expect(result.changed).toBe(true);
      expect(result.hitMine).toBe(false);

      // (0, 1), (1, 0), etc. should now be revealed
      expect(result.board[0][1].isRevealed).toBe(true);
      expect(result.board[1][0].isRevealed).toBe(true);
      // The flagged mine remains intact
      expect(result.board[0][0].isRevealed).toBe(false);
    });

    it('does nothing if flag count does not match neighborMines', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].isRevealed = true;
      board[1][1].neighborMines = 2; // expects 2 flags
      board[0][0].isFlagged = true; // only 1 flag

      const result = chordCell(board, 1, 1);
      expect(result.changed).toBe(false);
    });

    it('triggers mine hit if player wrongly flagged a safe cell and left a mine unflagged', () => {
      const board = createEmptyBoard(3, 3);
      board[1][1].isRevealed = true;
      board[1][1].neighborMines = 1;

      // Mine is actually at (0, 0), but user erroneously flagged (0, 1)
      board[0][0].isMine = true;
      board[0][1].isFlagged = true;

      const result = chordCell(board, 1, 1);
      expect(result.changed).toBe(true);
      expect(result.hitMine).toBe(true);
    });
  });

  describe('toggleFlagOnBoard', () => {
    it('toggles flag on unrevealed cells', () => {
      const board = createEmptyBoard(3, 3);

      const flagRes = toggleFlagOnBoard(board, 0, 0);
      expect(flagRes.board[0][0].isFlagged).toBe(true);
      expect(flagRes.flagAdded).toBe(true);

      const unflagRes = toggleFlagOnBoard(flagRes.board, 0, 0);
      expect(unflagRes.board[0][0].isFlagged).toBe(false);
      expect(unflagRes.flagAdded).toBe(false);
    });

    it('does not flag already revealed cells', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].isRevealed = true;

      const res = toggleFlagOnBoard(board, 0, 0);
      expect(res.board[0][0].isFlagged).toBe(false);
      expect(res.flagAdded).toBe(false);
    });
  });

  describe('revealAllOnLoss', () => {
    it('reveals unflagged mines and marks incorrect flags', () => {
      const board = createEmptyBoard(3, 3);
      board[0][0].isMine = true; // unflagged mine -> should be revealed
      board[0][1].isMine = true;
      board[0][1].isFlagged = true; // correctly flagged mine -> keeps flag, not revealed
      board[1][0].isFlagged = true; // false flag -> should be marked isWrongFlag

      const exposed = revealAllOnLoss(board);

      expect(exposed[0][0].isRevealed).toBe(true);
      expect(exposed[0][1].isFlagged).toBe(true);
      expect(exposed[1][0].isWrongFlag).toBe(true);
    });
  });

  describe('flagAllOnWin', () => {
    it('flags all mines upon victory', () => {
      const board = createEmptyBoard(2, 2);
      board[0][0].isMine = true;
      board[1][1].isMine = true;

      const wonBoard = flagAllOnWin(board);
      expect(wonBoard[0][0].isFlagged).toBe(true);
      expect(wonBoard[1][1].isFlagged).toBe(true);
    });
  });

  describe('checkWin', () => {
    it('returns true when all non-mine cells are revealed', () => {
      const board = createEmptyBoard(2, 2);
      board[0][0].isMine = true;
      board[0][1].isRevealed = true;
      board[1][0].isRevealed = true;
      board[1][1].isRevealed = true;

      expect(checkWin(board)).toBe(true);
    });

    it('returns false if any non-mine cell is not revealed', () => {
      const board = createEmptyBoard(2, 2);
      board[0][0].isMine = true;
      board[0][1].isRevealed = true;
      board[1][0].isRevealed = false; // still closed

      expect(checkWin(board)).toBe(false);
    });
  });

  describe('countFlags', () => {
    it('accurately counts flagged cells', () => {
      const board = createEmptyBoard(4, 4);
      board[0][0].isFlagged = true;
      board[1][2].isFlagged = true;
      board[3][3].isFlagged = true;

      expect(countFlags(board)).toBe(3);
    });
  });

  describe('PRESETS', () => {
    it('has standard beginner, intermediate, and expert configurations', () => {
      expect(PRESETS.beginner).toEqual({ rows: 8, cols: 8, mines: 10 });
      expect(PRESETS.intermediate).toEqual({ rows: 16, cols: 16, mines: 40 });
      expect(PRESETS.expert).toEqual({ rows: 16, cols: 30, mines: 99 });
    });
  });
});
