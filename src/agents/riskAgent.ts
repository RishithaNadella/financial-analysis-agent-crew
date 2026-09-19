import { FinancialMetrics, MarketResearchOutput, RiskOutput } from '../types/financial.ts';
import { generateGeminiJson } from '../services/gemini.ts';

export async function runRiskAgent(
  metrics: FinancialMetrics,
  research: MarketResearchOutput,
  isDemo = false
): Promise<RiskOutput> {
  const prompt = `You are the Risk Assessment Agent in a multi-agent financial intelligence crew.
Evaluate the risk profile for ${metrics.companyName} (${metrics.ticker}).

Quantitative Inputs:
- Current Price: ${metrics.currency} ${metrics.currentPrice}
- 30-Day Volatility (Annualized): ${metrics.volatility}%
- 30-Day Change: ${metrics.change30d}%
- 30-Day High: ${metrics.high30d}, Low: ${metrics.low30d}

Qualitative Research Identified Negative Factors:
${research.negative_factors.map(n => `- ${n}`).join('\n')}

Tasks:
1. Determine "overallRisk": strictly "Low", "Medium", or "High".
2. Assign a numerical "riskScore" from 1 (lowest risk) to 100 (extreme risk).
3. Provide 4-5 specific "riskFactors" covering volatility, sector cyclicality, competitive moat erosion, and regulatory/macro constraints.
4. Provide a 2-3 sentence technical "explanation" synthesizing the overall exposure profile.

Do NOT provide certainty or investment recommendations.

Respond ONLY with valid JSON:
{
  "overallRisk": "Low" | "Medium" | "High",
  "riskScore": number,
  "riskFactors": string[],
  "explanation": string
}`;

  const systemInstruction = 'You are a quantitative risk officer. Deliver unvarnished risk evaluations adhering strictly to non-promotional and probabilistic language.';

  if (!isDemo) {
    const aiResult = await generateGeminiJson<{
      overallRisk: 'Low' | 'Medium' | 'High';
      riskScore: number;
      riskFactors: string[];
      explanation: string;
    }>(prompt, systemInstruction);

    if (aiResult && aiResult.overallRisk && Array.isArray(aiResult.riskFactors)) {
      return {
        overallRisk: aiResult.overallRisk,
        riskScore: Math.min(100, Math.max(1, aiResult.riskScore || 50)),
        riskFactors: aiResult.riskFactors,
        explanation: aiResult.explanation || 'Risk assessment derived from prevailing volatility and research headwinds.',
        disclaimer: 'AI-generated probabilistic risk assessment. Does not imply certainty or guarantee investment outcomes.'
      };
    }
  }

  // Deterministic risk model based on volatility, drawdown, and identified headwinds
  let score = 35; // base score
  if (metrics.volatility > 40) score += 25;
  else if (metrics.volatility > 25) score += 15;
  else if (metrics.volatility < 15) score -= 10;

  if (metrics.change30d < -10) score += 18;
  else if (metrics.change30d > 15) score += 8; // rapid run-up risk

  score += Math.min(20, research.negative_factors.length * 5);
  score = Math.min(92, Math.max(14, score));

  const overallRisk: 'Low' | 'Medium' | 'High' =
    score >= 65 ? 'High' : score >= 40 ? 'Medium' : 'Low';

  const riskFactors = [
    `Annualized 30-Day Volatility is measured at ${metrics.volatility}%, indicating ${metrics.volatility > 25 ? 'elevated' : 'moderate'} short-term price variance.`,
    `Drawdown exposure: 30-day low of ${metrics.currency} ${metrics.low30d} represents a variance of ${(((metrics.currentPrice - metrics.low30d) / metrics.currentPrice) * 100).toFixed(1)}% from current levels.`,
    `Sector and competitive headwinds: ${research.negative_factors[0] || 'Ongoing margin compression and capital expenditure commitments.'}`,
    `Regulatory, macroeconomic and monetary shifts: Sensitivity to prevailing interest rate regimes and corporate financing costs.`
  ];

  return {
    overallRisk,
    riskScore: score,
    riskFactors,
    explanation: `The company presents a ${overallRisk} risk classification (Risk Score: ${score}/100), primarily driven by ${metrics.volatility > 25 ? 'heightened price volatility' : 'stable trading ranges'} and exposure to cyclical macro conditions.`,
    disclaimer: 'AI-generated probabilistic risk assessment. Does not imply certainty or guarantee investment outcomes.'
  };
}
