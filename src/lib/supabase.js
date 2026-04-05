import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://srzggcfzreoekruihium.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyemdnY2Z6cmVvZWtydWloaXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MjU5NjYsImV4cCI6MjA5MDMwMTk2Nn0.Q-bP8IRBqMZyUDi9BQ-152DEnbHL0EgGBRHq285Okx8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
