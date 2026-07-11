import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Nav, Footer, HeroWave, RadarWheel, Icon } from '../components/Chrome.jsx'
import { supabase } from '../lib/supabase.js'

const SERVICES = [
  { icon: 'compass', title: 'Strategic Consulting', text: 'Strategy formulation and governance aligned with the EFQM Model — clear direction, priorities and objectives that the whole organisation can execute.' },
  { icon: 'scan', title: 'EFQM Model Assessment', text: 'Full external and self-assessments against the EFQM Model 2025 to identify strengths, improvement areas and a verified maturity score.' },
  { icon: 'academy', title: 'Workshops & Training', text: 'Interactive workshops and certified training that equip leaders and teams to apply the EFQM Model and RADAR logic in daily management.' },
  { icon: 'chart', title: 'Performance Improvement', text: 'Prioritised improvement plans built from assessment evidence, with measurable targets and follow-up to drive results that last.' },
  { icon: 'org', title: 'Organisational Development', text: 'Aligning structures, processes and culture with strategic goals — from operating model design to transformation roadmaps.' },
  { icon: 'support', title: 'Coaching & Support', text: 'Ongoing coaching for management teams implementing EFQM principles, from first diagnosis to international recognition.' },
]

const RADAR_STEPS = [
  { k: 'R', title: 'Results', text: 'Define the results the organisation aims to achieve as part of its strategy.' },
  { k: 'A', title: 'Approaches', text: 'Plan and develop sound, integrated approaches to deliver those results.' },
  { k: 'D', title: 'Deploy', text: 'Deploy the approaches systematically across the organisation.' },
  { k: 'AR', title: 'Assess & Refine', text: 'Assess and refine approaches through monitoring, learning and improvement.' },
]

const MILESTONES = [
  { dot: '✓', title: 'Diagnosis', text: 'Baseline self-assessment against the seven criteria of the EFQM Model 2025.' },
  { dot: '1★', title: 'Committed', text: 'Verified 200+ score — EFQM Recognition, first star on the journey.' },
  { dot: '3★', title: 'Advancing', text: 'Consolidated management system with sustained results above 300 points.' },
  { dot: '4★', title: 'Recognised', text: 'Verified 400+ score — an organisation among the region\u2019s reference performers.' },
]

