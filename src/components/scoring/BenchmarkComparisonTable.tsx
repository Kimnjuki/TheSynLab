/**
 * S2: Lab Benchmark Comparison Table
 * Side-by-side benchmark metrics for products.
 */

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BenchmarkMetric {
  name: string;
  unit?: string;
  higherIsBetter?: boolean;
}

export interface ProductBenchmarkRow {
  productName: string;
  productSlug?: string;
  values: Record<string, number | string | null>;
}

interface BenchmarkComparisonTableProps {
  metrics: BenchmarkMetric[];
  rows: ProductBenchmarkRow[];
  methodology?: string;
  className?: string;
}

export function BenchmarkComparisonTable({
  metrics,
  rows,
  methodology,
  className,
}: BenchmarkComparisonTableProps) {
  const getBestValue = (key: string, higherIsBetter: boolean) => {
    const nums = rows
      .map((r) => r.values[key])
      .filter((v): v is number => typeof v === "number");
    if (nums.length === 0) return null;
    return higherIsBetter ? Math.max(...nums) : Math.min(...nums);
  };

  return (
    <div className={cn("overflow-x-auto rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Product</TableHead>
            {metrics.map((m) => (
              <TableHead key={m.name} className="text-right">
                {m.name}
                {m.unit && (
                  <span className="ml-1 text-muted-foreground text-xs">
                    ({m.unit})
                  </span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, ri) => (
            <TableRow key={ri}>
              <TableCell className="font-medium">{row.productName}</TableCell>
              {metrics.map((m) => {
                const val = row.values[m.name];
                const best = getBestValue(m.name, m.higherIsBetter ?? true);
                const isBest =
                  typeof val === "number" &&
                  best !== null &&
                  val === best &&
                  rows.filter((r) => r.values[m.name] === best).length === 1;

                return (
                  <TableCell
                    key={m.name}
                    className={cn(
                      "text-right font-mono",
                      isBest && "text-primary font-semibold"
                    )}
                  >
                    {val === null || val === undefined ? (
                      "—"
                    ) : typeof val === "number" ? (
                      isBest ? (
                        <Badge variant="secondary" className="font-mono">
                          {val}
                          {m.unit ? ` ${m.unit}` : ""}
                        </Badge>
                      ) : (
                        `${val}${m.unit ? ` ${m.unit}` : ""}`
                      )
                    ) : (
                      String(val)
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {methodology && (
        <p className="border-t bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          {methodology}
        </p>
      )}
    </div>
  );
}
