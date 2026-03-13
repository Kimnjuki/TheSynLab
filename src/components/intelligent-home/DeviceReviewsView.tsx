import { useState } from "react";
import { Star, Shield, Wifi, ExternalLink, ThumbsUp, Check, X, Filter, Grid3X3, List, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";

export interface DeviceReview {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  trustScore: number;
  integrationScore: number;
  price: string;
  priceValue: number;
  pros: string[];
  cons: string[];
  protocols: string[];
  ecosystems: string[];
  featured?: boolean;
  releaseDate: string;
  brand: string;
}

interface DeviceReviewsViewProps {
  devices: DeviceReview[];
  onViewDetails?: (device: DeviceReview) => void;
}

type ViewMode = "grid" | "list";
type SortOption = "featured" | "rating" | "price-low" | "price-high" | "newest" | "reviews";

const DeviceReviewsView = ({ devices, onViewDetails }: DeviceReviewsViewProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [minTrustScore, setMinTrustScore] = useState([0]);
  const [selectedProtocols, setSelectedProtocols] = useState<string[]>([]);

  const categories = [...new Set(devices.map(d => d.category))];
  const brands = [...new Set(devices.map(d => d.brand))];
  const allProtocols = [...new Set(devices.flatMap(d => d.protocols))];

  const filteredDevices = devices
    .filter(device => {
      const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || device.category === selectedCategory;
      const matchesBrand = !selectedBrand || device.brand === selectedBrand;
      const matchesPrice = device.priceValue >= priceRange[0] && device.priceValue <= priceRange[1];
      const matchesTrust = device.trustScore >= minTrustScore[0];
      const matchesProtocols = selectedProtocols.length === 0 || 
        selectedProtocols.some(p => device.protocols.includes(p));
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesTrust && matchesProtocols;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "featured": return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
        case "rating": return b.rating - a.rating;
        case "price-low": return a.priceValue - b.priceValue;
        case "price-high": return b.priceValue - a.priceValue;
        case "newest": return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
        case "reviews": return b.reviewCount - a.reviewCount;
        default: return 0;
      }
    });

  const toggleProtocol = (protocol: string) => {
    setSelectedProtocols(prev => 
      prev.includes(protocol) ? prev.filter(p => p !== protocol) : [...prev, protocol]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange([0, 500]);
    setMinTrustScore([0]);
    setSelectedProtocols([]);
  };

  const activeFiltersCount = [
    selectedCategory,
    selectedBrand,
    priceRange[0] > 0 || priceRange[1] < 500,
    minTrustScore[0] > 0,
    selectedProtocols.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">{devices.length}</p>
            <p className="text-sm text-muted-foreground">Total Devices</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{devices.filter(d => d.featured).length}</p>
            <p className="text-sm text-muted-foreground">Editor's Picks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{categories.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-secondary">{brands.length}</p>
            <p className="text-sm text-muted-foreground">Brands</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Search devices, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-4"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Select value={selectedCategory || "all"} onValueChange={(v) => setSelectedCategory(v === "all" ? "" : v)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
            </SelectContent>
          </Select>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-1">{activeFiltersCount}</Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter Devices</SheetTitle>
                <SheetDescription>Narrow down your search</SheetDescription>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Brand</label>
                  <Select value={selectedBrand || "all"} onValueChange={(v) => setSelectedBrand(v === "all" ? "" : v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map(brand => (
                        <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    min={0}
                    max={500}
                    step={10}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">
                    Minimum Trust Score: {minTrustScore[0]}
                  </label>
                  <Slider
                    value={minTrustScore}
                    onValueChange={setMinTrustScore}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Protocols</label>
                  <div className="flex flex-wrap gap-2">
                    {allProtocols.map(protocol => (
                      <Badge
                        key={protocol}
                        variant={selectedProtocols.includes(protocol) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleProtocol(protocol)}
                      >
                        {protocol}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
            <TabsList>
              <TabsTrigger value="grid"><Grid3X3 className="h-4 w-4" /></TabsTrigger>
              <TabsTrigger value="list"><List className="h-4 w-4" /></TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredDevices.length} of {devices.length} devices
        </p>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {/* Device Grid/List */}
      {filteredDevices.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Filter className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No devices found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters</p>
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          </CardContent>
        </Card>
      ) : viewMode === "grid" ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Card key={device.id} className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50 ${
              device.featured ? 'ring-2 ring-primary/30' : ''
            }`}>
              {device.featured && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-3 py-1 rounded-bl-lg font-medium">
                  Editor's Pick
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-3xl">
                    {device.category === 'Lighting' && '💡'}
                    {device.category === 'Climate' && '🌡️'}
                    {device.category === 'Security' && '🔒'}
                    {device.category === 'Camera' && '📹'}
                    {device.category === 'Hub' && '🏠'}
                    {device.category === 'Plug' && '🔌'}
                    {device.category === 'Speaker' && '🔊'}
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(device.rating)
                              ? 'fill-accent text-accent'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {device.reviewCount} reviews
                    </span>
                  </div>
                </div>
                
                <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                  {device.name}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary">{device.category}</Badge>
                  <Badge variant="outline">{device.brand}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Scores */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Shield className="h-3.5 w-3.5 text-success" />
                      <span className="text-xs font-medium">Trust Score</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={device.trustScore * 10} className="h-1.5 flex-1" />
                      <span className="text-sm font-bold">{device.trustScore}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Wifi className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium">Integration</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={device.integrationScore * 10} className="h-1.5 flex-1" />
                      <span className="text-sm font-bold">{device.integrationScore}</span>
                    </div>
                  </div>
                </div>

                {/* Protocols */}
                <div className="flex flex-wrap gap-1">
                  {device.protocols.slice(0, 4).map((protocol) => (
                    <Badge key={protocol} variant="outline" className="text-xs">
                      {protocol}
                    </Badge>
                  ))}
                </div>

                {/* Price & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-lg font-bold">{device.price}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails?.(device)}
                    >
                      Details
                    </Button>
                    <Button size="sm" className="gap-1">
                      <ExternalLink className="h-3.5 w-3.5" />
                      Buy
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredDevices.map((device) => (
            <Card key={device.id} className={`overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 ${
              device.featured ? 'ring-2 ring-primary/30' : ''
            }`}>
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center text-4xl shrink-0">
                    {device.category === 'Lighting' && '💡'}
                    {device.category === 'Climate' && '🌡️'}
                    {device.category === 'Security' && '🔒'}
                    {device.category === 'Camera' && '📹'}
                    {device.category === 'Hub' && '🏠'}
                    {device.category === 'Plug' && '🔌'}
                    {device.category === 'Speaker' && '🔊'}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{device.name}</h3>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="secondary">{device.category}</Badge>
                          <Badge variant="outline">{device.brand}</Badge>
                          {device.featured && <Badge>Editor's Pick</Badge>}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">{device.price}</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="font-medium">{device.rating}</span>
                          <span className="text-muted-foreground text-sm">({device.reviewCount})</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-success" />
                        <span className="text-sm">Trust: <strong>{device.trustScore}/10</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4 text-primary" />
                        <span className="text-sm">Integration: <strong>{device.integrationScore}/10</strong></span>
                      </div>
                      <div className="flex gap-1">
                        {device.protocols.map(p => (
                          <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => onViewDetails?.(device)}>
                        View Details
                      </Button>
                      <Button size="sm" className="gap-1">
                        <ExternalLink className="h-3.5 w-3.5" />
                        Buy Now
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeviceReviewsView;
