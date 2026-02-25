import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { XCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
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

        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>

          <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
            Errore di autenticazione
          </h1>
          <p className="text-neutral-600 mb-6">
            Si è verificato un errore durante l'autenticazione. Riprova.
          </p>

          <Button asChild className="w-full h-11 bg-primary hover:bg-primary/90">
            <Link href="/auth/login">Torna al Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
