import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell,
  UserPlus,
  Clock,
  AlertTriangle,
  UserCheck,
  FileText,
  Zap,
  Star
} from "lucide-react";
import { AutomationTemplate } from "@/types/automation";

const iconMap: Record<string, React.ElementType> = {
  Bell,
  UserPlus,
  Clock,
  AlertTriangle,
  UserCheck,
  FileText,
  Zap,
  Star,
};

interface TemplateCardProps {
  template: AutomationTemplate;
  onUse: (template: AutomationTemplate) => void;
  isLoading?: boolean;
}

export function TemplateCard({ template, onUse, isLoading }: TemplateCardProps) {
  const Icon = iconMap[template.icon || 'Zap'] || Zap;

  const getCategoryColor = (category: string | null) => {
    const colors: Record<string, string> = {
      notifications: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      assignment: 'bg-green-500/10 text-green-600 border-green-500/20',
      reminders: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
      escalation: 'bg-red-500/10 text-red-600 border-red-500/20',
      onboarding: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      reports: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
    };
    return colors[category || ''] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:border-primary/30 group">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-semibold truncate">{template.name}</CardTitle>
              {template.is_featured && (
                <Star className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
              )}
            </div>
            {template.category && (
              <Badge variant="outline" className={`mt-1.5 text-xs ${getCategoryColor(template.category)}`}>
                {template.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {template.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Used {template.use_count} times
          </span>
          <Button 
            size="sm" 
            onClick={() => onUse(template)}
            disabled={isLoading}
          >
            Use Template
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
