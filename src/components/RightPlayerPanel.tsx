import React from 'react';
import { ClientGameState, PlayerProfile } from '../types';
import { DETECTIVE_AVATARS } from './CardArt';
import { Eye, Vote, Check, Shield, Users } from 'lucide-react';

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
    <div className="rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-2xl flex flex-col space-y-3 dir-rtl text-right">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-zinc-100 font-serif tracking-wide uppercase">
              قائمة جميع اللاعبين
            </h3>
            <span className="text-[9px] text-zinc-500 font-mono">
              ALL PLAYERS ({state.players.length})
            </span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
          نشط
        </span>
      </div>

      {/* Clean Horizontal Player Cards List */}
      <div className="space-y-2.5 max-h-[620px] overflow-y-auto scrollbar-thin pr-0.5">
        {state.players.map((p) => {
          const isSelf = p.id === myProfile.id;
          const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);
          const isME = p.role === 'MEDICAL_EXAMINER';

          return (
            <div
              key={p.id}
              className={`p-3 rounded-2xl border transition-all ${
                isSelf
                  ? 'border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-zinc-800/90 bg-zinc-900/60 hover:border-zinc-700'
              }`}
            >
              {/* Horizontal Card Layout Header */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  {/* Profile Picture (Avatar) */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-lg shrink-0 ${
                      avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
                    }`}
                    style={{ border: `2px solid ${avatarPreset ? avatarPreset.color : '#f59e0b'}` }}
                  >
                    {p.name.charAt(0)}
                  </div>

                  {/* Player Name & Role / Card Info */}
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-100 font-serif">{p.name}</span>
                      {isSelf && (
                        <span className="text-[9px] text-amber-400 font-mono bg-amber-500/20 px-1.5 py-0.2 rounded">
                          (أنت)
                        </span>
                      )}
                    </div>
                    {isME ? (
                      <span className="text-[9.5px] font-extrabold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.2 rounded inline-block mt-0.5 font-serif">
                        الطبيب الشرعي
                      </span>
                    ) : (
                      <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">
                        {p.weapons.length + p.evidence.length} بطاقات
                      </span>
                    )}
                  </div>
                </div>

                {/* Vote Badge Element */}
                {!isME ? (
                  !p.hasVoted ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full shrink-0 shadow-sm">
                      <Shield className="w-3 h-3 text-amber-400" /> شارة متوفرة
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-900/80 border border-zinc-800 px-2 py-1 rounded-full shrink-0 opacity-40 grayscale line-through">
                      <Check className="w-3 h-3 text-red-500/70" /> شارة تلاشت
                    </span>
                  )
                ) : (
                  <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full shrink-0 font-mono">
                    المشرف
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              {!isME && (
                <div className="grid grid-cols-2 gap-1.5 pt-2 mt-2 border-t border-zinc-800/60">
                  <button
                    onClick={() => onViewInventory(p.id)}
                    className="flex items-center justify-center gap-1 py-1 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3 h-3 text-amber-400" /> عرض الأدلة
                  </button>

                  {state.phase === 'INVESTIGATION' && !mePlayer?.hasVoted && myRole !== 'MEDICAL_EXAMINER' && (
                    <button
                      onClick={() => onOpenVoteModal(p.id)}
                      className="flex items-center justify-center gap-1 py-1 px-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-wider transition-colors shadow-md shadow-red-600/30 cursor-pointer"
                    >
                      <Vote className="w-3 h-3" /> الاتهام
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

