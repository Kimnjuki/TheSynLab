import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { BuyerJourneyModal } from "./BuyerJourneyModal";
import type { BuyerJourneyPath } from "./types";

const iconBySlug: Record<string, string> = {
  "new-startup-stack": "🚀",
  "migrate-from-trello": "🔄",
  "solo-founder": "👤",
  "enterprise-security": "🏢",
};

type Props = { paths: BuyerJourneyPath[] };

export function BuyerJourneyShortcuts({ paths }: Props) {
  const [selected, setSelected] = useState<BuyerJourneyPath | null>(null);
  return (
    <>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 py-1">
          {paths.map((path) => (
            <Button key={path._id} variant="outline" onClick={() => setSelected(path)}>
              {(iconBySlug[path.pathSlug] ?? "🧭")} {path.pathTitle}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <BuyerJourneyModal open={Boolean(selected)} onOpenChange={(o) => !o && setSelected(null)} path={selected} />
    </>
  );
}
