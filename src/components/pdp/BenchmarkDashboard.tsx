import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

type Props = {
  trustScore?: any;
  integrationScore?: any;
  benchmarkData?: Record<string, any>;
};

export function BenchmarkDashboard({ trustScore, integrationScore, benchmarkData }: Props) {
  const trustData = useMemo(() => [
    { name: "Privacy", score: trustScore?.dataPrivacyPractices ?? 0 },
    { name: "Encryption", score: trustScore?.encryptionStandards ?? 0 },
    { name: "Ethics", score: trustScore?.ethicalAiTransparency ?? 0 },
    { name: "Terms", score: trustScore?.termsTransparency ?? 0 },
    { name: "Audits", score: trustScore?.thirdPartyAudits ?? 0 },
  ], [trustScore]);

  const integrationData = useMemo(() => [
    { metric: "API Docs", value: integrationScore?.apiDocumentation ?? 0 },
    { metric: "Automation", value: integrationScore?.automationPlatforms ?? 0 },
    { metric: "Cross Platform", value: integrationScore?.crossPlatform ?? 0 },
    { metric: "Community", value: integrationScore?.developerCommunity ?? 0 },
    { metric: "Ecosystems", value: integrationScore?.smartHomeEcosystems ?? 0 },
  ], [integrationScore]);

  const rows = useMemo(() => {
    const e = Object.entries(benchmarkData ?? {});
    return e.map(([metric, value]) => ({ metric, score: Number(value) || 0 }));
  }, [benchmarkData]);
  const [sortAsc, setSortAsc] = useState(false);
  const sortedRows = [...rows].sort((a, b) => sortAsc ? a.score - b.score : b.score - a.score);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">SynLab benchmark dashboard</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Trust score dimensions</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trustData} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={90} />
                <Tooltip />
                <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Integration radar</CardTitle></CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={integrationData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis />
                <Radar dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle className="text-base">Lab benchmark results</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setSortAsc((s) => !s)} aria-label="Sort benchmark table">
            Sort {sortAsc ? "desc" : "asc"}
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((row) => (
                <TableRow key={row.metric}>
                  <TableCell>{row.metric}</TableCell>
                  <TableCell>{row.score}</TableCell>
                </TableRow>
              ))}
              {!sortedRows.length && <TableRow><TableCell colSpan={2}>No benchmark data</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
