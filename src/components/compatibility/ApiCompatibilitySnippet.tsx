import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/** COMPAT-007: sample of ecosystem × ecosystem matrix from apiCompatibilityMatrix. */
export function ApiCompatibilitySnippet() {
  const matrix = useQuery(api.apiCompatibility.listMatrix, { limit: 80 }) ?? [];

  if (matrix.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">API compatibility matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No rows in <code className="text-xs">apiCompatibilityMatrix</code> yet — seed data to unlock the full N×N grid.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ecosystem pair matrix (sample)</CardTitle>
        <p className="text-sm text-muted-foreground font-normal">
          First {matrix.length} rows — scores 0–100, setup complexity, sources when present.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>A</TableHead>
              <TableHead>B</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Method</TableHead>
              <TableHead className="text-right">Setup</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {matrix.slice(0, 40).map((row) => (
              <TableRow key={row._id}>
                <TableCell className="text-xs">{row.ecosystemA}</TableCell>
                <TableCell className="text-xs">{row.ecosystemB}</TableCell>
                <TableCell className="text-right tabular-nums">{row.compatibilityScore}</TableCell>
                <TableCell className="text-xs max-w-[180px] truncate">
                  {row.integrationMethod}
                </TableCell>
                <TableCell className="text-right tabular-nums">{row.setupComplexity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
