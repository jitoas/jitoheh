import React, { useEffect, useState, useRef } from 'react';
import { VoteResult, Card } from '../types';
import { CheckCircle, XCircle, ShieldAlert } from 'lucide-react';
import { sfx } from '../utils/audioSynth';
import { WEAPONS_DATABASE } from '../data/weapons';
import { EVIDENCE_DATABASE } from '../data/evidence';
import { getCardImageUrl } from '../data/cardArtImages';

interface VoteResultAnimationProps {
  result: VoteResult | null;
  onDismiss: () => void;
}

export const VoteResultAnimation: React.FC<VoteResultAnimationProps> = ({ result, onDismiss }) => {
  const [cardsRevealed, setCardsRevealed] = useState(false);
  const [stampPhase, setStampPhase] = useState<'entering' | 'slammed' | 'fading'>('entering');
  const [screenShake, setScreenShake] = useState(false);
  const playedResultIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!result || !result.id) return;
    
    // Prevent re-running timers if this result ID has already been processed
    if (playedResultIdRef.current === result.id) {
      return;
    }
    playedResultIdRef.current = result.id;

    setCardsRevealed(true);
    setStampPhase('entering');
    setScreenShake(false);

    // Step 1 & 2: Selected Weapon & Evidence are shown
    // Step 3 & 4: At 600ms, play Stamp sound and show cinematic Noir result card with impact
    const slamTimer = setTimeout(() => {
      setStampPhase('slammed');
      setScreenShake(true);
      sfx.playStampSound();

      const shakeTimer = setTimeout(() => setScreenShake(false), 300);

      return () => {
        clearTimeout(shakeTimer);
      };
    }, 600);

    // Hold visible for ~1.5 seconds before fading out
    const fadeTimer = setTimeout(() => {
      setStampPhase('fading');
    }, 2800);

    // Dismiss modal
    const dismissTimer = setTimeout(() => {
      onDismiss();
    }, 3400);

    return () => {
      clearTimeout(slamTimer);
      clearTimeout(fadeTimer);
      clearTimeout(dismissTimer);
    };
  }, [result?.id, onDismiss]);

  if (!result) return null;

  // Find card metadata for artwork
  const weaponCard: Card = WEAPONS_DATABASE.find((w) => w.name === result.weaponName) || {
    id: 'w_custom',
    name: result.weaponName,
    category: 'weapon',
    tags: ['metal'],
    description: '',
    artStyleId: 101,
  };

  const evidenceCard: Card = EVIDENCE_DATABASE.find((e) => e.name === result.evidenceName) || {
    id: 'e_custom',
    name: result.evidenceName,
    category: 'evidence',
    tags: ['paper'],
    description: '',
    artStyleId: 201,
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 transition-all duration-700 dir-rtl ${
        stampPhase === 'fading' ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      } ${screenShake ? 'translate-x-3 translate-y-3 -rotate-1' : ''}`}
    >
      <div
        className={`w-full max-w-3xl rounded-3xl border-2 border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden space-y-6 text-right transition-transform duration-700 ${
          stampPhase === 'slammed' ? 'scale-[1.02]' : 'scale-100'
        }`}
      >
        {/* Background dossier grid watermark */}
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        {/* Vintage Top Dossier Header */}
        <div className="relative z-10 space-y-2 border-b border-zinc-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
            <ShieldAlert className="w-4 h-4" /> نتيجة فحص وتوثيق الاتهام الجنائي
          </div>

          <h3 className="text-xl md:text-2xl font-extrabold text-zinc-100 font-serif pt-1">
            المحقق <span className="text-amber-400">{result.voterName}</span> اتهم المشتبه به{' '}
            <span className="text-red-400">{result.targetPlayerName}</span>
          </h3>
        </div>

        {/* Accused Items Container (Evidence LEFT, Weapon RIGHT in dir-ltr) */}
        <div className="relative z-10 min-h-[280px] flex items-center justify-center">
          <div
            className={`flex flex-row items-center justify-center gap-6 sm:gap-12 my-2 dir-ltr transition-all duration-700 transform ${
              cardsRevealed ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
            }`}
          >
            {/* 1. Selected Evidence on the LEFT */}
            <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-sky-500/30 shadow-xl w-36 sm:w-48 transition-transform duration-300 hover:border-sky-500/60">
              <div className="text-[10px] sm:text-xs font-mono font-bold text-sky-400 uppercase tracking-wider text-center">
                الدليل (Evidence)
              </div>
              <div className="w-28 h-40 sm:w-36 sm:h-52 rounded-xl overflow-hidden border border-zinc-700 bg-black relative shadow-lg">
                <img
                  src={getCardImageUrl(evidenceCard)}
                  alt={evidenceCard.name}
                  className="w-full h-full object-cover filter contrast-110 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <span className="text-sm sm:text-base font-extrabold text-zinc-100 font-serif text-center truncate max-w-full">
                {evidenceCard.name}
              </span>
            </div>

            {/* 2. Selected Weapon on the RIGHT */}
            <div className="flex flex-col items-center gap-2 p-3 sm:p-4 rounded-2xl bg-zinc-900/90 border border-amber-500/30 shadow-xl w-36 sm:w-48 transition-transform duration-300 hover:border-amber-500/60">
              <div className="text-[10px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-wider text-center">
                السلاح (Weapon)
              </div>
              <div className="w-28 h-40 sm:w-36 sm:h-52 rounded-xl overflow-hidden border border-zinc-700 bg-black relative shadow-lg">
                <img
                  src={getCardImageUrl(weaponCard)}
                  alt={weaponCard.name}
                  className="w-full h-full object-cover filter contrast-110 brightness-95"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
              <span className="text-sm sm:text-base font-extrabold text-zinc-100 font-serif text-center truncate max-w-full">
                {weaponCard.name}
              </span>
            </div>
          </div>

          {/* Cinematic Noir Result Card Overlay */}
          {stampPhase === 'slammed' && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none p-4">
              <div className="animate-[cardImpact_0.18s_ease-out_forwards] w-full max-w-lg">
                {result.isFullyCorrect ? (
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-emerald-950/95 via-zinc-950/95 to-amber-950/95 border-2 border-emerald-400/80 shadow-[0_0_70px_rgba(16,185,129,0.7)] ring-1 ring-amber-500/50 backdrop-blur-md text-center space-y-2">
                    <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold uppercase tracking-widest">
                      <CheckCircle className="w-4 h-4 text-emerald-400" /> توثيق التحقيق
                    </div>
                    <div className="text-3xl sm:text-5xl font-black tracking-widest text-emerald-400 font-mono uppercase drop-shadow-[0_2px_10px_rgba(16,185,129,0.5)]">
                      CORRECT
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-amber-300 font-serif">
                      الاتهام صحيح بالكامل!
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-red-950/95 via-zinc-950/95 to-rose-950/95 border-2 border-red-500/80 shadow-[0_0_70px_rgba(239,68,68,0.7)] ring-1 ring-red-500/40 backdrop-blur-md text-center space-y-2">
                    <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-mono font-bold uppercase tracking-widest">
                      <XCircle className="w-4 h-4 text-red-400" /> توثيق التحقيق
                    </div>
                    <div className="text-3xl sm:text-5xl font-black tracking-widest text-red-500 font-mono uppercase drop-shadow-[0_2px_10px_rgba(239,68,68,0.5)]">
                      WRONG
                    </div>
                    <div className="text-lg sm:text-2xl font-black text-red-300 font-serif">
                      الاتهام غير صحيح!
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
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

