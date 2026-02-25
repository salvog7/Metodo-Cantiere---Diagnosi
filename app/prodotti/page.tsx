import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Scegli il tuo prodotto - Metodo Cantiere',
  description: 'Seleziona tra Analisi Lampo e Diagnosi Strategica',
}

export default async function ProdottiPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-12">
          <Image
            src="/logo-metodo-cantiere.png"
            alt="Metodo Cantiere"
            width={280}
            height={80}
            priority
            className="w-auto h-auto"
          />
          <h1 className="text-3xl font-bold text-neutral-900 mt-6 text-center">
            Scegli il tuo prodotto
          </h1>
          <p className="text-neutral-600 mt-2 text-center max-w-lg">
            Seleziona tra le nostre soluzioni per analizzare e far crescere la tua impresa digitale
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Analisi Lampo */}
          <Link href="/payment">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl border border-neutral-200 p-8 transition-all cursor-pointer h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Analisi Lampo Metodo Cantiere®
                </h2>
                <p className="text-neutral-600 text-sm">
                  La radiografia veloce della tua impresa digitale
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-neutral-900">€147,00</span>
                  <span className="text-neutral-600 text-sm">una tantum</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-neutral-700">Analisi completa della tua azienda</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-neutral-700">Report dettagliato</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-neutral-700">Quick wins per migliorare marketing e branding della tua azienda</span>
                </li>
              </ul>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                Seleziona Analisi Lampo
              </button>
            </div>
          </Link>

          {/* Diagnosi Strategica */}
          <Link href="/payment-diagnosi-strategica">
            <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl border border-neutral-200 p-8 transition-all cursor-pointer h-full flex flex-col">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  Diagnosi Strategica Metodo Cantiere®
                </h2>
                <p className="text-neutral-600 text-sm">
                  Analisi approfondita e roadmap per la crescita digitale
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-neutral-900">€497,00</span>
                  <span className="text-neutral-600 text-sm">una tantum</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-neutral-700">Diagnosi strategica e roadmap operativa per la crescita digitale</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold text-lg flex-shrink-0">✓</span>
                  <span className="text-neutral-700">Raccomandazioni Step-by-Step per rafforzare il posizionamento online</span>
                </li>
              </ul>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                Seleziona Diagnosi Strategica
              </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
