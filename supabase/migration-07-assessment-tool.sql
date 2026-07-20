-- ============================================================================
-- ORBITAL 360 PM TOOL — Migration 07 · O360 ASSESSMENT TOOL (part A)
--   · Modelo: assessment_criteria + assessment_questions (bilingüe EN/AR)
--   · Evaluaciones: assessments, scope, entities, sites, answers, documents,
--     findings, criterion_reviews, assignments
--   · RLS según patrón de origen: owner ∨ assessor asignado ∨ admin
--   · Storage: bucket privado assessment-evidence
--   · SEED: 7 criterios + CRITERIO 1 completo (10 preguntas EN/AR)
--     (Criterios 2–7 → migration-07b)
-- Ejecutar DESPUÉS de migration-06. Re-ejecutable.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) MODELO
-- ----------------------------------------------------------------------------
create table if not exists public.assessment_criteria (
  code          text primary key,           -- 'c1'..'c7'
  num           int  not null unique,
  title_en      text not null,
  title_ar      text not null,
  title_full_en text not null,
  title_full_ar text not null
);

create table if not exists public.assessment_questions (
  code          text primary key,           -- 'P 1.1'
  criterion_code text not null references public.assessment_criteria (code) on delete cascade,
  ref           text not null,              -- '1.1'
  sort          int  not null,
  block_en      text not null,
  block_ar      text not null,
  question_en   text not null,
  question_ar   text not null,
  context_en    text,
  context_ar    text,
  evidence_en   text,
  evidence_ar   text,
  levels_en     jsonb not null,             -- array[6] → score = index*20
  levels_ar     jsonb not null
);

-- ----------------------------------------------------------------------------
-- 2) EVALUACIONES
-- ----------------------------------------------------------------------------
create table if not exists public.assessments (
  id          uuid primary key default gen_random_uuid(),
  company_id  uuid not null references public.accounts (id) on delete cascade,
  title       text not null,
  status      text not null default 'in_progress'
              check (status in ('in_progress','submitted','assessed','closed')),
  created_by  uuid not null references auth.users (id),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists idx_assessments_company on public.assessments (company_id);

create table if not exists public.assessment_scope (
  assessment_id  uuid primary key references public.assessments (id) on delete cascade,
  scope          text,
  assessor_notes text,
  updated_at     timestamptz not null default now()
);

create table if not exists public.assessment_entities (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  legal_name    text not null,
  vat           text,
  assessor_notes text,
  created_at    timestamptz not null default now()
);

create table if not exists public.assessment_sites (
  id          uuid primary key default gen_random_uuid(),
  entity_id   uuid not null references public.assessment_entities (id) on delete cascade,
  name        text not null,
  address     text,
  workers     int,
  assessor_notes text,
  created_at  timestamptz not null default now()
);

create table if not exists public.assessment_assignments (
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  consultant_id uuid not null references auth.users (id) on delete cascade,
  assigned_by   uuid references auth.users (id),
  created_at    timestamptz not null default now(),
  primary key (assessment_id, consultant_id)
);

create table if not exists public.assessment_answers (
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  question_code text not null references public.assessment_questions (code),
  level         int  check (level between 0 and 5),      -- score = level*20
  justification text,
  updated_at    timestamptz not null default now(),
  updated_by    uuid references auth.users (id),
  primary key (assessment_id, question_code)
);

create table if not exists public.assessment_documents (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  question_code text not null references public.assessment_questions (code),
  filename      text not null,
  storage_path  text not null,
  size_bytes    bigint,
  uploaded_by   uuid references auth.users (id),
  created_at    timestamptz not null default now()
);

create table if not exists public.assessment_findings (
  id            uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references public.assessments (id) on delete cascade,
  question_code text not null references public.assessment_questions (code),
  type          text not null check (type in ('strength','improvement')),
  body          text not null,
  created_by    uuid references auth.users (id),
  created_at    timestamptz not null default now()
);

create table if not exists public.assessment_criterion_reviews (
  assessment_id  uuid not null references public.assessments (id) on delete cascade,
  criterion_code text not null references public.assessment_criteria (code),
  strengths      text,
  improvements   text,
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users (id),
  primary key (assessment_id, criterion_code)
);

-- ----------------------------------------------------------------------------
-- 3) HELPERS DE ACCESO  (patrón origen: owner ∨ assessor asignado ∨ admin)
-- ----------------------------------------------------------------------------
create or replace function public.can_view_assessment(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assessments a
    where a.id = aid and (
      a.created_by = auth.uid()
      or public.is_admin_or_above()
      or public.my_role() = 'account_manager'
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid())
      or exists (select 1 from public.user_product_access u
                  where u.account_id = a.company_id
                    and u.zone_code = 'assessment'
                    and u.user_id = auth.uid())
    )
  );
$$;

-- Cliente con derecho de escritura: propietario o miembro de la company con
-- grant edit/manage del producto assessment (y evaluación aún editable).
create or replace function public.can_edit_assessment_client(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.assessments a
    where a.id = aid
      and a.status in ('in_progress','submitted')
      and (
        a.created_by = auth.uid()
        or exists (select 1 from public.user_product_access u
                    where u.account_id = a.company_id
                      and u.zone_code = 'assessment'
                      and u.access_level in ('edit','manage')
                      and u.user_id = auth.uid())
      )
  ) or public.is_admin_or_above();
