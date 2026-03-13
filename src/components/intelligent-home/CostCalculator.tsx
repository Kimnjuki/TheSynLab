import { useState } from "react";
import { 
  DollarSign, Plus, Trash2, Calculator, TrendingUp, 
  Info, ArrowRight, ShoppingCart, Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
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

interface Device {
  id: string;
  name: string;
  category: string;
  upfrontCost: number;
  monthlySubscription: number;
  subscriptionName?: string;
  ecosystems: string[];
}

interface SelectedDevice extends Device {
  quantity: number;
}

const deviceCatalog: Device[] = [
  // Hubs
  { id: 'ha-green', name: 'Home Assistant Green', category: 'Hub', upfrontCost: 99, monthlySubscription: 0, ecosystems: ['Home Assistant'] },
  { id: 'ha-yellow', name: 'Home Assistant Yellow', category: 'Hub', upfrontCost: 149, monthlySubscription: 0, ecosystems: ['Home Assistant'] },
  { id: 'ha-cloud', name: 'Nabu Casa Cloud', category: 'Subscription', upfrontCost: 0, monthlySubscription: 6.50, subscriptionName: 'Cloud Access', ecosystems: ['Home Assistant'] },
  { id: 'homepod', name: 'Apple HomePod', category: 'Hub', upfrontCost: 299, monthlySubscription: 0, ecosystems: ['HomeKit'] },
  { id: 'homepod-mini', name: 'Apple HomePod Mini', category: 'Hub', upfrontCost: 99, monthlySubscription: 0, ecosystems: ['HomeKit'] },
  { id: 'echo-4', name: 'Amazon Echo (4th Gen)', category: 'Hub', upfrontCost: 99, monthlySubscription: 0, ecosystems: ['Alexa'] },
  { id: 'echo-dot', name: 'Amazon Echo Dot', category: 'Hub', upfrontCost: 49, monthlySubscription: 0, ecosystems: ['Alexa'] },
  { id: 'nest-hub', name: 'Google Nest Hub', category: 'Hub', upfrontCost: 99, monthlySubscription: 0, ecosystems: ['Google Home'] },
  { id: 'aqara-m3', name: 'Aqara Hub M3', category: 'Hub', upfrontCost: 179, monthlySubscription: 0, ecosystems: ['HomeKit', 'Alexa', 'Google Home'] },
  
  // Lighting
  { id: 'hue-bridge', name: 'Philips Hue Bridge', category: 'Lighting', upfrontCost: 60, monthlySubscription: 0, ecosystems: ['All'] },
  { id: 'hue-bulb', name: 'Philips Hue Bulb (Color)', category: 'Lighting', upfrontCost: 50, monthlySubscription: 0, ecosystems: ['All'] },
  { id: 'nanoleaf-shapes', name: 'Nanoleaf Shapes (9 panels)', category: 'Lighting', upfrontCost: 200, monthlySubscription: 0, ecosystems: ['All'] },
  
  // Climate
  { id: 'ecobee-premium', name: 'Ecobee Smart Thermostat', category: 'Climate', upfrontCost: 250, monthlySubscription: 0, ecosystems: ['All'] },
  { id: 'nest-thermostat', name: 'Nest Thermostat', category: 'Climate', upfrontCost: 130, monthlySubscription: 0, ecosystems: ['Google Home', 'Alexa'] },
  
  // Security
  { id: 'yale-lock', name: 'Yale Assure Lock 2', category: 'Security', upfrontCost: 280, monthlySubscription: 0, ecosystems: ['All'] },
  { id: 'ring-doorbell', name: 'Ring Video Doorbell', category: 'Security', upfrontCost: 100, monthlySubscription: 0, ecosystems: ['Alexa'] },
  { id: 'ring-protect', name: 'Ring Protect Basic', category: 'Subscription', upfrontCost: 0, monthlySubscription: 3.99, subscriptionName: 'Video History', ecosystems: ['Alexa'] },
  { id: 'arlo-pro5', name: 'Arlo Pro 5S Camera', category: 'Security', upfrontCost: 250, monthlySubscription: 0, ecosystems: ['All'] },
  { id: 'arlo-secure', name: 'Arlo Secure (Monthly)', category: 'Subscription', upfrontCost: 0, monthlySubscription: 7.99, subscriptionName: 'Cloud Storage', ecosystems: ['All'] },
  
  // Sensors
  { id: 'eve-motion', name: 'Eve Motion Sensor', category: 'Sensor', upfrontCost: 40, monthlySubscription: 0, ecosystems: ['HomeKit'] },
  { id: 'aqara-door', name: 'Aqara Door Sensor', category: 'Sensor', upfrontCost: 20, monthlySubscription: 0, ecosystems: ['All'] },
  { id: 'aqara-temp', name: 'Aqara Temp/Humidity Sensor', category: 'Sensor', upfrontCost: 22, monthlySubscription: 0, ecosystems: ['All'] },
];

const CostCalculator = () => {
  const [selectedDevices, setSelectedDevices] = useState<SelectedDevice[]>([]);
  const [years, setYears] = useState([3]);
  const [selectedEcosystem, setSelectedEcosystem] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = [...new Set(deviceCatalog.map(d => d.category))];

  const filteredCatalog = deviceCatalog.filter(device => {
    const matchesEcosystem = selectedEcosystem === 'all' || 
      device.ecosystems.includes(selectedEcosystem) || 
      device.ecosystems.includes('All');
    const matchesCategory = categoryFilter === 'all' || device.category === categoryFilter;
    return matchesEcosystem && matchesCategory;
  });

  const addDevice = (device: Device) => {
    const existing = selectedDevices.find(d => d.id === device.id);
    if (existing) {
      setSelectedDevices(prev =>
        prev.map(d => d.id === device.id ? { ...d, quantity: d.quantity + 1 } : d)
      );
    } else {
      setSelectedDevices(prev => [...prev, { ...device, quantity: 1 }]);
    }
  };

  const removeDevice = (deviceId: string) => {
    setSelectedDevices(prev => prev.filter(d => d.id !== deviceId));
  };

  const updateQuantity = (deviceId: string, quantity: number) => {
    if (quantity < 1) {
      removeDevice(deviceId);
    } else {
      setSelectedDevices(prev =>
        prev.map(d => d.id === deviceId ? { ...d, quantity } : d)
      );
    }
  };

  const totalUpfront = selectedDevices.reduce(
    (sum, d) => sum + (d.upfrontCost * d.quantity), 0
  );

  const monthlySubscriptions = selectedDevices.reduce(
    (sum, d) => sum + (d.monthlySubscription * d.quantity), 0
  );

  const yearlySubscriptions = monthlySubscriptions * 12;
  const totalOverYears = totalUpfront + (yearlySubscriptions * years[0]);
  const monthlyCostAverage = totalOverYears / (years[0] * 12);

  const subscriptionDevices = selectedDevices.filter(d => d.monthlySubscription > 0);
  const hardwareDevices = selectedDevices.filter(d => d.upfrontCost > 0);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Calculator className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Total Cost of Ownership Calculator</h2>
            <p className="text-muted-foreground">Calculate true costs including subscriptions over time</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Device Catalog */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Device Catalog</CardTitle>
                <CardDescription>Click devices to add them to your calculation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="flex gap-3">
                  <Select value={selectedEcosystem} onValueChange={setSelectedEcosystem}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Ecosystem" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Ecosystems</SelectItem>
                      <SelectItem value="Home Assistant">Home Assistant</SelectItem>
                      <SelectItem value="HomeKit">Apple HomeKit</SelectItem>
                      <SelectItem value="Alexa">Amazon Alexa</SelectItem>
                      <SelectItem value="Google Home">Google Home</SelectItem>
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

                {/* Device Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredCatalog.map(device => (
                    <Card
                      key={device.id}
                      className="cursor-pointer hover:border-primary/50 hover:shadow-sm transition-all"
                      onClick={() => addDevice(device)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between mb-2">
                          <Badge variant="outline" className="text-xs">{device.category}</Badge>
                          {device.monthlySubscription > 0 && (
                            <Badge className="bg-accent text-accent-foreground text-xs">
                              Subscription
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium text-sm mb-1">{device.name}</p>
                        <div className="flex justify-between items-center">
                          {device.upfrontCost > 0 ? (
                            <span className="text-lg font-bold">${device.upfrontCost}</span>
                          ) : (
                            <span className="text-lg font-bold text-accent">${device.monthlySubscription}/mo</span>
                          )}
                          <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Selected Devices Table */}
            {selectedDevices.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5" />
                    Your Smart Home Cart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Device</TableHead>
                        <TableHead className="text-center">Qty</TableHead>
                        <TableHead className="text-right">Upfront</TableHead>
                        <TableHead className="text-right">Monthly</TableHead>
                        <TableHead className="text-right">{years[0]}Y Total</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedDevices.map(device => {
                        const deviceTotal = (device.upfrontCost * device.quantity) + 
                          (device.monthlySubscription * device.quantity * 12 * years[0]);
                        return (
                          <TableRow key={device.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{device.name}</p>
                                {device.subscriptionName && (
                                  <p className="text-xs text-muted-foreground">{device.subscriptionName}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(device.id, device.quantity - 1)}
                                >
                                  -
                                </Button>
                                <span className="w-8 text-center">{device.quantity}</span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => updateQuantity(device.id, device.quantity + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              {device.upfrontCost > 0 ? `$${device.upfrontCost * device.quantity}` : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              {device.monthlySubscription > 0 
                                ? `$${(device.monthlySubscription * device.quantity).toFixed(2)}` 
                                : '-'}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              ${deviceTotal.toFixed(0)}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => removeDevice(device.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Cost Summary */}
          <div className="space-y-4">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Cost Summary</CardTitle>
                <CardDescription>Over {years[0]} year{years[0] > 1 ? 's' : ''}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Time Slider */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Time Period</span>
                    <span className="font-medium">{years[0]} Year{years[0] > 1 ? 's' : ''}</span>
                  </div>
                  <Slider
                    value={years}
                    onValueChange={setYears}
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1Y</span>
                    <span>5Y</span>
                    <span>10Y</span>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hardware (one-time)</span>
                    <span className="font-medium">${totalUpfront}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Subscriptions</span>
                    <span className="font-medium">${monthlySubscriptions.toFixed(2)}/mo</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Annual Subscriptions</span>
                    <span className="font-medium">${yearlySubscriptions.toFixed(0)}/yr</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subscriptions over {years[0]}Y</span>
                    <span>${(yearlySubscriptions * years[0]).toFixed(0)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-4 border-t border-border space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total ({years[0]} Years)</span>
                    <span className="text-2xl font-bold text-primary">
                      ${totalOverYears.toFixed(0)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Average per month</span>
                    <span className="font-medium">${monthlyCostAverage.toFixed(2)}</span>
                  </div>
                </div>

                {/* Subscription Warning */}
                {subscriptionDevices.length > 0 && (
                  <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                    <div className="flex items-start gap-2">
                      <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-accent">Subscription costs add up!</p>
                        <p className="text-muted-foreground">
                          Over {years[0]} years, you'll pay ${(yearlySubscriptions * years[0]).toFixed(0)} in subscriptions
                          ({Math.round((yearlySubscriptions * years[0] / totalOverYears) * 100)}% of total).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comparison Tips */}
                {selectedDevices.length === 0 && (
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Add devices from the catalog to calculate your total cost of ownership
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {selectedDevices.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{hardwareDevices.length}</p>
                    <p className="text-xs text-muted-foreground">Hardware Items</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-3 text-center">
                    <p className="text-2xl font-bold">{subscriptionDevices.length}</p>
                    <p className="text-xs text-muted-foreground">Subscriptions</p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CostCalculator;
