import React, { useState } from 'react';
import { ClientGameState } from '../types';
import { CardArt } from './CardArt';
import { Vote, Check, X } from 'lucide-react';

interface VotingModalProps {
  state: ClientGameState;
  initialTargetPlayerId?: string;
  onClose: () => void;
  onSubmitVote: (targetPlayerId: string, weaponId: string, evidenceId: string) => void;
}

export const VotingModal: React.FC<VotingModalProps> = ({
  state,
  initialTargetPlayerId,
  onClose,
  onSubmitVote,
}) => {
  const isTargetAllowed = (tId: string) => {
    if (state.myRole === 'KILLER' && state.intel?.accompliceId && tId === state.intel.accompliceId) {
      return false;
    }
    if (state.myRole === 'ACCOMPLICE' && state.intel?.killerId && tId === state.intel.killerId) {
      return false;
    }
    return true;
  };

  const eligibleTargets = state.players.filter(
    (p) => p.role !== 'MEDICAL_EXAMINER' && isTargetAllowed(p.id)
  );

  const defaultTargetId =
    initialTargetPlayerId && isTargetAllowed(initialTargetPlayerId) && eligibleTargets.some((p) => p.id === initialTargetPlayerId)
      ? initialTargetPlayerId
      : eligibleTargets[0]?.id || '';

  const [targetId, setTargetId] = useState<string>(defaultTargetId);
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const targetPlayer = state.players.find((p) => p.id === targetId);
  const weapons = targetPlayer?.weapons || [];
  const evidence = targetPlayer?.evidence || [];

  const canSubmit = targetId && isTargetAllowed(targetId) && selectedWeaponId && selectedEvidenceId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto dir-rtl">
      <div className="w-full max-w-5xl rounded-3xl border border-red-900/60 bg-gradient-to-b from-red-950/90 via-zinc-950 to-black p-6 md:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto scrollbar-thin text-right">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-red-400 font-mono font-bold uppercase tracking-wider block">
                تقديم لائحة الاتهام الرسمية
              </span>
              <h3 className="text-2xl font-extrabold text-zinc-100 font-serif">
                التصويت لحل لغز الجريمة
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: Select Suspected Killer */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
            1. اختر المشتبه به الرئيس (القاتل)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {eligibleTargets.map((p) => {
              const isSelected = targetId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setTargetId(p.id);
                    setSelectedWeaponId(null);
                    setSelectedEvidenceId(null);
                  }}
                  className={`p-3 rounded-xl border transition-all text-right flex items-center gap-2.5 ${
                    isSelected
                      ? 'border-red-500 bg-red-500/20 ring-2 ring-red-500/40'
                      : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs text-zinc-200">
                    {p.name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-zinc-100 truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Select Weapon from Target Inventory */}
        {targetPlayer && (
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>2. اختر سلاح الجريمة المتهم (من مخزون {targetPlayer.name})</span>
              {selectedWeaponId && <Check className="w-4 h-4 text-emerald-400" />}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
              {weapons.map((w) => {
                const isSelected = selectedWeaponId === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWeaponId(w.id)}
                    className={`cursor-pointer transition-transform ${
                      isSelected ? 'ring-4 ring-red-500 scale-105 rounded-xl' : 'hover:scale-102 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <CardArt card={w} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Select Evidence from Target Inventory */}
        {targetPlayer && (
          <div>
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span>3. اختر دليل مسرح الجريمة المتهم (من مخزون {targetPlayer.name})</span>
              {selectedEvidenceId && <Check className="w-4 h-4 text-emerald-400" />}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
              {evidence.map((e) => {
                const isSelected = selectedEvidenceId === e.id;
                return (
                  <div
                    key={e.id}
                    onClick={() => setSelectedEvidenceId(e.id)}
                    className={`cursor-pointer transition-transform ${
                      isSelected ? 'ring-4 ring-sky-500 scale-105 rounded-xl' : 'hover:scale-102 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <CardArt card={e} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200"
          >
            إلغاء
          </button>

          <button
            disabled={!canSubmit}
            onClick={() => {
              if (canSubmit) {
                onSubmitVote(targetId, selectedWeaponId, selectedEvidenceId);
                onClose();
              }
            }}
            className={`px-8 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-widest transition-all ${
              canSubmit
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
            }`}
          >
            تأكيد الاتهام وإرسال التصويت
          </button>
        </div>
      </div>
    </div>
  );
};

