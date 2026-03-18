import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Link as LinkIcon } from "lucide-react";
import { format } from "date-fns";

export function AffiliatePriceDashboard() {
  const links = useQuery(api.affiliatePrices.listActiveLinks) ?? [];

  const broken = links.filter((l) => l.linkHealthStatus !== "healthy");
  const healthy = links.filter((l) => l.linkHealthStatus === "healthy");

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-green-600">{healthy.length}</div>
            <p className="text-sm text-muted-foreground">Healthy Links</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-red-500">{broken.length}</div>
            <p className="text-sm text-muted-foreground">Broken / Unchecked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-3xl font-bold text-primary">
              {links.reduce((s, l) => s + l.clickCount, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Total Clicks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Affiliate Links Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left pb-2">Link</th>
                  <th className="text-center pb-2">Current Price</th>
                  <th className="text-center pb-2">Clicks</th>
                  <th className="text-center pb-2">Conversions</th>
                  <th className="text-center pb-2">Health</th>
                  <th className="text-center pb-2">Last Checked</th>
                </tr>
              </thead>
              <tbody>
                {links.map((link) => {
                  const priceChange =
                    link.currentPrice != null && link.originalPrice != null
                      ? ((link.currentPrice - link.originalPrice) / link.originalPrice) * 100
                      : null;
                  return (
                    <tr key={link._id} className="border-b last:border-0">
                      <td className="py-2">
                        <a
                          href={link.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-[200px] block"
                        >
                          {link.linkType} link
                        </a>
                      </td>
                      <td className="text-center py-2">
                        {link.currentPrice != null ? (
                          <span className="font-semibold">${link.currentPrice}</span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                        {priceChange != null && (
                          <span
                            className={`ml-1 text-xs ${
                              priceChange < 0 ? "text-green-600" : "text-red-500"
                            }`}
                          >
                            ({priceChange > 0 ? "+" : ""}{priceChange.toFixed(1)}%)
                          </span>
                        )}
                      </td>
                      <td className="text-center py-2">{link.clickCount}</td>
                      <td className="text-center py-2">{link.conversionCount}</td>
                      <td className="text-center py-2">
                        {link.linkHealthStatus === "healthy" ? (
                          <CheckCircle className="h-4 w-4 text-green-600 mx-auto" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-500 mx-auto" />
                        )}
                      </td>
                      <td className="text-center py-2 text-xs text-muted-foreground">
                        {link.lastCheckedAt
                          ? format(new Date(link.lastCheckedAt), "MMM d")
                          : "Never"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
