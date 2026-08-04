import React, { useMemo } from 'react';
import { ClientGameState, PlayerProfile } from '../types';
import { DETECTIVE_AVATARS } from './CardArt';
import { Eye, Vote, ShieldAlert, Award, X, Stethoscope, EyeOff, UserCheck, Skull } from 'lucide-react';
import { getCardImageUrl } from '../data/cardArtImages';

interface LeftPlayerHUDProps {
  state: ClientGameState;
  myProfile: PlayerProfile;
  onViewInventory: (targetPlayerId: string) => void;
  onOpenVoteModal: (targetPlayerId: string) => void;
  isVotingOpen?: boolean;
}

export const LeftPlayerHUD: React.FC<LeftPlayerHUDProps> = ({
  state,
  myProfile,
  onViewInventory,
  onOpenVoteModal,
  isVotingOpen = false,
}) => {
  const mePlayer = state.players.find((p) => p.id === myProfile.id);
  const myRole = mePlayer?.role;

  // Medical Examiner layout (large self profile card)
  const isME = myRole === 'MEDICAL_EXAMINER';
  const isWitness = myRole === 'WITNESS';
  const isKiller = myRole === 'KILLER';
  const isAccomplice = myRole === 'ACCOMPLICE';

  // Suspects list (every player EXCEPT Medical Examiner)
  const suspectPlayers = state.players.filter((p) => p.role !== 'MEDICAL_EXAMINER');

  // Witness specific suspects: ONLY Killer & Accomplice, using state.intel.witnessPair
  const witnessSuspects = useMemo(() => {
    if (!isWitness) return [];

    // 1. Primary source: state.intel.witnessPair provided by server
    if (state.intel?.witnessPair && state.intel.witnessPair.length > 0) {
      return state.intel.witnessPair
        .map((id: string) => state.players.find((p) => p.id === id))
        .filter((p): p is typeof state.players[0] => p !== undefined);
    }

    // 2. Fallback: state.intel killerId/accompliceId
    const culpritIds = [state.intel?.killerId, state.intel?.accompliceId].filter(
      (id): id is string => Boolean(id)
    );
    if (culpritIds.length > 0) {
      return culpritIds
        .map((id) => state.players.find((p) => p.id === id))
        .filter((p): p is typeof state.players[0] => p !== undefined);
    }

    // 3. Fallback if roles unmasked (e.g. END_GAME)
    const culprits = state.players.filter(
      (p) => p.role === 'KILLER' || p.role === 'ACCOMPLICE'
    );
    return [...culprits].sort((a, b) => {
      const hashA = (state.caseCode + a.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hashB = (state.caseCode + b.id).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return hashA - hashB;
    });
  }, [state.players, state.intel, state.caseCode, isWitness]);

  // If player is Medical Examiner: Show large self profile card on LEFT side
  if (isME && mePlayer) {
    const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === mePlayer.avatar);

    return (
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-5 shadow-2xl flex flex-col space-y-4 dir-rtl text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-zinc-100 font-serif tracking-wide uppercase">
                بطاقة الطبيب الشرعي
              </h3>
              <span className="text-[9px] text-zinc-500 font-mono">MEDICAL EXAMINER HUD</span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
            المشرف الرئيسي
          </span>
        </div>

        {/* Large Profile Card */}
        <div className="p-5 rounded-2xl border border-amber-500/50 bg-amber-500/10 flex flex-col items-center text-center space-y-3 relative overflow-hidden shadow-xl">
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider font-mono">
            أنت
          </div>

          {/* Large Avatar */}
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center font-extrabold text-3xl text-white shadow-2xl shrink-0 ${
              avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
            }`}
            style={{ border: `3px solid ${avatarPreset ? avatarPreset.color : '#f59e0b'}` }}
          >
            {mePlayer.name.charAt(0)}
          </div>

          <div>
            <h4 className="text-lg font-extrabold text-zinc-100 font-serif">{mePlayer.name}</h4>
            <span className="inline-block mt-1 text-xs font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-3 py-0.5 rounded-full font-serif">
              الطبيب الشرعي (Medical Examiner)
            </span>
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-xs pt-2 border-t border-amber-500/20">
            أنت تقود التحقيق وتعرف القاتل والجريمة الحقيقية. مهمتك اختيار الأدلة التوجيهية المناسبة لمساعدة المحققين.
          </p>
        </div>
      </div>
    );
  }

  // If player is Killer or Accomplice: Show ONE shared investigation board panel
  if (isKiller || isAccomplice) {
    const killerPlayer = state.players.find((p) => p.id === state.intel.killerId);
    const accomplicePlayer = state.intel.accompliceId
      ? state.players.find((p) => p.id === state.intel.accompliceId)
      : null;

    const killerAvatar = killerPlayer
      ? DETECTIVE_AVATARS.find((a) => a.id === killerPlayer.avatar)
      : null;
    const accompliceAvatar = accomplicePlayer
      ? DETECTIVE_AVATARS.find((a) => a.id === accomplicePlayer.avatar)
      : null;

    const selectedWeapon = state.intel.selectedWeapon;
    const selectedEvidence = state.intel.selectedEvidence;

    return (
      <div className="rounded-3xl border border-red-900/50 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 shadow-2xl flex flex-col space-y-4 dir-rtl text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400">
              <Skull className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-zinc-100 font-serif tracking-wide uppercase">
                لوحة مخطط الجريمة المشترك
              </h3>
              <span className="text-[9px] text-zinc-500 font-mono">CULPRIT DOSSIER</span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full font-mono">
            سرية للغاية
          </span>
        </div>

        {/* 1. Killer Section */}
        <div className="p-3 rounded-2xl border border-red-900/60 bg-red-950/20 flex items-center gap-3 shadow-md">
          <div
            className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-base text-white shadow-lg shrink-0 ${
              killerAvatar ? killerAvatar.bg : 'bg-red-900'
            }`}
            style={{ border: `2px solid ${killerAvatar ? killerAvatar.color : '#ef4444'}` }}
          >
            {killerPlayer ? killerPlayer.name.charAt(0) : 'K'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-zinc-100 font-serif truncate">
                {killerPlayer ? killerPlayer.name : 'القاتل'}
              </h4>
              <span className="text-[9px] font-extrabold text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded-full font-serif shrink-0">
                1. القاتل (Killer)
              </span>
            </div>
          </div>
        </div>

        {/* 2. Accomplice Section */}
        <div className="p-3 rounded-2xl border border-amber-900/60 bg-amber-950/20 flex items-center gap-3 shadow-md">
          {accomplicePlayer ? (
            <>
              <div
                className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-base text-white shadow-lg shrink-0 ${
                  accompliceAvatar ? accompliceAvatar.bg : 'bg-amber-900'
                }`}
                style={{ border: `2px solid ${accompliceAvatar ? accompliceAvatar.color : '#f59e0b'}` }}
              >
                {accomplicePlayer.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-zinc-100 font-serif truncate">
                    {accomplicePlayer.name}
                  </h4>
                  <span className="text-[9px] font-extrabold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-full font-serif shrink-0">
                    2. الشريك (Accomplice)
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between w-full text-zinc-400 text-xs font-serif px-1">
              <span className="font-bold">2. الشريك (Accomplice):</span>
              <span className="text-[10px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded-full text-zinc-500">
                لا يوجد شريك في هذه القضية
              </span>
            </div>
          )}
        </div>

        {/* Pin Divider */}
        <div className="relative my-1 flex items-center justify-center">
          <div className="border-t border-zinc-800 w-full" />
          <span className="absolute bg-zinc-950 px-3 text-[9px] font-mono text-zinc-500 uppercase tracking-widest border border-zinc-800 rounded-full">
            الجريمة الحقيقية المختارة
          </span>
        </div>

        {/* 3. Selected Weapon */}
        <div className="p-3 rounded-2xl border border-red-900/60 bg-zinc-900/80 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-wider font-mono">
              3. سلاح الجريمة المحدد
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">SELECTED WEAPON</span>
          </div>

          {selectedWeapon ? (
            <div className="space-y-1.5">
              <div className="relative h-36 rounded-xl overflow-hidden border border-red-900/40 shadow-inner group">
                <img
                  src={getCardImageUrl(selectedWeapon)}
                  alt={selectedWeapon.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 right-2 left-2 text-center">
                  <span className="text-sm font-extrabold text-zinc-100 font-serif drop-shadow-md">
                    {selectedWeapon.name}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-28 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 flex items-center justify-center text-center p-3">
              <span className="text-xs text-zinc-500 font-serif">في انتظار اختيار القاتل للسلاح...</span>
            </div>
          )}
        </div>

        {/* 4. Selected Evidence */}
        <div className="p-3 rounded-2xl border border-amber-900/60 bg-zinc-900/80 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider font-mono">
              4. دليل مسرح الجريمة المحدد
            </span>
            <span className="text-[9px] text-zinc-500 font-mono">SELECTED EVIDENCE</span>
          </div>

          {selectedEvidence ? (
            <div className="space-y-1.5">
              <div className="relative h-36 rounded-xl overflow-hidden border border-amber-900/40 shadow-inner group">
                <img
                  src={getCardImageUrl(selectedEvidence)}
                  alt={selectedEvidence.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover filter contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-2 right-2 left-2 text-center">
                  <span className="text-sm font-extrabold text-zinc-100 font-serif drop-shadow-md">
                    {selectedEvidence.name}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-28 rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 flex items-center justify-center text-center p-3">
              <span className="text-xs text-zinc-500 font-serif">في انتظار اختيار القاتل للدليل...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // If player is Witness: Show ONLY Killer & Accomplice in shuffled order
  if (isWitness) {
    return (
      <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl flex flex-col space-y-3 dir-rtl text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
              <EyeOff className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-zinc-100 font-serif tracking-wide uppercase">
                رؤية الشاهد السرية
              </h3>
              <span className="text-[9px] text-zinc-500 font-mono">WITNESS INTEL (2)</span>
            </div>
          </div>
          <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
            ترتيب عشوائي
          </span>
        </div>

        <p className="text-[10px] text-zinc-400 leading-tight font-serif">
          أنت تشاهد القاتل وشريكه، لكن ترتيبهما عشوائي تماماً ولا تعرِف أيهما القاتل الحقيقي!
        </p>

        {/* Shuffled Culprits List */}
        <div className="space-y-2.5">
          {witnessSuspects.map((p, idx) => {
            const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);

            return (
              <div
                key={p.id}
                className="p-3.5 rounded-2xl border border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 transition-all flex items-center justify-between gap-3 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center font-extrabold text-base text-white shadow-lg shrink-0 ${
                      avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
                    }`}
                    style={{ border: `2px solid ${avatarPreset ? avatarPreset.color : '#f59e0b'}` }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-100 font-serif">{p.name}</h4>
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono inline-block mt-0.5">
                      مشتبه به رئيسي #{idx + 1}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onViewInventory(p.id)}
                  className="flex items-center gap-1 py-1.5 px-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer shrink-0"
                >
                  <Eye className="w-3 h-3 text-amber-400" /> أدلة
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Default for Investigator: Show all suspects (every player except ME)
  return (
    <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-4 shadow-2xl flex flex-col space-y-3 dir-rtl text-right">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-extrabold text-zinc-100 font-serif tracking-wide uppercase">
              لوحة المشتبه بهم
            </h3>
            <span className="text-[9px] text-zinc-500 font-mono">
              SUSPECTS HUD ({suspectPlayers.length})
            </span>
          </div>
        </div>
        <span className="text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full font-mono">
          مباشر
        </span>
      </div>

      {/* Suspect List */}
      <div className="space-y-2.5 max-h-[620px] overflow-y-auto scrollbar-thin pr-0.5">
        {suspectPlayers.map((p) => {
          const isSelf = p.id === myProfile.id;
          const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);

          return (
            <div
              key={p.id}
              className={`p-3 rounded-2xl border transition-all ${
                isSelf
                  ? 'border-amber-500/50 bg-amber-500/10 ring-1 ring-amber-500/30'
                  : 'border-zinc-800/90 bg-zinc-900/60 hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  {/* Avatar Profile Picture */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm text-white shadow-lg shrink-0 ${
                      avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
                    }`}
                    style={{ border: `2px solid ${avatarPreset ? avatarPreset.color : '#f59e0b'}` }}
                  >
                    {p.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-zinc-100 font-serif">{p.name}</span>
                      {isSelf && (
                        <span className="text-[9px] text-amber-400 font-mono bg-amber-500/20 px-1.5 py-0.2 rounded">
                          (أنت)
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {p.weapons.length + p.evidence.length} بطاقات
                      </span>
                    </div>
                  </div>
                </div>

                {/* Vote Badge Element */}
                {!p.hasVoted ? (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full shrink-0 shadow-sm shadow-amber-500/10">
                    <Award className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span>شارة متوفرة</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-zinc-500 bg-zinc-900/80 border border-zinc-800 px-2 py-1 rounded-full shrink-0 transition-all duration-700 opacity-40 grayscale line-through">
                    <X className="w-3.5 h-3.5 text-red-500/70" />
                    <span>شارة تلاشت</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-zinc-800/60">
                <button
                  onClick={() => onViewInventory(p.id)}
                  className="flex items-center justify-center gap-1 py-1 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] font-bold transition-colors cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-amber-400" /> عرض الأدلة
                </button>

                {state.phase === 'INVESTIGATION' && !mePlayer?.hasVoted && myRole !== 'MEDICAL_EXAMINER' && (() => {
                  const isInvalidTarget =
                    (myRole === 'KILLER' && state.intel?.accompliceId && p.id === state.intel.accompliceId) ||
                    (myRole === 'ACCOMPLICE' && state.intel?.killerId && p.id === state.intel.killerId);
                  const isDisabled = isVotingOpen || mePlayer?.hasVoted || isInvalidTarget;

                  return (
                    <button
                      onClick={() => !isDisabled && onOpenVoteModal(p.id)}
                      disabled={isDisabled}
                      title={
                        isInvalidTarget
                          ? myRole === 'KILLER'
                            ? 'القاتل لا يمكنه اتهام شريكه'
                            : 'الشريك لا يمكنه اتهام القاتل'
                          : ''
                      }
                      className={`flex items-center justify-center gap-1 py-1 px-2 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-colors shadow-md ${
                        isDisabled
                          ? 'bg-zinc-800/60 text-zinc-600 border border-zinc-800 cursor-not-allowed opacity-40'
                          : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 cursor-pointer'
                      }`}
                    >
                      <Vote className="w-3 h-3" /> الاتهام
                    </button>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};


