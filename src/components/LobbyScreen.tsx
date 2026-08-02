import React, { useState } from 'react';
import { ClientGameState, PlayerProfile, CaseSettings } from '../types';
import { DETECTIVE_AVATARS } from './CardArt';
import {
  Copy,
  Check,
  Shield,
  UserX,
  Play,
  Share2,
  Sliders,
  Sparkles,
  Users,
  Clock,
  Skull,
} from 'lucide-react';

interface LobbyScreenProps {
  state: ClientGameState;
  myProfile: PlayerProfile;
  onUpdateSettings: (settings: Partial<CaseSettings>) => void;
  onToggleReady: () => void;
  onStartMatch: () => void;
  onKickPlayer: (targetId: string) => void;
  onOpenProfile: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  state,
  myProfile,
  onUpdateSettings,
  onToggleReady,
  onStartMatch,
  onKickPlayer,
  onOpenProfile,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const mePlayer = state.players.find((p) => p.id === myProfile.id);
  const isHost = mePlayer?.isHost || false;
  const allReady = state.players.every((p) => p.isReady);
  const canStart = isHost && state.players.length >= 4 && allReady;

  const copyCode = () => {
    navigator.clipboard.writeText(state.caseCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyInviteLink = () => {
    const url = `${window.location.origin}?case=${state.caseCode}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Banner */}
      <div className="relative rounded-2xl border border-zinc-800 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <Skull className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest font-mono">
              مقاطعة التحقيقات الجنائية
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight font-serif">
            {state.caseName}
          </h1>
          <p className="text-xs text-zinc-400">
            اجمع المحققين، وزع الأدوار، افحص أدلة مسرح الجريمة، والتقط القاتل.
          </p>
        </div>

        {/* Case Code & Smart Link */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-zinc-900/80 p-3 rounded-xl border border-zinc-800">
          <div className="text-center sm:text-right pl-2">
            <span className="text-[10px] text-zinc-500 font-mono block uppercase">
              رمز القضية
            </span>
            <span className="text-xl font-extrabold text-amber-400 font-mono tracking-wider">
              {state.caseCode}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedCode ? 'تم النسخ' : 'نسخ الرمز'}
            </button>

            <button
              onClick={copyInviteLink}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold transition-colors shadow-lg shadow-amber-500/10"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-zinc-950" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'تم نسخ الرابط' : 'رابط الدعوة'}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Players Grid */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wide">
                  المحققون المتصلون ({state.players.length} / {state.settings.maxPlayers})
                </h3>
              </div>
              <span className="text-xs text-zinc-500 font-mono">الحد الأدنى 4 لاعبين</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {state.players.map((p) => {
                const isMe = p.id === myProfile.id;
                const avatarPreset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);

                return (
                  <div
                    key={p.id}
                    className={`relative flex items-center justify-between p-3 rounded-xl border transition-all ${
                      isMe
                        ? 'border-amber-500/50 bg-amber-500/5'
                        : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        onClick={isMe ? onOpenProfile : undefined}
                        className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shadow-md cursor-pointer ${
                          avatarPreset ? avatarPreset.bg : 'bg-zinc-800'
                        }`}
                        style={{ border: `2px solid ${avatarPreset ? avatarPreset.color : '#71717a'}` }}
                      >
                        {p.avatar.startsWith('data:') || p.avatar.startsWith('http') ? (
                          <img src={p.avatar} alt={p.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          p.name.charAt(0)
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-zinc-100 text-sm">
                            {p.name}
                          </span>
                          {p.isHost && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              المضيف
                            </span>
                          )}
                          {isMe && (
                            <span className="text-[10px] text-zinc-500 font-mono">(أنت)</span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-mono block ${
                            p.isReady ? 'text-emerald-400' : 'text-zinc-500'
                          }`}
                        >
                          {p.isReady ? '● جاهز' : '○ غير جاهز'}
                        </span>
                      </div>
                    </div>

                    {isHost && !p.isHost && (
                      <button
                        onClick={() => onKickPlayer(p.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="طرد اللاعب"
                      >
                        <UserX className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Player Ready Controls */}
          <div className="pt-6 mt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              onClick={onOpenProfile}
              className="text-xs text-amber-400 hover:underline font-mono"
            >
              تعديل ملفي الشخصي والصورة
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onToggleReady}
                className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-xs transition-all ${
                  mePlayer?.isReady
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20'
                }`}
              >
                {mePlayer?.isReady ? 'إلغاء الجاهزية' : 'أنا جاهز'}
              </button>

              {isHost && (
                <button
                  disabled={!canStart}
                  onClick={onStartMatch}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 rounded-xl font-extrabold uppercase tracking-widest text-xs transition-all ${
                    canStart
                      ? 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-xl shadow-amber-500/20 cursor-pointer'
                      : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
                  }`}
                >
                  <Play className="w-4 h-4 fill-current" />
                  بدء التحقيق
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Host Settings Panel */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wide">
              قواعد وإعدادات القضية
            </h3>
          </div>

          {/* Joker Role */}
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-zinc-200 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> 🃏 دور المهرج
              </span>
              <span className="text-[10px] text-zinc-400 block">
                يفوز المهرج إذا تم التصويت ضده وحزر القاتل.
              </span>
            </div>
            <button
              disabled={!isHost}
              onClick={() => onUpdateSettings({ enableJoker: !state.settings.enableJoker })}
              className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                state.settings.enableJoker
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'bg-zinc-800 text-zinc-500'
              }`}
            >
              {state.settings.enableJoker ? 'مفعل' : 'معطل'}
            </button>
          </div>

          {/* Medical Examiner Selection */}
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
            <span className="text-xs font-bold text-zinc-200 block">
              👨‍⚕️ تعيين الطبيب الشرعي
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={!isHost}
                onClick={() => onUpdateSettings({ medicalExaminerMode: 'random' })}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                  state.settings.medicalExaminerMode === 'random'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}
              >
                عشوائي
              </button>
              <button
                disabled={!isHost}
                onClick={() => onUpdateSettings({ medicalExaminerMode: 'host_chooses' })}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-colors ${
                  state.settings.medicalExaminerMode === 'host_chooses'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                }`}
              >
                المضيف يختار
              </button>
            </div>

            {state.settings.medicalExaminerMode === 'host_chooses' && (
              <select
                disabled={!isHost}
                value={state.settings.medicalExaminerPlayerId || ''}
                onChange={(e) => onUpdateSettings({ medicalExaminerPlayerId: e.target.value || null })}
                className="w-full mt-2 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-200 focus:border-amber-500 focus:outline-none font-mono"
              >
                <option value="">-- اختر الطبيب الشرعي --</option>
                {state.players.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Clue Release Speed */}
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> سرعة كشف الأدلة
            </span>
            <div className="grid grid-cols-3 gap-2">
              {(['fast', 'normal', 'slow'] as const).map((speed) => (
                <button
                  key={speed}
                  disabled={!isHost}
                  onClick={() => onUpdateSettings({ clueReleaseSpeed: speed })}
                  className={`py-1 rounded-lg text-[11px] font-semibold uppercase font-mono transition-colors ${
                    state.settings.clueReleaseSpeed === speed
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {speed === 'fast' ? 'سريع (30ث)' : speed === 'normal' ? 'عادي (1د)' : 'بطيء (2د)'}
                </button>
              ))}
            </div>
          </div>

          {/* Max Players */}
          <div className="p-3 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-2">
            <span className="text-xs font-bold text-zinc-200 block">
              👥 الحد الأقصى للاعبين
            </span>
            <div className="grid grid-cols-4 gap-2">
              {([6, 8, 10, 12] as const).map((count) => (
                <button
                  key={count}
                  disabled={!isHost}
                  onClick={() => onUpdateSettings({ maxPlayers: count })}
                  className={`py-1 rounded-lg text-xs font-bold font-mono transition-colors ${
                    state.settings.maxPlayers === count
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-zinc-900 text-zinc-500 border border-zinc-800'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {!isHost && (
            <p className="text-[11px] text-zinc-500 italic text-center pt-2">
              مضيف القضية فقط يمكنه تغيير الإعدادات.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
