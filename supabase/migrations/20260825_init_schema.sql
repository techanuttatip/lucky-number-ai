-- ===================================================================
-- AI Lucky Number Hunter & Numerology Analyzer Database Schema
-- Compatible with Supabase PostgreSQL & pgvector
-- ===================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles & Preferences
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  birth_date DATE,
  birth_day TEXT,
  career TEXT,
  target_goals TEXT[],
  budget_max NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Sources (AIS, True, Dtac, etc.)
CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  base_url TEXT NOT NULL,
  scraper_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  last_scraped_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Candidate Numbers Pool
CREATE TABLE IF NOT EXISTS numbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  raw_number VARCHAR(15) NOT NULL UNIQUE,
  clean_number VARCHAR(10) NOT NULL,
  provider VARCHAR(20) NOT NULL,
  price NUMERIC(10, 2) DEFAULT 0,
  package_detail TEXT,
  buy_url TEXT,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'available', -- available, reserved, sold
  total_sum INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Pair Rules Master Table (00-99)
CREATE TABLE IF NOT EXISTS pair_rules (
  pair_code VARCHAR(2) PRIMARY KEY,
  tier VARCHAR(5) NOT NULL,
  score_delta INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  title_th TEXT NOT NULL,
  meaning_th TEXT NOT NULL,
  caution_th TEXT,
  is_dangerous BOOLEAN DEFAULT FALSE,
  energy_wealth INT DEFAULT 5,
  energy_charm INT DEFAULT 5,
  energy_prestige INT DEFAULT 5,
  energy_wisdom INT DEFAULT 5,
  energy_luck INT DEFAULT 5
);

-- 5. Career Rules Master Table
CREATE TABLE IF NOT EXISTS career_rules (
  career_code VARCHAR(50) PRIMARY KEY,
  career_title_th TEXT NOT NULL,
  essential_pairs TEXT[] NOT NULL,
  bonus_pairs TEXT[] DEFAULT '{}',
  forbidden_pairs TEXT[] DEFAULT '{}',
  description_th TEXT
);

-- 6. Birth Day Rules Master Table
CREATE TABLE IF NOT EXISTS birth_rules (
  birth_day VARCHAR(30) PRIMARY KEY,
  name_th TEXT NOT NULL,
  auspicious_digits INT[] NOT NULL,
  neutral_digits INT[] NOT NULL,
  forbidden_digits INT[] NOT NULL, -- เลขกาลกิณี
  description_th TEXT
);

-- 7. Number Decomposed Pairs
CREATE TABLE IF NOT EXISTS number_pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number_id UUID REFERENCES numbers(id) ON DELETE CASCADE,
  position_index INT NOT NULL,
  pair_code VARCHAR(2) REFERENCES pair_rules(pair_code),
  score_contribution INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Search Jobs (Background / Scheduled Hunter Jobs)
CREATE TABLE IF NOT EXISTS search_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  job_name TEXT NOT NULL,
  criteria_json JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'idle', -- idle, running, completed, error
  frequency_cron TEXT,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Analysis Runs
CREATE TABLE IF NOT EXISTS analysis_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES search_jobs(id) ON DELETE SET NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  total_candidates INT DEFAULT 0,
  top_count INT DEFAULT 0,
  status VARCHAR(20) DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Analysis Details (Rule Engine & AI Judge Verdict per number)
CREATE TABLE IF NOT EXISTS analysis_details (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID REFERENCES analysis_runs(id) ON DELETE CASCADE,
  number_id UUID REFERENCES numbers(id) ON DELETE CASCADE,
  deterministic_score INT NOT NULL,
  pair_score INT,
  sum_score INT,
  birth_score INT,
  career_score INT,
  ai_verdict_tier VARCHAR(10),
  ai_headline TEXT,
  ai_second_opinion TEXT,
  ai_pros TEXT[],
  ai_cons TEXT[],
  rank_order INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Search Results (Mapping Jobs to Matching Numbers)
CREATE TABLE IF NOT EXISTS search_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES search_jobs(id) ON DELETE CASCADE,
  number_id UUID REFERENCES numbers(id) ON DELETE CASCADE,
  match_score INT NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Availability History (Price & Status Tracking)
CREATE TABLE IF NOT EXISTS availability_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number_id UUID REFERENCES numbers(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL,
  price NUMERIC(10, 2),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for rapid lookup & ranking
CREATE INDEX IF NOT EXISTS idx_numbers_clean ON numbers(clean_number);
CREATE INDEX IF NOT EXISTS idx_numbers_provider ON numbers(provider);
CREATE INDEX IF NOT EXISTS idx_numbers_total_sum ON numbers(total_sum);
CREATE INDEX IF NOT EXISTS idx_analysis_details_score ON analysis_details(deterministic_score DESC);

-- Enable Realtime publication for live feed
ALTER PUBLICATION supabase_realtime ADD TABLE numbers;
ALTER PUBLICATION supabase_realtime ADD TABLE search_jobs;
ALTER PUBLICATION supabase_realtime ADD TABLE analysis_details;
