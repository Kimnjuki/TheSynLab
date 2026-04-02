import CountUp from "react-countup";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type Props = {
  toolCount: number;
  reviewCount: number;
  stackCount: number;
};

export function HubHeroBanner({ toolCount, reviewCount, stackCount }: Props) {
  return (
    <section className="rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6 text-white">
      <div className="mb-3 flex flex-wrap gap-2">
        <Badge variant="secondary">Hub</Badge>
        <Badge variant="outline">Products</Badge>
      </div>
      <h1 className="text-2xl font-bold md:text-3xl">
        Every product scored on trust, integration depth and lock-in risk.
      </h1>
      <p className="mt-2 text-sm text-slate-300">No vendor pay-to-play.</p>
      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
        {[["Tools", toolCount], ["Reviews", reviewCount], ["Stacks", stackCount]].map(([label, n]) => (
          <motion.div key={String(label)} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-lg border border-white/10 p-3">
            <div className="text-xl font-semibold"><CountUp end={Number(n)} duration={0.8} /></div>
            <div className="text-xs text-slate-300">{label}</div>
          </motion.div>
        ))}
      </div>
      <Button variant="secondary" className="mt-4">How scoring works</Button>
    </section>
  );
}
