import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext.tsx';
import {
  FullEvaluationSuiteResult,
  EvaluatedCaseDetail
} from '../types/evaluation.ts';
import { runFullEvaluationSuite } from '../services/evaluationService.ts';
import { EvaluationConfusionMatrix } from './EvaluationConfusionMatrix.tsx';
import { EvaluationExplanationPanel } from './EvaluationExplanationPanel.tsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCheck,
  BrainCircuit,
  ShieldCheck,
  Scale,
  Terminal,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Activity,
  Layers
} from 'lucide-react';

interface AgentEvaluationCenterProps {
  onSwitchToAnalysis?: () => void;
}

export const AgentEvaluationCenter: React.FC<AgentEvaluationCenterProps> = ({ onSwitchToAnalysis }) => {
  const { isDark } = useTheme();
  const [suiteResult, setSuiteResult] = useState<FullEvaluationSuiteResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evalStep, setEvalStep] = useState<{ msg: string; current: number; total: number } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'FAILED' | 'FINANCIAL' | 'SENTIMENT' | 'RISK' | 'VERIFICATION'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);

  const handleRunEvaluation = async () => {
    setIsEvaluating(true);
    setEvalStep({ msg: 'Starting evaluation...', current: 1, total: 6 });

    try {
      const result = await runFullEvaluationSuite((msg, current, total) => {
        setEvalStep({ msg, current, total });
      });
      setSuiteResult(result);
    } catch (err) {
      console.error('Failed to run evaluation suite:', err);
    } finally {
      setIsEvaluating(false);
      setEvalStep(null);
    }
  };

  const handleResetEvaluation = () => {
    setSuiteResult(null);
    setExpandedCaseId(null);
    setSearchQuery('');
  };

  // Filter test cases
  const filteredCases: EvaluatedCaseDetail[] = (suiteResult?.caseDetails || []).filter((c) => {
    if (activeFilter === 'FAILED' && c.status !== 'FAILED') return false;
    if (activeFilter === 'FINANCIAL' && c.suite !== 'Financial Validation') return false;
    if (activeFilter === 'SENTIMENT' && c.suite !== 'Sentiment') return false;
    if (activeFilter === 'RISK' && c.suite !== 'Risk') return false;
    if (activeFilter === 'VERIFICATION' && c.suite !== 'Verification') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        c.testInput.toLowerCase().includes(q) ||
        c.expectedOutput.toLowerCase().includes(q) ||
        c.actualOutput.toLowerCase().includes(q) ||
        c.varianceOrReason.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const failedCount = suiteResult?.caseDetails.filter((c) => c.status === 'FAILED').length ?? 0;
  const passedCount = suiteResult?.caseDetails.filter((c) => c.status === 'PASSED').length ?? 0;

  // Chart data for agent comparison
  const chartData = suiteResult
    ? [
        {
          name: 'Financial Calc',
          metric: suiteResult.financialMetrics?.passRate ?? 0,
          label: 'Pass Rate',
          color: '#3b82f6'
        },
        {
          name: 'Sentiment',
          metric: suiteResult.sentimentMetrics?.accuracy ?? 0,
          label: 'Accuracy',
          color: '#06b6d4'
        },
        {
          name: 'Risk Model',
          metric: suiteResult.riskMetrics?.accuracy ?? 0,
          label: 'Accuracy',
          color: '#eab308'
        },
        {
          name: 'Verification',
          metric: suiteResult.verificationMetrics?.detectionRate ?? 0,
          label: 'Catch Rate',
          color: '#a855f7'
        },
        {
          name: 'Overall Score',
          metric: suiteResult.overallScore ?? 0,
          label: 'Composite',
          color: '#10b981'
        }
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div
        className={`rounded-lg border p-5 sm:p-6 transition-colors relative overflow-hidden ${
          isDark
            ? 'bg-[#0b0f17] border-cyan-500/30 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-md'
        }`}
      >
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded border uppercase tracking-wider ${
                  isDark
                    ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                EVALUATION BENCHMARK
              </span>
              <span
                className={`text-[11px] font-mono ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}
              >
                Controlled Dataset (83 Ground-Truth Labeled Test Cases)
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
              AGENT EVALUATION CENTER
            </h1>
            <p className={`text-xs font-mono mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Measured performance of individual agents using reproducible test cases. Never fabricated.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              id="btn-run-evaluation"
              onClick={handleRunEvaluation}
              disabled={isEvaluating}
              className={`px-5 py-2.5 rounded font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                isEvaluating
                  ? 'bg-cyan-950 text-cyan-400 border border-cyan-500/50 cursor-wait animate-pulse'
                  : isDark
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                  : 'bg-cyan-600 hover:bg-cyan-700 text-white shadow-md'
              }`}
            >
              {isEvaluating ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Evaluating ({evalStep?.current ?? 1}/{evalStep?.total ?? 6})...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>RUN AGENT EVALUATION</span>
                </>
              )}
            </button>

            {suiteResult && (
              <button
                onClick={handleResetEvaluation}
                disabled={isEvaluating}
                className={`px-3 py-2.5 rounded font-mono text-xs border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
                    : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
                }`}
                title="Reset Benchmark Results"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {onSwitchToAnalysis && (
              <button
                onClick={onSwitchToAnalysis}
                className={`px-3 py-2.5 rounded font-mono text-xs border flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-700 text-cyan-400 hover:bg-slate-800'
                    : 'bg-white border-slate-300 text-cyan-700 hover:bg-slate-50'
                }`}
              >
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Live Analysis</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Step Progress Banner */}
        {isEvaluating && evalStep && (
          <div
            className={`mt-4 p-3 rounded border font-mono text-xs flex items-center gap-3 animate-pulse ${
              isDark
                ? 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
                : 'bg-cyan-50 border-cyan-300 text-cyan-900'
            }`}
          >
            <Activity className="w-4 h-4 animate-spin text-cyan-400" />
            <div>
              <span className="font-bold uppercase tracking-wide">
                Step {evalStep.current} of {evalStep.total}:
              </span>{' '}
              <span>{evalStep.msg}</span>
            </div>
          </div>
        )}

        {/* Evaluation Metadata Notice */}
        <div
          className={`mt-4 pt-3 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
          }`}
        >
          <div>
            <span>Status: </span>
            <span
              className={`font-bold ${
                suiteResult ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {suiteResult
                ? `COMPLETED (${new Date(suiteResult.timestamp).toLocaleTimeString()})`
                : 'Awaiting benchmark run'}
            </span>
          </div>

          <div>
            <span>Benchmark Dataset: </span>
            <span className="font-semibold text-cyan-400">
              Controlled synthetic & historical ground-truth
            </span>
          </div>
        </div>
      </div>

      {/* 5 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Financial Data Validation */}
        <div
          className={`rounded-lg border p-4 transition-colors flex flex-col justify-between ${
            isDark
              ? 'bg-[#0b0f17] border-blue-500/30 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-blue-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" />
                Financial Validation
              </span>
              <span className="text-[10px] bg-blue-950/60 text-blue-300 px-1.5 py-0.5 rounded border border-blue-500/30">
                12 Cases
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Tolerance: ±0.05%
            </p>

            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
              {suiteResult?.financialMetrics ? (
                <span className="text-blue-400">{suiteResult.financialMetrics.passRate}%</span>
              ) : (
                <span className="text-sm font-normal text-slate-500">N/A — insufficient labeled test data</span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[11px] font-mono text-slate-400">
            {suiteResult?.financialMetrics ? (
              <div className="flex justify-between">
                <span>Passed: <strong className="text-emerald-400">{suiteResult.financialMetrics.passedCases}</strong></span>
                <span>Failed: <strong className="text-rose-400">{suiteResult.financialMetrics.failedCases}</strong></span>
              </div>
            ) : (
              <span>Run benchmark to measure</span>
            )}
          </div>
        </div>

        {/* 2. Sentiment Accuracy */}
        <div
          className={`rounded-lg border p-4 transition-colors flex flex-col justify-between ${
            isDark
              ? 'bg-[#0b0f17] border-cyan-500/30 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <BrainCircuit className="w-3.5 h-3.5" />
                Sentiment Accuracy
              </span>
              <span className="text-[10px] bg-cyan-950/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">
                30 Cases
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Macro-Averaged
            </p>

            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
              {suiteResult?.sentimentMetrics ? (
                <span className="text-cyan-400">{suiteResult.sentimentMetrics.accuracy}%</span>
              ) : (
                <span className="text-sm font-normal text-slate-500">N/A — insufficient labeled test data</span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 space-y-0.5">
            {suiteResult?.sentimentMetrics ? (
              <>
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <strong className="text-cyan-300">{suiteResult.sentimentMetrics.macroPrecision}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Recall:</span>
                  <strong className="text-cyan-300">{suiteResult.sentimentMetrics.macroRecall}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>F1 Score:</span>
                  <strong className="text-amber-400">{suiteResult.sentimentMetrics.macroF1}%</strong>
                </div>
              </>
            ) : (
              <span>Run benchmark to measure</span>
            )}
          </div>
        </div>

        {/* 3. Risk Classification Accuracy */}
        <div
          className={`rounded-lg border p-4 transition-colors flex flex-col justify-between ${
            isDark
              ? 'bg-[#0b0f17] border-amber-500/30 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-amber-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" />
                Risk Accuracy
              </span>
              <span className="text-[10px] bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                21 Cases
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Macro-Averaged
            </p>

            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
              {suiteResult?.riskMetrics ? (
                <span className="text-amber-400">{suiteResult.riskMetrics.accuracy}%</span>
              ) : (
                <span className="text-sm font-normal text-slate-500">N/A — insufficient labeled test data</span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 space-y-0.5">
            {suiteResult?.riskMetrics ? (
              <>
                <div className="flex justify-between">
                  <span>Precision:</span>
                  <strong className="text-amber-300">{suiteResult.riskMetrics.macroPrecision}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>Recall:</span>
                  <strong className="text-amber-300">{suiteResult.riskMetrics.macroRecall}%</strong>
                </div>
                <div className="flex justify-between">
                  <span>F1 Score:</span>
                  <strong className="text-amber-400">{suiteResult.riskMetrics.macroF1}%</strong>
                </div>
              </>
            ) : (
              <span>Run benchmark to measure</span>
            )}
          </div>
        </div>

        {/* 4. Verification Detection Rate */}
        <div
          className={`rounded-lg border p-4 transition-colors flex flex-col justify-between ${
            isDark
              ? 'bg-[#0b0f17] border-purple-500/30 text-slate-100'
              : 'bg-white border-slate-200 text-slate-800 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-purple-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verification Rate
              </span>
              <span className="text-[10px] bg-purple-950/60 text-purple-300 px-1.5 py-0.5 rounded border border-purple-500/30">
                20 Cases
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Defect Catch Rate
            </p>

            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
              {suiteResult?.verificationMetrics ? (
                <span className="text-purple-400">{suiteResult.verificationMetrics.detectionRate}%</span>
              ) : (
                <span className="text-sm font-normal text-slate-500">N/A — insufficient labeled test data</span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 space-y-0.5">
            {suiteResult?.verificationMetrics ? (
              <>
                <div className="flex justify-between">
                  <span>Errors Caught:</span>
                  <strong className="text-purple-300">{suiteResult.verificationMetrics.trueCatches}/10</strong>
                </div>
                <div className="flex justify-between">
                  <span>Clean Passes:</span>
                  <strong className="text-emerald-400">{suiteResult.verificationMetrics.truePasses}/10</strong>
                </div>
              </>
            ) : (
              <span>Run benchmark to measure</span>
            )}
          </div>
        </div>

        {/* 5. Overall Evaluation Score */}
        <div
          className={`rounded-lg border p-4 transition-colors flex flex-col justify-between ${
            isDark
              ? 'bg-[#0b0f17] border-emerald-500/40 text-slate-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
              : 'bg-white border-emerald-300 text-slate-800 shadow-sm'
          }`}
        >
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 font-bold mb-1">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Overall Score
              </span>
              <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Composite
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-2">
              Weighted Average
            </p>

            <div className="text-2xl font-bold font-mono tracking-tight text-white dark:text-white light:text-slate-900">
              {suiteResult?.overallScore !== null && suiteResult?.overallScore !== undefined ? (
                <span className="text-emerald-400">{suiteResult.overallScore}%</span>
              ) : (
                <span className="text-sm font-normal text-slate-500">N/A — insufficient labeled test data</span>
              )}
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400">
            {suiteResult ? (
              <span className="text-[10px] leading-tight block truncate" title={suiteResult.overallScoreFormula}>
                Equal 25% weights across 4 modules
              </span>
            ) : (
              <span>Run benchmark to measure</span>
            )}
          </div>
        </div>
      </div>

      {/* Visualizations & Performance Comparison */}
      {suiteResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Performance Comparison Bar Chart */}
          <div
            className={`lg:col-span-8 rounded-lg border p-5 transition-colors ${
              isDark
                ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                Agent Performance Comparison (Benchmark Score %)
              </h3>
              <span
                className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                  isDark
                    ? 'bg-slate-900 text-slate-300 border-slate-700'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                Max Theoretical: 100.0%
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: isDark ? '#94a3b8' : '#475569', fontSize: 11, fontFamily: 'monospace' }}
                    axisLine={{ stroke: isDark ? '#334155' : '#cbd5e1' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? '#080c14' : '#ffffff',
                      borderColor: isDark ? '#00f0ff' : '#cbd5e1',
                      borderRadius: '6px',
                      color: isDark ? '#ffffff' : '#0f172a',
                      fontFamily: 'monospace',
                      fontSize: '12px'
                    }}
                    formatter={(val: any) => [`${val}%`, 'Score']}
                  />
                  <Bar dataKey="metric" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Passed vs Failed Summary Card */}
          <div
            className={`lg:col-span-4 rounded-lg border p-5 transition-colors flex flex-col justify-between ${
              isDark
                ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-sm'
            }`}
          >
            <div>
              <h3 className="text-sm font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider mb-3">
                Passed vs. Failed Summary
              </h3>

              <div className="space-y-3 font-mono text-xs">
                <div
                  className={`p-3 rounded border flex items-center justify-between ${
                    isDark ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-emerald-50 border-emerald-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>PASSED BENCHMARKS:</span>
                  </div>
                  <strong className="text-base text-emerald-400">{passedCount}</strong>
                </div>

                <div
                  className={`p-3 rounded border flex items-center justify-between ${
                    isDark ? 'bg-rose-950/30 border-rose-500/40' : 'bg-rose-50 border-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <span>FAILED / DIVERGENT:</span>
                  </div>
                  <strong className="text-base text-rose-400">{failedCount}</strong>
                </div>

                <div
                  className={`p-3 rounded border flex items-center justify-between ${
                    isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <span>TOTAL TEST CASES:</span>
                  <strong className="text-base">{suiteResult.caseDetails.length}</strong>
                </div>
              </div>
            </div>

            <div
              className={`mt-4 p-3 rounded border text-[11px] font-mono leading-relaxed ${
                isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <span className="font-bold text-cyan-400">Zero Fabricated Accuracy: </span>
              Divergent test cases represent genuine linguistic nuances in financial dispatches. Failures are transparently reported below.
            </div>
          </div>
        </div>
      )}

      {/* Confusion Matrices Duo */}
      {suiteResult?.sentimentMetrics && suiteResult?.riskMetrics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EvaluationConfusionMatrix
            metrics={suiteResult.sentimentMetrics}
            title="Sentiment Agent Classification"
          />
          <EvaluationConfusionMatrix
            metrics={suiteResult.riskMetrics}
            title="Risk Agent Classification"
          />
        </div>
      )}

      {/* Live / Completed Terminal Log */}
      {suiteResult?.executionLogs && suiteResult.executionLogs.length > 0 && (
        <div
          className={`rounded-lg border p-4 transition-colors ${
            isDark
              ? 'bg-[#080c14] border-slate-800 text-slate-300'
              : 'bg-slate-900 border-slate-800 text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-2 font-mono text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Terminal className="w-4 h-4" />
            <span>Agent Evaluation Execution Log</span>
          </div>

          <div className="bg-black/60 rounded p-3 font-mono text-xs max-h-36 overflow-y-auto space-y-1 text-slate-300">
            {suiteResult.executionLogs.map((logMsg, i) => (
              <div key={i} className="leading-relaxed">
                <span className="text-cyan-400">$ </span>
                {logMsg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test Case Details Table & Inspector */}
      {suiteResult && (
        <div
          className={`rounded-lg border p-5 transition-colors ${
            isDark
              ? 'bg-[#0b0f17] border-cyan-500/20 text-white'
              : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-base font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                Benchmark Test Case Inspector ({filteredCases.length} Cases)
              </h3>
              <p className={`text-xs font-mono mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Inspect individual test inputs, expected ground truth, and failure analyses.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search test case or ID..."
                className={`w-full pl-8 pr-3 py-1.5 rounded font-mono text-xs border transition-colors outline-none ${
                  isDark
                    ? 'bg-[#080c14] border-slate-700 text-white placeholder-slate-500 focus:border-cyan-400'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-cyan-600'
                }`}
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4 text-xs font-mono">
            <button
              onClick={() => setActiveFilter('ALL')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                activeFilter === 'ALL'
                  ? isDark
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                    : 'bg-cyan-100 text-cyan-800 border-cyan-400 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              All ({suiteResult.caseDetails.length})
            </button>

            <button
              id="filter-failed-cases"
              onClick={() => setActiveFilter('FAILED')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer flex items-center gap-1 ${
                activeFilter === 'FAILED'
                  ? 'bg-rose-950 text-rose-300 border-rose-500 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-rose-400/80 border-slate-800'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-400" />
              <span>Failed / Divergent ({failedCount})</span>
            </button>

            <button
              onClick={() => setActiveFilter('SENTIMENT')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                activeFilter === 'SENTIMENT'
                  ? isDark
                    ? 'bg-cyan-950 text-cyan-300 border-cyan-500'
                    : 'bg-cyan-100 text-cyan-800 border-cyan-400 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Sentiment (30)
            </button>

            <button
              onClick={() => setActiveFilter('RISK')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                activeFilter === 'RISK'
                  ? isDark
                    ? 'bg-amber-950 text-amber-300 border-amber-500'
                    : 'bg-amber-100 text-amber-800 border-amber-400 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Risk (21)
            </button>

            <button
              onClick={() => setActiveFilter('VERIFICATION')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                activeFilter === 'VERIFICATION'
                  ? isDark
                    ? 'bg-purple-950 text-purple-300 border-purple-500'
                    : 'bg-purple-100 text-purple-800 border-purple-400 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Verification (20)
            </button>

            <button
              onClick={() => setActiveFilter('FINANCIAL')}
              className={`px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                activeFilter === 'FINANCIAL'
                  ? isDark
                    ? 'bg-blue-950 text-blue-300 border-blue-500'
                    : 'bg-blue-100 text-blue-800 border-blue-400 font-bold'
                  : isDark
                  ? 'bg-slate-900 text-slate-400 border-slate-800'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              Financial Validation (12)
            </button>
          </div>

          {/* Test Cases List */}
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredCases.length === 0 ? (
              <div className="text-center py-8 font-mono text-xs text-slate-500">
                No test cases match the active filter or search criteria.
              </div>
            ) : (
              filteredCases.map((c) => {
                const isExpanded = expandedCaseId === c.id;
                const isFailed = c.status === 'FAILED';

                return (
                  <div
                    key={c.id}
                    id={`test-case-${c.id}`}
                    className={`rounded border transition-all ${
                      isFailed
                        ? isDark
                          ? 'bg-rose-950/20 border-rose-500/40'
                          : 'bg-rose-50/70 border-rose-200'
                        : isDark
                        ? 'bg-[#080c14] border-slate-800'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
                      className="p-3 flex items-start justify-between gap-3 cursor-pointer select-none"
                    >
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded border ${
                              isDark
                                ? 'bg-slate-800 text-cyan-300 border-slate-700'
                                : 'bg-white text-cyan-800 border-slate-300'
                            }`}
                          >
                            {c.id}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            [{c.suite}]
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                              isFailed
                                ? 'bg-rose-900/80 text-rose-300 border border-rose-500/50'
                                : 'bg-emerald-900/80 text-emerald-300 border border-emerald-500/50'
                            }`}
                          >
                            {c.status}
                          </span>
                        </div>

                        <p className={`text-xs font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                          {c.testInput}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] font-mono pt-1">
                          <span className="text-slate-400">
                            Expected: <strong className="text-cyan-400 dark:text-cyan-400 light:text-cyan-700">{c.expectedOutput}</strong>
                          </span>
                          <span className="text-slate-400">
                            Agent Output: <strong className={isFailed ? 'text-rose-400' : 'text-emerald-400'}>{c.actualOutput}</strong>
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400 pt-1">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Detail Accordion */}
                    {isExpanded && (
                      <div
                        className={`px-3 pb-3 pt-2 border-t text-xs font-mono ${
                          isDark
                            ? 'border-slate-800/80 bg-black/20 text-slate-300'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-start gap-2">
                            <strong className="text-cyan-400 shrink-0">Analysis & Reason:</strong>
                            <p className="leading-relaxed">{c.varianceOrReason}</p>
                          </div>
                          {isFailed && (
                            <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300 text-[11px]">
                              <strong>Transparent Evaluation Note: </strong>
                              This failure highlights an authentic edge case in financial language where conflicting cues exist. The system does not suppress failed cases to artificially inflate accuracy scores.
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Educational Explanation & Interpretability Panel */}
      <EvaluationExplanationPanel />
    </div>
  );
};
