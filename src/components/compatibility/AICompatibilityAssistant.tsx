import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2 } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const PROMPTS = [
  "I have Hue and want a Z-Wave lock — what hub do I need?",
  "Build a Matter-first starter list under $400.",
  "Which ecosystems overlap between my two selected products?",
];

export function AICompatibilityAssistant({
  contextSummary,
}: {
  contextSummary: string;
}) {
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Ask about smart home compatibility in plain English. Without an Anthropic API key in the client, you get heuristic answers based on your selection and SynLab data.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const key = (window as unknown as { __ANTHROPIC_KEY__?: string }).__ANTHROPIC_KEY__;
      if (!key) {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content: `Heuristic reply: ${contextSummary.slice(0, 400)}\n\nFor full Claude answers, configure an Anthropic API key (see docs). Model target: claude-sonnet-4-20250514.`,
          },
        ]);
        return;
      }

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 900,
          messages: [
            {
              role: "user",
              content: `Context:\n${contextSummary}\n\nUser question: ${text}`,
            },
          ],
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const data = (await res.json()) as {
        content: Array<{ text?: string }>;
      };
      const textOut = data.content?.[0]?.text ?? "No response.";
      setMessages((m) => [...m, { role: "assistant", content: textOut }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content: "Could not reach Claude — check API key and network.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[420px] flex flex-col">
      <CardHeader className="py-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Bot className="h-4 w-4" />
          AI compatibility assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-2 min-h-0">
        <ScrollArea className="flex-1 pr-3">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm rounded-lg p-2 ${
                  msg.role === "user" ? "bg-primary/10 ml-4" : "bg-muted mr-4"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
              </div>
            )}
            <div ref={bottom} />
          </div>
        </ScrollArea>
        <div className="flex flex-wrap gap-1">
          {PROMPTS.map((p) => (
            <Button
              key={p}
              variant="outline"
              size="sm"
              className="text-xs h-7"
              onClick={() => send(p)}
            >
              {p.slice(0, 42)}…
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your setup…"
            onKeyDown={(e) => e.key === "Enter" && send(input)}
          />
          <Button size="icon" onClick={() => send(input)} disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
