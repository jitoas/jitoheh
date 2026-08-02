import React, { useEffect, useState } from 'react';
import { ClientGameState } from '../types';
import { DETECTIVE_AVATARS, CardArt } from './CardArt';
import { Trophy, Skull, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';

interface ScoreboardScreenProps {
  state: ClientGameState;
  myId: string;
  onReturnToLobby: () => void;
}

export const ScoreboardScreen: React.FC<ScoreboardScreenProps> = ({
  state,
  myId,
  onReturnToLobby,
}) => {
  const mePlayer = state.players.find((p) => p.id === myId);
  const isHost = mePlayer?.isHost || false;

  const [showJokerSteal, setShowJokerSteal] = useState(false);

  useEffect(() => {
    if (state.jokerStoleVictory) {
      const timer = setTimeout(() => {
        setShowJokerSteal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [state.jokerStoleVictory]);

  const displayWinner = showJokerSteal ? 'JOKER' : state.winnerTeam;

  const winnerConfig = {
    KILLER_TEAM: {
      title: 'KILLER TEAM VICTORIOUS',
      subtitle: 'The crime remained unpunished or the Witness was eliminated!',
      icon: <Skull className="w-10 h-10 text-red-500" />,
      color: 'text-red-500',
      borderColor: 'border-red-600/50',
      bgGradient: 'from-red-950/80 via-zinc-950 to-black',
    },
    INVESTIGATORS: {
      title: 'INVESTIGATORS SOLVED THE CASE',
      subtitle: 'Justice prevails! The Killer, Weapon, and Evidence were identified.',
      icon: <ShieldCheck className="w-10 h-10 text-emerald-400" />,
      color: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      bgGradient: 'from-emerald-950/80 via-zinc-950 to-black',
    },
    JOKER: {
      title: '🃏 JOKER STOLE THE VICTORY',
      subtitle: 'The Joker engineered their own elimination and unmasked the Killer!',
      icon: <Sparkles className="w-10 h-10 text-purple-400 animate-spin" />,
      color: 'text-purple-400 animate-pulse',
      borderColor: 'border-purple-500/50',
      bgGradient: 'from-purple-950/90 via-zinc-950 to-black',
    },
  }[displayWinner || 'INVESTIGATORS'];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
      {/* Winner Header Banner */}
      <div
        className={`relative rounded-3xl border ${winnerConfig.borderColor} bg-gradient-to-b ${winnerConfig.bgGradient} p-8 text-center shadow-2xl overflow-hidden space-y-3 animate-in fade-in duration-700`}
      >
        <div className="inline-flex items-center gap-2 p-3 rounded-full bg-black/50 border border-zinc-800 shadow-xl">
          {winnerConfig.icon}
        </div>

        <h1 className={`text-3xl md:text-5xl font-extrabold font-serif uppercase tracking-widest ${winnerConfig.color}`}>
          {winnerConfig.title}
        </h1>

        <p className="text-sm text-zinc-300 max-w-lg mx-auto font-medium">
          {winnerConfig.subtitle}
        </p>
      </div>

      {/* Main Scoreboard & Case Truth Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Player Roster & Roles */}
        <div className="lg:col-span-2 rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-zinc-100 font-serif uppercase tracking-wider">
              Final Case Dossier & Player Roles
            </h3>
            <span className="text-xs font-mono text-amber-500">CASE CLOSED</span>
          </div>

          <div className="space-y-3">
            {state.players.map((p) => {
              const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);

              return (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-md ${
                        avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
                      }`}
                      style={{ border: `2px solid ${avatarPreset ? avatarPreset.color : '#71717a'}` }}
                    >
                      {p.name.charAt(0)}
                    </div>

                    <div>
                      <span className="text-sm font-bold text-zinc-100 block">{p.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {p.hasVoted ? '✓ Accusation Voted' : 'No Vote Filed'}
                      </span>
                    </div>
                  </div>

                  {/* Final Role Badge */}
                  <div className="px-3 py-1 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-bold font-mono text-amber-400 uppercase">
                    {p.role}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Revealed Actual Murder Weapon & Evidence */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-zinc-800 pb-3">
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">
                CORONER & FORENSIC VERDICT
              </span>
              <h3 className="text-base font-bold text-zinc-100 font-serif">
                Actual Crime Truth
              </h3>
            </div>

            {state.actualWeapon && state.actualEvidence && (
              <div className="space-y-4 flex flex-col items-center">
                <div>
                  <span className="text-[10px] font-bold text-red-400 uppercase block text-center mb-1">
                    Murder Weapon
                  </span>
                  <CardArt card={state.actualWeapon} size="sm" />
                </div>

                <div>
                  <span className="text-[10px] font-bold text-sky-400 uppercase block text-center mb-1">
                    Murder Evidence
                  </span>
                  <CardArt card={state.actualEvidence} size="sm" />
                </div>
              </div>
            )}
          </div>

          {/* Return to Lobby Button */}
          {isHost ? (
            <button
              onClick={onReturnToLobby}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20"
            >
              <RefreshCw className="w-4 h-4" /> Return Everyone to Lobby
            </button>
          ) : (
            <p className="text-xs text-zinc-500 font-mono text-center italic">
              Waiting for Case Host to return to Lobby...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
