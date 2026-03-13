// Re-export Convex admin hooks for backward compatibility
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";

export function useAdmin() {
  const { user } = useAuth();
  
  // For development/Git Bash deployment, treat all logged-in users as admin
  // In production, this would check the novaUserRoles table
  const isAdmin = !!user;

  return { 
    isAdmin, 
    loading: false 
  };
}

export function useCurrentUser() {
  const { user } = useAuth();

  return {
    user: user ? {
      id: user.id,
      email: user.email,
      displayName: user.name,
    } : null,
    isLoading: false,
    error: null,
  };
}

export function useUserRoles(userId?: string) {
  // For development, return admin role for all users
  return {
    roles: userId ? ["admin"] : [],
    isLoading: false,
  };
}
