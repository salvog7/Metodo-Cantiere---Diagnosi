'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import HeaderWithProfile from '@/components/header-with-profile'

export default function PaymentLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter()

  useEffect(() => {
    console.log('[v0] Payment page mounted - setting up protection')

    // Handler per il back button
    const handlePopState = async () => {
      console.log('[v0] Back button pressed on payment page - logging out...')
      
      try {
        // Esegui logout
        const supabase = createClient()
        await supabase.auth.signOut()
        
        console.log('[v0] User logged out - redirecting to login')
        router.push('/auth/login')
      } catch (err) {
        console.error('[v0] Error during logout:', err)
        router.push('/auth/login')
      }
    }

    // Previeni il back button aggiungendo uno state nello history
    window.history.pushState(null, '', window.location.href)
    
    // Aggiungi listener per il back button
    window.addEventListener('popstate', handlePopState)

    // Cleanup quando il componente viene smontato
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  return (
    <div className="min-h-screen bg-neutral-50">
      <HeaderWithProfile />
      <div className="py-12 px-4">
        {children}
      </div>
    </div>
  )
}
