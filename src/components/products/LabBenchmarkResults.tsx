import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FlaskConical } from "lucide-react";
import { format } from "date-fns";

interface LabBenchmarkResultsProps {
  benchmarkData?: Record<string, unknown>;
  benchmarkVersion?: string;
  labTestedAt?: number;
  labTestedBy?: string;
  category?: string;
}

function MetricBar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span>{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function LabBenchmarkResults({
  benchmarkData,
  benchmarkVersion,
  labTestedAt,
  labTestedBy,
  category,
}: LabBenchmarkResultsProps) {
  if (!benchmarkData) return null;

  const groups: Record<string, Record<string, number>> = {};
  if (category === "productivity" && benchmarkData.productivity) {
    groups["Performance"] = benchmarkData.productivity as Record<string, number>;
  }
  if (category === "smartHome" && benchmarkData.smartHome) {
    groups["Smart Home"] = benchmarkData.smartHome as Record<string, number>;
  }
  if (category === "officeHardware" && benchmarkData.officeHardware) {
    groups["Office Hardware"] = benchmarkData.officeHardware as Record<string, number>;
  }
  if (Object.keys(groups).length === 0) {
    Object.entries(benchmarkData).forEach(([key, val]) => {
      if (typeof val === "object" && val !== null) {
        groups[key] = val as Record<string, number>;
      }
    });
  }

  const metricMaxes: Record<string, number> = {
    loadTimeMs: 5000,
    cpuUsagePercent: 100,
    memoryMb: 2048,
    crashRate: 1,
    responseLatencyMs: 500,
    connectivityUptime: 100,
    powerConsumptionW: 50,
    setupTimeMinutes: 120,
    ergonomicScore: 10,
    buildQualityScore: 10,
    noiseLevelDb: 50,
    durabilityRating: 10,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5" />
          Lab Benchmark Results
        </CardTitle>
        {labTestedAt && (
          <p className="text-sm text-muted-foreground">
            Tested {format(new Date(labTestedAt), "MMM d, yyyy")}
            {labTestedBy && ` by ${labTestedBy}`}
            {benchmarkVersion && (
              <Badge variant="outline" className="ml-2 text-xs">
                v{benchmarkVersion}
              </Badge>
            )}
          </p>
        )}
      </CardHeader>
      <CardContent>
        {Object.keys(groups).length === 0 ? (
          <p className="text-muted-foreground text-sm">No benchmark data available.</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([groupName, metrics]) => (
              <div key={groupName}>
                <h4 className="text-sm font-semibold mb-3">{groupName}</h4>
                <div className="space-y-3">
                  {Object.entries(metrics).map(([key, value]) => (
                    <MetricBar
                      key={key}
                      label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                      value={Number(value)}
                      max={metricMaxes[key] ?? 100}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
