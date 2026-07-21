import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import { PORTAL_STRINGS } from '../data/orbitalPortal.js'

/**
 * Management & Governance System — per-project workspace.
 *   /portal/management/:id                → Process map (default tab)
 *   /portal/management/:id/:tab           → map | org | roles | bodies
 *   /portal/management/:id/sub/:subId     → subprocess activities sheet
 *
 * One jsonb document per project (management_maps.data) shared by all tabs:
 *   { standards:[…], bands:[…], functions:[…], people:[…] }
 *   – standards          → ISO tags active for this project (configurable)
 *   – bands/procs/subs   → Process map (Camarena structure, auto codes);
 *                          each process carries ISO tags, each subprocess
 *                          owns an activities sheet (input/output/evidence)
 *                          and a valued risk register (P×I)
 *   – functions/people   → Roles; the Organization chart builds itself.
 */
export default function Management() {
  const { id, tab, subId } = useParams()
  if (!id) return <Navigate to="/portal/governance" replace />
  return <ManagementProject projectId={id} tab={tab || 'map'} subId={subId || null} />
}

const useS = () => {
  const { lang } = useLang()
  return [PORTAL_STRINGS[lang] || PORTAL_STRINGS.en, lang]
}

const MG_TABS = ['map', 'org', 'roles', 'bodies']
const PHASES = ['pre', 'ongoing', 'post']
const PALETTE = ['#52d3a2', '#5aa9e6', '#e5a54b', '#b07ae0', '#e06a8a', '#39c2c9', '#8fd14f', '#f0c34e']
const STANDARDS = ['iso9001', 'iso14001', 'iso27001', 'iso45001']
const ISO_LABEL = { iso9001: 'ISO 9001', iso14001: 'ISO 14001', iso27001: 'ISO 27001', iso45001: 'ISO 45001' }
const uid = () => Math.random().toString(36).slice(2, 9)

const riskValue = (r) => (Number(r.prob) || 1) * (Number(r.impact) || 1)
const riskLevel = (v) => v >= 16 ? 'critical' : v >= 10 ? 'high' : v >= 5 ? 'medium' : 'low'

const seedDoc = () => ({
  standards: [...STANDARDS],
  bands: [
    { id: 'b_str', tkey: 'strategic', pref: 'PR-STR', color: '#52d3a2', procs: [] },
    { id: 'b_key', tkey: 'key',       pref: 'PR-KEY', color: '#5aa9e6', procs: [] },
    { id: 'b_sup', tkey: 'support',   pref: 'PR-SUP', color: '#e5a54b', procs: [] },
  ],
  functions: [],
  people: [],
})

/* Infer a code prefix for user-created bands from their title (fixed once). */
function inferPref(band) {
  const t = String(band.title || 'GEN').toUpperCase()
  const word = t.replace(/[^A-Z0-9 ]/g, ' ').trim().split(/\s+/)[0] || 'GEN'
  return 'PR-' + (word.slice(0, 4) || 'GEN')
}

/* Normalise + recompute every code. Codes never have gaps or duplicates:
   processes PREF-01…, subprocesses S01-CODE, activities A01…, functions
   FN-01…  Keeps ISO tags within the project's active standards and
   people ↔ functions ↔ reports-to references consistent (no dangling ids,
   no reporting cycles). */
function normalize(doc) {
  const d = doc && Array.isArray(doc.bands) ? doc : seedDoc()

  if (!Array.isArray(d.standards)) d.standards = [...STANDARDS]
  d.standards = d.standards.filter(x => STANDARDS.includes(x))

  d.bands.forEach((b, i) => {
    if (!b.id) b.id = 'b' + uid()
    if (!b.color) b.color = PALETTE[i % PALETTE.length]
    if (!Array.isArray(b.procs)) b.procs = []
    if (!b.pref) b.pref = inferPref(b)
    b.procs.forEach((p, j) => {
      if (!p.id) p.id = 'p' + uid()
      p.code = b.pref + '-' + String(j + 1).padStart(2, '0')
      p.phases = (Array.isArray(p.phases) ? p.phases : ['ongoing']).filter(f => PHASES.includes(f))
      if (!p.phases.length) p.phases = ['ongoing']
      p.tags = (Array.isArray(p.tags) ? p.tags : []).filter(t => d.standards.includes(t))
      if (!Array.isArray(p.subs)) p.subs = []
      p.subs.forEach((sb, k) => {
        if (!sb.id) sb.id = 's' + uid()
        sb.code = 'S' + String(k + 1).padStart(2, '0') + '-' + p.code
        if (!Array.isArray(sb.activities)) sb.activities = []
        sb.activities.forEach((a, ai) => {
          if (!a.id) a.id = 'a' + uid()
          a.code = 'A' + String(ai + 1).padStart(2, '0')
          a.name = a.name || ''; a.input = a.input || ''
          a.output = a.output || ''; a.evidence = a.evidence || ''
        })
        if (!Array.isArray(sb.risks)) sb.risks = []
        sb.risks.forEach((r, ri) => {
          if (!r.id) r.id = 'r' + uid()
          r.code = 'R' + String(ri + 1).padStart(2, '0')
          r.desc = r.desc || ''; r.treatment = r.treatment || ''
          r.prob = Math.min(5, Math.max(1, Number(r.prob) || 1))
          r.impact = Math.min(5, Math.max(1, Number(r.impact) || 1))
        })
      })
    })
  })

  if (!Array.isArray(d.functions)) d.functions = []
  d.functions.forEach((f, i) => {
    if (!f.id) f.id = 'f' + uid()
    f.code = 'FN-' + String(i + 1).padStart(2, '0')
    f.name = f.name || ''
    f.desc = f.desc || ''
  })

  if (!Array.isArray(d.people)) d.people = []
  const fnIds = new Set(d.functions.map(f => f.id))
  const pplIds = new Set(d.people.map(p => p.id).filter(Boolean))
  d.people.forEach(p => {
    if (!p.id) { p.id = 'u' + uid(); pplIds.add(p.id) }
    p.name = p.name || ''
    if (p.functionId && !fnIds.has(p.functionId)) p.functionId = null
    if (p.reportsTo && (!pplIds.has(p.reportsTo) || p.reportsTo === p.id)) p.reportsTo = null
  })
  // break reporting cycles (walk up; if we revisit, cut the link)
  d.people.forEach(p => {
    const seen = new Set([p.id])
    let cur = p
    while (cur.reportsTo) {
      if (seen.has(cur.reportsTo)) { cur.reportsTo = null; break }
      seen.add(cur.reportsTo)
      cur = d.people.find(x => x.id === cur.reportsTo)
      if (!cur) break
    }
  })
  return d
}

