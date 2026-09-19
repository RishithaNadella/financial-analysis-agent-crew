import React, { useState, useEffect, useRef } from 'react';
import { AgentLogEvent } from '../types/agents.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Terminal, Filter, ArrowDown } from 'lucide-react';

interface AgentActivityLogProps {
  events: AgentLogEvent[];
  isRunning: boolean;
}

export const AgentActivityLog: React.FC<AgentActivityLogProps> = ({ events, isRunning }) => {
  const { isDark } = useTheme();
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new event
  useEffect(() => {
    if (autoScroll && logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [events, autoScroll]);

  const filteredEvents =
    selectedAgent === 'all'
      ? events
      : events.filter((e) => e.agentId === selectedAgent);

  const getLevelStyle = (level: AgentLogEvent['level']) => {
    if (isDark) {
      switch (level) {
        case 'success':
          return {
            text: 'text-emerald-400',
            badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
          };
        case 'warn':
        case 'retry':
          return {
            text: 'text-amber-400',
            badge: 'bg-amber-950/60 text-amber-300 border-amber-500/30'
          };
        case 'error':
          return {
            text: 'text-rose-400',
            badge: 'bg-rose-950/60 text-rose-300 border-rose-500/30'
          };
        default:
          return {
            text: 'text-slate-300',
            badge: 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30'
          };
      }
    } else {
      switch (level) {
        case 'success':
          return {
            text: 'text-emerald-800 font-semibold',
            badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
          };
        case 'warn':
        case 'retry':
          return {
            text: 'text-amber-800 font-semibold',
            badge: 'bg-amber-100 text-amber-800 border-amber-300'
          };
        case 'error':
          return {
            text: 'text-rose-800 font-semibold',
            badge: 'bg-rose-100 text-rose-800 border-rose-300'
          };
        default:
          return {
            text: 'text-slate-800',
            badge: 'bg-cyan-100 text-cyan-800 border-cyan-300'
          };
      }
    }
  };

  const agentFilters = [
    { id: 'all', label: 'All Agents' },
    { id: 'orchestrator', label: 'Orchestrator' },
    { id: 'research', label: 'Research' },
    { id: 'financialData', label: 'Financial Data' },
    { id: 'sentiment', label: 'Sentiment' },
    { id: 'risk', label: 'Risk' },
    { id: 'verification', label: 'Verification' },
    { id: 'reportWriter', label: 'Report' }
  ];

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
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-3 border-b ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
            Agent Communication & Orchestration Log
          </h3>
          {isRunning && (
            <span
              className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border animate-pulse ${
                isDark
                  ? 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40'
                  : 'text-cyan-800 bg-cyan-100 border-cyan-300 font-semibold'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
              LIVE TELEMETRY
            </span>
          )}
        </div>

        {/* Filter & Controls */}
        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
          <div
            className={`flex items-center gap-1 p-0.5 rounded border ${
              isDark ? 'bg-[#06080d] border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <Filter className="w-3 h-3 text-slate-400 ml-1.5" />
            <select
              id="select-agent-filter"
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              aria-label="Filter events by agent"
              className={`bg-transparent text-xs py-1 px-1.5 focus:outline-none cursor-pointer ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}
            >
              {agentFilters.map((f) => (
                <option
                  key={f.id}
                  value={f.id}
                  className={isDark ? 'bg-[#0b0f17] text-slate-200' : 'bg-white text-slate-800'}
                >
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          <button
            id="btn-toggle-autoscroll"
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded text-xs transition-colors flex items-center gap-1 border cursor-pointer ${
              autoScroll
                ? isDark
                  ? 'bg-cyan-500/20 text-[#00f0ff] border-cyan-500/40'
                  : 'bg-cyan-100 text-cyan-800 border-cyan-300 font-bold'
                : isDark
                ? 'bg-slate-900 text-slate-400 border-slate-800'
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}
          >
            <ArrowDown className="w-3 h-3" />
            <span>Auto-Scroll</span>
          </button>
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={logContainerRef}
        className={`flex-1 rounded p-3 font-mono text-xs overflow-y-auto space-y-2 min-h-[220px] max-h-[360px] border ${
          isDark
            ? 'bg-[#05070c] border-slate-800 text-slate-300'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        {filteredEvents.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-slate-400 italic">
            Waiting for agent dispatch instructions...
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const style = getLevelStyle(evt.level);
            return (
              <div
                key={evt.id}
                className={`flex items-start gap-2.5 py-1 border-b last:border-0 px-1 rounded transition-colors ${
                  isDark
                    ? 'border-slate-900/60 hover:bg-slate-900/40'
                    : 'border-slate-100 hover:bg-slate-100'
                }`}
              >
                {/* Timestamp */}
                <span className="text-[10px] text-slate-400 shrink-0 select-none pt-0.5">
                  {evt.timestamp}
                </span>

                {/* Agent Tag */}
                <span
                  className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded border shrink-0 ${style.badge}`}
                >
                  {evt.agentName.replace(' Agent', '')}
                </span>

                {/* Message */}
                <div className="flex-1">
                  <span className={`${style.text} leading-relaxed`}>
                    {evt.message}
                  </span>
                  {evt.payloadSummary && (
                    <div
                      className={`text-[10px] mt-0.5 px-2 py-0.5 rounded border inline-block font-mono ${
                        isDark
                          ? 'bg-black/40 text-slate-400 border-slate-800/80'
                          : 'bg-white text-slate-600 border-slate-300'
                      }`}
                    >
                      {evt.payloadSummary}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
