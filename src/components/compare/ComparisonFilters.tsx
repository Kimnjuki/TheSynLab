import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

interface ComparisonFiltersProps {
  filters: {
    priceRange: number[];
    trustScore: number[];
    integrationScore: number[];
    ecosystems: string[];
    categories: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const ECOSYSTEMS = ["HomeKit", "Alexa", "Google Home", "SmartThings", "Matter"];

export function ComparisonFilters({ filters, onFiltersChange }: ComparisonFiltersProps) {
  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={5000}
          step={50}
          value={filters.priceRange}
          onValueChange={(value) => onFiltersChange({ ...filters, priceRange: value })}
          className="w-full"
        />
      </div>

      {/* Trust Score */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Trust Score: {filters.trustScore[0]} - {filters.trustScore[1]}
        </Label>
        <Slider
          min={0}
          max={10}
          step={0.5}
          value={filters.trustScore}
          onValueChange={(value) => onFiltersChange({ ...filters, trustScore: value })}
          className="w-full"
        />
      </div>

      {/* Integration Score */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">
          Integration Score: {filters.integrationScore[0]} - {filters.integrationScore[1]}
        </Label>
        <Slider
          min={0}
          max={10}
          step={0.5}
          value={filters.integrationScore}
          onValueChange={(value) => onFiltersChange({ ...filters, integrationScore: value })}
          className="w-full"
        />
      </div>

      {/* Ecosystems */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Ecosystem Support</Label>
        <div className="space-y-2">
          {ECOSYSTEMS.map((ecosystem) => (
            <div key={ecosystem} className="flex items-center space-x-2">
              <Checkbox
                id={ecosystem}
                checked={filters.ecosystems.includes(ecosystem)}
                onCheckedChange={(checked) => {
                  const newEcosystems = checked
                    ? [...filters.ecosystems, ecosystem]
                    : filters.ecosystems.filter((e) => e !== ecosystem);
                  onFiltersChange({ ...filters, ecosystems: newEcosystems });
                }}
              />
              <label
                htmlFor={ecosystem}
                className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {ecosystem}
              </label>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
