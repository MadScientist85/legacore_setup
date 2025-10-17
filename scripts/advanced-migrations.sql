-- Advanced LEGACORE™ Database Schema with Full Agent Ecosystem

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS agent_deployments CASCADE;
DROP TABLE IF EXISTS agent_conversations CASCADE;
DROP TABLE IF EXISTS legacy_vault_documents CASCADE;
DROP TABLE IF EXISTS business_verticals CASCADE;
DROP TABLE IF EXISTS agent_performance_metrics CASCADE;
DROP TABLE IF EXISTS workflow_templates CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;

-- Enhanced agents table with full metadata
ALTER TABLE agents ADD COLUMN IF NOT EXISTS backstory TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS mission TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS personality TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS knowledge_base JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS guardrails JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS deployment_config JSONB;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS performance_metrics JSONB;

-- Agent deployments tracking
CREATE TABLE agent_deployments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  deployment_name TEXT NOT NULL,
  configuration JSONB,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'stopped', 'error')),
  environment TEXT DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production')),
  api_endpoint TEXT,
  webhook_url TEXT,
  rate_limits JSONB,
  usage_stats JSONB DEFAULT '{}',
  deployed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent conversations and interactions
CREATE TABLE agent_conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES agent_deployments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  thread_id TEXT,
  conversation_title TEXT,
  messages JSONB DEFAULT '[]',
  context_data JSONB DEFAULT '{}',
  sentiment_analysis JSONB,
  performance_score DECIMAL(3,2),
  resolution_status TEXT CHECK (resolution_status IN ('pending', 'resolved', 'escalated', 'archived')),
  tags TEXT[],
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Legacy Vault - Document Management System
CREATE TABLE legacy_vault_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL,
  category TEXT,
  subcategory TEXT,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  content_hash TEXT,
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  version_number INTEGER DEFAULT 1,
  parent_document_id UUID REFERENCES legacy_vault_documents(id),
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'shared', 'public')),
  encryption_status BOOLEAN DEFAULT FALSE,
  retention_policy JSONB,
  compliance_flags JSONB DEFAULT '{}',
  ai_analysis JSONB,
  search_vector tsvector,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_at TIMESTAMP WITH TIME ZONE
);

-- Business verticals management
CREATE TABLE business_verticals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  vertical_name TEXT NOT NULL,
  description TEXT,
  industry_code TEXT,
  primary_agent_id UUID REFERENCES agents(id),
  secondary_agents UUID[],
  revenue_target DECIMAL(15,2),
  current_revenue DECIMAL(15,2) DEFAULT 0,
  kpi_metrics JSONB DEFAULT '{}',
  automation_level DECIMAL(3,2) DEFAULT 0.00,
  compliance_requirements JSONB DEFAULT '{}',
  risk_assessment JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent performance metrics
CREATE TABLE agent_performance_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  deployment_id UUID REFERENCES agent_deployments(id) ON DELETE CASCADE,
  metric_date DATE DEFAULT CURRENT_DATE,
  total_interactions INTEGER DEFAULT 0,
  successful_resolutions INTEGER DEFAULT 0,
  average_response_time DECIMAL(8,3),
  user_satisfaction_score DECIMAL(3,2),
  error_rate DECIMAL(5,4),
  cost_per_interaction DECIMAL(10,4),
  revenue_generated DECIMAL(15,2),
  efficiency_score DECIMAL(3,2),
  uptime_percentage DECIMAL(5,2),
  custom_metrics JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workflow templates for automation
CREATE TABLE workflow_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  template_name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  workflow_steps JSONB NOT NULL,
  trigger_conditions JSONB,
  agent_assignments JSONB,
  input_schema JSONB,
  output_schema JSONB,
  success_criteria JSONB,
  error_handling JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  usage_count INTEGER DEFAULT 0,
  rating DECIMAL(3,2),
  tags TEXT[],
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences and customization
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  preference_category TEXT NOT NULL,
  preference_key TEXT NOT NULL,
  preference_value JSONB,
  is_encrypted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, preference_category, preference_key)
);

