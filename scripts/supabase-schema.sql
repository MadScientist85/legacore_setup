-- ============================================
-- LEGACORE™ PLATFORM - Supabase Database Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster email lookups
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- ============================================
-- AGENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT,
  description TEXT NOT NULL,
  instructions TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'gpt-4o',
  is_active BOOLEAN NOT NULL DEFAULT true,
  version TEXT DEFAULT '1.0.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for filtering active agents
CREATE INDEX IF NOT EXISTS agents_is_active_idx ON agents(is_active);
CREATE INDEX IF NOT EXISTS agents_type_idx ON agents(type);
CREATE INDEX IF NOT EXISTS agents_category_idx ON agents(category);

-- ============================================
-- AGENT RUNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS agent_runs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id TEXT NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  input TEXT NOT NULL,
  output TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error TEXT,
  tokens_used INTEGER,
  duration_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS agent_runs_agent_id_idx ON agent_runs(agent_id);
CREATE INDEX IF NOT EXISTS agent_runs_user_id_idx ON agent_runs(user_id);
CREATE INDEX IF NOT EXISTS agent_runs_status_idx ON agent_runs(status);
CREATE INDEX IF NOT EXISTS agent_runs_created_at_idx ON agent_runs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_runs ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY users_select_own ON users
  FOR SELECT USING (true);

CREATE POLICY users_update_own ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- All authenticated users can read agents
CREATE POLICY agents_select_all ON agents
  FOR SELECT USING (true);

-- Agent runs: Users can only see their own runs
CREATE POLICY agent_runs_select_own ON agent_runs
  FOR SELECT USING (auth.uid()::text = user_id OR user_id = (SELECT email FROM users WHERE id::text = auth.uid()::text));

CREATE POLICY agent_runs_insert_own ON agent_runs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id OR user_id = (SELECT email FROM users WHERE id::text = auth.uid()::text));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for agents table
CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ============================================
-- SEED DATA
-- ============================================

-- Insert default agents from registry
INSERT INTO agents (id, name, type, category, description, instructions, model, version) VALUES
('surplus-funds-v1', 'Surplus Funds Recovery Agent', 'surplus-funds', 'Legal Recovery', 
 'Analyzes foreclosure records and identifies surplus funds opportunities',
 'You are an expert in surplus funds recovery from foreclosure auctions...', 'gpt-4o', '1.0.0'),

('credit-repair-v1', 'Credit Repair Specialist', 'credit-repair', 'Financial Services',
 'Analyzes credit reports and generates dispute letters for inaccuracies',
 'You are a certified credit repair specialist...', 'gpt-4o', '1.0.0'),

('debt-buyer-v1', 'Debt Portfolio Analyst', 'debt-buyer', 'Collections',
 'Evaluates debt portfolios and generates acquisition recommendations',
 'You are a debt portfolio acquisition analyst...', 'gpt-4o', '1.0.0'),

('trust-management-v1', 'Trust & Estate Manager', 'trust-management', 'Estate Planning',
 'Assists with trust administration and estate planning documentation',
 'You are a trust and estate planning specialist...', 'gpt-4o', '1.0.0'),

('government-contracting-v1', 'Government Contracting Specialist', 'government-contracting', 'Business Development',
 'Identifies government contract opportunities and assists with bid preparation',
 'You are a government contracting specialist...', 'gpt-4o', '1.0.0'),

('contract-review-v1', 'Contract Review Agent', 'contract-review', 'Legal Analysis',
 'Analyzes contracts for risks, unfavorable terms, and compliance issues',
 'You are a contract review specialist...', 'gpt-4o', '1.0.0'),

('legal-research-v1', 'Legal Research Assistant', 'legal-research', 'Research',
 'Conducts legal research and provides case law summaries',
 'You are a legal research assistant...', 'gpt-4o', '1.0.0'),

('compliance-check-v1', 'Compliance Checker', 'compliance-check', 'Compliance',
 'Validates regulatory compliance across multiple frameworks',
 'You are a compliance officer...', 'gpt-4o', '1.0.0')
ON CONFLICT (id) DO NOTHING;
