import React from 'react';
import { RandomEvent } from '../types';
import { AlertCircle } from 'lucide-react';

interface EventBannerProps {
  event: RandomEvent | null;
}

export const EventBanner: React.FC<EventBannerProps> = ({ event }) => {
  if (!event) return null;

  return (
    <div className="w-full max-w-6xl mx-auto rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/80 via-zinc-950 to-amber-950/80 p-4 shadow-xl flex items-center gap-4 animate-in slide-in-from-top duration-500">
      <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
        <AlertCircle className="w-5 h-5 animate-pulse" />
      </div>

      <div className="flex-1">
        <span className="text-[10px] font-bold text-amber-400 font-mono uppercase tracking-widest block">
          CRIME SCENE EVENT: {event.title}
        </span>
        <p className="text-xs text-zinc-200 font-medium mt-0.5">{event.description}</p>
      </div>
    </div>
  );
};
