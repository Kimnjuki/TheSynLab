import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  product: any;
  meta?: any;
};

function MetaBody({ product, meta }: Props) {
  const rows: Array<[string, string | number | undefined]> = [
    ["Category", product.category],
    ["Subcategory", product.subcategory],
    ["Pricing Model", product.priceModel],
    ["Price", product.price != null ? `${product.price} ${product.priceCurrency ?? "USD"}` : undefined],
    ["Stack Fit", meta?.stackFitRole],
    ["Maturity", meta?.maturityLevel],
    ["Release Cadence", meta?.releaseCadence],
    ["Setup Difficulty", meta?.setupDifficulty],
    ["Learning Curve", meta?.learningCurve],
  ];
  return (
    <div className="space-y-2 text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex items-center justify-between gap-2 border-b pb-1">
          <span className="text-muted-foreground">{k}</span>
          <span className="font-medium text-right">{v ?? "N/A"}</span>
        </div>
      ))}
      {meta?.bestForTags?.length ? (
        <div className="pt-1 flex flex-wrap gap-2">
          {meta.bestForTags.map((t: string) => <Badge key={t} variant="outline">{t}</Badge>)}
        </div>
      ) : null}
    </div>
  );
}

export function CoreMetaPanel({ product, meta }: Props) {
  return (
    <>
      <Card className="hidden lg:block sticky top-24 border-primary/25">
        <CardHeader><CardTitle className="text-base">Core Meta Panel</CardTitle></CardHeader>
        <CardContent><MetaBody product={product} meta={meta} /></CardContent>
      </Card>
      <div className="lg:hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value="meta">
            <AccordionTrigger>Core Meta Panel</AccordionTrigger>
            <AccordionContent><MetaBody product={product} meta={meta} /></AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </>
  );
}
