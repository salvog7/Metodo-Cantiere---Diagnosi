-- Script per modificare il trigger di Supabase Auth per usare utenti_analisi_lampo

-- 1. Rimuovi il vecchio trigger (se esiste)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Crea una funzione che inserisce in utenti_analisi_lampo quando un nuovo utente si registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.utenti_analisi_lampo (
    user_id,
    email,
    nome,
    cognome,
    azienda,
    product,
    has_paid,
    form_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', ''),
    COALESCE(NEW.raw_user_meta_data->>'cognome', ''),
    COALESCE(NEW.raw_user_meta_data->>'azienda', ''),
    'audit',
    NULL,
    NULL
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crea il nuovo trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Verifica che il trigger sia stato creato correttamente
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
