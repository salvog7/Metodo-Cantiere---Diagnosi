-- Fix: Aggiorna il trigger su auth.users per usare la nuova tabella utenti
-- Esegui questo script nel SQL Editor di Supabase

-- Step 1: Rimuovi il vecchio trigger se esiste
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Rimuovi la vecchia funzione se esiste
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Crea la nuova funzione che inserisce nella tabella utenti
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.utenti (id, email, nome, cognome, azienda, paid_analisi, paid_diagnosi)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    COALESCE(NEW.raw_user_meta_data->>'cognome', ''),
    COALESCE(NEW.raw_user_meta_data->>'azienda', ''),
    false,
    false
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Step 4: Crea il nuovo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verifica che il trigger sia stato creato correttamente
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
