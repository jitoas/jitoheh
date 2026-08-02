import React, { useState } from 'react';
import { ClientGameState } from '../types';
import { Sparkles } from 'lucide-react';

interface JokerGuessModalProps {
  state: ClientGameState;
  myId: string;
  onSecretGuessKiller: (killerPlayerId: string) => void;
}

export const JokerGuessModal: React.FC<JokerGuessModalProps> = ({
  state,
  myId,
  onSecretGuessKiller,
}) => {
  const isJoker = state.jokerId === myId;
  const eligibleKillers = state.players.filter((p) => p.id !== myId && p.role !== 'MEDICAL_EXAMINER');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!state.jokerVotedOut || state.jokerTargetKillerGuess) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4">
      <div className="w-full max-w-xl rounded-3xl border border-purple-500/50 bg-gradient-to-b from-purple-950 via-zinc-950 to-black p-6 md:p-8 text-center shadow-2xl space-y-5">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs font-mono uppercase">
            <Sparkles className="w-4 h-4 animate-spin" /> 🃏 THE JOKER HAS BEEN ELIMINATED
          </div>

          <h3 className="text-2xl font-extrabold text-zinc-100 font-serif">
            {isJoker ? 'Secretly Identify The Killer' : 'The Joker Is Deducting The Killer...'}
          </h3>

          <p className="text-xs text-zinc-400">
            {isJoker
              ? 'You successfully got voted out! Now secretly choose who you believe is the real Killer. If correct, you will STEAL VICTORY at the final scoreboard!'
              : 'The match continues normally. The Joker secret selection will be revealed at the final scoreboard.'}
          </p>
        </div>

        {isJoker && !submitted ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {eligibleKillers.map((p) => {
                const isSelected = selectedId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedId(p.id)}
                    className={`p-3 rounded-xl border text-left font-bold text-xs text-zinc-100 transition-all ${
                      isSelected
                        ? 'border-purple-400 bg-purple-500/30 ring-2 ring-purple-400/40'
                        : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>

            <button
              disabled={!selectedId}
              onClick={() => {
                if (selectedId) {
                  onSecretGuessKiller(selectedId);
                  setSubmitted(true);
                }
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                selectedId
                  ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30 cursor-pointer'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
              }`}
            >
              Lock In Secret Killer Guess
            </button>
          </div>
        ) : (
          <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/30 text-xs text-zinc-400 font-mono">
            Choice sealed. The match continues...
          </div>
        )}
      </div>
    </div>
  );
};
