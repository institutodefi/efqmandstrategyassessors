import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import { PORTAL_STRINGS } from '../data/orbitalPortal.js'

/**
 * O360 Assessment Tool — client flow (phase A).
 *   /portal/assessment            → list + create
 *   /portal/assessment/:id        → overview (scope, entities, sites, score)
 *   /portal/assessment/:id/quiz   → questionnaire (autosave, evidence, progress)
 */
export default function Assessment() {
  const { id, view } = useParams()
  if (!id) return <AssessmentList />
  if (id === 'design') return <ModelDesigner />
  if (view === 'quiz') return <Questionnaire assessmentId={id} />
  return <AssessmentDetail assessmentId={id} />
}

const useS = () => {
  const { lang } = useLang()
  return [PORTAL_STRINGS[lang] || PORTAL_STRINGS.en, lang]
}
const L = (row, base, lang) => (lang === 'ar' ? row[`${base}_ar`] : row[`${base}_en`]) || row[`${base}_en`]

function useIsAssessor(assessmentId) {
  const { user, role } = useAuth()
  const [assigned, setAssigned] = useState(false)
  useEffect(() => {
    if (!supabase || !user || !assessmentId) return
    supabase.from('assessment_assignments')
      .select('consultant_id').eq('assessment_id', assessmentId)
      .eq('consultant_id', user.id).maybeSingle()
      .then(({ data }) => setAssigned(!!data))
  }, [user, assessmentId])
  return ['superadmin', 'admin'].includes(role) || assigned
}

