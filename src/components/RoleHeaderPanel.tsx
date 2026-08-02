import React from 'react';
import { ClientGameState, Role } from '../types';
import { DETECTIVE_AVATARS, CardArt } from './CardArt';
import { Shield, Eye, Stethoscope, Skull, UserCheck, HelpCircle } from 'lucide-react';

interface RoleHeaderPanelProps {
  state: ClientGameState;
  myRole: Role | null;
}

export const RoleHeaderPanel: React.FC<RoleHeaderPanelProps> = ({ state, myRole }) => {
  if (!myRole) return null;

  const getPlayer = (id?: string) => state.players.find((p) => p.id === id);

  const killerPlayer = getPlayer(state.intel.killerId);
  const accomplicePlayer = getPlayer(state.intel.accompliceId);
  const mePlayer = state.intel.medicalExaminerPlayer;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-xl backdrop-blur-md space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
        <div className="flex items-center gap-2">
          {myRole === 'KILLER' && <Skull className="w-4 h-4 text-red-500" />}
          {myRole === 'ACCOMPLICE' && <UserCheck className="w-4 h-4 text-amber-500" />}
          {myRole === 'WITNESS' && <Eye className="w-4 h-4 text-sky-400" />}
          {myRole === 'MEDICAL_EXAMINER' && <Stethoscope className="w-4 h-4 text-emerald-400" />}
          {myRole === 'INVESTIGATOR' && <Shield className="w-4 h-4 text-amber-400" />}
          {myRole === 'JOKER' && <HelpCircle className="w-4 h-4 text-purple-400" />}

          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
            {myRole} INTEL DOSSIER
          </span>
        </div>
        <span className="text-[10px] font-mono text-zinc-500 uppercase">CONFIDENTIAL</span>
      </div>

      {/* Role-Specific Displays */}
      {(myRole === 'KILLER' || myRole === 'ACCOMPLICE' || myRole === 'MEDICAL_EXAMINER') && (
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            {killerPlayer && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-red-400 uppercase">Killer:</span>
                <span className="text-xs font-semibold text-zinc-100">{killerPlayer.name}</span>
              </div>
            )}
            {accomplicePlayer && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase">Accomplice:</span>
                <span className="text-xs font-semibold text-zinc-100">{accomplicePlayer.name}</span>
              </div>
            )}
          </div>

          {state.intel.selectedWeapon && state.intel.selectedEvidence && (
            <div className="flex items-center gap-3 pt-1 border-t border-zinc-900">
              <div>
                <span className="text-[9px] text-zinc-500 block font-mono">CRIME WEAPON</span>
                <span className="text-xs font-bold text-red-400 truncate block max-w-[120px]">
                  {state.intel.selectedWeapon.name}
                </span>
              </div>
              <div className="h-6 w-[1px] bg-zinc-800" />
              <div>
                <span className="text-[9px] text-zinc-500 block font-mono">CRIME EVIDENCE</span>
                <span className="text-xs font-bold text-sky-400 truncate block max-w-[120px]">
                  {state.intel.selectedEvidence.name}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {myRole === 'WITNESS' && state.intel.witnessPair && (
        <div>
          <span className="text-[10px] text-sky-400 uppercase font-bold block mb-1">
            Suspect Pair (Killer & Accomplice)
          </span>
          <div className="flex items-center gap-3">
            {state.intel.witnessPair.map((id) => {
              const p = getPlayer(id);
              if (!p) return null;
              return (
                <div key={id} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <span className="text-xs font-semibold text-zinc-200">{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {myRole === 'INVESTIGATOR' && mePlayer && (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center font-bold text-xs text-emerald-300">
            {mePlayer.name.charAt(0)}
          </div>
          <div>
            <span className="text-[10px] font-bold text-emerald-400 uppercase block">
              Medical Examiner
            </span>
            <span className="text-xs font-semibold text-zinc-200">{mePlayer.name}</span>
          </div>
        </div>
      )}

      {myRole === 'JOKER' && (
        <p className="text-xs text-purple-300 italic">
          Your goal is to be voted out by investigators!
        </p>
      )}
    </div>
  );
};
