import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://llqguizfjmgpnbkruxun.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxscWd1aXpmam1ncG5ia3J1eHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTM3NjIsImV4cCI6MjA4NTcyOTc2Mn0.HVsCxbdOJNkkQAXPSoqrU7TsDF8DVwtUHEQg7wiOj0Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