/* ============================= LIST ============================= */
function AssessmentList() {
  const { user, role } = useAuth()
  const [s] = useS()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [companies, setCompanies] = useState([])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!supabase || !user) return
    supabase.from('assessments')
      .select('id, title, status, company_id, created_at, updated_at')
      .order('updated_at', { ascending: false })
      .then(({ data }) => setRows(data ?? []))
    supabase.rpc('my_assessment_companies').then(async ({ data }) => {
      const ids = (data ?? []).map(r => r.my_assessment_companies ?? r)
      if (!ids.length) { setCompanies([]); return }
      const { data: accs } = await supabase.from('accounts')
        .select('id, name').in('id', ids).order('name')
      setCompanies(accs ?? [])
    })
  }, [user])

  async function create(e) {
    e.preventDefault()
    const f = e.target
    setBusy(true); setStatus(null)
    const { data, error } = await supabase.from('assessments').insert({
      title: f.title.value.trim(),
      company_id: f.company.value,
      created_by: user.id,
    }).select().single()
    setBusy(false)
    if (error) {
      let msg = error.message
      if (/row-level security/i.test(msg)) {
        const { data: dbg } = await supabase.rpc('debug_assessment_access',
          { p_company: f.company.value })
        const d = dbg?.[0]
        if (d) msg += ` — role: ${d.my_role} · subscription active: ${d.has_active_subscription} · your grant: ${d.my_grant}`
      }
      setStatus({ ok: false, msg })
    } else {
      await supabase.from('assessment_scope').insert({ assessment_id: data.id })
      navigate(`/portal/assessment/${data.id}`)
    }
  }

  return (
    <PmShell>
      <h1>{s.asTitle}</h1>
      <p className="sub">{s.asList}</p>
      {['superadmin', 'admin'].includes(role) && (
        <div className="pm-actions">
          <button className="btn btn-ghost btn-xs"
                  onClick={() => navigate('/portal/assessment/design')}>
            {s.asDesign}
          </button>
        </div>
      )}
      {status && <p className="form-status err">{status.msg}</p>}

      <div className="portal-panels">
        {companies.length > 0 && (
          <section className="portal-card wide2">
            <h3>{s.asNew}</h3>
            <form className="cp-inline" onSubmit={create}>
              <input name="title" placeholder={s.asNewTitle} required style={{ flex: 2 }} />
              <select name="company" required>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button className="btn btn-primary btn-xs" disabled={busy} type="submit">{s.asCreate}</button>
            </form>
          </section>
        )}

        <section className="portal-card wide2">
          {rows.length === 0 ? <p>{s.asNone}</p> : (
            <ul className="proj-list">
              {rows.map(a => (
                <li key={a.id}>
                  <div className="proj-top">
                    <b>{a.title}</b>
                    <span className="pm-actions">
                      <span className={`pill pill-${a.status === 'in_progress' ? 'in_progress' : a.status === 'submitted' ? 'review' : a.status === 'assessed' ? 'delivered' : 'archived'}`}>
                        {s.asStatus[a.status]}
                      </span>
                      <button className="btn btn-ghost btn-xs"
                              onClick={() => navigate(`/portal/assessment/${a.id}`)}>{s.asOpen}</button>
                    </span>
                  </div>
                  <div className="proj-meta">{new Date(a.updated_at).toLocaleDateString('en-GB')}</div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </PmShell>
  )
}

/* ============================= DETAIL ============================= */
function AssessmentDetail({ assessmentId }) {
  const { user, role } = useAuth()
  const isAssessor = useIsAssessor(assessmentId)
  const isAdmin = ['superadmin', 'admin'].includes(role)
  const [s, lang] = useS()
  const navigate = useNavigate()
  const [a, setA] = useState(null)
  const [scope, setScope] = useState('')
  const [entities, setEntities] = useState([])
  const [sites, setSites] = useState([])
  const [scores, setScores] = useState({ perCrit: [], total: null, audTotal: null, answered: 0, totalQ: 0 })
  const [criteria, setCriteria] = useState([])
  const [saveState, setSaveState] = useState(null)
  const scopeTimer = useRef(null)

  const load = useCallback(async () => {
    if (!supabase) return
    const [{ data: av }, { data: sc }, { data: en }, { data: cr }] = await Promise.all([
      supabase.from('assessments').select('*').eq('id', assessmentId).maybeSingle(),
      supabase.from('assessment_scope').select('*').eq('assessment_id', assessmentId).maybeSingle(),
      supabase.from('assessment_entities').select('*').eq('assessment_id', assessmentId).order('created_at'),
      supabase.from('assessment_criteria').select('*').order('num'),
    ])
    setA(av); setScope(sc?.scope || ''); setEntities(en ?? []); setCriteria(cr ?? [])
    if (en?.length) {
      const { data: st } = await supabase.from('assessment_sites')
        .select('*').in('entity_id', en.map(x => x.id)).order('created_at')
      setSites(st ?? [])
    } else setSites([])
    // scores (client + auditor)
    const [{ data: ans }, { data: aud }, { data: qs }] = await Promise.all([
      supabase.from('assessment_answers').select('question_code, level').eq('assessment_id', assessmentId),
      supabase.from('assessment_auditor_scores').select('question_code, level').eq('assessment_id', assessmentId),
      supabase.from('assessment_questions').select('code, criterion_code'),
    ])
    const byCrit = {}
    for (const q of qs ?? []) (byCrit[q.criterion_code] ??= { c: [], a: [], total: 0 }).total++
    const critOf = Object.fromEntries((qs ?? []).map(q => [q.code, q.criterion_code]))
    for (const an of ans ?? []) {
      if (an.level != null && critOf[an.question_code]) byCrit[critOf[an.question_code]].c.push(an.level * 20)
    }
    for (const an of aud ?? []) {
      if (an.level != null && critOf[an.question_code]) byCrit[critOf[an.question_code]].a.push(an.level * 20)
    }
    const avg = (xs) => xs.length ? Math.round(xs.reduce((x, y) => x + y, 0) / xs.length) : null
    const perCrit = (cr ?? []).map(c => {
      const b = byCrit[c.code] || { c: [], a: [], total: 0 }
      return { code: c.code, num: c.num,
               avg: avg(b.c), audAvg: avg(b.a),
               answered: b.c.length, total: b.total }
    })
    const wc = perCrit.filter(c => c.avg != null)
    const wa = perCrit.filter(c => c.audAvg != null)
    setScores({
      perCrit,
      total: wc.length ? Math.round(wc.reduce((x, c) => x + c.avg, 0) / wc.length) : null,
      audTotal: wa.length ? Math.round(wa.reduce((x, c) => x + c.audAvg, 0) / wa.length) : null,
      answered: (ans ?? []).filter(x => x.level != null).length,
      totalQ: (qs ?? []).length,
    })
  }, [assessmentId])

  useEffect(() => { load() }, [load])

  function saveScope(v) {
    setScope(v); setSaveState(s.asSaving)
    clearTimeout(scopeTimer.current)
    scopeTimer.current = setTimeout(async () => {
      await supabase.from('assessment_scope')
        .upsert({ assessment_id: assessmentId, scope: v })
      setSaveState(s.asSaved)
    }, 700)
  }

  async function addEntity(e) {
    e.preventDefault()
    const f = e.target
    await supabase.from('assessment_entities').insert({
      assessment_id: assessmentId,
      legal_name: f.legal.value.trim(), vat: f.vat.value.trim() || null,
    })
    f.reset(); load()
  }
  async function addSite(entityId, e) {
    e.preventDefault()
    const f = e.target
    await supabase.from('assessment_sites').insert({
      entity_id: entityId, name: f.sname.value.trim(),
      address: f.addr.value.trim() || null,
      workers: f.workers.value ? Number(f.workers.value) : null,
    })
    f.reset(); load()
  }
  const del = (table) => async (rid) => {
    await supabase.from(table).delete().eq('id', rid); load()
  }

  async function submit() {
    if (!window.confirm(s.asSubmitConfirm)) return
    await supabase.from('assessments').update({ status: 'submitted' }).eq('id', assessmentId)
    load()
  }

  if (!a) return <PmShell><p className="sub">…</p></PmShell>
  const critName = (c) => L(criteria.find(x => x.code === c) || {}, 'title', lang) || c

  return (
    <PmShell>
      <button className="btn btn-ghost btn-xs" onClick={() => navigate('/portal/assessment')}>← {s.asBack}</button>
      <h1>{a.title}</h1>
      <p className="sub">
        <span className={`pill pill-${a.status === 'in_progress' ? 'in_progress' : 'review'}`}>{s.asStatus[a.status]}</span>
        {'  '}· {s.asProgress}: {scores.answered}/{scores.totalQ} {s.asAnswered}
        {saveState && <em> · {saveState}</em>}
      </p>
      <div className="pm-actions">
        <button className="btn btn-primary btn-xs"
                onClick={() => navigate(`/portal/assessment/${assessmentId}/quiz`)}>
          {s.asQuestionnaire} →
        </button>
        {a.status === 'in_progress' && (
          <button className="btn btn-ghost btn-xs" onClick={submit}>{s.asSubmit}</button>
        )}
      </div>

      <div className="portal-panels">
        {/* score */}
        <section className="portal-card wide2">
          <h3>{s.asScore}</h3>
          <p className="as-legend">
            <span className="as-leg-client">■ {s.asClientScore}{scores.total != null && ` · ${scores.total}`}</span>
            <span className="as-leg-auditor">■ {s.asAuditorScore}{scores.audTotal != null && ` · ${scores.audTotal}`}</span>
          </p>
          <div className="as-scores">
            {scores.perCrit.map(c => (
              <div key={c.code} className="as-score-item as-dual">
                <span className="as-score-label">C{c.num} · {critName(c.code)}</span>
                <span className="as-bars">
                  <span className="proj-bar"><span style={{ width: `${c.avg ?? 0}%` }} /></span>
                  <span className="proj-bar bar-auditor"><span style={{ width: `${c.audAvg ?? 0}%` }} /></span>
                </span>
                <span className="as-score-num">{c.avg ?? '—'} / <b>{c.audAvg ?? '—'}</b></span>
              </div>
            ))}
          </div>
        </section>

        {/* assessor tools */}
        {isAssessor && (
          <AssessorTools
            assessmentId={assessmentId} a={a} criteria={criteria}
            isAdmin={isAdmin} s={s} lang={lang} onChanged={load}
          />
        )}

        {/* scope */}
        <section className="portal-card wide2">
          <h3>{s.asScope}</h3>
          <textarea className="as-scope" rows="3" value={scope}
                    placeholder={s.asScopePh}
                    onChange={(e) => saveScope(e.target.value)} />
        </section>

        {/* entities + sites */}
        <section className="portal-card wide2">
          <h3>{s.asEntities}</h3>
          {entities.map(en => (
            <div key={en.id} className="cp-item">
              <div className="cp-head">
                <div><b>{en.legal_name}</b>
                  <span className="proj-meta"> · {s.asVat}: {en.vat || '—'}</span></div>
                <button className="btn btn-ghost btn-xs" onClick={() => del('assessment_entities')(en.id)}>
                  {s.asRemove}
                </button>
              </div>
              <div className="cp-detail">
                <h4 className="cp-h4">{s.asSites}</h4>
                {sites.filter(x => x.entity_id === en.id).map(st => (
                  <div key={st.id} className="proj-top">
                    <span>{st.name}{st.address && <span className="proj-meta"> · {st.address}</span>}
                      {st.workers != null && <span className="proj-meta"> · {s.asWorkers}: {st.workers}</span>}</span>
                    <button className="btn btn-ghost btn-xs" onClick={() => del('assessment_sites')(st.id)}>✕</button>
                  </div>
                ))}
                <form className="cp-inline" onSubmit={(e) => addSite(en.id, e)}>
                  <input name="sname" placeholder={s.asSiteName} required />
                  <input name="addr" placeholder={s.asAddress} />
                  <input name="workers" type="number" min="0" placeholder={s.asWorkers} style={{ maxWidth: 110 }} />
                  <button className="btn btn-primary btn-xs" type="submit">{s.asAddSite}</button>
                </form>
              </div>
            </div>
          ))}
          <form className="cp-inline" onSubmit={addEntity} style={{ marginTop: 12 }}>
            <input name="legal" placeholder={s.asEntityName} required style={{ flex: 2 }} />
            <input name="vat" placeholder={s.asVat} />
            <button className="btn btn-primary btn-xs" type="submit">{s.asAddEntity}</button>
          </form>
        </section>
      </div>
    </PmShell>
  )
}

/* ============================= QUESTIONNAIRE ============================= */
function Questionnaire({ assessmentId }) {
  const { user } = useAuth()
  const isAssessor = useIsAssessor(assessmentId)
  const [s, lang] = useS()
  const navigate = useNavigate()
  const [criteria, setCriteria] = useState([])
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})     // code → {level, justification}
  const [docs, setDocs] = useState([])
  const [audScores, setAudScores] = useState({})
  const [findings, setFindings] = useState([])
  const [crit, setCrit] = useState(null)
  const [saveState, setSaveState] = useState(null)
  const timers = useRef({})

  useEffect(() => {
    if (!supabase) return
    Promise.all([
      supabase.from('assessment_criteria').select('*').order('num'),
      supabase.from('assessment_questions').select('*').order('sort'),
      supabase.from('assessment_answers').select('*').eq('assessment_id', assessmentId),
      supabase.from('assessment_documents').select('*').eq('assessment_id', assessmentId),
      supabase.from('assessment_auditor_scores').select('*').eq('assessment_id', assessmentId),
      supabase.from('assessment_findings').select('*').eq('assessment_id', assessmentId).order('created_at'),
    ]).then(([c, q, a, d, au, fi]) => {
      setCriteria(c.data ?? [])
      setQuestions(q.data ?? [])
      setAnswers(Object.fromEntries((a.data ?? []).map(x => [x.question_code, x])))
      setDocs(d.data ?? [])
      setAudScores(Object.fromEntries((au.data ?? []).map(x => [x.question_code, x])))
      setFindings(fi.data ?? [])
      if (c.data?.length) setCrit(prev => prev ?? c.data[0].code)
    })
  }, [assessmentId])

  const critQs = useMemo(
    () => questions.filter(q => q.criterion_code === crit), [questions, crit])
  const answered = Object.values(answers).filter(a => a.level != null).length

  function persist(code, patch, debounce = 0) {
    setAnswers(prev => ({ ...prev, [code]: { ...prev[code], question_code: code, ...patch } }))
    setSaveState(s.asSaving)
    clearTimeout(timers.current[code])
    timers.current[code] = setTimeout(async () => {
      const cur = { ...(answers[code] || {}), ...patch }
      await supabase.from('assessment_answers').upsert({
        assessment_id: assessmentId,
        question_code: code,
        level: cur.level ?? null,
        justification: cur.justification ?? null,
        updated_by: user.id,
      })
      setSaveState(s.asSaved)
    }, debounce)
  }

  async function upload(code, e) {
    const file = e.target.files?.[0]
    if (!file) return
    setSaveState(s.asSaving)
    const path = `${assessmentId}/${code.replaceAll(' ', '_')}/${Date.now()}-${file.name}`
    const { error } = await supabase.storage.from('assessment-evidence').upload(path, file)
    if (!error) {
      const { data } = await supabase.from('assessment_documents').insert({
        assessment_id: assessmentId, question_code: code,
        filename: file.name, storage_path: path, size_bytes: file.size,
        uploaded_by: user.id,
      }).select().single()
      if (data) setDocs(prev => [...prev, data])
      setSaveState(s.asSaved)
    } else setSaveState(error.message)
    e.target.value = ''
  }

  async function download(doc) {
    const { data } = await supabase.storage.from('assessment-evidence')
      .createSignedUrl(doc.storage_path, 300)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  async function removeDoc(doc) {
    await supabase.storage.from('assessment-evidence').remove([doc.storage_path])
    await supabase.from('assessment_documents').delete().eq('id', doc.id)
    setDocs(prev => prev.filter(d => d.id !== doc.id))
  }

  function persistAud(code, patch, debounce = 0) {
    setAudScores(prev => ({ ...prev, [code]: { ...prev[code], question_code: code, ...patch } }))
    setSaveState(s.asSaving)
    clearTimeout(timers.current['aud' + code])
    timers.current['aud' + code] = setTimeout(async () => {
      const cur = { ...(audScores[code] || {}), ...patch }
      await supabase.from('assessment_auditor_scores').upsert({
        assessment_id: assessmentId, question_code: code,
        level: cur.level ?? null, note: cur.note ?? null, auditor_id: user.id,
      })
      setSaveState(s.asSaved)
    }, debounce)
  }

  async function addFinding(code, type, e) {
    e.preventDefault()
    const f = e.target
    const body = f.body.value.trim()
    if (!body) return
    const { data, error } = await supabase.from('assessment_findings').insert({
      assessment_id: assessmentId, question_code: code, type, body, created_by: user.id,
    }).select().single()
    if (!error && data) { setFindings(prev => [...prev, data]); f.reset() }
  }

  async function removeFinding(id) {
    await supabase.from('assessment_findings').delete().eq('id', id)
    setFindings(prev => prev.filter(x => x.id !== id))
  }

  const pct = questions.length ? Math.round((answered / questions.length) * 100) : 0

  return (
    <PmShell>
      <button className="btn btn-ghost btn-xs"
              onClick={() => navigate(`/portal/assessment/${assessmentId}`)}>← {s.asOverview}</button>
      <h1>{s.asQuestionnaire}</h1>
      <p className="sub">
        {s.asProgress}: {answered}/{questions.length} {s.asAnswered}
        {saveState && <em> · {saveState}</em>}
      </p>
      <div className="proj-bar as-progress"><span style={{ width: `${pct}%` }} /></div>

      <div className="tab-row as-crit-tabs" role="tablist">
        {criteria.map(c => (
          <button key={c.code} role="tab" aria-selected={crit === c.code}
                  className={`tab-btn ${crit === c.code ? 'on' : ''}`}
                  onClick={() => setCrit(c.code)}>
            C{c.num}
          </button>
        ))}
      </div>
      {crit && <h2 className="as-crit-title">{L(criteria.find(c => c.code === crit) || {}, 'title_full', lang)}</h2>}

      {critQs.map(q => {
        const an = answers[q.code] || {}
        const qDocs = docs.filter(d => d.question_code === q.code)
        return (
          <section key={q.code} className="portal-card wide2 as-q">
            <h3>{q.code} · {L(q, 'question', lang)}</h3>
            <p className="as-block">{L(q, 'block', lang)}</p>
            {L(q, 'context', lang) && (
              <p className="as-ctx"><b>{s.asContext}:</b> {L(q, 'context', lang)}</p>
            )}

            <p className="as-level-lbl">{s.asLevel}</p>
            <div className="as-levels" role="radiogroup">
              {(lang === 'ar' ? q.levels_ar : q.levels_en).map((lvl, i) => (
                <label key={i} className={`as-level ${an.level === i ? 'on' : ''}`}>
                  <input type="radio" name={`lvl-${q.code}`} checked={an.level === i}
                         onChange={() => persist(q.code, { level: i })} />
                  <span className="as-level-score">{i * 20}</span>
                  <span className="as-level-txt">{lvl}</span>
                </label>
              ))}
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>{s.asJustification}</label>
              <textarea rows="3" value={an.justification || ''}
                        placeholder={s.asJustPh}
                        onChange={(e) => persist(q.code, { justification: e.target.value }, 800)} />
            </div>

            {L(q, 'evidence', lang) && (
              <details className="as-evid-hint">
                <summary>{s.asEvidenceHint}</summary>
                <pre>{L(q, 'evidence', lang)}</pre>
              </details>
            )}

            <div className="as-docs">
              <b>{s.asEvidence}</b>
              {qDocs.map(d => (
                <span key={d.id} className="as-doc">
                  <button className="btn btn-ghost btn-xs" onClick={() => download(d)}>{d.filename}</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => removeDoc(d)}>✕</button>
                </span>
              ))}
              <label className="btn btn-ghost btn-xs as-upload">
                {s.asUpload}
                <input type="file" hidden onChange={(e) => upload(q.code, e)} />
              </label>
            </div>

            {/* auditor score chip visible to everyone once it exists */}
            {!isAssessor && audScores[q.code]?.level != null && (
              <p className="as-aud-chip">
                {s.asAuditorScore}: <b>{audScores[q.code].level * 20}</b>
                {audScores[q.code].note && <span className="proj-meta"> · {audScores[q.code].note}</span>}
              </p>
            )}

            {/* auditor correction panel */}
            {isAssessor && (
              <div className="as-aud-panel">
                <h4 className="cp-h4">{s.asAuditorPanel}</h4>
                <p className="proj-meta">
                  {s.asClientAnswer}: <b>{an.level != null ? an.level * 20 : s.asNoAnswer}</b>
                </p>
                <div className="as-aud-levels" role="radiogroup" aria-label={s.asAuditorLevel}>
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <label key={i}
                           className={`as-aud-lvl ${audScores[q.code]?.level === i ? 'on' : ''}`}
                           title={(lang === 'ar' ? q.levels_ar : q.levels_en)[i]}>
                      <input type="radio" name={`aud-${q.code}`}
                             checked={audScores[q.code]?.level === i}
                             onChange={() => persistAud(q.code, { level: i })} />
                      {i * 20}
                    </label>
                  ))}
                </div>
                <div className="field">
                  <label>{s.asAuditorNote}</label>
                  <textarea rows="2" value={audScores[q.code]?.note || ''}
                            placeholder={s.asAuditorNotePh}
                            onChange={(e) => persistAud(q.code, { note: e.target.value }, 800)} />
                </div>

                <h4 className="cp-h4">{s.asFindings}</h4>
                <ul className="as-findings">
                  {findings.filter(x => x.question_code === q.code).map(x => (
                    <li key={x.id} className={x.type}>
                      <span className="as-find-tag">
                        {x.type === 'strength' ? s.asStrength : s.asImprovement}
                      </span>
                      <span className="as-find-body">{x.body}</span>
                      <button className="btn btn-ghost btn-xs"
                              onClick={() => removeFinding(x.id)}>✕</button>
                    </li>
                  ))}
                </ul>
                <div className="as-find-forms">
                  <form className="cp-inline" onSubmit={(e) => addFinding(q.code, 'strength', e)}>
                    <input name="body" placeholder={`${s.asStrength}…`} />
                    <button className="btn btn-primary btn-xs" type="submit">{s.asAddFinding}</button>
                  </form>
                  <form className="cp-inline" onSubmit={(e) => addFinding(q.code, 'improvement', e)}>
                    <input name="body" placeholder={`${s.asImprovement}…`} />
                    <button className="btn btn-primary btn-xs" type="submit">{s.asAddFinding}</button>
                  </form>
                </div>
              </div>
            )}
          </section>
        )
      })}
    </PmShell>
  )
}


