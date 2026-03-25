import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Dimension = { label: string; value?: number; max: number };

export function ScoreBreakdownCard({
  title,
  dimensions,
}: {
  title: string;
  dimensions: Dimension[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {dimensions.map((d) => (
          <div key={d.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{d.label}</span>
              <span className="font-semibold">
                {d.value ?? 0}/{d.max}
              </span>
            </div>
            <Progress value={((d.value ?? 0) / d.max) * 100} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