$$;

create or replace function public.is_assessment_assessor(aid uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select public.is_admin_or_above()
      or exists (select 1 from public.assessment_assignments x
                  where x.assessment_id = aid and x.consultant_id = auth.uid());
$$;

-- ¿En qué companies puede el usuario CREAR evaluaciones? (suscripción activa
-- del producto assessment + grant edit/manage, o admin)
create or replace function public.my_assessment_companies()
returns setof uuid
language sql stable security definer set search_path = public
as $$
  select s.account_id
    from public.subscriptions s
    join public.user_product_access u
      on u.account_id = s.account_id and u.zone_code = 'assessment'
   where s.zone_code = 'assessment'
     and s.status in ('trial','active')
     and u.user_id = auth.uid()
     and u.access_level in ('edit','manage')
  union
  select id from public.accounts where public.is_admin_or_above();
$$;

-- ----------------------------------------------------------------------------
-- 4) RLS
-- ----------------------------------------------------------------------------
alter table public.assessment_criteria         enable row level security;
alter table public.assessment_questions        enable row level security;
alter table public.assessments                 enable row level security;
alter table public.assessment_scope            enable row level security;
alter table public.assessment_entities         enable row level security;
alter table public.assessment_sites            enable row level security;
alter table public.assessment_assignments      enable row level security;
alter table public.assessment_answers          enable row level security;
alter table public.assessment_documents        enable row level security;
alter table public.assessment_findings         enable row level security;
alter table public.assessment_criterion_reviews enable row level security;

-- Modelo: lectura para autenticados; gestión solo admins
drop policy if exists "criteria read" on public.assessment_criteria;
create policy "criteria read" on public.assessment_criteria for select using (auth.uid() is not null);
drop policy if exists "criteria manage" on public.assessment_criteria;
create policy "criteria manage" on public.assessment_criteria for all
  using (public.is_admin_or_above()) with check (public.is_admin_or_above());
drop policy if exists "questions read" on public.assessment_questions;
create policy "questions read" on public.assessment_questions for select using (auth.uid() is not null);
drop policy if exists "questions manage" on public.assessment_questions;
create policy "questions manage" on public.assessment_questions for all
  using (public.is_admin_or_above()) with check (public.is_admin_or_above());

-- Assessments
drop policy if exists "assessments read" on public.assessments;
create policy "assessments read" on public.assessments for select
  using (public.can_view_assessment(id));
drop policy if exists "assessments insert" on public.assessments;
create policy "assessments insert" on public.assessments for insert with check (
  created_by = auth.uid() and company_id in (select public.my_assessment_companies())
);
drop policy if exists "assessments update" on public.assessments;
create policy "assessments update" on public.assessments for update using (
  public.can_edit_assessment_client(id) or public.is_assessment_assessor(id)
);
drop policy if exists "assessments delete" on public.assessments;
create policy "assessments delete" on public.assessments for delete
  using (public.is_admin_or_above());

-- Scope / entities / sites: ver → can_view; escribir → cliente editor;
-- assessor_notes las escribe el assessor vía UPDATE (misma política update
-- ampliada al assessor).
drop policy if exists "scope read" on public.assessment_scope;
create policy "scope read" on public.assessment_scope for select
  using (public.can_view_assessment(assessment_id));
drop policy if exists "scope write" on public.assessment_scope;
create policy "scope write" on public.assessment_scope for insert with check (
  public.can_edit_assessment_client(assessment_id)
);
drop policy if exists "scope update" on public.assessment_scope;
create policy "scope update" on public.assessment_scope for update using (
  public.can_edit_assessment_client(assessment_id) or public.is_assessment_assessor(assessment_id)
);

drop policy if exists "entities read" on public.assessment_entities;
create policy "entities read" on public.assessment_entities for select
  using (public.can_view_assessment(assessment_id));
drop policy if exists "entities write" on public.assessment_entities;
create policy "entities write" on public.assessment_entities for insert with check (
  public.can_edit_assessment_client(assessment_id)
);
drop policy if exists "entities update" on public.assessment_entities;
create policy "entities update" on public.assessment_entities for update using (
  public.can_edit_assessment_client(assessment_id) or public.is_assessment_assessor(assessment_id)
);
drop policy if exists "entities delete" on public.assessment_entities;
create policy "entities delete" on public.assessment_entities for delete using (
  public.can_edit_assessment_client(assessment_id)
);

drop policy if exists "sites read" on public.assessment_sites;
create policy "sites read" on public.assessment_sites for select using (
  exists (select 1 from public.assessment_entities e
           where e.id = entity_id and public.can_view_assessment(e.assessment_id))
);
drop policy if exists "sites write" on public.assessment_sites;
create policy "sites write" on public.assessment_sites for insert with check (
  exists (select 1 from public.assessment_entities e
           where e.id = entity_id and public.can_edit_assessment_client(e.assessment_id))
);
drop policy if exists "sites update" on public.assessment_sites;
create policy "sites update" on public.assessment_sites for update using (
  exists (select 1 from public.assessment_entities e
           where e.id = entity_id
             and (public.can_edit_assessment_client(e.assessment_id)
                  or public.is_assessment_assessor(e.assessment_id)))
);
drop policy if exists "sites delete" on public.assessment_sites;
create policy "sites delete" on public.assessment_sites for delete using (
  exists (select 1 from public.assessment_entities e
           where e.id = entity_id and public.can_edit_assessment_client(e.assessment_id))
);

