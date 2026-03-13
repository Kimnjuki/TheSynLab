import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  BarChart3, TrendingUp, TrendingDown, Activity, Zap, Clock, 
  Users, Eye, ThumbsUp, MessageSquare, RefreshCw, Download
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, Legend
} from "recharts";

interface AnalyticsMetric {
  label: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ElementType;
}

interface TimeSeriesData {
  date: string;
  reviews: number;
  comparisons: number;
  troubleshooting: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface AnalyticsDashboardProps {
  totalDevices: number;
  totalReviews: number;
  avgTrustScore: number;
  avgIntegrationScore: number;
}

const AnalyticsDashboard = ({ 
  totalDevices, 
  totalReviews, 
  avgTrustScore, 
  avgIntegrationScore 
}: AnalyticsDashboardProps) => {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Real-time style metrics (Slingshot/Grow inspired)
  const metrics: AnalyticsMetric[] = [
    { label: "Devices Reviewed", value: totalDevices, change: 12, changeLabel: "vs last month", icon: Activity },
    { label: "Community Reviews", value: totalReviews.toLocaleString(), change: 23, changeLabel: "vs last month", icon: MessageSquare },
    { label: "Avg Trust Score", value: avgTrustScore.toFixed(1), change: 0.3, changeLabel: "improvement", icon: ThumbsUp },
    { label: "Avg Integration", value: avgIntegrationScore.toFixed(1), change: 0.5, changeLabel: "improvement", icon: Zap },
  ];

  // Time series data (simulated real-time)
  const timeSeriesData: TimeSeriesData[] = [
    { date: "Week 1", reviews: 45, comparisons: 120, troubleshooting: 78 },
    { date: "Week 2", reviews: 52, comparisons: 145, troubleshooting: 82 },
    { date: "Week 3", reviews: 48, comparisons: 132, troubleshooting: 95 },
    { date: "Week 4", reviews: 67, comparisons: 178, troubleshooting: 104 },
    { date: "Week 5", reviews: 72, comparisons: 195, troubleshooting: 112 },
    { date: "Week 6", reviews: 85, comparisons: 210, troubleshooting: 98 },
  ];

  // Category breakdown (Contify/OMDIA style)
  const categoryData: CategoryData[] = [
    { name: "Lighting", value: 28, color: "hsl(var(--primary))" },
    { name: "Climate", value: 22, color: "hsl(var(--secondary))" },
    { name: "Security", value: 20, color: "hsl(var(--accent))" },
    { name: "Hubs", value: 15, color: "hsl(var(--success))" },
    { name: "Cameras", value: 10, color: "hsl(var(--destructive))" },
    { name: "Other", value: 5, color: "hsl(var(--muted-foreground))" },
  ];

  // Protocol adoption trends
  const protocolTrends = [
    { protocol: "Matter", adoption: 78, growth: 45 },
    { protocol: "Thread", adoption: 62, growth: 38 },
    { protocol: "Zigbee", adoption: 85, growth: 5 },
    { protocol: "Z-Wave", adoption: 45, growth: -8 },
    { protocol: "WiFi", adoption: 92, growth: 2 },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header with Time Range */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Real-Time Analytics Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Live metrics and trends • Last updated: Just now
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as typeof timeRange)}>
            <TabsList>
              <TabsTrigger value="7d">7D</TabsTrigger>
              <TabsTrigger value="30d">30D</TabsTrigger>
              <TabsTrigger value="90d">90D</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid (Grow.com inspired) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full" />
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className="h-5 w-5 text-primary" />
                <Badge variant="outline" className={`text-xs ${metric.change > 0 ? 'text-success border-success/30' : 'text-destructive border-destructive/30'}`}>
                  {metric.change > 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </Badge>
              </div>
              <p className="text-3xl font-bold">{metric.value}</p>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{metric.changeLabel}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activity Trends (Slingshot style) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Trends</CardTitle>
            <CardDescription>Reviews, comparisons, and troubleshooting over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorComparisons" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Area type="monotone" dataKey="comparisons" stroke="hsl(var(--secondary))" fill="url(#colorComparisons)" strokeWidth={2} />
                <Area type="monotone" dataKey="reviews" stroke="hsl(var(--primary))" fill="url(#colorReviews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution (OMDIA style) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Category Distribution</CardTitle>
            <CardDescription>Device reviews by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  align="right" 
                  verticalAlign="middle"
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Adoption Trends (CompetitorTools.io style) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            Protocol Adoption Trends
          </CardTitle>
          <CardDescription>Market adoption and growth rates for smart home protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {protocolTrends.map((item) => (
              <div key={item.protocol} className="flex items-center gap-4">
                <div className="w-20 font-medium text-sm">{item.protocol}</div>
                <div className="flex-1">
                  <Progress value={item.adoption} className="h-3" />
                </div>
                <div className="w-16 text-right font-medium">{item.adoption}%</div>
                <Badge 
                  variant="outline" 
                  className={`w-20 justify-center ${item.growth > 0 ? 'text-success border-success/30' : 'text-destructive border-destructive/30'}`}
                >
                  {item.growth > 0 ? '+' : ''}{item.growth}% YoY
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;
