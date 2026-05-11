-- Execute este SQL no painel do Supabase (SQL Editor)
-- https://supabase.com → seu projeto → SQL Editor → New Query

CREATE TABLE IF NOT EXISTS responses (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  q1          TEXT,
  q2          TEXT,
  q3          TEXT,
  q4          TEXT,
  q5          TEXT,
  q6          TEXT,
  q7          TEXT[],   -- múltipla escolha
  q8          TEXT,
  q9          TEXT,
  q10         TEXT,
  q11         TEXT,
  q12         TEXT
);

-- Permite INSERT público (anônimo)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_insert" ON responses
  FOR INSERT WITH CHECK (true);

CREATE POLICY "allow_select" ON responses
  FOR SELECT USING (true);