-- Asignaciones: gestionan admins; las ven los implicados
drop policy if exists "assign read" on public.assessment_assignments;
create policy "assign read" on public.assessment_assignments for select using (
  public.is_admin_or_above() or consultant_id = auth.uid()
  or public.can_view_assessment(assessment_id)
);
drop policy if exists "assign manage" on public.assessment_assignments;
create policy "assign manage" on public.assessment_assignments for all
  using (public.is_admin_or_above()) with check (public.is_admin_or_above());

-- Respuestas: ver → can_view; escribir → cliente editor
drop policy if exists "answers read" on public.assessment_answers;
create policy "answers read" on public.assessment_answers for select
  using (public.can_view_assessment(assessment_id));
drop policy if exists "answers upsert" on public.assessment_answers;
create policy "answers upsert" on public.assessment_answers for insert with check (
  public.can_edit_assessment_client(assessment_id)
);
drop policy if exists "answers update" on public.assessment_answers;
create policy "answers update" on public.assessment_answers for update using (
  public.can_edit_assessment_client(assessment_id)
);

-- Documentos de evidencia (metadatos)
drop policy if exists "docs read" on public.assessment_documents;
create policy "docs read" on public.assessment_documents for select
  using (public.can_view_assessment(assessment_id));
drop policy if exists "docs insert" on public.assessment_documents;
create policy "docs insert" on public.assessment_documents for insert with check (
  public.can_edit_assessment_client(assessment_id) and uploaded_by = auth.uid()
);
drop policy if exists "docs delete" on public.assessment_documents;
create policy "docs delete" on public.assessment_documents for delete using (
  public.can_edit_assessment_client(assessment_id)
);

-- Findings y reviews: escribe SOLO assessor asignado (o admin); ve can_view
drop policy if exists "findings read" on public.assessment_findings;
create policy "findings read" on public.assessment_findings for select
  using (public.can_view_assessment(assessment_id));
drop policy if exists "findings write" on public.assessment_findings;
create policy "findings write" on public.assessment_findings for insert with check (
  public.is_assessment_assessor(assessment_id) and created_by = auth.uid()
);
drop policy if exists "findings delete" on public.assessment_findings;
create policy "findings delete" on public.assessment_findings for delete using (
  public.is_assessment_assessor(assessment_id)
);

drop policy if exists "reviews read" on public.assessment_criterion_reviews;
create policy "reviews read" on public.assessment_criterion_reviews for select
  using (public.can_view_assessment(assessment_id));
drop policy if exists "reviews write" on public.assessment_criterion_reviews;
create policy "reviews write" on public.assessment_criterion_reviews for insert with check (
  public.is_assessment_assessor(assessment_id)
);
drop policy if exists "reviews update" on public.assessment_criterion_reviews;
create policy "reviews update" on public.assessment_criterion_reviews for update using (
  public.is_assessment_assessor(assessment_id)
);

-- updated_at
drop trigger if exists trg_touch_assessments on public.assessments;
create trigger trg_touch_assessments before update on public.assessments
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_a_scope on public.assessment_scope;
create trigger trg_touch_a_scope before update on public.assessment_scope
  for each row execute function public.touch_updated_at();
drop trigger if exists trg_touch_a_answers on public.assessment_answers;
create trigger trg_touch_a_answers before update on public.assessment_answers
  for each row execute function public.touch_updated_at();

-- ----------------------------------------------------------------------------
-- 5) STORAGE — bucket privado de evidencias: <assessment_id>/<question>/<file>
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('assessment-evidence', 'assessment-evidence', false)
on conflict (id) do nothing;

drop policy if exists "evidence read" on storage.objects;
create policy "evidence read" on storage.objects for select using (
  bucket_id = 'assessment-evidence'
  and public.can_view_assessment((split_part(name, '/', 1))::uuid)
);
drop policy if exists "evidence insert" on storage.objects;
create policy "evidence insert" on storage.objects for insert with check (
  bucket_id = 'assessment-evidence'
  and public.can_edit_assessment_client((split_part(name, '/', 1))::uuid)
);
drop policy if exists "evidence delete" on storage.objects;
create policy "evidence delete" on storage.objects for delete using (
  bucket_id = 'assessment-evidence'
  and public.can_edit_assessment_client((split_part(name, '/', 1))::uuid)
);

