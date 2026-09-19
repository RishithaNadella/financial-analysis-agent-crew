import {
  FinancialMetrics,
  MarketResearchOutput,
  SentimentOutput,
  RiskOutput,
  VerificationOutput,
  ResearchReport
} from './financial.ts';

export type AgentId = 
  | 'orchestrator'
  | 'research'
  | 'financialData'
  | 'sentiment'
  | 'risk'
  | 'verification'
  | 'reportWriter';

export type AgentStatus = 'WAITING' | 'RUNNING' | 'COMPLETED' | 'RETRYING' | 'FAILED';

export interface AgentInfo {
  id: AgentId;
  name: string;
  role: string;
  status: AgentStatus;
  startedAt?: string;
  completedAt?: string;
  details?: string;
  iconName: string;
}

export interface AgentLogEvent {
  id: string;
  timestamp: string;
  agentId: AgentId | 'system';
  agentName: string;
  message: string;
  level: 'info' | 'warn' | 'success' | 'error' | 'retry';
  payloadSummary?: string;
}

export interface AnalysisState {
  company: string;
  ticker: string;
  isDemo: boolean;
  stage: 'idle' | 'running' | 'completed' | 'error';
  errorMessage?: string;
  agents: Record<AgentId, AgentInfo>;
  events: AgentLogEvent[];
  marketData: FinancialMetrics | null;
  research: MarketResearchOutput | null;
  sentiment: SentimentOutput | null;
  risk: RiskOutput | null;
  verification: VerificationOutput | null;
  finalReport: ResearchReport | null;
  startedAt: string | null;
  completedAt: string | null;
}
