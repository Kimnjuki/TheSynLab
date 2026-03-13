import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useAutomations() {
  const automations = useQuery(api.automations.list);

  return {
    automations: (automations || []) as any[],
    isLoading: automations === undefined,
    error: null,
    refetch: () => {}, // Convex auto-updates
  };
}

export function useAutomation(id: string) {
  const automation = useQuery(api.automations.get, { id: id as any });

  return {
    automation,
    isLoading: automation === undefined,
    error: null,
  };
}

export function useAutomationTemplates(category?: string) {
  const templates = useQuery(api.automations.listTemplates, { category });

  return {
    templates: (templates || []) as any[],
    isLoading: templates === undefined,
    error: null,
  };
}

export function useFeaturedTemplates() {
  const templates = useQuery(api.automations.getFeaturedTemplates);

  return {
    templates: (templates || []) as any[],
    isLoading: templates === undefined,
    error: null,
  };
}

export function useCreateAutomation() {
  const createAutomation = useMutation(api.automations.create);

  return {
    createAutomation: async (data: any) => createAutomation(data),
    isLoading: false,
  };
}

export function useCreateFromTemplate() {
  const createFromTemplate = useMutation(api.automations.createFromTemplate);

  return {
    createFromTemplate: async (templateId: string) => {
      return await createFromTemplate({ templateId: templateId as any });
    },
    isLoading: false,
  };
}

export function useUpdateAutomation() {
  const updateAutomation = useMutation(api.automations.update);

  return {
    updateAutomation: async (data: any) => updateAutomation(data as any),
    isLoading: false,
  };
}

export function useToggleAutomation() {
  const toggleActive = useMutation(api.automations.toggleActive);

  return {
    toggleActive: async (id: string) => toggleActive({ id: id as any }),
    isLoading: false,
  };
}

export function useDeleteAutomation() {
  const deleteAutomation = useMutation(api.automations.remove);

  return {
    deleteAutomation: async (id: string) => deleteAutomation({ id: id as any }),
    isLoading: false,
  };
}

export function useAutomationRuns(automationId: string) {
  const runs = useQuery(api.automations.getRuns, { automationId: automationId as any });

  return {
    runs: (runs || []) as any[],
    isLoading: runs === undefined,
    error: null,
  };
}
