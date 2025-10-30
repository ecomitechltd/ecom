import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://iiembyyndevatzpriohs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZW1ieXluZGV2YXR6cHJpb2hzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1NTk4NDQsImV4cCI6MjA3NzEzNTg0NH0.fFrFPkQqeWc96sxdPvhEDD3-GQt95X14WOLaZ4271Ps'

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";
