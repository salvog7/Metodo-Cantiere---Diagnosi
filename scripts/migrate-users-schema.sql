-- Migration: Consolidate users tables and update schema
-- This script consolidates utenti_analisi_lampo and utenti_diagnosi_strategica into a single utenti table

-- Step 1: Create the new consolidated utenti table with the correct schema
CREATE TABLE IF NOT EXISTS utenti_new (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  nome text,
  cognome text,
  azienda text,
  paid_analisi text DEFAULT NULL,
  paid_diagnosi text DEFAULT NULL,
  form_status text DEFAULT NULL,
  stripe_customer_id text,
  amount_paid float DEFAULT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Step 2: Migrate data from utenti_analisi_lampo to utenti_new
INSERT INTO utenti_new (id, email, nome, cognome, azienda, paid_analisi, form_status, stripe_customer_id, amount_paid, created_at, updated_at)
SELECT 
  id,
  email,
  nome,
  cognome,
  azienda,
  has_paid as paid_analisi,
  form_status,
  stripe_customer_id,
  amount_paid,
  created_at,
  updated_at
FROM utenti_analisi_lampo
ON CONFLICT (id) DO NOTHING;

-- Step 3: Update with data from utenti_diagnosi_strategica (set paid_diagnosi if user exists in both)
UPDATE utenti_new
SET paid_diagnosi = uds.has_paid
FROM utenti_diagnosi_strategica uds
WHERE utenti_new.id = uds.id AND uds.has_paid IS NOT NULL;

-- Step 4: Insert users from utenti_diagnosi_strategica that don't exist yet
INSERT INTO utenti_new (id, email, nome, cognome, paid_diagnosi, form_status, stripe_customer_id, amount_paid, created_at, updated_at)
SELECT 
  id,
  email,
  nome,
  cognome,
  has_paid as paid_diagnosi,
  form_status,
  stripe_customer_id,
  amount_paid,
  created_at,
  updated_at
FROM utenti_diagnosi_strategica
ON CONFLICT (id) DO NOTHING;

-- Step 5: Rename old table
ALTER TABLE utenti_analisi_lampo RENAME TO utenti_analisi_lampo_backup;

-- Step 6: Rename old diagnosi table
ALTER TABLE utenti_diagnosi_strategica RENAME TO utenti_diagnosi_strategica_backup;

-- Step 7: Rename new table to utenti
ALTER TABLE utenti_new RENAME TO utenti;

-- Step 8: Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_utenti_email ON utenti(email);

-- Step 9: Add index on created_at for chronological queries
CREATE INDEX IF NOT EXISTS idx_utenti_created_at ON utenti(created_at);

-- Verify the migration
SELECT 'Migration completed successfully' as status;
SELECT COUNT(*) as total_users FROM utenti;
SELECT paid_analisi, paid_diagnosi, COUNT(*) as count FROM utenti GROUP BY paid_analisi, paid_diagnosi;
