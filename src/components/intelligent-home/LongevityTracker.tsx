import { useState } from "react";
import { 
  Clock, AlertTriangle, CheckCircle, XCircle, Calendar, 
  Building2, History, TrendingDown, Bell, ExternalLink, Search
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

interface DeviceLifecycle {
  id: string;
  name: string;
  brand: string;
  category: string;
  releaseDate: string;
  lastUpdateDate: string;
  supportStatus: 'active' | 'limited' | 'sunset' | 'discontinued';
  expectedEOL?: string;
  actualEOL?: string;
  updateFrequency: 'frequent' | 'regular' | 'rare' | 'none';
  matterUpgrade?: boolean;
  notes?: string;
  alternativeRecommendation?: string;
}

interface CompanyTracker {
  name: string;
  logo: string;
  overallRating: number;
  avgSupportYears: number;
  discontinuedProducts: number;
  activelySupportedProducts: number;
  matterCommitment: boolean;
  recentNews?: string;
}

const devices: DeviceLifecycle[] = [
  {
    id: '1',
    name: 'Wink Hub 2',
    brand: 'Wink',
    category: 'Hub',
    releaseDate: '2016-06-01',
    lastUpdateDate: '2020-05-15',
    supportStatus: 'sunset',
    expectedEOL: '2020-05-01',
    actualEOL: '2020-05-01',
    updateFrequency: 'none',
    notes: 'Switched to mandatory $5/month subscription then shut down',
    alternativeRecommendation: 'Home Assistant or SmartThings'
  },
  {
    id: '2',
    name: 'Philips Hue Bridge v2',
    brand: 'Philips',
    category: 'Hub',
    releaseDate: '2015-10-01',
    lastUpdateDate: '2026-01-10',
    supportStatus: 'active',
    updateFrequency: 'frequent',
    matterUpgrade: true,
    notes: 'Excellent long-term support track record'
  },
  {
    id: '3',
    name: 'Google Nest Secure',
    brand: 'Google',
    category: 'Security',
    releaseDate: '2017-11-01',
    lastUpdateDate: '2022-09-01',
    supportStatus: 'discontinued',
    actualEOL: '2024-04-08',
    updateFrequency: 'none',
    notes: 'Discontinued with limited feature sunset',
    alternativeRecommendation: 'Nest Detect sensors still work with other systems'
  },
  {
    id: '4',
    name: 'Amazon Echo (4th Gen)',
    brand: 'Amazon',
    category: 'Speaker',
    releaseDate: '2020-10-22',
    lastUpdateDate: '2026-01-12',
    supportStatus: 'active',
    updateFrequency: 'frequent',
    matterUpgrade: true,
    notes: 'Regular updates and Matter support added'
  },
  {
    id: '5',
    name: 'Samsung SmartThings Hub v2',
    brand: 'Samsung',
    category: 'Hub',
    releaseDate: '2015-09-01',
    lastUpdateDate: '2023-06-01',
    supportStatus: 'limited',
    expectedEOL: '2024-12-31',
    updateFrequency: 'rare',
    notes: 'Migrated to Aeotec hub, limited updates',
    alternativeRecommendation: 'Aeotec Smart Home Hub'
  },
  {
    id: '6',
    name: 'Logitech Harmony Hub',
    brand: 'Logitech',
    category: 'Remote',
    releaseDate: '2013-08-01',
    lastUpdateDate: '2021-04-01',
    supportStatus: 'discontinued',
    actualEOL: '2025-03-31',
    updateFrequency: 'none',
    notes: 'Product line discontinued, servers shutting down',
    alternativeRecommendation: 'SofaBaton X1 or Broadlink RM4'
  },
  {
    id: '7',
    name: 'Insteon Hub',
    brand: 'Insteon',
    category: 'Hub',
    releaseDate: '2012-01-01',
    lastUpdateDate: '2022-04-01',
    supportStatus: 'discontinued',
    actualEOL: '2022-04-15',
    updateFrequency: 'none',
    notes: 'Company abruptly shut down all services',
    alternativeRecommendation: 'Home Assistant with Insteon PLM'
  },
  {
    id: '8',
    name: 'Ecobee Smart Thermostat Premium',
    brand: 'Ecobee',
    category: 'Climate',
    releaseDate: '2022-09-01',
    lastUpdateDate: '2026-01-08',
    supportStatus: 'active',
    updateFrequency: 'regular',
    matterUpgrade: true,
    notes: 'Strong Matter commitment, regular updates'
  },
  {
    id: '9',
    name: 'Yale Assure Lock 2',
    brand: 'Yale',
    category: 'Security',
    releaseDate: '2022-10-01',
    lastUpdateDate: '2025-12-15',
    supportStatus: 'active',
    updateFrequency: 'regular',
    matterUpgrade: true,
    notes: 'Matter-ready with Thread support'
  },
  {
    id: '10',
    name: 'Arlo Pro 3',
    brand: 'Arlo',
    category: 'Camera',
    releaseDate: '2019-10-01',
    lastUpdateDate: '2025-11-01',
    supportStatus: 'active',
    updateFrequency: 'regular',
    notes: 'Still supported but subscription changes'
  },
];

const companies: CompanyTracker[] = [
  {
    name: 'Philips Hue',
    logo: '💡',
    overallRating: 9.5,
    avgSupportYears: 10,
    discontinuedProducts: 2,
    activelySupportedProducts: 45,
    matterCommitment: true,
    recentNews: 'Announced 10-year minimum support commitment'
  },
  {
    name: 'Amazon',
    logo: '🔷',
    overallRating: 7.5,
    avgSupportYears: 5,
    discontinuedProducts: 8,
    activelySupportedProducts: 52,
    matterCommitment: true,
    recentNews: 'Removed local voice processing in 2025'
  },
  {
    name: 'Google/Nest',
    logo: '🔵',
    overallRating: 6.5,
    avgSupportYears: 4,
    discontinuedProducts: 15,
    activelySupportedProducts: 28,
    matterCommitment: true,
    recentNews: 'Sunset Nest Secure, Works with Nest API'
  },
  {
    name: 'Apple',
    logo: '🍎',
    overallRating: 8.5,
    avgSupportYears: 7,
    discontinuedProducts: 3,
    activelySupportedProducts: 12,
    matterCommitment: true,
    recentNews: 'HomeKit continues to receive updates'
  },
  {
    name: 'Samsung',
    logo: '⚡',
    overallRating: 6.0,
    avgSupportYears: 4,
    discontinuedProducts: 12,
    activelySupportedProducts: 35,
    matterCommitment: true,
    recentNews: 'Shifted hub production to Aeotec'
  },
];

const LongevityTracker = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [view, setView] = useState<'devices' | 'companies'>('devices');

  const categories = [...new Set(devices.map(d => d.category))];

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.supportStatus === statusFilter;
    const matchesCategory = categoryFilter === 'all' || device.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success text-success-foreground gap-1"><CheckCircle className="h-3 w-3" />Active</Badge>;
      case 'limited':
        return <Badge className="bg-accent text-accent-foreground gap-1"><AlertTriangle className="h-3 w-3" />Limited</Badge>;
      case 'sunset':
        return <Badge className="bg-orange-500 text-white gap-1"><Clock className="h-3 w-3" />Sunset</Badge>;
      case 'discontinued':
        return <Badge className="bg-destructive text-destructive-foreground gap-1"><XCircle className="h-3 w-3" />Discontinued</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getUpdateBadge = (frequency: string) => {
    switch (frequency) {
      case 'frequent':
        return <Badge variant="outline" className="text-success border-success">Monthly</Badge>;
      case 'regular':
        return <Badge variant="outline" className="text-primary border-primary">Quarterly</Badge>;
      case 'rare':
        return <Badge variant="outline" className="text-accent border-accent">Rare</Badge>;
      case 'none':
        return <Badge variant="outline" className="text-destructive border-destructive">None</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getDaysSinceUpdate = (dateStr: string) => {
    const updateDate = new Date(dateStr);
    const today = new Date();
    return Math.floor((today.getTime() - updateDate.getTime()) / (1000 * 60 * 60 * 24));
  };

  const activeCount = devices.filter(d => d.supportStatus === 'active').length;
  const limitedCount = devices.filter(d => d.supportStatus === 'limited').length;
  const discontinuedCount = devices.filter(d => d.supportStatus === 'discontinued' || d.supportStatus === 'sunset').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-accent to-destructive flex items-center justify-center">
          <History className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold">Device Longevity Tracker</h2>
          <p className="text-muted-foreground">Track support lifecycles and sunset timelines</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-success">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Actively Supported</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-accent">{limitedCount}</p>
            <p className="text-sm text-muted-foreground">Limited Support</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-destructive">{discontinuedCount}</p>
            <p className="text-sm text-muted-foreground">Discontinued</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {devices.filter(d => d.matterUpgrade).length}
            </p>
            <p className="text-sm text-muted-foreground">Matter Ready</p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={view === 'devices' ? 'default' : 'outline'}
          onClick={() => setView('devices')}
          className="gap-2"
        >
          <Clock className="h-4 w-4" />
          Devices
        </Button>
        <Button
          variant={view === 'companies' ? 'default' : 'outline'}
          onClick={() => setView('companies')}
          className="gap-2"
        >
          <Building2 className="h-4 w-4" />
          Companies
        </Button>
      </div>

      {view === 'devices' ? (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search devices or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="limited">Limited</SelectItem>
                <SelectItem value="sunset">Sunset</SelectItem>
                <SelectItem value="discontinued">Discontinued</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Devices Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Updates</TableHead>
                    <TableHead>Last Update</TableHead>
                    <TableHead>Matter</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map(device => {
                    const daysSince = getDaysSinceUpdate(device.lastUpdateDate);
                    return (
                      <TableRow key={device.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.brand} • {device.category}</p>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(device.supportStatus)}</TableCell>
                        <TableCell>{getUpdateBadge(device.updateFrequency)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="text-sm">{new Date(device.lastUpdateDate).toLocaleDateString()}</p>
                            <p className={`text-xs ${daysSince > 365 ? 'text-destructive' : daysSince > 180 ? 'text-accent' : 'text-muted-foreground'}`}>
                              {daysSince} days ago
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {device.matterUpgrade ? (
                            <Badge className="bg-success/10 text-success border-success/30">Yes</Badge>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="text-sm text-muted-foreground truncate">{device.notes}</p>
                          {device.alternativeRecommendation && (
                            <p className="text-xs text-primary mt-1">
                              → {device.alternativeRecommendation}
                            </p>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Company View */
        <div className="grid md:grid-cols-2 gap-6">
          {companies.map(company => (
            <Card key={company.name} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{company.logo}</span>
                    <div>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {company.matterCommitment && (
                          <Badge className="bg-primary/10 text-primary border-primary/30 text-xs">
                            Matter Committed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${
                      company.overallRating >= 8 ? 'text-success' : 
                      company.overallRating >= 6 ? 'text-accent' : 'text-destructive'
                    }`}>
                      {company.overallRating}/10
                    </p>
                    <p className="text-xs text-muted-foreground">Longevity Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xl font-bold">{company.avgSupportYears}Y</p>
                    <p className="text-xs text-muted-foreground">Avg Support</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-success">{company.activelySupportedProducts}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-destructive">{company.discontinuedProducts}</p>
                    <p className="text-xs text-muted-foreground">Discontinued</p>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-border">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Recent: </span>
                    {company.recentNews}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Alert Box */}
      <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-4 flex items-start gap-3">
          <Bell className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Stay Informed</p>
            <p className="text-sm text-muted-foreground">
              We track product announcements and sunset notices daily. Check back regularly 
              to avoid surprises with your smart home devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LongevityTracker;
