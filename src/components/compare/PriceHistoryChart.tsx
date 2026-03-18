import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { TrendingDown } from "lucide-react";

const COLORS = ["hsl(var(--primary))", "#f59e0b", "#22c55e", "#ef4444"];

interface PriceHistoryChartProps {
  products: { _id: Id<"novaProducts">; productName: string }[];
}

export function PriceHistoryChart({ products }: PriceHistoryChartProps) {
  const histories = products.map((p) => ({
    product: p,
    history:
      useQuery(api.products.getPriceHistory, { productId: p._id }) ?? [],
  }));

  const hasData = histories.some((h) => h.history.length > 0);

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            Price History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            No price history data available yet. Prices update every 6 hours.
          </p>
        </CardContent>
      </Card>
    );
  }

  const allDates = [
    ...new Set(
      histories.flatMap((h) =>
        h.history.map((p) => format(new Date(p.fetchedAt), "yyyy-MM-dd"))
      )
    ),
  ].sort();

  const chartData = allDates.map((date) => {
    const row: Record<string, unknown> = { date };
    histories.forEach(({ product, history }) => {
      const entry = history.find(
        (p) => format(new Date(p.fetchedAt), "yyyy-MM-dd") === date
      );
      row[product.productName] = entry?.price ?? null;
    });
    return row;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingDown className="h-5 w-5" />
          Price History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={(v) => `$${v}`} tick={{ fontSize: 11 }} />
            <Tooltip
              formatter={(value: number) => [`$${value}`, ""]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            {histories.map(({ product }, i) => (
              <Line
                key={product._id}
                type="monotone"
                dataKey={product.productName}
                stroke={COLORS[i % COLORS.length]}
                dot={false}
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
