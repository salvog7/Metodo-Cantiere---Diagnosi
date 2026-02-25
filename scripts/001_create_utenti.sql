-- Crea la tabella utenti che estende la tabella auth.users
create table if not exists public.utenti (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  cognome text,
  azienda text,
  link_analisi text,
  has_paid boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Abilita Row Level Security
alter table public.utenti enable row level security;

-- Policy per permettere agli utenti di vedere i propri dati
create policy "utenti_select_own" on public.utenti 
  for select using (auth.uid() = id);

-- Policy per permettere agli utenti di inserire i propri dati
create policy "utenti_insert_own" on public.utenti 
  for insert with check (auth.uid() = id);

-- Policy per permettere agli utenti di aggiornare i propri dati
create policy "utenti_update_own" on public.utenti 
  for update using (auth.uid() = id);

-- Crea una funzione trigger per creare automaticamente un profilo utente quando viene creato un nuovo utente
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.utenti (id, nome, cognome, azienda)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'nome', null),
    coalesce(new.raw_user_meta_data ->> 'cognome', null),
    coalesce(new.raw_user_meta_data ->> 'azienda', null)
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Crea il trigger per l'inserimento automatico
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
