/**
 * S9: ROI Calculator
 * Payback period and ROI from time savings.
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { TrendingUp, Clock, Users, DollarSign, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface RoiCalculatorProps {
  productId?: Id<"novaProducts"> | string;
  productName?: string;
  currentToolCost?: number;
  userId?: string;
  className?: string;
}

export function RoiCalculator({
  productId,
  productName = "Product",
  currentToolCost = 0,
  userId,
  className,
}: RoiCalculatorProps) {
  const [teamSize, setTeamSize] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [timeSavingHours, setTimeSavingHours] = useState(20);
  const [toolCost, setToolCost] = useState(currentToolCost || 999);
  const [isSaving, setIsSaving] = useState(false);

  const saveRoi = useMutation(api.roiCalculations.save);

  const monthlySavings = teamSize * (timeSavingHours / 12) * hourlyRate;
  const paybackMonths = toolCost > 0 ? Math.ceil(toolCost / monthlySavings) : 0;
  const annualRoiNum = toolCost > 0
    ? ((monthlySavings * 12 - toolCost) / toolCost) * 100
    : 0;
  const annualRoi = toolCost > 0 ? annualRoiNum.toFixed(0) : "—";

  const handleSave = async () => {
    if (!productId) {
      toast.error("Product ID required to save");
      return;
    }
    setIsSaving(true);
    try {
      await saveRoi({
        userId,
        productId: productId as Id<"novaProducts">,
        teamSize,
        currentToolCost: toolCost,
        estimatedTimeSavingHours: timeSavingHours,
        hourlyRate,
        calculatedRoi: annualRoiNum,
        paybackPeriodMonths: paybackMonths > 0 ? paybackMonths : undefined,
      });
      toast.success("ROI calculation saved");
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          ROI Calculator
        </CardTitle>
        <CardDescription>
          Estimate payback for {productName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Users className="h-3 w-3" /> Team size
          </Label>
          <Slider
            value={[teamSize]}
            onValueChange={([v]) => setTeamSize(v)}
            min={1}
            max={50}
            step={1}
          />
          <span className="text-xs text-muted-foreground">{teamSize} people</span>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <DollarSign className="h-3 w-3" /> Hourly rate (€)
          </Label>
          <Input
            type="number"
            value={hourlyRate || ""}
            onChange={(e) => setHourlyRate(Number(e.target.value) || 0)}
            placeholder="50"
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> Time saved / person / month (h)
          </Label>
          <Input
            type="number"
            value={timeSavingHours || ""}
            onChange={(e) => setTimeSavingHours(Number(e.target.value) || 0)}
            placeholder="20"
          />
        </div>
        <div className="space-y-2">
          <Label>Annual tool cost (€)</Label>
          <Input
            type="number"
            value={toolCost || ""}
            onChange={(e) => setToolCost(Number(e.target.value) || 0)}
            placeholder="999"
          />
        </div>
        <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly savings</span>
            <span className="font-medium">€{monthlySavings.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Payback period</span>
            <Badge variant={paybackMonths <= 6 ? "default" : "secondary"}>
              {paybackMonths > 0 ? `${paybackMonths} months` : "—"}
            </Badge>
          </div>
          <div className="flex justify-between text-sm">
            <span>Annual ROI</span>
            <span className="font-semibold text-green-600">{annualRoi}%</span>
          </div>
        </div>
        {productId && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2"
            onClick={handleSave}
            disabled={isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving…" : "Save calculation"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
