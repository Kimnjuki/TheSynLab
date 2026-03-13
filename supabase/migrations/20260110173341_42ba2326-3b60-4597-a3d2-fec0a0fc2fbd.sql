-- Create table for user workflow configurations
CREATE TABLE public.user_workflow_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  workflow_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  workflow_connections JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  run_count INTEGER DEFAULT 0,
  last_run_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for saved prompt templates
CREATE TABLE public.user_saved_prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  template_id INTEGER,
  custom_prompt TEXT NOT NULL,
  variables JSONB DEFAULT '{}'::jsonb,
  title TEXT NOT NULL,
  category TEXT,
  use_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for smart home configurations
CREATE TABLE public.user_smart_home_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  ecosystem TEXT,
  devices JSONB NOT NULL DEFAULT '[]'::jsonb,
  scenes JSONB NOT NULL DEFAULT '[]'::jsonb,
  energy_budget NUMERIC,
  electricity_rate NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for ergonomic assessments
CREATE TABLE public.user_ergonomic_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  assessment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  score INTEGER NOT NULL DEFAULT 0,
  improvement_tips TEXT[],
  selected_bundle TEXT,
  role TEXT,
  budget NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_workflow_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_saved_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_smart_home_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_ergonomic_assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_workflow_configs
CREATE POLICY "Users can view their own workflow configs" 
ON public.user_workflow_configs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own workflow configs" 
ON public.user_workflow_configs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflow configs" 
ON public.user_workflow_configs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflow configs" 
ON public.user_workflow_configs FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for user_saved_prompts
CREATE POLICY "Users can view their own saved prompts" 
ON public.user_saved_prompts FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved prompts" 
ON public.user_saved_prompts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved prompts" 
ON public.user_saved_prompts FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved prompts" 
ON public.user_saved_prompts FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for user_smart_home_configs
CREATE POLICY "Users can view their own smart home configs" 
ON public.user_smart_home_configs FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own smart home configs" 
ON public.user_smart_home_configs FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own smart home configs" 
ON public.user_smart_home_configs FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own smart home configs" 
ON public.user_smart_home_configs FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies for user_ergonomic_assessments
CREATE POLICY "Users can view their own ergonomic assessments" 
ON public.user_ergonomic_assessments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ergonomic assessments" 
ON public.user_ergonomic_assessments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ergonomic assessments" 
ON public.user_ergonomic_assessments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ergonomic assessments" 
ON public.user_ergonomic_assessments FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER update_user_workflow_configs_updated_at
  BEFORE UPDATE ON public.user_workflow_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_saved_prompts_updated_at
  BEFORE UPDATE ON public.user_saved_prompts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_smart_home_configs_updated_at
  BEFORE UPDATE ON public.user_smart_home_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_ergonomic_assessments_updated_at
  BEFORE UPDATE ON public.user_ergonomic_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();