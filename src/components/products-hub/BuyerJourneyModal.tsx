import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { BuyerJourneyPath } from "./types";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  path: BuyerJourneyPath | null;
};

export function BuyerJourneyModal({ open, onOpenChange, path }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{path?.pathTitle ?? "Buyer journey"}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-3">
          <div className="space-y-4">
            {(path?.stepDescriptions ?? []).map((step: any, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="text-sm font-semibold">Step {i + 1}</div>
                <div className="text-sm text-muted-foreground">{String(step?.description ?? step ?? "")}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
        <Button>Start with Step 1</Button>
      </DialogContent>
    </Dialog>
  );
}
