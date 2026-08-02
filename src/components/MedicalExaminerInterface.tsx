import React, { useState } from 'react';
import { ClientGameState, Card } from '../types';
import { INVESTIGATION_FOLDERS, getClueMatchesCount } from '../data/clues';
import { Folder, FolderOpen, CheckCircle, AlertCircle, Sparkles, Send, RefreshCw } from 'lucide-react';

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

  // Gather all cards currently in play across all players for smart clue suggestions
  const cardsInPlay: Card[] = [];
  state.players.forEach((p) => {
    cardsInPlay.push(...p.weapons, ...p.evidence);
  });

  const activeFolder = activeFolderId !== null ? INVESTIGATION_FOLDERS.find((f) => f.id === activeFolderId) : null;
  const draftClues = state.meDraftClues || {};
  const confirmedClues = state.confirmedClues || [];
  const changedCount = state.meChangedClueCount || 0;

  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-xl font-extrabold text-zinc-100 font-serif uppercase tracking-wider">
              Medical Examiner Investigation Folders
            </h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Analyze crime scene cards. Open folders, highlight clues with yellow marker, and release findings to investigators.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs font-mono">
          <span className="text-zinc-500">Clue Change Limit:</span>
          <span className={`font-bold ${changedCount >= 1 ? 'text-red-400' : 'text-emerald-400'}`}>
            {1 - changedCount} / 1 Left
          </span>
        </div>
      </div>

      {/* 6 Realistic Investigation Folders (3 Top, 3 Bottom) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {INVESTIGATION_FOLDERS.map((folder) => {
          const isConfirmed = confirmedClues.some((cc) => cc.folderIndex === folder.id);
          const confirmedClue = confirmedClues.find((cc) => cc.folderIndex === folder.id);
          const draftClue = draftClues[folder.id];
          const isOpen = activeFolderId === folder.id;

          return (
            <div
              key={folder.id}
              onClick={() => setActiveFolderId(isOpen ? null : folder.id)}
              className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden p-5 flex flex-col justify-between h-44 shadow-xl ${
                isOpen
                  ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/20 scale-102'
                  : isConfirmed
                  ? 'border-emerald-500/50 bg-zinc-900/60'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
              }`}
            >
              {/* Folder tab accent line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 opacity-80" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {isOpen ? (
                    <FolderOpen className="w-8 h-8 text-amber-400 filter drop-shadow" />
                  ) : (
                    <Folder className="w-8 h-8 text-amber-500/80 group-hover:text-amber-400 transition-colors" />
                  )}
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                      FOLDER #{folder.id + 1}
                    </span>
                    <h3 className="text-base font-bold text-zinc-100 font-serif leading-tight">
                      {folder.name}
                    </h3>
                  </div>
                </div>

                {isConfirmed && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 flex items-center gap-1 font-mono">
                    <CheckCircle className="w-3 h-3" /> RELEASED
                  </span>
                )}
              </div>

              {/* Highlighted clue preview inside folder */}
              <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-zinc-400 font-mono">Status:</span>
                  {confirmedClue ? (
                    <span className="text-xs font-bold text-yellow-300 bg-yellow-400/20 px-2 py-0.5 rounded border border-yellow-400/40 uppercase">
                      {confirmedClue.clueTag}
                    </span>
                  ) : draftClue ? (
                    <span className="text-xs font-semibold text-amber-400 italic">
                      Draft: "{draftClue}"
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600 italic">Uninspected</span>
                  )}
                </div>

                <span className="text-[11px] font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                  {isOpen ? 'Close File ▲' : 'Open File ▼'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Opened Folder Clue Options Panel (3 Left, 3 Right) */}
      {activeFolder && (
        <div className="rounded-2xl border border-amber-500/50 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 shadow-2xl animate-in slide-in-from-top duration-300 space-y-5">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <div>
              <span className="text-xs font-mono text-amber-400 uppercase font-bold">
                FOLDER CONTENTS: #{activeFolder.id + 1} - {activeFolder.name}
              </span>
              <h4 className="text-lg font-bold text-zinc-100 font-serif">
                Select Forensic Clue Option
              </h4>
            </div>

            <button
              onClick={() => setActiveFolderId(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200"
            >
              ✕ Close File
            </button>
          </div>

          <p className="text-xs text-zinc-400">
            Choose one option below. Highlighted with yellow marker. Select options matching multiple cards in play to spark discussion!
          </p>

          {/* 3 Left, 3 Right Clue Options Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Left Column (3 Options) */}
            <div className="space-y-3">
              {activeFolder.options.slice(0, 3).map((option) => {
                const isSelected = draftClues[activeFolder.id] === option;
                const matchesCount = getClueMatchesCount(option, cardsInPlay);

                return (
                  <button
                    key={option}
                    onClick={() => onSelectDraftClue(activeFolder.id, option)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
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
                      Matches {matchesCount} Cards
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column (3 Options) */}
            <div className="space-y-3">
              {activeFolder.options.slice(3, 6).map((option) => {
                const isSelected = draftClues[activeFolder.id] === option;
                const matchesCount = getClueMatchesCount(option, cardsInPlay);

                return (
                  <button
                    key={option}
                    onClick={() => onSelectDraftClue(activeFolder.id, option)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
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
                      Matches {matchesCount} Cards
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
              onClick={() => onConfirmClue(activeFolder.id)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all ${
                draftClues[activeFolder.id]
                  ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-lg shadow-amber-500/20 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              }`}
            >
              <Send className="w-4 h-4" /> Confirm & Release Clue to Investigators
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
