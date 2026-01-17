import { createClient } from '@supabase/supabase-js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const update = await req.json();
    console.log("Received Webhook Update:", JSON.stringify(update, null, 2));

    if (!update.message) {
        console.log("No message in update, ignoring.");
        return new Response('ok', { headers: corsHeaders });
    }

    const msg = update.message;

    if (msg.reply_to_message) {
        console.log("Found reply_to_message:", msg.reply_to_message.message_id);
        const replyToId = msg.reply_to_message.message_id;
        
        const { data, error } = await supabase
            .from('chat_messages')
            .select('session_id')
            .eq('telegram_message_id', replyToId)
            .single();
        
        if (error) {
            console.error("Error finding original message:", error);
        }

        if (data) {
            console.log("Found session ID:", data.session_id);
            const { error: insertError } = await supabase.from('chat_messages').insert({
                session_id: data.session_id,
                content: msg.text,
                sender_type: 'admin',
                is_read: true
            });
            
            if (insertError) {
                console.error("Error inserting admin message:", insertError);
            } else {
                console.log("Successfully inserted admin message.");
            }

            const { error: updateError } = await supabase
                .from('chat_sessions')
                .update({ last_message_at: new Date().toISOString() })
                .eq('id', data.session_id);

            if (updateError) {
                 console.error("Error updating session timestamp:", updateError);
            }
        } else {
            console.log("No matching message found for telegram_message_id:", replyToId);
        }
    } else {
        // Handle case where user forgot to reply to a specific message
        console.log("Message is not a reply. Sending warning to user.");
        const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
        if (TELEGRAM_BOT_TOKEN) {
            await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: msg.chat.id,
                    text: "⚠️ **Please reply to a specific message.**\n\nI need to know which customer you are talking to.",
                    reply_to_message_id: msg.message_id,
                    parse_mode: 'Markdown'
                })
            });
        }
    }

    return new Response('ok', { headers: corsHeaders });
  } catch (error) {
    console.error("Webhook Handler Error:", error);
    return new Response('error', { status: 500, headers: corsHeaders });
  }
});