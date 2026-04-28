import { useComparisonBar, ComparisonProduct } from "@/contexts/ComparisonBarContext";

export function useAddToComparison() {
  const { add, remove, isSelected, canAdd } = useComparisonBar();

  function toggle(product: ComparisonProduct) {
    if (isSelected(product.id)) {
      remove(product.id);
    } else {
      add(product);
    }
  }

  return { toggle, isSelected, canAdd };
}
