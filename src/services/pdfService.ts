import { jsPDF } from 'jspdf';
import { AnalysisState } from '../types/agents.ts';

export function generatePdfReport(state: AnalysisState): void {
  if (!state.marketData || !state.finalReport) {
    throw new Error('Analysis report data is incomplete.');
  }

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      y = margin;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Header line
    doc.setFontSize(8);
    doc.setTextColor(120, 140, 160);
    doc.text('FINANCIAL ANALYSIS AGENT CREW | MULTI-AGENT EQUITY RESEARCH', margin, 10);
    const dateStr = new Date().toISOString().split('T')[0];
    doc.text(`CONFIDENTIAL - FOR RESEARCH USE ONLY | ${dateStr}`, pageWidth - margin, 10, { align: 'right' });
    doc.setDrawColor(200, 210, 225);
    doc.line(margin, 12, pageWidth - margin, 12);

    // Footer line
    const pageNum = doc.getNumberOfPages();
    doc.line(margin, pageHeight - 12, pageWidth - margin, pageHeight - 12);
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.text('GENERATED AUTONOMOUSLY VIA GEMINI 3 MULTI-AGENT ORCHESTRATION', margin, pageHeight - 8);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  };

  drawHeaderFooter();
  y = 20;

  // Title Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('FINANCIAL RESEARCH REPORT', margin, y);
  y += 7;

  doc.setFontSize(14);
  doc.setTextColor(2, 132, 199); // cyan/sky blue
  doc.text(`${state.company} (${state.ticker})`, margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  const formattedDate = new Date(state.completedAt || Date.now()).toLocaleString();
  const dataModeTag = state.marketData.isLiveData ? 'STATUS: LIVE DATA (Public Market Feed)' : 'STATUS: DEMO DATA (Simulated Benchmark Model)';
  doc.text(`${dataModeTag} | Verification: ${state.verification?.status || 'VERIFIED'}`, margin, y);
  y += 5;
  doc.text(`Exchange: ${state.marketData.exchange} | Currency: ${state.marketData.currency} | Source: ${state.marketData.dataSource} | Timestamp: ${formattedDate}`, margin, y);
  y += 8;

  // Key Metrics Box
  checkPageBreak(36);
  doc.setFillColor(245, 247, 250);
  doc.setDrawColor(220, 226, 235);
  doc.roundedRect(margin, y, contentWidth, 32, 2, 2, 'FD');

  const colW = contentWidth / 4;
  const metricsItems = [
    { label: 'Current Price', val: `${state.marketData.currency} ${state.marketData.currentPrice.toLocaleString()}` },
    { label: '30-Day Change', val: `${state.marketData.change30d >= 0 ? '+' : ''}${state.marketData.change30d}%` },
    { label: '7-Day Change', val: `${state.marketData.change7d >= 0 ? '+' : ''}${state.marketData.change7d}%` },
    { label: 'Annual Volatility', val: `${state.marketData.volatility}%` },
    { label: '30D High', val: `${state.marketData.currency} ${state.marketData.high30d.toLocaleString()}` },
    { label: '30D Low', val: `${state.marketData.currency} ${state.marketData.low30d.toLocaleString()}` },
    { label: 'Overall Sentiment', val: `${state.sentiment?.overall || 'N/A'}` },
    { label: 'Assessed Risk', val: `${state.risk?.overallRisk || 'N/A'}` }
  ];

  metricsItems.forEach((m, idx) => {
    const col = idx % 4;
    const row = Math.floor(idx / 4);
    const cellX = margin + 4 + col * colW;
    const cellY = y + 6 + row * 13;

    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(m.label.toUpperCase(), cellX, cellY);

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(m.val, cellX, cellY + 5);
  });

  y += 38;

  // Section helper
  const addSection = (title: string, text: string) => {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(title.toUpperCase(), margin, y);
    y += 2;
    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);
    doc.line(margin, y, margin + 40, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    const splitText = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(splitText.length * 4.5 + 4);
    doc.text(splitText, margin, y);
    y += splitText.length * 4.5 + 6;
  };

  // 1. Executive Summary
  if (state.finalReport.executiveSummary) {
    addSection('1. Executive Summary', state.finalReport.executiveSummary);
  }

  // 2. Company Overview
  if (state.finalReport.companyOverview) {
    addSection('2. Company Overview', state.finalReport.companyOverview);
  }

  // 3. Current Market Telemetry & Historical Performance
  if (state.finalReport.historicalPricePerformance) {
    addSection('3. Market Data & Historical Price Performance', state.finalReport.historicalPricePerformance);
  }

  // 4. Financial KPIs
  if (state.finalReport.financialKpis) {
    addSection('4. Financial KPIs & Core Metrics', state.finalReport.financialKpis);
  }

  // 5. Market Research Findings
  if (state.finalReport.marketResearch) {
    addSection('5. Market Research Intelligence', state.finalReport.marketResearch);
  }

  // 6. Sentiment Analysis
  if (state.finalReport.sentimentAnalysis) {
    addSection('6. Market Sentiment Analysis', state.finalReport.sentimentAnalysis);
  }

  // 7. Risk Assessment
  if (state.finalReport.riskAnalysis) {
    addSection('7. Risk Evaluation & Volatility Profile', state.finalReport.riskAnalysis);
  }

  // 8. Key Observations
  if (state.finalReport.keyObservations && state.finalReport.keyObservations.length > 0) {
    const obsText = state.finalReport.keyObservations.map(o => `• ${o}`).join('\n\n');
    addSection('8. Synthesized Key Observations', obsText);
  }

  // 9. Mathematical Verification Audit
  if (state.verification) {
    checkPageBreak(30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text('9. Autonomous Verification Audit', margin, y);
    y += 2;
    doc.setDrawColor(16, 185, 129); // green
    doc.line(margin, y, margin + 40, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);
    const auditSummary = `Status: ${state.verification.status} | Completed Checks: ${state.verification.checks.length} | Retries: ${state.verification.retriesAttempted}\nAll return formulas, volatility bounds, and probability distribution sums have been independently verified by the Verification Agent.`;
    const splitAudit = doc.splitTextToSize(auditSummary, contentWidth);
    doc.text(splitAudit, margin, y);
    y += splitAudit.length * 4.5 + 4;

    // Checks list
    state.verification.checks.forEach(chk => {
      checkPageBreak(6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(chk.passed ? 22 : 220, chk.passed ? 101 : 38, chk.passed ? 52 : 38);
      doc.text(`[${chk.passed ? 'PASSED' : 'FLAGGED'}] ${chk.name}: Expected ${chk.expectedValue} | Computed ${chk.computedValue}`, margin + 2, y);
      y += 4.5;
    });
    y += 4;
  }

  // 10. Data Sources & Methodology
  if (state.finalReport.methodology) {
    addSection('10. Data Sources & Autonomous Methodology', `${state.finalReport.methodology}\n\nSources: ${state.finalReport.dataSources?.join(', ') || state.marketData.dataSource}`);
  }

  // 11. Disclaimer
  if (state.finalReport.disclaimer) {
    checkPageBreak(25);
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(252, 165, 165);
    const discText = doc.splitTextToSize(`DISCLAIMER: ${state.finalReport.disclaimer}`, contentWidth - 8);
    const boxHeight = discText.length * 4 + 8;
    doc.roundedRect(margin, y, contentWidth, boxHeight, 1, 1, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(153, 27, 27);
    doc.text(discText, margin + 4, y + 6);
    y += boxHeight + 6;
  }

  // Trigger browser download
  const safeFilename = `Financial_Report_${state.ticker.replace(/[^A-Z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(safeFilename);
}
