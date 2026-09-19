import { FinancialMetrics } from '../types/financial.ts';
import { fetchMarketData, calculateFinancialStats } from '../services/marketData.ts';

export async function runFinancialDataAgent(
  ticker: string,
  isDemo = false,
  simulateApiFailure = false
): Promise<FinancialMetrics> {
  if (simulateApiFailure) {
    throw new Error(
      `External market gateway connection failed (503 Service Unavailable). Live market data stream interrupted. Switch to DEMO MODE to execute the analysis with benchmark sample data.`
    );
  }
  return await fetchMarketData(ticker, isDemo);
}

export function recalculateFinancialData(
  metrics: FinancialMetrics
): FinancialMetrics {
  // Re-runs mathematical analysis from the underlying historical array
  const recomputed = calculateFinancialStats(metrics.historicalData);
  return {
    ...metrics,
    currentPrice: recomputed.currentPrice,
    change7d: recomputed.change7d,
    change30d: recomputed.change30d,
    high30d: recomputed.high30d,
    low30d: recomputed.low30d,
    volatility: recomputed.volatility,
    retrievedAt: new Date().toISOString()
  };
}
