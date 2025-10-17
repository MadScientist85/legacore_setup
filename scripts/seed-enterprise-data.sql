-- LEGACORE™ Enterprise Seed Data with Multi-Tenant Setup

-- Insert sample companies
INSERT INTO companies (company_name, company_slug, subscription_tier, branding_config, feature_flags) VALUES
('LEGACORE Enterprises', 'legacore-enterprises', 'enterprise', 
 '{"primary_color": "#00BFFF", "secondary_color": "#D4AF37", "logo_url": "/logos/legacore.svg", "theme": "tactical"}',
 '{"advanced_analytics": true, "ai_training": true, "custom_integrations": true, "white_label": true}'),
('Surplus Recovery Solutions', 'surplus-recovery', 'professional',
 '{"primary_color": "#1E40AF", "secondary_color": "#F59E0B", "logo_url": "/logos/surplus.svg", "theme": "professional"}',
 '{"advanced_analytics": true, "ai_training": false, "custom_integrations": true, "white_label": false}'),
('Credit Optimization Group', 'credit-optimization', 'professional',
 '{"primary_color": "#059669", "secondary_color": "#DC2626", "logo_url": "/logos/credit.svg", "theme": "modern"}',
 '{"advanced_analytics": true, "ai_training": false, "custom_integrations": false, "white_label": false}');

-- Insert model configurations for each company
INSERT INTO model_configurations (company_id, model_provider, model_name, model_parameters, rate_limits, cost_per_token, is_default) 
SELECT 
  c.id,
  provider,
  model_name,
  parameters::jsonb,
  limits::jsonb,
  cost,
  is_default
FROM companies c
CROSS JOIN (VALUES
  ('openai', 'gpt-4o', '{"temperature": 0.7, "max_tokens": 4000}', '{"requests_per_minute": 100, "tokens_per_minute": 150000}', 0.00003, true),
  ('openai', 'gpt-4o-mini', '{"temperature": 0.5, "max_tokens": 2000}', '{"requests_per_minute": 200, "tokens_per_minute": 200000}', 0.000015, false),
  ('anthropic', 'claude-3-5-sonnet-20241022', '{"temperature": 0.7, "max_tokens": 4000}', '{"requests_per_minute": 50, "tokens_per_minute": 100000}', 0.000025, false),
  ('google', 'gemini-1.5-pro', '{"temperature": 0.6, "max_tokens": 3000}', '{"requests_per_minute": 75, "tokens_per_minute": 120000}', 0.00002, false)
) AS models(provider, model_name, parameters, limits, cost, is_default);

-- Insert business verticals for each company
INSERT INTO business_verticals (company_id, vertical_name, vertical_slug, description, industry_codes, data_schema, workflow_config, kpi_targets, revenue_target)
SELECT 
  c.id,
  v.name,
  v.slug,
  v.description,
  v.codes,
  v.schema::jsonb,
  v.workflow::jsonb,
  v.kpis::jsonb,
  v.revenue
FROM companies c
CROSS JOIN (VALUES
  ('Surplus Funds Recovery', 'surplus-funds', 'Post-foreclosure surplus fund identification and recovery', 
   ARRAY['531390', '541110'], 
   '{"property_data": {"address": "string", "county": "string", "state": "string"}, "financial_data": {"sale_price": "number", "debt_amount": "number"}}',
   '{"steps": ["research", "calculate", "document", "file"], "automation_level": 0.85}',
   '{"recovery_rate": 0.75, "avg_recovery_amount": 15000, "processing_time_days": 30}',
   500000),
  ('Credit Repair Services', 'credit-repair', 'Consumer credit report analysis and dispute management',
   ARRAY['561450', '522390'],
   '{"credit_data": {"reports": "array", "scores": "object"}, "dispute_data": {"items": "array", "status": "string"}}',
   '{"steps": ["analyze", "dispute", "track", "optimize"], "automation_level": 0.90}',
   '{"dispute_success_rate": 0.80, "score_improvement": 50, "processing_time_days": 45}',
   300000),
  ('Debt Portfolio Management', 'debt-management', 'Purchased debt validation and compliance processing',
   ARRAY['522291', '561440'],
   '{"debt_data": {"accounts": "array", "validation": "object"}, "compliance_data": {"status": "string", "flags": "array"}}',
   '{"steps": ["validate", "process", "furnish", "monitor"], "automation_level": 0.95}',
   '{"validation_accuracy": 0.98, "compliance_score": 0.95, "processing_time_hours": 2}',
   750000),
  ('Digital Estate Planning', 'estate-planning', 'Trust and estate document preparation and management',
   ARRAY['541110', '523920'],
   '{"client_data": {"personal": "object", "assets": "array"}, "document_data": {"templates": "array", "versions": "object"}}',
   '{"steps": ["assess", "draft", "review", "execute"], "automation_level": 0.70}',
   '{"document_accuracy": 0.99, "client_satisfaction": 0.95, "turnaround_days": 7}',
   400000),
  ('Government Contracting', 'gov-contracting', 'Federal procurement proposal and compliance management',
   ARRAY['541611', '541618'],
   '{"opportunity_data": {"solicitations": "array", "requirements": "object"}, "proposal_data": {"sections": "array", "compliance": "object"}}',
   '{"steps": ["analyze", "propose", "submit", "manage"], "automation_level": 0.60}',
   '{"win_rate": 0.25, "proposal_quality": 0.90, "submission_time_days": 14}',
   1000000),
  ('Print-on-Demand Operations', 'pod-operations', 'Creative design and e-commerce product optimization',
   ARRAY['541430', '454110'],
   '{"design_data": {"concepts": "array", "trends": "object"}, "product_data": {"listings": "array", "performance": "object"}}',
   '{"steps": ["research", "design", "optimize", "launch"], "automation_level": 0.80}',
   '{"conversion_rate": 0.05, "profit_margin": 0.30, "time_to_market_days": 3}',
   200000)
) AS v(name, slug, description, codes, schema, workflow, kpis, revenue);

