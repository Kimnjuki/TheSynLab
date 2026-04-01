import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";

interface ScoreTrendChartProps {
  productId: Id<"novaProducts">;
  type?: "trust" | "integration";
  height?: number;
}

export function ScoreTrendChart({
  productId,
  type = "trust",
  height = 180,
}: ScoreTrendChartProps) {
  const trustHistory =
    useQuery(api.scores.getTrustScoreHistory, { productId }) ?? [];
  const intHistory =
    useQuery(api.scores.getIntegrationScoreHistory, { productId }) ?? [];

  const history = type === "trust" ? trustHistory : intHistory;

  if (history.length === 0) return null;

  const data = history.map((h) => ({
    date: format(new Date(h.testedDate), "MMM yyyy"),
    score: h.totalScore,
    version: h.methodologyVersion,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0.3}
            />
            <stop
              offset="95%"
              stopColor="hsl(var(--primary))"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 10 }} />
        <YAxis domain={[0, 10]} tick={{ fontSize: 10 }} />
        <Tooltip
          formatter={(value: number) => [value.toFixed(1), type === "trust" ? "Trust" : "Integration"]}
        />
        <Area
          type="monotone"
          dataKey="score"
          stroke="hsl(var(--primary))"
          fill="url(#scoreGrad)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
