export const ANTHROPIC_MODEL = "claude-sonnet-4-20250514";

export async function callAnthropicJson<T>(
  prompt: string,
  maxTokens = 1000
): Promise<T | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: maxTokens,
      messages: [{ role: "user", content: prompt }],
    }),
  });
  if (!res.ok) {
    return null;
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text ?? "";
  if (!text) return null;
  const normalized = text.replace(/```json\s*/g, "").replace(/```/g, "").trim();
  try {
    return JSON.parse(normalized) as T;
  } catch {
    return null;
  }
}

export function formatAiAuditMessage(event: string, description: string) {
  return `${event}: ${description}`;
}
