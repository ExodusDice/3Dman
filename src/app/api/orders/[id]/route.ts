import { NextRequest, NextResponse } from 'next/server';
import { getOrderById, updateOrder } from '@/lib/db';
import { sendShippingTrackingEmail } from '@/lib/email';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const order = getOrderById(params.id);
    if (!order) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updated = updateOrder(params.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // If status transitioned to shipping, trigger courier tracking email
    if (body.status === 'shipping' && updated.trackingNumber) {
      sendShippingTrackingEmail(updated).catch((err) => {
        console.error('Background tracking email error:', err);
      });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
