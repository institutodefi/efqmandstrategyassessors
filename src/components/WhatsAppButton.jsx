import { useState } from 'react'
import { useLang } from '../i18n.jsx'

// Company mobile in international format, digits only for the wa.me link.
const WA_NUMBER = '971507369400'

export default function WhatsAppButton() {
  const { t } = useLang()
  const w = t.whatsapp
  const [showBubble, setShowBubble] = useState(true)

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(w.prefill)}`

  return (
    <div className="wa-fab">
      {showBubble && (
        <div className="wa-bubble" role="note">
          <button
            className="wa-bubble-close"
            aria-label={w.close}
            onClick={() => setShowBubble(false)}
          >
            ×
          </button>
          <span>{w.greeting}</span>
        </div>
      )}
      <a
        className="wa-btn"
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={w.label}
        title={w.label}
      >
        <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
          <path
            fill="currentColor"
            d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.7c1.7.9 3.6 1.4 5.6 1.4h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3.9.9-4.2-.3-.4c-1-1.6-1.5-3.4-1.5-5.3C5.4 9.6 10.2 4.8 16 4.8S26.6 9.6 26.6 15.4 21.8 24.8 16 24.8zm5.9-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3s0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5s.1-.4 0-.6-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5s-.3-.2-.6-.3z"
          />
        </svg>
      </a>
    </div>
  )
}
