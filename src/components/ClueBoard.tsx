import React, { useState, useEffect } from 'react';
import { ConfirmedClue, ClueSpeed } from '../types';
import { INVESTIGATION_FOLDERS } from '../data/clues';
import { ShieldAlert, CheckCircle2, Clock, Lock, Sparkles } from 'lucide-react';

interface ClueBoardProps {
  clues: ConfirmedClue[];
  clueCycleStartTime?: number | null;
  clueReleaseSpeed?: ClueSpeed;
  customClueTimeSeconds?: number;
}

export const ClueBoard: React.FC<ClueBoardProps> = ({
  clues,
  clueCycleStartTime,
  clueReleaseSpeed,
  customClueTimeSeconds,
}) => {
  const getDuration = () => {
    if (clueReleaseSpeed === 'fast') return 30;
    if (clueReleaseSpeed === 'normal') return 60;
    if (clueReleaseSpeed === 'slow') return 120;
    if (clueReleaseSpeed === 'custom') return customClueTimeSeconds || 45;
    return 60;
  };

  const duration = getDuration();
  const [timeLeft, setTimeLeft] = useState<number>(duration);

  useEffect(() => {
    if (!clueCycleStartTime) {
      setTimeLeft(duration);
      return;
    }
    const updateTimer = () => {
      const elapsed = Math.floor((Date.now() - clueCycleStartTime) / 1000);
      const rem = Math.max(0, duration - elapsed);
      setTimeLeft(rem);
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [clueCycleStartTime, clueReleaseSpeed, customClueTimeSeconds]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5 dir-rtl text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-extrabold text-zinc-100 font-serif uppercase tracking-wider">
            لوحة أدلة التحقيق العامة
          </h2>
        </div>

        {/* Timer status badge */}
        <div className="flex items-center gap-3 bg-zinc-900/90 px-3.5 py-1.5 rounded-xl border border-zinc-800 font-mono text-xs">
          <Clock className="w-4 h-4 text-sky-400" />
          {clues.length >= 6 ? (
            <span className="text-emerald-400 font-bold">تم كشف جميع الأدلة الـ6</span>
          ) : timeLeft > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">الدليل التالي ينكشف بعد:</span>
              <span className="text-amber-400 font-extrabold text-sm">{formatTime(timeLeft)}</span>
            </div>
          ) : (
            <span className="text-emerald-400 font-bold animate-pulse">
              🔓 المؤقت اكتمل! الطبيب الشرعي يحدد الدليل التالي...
            </span>
          )}
        </div>
      </div>

      {/* 6-Folder Grid (3 Columns: Top-Left, Top-Center, Top-Right, Bottom-Left, Bottom-Center, Bottom-Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dir-ltr">
        {INVESTIGATION_FOLDERS.map((folder, folderIdx) => {
          const isPermanent = folderIdx === 0 || folderIdx === 1;
          const confirmedClue = clues.find((c) => c.folderIndex === folderIdx);

          return (
            <div
              key={folder.id}
              className={`relative p-5 rounded-2xl border transition-all shadow-xl overflow-hidden text-right dir-rtl ${
                confirmedClue
                  ? isPermanent
                    ? 'border-amber-500/60 bg-gradient-to-br from-amber-950/30 via-zinc-950 to-zinc-900 ring-1 ring-amber-500/20'
                    : 'border-amber-500/40 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900'
                  : 'border-zinc-800/80 bg-zinc-900/30 text-zinc-500'
              }`}
            >
              {/* Badge Accent */}
              {isPermanent ? (
                <div className="absolute top-0 left-0 bg-amber-500 text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-br-lg uppercase tracking-wider font-mono flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5" /> دليل دائم #{folderIdx + 1}
                </div>
              ) : confirmedClue ? (
                <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[9px] font-extrabold px-2.5 py-0.5 rounded-br-lg uppercase tracking-wider font-mono">
                  دليل #{folderIdx + 1}
                </div>
              ) : (
                <div className="absolute top-0 left-0 bg-zinc-800 text-zinc-400 text-[9px] font-mono px-2 py-0.5 rounded-br-lg flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5 text-amber-500/80" /> مجلد #{folderIdx + 1}
                </div>
              )}

              {/* Folder Header */}
              <div className="pt-2">
                <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                  {folder.name}
                </span>

                {/* Clue Content */}
                {confirmedClue ? (
                  <div className="mt-2 inline-block bg-yellow-400/20 border border-yellow-400/50 px-3 py-1.5 rounded-xl">
                    <span className="text-base font-extrabold text-yellow-300 tracking-wide font-serif uppercase">
                      {confirmedClue.clueTag}
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl border border-dashed border-zinc-800/80 bg-black/40 text-center">
                    <span className="text-xs font-mono text-zinc-500 block">
                      ⏳ بانتهاء المؤقت ({formatTime(timeLeft)})
                    </span>
                  </div>
                )}
              </div>

              {/* Footer status */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-zinc-800/80 pt-2">
                <span>
                  {isPermanent ? 'دليل مكشوف دائماً' : confirmedClue ? 'أدلة موثقة' : 'مغلق بانتظار الوقت'}
                </span>
                {confirmedClue ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> مؤكد
                  </span>
                ) : (
                  <span className="text-zinc-600 font-mono">ينكشف بالمؤقت</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
