/**
 * S8: TCO Calculator
 * Total Cost of Ownership over 1–3 years.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { Calculator, Leaf, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TcoCalculatorProps {
  productId: Id<"novaProducts">;
  productName?: string;
  basePrice?: number;
  className?: string;
}

export function TcoCalculator({
  productId,
  productName = "Product",
  basePrice = 0,
  className,
}: TcoCalculatorProps) {
  const [years, setYears] = useState(3);
  const [licensePerYear, setLicensePerYear] = useState(0);
  const [supportPerYear, setSupportPerYear] = useState(0);

  const tco = useQuery(api["tco/personalizedTco"].getPersonalizedTco, {
    productId,
  });

  const totalTco = tco?.totalTco ?? basePrice + years * (licensePerYear + supportPerYear);
  const year1Cost = basePrice + licensePerYear + supportPerYear;
  const year2Cost = licensePerYear + supportPerYear;
  const year3Cost = licensePerYear + supportPerYear;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          TCO Calculator
        </CardTitle>
        <CardDescription>
          Total Cost of Ownership for {productName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Years</Label>
          <Slider
            value={[years]}
            onValueChange={([v]) => setYears(v)}
            min={1}
            max={5}
            step={1}
          />
          <span className="text-xs text-muted-foreground">{years} year{years > 1 ? "s" : ""}</span>
        </div>
        <div className="space-y-2">
          <Label>License / Year (€)</Label>
          <Input
            type="number"
            value={licensePerYear || ""}
            onChange={(e) => setLicensePerYear(Number(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label>Support / Year (€)</Label>
          <Input
            type="number"
            value={supportPerYear || ""}
            onChange={(e) => setSupportPerYear(Number(e.target.value) || 0)}
            placeholder="0"
          />
        </div>
        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Year 1</span>
            <span className="font-medium">€{(basePrice + licensePerYear + supportPerYear).toLocaleString()}</span>
          </div>
          {years >= 2 && (
            <div className="flex justify-between text-sm">
              <span>Year 2</span>
              <span className="font-medium">€{(licensePerYear + supportPerYear).toLocaleString()}</span>
            </div>
          )}
          {years >= 3 && (
            <div className="flex justify-between text-sm">
              <span>Year 3</span>
              <span className="font-medium">€{(licensePerYear + supportPerYear).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between pt-2 border-t font-semibold">
            <span>Total TCO</span>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              €{totalTco.toLocaleString()}
            </Badge>
          </div>
          {tco?.ecoScore != null && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Leaf className="h-3 w-3" />
              Eco score: {tco.ecoScore}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
