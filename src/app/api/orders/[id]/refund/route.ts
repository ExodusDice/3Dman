import { NextRequest, NextResponse } from 'next/server';
import { requestRefund, resolveRefund } from '@/lib/db';

// Customer requests refund
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { reason } = body;

    if (!reason || !reason.trim()) {
      return NextResponse.json({ success: false, error: 'Refund reason is required' }, { status: 400 });
    }

    const updated = requestRefund(params.id, reason.trim());
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Admin approves / rejects refund
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { approved, adminResponse } = body;

    if (approved === undefined) {
      return NextResponse.json({ success: false, error: 'Approval decision (true/false) required' }, { status: 400 });
    }

    const updated = resolveRefund(
      params.id,
      Boolean(approved),
      adminResponse || (approved ? '100% SLA Guarantee Refund Authorized' : 'Refund rejected according to SLA policy terms.')
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found or no refund pending' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