function phaseSpan(p) {
  const idxs = (p.phases || []).map(f => PHASES.indexOf(f)).filter(i => i !== -1)
  if (!idxs.length) return { start: 2, span: 1 }
  const min = Math.min(...idxs), max = Math.max(...idxs)
  return { start: min + 1, span: max - min + 1 }
}

function findSub(d, subId) {
  for (const b of d.bands) for (const p of b.procs) {
    const sb = p.subs.find(x => x.id === subId)
    if (sb) return { band: b, proc: p, sub: sb }
  }
  return null
}

/* ========================= project shell + tabs ========================= */
function ManagementProject({ projectId, tab, subId }) {
  const { user, role } = useAuth()
  const [s, lang] = useS()
  const isAr = lang === 'ar'
  const navigate = useNavigate()

  const [project, setProject] = useState(null)
  const [account, setAccount] = useState(null)
  const [myMemberRole, setMyMemberRole] = useState(null)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    if (!supabase || !user) return
    supabase.from('projects')
      .select('id, code, title_en, title_ar, account_id, zone_code, created_by, status')
      .eq('id', projectId).maybeSingle()
      .then(({ data }) => { data ? setProject(data) : setMissing(true) })
  }, [user, projectId])

  useEffect(() => {
    if (!supabase || !project?.account_id) return
    supabase.from('accounts').select('id, name, name_ar')
      .eq('id', project.account_id).maybeSingle()
      .then(({ data }) => setAccount(data))
  }, [project?.account_id])

  useEffect(() => {
    if (!supabase || !user) return
    supabase.from('project_members').select('member_role')
      .eq('project_id', projectId).eq('user_id', user.id).maybeSingle()
      .then(({ data }) => setMyMemberRole(data?.member_role ?? null))
  }, [user, projectId])

  const canEdit =
    ['superadmin', 'admin'].includes(role)
    || project?.created_by === user?.id
    || (role === 'consultant' && !!myMemberRole)
    || ['admin', 'manager', 'assessor'].includes(myMemberRole)

  /* ---------- shared document: load + debounced autosave ---------- */
  const [doc, setDoc] = useState(null)
  const [saveState, setSaveState] = useState(null)   // null | saving | saved | error
  const docRef = useRef(null)
  const dirtyRef = useRef(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!supabase || !user) return
    supabase.from('management_maps').select('data')
      .eq('project_id', projectId).maybeSingle()
      .then(({ data }) => {
        const d = normalize(data?.data)
        docRef.current = d
        setDoc({ ...d })
      })
  }, [user, projectId])

  const saveNow = useCallback(async () => {
    if (!supabase || !dirtyRef.current || !docRef.current) return
    dirtyRef.current = false
    setSaveState('saving')
    const { error } = await supabase.from('management_maps').upsert({
      project_id: projectId, data: docRef.current, updated_by: user?.id ?? null,
    })
    if (error) { dirtyRef.current = true; setSaveState('error') }
    else setSaveState('saved')
  }, [projectId, user?.id])

  const scheduleSave = useCallback(() => {
    dirtyRef.current = true
    setSaveState('saving')
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(saveNow, 1200)
  }, [saveNow])

  useEffect(() => () => {           // flush on unmount
    clearTimeout(timerRef.current)
    if (dirtyRef.current) saveNow()
  }, [saveNow])

  const mutate = useCallback((fn) => {
    const next = normalize(JSON.parse(JSON.stringify(docRef.current || seedDoc())))
    fn(next)
    normalize(next)
    docRef.current = next
    setDoc({ ...next })
    scheduleSave()
  }, [scheduleSave])

  /* ---------- name suggestions: project members ∪ Roles · People ---------- */
  const [memberNames, setMemberNames] = useState([])
  useEffect(() => {
    if (!supabase || !user) return
    Promise.all([
      supabase.from('project_members').select('user_id').eq('project_id', projectId),
      supabase.rpc('list_people_min').then(r => r).catch(() => ({ data: null })),
    ]).then(([m, p]) => {
      const byId = Object.fromEntries((p?.data ?? []).map(u => [u.id, u.full_name || u.email]))
      setMemberNames([...new Set((m?.data ?? []).map(x => byId[x.user_id]).filter(Boolean))])
    }).catch(() => {})
  }, [user, projectId])

  const peopleNames = useMemo(() => [...new Set([
    ...memberNames,
    ...(doc?.people ?? []).map(p => p.name?.trim()).filter(Boolean),
  ])], [memberNames, doc])

  const title = project
    ? [(project.code || ''), (isAr && project.title_ar) || project.title_en]
        .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' · ')
    : '…'

  const activeTab = subId ? 'map' : (MG_TABS.includes(tab) ? tab : 'map')

  return (
    <PmShell>
      <div className="pm-content">
        <header className="dash-head mg-head">
          <button className="btn btn-ghost btn-xs" onClick={() => navigate('/portal/governance')}>
            ← {s.mgZone}
          </button>
          <h1>{title}</h1>
          {account && <span className="proj-meta">{(isAr && account.name_ar) || account.name}</span>}
        </header>

        {missing && <p className="form-status err">{s.mgNotFound}</p>}

        <nav className="mg-tabs" aria-label={s.mgZone}>
          {MG_TABS.map(t => (
            <button key={t}
              className={'mg-tab' + (activeTab === t ? ' active' : '')}
              onClick={() => navigate(`/portal/management/${projectId}/${t}`, { replace: true })}>
              {s.mgTabs[t]}
            </button>
          ))}
          {saveState && (
            <span className={`mg-save mg-save-${saveState}`}>
              {saveState === 'saving' ? s.mgSaving : saveState === 'saved' ? s.mgSaved : s.mgSaveErr}
            </span>
          )}
        </nav>

        {!canEdit && <p className="proj-meta mg-readonly">{s.mgReadOnly}</p>}

        {!doc ? <p className="proj-meta">…</p> : (
          subId ? (
            <SubFicha doc={doc} mutate={mutate} canEdit={canEdit} s={s}
              subId={subId}
              onBack={() => navigate(`/portal/management/${projectId}/map`, { replace: true })} />
          )
          : activeTab === 'map' ? (
            <ProcessMap doc={doc} mutate={mutate} canEdit={canEdit} s={s}
              onOpenSub={(sid) => navigate(`/portal/management/${projectId}/sub/${sid}`)} />
          )
          : activeTab === 'roles' ? <RolesTab doc={doc} mutate={mutate} canEdit={canEdit} s={s} />
          : activeTab === 'org'   ? <OrgChart doc={doc} s={s}
                                      onGoRoles={() => navigate(`/portal/management/${projectId}/roles`, { replace: true })} />
          : (
            <section className="portal-card wide mg-soon">
              <h3>{s.mgTabs[activeTab]}</h3>
              <p>{s.mgSoon}</p>
            </section>
          )
        )}

        {peopleNames.length > 0 && (
          <datalist id="mgPeople">
            {peopleNames.map(n => <option key={n} value={n} />)}
          </datalist>
        )}
      </div>
    </PmShell>
  )
}

