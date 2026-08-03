import React, { useEffect, useState } from 'react';
import { VoteResult } from '../types';
import { CheckCircle, XCircle, ShieldAlert, Award, FileQuestion, Stamp } from 'lucide-react';
import { sfx } from '../utils/audioSynth';

interface VoteResultAnimationProps {
  result: VoteResult | null;
  onDismiss: () => void;
}

export const VoteResultAnimation: React.FC<VoteResultAnimationProps> = ({ result, onDismiss }) => {
  const [stampPhase, setStampPhase] = useState<'entering' | 'slammed' | 'fading'>('entering');
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    if (result) {
      setStampPhase('entering');
      // Trigger camera zoom, slam stamp sound and screen shake after 350ms
      const slamTimer = setTimeout(() => {
        setStampPhase('slammed');
        setScreenShake(true);
        sfx.playStampSlam();

        if (result.isFullyCorrect) {
          setTimeout(() => sfx.playCorrectChime(), 250);
        } else {
          setTimeout(() => sfx.playWrongBuzz(), 250);
        }

        setTimeout(() => setScreenShake(false), 350);
      }, 350);

      // Start smooth fade out before dismiss
      const fadeTimer = setTimeout(() => {
        setStampPhase('fading');
      }, 3800);

      const dismissTimer = setTimeout(() => {
        onDismiss();
      }, 4400);

      return () => {
        clearTimeout(slamTimer);
        clearTimeout(fadeTimer);
        clearTimeout(dismissTimer);
      };
    }
  }, [result, onDismiss]);

  if (!result) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 transition-all duration-500 dir-rtl ${
        stampPhase === 'fading' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      } ${screenShake ? 'translate-x-2 translate-y-2' : ''}`}
    >
      <div
        className={`w-full max-w-2xl rounded-3xl border-2 border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-8 text-center shadow-2xl relative overflow-hidden space-y-6 text-right transition-transform duration-700 ${
          stampPhase === 'slammed' ? 'scale-105' : 'scale-100'
        }`}
      >
        {/* Background dossier grid watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Vintage Top Dossier Stamp Header */}
        <div className="relative z-10 space-y-2 border-b border-zinc-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> نتيجة فحص وتوثيق الاتهام الجنائي
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-zinc-100 font-serif pt-1">
            المحقق <span className="text-amber-400">{result.voterName}</span> اتهم المشتبه به{' '}
            <span className="text-red-400">{result.targetPlayerName}</span>
          </h3>
        </div>

        {/* Accused Summary Details */}
        <div className="relative z-10 flex flex-col items-center justify-center p-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 space-y-1">
          <div className="text-xs text-zinc-400 font-mono">
            السلاح: <span className="text-zinc-200 font-bold">{result.weaponName}</span> • الدليل: <span className="text-zinc-200 font-bold">{result.evidenceName}</span>
          </div>
        </div>

        {/* Single Slamming Stamp Result (CORRECT or WRONG only) */}
        <div className="relative z-10 py-8 flex flex-col items-center justify-center overflow-hidden min-h-[140px]">
          <div
            className={`transition-all duration-300 cubic-bezier(0.175, 0.885, 0.32, 1.275) transform ${
              stampPhase === 'entering'
                ? 'scale-[5] opacity-0 rotate-[-30deg]'
                : 'scale-100 opacity-100 rotate-[-5deg]'
            }`}
          >
            {result.isFullyCorrect ? (
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-emerald-500/20 border-4 border-emerald-500 text-emerald-400 font-black text-2xl md:text-3xl uppercase tracking-widest shadow-2xl shadow-emerald-500/50">
                <CheckCircle className="w-8 h-8" /> CORRECT • صحيح
              </div>
            ) : (
              <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-red-500/20 border-4 border-red-500 text-red-400 font-black text-2xl md:text-3xl uppercase tracking-widest shadow-2xl shadow-red-500/50">
                <XCircle className="w-8 h-8" /> WRONG • خاطئ
              </div>
            )}
          </div>
        </div>

        {/* Close Button */}
        <div className="relative z-10 pt-2">
          <button
            onClick={onDismiss}
            className="px-8 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            إغلاق شاشة التوثيق
          </button>
        </div>
      </div>
    </div>
  );
};


