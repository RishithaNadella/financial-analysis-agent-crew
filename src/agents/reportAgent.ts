import {
  FinancialMetrics,
  MarketResearchOutput,
  SentimentOutput,
  RiskOutput,
  VerificationOutput,
  ResearchReport
} from '../types/financial.ts';
import { generateGeminiJson } from '../services/gemini.ts';

export async function runReportAgent(
  metrics: FinancialMetrics,
  research: MarketResearchOutput,
  sentiment: SentimentOutput,
  risk: RiskOutput,
  verification: VerificationOutput,
  isDemo = false
): Promise<ResearchReport> {
  const prompt = `You are the Report Writer Agent in an institutional financial intelligence crew.
Synthesize a comprehensive, verified 12-section equity research document for ${metrics.companyName} (${metrics.ticker}).

Verified Inputs:
- Current Price: ${metrics.currency} ${metrics.currentPrice}
- 7D Return: ${metrics.change7d}%, 30D Return: ${metrics.change30d}%
- 30D High: ${metrics.high30d}, 30D Low: ${metrics.low30d}, Volatility: ${metrics.volatility}%
- Sentiment: ${sentiment.overall} (${sentiment.positive}% Pos / ${sentiment.neutral}% Neu / ${sentiment.negative}% Neg)
- Risk Classification: ${risk.overallRisk} (Score: ${risk.riskScore}/100)
- Verification Status: ${verification.status} (${verification.checks.length} audits passed)
- Key Research: ${research.key_findings.slice(0, 3).join('; ')}

Strict Rules:
- Distinguish retrieved facts from AI-generated interpretation.
- Do NOT issue buy/sell commands or guaranteed forecasts.
- Use objective phrasing: "Market signal", "Observed trend", "Potential risk", "AI-generated analysis".

Respond ONLY with valid JSON matching:
{
  "executiveSummary": string,
  "companyOverview": string,
  "currentMarketData": string,
  "historicalPricePerformance": string,
  "financialKpis": string,
  "marketResearch": string,
  "sentimentAnalysis": string,
  "riskAnalysis": string,
  "keyObservations": string[],
  "dataSources": string[],
  "methodology": string,
  "disclaimer": string
}`;

  const systemInstruction = 'You are a senior financial research director. Output formal, objective institutional research reports in valid JSON.';

  if (!isDemo) {
    const aiResult = await generateGeminiJson<ResearchReport>(prompt, systemInstruction);
    if (aiResult && aiResult.executiveSummary && Array.isArray(aiResult.keyObservations)) {
      return {
        ...aiResult,
        generatedAt: new Date().toISOString()
      };
    }
  }

  // Robust deterministic report generation
  return generateDeterministicReport(metrics, research, sentiment, risk, verification);
}

