import { NextRequest, NextResponse } from 'next/server';
import { getOrders, createOrder, getAdminProfitAnalytics } from '@/lib/db';
import { calculateProfitPrice } from '@/lib/pricing';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const orders = getOrders();
    const analytics = getAdminProfitAnalytics();
    return NextResponse.json({ success: true, orders, analytics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      prompt,
      negativePrompt,
      style,
      modelGeometry,
      material,
      shippingOption,
      shippingAddress,
      revisionCount = 0,
    } = body;

    // Recalculate price on server to prevent tampering
    const pricing = calculateProfitPrice({
      widthCm: modelGeometry.widthCm,
      heightCm: modelGeometry.heightCm,
      depthCm: modelGeometry.depthCm,
      infillPercent: modelGeometry.infillPercent,
      material,
      shippingOption,
    });

    // 14-day SLA deadline (or selected shipping SLA days)
    const slaDays = shippingOption?.slaDays || 14;
    const slaGuaranteedDeliveryDate = new Date(Date.now() + slaDays * 24 * 3600 * 1000).toISOString();

    const newOrder = createOrder({
      customerName: customerName || shippingAddress?.fullName || 'Customer',
      customerEmail: customerEmail || shippingAddress?.email || 'customer@artisan.io',
      status: 'admin_review', // Phase 1: Admin Review starts upon payment
      prompt: prompt || 'Custom 3D Art',
      negativePrompt,
      style: style || 'cyberpunk',
      modelGeometry,
      material,
      shippingOption,
      shippingAddress,
      pricing,
      estimatedPrice: pricing.totalPrice,
      estimatedSlaDeliveryDate: slaGuaranteedDeliveryDate,
      revisionCount: revisionCount || 0,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      slaGuaranteedDeliveryDate,
      isSlaMet: true,
      adminNotes: `New job queued. Awaiting Admin Slicing & SLA validation with ${material.name} profile.`,
    });

    // Send transactional order confirmation email via Resend
    sendOrderConfirmationEmail(newOrder).catch((err) => {
      console.error('Background order email error:', err);
    });

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err: any) {
    console.error('Failed to create order:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
