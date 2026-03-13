import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  TrendingUp, TrendingDown, BarChart3, Globe, Users, DollarSign,
  Eye, Target, Zap, Calendar, ArrowUpRight, ArrowDownRight, Minus
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, ResponsiveContainer, Cell
} from "recharts";

// OMDIA/Contify inspired competitive intelligence
interface MarketData {
  brand: string;
  marketShare: number;
  shareChange: number;
  revenue: number;
  units: number;
  growth: number;
  forecast2027: number;
}

interface CompetitorMetric {
  competitor: string;
  webTraffic: number;
  socialFollowing: number;
  reviewSentiment: number;
  priceIndex: number;
  innovationScore: number;
}

interface TrendData {
  month: string;
  matter: number;
  thread: number;
  zigbee: number;
  wifi: number;
}

const CompetitiveIntelPanel = () => {
  const [selectedView, setSelectedView] = useState<"market" | "competitor" | "forecast">("market");

  // Market share data (OMDIA style)
  const marketData: MarketData[] = [
    { brand: "Amazon (Ring/Echo)", marketShare: 28.5, shareChange: -2.1, revenue: 4200, units: 32000, growth: 8, forecast2027: 26.2 },
    { brand: "Google (Nest)", marketShare: 22.3, shareChange: 1.5, revenue: 3100, units: 24500, growth: 15, forecast2027: 24.8 },
    { brand: "Apple (HomeKit)", marketShare: 15.8, shareChange: 3.2, revenue: 2800, units: 12000, growth: 22, forecast2027: 19.5 },
    { brand: "Samsung (SmartThings)", marketShare: 12.4, shareChange: 0.8, revenue: 1800, units: 15000, growth: 12, forecast2027: 13.2 },
    { brand: "Philips Hue", marketShare: 8.2, shareChange: -0.5, revenue: 1200, units: 18000, growth: 5, forecast2027: 7.8 },
    { brand: "Others", marketShare: 12.8, shareChange: -2.9, revenue: 1900, units: 22000, growth: 3, forecast2027: 8.5 },
  ];

  // Competitor analysis data (Contify style)
  const competitorMetrics: CompetitorMetric[] = [
    { competitor: "Amazon Alexa", webTraffic: 95, socialFollowing: 92, reviewSentiment: 78, priceIndex: 85, innovationScore: 88 },
    { competitor: "Google Home", webTraffic: 88, socialFollowing: 85, reviewSentiment: 82, priceIndex: 80, innovationScore: 92 },
    { competitor: "Apple HomeKit", webTraffic: 72, socialFollowing: 78, reviewSentiment: 91, priceIndex: 65, innovationScore: 85 },
    { competitor: "Samsung SmartThings", webTraffic: 65, socialFollowing: 62, reviewSentiment: 75, priceIndex: 88, innovationScore: 78 },
  ];

  // Protocol adoption trends
  const trendData: TrendData[] = [
    { month: "Jan", matter: 15, thread: 12, zigbee: 45, wifi: 28 },
    { month: "Feb", matter: 22, thread: 18, zigbee: 43, wifi: 27 },
    { month: "Mar", matter: 28, thread: 24, zigbee: 42, wifi: 26 },
    { month: "Apr", matter: 35, thread: 30, zigbee: 40, wifi: 25 },
    { month: "May", matter: 42, thread: 36, zigbee: 38, wifi: 24 },
    { month: "Jun", matter: 48, thread: 42, zigbee: 36, wifi: 24 },
  ];

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUpRight className="h-4 w-4 text-success" />;
    if (change < 0) return <ArrowDownRight className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-success";
    if (change < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const totalMarketSize = marketData.reduce((acc, d) => acc + d.revenue, 0);

  return (
    <div className="space-y-6">
      {/* Header (Contify/OMDIA style) */}
      <Card className="border-secondary/20 bg-gradient-to-r from-secondary/5 via-transparent to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                <Globe className="h-7 w-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  Competitive Intelligence Hub
                  <Badge variant="outline" className="text-xs bg-secondary/10">Enterprise</Badge>
                </h3>
                <p className="text-muted-foreground">
                  Market data, competitor tracking, and 2027 forecasts
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">${(totalMarketSize / 1000).toFixed(1)}B</p>
                <p className="text-xs text-muted-foreground">Market Size (2024)</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">+12.5%</p>
                <p className="text-xs text-muted-foreground">YoY Growth</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Tabs */}
      <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as typeof selectedView)}>
        <TabsList className="grid grid-cols-3 w-full lg:w-auto lg:inline-grid">
          <TabsTrigger value="market" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Market Share
          </TabsTrigger>
          <TabsTrigger value="competitor" className="gap-2">
            <Target className="h-4 w-4" />
            Competitor Analysis
          </TabsTrigger>
          <TabsTrigger value="forecast" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Forecasts & Trends
          </TabsTrigger>
        </TabsList>

        {/* Market Share Tab */}
        <TabsContent value="market" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Market Share Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Market Share Distribution</CardTitle>
                <CardDescription>Smart home device market (2024)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={marketData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis dataKey="brand" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={120} />
                    <RechartsTooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Bar dataKey="marketShare" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]}>
                      {marketData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={index === 0 ? "hsl(var(--primary))" : 
                                index === 1 ? "hsl(var(--secondary))" :
                                index === 2 ? "hsl(var(--accent))" :
                                "hsl(var(--muted-foreground))"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Market Data Table */}
            <Card>
              <CardHeader>
                <CardTitle>Market Performance</CardTitle>
                <CardDescription>Revenue and unit shipments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketData.map((item) => (
                    <div key={item.brand} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.brand}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            ${(item.revenue / 1000).toFixed(1)}B revenue
                          </span>
                          <span className="text-xs text-muted-foreground">
                            • {(item.units / 1000).toFixed(1)}M units
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.marketShare}%</p>
                        <div className={`flex items-center justify-end gap-1 text-xs ${getChangeColor(item.shareChange)}`}>
                          {getChangeIcon(item.shareChange)}
                          {Math.abs(item.shareChange)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competitor Analysis Tab */}
        <TabsContent value="competitor" className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitorMetrics.map((competitor) => (
              <Card key={competitor.competitor} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{competitor.competitor}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { label: "Web Traffic", value: competitor.webTraffic, icon: Globe },
                    { label: "Social Following", value: competitor.socialFollowing, icon: Users },
                    { label: "Review Sentiment", value: competitor.reviewSentiment, icon: Eye },
                    { label: "Price Index", value: competitor.priceIndex, icon: DollarSign },
                    { label: "Innovation", value: competitor.innovationScore, icon: Zap },
                  ].map((metric) => (
                    <div key={metric.label} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <metric.icon className="h-3.5 w-3.5" />
                          {metric.label}
                        </span>
                        <span className="font-medium">{metric.value}</span>
                      </div>
                      <Progress value={metric.value} className="h-1.5" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Competitive Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-accent" />
                Key Competitive Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <h4 className="font-medium text-success mb-2">Opportunities</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>Matter adoption creating new market entry points</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span>Privacy-focused segment growing 35% YoY</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                  <h4 className="font-medium text-accent mb-2">Threats</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span>Big tech consolidating ecosystem control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingDown className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span>Subscription fatigue impacting premium tiers</span>
                    </li>
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <h4 className="font-medium text-primary mb-2">Trends to Watch</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>AI integration becoming table stakes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span>Local processing for privacy concerns</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecasts Tab */}
        <TabsContent value="forecast" className="space-y-6 mt-6">
          {/* Protocol Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Protocol Adoption Trends</CardTitle>
              <CardDescription>New device shipments by protocol (% of market)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
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
                  <Line type="monotone" dataKey="matter" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="thread" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="zigbee" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="wifi" stroke="hsl(var(--muted-foreground))" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-sm">Matter</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-secondary" />
                  <span className="text-sm">Thread</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-sm">Zigbee</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                  <span className="text-sm">WiFi</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2027 Forecast Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-3 text-primary" />
                <p className="text-4xl font-bold text-primary">$18.2B</p>
                <p className="text-sm text-muted-foreground mb-2">Market Size by 2027</p>
                <Badge variant="outline" className="text-success border-success/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +45% from 2024
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-3 text-secondary" />
                <p className="text-4xl font-bold text-secondary">78%</p>
                <p className="text-sm text-muted-foreground mb-2">Matter Adoption by 2027</p>
                <Badge variant="outline" className="text-success border-success/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  From 15% today
                </Badge>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-accent" />
                <p className="text-4xl font-bold text-accent">890M</p>
                <p className="text-sm text-muted-foreground mb-2">Connected Homes by 2027</p>
                <Badge variant="outline" className="text-success border-success/30">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +120% growth
                </Badge>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetitiveIntelPanel;