-- ----------------------------------------------------------------------------
-- 6) SEED — CRITERIOS (EN/AR)
-- ----------------------------------------------------------------------------
insert into public.assessment_criteria (code, num, title_en, title_ar, title_full_en, title_full_ar) values
 ('c1', 1, 'Purpose, Vision & Strategy', 'الغاية والرؤية والاستراتيجية',
  'CRITERION 1 · PURPOSE, VISION & STRATEGY', 'المعيار 1 · الغاية والرؤية والاستراتيجية'),
 ('c2', 2, 'Organisational Culture & Leadership', 'الثقافة المؤسسية والقيادة',
  'CRITERION 2 · ORGANISATIONAL CULTURE & LEADERSHIP', 'المعيار 2 · الثقافة المؤسسية والقيادة'),
 ('c3', 3, 'Engaging People (Talent)', 'المواهب',
  'CRITERION 3 · TALENT', 'المعيار 3 · المواهب'),
 ('c4', 4, 'Partners & Suppliers', 'الشركاء والموردون',
  'CRITERION 4 · PARTNERS & SUPPLIERS', 'المعيار 4 · الشركاء والموردون'),
 ('c5', 5, 'Customers', 'العملاء',
  'CRITERION 5 · CUSTOMERS', 'المعيار 5 · العملاء'),
 ('c6', 6, 'Sustainability & Corporate Social Responsibility', 'الاستدامة والمسؤولية الاجتماعية للشركات',
  'CRITERION 6 · SUSTAINABILITY & CSR', 'المعيار 6 · الاستدامة والمسؤولية الاجتماعية'),
 ('c7', 7, 'Organisational Performance & Transformation', 'الأداء والتحول',
  'CRITERION 7 · PERFORMANCE & TRANSFORMATION', 'المعيار 7 · الأداء والتحول')
on conflict (code) do update set
  title_en = excluded.title_en, title_ar = excluded.title_ar,
  title_full_en = excluded.title_full_en, title_full_ar = excluded.title_full_ar;

-- ----------------------------------------------------------------------------
-- 7) SEED — CRITERIO 1 · 10 PREGUNTAS (EN/AR completos)
-- ----------------------------------------------------------------------------
insert into public.assessment_questions
  (code, criterion_code, ref, sort, block_en, block_ar, question_en, question_ar,
   context_en, context_ar, evidence_en, evidence_ar, levels_en, levels_ar)
values
('P 1.1','c1','1.1',1,
 'Purpose and vision','الغاية والرؤية',
 'Purpose / Mission of the organisation','غاية / رسالة المؤسسة',
 'The organisation''s reason for being: what it does and why it exists. Without a clear purpose there is no strategic direction.',
 'سبب وجود المؤسسة: ما الذي تقوم به ولماذا توجد. فبدون غاية واضحة لا يوجد توجه استراتيجي.',
 E'• Current strategic plan with the mission/purpose stated\n• Minutes of the Management Committee approving or reviewing the mission\n• Onboarding manual / corporate dossier\n• Mission published on the website and communicated to stakeholders\n• Stakeholder surveys on awareness of the purpose',
 E'• الخطة الاستراتيجية الحالية متضمنةً الرسالة/الغاية المعلنة\n• محضر لجنة الإدارة الذي يعتمد الرسالة أو يراجعها\n• دليل الاستقبال / الملف المؤسسي\n• نشر الرسالة على الموقع وإبلاغها لأصحاب المصلحة\n• استطلاعات لأصحاب المصلحة حول معرفة الغاية',
 '["No mission or purpose has been defined",
   "A purpose/mission has been defined that reflects the organisation''s activity",
   "A purpose/mission exists that reflects the activity and provides value to at least 40% of its stakeholder groups (customers, people, partners and suppliers, investors and regulators, society)",
   "A purpose/mission exists, reviewed in the last strategic cycle, providing value to at least 60% of its stakeholder groups",
   "A reviewed purpose/mission exists providing value to at least 80% of its stakeholder groups",
   "A reviewed purpose/mission exists, provides value to at least 80% and is perceived as a reference framework within its ecosystem"]'::jsonb,
 '["لم يتم تحديد رسالة أو غاية",
   "تم تحديد غاية/رسالة تعكس نشاط المؤسسة",
   "توجد غاية/رسالة تعكس النشاط وتوفر قيمة لما لا يقل عن 40% من فئات أصحاب المصلحة (العملاء، الأفراد، الشركاء والموردون، المستثمرون والجهات التنظيمية، المجتمع)",
   "توجد غاية/رسالة رُوجعت في آخر دورة استراتيجية وتوفر قيمة لما لا يقل عن 60% من فئات أصحاب المصلحة",
   "توجد غاية/رسالة مُراجعة توفر قيمة لما لا يقل عن 80% من فئات أصحاب المصلحة",
   "توجد غاية/رسالة مُراجعة توفر قيمة لما لا يقل عن 80% ويُنظر إليها كإطار مرجعي في منظومتها"]'::jsonb),

