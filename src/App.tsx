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
import { MyCardsModal } from './components/MyCardsModal';
import { VotingModal } from './components/VotingModal';
import { VoteResultAnimation } from './components/VoteResultAnimation';
import { KillerWitnessGuessModal } from './components/KillerWitnessGuessModal';
import { JokerGuessModal } from './components/JokerGuessModal';
import { ScoreboardScreen } from './components/ScoreboardScreen';
import { EventBanner } from './components/EventBanner';
import { InvestigationLog } from './components/InvestigationLog';
import { LeftPlayerHUD } from './components/LeftPlayerHUD';
import { CardArt } from './components/CardArt';
import { Skull, Search, PlusCircle, LogIn, AlertCircle, Eye, Shield, Layers } from 'lucide-react';

let socket: Socket;

export default function App() {
  const [profile, setProfile] = useState<PlayerProfile>(getSavedProfile());
  const [gameState, setGameState] = useState<ClientGameState | null>(null);
  const [caseCodeInput, setCaseCodeInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Keep refs for socket reconnection handlers
  const gameStateRef = React.useRef<ClientGameState | null>(null);
  gameStateRef.current = gameState;
  const profileRef = React.useRef<PlayerProfile>(profile);
  profileRef.current = profile;

  // Modals & Overlays state
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showRoleReveal, setShowRoleReveal] = useState(false);
  const [inspectPlayerId, setInspectPlayerId] = useState<string | null>(null);
  const [voteTargetPlayerId, setVoteTargetPlayerId] = useState<string | null>(null);
  const [isVotingModalOpen, setIsVotingModalOpen] = useState(false);
  const [isMyCardsOpen, setIsMyCardsOpen] = useState(false);

  useEffect(() => {
    socket = io({
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Connected to game server socket:', socket.id);
      // Auto rejoin active case if socket re-established
      if (gameStateRef.current?.caseCode) {
        socket.emit('join_case', {
          caseCode: gameStateRef.current.caseCode,
          profile: profileRef.current,
        });
      }
    });

    socket.on('case_state_updated', (updatedState: ClientGameState) => {
      setGameState(updatedState);
      setErrorMsg(null);
      // Update URL query param so URL is always shareable
      const url = new URL(window.location.href);
      if (url.searchParams.get('case') !== updatedState.caseCode) {
        url.searchParams.set('case', updatedState.caseCode);
        window.history.replaceState({}, '', url.toString());
      }
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
                لعبة التحقيق الجنائي
              </h1>
              <span className="text-[10px] text-amber-500 font-mono tracking-widest uppercase block">
                لعبة الاستنتاج والجريمة الجماعية
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
              اكشف القاتل الخفي
            </h2>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              حلل الأدلة الجنائية، افحص بطاقات مسرح الجريمة، ضلل المشتبه بهم، واكشف القاتل قبل فوات الأوان.
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
                أدخل رمز القضية
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={caseCodeInput}
                  onChange={(e) => setCaseCodeInput(e.target.value.toUpperCase())}
                  placeholder="مثال: ABX4K9"
                  maxLength={6}
                  className="flex-1 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-zinc-100 placeholder-zinc-600 focus:border-amber-500 focus:outline-none font-mono tracking-widest uppercase text-center text-lg font-bold"
                />
                <button
                  onClick={handleJoinCase}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20"
                >
                  <LogIn className="w-4 h-4" /> الانضمام للقضية
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-900 w-full" />
              <span className="absolute bg-zinc-950 px-3 text-[10px] text-zinc-600 uppercase font-mono">
                أو
              </span>
            </div>

            {/* Create New Case */}
            <button
              onClick={handleCreateCase}
              className="w-full py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4 text-amber-500" /> إنشاء قضية تحقيق جديدة
            </button>
          </div>
        </main>

        <footer className="text-center text-[10px] text-zinc-600 font-mono">
          محرك التحقيق الجنائي الجماعي • نظام غرف متعدد اللاعبين بواسطة Socket.IO
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
          onDismiss={() => {
            setShowRoleReveal(false);
            socket.emit('finish_role_reveal', { caseCode: gameState.caseCode });
          }}
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
        canAccuse={
          gameState.phase === 'INVESTIGATION' &&
          !mePlayer?.hasVoted &&
          !isME &&
          (inspectedPlayer
            ? !(
                (myRole === 'KILLER' && gameState.intel?.accompliceId && inspectedPlayer.id === gameState.intel.accompliceId) ||
                (myRole === 'ACCOMPLICE' && gameState.intel?.killerId && inspectedPlayer.id === gameState.intel.killerId)
              )
            : false)
        }
        onAccuse={(pId) => {
          setVoteTargetPlayerId(pId);
          setIsVotingModalOpen(true);
        }}
      />

      {/* My Own Cards Modal Popup */}
      <MyCardsModal
        isOpen={isMyCardsOpen}
        onClose={() => setIsMyCardsOpen(false)}
        weapons={gameState.myWeapons}
        evidence={gameState.myEvidence}
        playerName={profile.name}
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

          {gameState.phase !== 'LOBBY' && !isME && (
            <button
              onClick={() => setIsMyCardsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-bold transition-all shadow-md shadow-amber-500/10"
            >
              <Layers className="w-4 h-4 text-amber-400" />
              <span>بطاقاتي</span>
            </button>
          )}

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
        <div className="max-w-[1550px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 dir-rtl">
          {/* RIGHT COLUMN: Player List (Roster on Right Side) */}
          <div className="lg:col-span-3 order-3 lg:order-1">
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

          {/* MAIN CENTER COLUMN: Core Gameplay & Board */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
            {/* Context Intel Header */}
            <RoleHeaderPanel state={gameState} myRole={myRole} />

            {/* Killer Selection Phase Notice for non-Killers */}
            {gameState.phase === 'KILLER_SELECTION' && myRole !== 'KILLER' && (
              <div className="rounded-3xl border border-red-900/60 bg-gradient-to-r from-red-950/50 via-zinc-950 to-zinc-900 p-8 text-center shadow-2xl space-y-3 dir-rtl">
                <div className="inline-flex p-3.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse">
                  <Skull className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-zinc-100 font-serif tracking-wide">
                  جاري اختيار مسرح الجريمة من قِبل القاتل...
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                  يقوم القاتل الآن سرّياً باختيار سلاح الجريمة والدليل من مخزنه الخاص. سينطلق التحقيق وسيبدأ الطبيب الشرعي بإصدار الأدلة فور اكتمال الاختيار!
                </p>
              </div>
            )}

            {/* Active Investigation Phase Content */}
            {(gameState.phase === 'INVESTIGATION' || gameState.phase === 'KILLER_FINAL_GUESS') && (
              <>
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
                  <ClueBoard
                    clues={gameState.confirmedClues}
                    clueCycleStartTime={gameState.clueCycleStartTime}
                    slotStartTimes={gameState.slotStartTimes}
                    settings={gameState.settings}
                    clueReleaseSpeed={gameState.settings.clueReleaseSpeed}
                    customClueTimeSeconds={gameState.settings.customClueTimeSeconds}
                  />
                )}

                {/* Single My Cards Button Trigger Bar (Replaces permanent inventory panel) */}
                {!isME && (gameState.myWeapons.length > 0 || gameState.myEvidence.length > 0) && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl border border-amber-500/30 bg-zinc-950/90 shadow-xl backdrop-blur-md dir-rtl">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-100 font-serif">بطاقاتي الشخصية المحفوظة</h4>
                        <span className="text-[10px] text-zinc-400 font-mono block">4 أسلحة و4 أدلة سريّة بحوزتك</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsMyCardsOpen(true)}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      <span>عرض بطاقاتي (View Cards)</span>
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Permanent Investigation Notebook Log (Positioned at bottom of main column) */}
            <InvestigationLog log={gameState.log} />
          </div>

          {/* LEFT COLUMN: Role-Specific HUD */}
          <div className="lg:col-span-3 order-2 lg:order-3">
            <LeftPlayerHUD
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