-- Insert comprehensive agent configurations with backstories
INSERT INTO agents (
  company_id, name, description, category, system_prompt, backstory, mission, personality, 
  knowledge_base, guardrails, functions, deployment_config, status, version_number
)
SELECT 
  c.id,
  a.name,
  a.description,
  a.category,
  a.system_prompt,
  a.backstory,
  a.mission,
  a.personality,
  a.knowledge_base::jsonb,
  a.guardrails::jsonb,
  a.functions::jsonb,
  a.deployment_config::jsonb,
  'production',
  '2.0.0'
FROM companies c
CROSS JOIN (VALUES
  -- Atlas - Surplus Funds Paralegal
  ('Atlas - Surplus Funds Paralegal', 'Post-foreclosure surplus recovery specialist', 'legal',
   'You are "Atlas," a seasoned virtual paralegal assistant in post-foreclosure surplus recovery. You were designed by litigation support professionals and government operations consultants to assist both legal teams and claimants in navigating the post-sale judicial process. Your specialty lies in identifying surplus funds in court records, tax sales, and sheriff sales, preparing and reviewing motion paperwork, notices of appearance, and affidavits, calculating fund amounts with itemized breakdowns, and coordinating with clerks and state-specific restitution protocols. Your tone is always precise, neutral, and legally accurate. You do not provide legal advice, but instead guide users through procedural processes and best practices based on public record and administrative rules.',
   'Originally modeled after a network of state-certified surplus recovery specialists, this agent is trained on tens of thousands of foreclosure docket records, lien release patterns, and excess fund release forms. Its core memory was initialized with data from county clerk databases and civil litigation protocols.',
   'To autonomously assist with surplus fund identification, legal form generation, and step-by-step procedural guidance.',
   'Precise, no-nonsense, and loyal to procedure—like a veteran court clerk with a heart for justice.',
   '["State-by-state foreclosure law", "Unclaimed funds procedures", "Statutory time limits", "Claimant notice templates", "Redemption rights"]',
   '["Always disclaim legal representation", "Never guess at jurisdictional law", "Requires full property details before action"]',
   '[{"name": "research_property_records", "description": "Research property records for surplus fund opportunities", "parameters": {"type": "object", "properties": {"property_address": {"type": "string"}, "county": {"type": "string"}, "state": {"type": "string"}}, "required": ["property_address", "county", "state"]}}]',
   '{"max_concurrent_tasks": 10, "response_timeout": 30, "rate_limit": "100/hour", "memory_retention": "30_days"}'),
   
  -- Lexis - Credit Repair Agent
  ('Lexis - Credit Repair Agent', 'Metro2 + FCRA credit disputing expert', 'credit',
   'You are "Lexis," a regulatory-focused AI built with a core understanding of the Fair Credit Reporting Act (FCRA), Metro2 format, and consumer rights in credit reporting. Trained on actual dispute patterns, regulatory notices, and data furnisher handbooks, you act as a compliance automation tool for credit repair firms and consumers alike. You specialize in identifying incorrect tradelines and reporting errors, drafting dispute letters with citation-backed language, generating Metro2-based data correction requests, and interfacing with CRA protocol requirements. You always stay objective, never promise specific outcomes, and emphasize consumer education. Your goal is compliance-first resolution, not aggressive confrontation.',
   'Built from actual Metro2 data spec documentation, FCRA litigation cases, and dispute logs from major credit repair CRM systems. This agent learned the hard way through millions of audit trails and real-world correction scenarios.',
   'To draft bulletproof dispute strategies while educating the user on credit law, accuracy, and escalation pathways.',
   'Strategic, assertive, and legally sound—like an ex-bureau auditor turned consumer advocate.',
   '["Metro2 format compliance", "FCRA & FDCPA laws", "Credit bureau dispute workflows", "CRA procedures", "CFPB case law references"]',
   '["Never promises score boosts", "Avoids illegal deletion guarantees", "Flags potential fraudulent documents"]',
   '[{"name": "analyze_credit_report", "description": "Analyze credit report for potential disputes", "parameters": {"type": "object", "properties": {"credit_data": {"type": "object"}, "focus_areas": {"type": "array"}}, "required": ["credit_data"]}}]',
   '{"max_concurrent_tasks": 15, "response_timeout": 25, "rate_limit": "150/hour", "memory_retention": "90_days"}')
) AS a(name, description, category, system_prompt, backstory, mission, personality, knowledge_base, guardrails, functions, deployment_config);

