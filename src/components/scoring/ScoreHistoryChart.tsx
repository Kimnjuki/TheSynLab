import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Shield, Link2, TrendingUp, TrendingDown, AlertTriangle, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScoreHistoryEvent {
  date: string;
  trustScore: number;
  integrationScore: number;
  event?: string;
  eventType?: "improvement" | "decline" | "neutral";
}

interface ScoreHistoryChartProps {
  productName: string;
  history: ScoreHistoryEvent[];
  className?: string;
}

const defaultHistory: ScoreHistoryEvent[] = [
  { date: "2024-01", trustScore: 7.8, integrationScore: 8.5 },
  { date: "2024-03", trustScore: 7.9, integrationScore: 8.5, event: "Privacy policy update", eventType: "improvement" },
  { date: "2024-05", trustScore: 7.9, integrationScore: 8.7, event: "New API endpoints added", eventType: "improvement" },
  { date: "2024-07", trustScore: 8.1, integrationScore: 8.7, event: "SOC 2 certification", eventType: "improvement" },
  { date: "2024-09", trustScore: 8.1, integrationScore: 8.5, event: "Legacy integration deprecated", eventType: "decline" },
  { date: "2024-11", trustScore: 8.2, integrationScore: 8.8, event: "Matter support added", eventType: "improvement" },
  { date: "2025-01", trustScore: 8.2, integrationScore: 8.9 },
  { date: "2025-03", trustScore: 8.0, integrationScore: 8.9, event: "Minor data incident", eventType: "decline" },
  { date: "2025-05", trustScore: 8.3, integrationScore: 9.0, event: "E2E encryption added", eventType: "improvement" },
  { date: "2025-07", trustScore: 8.3, integrationScore: 9.2, event: "GraphQL API launch", eventType: "improvement" },
  { date: "2025-09", trustScore: 8.4, integrationScore: 9.2 },
  { date: "2025-11", trustScore: 8.5, integrationScore: 9.3, event: "Third-party audit passed", eventType: "improvement" },
  { date: "2026-01", trustScore: 8.5, integrationScore: 9.4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-muted-foreground">Trust:</span>
            <span className="font-semibold">{data.trustScore.toFixed(1)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-secondary" />
            <span className="text-muted-foreground">Integration:</span>
            <span className="font-semibold">{data.integrationScore.toFixed(1)}</span>
          </div>
        </div>
        {data.event && (
          <div className={cn(
            "mt-2 pt-2 border-t text-xs",
            data.eventType === "improvement" && "text-success",
            data.eventType === "decline" && "text-destructive",
            data.eventType === "neutral" && "text-muted-foreground"
          )}>
            {data.eventType === "improvement" && <TrendingUp className="h-3 w-3 inline mr-1" />}
            {data.eventType === "decline" && <TrendingDown className="h-3 w-3 inline mr-1" />}
            {data.event}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function ScoreHistoryChart({ 
  productName = "Example Product", 
  history = defaultHistory,
  className 
}: Partial<ScoreHistoryChartProps>) {
  const latestData = history[history.length - 1];
  const oldestData = history[0];
  
  const trustChange = latestData.trustScore - oldestData.trustScore;
  const integrationChange = latestData.integrationScore - oldestData.integrationScore;

  const events = history.filter(h => h.event);
  const improvements = events.filter(e => e.eventType === "improvement").length;
  const declines = events.filter(e => e.eventType === "decline").length;

  return (
    <Card className={cn("p-6", className)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <History className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Score History</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Longitudinal tracking for {productName} over 2 years
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className={trustChange >= 0 ? "text-success" : "text-destructive"}>
            <Shield className="h-3 w-3 mr-1" />
            {trustChange >= 0 ? "+" : ""}{trustChange.toFixed(1)} Trust
          </Badge>
          <Badge variant="outline" className={integrationChange >= 0 ? "text-success" : "text-destructive"}>
            <Link2 className="h-3 w-3 mr-1" />
            {integrationChange >= 0 ? "+" : ""}{integrationChange.toFixed(1)} Integration
          </Badge>
        </div>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <YAxis 
              domain={[6, 10]} 
              tick={{ fontSize: 12 }}
              className="text-muted-foreground"
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="trustScore"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.event) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={payload.eventType === "improvement" ? "hsl(var(--success))" : 
                            payload.eventType === "decline" ? "hsl(var(--destructive))" : 
                            "hsl(var(--muted-foreground))"}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="hsl(var(--primary))"
                  />
                );
              }}
            />
            <Line
              type="monotone"
              dataKey="integrationScore"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                if (payload.event) {
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={6}
                      fill={payload.eventType === "improvement" ? "hsl(var(--success))" : 
                            payload.eventType === "decline" ? "hsl(var(--destructive))" : 
                            "hsl(var(--muted-foreground))"}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  );
                }
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={4}
                    fill="hsl(var(--secondary))"
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-primary" />
          <span className="text-sm">Trust Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-secondary" />
          <span className="text-sm">Integration Score</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Improvement</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Decline</span>
        </div>
      </div>

      {/* Event Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-3 rounded-lg bg-muted/50 text-center">
          <div className="text-2xl font-bold">{events.length}</div>
          <div className="text-xs text-muted-foreground">Score Changes</div>
        </div>
        <div className="p-3 rounded-lg bg-success/10 text-center">
          <div className="text-2xl font-bold text-success">{improvements}</div>
          <div className="text-xs text-muted-foreground">Improvements</div>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 text-center">
          <div className="text-2xl font-bold text-destructive">{declines}</div>
          <div className="text-xs text-muted-foreground">Declines</div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="text-sm font-semibold mb-3">Recent Score Events</h4>
        <div className="space-y-2">
          {events.slice(-4).reverse().map((event, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              {event.eventType === "improvement" ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : event.eventType === "decline" ? (
                <TrendingDown className="h-4 w-4 text-destructive" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-accent" />
              )}
              <span className="text-muted-foreground">{event.date}</span>
              <span>{event.event}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
