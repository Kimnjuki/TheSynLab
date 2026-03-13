import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface HubCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  href: string;
}

const HubCard = ({ icon: Icon, title, description, features, gradient, href }: HubCardProps) => {
  return (
    <Card className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
      <div className={cn("absolute inset-0 opacity-5", gradient)} />
      
      <div className="relative p-8 space-y-6">
        <div className="flex items-start justify-between">
          <div className={cn("p-3 rounded-xl", gradient.replace("bg-gradient-to-br", "bg-gradient-to-br").replace("opacity-5", ""))}>
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>

        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-foreground/80">{feature}</span>
            </li>
          ))}
        </ul>

        <Button variant="ghost" className="group/btn w-full justify-between" asChild>
          <a href={href}>
            Explore Hub
            <ArrowRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
          </a>
        </Button>
      </div>
    </Card>
  );
};

export default HubCard;
