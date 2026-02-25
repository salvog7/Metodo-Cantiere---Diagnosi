'use server'

import { stripe } from '@/lib/stripe'
import { PRODUCTS } from '@/lib/products'

interface CreateCheckoutSessionParams {
  productId: string
  userId: string
  customerEmail: string
}

export async function createCheckoutSession({
  productId,
  userId,
  customerEmail,
}: CreateCheckoutSessionParams) {
  try {
    console.log('[v0] Creating Checkout Session for:', { productId, userId, customerEmail })

    const product = PRODUCTS.find((p) => p.id === productId)
    if (!product) {
      throw new Error(`Product "${productId}" not found`)
    }

    // Ottieni l'URL di base con schema https
    let baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
    
    if (!baseUrl) {
      baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'
    }
    
    // Assicurati che la URL abbia lo schema https
    if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
      baseUrl = `https://${baseUrl}`
    }

    // Crea una Checkout Session seguendo la guida ufficiale Stripe
    // Ogni pagamento crea una nuova sessione completamente isolata
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.priceInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: customerEmail,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/payment`,
      metadata: {
        user_id: userId,
        product_id: productId,
        customer_email: customerEmail,
      },
      // IMPORTANT: Non salvare il metodo di pagamento
      // Ogni transazione è effimera
    })

    if (!session.url) {
      throw new Error('Failed to generate checkout URL')
    }

    console.log('[v0] Checkout Session created:', session.id)
    return {
      sessionId: session.id,
      checkoutUrl: session.url,
    }
  } catch (error: any) {
    console.error('[v0] Error creating Checkout Session:', error)
    throw new Error(error.message || 'Failed to create checkout session')
  }
}