-- Insert performance analytics sample data
INSERT INTO performance_analytics (
  company_id, vertical_id, agent_id, metric_date, total_requests, successful_requests, 
  average_response_time_ms, tasks_completed, user_satisfaction_score, revenue_generated, 
  unique_users, uptime_percentage
)
SELECT 
  c.id,
  bv.id,
  a.id,
  CURRENT_DATE - (random() * 30)::integer,
  (random() * 1000 + 100)::integer,
  (random() * 900 + 90)::integer,
  (random() * 2000 + 500)::numeric(10,3),
  (random() * 50 + 10)::integer,
  (random() * 2 + 3)::numeric(3,2),
  (random() * 10000 + 1000)::numeric(15,2),
  (random() * 100 + 20)::integer,
  (random() * 5 + 95)::numeric(5,2)
FROM companies c
JOIN business_verticals bv ON bv.company_id = c.id
JOIN agents a ON a.company_id = c.id
WHERE random() < 0.7; -- 70% chance for each combination

-- Insert Legacy Vault sample documents
INSERT INTO legacy_vault_advanced (
  company_id, vertical_id, document_name, document_type, category, 
  content_text, ai_summary, ai_tags, access_level, classification_level, created_by
)
SELECT 
  c.id,
  bv.id,
  doc.name,
  doc.type,
  doc.category,
  doc.content,
  doc.summary,
  doc.tags,
  doc.access_level,
  doc.classification,
  u.id
FROM companies c
JOIN business_verticals bv ON bv.company_id = c.id
JOIN users u ON u.company_id = c.id
CROSS JOIN (VALUES
  ('Surplus Fund Recovery SOP', 'sop', 'procedures', 
   'Standard Operating Procedure for identifying and recovering surplus funds from foreclosure sales...',
   'Comprehensive guide for surplus fund recovery process including research, documentation, and filing procedures.',
   ARRAY['surplus', 'foreclosure', 'recovery', 'legal', 'procedure'],
   'team', 'internal'),
  ('Credit Dispute Template Library', 'template', 'documents',
   'Collection of FCRA-compliant dispute letter templates for various credit report inaccuracies...',
   'Template library containing dispute letters for different types of credit report errors and inaccuracies.',
   ARRAY['credit', 'dispute', 'template', 'fcra', 'compliance'],
   'team', 'internal'),
  ('Debt Validation Checklist', 'document', 'compliance',
   'Comprehensive checklist for validating purchased debt portfolios according to FDCPA requirements...',
   'Detailed checklist ensuring proper debt validation and compliance with federal regulations.',
   ARRAY['debt', 'validation', 'compliance', 'fdcpa', 'checklist'],
   'team', 'confidential')
) AS doc(name, type, category, content, summary, tags, access_level, classification)
WHERE random() < 0.5; -- 50% chance for each combination

-- Insert deployment workflows
INSERT INTO deployment_workflows (
  company_id, workflow_name, workflow_type, workflow_steps, 
  success_criteria, execution_environment, created_by
)
SELECT 
  c.id,
  wf.name,
  wf.type,
  wf.steps::jsonb,
  wf.criteria::jsonb,
  wf.environment,
  u.id