('P 1.2','c1','1.2',2,
 'Purpose and vision','الغاية والرؤية',
 'Stakeholder involvement in defining the purpose','إشراك أصحاب المصلحة في تحديد الغاية',
 'A purpose is only real when those it serves know it, understand it and feel part of it in a measurable, sustained way.',
 'لا تكون الغاية حقيقية إلا عندما يعرفها المعنيون بها ويفهمونها ويشعرون بأنهم جزء منها بشكل قابل للقياس ومستدام.',
 E'• Climate surveys with questions on identification with the purpose\n• Surveys of customers, partners and society on connection with the mission\n• Co-creation sessions or focus groups with stakeholders\n• Cultural adhesion indicators (engagement, internal NPS)\n• Annual measurement report with results broken down by stakeholder',
 E'• استطلاعات المناخ المؤسسي متضمنةً أسئلة حول التماهي مع الغاية\n• استطلاعات للعملاء والشركاء والمجتمع حول الارتباط بالرسالة\n• جلسات إبداع مشترك أو مجموعات تركيز مع أصحاب المصلحة\n• مؤشرات الالتزام الثقافي (الانخراط، NPS الداخلي)\n• تقرير قياس سنوي بنتائج مفصّلة حسب أصحاب المصلحة',
 '["No measurement plan is defined to know whether the purpose is inspiring and/or motivating",
   "Measurements exist showing the purpose is inspiring/motivating for 20% of stakeholder groups",
   "Measurements showing the purpose is inspiring/motivating for 40% of stakeholder groups",
   "Measurements showing the purpose is inspiring/motivating for 60% of stakeholder groups",
   "Measurements showing the purpose is inspiring/motivating for 80% of stakeholder groups",
   "Measurements showing the purpose is inspiring/motivating for 100% of stakeholder groups"]'::jsonb,
 '["لا توجد خطة قياس محددة لمعرفة ما إذا كانت الغاية ملهمة و/أو محفزة",
   "توجد قياسات تُظهر أن الغاية ملهمة/محفزة لـ 20% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الغاية ملهمة/محفزة لـ 40% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الغاية ملهمة/محفزة لـ 60% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الغاية ملهمة/محفزة لـ 80% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الغاية ملهمة/محفزة لـ 100% من فئات أصحاب المصلحة"]'::jsonb),

('P 1.3','c1','1.3',3,
 'Purpose and vision','الغاية والرؤية',
 'Vision of the organisation','رؤية المؤسسة',
 'Describes the desired short- and long-term future. An ambitious picture that guides strategic decisions and mobilises the whole organisation.',
 'تصف المستقبل المنشود على المديين القصير والطويل؛ صورة طموحة توجه القرارات الاستراتيجية وتحشد المؤسسة بأكملها.',
 E'• Formal vision document included in the strategic plan\n• Strategy map with a 3-5-10 year horizon\n• Minutes of vision-definition sessions with stakeholders\n• Scorecard with vision-achievement indicators\n• Improvement plan linked to the vision with owners and deadlines',
 E'• وثيقة رؤية رسمية ضمن الخطة الاستراتيجية\n• خريطة استراتيجية بأفق 3-5-10 سنوات\n• محاضر جلسات تحديد الرؤية مع أصحاب المصلحة\n• لوحة مؤشرات لقياس تحقق الرؤية\n• خطة تحسين مرتبطة بالرؤية مع مسؤولين ومواعيد',
 '["There is no evidence that the organisation has defined its vision",
   "A vision exists describing short-term achievements",
   "A vision exists, based on the purpose, describing short- and long-term achievements",
   "Short- and long-term vision involving its stakeholder groups (interested parties)",
   "Vision involving stakeholders with achievement indicators",
   "Vision involving stakeholders with achievement indicators and clear improvement objectives"]'::jsonb,
 '["لا يوجد دليل على أن المؤسسة حددت رؤيتها",
   "توجد رؤية تصف إنجازات قصيرة المدى",
   "توجد رؤية مبنية على الغاية تصف إنجازات قصيرة وطويلة المدى",
   "رؤية قصيرة وطويلة المدى بمشاركة فئات أصحاب المصلحة (الأطراف المعنية)",
   "رؤية بمشاركة أصحاب المصلحة مع مؤشرات لقياس التحقق",
   "رؤية بمشاركة أصحاب المصلحة مع مؤشرات تحقق وأهداف تحسين واضحة"]'::jsonb),

('P 1.4','c1','1.4',4,
 'Purpose and vision','الغاية والرؤية',
 'The vision is inspiring/motivating for stakeholders','الرؤية ملهمة/محفزة لأصحاب المصلحة',
 'A vision fulfils its role when it inspires and motivates people, customers and partners to move in the same shared direction.',
 'تؤدي الرؤية دورها عندما تلهم وتحفز الأفراد والعملاء والشركاء على التحرك في الاتجاه المشترك نفسه.',
 E'• Specific surveys on perception of the vision\n• Annual report with measurement results\n• Qualitative indicators (interviews) and quantitative ones (NPS)\n• Feedback sessions with key stakeholder groups\n• Balanced scorecard with a vision-identification indicator',
 E'• استطلاعات محددة حول إدراك الرؤية\n• تقرير سنوي بنتائج القياس\n• مؤشرات نوعية (مقابلات) وكمية (NPS)\n• جلسات تغذية راجعة مع فئات أصحاب المصلحة الرئيسية\n• لوحة قياس متوازنة بمؤشر التماهي مع الرؤية',
 '["No measurement plan exists to know whether the vision is inspiring/motivating",
   "Measurements showing the vision is inspiring/motivating for 20% of stakeholder groups",
   "Measurements showing the vision is inspiring/motivating for 40% of stakeholder groups",
   "Measurements showing the vision is inspiring/motivating for 60% of stakeholder groups",
   "Measurements showing the vision is inspiring/motivating for 80% of stakeholder groups",
   "Measurements showing the vision is inspiring/motivating for 100% of stakeholder groups"]'::jsonb,
 '["لا توجد خطة قياس لمعرفة ما إذا كانت الرؤية ملهمة/محفزة",
   "قياسات تُظهر أن الرؤية ملهمة/محفزة لـ 20% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الرؤية ملهمة/محفزة لـ 40% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الرؤية ملهمة/محفزة لـ 60% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الرؤية ملهمة/محفزة لـ 80% من فئات أصحاب المصلحة",
   "قياسات تُظهر أن الرؤية ملهمة/محفزة لـ 100% من فئات أصحاب المصلحة"]'::jsonb),

