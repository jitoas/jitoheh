import React from 'react';
import { ClientGameState, PlayerProfile } from '../types';
import { DETECTIVE_AVATARS } from './CardArt';
import { Eye, Vote, Check, Shield } from 'lucide-react';

interface RightPlayerPanelProps {
  state: ClientGameState;
  myProfile: PlayerProfile;
  onViewInventory: (targetPlayerId: string) => void;
  onOpenVoteModal: (targetPlayerId: string) => void;
}

export const RightPlayerPanel: React.FC<RightPlayerPanelProps> = ({
  state,
  myProfile,
  onViewInventory,
  onOpenVoteModal,
}) => {
  const mePlayer = state.players.find((p) => p.id === myProfile.id);
  const myRole = mePlayer?.role;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl flex flex-col h-full space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
        <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
          Case Suspects ({state.players.length})
        </h3>
        <span className="text-[10px] text-amber-500 font-mono">LIVE ROSTER</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[600px] scrollbar-thin">
        {state.players.map((p) => {
          const isSelf = p.id === myProfile.id;
          const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);
          const isME = p.role === 'MEDICAL_EXAMINER';

          return (
            <div
              key={p.id}
              className={`p-3 rounded-xl border transition-all ${
                isSelf
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-md ${
                      avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
                    }`}
                    style={{ border: `2px solid ${avatarPreset ? avatarPreset.color : '#71717a'}` }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-zinc-100">{p.name}</span>
                      {isSelf && <span className="text-[9px] text-zinc-500 font-mono">(You)</span>}
                    </div>
                    {p.role && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 font-mono block">
                        {p.role}
                      </span>
                    )}
                  </div>
                </div>

                {p.hasVoted && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Voted
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {!isME && (
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-zinc-900">
                  <button
                    onClick={() => onViewInventory(p.id)}
                    className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[11px] font-semibold transition-colors"
                  >
                    <Eye className="w-3 h-3" /> Cards ({p.weapons.length + p.evidence.length})
                  </button>

                  {state.phase === 'INVESTIGATION' && !mePlayer?.hasVoted && myRole !== 'MEDICAL_EXAMINER' && (
                    <button
                      onClick={() => onOpenVoteModal(p.id)}
                      className="flex items-center justify-center gap-1 py-1 px-2 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-[11px] font-bold uppercase tracking-wider transition-colors shadow-md shadow-red-600/20"
                    >
                      <Vote className="w-3 h-3" /> Accuse
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