-- Indexes for performance optimization
CREATE INDEX idx_agent_deployments_user_id ON agent_deployments(user_id);
CREATE INDEX idx_agent_deployments_status ON agent_deployments(status);
CREATE INDEX idx_agent_conversations_agent_id ON agent_conversations(agent_id);
CREATE INDEX idx_agent_conversations_user_id ON agent_conversations(user_id);
CREATE INDEX idx_agent_conversations_thread_id ON agent_conversations(thread_id);
CREATE INDEX idx_legacy_vault_user_id ON legacy_vault_documents(user_id);
CREATE INDEX idx_legacy_vault_category ON legacy_vault_documents(category);
CREATE INDEX idx_legacy_vault_tags ON legacy_vault_documents USING GIN(tags);
CREATE INDEX idx_legacy_vault_search ON legacy_vault_documents USING GIN(search_vector);
CREATE INDEX idx_business_verticals_user_id ON business_verticals(user_id);
CREATE INDEX idx_performance_metrics_agent_id ON agent_performance_metrics(agent_id);
CREATE INDEX idx_performance_metrics_date ON agent_performance_metrics(metric_date);
CREATE INDEX idx_workflow_templates_user_id ON workflow_templates(user_id);
CREATE INDEX idx_workflow_templates_category ON workflow_templates(category);
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Row Level Security Policies
ALTER TABLE agent_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_vault_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user data isolation
CREATE POLICY "Users can only access their own deployments" ON agent_deployments
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own conversations" ON agent_conversations
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own documents" ON legacy_vault_documents
  FOR ALL USING (user_id = auth.uid() OR access_level = 'public');

CREATE POLICY "Users can only access their own verticals" ON business_verticals
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own metrics" ON agent_performance_metrics
  FOR ALL USING (EXISTS (
    SELECT 1 FROM agent_deployments 
    WHERE agent_deployments.id = agent_performance_metrics.deployment_id 
    AND agent_deployments.user_id = auth.uid()
  ));

CREATE POLICY "Users can access public templates and their own" ON workflow_templates
  FOR ALL USING (user_id = auth.uid() OR is_public = true);

CREATE POLICY "Users can only access their own preferences" ON user_preferences
  FOR ALL USING (user_id = auth.uid());

-- Functions for automated tasks
CREATE OR REPLACE FUNCTION update_agent_last_activity()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE agent_deployments 
  SET last_activity = NOW() 
  WHERE id = NEW.deployment_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_agent_activity
  AFTER INSERT ON agent_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_agent_last_activity();

-- Function to calculate agent performance scores
CREATE OR REPLACE FUNCTION calculate_agent_performance(agent_uuid UUID, date_from DATE, date_to DATE)
RETURNS TABLE(
  total_interactions BIGINT,
  success_rate DECIMAL,
  avg_response_time DECIMAL,
  user_satisfaction DECIMAL,
  efficiency_score DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_interactions,
    (COUNT(*) FILTER (WHERE resolution_status = 'resolved')::DECIMAL / COUNT(*)::DECIMAL * 100) as success_rate,
    AVG(EXTRACT(EPOCH FROM (last_message_at - started_at)))::DECIMAL as avg_response_time,
    AVG(performance_score)::DECIMAL as user_satisfaction,
    (COUNT(*) FILTER (WHERE resolution_status = 'resolved')::DECIMAL / 
     NULLIF(AVG(EXTRACT(EPOCH FROM (last_message_at - started_at))), 0))::DECIMAL as efficiency_score
  FROM agent_conversations 
  WHERE agent_id = agent_uuid 
    AND DATE(started_at) BETWEEN date_from AND date_to;
END;
$$ LANGUAGE plpgsql;

-- Function to update search vectors for documents
CREATE OR REPLACE FUNCTION update_document_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', 
    COALESCE(NEW.document_name, '') || ' ' ||
    COALESCE(NEW.category, '') || ' ' ||
    COALESCE(NEW.subcategory, '') || ' ' ||
    COALESCE(array_to_string(NEW.tags, ' '), '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_search_vector
  BEFORE INSERT OR UPDATE ON legacy_vault_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_document_search_vector();
