'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import Image from 'next/image'

export default function VerifyEmailContent() {
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token')
        const type = searchParams.get('type')

        if (!token || type !== 'email_change') {
          setError('Link di verifica non valido')
          setVerifying(false)
          return
        }

        const supabase = createClient()
        
        const { error } = await supabase.auth.verifyOtp({
          token: token,
          type: 'email_change' as const,
        })

        if (error) {
          console.error('Errore verifica email:', error)
          setError('Link scaduto o non valido. Richiedi un nuovo link di conferma.')
          setVerifying(false)
          return
        }

        setSuccess(true)
        setVerifying(false)
        
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      } catch (err: any) {
        console.error('Errore durante la verifica:', err)
        setError('Errore durante la verifica dell\'email')
        setVerifying(false)
      }
    }

    verifyEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center mb-8">
        <Image
          src="/logo-metodo-cantiere.png"
          alt="Metodo Cantiere"
          width={280}
          height={80}
          priority
          className="w-auto h-auto"
        />
          <p className="text-2xl font-bold text-primary mt-2">Analisi Lampo</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Verifica Email</h1>
          <p className="text-neutral-600 mb-6">
            {verifying ? 'Verifica in corso...' : success ? 'Email verificata con successo!' : 'Errore nella verifica'}
          </p>

          <div className="space-y-4">
            {verifying && (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            )}

            {success && (
              <div className="text-center space-y-4">
                <div className="text-sm text-green-600 bg-green-50 border border-green-200 rounded-md p-4">
                  ✓ Email verificata con successo!
                </div>
                <p className="text-neutral-600 text-sm">Verrai reindirizzato al login tra pochi secondi...</p>
              </div>
            )}

            {error && (
              <div className="text-center space-y-4">
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-4">
                  {error}
                </div>
                <Link
                  href="/auth/sign-up"
                  className="inline-block text-sm text-primary font-medium hover:underline"
                >
                  Torna alla registrazione
                </Link>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-neutral-200">
            <Link
              href="/auth/login"
              className="text-center block text-sm text-neutral-600 hover:text-primary font-medium transition-colors"
            >
              Torna al login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
