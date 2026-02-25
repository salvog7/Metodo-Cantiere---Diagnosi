'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Le password non corrispondono')
      return
    }

    if (password.length < 6) {
      setError('La password deve contenere almeno 6 caratteri')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      setSuccess(true)
      setPassword('')
      setConfirmPassword('')

      // Reindirizza al login dopo 2 secondi
      setTimeout(() => {
        router.push('/auth/login')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Errore durante il recupero della password')
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
            Reimposta la Password
          </h1>
          <p className="text-neutral-600 mb-6">
            Inserisci la tua nuova password
          </p>

          {success ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 font-medium mb-2">Password aggiornata con successo!</p>
                <p className="text-green-700 text-sm">
                  Stai per essere reindirizzato alla pagina di accesso. Effettua l'accesso con la tua nuova password.
                </p>
              </div>

              <Button
                asChild
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-medium"
              >
                <Link href="/auth/login">Vai all'accesso</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-neutral-900">
                  Nuova Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-neutral-900">
                  Conferma Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? 'Aggiornamento in corso...' : 'Aggiorna Password'}
              </Button>
            </form>
          )}

          <p className="text-center text-sm text-neutral-600 mt-6">
            Torna a{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              accesso
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
