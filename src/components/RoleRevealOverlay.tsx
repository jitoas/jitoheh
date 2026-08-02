import React, { useEffect, useState } from 'react';
import { ClientGameState, Role } from '../types';
import { DETECTIVE_AVATARS } from './CardArt';
import { Skull, Eye, Stethoscope, Search, Sparkles, UserCheck, ArrowRight } from 'lucide-react';

interface RoleRevealOverlayProps {
  state: ClientGameState;
  myRole: Role | null;
  onDismiss: () => void;
}

export const RoleRevealOverlay: React.FC<RoleRevealOverlayProps> = ({
  state,
  myRole,
  onDismiss,
}) => {
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onDismiss]);

  if (!myRole) return null;

  const roleConfig = {
    KILLER: {
      title: 'أنت القاتل',
      icon: <Skull className="w-12 h-12 text-red-500 animate-pulse" />,
      color: 'text-red-500',
      bgGradient: 'from-red-950/90 via-zinc-950 to-black',
      borderColor: 'border-red-600/50',
      subtitle: 'اختر سلاحاً ودليلاً واحداً لتحديد مسرح الجريمة وتوريط الآخرين. تجنب الاكتشاف!',
    },
    ACCOMPLICE: {
      title: 'أنت الشريك',
      icon: <UserCheck className="w-12 h-12 text-amber-500" />,
      color: 'text-amber-500',
      bgGradient: 'from-amber-950/90 via-zinc-950 to-black',
      borderColor: 'border-amber-600/50',
      subtitle: 'أنت تعرف القاتل وسلاح ودليل الجريمة المختارين. تضلل المحققين لحماية القاتل!',
    },
    WITNESS: {
      title: 'أنت الشاهد',
      icon: <Eye className="w-12 h-12 text-sky-400" />,
      color: 'text-sky-400',
      bgGradient: 'from-sky-950/90 via-zinc-950 to-black',
      borderColor: 'border-sky-500/50',
      subtitle: 'أنت تعرف القاتل والشريك، ولكنك لا تعرف أيهما القاتل! وجه المحققين بحذر!',
    },
    MEDICAL_EXAMINER: {
      title: 'أنت الطبيب الشرعي',
      icon: <Stethoscope className="w-12 h-12 text-emerald-400" />,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-950/90 via-zinc-950 to-black',
      borderColor: 'border-emerald-500/50',
      subtitle: 'افحص المجلدات واكشف الأدلة لمساعدة التحقيق. أنت تعرف الحقيقة الكاملة!',
    },
    INVESTIGATOR: {
      title: 'أنت محقق',
      icon: <Search className="w-12 h-12 text-amber-400" />,
      color: 'text-amber-400',
      bgGradient: 'from-zinc-900 via-zinc-950 to-black',
      borderColor: 'border-amber-500/30',
      subtitle: 'حلل الأدلة، افحص البطاقات، وحدد القاتل والسلاح والدليل بدقة!',
    },
    JOKER: {
      title: 'أنت المهرج',
      icon: <Sparkles className="w-12 h-12 text-purple-400 animate-spin" />,
      color: 'text-purple-400',
      bgGradient: 'from-purple-950/90 via-zinc-950 to-black',
      borderColor: 'border-purple-500/50',
      subtitle: 'أقنع اللاعبين بالتصويت ضدك! إذا تم استبعادك، حزر القاتل لسرفة النصر!',
    },
  }[myRole];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4 animate-in fade-in duration-500">
      <div
        className={`w-full max-w-2xl rounded-3xl border ${roleConfig.borderColor} bg-gradient-to-b ${roleConfig.bgGradient} p-8 text-center shadow-2xl relative overflow-hidden`}
      >
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center space-y-4 relative z-10">
          <div className="p-4 rounded-full bg-black/50 border border-zinc-800 shadow-xl">
            {roleConfig.icon}
          </div>

          <h2 className={`text-3xl md:text-4xl font-extrabold uppercase tracking-widest font-serif ${roleConfig.color}`}>
            {roleConfig.title}
          </h2>

          <p className="text-sm text-zinc-300 max-w-md leading-relaxed">
            {roleConfig.subtitle}
          </p>

          {/* Context Intel Details */}
          {myRole === 'WITNESS' && state.intel.witnessPair && (
            <div className="mt-4 p-4 rounded-2xl bg-zinc-900/80 border border-sky-500/30 w-full max-w-md">
              <span className="text-xs font-bold text-sky-400 block uppercase tracking-wider mb-2">
                معلومات استخباراتية: ثنائي المشتبه بهما
              </span>
              <div className="flex justify-center items-center gap-6">
                {state.intel.witnessPair.map((id) => {
                  const p = state.players.find((pl) => pl.id === id);
                  if (!p) return null;
                  const preset = DETECTIVE_AVATARS.find((a) => a.id === p.avatar);
                  return (
                    <div key={id} className="flex flex-col items-center">
                      <div
                        className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white ${
                          preset ? preset.bg : 'bg-zinc-800'
                        }`}
                        style={{ border: `2px solid ${preset ? preset.color : '#38bdf8'}` }}
                      >
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-xs text-zinc-200 mt-1 font-semibold">{p.name}</span>
                    </div>
                  );
                })}
              </div>
              <p className="text-[11px] text-zinc-400 mt-2 italic">
                أحدهما القاتل، والآخر الشريك. لا تعلم أيهما هو القاتل!
              </p>
            </div>
          )}

          {/* Dismiss Button */}
          <button
            onClick={onDismiss}
            className="mt-6 flex items-center gap-2 px-8 py-3 rounded-2xl font-extrabold text-sm uppercase tracking-widest bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-all shadow-xl shadow-amber-500/20"
          >
            <span>بدء التحقيق ({countdown}ث)</span>
            <ArrowRight className="w-4 h-4 rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};
