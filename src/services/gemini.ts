import { GoogleGenAI } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (aiClient) return aiClient;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }

  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    return aiClient;
  } catch (err) {
    console.error('Failed to initialize Gemini client:', err);
    return null;
  }
}

// Resilient model cascade: prefer gemini-3.1-flash-lite for rapid availability during high demand periods
const CANDIDATE_MODELS = [
  'gemini-3.1-flash-lite',
  'gemini-3.8-flash',
  'gemini-flash-latest'
];

function cleanJsonText(raw: string): string {
  let cleaned = raw.trim();
  // Strip markdown code fences if returned by model
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

export async function generateGeminiJson<T>(
  prompt: string,
  systemInstruction?: string
): Promise<T | null> {
  const client = getGeminiClient();
  if (!client) {
    return null;
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const text = response.text?.trim();
      if (!text) continue;

      const cleaned = cleanJsonText(text);
      const parsed = JSON.parse(cleaned) as T;
      return parsed;
    } catch (err: any) {
      // If model is experiencing temporary high demand (503) or rate limits (429), try next candidate
      const isTransient =
        err?.status === 'UNAVAILABLE' ||
        err?.code === 503 ||
        err?.status === 503 ||
        err?.code === 429 ||
        err?.status === 429 ||
        err?.message?.includes('high demand') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('Spikes in demand');

      if (isTransient) {
        // Silently continue to next available model in candidate cascade
        continue;
      }
      // For any other error, continue to next model or fallback
      continue;
    }
  }

  // Graceful return if all models in cascade are unavailable
  return null;
}
