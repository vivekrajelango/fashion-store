
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase Client (Admin context for writing)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// Note: Ideally use SERVICE_ROLE_KEY for admin bypass, but for now anon key + RLS policies might restrict us if policies are strict. 
// Assuming we used public policies early on, anon might work, but service key is safer for webhooks.

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // The admin group or user ID

export async function POST(req: NextRequest) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        return NextResponse.json({ error: 'Telegram misconfigured' }, { status: 500 });
    }

    try {
        const body = await req.json();
        const { message_id, content, customer_name, session_id } = body;

        // 1. Send to Telegram
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const text = `📩 *New Message from ${customer_name || 'Guest'}*\n\n${content}\n\n_Reply to this message to chat back._`;

        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown',
            }),
        });

        const data = await response.json();

        if (!data.ok) {
            console.error('Telegram API Error:', data);
            return NextResponse.json({ error: `Telegram Error: ${data.description}` }, { status: 502 });
        }

        const telegramMsgId = data.result.message_id;

        // 2. Update the message record in Supabase with the Telegram Message ID
        // This allows us to track replies later
        const { error } = await supabase
            .from('chat_messages')
            .update({ telegram_message_id: telegramMsgId })
            .eq('id', message_id);

        if (error) {
            console.error('Supabase Update Error:', error);
            return NextResponse.json({ error: 'Failed to link message' }, { status: 500 });
        }

        return NextResponse.json({ success: true, telegram_message_id: telegramMsgId });

    } catch (e) {
        console.error('Handler Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
