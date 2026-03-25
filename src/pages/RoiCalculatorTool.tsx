import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SEOHead } from "@/components/seo/SEOHead";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";

export default function RoiCalculatorTool() {
  const [teamSize, setTeamSize] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(50);
  const [monthlyCost, setMonthlyCost] = useState(300);
  const annualValue = useMemo(() => teamSize * hourlyRate * 2 * 12, [teamSize, hourlyRate]);
  const roi = useMemo(() => (monthlyCost > 0 ? (annualValue / (monthlyCost * 12)) * 100 : 0), [annualValue, monthlyCost]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead
        title="AI Tool ROI Calculator | TheSynLab"
        metaDescription="Calculate expected ROI and payback period for AI and smart home tools."
        canonicalUrl="/tools/roi-calculator"
      />
      <Header />
      <main className="container mx-auto px-4 py-10 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>ROI Calculator</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="teamSize">Team size</Label>
                <Input id="teamSize" type="number" value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="hourlyRate">Hourly rate</Label>
                <Input id="hourlyRate" type="number" value={hourlyRate} onChange={(e) => setHourlyRate(Number(e.target.value))} />
              </div>
              <div>
                <Label htmlFor="monthlyCost">Monthly tool cost</Label>
                <Input id="monthlyCost" type="number" value={monthlyCost} onChange={(e) => setMonthlyCost(Number(e.target.value))} />
              </div>
            </div>
            <div className="rounded-lg border p-4 text-sm">
              <div>Estimated annual value: <span className="font-semibold">${annualValue.toFixed(2)}</span></div>
              <div>Estimated ROI: <span className="font-semibold">{roi.toFixed(2)}%</span></div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
