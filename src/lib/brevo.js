import { supabase } from './supabase.js'

/** Live Brevo sync via the brevo-sync Edge Function (staff roles only). */
async function readErr(error) {
  // FunctionsHttpError carries the response — surface the function's message
  try {
    const body = await error?.context?.json?.()
    if (body?.error || body?.detail) return body.error || body.detail
  } catch { /* noop */ }
  return error?.message || 'unknown error'
}

export async function brevoUpsert(contact) {
  if (!supabase) return { ok: false, error: 'supabase not configured' }
  const { data, error } = await supabase.functions.invoke('brevo-sync', {
    body: { action: 'upsert', contact },
  })
  if (error) return { ok: false, error: await readErr(error) }
  return data ?? { ok: false }
}

export async function brevoDelete(email) {
  if (!supabase) return { ok: false, error: 'supabase not configured' }
  const { data, error } = await supabase.functions.invoke('brevo-sync', {
    body: { action: 'delete', contact: { email } },
  })
  return error ? { ok: false, error: error.message } : (data ?? { ok: false })
}
