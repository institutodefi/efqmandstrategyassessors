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
const L = (row, base, lang) =>
  (lang === 'ar' ? row[`${base}_ar`]
   : lang === 'es' ? row[`${base}_es`]
   : row[`${base}_en`]) || row[`${base}_en`]
const LV = (q, lang) =>
  (lang === 'ar' ? q.levels_ar
   : lang === 'es' && Array.isArray(q.levels_es) && q.levels_es.length === 6 ? q.levels_es
   : q.levels_en) || q.levels_en

function useAssessCaps(assessmentId) {
  const { user, role } = useAuth()
  const isPlatformAdmin = ['superadmin', 'admin'].includes(role)
  const [caps, setCaps] = useState({
    can_view: true, can_edit_client: true, is_assessor: isPlatformAdmin,
    can_view_auditor: isPlatformAdmin, can_manage_members: isPlatformAdmin,
    product_role: null, design_permit: null,
  })
  useEffect(() => {
    if (!supabase || !user || !assessmentId) return
    supabase.rpc('assessment_capabilities', { aid: assessmentId })
      .then(({ data }) => { if (data?.[0]) setCaps(data[0]) })
      .catch(() => {})
  }, [user, assessmentId])
  return { ...caps, is_assessor: caps.is_assessor || isPlatformAdmin }
}
const useIsAssessor = (assessmentId) => useAssessCaps(assessmentId).is_assessor