/* ============================= MODEL DESIGNER (superadmin/admin) ============================= */
function ModelDesigner() {
  const [s, lang] = useS()
  const navigate = useNavigate()
  const [criteria, setCriteria] = useState([])
  const [questions, setQuestions] = useState([])
  const [crit, setCrit] = useState(null)
  const [openQ, setOpenQ] = useState(null)
  const [state, setState] = useState(null)

  async function load() {
    const [c, q] = await Promise.all([
      supabase.from('assessment_criteria').select('*').order('num'),
      supabase.from('assessment_questions').select('*').order('sort'),
    ])
    setCriteria(c.data ?? []); setQuestions(q.data ?? [])
    if (c.data?.length) setCrit(prev => prev ?? c.data[0].code)
  }
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function saveQ(q, e) {
    e.preventDefault()
    const f = e.target
    const lvEn = f.levels_en.value.split('\n').map(x => x.trim()).filter(Boolean)
    const lvAr = f.levels_ar.value.split('\n').map(x => x.trim()).filter(Boolean)
    if (lvEn.length !== 6 || lvAr.length !== 6) {
      setState({ ok: false, msg: s.asLevels6 }); return
    }
    const { error } = await supabase.from('assessment_questions').update({
      question_en: f.question_en.value.trim(),
      question_ar: f.question_ar.value.trim(),
      block_en: f.block_en.value.trim(),
      block_ar: f.block_ar.value.trim(),
      context_en: f.context_en.value.trim() || null,
      context_ar: f.context_ar.value.trim() || null,
      evidence_en: f.evidence_en.value.trim() || null,
      evidence_ar: f.evidence_ar.value.trim() || null,
      levels_en: lvEn,
      levels_ar: lvAr,
    }).eq('code', q.code)
    setState(error ? { ok: false, msg: error.message } : { ok: true, msg: s.accSaved })
    if (!error) load()
  }

  const critQs = questions.filter(q => q.criterion_code === crit)

  return (
    <PmShell>
      <button className="btn btn-ghost btn-xs"
              onClick={() => navigate('/portal/assessment')}>← {s.asBack}</button>
      <h1>{s.asDesign}</h1>
      <p className="sub">{s.asDesignSub}</p>
      {state && <p className={`form-status ${state.ok ? 'ok' : 'err'}`} role="status">{state.msg}</p>}

      <div className="tab-row as-crit-tabs" role="tablist">
        {criteria.map(c => (
          <button key={c.code} role="tab" aria-selected={crit === c.code}
                  className={`tab-btn ${crit === c.code ? 'on' : ''}`}
                  onClick={() => { setCrit(c.code); setOpenQ(null) }}>
            C{c.num}
          </button>
        ))}
      </div>
      {crit && <h2 className="as-crit-title">{L(criteria.find(c => c.code === crit) || {}, 'title_full', lang)}</h2>}

      {critQs.length === 0 && <p className="sub">—</p>}
      {critQs.map(q => (
        <section key={q.code} className="portal-card wide2 as-q">
          <div className="cp-head">
            <h3>{q.code} · {L(q, 'question', lang)}</h3>
            <button className="btn btn-ghost btn-xs"
                    onClick={() => setOpenQ(openQ === q.code ? null : q.code)}>
              {openQ === q.code ? '▴' : s.coEdit + ' ▾'}
            </button>
          </div>

          {openQ === q.code && (
            <form className="np-form" onSubmit={(e) => saveQ(q, e)}>
              <div className="np-row">
                <div className="field">
                  <label>Question (EN)</label>
                  <input name="question_en" defaultValue={q.question_en} required />
                </div>
                <div className="field">
                  <label>السؤال (AR)</label>
                  <input name="question_ar" defaultValue={q.question_ar} dir="rtl" required />
                </div>
              </div>
              <div className="np-row">
                <div className="field">
                  <label>Block (EN)</label>
                  <input name="block_en" defaultValue={q.block_en} required />
                </div>
                <div className="field">
                  <label>المحور (AR)</label>
                  <input name="block_ar" defaultValue={q.block_ar} dir="rtl" required />
                </div>
              </div>
              <div className="np-row">
                <div className="field">
                  <label>Context (EN)</label>
                  <textarea name="context_en" rows="2" defaultValue={q.context_en || ''} />
                </div>
                <div className="field">
                  <label>السياق (AR)</label>
                  <textarea name="context_ar" rows="2" defaultValue={q.context_ar || ''} dir="rtl" />
                </div>
              </div>
              <div className="np-row">
                <div className="field">
                  <label>Suggested evidence (EN)</label>
                  <textarea name="evidence_en" rows="4" defaultValue={q.evidence_en || ''} />
                </div>
                <div className="field">
                  <label>الأدلة المقترحة (AR)</label>
                  <textarea name="evidence_ar" rows="4" defaultValue={q.evidence_ar || ''} dir="rtl" />
                </div>
              </div>
              <p className="proj-meta">{s.asLevelsHint}</p>
              <div className="np-row">
                <div className="field">
                  <label>Levels (EN)</label>
                  <textarea name="levels_en" rows="7" defaultValue={(q.levels_en || []).join('\n')} required />
                </div>
                <div className="field">
                  <label>المستويات (AR)</label>
                  <textarea name="levels_ar" rows="7" defaultValue={(q.levels_ar || []).join('\n')} dir="rtl" required />
                </div>
              </div>
              <button className="btn btn-primary btn-xs" type="submit">{s.asSave}</button>
            </form>
          )}
        </section>
      ))}
    </PmShell>
  )
}


