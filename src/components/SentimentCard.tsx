import React from 'react';
import { SentimentOutput } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Activity, Sparkles, MessageSquare } from 'lucide-react';

interface SentimentCardProps {
  sentiment: SentimentOutput;
}

export const SentimentCard: React.FC<SentimentCardProps> = ({ sentiment }) => {
  const { isDark } = useTheme();

  const getBadgeClass = (overall: string) => {
    switch (overall) {
      case 'Positive':
        return isDark
          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
          : 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Negative':
        return isDark
          ? 'bg-rose-950/80 text-rose-400 border-rose-500/40'
          : 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return isDark
          ? 'bg-amber-950/80 text-amber-400 border-amber-500/40'
          : 'bg-amber-100 text-amber-800 border-amber-300';
    }
  };

  return (
    <div
      className={`rounded-lg p-4 sm:p-5 shadow-lg flex flex-col h-full border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between mb-4 pb-3 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
            Sentiment Analysis
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
              isDark
                ? 'text-cyan-400/80 bg-cyan-950/40 border-cyan-500/20'
                : 'text-cyan-800 bg-cyan-50 border-cyan-300 font-semibold'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            AI-GENERATED
          </span>
          <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${getBadgeClass(sentiment.overall)}`}>
            {sentiment.overall.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2.5 mb-4">
        {/* Multi-segment bar */}
        <div
          className={`h-3 w-full rounded-full overflow-hidden flex border ${
            isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-200 border-slate-300'
          }`}
        >
          <div
            style={{ width: `${sentiment.positive}%` }}
            className="bg-emerald-500 transition-all duration-500 relative group"
            title={`Positive: ${sentiment.positive}%`}
          />
          <div
            style={{ width: `${sentiment.neutral}%` }}
            className="bg-slate-400 dark:bg-slate-500 transition-all duration-500 relative group"
            title={`Neutral: ${sentiment.neutral}%`}
          />
          <div
            style={{ width: `${sentiment.negative}%` }}
            className="bg-rose-500 transition-all duration-500 relative group"
            title={`Negative: ${sentiment.negative}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div
            className={`rounded p-2 text-center border ${
              isDark
                ? 'bg-emerald-950/20 border-emerald-500/20'
                : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              Positive
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
              {sentiment.positive}%
            </div>
          </div>
          <div
            className={`rounded p-2 text-center border ${
              isDark
                ? 'bg-slate-900/40 border-slate-700/40'
                : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Neutral
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
              {sentiment.neutral}%
            </div>
          </div>
          <div
            className={`rounded p-2 text-center border ${
              isDark
                ? 'bg-rose-950/20 border-rose-500/20'
                : 'bg-rose-50 border-rose-200'
            }`}
          >
            <div className={`text-[10px] uppercase font-semibold ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>
              Negative
            </div>
            <div className={`text-base font-bold ${isDark ? 'text-rose-300' : 'text-rose-800'}`}>
              {sentiment.negative}%
            </div>
          </div>
        </div>
      </div>

      {/* Reasons breakdown */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div
          className={`text-[11px] font-mono uppercase tracking-wider mb-2 flex items-center gap-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <MessageSquare className="w-3 h-3 text-cyan-500" />
          <span>Core Rationale Drivers</span>
        </div>
        <ul className="space-y-1.5">
          {sentiment.reasons.map((r, idx) => (
            <li
              key={idx}
              className={`text-xs font-mono flex items-start gap-2 p-2 rounded border transition-colors ${
                isDark
                  ? 'bg-[#080b12] border-slate-800/60 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              <span className="text-cyan-500 font-bold">›</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
