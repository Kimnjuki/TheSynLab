import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowRight, Link } from "lucide-react";
import { toast } from "sonner";

export function RedirectManager() {
  const rules = useQuery(api.redirectRules.list) ?? [];
  const toggle = useMutation(api.redirectRules.toggle);

  const handleToggle = async (ruleId: Id<"novaRedirectRules">, current: boolean) => {
    try {
      await toggle({ ruleId, isActive: !current });
      toast.success(`Rule ${!current ? "activated" : "deactivated"}`);
    } catch {
      toast.error("Failed to update rule");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="h-5 w-5" />
          Redirect Rules ({rules.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left pb-2">From</th>
                <th className="text-center pb-2">→</th>
                <th className="text-left pb-2">To</th>
                <th className="text-center pb-2">Type</th>
                <th className="text-center pb-2">Hits</th>
                <th className="text-center pb-2">Active</th>
              </tr>
            </thead>
            <tbody>
              {rules.map((rule) => (
                <tr key={rule._id} className="border-b last:border-0">
                  <td className="py-2 font-mono text-xs text-muted-foreground">
                    {rule.fromPath}
                  </td>
                  <td className="text-center py-2">
                    <ArrowRight className="h-3 w-3 mx-auto text-muted-foreground" />
                  </td>
                  <td className="py-2 font-mono text-xs text-muted-foreground">
                    {rule.toPath}
                  </td>
                  <td className="text-center py-2">
                    <Badge variant="outline" className="text-xs">
                      {rule.redirectType}
                    </Badge>
                  </td>
                  <td className="text-center py-2 font-semibold">{rule.hitCount}</td>
                  <td className="text-center py-2">
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggle(rule._id, rule.isActive)}
                    />
                  </td>
                </tr>
              ))}
              {rules.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                    No redirect rules configured.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