/* ================= ASSESSOR TOOLS: status · assignments · reviews ================= */
function AssessorTools({ assessmentId, a, criteria, isAdmin, s, lang, onChanged }) {
  const [consultants, setConsultants] = useState([])
  const [assigned, setAssigned] = useState([])
  const [reviews, setReviews] = useState({})     // criterion_code → row
  const [busy, setBusy] = useState(false)
  const [saveState, setSaveState] = useState(null)
  const timers = useRef({})

  async function load() {
    const [{ data: asg }, { data: rev }] = await Promise.all([
      supabase.from('assessment_assignments')
        .select('consultant_id').eq('assessment_id', assessmentId),
      supabase.from('assessment_criterion_reviews')
        .select('*').eq('assessment_id', assessmentId),
    ])
    setAssigned((asg ?? []).map(x => x.consultant_id))
    setReviews(Object.fromEntries((rev ?? []).map(r => [r.criterion_code, r])))
    if (isAdmin) {
      const { data: cons } = await supabase.from('profiles')
        .select('id, full_name, email').in('role', ['consultant', 'admin', 'superadmin'])
        .order('full_name')
      setConsultants(cons ?? [])
    }
  }
  useEffect(() => { load() }, [assessmentId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function setAssessStatus(v) {
    setBusy(true)
    await supabase.from('assessments').update({ status: v }).eq('id', assessmentId)
    setBusy(false); onChanged()
  }

  async function assign(e) {
    e.preventDefault()
    const uid = e.target.consultant.value
    if (!uid) return
    setBusy(true)
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('assessment_assignments')
      .upsert({ assessment_id: assessmentId, consultant_id: uid, assigned_by: user.id })
    setBusy(false); e.target.reset(); load()
  }

  async function unassign(uid) {
    setBusy(true)
    await supabase.from('assessment_assignments')
      .delete().eq('assessment_id', assessmentId).eq('consultant_id', uid)
    setBusy(false); load()
  }

  function saveReview(code, field, value) {
    setReviews(prev => ({ ...prev, [code]: { ...prev[code], criterion_code: code, [field]: value } }))
    setSaveState(s.asSaving)
    clearTimeout(timers.current[code + field])
    timers.current[code + field] = setTimeout(async () => {
      const cur = { ...(reviews[code] || {}), [field]: value }
      await supabase.from('assessment_criterion_reviews').upsert({
        assessment_id: assessmentId, criterion_code: code,
        strengths: cur.strengths ?? null, improvements: cur.improvements ?? null,
      })
      setSaveState(s.asSaved)
    }, 800)
  }

  const consName = (id) =>
    consultants.find(c => c.id === id)?.full_name
    || consultants.find(c => c.id === id)?.email || id.slice(0, 8)

  return (
    <section className="portal-card wide2 as-assessor">
      <h3>{s.asAuditorPanel} {saveState && <em className="proj-meta">· {saveState}</em>}</h3>

      <div className="pm-actions">
        <label className="proj-meta">{s.asChangeStatus}:</label>
        <select value={a.status} disabled={busy}
                onChange={(e) => setAssessStatus(e.target.value)}>
          {Object.entries(s.asStatus).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {isAdmin && (
        <div className="as-assign">
          <h4 className="cp-h4">{s.asAssignments}</h4>
          {assigned.length === 0
            ? <p className="proj-meta">{s.asNoAssessors}</p>
            : assigned.map(uid => (
              <span key={uid} className="as-doc">
                <span className="role-badge">{consName(uid)}</span>
                <button className="btn btn-ghost btn-xs" disabled={busy}
                        onClick={() => unassign(uid)}>✕</button>
              </span>
            ))}
          <form className="cp-inline" onSubmit={assign}>
            <select name="consultant" required>
              <option value="">—</option>
              {consultants.filter(c => !assigned.includes(c.id)).map(c => (
                <option key={c.id} value={c.id}>{c.full_name || c.email}</option>
              ))}
            </select>
            <button className="btn btn-primary btn-xs" disabled={busy} type="submit">{s.asAssign}</button>
          </form>
        </div>
      )}

      <h4 className="cp-h4">{s.asReviews}</h4>
      {criteria.map(c => (
        <details key={c.code} className="as-review">
          <summary>C{c.num} · {L(c, 'title', lang)}</summary>
          <div className="np-row">
            <div className="field">
              <label>{s.asRevStrengths}</label>
              <textarea rows="3" value={reviews[c.code]?.strengths || ''}
                        onChange={(e) => saveReview(c.code, 'strengths', e.target.value)} />
            </div>
            <div className="field">
              <label>{s.asRevImprovements}</label>
              <textarea rows="3" value={reviews[c.code]?.improvements || ''}
                        onChange={(e) => saveReview(c.code, 'improvements', e.target.value)} />
            </div>
          </div>
        </details>
      ))}
    </section>
  )
}
