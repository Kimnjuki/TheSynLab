import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const impactOrder = { high: 0, medium: 1, low: 2 } as const;

export default function AdminSeoOpportunities() {
  const { user } = useAuth();
  const data = useQuery(api.seoOpportunities.getOpportunitiesDashboard, {});
  const createTask = useMutation(api.seoOpportunities.createExecutionTask);

  const sorted = useMemo(() => {
    if (!data?.opportunities) return [];
    return [...data.opportunities].sort(
      (a, b) => impactOrder[a.impact] - impactOrder[b.impact]
    );
  }, [data?.opportunities]);

  const handleCreateTask = async (opportunity: (typeof sorted)[number]) => {
    try {
      await createTask({
        opportunityId: opportunity.id,
        title: `[SEO] ${opportunity.title}`,
        description: `${opportunity.summary}\n\nSteps:\n- ${opportunity.implementationSteps.join("\n- ")}`,
        priority: opportunity.impact === "high" ? "urgent" : opportunity.impact === "medium" ? "high" : "medium",
        createdBy: user?.id,
      });
      toast.success("Execution task created.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to create execution task.");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>SEO Opportunities Command Center</CardTitle>
          <CardDescription>
            Automated in-platform execution plan mapped to your Ahrefs opportunity model
            (content, links, technical). Prioritize high-impact items first.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="secondary">Total: {data?.totals.opportunities ?? 0}</Badge>
          <Badge variant="secondary">Content: {data?.totals.content ?? 0}</Badge>
          <Badge variant="secondary">Links: {data?.totals.links ?? 0}</Badge>
          <Badge variant="secondary">Technical: {data?.totals.technical ?? 0}</Badge>
          <Badge variant="outline">Unresolved 404: {data?.totals.unresolved404 ?? 0}</Badge>
        </CardContent>
      </Card>

      {sorted.map((opportunity) => (
        <Card key={opportunity.id}>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle className="text-xl">{opportunity.title}</CardTitle>
              <div className="flex gap-2">
                <Badge>{opportunity.category}</Badge>
                <Badge variant={opportunity.impact === "high" ? "destructive" : "secondary"}>
                  impact: {opportunity.impact}
                </Badge>
                <Badge variant="outline">effort: {opportunity.effort}</Badge>
              </div>
            </div>
            <CardDescription>{opportunity.summary}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Step-by-step implementation</p>
              <ul className="list-disc list-inside text-sm space-y-1">
                {opportunity.implementationSteps.map((step, idx) => (
                  <li key={`${opportunity.id}-step-${idx}`}>{step}</li>
                ))}
              </ul>
            </div>

            {opportunity.references.length > 0 && (
              <>
                <Separator />
                <div>
                  <p className="text-sm font-medium mb-2">Top references</p>
                  <div className="flex flex-wrap gap-2">
                    {opportunity.references.map((ref) => (
                      <Badge key={`${opportunity.id}-${ref}`} variant="outline">
                        {ref}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="pt-2">
              <Button onClick={() => handleCreateTask(opportunity)}>Create execution task</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
