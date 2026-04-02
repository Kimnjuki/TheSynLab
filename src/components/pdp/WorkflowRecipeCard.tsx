import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PDPRecipe } from "./types";

export function WorkflowRecipeCard({ recipe }: { recipe: PDPRecipe }) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-base">{recipe.recipeTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {recipe.summary && <p className="text-muted-foreground">{recipe.summary}</p>}
        <div className="flex flex-wrap gap-2">
          {recipe.toolStack?.map((t) => (
            <Badge key={t} variant="outline">{t}</Badge>
          ))}
        </div>
        <div className="flex gap-2">
          {recipe.difficulty && <Badge variant="secondary">{recipe.difficulty}</Badge>}
          {recipe.estimatedMinutes != null && <Badge variant="outline">{recipe.estimatedMinutes} min</Badge>}
          {recipe.audienceTag && <Badge variant="outline">{recipe.audienceTag}</Badge>}
        </div>
      </CardContent>
    </Card>
  );
}
