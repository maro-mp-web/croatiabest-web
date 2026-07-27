import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia' as any, // Temporarily cast to any if types are mismatched
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { categoryId, categoryName, priceAmount, listingId, userEmail } = body;

    if (!categoryId || !priceAmount || !listingId) {
      return NextResponse.json(
        { error: 'Nedostaju potrebni podaci (categoryId, priceAmount, listingId).' },
        { status: 400 }
      );
    }

    // Parsiraj cijenu iz stringa (npr. "99€" -> 9900 centi)
    const priceInCents = Math.round(parseFloat(priceAmount.replace(/[^0-9.,]/g, '').replace(',', '.')) * 100);

    if (isNaN(priceInCents) || priceInCents <= 0) {
      return NextResponse.json(
        { error: 'Neispravna cijena.' },
        { status: 400 }
      );
    }

    const origin = request.headers.get('origin') || 'https://croatiabest.hr';

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `CroatiaBest Premium Partner — ${categoryName}`,
              description: `Godišnja članarina za kategoriju: ${categoryName}`,
            },
            unit_amount: priceInCents,
          },
          quantity: 1,
        },
      ],
      metadata: {
        listingId,
        categoryId,
      },
      success_url: `${origin}/submit/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/submit?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Session Error:', error);
    return NextResponse.json(
      { error: error.message || 'Greška pri kreiranju Stripe sesije.' },
      { status: 500 }
    );
  }
}
