import { useQuery } from "convex/react";
import { api } from "@/../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export function ActivitySidebar() {
  const feed = useQuery(api.productsHub.getHubActivityFeed, { limit: 8 });
  return (
    <aside className="sticky top-20 space-y-3">
      <h3 className="text-sm font-semibold">Live Activity</h3>
      {!feed ? (
        <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
      ) : (
        feed.map((item) => (
          <div key={item._id} className="rounded-lg border p-2">
            <div className="text-xs font-medium">{item.activityTitle}</div>
            {item.scoreDelta != null ? <div className="text-xs text-muted-foreground">Delta: {item.scoreDelta}</div> : null}
          </div>
        ))
      )}
    </aside>
  );
}
