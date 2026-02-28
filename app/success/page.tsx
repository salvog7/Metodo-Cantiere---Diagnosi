'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { markPaymentComplete } from '@/app/actions/stripe'

function buildFormUrl(
  productId: string,
  userId: string,
  email: string,
  nome: string,
  cognome: string,
  azienda: string
): string {
  const params = new URLSearchParams({
    user_id: userId,
    userId,
    email: email || '',
    nome: nome || '',
    cognome: cognome || '',
    azienda: azienda || '',
  })
  if (productId === 'diagnosi-strategica') {
    params.set('product', 'diagnosi-strategica')
  }
  return `/form?${params.toString()}`
}

export default function SuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const processedRef = useRef(false)

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [formUrl, setFormUrl] = useState<string | null>(null)
  const [formMessage, setFormMessage] = useState<string>(
    'Il pagamento è stato elaborato correttamente.'
  )
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (!sessionId) {
      setStatus('error')
      setErrorMessage('Sessione di pagamento non trovata. Se hai completato il pagamento, contatta il supporto.')
      return
    }
    if (processedRef.current) return

    processedRef.current = true

    markPaymentComplete(sessionId).then((result) => {
      if (!result.success) {
        setStatus('error')
        setErrorMessage(result.error || 'Errore durante la verifica del pagamento.')
        return
      }

      if (!result.userId || !result.productId) {
        setStatus('error')
        setErrorMessage('Dati insufficienti per continuare. Vai alla pagina prodotti.')
        return
      }

      const url = buildFormUrl(
        result.productId,
        result.userId,
        result.customerEmail ?? '',
        result.nome ?? '',
        result.cognome ?? '',
        result.azienda ?? ''
      )
      setFormUrl(url)

      if (result.productId === 'diagnosi-strategica') {
        setFormMessage('Pagamento ricevuto. Clicca sotto per iniziare il form Diagnosi Strategica.')
      } else {
        setFormMessage('Pagamento ricevuto. Clicca sotto per iniziare il form Analisi Lampo.')
      }
      setStatus('success')
    })
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
          <h1 className="text-xl font-semibold text-neutral-900 mb-3">
            Verifica del pagamento in corso...
          </h1>
          <p className="text-neutral-600 text-sm">
            Attendi qualche secondo.
          </p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-amber-100 rounded-full p-4">
              <AlertCircle className="w-12 h-12 text-amber-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-3">
            Qualcosa non è andato a buon fine
          </h1>
          <p className="text-neutral-600 mb-8">
            {errorMessage}
          </p>
          <div className="space-y-3">
            <Link href="/prodotti">
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Vai alla pagina prodotti
              </Button>
            </Link>
            <Link href="/">
              <Button
                type="button"
                variant="outline"
                className="w-full font-medium py-2 px-4 rounded-lg transition-colors border-neutral-300"
              >
                Torna alla home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

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
          {formMessage}
        </p>

        {formUrl && (
          <Button
            onClick={() => router.push(formUrl)}
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Inizia il form
          </Button>
        )}

        <p className="text-xs text-neutral-400 mt-6">
          Sessione di pagamento completata
        </p>
      </div>
    </div>
  )
}
