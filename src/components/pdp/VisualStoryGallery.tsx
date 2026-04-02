import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PDPSlide } from "./types";

type Props = {
  slides: PDPSlide[];
};

export function VisualStoryGallery({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const [annotated, setAnnotated] = useState(false);
  const [scenario, setScenario] = useState<string>("All");

  const scenarios = useMemo(() => {
    const set = new Set<string>(["All"]);
    slides.forEach((s) => (s.scenarioTags ?? []).forEach((t) => set.add(t)));
    return [...set];
  }, [slides]);

  const filtered = useMemo(() => {
    if (scenario === "All") return slides;
    return slides.filter((s) => (s.scenarioTags ?? []).includes(scenario));
  }, [slides, scenario]);

  const current = filtered[index] ?? filtered[0];
  if (!current) return null;

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Visual story gallery</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAnnotated(false)} aria-label="Show raw image">Raw</Button>
          <Button variant="outline" size="sm" onClick={() => setAnnotated(true)} aria-label="Show annotated image">Annotated</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {scenarios.map((tag) => (
          <Badge key={tag} variant={tag === scenario ? "default" : "outline"} className="cursor-pointer" onClick={() => { setScenario(tag); setIndex(0); }}>
            {tag}
          </Badge>
        ))}
      </div>

      <div className="rounded-xl border border-primary/30 bg-card p-3">
        <AnimatePresence mode="wait">
          <motion.img
            key={`${current._id}-${annotated ? "annotated" : "raw"}`}
            src={(annotated && current.annotatedImageUrl) ? current.annotatedImageUrl : current.imageUrl}
            alt={current.caption}
            className="w-full rounded-lg object-cover"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
          />
        </AnimatePresence>
        <p className="mt-2 text-sm text-muted-foreground">{current.caption}</p>
        <div className="mt-3 flex items-center justify-between">
          <Button size="sm" variant="ghost" onClick={() => setIndex((i) => Math.max(0, i - 1))} aria-label="Previous slide">Previous</Button>
          <span className="text-xs text-muted-foreground">{index + 1} / {filtered.length}</span>
          <Button size="sm" variant="ghost" onClick={() => setIndex((i) => Math.min(filtered.length - 1, i + 1))} aria-label="Next slide">Next</Button>
        </div>
      </div>
    </section>
  );
}
