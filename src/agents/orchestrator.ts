import {
  AgentId,
  AgentInfo,
  AgentLogEvent,
  AnalysisState
} from '../types/agents.ts';
import { runResearchAgent } from './researchAgent.ts';
import { runFinancialDataAgent, recalculateFinancialData } from './financialDataAgent.ts';
import { runSentimentAgent } from './sentimentAgent.ts';
import { runRiskAgent } from './riskAgent.ts';
import { runVerificationAgent } from './verificationAgent.ts';
import { runReportAgent } from './reportAgent.ts';
import { resolveTicker, resolveCompanyOrTicker } from '../services/marketData.ts';

export type OrchestratorCallback = (
  event: AgentLogEvent,
  stateSnapshot: AnalysisState
) => void;

export function createInitialState(companyInput: string, isDemo = false): AnalysisState {
  const meta = resolveTicker(companyInput);

  const agents: Record<AgentId, AgentInfo> = {
    orchestrator: {
      id: 'orchestrator',
      name: 'Orchestrator',
      role: 'Workflow Manager & Task Coordinator',
      status: 'WAITING',
      iconName: 'Cpu'
    },
    research: {
      id: 'research',
      name: 'Market Research Agent',
      role: 'Public Disclosures & News Intelligence',
      status: 'WAITING',
      iconName: 'Search'
    },
    financialData: {
      id: 'financialData',
      name: 'Financial Data Agent',
      role: 'Real-Time Price & Volatility Calculation',
      status: 'WAITING',
      iconName: 'TrendingUp'
    },
    sentiment: {
      id: 'sentiment',
      name: 'Sentiment Agent',
      role: 'Market Sentiment & Signal Classification',
      status: 'WAITING',
      iconName: 'Activity'
    },
    risk: {
      id: 'risk',
      name: 'Risk Agent',
      role: 'Volatility & Drawdown Risk Evaluation',
      status: 'WAITING',
      iconName: 'ShieldAlert'
    },
    verification: {
      id: 'verification',
      name: 'Verification Agent',
      role: 'Mathematical Audit & Consistency Reconciliation',
      status: 'WAITING',
      iconName: 'CheckCheck'
    },
    reportWriter: {
      id: 'reportWriter',
      name: 'Report Writer Agent',
      role: 'Synthesis of Institutional Research Report',
      status: 'WAITING',
      iconName: 'FileText'
    }
  };

  return {
    company: meta.name,
    ticker: meta.ticker,
    isDemo,
    stage: 'idle',
    agents,
    events: [],
    marketData: null,
    research: null,
    sentiment: null,
    risk: null,
    verification: null,
    finalReport: null,
    startedAt: null,
    completedAt: null
  };
}