export default function Home() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <div id="top">
      <Nav />

      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Dubai · Americas · Europe · MENA</span>
            <h1 className="display">
              Fostering <strong>strategy</strong> through the <strong>EFQM Model</strong>
            </h1>
            <p className="lead">
              We help organisations achieve sustainable excellence — from first
              diagnosis to international EFQM recognition — with certified
              assessors and two decades of assessment experience.
            </p>
            <div className="hero-actions">
              <a href="#contact" className="btn btn-primary">Start your assessment</a>
              <a href="#services" className="btn btn-ghost">Explore services</a>
            </div>
          </div>
          <div className="hero-visual">
            <img src="/brand/spiral.png" alt="EFQM and Strategy Assessors spiral emblem" />
          </div>
        </div>
        <HeroWave />
      </section>

      {/* STATS */}
      <section className="stats">
        <div className="wrap stats-grid">
          {[
            ['20', '+', 'years with the EFQM Model'],
            ['250', '+', 'external assessments'],
            ['300', '+', 'excellence & strategy projects'],
            ['3', '', 'regions served worldwide'],
          ].map(([n, plus, label]) => (
            <div className="stat reveal" key={label}>
              <b>{n}<em>{plus}</em></b>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="wrap about-grid">
          <div className="reveal">
            <span className="eyebrow">About us</span>
            <h2 className="section-title" style={{ margin: '16px 0 20px' }}>
              Excellence is a <strong>discipline</strong>, not a destination
            </h2>
            <p className="lead" style={{ color: 'var(--muted)' }}>
              EFQM and Strategy Assessors FZCO specialises in consultancy
              services based on the EFQM Model. Our goal is to help
              organisations achieve sustainable excellence through strategic
              insight, tailored solutions and a commitment to continuous
              improvement.
            </p>
            <ul className="about-list">
              <li>Certified EFQM assessors with international recognition experience since 2004.</li>
              <li>UAE delivery entity of the TuConsultor Group — two decades of consultancy across quality, strategy, ESG and organisation.</li>
              <li>Based in Dubai Silicon Oasis, serving clients across the Americas, Europe and MENA.</li>
            </ul>
          </div>
          <div className="about-card reveal">
            <img src="/brand/seal.png" alt="EFQM and Strategy Assessors FZCO seal — Trade License 59735" />
            <p style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--muted)' }}>
              EFQM and Strategy Assessors FZCO · Dubai Silicon Oasis · Trade License 59735
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section alt" id="services">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Our services</span>
            <h2 className="section-title">Everything your journey to <strong>recognition</strong> needs</h2>
            <p>Six integrated practice areas, one method — the EFQM Model 2025 and its RADAR logic.</p>
          </div>
          <div className="services-grid">
            {SERVICES.map((s) => (
              <article className="service reveal" key={s.title}>
                <div className="glyph"><Icon name={s.icon} /></div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* METHOD / RADAR */}
      <section className="section method" id="method">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow" style={{ color: 'var(--glow)' }}>How we work</span>
            <h2 className="section-title">The <strong>RADAR</strong> logic, applied with rigour</h2>
            <p>Every engagement follows the assessment logic at the heart of the EFQM Model — so improvement is systematic, evidenced and repeatable.</p>
          </div>
          <div className="method-grid">
            <RadarWheel />
            <ol className="radar-steps">
              {RADAR_STEPS.map((s) => (
                <li className="radar-step reveal" key={s.k}>
                  <span className="k">{s.k}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* RECOGNITION PATH */}
      <section className="section path" id="recognition">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Recognition journey</span>
            <h2 className="section-title">From diagnosis to <strong>EFQM stars</strong></h2>
            <p>A staged path with verified milestones — each score opens the door to the next level of international recognition.</p>
          </div>
          <div className="path-track">
            {MILESTONES.map((m) => (
              <div className="milestone reveal" key={m.title}>
                <div className="dot">{m.dot}</div>
                <h3>{m.title}</h3>
                <p>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="section alt" id="team">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">Core team</span>
            <h2 className="section-title">Assessors who have <strong>seen excellence</strong> up close</h2>
          </div>
          <div className="team-grid">
            <article className="person reveal">
              <span className="role">Engagement Director · Lead Assessor</span>
              <h3>Alejandro San Nicolás Medina</h3>
              <p>
                Senior consultant and EFQM Certified Assessor with 20+ years
                working with the EFQM Model, 250+ external assessments and
                300+ excellence and strategy projects. PhD in Economics with an
                EFQM-based research methodology; university lecturer on the
                EFQM Model.
              </p>
              <div className="creds">
                <span>EFQM Certified Assessor</span>
                <span>Senior Assessor since 2009</span>
                <span>PhD in Economics</span>
              </div>
            </article>
            <article className="person reveal">
              <span className="role">Project Manager · Co-Assessor</span>
              <h3>Rosa García Sánchez</h3>
              <p>
                EFQM Assessor (International Certification, 2024) with a
                background in organisational development, corporate culture,
                learning &amp; development, change management and strategic
                communication. PhD in Contemporary History, Outstanding
                Cum Laude.
              </p>
              <div className="creds">
                <span>EFQM Assessor 2024</span>
                <span>Change management</span>
                <span>PhD, Cum Laude</span>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* CLIENT ZONE TEASER */}
      <section className="section">
        <div className="wrap">
          <div className="zone reveal">
            <div>
              <h2>Your engagement, <strong>one secure place</strong></h2>
              <p>
                The client zone gives every engagement a private workspace —
                assessment documents, RADAR scores and direct contact with your
                assessor team.
              </p>
              <Link to="/login" className="btn btn-primary">Enter the client zone</Link>
            </div>
            <ul className="zone-features">
              {[
                'Assessment reports and deliverables',
                'RADAR scoring and progress tracking',
                'Secure messaging with your assessors',
                'Training materials and workshop resources',
              ].map((f) => (
                <li key={f}><Icon name="check" />{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <ContactSection />

      <Footer />
    </div>
  )
}

function ContactSection() {
  const [status, setStatus] = useState(null)
  const [sending, setSending] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.target
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      organisation: form.organisation.value.trim(),
      message: form.message.value.trim(),
    }
    if (!payload.name || !payload.email || !payload.message) {
      setStatus({ ok: false, msg: 'Please complete name, email and message.' })
      return
    }
    if (!supabase) {
      // Fallback while Supabase is not configured: open the mail client.
      window.location.href = `mailto:hello@efqmassessors.ae?subject=${encodeURIComponent(
        'Inquiry from ' + payload.name
      )}&body=${encodeURIComponent(payload.message + '\n\n' + payload.organisation)}`
      return
    }
    setSending(true)
    const { error } = await supabase.from('inquiries').insert(payload)
    setSending(false)
    if (error) {
      setStatus({ ok: false, msg: 'Something went wrong sending your inquiry. Please email hello@efqmassessors.ae.' })
    } else {
      form.reset()
      setStatus({ ok: true, msg: 'Inquiry sent. We will reply within one business day.' })
    }
  }

  return (
    <section className="section alt" id="contact">
      <div className="wrap contact-grid">
        <div className="reveal">
          <span className="eyebrow">Contact</span>
          <h2 className="section-title" style={{ margin: '16px 0 10px' }}>
            Start the <strong>conversation</strong>
          </h2>
          <div className="contact-item">
            <span>Office</span>
            <p>Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE</p>
          </div>
          <div className="contact-item">
            <span>Phone</span>
            <a href="tel:+971507369400">+971 50 736 9400</a>
          </div>
          <div className="contact-item">
            <span>Email</span>
            <a href="mailto:hello@efqmassessors.ae">hello@efqmassessors.ae</a>
          </div>
        </div>
        <form className="form-card reveal" onSubmit={onSubmit} noValidate>
          <div className="field">
            <label htmlFor="c-name">Name</label>
            <input id="c-name" name="name" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="c-email">Email</label>
            <input id="c-email" name="email" type="email" autoComplete="email" required />
          </div>
          <div className="field">
            <label htmlFor="c-org">Organisation</label>
            <input id="c-org" name="organisation" autoComplete="organization" />
          </div>
          <div className="field">
            <label htmlFor="c-msg">How can we help?</label>
            <textarea id="c-msg" name="message" rows="4" required />
          </div>
          <button className="btn btn-primary" type="submit" disabled={sending}>
            {sending ? 'Sending…' : 'Send inquiry'}
          </button>
          {status && (
            <p className={`form-status ${status.ok ? 'ok' : 'err'}`} role="status">{status.msg}</p>
          )}
          <p className="form-note">
            By sending this form you agree to our privacy policy. We only use
            your details to respond to your inquiry.
          </p>
        </form>
      </div>
    </section>
  )
}