/* ============================ PROCESS MAP ============================ */
function ProcessMap({ doc, mutate, canEdit, s, onOpenSub }) {
  const [editing, setEditing] = useState(null)       // { bid, pid }
  const [bandEdit, setBandEdit] = useState(null)     // bid
  const dragRef = useRef(null)                       // { bid, pid }
  const [dropHint, setDropHint] = useState(null)     // pid or 'band:'+bid

  const bandTitle = (b) => b.title || (b.tkey ? s.mgBands[b.tkey] : '') || '—'

  /* ---------- actions ---------- */
  const addProc = (bid) => {
    let newId = null
    mutate(d => {
      const b = d.bands.find(x => x.id === bid); if (!b) return
      newId = 'p' + uid()
      b.procs.push({ id: newId, name: '', resp: '', desc: '', phases: ['ongoing'], tags: [], subs: [] })
    })
    if (newId) setEditing({ bid, pid: newId })
  }
  const delProc = (bid, pid) => {
    if (!window.confirm(s.mgDelProcConfirm)) return
    if (editing?.pid === pid) setEditing(null)
    mutate(d => {
      const b = d.bands.find(x => x.id === bid); if (!b) return
      b.procs = b.procs.filter(p => p.id !== pid)
    })
  }
  const saveProc = (bid, pid, draft) => {
    mutate(d => {
      const b = d.bands.find(x => x.id === bid); if (!b) return
      const i = b.procs.findIndex(p => p.id === pid); if (i === -1) return
      const p = { ...b.procs[i], ...draft, id: pid }
      if (draft.bandId && draft.bandId !== bid) {
        b.procs.splice(i, 1)
        const nb = d.bands.find(x => x.id === draft.bandId)
        if (nb) nb.procs.push(p); else b.procs.splice(i, 0, p)
      } else b.procs[i] = p
      delete p.bandId
    })
    setEditing(null)
  }
  const addBand = () => {
    const t = window.prompt(s.mgBandTitle); if (!t?.trim()) return
    mutate(d => { d.bands.push({ id: 'b' + uid(), title: t.trim(), color: PALETTE[d.bands.length % PALETTE.length], procs: [] }) })
  }
  const saveBand = (bid, draft) => {
    mutate(d => {
      const b = d.bands.find(x => x.id === bid); if (!b) return
      b.title = draft.title; delete b.tkey
      if (draft.pref?.trim()) b.pref = draft.pref.trim().toUpperCase()
      if (draft.color) b.color = draft.color
    })
    setBandEdit(null)
  }
  const delBand = (bid) => {
    const b = doc.bands.find(x => x.id === bid)
    if (b?.procs?.length) { window.alert(s.mgDelBandBlocked); return }
    setBandEdit(null)
    mutate(d => { d.bands = d.bands.filter(x => x.id !== bid) })
  }
  const toggleStandard = (st) => {
    mutate(d => {
      d.standards = d.standards.includes(st)
        ? d.standards.filter(x => x !== st)
        : [...d.standards, st]
    })
  }

  /* ---------- drag & drop ---------- */
  const onDrop = (bid, beforePid) => {
    const src = dragRef.current; dragRef.current = null; setDropHint(null)
    if (!src) return
    mutate(d => {
      const sb = d.bands.find(x => x.id === src.bid); if (!sb) return
      const i = sb.procs.findIndex(p => p.id === src.pid); if (i === -1) return
      const [moved] = sb.procs.splice(i, 1)
      const tb = d.bands.find(x => x.id === bid) || sb
      if (beforePid && beforePid !== src.pid) {
        const j = tb.procs.findIndex(p => p.id === beforePid)
        tb.procs.splice(j === -1 ? tb.procs.length : j, 0, moved)
      } else tb.procs.push(moved)
    })
  }

  return (
    <div className="mg-map">
      <p className="proj-meta mg-map-hint">{s.mgMapHint}</p>

      {/* project-level ISO standards configuration */}
      <div className="mg-std-bar">
        <span className="mg-std-label">{s.mgStandards}:</span>
        {STANDARDS.map(st => {
          const active = doc.standards.includes(st)
          if (!canEdit && !active) return null
          return (
            <button key={st} type="button"
              className={'mg-std-chip' + (active ? ' active' : '')}
              title={canEdit ? s.mgStandardsHint : undefined}
              onClick={canEdit ? () => toggleStandard(st) : undefined}>
              {ISO_LABEL[st]}
            </button>
          )
        })}
      </div>

      {doc.bands.map(b => (
        <section key={b.id} className="mg-band" style={{ '--pb': b.color }}>
          {bandEdit === b.id && canEdit ? (
            <BandEditor band={b} title={bandTitle(b)} s={s}
              onSave={(draft) => saveBand(b.id, draft)}
              onDelete={() => delBand(b.id)}
              onCancel={() => setBandEdit(null)} />
          ) : (
            <div className="mg-band-head">
              <h3 {...(canEdit ? { className: 'mg-band-tit-edit', title: s.mgBandEditHint, onClick: () => setBandEdit(b.id) } : {})}>
                {bandTitle(b)}
              </h3>
              {canEdit && <button className="mg-add" onClick={() => addProc(b.id)}>{s.mgAddProc}</button>}
            </div>
          )}

          <div className={'mg-grid' + (dropHint === 'band:' + b.id ? ' drop-active' : '')}
            {...(canEdit ? {
              onDragOver: (e) => { e.preventDefault(); setDropHint('band:' + b.id) },
              onDragLeave: () => setDropHint(h => h === 'band:' + b.id ? null : h),
              onDrop: (e) => { e.preventDefault(); onDrop(b.id, null) },
            } : {})}>
            {PHASES.map((f, k) => (
              <div key={f} className="mg-fase-head" style={{ gridColumn: k + 1 }}>{s.mgPhases[f]}</div>
            ))}
            {b.procs.length === 0 && <p className="mg-band-empty">{s.mgEmptyBand}</p>}
            {b.procs.map(p => (
              editing && editing.bid === b.id && editing.pid === p.id ? (
                <ProcEditor key={p.id} proc={p} bands={doc.bands} bandId={b.id}
                  bandTitle={bandTitle} standards={doc.standards} s={s}
                  onSave={(draft) => saveProc(b.id, p.id, draft)}
                  onCancel={() => setEditing(null)} />
              ) : (
                <ProcCard key={p.id} proc={p} canEdit={canEdit} s={s}
                  dropHint={dropHint === p.id}
                  onOpenSub={onOpenSub}
                  onEdit={() => setEditing({ bid: b.id, pid: p.id })}
                  onDelete={() => delProc(b.id, p.id)}
                  drag={canEdit ? {
                    onDragStart: () => { dragRef.current = { bid: b.id, pid: p.id } },
                    onDragEnd: () => { dragRef.current = null; setDropHint(null) },
                    onDragOver: (e) => { e.preventDefault(); e.stopPropagation(); setDropHint(p.id) },
                    onDragLeave: () => setDropHint(h => h === p.id ? null : h),
                    onDrop: (e) => { e.preventDefault(); e.stopPropagation(); onDrop(b.id, p.id) },
                  } : null} />
              )
            ))}
          </div>
        </section>
      ))}

      {canEdit && <button className="mg-band-add" onClick={addBand}>{s.mgAddBand}</button>}
    </div>
  )
}

