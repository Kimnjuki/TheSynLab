import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MoreHorizontal, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Clock,
  Zap,
  Bell,
  Mail,
  UserCheck,
  RefreshCw,
  Flag,
  Tag,
  FilePlus,
  FileText,
  Globe,
  Plus,
  CheckCircle,
  AlertCircle,
  UserPlus,
  MessageSquare,
  Calendar,
  Star,
  TrendingUp
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Automation } from "@/types/automation";
import { formatDistanceToNow } from "date-fns";

const iconMap: Record<string, React.ElementType> = {
  Bell,
  Mail,
  UserCheck,
  RefreshCw,
  Flag,
  Tag,
  FilePlus,
  FileText,
  Globe,
  Plus,
  Edit: Edit,
  CheckCircle,
  AlertCircle,
  UserPlus,
  MessageSquare,
  Calendar,
  Star,
  TrendingUp,
  Clock,
  Zap,
};

interface AutomationCardProps {
  automation: Automation;
  onToggle: (id: string, isActive: boolean) => void;
  onEdit: (automation: Automation) => void;
  onDelete: (id: string) => void;
}

export function AutomationCard({ automation, onToggle, onEdit, onDelete }: AutomationCardProps) {
  const getTriggerIcon = (triggerType: string) => {
    const triggerIcons: Record<string, React.ElementType> = {
      task_created: Plus,
      task_updated: Edit,
      task_completed: CheckCircle,
      task_overdue: AlertCircle,
      member_joined: UserPlus,
      comment_added: MessageSquare,
      schedule: Calendar,
      product_reviewed: Star,
      score_changed: TrendingUp,
    };
    return triggerIcons[triggerType] || Zap;
  };

  const TriggerIcon = getTriggerIcon(automation.trigger_type);

  return (
    <Card className={`transition-all duration-200 ${automation.is_active ? 'border-primary/50 bg-primary/5' : 'opacity-75'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${automation.is_active ? 'bg-primary/10' : 'bg-muted'}`}>
              <TriggerIcon className={`h-5 w-5 ${automation.is_active ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{automation.name}</CardTitle>
              {automation.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{automation.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={automation.is_active}
              onCheckedChange={(checked) => onToggle(automation.id, checked)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(automation)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(automation.id)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4" />
            <span>{automation.actions.length} action{automation.actions.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Play className="h-4 w-4" />
            <span>{automation.run_count} runs</span>
          </div>
          {automation.last_run_at && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>Last run {formatDistanceToNow(new Date(automation.last_run_at), { addSuffix: true })}</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {automation.trigger_type.replace(/_/g, ' ')}
          </Badge>
          {automation.actions.slice(0, 2).map((action, i) => (
            <Badge key={i} variant="outline" className="text-xs">
              {action.type.replace(/_/g, ' ')}
            </Badge>
          ))}
          {automation.actions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{automation.actions.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
