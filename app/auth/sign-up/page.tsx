'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import Image from 'next/image'
import { createUtentiAnalisiLampo } from '@/app/actions/database'
import { checkEmailExists } from '@/app/actions/database'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nome, setNome] = useState('')
  const [cognome, setCognome] = useState('')
  const [azienda, setAzienda] = useState('')
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [loading, setLoading] = useState(false)
  const [userExists, setUserExists] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setWarning('')
    setUserExists(false)

    // Validazioni
    if (!nome.trim() || !cognome.trim() || !azienda.trim()) {
      setError('Tutti i campi sono obbligatori')
      return
    }

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
      // Controlla PRIMA se l'email esiste già
      console.log('[v0] Sign-up: Checking if email already exists...')
      const emailAlreadyExists = await checkEmailExists(email)
      
      if (emailAlreadyExists) {
        console.log('[v0] Sign-up: Email already exists - blocking registration')
        setUserExists(true)
        setWarning('Questo email è già registrato.')
        setLoading(false)
        return
      }

      const supabase = createClient()
      console.log('[v0] Sign-up: Starting signup with email:', email)
      
      // Prova a registrare l'utente
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      console.log('[v0] Sign-up: Auth response - error:', error)
      console.log('[v0] Sign-up: Auth response - data:', data)

      if (error) {
        // Controlla se l'errore è dovuto a utente già esistente
        if (error.message?.includes('already registered') || error.message?.includes('User already exists')) {
          console.log('[v0] Sign-up: User already registered - showing warning')
          setUserExists(true)
          setWarning('Questo email è già registrato.')
        } else {
          console.error('[v0] Sign-up: Auth error details:')
          console.error('[v0] - Message:', error.message)
          console.error('[v0] - Code:', (error as any).code)
          console.error('[v0] - Status:', (error as any).status)
          console.error('[v0] - Full error:', JSON.stringify(error))
          
          // Se è errore database, mostra messaggio specifico
          if (error.message?.includes('Database') || error.message?.includes('database')) {
            console.error('[v0] DATABASE ERROR - This is likely a trigger or webhook issue in Supabase')
            setError('Errore database durante la registrazione. Contatta il supporto.')
          } else {
            setError(error.message || 'Errore durante la registrazione')
          }
        }
        setLoading(false)
        return
      }

      if (data.user) {
        console.log('[v0] Sign-up: User registered successfully with ID:', data.user.id)
        
        // Crea il record in utenti_analisi_lampo
        try {
          console.log('[v0] Sign-up: Creating utenti_analisi_lampo record...')
          await createUtentiAnalisiLampo(
            data.user.id,
            email,
            nome,
            cognome,
            azienda
          )
          console.log('[v0] Sign-up: User record created successfully')
        } catch (dbError: any) {
          console.error('[v0] Sign-up: Error creating user record:', dbError)
          // Non blocchiamo il flusso se fallisce - continua al sign-up-success
        }

        console.log('[v0] Sign-up: Redirecting to sign-up-success')
        router.push('/auth/sign-up-success')
      }
    } catch (err: any) {
      console.error('[v0] Sign-up: Exception:', err)
      setError(err.message || 'Errore durante la registrazione')
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
          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">Registrati</h1>
          <p className="text-neutral-600 mb-6">
            Crea il tuo account per accedere all'Analisi Lampo
          </p>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-neutral-900">
                  Nome
                </Label>
                <Input
                  id="nome"
                  type="text"
                  placeholder="Mario"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cognome" className="text-neutral-900">
                  Cognome
                </Label>
                <Input
                  id="cognome"
                  type="text"
                  placeholder="Rossi"
                  value={cognome}
                  onChange={(e) => setCognome(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="azienda" className="text-neutral-900">
                Azienda
              </Label>
              <Input
                id="azienda"
                type="text"
                placeholder="Nome della tua azienda"
                value={azienda}
                onChange={(e) => setAzienda(e.target.value)}
                required
                className="h-11"
              />
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-900">
                Password
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

            {warning && (
              <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md p-3">
                {warning}
                {userExists && (
                  <>
                    <br />
                    <Link href="/auth/login" className="text-amber-800 font-medium hover:underline">
                      Accedi al tuo account
                    </Link>
                    {' o '}
                    <Link href="/auth/forgot-password" className="text-amber-800 font-medium hover:underline">
                      recupera la password
                    </Link>
                  </>
                )}
              </div>
            )}

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
              {loading ? 'Registrazione in corso...' : 'Registrati'}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-600 mt-6">
            Hai già un account?{' '}
            <Link href="/auth/login" className="text-primary font-medium hover:underline">
              Accedi
            </Link>
          </p>

          <div className="mt-4 pt-6 border-t border-neutral-200">
            <Link
              href="/auth/forgot-password"
              className="text-center block text-sm text-neutral-600 hover:text-primary font-medium transition-colors"
            >
              Hai dimenticato la password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
