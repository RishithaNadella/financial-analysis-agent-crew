import type { FinancialMetrics, HistoricalDataPoint } from '../types/financial.ts';

// Known benchmark companies with realistic market anchors for reliable demo / offline fallback
interface BenchmarkCompany {
  symbol: string;
  aliases: string[];
  name: string;
  currency: string;
  exchange: string;
  basePrice: number;
  marketCap: string;
  peRatio: number;
  trend: number; // general 30d drift
}

export const BENCHMARKS: BenchmarkCompany[] = [
  {
    symbol: 'RELIANCE.NS',
    aliases: ['RELIANCE', 'RELIANCE.BO', 'RIL', 'RELIANCE INDUSTRIES'],
    name: 'Reliance Industries Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 2985.40,
    marketCap: '₹20.2 Lakh Cr',
    peRatio: 28.4,
    trend: 0.045
  },
  {
    symbol: 'TCS.NS',
    aliases: ['TCS', 'TCS.BO', 'TATA CONSULTANCY', 'TATA CONSULTANCY SERVICES'],
    name: 'Tata Consultancy Services Ltd',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 4215.20,
    marketCap: '₹15.2 Lakh Cr',
    peRatio: 31.8,
    trend: 0.032
  },
  {
    symbol: 'INFY.NS',
    aliases: ['INFOSYS', 'INFY', 'INFOSYS LIMITED', 'INFOSYS LTD', 'INFY.BO'],
    name: 'Infosys Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 1945.50,
    marketCap: '₹8.1 Lakh Cr',
    peRatio: 29.2,
    trend: 0.048
  },
  {
    symbol: 'HDFCBANK.NS',
    aliases: ['HDFC', 'HDFCBANK', 'HDFC BANK', 'HDB'],
    name: 'HDFC Bank Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 1650.00,
    marketCap: '₹12.5 Lakh Cr',
    peRatio: 19.8,
    trend: 0.022
  },
  {
    symbol: 'ICICIBANK.NS',
    aliases: ['ICICI', 'ICICIBANK', 'ICICI BANK', 'IBN'],
    name: 'ICICI Bank Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 1220.00,
    marketCap: '₹8.6 Lakh Cr',
    peRatio: 17.5,
    trend: 0.035
  },
  {
    symbol: 'SBIN.NS',
    aliases: ['SBI', 'SBIN', 'STATE BANK OF INDIA'],
    name: 'State Bank of India',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 810.00,
    marketCap: '₹7.2 Lakh Cr',
    peRatio: 11.2,
    trend: 0.018
  },
  {
    symbol: 'ITC.NS',
    aliases: ['ITC', 'ITC LIMITED'],
    name: 'ITC Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 505.00,
    marketCap: '₹6.3 Lakh Cr',
    peRatio: 28.5,
    trend: 0.015
  },
  {
    symbol: 'WIPRO.NS',
    aliases: ['WIPRO', 'WIPRO LIMITED', 'WIT'],
    name: 'Wipro Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 540.00,
    marketCap: '₹2.8 Lakh Cr',
    peRatio: 24.5,
    trend: 0.025
  },
  {
    symbol: 'LT.NS',
    aliases: ['LT', 'L&T', 'LARSEN & TOUBRO', 'LARSEN'],
    name: 'Larsen & Toubro Ltd',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 3620.00,
    marketCap: '₹5.0 Lakh Cr',
    peRatio: 33.2,
    trend: 0.038
  },
  {
    symbol: 'BHARTIARTL.NS',
    aliases: ['BHARTIARTL', 'AIRTEL', 'BHARTI AIRTEL'],
    name: 'Bharti Airtel Limited',
    currency: 'INR',
    exchange: 'NSE',
    basePrice: 1560.00,
    marketCap: '₹9.1 Lakh Cr',
    peRatio: 48.0,
    trend: 0.052
  },
  {
    symbol: 'AAPL',
    aliases: ['APPLE', 'AAPL.O', 'APPLE INC'],
    name: 'Apple Inc.',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 228.60,
    marketCap: '$3.48 Trillion',
    peRatio: 34.2,
    trend: 0.058
  },
  {
    symbol: 'NVDA',
    aliases: ['NVIDIA', 'NVIDIA CORP'],
    name: 'NVIDIA Corporation',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 128.40,
    marketCap: '$3.15 Trillion',
    peRatio: 48.6,
    trend: 0.124
  },
  {
    symbol: 'TSLA',
    aliases: ['TESLA', 'TESLA MOTORS', 'TESLA INC'],
    name: 'Tesla, Inc.',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 242.80,
    marketCap: '$770 Billion',
    peRatio: 64.1,
    trend: -0.025
  },
  {
    symbol: 'MSFT',
    aliases: ['MICROSOFT', 'MICROSOFT CORP'],
    name: 'Microsoft Corporation',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 442.10,
    marketCap: '$3.28 Trillion',
    peRatio: 36.5,
    trend: 0.039
  },
  {
    symbol: 'GOOGL',
    aliases: ['GOOGLE', 'ALPHABET', 'GOOG'],
    name: 'Alphabet Inc.',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 165.20,
    marketCap: '$2.05 Trillion',
    peRatio: 24.1,
    trend: 0.042
  },
  {
    symbol: 'AMZN',
    aliases: ['AMAZON', 'AMAZON.COM'],
    name: 'Amazon.com, Inc.',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 186.50,
    marketCap: '$1.94 Trillion',
    peRatio: 44.2,
    trend: 0.051
  },
  {
    symbol: 'META',
    aliases: ['FACEBOOK', 'META PLATFORMS'],
    name: 'Meta Platforms, Inc.',
    currency: 'USD',
    exchange: 'NASDAQ',
    basePrice: 520.40,
    marketCap: '$1.32 Trillion',
    peRatio: 27.8,
    trend: 0.065
  }
];