/* ============================= LIST ============================= */
function AssessmentList() {
  const { user, role, profile } = useAuth()
  const isSuper = role === 'superadmin'
  const canCreate = ['superadmin', 'admin'].includes(role)
  const [s] = useS()
  const navigate = useNavigate()
  const [rows, setRows] = useState([])
  const [companies, setCompanies] = useState([])
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState(null)

  useEffect(() => {
    if (!supabase || !user) return
    supabase.rpc('my_assessment_summaries')
      .then(({ data }) => setRows(data ?? []))
      .catch(() => supabase.from('assessments')
        .select('id, title, status, company_id, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .then(({ data }) => setRows(data ?? [])))
    supabase.from('accounts').select('id, name').order('name')
      .then(({ data }) => setCompanies(data ?? []))
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
        if (d) {
          msg += ` — role: ${d.my_role} · subscription active: ${d.has_active_subscription} · your grant: ${d.my_grant}`
          if ('is_admin' in d) msg += ` · is_admin: ${d.is_admin} · can_create: ${d.can_create}`
          if ('auth_uid' in d) msg += ` · uid: ${String(d.auth_uid).slice(0, 8)}`
          msg += ` · project: ${(supabase?.supabaseUrl || '').replace('https://', '').split('.')[0]}`
        }
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
      <DesignButton s={s} role={role} navigate={navigate} />
      {status && <p className="form-status err">{status.msg}</p>}

      {canCreate && (
        <NewO360Project s={s} isSuper={isSuper} companies={companies}
                        companyId={profile?.company_id} user={user}
                        onOpen={(id) => navigate(`/portal/assessment/${id}`)} />
      )}

      <div className="portal-panels">
        <section className="portal-card wide2">
          {rows.length === 0 ? <p>{s.asNone}</p> : (
            <ul className="proj-list">
              {rows.map(a => {
                const pct = a.total_questions
                  ? Math.round(((a.answered ?? 0) / a.total_questions) * 100) : null
                const grade = (v) => v == null ? '' : v >= 70 ? 'score-good' : v >= 40 ? 'score-mid' : 'score-low'
                return (
                  <li key={a.id}>
                    <div className="proj-top">
                      <b>{a.code ? `${a.code}${a.title && a.title !== a.code ? ' · ' + a.title : ''}` : a.title}</b>
                      <span className="pm-actions">
                        {a.client_score != null && (
                          <span className={`score-chip ${grade(a.client_score)}`}
                                title={s.asClientScore}>{a.client_score}</span>
                        )}
                        {a.auditor_score != null && (
                          <span className={`score-chip chip-aud ${grade(a.auditor_score)}`}
                                title={s.asAuditorScore}>{a.auditor_score}</span>
                        )}
                        <span className={`pill pill-${a.status === 'in_progress' ? 'in_progress' : a.status === 'submitted' ? 'review' : a.status === 'assessed' ? 'delivered' : 'archived'}`}>
                          {s.asStatus[a.status]}
                        </span>
                        <button className="btn btn-ghost btn-xs"
                                onClick={() => navigate(`/portal/assessment/${a.id}`)}>{s.asOpen}</button>
                      </span>
                    </div>
                    {pct != null && (
                      <div className="proj-bar" title={`${s.asProgress}: ${pct}%`}>
                        <span style={{ width: `${pct}%` }} />
                      </div>
                    )}
                    <div className="proj-meta">
                      {pct != null && <>{a.answered}/{a.total_questions} {s.asAnswered} · </>}
                      {new Date(a.updated_at).toLocaleDateString('en-GB')}
                    </div>
                  </li>
                )
              })}
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
  const caps = useAssessCaps(assessmentId)
  const isAssessor = caps.is_assessor
  const canSeeAud = caps.can_view_auditor || isAssessor
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
            {canSeeAud && <span className="as-leg-auditor">■ {s.asAuditorScore}{scores.audTotal != null && ` · ${scores.audTotal}`}</span>}
          </p>
          <div className="as-scores">
            {scores.perCrit.map(c => (
              <div key={c.code} className="as-score-item as-dual">
                <span className="as-score-label">C{c.num} · {critName(c.code)}</span>
                <span className="as-bars">
                  <span className="proj-bar"><span style={{ width: `${c.avg ?? 0}%` }} /></span>
                  {canSeeAud && <span className="proj-bar bar-auditor"><span style={{ width: `${c.audAvg ?? 0}%` }} /></span>}
                </span>
                <span className="as-score-num">{c.avg ?? '—'}{canSeeAud && <> / <b>{c.audAvg ?? '—'}</b></>}</span>
              </div>
            ))}
          </div>
        </section>

        {/* assessment team: add users with their roles */}
        <TeamPanel assessmentId={assessmentId} s={s}
                   canManage={caps.can_manage_members} />

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
  const caps = useAssessCaps(assessmentId)
  const isAssessor = caps.is_assessor
  const canEdit = caps.can_edit_client
  const canSeeAud = caps.can_view_auditor || isAssessor
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
  const answersRef = useRef({})
  const audRef = useRef({})
  const dirtyRef = useRef({ ans: new Set(), aud: new Set() })

  // flush every 5s: saves everything typed, never overwrites with stale data
  useEffect(() => {
    const flush = async () => {
      const dAns = [...dirtyRef.current.ans]; dirtyRef.current.ans.clear()
      const dAud = [...dirtyRef.current.aud]; dirtyRef.current.aud.clear()
      if (!dAns.length && !dAud.length) return
      setSaveState(s.asSaving)
      for (const code of dAns) {
        const cur = answersRef.current[code] || {}
        await supabase.from('assessment_answers').upsert({
          assessment_id: assessmentId, question_code: code,
          level: cur.level ?? null, justification: cur.justification ?? null,
          updated_by: user.id,
        })
      }
      for (const code of dAud) {
        const cur = audRef.current[code] || {}
        await supabase.from('assessment_auditor_scores').upsert({
          assessment_id: assessmentId, question_code: code,
          level: cur.level ?? null, note: cur.note ?? null, auditor_id: user.id,
        })
      }
      setSaveState(s.asSaved)
    }
    const t = setInterval(flush, 5000)
    const onHide = () => flush()
    window.addEventListener('pagehide', onHide)
    return () => { clearInterval(t); window.removeEventListener('pagehide', onHide); flush() }
  }, [assessmentId, user]) // eslint-disable-line react-hooks/exhaustive-deps

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
      const ansMap = Object.fromEntries((a.data ?? []).map(x => [x.question_code, x]))
      setAnswers(ansMap); answersRef.current = ansMap
      setDocs(d.data ?? [])
      const audMap = Object.fromEntries((au.data ?? []).map(x => [x.question_code, x]))
      setAudScores(audMap); audRef.current = audMap
      setFindings(fi.data ?? [])
      if (c.data?.length) setCrit(prev => prev ?? c.data[0].code)
    })
  }, [assessmentId])

  const critQs = useMemo(
    () => questions.filter(q => q.criterion_code === crit), [questions, crit])
  const answered = Object.values(answers).filter(a => a.level != null).length

  function persist(code, patch, debounce = 0) {
    const merged = { ...(answersRef.current[code] || {}), question_code: code, ...patch }
    answersRef.current = { ...answersRef.current, [code]: merged }
    setAnswers(prev => ({ ...prev, [code]: merged }))
    setSaveState(s.asSaving)
    if (debounce === 0) {
      // level clicks: save at once (always from the ref → never stale)
      clearTimeout(timers.current[code])
      timers.current[code] = setTimeout(async () => {
        const cur = answersRef.current[code] || {}
        await supabase.from('assessment_answers').upsert({
          assessment_id: assessmentId, question_code: code,
          level: cur.level ?? null, justification: cur.justification ?? null,
          updated_by: user.id,
        })
        setSaveState(s.asSaved)
      }, 50)
    } else {
      dirtyRef.current.ans.add(code)   // typed text → the 5s flush picks it up
    }
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

  async function updateDocNote(doc, note) {
    const clean = note.trim() || null
    if ((doc.note || null) === clean) return
    await supabase.from('assessment_documents').update({ note: clean }).eq('id', doc.id)
    setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, note: clean } : d))
  }

  async function removeDoc(doc) {
    await supabase.storage.from('assessment-evidence').remove([doc.storage_path])
    await supabase.from('assessment_documents').delete().eq('id', doc.id)
    setDocs(prev => prev.filter(d => d.id !== doc.id))
  }

  function persistAud(code, patch, debounce = 0) {
    const merged = { ...(audRef.current[code] || {}), question_code: code, ...patch }
    audRef.current = { ...audRef.current, [code]: merged }
    setAudScores(prev => ({ ...prev, [code]: merged }))
    setSaveState(s.asSaving)
    if (debounce === 0) {
      clearTimeout(timers.current['aud' + code])
      timers.current['aud' + code] = setTimeout(async () => {
        const cur = audRef.current[code] || {}
        await supabase.from('assessment_auditor_scores').upsert({
          assessment_id: assessmentId, question_code: code,
          level: cur.level ?? null, note: cur.note ?? null, auditor_id: user.id,
        })
        setSaveState(s.asSaved)
      }, 50)
    } else {
      dirtyRef.current.aud.add(code)
    }
  }

  async function addFinding(code, type, e) {
    e.preventDefault()
    const f = e.target
    const body = f.body.value.trim()
    if (!body) return
    const { data, error } = await supabase.from('assessment_findings').insert({
      assessment_id: assessmentId, question_code: code, type, body, created_by: user.id,
    }).select()
    if (error) { setSaveState(`✕ ${error.message}`); return }
    const row = data?.[0]
    if (row) setFindings(prev => [...prev, row])
    else {
      // RETURNING filtrado por RLS (pre-migración-28): recarga la lista
      const { data: fi } = await supabase.from('assessment_findings')
        .select('*').eq('assessment_id', assessmentId).order('created_at')
      setFindings(fi ?? [])
    }
    f.reset(); setSaveState(s.asSaved)
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

      {(() => {
        // Puntuación por CONTRIBUCIÓN: cada pregunta sin responder cuenta 0,
        // de modo que el marcador crece con el avance (1 respuesta ≠ 60 puntos).
        const lvl = (q) => answers[q.code]?.level
        const audLvl = (q) => {
          const a = audScores[q.code]?.level
          return a != null ? a : lvl(q)   // auditor hereda la respuesta del cliente hasta corregirla
        }
        const contrib = (qs, f) => qs.length
          ? Math.round(qs.reduce((t, q) => t + ((f(q) ?? 0) * 20), 0) / qs.length) : null
        const overall = contrib(questions, lvl)
        const audOverall = canSeeAud ? contrib(questions, audLvl) : null
        const audTouched = canSeeAud && Object.values(audScores).some(a => a?.level != null)
        return (
          <>
          <button type="button" className="as-score-fab"
                  title={canSeeAud ? `${s.asOrgScore} / ${s.asAuditorScore}` : s.asOrgScore}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="fab-num cli">{overall ?? '—'}</span>
            {canSeeAud && audTouched && (
              <>
                <span className="fab-sep">/</span>
                <span className="fab-num aud">{audOverall}</span>
              </>
            )}
          </button>
          <section className="portal-card wide2 as-scoreboard">
            <div className="as-score-rows">
              {criteria.map(c => {
                const qs = questions.filter(q => q.criterion_code === c.code)
                const done = qs.filter(q => lvl(q) != null)
                const sc = contrib(qs, lvl) ?? 0
                const audSc = canSeeAud && audTouched ? (contrib(qs, audLvl) ?? 0) : null
                return (
                  <button key={c.code} type="button"
                          className={`as-score-row ${crit === c.code ? 'on' : ''}`}
                          onClick={() => { setCrit(c.code); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
                    <span className="as-score-c">{c.code.toUpperCase()}</span>
                    <span className="as-score-bars">
                      <span className="as-score-bar"><span style={{ width: `${sc}%` }} /></span>
                      {audSc != null && (
                        <span className="as-score-bar aud"><span style={{ width: `${audSc}%` }} /></span>
                      )}
                    </span>
                    <span className="as-score-val">
                      {sc}{audSc != null && <> / <b>{audSc}</b></>} · {done.length}/{qs.length}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
          </>
        )
      })()}

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
              {LV(q, lang).map((lvl, i) => (
                <label key={i} className={`as-level ${an.level === i ? 'on' : ''}`}>
                  <input type="radio" name={`lvl-${q.code}`} checked={an.level === i}
                         disabled={!canEdit}
                         onChange={() => persist(q.code, { level: i })} />
                  <span className="as-level-score">{i * 20}</span>
                  <span className="as-level-txt">{lvl}</span>
                </label>
              ))}
            </div>

            <div className="field" style={{ marginTop: 12 }}>
              <label>{s.asJustification}</label>
              <textarea rows="3" value={an.justification || ''}
                        placeholder={s.asJustPh} disabled={!canEdit}
                        onChange={(e) => persist(q.code, { justification: e.target.value }, 800)} />
            </div>

            {L(q, 'evidence', lang) && (
              <details className="as-evid-hint">
                <summary>{s.asEvidenceHint}</summary>
                <pre>{L(q, 'evidence', lang)}</pre>
              </details>
            )}

            <div className="as-docs">
              <div className="as-docs-head">
                <b>{s.asEvidence}</b>
                <p className="proj-meta as-docs-hint">{s.asEvidenceExplain}</p>
              </div>
              {qDocs.map(d => (
                <div key={d.id} className="as-doc">
                  <span className="as-doc-file">
                    <button className="btn btn-ghost btn-xs" onClick={() => download(d)}>{d.filename}</button>
                    {canEdit && <button className="btn btn-ghost btn-xs" onClick={() => removeDoc(d)}>✕</button>}
                  </span>
                  {canEdit ? (
                    <input className="as-doc-note" defaultValue={d.note || ''}
                           placeholder={s.asDocNotePh} maxLength={240}
                           onBlur={(e) => updateDocNote(d, e.target.value)} />
                  ) : (
                    d.note && <span className="as-doc-note-ro">{d.note}</span>
                  )}
                </div>
              ))}
              {canEdit && (
                <label className="btn btn-ghost btn-xs as-upload">
                  {s.asUpload}
                  <input type="file" hidden onChange={(e) => upload(q.code, e)} />
                </label>
              )}
            </div>

            {/* auditor score chip visible to everyone once it exists */}
            {!isAssessor && canSeeAud && audScores[q.code]?.level != null && (
              <p className="as-aud-chip">
                {s.asAuditorScore}: <b>{audScores[q.code].level * 20}</b>
                {audScores[q.code].note && <span className="proj-meta"> · {audScores[q.code].note}</span>}
              </p>
            )}

            {/* auditor correction panel */}
            {canSeeAud && (
              <div className={`as-aud-panel ${!isAssessor ? 'aud-ro' : ''}`}>
                <h4 className="cp-h4">{s.asAuditorPanel}
                  {!isAssessor && <span className="proj-meta"> · {s.asReadOnly}</span>}</h4>
                <p className="proj-meta">
                  {s.asClientAnswer}: <b>{an.level != null ? an.level * 20 : s.asNoAnswer}</b>
                </p>
                <div className="as-aud-levels" role="radiogroup" aria-label={s.asAuditorLevel}>
                  {(() => {
                    const audLvl = audScores[q.code]?.level
                    const effLvl = audLvl != null ? audLvl : an.level   // premarcado = respuesta del cliente
                    return [0, 1, 2, 3, 4, 5].map(i => (
                    <label key={i}
                           className={`as-aud-lvl ${effLvl === i ? (audLvl != null ? 'on' : 'on pre') : ''}`}
                           title={LV(q, lang)[i]}>
                      <input type="radio" name={`aud-${q.code}`}
                             checked={effLvl === i}
                             disabled={!isAssessor}
                             onChange={() => persistAud(q.code, { level: i })} />
                      {i * 20}
                    </label>
                    ))
                  })()}
                </div>
                <div className="field">
                  <label>{s.asAuditorNote}</label>
                  <textarea rows="2" value={audScores[q.code]?.note || ''}
                            placeholder={s.asAuditorNotePh} disabled={!isAssessor}
                            onChange={(e) => persistAud(q.code, { note: e.target.value }, 800)} />
                </div>

                <h4 className="cp-h4">{s.asFindings}</h4>
                <ul className="as-findings">
                  {(() => {
                    let nf = 0, nm = 0
                    const codeOf = {}
                    for (const x of findings) codeOf[x.id] = x.type === 'strength' ? `F${++nf}` : `AM${++nm}`
                    return findings.filter(x => x.question_code === q.code).map(x => (
                    <li key={x.id} className={x.type}>
                      <span className="as-find-code">{codeOf[x.id]}</span>
                      <span className="as-find-tag">
                        {x.type === 'strength' ? s.asStrength : s.asImprovement}
                      </span>
                      <span className="as-find-body">{x.body}</span>
                      {isAssessor && (
                        <button className="btn btn-ghost btn-xs"
                                onClick={() => removeFinding(x.id)}>✕</button>
                      )}
                    </li>
                    ))
                  })()}
                </ul>
                {isAssessor && (
                <div className="as-find-forms">
                  <form className="cp-inline as-find-form" onSubmit={(e) => addFinding(q.code, 'strength', e)}>
                    <textarea name="body" rows="2" placeholder={`${s.asStrength}…`} />
                    <button className="btn btn-primary btn-xs" type="submit">{s.asAddFinding}</button>
                  </form>
                  <form className="cp-inline as-find-form" onSubmit={(e) => addFinding(q.code, 'improvement', e)}>
                    <textarea name="body" rows="2" placeholder={`${s.asImprovement}…`} />
                    <button className="btn btn-primary btn-xs" type="submit">{s.asAddFinding}</button>
                  </form>
                </div>
                )}
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
  const { role } = useAuth()
  const [permit, setPermit] = useState(role === 'superadmin' ? 'admin' : null)
  useEffect(() => {
    if (role === 'superadmin') return
    supabase.rpc('my_design_permit').then(({ data }) => setPermit(data || 'none'))
  }, [role])
  const canEditDesign = permit === 'admin'
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
    const lvEs = f.levels_es.value.split('\n').map(x => x.trim()).filter(Boolean)
    if (lvEn.length !== 6 || lvAr.length !== 6 || (lvEs.length !== 0 && lvEs.length !== 6)) {
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
      question_es: f.question_es.value.trim() || null,
      block_es: f.block_es.value.trim() || null,
      context_es: f.context_es.value.trim() || null,
      evidence_es: f.evidence_es.value.trim() || null,
      levels_es: lvEs.length === 6 ? lvEs : null,
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
                <div className="field">
                  <label>Pregunta (ES)</label>
                  <input name="question_es" defaultValue={q.question_es || ''} />
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
                <div className="field">
                  <label>Bloque (ES)</label>
                  <input name="block_es" defaultValue={q.block_es || ''} />
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
                <div className="field">
                  <label>Contexto (ES)</label>
                  <textarea name="context_es" rows="2" defaultValue={q.context_es || ''} />
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
                <div className="field">
                  <label>Evidencias sugeridas (ES)</label>
                  <textarea name="evidence_es" rows="4" defaultValue={q.evidence_es || ''} />
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
                <div className="field">
                  <label>Niveles (ES)</label>
                  <textarea name="levels_es" rows="7" defaultValue={(q.levels_es || []).join('\n')} />
                </div>
              </div>
              {canEditDesign && <button className="btn btn-primary btn-xs" type="submit">{s.asSave}</button>}
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
      const { data: cons } = await supabase.rpc('list_people_min')
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

  const reviewsRef = useRef({})
  const dirtyRev = useRef(new Set())
  useEffect(() => { reviewsRef.current = reviews }, [reviews])
  useEffect(() => {
    const flush = async () => {
      const codes = [...dirtyRev.current]; dirtyRev.current.clear()
      if (!codes.length) return
      setSaveState(s.asSaving)
      for (const code of codes) {
        const cur = reviewsRef.current[code] || {}
        await supabase.from('assessment_criterion_reviews').upsert({
          assessment_id: assessmentId, criterion_code: code,
          strengths: cur.strengths ?? null, improvements: cur.improvements ?? null,
        })
      }
      setSaveState(s.asSaved)
    }
    const t = setInterval(flush, 5000)
    const onHide = () => flush()
    window.addEventListener('pagehide', onHide)
    return () => { clearInterval(t); window.removeEventListener('pagehide', onHide); flush() }
  }, [assessmentId]) // eslint-disable-line react-hooks/exhaustive-deps

  function saveReview(code, field, value) {
    const merged = { ...(reviewsRef.current[code] || {}), criterion_code: code, [field]: value }
    reviewsRef.current = { ...reviewsRef.current, [code]: merged }
    setReviews(prev => ({ ...prev, [code]: merged }))
    dirtyRev.current.add(code)
    setSaveState(s.asSaving)
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
          <h4 className="cp-h4">{s.asAssignConsultants}</h4>
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
              <textarea rows="8" className="as-review-ta" value={reviews[c.code]?.strengths || ''}
                        onChange={(e) => saveReview(c.code, 'strengths', e.target.value)} />
            </div>
            <div className="field">
              <label>{s.asRevImprovements}</label>
              <textarea rows="8" className="as-review-ta" value={reviews[c.code]?.improvements || ''}
                        onChange={(e) => saveReview(c.code, 'improvements', e.target.value)} />
            </div>
          </div>
        </details>
      ))}
    </section>
  )
}


/* ================= ASSESSMENT TEAM: users + roles ================= */
function TeamPanel({ assessmentId, s, canManage }) {
  const [members, setMembers] = useState([])
  const [users, setUsers] = useState([])
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)

  async function load() {
    const { data } = await supabase.from('assessment_members')
      .select('user_id, member_role').eq('assessment_id', assessmentId)
    setMembers(data ?? [])
    if (canManage) {
      const { data: ppl } = await supabase.from('profiles')
        .select('id, full_name, email').order('full_name')
      setUsers(ppl ?? [])
    }
  }
  useEffect(() => { load() }, [assessmentId, canManage]) // eslint-disable-line react-hooks/exhaustive-deps

  const uname = (id) => {
    const u = users.find(x => x.id === id)
    return u ? (u.full_name || u.email) : id.slice(0, 8)
  }

  async function add(e) {
    e.preventDefault()
    const f = e.target
    if (!f.tuser.value) return
    setBusy(true); setErr(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('assessment_members').upsert({
      assessment_id: assessmentId, user_id: f.tuser.value,
      member_role: f.trole.value, added_by: user.id,
    })
    setBusy(false)
    if (error) setErr(error.message)
    else { f.reset(); load() }
  }

  async function remove(uid) {
    setBusy(true)
    await supabase.from('assessment_members').delete()
      .eq('assessment_id', assessmentId).eq('user_id', uid)
    setBusy(false); load()
  }

  return (
    <section className="portal-card wide2">
      <h3>{s.asTeam}</h3>
      {err && <p className="form-status err">{err}</p>}
      {members.length === 0
        ? <p className="proj-meta">{s.asNoTeam}</p>
        : members.map(m => (
          <div key={m.user_id} className="proj-top">
            <span>
              <b>{uname(m.user_id)}</b>
              <span className="proj-meta"> · {s.productRoles[m.member_role] || m.member_role}</span>
            </span>
            {canManage && (
              <button className="btn btn-ghost btn-xs" disabled={busy}
                      onClick={() => remove(m.user_id)}>✕</button>
            )}
          </div>
        ))}
      {canManage && (
        <form className="cp-inline" onSubmit={add}>
          <select name="tuser" required>
            <option value="">—</option>
            {users.filter(u => !members.some(m => m.user_id === u.id)).map(u => (
              <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
            ))}
          </select>
          <select name="trole" defaultValue="assessor">
            {Object.entries(s.productRoles).map(([k, v]) =>
              <option key={k} value={k}>{v}</option>)}
          </select>
          <button className="btn btn-primary btn-xs" disabled={busy} type="submit">{s.asAddUser}</button>
        </form>
      )}
    </section>
  )
}


/* =================== New O360 project (zone-local) =================== */
function NewO360Project({ s, isSuper, companies, companyId, user, onOpen }) {
  const [accountSel, setAccountSel] = useState('')
  const activeCompany = localStorage.getItem('o360.company') || ''
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState(null)
  const cid = isSuper ? accountSel : (activeCompany || companyId || '')

  async function create(e) {
    e.preventDefault()
    if (!cid) return
    setBusy(true); setErr(null)
    const { data, error } = await supabase.from('projects').insert({
      account_id: cid, zone_code: 'assessment',
      created_by: user.id, status: 'design',
    }).select().single()
    if (error) { setBusy(false); setErr(error.message); return }
    await supabase.from('project_members').upsert({
      project_id: data.id, user_id: user.id, member_role: 'admin',
    })
    const { data: a } = await supabase.from('assessments')
      .select('id').eq('project_id', data.id).maybeSingle()
    setBusy(false)
    if (a) onOpen(a.id)
  }

  return (
    <section className="portal-card wide2 np-lean">
      <h3>{s.newProject}</h3>
      {err && <p className="form-status err">{err}</p>}
      <form onSubmit={create}>
        <div className="np-lean-row">
          {isSuper ? (
            <select aria-label={s.npAccount} required value={accountSel}
                    onChange={(e) => setAccountSel(e.target.value)}>
              <option value="">{s.npAccount} —</option>
              {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          ) : (
            <span className="np-fixed-company">{s.npYourCompany}</span>
          )}
          <button className="btn btn-primary" disabled={busy || !cid} type="submit">
            {s.npCreate}
          </button>
        </div>
        <p className="proj-meta">{s.npCode} {s.npRolesInside} {s.npOpenO360}</p>
      </form>
    </section>
  )
}


function DesignButton({ s, role, navigate }) {
  const [permit, setPermit] = useState(role === 'superadmin' ? 'admin' : null)
  useEffect(() => {
    if (role === 'superadmin') return
    supabase.rpc('my_design_permit').then(({ data }) => setPermit(data || 'none'))
  }, [role])
  if (permit !== 'admin' && permit !== 'manager') return null
  return (
    <div className="pm-actions">
      <button className="btn btn-ghost btn-xs"
              onClick={() => navigate('/portal/assessment/design')}>
        {s.asDesign}{permit === 'manager' && <> · {s.asReadOnly}</>}
      </button>
    </div>
  )
}
