export interface TriggerConfig {
  [key: string]: any;
}

export interface ActionConfig {
  type: string;
  config: Record<string, any>;
}

export interface Automation {
  id: string;
  name: string;
  description: string | null;
  trigger_type: string;
  trigger_config: TriggerConfig;
  actions: ActionConfig[];
  conditions: any[];
  is_active: boolean;
  created_by: string;
  run_count: number;
  last_run_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AutomationRun {
  id: string;
  automation_id: string;
  trigger_data: Record<string, any>;
  status: 'pending' | 'running' | 'success' | 'failed';
  error_log: string | null;
  executed_at: string;
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  icon: string | null;
  trigger_type: string;
  trigger_config: TriggerConfig;
  actions: ActionConfig[];
  conditions: any[];
  is_featured: boolean;
  use_count: number;
  created_at: string;
}

export type TriggerType = 
  | 'task_created'
  | 'task_updated'
  | 'task_completed'
  | 'task_overdue'
  | 'member_joined'
  | 'comment_added'
  | 'file_uploaded'
  | 'time_based'
  | 'schedule'
  | 'product_reviewed'
  | 'score_changed';

export type ActionType =
  | 'send_notification'
  | 'send_email'
  | 'assign_task'
  | 'update_status'
  | 'update_priority'
  | 'add_tag'
  | 'create_task'
  | 'generate_report'
  | 'webhook';

export const TRIGGER_OPTIONS: { value: TriggerType; label: string; description: string; icon: string }[] = [
  { value: 'task_created', label: 'Task Created', description: 'When a new task is created', icon: 'Plus' },
  { value: 'task_updated', label: 'Task Updated', description: 'When a task is modified', icon: 'Edit' },
  { value: 'task_completed', label: 'Task Completed', description: 'When a task is marked complete', icon: 'CheckCircle' },
  { value: 'task_overdue', label: 'Task Overdue', description: 'When a task passes its due date', icon: 'AlertCircle' },
  { value: 'member_joined', label: 'Member Joined', description: 'When someone joins the team', icon: 'UserPlus' },
  { value: 'comment_added', label: 'Comment Added', description: 'When a comment is posted', icon: 'MessageSquare' },
  { value: 'schedule', label: 'Scheduled', description: 'Run on a schedule (daily, weekly)', icon: 'Calendar' },
  { value: 'product_reviewed', label: 'Product Reviewed', description: 'When a product review is submitted', icon: 'Star' },
  { value: 'score_changed', label: 'Score Changed', description: 'When trust/integration score changes', icon: 'TrendingUp' },
];

export const ACTION_OPTIONS: { value: ActionType; label: string; description: string; icon: string }[] = [
  { value: 'send_notification', label: 'Send Notification', description: 'Send an in-app notification', icon: 'Bell' },
  { value: 'send_email', label: 'Send Email', description: 'Send an email to specified recipients', icon: 'Mail' },
  { value: 'assign_task', label: 'Assign Task', description: 'Assign to a team member', icon: 'UserCheck' },
  { value: 'update_status', label: 'Update Status', description: 'Change the status of an item', icon: 'RefreshCw' },
  { value: 'update_priority', label: 'Update Priority', description: 'Change priority level', icon: 'Flag' },
  { value: 'add_tag', label: 'Add Tag', description: 'Add a tag or label', icon: 'Tag' },
  { value: 'create_task', label: 'Create Task', description: 'Create a new task automatically', icon: 'FilePlus' },
  { value: 'generate_report', label: 'Generate Report', description: 'Create a summary report', icon: 'FileText' },
  { value: 'webhook', label: 'Webhook', description: 'Call an external URL', icon: 'Globe' },
];
