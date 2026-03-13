import { Check, X, ExternalLink, Star, Shield, Wifi, Zap, Battery } from "lucide-react";
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

interface HardwareSpec {
  id: number;
  name: string;
  brand: string;
  price: string;
  connectivity: string[];
  powerSource: 'battery' | 'wired' | 'both';
  batteryLife?: string;
  latency: string;
  range: string;
  matterCertified: boolean;
  rating: number;
  pros: string[];
  cons: string[];
}

interface HardwareSpecTableProps {
  specs: HardwareSpec[];
  title?: string;
  description?: string;
}

const HardwareSpecTable = ({ specs, title = "Hardware Comparison", description }: HardwareSpecTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="min-w-48">Device</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-center">Connectivity</TableHead>
                <TableHead className="text-center">Power</TableHead>
                <TableHead className="text-center">Latency</TableHead>
                <TableHead className="text-center">Range</TableHead>
                <TableHead className="text-center">Matter</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {specs.map((spec, index) => (
                <TableRow 
                  key={spec.id} 
                  className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{spec.name}</div>
                      <div className="text-xs text-muted-foreground">{spec.brand}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium">
                    {spec.price}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {spec.connectivity.slice(0, 2).map((conn) => (
                        <Badge key={conn} variant="outline" className="text-xs">
                          {conn}
                        </Badge>
                      ))}
                      {spec.connectivity.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{spec.connectivity.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {spec.powerSource === 'battery' && <Battery className="h-4 w-4 text-accent" />}
                      {spec.powerSource === 'wired' && <Zap className="h-4 w-4 text-primary" />}
                      {spec.powerSource === 'both' && (
                        <>
                          <Battery className="h-4 w-4 text-accent" />
                          <Zap className="h-4 w-4 text-primary" />
                        </>
                      )}
                    </div>
                    {spec.batteryLife && (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {spec.batteryLife}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={
                      parseInt(spec.latency) < 50 ? 'text-success font-medium' :
                      parseInt(spec.latency) < 100 ? 'text-accent font-medium' :
                      'text-destructive font-medium'
                    }>
                      {spec.latency}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {spec.range}
                  </TableCell>
                  <TableCell className="text-center">
                    {spec.matterCertified ? (
                      <Check className="h-5 w-5 text-success mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-muted-foreground mx-auto" />
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{spec.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default HardwareSpecTable;
export type { HardwareSpec };
