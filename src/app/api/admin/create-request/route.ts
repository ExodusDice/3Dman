import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/db';
import { AVAILABLE_SHIPPING_OPTIONS } from '@/lib/materials';
import { calculateProfitPrice } from '@/lib/pricing';
import { matchShapeFromPrompt } from '@/lib/meshy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      customerName,
      customerEmail,
      prompt,
      material,
      heightCm = 16,
      customPrice,
    } = body;

    if (!customerEmail || !prompt) {
      return NextResponse.json({ success: false, error: 'Customer email and prompt required' }, { status: 400 });
    }

    const shippingOption = AVAILABLE_SHIPPING_OPTIONS[0]; // Standard 14-day SLA
    const shape = matchShapeFromPrompt(prompt, 'cyberpunk');

    const modelGeometry = {
      shape,
      widthCm: Number((heightCm * 0.8).toFixed(1)),
      heightCm,
      depthCm: Number((heightCm * 0.7).toFixed(1)),
      infillPercent: 35,
      triangleCount: 95000,
    };

    const pricing = calculateProfitPrice({
      widthCm: modelGeometry.widthCm,
      heightCm: modelGeometry.heightCm,
      depthCm: modelGeometry.depthCm,
      infillPercent: modelGeometry.infillPercent,
      material,
      shippingOption,
      customPriceOverride: customPrice,
      overrideReason: 'Created directly by Admin / Print Specialist',
    });

    const slaGuaranteedDeliveryDate = new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

    const order = createOrder({
      customerName: customerName || 'VIP Client',
      customerEmail,
      status: 'approved', // Admin created, so approved directly
      prompt,
      style: 'cyberpunk',
      modelGeometry,
      material,
      shippingOption,
      shippingAddress: {
        fullName: customerName || 'VIP Client',
        email: customerEmail,
        phone: '+1 (555) 000-0000',
        addressLine1: 'Client Address On File',
        city: 'Metropolis',
        state: 'CA',
        postalCode: '90210',
        country: 'United States',
      },
      pricing,
      estimatedPrice: pricing.totalPrice,
      actualPrice: pricing.totalPrice,
      estimatedSlaDeliveryDate: slaGuaranteedDeliveryDate,
      actualSlaDeliveryDate: slaGuaranteedDeliveryDate,
      revisionCount: 0,
      maxRevisionsAllowed: 3,
      revisionHistory: [],
      slaGuaranteedDeliveryDate,
      isSlaMet: true,
      adminNotes: 'Direct operator job created with pre-negotiated pricing.',
    });

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
