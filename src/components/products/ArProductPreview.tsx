/**
 * S7: AR Product Preview
 * Placeholder for 3D/AR product visualization.
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Box, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArProductPreviewProps {
  productName: string;
  modelUrl3D?: string;
  arEnabled?: boolean;
  dimensionsCm?: { w?: number; h?: number; d?: number };
  className?: string;
}

export function ArProductPreview({
  productName,
  modelUrl3D,
  arEnabled = false,
  dimensionsCm,
  className,
}: ArProductPreviewProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Box className="h-5 w-5" />
          3D / AR Preview
        </CardTitle>
        <CardDescription>
          {productName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          {modelUrl3D ? (
            <a
              href={modelUrl3D}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <Maximize2 className="h-12 w-12" />
              <span className="text-sm">View 3D model</span>
            </a>
          ) : (
            <span className="text-sm text-muted-foreground">3D model not available</span>
          )}
        </div>
        {arEnabled && (
          <Badge variant="secondary">AR enabled</Badge>
        )}
        {dimensionsCm && (dimensionsCm.w || dimensionsCm.h || dimensionsCm.d) && (
          <div className="text-xs text-muted-foreground">
            {[dimensionsCm.w, dimensionsCm.h, dimensionsCm.d].filter(Boolean).join(" × ")} cm
          </div>
        )}
        <Button variant="outline" size="sm" className="w-full" disabled={!arEnabled}>
          View in AR
        </Button>
      </CardContent>
    </Card>
  );
}
