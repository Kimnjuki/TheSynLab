import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { BarChart3, Shield, FlaskConical, ArrowRight } from "lucide-react";
import { STATIC_PRODUCTS } from "@/data/staticProductData";

const stats = [
  { value: String(STATIC_PRODUCTS.length), label: "products in published catalog", icon: BarChart3 },
  { value: "14+", label: "day minimum testing protocol", icon: FlaskConical },
  { value: "0", label: "pay-for-placement scores", icon: Shield },
];

const principles = [
  {
    title: "Scores from one catalog snapshot",
    body: "Homepage cards pull the same Trust Scores as product pages — no separate sample numbers.",
  },
  {
    title: "Cost labels stay typed",
    body: "Annual seat quotes are never relabeled as 36-month TCO. Full ownership scenarios live in the calculator.",
  },
  {
    title: "Evidence over testimonials",
    body: "We do not publish named customer quotes without verified consent and experience attestation on file.",
  },
];

const SocialProof = () => {
  return (
    <section className="bg-tsl-bg-primary py-16 md:py-24">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat) => {
            const Icon = stat.icon;
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

        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-tsl-text mb-3">How we keep scores honest</h2>
          <p className="text-tsl-text-secondary max-w-2xl mx-auto">
            Integrity controls first. Reader quotes return only after consent and attestation are on file.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {principles.map((item) => (
            <Card key={item.title} className="bg-tsl-surface border-tsl-border h-full">
              <CardContent className="p-6 flex flex-col gap-3 h-full">
                <p className="text-sm font-semibold text-tsl-text">{item.title}</p>
                <p className="text-sm text-tsl-text-secondary leading-relaxed">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/methodology"
            className="inline-flex items-center gap-2 text-sm font-medium text-tsl-accent hover:underline"
          >
            Read the methodology <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/disclosure"
            className="inline-flex items-center gap-2 text-sm font-medium text-tsl-accent hover:underline"
          >
            Affiliate disclosure <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
