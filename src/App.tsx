import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ClientGameState, PlayerProfile, Card } from './types';
import { getSavedProfile, saveProfile } from './utils/storage';
import { DETECTIVE_AVATARS } from './components/CardArt';
import { ProfileModal } from './components/ProfileModal';
import { LobbyScreen } from './components/LobbyScreen';
import { RoleRevealOverlay } from './components/RoleRevealOverlay';
import { KillerSelectionModal } from './components/KillerSelectionModal';
import { RoleHeaderPanel } from './components/RoleHeaderPanel';
import { RightPlayerPanel } from './components/RightPlayerPanel';
import { MedicalExaminerInterface } from './components/MedicalExaminerInterface';
import { ClueBoard } from './components/ClueBoard';
import { PlayerInventoryModal } from './components/PlayerInventoryModal';
import { VotingModal } from './components/VotingModal';
import { VoteResultAnimation } from './components/VoteResultAnimation';
import { KillerWitnessGuessModal } from './components/KillerWitnessGuessModal';
import { JokerGuessModal } from './components/JokerGuessModal';
import { ScoreboardScreen } from './components/ScoreboardScreen';
import { EventBanner } from './components/EventBanner';
import { CardArt } from './components/CardArt';
import { Skull, Search, PlusCircle, LogIn, AlertCircle, Eye, Shield } from 'lucide-react';

