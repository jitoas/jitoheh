import React from 'react';
import { Card } from '../types';
import { getCardImageUrl } from '../data/cardArtImages';

interface CardArtProps {
  card: Card;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DETECTIVE_AVATARS = [
  { id: 'det_1', name: 'المفتش الرئيسي فانس', color: '#d97706', bg: 'bg-amber-950' },
  { id: 'det_2', name: 'العميل بلاكوود', color: '#0284c7', bg: 'bg-sky-950' },
  { id: 'det_3', name: 'خبير الأدلة ميلر', color: '#16a34a', bg: 'bg-emerald-950' },
  { id: 'det_4', name: 'المحقق ستيرلينغ', color: '#9333ea', bg: 'bg-purple-950' },
  { id: 'det_5', name: 'المحقق كروس', color: '#dc2626', bg: 'bg-red-950' },
  { id: 'det_6', name: 'المفتش دوبون', color: '#4b5563', bg: 'bg-gray-900' },
  { id: 'det_7', name: 'العميلة هولواي', color: '#c026d3', bg: 'bg-fuchsia-950' },
  { id: 'det_8', name: 'المحقق ريس', color: '#0d9488', bg: 'bg-teal-950' },
];

export const CardArt: React.FC<CardArtProps> = ({ card, className = '', size = 'md' }) => {
  const imageUrl = getCardImageUrl(card);

  const sizeClasses = {
    sm: 'w-32 h-48 sm:w-36 sm:h-52 text-xs',
    md: 'w-44 h-64 sm:w-52 sm:h-76 text-sm',
    lg: 'w-60 h-88 sm:w-64 sm:h-96 text-base',
  };

  return (
    <div
      className={`relative rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-2 shadow-xl flex flex-col justify-between select-none overflow-hidden group transition-all duration-300 hover:border-amber-500/60 hover:shadow-amber-500/10 ${sizeClasses[size]} ${className}`}
    >
      {/* Background noir paper texture pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:6px_6px]" />

      {/* Card Artwork Realistic AI Image Container */}
      <div className="relative w-full flex-1 rounded-xl border border-zinc-800/80 bg-black flex items-center justify-center overflow-hidden shadow-inner group-hover:border-zinc-700 transition-colors">
        <img
          src={imageUrl}
          alt={card.name}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (card.category === 'weapon' || card.id?.startsWith('w')) {
              target.src = '/assets/crime_weapon_art_1785742988879.jpg';
            } else {
              target.src = '/assets/crime_evidence_art_1785743002100.jpg';
            }
          }}
          className="w-full h-full object-cover filter contrast-110 brightness-95 group-hover:scale-105 transition-all duration-500"
        />
        {/* Subtle Bottom Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Item Name ONLY */}
      <div className="z-10 dir-rtl w-full pt-2 pb-0.5 text-center">
        <h4 className="font-extrabold text-zinc-100 leading-tight truncate tracking-tight font-serif text-xs sm:text-sm">
          {card.name}
        </h4>
      </div>
    </div>
  );
};

