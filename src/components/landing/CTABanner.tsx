import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Sparkles } from "lucide-react";

const CTABanner = () => {
  return (
    <section className="py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 md:p-12 lg:p-16">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Free to get started
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Build Your Perfect Tech Stack?
              </h2>
              <p className="text-white/80 text-lg">
                Join 50,000+ professionals who trust TheSynLab for unbiased, data-driven tech decisions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/blog">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 w-full sm:w-auto">
                  Explore Reviews <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/scoring-hub">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 gap-2 w-full sm:w-auto">
                  <Shield className="h-4 w-4" />
                  Our Methodology
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