export function resolveTickerSync(query: string): { ticker: string; name: string; currency: string; exchange: string } {
  const clean = query.trim().toUpperCase();

  for (const b of BENCHMARKS) {
    if (b.symbol === clean || b.aliases.includes(clean) || b.name.toUpperCase().includes(clean)) {
      return { ticker: b.symbol, name: b.name, currency: b.currency, exchange: b.exchange };
    }
  }

  // Detect Indian tickers (NSE/BSE) without suffix
  const indianTickers = [
    'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'LT', 'BHARTIARTL',
    'WIPRO', 'TATAMOTORS', 'TATASTEEL', 'MARUTI', 'SUNPHARMA', 'AXISBANK',
    'KOTAKBANK', 'BAJFINANCE', 'ASIANPAINT', 'HCLTECH', 'TITAN', 'ZOMATO'
  ];
  if (indianTickers.includes(clean)) {
    return { ticker: `${clean}.NS`, name: clean, currency: 'INR', exchange: 'NSE' };
  }

  // Default to US stock or as entered
  return {
    ticker: clean,
    name: clean,
    currency: clean.endsWith('.NS') || clean.endsWith('.BO') ? 'INR' : 'USD',
    exchange: clean.endsWith('.NS') ? 'NSE' : clean.endsWith('.BO') ? 'BSE' : 'NASDAQ/NYSE'
  };
}

export function resolveTicker(query: string): { ticker: string; name: string; currency: string; exchange: string } {
  return resolveTickerSync(query);
}

