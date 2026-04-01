import { useState } from "react";
import { useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StackArchitectChat() {
  const run = useAction((api as any)["ai/stackArchitect"].runStackArchitectTurn);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const sessionId = "local-session";

  const send = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const res = await run({
        sessionId,
        userId: null,
        userMessage: message,
        conversationHistory: history,
      });
      setHistory((prev) => [...prev, { role: "user", content: message }, { role: "assistant", content: JSON.stringify(res) }]);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Stack Architect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="max-h-56 overflow-auto text-sm space-y-2">
          {history.map((h, i) => (
            <p key={i}><strong>{h.role}:</strong> {h.content}</p>
          ))}
        </div>
        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell me your role, budget, and goals..." />
        <Button onClick={send} disabled={loading || !message.trim()}>{loading ? "Thinking..." : "Send"}</Button>
      </CardContent>
    </Card>
  );
}
