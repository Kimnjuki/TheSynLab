import { Shield, Clock, ChevronRight, AlertTriangle, CheckCircle, Lock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface SecurityGuide {
  id: number;
  title: string;
  description: string;
  category: 'privacy' | 'network' | 'device' | 'data';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: number;
  steps: number;
  urgency: 'low' | 'medium' | 'high';
  updated: string;
}

interface SecurityGuideCardProps {
  guide: SecurityGuide;
  onRead?: (guide: SecurityGuide) => void;
}

const SecurityGuideCard = ({ guide, onRead }: SecurityGuideCardProps) => {
  const getCategoryIcon = () => {
    switch (guide.category) {
      case 'privacy': return <Shield className="h-5 w-5" />;
      case 'network': return <Lock className="h-5 w-5" />;
      case 'device': return <CheckCircle className="h-5 w-5" />;
      case 'data': return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getUrgencyColor = () => {
    switch (guide.urgency) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'medium': return 'bg-accent/10 text-accent border-accent/20';
      case 'low': return 'bg-success/10 text-success border-success/20';
    }
  };

  const getDifficultyColor = () => {
    switch (guide.difficulty) {
      case 'beginner': return 'bg-success text-success-foreground';
      case 'intermediate': return 'bg-accent text-accent-foreground';
      case 'advanced': return 'bg-destructive text-destructive-foreground';
    }
  };

  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 hover:shadow-md cursor-pointer" onClick={() => onRead?.(guide)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${getUrgencyColor()}`}>
            {getCategoryIcon()}
          </div>
          <Badge className={getDifficultyColor()}>
            {guide.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
          {guide.title}
        </CardTitle>
        <CardDescription className="line-clamp-2">
          {guide.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {guide.readTime} min
            </span>
            <span>{guide.steps} steps</span>
          </div>
          <Button variant="ghost" size="sm" className="gap-1 group-hover:text-primary">
            Read <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SecurityGuideCard;
export type { SecurityGuide };