('P 1.5','c1','1.5',5,
 'Stakeholders','أصحاب المصلحة',
 'Key stakeholder groups (interested parties)','فئات أصحاب المصلحة الرئيسية (الأطراف المعنية)',
 'Identifying who impacts and is impacted by the organisation is the basis for designing balanced strategic relationships with each interested party.',
 'تحديد من يؤثر في المؤسسة ويتأثر بها هو الأساس لتصميم علاقات استراتيجية متوازنة مع كل طرف معني.',
 E'• Stakeholder map with prioritisation (power/interest matrix)\n• Stakeholder relationship plan (frequency, channel, owner)\n• Minutes of active-listening sessions with each group\n• Documented needs-and-expectations analysis\n• Strategic plan reflecting stakeholder inputs',
 E'• خريطة أصحاب المصلحة مع ترتيب الأولويات (مصفوفة القوة/الاهتمام)\n• خطة علاقات مع أصحاب المصلحة (التكرار، القناة، المسؤول)\n• محاضر جلسات إصغاء فعّال مع كل فئة\n• تحليل موثق للاحتياجات والتوقعات\n• خطة استراتيجية تعكس مدخلات أصحاب المصلحة',
 '["There is no evidence of identification of key stakeholder groups",
   "Identification and prioritisation of key stakeholder groups exists",
   "Identification, prioritisation, needs and expectations, and assessment of the impact of the purpose and vision on them",
   "A relationship system with key stakeholder groups exists (at least customers plus one other): identifies needs, expectations, impact and behaviour and involves them in the strategy",
   "Relationship system with most stakeholder groups (customers plus 2 secondary) identifying needs, expectations and impact and involving them in the strategy",
   "Relationship system with most stakeholder groups (customers plus 3 secondary) identifying needs, expectations and impact and involving them in the strategy"]'::jsonb,
 '["لا يوجد دليل على تحديد فئات أصحاب المصلحة الرئيسية",
   "يوجد تحديد وترتيب أولويات لفئات أصحاب المصلحة الرئيسية",
   "تحديد وترتيب أولويات واحتياجات وتوقعات وتقييم لأثر الغاية والرؤية عليهم",
   "يوجد نظام علاقات مع فئات أصحاب المصلحة الرئيسية (العملاء وفئة أخرى على الأقل): يحدد الاحتياجات والتوقعات والأثر والسلوك ويشركهم في الاستراتيجية",
   "نظام علاقات مع معظم فئات أصحاب المصلحة (العملاء وفئتان ثانويتان) يحدد الاحتياجات والتوقعات والأثر ويشركهم في الاستراتيجية",
   "نظام علاقات مع معظم فئات أصحاب المصلحة (العملاء وثلاث فئات ثانوية) يحدد الاحتياجات والتوقعات والأثر ويشركهم في الاستراتيجية"]'::jsonb),

('P 1.6','c1','1.6',6,
 'Ecosystem','المنظومة',
 'Definition of the ecosystem','تحديد المنظومة',
 'Understanding the full environment (markets, megatrends, risks) makes it possible to anticipate opportunities and threats beyond the short term in any sector.',
 'فهم البيئة الكاملة (الأسواق، الاتجاهات الكبرى، المخاطر) يتيح استباق الفرص والتهديدات بما يتجاوز المدى القصير في أي قطاع.',
 E'• PESTEL or equivalent analysis of the environment\n• Ecosystem map with value flows\n• Identification of sector megatrends\n• Up-to-date SWOT analysis\n• Ecosystem risk map with mitigation plans',
 E'• تحليل PESTEL أو ما يعادله للبيئة\n• خريطة المنظومة مع تدفقات القيمة\n• تحديد الاتجاهات الكبرى في القطاع\n• تحليل SWOT محدث\n• خريطة مخاطر المنظومة مع خطط التخفيف',
 '["There is no evidence of context analysis or identification of the ecosystem",
   "Only stakeholder groups have been identified",
   "Identification of stakeholder groups and their needs and expectations",
   "Ecosystem defined: stakeholder groups, scope, markets and megatrends",
   "Ecosystem defined with stakeholder relationship systems, scope, markets and megatrends",
   "Ecosystem defined with relationship systems and risk analysis of stakeholders, scope, markets and megatrends"]'::jsonb,
 '["لا يوجد دليل على تحليل السياق أو تحديد المنظومة",
   "يوجد تحديد لفئات أصحاب المصلحة فقط",
   "تحديد فئات أصحاب المصلحة واحتياجاتهم وتوقعاتهم",
   "منظومة محددة: فئات أصحاب المصلحة والنطاق والأسواق والاتجاهات الكبرى",
   "منظومة محددة مع أنظمة علاقات لأصحاب المصلحة والنطاق والأسواق والاتجاهات الكبرى",
   "منظومة محددة مع أنظمة علاقات وتحليل مخاطر لأصحاب المصلحة والنطاق والأسواق والاتجاهات الكبرى"]'::jsonb),

