import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Lock, ArrowRight } from "lucide-react";

interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  format: string;
  pages?: number;
  badge?: string;
  url?: string;
}

const products: DigitalProduct[] = [
  {
    id: "state-of-saas-trust-2026",
    title: "State of SaaS Trust 2026",
    description: "Annual report analyzing trust, privacy, and security practices across 200+ SaaS products. Includes vendor rankings, breach analysis, and compliance trends.",
    price: "$29",
    format: "PDF",
    pages: 85,
    badge: "New",
    url: "/report/state-of-saas-trust-2026",
  },
  {
    id: "vendor-due-diligence-checklist",
    title: "Vendor Due Diligence Checklist",
    description: "50-point checklist for evaluating SaaS vendor security, data practices, and lock-in risk before purchase.",
    price: "$19",
    format: "PDF + Notion Template",
    pages: 24,
    badge: "Bestseller",
  },
  {
    id: "tech-stack-audit-template",
    title: "Tech Stack Audit Template",
    description: "Self-audit your current tech stack for redundancy, cost optimization, and integration gaps.",
    price: "$14",
    format: "Notion Template",
  },
];

const DigitalProductsPanel = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Reports & Templates</h2>
          <p className="text-sm text-muted-foreground">In-depth analysis and tools for informed decisions</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                {product.badge && <Badge variant="secondary" className="text-[10px]">{product.badge}</Badge>}
              </div>
              <CardTitle className="text-base mt-3">{product.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <p className="text-sm text-muted-foreground flex-1">{product.description}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Download className="h-3 w-3" />
                  <span>{product.format}</span>
                  {product.pages && <span>· {product.pages} pages</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold">{product.price}</span>
                  {product.url ? (
                    <Button size="sm" variant="default" asChild>
                      <a href={product.url}>View <ArrowRight className="h-3 w-3 ml-1" /></a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="default">
                      <Lock className="h-3 w-3 mr-1" /> Purchase
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DigitalProductsPanel;
