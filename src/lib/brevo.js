import { supabase } from './supabase.js'

/** Live Brevo sync via the brevo-sync Edge Function (staff roles only). */
export async function brevoUpsert(contact) {
  if (!supabase) return { ok: false, error: 'supabase not configured' }
  const { data, error } = await supabase.functions.invoke('brevo-sync', {
    body: { action: 'upsert', contact },
  })
  return error ? { ok: false, error: error.message } : (data ?? { ok: false })
}

export async function brevoDelete(email) {
  if (!supabase) return { ok: false, error: 'supabase not configured' }
  const { data, error } = await supabase.functions.invoke('brevo-sync', {
    body: { action: 'delete', contact: { email } },
  })
  return error ? { ok: false, error: error.message } : (data ?? { ok: false })
}
