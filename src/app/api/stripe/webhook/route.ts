import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { updateOrder } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const payload = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: any;

  if (webhookSecret && sig) {
    try {
      event = stripe.webhooks.constructEvent(payload, sig, webhookSecret);
    } catch (err: any) {
      console.error('Stripe webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Webhook Error' }, { status: 400 });
    }
  } else {
    // If testing without webhook secret, parse raw JSON
    try {
      event = JSON.parse(payload);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.metadata?.orderId;
        if (orderId) {
          updateOrder(orderId, {
            adminNotes: `Stripe payment verified ($${(session.amount_total / 100).toFixed(2)} USD). Slicing underway.`,
          });
        }
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.warn(`Payment failed for Intent: ${paymentIntent.id}`);
        break;
      }
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
