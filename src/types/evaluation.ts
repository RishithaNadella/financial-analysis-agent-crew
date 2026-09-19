export type SentimentLabel = 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
export type RiskLabel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SentimentBenchmarkCase {
  id: string;
  statement: string;
  sourceContext: string;
  expected: SentimentLabel;
  difficulty: 'standard' | 'ambiguous' | 'stress_test';
}

export interface RiskBenchmarkCase {
  id: string;
  scenario: string;
  companyProfile: string;
  currentPrice: number;
  volatility: number;
  change30d: number;
  negativeFactors: string[];
  expected: RiskLabel;
  rationale: string;
}

export interface VerificationBenchmarkCase {
  id: string;
  name: string;
  checkType: 'RETURN_30D' | 'RETURN_7D' | 'BOUNDARY_ENVELOPE' | 'VOLATILITY_BOUND' | 'PROBABILITY_MASS' | 'RISK_MONOTONICITY';
  description: string;
  expectedValue: string | number;
  testedValue: string | number;
  shouldPass: boolean;
  expectedFlagReason?: string;
}

export interface FinancialCalculationCase {
  id: string;
  name: string;
  formulaDescription: string;
  referenceInput: {
    currentPrice: number;
    price7dAgo?: number;
    price30dAgo?: number;
    historicalSeries: number[];
  };
  expectedResult: number;
  tolerance: number; // e.g., 0.05
  unit: string;
}

export interface ClassPerformance {
  label: string;
  support: number;
  truePositives: number;
  falsePositives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1: number;
}

export interface ClassificationMetrics {
  agentName: string;
  totalCases: number;
  correctCases: number;
  accuracy: number; // 0 - 100 percentage
  macroPrecision: number;
  macroRecall: number;
  macroF1: number;
  averagingMethod: 'Macro-Averaged (Equal class weighting)';
  perClass: Record<string, ClassPerformance>;
  confusionMatrix: {
    labels: string[];
    matrix: number[][]; // [actualIdx][predictedIdx]
  };
}

export interface VerificationEvaluationMetrics {
  agentName: string;
  totalCases: number;
  correctDetections: number;
  detectionRate: number; // 0 - 100 percentage
  truePasses: number;
  trueCatches: number; // correctly identified failure
  falsePasses: number; // missed an error (critical defect)
  falseFlags: number; // false alarm
}

export interface FinancialValidationMetrics {
  totalCases: number;
  passedCases: number;
  failedCases: number;
  passRate: number; // 0 - 100 percentage
  maxObservedVariance: number;
  toleranceThreshold: string;
}

export interface EvaluatedCaseDetail {
  id: string;
  suite: 'Sentiment' | 'Risk' | 'Verification' | 'Financial Validation';
  testInput: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'PASSED' | 'FAILED';
  varianceOrReason: string;
}

export interface FullEvaluationSuiteResult {
  timestamp: string;
  status: 'idle' | 'running' | 'completed';
  overallScore: number | null; // e.g. 92.4
  overallScoreFormula: string;
  sentimentMetrics: ClassificationMetrics | null;
  riskMetrics: ClassificationMetrics | null;
  verificationMetrics: VerificationEvaluationMetrics | null;
  financialMetrics: FinancialValidationMetrics | null;
  caseDetails: EvaluatedCaseDetail[];
  executionLogs: string[];
}
