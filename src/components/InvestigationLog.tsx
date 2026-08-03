import React, { useState } from 'react';
import { BookOpen, ShieldAlert, Sparkles, Vote, FileText, CheckCircle2, XCircle, Clock, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface InvestigationLogProps {
  log: string[];
}

export const InvestigationLog: React.FC<InvestigationLogProps> = ({ log }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filter, setFilter] = useState<'all' | 'clues' | 'votes' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reverse log so newest events are at top
  const reversedLog = [...log].reverse();

  const filteredLogs = reversedLog.filter((item) => {
    const matchesQuery = item.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesQuery) return false;

    if (filter === 'clues') return item.includes('دليل') || item.includes('تغيير');
    if (filter === 'votes') return item.includes('تصويت') || item.includes('اتهم') || item.includes('المهرج');
    if (filter === 'events') return item.includes('حدث') || item.includes('السرية') || item.includes('إنشاء') || item.includes('انطلق');
    return true;
  });

  const getLogBadge = (item: string) => {
    if (item.includes('إصدار دليل') || item.includes('تغيير دليل')) {
      return {
        label: 'أدلة جنائية',
        color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
        icon: <FileText className="w-3 h-3 text-yellow-400" />,
      };
    }
    if (item.includes('تصويت') || item.includes('اتهم')) {
      return {
        label: 'تصويت وإتهام',
        color: 'bg-red-500/20 text-red-300 border-red-500/40',
        icon: <Vote className="w-3 h-3 text-red-400" />,
      };
    }
    if (item.includes('صحيح') || item.includes('فوز')) {
      return {
        label: 'نتيجة مؤكدة',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        icon: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
      };
    }
    if (item.includes('خاطئ') || item.includes('فشل')) {
      return {
        label: 'تخمين غير دقيق',
        color: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
        icon: <XCircle className="w-3 h-3 text-rose-400" />,
      };
    }
    if (item.includes('المهرج')) {
      return {
        label: 'دور المهرج',
        color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        icon: <Sparkles className="w-3 h-3 text-purple-400" />,
      };
    }
    return {
      label: 'ملاحظة قضية',
      color: 'bg-zinc-800 text-zinc-300 border-zinc-700',
      icon: <Clock className="w-3 h-3 text-zinc-400" />,
    };
  };

  return (
    <div className="rounded-3xl border border-amber-900/40 bg-gradient-to-b from-zinc-950 via-zinc-900/90 to-zinc-950 p-6 shadow-2xl space-y-4 text-right">
      {/* Notebook Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-3 gap-3 cursor-pointer hover:opacity-90 transition-opacity"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-zinc-100 font-serif tracking-wide flex items-center gap-2">
              <span>سجل التحقيق الدائم (Investigation Dossier Log)</span>
              {isExpanded ? <ChevronUp className="w-4 h-4 text-amber-400" /> : <ChevronDown className="w-4 h-4 text-amber-400" />}
            </h2>
            <p className="text-[11px] text-zinc-400 font-mono">
              تتبع زمني لكافة البلاغات، الأدلة، والتصويتات الموثقة
            </p>
          </div>
        </div>

        {/* Log Counter Badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full">
            {log.length} أحداث مسجلة
          </span>
          <button className="text-xs text-zinc-400 hover:text-zinc-200 font-bold underline px-2 py-1">
            {isExpanded ? 'طي السجل' : 'عرض السجل'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث في سجل التحقيق..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-1.5 pr-8 text-xs text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none font-mono"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-2.5 pointer-events-none" />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(
            [
              { id: 'all', label: 'الكل' },
              { id: 'clues', label: 'الأدلة' },
              { id: 'votes', label: 'التصويت' },
              { id: 'events', label: 'الأحداث' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filter === item.id
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-zinc-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notebook Scroll Area */}
      <div className="relative rounded-2xl border border-zinc-800 bg-zinc-950/90 p-4 max-h-72 overflow-y-auto space-y-2.5 scrollbar-thin shadow-inner">
        {/* Left red margin line like classic detective notebook */}
        <div className="absolute top-0 right-10 bottom-0 w-[1px] bg-red-900/30 pointer-events-none" />

        {filteredLogs.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 font-mono">
            لا توجد أحداث مطابقة في سجل القضية حتى الآن.
          </div>
        ) : (
          filteredLogs.map((entry, index) => {
            const badge = getLogBadge(entry);
            return (
              <div
                key={index}
                className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 hover:bg-zinc-900/80 transition-colors gap-2"
              >
                <div className="flex items-center gap-2.5 flex-1 pr-2">
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${badge.color}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                  <span className="text-xs text-zinc-200 font-sans leading-relaxed">
                    {entry}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                  سجل #{filteredLogs.length - index}
                </span>
              </div>
            );
          })
        )}
      </div>
        </>
      )}
    </div>
  );
};
