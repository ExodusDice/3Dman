import { NextRequest, NextResponse } from 'next/server';
import { getChatMessages, addChatMessage } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get('orderId') || undefined;
    const messages = getChatMessages(orderId);
    return NextResponse.json({ success: true, messages });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, sender, senderName, message } = body;

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message cannot be empty' }, { status: 400 });
    }

    const newMsg = addChatMessage({
      orderId,
      sender: sender || 'customer',
      senderName: senderName || 'User',
      message: message.trim(),
    });

    return NextResponse.json({ success: true, message: newMsg });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
