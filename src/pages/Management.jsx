import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useLang } from '../i18n.jsx'
import PmShell from '../components/PmShell.jsx'
import { PORTAL_STRINGS } from '../data/orbitalPortal.js'

/**
 * Management & Governance System — per-project workspace.
 *   /portal/management/:id            → Process map (default tab)
 *   /portal/management/:id/:tab       → map | org | roles | bodies
 *
 * Process map follows the Mas Camarena structure: dynamic bands (the three
 * classic ones seeded), processes added one by one with automatic codes
 * (PREF-01, PREF-02…, recomputed on every reorder so there are never gaps),
 * Pre / Ongoing / Post columns with card spanning, subprocesses with
 * automatic S01-CODE codes, inline editing and drag & drop between bands.
 * The whole document lives in `management_maps.data` (jsonb, one per project).
 */
export default function Management() {
  const { id, tab } = useParams()
  if (!id) return <Navigate to="/portal/governance" replace />
  return <ManagementProject projectId={id} tab={tab || 'map'} />
}

const useS = () => {
  const { lang } = useLang()
  return [PORTAL_STRINGS[lang] || PORTAL_STRINGS.en, lang]
}

const MG_TABS = ['map', 'org', 'roles', 'bodies']
const PHASES = ['pre', 'ongoing', 'post']
const PALETTE = ['#52d3a2', '#5aa9e6', '#e5a54b', '#b07ae0', '#e06a8a', '#39c2c9', '#8fd14f', '#f0c34e']
const uid = () => Math.random().toString(36).slice(2, 9)

const seedDoc = () => ({
  bands: [
    { id: 'b_str', tkey: 'strategic', pref: 'PR-STR', color: '#52d3a2', procs: [] },
    { id: 'b_key', tkey: 'key',       pref: 'PR-KEY', color: '#5aa9e6', procs: [] },
    { id: 'b_sup', tkey: 'support',   pref: 'PR-SUP', color: '#e5a54b', procs: [] },
  ],
})

/* Infer a code prefix for user-created bands from their title (fixed once). */
function inferPref(band) {
  const t = String(band.title || 'GEN').toUpperCase()
  const word = t.replace(/[^A-Z0-9 ]/g, ' ').trim().split(/\s+/)[0] || 'GEN'
  return 'PR-' + (word.slice(0, 4) || 'GEN')
}

/* Normalise + recompute every code (band pref + position, subs S01-CODE).
   Recoding runs on every change, so codes never have gaps or duplicates. */
function normalize(doc) {
  const d = doc && Array.isArray(doc.bands) ? doc : seedDoc()
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
      if (!Array.isArray(p.subs)) p.subs = []
      p.subs.forEach((sb, k) => { sb.code = 'S' + String(k + 1).padStart(2, '0') + '-' + p.code })
    })
  })
  return d
}

function phaseSpan(p) {
  const idxs = (p.phases || []).map(f => PHASES.indexOf(f)).filter(i => i !== -1)
  if (!idxs.length) return { start: 2, span: 1 }
  const min = Math.min(...idxs), max = Math.max(...idxs)
  return { start: min + 1, span: max - min + 1 }
}

/* ========================= project shell + tabs ========================= */
function ManagementProject({ projectId, tab }) {
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

  const title = project
    ? [(project.code || ''), (isAr && project.title_ar) || project.title_en]
        .filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).join(' · ')
    : '…'

  const activeTab = MG_TABS.includes(tab) ? tab : 'map'

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
        </nav>

        {!canEdit && <p className="proj-meta mg-readonly">{s.mgReadOnly}</p>}

        {activeTab === 'map'
          ? <ProcessMap projectId={projectId} canEdit={canEdit} s={s} />
          : (
            <section className="portal-card wide mg-soon">
              <h3>{s.mgTabs[activeTab]}</h3>
              <p>{s.mgSoon}</p>
            </section>
          )}
      </div>
    </PmShell>
  )
}