('P 1.7','c1','1.7',7,
 'Strategy','الاستراتيجية',
 'Strategy development','تطوير الاستراتيجية',
 'The strategy translates purpose and vision into a concrete plan that addresses environmental challenges and prioritises resources to reach objectives.',
 'تترجم الاستراتيجية الغاية والرؤية إلى خطة ملموسة تعالج تحديات البيئة وتحدد أولويات الموارد لتحقيق الأهداف.',
 E'• Current, formally approved strategic plan\n• Strategy map with identified priorities\n• Transformation initiatives with owners and metrics\n• Megatrend analysis incorporated into the plan\n• 10-year plan with scenarios and strategic options',
 E'• خطة استراتيجية حالية معتمدة رسمياً\n• خريطة استراتيجية بأولويات محددة\n• مبادرات تحول مع مسؤولين ومقاييس\n• تحليل الاتجاهات الكبرى مُدمج في الخطة\n• خطة لعشر سنوات مع سيناريوهات وخيارات استراتيجية',
 '["There is no evidence of a defined strategy to achieve the purpose",
   "A defined strategy exists showing how to achieve the purpose and addressing the main challenges",
   "Defined strategy addressing the main challenges and establishing strategic priorities",
   "Strategy with priorities, ensuring change-management actions and translated into performance objectives and transformation initiatives",
   "Strategy addressing main challenges based on megatrends, priorities, change management and transformation objectives",
   "Strategy based on megatrends analysed over a 10-year horizon, with priorities, change management and transformation objectives"]'::jsonb,
 '["لا يوجد دليل على استراتيجية محددة لتحقيق الغاية",
   "توجد استراتيجية محددة توضح كيفية تحقيق الغاية وتعالج التحديات الرئيسية",
   "استراتيجية محددة تعالج التحديات الرئيسية وتضع أولويات استراتيجية",
   "استراتيجية بأولويات تضمن إجراءات إدارة التغيير وتُترجم إلى أهداف أداء ومبادرات تحول",
   "استراتيجية تعالج التحديات الرئيسية بناءً على الاتجاهات الكبرى مع أولويات وإدارة تغيير وأهداف تحول",
   "استراتيجية مبنية على اتجاهات كبرى محللة بأفق عشر سنوات مع أولويات وإدارة تغيير وأهداف تحول"]'::jsonb),

('P 1.8','c1','1.8',8,
 'Strategy','الاستراتيجية',
 'Strategic objectives','الأهداف الاستراتيجية',
 'They turn the strategy into measurable goals. Without clear quantitative objectives there is no way to verify progress or ensure proper accountability.',
 'تحوّل الاستراتيجية إلى أهداف قابلة للقياس. فبدون أهداف كمية واضحة لا سبيل للتحقق من التقدم أو ضمان المساءلة السليمة.',
 E'• Balanced scorecard (BSC) with strategic objectives\n• Deployment of objectives by department/process\n• Internal and external communications on objectives\n• Quantitative SMART targets with owners and deadlines\n• Sector benchmark and positioning of the organisation',
 E'• لوحة قياس متوازنة (BSC) بالأهداف الاستراتيجية\n• نشر الأهداف حسب الإدارات/العمليات\n• اتصالات داخلية وخارجية حول الأهداف\n• أهداف SMART كمية مع مسؤولين ومواعيد\n• مقارنة معيارية قطاعية وتحديد موقع المؤسسة',
 '["No strategic objectives are defined",
   "Strategic objectives defined, based on the purpose, and implemented",
   "Strategic objectives defined, implemented and prioritised",
   "Strategic objectives reviewed in the last strategic cycle, implemented, prioritised and communicated to priority stakeholder groups",
   "Objectives reviewed, implemented, prioritised, communicated and turned into specific quantitative targets",
   "Objectives turned into specific quantitative targets with the aim of being the best"]'::jsonb,
 '["لا توجد أهداف استراتيجية محددة",
   "أهداف استراتيجية محددة مبنية على الغاية ومطبقة",
   "أهداف استراتيجية محددة ومطبقة ومرتبة حسب الأولوية",
   "أهداف استراتيجية رُوجعت في آخر دورة استراتيجية، مطبقة ومرتبة ومبلغة لفئات أصحاب المصلحة ذات الأولوية",
   "أهداف مُراجعة ومطبقة ومرتبة ومبلغة ومحولة إلى غايات كمية محددة",
   "أهداف محولة إلى غايات كمية محددة بهدف أن تكون المؤسسة الأفضل"]'::jsonb),

