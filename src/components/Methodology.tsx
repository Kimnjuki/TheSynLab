import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScoreBadge from "./ScoreBadge";
import { Shield, Link2, Award, Search, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Methodology = () => {
  const trustComponents = [
    { name: "Data Privacy", weight: 30, icon: Shield },
    { name: "Encryption Standards", weight: 20, icon: Shield },
    { name: "ToS Transparency", weight: 20, icon: Shield },
    { name: "Ethical AI", weight: 20, icon: Shield },
    { name: "Security Audits", weight: 10, icon: Shield }
  ];

  const integrationComponents = [
    { name: "API Availability", weight: 30, icon: Link2 },
    { name: "Cross-Platform", weight: 30, icon: Link2 },
    { name: "Smart Home Support", weight: 20, icon: Link2 },
    { name: "Automation Tools", weight: 10, icon: Link2 },
    { name: "Developer Community", weight: 10, icon: Link2 }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-sm font-medium text-primary">
            <Award className="h-4 w-4" />
            Our Unique Methodology
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">
            Trust & Integration Scores
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Every product is evaluated on two critical dimensions: how trustworthy 
            it is with your data, and how well it integrates with your existing workflow.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <Card className="p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Trust Score</h3>
                <p className="text-muted-foreground">
                  Comprehensive privacy and security evaluation
                </p>
              </div>
              <ScoreBadge score={8.5} label="Trust Score" type="trust" />
            </div>

            <div className="space-y-3">
              {trustComponents.map((component) => (
                <div key={component.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <component.icon className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{component.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{component.weight}%</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8 space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Integration Score</h3>
                <p className="text-muted-foreground">
                  How well it connects with your ecosystem
                </p>
              </div>
              <ScoreBadge score={9.2} label="Integration Score" type="integration" />
            </div>

            <div className="space-y-3">
              {integrationComponents.map((component) => (
                <div key={component.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <component.icon className="h-4 w-4 text-secondary" />
                    <span className="text-sm font-medium">{component.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{component.weight}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-semibold">Real-World Testing</h4>
            <p className="text-sm text-muted-foreground">
              Minimum 2 weeks hands-on use with documented testing methodology
            </p>
          </Card>

          <Card className="p-6 text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-secondary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-secondary" />
            </div>
            <h4 className="font-semibold">Independent Reviews</h4>
            <p className="text-sm text-muted-foreground">
              No sponsored content — transparent affiliate disclosure on every review
            </p>
          </Card>

          <Card className="p-6 text-center space-y-3">
            <div className="h-12 w-12 mx-auto rounded-full bg-accent/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-semibold">Regular Updates</h4>
            <p className="text-sm text-muted-foreground">
              Reviews updated every 6-12 months as products evolve
            </p>
          </Card>
        </div>

        {/* CTA to Scoring Hub */}
        <div className="text-center mt-12">
          <Link to="/scoring-hub">
            <Button size="lg" className="gap-2">
              Explore Full Scoring Methodology
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground mt-3">
            See ecosystem fit tools, decision recipes, integration graphs & more
          </p>
        </div>
      </div>
    </section>
  );
};

export default Methodology;
