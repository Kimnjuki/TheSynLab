import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export function RoiEstimatorCard({ productId, userId }: { productId: string; userId?: string }) {
  const saveRoi = useMutation(api.roiCalculations.save);
  const [teamSize, setTeamSize] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(30);
  const [currentToolCost, setCurrentToolCost] = useState(99);
  const estimatedTimeSavingHours = Math.max(1, teamSize * 2);

  const result = useMemo(() => {
    const monthlyValue = estimatedTimeSavingHours * hourlyRate;
    const net = monthlyValue - currentToolCost;
    const roi = currentToolCost > 0 ? (net / currentToolCost) * 100 : 0;
    const payback = net > 0 ? currentToolCost / net : undefined;
    return { roi, payback, monthlyValue };
  }, [estimatedTimeSavingHours, hourlyRate, currentToolCost]);

  const submit = async () => {
    await saveRoi({
      userId,
      productId: productId as any,
      teamSize,
      currentToolCost,
      estimatedTimeSavingHours,
      hourlyRate,
      calculatedRoi: Number(result.roi.toFixed(2)),
      paybackPeriodMonths: result.payback ? Number(result.payback.toFixed(2)) : undefined,
    });
    toast.success("ROI estimate saved");
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">ROI Estimator</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div><Label htmlFor="teamSize">Team Size</Label><Input id="teamSize" type="number" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} /></div>
          <div><Label htmlFor="hourlyRate">Hourly Rate</Label><Input id="hourlyRate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} /></div>
        </div>
        <div><Label htmlFor="toolCost">Current Monthly Tool Cost</Label><Input id="toolCost" type="number" value={currentToolCost} onChange={(e) => setCurrentToolCost(Number(e.target.value))} /></div>
        <div className="rounded-lg bg-muted p-3 text-sm">
          <p>Estimated ROI: <strong>{result.roi.toFixed(1)}%</strong></p>
          <p>Hours Saved / Month: <strong>{estimatedTimeSavingHours}</strong></p>
          <p>Payback: <strong>{result.payback ? `${result.payback.toFixed(1)} months` : "N/A"}</strong></p>
        </div>
        <Button onClick={submit} aria-label="Save ROI estimate">Save ROI estimate</Button>
      </CardContent>
    </Card>
  );
}
