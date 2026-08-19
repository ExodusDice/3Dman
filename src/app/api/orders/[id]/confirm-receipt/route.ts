import { NextRequest, NextResponse } from 'next/server';
import { customerConfirmReceipt } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { matchesOrder, satisfactionRating, feedbackNotes } = body;

    const updated = customerConfirmReceipt(
      params.id,
      matchesOrder !== undefined ? matchesOrder : true,
      satisfactionRating,
      feedbackNotes
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