// Rapid public online search to resolve company names to verified exchange tickers
export async function searchPublicSymbol(query: string): Promise<{ symbol: string; name: string } | null> {
  try {
    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=6&newsCount=0`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const resp = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (resp.ok) {
      const data = await resp.json();
      const quotes: any[] = data.quotes || [];
      if (quotes.length > 0) {
        // Preferred: Indian NSE (.NS), or first Equity quote
        const preferred =
          quotes.find(q => q.symbol?.endsWith('.NS')) ||
          quotes.find(q => q.quoteType === 'EQUITY') ||
          quotes[0];

        if (preferred && preferred.symbol) {
          return {
            symbol: preferred.symbol,
            name: preferred.shortname || preferred.longname || preferred.symbol
          };
        }
      }
    }
  } catch {
    // Network or timeout in symbol search; non-blocking
  }
  return null;
}

// Asynchronous resolution of ANY valid company name or stock ticker supported by the public feed
export async function resolveCompanyOrTicker(
  query: string
): Promise<{ ticker: string; name: string; currency: string; exchange: string } | null> {
  const clean = query.trim().toUpperCase();
  if (!clean) return null;

  // 1. Check known aliases & benchmark anchors
  for (const b of BENCHMARKS) {
    if (
      b.symbol === clean ||
      b.aliases.includes(clean) ||
      b.name.toUpperCase() === clean ||
      b.aliases.some(a => a.toUpperCase() === clean)
    ) {
      return { ticker: b.symbol, name: b.name, currency: b.currency, exchange: b.exchange };
    }
  }

  // 2. If ticker explicitly contains exchange suffix (.NS or .BO)
  if (clean.includes('.')) {
    const chart = await fetchYahooChart(clean);
    if (chart && chart.timestamp && chart.timestamp.length > 0) {
      const meta = chart.meta;
      return {
        ticker: clean,
        name: meta?.shortName || meta?.longName || clean,
        currency: meta?.currency || (clean.endsWith('.NS') || clean.endsWith('.BO') ? 'INR' : 'USD'),
        exchange: meta?.exchangeName || (clean.endsWith('.NS') ? 'NSE' : clean.endsWith('.BO') ? 'BSE' : 'Exchange')
      };
    }
  }

  // 3. Check popular Indian tickers without suffix
  const indianTickers = [
    'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'ITC', 'LT', 'BHARTIARTL',
    'WIPRO', 'TATAMOTORS', 'TATASTEEL', 'MARUTI', 'SUNPHARMA', 'AXISBANK',
    'KOTAKBANK', 'BAJFINANCE', 'ASIANPAINT', 'HCLTECH', 'TITAN', 'ZOMATO'
  ];
  if (indianTickers.includes(clean)) {
    const chart = await fetchYahooChart(`${clean}.NS`);
    if (chart && chart.timestamp && chart.timestamp.length > 0) {
      const meta = chart.meta;
      return {
        ticker: `${clean}.NS`,
        name: meta?.shortName || meta?.longName || clean,
        currency: 'INR',
        exchange: 'NSE'
      };
    }
  }

  // 4. Dynamic Online Search (resolves arbitrary company names like "Netflix", "Sony", "Palantir", "Berkshire")
  const online = await searchPublicSymbol(query);
  if (online && online.symbol) {
    const chart = await fetchYahooChart(online.symbol);
    if (chart && chart.timestamp && chart.timestamp.length > 0) {
      const meta = chart.meta;
      return {
        ticker: online.symbol,
        name: meta?.shortName || meta?.longName || online.name,
        currency: meta?.currency || (online.symbol.endsWith('.NS') || online.symbol.endsWith('.BO') ? 'INR' : 'USD'),
        exchange: meta?.exchangeName || (online.symbol.endsWith('.NS') ? 'NSE' : online.symbol.endsWith('.BO') ? 'BSE' : 'NASDAQ/NYSE')
      };
    }
  }

  // 5. Test direct ticker query if it looks like a standard stock ticker (e.g. AAPL, TSLA, MSFT, NVDA)
  if (/^[A-Z0-9]{1,10}$/.test(clean)) {
    const chart = await fetchYahooChart(clean);
    if (chart && chart.timestamp && chart.timestamp.length > 0) {
      const meta = chart.meta;
      return {
        ticker: clean,
        name: meta?.shortName || meta?.longName || clean,
        currency: meta?.currency || 'USD',
        exchange: meta?.exchangeName || 'NASDAQ/NYSE'
      };
    }
  }

  return null;
}

export function calculateFinancialStats(historical: HistoricalDataPoint[]): {
  currentPrice: number;
  change7d: number;
  change30d: number;
  high30d: number;
  low30d: number;
  volatility: number;
} {
  if (!historical || historical.length === 0) {
    return { currentPrice: 0, change7d: 0, change30d: 0, high30d: 0, low30d: 0, volatility: 0 };
  }

  const n = historical.length;
  const currentPrice = historical[n - 1].price;

  // 7-day index
  const idx7d = Math.max(0, n - 8);
  const price7dAgo = historical[idx7d].price;
  const change7d = price7dAgo > 0 ? Number((((currentPrice - price7dAgo) / price7dAgo) * 100).toFixed(2)) : 0;

  // 30-day index
  const idx30d = Math.max(0, n - 31);
  const price30dAgo = historical[idx30d].price;
  const change30d = price30dAgo > 0 ? Number((((currentPrice - price30dAgo) / price30dAgo) * 100).toFixed(2)) : 0;

  // 30-day slice for High & Low
  const slice30d = historical.slice(Math.max(0, n - 30));
  const prices30d = slice30d.map(d => d.high ?? d.price);
  const lows30d = slice30d.map(d => d.low ?? d.price);
  const high30d = Number(Math.max(...prices30d, currentPrice).toFixed(2));
  const low30d = Number(Math.min(...lows30d, currentPrice).toFixed(2));

  // Volatility: annualized standard deviation of daily returns over last 30 days
  const dailyReturns: number[] = [];
  for (let i = 1; i < slice30d.length; i++) {
    const prev = slice30d[i - 1].price;
    const curr = slice30d[i].price;
    if (prev > 0) {
      dailyReturns.push((curr - prev) / prev);
    }
  }

  let volatility = 0;
  if (dailyReturns.length > 1) {
    const mean = dailyReturns.reduce((acc, val) => acc + val, 0) / dailyReturns.length;
    const variance = dailyReturns.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (dailyReturns.length - 1);
    const dailyStdDev = Math.sqrt(variance);
    // Annualized volatility (252 trading days)
    volatility = Number((dailyStdDev * Math.sqrt(252) * 100).toFixed(2));
  }

  return {
    currentPrice: Number(currentPrice.toFixed(2)),
    change7d,
    change30d,
    high30d,
    low30d,
    volatility
  };
}

async function fetchYahooChart(ticker: string): Promise<any | null> {
  const endpoints = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=3mo&interval=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?range=3mo&interval=1d`
  ];

  for (const url of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const resp = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (resp.ok) {
        const json = await resp.json();
        if (!json.chart?.error && json.chart?.result?.[0]) {
          return json.chart.result[0];
        }
      }
    } catch {
      // Continue to alternate endpoint
    }
  }
  return null;
}

