import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-secondary to-primary">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-sm font-medium text-white">
            <Mail className="h-4 w-4" />
            Weekly Newsletter
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Stay Ahead of the Tech Curve
          </h2>
          
          <p className="text-lg text-white/90">
            Get our latest reviews, integration guides, and exclusive workflow 
            blueprints delivered every Tuesday morning.
          </p>

          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-4">
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus-visible:ring-white/40"
            />
            <Button type="submit" size="lg" className="bg-white text-primary hover:bg-white/90 shrink-0">
              Subscribe
            </Button>
          </form>

          <p className="text-xs text-white/70">
            Join 50,000+ professionals. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
