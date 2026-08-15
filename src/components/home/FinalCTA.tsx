import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="bg-tsl-accent py-16 md:py-20">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 max-w-4xl mx-auto text-center lg:text-left">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-tsl-cta-primary-text mb-3">
              Ready to choose your next tool?
            </h2>
            <p className="text-tsl-bg-primary/70 text-lg">
              Start with our scoring hub or build your ideal stack in under a minute.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Button size="lg" asChild className="bg-tsl-bg-primary text-tsl-text hover:bg-tsl-bg-primary/90 gap-2 font-semibold">
              <Link to="/scoring-hub">
                Compare Tools <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-tsl-bg-primary/30 text-tsl-bg-primary hover:bg-tsl-bg-primary/10 gap-2 font-semibold">
              <Link to="/decision-studio">
                <Shield className="h-5 w-5" />
                Build Your Stack
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
