import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, ChevronRight, Loader2, X } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AICompareAssistantProps {
  products: any[];
  onClose?: () => void;
}

const SUGGESTED_PROMPTS = [
  "Which product is best for privacy-conscious users?",
  "Which has the lowest 3-year cost?",
  "Which integrates best with Apple HomeKit?",
  "Explain the difference in Trust Scores.",
  "Which would you recommend for a small business?",
];

export function AICompareAssistant({ products, onClose }: AICompareAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm TheSynLab's AI comparison assistant. I've reviewed the ${products.length} product(s) you're comparing. Ask me anything about them — scores, compatibility, value for money, or which one suits your needs best.`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const productContext = JSON.stringify(
    products.map((p) => ({
      name: p.productName,
      category: p.category,
      price: p.price,
      trustScore: p.trustScore?.totalScore,
      integrationScore: p.integrationScore?.totalScore,
      hub: p.hub,
      description: p.description?.slice(0, 200),
    })),
    null,
    2
  );

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const apiKey = (window as any).__ANTHROPIC_KEY__;
      if (!apiKey) {
        const mockReply = `Based on the products you're comparing, here's my analysis of "${text}":\n\nI can see ${products.length} product(s): ${products.map((p) => p.productName).join(", ")}. To get full AI-powered answers, configure your Anthropic API key. In the meantime, you can check the Trust & Integration scores, TCO calculator, and compatibility matrix for detailed comparisons.`;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: mockReply },
        ]);
        return;
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are TheSynLab's comparison assistant. You have detailed knowledge of the products the user is comparing. Here is the product data:\n${productContext}\n\nAnswer questions about which product is better for specific use cases, explain score differences, and give setup advice. Be concise and factual. Always cite scores when relevant.`,
          messages: [
            ...messages.map((m) => ({ role: m.role, content: m.content })),
            { role: "user", content: text },
          ],
        }),
      });

      const data = (await response.json()) as {
        content?: { type: string; text?: string }[];
      };
      const reply =
        data.content?.find((c) => c.type === "text")?.text ??
        "I couldn't generate a response. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I ran into an error. Please check your API configuration and try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bot className="h-4 w-4 text-primary" />
          AI Compare Assistant
        </CardTitle>
        {onClose && (
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
            <X className="h-3 w-3" />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col flex-1 gap-3 p-3 pt-0">
        <ScrollArea className="flex-1 pr-2 max-h-80">
          <div className="space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-xs ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 text-xs flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {messages.length === 1 && (
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">Suggested:</p>
            <div className="flex flex-wrap gap-1">
              {SUGGESTED_PROMPTS.slice(0, 3).map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="text-xs px-2 py-1 rounded border hover:bg-accent transition-colors text-left flex items-center gap-1"
                >
                  <ChevronRight className="h-3 w-3 flex-shrink-0" />
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Input
            placeholder="Ask about these products…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            className="text-xs h-8"
          />
          <Button
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={() => sendMessage(input)}
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground text-center">
          Powered by Claude · Answers cite actual product scores
        </p>
      </CardContent>
    </Card>
  );
}
