import { useState } from 'react'
import { useLang } from '../i18n.jsx'
import { SocialIcon } from './Chrome.jsx'

const ORIGIN = 'https://efqmassessors.ae'

export default function ShareBar({ slug, title }) {
  const { t } = useLang()
  const [copied, setCopied] = useState(false)
  const url = `${ORIGIN}/blog/${slug}`
  const u = encodeURIComponent(url)
  const tx = encodeURIComponent(title)

  const links = [
    { name: 'LinkedIn', icon: 'linkedin', href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: 'X', icon: 'x', href: `https://twitter.com/intent/tweet?url=${u}&text=${tx}` },
    { name: 'Facebook', icon: 'facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ]

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { /* clipboard blocked */ }
  }

  const waHref = `https://wa.me/?text=${tx}%20${u}`

  return (
    <div className="share-bar" aria-label={t.blog.share}>
      <span className="share-label">{t.blog.share}</span>
      {links.map((l) => (
        <a key={l.name} className="share-btn" href={l.href} target="_blank"
           rel="noopener noreferrer" aria-label={l.name} title={l.name}>
          <SocialIcon name={l.icon} />
        </a>
      ))}
      <a className="share-btn share-wa" href={waHref} target="_blank"
         rel="noopener noreferrer" aria-label="WhatsApp" title="WhatsApp">
        <svg viewBox="0 0 32 32" width="18" height="18" aria-hidden="true">
          <path fill="currentColor" d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.7c1.7.9 3.6 1.4 5.6 1.4h.2c6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.3.9.9-4.2-.3-.4c-1-1.6-1.5-3.4-1.5-5.3C5.4 9.6 10.2 4.8 16 4.8S26.6 9.6 26.6 15.4 21.8 24.8 16 24.8zm5.9-7.7c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.3-.7.1c-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3s0-.5.1-.7l.5-.6c.2-.2.2-.3.3-.5s.1-.4 0-.6-.7-1.7-1-2.3c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4s-1.2 1.2-1.2 2.8 1.2 3.3 1.4 3.5c.2.2 2.4 3.7 5.8 5.1.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.9-.8 2.2-1.5.3-.7.3-1.4.2-1.5s-.3-.2-.6-.3z" />
        </svg>
      </a>
      <button className="share-btn share-copy" onClick={copy} aria-label={t.blog.copy} title={t.blog.copy}>
        {copied ? (
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4 4 10-10" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 012-2h10" /></svg>
        )}
      </button>
      {copied && <span className="share-copied">{t.blog.copied}</span>}
    </div>
  )
}
