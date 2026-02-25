'use server'

// Cache busting: Timestamp 2026-02-13 13:30 - Fixed user_id to id column
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { Profile, Entitlement } from '@/lib/types'

export async function checkEmailExists(email: string): Promise<boolean> {
  const supabase = await createClient()
  
  console.log('[v0] Checking if email exists:', email)
  
  try {
    // Prova prima nella nuova tabella utenti
    const { data, error } = await supabase
      .from('utenti')
      .select('id')
      .eq('email', email)
      .limit(1)

    // Se la tabella non esiste, controlla la vecchia tabella
    if (error && error.code === 'PGRST205') {
      console.log('[v0] Tabella utenti non esiste, uso fallback a utenti_analisi_lampo')
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('utenti_analisi_lampo')
        .select('id')
        .eq('email', email)
        .limit(1)

      if (fallbackError) {
        console.error('[v0] Error checking email in utenti_analisi_lampo:', fallbackError)
        return false
      }

      const emailExists = fallbackData && fallbackData.length > 0
      console.log('[v0] Email exists in utenti_analisi_lampo:', emailExists)
      return emailExists
    }

    if (error) {
      console.error('[v0] Error checking email in utenti:', error)
      return false
    }

    const emailExists = data && data.length > 0
    console.log('[v0] Email exists in utenti:', emailExists)
    return emailExists
  } catch (err: any) {
    console.error('[v0] Exception checking email:', err)
    return false
  }
}

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('[v0] Error fetching profile:', error)
    return null
  }

  return data
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating profile:', error)
    throw error
  }

  return data
}

export async function createEntitlement(
  userId: string,
  productId: string,
  paymentIntentId: string,
  amountPaid: number
): Promise<Entitlement | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('entitlements')
    .insert({
      user_id: userId,
      product_id: productId,
      stripe_payment_intent_id: paymentIntentId,
      amount_paid: amountPaid,
      status: 'pending',
    })
    .select()
    .single()

  if (error) {
    console.error('[v0] Error creating entitlement:', error)
    return null
  }

  return data
}

export async function getEntitlements(userId: string): Promise<Entitlement[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[v0] Error fetching entitlements:', error)
    return []
  }

  return data || []
}

export async function hasActiveEntitlement(
  userId: string,
  productId: string
): Promise<boolean> {
  const supabase = await createClient()
  
  console.log('[v0] Checking entitlement for userId:', userId, 'productId:', productId)
  
  const { data, error } = await supabase
    .from('entitlements')
    .select('id, status')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .in('status', ['active', 'completed'])
    .limit(1)

  if (error) {
    console.error('[v0] Error checking entitlement:', error)
    console.error('[v0] Error details:', JSON.stringify(error))
    return false
  }

  console.log('[v0] Entitlement check result:', data)
  return data && data.length > 0
}

export async function updateEntitlement(
  entitlementId: string,
  updates: Partial<Entitlement>
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('entitlements')
    .update(updates)
    .eq('id', entitlementId)
    .select()
    .single()

  if (error) {
    console.error('[v0] Error updating entitlement:', error)
    throw error
  }

  return data
}

export async function hasCompletedAuditReport(userId: string): Promise<boolean> {
  const supabase = await createClient()
  
  console.log('[v0] Checking audit report for userId:', userId)
  
  const { data, error } = await supabase
    .from('audit_reports')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (error) {
    console.error('[v0] Error checking audit report:', error)
    console.error('[v0] Error details:', JSON.stringify(error))
    return false
  }

  console.log('[v0] Audit report check result:', data)
  return data && data.length > 0
}

export async function createUtentiAnalisiLampo(
  userId: string,
  email: string,
  nome: string,
  cognome: string,
  azienda: string
) {
  // Use admin client to bypass RLS - session may not be established yet right after sign-up
  const supabase = createAdminClient()
  
  console.log('[v0] Creating utenti record - PRIMARY KEY COLUMN ID:', userId)
  
  try {
    const { data, error } = await supabase
      .from('utenti')
      .insert({
        id: userId,
        email,
        nome,
        cognome,
        azienda,
        paid_analisi: null,
        paid_diagnosi: null,
        form_status: null,
      })
      .select()

    // Se la tabella utenti non esiste, crea nella vecchia tabella utenti_analisi_lampo
    if (error && error.code === 'PGRST205') {
      console.log('[v0] Tabella utenti non esiste, uso fallback a utenti_analisi_lampo per creazione')
      
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('utenti_analisi_lampo')
        .insert({
          id: userId,
          email,
          nome,
          cognome,
          azienda,
          product: 'audit',
          has_paid: null,
          form_status: null,
        })
        .select()

      if (fallbackError) {
        console.error('[v0] Error creating utenti_analisi_lampo:', JSON.stringify(fallbackError))
        throw new Error(`Failed to create user record: ${fallbackError.message}`)
      }

      console.log('[v0] Utenti_analisi_lampo record created successfully:', fallbackData)
      return fallbackData?.[0]
    }

    if (error) {
      console.error('[v0] Error creating utenti:', JSON.stringify(error))
      throw new Error(`Failed to create user record: ${error.message}`)
    }

    console.log('[v0] Utenti record created successfully:', data)
    return data?.[0]
  } catch (err: any) {
    console.error('[v0] Exception creating utenti:', err.message)
    throw err
  }
}

