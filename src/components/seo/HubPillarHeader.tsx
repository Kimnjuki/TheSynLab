import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type HubPillarHeaderProps = {
  title: string;
  description: string;
  pillarCount?: number;
  spokeCount?: number;
};

export function HubPillarHeader({
  title,
  description,
  pillarCount = 0,
  spokeCount = 0,
}: HubPillarHeaderProps) {
  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-lg">{description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Pillars: {pillarCount}</Badge>
            <Badge variant="outline">Spokes: {spokeCount}</Badge>
            <Badge variant="outline">Topical Authority Hub</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
