import { Card, CardContent } from "@/components/ui/card";

type Props = {
  timeToFirstValueMinutes?: number;
  setupDifficulty?: number;
  learningCurve?: number;
  benchmarkedWorkflowCount?: number;
  lastReviewedAt?: number;
  releaseCadence?: string;
};

function DotScale({ value }: { value?: number }) {
  const v = Math.max(0, Math.min(3, Math.round(value ?? 0)));
  return (
    <span className="inline-flex gap-1" aria-label={`Difficulty ${v} out of 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`h-2.5 w-2.5 rounded-full ${i <= v ? "bg-primary" : "bg-muted-foreground/30"}`} />
      ))}
    </span>
  );
}

export function QuickStatsBar(props: Props) {
  const items = [
    { label: "Time to First Value", value: props.timeToFirstValueMinutes != null ? `${props.timeToFirstValueMinutes} min` : "N/A" },
    { label: "Setup Difficulty", value: <DotScale value={props.setupDifficulty} /> },
    { label: "Learning Curve", value: <DotScale value={props.learningCurve} /> },
    { label: "Benchmarked Workflows", value: props.benchmarkedWorkflowCount ?? "N/A" },
    { label: "Last Reviewed", value: props.lastReviewedAt ? new Date(props.lastReviewedAt).toLocaleDateString() : "N/A" },
    { label: "Release Cadence", value: props.releaseCadence ?? "N/A" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
      {items.map((it) => (
        <Card key={it.label} className="border-primary/20">
          <CardContent className="p-3">
            <p className="text-xs text-muted-foreground">{it.label}</p>
            <div className="mt-1 text-sm font-semibold">{it.value as any}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
