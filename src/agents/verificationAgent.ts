import {
  FinancialMetrics,
  MarketResearchOutput,
  SentimentOutput,
  RiskOutput,
  VerificationOutput,
  VerificationCheck
} from '../types/financial.ts';

export function runVerificationAgent(
  metrics: FinancialMetrics,
  research: MarketResearchOutput,
  sentiment: SentimentOutput,
  risk: RiskOutput,
  retriesAttempted = 0,
  forceVerificationGlitch = false // Allows demonstrating the autonomous self-healing retry flow
): VerificationOutput {
  const checks: VerificationCheck[] = [];
  const issues: string[] = [];
  const n = metrics.historicalData.length;

  // 1. Check: 30-Day Return Calculation Audit
  let expected30d = metrics.change30d;
  if (n >= 2) {
    const idx30d = Math.max(0, n - 31);
    const p30dAgo = metrics.historicalData[idx30d].price;
    if (p30dAgo > 0) {
      expected30d = Number((((metrics.currentPrice - p30dAgo) / p30dAgo) * 100).toFixed(2));
    }
  }

  // If forced glitch on attempt 0 (for competition demo demonstration), inject a deliberate discrepancy
  const tested30d = (forceVerificationGlitch && retriesAttempted === 0)
    ? Number((metrics.change30d + 2.45).toFixed(2))
    : metrics.change30d;

  const diff30d = Math.abs(expected30d - tested30d);
  const pass30d = diff30d <= 0.25;

  checks.push({
    id: 'CHK-01-RET30D',
    name: '30-Day Return Formula Verification',
    expectedValue: `${expected30d > 0 ? '+' : ''}${expected30d}%`,
    computedValue: `${tested30d > 0 ? '+' : ''}${tested30d}%`,
    passed: pass30d,
    notes: pass30d
      ? `Within mathematical tolerance (variance: ${diff30d.toFixed(3)}%)`
      : `Discrepancy detected: variance ${diff30d.toFixed(2)}% exceeds 0.25% threshold.`
  });

  if (!pass30d) {
    issues.push(`30-day price change (${tested30d}%) does not match historical series basis (${expected30d}%).`);
  }

  // 2. Check: 7-Day Return Calculation Audit
  let expected7d = metrics.change7d;
  if (n >= 2) {
    const idx7d = Math.max(0, n - 8);
    const p7dAgo = metrics.historicalData[idx7d].price;
    if (p7dAgo > 0) {
      expected7d = Number((((metrics.currentPrice - p7dAgo) / p7dAgo) * 100).toFixed(2));
    }
  }
  const diff7d = Math.abs(expected7d - metrics.change7d);
  const pass7d = diff7d <= 0.25;

  checks.push({
    id: 'CHK-02-RET7D',
    name: '7-Day Return Formula Verification',
    expectedValue: `${expected7d > 0 ? '+' : ''}${expected7d}%`,
    computedValue: `${metrics.change7d > 0 ? '+' : ''}${metrics.change7d}%`,
    passed: pass7d,
    notes: pass7d
      ? `Within mathematical tolerance (variance: ${diff7d.toFixed(3)}%)`
      : `Discrepancy detected: variance ${diff7d.toFixed(2)}%.`
  });

  if (!pass7d) {
    issues.push(`7-day price change (${metrics.change7d}%) deviates from underlying price series.`);
  }

  // 3. Check: 30-Day High / Low Boundary Envelope
  const highValid = metrics.high30d >= metrics.currentPrice - 0.05;
  const lowValid = metrics.low30d <= metrics.currentPrice + 0.05;
  const passEnvelope = highValid && lowValid;

  checks.push({
    id: 'CHK-03-ENV',
    name: '30-Day High/Low Envelope Integrity',
    expectedValue: `High >= ${metrics.currentPrice} & Low <= ${metrics.currentPrice}`,
    computedValue: `High: ${metrics.high30d}, Low: ${metrics.low30d}`,
    passed: passEnvelope,
    notes: passEnvelope
      ? 'Current price correctly bounded within [Low30D, High30D] interval.'
      : 'Boundary violation: Current price falls outside 30D extremes.'
  });

  if (!passEnvelope) {
    issues.push('Current market price violates 30-day recorded boundary envelope.');
  }

  // 4. Check: Annualized Volatility
  const passVol = typeof metrics.volatility === 'number' && !isNaN(metrics.volatility) && metrics.volatility >= 0 && metrics.volatility < 250;
  checks.push({
    id: 'CHK-04-VOL',
    name: 'Volatility Standard Deviation Validation',
    expectedValue: '0% <= Vol <= 250%',
    computedValue: `${metrics.volatility}%`,
    passed: passVol,
    notes: passVol ? 'Volatility metric satisfies non-negative dispersion bounds.' : 'Invalid volatility scalar.'
  });
  if (!passVol) issues.push('Annualized volatility metric is malformed or out of bounds.');

  // 5. Check: Sentiment Probability Mass Conservation
  const sentimentSum = sentiment.positive + sentiment.neutral + sentiment.negative;
  const passSentiment = sentimentSum >= 99 && sentimentSum <= 101;
  checks.push({
    id: 'CHK-05-SNT',
    name: 'Sentiment Distribution Sum Check',
    expectedValue: '100%',
    computedValue: `${sentimentSum}% (${sentiment.positive}/${sentiment.neutral}/${sentiment.negative})`,
    passed: passSentiment,
    notes: passSentiment ? 'Probabilities strictly conserve unitary distribution.' : 'Probability distribution sum discrepancy.'
  });
  if (!passSentiment) issues.push('Sentiment distribution does not equal 100%.');

  // 6. Check: Risk Score Monotonicity with Classification
  let passRisk = true;
  if (risk.overallRisk === 'High' && risk.riskScore < 50) passRisk = false;
  if (risk.overallRisk === 'Low' && risk.riskScore > 50) passRisk = false;

  checks.push({
    id: 'CHK-06-RSK',
    name: 'Risk Score & Classification Alignment',
    expectedValue: `${risk.overallRisk} requires commensurate score`,
    computedValue: `Score ${risk.riskScore}/100 [${risk.overallRisk}]`,
    passed: passRisk,
    notes: passRisk ? 'Risk categorization matches calibrated score.' : 'Divergence between risk tier and numerical score.'
  });
  if (!passRisk) issues.push('Risk tier designation conflicts with numerical risk score.');

  // Final status evaluation
  const allPassed = checks.every(c => c.passed);

  return {
    status: allPassed ? 'VERIFIED' : 'RETRY_REQUIRED',
    issues,
    checks,
    timestamp: new Date().toISOString(),
    retriesAttempted
  };
}
