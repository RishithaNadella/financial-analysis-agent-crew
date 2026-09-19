import {
  SentimentBenchmarkCase,
  RiskBenchmarkCase,
  VerificationBenchmarkCase,
  FinancialCalculationCase
} from '../types/evaluation.ts';

/**
 * EVALUATION BENCHMARK DATASET
 * 
 * Controlled, reproducible test cases for evaluating individual agent accuracy,
 * classification performance, mathematical precision, and verification catch rates.
 * NOT LIVE MARKET DATA.
 */

export const SENTIMENT_BENCHMARK_CASES: SentimentBenchmarkCase[] = [
  // POSITIVE Cases (10 cases)
  {
    id: 'SNT-01',
    statement: 'Q3 consolidated net profit expands 34.2% YoY, beating consensus estimates across banking and digital segments.',
    sourceContext: 'Quarterly Earnings Release',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-02',
    statement: 'Enterprise cloud transformation division secures $520M multi-year renewal mandate with European banking consortium.',
    sourceContext: 'Commercial Contract Disclosure',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-03',
    statement: 'Operating margins widen by 210 bps due to automation efficiencies and favorable product mix.',
    sourceContext: 'Management Discussion & Analysis',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-04',
    statement: 'Free cash flow conversion reaches 94% of EBITDA, enabling board approval for special dividend and share buyback.',
    sourceContext: 'Capital Allocation Filing',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-05',
    statement: 'Regulator grants unconditional commercialization approval for flagship clean energy storage facility.',
    sourceContext: 'Statutory Regulatory Gazette',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-06',
    statement: 'Brokerage upgrades credit rating to Investment Grade with Positive outlook on debt reduction trajectory.',
    sourceContext: 'Rating Agency Bulletin',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-07',
    statement: 'Domestic retail footfall and average order value surge 19% following omnichannel expansion in tier-2 cities.',
    sourceContext: 'Retail Operations Update',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-08',
    statement: 'Gross additions hit all-time high of 8.4 million subscribers while monthly subscriber churn drops to 1.1%.',
    sourceContext: 'Telecom Operations Dispatch',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-09',
    statement: 'Strategic silicon joint venture onboards hyperscaler customer with $1.2B guaranteed purchase commitment.',
    sourceContext: 'Partnership Announcement',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-10',
    statement: 'Export volumes surge 26% as international trade tariffs normalize in core North American market.',
    sourceContext: 'Trade & Logistics Monitor',
    expected: 'POSITIVE',
    difficulty: 'standard'
  },

  // NEUTRAL Cases (10 cases)
  {
    id: 'SNT-11',
    statement: 'Consolidated revenue for the quarter totaled ₹89,450 Cr, tracking in line with previous management guidance (+0.4% variance).',
    sourceContext: 'Quarterly Financial Dispatch',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-12',
    statement: 'Reserve Bank keeps benchmark policy repo rate unchanged at 6.50% during bi-monthly monetary policy committee review.',
    sourceContext: 'Monetary Policy Release',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-13',
    statement: 'Board convenes annual general meeting to review routine auditor re-appointment and corporate governance bylaws.',
    sourceContext: 'Stock Exchange Filing',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-14',
    statement: 'Scheduled 14-day preventative maintenance shutdown completed at secondary petrochemical processing unit on budget.',
    sourceContext: 'Operational Exchange Notice',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-15',
    statement: 'Market share in mid-tier passenger vehicles remained steady at 22.8% throughout the rolling 12-month period.',
    sourceContext: 'Industry Benchmark Tracker',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-16',
    statement: 'Foreign exchange translations produced a neutral net impact as dollar strength balanced euro depreciation.',
    sourceContext: 'Treasury Review',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-17',
    statement: 'Chief Information Officer announces planned retirement effective end of fiscal year with internal successor designated.',
    sourceContext: 'Executive Transition Notice',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-18',
    statement: 'Company completes relocation of administrative regional back-office support hub within planned budgetary provisions.',
    sourceContext: 'Administrative Briefing',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-19',
    statement: 'Raw material inventory buffers were re-aligned to 45 days consumption from 48 days to match seasonal cycle.',
    sourceContext: 'Supply Chain Operations Note',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },
  {
    id: 'SNT-20',
    statement: 'Corporate debt maturity schedule shows weighted average duration maintained at 4.6 years with stable fixed-rate debt ratio.',
    sourceContext: 'Treasury Disclosures',
    expected: 'NEUTRAL',
    difficulty: 'standard'
  },

  // NEGATIVE Cases (10 cases)
  {
    id: 'SNT-21',
    statement: 'Operating margins contract 380 bps as crude derivative input prices spike and pricing pass-through remains lagged.',
    sourceContext: 'Financial Performance Review',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-22',
    statement: 'Competition commission initiates formal antitrust inquiry into exclusive distribution contracts in regional retail.',
    sourceContext: 'Regulatory Enforcement Dispatch',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-23',
    statement: 'Full-year forward EBITDA forecast revised downward by 14% due to protracted slowdown in European automotive demand.',
    sourceContext: 'Management Guidance Revision',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-24',
    statement: 'Unplanned equipment malfunction at primary refining cracker leads to estimated 3-week production outage.',
    sourceContext: 'Unscheduled Material Event',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-25',
    statement: 'Credit rating agency downgrades commercial paper to Negative watch citing working capital deterioration.',
    sourceContext: 'Credit Agency Warning',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-26',
    statement: 'High-profile enterprise software deal valued at $180M terminated early following client budget restructuring.',
    sourceContext: 'Contract Cancellation Filing',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-27',
    statement: 'Environmental protection authority issues formal notice of non-compliance and orders temporary stoppage at coastal unit.',
    sourceContext: 'Statutory Notice',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  {
    id: 'SNT-28',
    statement: 'Customer acquisition cost spikes 42% in digital financial vertical amidst aggressive price undercutting by competitors.',
    sourceContext: 'Investor Presentation MD&A',
    expected: 'NEGATIVE',
    difficulty: 'standard'
  },
  // Ambiguous edge cases that challenge sentiment boundaries
  {
    id: 'SNT-29',
    statement: 'Company books one-time restructuring impairment of $65M to shutter redundant legacy facilities, while recurring operations met guidance.',
    sourceContext: 'Extraordinary Charges Note',
    expected: 'NEGATIVE',
    difficulty: 'ambiguous'
  },
  {
    id: 'SNT-30',
    statement: 'Gross revenue grew 8% YoY but fell 1.5% below high analyst consensus expectations due to component delivery timing.',
    sourceContext: 'Market Commentary',
    expected: 'NEUTRAL',
    difficulty: 'ambiguous'
  }
];

export const RISK_BENCHMARK_CASES: RiskBenchmarkCase[] = [
  // LOW Risk Cases (7 cases)
  {
    id: 'RSK-01',
    scenario: 'Regulated utility with long-term sovereign power-purchase agreements and steady rate base returns.',
    companyProfile: 'National Transmission Grid Corporation',
    currentPrice: 320.0,
    volatility: 11.2,
    change30d: 1.8,
    negativeFactors: [],
    expected: 'LOW',
    rationale: 'Sub-15% volatility, positive capital return, zero severe operational headwinds.'
  },
  {
    id: 'RSK-02',
    scenario: 'Blue-chip consumer staples conglomerate with strong brand pricing power and net cash balance sheet.',
    companyProfile: 'Tier-1 FMCG Consumer Brand',
    currentPrice: 2450.0,
    volatility: 13.5,
    change30d: 3.2,
    negativeFactors: ['Minor raw agri-commodity input price inflation'],
    expected: 'LOW',
    rationale: 'Defensive demand profile, minimal volatility, highly resilient operating cash flows.'
  },
  {
    id: 'RSK-03',
    scenario: 'Mature telecom infrastructure tower operator with 10-year inflation-indexed lease agreements.',
    companyProfile: 'Infrastructure InVIT Provider',
    currentPrice: 185.0,
    volatility: 12.8,
    change30d: 0.9,
    negativeFactors: ['Modest interest rate refinancing sensitivity'],
    expected: 'LOW',
    rationale: 'High contractual visibility and predictable recurring EBITDA.'
  },
  {
    id: 'RSK-04',
    scenario: 'State-owned oil pipeline distributor with government-mandated volume guarantees and zero debt.',
    companyProfile: 'Energy Logistics Corporation',
    currentPrice: 512.0,
    volatility: 14.1,
    change30d: 2.1,
    negativeFactors: [],
    expected: 'LOW',
    rationale: 'Zero leverage, low volatility, sovereign-backed revenue security.'
  },
  {
    id: 'RSK-05',
    scenario: 'Pharmaceutical contract manufacturer with approved FDA clean audits and locked 5-year active ingredient supply contracts.',
    companyProfile: 'Specialty API Manufacturer',
    currentPrice: 890.0,
    volatility: 14.8,
    change30d: 4.5,
    negativeFactors: ['US FDA audit routine inspection scheduled in 18 months'],
    expected: 'LOW',
    rationale: 'High regulatory compliance score, stable order backlog.'
  },
  {
    id: 'RSK-06',
    scenario: 'Public healthcare hospital network operating at 78% occupancy with rising average revenue per bed.',
    companyProfile: 'National Healthcare Network',
    currentPrice: 1240.0,
    volatility: 13.9,
    change30d: 2.5,
    negativeFactors: ['Doctor compensation inflation in metro clinics'],
    expected: 'LOW',
    rationale: 'Inelastic medical service demand and disciplined capital structure.'
  },
  {
    id: 'RSK-07',
    scenario: 'Municipal water distribution concession with 25-year sovereign guarantee and zero debt default history.',
    companyProfile: 'Urban Water & Utilities Authority',
    currentPrice: 98.0,
    volatility: 10.4,
    change30d: 1.1,
    negativeFactors: [],
    expected: 'LOW',
    rationale: 'Protected non-cyclical utility with minimal market beta.'
  },

  // MEDIUM Risk Cases (7 cases)
  {
    id: 'RSK-08',
    scenario: 'Established automotive OEM managing hybrid vehicle transition amidst rising battery raw material costs.',
    companyProfile: 'Commercial & Passenger Vehicle Manufacturer',
    currentPrice: 650.0,
    volatility: 26.5,
    change30d: -4.2,
    negativeFactors: [
      'Input material cost volatility in battery components',
      'Intensifying competition from EV pure-play entrants'
    ],
    expected: 'MEDIUM',
    rationale: 'Moderate volatility (20-35%), moderate cyclicality, ongoing capital redeployment.'
  },
  {
    id: 'RSK-09',
    scenario: 'Tier-1 IT services exporter with healthy BFSI client retention but slowing enterprise discretionary tech budgets.',
    companyProfile: 'Global IT Modernization Services',
    currentPrice: 1420.0,
    volatility: 24.2,
    change30d: -2.8,
    negativeFactors: [
      'Elongated deal signing cycles in North America',
      'Foreign exchange headwinds on European billings'
    ],
    expected: 'MEDIUM',
    rationale: 'Steady balance sheet offset by macro enterprise spending pause.'
  },
  {
    id: 'RSK-10',
    scenario: 'Specialty chemical producer with export exposure facing Chinese overcapacity in basic agro-intermediates.',
    companyProfile: 'Agrochemical & Fluorine Producer',
    currentPrice: 410.0,
    volatility: 28.4,
    change30d: -6.5,
    negativeFactors: [
      'Export dumping pressure in commodity agrochemicals',
      'Higher working capital blockage in inventory'
    ],
    expected: 'MEDIUM',
    rationale: 'Margin compression and global pricing cycles, manageable debt load.'
  },
  {
    id: 'RSK-11',
    scenario: 'Commercial real estate developer with 85% pre-leased office portfolio facing higher commercial mortgage refinancing rates.',
    companyProfile: 'Metropolitan Real Estate REIT',
    currentPrice: 340.0,
    volatility: 23.8,
    change30d: 1.4,
    negativeFactors: [
      'Cap rate expansion driven by elevated bond yields',
      'Tenant downsizing among tech enterprise occupants'
    ],
    expected: 'MEDIUM',
    rationale: 'High occupancy buffer counterbalanced by refinancing yield spreads.'
  },
  {
    id: 'RSK-12',
    scenario: 'Private sector commercial bank with 18% loan book growth but mild uptick in unsecured retail personal loan defaults.',
    companyProfile: 'Retail & Commercial Banking Group',
    currentPrice: 1680.0,
    volatility: 25.1,
    change30d: -3.1,
    negativeFactors: [
      'Slight increase in 90-day overdue slippages in micro-loans',
      'Intense deposit competition pressuring Net Interest Margin (NIM)'
    ],
    expected: 'MEDIUM',
    rationale: 'Robust capital adequacy (CAR > 16%) offsetting credit cost normalizations.'
  },
  {
    id: 'RSK-13',
    scenario: 'Integrated consumer electronics retailer scaling quick-commerce delivery hubs with elevated promotional spending.',
    companyProfile: 'Omnichannel Consumer Electronics Retail',
    currentPrice: 215.0,
    volatility: 29.5,
    change30d: 6.8,
    negativeFactors: [
      'High marketing burn to defend market share against quick-commerce startups',
      'Inventory obsolescence risk on legacy appliances'
    ],
    expected: 'MEDIUM',
    rationale: 'Top-line growth offset by cash burn in aggressive delivery logistics.'
  },
  {
    id: 'RSK-14',
    scenario: 'Cement manufacturer expanding clinker capacity in southern cluster while fuel power costs remain volatile.',
    companyProfile: 'Infrastructure Building Materials',
    currentPrice: 580.0,
    volatility: 27.2,
    change30d: -5.0,
    negativeFactors: [
      'Imported petcoke and coal cost fluctuations',
      'Regional pricing discipline softening among competing producers'
    ],
    expected: 'MEDIUM',
    rationale: 'Capital expenditure cycle amidst cyclical freight and fuel costs.'
  },

  // HIGH Risk Cases (7 cases)
  {
    id: 'RSK-15',
    scenario: 'Pre-revenue clinical-stage biotech developing oncology molecules with only 9 months cash runway and pivotal Phase III trials pending.',
    companyProfile: 'Biomedical Therapeutics Inc.',
    currentPrice: 14.5,
    volatility: 64.8,
    change30d: -24.5,
    negativeFactors: [
      'Acute cash burn with near-term dilution risk from required capital raise',
      'Binary regulatory trial outcomes with single drug pipeline reliance',
      'FDA clinical hold warning letter on secondary trials'
    ],
    expected: 'HIGH',
    rationale: 'Extreme volatility (>50%), severe negative momentum, acute solvency/dilution risk.'
  },
  {
    id: 'RSK-16',
    scenario: 'Highly leveraged infrastructure concessionaire with debt-to-equity ratio of 4.8x facing debt covenant breach.',
    companyProfile: 'Highway & Tollway Concessionaire',
    currentPrice: 42.0,
    volatility: 52.1,
    change30d: -31.0,
    negativeFactors: [
      'Impending debt covenant default with bankers consortium',
      'Toll collections down 18% YoY due to state transport detour',
      'Auditor qualifications regarding going concern viability'
    ],
    expected: 'HIGH',
    rationale: 'Excessive leverage, debt service coverage ratio below 1.0x, steep equity drawdown.'
  },
  {
    id: 'RSK-17',
    scenario: 'Micro-cap electric scooter startup facing multiple product recalls, fire safety investigations, and customer cancellations.',
    companyProfile: 'EV Mobility Start-up',
    currentPrice: 28.0,
    volatility: 58.6,
    change30d: -38.2,
    negativeFactors: [
      'Statutory recall order impacting 45,000 battery packs',
      'State subsidy revoked pending battery safety compliance',
      'Senior leadership executive resignations across quality control'
    ],
    expected: 'HIGH',
    rationale: 'Operational catastrophe, brand impairment, statutory regulatory penalties.'
  },
  {
    id: 'RSK-18',
    scenario: 'Cryptocurrency treasury and mining platform subject to federal securities enforcement and falling hash rate economics.',
    companyProfile: 'Decentralized Asset Infrastructure Corp',
    currentPrice: 8.2,
    volatility: 78.4,
    change30d: -19.4,
    negativeFactors: [
      'SEC formal complaint alleging unregistered security token distribution',
      'Rising electrical grid tariffs threatening unit breakeven',
      'Counterparty liquidity freeze on collateral accounts'
    ],
    expected: 'HIGH',
    rationale: 'Extreme regulatory risk, volatile underlying commodity assets, structural unprofitability.'
  },
  {
    id: 'RSK-19',
    scenario: 'Offshore oil drilling contractor with aging jack-up fleet and 3 customer contract cancellations following oil price slump.',
    companyProfile: 'Offshore Deepwater Drilling Corp',
    currentPrice: 65.0,
    volatility: 49.3,
    change30d: -21.8,
    negativeFactors: [
      'Fleet utilization collapsed to 44% with major idle maintenance costs',
      'Substantial bond maturities due in 6 months requiring haircut negotiations',
      'Rig safety inspection failed at Arabian Gulf platform'
    ],
    expected: 'HIGH',
    rationale: 'Capital intensive, high operational leverage, structural overcapacity.'
  },
  {
    id: 'RSK-20',
    scenario: 'Cross-border merchant payments processor facing revoking of banking correspondent license in primary territory.',
    companyProfile: 'Fintech Payments Gateway',
    currentPrice: 88.0,
    volatility: 47.9,
    change30d: -28.0,
    negativeFactors: [
      'Central bank sanctions barring onboarding of new merchant wallets',
      'Anti-Money Laundering (AML) audit violations flagged by financial intelligence unit',
      'Merchant deposit outflow acceleration'
    ],
    expected: 'HIGH',
    rationale: 'Regulatory death penalty risk, immediate business suspension.'
  },
  {
    id: 'RSK-21',
    scenario: 'Commodity metal smelter operating with negative gross spreads and high dollar-denominated unhedged foreign borrowings.',
    companyProfile: 'Base Metals Smelting Ltd',
    currentPrice: 112.0,
    volatility: 44.5,
    change30d: -18.2,
    negativeFactors: [
      'Negative crack and conversion margins across European smelting plants',
      'High power electricity tariff spikes forcing unannounced shutdowns',
      'Severe credit rating downgrade to Junk status'
    ],
    expected: 'HIGH',
    rationale: 'Negative operating margins, unhedged currency mismatch, distress-tier rating.'
  }
];

export const VERIFICATION_BENCHMARK_CASES: VerificationBenchmarkCase[] = [
  // 10 Cases expected to PASS
  {
    id: 'VRF-01',
    name: 'Clean 30-Day Return Formula Verification',
    checkType: 'RETURN_30D',
    description: '30-Day price change calculated precisely from historical closing base within 0.05% tolerance.',
    expectedValue: '+14.20%',
    testedValue: '+14.20%',
    shouldPass: true
  },
  {
    id: 'VRF-02',
    name: 'Valid 7-Day Short-Term Momentum Audit',
    checkType: 'RETURN_7D',
    description: '7-Day percentage change matches underlying price series with variance = 0.00%.',
    expectedValue: '-2.45%',
    testedValue: '-2.45%',
    shouldPass: true
  },
  {
    id: 'VRF-03',
    name: '30-Day High Extreme Upper Bound Bounding',
    checkType: 'BOUNDARY_ENVELOPE',
    description: 'Current market price ($145.20) sits strictly below the 30-day recorded high ($158.00).',
    expectedValue: 'High >= $145.20',
    testedValue: '$158.00',
    shouldPass: true
  },
  {
    id: 'VRF-04',
    name: '30-Day Low Extreme Lower Bound Bounding',
    checkType: 'BOUNDARY_ENVELOPE',
    description: 'Current market price ($145.20) sits strictly above the 30-day recorded low ($132.50).',
    expectedValue: 'Low <= $145.20',
    testedValue: '$132.50',
    shouldPass: true
  },
  {
    id: 'VRF-05',
    name: 'Volatility Metric Positive Dispersion Bounds',
    checkType: 'VOLATILITY_BOUND',
    description: 'Annualized price volatility calculated at 24.50% resides within valid bounds [0%, 250%].',
    expectedValue: '0% <= Vol <= 250%',
    testedValue: '24.50%',
    shouldPass: true
  },
  {
    id: 'VRF-06',
    name: 'Unitary Sentiment Probability Mass Conservation',
    checkType: 'PROBABILITY_MASS',
    description: 'Positive (55%) + Neutral (30%) + Negative (15%) sums exactly to 100%.',
    expectedValue: '100%',
    testedValue: '100% (55/30/15)',
    shouldPass: true
  },
  {
    id: 'VRF-07',
    name: 'High Risk Tier & Monotonic Score Concordance',
    checkType: 'RISK_MONOTONICITY',
    description: 'Classification "High" matches calibrated risk score of 78/100 (Threshold >= 65).',
    expectedValue: 'High requires Score >= 65',
    testedValue: '78/100',
    shouldPass: true
  },
  {
    id: 'VRF-08',
    name: 'Low Risk Tier & Monotonic Score Concordance',
    checkType: 'RISK_MONOTONICITY',
    description: 'Classification "Low" matches calibrated risk score of 24/100 (Threshold < 40).',
    expectedValue: 'Low requires Score < 40',
    testedValue: '24/100',
    shouldPass: true
  },
  {
    id: 'VRF-09',
    name: 'Historical Array Monotonic Time Ordering',
    checkType: 'RETURN_30D',
    description: 'Historical date sequence is strictly chronological and uncorrupted.',
    expectedValue: 'Valid ascending timeline',
    testedValue: '30 daily observations ordered',
    shouldPass: true
  },
  {
    id: 'VRF-10',
    name: 'Boundary Envelope at Exact All-Time High Close',
    checkType: 'BOUNDARY_ENVELOPE',
    description: 'Current price equals 30-day high within 0.05 currency tolerance.',
    expectedValue: 'High >= Current Price',
    testedValue: 'Current: $300.00, High: $300.00',
    shouldPass: true
  },

  // 10 Cases expected to FAIL (Deliberate Synthetic Inconsistencies to test detection)
  {
    id: 'VRF-11',
    name: 'Injected 30-Day Return Mathematical Discrepancy',
    checkType: 'RETURN_30D',
    description: 'Underlying data dictates return is +3.10%, but agent claims +9.80% (+6.70% phantom delta).',
    expectedValue: '+3.10%',
    testedValue: '+9.80%',
    shouldPass: false,
    expectedFlagReason: 'Calculated 30-day return diverges from underlying series by 6.70% (tolerance: 0.25%).'
  },
  {
    id: 'VRF-12',
    name: 'Injected 7-Day Return Directional Inversion',
    checkType: 'RETURN_7D',
    description: 'Underlying data fell -4.20%, but agent claims positive momentum +2.10%.',
    expectedValue: '-4.20%',
    testedValue: '+2.10%',
    shouldPass: false,
    expectedFlagReason: '7-day momentum computation contradicts historical price trajectory.'
  },
  {
    id: 'VRF-13',
    name: 'Boundary Envelope Violation: Price Above 30D High',
    checkType: 'BOUNDARY_ENVELOPE',
    description: 'Current market price is recorded as $240.00, but 30-day recorded high is listed as $210.00.',
    expectedValue: 'High >= $240.00',
    testedValue: 'High: $210.00',
    shouldPass: false,
    expectedFlagReason: 'Current price exceeds recorded 30-day high extreme.'
  },
  {
    id: 'VRF-14',
    name: 'Boundary Envelope Violation: Price Below 30D Low',
    checkType: 'BOUNDARY_ENVELOPE',
    description: 'Current market price is recorded as $85.00, but 30-day recorded low is listed as $105.00.',
    expectedValue: 'Low <= $85.00',
    testedValue: 'Low: $105.00',
    shouldPass: false,
    expectedFlagReason: 'Current price falls below recorded 30-day low extreme.'
  },
  {
    id: 'VRF-15',
    name: 'Invalid Negative Dispersion Annualized Volatility',
    checkType: 'VOLATILITY_BOUND',
    description: 'Mathematical impossibility: Volatility output reported as -18.40%.',
    expectedValue: '>= 0.00%',
    testedValue: '-18.40%',
    shouldPass: false,
    expectedFlagReason: 'Annualized volatility cannot be negative.'
  },
  {
    id: 'VRF-16',
    name: 'Extreme Volatility Scalar Overflow Out of Bounds',
    checkType: 'VOLATILITY_BOUND',
    description: 'Corrupted telemetry produced an unrealistic 340.0% annualized volatility.',
    expectedValue: '<= 250.00%',
    testedValue: '340.00%',
    shouldPass: false,
    expectedFlagReason: 'Volatility metric exceeds realistic computational ceiling.'
  },
  {
    id: 'VRF-17',
    name: 'Probability Deficit: Non-Conserved Probability Mass',
    checkType: 'PROBABILITY_MASS',
    description: 'Sentiment distribution sums to only 78% (Pos: 40%, Neu: 25%, Neg: 13%).',
    expectedValue: '100%',
    testedValue: '78%',
    shouldPass: false,
    expectedFlagReason: 'Sentiment probability distribution violates unitary conservation (deficit of 22%).'
  },
  {
    id: 'VRF-18',
    name: 'Probability Overflow: Distribution Sum Exceeds 100%',
    checkType: 'PROBABILITY_MASS',
    description: 'Sentiment distribution sums to 128% (Pos: 65%, Neu: 40%, Neg: 23%).',
    expectedValue: '100%',
    testedValue: '128%',
    shouldPass: false,
    expectedFlagReason: 'Sentiment probability distribution exceeds 100% by 28%.'
  },
  {
    id: 'VRF-19',
    name: 'Risk Monotonicity Contradiction: High Risk with Trivial Score',
    checkType: 'RISK_MONOTONICITY',
    description: 'Agent classified risk as "High", but assigned risk score is only 18/100.',
    expectedValue: 'High requires score >= 65',
    testedValue: 'Score: 18/100 [High]',
    shouldPass: false,
    expectedFlagReason: 'Severe divergence between qualitative risk tier and quantitative score.'
  },
  {
    id: 'VRF-20',
    name: 'Risk Monotonicity Contradiction: Low Risk with Extreme Score',
    checkType: 'RISK_MONOTONICITY',
    description: 'Agent classified risk as "Low", but assigned risk score is 82/100.',
    expectedValue: 'Low requires score < 40',
    testedValue: 'Score: 82/100 [Low]',
    shouldPass: false,
    expectedFlagReason: 'Qualitative low-risk designation conflicts directly with elevated score.'
  }
];

export const FINANCIAL_CALCULATION_CASES: FinancialCalculationCase[] = [
  {
    id: 'CALC-01',
    name: '30-Day Return Calculation (Standard Gain)',
    formulaDescription: '((P_now - P_30dAgo) / P_30dAgo) * 100',
    referenceInput: {
      currentPrice: 125.0,
      price30dAgo: 100.0,
      historicalSeries: [100, 102, 105, 110, 118, 125]
    },
    expectedResult: 25.00,
    tolerance: 0.05,
    unit: '%'
  },
  {
    id: 'CALC-02',
    name: '30-Day Return Calculation (Standard Loss)',
    formulaDescription: '((P_now - P_30dAgo) / P_30dAgo) * 100',
    referenceInput: {
      currentPrice: 85.5,
      price30dAgo: 95.0,
      historicalSeries: [95, 92, 90, 88, 86, 85.5]
    },
    expectedResult: -10.00,
    tolerance: 0.05,
    unit: '%'
  },
  {
    id: 'CALC-03',
    name: '7-Day Return Calculation (Weekly Momentum)',
    formulaDescription: '((P_now - P_7dAgo) / P_7dAgo) * 100',
    referenceInput: {
      currentPrice: 2450.0,
      price7dAgo: 2380.0,
      historicalSeries: [2380, 2395, 2410, 2420, 2450]
    },
    expectedResult: 2.94,
    tolerance: 0.05,
    unit: '%'
  },
  {
    id: 'CALC-04',
    name: '30-Day High Extreme Value Identification',
    formulaDescription: 'Max(p[0] ... p[n-1])',
    referenceInput: {
      currentPrice: 182.4,
      historicalSeries: [160.0, 172.5, 194.8, 189.0, 175.2, 182.4]
    },
    expectedResult: 194.80,
    tolerance: 0.01,
    unit: 'CURR'
  },
  {
    id: 'CALC-05',
    name: '30-Day Low Extreme Value Identification',
    formulaDescription: 'Min(p[0] ... p[n-1])',
    referenceInput: {
      currentPrice: 182.4,
      historicalSeries: [160.0, 172.5, 194.8, 189.0, 154.2, 182.4]
    },
    expectedResult: 154.20,
    tolerance: 0.01,
    unit: 'CURR'
  },
  {
    id: 'CALC-06',
    name: '30-Day Annualized Volatility (Low Dispersion)',
    formulaDescription: 'StdDev(DailyReturns) * Sqrt(252) * 100',
    referenceInput: {
      currentPrice: 100.0,
      historicalSeries: [100.0, 100.2, 99.8, 100.1, 100.3, 99.9, 100.0]
    },
    expectedResult: 4.05, // approximately ~4% for very low daily fluctuations
    tolerance: 0.8,
    unit: '%'
  },
  {
    id: 'CALC-07',
    name: '30-Day Return Calculation (Flat Performance)',
    formulaDescription: '((P_now - P_30dAgo) / P_30dAgo) * 100',
    referenceInput: {
      currentPrice: 500.0,
      price30dAgo: 500.0,
      historicalSeries: [500, 502, 498, 501, 500]
    },
    expectedResult: 0.00,
    tolerance: 0.05,
    unit: '%'
  },
  {
    id: 'CALC-08',
    name: '30-Day Return Calculation (High Fraction Decimal)',
    formulaDescription: '((P_now - P_30dAgo) / P_30dAgo) * 100',
    referenceInput: {
      currentPrice: 1124.75,
      price30dAgo: 1045.20,
      historicalSeries: [1045.20, 1080.0, 1105.5, 1124.75]
    },
    expectedResult: 7.61,
    tolerance: 0.05,
    unit: '%'
  },
  {
    id: 'CALC-09',
    name: '7-Day Return (Negative Momentum)',
    formulaDescription: '((P_now - P_7dAgo) / P_7dAgo) * 100',
    referenceInput: {
      currentPrice: 910.0,
      price7dAgo: 950.0,
      historicalSeries: [950, 940, 930, 920, 910]
    },
    expectedResult: -4.21,
    tolerance: 0.05,
    unit: '%'
  },
  {
    id: 'CALC-10',
    name: 'Boundary Envelope Extremes Check (Monotonic Rise)',
    formulaDescription: 'Max in strictly rising series equals current price',
    referenceInput: {
      currentPrice: 300.0,
      historicalSeries: [250, 260, 270, 280, 290, 300]
    },
    expectedResult: 300.0,
    tolerance: 0.01,
    unit: 'CURR'
  },
  {
    id: 'CALC-11',
    name: 'Boundary Envelope Extremes Check (Monotonic Fall)',
    formulaDescription: 'Min in strictly falling series equals current price',
    referenceInput: {
      currentPrice: 180.0,
      historicalSeries: [240, 220, 205, 195, 180]
    },
    expectedResult: 180.0,
    tolerance: 0.01,
    unit: 'CURR'
  },
  {
    id: 'CALC-12',
    name: '7-Day Return (Sub-percent Fraction)',
    formulaDescription: '((P_now - P_7dAgo) / P_7dAgo) * 100',
    referenceInput: {
      currentPrice: 1005.0,
      price7dAgo: 1000.0,
      historicalSeries: [1000, 1002, 1003, 1005]
    },
    expectedResult: 0.50,
    tolerance: 0.05,
    unit: '%'
  }
];
