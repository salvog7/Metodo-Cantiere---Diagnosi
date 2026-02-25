'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function PaymentPageProtection({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const historyLengthRef = useRef(0)

  useEffect(() => {
    // Registra la lunghezza dello history iniziale
    historyLengthRef.current = window.history.length
    console.log('[v0] Payment page loaded - history length:', historyLengthRef.current)

    // Handler per il back button
    const handlePopState = async () => {
      console.log('[v0] Back button pressed - logging out...')
      
      // Esegui logout
      const supabase = createClient()
      await supabase.auth.signOut()
      
      console.log('[v0] User logged out - redirecting to login')
      router.push('/auth/login')
    }

    // Aggiungi listener per il back button
    window.addEventListener('popstate', handlePopState)

    // Prevent caching della pagina
    const noCache = () => {
      window.history.pushState(null, '', window.location.href)
    }
    
    // Aggiungi pushState quando si entra nella pagina
    window.history.pushState(null, '', window.location.href)
    
    // Pulisci i listener quando l'utente esce
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  return <>{children}</>
}
