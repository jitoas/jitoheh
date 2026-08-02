import React from 'react';
import { Card } from '../types';

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
  const isWeapon = card.category === 'weapon';
  const primaryColor = isWeapon ? '#dc2626' : '#3b82f6';
  const secondaryColor = isWeapon ? '#991b1b' : '#1d4ed8';

  // Deterministic visual seed based on card id
  let hash = 0;
  for (let i = 0; i < card.id.length; i++) {
    hash = (hash << 5) - hash + card.id.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);

  // Pick shape motif
  const motifIndex = positiveHash % 6;

  const sizeClasses = {
    sm: 'w-24 h-36 text-xs',
    md: 'w-36 h-52 text-sm',
    lg: 'w-48 h-72 text-base',
  };

  return (
    <div
      className={`relative rounded-xl border border-zinc-700 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-2 shadow-2xl flex flex-col justify-between select-none overflow-hidden group transition-all duration-300 hover:border-amber-500/60 hover:shadow-amber-500/10 ${sizeClasses[size]} ${className}`}
    >
      {/* Background crime texture pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px]" />

      {/* Top Tag Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-1 z-10">
        <span
          className="text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded-sm"
          style={{ backgroundColor: `${primaryColor}22`, color: primaryColor }}
        >
          {isWeapon ? 'سلاح' : 'دليل'}
        </span>
        <span className="text-[9px] text-zinc-500 font-mono">#{card.id.toUpperCase()}</span>
      </div>

      {/* Card Artwork Illustration Window */}
      <div className="relative my-1.5 flex-1 rounded-lg border border-zinc-800 bg-zinc-950/80 flex items-center justify-center p-2 overflow-hidden shadow-inner">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-105"
        >
          <defs>
            <radialGradient id={`grad-${card.id}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={primaryColor} stopOpacity="0.35" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </radialGradient>
            <linearGradient id={`gold-${card.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>

          {/* Background Aura */}
          <circle cx="50" cy="50" r="45" fill={`url(#grad-${card.id})`} />

          {/* Grid lines in illustration background */}
          <line x1="10" y1="50" x2="90" y2="50" stroke="#ffffff10" strokeWidth="0.5" />
          <line x1="50" y1="10" x2="50" y2="90" stroke="#ffffff10" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="25" stroke="#ffffff15" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />

          {/* Motif render */}
          {motifIndex === 0 && (
            <g transform="translate(20,20)">
              {/* Dagger / Scalpel motif */}
              <path d="M 10 50 L 50 10 L 55 15 L 15 55 Z" fill={`url(#gold-${card.id})`} />
              <path d="M 50 10 L 60 5 L 55 15 Z" fill={primaryColor} />
              <line x1="10" y1="50" x2="5" y2="55" stroke="#a1a1aa" strokeWidth="4" strokeLinecap="round" />
            </g>
          )}

          {motifIndex === 1 && (
            <g transform="translate(25,25)">
              {/* Flask / Bottle / Liquid motif */}
              <path d="M 20 5 L 30 5 L 30 18 L 45 42 Q 50 50 40 50 L 10 50 Q 0 50 5 42 L 20 18 Z" fill="#27272a" stroke="#a1a1aa" strokeWidth="2" />
              <path d="M 7 42 Q 25 35 43 42 L 40 50 L 10 50 Z" fill={primaryColor} />
              <circle cx="20" cy="30" r="2" fill="#ffffff" opacity="0.6" />
              <circle cx="28" cy="22" r="1.5" fill="#ffffff" opacity="0.4" />
            </g>
          )}

          {motifIndex === 2 && (
            <g transform="translate(20,20)">
              {/* Watch / Lock / Coin motif */}
              <circle cx="30" cy="30" r="24" fill="#18181b" stroke={`url(#gold-${card.id})`} strokeWidth="3" />
              <circle cx="30" cy="30" r="18" fill="none" stroke="#52525b" strokeWidth="1" />
              <line x1="30" y1="30" x2="30" y2="16" stroke={primaryColor} strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="30" x2="40" y2="30" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {motifIndex === 3 && (
            <g transform="translate(15,15)">
              {/* Revolver / Metal / Hardware motif */}
              <rect x="10" y="25" width="40" height="12" rx="2" fill="#3f3f46" stroke="#71717a" strokeWidth="1.5" />
              <circle cx="20" cy="31" r="8" fill="#18181b" stroke="#a1a1aa" strokeWidth="1" />
              <path d="M 15 37 L 10 55 L 20 55 L 23 37 Z" fill="#78350f" />
              <line x1="50" y1="28" x2="50" y2="34" stroke={primaryColor} strokeWidth="3" />
            </g>
          )}

          {motifIndex === 4 && (
            <g transform="translate(20,20)">
              {/* Document / Photo / Note motif */}
              <rect x="10" y="10" width="40" height="50" rx="2" fill="#fef3c7" opacity="0.85" stroke="#d97706" strokeWidth="1.5" />
              <line x1="16" y1="20" x2="44" y2="20" stroke="#78350f" strokeWidth="2" />
              <line x1="16" y1="28" x2="40" y2="28" stroke="#78350f" strokeWidth="1.5" />
              <line x1="16" y1="34" x2="35" y2="34" stroke="#78350f" strokeWidth="1.5" />
              <path d="M 30 40 L 45 55 L 50 48 Z" fill={primaryColor} />
            </g>
          )}

          {motifIndex === 5 && (
            <g transform="translate(20,20)">
              {/* Glove / Ring / Ribbon / Fiber motif */}
              <path d="M 15 15 C 30 5, 45 5, 50 20 C 55 35, 30 50, 15 45 C 5 40, 0 25, 15 15 Z" fill="none" stroke={primaryColor} strokeWidth="3" />
              <circle cx="30" cy="25" r="8" fill="#18181b" stroke={`url(#gold-${card.id})`} strokeWidth="2" />
            </g>
          )}

          {/* Fingerprint overlay detail */}
          <path
            d="M 40 45 Q 50 35 60 45 T 70 55"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.75"
            opacity="0.25"
            strokeDasharray="3 3"
          />
        </svg>

        {/* Highlight stamp tag */}
        <div className="absolute bottom-1 right-1 bg-black/80 backdrop-blur-sm border border-zinc-800 px-1.5 py-0.5 rounded text-[8px] font-mono text-zinc-400">
          {card.tags[0]?.toUpperCase() || 'ITEM'}
        </div>
      </div>

      {/* Card Title & Description */}
      <div className="z-10">
        <h4 className="font-semibold text-zinc-100 leading-tight truncate tracking-tight text-center">
          {card.name}
        </h4>
        {card.description && size !== 'sm' && (
          <p className="text-[10px] text-zinc-400 line-clamp-2 mt-0.5 leading-none text-center">
            {card.description}
          </p>
        )}
      </div>

      {/* Subtle Bottom Gold Border Line */}
      <div className="mt-1 h-[2px] w-full rounded-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
    </div>
  );
};
