import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export function useTasks(projectId?: string, status?: string) {
  const tasks = useQuery(api.tasks.list, {
    projectId: projectId as any,
    status,
  });

  return {
    tasks: (tasks || []) as any[],
    isLoading: tasks === undefined,
    error: null,
    refetch: () => {}, // Convex auto-updates
  };
}

export function useTask(id: string) {
  const task = useQuery(api.tasks.get, { id: id as any });

  return {
    task,
    isLoading: task === undefined,
    error: null,
  };
}

export function useCreateTask() {
  const createTask = useMutation(api.tasks.create);

  return {
    createTask: async (data: any) => createTask(data as any),
    isLoading: false,
  };
}

export function useUpdateTask() {
  const updateTask = useMutation(api.tasks.update);

  return {
    updateTask: async (data: any) => updateTask(data as any),
    isLoading: false,
  };
}

export function useDeleteTask() {
  const deleteTask = useMutation(api.tasks.remove);

  return {
    deleteTask: async (id: string) => deleteTask({ id: id as any }),
    isLoading: false,
  };
}

export function useBulkUpdateTaskStatus() {
  const bulkUpdate = useMutation(api.tasks.bulkUpdateStatus);

  return {
    bulkUpdateStatus: async (ids: string[], status: string) => {
      return await bulkUpdate({ ids: ids as any, status });
    },
    isLoading: false,
  };
}

export function useProjects(status?: string) {
  const projects = useQuery(api.tasks.listProjects, { status });

  return {
    projects: (projects || []) as any[],
    isLoading: projects === undefined,
    error: null,
  };
}

export function useCreateProject() {
  const createProject = useMutation(api.tasks.createProject);

  return {
    createProject: async (data: any) => createProject(data),
    isLoading: false,
  };
}

export function useUpdateProject() {
  const updateProject = useMutation(api.tasks.updateProject);

  return {
    updateProject: async (data: any) => updateProject(data as any),
    isLoading: false,
  };
}
