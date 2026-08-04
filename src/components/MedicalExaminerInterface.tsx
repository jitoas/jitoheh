import React, { useState, useEffect } from 'react';
import { ClientGameState, Card } from '../types';
import { INVESTIGATION_FOLDERS, getClueMatchesCount, getSlotTimerDuration } from '../data/clues';
import { Folder, FolderOpen, CheckCircle, Unlock, Clock, Send, AlertCircle, X, ChevronUp, ChevronDown, Lock } from 'lucide-react';

interface MedicalExaminerInterfaceProps {
  state: ClientGameState;
  onSelectDraftClue: (folderIndex: number, clueTag: string) => void;
  onConfirmClue: (folderIndex: number) => void;
}

export const MedicalExaminerInterface: React.FC<MedicalExaminerInterfaceProps> = ({
  state,
  onSelectDraftClue,
  onConfirmClue,
}) => {
  const [activeFolderId, setActiveFolderId] = useState<number | null>(null);
  const [lockNotice, setLockNotice] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getSlotTimeLeft = (folderId: number): number => {
    const duration = getSlotTimerDuration(state.settings, folderId);
    if (duration === 0) return 0; // Slots 1 & 2 are always unlocked!

    const startTime = (state.slotStartTimes && state.slotStartTimes[folderId]) || state.clueCycleStartTime || now;
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    return Math.max(0, duration - elapsedSeconds);
  };

  const isFolderUnlocked = (folderId: number): boolean => {
    return getSlotTimeLeft(folderId) === 0;
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFolderClick = (folderId: number) => {
    const remaining = getSlotTimeLeft(folderId);
    if (remaining > 0) {
      setLockNotice(`المؤقت الخاص بمجلد #${folderId + 1} لم ينتهِ بعد! لا يمكنك فتحه حتى يصل المؤقت إلى 00:00 (متبقي ${formatTime(remaining)})`);
      setTimeout(() => setLockNotice(null), 4000);
      return;
    }
    setActiveFolderId(activeFolderId === folderId ? null : folderId);
  };

  // Gather all cards currently in play across all players for smart clue suggestions
  const cardsInPlay: Card[] = [];
  state.players.forEach((p) => {
    cardsInPlay.push(...p.weapons, ...p.evidence);
  });

  const activeFolder = activeFolderId !== null ? INVESTIGATION_FOLDERS.find((f) => f.id === activeFolderId) : null;
  const activeFolderUnlocked = activeFolderId !== null ? isFolderUnlocked(activeFolderId) : false;
  const draftClues = state.meDraftClues || {};
  const confirmedClues = state.confirmedClues || [];

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 dir-rtl text-right">
      {/* Header */}
      <div className="space-y-4 border-b border-zinc-800 pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <h2 className="text-xl font-extrabold text-zinc-100 font-serif uppercase tracking-wider">
                مجلدات التحقيق الخاصة بالطبيب الشرعي
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1 font-serif">
              لكل مجلد مؤقت مستقل خاص به. عند إصدار أو تغيير دليل في مجلد، يدخل هذا المجلد فقط فترة الـ Cooldown الخاصة به.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono">
            <span className="text-zinc-500">الأدلة المكشوفة:</span>
            <span className="font-bold text-amber-400">{confirmedClues.length} / 6</span>
          </div>
        </div>

        {/* Lock Notice Warning */}
        {lockNotice && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{lockNotice}</span>
          </div>
        )}
      </div>

      {/* 6 Realistic Investigation Folders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INVESTIGATION_FOLDERS.map((folder) => {
          const isConfirmed = confirmedClues.some((cc) => cc.folderIndex === folder.id);
          const confirmedClue = confirmedClues.find((cc) => cc.folderIndex === folder.id);
          const draftClue = draftClues[folder.id];
          const isOpen = activeFolderId === folder.id;
          const remaining = getSlotTimeLeft(folder.id);
          const isUnlocked = remaining === 0;

          return (
            <div
              key={folder.id}
              onClick={() => handleFolderClick(folder.id)}
              className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden p-5 flex flex-col justify-between h-44 shadow-xl ${
                isOpen
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20 scale-102'
                  : isConfirmed
                  ? 'border-emerald-500/50 bg-zinc-900/60 opacity-90'
                  : !isUnlocked
                  ? 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700'
                  : 'border-zinc-700 bg-zinc-900/60 hover:border-amber-500/60 hover:bg-zinc-900/80'
              }`}
            >
              {/* Folder tab accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-80" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <FolderOpen className="w-8 h-8 text-amber-400 filter drop-shadow" />
                  ) : !isUnlocked && !isConfirmed ? (
                    <Folder className="w-8 h-8 text-zinc-600" />
                  ) : (
                    <Folder className="w-8 h-8 text-amber-500/80 group-hover:text-amber-400 transition-colors" />
                  )}
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                      مجلد #{folder.id + 1}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 font-serif leading-tight">
                      {folder.name}
                    </h3>
                  </div>
                </div>

                {folder.id === 0 || folder.id === 1 ? (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3 text-amber-400" /> مفتوح دائماً
                  </span>
                ) : isConfirmed ? (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" /> تم الإصدار
                  </span>
                ) : !isUnlocked ? (
                  <span className="px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[10px] font-mono text-amber-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" /> {formatTime(remaining)}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-mono text-amber-300 flex items-center gap-1 animate-pulse">
                    <Unlock className="w-3 h-3" /> متاح الآن
                  </span>
                )}
              </div>

              {/* Highlighted clue preview inside folder */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 font-mono">الحالة:</span>
                  {confirmedClue ? (
                    <span className="text-xs font-bold text-yellow-300 bg-yellow-400/20 px-2 py-0.5 rounded border border-yellow-400/40 uppercase">
                      {confirmedClue.clueTag}
                    </span>
                  ) : draftClue ? (
                    <span className="text-xs font-semibold text-amber-400 italic">
                      مسودة: "{draftClue}"
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-500 italic">غير مفحوص</span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  {isOpen ? (
                    <>
                      <span>إغلاق الملف</span>
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : isUnlocked ? (
                    <>
                      <span>فتح الملف</span>
                      <ChevronDown className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-amber-400 inline" />
                      <span>مغلق ({formatTime(remaining)})</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opened Folder Clue Options Panel */}
      {activeFolder && activeFolderUnlocked && (
        <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl animate-in slide-in-from-top duration-300 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                محتويات المجلد: #{activeFolder.id + 1} - {activeFolder.name}
              </span>
              <h4 className="text-lg font-bold text-zinc-100 font-serif">
                اختر تلميح الدليل الجنائي
              </h4>
            </div>

            <button
              onClick={() => setActiveFolderId(null)}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>إغلاق الملف</span>
            </button>
          </div>

          <p className="text-xs text-zinc-400 font-serif">
            اختر خياراً واحداً أدناه، ثم اضغط تأكيد الكشف لإصدار الدليل للجميع. يدخل هذا المجلد فقط فترة الكولدوان الخاصة به عند الإصدار.
          </p>

          {/* 3 Left, 3 Right Clue Options Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3">
              {activeFolder.options.slice(0, 3).map((option) => {
                const isSelected = draftClues[activeFolder.id] === option;
                const matchesCount = getClueMatchesCount(option, cardsInPlay);

                return (
                  <button
                    key={option}
                    onClick={() => onSelectDraftClue(activeFolder.id, option)}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-400/20 ring-2 ring-yellow-400/40 shadow-lg shadow-yellow-400/10'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-zinc-600'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-yellow-300' : 'text-zinc-200'}`}>
                        {option}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      يطابق {matchesCount} بطاقات
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {activeFolder.options.slice(3, 6).map((option) => {
                const isSelected = draftClues[activeFolder.id] === option;
                const matchesCount = getClueMatchesCount(option, cardsInPlay);

                return (
                  <button
                    key={option}
                    onClick={() => onSelectDraftClue(activeFolder.id, option)}
                    className={`w-full text-right p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-yellow-400 bg-yellow-400/20 ring-2 ring-yellow-400/40 shadow-lg shadow-yellow-400/10'
                        : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-yellow-400 bg-yellow-400' : 'border-zinc-600'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </div>
                      <span className={`text-sm font-bold ${isSelected ? 'text-yellow-300' : 'text-zinc-200'}`}>
                        {option}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-500 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                      يطابق {matchesCount} بطاقات
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm & Release Clue Action */}
          <div className="pt-4 border-t border-zinc-800 flex justify-end gap-3">
            <button
              disabled={!draftClues[activeFolder.id]}
              onClick={() => {
                if (draftClues[activeFolder.id]) {
                  onConfirmClue(activeFolder.id);
                  setActiveFolderId(null);
                }
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all ${
                draftClues[activeFolder.id]
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              }`}
            >
              <Send className="w-4 h-4" /> تأكيد وإصدار الدليل للجميع
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
