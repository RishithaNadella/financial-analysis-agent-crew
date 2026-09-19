import React, { useState, useEffect, useRef } from 'react';
import { AnalysisState, AgentLogEvent } from './types/agents.ts';
import { useTheme } from './context/ThemeContext.tsx';
import { CompanyHeader } from './components/CompanyHeader.tsx';
import { MetricsCards } from './components/MetricsCards.tsx';
import { PriceChart } from './components/PriceChart.tsx';
import { MarketResearchPanel } from './components/MarketResearchPanel.tsx';
import { SentimentCard } from './components/SentimentCard.tsx';
import { RiskCard } from './components/RiskCard.tsx';
import { VerificationPanel } from './components/VerificationPanel.tsx';
import { AgentWorkflow } from './components/AgentWorkflow.tsx';
import { AgentActivityLog } from './components/AgentActivityLog.tsx';
import { ReportPanel } from './components/ReportPanel.tsx';
import { AgentEvaluationCenter } from './components/AgentEvaluationCenter.tsx';
import { generatePdfReport } from './services/pdfService.ts';
import { createInitialState } from './agents/orchestrator.ts';
import {
  Cpu,
  Search,
  Zap,
  Shield,
  AlertCircle,
  Radio,
  Flame,
  Sun,
  Moon,
  BarChart2,
  Sliders
} from 'lucide-react';

