import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase with the Service Role key to bypass RLS and fetch auth.users
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// The URL of your external Admin Portal endpoint that will receive the enriched data
const ADMIN_PORTAL_WEBHOOK_URL = 'https://otpcqamliwnauirgxaxl.supabase.co/functions/v1/academy-sync';

export async function POST(req: Request) {
  try {
    // 1. Optional Security: Verify the request came from your own Supabase
    // const authHeader = req.headers.get('Authorization');
    // if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const payloadType = body.type; // INSERT, UPDATE
    const table = body.table; // lesson_progress, user_metrics
    const record = body.record; // The actual row data

    if (!record || !record.user_id) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 2. Fetch the user's email from auth.users using the Service Role
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(record.user_id);
    
    if (userError || !userData?.user?.email) {
      console.error("Failed to find user email for webhook:", userError);
      return NextResponse.json({ error: 'User email not found' }, { status: 404 });
    }

    const email = userData.user.email;

    // 3. Format the enriched payload to send to your Lovable.dev Admin Portal
    const enrichedPayload = {
      source: 'innov8edge-academy',
      timestamp: new Date().toISOString(),
      event_type: `${table}_${payloadType.toLowerCase()}`, // e.g., "user_metrics_update"
      intern_email: email,
      data: record
    };

    // 4. Send the enriched payload to your Admin Portal
    const adminResponse = await fetch(ADMIN_PORTAL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Academy-Secret': process.env.ACADEMY_SYNC_SECRET || ''
      },
      body: JSON.stringify(enrichedPayload)
    });

    if (!adminResponse.ok) {
      console.error(`Failed to forward webhook to Admin Portal. Status: ${adminResponse.status}`);
      return NextResponse.json({ error: 'Forwarding failed' }, { status: 502 });
    }

    return NextResponse.json({ success: true, email_synced: email });

  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
