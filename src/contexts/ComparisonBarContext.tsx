import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface ComparisonProduct {
  id: string;
  name: string;
  slug: string;
  category?: string;
  overallScore?: number;
}

interface ComparisonBarContextValue {
  selected: ComparisonProduct[];
  add: (product: ComparisonProduct) => void;
  remove: (id: string) => void;
  clearAll: () => void;
  isSelected: (id: string) => boolean;
  canAdd: boolean;
}

const ComparisonBarContext = createContext<ComparisonBarContextValue | null>(null);

export function ComparisonBarProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<ComparisonProduct[]>([]);

  const add = useCallback((product: ComparisonProduct) => {
    setSelected((prev) => {
      if (prev.length >= 4 || prev.some((p) => p.id === product.id)) return prev;
      return [...prev, product];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setSelected((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const clearAll = useCallback(() => setSelected([]), []);

  const isSelected = useCallback((id: string) => selected.some((p) => p.id === id), [selected]);

  return (
    <ComparisonBarContext.Provider value={{ selected, add, remove, clearAll, isSelected, canAdd: selected.length < 4 }}>
      {children}
    </ComparisonBarContext.Provider>
  );
}

export function useComparisonBar() {
  const ctx = useContext(ComparisonBarContext);
  if (!ctx) throw new Error("useComparisonBar must be used within ComparisonBarProvider");
  return ctx;
}
