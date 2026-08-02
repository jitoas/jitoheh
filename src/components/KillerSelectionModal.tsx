import React, { useState } from 'react';
import { Card } from '../types';
import { CardArt } from './CardArt';
import { Skull, Check } from 'lucide-react';

interface KillerSelectionModalProps {
  weapons: Card[];
  evidence: Card[];
  onConfirmSelection: (weaponId: string, evidenceId: string) => void;
}

export const KillerSelectionModal: React.FC<KillerSelectionModalProps> = ({
  weapons,
  evidence,
  onConfirmSelection,
}) => {
  const [selectedWeaponId, setSelectedWeaponId] = useState<string | null>(null);
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);

  const canConfirm = selectedWeaponId !== null && selectedEvidenceId !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl border border-red-900/60 bg-gradient-to-b from-red-950/80 via-zinc-950 to-black p-6 md:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2 border-b border-zinc-800 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-widest">
            <Skull className="w-4 h-4" /> اختيار مسرح الجريمة للقاتل
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-100 font-serif uppercase tracking-tight">
            اختر سلاح الجريمة والدليل
          </h2>
          <p className="text-xs text-zinc-400">
            حدد بالضبط سلاحاً واحداً ودليلاً واحداً من مخزونك لتحديد تفاصيل الجريمة.
          </p>
        </div>

        {/* Weapon Selection Row */}
        <div>
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>1. اختر سلاح الجريمة</span>
            {selectedWeaponId && <Check className="w-4 h-4 text-emerald-400" />}
          </h3>
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

        {/* Evidence Selection Row */}
        <div>
          <h3 className="text-xs font-bold text-sky-400 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span>2. اختر دليل مسرح الجريمة</span>
            {selectedEvidenceId && <Check className="w-4 h-4 text-emerald-400" />}
          </h3>
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

        {/* Action Button */}
        <div className="pt-4 border-t border-zinc-800 flex justify-center">
          <button
            disabled={!canConfirm}
            onClick={() => {
              if (selectedWeaponId && selectedEvidenceId) {
                onConfirmSelection(selectedWeaponId, selectedEvidenceId);
              }
            }}
            className={`px-10 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-widest transition-all ${
              canConfirm
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 cursor-pointer'
                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-800'
            }`}
          >
            تأكيد قضية الجريمة وبدء التحقيق
          </button>
        </div>
      </div>
    </div>
  );
};
