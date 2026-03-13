import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useAdmin() {
  const isAdmin = useQuery(api.users.isAdmin);

  return {
    isAdmin: isAdmin ?? false,
    loading: isAdmin === undefined,
  };
}

export function useCurrentUser() {
  const user = useQuery(api.users.getCurrent);

  return {
    user,
    isLoading: user === undefined,
    error: null,
  };
}

export function useUserRoles(userId?: string) {
  const roles = useQuery(api.users.getUserRoles, { userId });

  return {
    roles: roles || [],
    isLoading: roles === undefined,
  };
}