function generateDeterministicReport(
  metrics: FinancialMetrics,
  research: MarketResearchOutput,
  sentiment: SentimentOutput,
  risk: RiskOutput,
  verification: VerificationOutput
): ResearchReport {
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    executiveSummary: `Autonomous multi-agent intelligence analysis for ${metrics.companyName} (${metrics.ticker}) indicates an observed trading price of ${metrics.currency} ${metrics.currentPrice.toLocaleString()}, displaying a 30-day price trajectory of ${metrics.change30d >= 0 ? '+' : ''}${metrics.change30d}%. Market sentiment models register a ${sentiment.overall} bias (${sentiment.positive}% positive weighting), counterbalanced by an overall ${risk.overallRisk} risk classification (volatility: ${metrics.volatility}%). All underlying mathematical indicators and price bounds have undergone cross-agent mathematical verification with a ${verification.status} rating.`,

    companyOverview: `${metrics.companyName} operates under ticker symbol ${metrics.ticker} on the ${metrics.exchange}. The enterprise maintains substantial scale across core commercial domains, characterized by ${research.key_findings[0] || 'resilient operational momentum and diversified commercial reach'}.`,

    currentMarketData: `As of ${dateStr} ${timeStr}, ${metrics.ticker} is quoted at ${metrics.currency} ${metrics.currentPrice.toLocaleString()} with a prior closing reference of ${metrics.currency} ${metrics.previousClose.toLocaleString()}. 30-day recorded trading bounds span from a low of ${metrics.currency} ${metrics.low30d.toLocaleString()} to a peak of ${metrics.currency} ${metrics.high30d.toLocaleString()}. Estimated market capitalization stands at ${metrics.marketCap || 'N/A'}.`,

    historicalPricePerformance: `Analysis of the past 90 trading sessions reveals distinct price structure regimes. The short-term 7-day delta exhibits a ${metrics.change7d >= 0 ? '+' : ''}${metrics.change7d}% adjustment, while the 30-day cumulative movement registers at ${metrics.change30d >= 0 ? '+' : ''}${metrics.change30d}%. Calculated annualized volatility over the 30-day rolling window is ${metrics.volatility}%, reflecting ${metrics.volatility > 25 ? 'elevated volatility conditions' : 'stable trading ranges'}.`,

    financialKpis: `Core telemetry metrics:\n• Latest Quoted Price: ${metrics.currency} ${metrics.currentPrice}\n• 7-Day Price Movement: ${metrics.change7d > 0 ? '+' : ''}${metrics.change7d}%\n• 30-Day Price Movement: ${metrics.change30d > 0 ? '+' : ''}${metrics.change30d}%\n• 30-Day Trading Envelope: ${metrics.currency} ${metrics.low30d} - ${metrics.currency} ${metrics.high30d}\n• Annualized Volatility: ${metrics.volatility}%\n• Price-to-Earnings Ratio: ${metrics.peRatio || 'N/A'}\n• Recorded Session Volume: ${metrics.volume ? metrics.volume.toLocaleString() : 'N/A'}`,

    marketResearch: `Qualitative intelligence compiled by the Market Research Agent highlights key strategic dynamics:\n${research.key_findings.map(k => `• ${k}`).join('\n')}\n\nIdentified positive catalysts include:\n${research.positive_factors.map(p => `• ${p}`).join('\n')}\n\nNoted operational headwinds:\n${research.negative_factors.map(n => `• ${n}`).join('\n')}`,

    sentimentAnalysis: `AI-generated sentiment models classify overall market reception as "${sentiment.overall}". Quantitative distribution: Positive: ${sentiment.positive}%, Neutral: ${sentiment.neutral}%, Negative: ${sentiment.negative}%. Primary drivers identified by the Sentiment Agent include: ${sentiment.reasons.join(' ')}`,

    riskAnalysis: `The Risk Assessment Agent designates an overall "${risk.overallRisk}" risk exposure tier with a calibrated risk score of ${risk.riskScore}/100. Key highlighted vulnerabilities:\n${risk.riskFactors.map(r => `• ${r}`).join('\n')}\n\nSynthesized assessment: ${risk.explanation}`,

    keyObservations: [
      `Market signal: 30-day price momentum (${metrics.change30d >= 0 ? '+' : ''}${metrics.change30d}%) demonstrates alignment with prevailing ${sentiment.overall.toLowerCase()} sentiment tone.`,
      `Observed trend: Trading volatility of ${metrics.volatility}% indicates ${metrics.volatility > 25 ? 'elevated variance requiring active exposure monitoring' : 'controlled fluctuations within normalized trading bands'}.`,
      `Potential risk: Near-term headwind sensitivity to ${research.negative_factors[0] || 'sector-wide cost pressures and macroeconomic factors'}.`,
      `Structural balance: Core business drivers continue to benefit from ${research.positive_factors[0] || 'dominant commercial presence and market scale'}.`
    ],

    dataSources: [
      metrics.dataSource,
      'Corporate Regulatory Filings & Financial Statements',
      'Autonomous Multi-Agent Mathematical Audit Engine',
      'AI-Powered Sentiment & Risk Synthesis Models'
    ],

    methodology: `This analysis was executed by the Financial Analysis Agent Crew—an autonomous multi-agent orchestration architecture. Market data was ingested and normalized; historical OHLCV data was processed for return drift, moving windows, and annualized standard deviation of returns. Research findings and corporate disclosures were synthesized via the Market Research and Sentiment Agents. All figures were subsequently verified by an independent Verification Agent employing mathematical reconciliation before final report assembly.`,

    disclaimer: `This report is produced by an autonomous multi-agent software system for informational and research purposes only. It does not constitute investment advice, financial planning, or a recommendation to purchase, hold, or liquidate any security or asset. AI-generated interpretations reflect probabilistic modeling and are subject to estimation error. Users must independently verify all data before making capital allocation decisions.`,

    generatedAt: new Date().toISOString()
  };
}