export async function fetchMarketData(tickerInput: string, isDemo = false): Promise<FinancialMetrics> {
  const nowStr = new Date().toISOString();

  // If DEMO MODE was explicitly requested:
  if (isDemo) {
    return generateDeterministicFinancialData(tickerInput, true);
  }

  // LIVE MODE: Dynamically resolve company name or ticker across supported exchanges
  const resolved = await resolveCompanyOrTicker(tickerInput);
  if (!resolved) {
    throw new Error('Company or ticker not found. Please enter a valid company name or ticker.');
  }

  const chartResult = await fetchYahooChart(resolved.ticker);

  // If chartResult is retrieved:
  if (chartResult && chartResult.timestamp && chartResult.indicators?.quote?.[0]) {
    const timestamps: number[] = chartResult.timestamp;
    const quotes = chartResult.indicators.quote[0];
    const closes: (number | null)[] = quotes.close;
    const opens: (number | null)[] = quotes.open;
    const highs: (number | null)[] = quotes.high;
    const lows: (number | null)[] = quotes.low;
    const volumes: (number | null)[] = quotes.volume;

    const historical: HistoricalDataPoint[] = [];
    for (let i = 0; i < timestamps.length; i++) {
      const price = closes[i];
      if (price !== null && !isNaN(price)) {
        const d = new Date(timestamps[i] * 1000);
        historical.push({
          date: d.toISOString().split('T')[0],
          price: Number(price.toFixed(2)),
          open: opens[i] ? Number(opens[i]!.toFixed(2)) : undefined,
          high: highs[i] ? Number(highs[i]!.toFixed(2)) : Number(price.toFixed(2)),
          low: lows[i] ? Number(lows[i]!.toFixed(2)) : Number(price.toFixed(2)),
          volume: volumes[i] ?? 0
        });
      }
    }

    if (historical.length >= 5) {
      const stats = calculateFinancialStats(historical);
      const shortName = chartResult.meta?.shortName || chartResult.meta?.longName || resolved.name;
      const currency = chartResult.meta?.currency || resolved.currency;
      const exchange = chartResult.meta?.exchangeName || resolved.exchange;

      return {
        ticker: resolved.ticker,
        companyName: shortName,
        currency,
        exchange,
        currentPrice: stats.currentPrice,
        previousClose: chartResult.meta?.chartPreviousClose || stats.currentPrice,
        change7d: stats.change7d,
        change30d: stats.change30d,
        high30d: stats.high30d,
        low30d: stats.low30d,
        volatility: stats.volatility,
        volume: historical[historical.length - 1]?.volume,
        dataSource: 'LIVE DATA (Public Feed: Yahoo Finance)',
        isLiveData: true,
        retrievedAt: nowStr,
        historicalData: historical
      };
    }
  }

  // NEVER fabricate live financial data and present it as real!
  throw new Error('Company or ticker not found. Please enter a valid company name or ticker.');
}

