import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../i18n.jsx'
import { openCookieSettings } from './CookieNotice.jsx'
import { SOCIAL } from '../lib/site.js'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { lang, t, setLang } = useLang()
  const { pathname } = useLocation()
  const onHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const anchor = (hash) => (onHome ? `#${hash}` : `/#${hash}`)
  const LINKS = [
    [anchor('about'), t.nav.about, false],
    [anchor('services'), t.nav.services, false],
    [anchor('models'), t.nav.models, false],
    ['/model', t.nav.model, true],
    ['/blog', t.nav.blog, true],
    [anchor('contact'), t.nav.contact, false],
  ]

  return (
    <header className={`nav ${scrolled || open || !onHome ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" aria-label="EFQM and Strategy Assessors — home">
          <img src="/brand/wordmark-white.png" alt="EFQM and Strategy Assessors" />
        </Link>
        <button
          className={`nav-burger ${open ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map(([href, label, isRoute]) => (
            <li key={label}>
              {isRoute
                ? <Link to={href} onClick={() => setOpen(false)}>{label}</Link>
                : <a href={href} onClick={() => setOpen(false)}>{label}</a>}
            </li>
          ))}
          <li>
            <div className="lang-switch" role="group" aria-label="Language / اللغة">
              <button
                className={`lang-opt ${lang === 'en' ? 'on' : ''}`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                lang="en"
              >
                English
              </button>
              <button
                className={`lang-opt ${lang === 'ar' ? 'on' : ''}`}
                onClick={() => setLang('ar')}
                aria-pressed={lang === 'ar'}
                lang="ar"
              >
                العربية
              </button>
            </div>
          </li>
          <li>
            <Link to="/login" className="btn btn-primary nav-cta client-flash">
              <Icon name="lock" /><span>{t.nav.client}</span>
            </Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export function Footer() {
  const { t } = useLang()
  const links = [
    ['/#about', t.nav.about], ['/#services', t.nav.services],
    ['/model', t.nav.model], ['/blog', t.nav.blog],
    ['/#team', t.nav.team], ['/#contact', t.nav.contact],
  ]
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <img src="/brand/wordmark-white.png" alt="EFQM and Strategy Assessors" />
            <p style={{ maxWidth: '34em', fontSize: '0.92rem' }}>{t.footer.blurb}</p>
            <div className="footer-social" aria-label={t.footer.follow}>
              {SOCIAL.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                   aria-label={s.name} title={s.name}>
                  <SocialIcon name={s.icon} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4>{t.footer.navigate}</h4>
            <ul>
              {links.map(([href, label]) => (
                <li key={label}><Link to={href}>{label}</Link></li>
              ))}
              <li><Link to="/login">{t.nav.client}</Link></li>
              <li><a href="/rss.xml" target="_blank" rel="noopener noreferrer">{t.blog.rss}</a></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.contact}</h4>
            <ul>
              <li>{t.footer.addr1}</li>
              <li>{t.footer.addr2}</li>
              <li><a href="tel:+971507369400" dir="ltr">+971 50 736 9400</a></li>
              <li><a href="mailto:hello@efqmassessors.ae">hello@efqmassessors.ae</a></li>
            </ul>
          </div>
          <div>
            <h4>{t.footer.legalHeading}</h4>
            <ul>
              <li><Link to="/privacy">{t.legalNav.privacy}</Link></li>
              <li><Link to="/cookies">{t.legalNav.cookies}</Link></li>
              <li><Link to="/terms">{t.legalNav.terms}</Link></li>
              <li><Link to="/legal-notice">{t.legalNav.notice}</Link></li>
              <li><Link to="/accessibility">{t.legalNav.accessibility}</Link></li>
              <li><button type="button" className="footer-linkbtn" onClick={openCookieSettings}>{t.cookie.settings}</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {t.footer.legal}</span>
          <span>{t.footer.group}</span>
        </div>
      </div>
    </footer>
  )
}

/** Wave divider that echoes the diminishing ribbon of the logo. */
export function HeroWave() {
  return (
    <svg className="hero-wave" viewBox="0 0 1440 120" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#58e0b4" />
          <stop offset="0.5" stopColor="#1fa98a" />
          <stop offset="1" stopColor="#0e4c60" />
        </linearGradient>
      </defs>
      <path
        d="M0,64 C180,110 340,10 520,54 C700,98 860,20 1040,58 C1220,96 1340,40 1440,60 L1440,120 L0,120 Z"
        fill="#f5faf9"
      />
      <path
        d="M0,64 C180,110 340,10 520,54 C700,98 860,20 1040,58 C1220,96 1340,40 1440,60"
        fill="none" stroke="url(#ribbon)" strokeWidth="3" opacity="0.9"
      />
    </svg>
  )
}

/** Animated RADAR wheel built from the brand palette. */
export function RadarWheel() {
  const segs = [
    { label: 'R', a: -90 },
    { label: 'A', a: 0 },
    { label: 'D', a: 90 },
    { label: 'AR', a: 180 },
  ]
  return (
    <div className="radar-wheel" role="img" aria-label="RADAR logic: Results, Approaches, Deploy, Assess and Refine">
      <svg viewBox="0 0 400 400">
        <defs>
          <linearGradient id="rw" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#58e0b4" />
            <stop offset="1" stopColor="#0e4c60" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="none" stroke="rgba(88,224,180,0.18)" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="110" fill="none" stroke="rgba(88,224,180,0.12)" strokeWidth="1" strokeDasharray="4 8" />
        <circle
          cx="200" cy="200" r="150" fill="none"
          stroke="url(#rw)" strokeWidth="6" strokeLinecap="round"
          strokeDasharray="640 302" transform="rotate(-90 200 200)"
        >
          <animateTransform attributeName="transform" type="rotate" from="-90 200 200" to="270 200 200" dur="24s" repeatCount="indefinite" />
        </circle>
        {segs.map(({ label, a }) => {
          const rad = (a * Math.PI) / 180
          const x = 200 + 150 * Math.cos(rad)
          const y = 200 + 150 * Math.sin(rad)
          return (
            <g key={label}>
              <circle cx={x} cy={y} r="30" fill="#0e1730" stroke="#1fa98a" strokeWidth="2" />
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                fill="#58e0b4" fontFamily="Rubik, sans-serif" fontWeight="600" fontSize="17">
                {label}
              </text>
            </g>
          )
        })}
        <image href="/brand/spiral.png" x="128" y="128" width="144" height="144" />
      </svg>
    </div>
  )
}

/** Tiny inline icon set (stroke = currentColor). */
export function Icon({ name }) {
  const paths = {
    compass: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
    scan: <><path d="M4 8V5a1 1 0 011-1h3M16 4h3a1 1 0 011 1v3M20 16v3a1 1 0 01-1 1h-3M8 20H5a1 1 0 01-1-1v-3" /><circle cx="12" cy="12" r="3.5" /></>,
    shield: <><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" /><path d="M9 12l2 2 4-4.5" /></>,
    academy: <><path d="M3 9l9-4.5L21 9l-9 4.5z" /><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" /></>,
    chart: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>,
    org: <><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M12 12H6v4M12 12h6v4" /></>,
    support: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 2.5" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>,
    doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>,
    radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 3v4.5M12 12l6 -3" /></>,
    chat: <><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-5 4z" /></>,
    layers: <><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17l9 5 9-5" /></>,
    lock: <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /><circle cx="12" cy="15.5" r="1.4" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

/**
 * ExcellenceOrbit — animated SVG for the About section.
 * Seven criteria of the EFQM Model 2025 orbiting a spiral core, grouped
 * into the three blocks (Direction / Execution / Results) by colour.
 * Pure SVG + SMIL/CSS animation; no images, no licence text.
 */
export function ExcellenceOrbit() {
  // 7 criteria positioned on a ring; colour by block.
  const nodes = [
    { n: '1', block: 'dir' }, { n: '2', block: 'dir' },
    { n: '3', block: 'exe' }, { n: '4', block: 'exe' }, { n: '5', block: 'exe' },
    { n: '6', block: 'res' }, { n: '7', block: 'res' },
  ]
  const cx = 200, cy = 200, R = 132
  const colour = { dir: '#58E0B4', exe: '#1FA98A', res: '#0E4C60' }

  return (
    <div className="excellence-orbit" role="img"
      aria-label="The seven criteria of the EFQM Model 2025 orbiting a central core">
      <svg viewBox="0 0 400 400">
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#58E0B4" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#1FA98A" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0E4C60" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="orbit-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#58E0B4" />
            <stop offset="1" stopColor="#0E4C60" />
          </linearGradient>
        </defs>

        {/* soft core glow */}
        <circle cx={cx} cy={cy} r="150" fill="url(#core-glow)">
          <animate attributeName="r" values="140;158;140" dur="6s" repeatCount="indefinite" />
        </circle>

        {/* concentric guide rings */}
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(88,224,180,0.20)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={R - 34} fill="none" stroke="rgba(88,224,180,0.10)" strokeWidth="1" strokeDasharray="3 7" />

        {/* rotating dashed accent ring */}
        <circle cx={cx} cy={cy} r={R + 20} fill="none" stroke="url(#orbit-ring)" strokeWidth="2"
          strokeLinecap="round" strokeDasharray="80 300" opacity="0.7">
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="28s" repeatCount="indefinite" />
        </circle>

        {/* the whole node ring rotates slowly */}
        <g>
          <animateTransform attributeName="transform" type="rotate"
            from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="46s" repeatCount="indefinite" />
          {nodes.map((node, i) => {
            const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2
            const x = cx + R * Math.cos(a)
            const y = cy + R * Math.sin(a)
            return (
              <g key={node.n}>
                <line x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(88,224,180,0.16)" strokeWidth="1" />
                <circle cx={x} cy={y} r="24" fill="#0E1730" stroke={colour[node.block]} strokeWidth="2.5">
                  <animate attributeName="r" values="24;26;24" dur="4s" begin={`${i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                {/* counter-rotate the label so numbers stay upright */}
                <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={colour[node.block]} fontFamily="Rubik, sans-serif" fontWeight="600" fontSize="17">
                  {node.n}
                  <animateTransform attributeName="transform" type="rotate"
                    from={`0 ${x} ${y}`} to={`-360 ${x} ${y}`} dur="46s" repeatCount="indefinite" />
                </text>
              </g>
            )
          })}
        </g>

        {/* spiral core emblem */}
        <image href="/brand/spiral.png" x="150" y="150" width="100" height="100" />
      </svg>
    </div>
  )
}

// Filled brand glyphs for social links (separate from the stroke-based Icon).
export function SocialIcon({ name }) {
  const glyphs = {
    linkedin: <path d="M4.98 3.5a2.5 2.5 0 11-.02 5.001A2.5 2.5 0 014.98 3.5zM3 8.98h4V21H3zM9 8.98h3.83v1.64h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V21h-4v-5.38c0-1.28-.02-2.94-1.79-2.94-1.79 0-2.06 1.4-2.06 2.85V21H9z" />,
    x: <path d="M17.53 3H20.5l-6.49 7.42L21.75 21h-6l-4.7-6.14L5.66 21H2.68l6.94-7.93L2.25 3h6.16l4.25 5.62L17.53 3zm-1.05 16.2h1.65L7.6 4.71H5.83z" />,
    facebook: <path d="M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0022 12z" />,
    instagram: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 1.62c-3.15 0-3.52.01-4.76.07-1.15.05-1.77.24-2.19.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.42-.35 1.04-.4 2.19-.06 1.24-.07 1.61-.07 4.76s.01 3.52.07 4.76c.05 1.15.24 1.77.4 2.19.22.55.47.94.88 1.35.41.41.8.66 1.35.88.42.16 1.04.35 2.19.4 1.24.06 1.61.07 4.76.07s3.52-.01 4.76-.07c1.15-.05 1.77-.24 2.19-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.42.35-1.04.4-2.19.06-1.24.07-1.61.07-4.76s-.01-3.52-.07-4.76c-.05-1.15-.24-1.77-.4-2.19a3.6 3.6 0 00-.88-1.35 3.6 3.6 0 00-1.35-.88c-.42-.16-1.04-.35-2.19-.4-1.24-.06-1.61-.07-4.76-.07zm0 2.76a5.29 5.29 0 110 10.58 5.29 5.29 0 010-10.58zm0 1.62a3.67 3.67 0 100 7.34 3.67 3.67 0 000-7.34zm5.48-.29a1.24 1.24 0 11-2.47 0 1.24 1.24 0 012.47 0z" />,
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {glyphs[name]}
    </svg>
  )
}
