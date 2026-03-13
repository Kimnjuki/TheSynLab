// Re-export Convex automations hooks for backward compatibility
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@/contexts/AuthContext";
import { Automation, AutomationTemplate, ActionConfig } from "@/types/automation";
import { toast } from "sonner";

export function useAutomations() {
  const { user } = useAuth();

  const automationsData = useQuery(api.automations.list);
  const templatesData = useQuery(api.automations.listTemplates, {});
  const createAutomationMutation = useMutation(api.automations.create);
  const updateAutomationMutation = useMutation(api.automations.update);
  const deleteAutomationMutation = useMutation(api.automations.remove);
  const toggleActiveMutation = useMutation(api.automations.toggleActive);
  const createFromTemplateMutation = useMutation(api.automations.createFromTemplate);

  const automations = ((automationsData || []) as any[]).map(item => ({
    ...item,
    id: item._id,
    actions: (item.actions || []) as ActionConfig[],
    conditions: (item.conditions || []) as any[],
    trigger_config: (item.triggerConfig || {}) as Record<string, any>,
    trigger_type: item.triggerType,
    is_active: item.isActive,
    created_by: item.createdBy,
    run_count: item.runCount,
    last_run_at: item.lastRunAt,
    created_at: item._creationTime,
    updated_at: item._creationTime,
  })) as Automation[];

  const templates = ((templatesData || []) as any[]).map(item => ({
    ...item,
    id: item._id,
    actions: (item.actions || []) as ActionConfig[],
    conditions: (item.conditions || []) as any[],
    trigger_config: (item.triggerConfig || {}) as Record<string, any>,
    trigger_type: item.triggerType,
    is_featured: item.isFeatured,
    use_count: item.useCount,
    created_at: item._creationTime,
  })) as AutomationTemplate[];

  const createAutomation = {
    mutateAsync: async (automation: Partial<Automation>) => {
      if (!user) throw new Error("Must be logged in");
      
      try {
        const result = await createAutomationMutation({
          name: automation.name!,
          description: automation.description,
          triggerType: automation.trigger_type!,
          triggerConfig: automation.trigger_config || {},
          actions: automation.actions as any[] || [],
          conditions: automation.conditions || [],
        });
        toast.success("Automation created successfully");
        return result;
      } catch (error: any) {
        toast.error("Failed to create automation: " + error.message);
        throw error;
      }
    },
    mutate: (automation: Partial<Automation>) => {
      createAutomation.mutateAsync(automation);
    },
  };

  const updateAutomation = {
    mutateAsync: async ({ id, ...updates }: Partial<Automation> & { id: string }) => {
      try {
        const result = await updateAutomationMutation({
          id: id as any,
          name: updates.name,
          description: updates.description,
          triggerType: updates.trigger_type,
          triggerConfig: updates.trigger_config,
          actions: updates.actions as any[],
          conditions: updates.conditions,
          isActive: updates.is_active,
        });
        toast.success("Automation updated");
        return result;
      } catch (error: any) {
        toast.error("Failed to update: " + error.message);
        throw error;
      }
    },
    mutate: (data: Partial<Automation> & { id: string }) => {
      updateAutomation.mutateAsync(data);
    },
  };

  const deleteAutomation = {
    mutateAsync: async (id: string) => {
      try {
        await deleteAutomationMutation({ id: id as any });
        toast.success("Automation deleted");
      } catch (error: any) {
        toast.error("Failed to delete: " + error.message);
        throw error;
      }
    },
    mutate: (id: string) => {
      deleteAutomation.mutateAsync(id);
    },
  };

  const toggleAutomation = {
    mutateAsync: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      try {
        const result = await toggleActiveMutation({ id: id as any });
        toast.success(is_active ? "Automation enabled" : "Automation paused");
        return result;
      } catch (error: any) {
        toast.error("Failed to toggle: " + error.message);
        throw error;
      }
    },
    mutate: (data: { id: string; is_active: boolean }) => {
      toggleAutomation.mutateAsync(data);
    },
  };

  const createFromTemplate = async (template: AutomationTemplate) => {
    if (!user) {
      toast.error("Please sign in to create automations");
      return;
    }

    try {
      const result = await createFromTemplateMutation({ 
        templateId: template.id as any,
      });
      toast.success("Automation created from template");
      return result;
    } catch (error: any) {
      toast.error("Failed to create from template: " + error.message);
      throw error;
    }
  };

  return {
    automations,
    templates,
    isLoading: automationsData === undefined,
    templatesLoading: templatesData === undefined,
    createAutomation,
    updateAutomation,
    deleteAutomation,
    toggleAutomation,
    createFromTemplate,
  };
}
