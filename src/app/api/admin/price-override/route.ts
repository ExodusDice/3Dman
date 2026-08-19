import { NextRequest, NextResponse } from 'next/server';
import { overrideOrderPrice } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, newSubtotal, reason } = body;

    if (!orderId || newSubtotal === undefined || typeof newSubtotal !== 'number') {
      return NextResponse.json({ success: false, error: 'Invalid parameters for price override' }, { status: 400 });
    }

    const updated = overrideOrderPrice(orderId, newSubtotal, reason || 'Admin manual price override');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
