import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { FilterPresetSaver } from "./FilterPresetSaver";

type Option = { label: string; count?: number };
type Props = {
  categories: Option[];
  useCases: Option[];
  technicalTraits: Option[];
  lockInRisks: Option[];
  activeFilters: string[];
  resultCount: number;
  mobile?: boolean;
};

function Chips({ items }: { items: Option[] }) {
  return <div className="flex flex-wrap gap-2">{items.map((o) => <Badge key={o.label} variant="outline">{o.label}</Badge>)}</div>;
}

function FilterBody({ categories, useCases, technicalTraits, lockInRisks, activeFilters, resultCount }: Omit<Props, "mobile">) {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold">{resultCount} results</div>
      <div><div className="mb-2 text-xs font-medium">Category</div><Chips items={categories} /></div>
      <div><div className="mb-2 text-xs font-medium">Use Case</div><Chips items={useCases} /></div>
      <div><div className="mb-2 text-xs font-medium">Technical Traits</div><Chips items={technicalTraits} /></div>
      <div><div className="mb-2 text-xs font-medium">Lock-in Risk</div><Chips items={lockInRisks} /></div>
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((f) => (
          <Badge key={f} variant="secondary" className="gap-1">{f} <X className="h-3 w-3" /></Badge>
        ))}
      </div>
      <FilterPresetSaver onSave={() => undefined} />
    </div>
  );
}

export function FilterBar(props: Props) {
  if (props.mobile) {
    return (
      <Sheet>
        <SheetTrigger asChild><Button variant="outline">Filters</Button></SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh] overflow-auto">
          <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
          <FilterBody {...props} />
        </SheetContent>
      </Sheet>
    );
  }
  return <aside className="sticky top-20"><FilterBody {...props} /></aside>;
}