export async function runOrchestrator(
  companyInput: string,
  isDemo = false,
  onUpdate?: OrchestratorCallback,
  simulateVerificationRetry = false,
  simulateApiFailure = false
): Promise<AnalysisState> {
  const state = createInitialState(companyInput, isDemo);
  state.startedAt = new Date().toISOString();
  state.stage = 'running';

  const emit = (
    agentId: AgentId | 'system',
    message: string,
    level: AgentLogEvent['level'] = 'info',
    payloadSummary?: string
  ) => {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
    const agentName = agentId === 'system' ? 'System' : state.agents[agentId]?.name || 'Agent';
    const evt: AgentLogEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp,
      agentId,
      agentName,
      message,
      level,
      payloadSummary
    };
    state.events.push(evt);
    if (onUpdate) {
      onUpdate(evt, { ...state });
    }
  };

  const updateAgentStatus = (agentId: AgentId, status: AgentInfo['status'], details?: string) => {
    state.agents[agentId] = {
      ...state.agents[agentId],
      status,
      details,
      startedAt: status === 'RUNNING' ? new Date().toISOString() : state.agents[agentId].startedAt,
      completedAt: status === 'COMPLETED' ? new Date().toISOString() : undefined
    };
  };

  try {
    // 1. Orchestrator initialization
    updateAgentStatus('orchestrator', 'RUNNING', 'Resolving target company and exchange ticker...');
    emit('orchestrator', `Task received: Initialize analysis for "${companyInput}"`);

    if (!isDemo) {
      const resolved = await resolveCompanyOrTicker(companyInput);
      if (!resolved) {
        throw new Error('Company or ticker not found. Please enter a valid company name or ticker.');
      }
      state.company = resolved.name;
      state.ticker = resolved.ticker;
    } else {
      const meta = resolveTicker(companyInput);
      state.company = meta.name;
      state.ticker = meta.ticker;
    }

    emit('orchestrator', `Target verified: "${state.company}" [Ticker: ${state.ticker}]`);
    emit('orchestrator', `Mode: ${isDemo ? 'DEMO DATA (Simulated Benchmark Dataset)' : 'LIVE MARKET DATA (Public Exchange Feed)'}`);
    emit('orchestrator', `Analysis Plan created: Dispatched parallel gathering -> [Market Research] & [Financial Data]`);

    // 2. Parallel Execution of Market Research Agent & Financial Data Agent
    updateAgentStatus('research', 'RUNNING', 'Collecting market disclosures & current news');
    updateAgentStatus('financialData', 'RUNNING', 'Ingesting quotes & computing financial telemetry');
    emit('research', `Collecting recent corporate disclosures, news, and market events for ${state.ticker}...`);
    emit('financialData', isDemo ? `Loading benchmark financial dataset for ${state.ticker}...` : `Querying public market feed for ${state.ticker}...`);

    let researchResult;
    let marketDataResult;

    try {
      [researchResult, marketDataResult] = await Promise.all([
        runResearchAgent(state.company, state.ticker, isDemo),
        runFinancialDataAgent(state.ticker, isDemo, simulateApiFailure)
      ]);
    } catch (dataErr: any) {
      updateAgentStatus('financialData', 'FAILED', dataErr.message);
      emit('financialData', `Data extraction aborted: ${dataErr.message}`, 'error');
      throw dataErr;
    }

    state.research = researchResult;
    state.marketData = marketDataResult;
    state.company = marketDataResult.companyName || state.company;
    state.ticker = marketDataResult.ticker || state.ticker;
    updateAgentStatus('research', 'COMPLETED', `Identified ${researchResult.key_findings.length} findings, ${researchResult.positive_factors.length} catalysts`);
    emit('research', `Intelligence gathering complete. Found ${researchResult.key_findings.length} structural findings and ${researchResult.sources.length} sources.`, 'success');

    const dataTag = marketDataResult.isLiveData ? 'LIVE DATA' : 'DEMO DATA';
    updateAgentStatus('financialData', 'COMPLETED', `[${dataTag}] Price: ${marketDataResult.currency} ${marketDataResult.currentPrice} | 30D: ${marketDataResult.change30d}%`);
    emit('financialData', `Metrics calculated [${dataTag}]: Price ${marketDataResult.currency} ${marketDataResult.currentPrice}, 30D Change: ${marketDataResult.change30d}%, Volatility: ${marketDataResult.volatility}% (${marketDataResult.dataSource})`, 'success', `Historical samples: ${marketDataResult.historicalData.length} sessions`);

    // 3. Parallel Execution of Sentiment Agent & Risk Agent
    emit('orchestrator', `Data ingested successfully. Spawning [Sentiment Agent] and [Risk Agent] in parallel...`);
    updateAgentStatus('sentiment', 'RUNNING', 'Analyzing signals from research & price momentum');
    updateAgentStatus('risk', 'RUNNING', 'Evaluating volatility, drawdown, and structural risk factors');

    emit('sentiment', `Evaluating positive/negative balance and market tone...`);
    emit('risk', `Calculating risk score across volatility (${marketDataResult.volatility}%) and operational headwinds...`);

    const [sentimentResult, riskResult] = await Promise.all([
      runSentimentAgent(researchResult, state.company, state.ticker, marketDataResult.change30d, isDemo),
      runRiskAgent(marketDataResult, researchResult, isDemo)
    ]);

    state.sentiment = sentimentResult;
    updateAgentStatus('sentiment', 'COMPLETED', `Overall: ${sentimentResult.overall} (${sentimentResult.positive}% Pos / ${sentimentResult.negative}% Neg)`);
    emit('sentiment', `Sentiment analyzed: "${sentimentResult.overall}" (${sentimentResult.positive}% positive bias). Agent signal classified.`, 'success');

    state.risk = riskResult;
    updateAgentStatus('risk', 'COMPLETED', `Overall Risk: ${riskResult.overallRisk} (Score: ${riskResult.riskScore}/100)`);
    emit('risk', `Risk profile calculated: ${riskResult.overallRisk} risk (Risk Score: ${riskResult.riskScore}/100).`, 'success');

    // 4. Verification Agent Execution (Critical component with real mathematical validation & retry)
    emit('orchestrator', `Passing all agent deliverables to [Verification Agent] for mathematical and logical cross-check.`);
    updateAgentStatus('verification', 'RUNNING', 'Auditing calculations, return formulas, and boundary envelopes');
    emit('verification', `Beginning cross-agent validation: auditing 30D return math, 7D return math, and extreme bounds...`);

    let verificationResult = runVerificationAgent(
      state.marketData,
      state.research,
      state.sentiment,
      state.risk,
      0,
      simulateVerificationRetry
    );

    // If verification detects an issue or requests recalculation
    if (verificationResult.status === 'RETRY_REQUIRED') {
      updateAgentStatus('verification', 'RETRYING', `Validation check failed: ${verificationResult.issues[0] || 'Mathematical discrepancy'}`);
      emit('verification', `AUDIT DISCREPANCY DETECTED: ${verificationResult.issues.join('; ')}`, 'warn');
      emit('verification', `STATUS: RETRY_REQUIRED. Requesting Financial Data Agent to perform mathematical recalculation...`, 'retry');

      updateAgentStatus('financialData', 'RETRYING', 'Recomputing return formulas from historical series');
      emit('financialData', `Recalculating price series metrics directly from raw quotes...`);

      // Re-run financial data recalculation
      state.marketData = recalculateFinancialData(state.marketData);
      updateAgentStatus('financialData', 'COMPLETED', `Recalculated: 30D Return reconciled to ${state.marketData.change30d}%`);
      emit('financialData', `Recalculation complete. Synchronized values returned to Verification Agent.`, 'success');

      // Re-run verification without glitch
      emit('verification', `Re-evaluating mathematical consistency on updated payload...`);
      verificationResult = runVerificationAgent(
        state.marketData,
        state.research,
        state.sentiment,
        state.risk,
        1,
        false
      );
    }

    state.verification = verificationResult;
    if (verificationResult.status === 'VERIFIED') {
      updateAgentStatus('verification', 'COMPLETED', `All ${verificationResult.checks.length} audits passed successfully`);
      emit('verification', `STATUS: VERIFIED. All ${verificationResult.checks.length} mathematical and logical audits passed without discrepancy.`, 'success');
    } else {
      updateAgentStatus('verification', 'FAILED', 'Verification checks failed');
      emit('verification', `Verification failed after retry: ${verificationResult.issues.join(', ')}`, 'error');
    }

    // 5. Report Writer Agent (Only run after verification succeeds)
    if (verificationResult.status === 'VERIFIED') {
      emit('orchestrator', `Verification audit succeeded. Dispatching [Report Writer Agent] to author 12-section research report...`);
      updateAgentStatus('reportWriter', 'RUNNING', 'Drafting verified executive report');
      emit('reportWriter', `Synthesizing 12-section equity research document with facts, sentiment, and risk disclaimer...`);

      const reportResult = await runReportAgent(
        state.marketData,
        state.research,
        state.sentiment,
        state.risk,
        verificationResult,
        isDemo
      );

      state.finalReport = reportResult;
      updateAgentStatus('reportWriter', 'COMPLETED', 'Generated 12-section institutional research report');
      emit('reportWriter', `Institutional report generated with executive summary, KPIs, and compliance disclaimers.`, 'success');
    } else {
      emit('reportWriter', `Report synthesis blocked due to unverified calculation state.`, 'warn');
    }

    // 6. Final Orchestration Wrap-up
    updateAgentStatus('orchestrator', 'COMPLETED', 'Workflow finished successfully');
    state.completedAt = new Date().toISOString();
    state.stage = 'completed';
    emit('system', `Multi-agent analysis cycle complete for ${state.company} [${state.ticker}]. Terminal ready.`, 'success');

    return state;
  } catch (err: any) {
    console.error('Orchestrator execution error:', err);
    state.stage = 'error';
    state.errorMessage = err.message || 'An unexpected error occurred during agent orchestration';
    updateAgentStatus('orchestrator', 'FAILED', state.errorMessage);
    emit('system', `Execution interrupted: ${state.errorMessage}`, 'error');
    if (onUpdate) {
      onUpdate(
        {
          id: `evt-err-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
          agentId: 'system',
          agentName: 'System',
          message: `Execution stopped: ${state.errorMessage}`,
          level: 'error'
        },
        { ...state }
      );
    }
    return state;
  }
}
