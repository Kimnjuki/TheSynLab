import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Zap, Calculator, Shield, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-primary/3 to-transparent pointer-events-none" />
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" />

      <div className="container relative pt-20 pb-16 md:pt-28 md:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Trusted by 10,000+ tech buyers
          </div>

          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Build a trusted tech stack in{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">60 seconds.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Stop guessing, start knowing. TheSynLab's unique Trust & Integration Scores help you 
            choose tools that actually work together — backed by real lab testing.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button size="lg" asChild className="gap-2 text-base px-8">
              <Link to="/stack-quiz">
                Take the Stack Quiz <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8">
              <Link to="/tools">
                Browse Reviews <Zap className="h-5 w-5 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Intent-routing tiles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <Link
              to="/stack-quiz"
              className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Stack Quiz</p>
                <p className="text-xs text-muted-foreground">Get matched in 2 min</p>
              </div>
            </Link>
            <Link
              to="/tools/budget-calculator"
              className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Calculator className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">TCO Calculator</p>
                <p className="text-xs text-muted-foreground">3-year cost analysis</p>
              </div>
            </Link>
            <Link
              to="/tools/vendor-risk"
              className="group flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/50 hover:border-primary/30 transition-all"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Vendor Risk</p>
                <p className="text-xs text-muted-foreground">Check any vendor</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
