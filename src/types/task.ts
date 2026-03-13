export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  assigned_to: string | null;
  created_by: string | null;
  project_id: string | null;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  tags: string[];
  dependencies: string[];
  parent_task_id: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Virtual fields for UI
  subtasks?: Task[];
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  color: string;
  status: 'active' | 'completed' | 'archived';
  owner_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeamMember {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  skills: string[];
  workload_capacity: number;
  current_workload: number;
  created_at: string;
}

export interface TaskTemplate {
  id: string;
  name: string;
  description: string | null;
  default_priority: TaskPriority;
  default_status: TaskStatus;
  estimated_hours: number | null;
  tags: string[];
  checklist: ChecklistItem[];
  created_by: string | null;
  is_public: boolean;
  use_count: number;
  created_at: string;
  updated_at: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface TimeEntry {
  id: string;
  task_id: string;
  user_id: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  description: string | null;
  created_at: string;
}

export const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string }> = {
  backlog: { label: 'Backlog', color: 'bg-muted text-muted-foreground' },
  todo: { label: 'To Do', color: 'bg-secondary/20 text-secondary-foreground' },
  in_progress: { label: 'In Progress', color: 'bg-primary/20 text-primary' },
  review: { label: 'Review', color: 'bg-accent/20 text-accent-foreground' },
  done: { label: 'Done', color: 'bg-green-500/20 text-green-700 dark:text-green-400' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  low: { label: 'Low', color: 'bg-muted text-muted-foreground' },
  medium: { label: 'Medium', color: 'bg-secondary/20 text-secondary-foreground' },
  high: { label: 'High', color: 'bg-orange-500/20 text-orange-700 dark:text-orange-400' },
  urgent: { label: 'Urgent', color: 'bg-destructive/20 text-destructive' },
};

export const COLUMNS: TaskStatus[] = ['backlog', 'todo', 'in_progress', 'review', 'done'];
