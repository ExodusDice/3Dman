import { NextRequest, NextResponse } from 'next/server';
import { getGalleryDesigns } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const designs = getGalleryDesigns();
    return NextResponse.json({ success: true, designs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
