import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import PocketBase from 'pocketbase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const POCKETBASE_URL = process.env.NEXT_PUBLIC_POCKETBASE_URL || 'http://127.0.0.1:8090';

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const listingId = session.metadata?.listingId;

    if (listingId) {
      try {
        const pb = new PocketBase(POCKETBASE_URL);
        
        // Authenticate as admin if credentials are available
        const adminEmail = process.env.PB_ADMIN_EMAIL;
        const adminPassword = process.env.PB_ADMIN_PASSWORD;
        if (adminEmail && adminPassword) {
          await pb.collection('_superusers').authWithPassword(adminEmail, adminPassword);
        }

        await pb.collection('listings').update(listingId, {
          paymentStatus: 'paid',
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent,
        });

        console.log(`✅ Listing ${listingId} payment confirmed. Session: ${session.id}`);
      } catch (error) {
        console.error('Failed to update listing after payment:', error);
        // Still return 200 to Stripe so they don't retry
      }
    }
  }

  return NextResponse.json({ received: true });
}
