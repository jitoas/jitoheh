import React from 'react';
import { Player } from '../types';
import { CardArt } from './CardArt';
import { Eye, X } from 'lucide-react';

interface PlayerInventoryModalProps {
  player: Player | null;
  onClose: () => void;
  onAccuse?: (playerId: string) => void;
  canAccuse?: boolean;
}

export const PlayerInventoryModal: React.FC<PlayerInventoryModalProps> = ({
  player,
  onClose,
  onAccuse,
  canAccuse = false,
}) => {
  if (!player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-4xl rounded-3xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto scrollbar-thin">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500 flex items-center justify-center font-bold text-amber-400">
              {player.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-mono uppercase block">
                SUSPECT INVENTORY DOSSIER
              </span>
              <h3 className="text-xl font-extrabold text-zinc-100 font-serif">
                {player.name}'s Evidence Inventory
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

        {/* Weapons Section */}
        <div>
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>4 Weapon Cards</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
            {player.weapons.map((w) => (
              <CardArt key={w.id} card={w} size="md" />
            ))}
          </div>
        </div>

        {/* Evidence Section */}
        <div>
          <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span>4 Evidence Cards</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 justify-items-center">
            {player.evidence.map((e) => (
              <CardArt key={e.id} card={e} size="md" />
            ))}
          </div>
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
          <span className="text-xs text-zinc-500 font-mono">
            Compare inventory items against released crime scene clues.
          </span>

          <div className="flex gap-3">
            {canAccuse && onAccuse && (
              <button
                onClick={() => {
                  onClose();
                  onAccuse(player.id);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-red-600/20"
              >
                Accuse {player.name}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-semibold text-xs transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