const PRESETS = [
  { label: 'RELIANCE', query: 'RELIANCE', desc: 'NSE: Energy & Telecom' },
  { label: 'TCS', query: 'TCS', desc: 'NSE: IT Services' },
  { label: 'INFOSYS', query: 'INFOSYS', desc: 'NSE: Digital & Cloud IT' },
  { label: 'AAPL', query: 'AAPL', desc: 'NASDAQ: Consumer Tech' },
  { label: 'TSLA', query: 'TSLA', desc: 'NASDAQ: EV & Energy' },
  { label: 'NVDA', query: 'NVDA', desc: 'NASDAQ: Semiconductors' },
  { label: 'MSFT', query: 'MSFT', desc: 'NASDAQ: Cloud & Software' }
];

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const [activeView, setActiveView] = useState<'analysis' | 'evaluation'>('analysis');
  const [query, setQuery] = useState<string>('RELIANCE');
  const [isDemo, setIsDemo] = useState<boolean>(false);
  const [simulateGlitch, setSimulateGlitch] = useState<boolean>(false);
  const [simulateApiFailure, setSimulateApiFailure] = useState<boolean>(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [serverHealth, setServerHealth] = useState<{ hasGemini: boolean; status: string } | null>(null);
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Check server health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setServerHealth(data))
      .catch((err) => console.warn('Server health check skipped:', err));
  }, []);

  const handleAnalyze = (
    targetQuery = query,
    forceGlitch = simulateGlitch,
    forceDemo = isDemo,
    forceApiFailure = simulateApiFailure
  ) => {
    const cleanQuery = targetQuery.trim();
    if (!cleanQuery || isRunning) return;

    // Reset previous connection if any
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setIsRunning(true);
    const initial = createInitialState(cleanQuery, forceDemo);
    initial.stage = 'running';
    setAnalysisState(initial);

    // Establish Server-Sent Events (SSE) stream for live agent execution
    const streamUrl = `/api/analyze/stream?query=${encodeURIComponent(cleanQuery)}&demo=${forceDemo}&glitch=${forceGlitch}&apiFailure=${forceApiFailure}`;
    const es = new EventSource(streamUrl);
    eventSourceRef.current = es;

    es.addEventListener('log', (event: MessageEvent) => {
      try {
        const logEvt: AgentLogEvent = JSON.parse(event.data);
        setAnalysisState((prev) => {
          if (!prev) return prev;
          if (prev.events.some((e) => e.id === logEvt.id)) return prev;
          return {
            ...prev,
            events: [...prev.events, logEvt]
          };
        });
      } catch (e) {
        console.error('Error parsing SSE log:', e);
      }
    });

    es.addEventListener('state', (event: MessageEvent) => {
      try {
        const updatedState: AnalysisState = JSON.parse(event.data);
        setAnalysisState(updatedState);
      } catch (e) {
        console.error('Error parsing SSE state:', e);
      }
    });

    es.addEventListener('done', () => {
      setIsRunning(false);
      es.close();
      eventSourceRef.current = null;
    });

    es.addEventListener('error', () => {
      // Fallback: If SSE stream encounters an issue, execute direct REST POST endpoint
      console.warn('SSE stream disconnected or ended, verifying via REST POST fallback');
      es.close();
      eventSourceRef.current = null;

      fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: cleanQuery,
          isDemo: forceDemo,
          simulateRetry: forceGlitch,
          simulateApiFailure: forceApiFailure
        })
      })
        .then((res) => res.json())
        .then((data: AnalysisState) => {
          setAnalysisState(data);
          setIsRunning(false);
        })
        .catch((err) => {
          console.error('Analysis REST fallback error:', err);
          setIsRunning(false);
        });
    });
  };

  const handleDownloadPdf = () => {
    if (analysisState) {
      generatePdfReport(analysisState);
    }
  };

  const handleNewAnalysis = () => {
    setAnalysisState(null);
    setQuery('');
  };

  const handleSimulateDiscrepancyTest = () => {
    if (analysisState && !isRunning) {
      handleAnalyze(analysisState.ticker, true, isDemo, simulateApiFailure);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col crt-grid-bg relative transition-colors ${
        isDark ? 'bg-[#06070a] text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${scanlinesActive ? 'scanlines' : ''}`}
    >
      {/* Top Cyber Command Bar */}
      <header
        className={`border-b sticky top-0 z-40 px-4 py-3 backdrop-blur-md transition-colors ${
          isDark
            ? 'border-cyan-500/20 bg-[#080b12]/90'
            : 'border-slate-200 bg-white/95 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Brand Identity & Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded flex items-center justify-center ${
                  isDark
                    ? 'bg-cyan-950 border border-cyan-400 glow-cyan'
                    : 'bg-cyan-100 border border-cyan-400'
                }`}
              >
                <Cpu
                  className={`w-5 h-5 animate-pulse ${
                    isDark ? 'text-[#00f0ff]' : 'text-cyan-700'
                  }`}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1
                    className={`text-lg sm:text-xl font-bold tracking-wider font-['Silkscreen',monospace] glitch-hover ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    FINANCIAL AGENT CREW
                  </h1>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                      isDark
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-500/40'
                        : 'bg-cyan-100 text-cyan-800 border-cyan-300'
                    }`}
                  >
                    v4.0
                  </span>
                </div>
                <p
                  className={`text-xs font-mono tracking-tight ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}
                >
                  Autonomous Multi-Agent Financial Intelligence
                </p>
              </div>
            </div>

            {/* Navigation Tabs (Analysis vs Evaluation) */}
            <nav className="flex items-center gap-1.5 font-mono text-xs p-1 rounded border self-start sm:self-center transition-colors bg-black/10 dark:bg-black/40 border-slate-300 dark:border-slate-800">
              <button
                id="nav-analysis"
                onClick={() => setActiveView('analysis')}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeView === 'analysis'
                    ? isDark
                      ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                      : 'bg-cyan-600 text-white font-bold shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>LIVE ANALYSIS</span>
              </button>

              <button
                id="nav-evaluation"
                onClick={() => setActiveView('evaluation')}
                className={`px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer relative ${
                  activeView === 'evaluation'
                    ? isDark
                      ? 'bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                      : 'bg-amber-500 text-black font-bold shadow-sm'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>AGENT EVALUATION</span>
                <span className="hidden sm:inline-block text-[9px] px-1 py-0.2 rounded font-mono font-bold uppercase bg-amber-950 text-amber-300 border border-amber-500/50">
                  83 CASES
                </span>
              </button>
            </nav>
          </div>

          {/* Controls & Telemetry & Theme Switcher */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono">
            {/* Prominent LIVE DATA / DEMO DATA Indicator */}
            <div
              id="indicator-data-mode"
              className={`px-3 py-1 rounded border font-mono font-bold flex items-center gap-1.5 transition-all ${
                isDemo
                  ? isDark
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
                    : 'bg-amber-100 text-amber-800 border-amber-400 shadow-sm'
                  : isDark
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-400 shadow-sm'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemo
                    ? 'bg-amber-500'
                    : 'bg-emerald-500 animate-pulse'
                }`}
              />
              <span>{isDemo ? 'DEMO DATA' : 'LIVE DATA'}</span>
            </div>

            {/* AI Engine Status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
                isDark ? 'bg-[#0b0f17] border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span>
                {serverHealth?.hasGemini ? 'Gemini 3 AI Engine' : 'Agent Core Engine'}
              </span>
            </div>

            {/* Demo Mode Toggle Button */}
            <button
              id="btn-toggle-demo"
              onClick={() => {
                const nextDemo = !isDemo;
                setIsDemo(nextDemo);
                if (simulateApiFailure && nextDemo) {
                  setSimulateApiFailure(false);
                }
              }}
              className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isDemo
                  ? isDark
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                    : 'bg-amber-100 text-amber-800 border-amber-400 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  : 'bg-white text-slate-600 border-slate-300 hover:text-slate-900'
              }`}
              title="Toggle between Live Market Feeds and Offline Benchmark Demo Dataset"
            >
              <Radio className="w-3 h-3" />
              <span>DEMO: {isDemo ? 'ON' : 'OFF'}</span>
            </button>

            {/* Theme Toggle Button (Dark / Light) */}
            <button
              id="btn-theme-toggle"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className={`px-2.5 py-1 rounded border transition-all flex items-center gap-1.5 cursor-pointer ${
                isDark
                  ? 'bg-slate-900 text-amber-300 border-slate-700 hover:bg-slate-800 hover:border-amber-400'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-100 shadow-sm'
              }`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[11px]">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-cyan-600" />
                  <span className="text-[11px]">Dark</span>
                </>
              )}
            </button>

            {/* CRT scanlines effect toggle */}
            <button
              id="btn-toggle-crt"
              onClick={() => setScanlinesActive(!scanlinesActive)}
              className={`px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                scanlinesActive
                  ? isDark
                    ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                    : 'bg-cyan-100 text-cyan-800 border-cyan-300'
                  : isDark
                  ? 'bg-slate-900 text-slate-500 border-slate-800'
                  : 'bg-white text-slate-500 border-slate-300'
              }`}
            >
              CRT: {scanlinesActive ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
        {/* VIEW 1: AGENT EVALUATION / ACCURACY CENTER */}
        {activeView === 'evaluation' && (
          <AgentEvaluationCenter onSwitchToAnalysis={() => setActiveView('analysis')} />
        )}

        {/* VIEW 2: LIVE MULTI-AGENT STOCK ANALYSIS */}
        {activeView === 'analysis' && (
          <>
            {/* Input & Search Section */}
            <div
              className={`rounded-lg p-5 sm:p-6 shadow-xl relative overflow-hidden border transition-colors ${
                isDark
                  ? 'bg-[#0b0f17] border-cyan-500/30 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-md'
              }`}
            >
              {/* Glitch accent top line */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#00f0ff] to-[#ff007f]" />

              <div className="max-w-3xl">
                <div
                  className={`text-xs font-mono uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5 ${
                    isDark ? 'text-cyan-400' : 'text-cyan-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Multi-Agent Target Initialization</span>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-tight">
                    Analyze Stock or Public Company
                  </h2>
                  <span
                    className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-cyan-400 bg-cyan-950/40 border-cyan-500/30'
                        : 'text-cyan-800 bg-cyan-50 border-cyan-300'
                    }`}
                  >
                    Accepts any company name or ticker
                  </span>
                </div>

                {/* Search Input and Analyze Button */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAnalyze(query);
                  }}
                  className="flex flex-col sm:flex-row gap-2.5 mb-4"
                >
                  <div className="relative flex-1">
                    <Search
                      className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 ${
                        isDark ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                    />
                    <input
                      id="input-company-ticker"
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="e.g. SBI, Wipro, HDFC Bank, Apple, Tesla, AAPL, TSLA..."
                      disabled={isRunning}
                      className={`w-full rounded px-10 py-3 text-sm font-mono transition-all outline-none border ${
                        isDark
                          ? 'bg-[#06080d] border-cyan-500/40 text-white placeholder:text-slate-500 focus:border-[#00f0ff] focus:ring-1 focus:ring-[#00f0ff]'
                          : 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600'
                      }`}
                    />
                  </div>

                  <button
                    id="btn-analyze"
                    type="submit"
                    disabled={isRunning || !query.trim()}
                    className={`px-6 py-3 rounded font-mono font-bold uppercase tracking-wider text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer active:scale-98 ${
                      isDark
                        ? 'bg-cyan-400 hover:bg-cyan-300 text-black shadow-[0_0_15px_rgba(0,240,255,0.35)]'
                        : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>ORCHESTRATING...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 fill-current" />
                        <span>ANALYZE</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Benchmark Presets */}
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span
                    className={`text-[11px] font-mono ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Quick Examples:
                  </span>
                  {PRESETS.map((p) => (
                    <button
                      key={p.query}
                      id={`preset-${p.query.toLowerCase()}`}
                      onClick={() => {
                        setQuery(p.query);
                        handleAnalyze(p.query);
                      }}
                      disabled={isRunning}
                      className={`px-2.5 py-1 text-xs font-mono font-semibold rounded border transition-colors disabled:opacity-50 cursor-pointer ${
                        isDark
                          ? 'bg-[#070b12] text-cyan-300 border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/40'
                          : 'bg-slate-100 text-cyan-800 border-slate-200 hover:bg-slate-200 hover:border-cyan-400'
                      }`}
                      title={`Quick example: ${p.desc}`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Competition Demo Simulation Controls */}
                <div
                  className={`pt-2 border-t flex items-center gap-2.5 flex-wrap ${
                    isDark ? 'border-slate-800/80' : 'border-slate-200'
                  }`}
                >
                  <span
                    className={`text-[10px] font-mono uppercase tracking-wider ${
                      isDark ? 'text-slate-500' : 'text-slate-500'
                    }`}
                  >
                    Demo Lab Controls:
                  </span>

                  {/* Mathematical Discrepancy / Retry trigger */}
                  <button
                    id="btn-trigger-discrepancy"
                    onClick={() => {
                      const next = !simulateGlitch;
                      setSimulateGlitch(next);
                      if (!isRunning) {
                        handleAnalyze(query, next, isDemo, simulateApiFailure);
                      }
                    }}
                    className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer ${
                      simulateGlitch
                        ? isDark
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/60'
                          : 'bg-amber-100 text-amber-800 border-amber-400 font-bold'
                        : isDark
                        ? 'bg-[#080b12] text-slate-400 border-slate-800 hover:text-slate-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Inject mathematical discrepancy to demonstrate Verification Agent triggering Data Agent recalculation"
                  >
                    Verification Retry Glitch: {simulateGlitch ? 'ON' : 'OFF'}
                  </button>

                  {/* Simulated External API Failure toggle */}
                  <button
                    id="btn-simulate-api-failure"
                    onClick={() => {
                      const next = !simulateApiFailure;
                      setSimulateApiFailure(next);
                      if (!isRunning) {
                        handleAnalyze(query, simulateGlitch, isDemo, next);
                      }
                    }}
                    className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                      simulateApiFailure
                        ? isDark
                          ? 'bg-rose-950/80 text-rose-300 border-rose-500/60'
                          : 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                        : isDark
                        ? 'bg-[#080b12] text-slate-400 border-slate-800 hover:text-slate-300'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                    title="Simulate external market gateway timeout to test error handling and fallback to DEMO MODE"
                  >
                    <Flame className="w-3 h-3" />
                    <span>Simulate API Outage: {simulateApiFailure ? 'ON' : 'OFF'}</span>
                  </button>

                  {/* Jump to Evaluation */}
                  <button
                    onClick={() => setActiveView('evaluation')}
                    className={`px-2 py-1 text-[11px] font-mono rounded border transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                      isDark
                        ? 'bg-slate-900 text-cyan-300 border-slate-700 hover:border-cyan-400'
                        : 'bg-slate-100 text-cyan-800 border-slate-300 hover:border-cyan-500'
                    }`}
                  >
                    <Sliders className="w-3 h-3 text-cyan-500" />
                    <span>Open Evaluation Benchmark ›</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Prominent Error / Disruption Notification Banner */}
            {analysisState && analysisState.stage === 'error' && (
              <div
                className={`rounded-lg p-5 font-mono border-2 transition-all ${
                  isDark
                    ? 'bg-[#1a0b12] border-[#ff007f] text-white shadow-[0_0_20px_rgba(255,0,127,0.25)]'
                    : 'bg-rose-50 border-rose-400 text-rose-950 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider">
                        {analysisState.errorMessage?.includes('Company or ticker not found')
                          ? 'Target Unresolved: Company or Ticker Not Found'
                          : 'Orchestration Halt: Live Market Feed Disruption'}
                      </h3>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${
                          isDark
                            ? 'bg-rose-950 text-rose-300 border-rose-500'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                      >
                        {analysisState.errorMessage?.includes('Company or ticker not found')
                          ? 'VALIDATION NOTICE'
                          : 'EXTERNAL DISRUPTION'}
                      </span>
                    </div>
                    <p
                      className={`text-sm ${
                        isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      {analysisState.errorMessage}
                    </p>
                    <div className="flex items-center gap-3 pt-2 flex-wrap">
                      <button
                        id="btn-switch-to-demo"
                        onClick={() => {
                          setIsDemo(true);
                          setSimulateApiFailure(false);
                          handleAnalyze(query, false, true, false);
                        }}
                        className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                      >
                        Switch to DEMO MODE & Run Benchmark
                      </button>
                      <button
                        onClick={() => {
                          setAnalysisState(null);
                        }}
                        className={`px-3 py-2 rounded text-xs border cursor-pointer ${
                          isDark
                            ? 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border-slate-700'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                        }`}
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dynamic Multi-Agent Workspace (When initialized, running, or completed) */}
            {analysisState && (
              <div className="space-y-6">
                {/* Agent Crew Execution Matrix */}
                <AgentWorkflow agents={analysisState.agents} />

                {/* Real-time Agent Activity / Communication Log */}
                <AgentActivityLog
                  events={analysisState.events}
                  isRunning={isRunning}
                />

                {/* If Market Data is ready: Show Company Header and Core Metrics */}
                {analysisState.marketData && (
                  <>
                    <CompanyHeader
                      metrics={analysisState.marketData}
                      isDemo={analysisState.isDemo}
                    />

                    <MetricsCards metrics={analysisState.marketData} />

                    {/* Price Action Chart */}
                    <PriceChart
                      historicalData={analysisState.marketData.historicalData}
                      currency={analysisState.marketData.currency}
                      ticker={analysisState.marketData.ticker}
                    />
                  </>
                )}

                {/* Market Research Feed */}
                {analysisState.research && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-12">
                      <MarketResearchPanel research={analysisState.research} />
                    </div>
                  </div>
                )}

                {/* Sentiment & Risk Duo Grid */}
                {analysisState.sentiment && analysisState.risk && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SentimentCard sentiment={analysisState.sentiment} />
                    <RiskCard risk={analysisState.risk} />
                  </div>
                )}

                {/* Verification Agent Audit Engine Panel */}
                {analysisState.verification && (
                  <VerificationPanel
                    verification={analysisState.verification}
                    onSimulateRetry={handleSimulateDiscrepancyTest}
                    isRunning={isRunning}
                  />
                )}

                {/* Institutional Research Report Preview & PDF Download */}
                {analysisState.finalReport && analysisState.marketData && (
                  <ReportPanel
                    report={analysisState.finalReport}
                    metrics={analysisState.marketData}
                    onDownloadPdf={handleDownloadPdf}
                    onNewAnalysis={handleNewAnalysis}
                  />
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Persistent Compliance & Financial Disclaimer */}
      <footer
        className={`border-t py-6 px-4 mt-auto transition-colors ${
          isDark
            ? 'border-slate-800/80 bg-[#06080d] text-slate-500'
            : 'border-slate-200 bg-white text-slate-600'
        }`}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-start gap-2 max-w-4xl">
            <Shield className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold uppercase text-slate-500 dark:text-slate-400">
                Mandatory Financial Disclaimer:{' '}
              </span>
              This application provides AI-assisted financial research and informational analysis. It does not provide guaranteed investment outcomes or personalized financial advice. Users should independently verify information and make their own decisions.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className={`font-bold ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>
              FINANCIAL ANALYSIS AGENT CREW
            </div>
            <div className="text-[10px] text-slate-500">Autonomous Multi-Agent System</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
