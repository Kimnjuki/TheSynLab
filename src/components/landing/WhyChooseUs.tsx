import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Eye, Users, Award, BarChart3 } from "lucide-react";

const whyChooseUs = [
  {
    icon: Shield,
    title: "Trust Score System",
    description: "Every product rated on privacy, encryption, and data practices—not just performance.",
    stat: "10-point scale",
  },
  {
    icon: Zap,
    title: "Integration Score",
    description: "See how well products work within your existing ecosystem before you buy.",
    stat: "API + ecosystem",
  },
  {
    icon: Eye,
    title: "Full Transparency",
    description: "Open methodology, no sponsored rankings. We disclose every affiliate relationship.",
    stat: "100% independent",
  },
  {
    icon: Users,
    title: "Community Verified",
    description: "Real users validate our scores. Community setups showcase real-world performance.",
    stat: "50,000+ members",
  },
  {
    icon: Award,
    title: "Lab-Tested Reviews",
    description: "Minimum 2-week hands-on testing with documented methodology for every review.",
    stat: "200+ hrs/review",
  },
  {
    icon: BarChart3,
    title: "Quarterly Updates",
    description: "Reviews aren't static—we re-test products and update scores as firmware evolves.",
    stat: "Every 90 days",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/30">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Professionals Trust TheSynLab
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We go beyond surface-level reviews. Our dual scoring system gives you the complete picture.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item) => (
            <Card key={item.title} className="group hover:shadow-md transition-all duration-300 hover:border-primary/30">
              <CardContent className="p-6 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <div className="text-xs font-medium text-primary bg-primary/5 px-3 py-1.5 rounded-full w-fit">
                  {item.stat}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
