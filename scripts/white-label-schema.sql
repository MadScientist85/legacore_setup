-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  domain TEXT UNIQUE,
  features TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Company themes table
CREATE TABLE IF NOT EXISTS company_themes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  primary_color TEXT NOT NULL DEFAULT '#4B0082',
  secondary_color TEXT NOT NULL DEFAULT '#6A0DAD',
  accent_color TEXT NOT NULL DEFAULT '#FFD700',
  logo_url TEXT,
  favicon_url TEXT,
  font_family TEXT NOT NULL DEFAULT 'Inter, sans-serif',
  custom_css TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(company_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_companies_slug ON companies(slug);
CREATE INDEX IF NOT EXISTS idx_companies_domain ON companies(domain);
CREATE INDEX IF NOT EXISTS idx_company_themes_company_id ON company_themes(company_id);

-- RLS Policies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_themes ENABLE ROW LEVEL SECURITY;

-- Companies policies
CREATE POLICY "Anyone can view companies"
  ON companies FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage companies"
  ON companies FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Company themes policies
CREATE POLICY "Anyone can view themes"
  ON company_themes FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage themes"
  ON company_themes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.uid() = auth.users.id
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default company
INSERT INTO companies (name, slug, features)
VALUES (
  'LegaCore Default',
  'legacore',
  ARRAY['chat', 'documents', 'analytics', 'payments']
)
ON CONFLICT (slug) DO NOTHING;

-- Insert default theme
INSERT INTO company_themes (company_id, primary_color, secondary_color, accent_color)
SELECT id, '#4B0082', '#6A0DAD', '#FFD700'
FROM companies
WHERE slug = 'legacore'
ON CONFLICT (company_id) DO NOTHING;
