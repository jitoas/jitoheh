import React, { useState, useEffect, useRef } from 'react';
import { ConfirmedClue, CaseSettings, ClueFolder } from '../types';
import { INVESTIGATION_FOLDERS, getSlotTimerDuration } from '../data/clues';
import { ShieldAlert, CheckCircle2, Clock, Lock, Sparkles, Unlock } from 'lucide-react';
import { sfx } from '../utils/audioSynth';

interface ClueBoardProps {
  clues: ConfirmedClue[];
  folders?: ClueFolder[];
  clueCycleStartTime?: number | null;
  slotStartTimes?: Record<number, number>;
  settings?: CaseSettings;
  clueReleaseSpeed?: string;
  customClueTimeSeconds?: number;
}

export const ClueBoard: React.FC<ClueBoardProps> = ({
  clues,
  folders,
  clueCycleStartTime,
  slotStartTimes,
  settings,
  clueReleaseSpeed,
  customClueTimeSeconds,
}) => {
  const [now, setNow] = useState<number>(Date.now());
  const prevCluesKeyRef = useRef<string>('');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const currentKey = clues.map((c) => `${c.folderIndex}:${c.clueTag}`).join('|');
    if (prevCluesKeyRef.current && prevCluesKeyRef.current !== currentKey) {
      sfx.playDarkWhisper();
    }
    prevCluesKeyRef.current = currentKey;
  }, [clues]);

  const activeSettings = {
    clueReleaseSpeed: settings?.clueReleaseSpeed || clueReleaseSpeed || 'normal',
    customClueTimeSeconds: settings?.customClueTimeSeconds || customClueTimeSeconds,
    slotTimers: settings?.slotTimers,
  };

  const getSlotTimeLeft = (folderId: number): number => {
    const duration = getSlotTimerDuration(activeSettings, folderId);
    if (duration === 0) return 0; // Folder 1 & 2 always unlocked!

    const startTime = (slotStartTimes && slotStartTimes[folderId]) || clueCycleStartTime || now;
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    return Math.max(0, duration - elapsedSeconds);
  };

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

        {/* Clue count badge */}
        <div className="flex items-center gap-3 bg-zinc-900/90 px-3.5 py-1.5 rounded-xl border border-zinc-800 font-mono text-xs">
          <Clock className="w-4 h-4 text-sky-400" />
          {clues.length >= 6 ? (
            <span className="text-emerald-400 font-bold">تم كشف جميع الأدلة الـ6</span>
          ) : (
            <span className="text-amber-400 font-bold">الأدلة المكشوفة: {clues.length} / 6</span>
          )}
        </div>
      </div>

      {/* 6-Folder Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 dir-ltr">
        {(folders || INVESTIGATION_FOLDERS).map((folder, folderIdx) => {
          const isPermanent = folderIdx === 0 || folderIdx === 1;
          const confirmedClue = clues.find((c) => c.folderIndex === folderIdx);
          const remainingTime = getSlotTimeLeft(folderIdx);
          const isUnlocked = remainingTime === 0;

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
                ) : isUnlocked ? (
                  <div className="mt-3 p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 text-center animate-pulse">
                    <span className="text-xs font-mono text-amber-400 font-bold flex items-center justify-center gap-1.5">
                      <Unlock className="w-3.5 h-3.5 text-amber-400" />
                      <span>متاح الآن — الطبيب الشرعي يختار الدليل...</span>
                    </span>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl border border-dashed border-zinc-800 bg-zinc-950 text-center">
                    <span className="text-xs font-mono text-amber-400 font-semibold flex items-center justify-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>ينكشف بعد ({formatTime(remainingTime)})</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Footer status */}
              <div className="mt-4 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-zinc-800/80 pt-2">
                <span>
                  {isPermanent ? 'دليل مكشوف دائماً' : confirmedClue ? 'أدلة موثقة' : isUnlocked ? 'متاح لاختيار الطبيب الشرعي' : 'مغلق بانتظار المؤقت'}
                </span>
                {confirmedClue ? (
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> مؤكد
                  </span>
                ) : isUnlocked ? (
                  <span className="text-emerald-400 font-mono">جاهز للكشف</span>
                ) : (
                  <span className="text-amber-400 font-mono">{formatTime(remainingTime)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
