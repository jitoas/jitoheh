import React from 'react';
import { ConfirmedClue } from '../types';
import { ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';

interface ClueBoardProps {
  clues: ConfirmedClue[];
}

export const ClueBoard: React.FC<ClueBoardProps> = ({ clues }) => {
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-extrabold text-zinc-100 font-serif uppercase tracking-wider">
            Public Investigation Clue Board
          </h2>
        </div>
        <span className="text-xs text-amber-500 font-mono">
          {clues.length} {clues.length === 1 ? 'Clue' : 'Clues'} Released
        </span>
      </div>

      {clues.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20 space-y-2">
          <FileText className="w-8 h-8 text-zinc-600 mx-auto" />
          <p className="text-sm text-zinc-400 font-medium">No Clues Released Yet</p>
          <p className="text-xs text-zinc-600">
            The Medical Examiner is analyzing crime scene folders. Clues will appear here in real time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clues.map((clue, idx) => (
            <div
              key={idx}
              className="relative p-4 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 shadow-xl overflow-hidden group hover:border-amber-400 transition-colors"
            >
              {/* Crime Tape Accent */}
              <div className="absolute top-0 right-0 bg-yellow-400 text-black text-[9px] font-extrabold px-2 py-0.5 rounded-bl-lg uppercase tracking-wider font-mono">
                CLUE #{idx + 1}
              </div>

              <span className="text-[10px] text-zinc-500 font-mono block uppercase">
                {clue.folderName}
              </span>

              {/* Highlighted Yellow Marker Clue Tag */}
              <div className="mt-2 inline-block bg-yellow-400/20 border border-yellow-400/50 px-3 py-1 rounded-lg">
                <span className="text-base font-extrabold text-yellow-300 tracking-wide font-serif uppercase">
                  {clue.clueTag}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px] text-zinc-500 font-mono border-t border-zinc-800/80 pt-2">
                <span>Verified Trace</span>
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 className="w-3 h-3" /> Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
