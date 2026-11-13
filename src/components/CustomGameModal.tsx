import React, { useState, useEffect } from 'react';
import { X, Sliders, Check } from 'lucide-react';
import { Difficulty, GameConfig } from '../types/minesweeper';
import { PRESETS } from '../utils/minesweeper';

interface CustomGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentDifficulty: Difficulty;
  currentConfig: GameConfig;
  onApplyConfig: (difficulty: Difficulty, config: GameConfig) => void;
}

export const CustomGameModal: React.FC<CustomGameModalProps> = ({
  isOpen,
  onClose,
  currentDifficulty,
  currentConfig,
  onApplyConfig,
}) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(currentDifficulty);
  const [customRows, setCustomRows] = useState<number>(currentConfig.rows);
  const [customCols, setCustomCols] = useState<number>(currentConfig.cols);
  const [customMines, setCustomMines] = useState<number>(currentConfig.mines);

  useEffect(() => {
    setSelectedDifficulty(currentDifficulty);
    setCustomRows(currentConfig.rows);
    setCustomCols(currentConfig.cols);
    setCustomMines(currentConfig.mines);
  }, [currentDifficulty, currentConfig, isOpen]);

  if (!isOpen) return null;

  const maxMines = Math.max(1, customRows * customCols - 1);
  const currentDensity = ((customMines / (customRows * customCols)) * 100).toFixed(1);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDifficulty === 'custom') {
      const rows = Math.max(4, Math.min(customRows, 40));
      const cols = Math.max(4, Math.min(customCols, 40));
      const mines = Math.max(1, Math.min(customMines, rows * cols - 1));
      onApplyConfig('custom', { rows, cols, mines });
    } else {
      onApplyConfig(selectedDifficulty, PRESETS[selectedDifficulty]);
    }
    onClose();
  };

  const handlePresetSelect = (diff: Difficulty) => {
    setSelectedDifficulty(diff);
    if (diff !== 'custom') {
      const preset = PRESETS[diff];
      setCustomRows(preset.rows);
      setCustomCols(preset.cols);
      setCustomMines(preset.mines);
    }
  };

  const setDensityPreset = (percentage: number) => {
    const totalCells = customRows * customCols;
    const computedMines = Math.max(1, Math.min(Math.round((totalCells * percentage) / 100), totalCells - 1));
    setCustomMines(computedMines);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-md w-full shadow-2xl p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">Pengaturan Ukuran & Ranjau</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApply} className="mt-4 space-y-5">
          {/* Difficulty Preset Options */}
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
              Pilihan Kesulitan
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('beginner')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedDifficulty === 'beginner'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Pemula (Default)</span>
                  {selectedDifficulty === 'beginner' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-xs text-slate-400 mt-1">8 × 8 • 10 Ranjau</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('intermediate')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedDifficulty === 'intermediate'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Menengah</span>
                  {selectedDifficulty === 'intermediate' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-xs text-slate-400 mt-1">16 × 16 • 40 Ranjau</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('expert')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedDifficulty === 'expert'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Ahli</span>
                  {selectedDifficulty === 'expert' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-xs text-slate-400 mt-1">16 × 30 • 99 Ranjau</span>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect('custom')}
                className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                  selectedDifficulty === 'custom'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-800/60 border-slate-700 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm">Kustom</span>
                  {selectedDifficulty === 'custom' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <span className="text-xs text-slate-400 mt-1">Atur Baris & Kolom</span>
              </button>
            </div>
          </div>

          {/* Custom Settings Form (Always visible or editable when 'custom' is selected) */}
          {selectedDifficulty === 'custom' && (
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Baris (Row) <span className="text-slate-500">(4-40)</span>
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={40}
                    value={customRows}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 4;
                      setCustomRows(val);
                      if (customMines >= val * customCols) {
                        setCustomMines(Math.max(1, val * customCols - 1));
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400 block mb-1">
                    Kolom (Col) <span className="text-slate-500">(4-40)</span>
                  </label>
                  <input
                    type="number"
                    min={4}
                    max={40}
                    value={customCols}
                    onChange={e => {
                      const val = parseInt(e.target.value) || 4;
                      setCustomCols(val);
                      if (customMines >= customRows * val) {
                        setCustomMines(Math.max(1, customRows * val - 1));
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>Jumlah Ranjau (1 - {maxMines})</span>
                  <span className="text-amber-400 font-mono font-semibold">Kerapatan: {currentDensity}%</span>
                </div>
                <input
                  type="number"
                  min={1}
                  max={maxMines}
                  value={customMines}
                  onChange={e => {
                    const val = parseInt(e.target.value) || 1;
                    setCustomMines(Math.min(val, maxMines));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:border-amber-400 focus:outline-none"
                />

                {/* Quick Density Presets */}
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-500">Preset Kerapatan:</span>
                  <button
                    type="button"
                    onClick={() => setDensityPreset(12)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700"
                  >
                    12% (Santai)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensityPreset(16)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700"
                  >
                    16% (Standar)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDensityPreset(22)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 border border-slate-700"
                  >
                    22% (Sulit)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-md hover:shadow-amber-500/20 transition-all"
            >
              Terapkan & Main
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
