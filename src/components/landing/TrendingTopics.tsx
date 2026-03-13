import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Cpu, Home, Briefcase, Wifi, Lock, Zap } from "lucide-react";

const trendingTopics = [
  { name: "Matter Protocol", count: 24, icon: Wifi, href: "/blog/matter-protocol-explained-complete-guide" },
  { name: "Home Assistant", count: 18, icon: Home, href: "/blog/home-assistant-beginners-guide" },
  { name: "AI Tools 2026", count: 31, icon: Cpu, href: "/blog" },
  { name: "Privacy", count: 15, icon: Lock, href: "/blog" },
  { name: "Ergonomic Setup", count: 12, icon: Briefcase, href: "/blog" },
  { name: "Automation", count: 22, icon: Zap, href: "/blog" },
];

const TrendingTopics = () => {
  return (
    <section className="py-16 border-y bg-muted/20">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-foreground">Trending Topics</h2>
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              Browse all <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {trendingTopics.map((topic) => (
            <Link key={topic.name} to={topic.href}>
              <Card className="hover:shadow-md hover:border-primary/30 transition-all duration-200 group cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <topic.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{topic.name}</span>
                  <Badge variant="secondary" className="text-xs">{topic.count} articles</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingTopics;
