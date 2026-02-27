-- Migration: Rimuove colonne non utilizzate dalla tabella utenti
-- form_status: legacy, sostituito da form_status_analisi e form_status_diagnosi
-- stripe_customer_id: mai usato nell'applicazione
-- amount_paid: scritto ma mai letto (l'importo è tracciato altrove se necessario)

ALTER TABLE public.utenti
  DROP COLUMN IF EXISTS form_status,
  DROP COLUMN IF EXISTS stripe_customer_id,
  DROP COLUMN IF EXISTS amount_paid;
