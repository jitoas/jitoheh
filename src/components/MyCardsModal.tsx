import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Card } from '../types';
import { CardArt } from './CardArt';
import { ShieldAlert, X, Layers, Crosshair, Search } from 'lucide-react';

interface MyCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  weapons: Card[];
  evidence: Card[];
  playerName: string;
}

export const MyCardsModal: React.FC<MyCardsModalProps> = ({
  isOpen,
  onClose,
  weapons,
  evidence,
  playerName,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 dir-rtl text-right">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-5xl rounded-3xl border border-amber-500/30 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-950 p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin z-10"
          >
            {/* Header / Folder Dossier Top */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                  <Layers className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest block bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      ملف البطاقات الشخصية • CONFIDENTIAL
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold text-zinc-100 font-serif mt-1">
                    بطاقاتي الخاصة ({playerName})
                  </h3>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-all"
                title="إغلاق"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Description Banner */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                هذه البطاقات الثمانية (4 أسلحة و4 أدلة) خاضعة لسرية التحقيق. قارنها بالأدلة المكشوفة في لوحة التحقيق لخصم الاحتمالات!
              </span>
            </div>

            {/* Weapons Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Crosshair className="w-4 h-4 text-red-500" />
                  <span>أسلحتي الـ 4 (My Weapons)</span>
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">{weapons.length} أسلحة</span>
              </div>

              {weapons.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">لا توجد أسلحة بحوزتك</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
                  {weapons.map((w) => (
                    <CardArt key={w.id} card={w} size="md" />
                  ))}
                </div>
              )}
            </div>

            {/* Evidence Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
                <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-2 font-mono">
                  <Search className="w-4 h-4 text-sky-400" />
                  <span>أدلتي الـ 4 (My Evidence)</span>
                </h4>
                <span className="text-[10px] text-zinc-500 font-mono">{evidence.length} أدلة</span>
              </div>

              {evidence.length === 0 ? (
                <p className="text-xs text-zinc-500 italic">لا توجد أدلة بحوزتك</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
                  {evidence.map((e) => (
                    <CardArt key={e.id} card={e} size="md" />
                  ))}
                </div>
              )}
            </div>

            {/* Footer Action */}
            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="text-xs text-zinc-500 font-mono hidden sm:inline">
                اضغط إغلاق أو انقر خارج النافذة لإخفاء البطاقات مجدداً.
              </span>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
              >
                إغلاق النافذة
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