export function generateDeterministicFinancialData(ticker: string, isDemo = true): FinancialMetrics {
  const meta = resolveTicker(ticker);
  const now = new Date();
  const benchmark = BENCHMARKS.find(b => b.symbol === meta.ticker || b.aliases.includes(meta.ticker)) || {
    symbol: meta.ticker,
    aliases: [],
    name: `${meta.name} (Demo Benchmark Model)`,
    currency: meta.currency,
    exchange: meta.exchange,
    basePrice: meta.currency === 'INR' ? 1850 : 160,
    marketCap: meta.currency === 'INR' ? '₹5.5 Lakh Cr' : '$450 Billion',
    peRatio: 26.5,
    trend: 0.04
  };

  const historical: HistoricalDataPoint[] = [];
  const days = 90;
  let runningPrice = benchmark.basePrice * (1 - benchmark.trend);

  // Seeded random walk based on ticker string
  let seed = 0;
  for (let i = 0; i < ticker.length; i++) {
    seed = (seed << 5) - seed + ticker.charCodeAt(i);
    seed |= 0;
  }
  const pseudoRandom = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const dailyTrend = benchmark.trend / days;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // skip weekends
    if (d.getDay() === 0 || d.getDay() === 6) continue;

    const noise = (pseudoRandom() - 0.48) * 0.024;
    runningPrice = runningPrice * (1 + dailyTrend + noise);
    const dayHigh = runningPrice * (1 + pseudoRandom() * 0.012);
    const dayLow = runningPrice * (1 - pseudoRandom() * 0.012);
    const volume = Math.floor(1200000 + pseudoRandom() * 3500000);

    historical.push({
      date: d.toISOString().split('T')[0],
      price: Number(runningPrice.toFixed(2)),
      open: Number((runningPrice * (1 + (pseudoRandom() - 0.5) * 0.005)).toFixed(2)),
      high: Number(dayHigh.toFixed(2)),
      low: Number(dayLow.toFixed(2)),
      volume
    });
  }

  const stats = calculateFinancialStats(historical);

  return {
    ticker: meta.ticker,
    companyName: benchmark.name,
    currency: benchmark.currency,
    exchange: benchmark.exchange,
    currentPrice: stats.currentPrice,
    previousClose: historical.length > 1 ? historical[historical.length - 2].price : stats.currentPrice,
    change7d: stats.change7d,
    change30d: stats.change30d,
    high30d: stats.high30d,
    low30d: stats.low30d,
    volatility: stats.volatility,
    peRatio: benchmark.peRatio,
    marketCap: benchmark.marketCap,
    volume: historical[historical.length - 1]?.volume,
    dataSource: 'DEMO DATA (Simulated Benchmark Dataset)',
    isLiveData: false,
    retrievedAt: new Date().toISOString(),
    historicalData: historical
  };
}
