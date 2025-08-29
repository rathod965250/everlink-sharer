import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Use direct Supabase configuration for reliable deployment
const SUPABASE_URL = "https://fqaneqqwdsmlfsbhtixq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxYW5lcXF3ZHNtbGZzYmh0aXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYyMTc0ODIsImV4cCI6MjA3MTc5MzQ4Mn0.lwZ-Z-OA1ZLf_gobrZkCYBriR-Ec5UUMRpT_cyux2jQ";

// Create and configure the Supabase client
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
  global: {
    headers: { 'x-application-name': 'everlink-sharer' },
  },
});

// Debug helper
console.log('Supabase client initialized with URL:', SUPABASE_URL);