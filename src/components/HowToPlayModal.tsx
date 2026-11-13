import React from 'react';
import { X, HelpCircle, MousePointer, Flag, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full shadow-2xl p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Panduan Cara Bermain</h2>
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
              <Sparkles className="w-4 h-4 text-amber-400" /> Tujuan Game
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Buka seluruh kotak yang aman tanpa menginjak ranjau! Anda menang ketika semua kotak selain ranjau berhasil dibuka.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-400 mt-0.5">
                <MousePointer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Klik Kiri (Sentuh Biasa)</h4>
                <p className="text-slate-400 text-xs">
                  Membuka kotak. Angka yang muncul menunjukkan berapa banyak ranjau yang berada di 8 kotak sekelilingnya.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 mt-0.5">
                <Flag className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Klik Kanan / Mode Bendera</h4>
                <p className="text-slate-400 text-xs">
                  Menandai kotak dengan bendera untuk menandakan dugaan lokasi ranjau agar tidak sengaja tertekan.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-xs">Chord / Klik Cepat (Double-Click)</h4>
                <p className="text-slate-400 text-xs">
                  Jika angka sudah memiliki jumlah bendera yang sesuai di sekitarnya, klik angka tersebut untuk langsung membuka semua kotak tersisa di sekitarnya.
                </p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300">
            💡 <strong>Jaminan Langkah Pertama:</strong> Kotak pertama yang Anda klik dijamin 100% selalu aman dan membuka area awal secara mulus!
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors"
          >
            Mengerti, Ayo Main!
          </button>
        </div>
      </div>
    </div>
  );
};
