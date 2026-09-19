import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { runOrchestrator, createInitialState } from './src/agents/orchestrator.ts';
import { resolveTicker, resolveCompanyOrTicker, fetchMarketData } from './src/services/marketData.ts';
import { getGeminiClient } from './src/services/gemini.ts';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    const hasGemini = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: 'ok',
      hasGemini,
      hasFinancialKey: Boolean(process.env.FINANCIAL_DATA_API_KEY),
      timestamp: new Date().toISOString()
    });
  });

  // Dynamic ticker resolution
  app.get('/api/ticker/resolve', async (req: Request, res: Response) => {
    const query = String(req.query.q || '');
    if (!query) {
      res.status(400).json({ error: 'Missing query parameter q' });
      return;
    }
    const resolved = await resolveCompanyOrTicker(query);
    if (!resolved) {
      res.status(404).json({ error: 'Company or ticker not found. Please enter a valid company name or ticker.' });
      return;
    }
    res.json(resolved);
  });

  // REST analyze endpoint (Full JSON payload)
  app.post('/api/analyze', async (req: Request, res: Response) => {
    const { query, isDemo = false, simulateRetry = false, simulateApiFailure = false } = req.body;
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'Company or stock ticker is required.' });
      return;
    }

    try {
      const finalState = await runOrchestrator(query, isDemo, undefined, simulateRetry, simulateApiFailure);
      res.json(finalState);
    } catch (err: any) {
      res.status(500).json({ error: err.message || 'Analysis failed.' });
    }
  });

  // Server-Sent Events (SSE) Live Agent Activity Streaming
  app.get('/api/analyze/stream', async (req: Request, res: Response) => {
    const query = String(req.query.query || 'RELIANCE');
    const isDemo = req.query.demo === 'true';
    const simulateRetry = req.query.glitch === 'true';
    const simulateApiFailure = req.query.apiFailure === 'true';

    // Set headers for SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const sendSse = (eventName: string, data: any) => {
      res.write(`event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      sendSse('init', { query, isDemo, message: 'Orchestrator connection initialized.' });

      await runOrchestrator(
        query,
        isDemo,
        (event, stateSnapshot) => {
          sendSse('log', event);
          sendSse('state', stateSnapshot);
        },
        simulateRetry,
        simulateApiFailure
      );

      sendSse('done', { message: 'Multi-agent analysis cycle complete.' });
      res.end();
    } catch (err: any) {
      sendSse('error', { error: err.message || 'Streaming pipeline failed.' });
      res.end();
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[FINANCIAL AGENT CREW] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Fatal server startup error:', err);
});
