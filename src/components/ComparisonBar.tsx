import { useNavigate } from "react-router-dom";
import { useComparisonBar } from "@/contexts/ComparisonBarContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, GitCompare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function ComparisonBar() {
  const { selected, remove, clearAll } = useComparisonBar();
  const navigate = useNavigate();

  if (selected.length === 0) return null;

  const handleCompare = () => {
    navigate("/compare");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
        {/* Selected chips */}
        <div className="flex items-center gap-2 flex-1 flex-wrap">
          <span className="text-sm font-medium text-muted-foreground shrink-0">
            Comparing ({selected.length}/4):
          </span>
          {selected.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-full px-3 py-1 text-sm"
            >
              <span className="font-medium max-w-[140px] truncate">{product.name}</span>
              {product.overallScore !== undefined && (
                <Badge variant="secondary" className="text-xs h-4 px-1.5">
                  {product.overallScore.toFixed(1)}
                </Badge>
              )}
              <button
                onClick={() => remove(product.id)}
                className="ml-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Remove ${product.name} from comparison`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: 4 - selected.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className={cn(
                "flex items-center justify-center border-2 border-dashed rounded-full px-4 py-1 text-xs text-muted-foreground",
                selected.length === 0 ? "hidden" : "border-muted"
              )}
            >
              + Add product
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground"
            onClick={clearAll}
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button
            size="sm"
            className="gap-2"
            disabled={selected.length < 2}
            onClick={handleCompare}
          >
            <GitCompare className="h-4 w-4" />
            Compare Now
            {selected.length >= 2 && (
              <Badge className="ml-1 bg-primary-foreground text-primary h-4 px-1.5 text-xs">
                {selected.length}
              </Badge>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
