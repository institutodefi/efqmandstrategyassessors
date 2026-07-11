import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  ['#about', 'About'],
  ['#services', 'Services'],
  ['#method', 'Method'],
  ['#recognition', 'Recognition'],
  ['#team', 'Team'],
  ['#contact', 'Contact'],
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav ${scrolled || open ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#top" className="nav-logo" aria-label="EFQM and Strategy Assessors — home">
          <img src="/brand/wordmark-white.png" alt="EFQM and Strategy Assessors" />
        </a>
        <button
          className={`nav-burger ${open ? 'open' : ''}`}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span /><span /><span />
        </button>
        <ul className={`nav-links ${open ? 'open' : ''}`}>
          {LINKS.map(([href, label]) => (
            <li key={href}><a href={href} onClick={() => setOpen(false)}>{label}</a></li>
          ))}
          <li>
            <Link to="/login" className="btn btn-primary nav-cta">Client zone</Link>
          </li>
        </ul>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-top">
          <div>
            <img src="/brand/wordmark-white.png" alt="EFQM and Strategy Assessors" />
            <p style={{ maxWidth: '34em', fontSize: '0.92rem' }}>
              EFQM and Strategy Assessors FZCO helps organisations achieve sustainable
              excellence through the EFQM Model — assessment, recognition, strategy and
              training across the Americas, Europe and MENA.
            </p>
          </div>
          <div>
            <h4>Navigate</h4>
            <ul>
              {LINKS.map(([href, label]) => (
                <li key={href}><a href={`/${href}`}>{label}</a></li>
              ))}
              <li><Link to="/login">Client zone</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li>Building A1, Dubai Digital Park</li>
              <li>Dubai Silicon Oasis, Dubai, UAE</li>
              <li><a href="tel:+971507369400">+971 50 736 9400</a></li>
              <li><a href="mailto:hello@efqmassessors.ae">hello@efqmassessors.ae</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EFQM and Strategy Assessors FZCO · Trade License 59735 · Dubai, UAE</span>
          <span>Part of the TuConsultor Group</span>
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
    { label: 'R', name: 'Results', a: -90 },
    { label: 'A', name: 'Approaches', a: 0 },
    { label: 'D', name: 'Deploy', a: 90 },
    { label: 'AR', name: 'Assess & Refine', a: 180 },
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
        {segs.map(({ label, name, a }) => {
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
              <title>{name}</title>
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
    academy: <><path d="M3 9l9-4.5L21 9l-9 4.5z" /><path d="M7 11.5V16c0 1.2 2.2 2.5 5 2.5s5-1.3 5-2.5v-4.5" /></>,
    chart: <><path d="M4 20h16" /><path d="M7 16v-4M12 16V8M17 16v-7" /></>,
    org: <><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M12 12H6v4M12 12h6v4" /></>,
    support: <><circle cx="12" cy="12" r="9" /><path d="M12 8v4l2.5 2.5" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></>,
    doc: <><path d="M7 3h7l4 4v14H7z" /><path d="M14 3v4h4M10 12h5M10 16h5" /></>,
    radar: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4.5" /><path d="M12 3v4.5M12 12l6 -3" /></>,
    chat: <><path d="M4 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H9l-5 4z" /></>,
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}
