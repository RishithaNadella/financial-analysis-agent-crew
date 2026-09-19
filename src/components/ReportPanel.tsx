import React, { useState } from 'react';
import { ResearchReport, FinancialMetrics } from '../types/financial.ts';
import { useTheme } from '../context/ThemeContext.tsx';
import { Download, RotateCcw, Copy, Check, ShieldCheck, AlertCircle } from 'lucide-react';

interface ReportPanelProps {
  report: ResearchReport;
  metrics: FinancialMetrics;
  onDownloadPdf: () => void;
  onNewAnalysis: () => void;
}

export const ReportPanel: React.FC<ReportPanelProps> = ({
  report,
  metrics,
  onDownloadPdf,
  onNewAnalysis
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `
FINANCIAL RESEARCH REPORT: ${metrics.companyName} (${metrics.ticker})
============================================================

1. EXECUTIVE SUMMARY
${report.executiveSummary}

2. COMPANY OVERVIEW
${report.companyOverview}

3. CURRENT MARKET DATA & HISTORICAL PERFORMANCE
${report.historicalPricePerformance}

4. FINANCIAL KPIS
${report.financialKpis}

5. MARKET RESEARCH
${report.marketResearch}

6. SENTIMENT ANALYSIS
${report.sentimentAnalysis}

7. RISK ANALYSIS
${report.riskAnalysis}

8. KEY OBSERVATIONS
${report.keyObservations.map((o) => `• ${o}`).join('\n')}

9. DATA SOURCES
${report.dataSources.join('\n')}

10. METHODOLOGY
${report.methodology}

11. DISCLAIMER
${report.disclaimer}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`rounded-lg p-5 sm:p-6 shadow-xl relative border transition-colors ${
        isDark
          ? 'bg-[#0b0f17] border-cyan-500/30 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      {/* Top action bar */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded flex items-center gap-1 border ${
                isDark
                  ? 'bg-emerald-950/80 text-emerald-400 border-emerald-500/40'
                  : 'bg-emerald-100 text-emerald-800 border-emerald-300'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              VERIFIED INSTITUTIONAL REPORT
            </span>
            {metrics.isLiveData ? (
              <span
                className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1 border ${
                  isDark
                    ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                LIVE DATA
              </span>
            ) : (
              <span
                className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded flex items-center gap-1 border ${
                  isDark
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500/50'
                    : 'bg-amber-100 text-amber-800 border-amber-300'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                DEMO DATA (Sample Model)
              </span>
            )}
            <span
              className={`text-xs font-mono ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Chakra_Petch',sans-serif] uppercase tracking-wide">
            Autonomous Equity Intelligence Briefing
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-copy-report"
            onClick={handleCopy}
            className={`px-3 py-2 text-xs font-mono font-semibold rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-[#06080d] text-slate-300 border-slate-700 hover:text-white hover:border-slate-500'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:text-slate-900 hover:border-slate-400'
            }`}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-500" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>

          <button
            id="btn-download-pdf"
            onClick={onDownloadPdf}
            className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 ${
              isDark
                ? 'bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                : 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-md'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD PDF REPORT</span>
          </button>

          <button
            id="btn-new-analysis"
            onClick={onNewAnalysis}
            className={`px-3 py-2 text-xs font-mono font-semibold rounded border transition-colors flex items-center gap-1.5 cursor-pointer ${
              isDark
                ? 'bg-[#10141e] text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300'
                : 'bg-slate-100 text-slate-700 border-slate-300 hover:border-cyan-600 hover:text-cyan-700'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Analysis</span>
          </button>
        </div>
      </div>

      {/* Report Body */}
      <div
        className={`space-y-6 font-mono text-xs leading-relaxed max-w-5xl ${
          isDark ? 'text-slate-300' : 'text-slate-700'
        }`}
      >
        {/* 1. Executive Summary */}
        <div
          className={`p-4 rounded border ${
            isDark
              ? 'bg-[#070a10] border-cyan-500/20'
              : 'bg-cyan-50/50 border-cyan-200'
          }`}
        >
          <div
            className={`text-[11px] font-bold uppercase tracking-wider mb-2 ${
              isDark ? 'text-cyan-400' : 'text-cyan-800'
            }`}
          >
            1. Executive Summary
          </div>
          <p
            className={`text-sm leading-relaxed ${
              isDark ? 'text-slate-200' : 'text-slate-900'
            }`}
          >
            {report.executiveSummary}
          </p>
        </div>

        {/* 2. Company Overview */}
        <div>
          <div
            className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            2. Company Overview
          </div>
          <p
            className={`p-3 rounded border ${
              isDark
                ? 'bg-[#080b12] border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {report.companyOverview}
          </p>
        </div>

        {/* 3 & 4. Market Data & KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              3. Current Market & Historical Telemetry
            </div>
            <p
              className={`p-3 rounded border whitespace-pre-line h-full ${
                isDark
                  ? 'bg-[#080b12] border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {report.historicalPricePerformance}
            </p>
          </div>

          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              4. Financial Key Performance Indicators
            </div>
            <div
              className={`p-3 rounded border whitespace-pre-line h-full font-mono text-xs ${
                isDark
                  ? 'bg-[#080b12] border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {report.financialKpis}
            </div>
          </div>
        </div>

        {/* 5. Market Research */}
        <div>
          <div
            className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            5. Market Research & Strategic Catalysts
          </div>
          <div
            className={`p-3 rounded border whitespace-pre-line ${
              isDark
                ? 'bg-[#080b12] border-slate-800 text-slate-300'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {report.marketResearch}
          </div>
        </div>

        {/* 6 & 7. Sentiment & Risk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              6. Sentiment Analysis & Perception Signals
            </div>
            <p
              className={`p-3 rounded border h-full ${
                isDark
                  ? 'bg-[#080b12] border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {report.sentimentAnalysis}
            </p>
          </div>

          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              7. Risk & Exposure Analysis
            </div>
            <p
              className={`p-3 rounded border h-full ${
                isDark
                  ? 'bg-[#080b12] border-slate-800 text-slate-300'
                  : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            >
              {report.riskAnalysis}
            </p>
          </div>
        </div>

        {/* 8. Key Observations */}
        <div>
          <div
            className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            8. Key Synthesized Observations
          </div>
          <div
            className={`space-y-1.5 p-3 rounded border ${
              isDark
                ? 'bg-[#080b12] border-slate-800'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {report.keyObservations.map((obs, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-cyan-500 font-bold">›</span>
                <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>{obs}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 9 & 10. Sources & Methodology */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              9. Data Sources & Attributions
            </div>
            <div
              className={`p-3 rounded border space-y-1 ${
                isDark
                  ? 'bg-[#080b12] border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {report.dataSources.map((src, idx) => (
                <div key={idx} className="truncate">
                  • {src}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div
              className={`text-[11px] font-bold uppercase tracking-wider mb-1.5 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              10. Autonomous Methodology
            </div>
            <p
              className={`p-3 rounded border text-[11px] ${
                isDark
                  ? 'bg-[#080b12] border-slate-800 text-slate-400'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              {report.methodology}
            </p>
          </div>
        </div>

        {/* 11. Disclaimer */}
        <div
          className={`p-3 rounded text-[11px] flex items-start gap-2 border ${
            isDark
              ? 'bg-rose-950/20 border-rose-500/30 text-rose-300/90'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold uppercase tracking-wider">
              Regulatory Compliance & Financial Disclaimer:{' '}
            </span>
            {report.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
};
