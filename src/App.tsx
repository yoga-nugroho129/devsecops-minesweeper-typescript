import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Sliders, HelpCircle, Trophy, RefreshCw, Sparkles, AlertTriangle } from 'lucide-react';
import { Difficulty, GameConfig, GameStatus, BoardMatrix, BestScores, Language } from './types/minesweeper';
import {
  PRESETS,
  createEmptyBoard,
  populateMines,
  revealCell,
  chordCell,
  toggleFlagOnBoard,
  revealAllOnLoss,
  flagAllOnWin,
  checkWin,
  countFlags,
} from './utils/minesweeper';
import { sounds } from './utils/sound';
import { translations } from './utils/i18n';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { CustomGameModal } from './components/CustomGameModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { LanguageToggle } from './components/LanguageToggle';

const STORAGE_KEY_SCORES = 'minesweeper_best_scores';
const STORAGE_KEY_LANG = 'minesweeper_lang';

export const App: React.FC = () => {
  // Language Selection (Default: 'en' as requested)
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG);
      if (savedLang === 'en' || savedLang === 'id') return savedLang;
    } catch {
      // Ignore
    }
    return 'en';
  });

  const t = translations[language];

  // Difficulty and Board Configuration (Default: 8x8 with 10 mines)
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const [config, setConfig] = useState<GameConfig>(PRESETS.beginner);

  // Game Engine State
  const [status, setStatus] = useState<GameStatus>('idle');
  const [board, setBoard] = useState<BoardMatrix>(() => createEmptyBoard(PRESETS.beginner.rows, PRESETS.beginner.cols));
  const [timer, setTimer] = useState<number>(0);
  const [flagMode, setFlagMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);

  // Best scores
  const [bestScores, setBestScores] = useState<BestScores>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCORES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer loop
  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = setInterval(() => {
        setTimer(prev => Math.min(prev + 1, 999));
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, newLang);
    } catch {
      // Ignore
    }
  };

  // Reset Game
  const resetGame = useCallback(() => {
    setStatus('idle');
    setTimer(0);
    setBoard(createEmptyBoard(config.rows, config.cols));
  }, [config.rows, config.cols]);

  // Apply new configuration (custom or preset)
  const handleApplyConfig = (newDifficulty: Difficulty, newConfig: GameConfig) => {
    setDifficulty(newDifficulty);
    setConfig(newConfig);
    setStatus('idle');
    setTimer(0);
    setBoard(createEmptyBoard(newConfig.rows, newConfig.cols));
  };

  // Celebration trigger
  const triggerWinCelebration = (winTime: number) => {
    sounds.playWin();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'],
    });

    // Update best score
    const scoreKey = `${config.rows}x${config.cols}-${config.mines}`;
    setBestScores(prev => {
      const prevBest = prev[scoreKey];
      if (prevBest === undefined || winTime < prevBest) {
        const updated = { ...prev, [scoreKey]: winTime };
        try {
          localStorage.setItem(STORAGE_KEY_SCORES, JSON.stringify(updated));
        } catch {
          // Ignore storage errors
        }
        return updated;
      }
      return prev;
    });
  };

  // Cell Reveal Action
  const handleReveal = (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    // Mobile / Flag mode handling
    if (flagMode) {
      handleFlag(row, col);
      return;
    }

    // First Click: Safely place mines
    let currentBoard = board;
    if (status === 'idle') {
      currentBoard = populateMines(board, config.rows, config.cols, config.mines, row, col);
      setStatus('playing');
    }

    const result = revealCell(currentBoard, row, col);

    if (result.hitMine) {
      // Hit a mine -> Game Over
      sounds.playExplosion();
      setBoard(revealAllOnLoss(result.board));
      setStatus('lost');
    } else {
      // Safe reveal
      sounds.playClick();

      // Check win condition
      if (checkWin(result.board)) {
        setBoard(flagAllOnWin(result.board));
        setStatus('won');
        triggerWinCelebration(timer);
      } else {
        setBoard(result.board);
      }
    }
  };

  // Flag Toggle Action
  const handleFlag = (row: number, col: number) => {
    if (status === 'won' || status === 'lost') return;

    const { board: newBoard, flagAdded } = toggleFlagOnBoard(board, row, col);
    if (flagAdded) {
      sounds.playFlag();
    } else {
      sounds.playUnflag();
    }
    setBoard(newBoard);
  };

  // Chord Action (Fast Reveal on numbers)
  const handleChord = (row: number, col: number) => {
    if (status !== 'playing') return;

    const result = chordCell(board, row, col);
    if (!result.changed) return;

    if (result.hitMine) {
      sounds.playExplosion();
      setBoard(revealAllOnLoss(result.board));
      setStatus('lost');
    } else {
      sounds.playChord();
      if (checkWin(result.board)) {
        setBoard(flagAllOnWin(result.board));
        setStatus('won');
        triggerWinCelebration(timer);
      } else {
        setBoard(result.board);
      }
    }
  };

  const handleToggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const placedFlags = countFlags(board);
  const minesRemaining = config.mines - placedFlags;
  const currentScoreKey = `${config.rows}x${config.cols}-${config.mines}`;
  const bestTime = bestScores[currentScoreKey];

  const getDifficultyLabel = (diff: Difficulty) => {
    switch (diff) {
      case 'beginner':
        return t.beginner;
      case 'intermediate':
        return t.intermediate;
      case 'expert':
        return t.expert;
      case 'custom':
        return t.custom;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between py-6 px-3 sm:px-6">
      {/* Top Navigation & Brand */}
      <header className="max-w-4xl mx-auto w-full mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-rose-600 to-amber-500 rounded-2xl shadow-lg shadow-rose-950/40">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                {t.appTitle}
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {config.rows}×{config.cols}
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Action buttons & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Language Flag Selector (Default EN) */}
            <LanguageToggle
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />

            <button
              type="button"
              onClick={() => setIsHelpOpen(true)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title={t.howToPlay}
              aria-label={t.howToPlay}
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-200 transition-all shadow-sm text-xs sm:text-sm font-semibold"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">{t.changeGrid} ({config.rows}×{config.cols})</span>
              <span className="sm:hidden">{t.gridShort}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Game Card */}
      <main className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm w-full max-w-fit">
          {/* Status & Banner for Win / Loss */}
          {status === 'won' && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center justify-between gap-3 text-emerald-300 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold">
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>{t.winTitle(timer)}</span>
              </div>
              <button
                type="button"
                onClick={resetGame}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t.playAgain}
              </button>
            </div>
          )}

          {status === 'lost' && (
            <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-center justify-between gap-3 text-rose-300 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                <span>{t.lostTitle}</span>
              </div>
              <button
                type="button"
                onClick={resetGame}
                className="px-3 py-1 bg-rose-500 hover:bg-rose-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> {t.tryAgain}
              </button>
            </div>
          )}

          {/* Minesweeper Header Bar */}
          <Header
            status={status}
            minesRemaining={minesRemaining}
            timer={timer}
            flagMode={flagMode}
            isMuted={isMuted}
            t={t}
            onReset={resetGame}
            onToggleFlagMode={() => setFlagMode(prev => !prev)}
            onToggleMute={handleToggleMute}
          />

          {/* Minesweeper Board */}
          <Board
            board={board}
            onReveal={handleReveal}
            onFlag={handleFlag}
            onChord={handleChord}
            disabled={status === 'won' || status === 'lost'}
            t={t.cellAria}
          />

          {/* Bottom info stats */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-300">
                {getDifficultyLabel(difficulty)}:
              </span>
              <span>
                {config.rows}×{config.cols} ({config.mines} {t.minesCountSuffix})
              </span>
            </div>

            {bestTime !== undefined && (
              <div className="flex items-center gap-1.5 text-amber-400 font-mono">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.record(bestTime)}</span>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-6 text-center text-xs text-slate-500">
        {t.footerText}
      </footer>

      {/* Modals */}
      <CustomGameModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentDifficulty={difficulty}
        currentConfig={config}
        t={t}
        onApplyConfig={handleApplyConfig}
      />

      <HowToPlayModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        t={t}
      />
    </div>
  );
};

export default App;
