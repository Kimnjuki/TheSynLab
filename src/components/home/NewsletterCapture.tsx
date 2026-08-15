import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

const NewsletterCapture = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    setEmail("");
    alert("Thanks for subscribing!");
  };

  return (
    <section className="bg-tsl-bg-primary py-16 md:py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-tsl-accent/10 text-tsl-accent mb-6">
            <Mail className="h-6 w-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-tsl-text mb-4">
            Get weekly tool drops, comparisons, and stack ideas.
          </h2>
          <p className="text-tsl-text-secondary mb-8">
            Join 10,000+ tech buyers who get our best findings delivered every week.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-tsl-surface border-tsl-border text-tsl-text placeholder:text-tsl-text-secondary focus:ring-tsl-accent"
              required
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-tsl-cta-primary-bg text-tsl-cta-primary-text hover:bg-tsl-cta-primary-bg/90 font-semibold"
            >
              {isSubmitting ? "Subscribing…" : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-tsl-text-secondary mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterCapture;
