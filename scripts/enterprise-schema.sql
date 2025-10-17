-- LEGACORE™ Enterprise Multi-Tenant Database Schema
-- Complete data separation with row-level security

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Drop existing tables for clean migration
DROP TABLE IF EXISTS company_configurations CASCADE;
DROP TABLE IF EXISTS tenant_isolation CASCADE;
DROP TABLE IF EXISTS performance_analytics CASCADE;
DROP TABLE IF EXISTS legacy_vault_advanced CASCADE;
DROP TABLE IF EXISTS business_vertical_configs CASCADE;
DROP TABLE IF EXISTS agent_backstories CASCADE;
DROP TABLE IF EXISTS deployment_workflows CASCADE;
DROP TABLE IF EXISTS security_audit_logs CASCADE;
DROP TABLE IF EXISTS model_configurations CASCADE;

-- Companies/Tenants table - Core isolation layer
CREATE TABLE companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL UNIQUE,
  company_slug TEXT NOT NULL UNIQUE,
  subscription_tier TEXT DEFAULT 'enterprise' CHECK (subscription_tier IN ('starter', 'professional', 'enterprise')),
  max_agents INTEGER DEFAULT 50,
  max_storage_gb INTEGER DEFAULT 1000,
  max_monthly_requests INTEGER DEFAULT 100000,
  branding_config JSONB DEFAULT '{}',
  feature_flags JSONB DEFAULT '{}',
  compliance_settings JSONB DEFAULT '{}',
  data_retention_days INTEGER DEFAULT 2555, -- 7 years
  encryption_enabled BOOLEAN DEFAULT TRUE,
  audit_logging BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'archived'))
);

-- Enhanced users table with company isolation
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('super_admin', 'company_admin', 'manager', 'user', 'viewer'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Model configurations for language model switching
CREATE TABLE model_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  model_provider TEXT NOT NULL CHECK (model_provider IN ('openai', 'anthropic', 'google', 'azure', 'local')),
  model_name TEXT NOT NULL,
  api_key_encrypted TEXT,
  api_endpoint TEXT,
  model_parameters JSONB DEFAULT '{}',
  rate_limits JSONB DEFAULT '{}',
  cost_per_token DECIMAL(10,8),
  is_default BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, model_provider, model_name)
);

-- Enhanced agents table with company isolation
ALTER TABLE agents ADD COLUMN IF NOT EXISTS company_id UUID REFERENCES companies(id) ON DELETE CASCADE;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS model_config_id UUID REFERENCES model_configurations(id);
ALTER TABLE agents ADD COLUMN IF NOT EXISTS vertical_id UUID;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS deployment_status TEXT DEFAULT 'draft' CHECK (deployment_status IN ('draft', 'testing', 'staging', 'production', 'archived'));
ALTER TABLE agents ADD COLUMN IF NOT EXISTS version_number TEXT DEFAULT '1.0.0';
ALTER TABLE agents ADD COLUMN IF NOT EXISTS parent_agent_id UUID REFERENCES agents(id);

-- Business verticals with complete isolation
CREATE TABLE business_verticals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  vertical_name TEXT NOT NULL,
  vertical_slug TEXT NOT NULL,
  description TEXT,
  industry_codes TEXT[],
  primary_agent_id UUID REFERENCES agents(id),
  secondary_agents UUID[],
  data_schema JSONB DEFAULT '{}',
  workflow_config JSONB DEFAULT '{}',
  ui_config JSONB DEFAULT '{}',
  kpi_targets JSONB DEFAULT '{}',
  compliance_requirements JSONB DEFAULT '{}',
  revenue_target DECIMAL(15,2),
  current_revenue DECIMAL(15,2) DEFAULT 0,
  automation_level DECIMAL(3,2) DEFAULT 0.00,
  risk_score DECIMAL(3,2) DEFAULT 0.00,
  status TEXT DEFAULT 'active' CHECK (status IN ('planning', 'active', 'paused', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, vertical_slug)
);

-- Performance analytics with granular tracking
CREATE TABLE performance_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  vertical_id UUID REFERENCES business_verticals(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  metric_date DATE DEFAULT CURRENT_DATE,
  metric_hour INTEGER DEFAULT EXTRACT(HOUR FROM NOW()),
  
  -- Core Performance Metrics
  total_requests INTEGER DEFAULT 0,
  successful_requests INTEGER DEFAULT 0,
  failed_requests INTEGER DEFAULT 0,
  average_response_time_ms DECIMAL(10,3),
  p95_response_time_ms DECIMAL(10,3),
  p99_response_time_ms DECIMAL(10,3),
  
  -- Business Metrics
  tasks_completed INTEGER DEFAULT 0,
  tasks_failed INTEGER DEFAULT 0,
  user_satisfaction_score DECIMAL(3,2),
  conversion_rate DECIMAL(5,4),
  revenue_generated DECIMAL(15,2) DEFAULT 0,
  cost_incurred DECIMAL(15,2) DEFAULT 0,
  roi_percentage DECIMAL(5,2),
  
  -- Usage Metrics
  unique_users INTEGER DEFAULT 0,
  session_duration_avg DECIMAL(10,3),
  interactions_per_session DECIMAL(5,2),
  bounce_rate DECIMAL(5,4),
  
  -- Technical Metrics
  cpu_usage_avg DECIMAL(5,2),
  memory_usage_avg DECIMAL(5,2),
  error_rate DECIMAL(5,4),
  uptime_percentage DECIMAL(5,2),
  
  -- Custom Metrics (vertical-specific)
  custom_metrics JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, vertical_id, agent_id, metric_date, metric_hour)
);

