import React, { useState } from 'react';
import { ClientGameState } from '../types';
import { Skull, Eye, ArrowRight } from 'lucide-react';

interface KillerWitnessGuessModalProps {
  state: ClientGameState;
  myId: string;
  onGuessWitness: (witnessPlayerId: string) => void;
}

export const KillerWitnessGuessModal: React.FC<KillerWitnessGuessModalProps> = ({
  state,
  myId,
  onGuessWitness,
}) => {
  const isKiller = state.intel.killerId === myId;
  const eligibleWitnesses = state.players.filter(
    (p) => p.id !== state.intel.killerId && p.id !== state.intel.accompliceId && p.role !== 'MEDICAL_EXAMINER'
  );

  const [selectedWitnessId, setSelectedWitnessId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-red-900/80 bg-gradient-to-b from-red-950 via-zinc-950 to-black p-8 text-center shadow-2xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-extrabold text-xs uppercase tracking-widest font-mono">
            <Skull className="w-4 h-4 animate-bounce" /> FINAL PHASE: KILLER WITNESS IDENTIFICATION
          </div>

          <h2 className="text-3xl font-extrabold text-zinc-100 font-serif uppercase tracking-tight">
            Investigators Solved The Case!
          </h2>

          <p className="text-sm text-zinc-300">
            {isKiller
              ? 'You have one final chance to turn the tables! Identify the Witness to steal victory for the Killer Team!'
              : 'The Killer is attempting to identify the Witness in a final showdown...'}
          </p>
        </div>

        {isKiller ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {eligibleWitnesses.map((p) => {
                const isSelected = selectedWitnessId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedWitnessId(p.id)}
                    className={`p-4 rounded-2xl border transition-all text-left space-y-2 ${
                      isSelected
                        ? 'border-sky-400 bg-sky-500/20 ring-2 ring-sky-400/40'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span className="text-sm font-bold text-zinc-100">{p.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              disabled={!selectedWitnessId}
              onClick={() => {
                if (selectedWitnessId) {
                  onGuessWitness(selectedWitnessId);
                }
              }}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all ${
                selectedWitnessId
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              }`}
            >
              Submit Final Witness Target Guess
            </button>
          </div>
        ) : (
          <div className="p-8 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/30">
            <p className="text-sm text-zinc-400 animate-pulse font-mono">
              Waiting for the Killer to select their suspect...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
