import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MetaTags } from "@/components/seo/MetaTags";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function CompatibilityLeaderboardPage() {
  const rows = useQuery(api.compatibilityLeaderboard.topByCompatibilityBreadth, {
    limit: 40,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <MetaTags
        title="Compatibility breadth leaderboard"
        description="Products ranked by ecosystem coverage, community verification, and setup complexity."
        canonical="/tools/compatibility-leaderboard"
      />
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-6 text-sm">
          <Link to="/tools/compatibility" className="text-primary hover:underline">
            ← Compatibility checker
          </Link>
          <span className="text-muted-foreground">·</span>
          <Link to="/tools/hub-builder" className="text-primary hover:underline">
            Hub builder
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-2">Compatibility breadth leaderboard</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          COMPAT-005: heuristic breadth score from native ecosystem rows, partial support, verified counts, and average setup complexity.
        </p>

        {!rows ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : (
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Breadth</TableHead>
                  <TableHead className="text-right">Native</TableHead>
                  <TableHead className="text-right">Partial</TableHead>
                  <TableHead className="text-right">Avg setup</TableHead>
                  <TableHead className="text-right">Verified Σ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r, i) => (
                  <TableRow key={r.productId}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell>
                      <Link
                        to={`/products/${r.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {r.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{r.manufacturer}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">
                      {r.breadthScore}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{r.nativeCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.partialCount}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.avgSetup}</TableCell>
                    <TableCell className="text-right tabular-nums">{r.verifiedSum}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
