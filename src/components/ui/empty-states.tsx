import { ReactNode } from "react";
import { 
  FileSearch, 
  Inbox, 
  Heart, 
  Star, 
  Users, 
  FolderOpen,
  Search,
  Plus,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateVariant = 
  | "no-data" 
  | "no-results" 
  | "no-favorites" 
  | "no-reviews"
  | "no-users"
  | "no-projects"
  | "coming-soon";

interface EmptyStateProps {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
  className?: string;
}

const variantConfig: Record<EmptyStateVariant, { icon: ReactNode; title: string; description: string }> = {
  "no-data": {
    icon: <Inbox className="h-12 w-12" />,
    title: "No data yet",
    description: "Start by adding your first item to see it here.",
  },
  "no-results": {
    icon: <Search className="h-12 w-12" />,
    title: "No results found",
    description: "Try adjusting your search or filter criteria.",
  },
  "no-favorites": {
    icon: <Heart className="h-12 w-12" />,
    title: "No favorites yet",
    description: "Items you favorite will appear here for easy access.",
  },
  "no-reviews": {
    icon: <Star className="h-12 w-12" />,
    title: "No reviews yet",
    description: "Be the first to share your experience!",
  },
  "no-users": {
    icon: <Users className="h-12 w-12" />,
    title: "No team members",
    description: "Invite team members to collaborate on projects.",
  },
  "no-projects": {
    icon: <FolderOpen className="h-12 w-12" />,
    title: "No projects yet",
    description: "Create your first project to get started.",
  },
  "coming-soon": {
    icon: <Sparkles className="h-12 w-12" />,
    title: "Coming soon",
    description: "This feature is under development. Check back soon!",
  },
};

export const EmptyState = ({
  variant = "no-data",
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) => {
  const config = variantConfig[variant];
  
  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4 text-center",
      className
    )}>
      <div className="rounded-full bg-muted/50 p-4 mb-4 text-muted-foreground">
        {icon || config.icon}
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {title || config.title}
      </h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">
        {description || config.description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="gap-2">
          <Plus className="h-4 w-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const EmptySearchState = ({ 
  query,
  onClear 
}: { 
  query: string; 
  onClear?: () => void;
}) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="rounded-full bg-muted/50 p-4 mb-4 text-muted-foreground">
      <FileSearch className="h-12 w-12" />
    </div>
    <h3 className="text-lg font-semibold mb-1">
      No results for "{query}"
    </h3>
    <p className="text-sm text-muted-foreground max-w-sm mb-4">
      We couldn't find anything matching your search. Try different keywords.
    </p>
    {onClear && (
      <Button variant="outline" onClick={onClear}>
        Clear search
      </Button>
    )}
  </div>
);