-- Legacy Vault™ Advanced Document Management
CREATE TABLE legacy_vault_advanced (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  vertical_id UUID REFERENCES business_verticals(id) ON DELETE SET NULL,
  parent_folder_id UUID REFERENCES legacy_vault_advanced(id),
  
  -- Document Metadata
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('document', 'folder', 'template', 'sop', 'knowledge_base')),
  category TEXT,
  subcategory TEXT,
  file_path TEXT,
  file_size BIGINT,
  mime_type TEXT,
  content_hash TEXT,
  
  -- Version Control
  version_number TEXT DEFAULT '1.0.0',
  is_latest_version BOOLEAN DEFAULT TRUE,
  version_notes TEXT,
  
  -- Content and Analysis
  content_text TEXT,
  ai_summary TEXT,
  ai_tags TEXT[],
  ai_sentiment DECIMAL(3,2),
  ai_confidence DECIMAL(3,2),
  extracted_entities JSONB DEFAULT '{}',
  
  -- Access Control
  access_level TEXT DEFAULT 'private' CHECK (access_level IN ('private', 'team', 'vertical', 'company', 'public')),
  allowed_roles TEXT[],
  allowed_users UUID[],
  
  -- Security and Compliance
  encryption_status BOOLEAN DEFAULT TRUE,
  classification_level TEXT DEFAULT 'internal' CHECK (classification_level IN ('public', 'internal', 'confidential', 'restricted')),
  retention_policy JSONB DEFAULT '{}',
  compliance_flags JSONB DEFAULT '{}',
  
  -- Collaboration
  collaborators JSONB DEFAULT '{}',
  comments JSONB DEFAULT '[]',
  approval_workflow JSONB DEFAULT '{}',
  approval_status TEXT DEFAULT 'draft' CHECK (approval_status IN ('draft', 'pending', 'approved', 'rejected')),
  
  -- Search and Discovery
  search_vector tsvector,
  metadata JSONB DEFAULT '{}',
  tags TEXT[],
  
  -- Audit Trail
  created_by UUID REFERENCES users(id),
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  archived_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_document_structure CHECK (
    (document_type = 'folder' AND file_path IS NULL) OR
    (document_type != 'folder' AND file_path IS NOT NULL)
  )
);

-- Agent backstories and personality management
CREATE TABLE agent_backstories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
  backstory_version TEXT DEFAULT '1.0.0',
  
  -- Core Personality
  agent_name TEXT NOT NULL,
  personality_traits JSONB NOT NULL,
  communication_style JSONB NOT NULL,
  expertise_areas TEXT[],
  knowledge_base JSONB DEFAULT '{}',
  
  -- Behavioral Configuration
  response_patterns JSONB DEFAULT '{}',
  guardrails JSONB DEFAULT '{}',
  ethical_guidelines JSONB DEFAULT '{}',
  escalation_triggers JSONB DEFAULT '{}',
  
  -- Contextual Adaptation
  industry_context JSONB DEFAULT '{}',
  company_context JSONB DEFAULT '{}',
  user_interaction_history JSONB DEFAULT '{}',
  
  -- Learning and Improvement
  feedback_integration JSONB DEFAULT '{}',
  performance_adjustments JSONB DEFAULT '{}',
  continuous_learning_config JSONB DEFAULT '{}',
  
  -- Deployment Configuration
  system_prompt_template TEXT,
  function_definitions JSONB DEFAULT '{}',
  model_parameters JSONB DEFAULT '{}',
  
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(company_id, agent_id, backstory_version)
);

