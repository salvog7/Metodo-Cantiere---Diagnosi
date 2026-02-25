import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature || !WEBHOOK_SECRET) {
    console.error('[v0] Missing webhook signature or secret')
    return NextResponse.json(
      { error: 'Missing signature or secret' },
      { status: 400 }
    )
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('[v0] Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('[v0] Webhook event received:', event.type)

  // Gestisci il checkout.session.completed per i pagamenti
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    try {
      const userId = session.metadata?.user_id
      const productId = session.metadata?.product_id
      
      if (!userId || !productId) {
        console.error('[v0] No user_id or product_id in session metadata')
        return NextResponse.json({ error: 'Missing user_id or product_id' }, { status: 400 })
      }

      const supabase = await createClient()

      // Determina quale colonna aggiornare e quale webhook n8n usare
      let columnToUpdate = 'paid_analisi'
      let n8nWebhookUrl = 'https://aihunterz.app.n8n.cloud/webhook/94d6f56f-1a00-467e-b425-8272457c60f8'

      if (productId === 'diagnosi-strategica') {
        columnToUpdate = 'paid_diagnosi'
        n8nWebhookUrl = 'https://aihunterz.app.n8n.cloud/webhook/6051cab7-a90a-4ce8-926d-0817f7fded4c'
      }

      console.log('[v0] Updating utenti table - user:', userId, 'column:', columnToUpdate)

      // Prepara l'oggetto di update dinamicamente
      const updateData: any = {
        updated_at: new Date().toISOString(),
        amount_paid: session.amount_total ? session.amount_total / 100 : null,
      }
      updateData[columnToUpdate] = 'paid'

      const { error } = await supabase
        .from('utenti')
        .update(updateData)
        .eq('id', userId)

      if (error) {
        console.error('[v0] Error updating database:', error)
        return NextResponse.json(
          { error: 'Failed to update database' },
          { status: 500 }
        )
      }

      console.log('[v0] Payment marked as completed for user:', userId, 'column:', columnToUpdate)

      // Invia webhook a n8n
      try {
        const webhookPayload = {
          event: 'payment_completed',
          sessionId: session.id,
          userId: userId,
          amount: session.amount_total,
          currency: session.currency,
          customerEmail: session.customer_email || session.metadata?.customer_email,
          paymentStatus: session.payment_status,
          timestamp: new Date().toISOString(),
          productId: productId,
        }

        console.log('[v0] Sending n8n webhook to:', n8nWebhookUrl)
        console.log('[v0] Webhook payload:', webhookPayload)

        const n8nResponse = await fetch(n8nWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookPayload),
        })

        if (!n8nResponse.ok) {
          console.error('[v0] n8n webhook failed with status:', n8nResponse.status)
          const responseText = await n8nResponse.text()
          console.error('[v0] n8n response:', responseText)
        } else {
          console.log('[v0] n8n webhook sent successfully for session:', session.id)
        }
      } catch (webhookErr: any) {
        console.error('[v0] Error sending n8n webhook:', webhookErr.message)
        // Non ritornare errore, il pagamento è comunque stato registrato nel database
      }
    } catch (err: any) {
      console.error('[v0] Error processing webhook:', err)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
