import { NextRequest, NextResponse } from 'next/server';
import { createMeshyTask, pollMeshyTask } from '@/lib/meshy';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mode = 'text-to-3d', prompt, imageUrl, negativePrompt, style, apiKey } = body;

    const result = await createMeshyTask({
      mode,
      prompt,
      imageUrl,
      negativePrompt,
      style,
      apiKey,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Meshy POST error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('taskId');
    const taskType = (searchParams.get('taskType') || 'text-to-3d') as 'text-to-3d' | 'image-to-3d';
    const apiKey = searchParams.get('apiKey') || undefined;

    if (!taskId) {
      return NextResponse.json({ success: false, error: 'taskId is required' }, { status: 400 });
    }

    const result = await pollMeshyTask(taskId, taskType, apiKey);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Meshy GET polling error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