FROM companies c
JOIN users u ON u.company_id = c.id AND u.role IN ('company_admin', 'super_admin')
CROSS JOIN (VALUES
  ('Agent Deployment Pipeline', 'agent_deployment',
   '[{"step": 1, "name": "Validation", "action": "validate_config"}, {"step": 2, "name": "Testing", "action": "run_tests"}, {"step": 3, "name": "Staging", "action": "deploy_staging"}, {"step": 4, "name": "Production", "action": "deploy_production"}]',
   '{"validation_passed": true, "tests_passed": true, "performance_threshold": 0.95}',
   'production'),
  ('Vertical Setup Workflow', 'vertical_setup',
   '[{"step": 1, "name": "Schema Creation", "action": "create_schema"}, {"step": 2, "name": "Agent Assignment", "action": "assign_agents"}, {"step": 3, "name": "UI Configuration", "action": "setup_ui"}, {"step": 4, "name": "Testing", "action": "integration_test"}]',
   '{"schema_valid": true, "agents_assigned": true, "ui_functional": true}',
   'production'),
  ('Security Update Pipeline', 'security_update',
   '[{"step": 1, "name": "Backup", "action": "create_backup"}, {"step": 2, "name": "Update", "action": "apply_update"}, {"step": 3, "name": "Verification", "action": "verify_security"}, {"step": 4, "name": "Rollback Check", "action": "prepare_rollback"}]',
   '{"backup_created": true, "update_applied": true, "security_verified": true}',
   'production')
) AS wf(name, type, steps, criteria, environment);

-- Insert company configurations
INSERT INTO company_configurations (company_id, config_category, config_key, config_value)
SELECT 
  c.id,
  cfg.category,
  cfg.key,
  cfg.value::jsonb
FROM companies c
CROSS JOIN (VALUES
  ('branding', 'theme_colors', '{"primary": "#00BFFF", "secondary": "#D4AF37", "accent": "#0D0D0D"}'),
  ('branding', 'logo_settings', '{"main_logo": "/logos/company.svg", "favicon": "/favicons/company.ico", "watermark": "/watermarks/company.png"}'),
  ('security', 'password_policy', '{"min_length": 12, "require_uppercase": true, "require_lowercase": true, "require_numbers": true, "require_symbols": true}'),
  ('security', 'session_settings', '{"timeout_minutes": 480, "max_concurrent_sessions": 3, "require_2fa": true}'),
  ('ai_models', 'default_settings', '{"primary_model": "gpt-4o", "fallback_model": "gpt-4o-mini", "temperature": 0.7, "max_tokens": 4000}'),
  ('ai_models', 'cost_controls', '{"monthly_budget": 5000, "per_request_limit": 1.0, "alert_threshold": 0.8}'),
  ('compliance', 'data_retention', '{"default_days": 2555, "sensitive_days": 365, "audit_logs_days": 3650}'),
  ('compliance', 'encryption_settings', '{"at_rest": true, "in_transit": true, "key_rotation_days": 90}'),
  ('notifications', 'alert_settings', '{"email_enabled": true, "sms_enabled": false, "webhook_enabled": true}'),
  ('notifications', 'escalation_rules', '{"critical_within_minutes": 5, "high_within_minutes": 30, "medium_within_hours": 4}')
) AS cfg(category, key, value);

-- Update foreign key relationships
UPDATE business_verticals SET primary_agent_id = (
  SELECT a.id FROM agents a 
  WHERE a.company_id = business_verticals.company_id 
  AND a.name LIKE '%' || 
    CASE 
      WHEN business_verticals.vertical_slug = 'surplus-funds' THEN 'Atlas'
      WHEN business_verticals.vertical_slug = 'credit-repair' THEN 'Lexis'
      ELSE 'Agent'
    END || '%'
  LIMIT 1
);

UPDATE agents SET vertical_id = (
  SELECT bv.id FROM business_verticals bv 
  WHERE bv.company_id = agents.company_id 
  AND (
    (agents.name LIKE '%Atlas%' AND bv.vertical_slug = 'surplus-funds') OR
    (agents.name LIKE '%Lexis%' AND bv.vertical_slug = 'credit-repair')
  )
  LIMIT 1
);

-- Create sample users for each company
INSERT INTO users (company_id, email, name, role, permissions)
SELECT 
  c.id,
  'admin@' || c.company_slug || '.com',
  c.company_name || ' Administrator',
  'company_admin',
  '{"all_verticals": true, "manage_agents": true, "view_analytics": true, "manage_users": true}'::jsonb
FROM companies c;

INSERT INTO users (company_id, email, name, role, permissions)
SELECT 
  c.id,
  'manager@' || c.company_slug || '.com',
  c.company_name || ' Manager',
  'manager',
  '{"assigned_verticals": ["surplus-funds", "credit-repair"], "manage_agents": false, "view_analytics": true, "manage_users": false}'::jsonb
FROM companies c;
