/* ------------------------------------------------------------------
   Orbital 360 portal — bilingual dictionary (EN / AR) and zone
   fallbacks. Zones are normally read from Supabase `zones`; these
   constants keep the UI working before the DB is seeded.
------------------------------------------------------------------- */

export const ZONE_FALLBACK = [
  {
    code: 'assessment',
    name_en: 'O360 Assessment Tool',
    name_ar: 'أداة التقييم O360',
    desc_en: 'EFQM-based assessment: RADAR scoring, criteria evidence, maturity diagnosis and reports.',
    desc_ar: 'التقييم المؤسسي وفق نموذج EFQM: تقييم رادار، أدلة المعايير، تشخيص النضج والتقارير.',
    icon: 'radar',
  },
  {
    code: 'governance',
    name_en: 'Management and Governance System',
    name_ar: 'نظام الإدارة والحوكمة',
    desc_en: 'Policies, committees, KPIs, compliance and the governance operating rhythm.',
    desc_ar: 'السياسات واللجان ومؤشرات الأداء والامتثال وإيقاع تشغيل الحوكمة.',
    icon: 'doc',
  },
  {
    code: 'transformation',
    name_en: 'Project Management and Transformation Tool',
    name_ar: 'أداة إدارة المشاريع والتحول',
    desc_en: 'Portfolio, programmes and transformation projects: planning, execution and benefits.',
    desc_ar: 'المحافظ والبرامج ومشاريع التحول: التخطيط والتنفيذ وتتبع المنافع.',
    icon: 'chart',
  },
]

export const ROLE_LABEL = {
  en: {
    superadmin: 'Superadministrator',
    admin: 'Administrator',
    account_manager: 'Account Manager',
    consultant: 'Consultant',
    client: 'Client',
  },
  ar: {
    superadmin: 'المشرف العام',
    admin: 'مسؤول النظام',
    account_manager: 'مدير الحسابات',
    consultant: 'مستشار',
    client: 'عميل',
  },
}

export const PORTAL_STRINGS = {
  en: {
    welcomeA: 'Welcome to ',
    strong: 'Orbital 360',
    sub: 'Your workspace for excellence, governance and transformation.',
    zonesTitle: 'Your zones',
    open: 'Open',
    signedInAs: 'Signed in as',
    signOut: 'Sign out',
    // Account manager
    crmTitle: 'CRM — accounts',
    crmEmpty: 'No accounts yet.',
    statusTitle: 'Project status',
    projEmpty: 'No projects yet.',
    // Consultant
    myProjects: 'My projects',
    newProject: 'New project',
    npTitle: 'Project title (EN)',
    npTitleAr: 'Project title (AR) — optional',
    npAccount: 'Account',
    npZone: 'Zone',
    npCreate: 'Create project',
    npCreated: 'Project created.',
    npError: 'Could not create the project.',
    // Client
    clientProjects: 'Your projects',
    activity: 'Latest activity',
    activityEmpty: 'No activity yet.',
    commentPh: 'Write a comment or update…',
    send: 'Send',
    sent: 'Sent.',
    progress: 'Progress',
    crmStatus: {
      lead: 'Lead', prospect: 'Prospect', active: 'Active',
      on_hold: 'On hold', closed: 'Closed',
    },
    projStatus: {
      draft: 'Draft', design: 'In design', in_progress: 'In progress',
      review: 'In review', delivered: 'Delivered', archived: 'Archived',
    },
  },
  ar: {
    welcomeA: 'مرحباً بكم في ',
    strong: 'أوربيتال 360',
    sub: 'مساحة عملكم للتميز والحوكمة والتحول.',
    zonesTitle: 'مناطق العمل',
    open: 'فتح',
    signedInAs: 'تم تسجيل الدخول باسم',
    signOut: 'تسجيل الخروج',
    crmTitle: 'إدارة العملاء — الحسابات',
    crmEmpty: 'لا توجد حسابات بعد.',
    statusTitle: 'حالة المشاريع',
    projEmpty: 'لا توجد مشاريع بعد.',
    myProjects: 'مشاريعي',
    newProject: 'مشروع جديد',
    npTitle: 'عنوان المشروع (إنجليزي)',
    npTitleAr: 'عنوان المشروع (عربي) — اختياري',
    npAccount: 'الحساب',
    npZone: 'المنطقة',
    npCreate: 'إنشاء المشروع',
    npCreated: 'تم إنشاء المشروع.',
    npError: 'تعذّر إنشاء المشروع.',
    clientProjects: 'مشاريعكم',
    activity: 'آخر النشاطات',
    activityEmpty: 'لا يوجد نشاط بعد.',
    commentPh: 'اكتبوا تعليقاً أو تحديثاً…',
    send: 'إرسال',
    sent: 'تم الإرسال.',
    progress: 'التقدم',
    crmStatus: {
      lead: 'عميل محتمل', prospect: 'فرصة', active: 'نشط',
      on_hold: 'معلّق', closed: 'مغلق',
    },
    projStatus: {
      draft: 'مسودة', design: 'قيد التصميم', in_progress: 'قيد التنفيذ',
      review: 'قيد المراجعة', delivered: 'مُسلَّم', archived: 'مؤرشف',
    },
  },
}

/** Localised zone name/description with graceful fallback. */
export function zoneText(zone, lang) {
  const ar = lang === 'ar'
  return {
    name: (ar ? zone.name_ar : zone.name_en) || zone.name_en,
    desc: (ar ? zone.desc_ar : zone.desc_en) || zone.desc_en || '',
  }
}
