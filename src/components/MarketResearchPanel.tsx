import React, { useState } from 'react';
import { MarketResearchOutput } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Globe, CheckCircle2, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface MarketResearchPanelProps {
  research: MarketResearchOutput;
}

export const MarketResearchPanel: React.FC<MarketResearchPanelProps> = ({ research }) => {
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'sources'>('overview');

  return (
    <div
      className={`rounded-lg p-4 sm:p-5 shadow-lg flex flex-col h-full border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-cyan-500" />
          <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
            Market Intelligence Feed
          </h3>
        </div>

        {/* Tab navigation */}
        <div
          className={`flex items-center gap-1 p-0.5 rounded border text-xs font-mono ${
            isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            id="tab-research-overview"
            onClick={() => setActiveTab('overview')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? isDark
                  ? 'bg-cyan-500/20 text-[#00f0ff] font-bold'
                  : 'bg-white text-cyan-800 font-bold shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Findings & Factors
          </button>
          <button
            id="tab-research-events"
            onClick={() => setActiveTab('events')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'events'
                ? isDark
                  ? 'bg-cyan-500/20 text-[#00f0ff] font-bold'
                  : 'bg-white text-cyan-800 font-bold shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Events ({research.important_events.length})
          </button>
          <button
            id="tab-research-sources"
            onClick={() => setActiveTab('sources')}
            className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
              activeTab === 'sources'
                ? isDark
                  ? 'bg-cyan-500/20 text-[#00f0ff] font-bold'
                  : 'bg-white text-cyan-800 font-bold shadow-sm'
                : isDark
                ? 'text-slate-400 hover:text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sources ({research.sources.length})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[380px]">
        {activeTab === 'overview' && (
          <>
            {/* Key Findings */}
            <div>
              <div
                className={`text-[11px] font-mono uppercase tracking-wider mb-2 font-semibold ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Strategic Intelligence Findings
              </div>
              <ul className="space-y-1.5">
                {research.key_findings.map((finding, idx) => (
                  <li
                    key={idx}
                    className={`text-xs font-mono leading-relaxed flex items-start gap-2 p-2 rounded border transition-colors ${
                      isDark
                        ? 'bg-[#080b12] border-slate-800/60 text-slate-300'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-cyan-500 mt-0.5 font-bold">›</span>
                    <span>{finding}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Positive vs Negative Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {/* Positive Factors */}
              <div
                className={`border rounded p-3 ${
                  isDark
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : 'bg-emerald-50 border-emerald-200'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-emerald-400' : 'text-emerald-800'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Positive Catalysts</span>
                </div>
                <ul className="space-y-1.5">
                  {research.positive_factors.map((p, idx) => (
                    <li
                      key={idx}
                      className={`text-xs font-mono flex items-start gap-1.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-800'
                      }`}
                    >
                      <span className="text-emerald-500 font-bold">+</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Negative Factors / Headwinds */}
              <div
                className={`border rounded p-3 ${
                  isDark
                    ? 'bg-rose-950/20 border-rose-500/30'
                    : 'bg-rose-50 border-rose-200'
                }`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider mb-2 ${
                    isDark ? 'text-rose-400' : 'text-rose-800'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Operational Headwinds</span>
                </div>
                <ul className="space-y-1.5">
                  {research.negative_factors.map((n, idx) => (
                    <li
                      key={idx}
                      className={`text-xs font-mono flex items-start gap-1.5 ${
                        isDark ? 'text-slate-300' : 'text-slate-800'
                      }`}
                    >
                      <span className="text-rose-500 font-bold">-</span>
                      <span>{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}

        {activeTab === 'events' && (
          <div className="space-y-2">
            <div
              className={`text-[11px] font-mono uppercase tracking-wider mb-2 font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Verified Corporate & Sector Milestones
            </div>
            {research.important_events.map((evt, idx) => (
              <div
                key={idx}
                className={`border p-3 rounded flex items-start gap-2.5 transition-colors ${
                  isDark
                    ? 'bg-[#080b12] border-slate-800 text-slate-300'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <Calendar className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                <div className="text-xs font-mono leading-relaxed">{evt}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sources' && (
          <div className="space-y-2">
            <div
              className={`text-[11px] font-mono uppercase tracking-wider mb-2 font-semibold ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Verified Registry & Disclosure Citations
            </div>
            {research.sources.map((src, idx) => (
              <div
                key={idx}
                className={`border p-3 rounded flex items-start justify-between gap-3 transition-colors ${
                  isDark
                    ? 'bg-[#080b12] border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <div
                      className={`text-xs font-mono font-bold ${
                        isDark ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {src.title}
                    </div>
                    <div
                      className={`text-[11px] font-mono mt-0.5 ${
                        isDark ? 'text-slate-400' : 'text-slate-500'
                      }`}
                    >
                      Provider: <span className="text-cyan-600 font-semibold">{src.source}</span>{' '}
                      {src.date && `• ${src.date}`}
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  CIT-0{idx + 1}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
