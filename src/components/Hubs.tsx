import { Bot, Home, Briefcase } from "lucide-react";
import HubCard from "./HubCard";

const Hubs = () => {
  const hubs = [
    {
      icon: Bot,
      title: "AI Workflow Hub",
      description: "Comprehensive reviews of productivity software, AI writing tools, and automation platforms to optimize your digital workflow.",
      features: [
        "Productivity Software Reviews",
        "AI Writing & Content Tools",
        "Task Automation Guides",
        "Integration Tutorials"
      ],
      gradient: "bg-gradient-to-br from-primary to-primary/60",
      href: "/hubs/ai-workflow"
    },
    {
      icon: Home,
      title: "Intelligent Home Hub",
      description: "In-depth analysis of smart home devices with focus on security, privacy, and ecosystem compatibility.",
      features: [
        "Smart Home Device Reviews",
        "Security & Privacy Guides",
        "Ecosystem Comparisons",
        "Troubleshooting Database"
      ],
      gradient: "bg-gradient-to-br from-secondary to-secondary/60",
      href: "/hubs/intelligent-home"
    },
    {
      icon: Briefcase,
      title: "Hybrid Office Hub",
      description: "Expert reviews of ergonomic hardware, productivity tools, and complete office setup guides for remote professionals.",
      features: [
        "Ergonomic Hardware Reviews",
        "Desk Setup Showcases",
        "Productivity Hardware",
        "Budget Build Guides"
      ],
      gradient: "bg-gradient-to-br from-accent to-accent/60",
      href: "/hubs/hybrid-office"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Three Specialized Hubs
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep expertise across productivity software, smart home technology, 
            and office hardware — all with our unique scoring methodology.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hubs.map((hub) => (
            <HubCard key={hub.title} {...hub} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hubs;
