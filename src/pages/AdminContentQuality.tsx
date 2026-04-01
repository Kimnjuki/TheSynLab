import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AdminContentQuality() {
  const audits = useQuery(api.contentQualityAudits.listRecentAudits) ?? [];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Content Quality Audits</h1>
            <p className="text-sm text-muted-foreground">
              Weekly ad-readiness results sorted by score.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/admin">Back to Admin</Link>
          </Button>
        </div>

        <div className="space-y-4">
          {[...audits]
            .sort((a, b) => a.adSenseReadinessScore - b.adSenseReadinessScore)
            .map((audit) => (
              <Card key={audit._id}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-3 text-base">
                    <span>Post: {audit.postId}</span>
                    <Badge
                      variant={audit.adSenseReadinessScore >= 80 ? "default" : "destructive"}
                    >
                      Score {audit.adSenseReadinessScore}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    Policy check:{" "}
                    <span className={audit.passesAdPolicyCheck ? "text-emerald-600" : "text-red-600"}>
                      {audit.passesAdPolicyCheck ? "Pass" : "Fail"}
                    </span>
                  </p>
                  {audit.flags?.length ? (
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {audit.flags.map((flag: any, i: number) => (
                        <li key={`${audit._id}-${i}`}>
                          [{flag.severity}] {flag.description}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No flags.</p>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
