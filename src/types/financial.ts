export interface HistoricalDataPoint {
  date: string;
  price: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface FinancialMetrics {
  ticker: string;
  companyName: string;
  currency: string;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  change7d: number;
  change30d: number;
  high30d: number;
  low30d: number;
  volatility: number; // annualized volatility percentage e.g. 24.5%
  peRatio?: number;
  marketCap?: string;
  volume?: number;
  avgVolume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  dataSource: string;
  retrievedAt: string;
  isLiveData: boolean;
  historicalData: HistoricalDataPoint[];
}

export interface MarketResearchOutput {
  key_findings: string[];
  positive_factors: string[];
  negative_factors: string[];
  important_events: string[];
  sources: { title: string; source: string; date?: string; url?: string }[];
}

export interface SentimentOutput {
  positive: number; // percentage e.g. 65
  neutral: number;  // percentage e.g. 20
  negative: number; // percentage e.g. 15
  overall: 'Positive' | 'Neutral' | 'Negative';
  reasons: string[];
  isAiGenerated: boolean;
}

export interface RiskOutput {
  overallRisk: 'Low' | 'Medium' | 'High';
  riskScore: number; // 1-100 scale
  riskFactors: string[];
  explanation: string;
  disclaimer: string;
}

export interface VerificationCheck {
  id: string;
  name: string;
  expectedValue: string | number;
  computedValue: string | number;
  passed: boolean;
  notes: string;
}

export interface VerificationOutput {
  status: 'VERIFIED' | 'RETRY_REQUIRED';
  issues: string[];
  checks: VerificationCheck[];
  timestamp: string;
  retriesAttempted: number;
}

export interface ResearchReport {
  executiveSummary: string;
  companyOverview: string;
  currentMarketData: string;
  historicalPricePerformance: string;
  financialKpis: string;
  marketResearch: string;
  sentimentAnalysis: string;
  riskAnalysis: string;
  keyObservations: string[];
  dataSources: string[];
  methodology: string;
  disclaimer: string;
  generatedAt: string;
}
