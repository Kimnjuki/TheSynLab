import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useProfile() {
  const profile = useQuery(api.profiles.getCurrent);

  return {
    profile,
    isLoading: profile === undefined,
    error: null,
  };
}

export function useUpdateProfile() {
  const updateProfile = useMutation(api.profiles.update);

  return {
    updateProfile: async (data: {
      displayName?: string;
      avatarUrl?: string;
      bio?: string;
      website?: string;
      location?: string;
      notificationPreferences?: any;
    }) => {
      return await updateProfile(data);
    },
    isLoading: false,
  };
}

export function useUpsertProfile() {
  const upsertProfile = useMutation(api.profiles.upsert);

  return {
    upsertProfile: async (data: {
      displayName?: string;
      avatarUrl?: string;
      bio?: string;
      website?: string;
      location?: string;
      notificationPreferences?: any;
    }) => {
      return await upsertProfile(data);
    },
    isLoading: false,
  };
}

export function useHasRole(role: string) {
  const hasRole = useQuery(api.profiles.hasRole, { role });

  return {
    hasRole: hasRole ?? false,
    isLoading: hasRole === undefined,
  };
}

export function useRoles() {
  const roles = useQuery(api.profiles.getRoles);

  return {
    roles: roles || [],
    isLoading: roles === undefined,
  };
}

export function useAssignRole() {
  const assignRole = useMutation(api.profiles.assignRole);

  return {
    assignRole: async (userId: string, role: string) => {
      return await assignRole({ userId, role });
    },
    isLoading: false,
  };
}
