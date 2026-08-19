import { NextRequest, NextResponse } from 'next/server';
import { approveOrderWithFinalPriceAndSla } from '@/lib/db';
import { sendSlaApprovalEmail } from '@/lib/email';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { actualPrice, actualSlaDate, notes } = body;

    if (!actualPrice || !actualSlaDate) {
      return NextResponse.json({ success: false, error: 'Actual price and actual SLA date are required' }, { status: 400 });
    }

    const updated = approveOrderWithFinalPriceAndSla(
      params.id,
      parseFloat(actualPrice),
      actualSlaDate,
      notes
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Trigger SLA Approval Email via Resend
    sendSlaApprovalEmail(updated).catch((err) => {
      console.error('Background SLA email error:', err);
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
