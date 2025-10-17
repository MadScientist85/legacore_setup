-- ============================================
-- DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_id TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  filename TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  extracted_text TEXT,
  metadata JSONB DEFAULT '{}',
  analysis JSONB,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'processed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS documents_company_id_idx ON documents(company_id);
CREATE INDEX IF NOT EXISTS documents_user_id_idx ON documents(user_id);
CREATE INDEX IF NOT EXISTS documents_category_idx ON documents(category);
CREATE INDEX IF NOT EXISTS documents_status_idx ON documents(status);
CREATE INDEX IF NOT EXISTS documents_created_at_idx ON documents(created_at DESC);
CREATE INDEX IF NOT EXISTS documents_filename_idx ON documents USING gin(to_tsvector('english', filename));
CREATE INDEX IF NOT EXISTS documents_extracted_text_idx ON documents USING gin(to_tsvector('english', extracted_text));

-- Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY documents_select_own ON documents
  FOR SELECT USING (
    company_id IN (
      SELECT company_id FROM users WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY documents_insert_own ON documents
  FOR INSERT WITH CHECK (
    company_id IN (
      SELECT company_id FROM users WHERE id::text = auth.uid()::text
    )
  );

CREATE POLICY documents_delete_own ON documents
  FOR DELETE USING (
    company_id IN (
      SELECT company_id FROM users WHERE id::text = auth.uid()::text
    )
  );

-- Update trigger
CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
