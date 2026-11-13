import React from 'react';
import { X, HelpCircle, MousePointer, Flag, Sparkles } from 'lucide-react';
import { Translations } from '../utils/i18n';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: Translations;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose, t }) => {
  if (!isOpen) return null;

  const g = t.modalGuide;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">{g.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4 text-sm text-slate-300">
          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl">
            <h3 className="font-semibold text-white mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> {g.goalTitle}
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              {g.goalDesc}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 mt-0.5">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">{g.leftTitle}</h4>
                <p className="text-slate-400 text-xs">
                  {g.leftDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 mt-0.5">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">{g.rightTitle}</h4>
                <p className="text-slate-400 text-xs">
                  {g.rightDesc}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">{g.chordTitle}</h4>
                <p className="text-slate-400 text-xs">
                  {g.chordDesc}
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            💡 {g.safeTip}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors"
          >
            {g.understandButton}
          </button>
        </div>
      </div>
    </div>
  );
};
