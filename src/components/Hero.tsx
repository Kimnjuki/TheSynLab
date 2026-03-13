import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles, CheckCircle } from "lucide-react";
import heroImage from "@/assets/hero-workspace.jpg";
import TypewriterText from "./landing/TypewriterText";
import { Link } from "react-router-dom";

const heroFeatures = [
  "Lab-tested reviews",
  "Transparent scoring",
  "Community verified",
];

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--muted))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--muted))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-40 right-20 w-32 h-32 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: "2s" }} />
      
      <div className="container relative py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium animate-fade-in-up">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-primary">Next-Gen Tech Reviews & Workflow Optimization</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Build Your Perfect
              <span className="block mt-2">
                <TypewriterText
                  phrases={[
                    "Workflow Ecosystem",
                    "Smart Home Setup",
                    "Productivity Stack",
                    "Digital Workspace",
                  ]}
                  className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
                />
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              In-depth reviews powered by unique Trust & Integration Scores. 
              Make confident decisions with transparent, data-driven analysis 
              of productivity tools, smart home devices, and office hardware.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-3 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
              {heroFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-success" />
                  {feature}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <Link to="/blog">
                <Button size="lg" className="group relative overflow-hidden animate-pulse-glow w-full sm:w-auto">
                  <span className="relative z-10 flex items-center">
                    Explore Reviews
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Button>
              </Link>
              <Link to="/scoring-hub">
                <Button size="lg" variant="outline" className="group w-full sm:w-auto">
                  <Shield className="mr-2 h-4 w-4 group-hover:text-primary transition-colors" />
                  Our Methodology
                </Button>
              </Link>
            </div>

            <div className="flex items-center gap-8 pt-4 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">500+</div>
                <div className="text-sm text-muted-foreground">Products Reviewed</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-secondary group-hover:scale-110 transition-transform">50k+</div>
                <div className="text-sm text-muted-foreground">Community Members</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="group cursor-pointer">
                <div className="text-2xl font-bold text-accent group-hover:scale-110 transition-transform">10/10</div>
                <div className="text-sm text-muted-foreground">Trust Score Avg</div>
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in-up lg:animate-slide-in-left" style={{ animationDelay: "300ms" }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl blur-3xl" />
            <div className="relative group">
              <img 
                src={heroImage} 
                alt="Modern tech workspace with productivity tools and smart home devices" 
                className="relative rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-lg animate-float">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Verified Reviews</div>
                    <div className="text-xs text-muted-foreground">Real user testing</div>
                  </div>
                </div>
              </div>
              {/* Trust Score Badge */}
              <div className="absolute -top-4 -right-4 bg-card border border-border rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: "1.5s" }}>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Trust Score</div>
                    <div className="text-xs text-muted-foreground">Transparent ratings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
