import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useAdSubmissions(status?: string) {
  const submissions = useQuery(api.adCompliance.list, { status });

  return {
    submissions: (submissions || []) as any[],
    isLoading: submissions === undefined,
    error: null,
    refetch: () => {}, // Convex auto-updates
  };
}

export function useAdSubmission(id: string) {
  const submission = useQuery(api.adCompliance.get, { id: id as any });

  return {
    submission,
    isLoading: submission === undefined,
    error: null,
  };
}

export function useCreateAdSubmission() {
  const createSubmission = useMutation(api.adCompliance.create);

  return {
    createSubmission: async (data: {
      title: string;
      description?: string;
      content: string;
      destinationUrl?: string;
      imageUrls?: string[];
      category?: string;
      targetAudience?: any;
    }) => {
      return await createSubmission(data);
    },
    isLoading: false,
  };
}

export function useUpdateAdStatus() {
  const updateStatus = useMutation(api.adCompliance.updateStatus);

  return {
    updateStatus: async (id: string, status: string, complianceScore?: number) => {
      return await updateStatus({ id: id as any, status, complianceScore });
    },
    isLoading: false,
  };
}

export function usePolicyRules(levelId?: number) {
  const rules = useQuery(api.adCompliance.getPolicyRules, { levelId });

  return {
    rules: (rules || []) as any[],
    isLoading: rules === undefined,
    error: null,
  };
}

export function useAddViolation() {
  const addViolation = useMutation(api.adCompliance.addViolation);

  return {
    addViolation: async (data: any) => addViolation(data as any),
    isLoading: false,
  };
}

export function useResolveViolation() {
  const resolveViolation = useMutation(api.adCompliance.resolveViolation);

  return {
    resolveViolation: async (id: string, resolutionNotes?: string) => {
      return await resolveViolation({ id: id as any, resolutionNotes });
    },
    isLoading: false,
  };
}

export function useComplianceStats() {
  const stats = useQuery(api.adCompliance.getStats);

  return {
    stats,
    isLoading: stats === undefined,
    error: null,
  };
}
