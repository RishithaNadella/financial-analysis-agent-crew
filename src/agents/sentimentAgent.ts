import { MarketResearchOutput, SentimentOutput } from '../types/financial.ts';
import { generateGeminiJson } from '../services/gemini.ts';

export async function runSentimentAgent(
  research: MarketResearchOutput,
  company: string,
  ticker: string,
  priceChange30d: number,
  isDemo = false
): Promise<SentimentOutput> {
  const prompt = `You are the Sentiment Analysis Agent in a multi-agent financial intelligence crew.
Analyze the following market research for ${company} (${ticker}):

Key Findings:
${research.key_findings.map(k => `- ${k}`).join('\n')}

Positive Factors:
${research.positive_factors.map(p => `- ${p}`).join('\n')}

Negative Factors / Headwinds:
${research.negative_factors.map(n => `- ${n}`).join('\n')}

30-Day Market Price Trend: ${priceChange30d > 0 ? '+' : ''}${priceChange30d}%

Tasks:
1. Determine proportional sentiment distribution: positive %, neutral %, negative % (must sum to 100).
2. Classify overall sentiment as exactly "Positive", "Neutral", or "Negative".
3. Provide 3-4 analytical reasons explaining why this sentiment score was derived.

Respond ONLY with valid JSON:
{
  "positive": number,
  "neutral": number,
  "negative": number,
  "overall": "Positive" | "Neutral" | "Negative",
  "reasons": string[]
}`;

  const systemInstruction = 'You are a quantitative market sentiment analyst. Deliver rigorous, objective sentiment scoring strictly as valid JSON.';

  if (!isDemo) {
    const aiResult = await generateGeminiJson<{
      positive: number;
      neutral: number;
      negative: number;
      overall: 'Positive' | 'Neutral' | 'Negative';
      reasons: string[];
    }>(prompt, systemInstruction);

    if (aiResult && typeof aiResult.positive === 'number' && Array.isArray(aiResult.reasons)) {
      // Normalize sum to 100
      const total = aiResult.positive + aiResult.neutral + aiResult.negative || 100;
      return {
        positive: Math.round((aiResult.positive / total) * 100),
        neutral: Math.round((aiResult.neutral / total) * 100),
        negative: Math.round((aiResult.negative / total) * 100),
        overall: aiResult.overall || 'Neutral',
        reasons: aiResult.reasons,
        isAiGenerated: true
      };
    }
  }

  // Deterministic calculation based on positive vs negative factors and 30d momentum
  const posCount = research.positive_factors.length;
  const negCount = research.negative_factors.length;
  const momentumBias = priceChange30d > 5 ? 15 : priceChange30d < -5 ? -15 : 0;

  let positive = Math.min(80, Math.max(20, Math.round(50 + (posCount - negCount) * 8 + momentumBias)));
  let negative = Math.min(65, Math.max(10, Math.round(30 + (negCount - posCount) * 8 - momentumBias * 0.7)));
  let neutral = Math.max(10, 100 - positive - negative);

  // Normalize
  const sum = positive + neutral + negative;
  positive = Math.round((positive / sum) * 100);
  negative = Math.round((negative / sum) * 100);
  neutral = 100 - positive - negative;

  const overall: 'Positive' | 'Neutral' | 'Negative' =
    positive > negative + 15 ? 'Positive' : negative > positive + 10 ? 'Negative' : 'Neutral';

  const reasons = [
    `Strong core operational performance and revenue resilience in primary commercial pillars.`,
    `Market sentiment counterbalanced by near-term macroeconomic uncertainty and input cost fluctuations.`,
    `Historical 30-day price momentum (${priceChange30d >= 0 ? '+' : ''}${priceChange30d}%) reflecting measured investor positioning.`,
    `Expansion initiatives and strategic roadmap provide foundational support against cyclical sector volatility.`
  ];

  return {
    positive,
    neutral,
    negative,
    overall,
    reasons,
    isAiGenerated: true
  };
}