let socket: Socket;

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(getSavedProfile());
  const [gameState, setGameState] = useState<ClientGameState | null>(null);
  const [caseCodeInput, setCaseCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals & Overlays state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [inspectPlayerId, setInspectPlayerId] = useState<string | null>(null);
  const [voteTargetPlayerId, setVoteTargetPlayerId] = useState<string | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);

  useEffect(() => {
    socket = io();

    socket.on('connect', () => {
      console.log('Connected to game server socket:', socket.id);
    });

    socket.on('case_state_updated', (updatedState: ClientGameState) => {
      setGameState(updatedState);
      setErrorMsg(null);
    });

    socket.on('error_message', (msg: string) => {
      setErrorMsg(msg);
    });

    // Auto-detect URL parameter ?case=ABX4K9
    const params = new URLSearchParams(window.location.search);
    const caseFromUrl = params.get('case');
    if (caseFromUrl) {
      setCaseCodeInput(caseFromUrl.toUpperCase());
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // Show role reveal when phase changes to ROLE_REVEAL
  useEffect(() => {
    if (gameState?.phase === 'ROLE_REVEAL') {
      setShowRoleReveal(true);
    }
  }, [gameState?.phase]);

  const handleCreateCase = () => {
    socket.emit('create_case', { profile }, (res: any) => {
      if (!res.success) {
        setErrorMsg(res.error);
      }
    });
  };

  const handleJoinCase = () => {
    if (!caseCodeInput.trim()) return;
    socket.emit('join_case', { caseCode: caseCodeInput.trim().toUpperCase(), profile }, (res: any) => {
      if (!res.success) {
        setErrorMsg(res.error);
      }
    });
  };

  const handleSaveProfile = (updated: PlayerProfile) => {
    setProfile(updated);
    saveProfile(updated);
    if (gameState) {
      socket.emit('update_profile', {
        caseCode: gameState.caseCode,
        playerId: updated.id,
        profile: updated,
      });
    }
  };

  // If not in a game case yet, render Join/Create Landing Screen
  if (!gameState) {
    return (
      <div className="min-h-screen bg-black text-zinc-100 flex flex-col justify-between p-4 md:p-8 font-sans antialiased select-none">
        {/* Profile Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
          currentProfile={profile}
          onSave={handleSaveProfile}
        />

        {/* Top Header */}
        <header className="max-w-6xl mx-auto w-full flex items-center justify-between border-b border-zinc-900 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 text-black font-extrabold shadow-lg shadow-amber-500/20">
              <Skull className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold font-serif tracking-tight text-zinc-100">
                DETECTIVE'S CLUE
              </h1>
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase block">
                Crime Scene Social Deduction
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-zinc-700 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
              {profile.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold text-zinc-300">{profile.name}</span>
          </button>
        </header>

        {/* Hero Form */}
        <main className="max-w-md mx-auto w-full my-12 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold font-serif uppercase tracking-tight text-zinc-100">
              Unmask The Killer
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Analyze forensic clues, inspect evidence cards, deceive suspects, and solve the murder case.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
            {/* Join Existing Case */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                Enter Case Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={caseCodeInput}
                  onChange={(e) => setCaseCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. ABX4K9"
                  maxLength={6}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none font-mono tracking-widest uppercase text-center text-lg font-bold"
                />
                <button
                  onClick={handleJoinCase}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20"
                >
                  <LogIn className="w-4 h-4" /> Join Case
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-900 w-full" />
              <span className="absolute bg-zinc-950 px-3 text-[10px] text-zinc-600 uppercase font-mono">
                OR
              </span>
            </div>

            {/* Create New Case */}
            <button
              onClick={handleCreateCase}
              className="w-full py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" /> Create New Investigation Case
            </button>
          </div>
        </main>

        <footer className="text-center text-[10px] text-zinc-600 font-mono">
          Commercial Multiplayer Detective Engine • Scalable Socket & Data Architecture
        </footer>
      </div>
    );
  }

  // Active Game State rendering
  const mePlayer = gameState.players.find((p) => p.id === profile.id);
  const myRole = gameState.myRole;
  const isME = myRole === 'MEDICAL_EXAMINER';
  const inspectedPlayer = gameState.players.find((p) => p.id === inspectPlayerId);

  return (
    <div className="min-h-screen bg-black text-zinc-100 p-4 md:p-6 space-y-6 select-none font-sans antialiased">
      {/* Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentProfile={profile}
        onSave={handleSaveProfile}
      />

      {/* Role Reveal Overlay */}
      {showRoleReveal && gameState.phase === 'ROLE_REVEAL' && (
        <RoleRevealOverlay
          state={gameState}
          myRole={myRole}
          onDismiss={() => setShowRoleReveal(false)}
        />
      )}

      {/* Killer Selection Modal */}
      {gameState.phase === 'KILLER_SELECTION' && myRole === 'KILLER' && (
        <KillerSelectionModal
          weapons={gameState.myWeapons}
          evidence={gameState.myEvidence}
          onConfirmSelection={(wId, eId) => {
            socket.emit('killer_select_cards', {
              caseCode: gameState.caseCode,
              killerId: profile.id,
              weaponId: wId,
              evidenceId: eId,
            });
          }}
        />
      )}

      {/* Killer Witness Guess Modal */}
      {gameState.phase === 'KILLER_FINAL_GUESS' && (
        <KillerWitnessGuessModal
          state={gameState}
          myId={profile.id}
          onGuessWitness={(wId) => {
            socket.emit('killer_guess_witness', {
              caseCode: gameState.caseCode,
              killerId: profile.id,
              witnessGuessId: wId,
            });
          }}
        />
      )}

      {/* Joker Secret Guess Modal */}
      <JokerGuessModal
        state={gameState}
        myId={profile.id}
        onSecretGuessKiller={(killerId) => {
          socket.emit('joker_secret_guess', {
            caseCode: gameState.caseCode,
            jokerId: profile.id,
            killerGuessId: killerId,
          });
        }}
      />

      {/* Vote Result Animation Overlay */}
      <VoteResultAnimation
        result={gameState.latestVoteResult}
        onDismiss={() => {
          // Cleared automatically
        }}
      />

      {/* Player Inventory Inspection Modal */}
      <PlayerInventoryModal
        player={inspectedPlayer || null}
        onClose={() => setInspectPlayerId(null)}
        canAccuse={gameState.phase === 'INVESTIGATION' && !mePlayer?.hasVoted && !isME}
        onAccuse={(pId) => {
          setVoteTargetPlayerId(pId);
          setIsVotingModalOpen(true);
        }}
      />

      {/* Voting Modal */}
      {isVotingModalOpen && (
        <VotingModal
          state={gameState}
          initialTargetPlayerId={voteTargetPlayerId || undefined}
          onClose={() => setIsVotingModalOpen(false)}
          onSubmitVote={(tId, wId, eId) => {
            socket.emit('submit_vote', {
              caseCode: gameState.caseCode,
              voterId: profile.id,
              targetPlayerId: tId,
              weaponId: wId,
              evidenceId: eId,
            });
          }}
        />
      )}

      {/* Top Main Navigation Header */}
      <header className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-zinc-900 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500 text-zinc-950 font-extrabold">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-serif text-zinc-100">{gameState.caseName}</h1>
            <span className="text-[10px] text-amber-400 font-mono uppercase tracking-wider block">
              PHASE: {gameState.phase}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 text-xs text-zinc-300 font-semibold"
          >
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center">
              {profile.name.charAt(0)}
            </div>
            <span>{profile.name}</span>
          </button>

          {gameState.phase !== 'LOBBY' && (
            <button
              onClick={() => {
                socket.emit('return_to_lobby', {
                  caseCode: gameState.caseCode,
                  hostId: profile.id,
                });
              }}
              className="px-3 py-1.5 rounded-xl border border-zinc-800 bg-zinc-900 text-xs text-zinc-400 hover:text-zinc-200"
            >
              Exit Match
            </button>
          )}
        </div>
      </header>

      {/* Event Banner */}
      <EventBanner event={gameState.activeRandomEvent} />

      {/* LOBBY PHASE */}
      {gameState.phase === 'LOBBY' && (
        <LobbyScreen
          state={gameState}
          myProfile={profile}
          onUpdateSettings={(settings) => {
            socket.emit('update_host_settings', {
              caseCode: gameState.caseCode,
              hostId: profile.id,
              settings,
            });
          }}
          onToggleReady={() => {
            socket.emit('toggle_ready', {
              caseCode: gameState.caseCode,
              playerId: profile.id,
            });
          }}
          onStartMatch={() => {
            socket.emit('start_match', {
              caseCode: gameState.caseCode,
              hostId: profile.id,
            });
          }}
          onKickPlayer={(targetId) => {
            socket.emit('kick_player', {
              caseCode: gameState.caseCode,
              hostId: profile.id,
              targetPlayerId: targetId,
            });
          }}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      )}

      {/* INVESTIGATION & GAMEPLAY PHASES */}
      {(gameState.phase === 'ROLE_REVEAL' ||
        gameState.phase === 'KILLER_SELECTION' ||
        gameState.phase === 'INVESTIGATION' ||
        gameState.phase === 'KILLER_FINAL_GUESS') && (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Left Column (3 Cols) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Context Intel Header */}
            <RoleHeaderPanel state={gameState} myRole={myRole} />

            {/* Medical Examiner Clue Interface (if ME) OR Public Clue Board */}
            {isME ? (
              <MedicalExaminerInterface
                state={gameState}
                onSelectDraftClue={(folderIndex, clueTag) => {
                  socket.emit('me_select_draft_clue', {
                    caseCode: gameState.caseCode,
                    meId: profile.id,
                    folderIndex,
                    clueTag,
                  });
                }}
                onConfirmClue={(folderIndex) => {
                  socket.emit('me_confirm_clue', {
                    caseCode: gameState.caseCode,
                    meId: profile.id,
                    folderIndex,
                  });
                }}
              />
            ) : (
              <ClueBoard clues={gameState.confirmedClues} />
            )}

            {/* My Inventory Showcase (4 Weapons & 4 Evidence) */}
            {!isME && gameState.myWeapons.length > 0 && (
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                  <h3 className="text-sm font-bold text-zinc-200 font-serif uppercase tracking-wider">
                    My Inventory Cards (4 Weapons & 4 Evidence)
                  </h3>
                  <span className="text-xs text-zinc-500 font-mono">PERSONAL DOSSIER</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-2">
                      My 4 Weapons
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-items-center">
                      {gameState.myWeapons.map((w) => (
                        <CardArt key={w.id} card={w} size="sm" />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block mb-2">
                      My 4 Evidence Cards
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 justify-items-center">
                      {gameState.myEvidence.map((e) => (
                        <CardArt key={e.id} card={e} size="sm" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Suspect Roster & Action Panel */}
          <div className="lg:col-span-1">
            <RightPlayerPanel
              state={gameState}
              myProfile={profile}
              onViewInventory={(targetId) => setInspectPlayerId(targetId)}
              onOpenVoteModal={(targetId) => {
                setVoteTargetPlayerId(targetId);
                setIsVotingModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* END GAME SCOREBOARD */}
      {gameState.phase === 'END_GAME' && (
        <ScoreboardScreen
          state={gameState}
          myId={profile.id}
          onReturnToLobby={() => {
            socket.emit('return_to_lobby', {
              caseCode: gameState.caseCode,
              hostId: profile.id,
            });
          }}
        />
      )}
    </div>
  );
}
