// Single source of truth for WhatsApp across the site — harmonised with the CRM.
// Every entry point tags its origin so staff can register the lead with the
// right consent_source ('whatsapp') and know which page it came from.
export const WA_NUMBER = '971507369400'

export function waLink(text, source) {
  const tagged = source ? `${text} [${source}]` : text
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(tagged)}`
}
