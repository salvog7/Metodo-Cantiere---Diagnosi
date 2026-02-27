-- Migration: Create setup tables for admin configuration
-- Tables: form_setup, prompt_setup

-- form_setup: stores form configuration (sections + questions) per analysis type
CREATE TABLE IF NOT EXISTS public.form_setup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('analisi_lampo', 'diagnosi_strategica')),
  config JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tipo)
);

-- prompt_setup: stores AI prompts per analysis type
CREATE TABLE IF NOT EXISTS public.prompt_setup (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('analisi_lampo', 'diagnosi_strategica')),
  prompt_generale TEXT NOT NULL DEFAULT '',
  prompt_competitor TEXT NOT NULL DEFAULT '',
  prompt_riscrittura TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (tipo)
);

-- Enable RLS
ALTER TABLE public.form_setup ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_setup ENABLE ROW LEVEL SECURITY;

-- RLS policies: only service_role can access these tables (no anon/authenticated access)
-- This ensures only the admin client (server-side) can read/write setup data.

CREATE POLICY "Service role full access on form_setup"
  ON public.form_setup
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role full access on prompt_setup"
  ON public.prompt_setup
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Auto-update updated_at on modification
CREATE OR REPLACE FUNCTION public.update_setup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER form_setup_updated_at
  BEFORE UPDATE ON public.form_setup
  FOR EACH ROW EXECUTE FUNCTION public.update_setup_updated_at();

CREATE TRIGGER prompt_setup_updated_at
  BEFORE UPDATE ON public.prompt_setup
  FOR EACH ROW EXECUTE FUNCTION public.update_setup_updated_at();
