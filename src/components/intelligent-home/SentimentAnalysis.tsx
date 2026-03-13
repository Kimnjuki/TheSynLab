import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Brain, MessageSquare, ThumbsUp, ThumbsDown, Minus, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle, Search, BarChart3, Sparkles, Eye
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Birdie.ai inspired sentiment data structure
interface SentimentData {
  deviceId: number;
  deviceName: string;
  brand: string;
  category: string;
  birdieScore: number; // 0-100 composite score
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  reviewCount: number;
  topPositives: string[];
  topNegatives: string[];
  predictedIssues: string[];
  sentimentTrend: "improving" | "stable" | "declining";
  lastAnalyzed: string;
}

interface SentimentAnalysisProps {
  devices: Array<{
    id: number;
    name: string;
    brand: string;
    category: string;
    reviewCount: number;
    rating: number;
    trustScore: number;
  }>;
}

const SentimentAnalysis = ({ devices }: SentimentAnalysisProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"score" | "reviews" | "trend">("score");

  // Generate simulated sentiment data (in production, this would come from NLP analysis)
  const sentimentData: SentimentData[] = useMemo(() => {
    return devices.map((device) => {
      const positive = Math.floor(Math.random() * 30) + 50; // 50-80%
      const negative = Math.floor(Math.random() * 15) + 5;  // 5-20%
      const neutral = 100 - positive - negative;
      
      // Birdie Score calculation (composite of sentiment, volume, trend)
      const birdieScore = Math.round(
        (positive * 0.6) + 
        (device.rating * 8) + 
        (Math.min(device.reviewCount / 100, 20))
      );

      return {
        deviceId: device.id,
        deviceName: device.name,
        brand: device.brand,
        category: device.category,
        birdieScore: Math.min(birdieScore, 100),
        sentimentBreakdown: { positive, neutral, negative },
        reviewCount: device.reviewCount,
        topPositives: [
          "Easy setup and reliable connection",
          "Great app experience",
          "Excellent Matter/Thread support"
        ].slice(0, Math.floor(Math.random() * 2) + 2),
        topNegatives: [
          "Occasional connectivity drops",
          "Limited automation options",
          "Slow firmware updates"
        ].slice(0, Math.floor(Math.random() * 2) + 1),
        predictedIssues: positive > 70 ? [] : [
          "Potential connectivity issues in large homes",
          "May require hub restart after power outage"
        ].slice(0, Math.floor(Math.random() * 2)),
        sentimentTrend: positive > 70 ? "improving" : positive > 55 ? "stable" : "declining",
        lastAnalyzed: "2 hours ago"
      };
    });
  }, [devices]);

  const categories = [...new Set(devices.map(d => d.category))];

  const filteredData = sentimentData
    .filter(item => {
      const matchesSearch = item.deviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score": return b.birdieScore - a.birdieScore;
        case "reviews": return b.reviewCount - a.reviewCount;
        case "trend": 
          const trendOrder = { improving: 0, stable: 1, declining: 2 };
          return trendOrder[a.sentimentTrend] - trendOrder[b.sentimentTrend];
        default: return 0;
      }
    });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-primary";
    if (score >= 40) return "text-accent";
    return "text-destructive";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 60) return "Good";
    if (score >= 40) return "Fair";
    return "Poor";
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving": return <TrendingUp className="h-4 w-4 text-success" />;
      case "declining": return <TrendingDown className="h-4 w-4 text-destructive" />;
      default: return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Summary stats
  const avgScore = Math.round(sentimentData.reduce((acc, d) => acc + d.birdieScore, 0) / sentimentData.length);
  const totalReviews = sentimentData.reduce((acc, d) => acc + d.reviewCount, 0);
  const improvingCount = sentimentData.filter(d => d.sentimentTrend === "improving").length;

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header with Birdie.ai branding style */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Brain className="h-7 w-7 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    NLP Sentiment Analysis
                    <Badge variant="outline" className="text-xs">AI-Powered</Badge>
                  </h3>
                  <p className="text-muted-foreground">
                    Analyzing {totalReviews.toLocaleString()}+ reviews with machine learning
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className={`text-3xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
                  <p className="text-xs text-muted-foreground">Avg Birdie Score</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-success">{improvingCount}</p>
                  <p className="text-xs text-muted-foreground">Trending Up</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search devices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "score" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("score")}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Score
            </Button>
            <Button
              variant={sortBy === "reviews" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("reviews")}
            >
              <Eye className="h-4 w-4 mr-1" />
              Reviews
            </Button>
            <Button
              variant={sortBy === "trend" ? "default" : "outline"}
              size="sm"
              onClick={() => setSortBy("trend")}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              Trend
            </Button>
          </div>
        </div>

        {/* Sentiment Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredData.map((item) => (
            <Card key={item.deviceId} className="hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{item.deviceName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{item.brand}</Badge>
                      <Badge variant="secondary">{item.category}</Badge>
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={`text-3xl font-bold ${getScoreColor(item.birdieScore)}`}>
                        {item.birdieScore}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Birdie Score: {getScoreLabel(item.birdieScore)}</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Sentiment Breakdown Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sentiment</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(item.sentimentTrend)}
                      <span className="text-xs capitalize">{item.sentimentTrend}</span>
                    </div>
                  </div>
                  <div className="flex h-3 rounded-full overflow-hidden">
                    <div 
                      className="bg-success" 
                      style={{ width: `${item.sentimentBreakdown.positive}%` }}
                    />
                    <div 
                      className="bg-muted" 
                      style={{ width: `${item.sentimentBreakdown.neutral}%` }}
                    />
                    <div 
                      className="bg-destructive" 
                      style={{ width: `${item.sentimentBreakdown.negative}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3 text-success" />
                      {item.sentimentBreakdown.positive}%
                    </span>
                    <span>{item.reviewCount.toLocaleString()} reviews</span>
                    <span className="flex items-center gap-1">
                      <ThumbsDown className="h-3 w-3 text-destructive" />
                      {item.sentimentBreakdown.negative}%
                    </span>
                  </div>
                </div>

                {/* Top Insights */}
                <div className="space-y-2">
                  {item.topPositives.slice(0, 2).map((pos, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{pos}</span>
                    </div>
                  ))}
                  {item.topNegatives.slice(0, 1).map((neg, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{neg}</span>
                    </div>
                  ))}
                </div>

                {/* Predicted Issues Warning */}
                {item.predictedIssues.length > 0 && (
                  <div className="p-2 rounded-lg bg-destructive/5 border border-destructive/20">
                    <div className="flex items-center gap-2 text-xs text-destructive">
                      <Brain className="h-3.5 w-3.5" />
                      <span className="font-medium">AI Prediction:</span>
                      <span>{item.predictedIssues[0]}</span>
                    </div>
                  </div>
                )}

                <p className="text-xs text-muted-foreground">
                  Last analyzed: {item.lastAnalyzed}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SentimentAnalysis;
