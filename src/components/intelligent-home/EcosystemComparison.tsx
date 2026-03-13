import { Check, X, Minus, ExternalLink, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Ecosystem {
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
}

interface EcosystemComparisonProps {
  ecosystems: Ecosystem[];
  selectedEcosystems: string[];
  onToggleSelect: (id: string) => void;
}

const EcosystemComparison = ({ ecosystems, selectedEcosystems, onToggleSelect }: EcosystemComparisonProps) => {
  const getSupportIcon = (support: 'full' | 'partial' | 'none') => {
    switch (support) {
      case 'full': return <Check className="h-5 w-5 text-success" />;
      case 'partial': return <Minus className="h-5 w-5 text-accent" />;
      case 'none': return <X className="h-5 w-5 text-destructive" />;
    }
  };

  const selected = ecosystems.filter(e => selectedEcosystems.includes(e.id));

  return (
    <div className="space-y-6">
      {/* Ecosystem Selection */}
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
                {eco.deviceCount}+ devices
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Table */}
      {selected.length >= 2 && (
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
                      <TableHead key={eco.id} className="text-center min-w-32">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl">{eco.logo}</span>
                          <span>{eco.name}</span>
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Matter Support</TableCell>
                    {selected.map((eco) => (
                      <TableCell key={eco.id} className="text-center">
                        {getSupportIcon(eco.matterSupport)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Thread Support</TableCell>
                    {selected.map((eco) => (
                      <TableCell key={eco.id} className="text-center">
                        {getSupportIcon(eco.threadSupport)}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Local Control</TableCell>
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
                    <TableCell className="font-medium">Privacy Score</TableCell>
                    {selected.map((eco) => (
                      <TableCell key={eco.id} className="text-center font-bold">
                        {eco.privacyScore}/10
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Price Range</TableCell>
                    {selected.map((eco) => (
                      <TableCell key={eco.id} className="text-center">
                        {eco.priceRange}
                      </TableCell>
                    ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Best For</TableCell>
                    {selected.map((eco) => (
                      <TableCell key={eco.id} className="text-center text-sm text-muted-foreground">
                        {eco.bestFor}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selected.length < 2 && (
        <div className="text-center py-8 text-muted-foreground">
          Select at least 2 ecosystems to compare
        </div>
      )}
    </div>
  );
};

export default EcosystemComparison;
export type { Ecosystem };
