import React from 'react';
import { Smartphone, X, CheckCircle, Download, ArrowRight } from 'lucide-react';

export default function WebToAppBanner({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full p-4 animate-bounce-in">
      <div className="glass-panel rounded-2xl p-5 border-2 border-emerald-400/50 shadow-2xl shadow-emerald-950/80 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-emerald-400/60 hover:text-emerald-200 p-1 rounded-lg hover:bg-emerald-900/40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center flex-shrink-0 text-emerald-300 shadow-inner">
            <Smartphone className="w-6 h-6 text-emerald-400 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-heading font-bold text-lg text-emerald-100">
                Take KAIRO With You
              </h4>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-400 text-emerald-950 rounded-full">
                FREE APP
              </span>
            </div>
            <p className="text-xs text-emerald-200/90 leading-relaxed mb-4">
              Need an artisan again? Get faster access to verified local professionals, instant chat, and live location tracking from your phone.
            </p>

            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant status updates & direct phone call</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Saved trusted artisans for quick rebooking</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert('Thank you for trying KAIRO! App store download link copied to clipboard.');
                  onClose();
                }}
                className="emerald-button-gradient flex-1 py-2 px-3 rounded-xl text-xs font-bold text-emerald-950 flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" />
                <span>Download KAIRO</span>
              </button>
              <button
                onClick={onClose}
                className="py-2 px-3 rounded-xl text-xs font-medium text-emerald-300 hover:text-emerald-100 hover:bg-emerald-900/40 transition-all flex items-center gap-1"
              >
                <span>Continue on Web</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
