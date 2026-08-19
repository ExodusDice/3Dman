import { NextRequest, NextResponse } from 'next/server';
import { generate3DModel } from '@/lib/meshy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, negativePrompt, style } = body;

    const result = await generate3DModel({
      prompt: prompt || '3D sculpture',
      negativePrompt,
      style: style || 'cyberpunk',
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
