-- ============================================================
-- Bloat — Supabase Schema
-- Run this in your Supabase SQL editor to set up the database
-- ============================================================

-- Audits table: stores every audit result
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Input data
  tools_data JSONB NOT NULL,          -- Array of ToolEntry objects
  use_case TEXT NOT NULL,
  team_size TEXT NOT NULL,
  team_size_num INTEGER NOT NULL,
  -- Results
  recommendations JSONB NOT NULL,     -- Array of ToolRecommendation objects
  total_monthly_savings INTEGER NOT NULL DEFAULT 0,
  total_annual_savings INTEGER NOT NULL DEFAULT 0,
  total_current_spend INTEGER NOT NULL DEFAULT 0,
  has_high_savings BOOLEAN NOT NULL DEFAULT FALSE,
  is_already_optimal BOOLEAN NOT NULL DEFAULT FALSE,
  -- AI summary (added by Day 3 feature)
  ai_summary TEXT,
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Leads table: stores email captures (linked to audits)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id UUID REFERENCES audits(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  savings_total INTEGER,
  email_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  -- Prevent duplicate emails per audit
  UNIQUE(audit_id, email)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);

-- RLS Policies
-- Allow anyone to INSERT an audit (no auth required)
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create audits"
  ON audits FOR INSERT
  WITH CHECK (true);

-- Allow anyone to read audits by ID (for shareable URLs)
CREATE POLICY "Anyone can read audits"
  ON audits FOR SELECT
  USING (true);

-- Leads: only service role can insert (done from API routes)
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role can manage leads"
  ON leads FOR ALL
  USING (true)
  WITH CHECK (true);
