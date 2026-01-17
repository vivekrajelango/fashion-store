import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { message_id, content, customer_name, session_id } = await req.json();

    const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      throw new Error('Telegram configuration missing');
    }

    if (!content) {
      return new Response(
        JSON.stringify({ error: "Content is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Format message for Telegram
    const text = `📩 *New Message from ${customer_name || 'Guest'}*\n\n${content}\n\n_Reply to this message to chat back._`;

    // Send to Telegram
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: text,
          parse_mode: 'Markdown',
        }),
      }
    );

    const telegramData = await telegramRes.json();

    if (!telegramData.ok) {
        console.error("Telegram API Error:", telegramData);
        throw new Error(`Telegram API Error: ${telegramData.description}`);
    }

    const telegramMsgId = telegramData.result.message_id;

    // Update the message record in Supabase with the Telegram Message ID
    if (message_id) {
        const { error: dbError } = await supabase
            .from('chat_messages')
            .update({ telegram_message_id: telegramMsgId })
            .eq('id', message_id);
        
        if (dbError) {
            console.error('Supabase Update Error:', dbError);
            // Non-blocking error
        }
    }

    return new Response(
      JSON.stringify({ success: true, telegram_message_id: telegramMsgId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});