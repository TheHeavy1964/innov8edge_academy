import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET /api/lesson-videos?lessonId=2
// GET /api/lesson-videos  (returns all)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lessonId = searchParams.get('lessonId');

  let query = supabase.from('lesson_videos').select('lesson_id, video_url, updated_at');

  if (lessonId) {
    query = query.eq('lesson_id', lessonId).single() as any;
  }

  const { data, error } = await query;

  if (error && error.code !== 'PGRST116') { // PGRST116 = row not found (ok)
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? null });
}

// POST /api/lesson-videos
// Body: { lessonId: string, videoUrl: string, userId: string }
export async function POST(request: NextRequest) {
  try {
    const { lessonId, videoUrl, userId } = await request.json();

    if (!lessonId || !videoUrl) {
      return NextResponse.json({ error: 'lessonId and videoUrl are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('lesson_videos')
      .upsert(
        {
          lesson_id: lessonId,
          video_url: videoUrl,
          updated_by: userId || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'lesson_id' }
      )
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
