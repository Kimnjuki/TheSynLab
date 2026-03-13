import { useState } from "react";
import { Check, X, Minus, ExternalLink, Star, Shield, Wifi, Home, Users, DollarSign, Lock, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export interface Ecosystem {
  id: string;
  name: string;
  logo: string;
  rating: number;
  deviceCount: number;
  matterSupport: 'full' | 'partial' | 'none';
  threadSupport: 'full' | 'partial' | 'none';
  localControl: boolean;
  privacyScore: number;
  priceRange: string;
  pros: string[];
  cons: string[];
  bestFor: string;
  monthlyFee?: number;
  setupDifficulty: 'easy' | 'medium' | 'hard';
  voiceAssistants: string[];
}

interface EcosystemComparisonViewProps {
  ecosystems: Ecosystem[];
}

const EcosystemComparisonView = ({ ecosystems }: EcosystemComparisonViewProps) => {
  const [selectedEcosystems, setSelectedEcosystems] = useState<string[]>([]);
  const [highlightedFeature, setHighlightedFeature] = useState<string | null>(null);

  const getSupportIcon = (support: 'full' | 'partial' | 'none') => {
    switch (support) {
      case 'full': return <Check className="h-5 w-5 text-success" />;
      case 'partial': return <Minus className="h-5 w-5 text-accent" />;
      case 'none': return <X className="h-5 w-5 text-destructive" />;
    }
  };

  const getSupportLabel = (support: 'full' | 'partial' | 'none') => {
    switch (support) {
      case 'full': return 'Full Support';
      case 'partial': return 'Partial Support';
      case 'none': return 'No Support';
    }
  };

  const getSetupColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-accent';
      case 'hard': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const onToggleSelect = (id: string) => {
    setSelectedEcosystems(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const selected = ecosystems.filter(e => selectedEcosystems.includes(e.id));

  const getWinner = (feature: keyof Ecosystem) => {
    if (selected.length < 2) return null;
    
    let best = selected[0];
    for (const eco of selected) {
      const value = eco[feature];
      const bestValue = best[feature];
      
      if (typeof value === 'number' && typeof bestValue === 'number') {
        if (feature === 'monthlyFee') {
          if (value < bestValue) best = eco;
        } else {
          if (value > bestValue) best = eco;
        }
      }
    }
    return best.id;
  };

  const recommendEcosystem = () => {
    const sorted = [...ecosystems].sort((a, b) => {
      const scoreA = a.privacyScore * 0.3 + a.rating * 0.3 + (a.deviceCount / 1000) * 0.2 + (a.localControl ? 2 : 0);
      const scoreB = b.privacyScore * 0.3 + b.rating * 0.3 + (b.deviceCount / 1000) * 0.2 + (b.localControl ? 2 : 0);
      return scoreB - scoreA;
    });
    return sorted[0];
  };

  const recommendation = recommendEcosystem();

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">{ecosystems.length}</p>
              <p className="text-sm text-muted-foreground">Ecosystems</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">
                {ecosystems.reduce((acc, e) => acc + e.deviceCount, 0).toLocaleString()}+
              </p>
              <p className="text-sm text-muted-foreground">Total Devices</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-accent">
                {ecosystems.filter(e => e.matterSupport === 'full').length}
              </p>
              <p className="text-sm text-muted-foreground">Matter Ready</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-secondary">
                {ecosystems.filter(e => e.localControl).length}
              </p>
              <p className="text-sm text-muted-foreground">Local Control</p>
            </CardContent>
          </Card>
        </div>

        {/* Recommendation Card */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-5xl">{recommendation.logo}</div>
                <div>
                  <p className="text-sm text-muted-foreground">Our Top Recommendation</p>
                  <h3 className="text-2xl font-bold">{recommendation.name}</h3>
                  <p className="text-muted-foreground">{recommendation.bestFor}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">{recommendation.privacyScore}/10</p>
                  <p className="text-sm text-muted-foreground">Privacy Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{recommendation.deviceCount}+</p>
                  <p className="text-sm text-muted-foreground">Devices</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ecosystem Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Ecosystems to Compare</CardTitle>
            <CardDescription>Click on ecosystems to add them to comparison (select 2-4 for best results)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {ecosystems.map((eco) => (
                <Card
                  key={eco.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-md ${
                    selectedEcosystems.includes(eco.id)
                      ? 'ring-2 ring-primary border-primary'
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => onToggleSelect(eco.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{eco.logo}</div>
                    <h4 className="font-medium text-sm">{eco.name}</h4>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                      <span className="text-sm text-muted-foreground">{eco.rating}</span>
                    </div>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {eco.deviceCount.toLocaleString()}+ devices
                    </Badge>
                    {selectedEcosystems.includes(eco.id) && (
                      <div className="mt-2">
                        <Check className="h-5 w-5 text-primary mx-auto" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selected.length >= 2 ? (
          <Card>
            <CardHeader>
              <CardTitle>Side-by-Side Comparison</CardTitle>
              <CardDescription>
                Comparing {selected.map(e => e.name).join(' vs ')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-48">Feature</TableHead>
                      {selected.map((eco) => (
                        <TableHead key={eco.id} className="text-center min-w-36">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-3xl">{eco.logo}</span>
                            <span className="font-semibold">{eco.name}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className={highlightedFeature === 'rating' ? 'bg-primary/5' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4" />
                          Overall Rating
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center">
                          <div className={`font-bold text-lg ${getWinner('rating') === eco.id ? 'text-success' : ''}`}>
                            {eco.rating}/5
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow className={highlightedFeature === 'privacy' ? 'bg-primary/5' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          Privacy Score
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`font-bold text-lg ${getWinner('privacyScore') === eco.id ? 'text-success' : ''}`}>
                              {eco.privacyScore}/10
                            </span>
                            <Progress value={eco.privacyScore * 10} className="h-1.5 w-20" />
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          Device Count
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center">
                          <span className={`font-bold ${getWinner('deviceCount') === eco.id ? 'text-success' : ''}`}>
                            {eco.deviceCount.toLocaleString()}+
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          Matter Support
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center">
                          <Tooltip>
                            <TooltipTrigger>
                              {getSupportIcon(eco.matterSupport)}
                            </TooltipTrigger>
                            <TooltipContent>
                              {getSupportLabel(eco.matterSupport)}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Wifi className="h-4 w-4" />
                          Thread Support
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center">
                          <Tooltip>
                            <TooltipTrigger>
                              {getSupportIcon(eco.threadSupport)}
                            </TooltipTrigger>
                            <TooltipContent>
                              {getSupportLabel(eco.threadSupport)}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" />
                          Local Control
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center">
                          {eco.localControl ? (
                            <Check className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-destructive mx-auto" />
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Price Range
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center font-medium">
                          {eco.priceRange}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Setup Difficulty</TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className={`text-center font-medium capitalize ${getSetupColor(eco.setupDifficulty)}`}>
                          {eco.setupDifficulty}
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Best For
                        </div>
                      </TableCell>
                      {selected.map((eco) => (
                        <TableCell key={eco.id} className="text-center text-sm text-muted-foreground">
                          {eco.bestFor}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Pros & Cons */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {selected.map((eco) => (
                  <Card key={eco.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{eco.logo}</span>
                        <CardTitle className="text-lg">{eco.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-success mb-2">PROS</p>
                        {eco.pros.map((pro, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-destructive mb-2">CONS</p>
                        {eco.cons.map((con, i) => (
                          <div key={i} className="flex items-start gap-2 text-sm">
                            <X className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Home className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Select at least 2 ecosystems</h3>
              <p className="text-muted-foreground">Click on ecosystems above to add them to comparison</p>
            </CardContent>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default EcosystemComparisonView;
