import React from 'react';
import { AgentInfo, AgentId } from '../types/agents.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  Cpu,
  Search,
  TrendingUp,
  Activity,
  ShieldAlert,
  CheckCheck,
  FileText,
  CheckCircle,
  Loader2,
  Clock,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface AgentWorkflowProps {
  agents: Record<AgentId, AgentInfo>;
}

const AGENT_ORDER: AgentId[] = [
  'orchestrator',
  'research',
  'financialData',
  'sentiment',
  'risk',
  'verification',
  'reportWriter'
];

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Cpu,
  Search,
  TrendingUp,
  Activity,
  ShieldAlert,
  CheckCheck,
  FileText
};

export const AgentWorkflow: React.FC<AgentWorkflowProps> = ({ agents }) => {
  const { isDark } = useTheme();

  const getStatusBadge = (status: AgentInfo['status']) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span
            className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border animate-pulse ${
              isDark
                ? 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40'
                : 'text-cyan-800 bg-cyan-100 border-cyan-300'
            }`}
          >
            <Loader2 className="w-3 h-3 animate-spin" />
            RUNNING
          </span>
        );
      case 'COMPLETED':
        return (
          <span
            className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isDark
                ? 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40'
                : 'text-emerald-800 bg-emerald-100 border-emerald-300'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            COMPLETED
          </span>
        );
      case 'RETRYING':
        return (
          <span
            className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border animate-pulse ${
              isDark
                ? 'text-amber-400 bg-amber-950/60 border-amber-500/40'
                : 'text-amber-800 bg-amber-100 border-amber-300'
            }`}
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            RETRYING
          </span>
        );
      case 'FAILED':
        return (
          <span
            className={`flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
              isDark
                ? 'text-rose-400 bg-rose-950/60 border-rose-500/40'
                : 'text-rose-800 bg-rose-100 border-rose-300'
            }`}
          >
            <AlertCircle className="w-3 h-3" />
            FAILED
          </span>
        );
      default:
        return (
          <span
            className={`flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
              isDark
                ? 'text-slate-500 bg-slate-900/60 border-slate-800'
                : 'text-slate-500 bg-slate-100 border-slate-200'
            }`}
          >
            <Clock className="w-3 h-3" />
            WAITING
          </span>
        );
    }
  };

  const getBorderColor = (status: AgentInfo['status']) => {
    if (isDark) {
      switch (status) {
        case 'RUNNING':
          return 'border-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.25)] bg-[#09111c]';
        case 'COMPLETED':
          return 'border-emerald-500/50 bg-[#07130f]/60';
        case 'RETRYING':
          return 'border-amber-400/80 shadow-[0_0_12px_rgba(251,191,36,0.25)] bg-[#171105]';
        case 'FAILED':
          return 'border-rose-500/80 bg-[#16070a]';
        default:
          return 'border-slate-800/80 bg-[#080b12] opacity-70';
      }
    } else {
      switch (status) {
        case 'RUNNING':
          return 'border-cyan-500 shadow-md bg-cyan-50/50';
        case 'COMPLETED':
          return 'border-emerald-400 bg-emerald-50/50';
        case 'RETRYING':
          return 'border-amber-400 bg-amber-50/50';
        case 'FAILED':
          return 'border-rose-400 bg-rose-50/50';
        default:
          return 'border-slate-200 bg-white opacity-80';
      }
    }
  };

  return (
    <div
      className={`rounded-lg p-4 sm:p-5 shadow-lg border transition-colors ${
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
        <div>
          <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
            Agent Crew Architecture & Execution Matrix
          </h3>
          <p className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Specialized autonomous agents collaborating via verified task handoffs
          </p>
        </div>

        {/* Legend */}
        <div
          className={`flex items-center gap-3 text-[10px] font-mono ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-slate-400" /> Waiting
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" /> Running
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Retrying
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed
          </span>
        </div>
      </div>

      {/* Grid of 7 agents */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {AGENT_ORDER.map((agentId, index) => {
          const agent = agents[agentId];
          const IconComp = ICONS[agent.iconName] || Cpu;

          return (
            <div
              key={agentId}
              id={`agent-node-${agentId}`}
              className={`p-3 rounded border ${getBorderColor(
                agent.status
              )} flex flex-col justify-between transition-all duration-300 relative group`}
            >
              {/* Step indicator */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-slate-400 font-bold">
                  0{index + 1}
                </span>
                {getStatusBadge(agent.status)}
              </div>

              {/* Agent info */}
              <div className="mb-2">
                <div
                  className={`flex items-center gap-1.5 mb-1 ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                  <span className="text-xs font-bold font-['Chakra_Petch',sans-serif] tracking-wide truncate">
                    {agent.name.replace(' Agent', '')}
                  </span>
                </div>
                <div
                  className={`text-[10px] font-mono leading-tight ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {agent.role}
                </div>
              </div>

              {/* Detail snippet if completed or retrying */}
              {agent.details && (
                <div
                  className={`text-[9px] font-mono pt-1.5 mt-1 truncate border-t ${
                    isDark
                      ? 'text-slate-400 border-slate-800/80'
                      : 'text-slate-600 border-slate-200'
                  }`}
                  title={agent.details}
                >
                  {agent.details}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
