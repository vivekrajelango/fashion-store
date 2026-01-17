
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

export async function POST(req: NextRequest) {
    try {
        const update = await req.json();

        // Check if it's a message
        if (!update.message) {
            return NextResponse.json({ ok: true }); // Ignore strictly updates
        }

        console.log(' Telegram Webhook Received:', JSON.stringify(update, null, 2));

        const msg = update.message;

        // 1. Check if it is a reply to a forwarded message
        // The admin must reply to the bot's message for us to know which user it is.
        if (msg.reply_to_message) {
            console.log(' It is a reply to message ID:', msg.reply_to_message.message_id);
            const replyToId = msg.reply_to_message.message_id;
            const adminContent = msg.text;

            // 2. Find the original message in our DB to get the Session ID
            const { data: originalMsg, error: findError } = await supabase
                .from('chat_messages')
                .select('session_id')
                .eq('telegram_message_id', replyToId)
                .single();

            if (findError || !originalMsg) {
                console.error('Could not find original session for this reply:', replyToId);
                // Optional: Send a message back to admin saying "Could not find session"
                return NextResponse.json({ ok: true });
            }

            const sessionId = originalMsg.session_id;

            // 3. Insert the Admin's reply into DB
            const { error: insertError } = await supabase
                .from('chat_messages')
                .insert({
                    session_id: sessionId,
                    content: adminContent,
                    sender_type: 'admin',
                    is_read: true // Admin read it obviously
                });

            // 4. Update session timestamp
            await supabase
                .from('chat_sessions')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', sessionId);

            if (insertError) {
                console.error('Failed to insert admin reply:', insertError);
            }
        }

        return NextResponse.json({ ok: true });
    } catch (e) {
        console.error('Webhook Error:', e);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
