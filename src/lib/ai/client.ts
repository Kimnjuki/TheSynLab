/**
 * AI Client — Multi-provider LLM client for TheSynLab
 * 
 * Uses NVIDIA NIM (OpenAI-compatible) as the primary inference provider.
 * Falls back to Anthropic when NVIDIA is unavailable.
 * Gracefully degrades to canned responses when no API key is set.
 */

// Use server-side proxy to avoid browser CORS / DNS issues
// The nginx config at /api/ai/chat forwards to NVIDIA NIM
const NVIDIA_BASE_URL = '/api/ai';
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIClientOptions {
  temperature?: number;
  maxTokens?: number;
}

function getNvidiaKey(): string | null {
  return import.meta.env.VITE_NVIDIA_API_KEY ?? null;
}

function getAnthropicKey(): string | null {
  return (window as any).__ANTHROPIC_KEY__ ?? null;
}

/**
 * Chat completion using NVIDIA NIM (primary) or Anthropic (fallback).
 * Both are OpenAI-compatible endpoints.
 */
export async function chatCompletion(
  messages: ChatMessage[],
  overrides?: AIClientOptions
): Promise<string> {
  const nvidiaKey = getNvidiaKey();

  if (nvidiaKey) {
    try {
      return await nvidiaChat(messages, overrides);
    } catch (err) {
      console.warn('[AIClient] NVIDIA failed, trying Anthropic:', err);
    }
  }

  const anthropicKey = getAnthropicKey();
  if (anthropicKey) {
    try {
      return await anthropicChat(messages, overrides);
    } catch (err) {
      console.warn('[AIClient] Anthropic also failed:', err);
    }
  }

  return fallbackResponse(messages);
}

/** NVIDIA NIM via OpenAI-compatible API */
async function nvidiaChat(
  messages: ChatMessage[],
  overrides?: AIClientOptions
): Promise<string> {
  const apiKey = getNvidiaKey()!;
  const model = import.meta.env.VITE_NVIDIA_MODEL ?? 'meta/llama-3.1-8b-instruct';
  const systemMsg = messages.find(m => m.role === 'system');
  const nonSystem = messages.filter(m => m.role !== 'system');

  const response = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // API key injected by nginx server-side; don't send from browser
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemMsg?.content ?? '' },
        ...nonSystem,
      ],
      temperature: overrides?.temperature ?? 0.5,
      max_tokens: overrides?.maxTokens ?? 1024,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`NVIDIA API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content ?? '';
}

/** Anthropic Claude API */
async function anthropicChat(
  messages: ChatMessage[],
  overrides?: AIClientOptions
): Promise<string> {
  const apiKey = getAnthropicKey()!;
  const systemMsg = messages.find(m => m.role === 'system');
  const userMessages = messages.filter(m => m.role !== 'system');

  const response = await fetch(`${ANTHROPIC_BASE_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      system: systemMsg?.content ?? '',
      messages: userMessages.map(({ role, content }) => ({ role, content })),
      max_tokens: overrides?.maxTokens ?? 1024,
      temperature: overrides?.temperature ?? 0.5,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${err}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text ?? '';
}

/** Deterministic fallback when no API is available */
function fallbackResponse(messages: ChatMessage[]): string {
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  const query = lastUser?.content?.toLowerCase() ?? '';

  // Product comparison responses
  if (query.includes('privacy') || query.includes('private')) {
    return 'For privacy-conscious users, I recommend looking at the Trust Score and security certifications. Products with local processing or end-to-end encryption typically score highest on privacy. Check the Trust Index tab for detailed ratings.';
  }
  if (query.includes('cost') || query.includes('cheap') || query.includes('value')) {
    return 'The total cost of ownership (TCO) varies by use case. Check the Budget Calculator and TCO Calculator tools for a detailed breakdown including subscription fees, hardware requirements, and estimated 3-year costs.';
  }
  if (query.includes('recommend') || query.includes('best')) {
    return 'The best choice depends on your specific needs. I recommend starting with the Scoring Hub to match products against your requirements. Each product page has detailed pros/cons tables and real user reviews.';
  }
  if (query.includes('difference') || query.includes('compare') || query.includes('vs')) {
    return 'Both products have different strengths. Use the comparison matrix below for a side-by-side feature breakdown. Key differentiators include Trust Scores, integration compatibility, and pricing models.';
  }

  // Generic
  return 'I analyze products based on Trust Scores, feature sets, pricing, and user reviews. For specific product recommendations, check the detailed reviews and comparison tools on this site.';
}
