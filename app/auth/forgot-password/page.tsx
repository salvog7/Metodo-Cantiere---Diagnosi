'use client'

import React, { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) throw error

      setSubmitted(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Errore durante l\'invio dell\'email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-metodo-cantiere.png"
            alt="Metodo Cantiere"
            width={280}
            height={80}
            priority
            className="w-auto h-auto"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8">
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Recupera la Password
          </h1>
          <p className="text-neutral-600 mb-6">
            Inserisci il tuo email e riceverai un link per reimpostare la password
          </p>

          {submitted ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">Email inviata con successo!</p>
                <p className="text-green-700 text-sm">
                  Controlla la tua casella email per il link di recupero della password. Il link scadrà tra 1 ora.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  className="w-full h-11"
                >
                  Invia un altro link
                </Button>
                <Button
                  asChild
                  className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
                >
                  <Link href="/auth/login">Torna all'accesso</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-neutral-900">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
              >
                {loading ? 'Invio in corso...' : 'Invia link di recupero'}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-neutral-200 flex flex-col gap-2 text-center text-sm">
            <p className="text-neutral-600">
              Torna a{' '}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                accesso
              </Link>
            </p>
            <p className="text-neutral-600">
              Non hai un account?{' '}
              <Link href="/auth/sign-up" className="text-primary font-medium hover:underline">
                Registrati
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
