import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Clock, Calendar, Zap, Battery, Wifi, AlertTriangle, CheckCircle,
  TrendingUp, TrendingDown, Gauge, Thermometer, DollarSign, BarChart3
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area
} from "recharts";

// Humai.blog inspired long-term testing data
interface LongTermTestResult {
  deviceId: number;
  deviceName: string;
  brand: string;
  testDuration: number; // months
  totalInvestment: number;
  startDate: string;
  status: "ongoing" | "completed";
  metrics: {
    reliability: number; // 0-100
    energyEfficiency: number;
    connectivityUptime: number;
    appStability: number;
    firmwareUpdates: number;
  };
  energyData: Array<{ month: string; kwh: number; cost: number }>;
  issuesLogged: number;
  majorFailures: number;
  hypeVsReality: {
    marketingClaims: string[];
    actualPerformance: string[];
    verdict: "exceeds" | "meets" | "below";
  };
  recommendations: string[];
}

interface LongTermTestingViewProps {
  devices: Array<{
    id: number;
    name: string;
    brand: string;
    priceValue: number;
  }>;
}

const LongTermTestingView = ({ devices }: LongTermTestingViewProps) => {
  const [selectedDevice, setSelectedDevice] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"overview" | "detailed">("overview");

  // Simulated long-term test data (Humai.blog style)
  const testResults: LongTermTestResult[] = devices.slice(0, 6).map((device, idx) => ({
    deviceId: device.id,
    deviceName: device.name,
    brand: device.brand,
    testDuration: [6, 12, 8, 4, 10, 6][idx] || 6,
    totalInvestment: device.priceValue,
    startDate: new Date(Date.now() - (idx + 4) * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: idx < 4 ? "completed" : "ongoing",
    metrics: {
      reliability: Math.floor(Math.random() * 20) + 75,
      energyEfficiency: Math.floor(Math.random() * 25) + 70,
      connectivityUptime: Math.floor(Math.random() * 10) + 88,
      appStability: Math.floor(Math.random() * 15) + 80,
      firmwareUpdates: Math.floor(Math.random() * 8) + 2,
    },
    energyData: Array.from({ length: 6 }, (_, i) => ({
      month: `Month ${i + 1}`,
      kwh: Math.floor(Math.random() * 20) + 10,
      cost: Math.floor(Math.random() * 5) + 2,
    })),
    issuesLogged: Math.floor(Math.random() * 12) + 1,
    majorFailures: Math.floor(Math.random() * 2),
    hypeVsReality: {
      marketingClaims: [
        "50% energy savings",
        "Seamless voice control",
        "Works with all ecosystems"
      ],
      actualPerformance: [
        `${Math.floor(Math.random() * 20) + 25}% actual savings`,
        "Voice control works 85% of the time",
        "Full support for 2 of 4 ecosystems"
      ],
      verdict: ["exceeds", "meets", "below"][Math.floor(Math.random() * 3)] as "exceeds" | "meets" | "below"
    },
    recommendations: [
      "Best for small to medium homes",
      "Consider dedicated hub for best performance",
      "Wait for Matter certification update"
    ].slice(0, Math.floor(Math.random() * 2) + 1)
  }));

  const totalInvestment = testResults.reduce((acc, t) => acc + t.totalInvestment, 0);
  const avgReliability = Math.round(testResults.reduce((acc, t) => acc + t.metrics.reliability, 0) / testResults.length);
  const completedTests = testResults.filter(t => t.status === "completed").length;

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case "exceeds": return "text-success bg-success/10 border-success/20";
      case "meets": return "text-primary bg-primary/10 border-primary/20";
      case "below": return "text-destructive bg-destructive/10 border-destructive/20";
      default: return "";
    }
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case "exceeds": return "Exceeds Expectations";
      case "meets": return "Meets Claims";
      case "below": return "Below Marketing Hype";
      default: return "";
    }
  };

  const selectedTest = testResults.find(t => t.deviceId === selectedDevice);

  return (
    <div className="space-y-6">
      {/* Hero Stats (Humai.blog style) */}
      <Card className="border-accent/20 bg-gradient-to-r from-accent/5 via-transparent to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                <Clock className="h-8 w-8 text-accent-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">Long-Term Testing Lab</h3>
                <p className="text-muted-foreground">
                  Real-world performance data from 6+ month device testing
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-accent">${totalInvestment.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Investment</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{testResults.length}</p>
                <p className="text-sm text-muted-foreground">Devices Tested</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-success">{avgReliability}%</p>
                <p className="text-sm text-muted-foreground">Avg Reliability</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Toggle */}
      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="detailed">Detailed Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Test Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testResults.map((test) => (
              <Card 
                key={test.deviceId} 
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedDevice === test.deviceId ? 'ring-2 ring-primary' : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedDevice(test.deviceId)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{test.deviceName}</CardTitle>
                      <CardDescription>{test.brand}</CardDescription>
                    </div>
                    <Badge variant={test.status === "ongoing" ? "default" : "secondary"}>
                      {test.status === "ongoing" ? (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          {test.testDuration}mo
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </>
                      )}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-1 mb-1">
                        <Gauge className="h-3.5 w-3.5 text-primary" />
                        <span className="text-xs">Reliability</span>
                      </div>
                      <p className="text-lg font-bold">{test.metrics.reliability}%</p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-1 mb-1">
                        <Wifi className="h-3.5 w-3.5 text-success" />
                        <span className="text-xs">Uptime</span>
                      </div>
                      <p className="text-lg font-bold">{test.metrics.connectivityUptime}%</p>
                    </div>
                  </div>

                  {/* Hype vs Reality Verdict */}
                  <div className={`p-2 rounded-lg border ${getVerdictColor(test.hypeVsReality.verdict)}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">Hype vs Reality:</span>
                      <Badge variant="outline" className={getVerdictColor(test.hypeVsReality.verdict)}>
                        {test.hypeVsReality.verdict === "exceeds" && <TrendingUp className="h-3 w-3 mr-1" />}
                        {test.hypeVsReality.verdict === "below" && <TrendingDown className="h-3 w-3 mr-1" />}
                        {getVerdictLabel(test.hypeVsReality.verdict)}
                      </Badge>
                    </div>
                  </div>

                  {/* Issue Count */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <AlertTriangle className="h-4 w-4" />
                      Issues: {test.issuesLogged}
                    </span>
                    <span className="text-muted-foreground">
                      Failures: {test.majorFailures}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6 mt-6">
          {selectedTest ? (
            <>
              {/* Detailed View Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedTest.deviceName}</CardTitle>
                      <CardDescription>
                        {selectedTest.testDuration} month test • Started {selectedTest.startDate}
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setSelectedDevice(null)}>
                      Back to Overview
                    </Button>
                  </div>
                </CardHeader>
              </Card>

              {/* Metrics Deep Dive */}
              <div className="grid md:grid-cols-5 gap-4">
                {[
                  { label: "Reliability", value: selectedTest.metrics.reliability, icon: Gauge },
                  { label: "Energy Efficiency", value: selectedTest.metrics.energyEfficiency, icon: Zap },
                  { label: "Connectivity", value: selectedTest.metrics.connectivityUptime, icon: Wifi },
                  { label: "App Stability", value: selectedTest.metrics.appStability, icon: BarChart3 },
                  { label: "FW Updates", value: selectedTest.metrics.firmwareUpdates, icon: Clock, isCount: true },
                ].map((metric) => (
                  <Card key={metric.label}>
                    <CardContent className="p-4 text-center">
                      <metric.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                      <p className="text-2xl font-bold">
                        {metric.value}{!metric.isCount && '%'}
                      </p>
                      <p className="text-sm text-muted-foreground">{metric.label}</p>
                      {!metric.isCount && (
                        <Progress value={metric.value} className="h-1.5 mt-2" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Energy Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-accent" />
                    Energy Consumption Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={selectedTest.energyData}>
                      <defs>
                        <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <RechartsTooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }} 
                      />
                      <Area type="monotone" dataKey="kwh" stroke="hsl(var(--accent))" fill="url(#colorEnergy)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Hype vs Reality Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Hype vs Reality Analysis</CardTitle>
                  <CardDescription>Comparing marketing claims to actual performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-medium text-muted-foreground">Marketing Claims</h4>
                      {selectedTest.hypeVsReality.marketingClaims.map((claim, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-muted/50">
                          <span className="text-muted-foreground">•</span>
                          <span className="text-sm">{claim}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-medium text-muted-foreground">Actual Performance</h4>
                      {selectedTest.hypeVsReality.actualPerformance.map((perf, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-primary/5 border border-primary/20">
                          <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-sm">{perf}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card>
                <CardHeader>
                  <CardTitle>Our Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedTest.recommendations.map((rec, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                        <CheckCircle className="h-5 w-5 text-success shrink-0" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a device for detailed analysis</h3>
                <p className="text-muted-foreground">Click on any device card in the Overview tab</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LongTermTestingView;
