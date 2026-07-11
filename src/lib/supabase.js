import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The site renders without Supabase configured; the client zone
// simply shows a "not configured" notice until env vars are set.
export const supabase = url && anonKey ? createClient(url, anonKey) : null
