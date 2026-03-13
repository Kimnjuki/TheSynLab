// Hub data hooks - migrated to local state (Convex tables not yet implemented for these)
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Workflow Config Types
export interface WorkflowConfig {
  id: string;
  name: string;
  description: string | null;
  workflow_nodes: any[];
  workflow_connections: any[];
  is_active: boolean;
  run_count: number;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

// Saved Prompt Types
export interface SavedPrompt {
  id: string;
  template_id: number | null;
  custom_prompt: string;
  variables: Record<string, string>;
  title: string;
  category: string | null;
  use_count: number;
  created_at: string;
  updated_at: string;
}

// Smart Home Config Types
export interface SmartHomeConfig {
  id: string;
  name: string;
  ecosystem: string | null;
  devices: any[];
  scenes: any[];
  energy_budget: number | null;
  electricity_rate: number | null;
  created_at: string;
  updated_at: string;
}

// Ergonomic Assessment Types
export interface ErgonomicAssessment {
  id: string;
  assessment_date: string;
  answers: Record<string, boolean>;
  score: number;
  improvement_tips: string[] | null;
  selected_bundle: string | null;
  role: string | null;
  budget: number | null;
  created_at: string;
  updated_at: string;
}

// Local storage helper
const getLocalData = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const setLocalData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Hook for Workflow Configs
export function useWorkflowConfigs() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<WorkflowConfig[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConfigs = () => {
    if (!user) return;
    setLoading(true);
    const data = getLocalData<WorkflowConfig>(`workflow_configs_${user.id}`);
    setConfigs(data);
    setLoading(false);
  };

  const saveConfig = async (config: Omit<WorkflowConfig, "id" | "created_at" | "updated_at" | "run_count" | "last_run_at">) => {
    if (!user) {
      toast.error("Please log in to save workflows");
      return null;
    }

    const newConfig: WorkflowConfig = {
      ...config,
      id: `wf_${Date.now()}`,
      run_count: 0,
      last_run_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [...configs, newConfig];
    setLocalData(`workflow_configs_${user.id}`, updated);
    setConfigs(updated);
    toast.success("Workflow saved successfully!");
    return newConfig;
  };

  const deleteConfig = async (id: string) => {
    if (!user) return;
    const updated = configs.filter((c) => c.id !== id);
    setLocalData(`workflow_configs_${user.id}`, updated);
    setConfigs(updated);
    toast.success("Workflow deleted");
  };

  useEffect(() => {
    if (user) fetchConfigs();
  }, [user]);

  return { configs, loading, saveConfig, deleteConfig, refetch: fetchConfigs };
}

// Hook for Saved Prompts
export function useSavedPrompts() {
  const { user } = useAuth();
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchPrompts = () => {
    if (!user) return;
    setLoading(true);
    const data = getLocalData<SavedPrompt>(`saved_prompts_${user.id}`);
    setPrompts(data);
    setLoading(false);
  };

  const savePrompt = async (prompt: {
    template_id?: number | null;
    custom_prompt: string;
    variables: Record<string, string>;
    title: string;
    category?: string | null;
  }) => {
    if (!user) {
      toast.error("Please log in to save prompts");
      return null;
    }

    const newPrompt: SavedPrompt = {
      id: `prompt_${Date.now()}`,
      template_id: prompt.template_id || null,
      custom_prompt: prompt.custom_prompt,
      variables: prompt.variables,
      title: prompt.title,
      category: prompt.category || null,
      use_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [...prompts, newPrompt];
    setLocalData(`saved_prompts_${user.id}`, updated);
    setPrompts(updated);
    toast.success("Prompt saved successfully!");
    return newPrompt;
  };

  const deletePrompt = async (id: string) => {
    if (!user) return;
    const updated = prompts.filter((p) => p.id !== id);
    setLocalData(`saved_prompts_${user.id}`, updated);
    setPrompts(updated);
    toast.success("Prompt deleted");
  };

  const incrementUseCount = async (id: string) => {
    if (!user) return;
    const updated = prompts.map((p) =>
      p.id === id ? { ...p, use_count: p.use_count + 1 } : p
    );
    setLocalData(`saved_prompts_${user.id}`, updated);
    setPrompts(updated);
  };

  useEffect(() => {
    if (user) fetchPrompts();
  }, [user]);

  return { prompts, loading, savePrompt, deletePrompt, incrementUseCount, refetch: fetchPrompts };
}

// Hook for Smart Home Configs
export function useSmartHomeConfigs() {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<SmartHomeConfig[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchConfigs = () => {
    if (!user) return;
    setLoading(true);
    const data = getLocalData<SmartHomeConfig>(`smart_home_configs_${user.id}`);
    setConfigs(data);
    setLoading(false);
  };

  const saveConfig = async (config: {
    name: string;
    ecosystem?: string | null;
    devices: any[];
    scenes: any[];
    energy_budget?: number | null;
    electricity_rate?: number | null;
  }) => {
    if (!user) {
      toast.error("Please log in to save configurations");
      return null;
    }

    const newConfig: SmartHomeConfig = {
      id: `shc_${Date.now()}`,
      name: config.name,
      ecosystem: config.ecosystem || null,
      devices: config.devices,
      scenes: config.scenes,
      energy_budget: config.energy_budget || null,
      electricity_rate: config.electricity_rate || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [...configs, newConfig];
    setLocalData(`smart_home_configs_${user.id}`, updated);
    setConfigs(updated);
    toast.success("Smart home config saved!");
    return newConfig;
  };

  const deleteConfig = async (id: string) => {
    if (!user) return;
    const updated = configs.filter((c) => c.id !== id);
    setLocalData(`smart_home_configs_${user.id}`, updated);
    setConfigs(updated);
    toast.success("Configuration deleted");
  };

  useEffect(() => {
    if (user) fetchConfigs();
  }, [user]);

  return { configs, loading, saveConfig, deleteConfig, refetch: fetchConfigs };
}

// Hook for Ergonomic Assessments
export function useErgonomicAssessments() {
  const { user } = useAuth();
  const [assessments, setAssessments] = useState<ErgonomicAssessment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAssessments = () => {
    if (!user) return;
    setLoading(true);
    const data = getLocalData<ErgonomicAssessment>(`ergonomic_assessments_${user.id}`);
    setAssessments(data);
    setLoading(false);
  };

  const saveAssessment = async (assessment: {
    answers: Record<string, boolean>;
    score: number;
    improvement_tips?: string[];
    selected_bundle?: string | null;
    role?: string | null;
    budget?: number | null;
  }) => {
    if (!user) {
      toast.error("Please log in to save assessments");
      return null;
    }

    const newAssessment: ErgonomicAssessment = {
      id: `ergo_${Date.now()}`,
      assessment_date: new Date().toISOString(),
      answers: assessment.answers,
      score: assessment.score,
      improvement_tips: assessment.improvement_tips || null,
      selected_bundle: assessment.selected_bundle || null,
      role: assessment.role || null,
      budget: assessment.budget || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const updated = [...assessments, newAssessment];
    setLocalData(`ergonomic_assessments_${user.id}`, updated);
    setAssessments(updated);
    toast.success("Assessment saved!");
    return newAssessment;
  };

  const deleteAssessment = async (id: string) => {
    if (!user) return;
    const updated = assessments.filter((a) => a.id !== id);
    setLocalData(`ergonomic_assessments_${user.id}`, updated);
    setAssessments(updated);
    toast.success("Assessment deleted");
  };

  useEffect(() => {
    if (user) fetchAssessments();
  }, [user]);

  return { assessments, loading, saveAssessment, deleteAssessment, refetch: fetchAssessments };
}
