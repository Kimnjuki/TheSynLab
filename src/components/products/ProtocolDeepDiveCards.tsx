import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/** COMPAT-002 (MVP): static explainers for smart-home protocol positioning vs Wirecutter-style hubs. */
const DEEP_DIVES: { title: string; summary: string; contenderAngle: string }[] = [
  {
    title: "Matter",
    summary:
      "IP-based local + cloud profile that unifies device onboarding across Apple, Google, and Amazon ecosystems.",
    contenderAngle:
      "We flag Matter certification level and hub requirements so readers avoid “works with Matter” marketing that still needs a bridge.",
  },
  {
    title: "Thread",
    summary:
      "Low-power mesh radio used by Matter devices; often paired with border routers (HomePod mini, Nest, Echo).",
    contenderAngle:
      "We surface Thread border-router dependency so your stack does not dead-end when one router leaves the mesh.",
  },
  {
    title: "Zigbee",
    summary:
      "Mature mesh protocol common in sensors and lights; many hubs translate Zigbee to cloud APIs.",
    contenderAngle:
      "We call out hub lock-in and firmware sunset risk—key differentiator versus generic compatibility charts.",
  },
  {
    title: "Z-Wave",
    summary:
      "Regional sub-GHz mesh with strong interoperability certification; common in security-focused installs.",
    contenderAngle:
      "We highlight regional frequency and controller compatibility to reduce costly rip-and-replace mistakes.",
  },
];

export function ProtocolDeepDiveCards() {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Protocol deep dives</h3>
        <p className="text-sm text-muted-foreground">
          How we interpret protocols in reviews—built for buyers comparing ecosystems, not just checking boxes.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {DEEP_DIVES.map((d) => (
          <Card key={d.title} className="border-muted">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{d.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>{d.summary}</p>
              <p className="text-foreground/90 border-l-2 border-primary/40 pl-3">
                <span className="font-medium text-foreground">TheSynLab angle: </span>
                {d.contenderAngle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
