import React, { useEffect } from 'react';
import { VoteResult } from '../types';
import { CheckCircle, XCircle, ShieldAlert } from 'lucide-react';

interface VoteResultAnimationProps {
  result: VoteResult | null;
  onDismiss: () => void;
}

export const VoteResultAnimation: React.FC<VoteResultAnimationProps> = ({ result, onDismiss }) => {
  useEffect(() => {
    if (result) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 2800);
      return () => clearTimeout(timer);
    }
  }, [result, onDismiss]);

  if (!result) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-xl rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-8 text-center shadow-2xl relative overflow-hidden space-y-6">
        {/* Top Header: Who Voted for Whom */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" /> VOTE RESULT VERIFICATION
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-zinc-100 font-serif pt-2">
            <span className="text-amber-400">{result.voterName}</span> Accused{' '}
            <span className="text-red-400">{result.targetPlayerName}</span>
          </h3>
        </div>

        {/* Center Validation Stamps */}
        <div className="grid grid-cols-2 gap-4 my-4">
          {/* Weapon Card Check */}
          <div className="relative p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl flex flex-col items-center justify-between space-y-3">
            <span className="text-[10px] text-zinc-500 font-mono uppercase">ACCUSED WEAPON</span>
            <span className="text-sm font-bold text-zinc-100">{result.weaponName}</span>

            {/* Cinematic Stamp */}
            <div className="animate-in zoom-in-50 duration-500">
              {result.isWeaponCorrect ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-extrabold text-xs uppercase tracking-widest rotate-[-4deg] shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-4 h-4" /> CORRECT
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-400 font-extrabold text-xs uppercase tracking-widest rotate-[-4deg] shadow-lg shadow-red-500/20">
                  <XCircle className="w-4 h-4" /> WRONG
                </div>
              )}
            </div>
          </div>

          {/* Evidence Card Check */}
          <div className="relative p-5 rounded-2xl border border-zinc-800 bg-zinc-900/60 shadow-xl flex flex-col items-center justify-between space-y-3">
            <span className="text-[10px] text-zinc-500 font-mono uppercase">ACCUSED EVIDENCE</span>
            <span className="text-sm font-bold text-zinc-100">{result.evidenceName}</span>

            {/* Cinematic Stamp */}
            <div className="animate-in zoom-in-50 duration-500 delay-200">
              {result.isEvidenceCorrect ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 font-extrabold text-xs uppercase tracking-widest rotate-[4deg] shadow-lg shadow-emerald-500/20">
                  <CheckCircle className="w-4 h-4" /> CORRECT
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/20 border-2 border-red-500 text-red-400 font-extrabold text-xs uppercase tracking-widest rotate-[4deg] shadow-lg shadow-red-500/20">
                  <XCircle className="w-4 h-4" /> WRONG
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Suspected Killer Overall Stamp */}
        <div className="pt-2 border-t border-zinc-800">
          <span className="text-xs text-zinc-400 font-mono block mb-2">
            Suspected Killer Identity:
          </span>
          {result.isKillerCorrect ? (
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              ✓ Killer Identity Matched!
            </span>
          ) : (
            <span className="text-xs font-bold text-red-400 uppercase tracking-wider">
              ✗ Wrong Suspect Accused
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
