import { createClient } from '@supabase/supabase-js';

// The URL provided by the user
const supabaseUrl = 'https://simsjjbtkadcgisabgwk.supabase.co';
// Placeholder for the ANON KEY (user will need to replace this or use env vars)
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpbXNqamJ0a2FkY2dpc2FiZ3drIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5ODE0NjMsImV4cCI6MjA5MDU1NzQ2M30.xL5cXfumcIliSUxcPZeIYt8bsfGM9Jjtgk_6TnsAZCo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
