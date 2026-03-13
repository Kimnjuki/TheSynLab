import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useSetups(hubFilter: string) {
  const setups = useQuery(
    api.posts.list,
    hubFilter && hubFilter !== "all"
      ? { hub: hubFilter, postType: "blueprint" }
      : { postType: "blueprint" }
  );

  return {
    setups: (setups || []) as any[],
    isLoading: setups === undefined,
    error: null,
    refetch: () => {},
  };
}
