import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard = ({ className }: SkeletonCardProps) => (
  <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
    <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
    <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
    <div className="space-y-2">
      <div className="h-3 w-full bg-muted animate-pulse rounded" />
      <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
    </div>
  </div>
);

export const SkeletonProductCard = ({ className }: SkeletonCardProps) => (
  <div className={cn("rounded-lg border bg-card overflow-hidden", className)}>
    <div className="aspect-video bg-muted animate-pulse" />
    <div className="p-4 space-y-3">
      <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
      <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
      <div className="flex gap-2">
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
        <div className="h-6 w-16 bg-muted animate-pulse rounded-full" />
      </div>
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div className="rounded-lg border bg-card overflow-hidden">
    <div className="border-b bg-muted/30 p-4 flex gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-4 flex-1 bg-muted animate-pulse rounded" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="border-b last:border-0 p-4 flex gap-4">
        {[1, 2, 3, 4].map((j) => (
          <div key={j} className="h-4 flex-1 bg-muted animate-pulse rounded" />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ items = 3 }: { items?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 rounded-lg border bg-card">
        <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
          <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-8 w-20 bg-muted animate-pulse rounded" />
      </div>
    ))}
  </div>
);

export const SkeletonAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
  };
  
  return (
    <div className={cn("rounded-full bg-muted animate-pulse", sizeClasses[size])} />
  );
};

export const SkeletonText = ({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string;
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div 
        key={i} 
        className="h-4 bg-muted animate-pulse rounded"
        style={{ width: `${Math.random() * 30 + 70}%` }}
      />
    ))}
  </div>
);