('P 1.9','c1','1.9',9,
 'Management and governance system','نظام الإدارة والحوكمة',
 'Management system (performance and operation)','نظام الإدارة (التشغيل والأداء)',
 'The set of processes ensuring day-to-day operations are aligned with the strategy and produce consistent, measurable and improvable results.',
 'مجموعة العمليات التي تضمن اتساق العمل اليومي مع الاستراتيجية وإنتاج نتائج متسقة وقابلة للقياس والتحسين.',
 E'• ISO 9001, ISO 14001, ISO 45001, ISO 27001 certificates\n• Integrated Management System manual\n• Process map with indicators\n• Internal and external audits with results\n• Systems-integration plan with owners',
 E'• شهادات ISO 9001 وISO 14001 وISO 45001 وISO 27001\n• دليل نظام الإدارة المتكامل\n• خريطة العمليات مع المؤشرات\n• تدقيقات داخلية وخارجية مع نتائجها\n• خطة تكامل الأنظمة مع المسؤولين',
 '["There is no evidence of an implemented management system",
   "Management system aligned with purpose, vision and strategy in at least one domain (quality)",
   "System aligned in at least two domains (quality, environment)",
   "System aligned in at least three domains (quality, environment, occupational health & safety)",
   "System aligned in at least four domains (including information security)",
   "System aligned in all domains (quality, environment, occupational health & safety, information security)"]'::jsonb,
 '["لا يوجد دليل على نظام إدارة مطبق",
   "نظام إدارة متسق مع الغاية والرؤية والاستراتيجية في مجال واحد على الأقل (الجودة)",
   "نظام متسق في مجالين على الأقل (الجودة، البيئة)",
   "نظام متسق في ثلاثة مجالات على الأقل (الجودة، البيئة، الصحة والسلامة المهنية)",
   "نظام متسق في أربعة مجالات على الأقل (بما في ذلك أمن المعلومات)",
   "نظام متسق في جميع المجالات (الجودة، البيئة، الصحة والسلامة المهنية، أمن المعلومات)"]'::jsonb),

('P 1.10','c1','1.10',10,
 'Management and governance system','نظام الإدارة والحوكمة',
 'Governance system','نظام الحوكمة',
 'Defines who takes which decisions and how accountability works. It is the framework of responsibility and regulatory compliance for the whole organisation.',
 'يحدد من يتخذ أي قرارات وكيف تتم المساءلة؛ وهو إطار المسؤولية والامتثال التنظيمي للمؤسسة بأكملها.',
 E'• Rules or statutes of the governing body\n• Regulatory compliance policy\n• Board minutes with transformation decisions\n• Corporate governance plan with owners\n• Formal mechanisms for stakeholder participation in decisions',
 E'• لائحة أو نظام أساسي لهيئة الحوكمة\n• سياسة الامتثال التنظيمي\n• محاضر المجلس متضمنةً قرارات التحول\n• خطة حوكمة مؤسسية مع مسؤولين\n• آليات رسمية لمشاركة أصحاب المصلحة في القرارات',
 '["There is no evidence of an implemented governance system",
   "Basic governance system aligned with purpose, vision and strategy, establishing responsibilities for performance",
   "Governance system aligned, with responsibilities, ensuring legal and regulatory compliance",
   "Governance system aligned, legally compliant, providing transformation priorities and owners",
   "Governance system (in place for under 3 years) aligned, compliant, providing transformation priorities and involving stakeholders in decision-making",
   "Governance system (in place for over 3 years) aligned, compliant, with transformation priorities and involving stakeholders in decision-making"]'::jsonb,
 '["لا يوجد دليل على نظام حوكمة مطبق",
   "نظام حوكمة أساسي متسق مع الغاية والرؤية والاستراتيجية يحدد المسؤوليات عن الأداء",
   "نظام حوكمة متسق بمسؤوليات محددة يضمن الامتثال القانوني والتنظيمي",
   "نظام حوكمة متسق وممتثل قانونياً يوفر أولويات التحول والمسؤولين عنها",
   "نظام حوكمة (منذ أقل من 3 سنوات) متسق وممتثل يوفر أولويات التحول ويشرك أصحاب المصلحة في اتخاذ القرار",
   "نظام حوكمة (منذ أكثر من 3 سنوات) متسق وممتثل بأولويات تحول ويشرك أصحاب المصلحة في اتخاذ القرار"]'::jsonb)
on conflict (code) do update set
  block_en = excluded.block_en, block_ar = excluded.block_ar,
  question_en = excluded.question_en, question_ar = excluded.question_ar,
  context_en = excluded.context_en, context_ar = excluded.context_ar,
  evidence_en = excluded.evidence_en, evidence_ar = excluded.evidence_ar,
  levels_en = excluded.levels_en, levels_ar = excluded.levels_ar,
  sort = excluded.sort;

-- ============================================================================
-- VERIFICAR:
--   select code, title_en from public.assessment_criteria order by num;   → 7
--   select count(*) from public.assessment_questions;                     → 10 (C1)
--   select id from storage.buckets where id = 'assessment-evidence';      → 1
-- Nota P 1.9: los niveles de origen contenían dominio sanitario
-- ("calidad asistencial, seguridad del paciente"); se han normalizado a
-- dominios genéricos (quality / environment / OH&S / information security)
-- para una herramienta multisectorial. Confirmar si se prefiere lo literal.
-- Criterios 2–7 → migration-07b (siguiente entrega).
-- ============================================================================