-- Deployment workflows and automation
CREATE TABLE deployment_workflows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  workflow_name TEXT NOT NULL,
  workflow_type TEXT CHECK (workflow_type IN ('agent_deployment', 'vertical_setup', 'data_migration', 'security_update')),
  
  -- Workflow Definition
  workflow_steps JSONB NOT NULL,
  prerequisites JSONB DEFAULT '{}',
  success_criteria JSONB DEFAULT '{}',
  rollback_steps JSONB DEFAULT '{}',
  
  -- Execution Configuration
  execution_environment TEXT DEFAULT 'production' CHECK (execution_environment IN ('development', 'staging', 'production')),
  scheduled_execution TIMESTAMP WITH TIME ZONE,
  auto_execute BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT TRUE,
  
  -- Monitoring and Alerting
  monitoring_config JSONB DEFAULT '{}',
  alert_config JSONB DEFAULT '{}',
  notification_recipients UUID[],
  
  -- Status and History
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'executing', 'completed', 'failed', 'cancelled')),
  execution_history JSONB DEFAULT '[]',
  last_execution TIMESTAMP WITH TIME ZONE,
  next_execution TIMESTAMP WITH TIME ZONE,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(company_id, workflow_name)
);

-- Security audit logs
CREATE TABLE security_audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Event Details
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK (event_category IN ('authentication', 'authorization', 'data_access', 'configuration', 'deployment', 'system')),
  event_description TEXT NOT NULL,
  event_severity TEXT DEFAULT 'info' CHECK (event_severity IN ('info', 'warning', 'error', 'critical')),
  
  -- Context Information
  resource_type TEXT,
  resource_id TEXT,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  
  -- Request/Response Data
  request_data JSONB DEFAULT '{}',
  response_data JSONB DEFAULT '{}',
  
  -- Security Analysis
  risk_score DECIMAL(3,2),
  anomaly_detected BOOLEAN DEFAULT FALSE,
  threat_indicators JSONB DEFAULT '{}',
  
  -- Compliance
  compliance_tags TEXT[],
  retention_required BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes for performance
  INDEX (company_id, created_at),
  INDEX (event_category, event_severity),
  INDEX (user_id, created_at)
);

-- Company-specific configurations
CREATE TABLE company_configurations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  config_category TEXT NOT NULL,
  config_key TEXT NOT NULL,
  config_value JSONB NOT NULL,
  config_schema JSONB,
  is_encrypted BOOLEAN DEFAULT FALSE,
  is_sensitive BOOLEAN DEFAULT FALSE,
  environment TEXT DEFAULT 'production' CHECK (environment IN ('development', 'staging', 'production', 'all')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(company_id, config_category, config_key, environment)
);

-- Indexes for performance optimization
CREATE INDEX idx_companies_slug ON companies(company_slug);
CREATE INDEX idx_users_company_role ON users(company_id, role);
CREATE INDEX idx_agents_company_vertical ON agents(company_id, vertical_id);
CREATE INDEX idx_verticals_company_status ON business_verticals(company_id, status);
CREATE INDEX idx_analytics_company_date ON performance_analytics(company_id, metric_date);
CREATE INDEX idx_vault_company_type ON legacy_vault_advanced(company_id, document_type);
CREATE INDEX idx_vault_search ON legacy_vault_advanced USING GIN(search_vector);
CREATE INDEX idx_backstories_company_agent ON agent_backstories(company_id, agent_id);
CREATE INDEX idx_workflows_company_status ON deployment_workflows(company_id, status);
CREATE INDEX idx_audit_company_time ON security_audit_logs(company_id, created_at);
CREATE INDEX idx_configs_company_category ON company_configurations(company_id, config_category);

-- Row Level Security Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE model_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_verticals ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE legacy_vault_advanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_backstories ENABLE ROW LEVEL SECURITY;
ALTER TABLE deployment_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for strict data separation
CREATE POLICY "Company isolation" ON companies
  FOR ALL USING (
    id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) OR 
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "User company isolation" ON users
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) OR 
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
    )
  );

CREATE POLICY "Model config isolation" ON model_configurations
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Agent isolation" ON agents
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Vertical isolation" ON business_verticals
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Analytics isolation" ON performance_analytics
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Vault isolation" ON legacy_vault_advanced
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) AND (
      access_level = 'public' OR
      access_level = 'company' OR
      (access_level = 'team' AND vertical_id IN (
        SELECT id FROM business_verticals WHERE company_id IN (
          SELECT company_id FROM users WHERE id = auth.uid()
        )
      )) OR
      (access_level = 'private' AND created_by = auth.uid()) OR
      auth.uid() = ANY(allowed_users) OR
      EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role = ANY(allowed_roles)
      )
    )
  );

CREATE POLICY "Backstory isolation" ON agent_backstories
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Workflow isolation" ON deployment_workflows
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Audit isolation" ON security_audit_logs
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) AND (
      EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'company_admin')
      ) OR user_id = auth.uid()
    )
  );

CREATE POLICY "Config isolation" ON company_configurations
  FOR ALL USING (
    company_id IN (
      SELECT company_id FROM users WHERE id = auth.uid()
    ) AND (
      NOT is_sensitive OR
      EXISTS (
        SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'company_admin')
      )
    )
  );
