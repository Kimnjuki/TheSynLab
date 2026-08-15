import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Shield, Users } from "lucide-react";

const stats = [
  { value: "300+", label: "tools reviewed" },
  { value: "14+", label: "days minimum hands-on testing" },
  { value: "0", label: "pay-for-placement scores" },
];

const testimonials = [
  {
    quote: "TheSynLab's Trust Score saved us from buying a tool with terrible privacy practices. Their TCO calculator was spot-on.",
    name: "Sarah Chen",
    role: "Head of Ops, Meridian SaaS",
  },
  {
    quote: "Finally a review site that shows real integration depth. We used the Comparison Sandbox before our Q2 vendor selection.",
    name: "David Okafor",
    role: "CTO, Northwind Analytics",
  },
  {
    quote: "The 14-day minimum testing rule gives me confidence. I actually trust the recommendations here.",
    name: "Elena Rossi",
    role: "Freelance Product Consultant",
  },
];

const SocialProof = () => {
  return (
    <section className="bg-tsl-bg-primary py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.value === "0" ? Shield : stat.value === "300+" ? BarChart3 : Users;
            return (
              <Card key={stat.label} className="bg-tsl-surface border-tsl-border text-center">
                <CardContent className="flex flex-col items-center gap-3 p-8">
                  <Icon className="h-8 w-8 text-tsl-accent" />
                  <p className="text-4xl font-bold text-tsl-text">{stat.value}</p>
                  <p className="text-sm text-tsl-text-secondary">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <Card key={t.name} className="bg-tsl-surface border-tsl-border h-full">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <p className="text-tsl-text leading-relaxed">“{t.quote}”</p>
                <div className="mt-auto pt-4 border-t border-tsl-border">
                  <p className="text-sm font-semibold text-tsl-text">{t.name}</p>
                  <p className="text-xs text-tsl-text-secondary">{t.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
