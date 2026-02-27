import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'

const COOKIE_NAME = 'setup_session'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get(COOKIE_NAME)
  return !!session?.value
}

export async function GET(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo')

  if (!tipo || !['analisi_lampo', 'diagnosi_strategica'].includes(tipo)) {
    return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('form_setup')
      .select('*')
      .eq('tipo', tipo)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json({ data: data || null })
  } catch (err) {
    console.error('[setup/form] GET error:', err)
    return NextResponse.json({ error: 'Errore nel caricamento' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  try {
    const { tipo, config } = await request.json()

    if (!tipo || !['analisi_lampo', 'diagnosi_strategica'].includes(tipo)) {
      return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
    }

    if (!Array.isArray(config)) {
      return NextResponse.json({ error: 'Config non valida' }, { status: 400 })
    }

    const supabase = createAdminClient()
    const { error } = await supabase
      .from('form_setup')
      .upsert(
        { tipo, config },
        { onConflict: 'tipo' }
      )

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[setup/form] PUT error:', err)
    return NextResponse.json({ error: 'Errore nel salvataggio' }, { status: 500 })
  }
}
