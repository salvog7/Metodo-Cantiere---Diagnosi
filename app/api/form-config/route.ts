import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { DEFAULT_ANALISI_LAMPO_CONFIG, DEFAULT_DIAGNOSI_STRATEGICA_CONFIG } from '@/lib/setup-seed'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo')

  if (!tipo || !['analisi_lampo', 'diagnosi_strategica'].includes(tipo)) {
    return NextResponse.json({ error: 'Tipo non valido' }, { status: 400 })
  }

  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('form_setup')
      .select('config')
      .eq('tipo', tipo)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const defaultConfig =
      tipo === 'analisi_lampo' ? DEFAULT_ANALISI_LAMPO_CONFIG : DEFAULT_DIAGNOSI_STRATEGICA_CONFIG

    const config =
      data?.config && Array.isArray(data.config) && data.config.length > 0
        ? data.config
        : defaultConfig

    return NextResponse.json({ data: { config } })
  } catch (err) {
    console.error('[form-config] GET error:', err)
    const defaultConfig =
      tipo === 'analisi_lampo' ? DEFAULT_ANALISI_LAMPO_CONFIG : DEFAULT_DIAGNOSI_STRATEGICA_CONFIG
    return NextResponse.json({ data: { config: defaultConfig } })
  }
}