export async function getUtentiAnalisiLampo(userId: string) {
  const supabase = await createClient()
  
  console.log('[v0] Fetching utenti for id:', userId)
  
  // Prova prima la VECCHIA tabella utenti_analisi_lampo (finché la migrazione non è completa)
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('utenti_analisi_lampo')
    .select('*')
    .eq('id', userId)
    .limit(1)

  if (!fallbackError && fallbackData && fallbackData.length > 0) {
    // Mappo i dati dalla vecchia struttura alla nuova
    const mappedData = {
      ...fallbackData[0],
      paid_analisi: fallbackData[0].has_paid, // Mappo has_paid a paid_analisi
      paid_diagnosi: null,
    }

    console.log('[v0] Found utenti_analisi_lampo record (mapped):', mappedData)
    return mappedData
  }

  // Se la vecchia tabella non ha dati, prova la nuova tabella utenti
  const { data, error } = await supabase
    .from('utenti')
    .select('*')
    .eq('id', userId)
    .limit(1)

  if (error) {
    console.error('[v0] Error fetching utenti:', JSON.stringify(error))
    return null
  }

  if (!data || data.length === 0) {
    console.log('[v0] No utenti record found for id:', userId)
    return null
  }

  console.log('[v0] Found utenti record:', data[0])
  return data[0]
}

export async function getFormStatus(userId: string) {
  const supabase = await createClient()
  
  console.log('[v0] Fetching form status from submissions for id:', userId)
  
  const { data, error } = await supabase
    .from('submissions')
    .select('form_status')
    .eq('id', userId)
    .limit(1)

  if (error) {
    console.error('[v0] Error fetching submissions:', JSON.stringify(error))
    return null
  }

  if (!data || data.length === 0) {
    console.log('[v0] No submission record found for id:', userId)
    return null
  }

  console.log('[v0] Found submission with form_status:', data[0].form_status)
  return data[0].form_status
}

export async function createUtentiDiagnosiStrategica(
  userId: string,
  email: string,
  nome: string,
  cognome: string
) {
  const supabase = await createClient()
  
  console.log('[v0] Creating/updating utenti for diagnosi - PRIMARY KEY COLUMN ID:', userId)
  
  try {
    // Controlla se l'utente esiste
    const { data: existingUser, error: checkError } = await supabase
      .from('utenti')
      .select('id')
      .eq('id', userId)
      .limit(1)

    // Se la tabella non esiste, usa il fallback
    if (checkError && checkError.code === 'PGRST205') {
      console.log('[v0] Tabella utenti non esiste, uso fallback a utenti_diagnosi_strategica')
      
      const { data: existingFallback, error: checkFallbackError } = await supabase
        .from('utenti_diagnosi_strategica')
        .select('id')
        .eq('id', userId)
        .limit(1)

      if (checkFallbackError) {
        console.error('[v0] Error checking utenti_diagnosi_strategica:', JSON.stringify(checkFallbackError))
        throw checkFallbackError
      }

      if (existingFallback && existingFallback.length > 0) {
        // L'utente esiste già, niente da fare
        console.log('[v0] Utenti_diagnosi_strategica record already exists for id:', userId)
        return await getUtentiDiagnosiStrategica(userId)
      }

      // Crea un nuovo record nella vecchia tabella
      const { data, error } = await supabase
        .from('utenti_diagnosi_strategica')
        .insert({
          id: userId,
          email,
          nome,
          cognome,
          product: 'diagnosi-strategica',
          has_paid: null,
          form_status: null,
        })
        .select()

      if (error) {
        console.error('[v0] Error creating utenti_diagnosi_strategica:', JSON.stringify(error))
        throw new Error(`Failed to create user record: ${error.message}`)
      }

      console.log('[v0] Utenti_diagnosi_strategica record created successfully:', data)
      return data?.[0]
    }

    if (checkError) {
      console.error('[v0] Error checking utenti:', JSON.stringify(checkError))
      throw checkError
    }

    if (existingUser && existingUser.length > 0) {
      // L'utente esiste già, niente da fare
      console.log('[v0] Utenti record already exists for id:', userId)
      return await getUtentiAnalisiLampo(userId)
    }

    // Crea un nuovo record
    const { data, error } = await supabase
      .from('utenti')
      .insert({
        id: userId,
        email,
        nome,
        cognome,
        paid_analisi: null,
        paid_diagnosi: null,
        form_status: null,
      })
      .select()

    if (error) {
      console.error('[v0] Error creating utenti:', JSON.stringify(error))
      throw new Error(`Failed to create user record: ${error.message}`)
    }

    console.log('[v0] Utenti record created successfully:', data)
    return data?.[0]
  } catch (err: any) {
    console.error('[v0] Exception creating utenti:', err.message)
    throw err
  }
}

export async function getUtentiDiagnosiStrategica(userId: string) {
  const supabase = await createClient()
  
  console.log('[v0] Fetching utenti for diagnosi - id:', userId)
  
  // Prova prima la VECCHIA tabella utenti_diagnosi_strategica (finché la migrazione non è completa)
  const { data: fallbackData, error: fallbackError } = await supabase
    .from('utenti_diagnosi_strategica')
    .select('*')
    .eq('id', userId)
    .limit(1)

  if (!fallbackError && fallbackData && fallbackData.length > 0) {
    // Mappo i dati dalla vecchia struttura alla nuova
    const mappedData = {
      ...fallbackData[0],
      paid_analisi: null,
      paid_diagnosi: fallbackData[0].has_paid, // Mappo has_paid a paid_diagnosi
    }

    console.log('[v0] Found utenti_diagnosi_strategica record (mapped):', mappedData)
    return mappedData
  }

  // Se la vecchia tabella non ha dati, prova la nuova tabella utenti
  const { data, error } = await supabase
    .from('utenti')
    .select('*')
    .eq('id', userId)
    .limit(1)

  if (error) {
    console.error('[v0] Error fetching utenti:', JSON.stringify(error))
    return null
  }

  if (!data || data.length === 0) {
    console.log('[v0] No utenti record found for id:', userId)
    return null
  }

  console.log('[v0] Found utenti record:', data[0])
  return data[0]
}