/* ============================ PROCESS MAP ============================ */
function ProcessMap({ projectId, canEdit, s }) {
  const { user } = useAuth()
  const [doc, setDoc] = useState(null)
  const [saveState, setSaveState] = useState(null)   // null | saving | saved | error
  const [editing, setEditing] = useState(null)       // { bid, pid }
  const [bandEdit, setBandEdit] = useState(null)     // bid
  const docRef = useRef(null)
  const dirtyRef = useRef(false)
  const timerRef = useRef(null)
  const dragRef = useRef(null)                       // { bid, pid }
  const [dropHint, setDropHint] = useState(null)     // pid or 'band:'+bid

  /* ---------- load ---------- */
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

  /* ---------- autosave (debounced upsert of the whole document) ---------- */
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

  /* ---------- project members → owner suggestions ---------- */
  const [people, setPeople] = useState([])
  useEffect(() => {
    if (!supabase || !user) return
    Promise.all([
      supabase.from('project_members').select('user_id').eq('project_id', projectId),
      supabase.rpc('list_people_min').then(r => r).catch(() => ({ data: null })),
    ]).then(([m, p]) => {
      const byId = Object.fromEntries((p?.data ?? []).map(u => [u.id, u.full_name || u.email]))
      setPeople([...new Set((m?.data ?? []).map(x => byId[x.user_id]).filter(Boolean))])
    }).catch(() => {})
  }, [user, projectId])

  if (!doc) return <p className="proj-meta">…</p>

  const bandTitle = (b) => b.title || (b.tkey ? s.mgBands[b.tkey] : '') || '—'

  /* ---------- actions ---------- */
  const addProc = (bid) => {
    mutate(d => {
      const b = d.bands.find(x => x.id === bid); if (!b) return
      b.procs.push({ id: 'p' + uid(), name: '', resp: '', desc: '', phases: ['ongoing'], subs: [] })
    })
    const b = docRef.current.bands.find(x => x.id === bid)
    setEditing({ bid, pid: b.procs[b.procs.length - 1].id })
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
    const b = docRef.current.bands.find(x => x.id === bid)
    if (b?.procs?.length) { window.alert(s.mgDelBandBlocked); return }
    setBandEdit(null)
    mutate(d => { d.bands = d.bands.filter(x => x.id !== bid) })
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
      <div className="mg-map-bar">
        <p className="proj-meta mg-map-hint">{s.mgMapHint}</p>
        {saveState && (
          <span className={`mg-save mg-save-${saveState}`}>
            {saveState === 'saving' ? s.mgSaving : saveState === 'saved' ? s.mgSaved : s.mgSaveErr}
          </span>
        )}
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
                  bandTitle={bandTitle} people={people} s={s}
                  onSave={(draft) => saveProc(b.id, p.id, draft)}
                  onCancel={() => setEditing(null)} />
              ) : (
                <ProcCard key={p.id} proc={p} canEdit={canEdit} s={s}
                  dropHint={dropHint === p.id}
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

      {people.length > 0 && (
        <datalist id="mgPeople">
          {people.map(n => <option key={n} value={n} />)}
        </datalist>
      )}
    </div>
  )
}

/* ---------- read card ---------- */
function ProcCard({ proc: p, canEdit, s, onEdit, onDelete, drag, dropHint }) {
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
      {!!p.resp?.trim() && <div className="mg-resp">👤 {p.resp}</div>}
      {!!p.desc?.trim() && <div className="mg-desc">{p.desc}</div>}
      {p.subs.length > 0 && (
        <div className="mg-subs">
          {p.subs.map(sb => (
            <div key={sb.code} className="mg-sub">
              <span className="mg-sub-code">{sb.code}</span>
              <span className="mg-sub-name">{sb.name || s.mgNoName}</span>
              {!!sb.resp?.trim() && <span className="mg-sub-resp">👤 {sb.resp}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------- inline process editor (spans the three phase columns) ---------- */
function ProcEditor({ proc, bands, bandId, bandTitle, people, s, onSave, onCancel }) {
  const [d, setD] = useState(() => ({
    name: proc.name || '', resp: proc.resp || '', desc: proc.desc || '',
    phases: [...(proc.phases || ['ongoing'])],
    subs: (proc.subs || []).map(x => ({ ...x })),
    bandId,
  }))
  const set = (k, v) => setD(prev => ({ ...prev, [k]: v }))
  const togglePhase = (f) => set('phases',
    d.phases.includes(f) ? d.phases.filter(x => x !== f) : [...d.phases, f])

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

      <div className="mg-subs-box">
        <div className="mg-subs-head">{s.mgSubs}
          <button type="button" className="mg-add"
            onClick={() => set('subs', [...d.subs, { name: '', resp: '', desc: '' }])}>
            {s.mgAddSub}
          </button>
        </div>
        {d.subs.map((sb, i) => (
          <div key={i} className="mg-sub-row">
            <span className="mg-sub-autocode" title={s.mgAutoCodeSub}>
              {'S' + String(i + 1).padStart(2, '0') + '-' + proc.code}
            </span>
            <input placeholder={s.mgSubPh} value={sb.name}
              onChange={e => set('subs', d.subs.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
            <input list="mgPeople" placeholder={s.mgResp} value={sb.resp || ''}
              onChange={e => set('subs', d.subs.map((x, j) => j === i ? { ...x, resp: e.target.value } : x))} />
            <button type="button" className="mg-sub-del" title={s.mgDelete}
              onClick={() => set('subs', d.subs.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
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
