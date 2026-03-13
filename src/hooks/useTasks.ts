// Re-export Convex tasks hooks for backward compatibility
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Task, TaskStatus, TaskPriority, Project, TaskTemplate, TimeEntry, ChecklistItem } from "@/types/task";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export const useTasks = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const tasksData = useQuery(api.tasks.list, {});
  const createTaskMutation = useMutation(api.tasks.create);
  const updateTaskMutation = useMutation(api.tasks.update);
  const deleteTaskMutation = useMutation(api.tasks.remove);
  const bulkUpdateMutation = useMutation(api.tasks.bulkUpdateStatus);

  // Transform Convex data to match expected Task format
  const tasks = ((tasksData || []) as any[]).map(task => ({
    ...task,
    id: task._id,
    parent_task_id: task.parentTaskId,
    due_date: task.dueDate ? new Date(task.dueDate).toISOString() : null,
    estimated_hours: task.estimatedHours,
    actual_hours: task.actualHours,
    sort_order: task.sortOrder,
    created_by: task.createdBy,
    assigned_to: task.assignedTo,
    created_at: new Date(task._creationTime).toISOString(),
    updated_at: new Date(task._creationTime).toISOString(),
  })) as Task[];

  // Get subtasks for a parent task
  const getSubtasks = (parentId: string) => {
    return tasks.filter((t) => t.parent_task_id === parentId) ?? [];
  };

  // Get root tasks (no parent)
  const getRootTasks = () => {
    return tasks.filter((t) => !t.parent_task_id) ?? [];
  };

  const createTask = {
    mutateAsync: async (task: Partial<Task> & { title: string }) => {
      try {
        const result = await createTaskMutation({
          title: task.title,
          description: task.description ?? undefined,
          status: task.status ?? "todo",
          priority: task.priority ?? "medium",
          dueDate: task.due_date ? new Date(task.due_date).getTime() : undefined,
          estimatedHours: task.estimated_hours ?? undefined,
          tags: task.tags ?? [],
          parentTaskId: task.parent_task_id as any,
        });
        toast({ title: "Task created successfully" });
        return result;
      } catch (error: any) {
        toast({ title: "Failed to create task", description: error.message, variant: "destructive" });
        throw error;
      }
    },
    mutate: (task: Partial<Task> & { title: string }) => {
      createTask.mutateAsync(task);
    },
  };

  const updateTask = {
    mutateAsync: async ({ id, ...updates }: Partial<Task> & { id: string }) => {
      try {
        const result = await updateTaskMutation({
          id: id as any,
          title: updates.title,
          description: updates.description ?? undefined,
          status: updates.status,
          priority: updates.priority,
          dueDate: updates.due_date ? new Date(updates.due_date).getTime() : undefined,
          estimatedHours: updates.estimated_hours ?? undefined,
          tags: updates.tags,
          sortOrder: updates.sort_order,
        });
        return result;
      } catch (error: any) {
        toast({ title: "Failed to update task", description: error.message, variant: "destructive" });
        throw error;
      }
    },
    mutate: (data: Partial<Task> & { id: string }) => {
      updateTask.mutateAsync(data);
    },
  };

  const deleteTask = {
    mutateAsync: async (id: string) => {
      try {
        await deleteTaskMutation({ id: id as any });
        toast({ title: "Task deleted" });
      } catch (error: any) {
        toast({ title: "Failed to delete task", description: error.message, variant: "destructive" });
        throw error;
      }
    },
    mutate: (id: string) => {
      deleteTask.mutateAsync(id);
    },
  };

  const bulkUpdateTasks = {
    mutateAsync: async ({ ids, updates }: { ids: string[]; updates: Partial<Task> }) => {
      try {
        await bulkUpdateMutation({ 
          ids: ids as any, 
          status: updates.status || "todo" 
        });
        toast({ title: "Tasks updated" });
      } catch (error: any) {
        toast({ title: "Failed to update tasks", description: error.message, variant: "destructive" });
        throw error;
      }
    },
    mutate: (data: { ids: string[]; updates: Partial<Task> }) => {
      bulkUpdateTasks.mutateAsync(data);
    },
  };

  const bulkDeleteTasks = {
    mutateAsync: async (ids: string[]) => {
      try {
        for (const id of ids) {
          await deleteTaskMutation({ id: id as any });
        }
        toast({ title: "Tasks deleted" });
      } catch (error: any) {
        toast({ title: "Failed to delete tasks", description: error.message, variant: "destructive" });
        throw error;
      }
    },
    mutate: (ids: string[]) => {
      bulkDeleteTasks.mutateAsync(ids);
    },
  };

  return {
    tasks,
    isLoading: tasksData === undefined,
    error: null,
    getSubtasks,
    getRootTasks,
    createTask,
    updateTask,
    deleteTask,
    bulkUpdateTasks,
    bulkDeleteTasks,
  };
};

export const useProjects = () => {
  const { toast } = useToast();

  const projectsData = useQuery(api.tasks.listProjects, {});
  const createProjectMutation = useMutation(api.tasks.createProject);

  // Transform Convex data to match expected Project format
  const projects = ((projectsData || []) as any[]).map(project => ({
    ...project,
    id: project._id,
    owner_id: project.ownerId,
    created_at: new Date(project._creationTime).toISOString(),
    updated_at: new Date(project._creationTime).toISOString(),
  })) as Project[];

  const createProject = {
    mutateAsync: async (project: Partial<Project> & { name: string }) => {
      try {
        const result = await createProjectMutation({
          name: project.name,
          description: project.description ?? undefined,
          color: project.color ?? "#3b82f6",
        });
        toast({ title: "Project created successfully" });
        return result;
      } catch (error: any) {
        toast({ title: "Failed to create project", description: error.message, variant: "destructive" });
        throw error;
      }
    },
    mutate: (project: Partial<Project> & { name: string }) => {
      createProject.mutateAsync(project);
    },
  };

  return {
    projects,
    isLoading: projectsData === undefined,
    createProject,
  };
};

// Task templates hook - placeholder for Convex
export const useTaskTemplates = () => {
  const { toast } = useToast();

  const templatesQuery = {
    data: [] as TaskTemplate[],
    isLoading: false,
  };

  const createTemplate = {
    mutateAsync: async (template: Partial<TaskTemplate> & { name: string }) => {
      toast({ title: "Templates not yet migrated to Convex" });
      return template;
    },
    mutate: (template: Partial<TaskTemplate> & { name: string }) => {
      createTemplate.mutateAsync(template);
    },
  };

  return {
    templates: templatesQuery.data ?? [],
    isLoading: templatesQuery.isLoading,
    createTemplate,
  };
};

// Time entries hook - placeholder for Convex
export const useTimeEntries = (taskId?: string) => {
  const { toast } = useToast();

  return {
    timeEntries: [] as TimeEntry[],
    activeEntry: null,
    isLoading: false,
    startTimer: {
      mutateAsync: async (taskIdParam: string) => {
        toast({ title: "Time tracking not yet migrated to Convex" });
        return null;
      },
      mutate: (taskIdParam: string) => {},
    },
    stopTimer: {
      mutateAsync: async (entryId: string) => null,
      mutate: (entryId: string) => {},
    },
    addManualEntry: {
      mutateAsync: async (data: { taskId: string; minutes: number; description?: string }) => null,
      mutate: (data: { taskId: string; minutes: number; description?: string }) => {},
    },
    deleteEntry: {
      mutateAsync: async (entryId: string) => {},
      mutate: (entryId: string) => {},
    },
  };
};
