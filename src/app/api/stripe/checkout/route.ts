import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { calculateProfitPrice } from '@/lib/pricing';
import { createOrder } from '@/lib/db';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      prompt,
      artStyle,
      geometryInfo,
      material,
      shippingOption,
      shippingAddress,
      revisionCount = 0,
    } = body;

    const pricing = calculateProfitPrice({
      widthCm: geometryInfo.widthCm,
      heightCm: geometryInfo.heightCm,
      depthCm: geometryInfo.depthCm,
      infillPercent: geometryInfo.infillPercent,
      material,
      shippingOption,
    });

    const slaDays = shippingOption?.slaDays || 14;
    const slaGuaranteedDeliveryDate = new Date(Date.now() + slaDays * 24 * 3600 * 1000).toISOString();

    // Create the order record in database store
    const newOrder = createOrder({
      customerName: shippingAddress?.fullName || 'Guest Customer',
      customerEmail: shippingAddress?.email || 'guest@3dman.studio',
      status: 'admin_review',
      prompt: prompt || 'Custom 3D Art',
      style: artStyle || 'cyberpunk',
      modelGeometry: geometryInfo,
      material,
      shippingOption,
      shippingAddress,
      pricing,
      estimatedPrice: pricing.totalPrice,
      estimatedSlaDeliveryDate: slaGuaranteedDeliveryDate,
      revisionCount,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      slaGuaranteedDeliveryDate,
      isSlaMet: true,
      adminNotes: `Stripe checkout initiated. Awaiting Admin Slicing & SLA validation.`,
    });

    // Send confirmation email
    sendOrderConfirmationEmail(newOrder).catch((err) => {
      console.error('Email error:', err);
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // If Stripe secret key is test/mock, provide instant mock redirect
    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('mock')) {
      return NextResponse.json({
        success: true,
        orderId: newOrder.id,
        redirectUrl: `${appUrl}/orders/${newOrder.id}?stripe_mock=success`,
      });
    }

    // Create real Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: shippingAddress?.email || undefined,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `3D Custom Print: ${prompt.slice(0, 45)}...`,
              description: `Material: ${material.name} • Height: ${geometryInfo.heightCm}cm • 14-Day SLA Guarantee`,
              images: [
                'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
              ],
            },
            unit_amount: Math.round(pricing.totalPrice * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/orders/${newOrder.id}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/studio`,
      metadata: {
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        materialId: material.id,
      },
    });

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      sessionId: session.id,
      redirectUrl: session.url || `${appUrl}/orders/${newOrder.id}`,
    });
  } catch (err: any) {
    console.error('Stripe checkout session creation failed:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