/* ---------- read card ---------- */
function ProcCard({ proc: p, canEdit, s, onEdit, onDelete, drag, dropHint, onOpenSub }) {
  const sp = phaseSpan(p)
  return (
    <div className={'mg-card' + (dropHint ? ' drop-hint' : '')}
      style={{ gridColumn: `${sp.start} / span ${sp.span}` }}
      draggable={!!drag}
      {...(drag || {})}>
      {canEdit && (
        <div className="mg-tools">
          <button title={s.mgEdit} onClick={onEdit}>✎</button>
          <button title={s.mgDelete} onClick={onDelete}>×</button>
        </div>
      )}
      <div className="mg-code">{p.code}</div>
      <div className="mg-name">{p.name || s.mgNoName}</div>
      {(p.tags || []).length > 0 && (
        <div className="mg-tags">
          {p.tags.map(t => <span key={t} className="mg-tag">{ISO_LABEL[t]}</span>)}
        </div>
      )}
      {!!p.resp?.trim() && <div className="mg-resp">👤 {p.resp}</div>}
      {!!p.desc?.trim() && <div className="mg-desc">{p.desc}</div>}
      {p.subs.length > 0 && (
        <div className="mg-subs">
          {p.subs.map(sb => {
            const n = (sb.activities || []).length + (sb.risks || []).length
            return (
              <div key={sb.id} className="mg-sub mg-sub-open" title={s.mgOpenFicha}
                onClick={(e) => { e.stopPropagation(); onOpenSub(sb.id) }}>
                <span className="mg-sub-code">{sb.code}</span>
                <span className="mg-sub-name">{sb.name || s.mgNoName}</span>
                {!!sb.resp?.trim() && <span className="mg-sub-resp">👤 {sb.resp}</span>}
                <span className={'mg-sub-badge' + (n ? '' : ' empty')}>
                  {n ? n : s.open}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ---------- inline process editor (spans the three phase columns) ---------- */
function ProcEditor({ proc, bands, bandId, bandTitle, standards, s, onSave, onCancel }) {
  const [d, setD] = useState(() => ({
    name: proc.name || '', resp: proc.resp || '', desc: proc.desc || '',
    phases: [...(proc.phases || ['ongoing'])],
    tags: [...(proc.tags || [])],
    subs: (proc.subs || []).map(x => ({ ...x })),
    bandId,
  }))
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }))
  const togglePhase = (f) => set('phases',
    d.phases.includes(f) ? d.phases.filter(x => x !== f) : [...d.phases, f])
  const toggleTag = (t) => set('tags',
    d.tags.includes(t) ? d.tags.filter(x => x !== t) : [...d.tags, t])

  return (
    <div className="mg-card mg-card-edit" style={{ gridColumn: '1 / span 3' }}>
      <div className="mg-code" title={s.mgAutoCode}>{proc.code}</div>
      <label>{s.mgName}
        <input autoFocus value={d.name} onChange={e => set('name', e.target.value)} />
      </label>
      <label>{s.mgResp}
        <input list="mgPeople" value={d.resp} onChange={e => set('resp', e.target.value)} />
      </label>
      <label>{s.mgDesc}
        <textarea rows="3" value={d.desc} onChange={e => set('desc', e.target.value)} />
      </label>
      <label>{s.mgBand}
        <select value={d.bandId} onChange={e => set('bandId', e.target.value)}>
          {bands.map(b => <option key={b.id} value={b.id}>{bandTitle(b)}</option>)}
        </select>
      </label>
      <div className="mg-phase-row">
        <span>{s.mgPhaseHint}</span>
        {PHASES.map(f => (
          <label key={f} className="mg-phase-check">
            <input type="checkbox" checked={d.phases.includes(f)} onChange={() => togglePhase(f)} />
            {' '}{s.mgPhases[f]}
          </label>
        ))}
      </div>
      {standards.length > 0 && (
        <div className="mg-phase-row">
          <span>{s.mgTagsHint}</span>
          {standards.map(t => (
            <label key={t} className="mg-phase-check">
              <input type="checkbox" checked={d.tags.includes(t)} onChange={() => toggleTag(t)} />
              {' '}{ISO_LABEL[t]}
            </label>
          ))}
        </div>
      )}

      <div className="mg-subs-box">
        <div className="mg-subs-head">{s.mgSubs}
          <button type="button" className="mg-add"
            onClick={() => set('subs', [...d.subs, { name: '', resp: '', desc: '' }])}>
            {s.mgAddSub}
          </button>
        </div>
        {d.subs.map((sb, i) => (
          <div key={sb.id || i} className="mg-sub-row">
            <span className="mg-sub-autocode" title={s.mgAutoCodeSub}>
              {'S' + String(i + 1).padStart(2, '0') + '-' + proc.code}
            </span>
            <input placeholder={s.mgSubPh} value={sb.name}
              onChange={e => set('subs', d.subs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <input list="mgPeople" placeholder={s.mgResp} value={sb.resp || ''}
              onChange={e => set('subs', d.subs.map((x, j) => j === i ? { ...x, resp: e.target.value } : x))} />
            <button type="button" className="mg-sub-del" title={s.mgDelete}
              onClick={() => window.confirm(s.mgDelSubConfirm)
                && set('subs', d.subs.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
        {d.subs.length > 0 && <p className="mg-subs-note">{s.mgSubsNote}</p>}
      </div>

      <div className="mg-edit-btns">
        <button className="btn btn-primary btn-xs" onClick={() => onSave(d)}>{s.mgSave}</button>
        <button className="btn btn-ghost btn-xs" onClick={onCancel}>{s.mgCancel}</button>
      </div>
    </div>
  )
}

/* ---------- inline band editor ---------- */
function BandEditor({ band, title, s, onSave, onDelete, onCancel }) {
  const [t, setT] = useState(title)
  const [pref, setPref] = useState(band.pref || '')
  const [color, setColor] = useState(band.color)
  return (
    <div className="mg-band-editor">
      <label>{s.mgBandTitle}<input value={t} onChange={e => setT(e.target.value)} /></label>
      <label>{s.mgBandPref}<input value={pref} onChange={e => setPref(e.target.value)} /></label>
      <div className="mg-swatches">
        {PALETTE.map(c => (
          <button key={c} type="button"
            className={'mg-swatch' + (c === color ? ' active' : '')}
            style={{ background: c }} onClick={() => setColor(c)} aria-label={c} />
        ))}
      </div>
      <div className="mg-edit-btns">
        <button className="btn btn-primary btn-xs"
          onClick={() => onSave({ title: t.trim() || title, pref, color })}>{s.mgSave}</button>
        <button className="btn btn-ghost btn-xs" onClick={onCancel}>{s.mgCancel}</button>
        <button className="btn btn-ghost btn-xs mg-band-del" onClick={onDelete}>{s.mgDelete}</button>
      </div>
    </div>
  )
}

/* ==================== SUBPROCESS ACTIVITIES SHEET ====================
   Independent page per subprocess: header (context + owner), activities
   added one by one (Activity · Input · Output · Evidence, auto codes A01…)
   and a risk register with automatic value (Probability × Impact) and level. */
function SubFicha({ doc, mutate, canEdit, s, subId, onBack }) {
  const hit = findSub(doc, subId)

  const mutateSub = (fn) => mutate(d => {
    const h = findSub(d, subId); if (h) fn(h.sub, h)
  })

  if (!hit) {
    return (
      <div className="mg-ficha">
        <button className="btn btn-ghost btn-xs" onClick={onBack}>← {s.mgTabs.map}</button>
        <p className="form-status err">{s.mgNotFound}</p>
      </div>
    )
  }
  const { band, proc, sub } = hit
  const bandName = band.title || (band.tkey ? s.mgBands[band.tkey] : '') || '—'

  return (
    <div className="mg-ficha" style={{ '--pb': band.color }}>
      <div className="mg-ficha-head">
        <button className="btn btn-ghost btn-xs" onClick={onBack}>← {s.mgTabs.map}</button>
        <span className="proj-meta">{bandName} · {proc.code} {proc.name || s.mgNoName}</span>
      </div>

      <div className="mg-ficha-title">
        <span className="mg-code">{sub.code}</span>
        {canEdit ? (
          <>
            <input className="mg-ficha-name" placeholder={s.mgSubPh} value={sub.name}
              onChange={e => mutateSub(sb => { sb.name = e.target.value })} />
            <input className="mg-ficha-resp" list="mgPeople" placeholder={s.mgResp}
              value={sub.resp || ''}
              onChange={e => mutateSub(sb => { sb.resp = e.target.value })} />
          </>
        ) : (
          <>
            <h2>{sub.name || s.mgNoName}</h2>
            {!!sub.resp?.trim() && <span className="mg-resp">👤 {sub.resp}</span>}
          </>
        )}
      </div>
      <p className="proj-meta mg-map-hint">{s.mgFichaHint}</p>

      {/* -------------------- activities -------------------- */}
      <section className="mg-ficha-sec">
        <div className="mg-subs-head">
          {s.mgActivities} <em className="mg-count">{sub.activities.length}</em>
          {canEdit && (
            <button type="button" className="mg-add"
              onClick={() => mutateSub(sb => sb.activities.push({ name: '', input: '', output: '', evidence: '' }))}>
              {s.mgAddActivity}
            </button>
          )}
        </div>
        {sub.activities.length === 0 ? <p className="mg-band-empty">{s.mgActEmpty}</p> : (
          <div className="mg-act-table">
            <div className="mg-act-row mg-act-headrow">
              <span />
              <span>{s.mgActivity}</span>
              <span>{s.mgInput}</span>
              <span>{s.mgOutput}</span>
              <span>{s.mgEvidence}</span>
              <span />
            </div>
            {sub.activities.map((a, i) => (
              <div key={a.id} className="mg-act-row">
                <span className="mg-sub-autocode" title={s.mgAutoCode}>{a.code}</span>
                {['name', 'input', 'output', 'evidence'].map(k => (
                  canEdit ? (
                    <textarea key={k} rows="1" value={a[k]}
                      placeholder={{ name: s.mgActivity, input: s.mgInput, output: s.mgOutput, evidence: s.mgEvidence }[k]}
                      onChange={e => mutateSub(sb => { sb.activities[i][k] = e.target.value })} />
                  ) : <span key={k} className="mg-act-cell">{a[k] || '—'}</span>
                ))}
                {canEdit ? (
                  <span className="mg-row-tools">
                    <button title="↑" disabled={i === 0}
                      onClick={() => mutateSub(sb => {
                        [sb.activities[i - 1], sb.activities[i]] = [sb.activities[i], sb.activities[i - 1]]
                      })}>▲</button>
                    <button title="↓" disabled={i === sub.activities.length - 1}
                      onClick={() => mutateSub(sb => {
                        [sb.activities[i + 1], sb.activities[i]] = [sb.activities[i], sb.activities[i + 1]]
                      })}>▼</button>
                    <button title={s.mgDelete}
                      onClick={() => window.confirm(s.mgDelRowConfirm)
                        && mutateSub(sb => sb.activities.splice(i, 1))}>×</button>
                  </span>
                ) : <span />}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* -------------------- risks -------------------- */}
      <section className="mg-ficha-sec">
        <div className="mg-subs-head">
          {s.mgRisks} <em className="mg-count">{sub.risks.length}</em>
          {canEdit && (
            <button type="button" className="mg-add"
              onClick={() => mutateSub(sb => sb.risks.push({ desc: '', prob: 1, impact: 1, treatment: '' }))}>
              {s.mgAddRisk}
            </button>
          )}
        </div>
        {sub.risks.length === 0 ? <p className="mg-band-empty">{s.mgRiskEmpty}</p> : (
          <div className="mg-risk-table">
            <div className="mg-risk-row mg-act-headrow">
              <span />
              <span>{s.mgRisk}</span>
              <span>{s.mgProb}</span>
              <span>{s.mgImpact}</span>
              <span>{s.mgValue}</span>
              <span>{s.mgTreatment}</span>
              <span />
            </div>
            {sub.risks.map((r, i) => {
              const v = riskValue(r)
              const lvl = riskLevel(v)
              return (
                <div key={r.id} className="mg-risk-row">
                  <span className="mg-sub-autocode">{r.code}</span>
                  {canEdit ? (
                    <textarea rows="1" value={r.desc} placeholder={s.mgRisk}
                      onChange={e => mutateSub(sb => { sb.risks[i].desc = e.target.value })} />
                  ) : <span className="mg-act-cell">{r.desc || '—'}</span>}
                  {['prob', 'impact'].map(k => (
                    canEdit ? (
                      <select key={k} value={r[k]}
                        onChange={e => mutateSub(sb => { sb.risks[i][k] = Number(e.target.value) })}>
                        {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
                      </select>
                    ) : <span key={k} className="mg-act-cell">{r[k]}</span>
                  ))}
                  <span className={'mg-risk-value mg-risk-' + lvl} title={s.mgLevels[lvl]}>
                    {v} · {s.mgLevels[lvl]}
                  </span>
                  {canEdit ? (
                    <textarea rows="1" value={r.treatment} placeholder={s.mgTreatment}
                      onChange={e => mutateSub(sb => { sb.risks[i].treatment = e.target.value })} />
                  ) : <span className="mg-act-cell">{r.treatment || '—'}</span>}
                  {canEdit ? (
                    <span className="mg-row-tools">
                      <button title={s.mgDelete}
                        onClick={() => window.confirm(s.mgDelRowConfirm)
                          && mutateSub(sb => sb.risks.splice(i, 1))}>×</button>
                    </span>
                  ) : <span />}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

/* ================================ ROLES ================================
   Two sub-tabs: People and Functions. Each person links to a function and
   to whom they report; the Organization chart is built from that. */
function RolesTab({ doc, mutate, canEdit, s }) {
  const [sub, setSub] = useState('people')
  const [editing, setEditing] = useState(null)   // person or function id

  const fnById = useMemo(
    () => Object.fromEntries(doc.functions.map(f => [f.id, f])), [doc.functions])
  const pById = useMemo(
    () => Object.fromEntries(doc.people.map(p => [p.id, p])), [doc.people])
  const linkedCount = (fid) => doc.people.filter(p => p.functionId === fid).length

  /* descendants of a person (to exclude from the reports-to selector) */
  const descendants = (pid) => {
    const out = new Set()
    const walk = (id) => doc.people.filter(p => p.reportsTo === id).forEach(c => {
      if (!out.has(c.id)) { out.add(c.id); walk(c.id) }
    })
    walk(pid)
    return out
  }

  /* ---------- people actions ---------- */
  const addPerson = () => {
    let newId = null
    mutate(d => {
      newId = 'u' + uid()
      d.people.push({ id: newId, name: '', functionId: null, reportsTo: null })
    })
    if (newId) setEditing(newId)
  }
  const savePerson = (pid, draft) => {
    mutate(d => {
      const p = d.people.find(x => x.id === pid); if (!p) return
      p.name = draft.name.trim()
      p.functionId = draft.functionId || null
      p.reportsTo = draft.reportsTo || null
    })
    setEditing(null)
  }
  const delPerson = (pid) => {
    if (!window.confirm(s.mgDelPersonConfirm)) return
    if (editing === pid) setEditing(null)
    mutate(d => {
      const gone = d.people.find(x => x.id === pid)
      d.people.forEach(p => { if (p.reportsTo === pid) p.reportsTo = gone?.reportsTo ?? null })
      d.people = d.people.filter(x => x.id !== pid)
    })
  }

  /* ---------- function actions ---------- */
  const addFunction = () => {
    let newId = null
    mutate(d => {
      newId = 'f' + uid()
      d.functions.push({ id: newId, name: '', desc: '' })
    })
    if (newId) setEditing(newId)
  }
  const saveFunction = (fid, draft) => {
    mutate(d => {
      const f = d.functions.find(x => x.id === fid); if (!f) return
      f.name = draft.name.trim(); f.desc = draft.desc
    })
    setEditing(null)
  }
  const delFunction = (fid) => {
    const n = linkedCount(fid)
    if (!window.confirm(n ? s.mgDelFnLinkedConfirm.replace('{n}', n) : s.mgDelFnConfirm)) return
    if (editing === fid) setEditing(null)
    mutate(d => {
      d.people.forEach(p => { if (p.functionId === fid) p.functionId = null })
      d.functions = d.functions.filter(x => x.id !== fid)
    })
  }

  return (
    <div className="mg-roles">
      <p className="proj-meta mg-map-hint">{s.mgRolesHint}</p>

      <div className="mg-subtabs">
        {['people', 'functions'].map(t => (
          <button key={t}
            className={'mg-subtab' + (sub === t ? ' active' : '')}
            onClick={() => { setSub(t); setEditing(null) }}>
            {s.mgRolesTabs[t]}
            <em>{t === 'people' ? doc.people.length : doc.functions.length}</em>
          </button>
        ))}
        {canEdit && (
          <button className="mg-add mg-subtabs-add"
            onClick={sub === 'people' ? addPerson : addFunction}>
            {sub === 'people' ? s.mgAddPerson : s.mgAddFunction}
          </button>
        )}
      </div>

      {sub === 'people' ? (
        doc.people.length === 0
          ? <p className="mg-band-empty">{s.mgPeopleEmpty}</p>
          : (
            <div className="mg-rows">
              {doc.people.map(p => (
                editing === p.id && canEdit ? (
                  <PersonEditor key={p.id} person={p} functions={doc.functions}
                    people={doc.people.filter(x => x.id !== p.id && !descendants(p.id).has(x.id))}
                    s={s}
                    onSave={(draft) => savePerson(p.id, draft)}
                    onCancel={() => setEditing(null)} />
                ) : (
                  <div key={p.id} className="mg-row">
                    <b className="mg-row-name">{p.name || s.mgNoName}</b>
                    <span className={'mg-chip' + (p.functionId ? '' : ' empty')}>
                      {p.functionId
                        ? `${fnById[p.functionId]?.code} · ${fnById[p.functionId]?.name || s.mgNoName}`
                        : s.mgUnassigned}
                    </span>
                    <span className="mg-row-meta">
                      {p.reportsTo
                        ? `${s.mgReportsTo}: ${pById[p.reportsTo]?.name || s.mgNoName}`
                        : s.mgTopLevel}
                    </span>
                    {canEdit && (
                      <span className="mg-row-tools">
                        <button title={s.mgEdit} onClick={() => setEditing(p.id)}>✎</button>
                        <button title={s.mgDelete} onClick={() => delPerson(p.id)}>×</button>
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>
          )
      ) : (
        doc.functions.length === 0
          ? <p className="mg-band-empty">{s.mgFunctionsEmpty}</p>
          : (
            <div className="mg-rows">
              {doc.functions.map(f => (
                editing === f.id && canEdit ? (
                  <FunctionEditor key={f.id} fn={f} s={s}
                    onSave={(draft) => saveFunction(f.id, draft)}
                    onCancel={() => setEditing(null)} />
                ) : (
                  <div key={f.id} className="mg-row">
                    <span className="mg-code">{f.code}</span>
                    <b className="mg-row-name">{f.name || s.mgNoName}</b>
                    <span className="mg-chip">{linkedCount(f.id)} {s.mgPeopleLinked}</span>
                    {!!f.desc?.trim() && <span className="mg-row-meta mg-row-desc">{f.desc}</span>}
                    {canEdit && (
                      <span className="mg-row-tools">
                        <button title={s.mgEdit} onClick={() => setEditing(f.id)}>✎</button>
                        <button title={s.mgDelete} onClick={() => delFunction(f.id)}>×</button>
                      </span>
                    )}
                  </div>
                )
              ))}
            </div>
          )
      )}
    </div>
  )
}

function PersonEditor({ person, functions, people, s, onSave, onCancel }) {
  const [d, setD] = useState(() => ({
    name: person.name || '',
    functionId: person.functionId || '',
    reportsTo: person.reportsTo || '',
  }))
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }))
  return (
    <div className="mg-row mg-row-edit">
      <label>{s.mgPerson}
        <input autoFocus list="mgPeople" value={d.name} onChange={e => set('name', e.target.value)} />
      </label>
      <label>{s.mgFunction}
        <select value={d.functionId} onChange={e => set('functionId', e.target.value)}>
          <option value="">{s.mgUnassigned}</option>
          {functions.map(f => <option key={f.id} value={f.id}>{f.code} · {f.name || s.mgNoName}</option>)}
        </select>
      </label>
      <label>{s.mgReportsTo}
        <select value={d.reportsTo} onChange={e => set('reportsTo', e.target.value)}>
          <option value="">{s.mgTopLevel}</option>
          {people.map(p => <option key={p.id} value={p.id}>{p.name || s.mgNoName}</option>)}
        </select>
      </label>
      <div className="mg-edit-btns">
        <button className="btn btn-primary btn-xs" onClick={() => onSave(d)}>{s.mgSave}</button>
        <button className="btn btn-ghost btn-xs" onClick={onCancel}>{s.mgCancel}</button>
      </div>
    </div>
  )
}

function FunctionEditor({ fn, s, onSave, onCancel }) {
  const [d, setD] = useState(() => ({ name: fn.name || '', desc: fn.desc || '' }))
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }))
  return (
    <div className="mg-row mg-row-edit">
      <span className="mg-code" title={s.mgAutoCode}>{fn.code}</span>
      <label>{s.mgFnName}
        <input autoFocus value={d.name} onChange={e => set('name', e.target.value)} />
      </label>
      <label>{s.mgFnDesc}
        <textarea rows="2" value={d.desc} onChange={e => set('desc', e.target.value)} />
      </label>
      <div className="mg-edit-btns">
        <button className="btn btn-primary btn-xs" onClick={() => onSave(d)}>{s.mgSave}</button>
        <button className="btn btn-ghost btn-xs" onClick={onCancel}>{s.mgCancel}</button>
      </div>
    </div>
  )
}

/* ============================ ORGANIZATION CHART ============================
   Built automatically from Roles · People: each person hangs from whom they
   report, showing their linked function under the name. */
function OrgChart({ doc, s, onGoRoles }) {
  const fnById = useMemo(
    () => Object.fromEntries(doc.functions.map(f => [f.id, f])), [doc.functions])
  const kids = (pid) => doc.people.filter(p => (p.reportsTo || null) === pid)
  const roots = kids(null)

  const Node = ({ p }) => {
    const fn = p.functionId ? fnById[p.functionId] : null
    const children = kids(p.id)
    return (
      <li>
        <div className="org-card">
          <b>{p.name || s.mgNoName}</b>
          <span className={fn ? 'org-fn' : 'org-fn empty'}>
            {fn ? `${fn.code} · ${fn.name || s.mgNoName}` : s.mgUnassigned}
          </span>
        </div>
        {children.length > 0 && (
          <ul>{children.map(c => <Node key={c.id} p={c} />)}</ul>
        )}
      </li>
    )
  }

  return (
    <div className="mg-org">
      <p className="proj-meta mg-map-hint">{s.mgOrgHint}</p>
      {roots.length === 0 ? (
        <div className="mg-band-empty mg-org-empty">
          <p>{s.mgOrgEmpty}</p>
          <button className="btn btn-ghost btn-xs" onClick={onGoRoles}>{s.mgRolesTabs.people} →</button>
        </div>
      ) : (
        <div className="org-scroll">
          <ul className="org-tree org-top">
            {roots.map(p => <Node key={p.id} p={p} />)}
          </ul>
        </div>
      )}
    </div>
  )
}
