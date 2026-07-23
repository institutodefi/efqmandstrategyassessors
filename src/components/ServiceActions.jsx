import { Link } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { SERVICES } from '../data/services.js'

const WA_NUMBER = '971507369400'

/**
 * The two actions every service drives to:
 *   1. Request  -> the /request form page, pre-selecting the service
 *   2. WhatsApp -> a chat pre-filled with "I am interested in <service>"
 *
 * `size="sm"` renders the compact icon-led variant used inside lists.
 */
export default function ServiceActions({ service, size = 'md', className = '' }) {
  const { lang } = useLang()
  const S = SERVICES[lang] || SERVICES.en
  const h = S.hub

  const waText = h.waService.replace('{service}', service)
  const waHref = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`
  const reqHref = `/request?service=${encodeURIComponent(service)}`

  return (
    <div className={`svc-actions ${size === 'sm' ? 'sm' : ''} ${className}`}>
      <Link className="btn btn-request" to={reqHref} aria-label={`${h.requestFull}: ${service}`}>
        <RequestIcon />
        <span>{size === 'sm' ? h.request : h.requestFull}</span>
      </Link>
      <a
        className="btn btn-wa"
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp: ${service}`}
      >
        <WaIcon />
        <span>{h.wa}</span>
      </a>
    </div>
  )
}

export function RequestIcon() {
  return (
    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor"
         strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" />
      <path d="M8 8h6M8 12h6M8 16h3" />
      <path d="M17.5 13.5 21 17l-3.5 3.5" />
      <path d="M21 17h-6" />
    </svg>
  )
}

export function WaIcon() {
  return (
    <svg viewBox="0 0 32 32" width="17" height="17" aria-hidden="true">
      <path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.7c1.7.9 3.6 1.4 5.6 1.4h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3.9.9-4.2-.3-.4c-1-1.6-1.5-3.4-1.5-5.3C5.4 9.6 10.2 4.8 16 4.8S26.6 9.6 26.6 15.4 21.8 24.8 16 24.8zm5.9-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3s0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5s.1-.4 0-.6-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5s-.3-.2-.6-.3z" />
    </svg>
  )
}
