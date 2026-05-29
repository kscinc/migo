// supabaseClient.js — Single shared Supabase client
// All modules import from here instead of creating their own client.

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY,
  {
    realtime: { enabled: false },          // server doesn't need realtime/WebSocket
    auth: { persistSession: false }        // server is stateless — no cookie/localStorage
  }
);

module.exports = supabase;
