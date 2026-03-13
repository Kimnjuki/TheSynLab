-- Automations table for storing workflow configurations
CREATE TABLE public.automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  conditions JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT false,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  run_count INTEGER DEFAULT 0,
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation run history for tracking executions
CREATE TABLE public.automation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
  trigger_data JSONB DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'failed')),
  error_log TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Automation templates for pre-built workflows
CREATE TABLE public.automation_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  icon TEXT,
  trigger_type TEXT NOT NULL,
  trigger_config JSONB DEFAULT '{}',
  actions JSONB DEFAULT '[]',
  conditions JSONB DEFAULT '[]',
  is_featured BOOLEAN DEFAULT false,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for automations
CREATE POLICY "Users can view own automations"
  ON public.automations FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create automations"
  ON public.automations FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own automations"
  ON public.automations FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own automations"
  ON public.automations FOR DELETE
  USING (auth.uid() = created_by);

-- RLS Policies for automation_runs
CREATE POLICY "Users can view runs of own automations"
  ON public.automation_runs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.automations 
      WHERE automations.id = automation_runs.automation_id 
      AND automations.created_by = auth.uid()
    )
  );

-- RLS Policies for templates (public read)
CREATE POLICY "Anyone can view templates"
  ON public.automation_templates FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage templates"
  ON public.automation_templates FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Updated at trigger
CREATE TRIGGER update_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_review_updated_at();

-- Indexes for performance
CREATE INDEX idx_automations_created_by ON public.automations(created_by);
CREATE INDEX idx_automations_is_active ON public.automations(is_active) WHERE is_active = true;
CREATE INDEX idx_automation_runs_automation_id ON public.automation_runs(automation_id);
CREATE INDEX idx_automation_templates_category ON public.automation_templates(category);

-- Insert some template automations
INSERT INTO public.automation_templates (name, description, category, icon, trigger_type, trigger_config, actions, is_featured) VALUES
('Notify on High Priority', 'Send notification when a high-priority task is created', 'notifications', 'Bell', 'task_created', '{"priority": "high"}', '[{"type": "send_notification", "config": {"message": "New high-priority task: {{task.name}}"}}]', true),
('Auto-assign by Category', 'Automatically assign tasks based on category', 'assignment', 'UserPlus', 'task_created', '{}', '[{"type": "assign_task", "config": {"method": "by_category"}}]', true),
('Deadline Reminder', 'Send reminder 24h before task deadline', 'reminders', 'Clock', 'time_based', '{"hours_before": 24}', '[{"type": "send_notification", "config": {"message": "Task {{task.name}} is due in 24 hours"}}]', true),
('Escalate Overdue Tasks', 'Escalate tasks that are overdue', 'escalation', 'AlertTriangle', 'task_overdue', '{}', '[{"type": "update_priority", "config": {"priority": "urgent"}}, {"type": "send_notification", "config": {"message": "Task {{task.name}} is overdue and has been escalated"}}]', true),
('Welcome New Member', 'Send welcome message to new team members', 'onboarding', 'UserCheck', 'member_joined', '{}', '[{"type": "send_notification", "config": {"message": "Welcome to the team! Check out the getting started guide."}}]', false),
('Weekly Progress Report', 'Generate weekly progress summary', 'reports', 'FileText', 'schedule', '{"frequency": "weekly", "day": "monday", "time": "09:00"}', '[{"type": "generate_report", "config": {"type": "weekly_summary"}}]', true);