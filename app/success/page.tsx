'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Reindirizza a /payment dopo 5 secondi
    const timer = setTimeout(() => {
      router.push('/payment')
    }, 5000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 rounded-full p-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-3">
          Pagamento effettuato con successo!
        </h1>

        <p className="text-neutral-600 mb-2">
          Il tuo pagamento è stato elaborato correttamente.
        </p>

        <p className="text-neutral-600 mb-8">
          Ora completa il form per ricevere la tua Analisi Lampo personalizzata. I tuoi dati sono già stati salvati e verranno precompilati.
        </p>

        <div className="space-y-3">
          <Button
            onClick={() => router.push('/payment')}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Vai alla tua Analisi Lampo
          </Button>

          <Link href="/">
            <button
              type="button"
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-900 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Torna alla home
            </button>
          </Link>

          <div className="inline-flex items-center gap-2 text-xs text-neutral-500 pt-2">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
            Reindirizzamento automatico tra pochi istanti...
          </div>
        </div>

        <p className="text-xs text-neutral-400 mt-6">
          Sessione di pagamento completata
        </p>
      </div>
    </div>
  )
}
