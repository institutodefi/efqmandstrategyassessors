import { createContext, useContext, useEffect, useState } from 'react'
import { SITE_ES } from './data/i18nES.js'

/* ------------------------------------------------------------------
   Site UI dictionary — English / Arabic (MSA).
   Blog posts are published in English (authored by Alejandro).
------------------------------------------------------------------- */

export const STRINGS = {
  en: {
    dir: 'ltr',
    nav: { about: 'About', services: 'Services', models: 'Models', consultancy: 'Consultancy', assessments: 'Assessments', training: 'Training', model: 'EFQM Model', blog: 'Blog', contact: 'Contact', client: 'Orbital360' },
    hero: {
      eyebrow: 'Dubai · Americas · Europe · MENA',
      titleA: 'Fostering ', titleStrong1: 'strategy', titleB: ' through the ', titleStrong2: 'EFQM Model',
      lead: 'We help organisations achieve sustainable excellence — from first diagnosis to international EFQM recognition — with certified assessors and two decades of assessment experience.',
      cta1: 'Start your assessment', cta2: 'Explore services',
    },
    stats: [
      ['20', '+', 'years with the EFQM Model'],
      ['250', '+', 'external assessments'],
      ['300', '+', 'excellence & strategy projects'],
      ['3', '', 'regions served worldwide'],
    ],
    about: {
      eyebrow: 'About us',
      titleA: 'Excellence is a ', strong: 'discipline', titleB: ', not a destination',
      lead: 'EFQM and Strategy Assessors FZCO specialises in consultancy services based on the EFQM Model. Our goal is to help organisations achieve sustainable excellence through strategic insight, tailored solutions and a commitment to continuous improvement.',
      points: [
        'Certified EFQM assessors with international recognition experience since 2004.',
        'UAE delivery entity of the TuConsultor Group — two decades of consultancy across quality, strategy, ESG and organisation.',
        'Based in Dubai Silicon Oasis, serving clients across the Americas, Europe and MENA.',
      ],
      visualCaption: 'The seven criteria of the EFQM Model 2025 in constant motion — Direction, Execution and Results as one connected system.',
    },
    services: {
      eyebrow: 'Our services',
      titleA: 'Everything your journey to ', strong: 'recognition', titleB: ' needs',
      sub: 'Three practice areas, one method — the EFQM Model 2025 and its RADAR logic. Explore each in depth.',
      more: 'Explore',
      hub: [
        { icon: 'assess', title: 'Assessments', href: '/services/assessments', text: 'Strategic consulting, certified EFQM Model 2025 assessment, high-value support and C-class coaching — a scored picture of where you stand and what to do next.' },
        { icon: 'caas', title: 'Consultancy as a Service', href: '/services/consultancy', text: 'An AI-boosted consulting subscription and ISO consultancy across six standards — fixed monthly pricing in your local currency.' },
        { icon: 'train', title: 'Workshops & Training', href: '/services/training', text: 'High-impact workshops built on your own evidence — EFQM foundation, RADAR, assessor training and executive programmes, in English and Arabic.' },
      ],
      items: [
        { icon: 'layers', title: 'Consultancy as a Service', text: 'An AI-boosted consulting subscription — a dedicated team, a fixed monthly price and no surprises. You choose the intensity; we implement and certify alongside you. See the three models below.' },
        { icon: 'compass', title: 'Strategic Consulting', text: 'Strategy formulation and governance aligned with the EFQM Model — clear direction, priorities and objectives that the whole organisation can execute.' },
        { icon: 'scan', title: 'EFQM Model Assessment', text: 'Full external and self-assessments against the EFQM Model 2025 to identify strengths, improvement areas and a verified maturity score.' },
        { icon: 'shield', title: 'ISO Consultancy', text: 'Implementation and audit-readiness across six standards — ISO 9001, 14001, 27001, 45001, 42001 and 56001 — from a single architecture, integrated with your EFQM management system.' },
        { icon: 'academy', title: 'Workshops & Training', text: 'Interactive workshops and certified training that equip leaders and teams to apply the EFQM Model and RADAR logic in daily management.' },
        { icon: 'chart', title: 'Performance Improvement', text: 'Prioritised improvement plans built from assessment evidence, with measurable targets and follow-up to drive results that last.' },
        { icon: 'org', title: 'Organisational Development', text: 'Aligning structures, processes and culture with strategic goals — from operating model design to transformation roadmaps.' },
        { icon: 'support', title: 'Coaching & Support', text: 'Ongoing coaching for management teams implementing EFQM principles, from first diagnosis to international recognition.' },
      ],
    },
    method: {
      eyebrow: 'How we work',
      titleA: 'The ', strong: 'RADAR', titleB: ' logic, applied with rigour',
      sub: 'Every engagement follows the assessment logic at the heart of the EFQM Model — so improvement is systematic, evidenced and repeatable.',
      steps: [
        { k: 'R', title: 'Results', text: 'Define the results the organisation aims to achieve as part of its strategy.' },
        { k: 'A', title: 'Approaches', text: 'Plan and develop sound, integrated approaches to deliver those results.' },
        { k: 'D', title: 'Deploy', text: 'Deploy the approaches systematically across the organisation.' },
        { k: 'AR', title: 'Assess & Refine', text: 'Assess and refine approaches through monitoring, learning and improvement.' },
      ],
    },
    path: {
      eyebrow: 'From diagnosis to recognition',
      titleA: 'Four stages, ', strong: 'one clear path', titleB: '',
      sub: 'A structured route from first diagnosis to external recognition — each stage builds on the last, with our support at every step.',
      milestones: [
        { dot: '01', title: 'GAP Analysis', text: 'A structured diagnosis of where you stand against the EFQM Model 2025 — the gaps that matter and where to focus first.' },
        { dot: '02', title: 'Self-Assessment', text: 'A guided self-assessment across the seven criteria, building internal understanding and a verified maturity baseline.' },
        { dot: '03', title: 'Support · Action Plan', text: 'A prioritised improvement plan built from the evidence — owners, measurable targets and hands-on support to deliver it.' },
        { dot: '04', title: 'Support · External Recognition', text: 'Preparation and accompaniment through external assessment — to EFQM recognition and the international stars that follow.' },
      ],
    },
    team: {
      liLabel: 'Connect on LinkedIn',
      eyebrow: 'Core team',
      titleA: 'Assessors who have ', strong: 'seen excellence', titleB: ' up close',
      alex: {
        linkedin: 'https://www.linkedin.com/in/alejandrosnicolas/',
        role: 'Engagement Director · Lead Assessor',
        name: 'Alejandro San Nicolás Medina',
        bio: 'Senior consultant and EFQM Certified Assessor with 20+ years working with the EFQM Model, 250+ external assessments and 300+ excellence and strategy projects. PhD in Economics with an EFQM-based research methodology; university lecturer on the EFQM Model.',
        creds: ['EFQM Certified Assessor', 'Senior Assessor since 2009', 'PhD in Economics'],
      },
      rosa: {
        role: 'Project Manager · Co-Assessor',
        name: 'Rosa García Sánchez',
        bio: 'EFQM Assessor (International Certification, 2024) with a background in organisational development, corporate culture, learning & development, change management and strategic communication. PhD in Contemporary History, Outstanding Cum Laude.',
        creds: ['EFQM Assessor 2024', 'Change management', 'PhD, Cum Laude'],
      },
    },
    zone: {
      titleA: 'Your engagement, ', strong: 'one secure place', titleB: '',
      sub: 'The client zone gives every engagement a private workspace — assessment documents, RADAR scores and direct contact with your assessor team.',
      cta: 'Enter the client zone',
      features: [
        'Assessment reports and deliverables',
        'RADAR scoring and progress tracking',
        'Secure messaging with your assessors',
        'Training materials and workshop resources',
      ],
    },
    contact: {
      eyebrow: 'Contact',
      titleA: 'Start the ', strong: 'conversation', titleB: '',
      office: 'Office', officeVal: 'Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE',
      phone: 'Phone', email: 'Email',
      fName: 'Name', fFirstName: 'First name', fLastName: 'Last name', fEmail: 'Email', fOrg: 'Company', fPhone: 'Cell (optional)', fMsg: 'How can we help?',
      send: 'Send inquiry', sending: 'Sending…',
      okMsg: 'Inquiry sent. We will reply within one business day.',
      errMsg: 'Something went wrong sending your inquiry. Please email hello@efqmassessors.ae.',
      valMsg: 'Please complete name, email and message.',
      note: 'By sending this form you agree to our privacy policy. We only use your details to respond to your inquiry.',
    },
    footer: {
      blurb: 'EFQM and Strategy Assessors FZCO helps organisations achieve sustainable excellence through the EFQM Model — assessment, recognition, strategy and training across the Americas, Europe and MENA.',
      navigate: 'Navigate', contact: 'Contact', legalHeading: 'Legal', follow: 'Follow us',
      addr1: 'Building A1, Dubai Digital Park', addr2: 'Dubai Silicon Oasis, Dubai, UAE',
      legal: 'EFQM and Strategy Assessors FZCO · Trade License 59735 · Dubai, UAE',
      group: 'Part of the TuConsultor Group',
    },
    legalNav: {
      privacy: 'Privacy Policy',
      cookies: 'Cookie Policy',
      terms: 'Terms of Use',
      notice: 'Legal Notice',
      accessibility: 'Accessibility',
    },
    cookie: {
      title: 'Your privacy',
      intro: 'We use cookies and similar storage to run this site, remember your preferences and — only with your consent — measure and improve it. You choose what to allow.',
      acceptAll: 'Accept all', rejectAll: 'Reject all', customize: 'Customise', save: 'Save choices',
      more: 'Cookie Policy', settings: 'Cookie settings', prefsTitle: 'Cookie preferences',
      alwaysOn: 'Always on',
      cats: {
        necessary: { name: 'Strictly necessary', desc: 'Required for the site to work — your language choice, this consent record and your sign-in session.' },
        preferences: { name: 'Preferences', desc: 'Remember choices you make to personalise your experience.' },
        analytics: { name: 'Analytics', desc: 'Help us understand how the site is used so we can improve it. Not active until you allow it.' },
        marketing: { name: 'Marketing', desc: 'Used to deliver relevant messages and measure campaigns. Not active until you allow it.' },
      },
    },
    norms: {
      eyebrow: 'Technical briefing',
      titleA: 'Six ISO standards. ', strong: 'One architecture', titleB: '',
      sub: 'We implement ISO 9001, 14001, 27001, 45001, 42001 and 56001 from a single platform of processes and sub-processes — integrated with your EFQM management system.',
      subLabel: 'Differential sub-processes',
      items: [
        { code: '9001', name: 'Quality Management System', text: 'The most widely implemented standard in the world. Continual improvement, customer satisfaction and organisational effectiveness — the base of every integrated system.', subs: 'Internal audit · Non-conformities · Management review · Legal control · Suppliers' },
        { code: '14001', name: 'Environmental Management', text: 'Environmental aspects and impacts, legal compliance, discharge control and pollution prevention.', subs: 'Environmental aspects · Discharges · Emergencies · Environmental legal control · Permits' },
        { code: '27001', name: 'Information Security', text: 'Risk analysis, Annex A controls, business continuity and data protection — the most demanding in hours.', subs: 'Operational security · Logical security · Business continuity · Data · Assets' },
        { code: '45001', name: 'Occupational Health & Safety', text: 'Hazard identification, workplace risk assessment, OH&S legal compliance and worker participation.', subs: 'Labour relations · Occupational risks · Maintenance · Emergencies · OH&S permits' },
        { code: '42001', name: 'AI Management System', text: 'The first certifiable AI standard. Governance, impact assessment and responsible use of artificial-intelligence systems.', subs: 'AI system inventory · Impact assessment · Data governance · Human oversight · AI lifecycle' },
        { code: '56001', name: 'Innovation Management', text: 'An innovation management system: from the idea to a portfolio of projects, with return metrics and an innovative culture.', subs: 'Idea management · Innovation portfolio · Strategic intelligence · External collaboration · Innovation metrics' },
      ],
    },
    models: {
      eyebrow: 'AI-boosted · Consultant as a Service',
      titleA: 'Three models. One logic: ', strong: 'you decide the intensity', titleB: '',
      sub: 'A prepaid subscription to a team of AI-boosted consultants. A fixed monthly price, no surprises — you choose how intensively we work alongside you.',
      from: 'From', unit: '/month', currency: '€', popular: 'Most chosen', cta: 'Choose this model',
      note: 'Prepaid monthly subscription · prices exclude VAT · 12-month minimum term.',
      priceIn: 'Prices in', fromEur: 'converted from EUR at indicative rates',
      tiers: [
        { name: 'Relationship', tagline: 'To start exploring', price: '350', features: ['Orbital360 PM Tool — O360 self-assessment', 'TuConsultor AI platform', '1 specialised consultant', 'On-demand sessions', 'Free initial diagnosis', '24/7 chat support'] },
        { name: 'Involvement', tagline: 'To advance with focus', price: '625', popular: true, features: ['Everything in Relationship, +', 'Orbital360 PM Tool — full suite (3 products)', '2 dedicated consultants', '6 h/month of consultancy', 'Personalised roadmap', 'Premium templates', 'Monthly review', 'Teams & SharePoint'] },
        { name: 'Commitment', tagline: 'To truly transform', price: '800', features: ['Everything in Involvement, +', 'Orbital360 PM Tool — audited assessment & extra licenses', 'Multidisciplinary team', '7 h/month of consultancy', 'Co-defined KPIs', 'Guided implementation', 'Sector experts', 'Executive review', 'External-audit assistance'] },
      ],
    },
    newsletter: {
      eyebrow: 'Newsletter',
      titleA: 'Excellence insights, ', strong: 'once a month', titleB: '',
      text: 'Practical EFQM and ISO insights, new tools and recognition news — straight to your inbox. No spam; unsubscribe anytime.',
      placeholder: 'Your email address', button: 'Subscribe', sending: 'Subscribing…',
      consentA: 'I agree to receive emails and accept the ', privacyLink: 'Privacy Policy', consentB: '.',
      ok: 'Almost there — check your inbox to confirm your subscription.',
      err: 'Something went wrong. Please try again or email hello@efqmassessors.ae.',
      val: 'Please enter a valid email and accept the Privacy Policy.',
    },
    whatsapp: {
      label: 'Chat on WhatsApp', greeting: 'Hi 👋 How can we help?',
      prefill: 'Hello EFQM and Strategy Assessors, I would like to know more about your services.',
      close: 'Close',
    },
    consent: {
      label: 'I agree to the ',
      privacyLink: 'Privacy Policy',
      and: ' and consent to my details being used to respond to my enquiry.',
      required: 'Please accept the Privacy Policy to send your enquiry.',
    },
    notFound: {
      code: '404',
      title: 'Page not found',
      text: 'The page you are looking for does not exist or has moved.',
      home: 'Back to home',
      blog: 'Read the blog',
    },
    model: {
      eyebrow: 'The framework',
      heroA: 'The ', strong: 'EFQM Model 2025', heroB: ', explained',
      lead: 'A globally recognised management framework that supports organisations in managing change and improving performance sustainably. More than 50,000 organisations have used it worldwide for over 35 years.',
      chips: ['7 Criteria', '3 Blocks', '32 Sub-criteria & dimensions', 'RADAR logic'],
      logicTitleA: 'Three ', logicStrong: 'questions', logicTitleB: ', seven criteria',
      logicSub: 'The EFQM Model 2025 is built on a simple yet powerful logic: three fundamental questions — Why, How, What — that any excellent organisation must answer in an aligned way.',
      blocks: [
        { tag: 'Block 01', q: 'Why', name: 'Direction', text: 'Why does this organisation exist? What purpose does it fulfil? Why this particular strategy? Defines the reason for being and future aspirations.', crits: 'Criteria 1–2' },
        { tag: 'Block 02', q: 'How', name: 'Execution', text: 'How does it deliver on its purpose and strategy? Covers stakeholder engagement, sustainable value creation, and performance and transformation management.', crits: 'Criteria 3–5' },
        { tag: 'Block 03', q: 'What', name: 'Results', text: 'What has it achieved so far and what does it intend to achieve tomorrow? Measures stakeholder perceptions and strategic and operational performance.', crits: 'Criteria 6–7' },
      ],
      critTitleA: 'The 7 criteria and their ', critStrong: 'sub-criteria', critTitleB: '',
      critSub: 'Criteria 1–6 break down into numbered sub-criteria. Criterion 7 is structured around four result categories, shown as 7.1–7.4. Each entry pairs the official scope with an original commentary from the assessor\u2019s perspective.',
      descLabel: 'Description', commentLabel: 'Assessor\u2019s commentary',
      ctaTitle: 'Ready to see your organisation through the Model?',
      cta: 'Request an assessment',
    },
    blog: {
      eyebrow: 'EFQM, one concept a day',
      titleA: 'The ', strong: '120-day', titleB: ' excellence programme',
      sub: 'A daily post by Alejandro San Nicolás — 90 days on the EFQM Model 2025, then 30 real cases across the ISO standards (9001, 14001, 27001, 45001, 42001, 56001). A new post every morning, in English and Arabic.',
      by: 'By', readMore: 'Read', rss: 'RSS feed', share: 'Share', copy: 'Copy link', copied: 'Link copied',
      day: 'Day', of: 'of 120',
      upcoming: 'Coming up', upcomingSub: 'The programme continues — one concept a day.',
      backToBlog: '← All posts', prev: '← Previous', next: 'Next →',
      empty: 'The programme starts soon — the first post publishes on 13 July 2026.',
      ctaEyebrow: 'Talk to an assessor',
      ctaTitle: 'Turn reading into practice',
      ctaText: 'Have a question about this topic, or want to apply it in your organisation? Message us on WhatsApp or send a note — we reply within one business day.',
      ctaWa: 'Chat on WhatsApp',
      ctaWaPrefill: 'Hello, I just read your article "{title}" and would like to know more.',
      ctaSent: 'Thank you — we\u2019ve received your message and will reply within one business day.',
    },
    auth: {
      back: '← Back to efqmassessors.ae',
      eyebrow: 'Orbital360 · AI PMTool',
      panelTitle: 'Your transformation system, in orbit',
      panelLead: 'The workspace where your management, governance and excellence system is implemented, maintained, assessed and audited — with the evidence attached.',
      panelPoints: ['Implement', 'Maintain', 'Assess', 'Audit'],
      secure: 'Encrypted connection · governed under ISO 27001 principles',
      whatIs: 'What is Orbital360?',
      requestAccess: 'Request access',
      signinTitleA: 'Orbital360 ', signinStrong: 'access',
      signupTitleA: 'Create your ', signupStrong: 'account',
      resetTitleA: 'Reset ', resetStrong: 'password',
      signinSub: 'Sign in to your Orbital360 workspace.',
      signupSub: 'Request access to your private engagement workspace.',
      resetSub: 'We will email you a secure reset link.',
      fullName: 'Full name', firstName: 'First name', lastName: 'Last name', email: 'Email', password: 'Password', confirmPassword: 'Repeat password', showPass: 'Show password', hidePass: 'Hide password', passMismatch: 'Passwords do not match.', passShort: 'Minimum 8 characters.', errCreds: 'Wrong email or password.', errExists: 'An account with this email already exists — try signing in.', errRate: 'Too many attempts. Wait a minute and try again.', errSignupsOff: 'Self-registration is currently disabled. Ask us for access at hello@efqmassessors.ae.', errEmailSend: 'Your account request was received but the confirmation email could not be sent. Contact hello@efqmassessors.ae and we will activate you.', errNet: 'Could not reach the server. Check your connection and try again.', alreadyClient: 'Already a client?',
      signin: 'Sign in', signup: 'Create account', reset: 'Send reset link', working: 'Working…',
      newClient: 'New client?', createLink: 'Create an account', forgot: 'Forgot your password?', backToSignin: 'Back to sign in',
      created: 'Account created. Check your inbox to confirm your email, then sign in.',
      resetSent: 'Password reset link sent. Check your inbox.',
      notConfigured: 'Orbital360 access is not configured yet. Please contact hello@efqmassessors.ae.',
      failed: 'Sign-in failed. Please try again.',
    },
    portal: {
      signedInAs: 'Signed in as', signOut: 'Sign out',
      welcomeA: 'Welcome to your ', strong: 'client zone',
      sub: 'Your private engagement workspace — documents, assessment progress and direct contact with your assessor team.',
      docs: 'Documents', docsEmpty: 'No documents shared yet. Deliverables from your engagement will appear here.', docsTag: 'Deliverables',
      radar: 'Assessment progress', radarText: 'Track your RADAR scoring by criterion as the assessment advances, from baseline diagnosis to verified recognition score.', radarTag: 'RADAR scoring',
      support: 'Contact your assessors', supportTextA: 'Questions between sessions? Write to your engagement team at', supportTextB: '— we reply within one business day.', supportTag: 'Support',
    },
  },

  /* ---------------------------------------------------------------- */

  ar: {
    dir: 'rtl',
    nav: { about: 'من نحن', services: 'خدماتنا', models: 'النماذج', consultancy: 'الاستشارات', assessments: 'التقييمات', training: 'التدريب', model: 'نموذج EFQM', blog: 'المدونة', contact: 'اتصل بنا', client: 'Orbital360' },
    hero: {
      eyebrow: 'دبي · الأمريكتان · أوروبا · الشرق الأوسط وشمال أفريقيا',
      titleA: 'تعزيز ', titleStrong1: 'الاستراتيجية', titleB: ' من خلال ', titleStrong2: 'نموذج EFQM',
      lead: 'نساعد المؤسسات على تحقيق التميّز المستدام — من التشخيص الأول وحتى الاعتراف الدولي وفق نموذج EFQM — بمقيّمين معتمدين وخبرة تقييم تمتد لعقدين من الزمن.',
      cta1: 'ابدأ التقييم', cta2: 'استكشف خدماتنا',
    },
    stats: [
      ['20', '+', 'عاماً مع نموذج EFQM'],
      ['250', '+', 'تقييماً خارجياً'],
      ['300', '+', 'مشروعاً في التميّز والاستراتيجية'],
      ['3', '', 'مناطق نخدمها حول العالم'],
    ],
    about: {
      eyebrow: 'من نحن',
      titleA: 'التميّز ', strong: 'ممارسة منهجية', titleB: '، لا محطة وصول',
      lead: 'تتخصص شركة EFQM and Strategy Assessors FZCO في الخدمات الاستشارية القائمة على نموذج EFQM. هدفنا مساعدة المؤسسات على تحقيق التميّز المستدام من خلال الرؤية الاستراتيجية والحلول المصممة خصيصاً والالتزام بالتحسين المستمر.',
      points: [
        'مقيّمو EFQM معتمدون بخبرة في الاعتراف الدولي منذ عام 2004.',
        'الذراع التنفيذية في الإمارات لمجموعة TuConsultor — عقدان من الاستشارات في الجودة والاستراتيجية والاستدامة والتنظيم المؤسسي.',
        'مقرّنا واحة دبي للسيليكون، ونخدم عملاء في الأمريكتين وأوروبا ومنطقة الشرق الأوسط وشمال أفريقيا.',
      ],
      visualCaption: 'المعايير السبعة لنموذج EFQM 2025 في حركة دائمة — التوجيه والتنفيذ والنتائج كمنظومة واحدة مترابطة.',
    },
    services: {
      eyebrow: 'خدماتنا',
      titleA: 'كل ما تحتاجه رحلتكم نحو ', strong: 'الاعتراف الدولي', titleB: '',
      sub: 'ثلاثة مجالات ممارسة ومنهجية واحدة — نموذج EFQM 2025 ومنطق RADAR. استكشفوا كلاً منها بالتفصيل.',
      more: 'استكشف',
      hub: [
        { icon: 'assess', title: 'التقييمات', href: '/services/assessments', text: 'استشارات استراتيجية، وتقييم معتمد وفق نموذج EFQM 2025، ودعم عالي القيمة، وتوجيه للإدارة العليا — صورة مُقيَّمة لموقعكم وما ينبغي فعله تالياً.' },
        { icon: 'caas', title: 'الاستشارة كخدمة', href: '/services/consultancy', text: 'اشتراك استشاري مدعوم بالذكاء الاصطناعي واستشارات ISO عبر ست مواصفات — بسعر شهري ثابت وبعملتكم المحلية.' },
        { icon: 'train', title: 'ورش العمل والتدريب', href: '/services/training', text: 'ورش عالية الأثر مبنيّة على أدلّتكم — أساسيات EFQM، وRADAR، وتدريب المقيّمين، وبرامج تنفيذية، بالعربية والإنجليزية.' },
      ],
      items: [
        { icon: 'layers', title: 'الاستشارة كخدمة', text: 'اشتراك استشاري مدعوم بالذكاء الاصطناعي — فريق مخصّص وسعر شهري ثابت بلا مفاجآت. أنتم تختارون الكثافة، ونحن ننفّذ ونعتمد معكم. اطّلعوا على النماذج الثلاثة أدناه.' },
        { icon: 'compass', title: 'الاستشارات الاستراتيجية', text: 'صياغة الاستراتيجية والحوكمة بما يتوافق مع نموذج EFQM — اتجاه واضح وأولويات وأهداف يمكن للمؤسسة بأكملها تنفيذها.' },
        { icon: 'scan', title: 'تقييم نموذج EFQM', text: 'تقييمات خارجية وذاتية كاملة وفق نموذج EFQM 2025 لتحديد نقاط القوة ومجالات التحسين ودرجة نضج موثّقة.' },
        { icon: 'shield', title: 'استشارات الأيزو (ISO)', text: 'التطبيق والتأهيل للتدقيق عبر ست مواصفات — ISO 9001 و14001 و27001 و45001 و42001 و56001 — من بنية واحدة، بتكامل مع نظام إدارتكم وفق EFQM.' },
        { icon: 'academy', title: 'ورش العمل والتدريب', text: 'ورش عمل تفاعلية وتدريب معتمد يمكّن القادة والفرق من تطبيق نموذج EFQM ومنطق RADAR في الإدارة اليومية.' },
        { icon: 'chart', title: 'تحسين الأداء', text: 'خطط تحسين مرتّبة الأولويات مبنية على أدلة التقييم، بأهداف قابلة للقياس ومتابعة تضمن نتائج مستدامة.' },
        { icon: 'org', title: 'التطوير المؤسسي', text: 'مواءمة الهياكل والعمليات والثقافة مع الأهداف الاستراتيجية — من تصميم نموذج التشغيل إلى خرائط طريق التحوّل.' },
        { icon: 'support', title: 'التوجيه والدعم', text: 'توجيه مستمر لفرق الإدارة التي تطبّق مبادئ EFQM، من التشخيص الأول وحتى الاعتراف الدولي.' },
      ],
    },
    method: {
      eyebrow: 'كيف نعمل',
      titleA: 'منطق ', strong: 'RADAR', titleB: ' مطبَّقاً بدقة',
      sub: 'كل مشروع يتبع منطق التقييم الذي يشكّل جوهر نموذج EFQM — ليكون التحسين منهجياً وموثَّقاً وقابلاً للتكرار.',
      steps: [
        { k: 'R', title: 'النتائج', text: 'تحديد النتائج التي تسعى المؤسسة لتحقيقها في إطار استراتيجيتها.' },
        { k: 'A', title: 'الأساليب', text: 'تخطيط وتطوير أساليب سليمة ومتكاملة لتحقيق تلك النتائج.' },
        { k: 'D', title: 'التطبيق', text: 'تطبيق الأساليب بشكل منهجي في جميع أنحاء المؤسسة.' },
        { k: 'AR', title: 'التقييم والتحسين', text: 'تقييم الأساليب وصقلها من خلال المتابعة والتعلّم والتحسين.' },
      ],
    },
    path: {
      eyebrow: 'من التشخيص إلى الاعتراف',
      titleA: 'أربع مراحل، ', strong: 'مسار واحد واضح', titleB: '',
      sub: 'مسار منظّم من التشخيص الأول إلى الاعتراف الخارجي — كل مرحلة تبني على سابقتها، بدعمنا في كل خطوة.',
      milestones: [
        { dot: '01', title: 'تحليل الفجوات', text: 'تشخيص منظّم لموقعكم مقابل نموذج EFQM 2025 — الفجوات المهمّة وأين تركّزون أولاً.' },
        { dot: '02', title: 'التقييم الذاتي', text: 'تقييم ذاتي موجّه عبر المعايير السبعة، يبني فهماً داخلياً وخطّ أساس موثّقاً للنضج.' },
        { dot: '03', title: 'الدعم · خطة العمل', text: 'خطة تحسين مرتّبة الأولويات مبنية على الأدلة — بمالكين وأهداف قابلة للقياس ودعم عملي لتنفيذها.' },
        { dot: '04', title: 'الدعم · الاعتراف الخارجي', text: 'الإعداد والمرافقة خلال التقييم الخارجي — نحو اعتراف EFQM والنجوم الدولية التي تليه.' },
      ],
    },
    team: {
      liLabel: 'تواصلوا عبر لينكدإن',
      eyebrow: 'الفريق الأساسي',
      titleA: 'مقيّمون عاينوا ', strong: 'التميّز', titleB: ' عن قرب',
      alex: {
        linkedin: 'https://www.linkedin.com/in/alejandrosnicolas/',
        role: 'مدير المشاريع · المقيّم الرئيسي',
        name: 'أليخاندرو سان نيكولاس ميدينا',
        bio: 'مستشار أول ومقيّم EFQM معتمد بخبرة تتجاوز 20 عاماً مع نموذج EFQM، وأكثر من 250 تقييماً خارجياً و300 مشروع في التميّز والاستراتيجية. حاصل على دكتوراه في الاقتصاد بمنهجية بحثية قائمة على EFQM؛ ومحاضر جامعي في نموذج EFQM.',
        creds: ['مقيّم EFQM معتمد', 'مقيّم أول منذ 2009', 'دكتوراه في الاقتصاد'],
      },
      rosa: {
        role: 'مديرة المشاريع · مقيّمة مشاركة',
        name: 'روسا غارسيا سانشيز',
        bio: 'مقيّمة EFQM (اعتماد دولي، 2024) بخلفية في التطوير المؤسسي والثقافة المؤسسية والتعلّم والتطوير وإدارة التغيير والاتصال الاستراتيجي. حاصلة على دكتوراه في التاريخ المعاصر بمرتبة الشرف العليا.',
        creds: ['مقيّمة EFQM 2024', 'إدارة التغيير', 'دكتوراه بمرتبة الشرف'],
      },
    },
    zone: {
      titleA: 'مشروعكم في ', strong: 'مساحة واحدة آمنة', titleB: '',
      sub: 'توفّر منطقة العملاء لكل مشروع مساحة عمل خاصة — وثائق التقييم ودرجات RADAR وتواصلاً مباشراً مع فريق المقيّمين.',
      cta: 'ادخل إلى منطقة العملاء',
      features: [
        'تقارير التقييم والمخرجات',
        'درجات RADAR ومتابعة التقدّم',
        'مراسلات آمنة مع المقيّمين',
        'مواد تدريبية وموارد ورش العمل',
      ],
    },
    contact: {
      eyebrow: 'اتصل بنا',
      titleA: 'لنبدأ ', strong: 'الحوار', titleB: '',
      office: 'المكتب', officeVal: 'مبنى A1، حديقة دبي الرقمية، واحة دبي للسيليكون، دبي، الإمارات العربية المتحدة',
      phone: 'الهاتف', email: 'البريد الإلكتروني',
      fName: 'الاسم', fFirstName: 'الاسم الأول', fLastName: 'اسم العائلة', fEmail: 'البريد الإلكتروني', fOrg: 'الشركة', fPhone: 'الجوال (اختياري)', fMsg: 'كيف يمكننا المساعدة؟',
      send: 'أرسل الاستفسار', sending: 'جارٍ الإرسال…',
      okMsg: 'تم إرسال استفساركم. سنردّ خلال يوم عمل واحد.',
      errMsg: 'حدث خطأ أثناء إرسال الاستفسار. يرجى مراسلتنا على hello@efqmassessors.ae.',
      valMsg: 'يرجى استكمال الاسم والبريد الإلكتروني والرسالة.',
      note: 'بإرسال هذا النموذج فإنكم توافقون على سياسة الخصوصية. نستخدم بياناتكم للرد على استفساركم فقط.',
    },
    footer: {
      blurb: 'تساعد EFQM and Strategy Assessors FZCO المؤسسات على تحقيق التميّز المستدام من خلال نموذج EFQM — تقييم واعتراف واستراتيجية وتدريب في الأمريكتين وأوروبا والشرق الأوسط وشمال أفريقيا.',
      navigate: 'روابط', contact: 'اتصل بنا', legalHeading: 'الشؤون القانونية', follow: 'تابعونا',
      addr1: 'مبنى A1، حديقة دبي الرقمية', addr2: 'واحة دبي للسيليكون، دبي، الإمارات',
      legal: 'EFQM and Strategy Assessors FZCO · رخصة تجارية 59735 · دبي، الإمارات',
      group: 'جزء من مجموعة TuConsultor',
    },
    legalNav: {
      privacy: 'سياسة الخصوصية',
      cookies: 'سياسة ملفات تعريف الارتباط',
      terms: 'شروط الاستخدام',
      notice: 'البيان القانوني',
      accessibility: 'إمكانية الوصول',
    },
    cookie: {
      title: 'خصوصيتكم',
      intro: 'نستخدم ملفات تعريف الارتباط والتخزين المشابه لتشغيل الموقع وتذكّر تفضيلاتكم — وبموافقتكم فقط — لقياسه وتحسينه. أنتم تختارون ما تسمحون به.',
      acceptAll: 'قبول الكل', rejectAll: 'رفض الكل', customize: 'تخصيص', save: 'حفظ الاختيارات',
      more: 'سياسة ملفات تعريف الارتباط', settings: 'إعدادات ملفات تعريف الارتباط', prefsTitle: 'تفضيلات ملفات تعريف الارتباط',
      alwaysOn: 'مفعّلة دائماً',
      cats: {
        necessary: { name: 'ضرورية تماماً', desc: 'لازمة لعمل الموقع — اختيار اللغة، وسجلّ الموافقة هذا، وجلسة تسجيل الدخول.' },
        preferences: { name: 'التفضيلات', desc: 'تتذكّر اختياراتكم لتخصيص تجربتكم.' },
        analytics: { name: 'التحليلات', desc: 'تساعدنا على فهم كيفية استخدام الموقع لتحسينه. غير مفعّلة حتى تسمحوا بها.' },
        marketing: { name: 'التسويق', desc: 'تُستخدم لتقديم رسائل ذات صلة وقياس الحملات. غير مفعّلة حتى تسمحوا بها.' },
      },
    },
    norms: {
      eyebrow: 'إحاطة تقنية',
      titleA: 'ست مواصفات ISO. ', strong: 'بنية واحدة', titleB: '',
      sub: 'ننفّذ ISO 9001 و14001 و27001 و45001 و42001 و56001 من منصّة واحدة للعمليات والعمليات الفرعية — بتكامل مع نظام إدارتكم وفق EFQM.',
      subLabel: 'عمليات فرعية مميّزة',
      items: [
        { code: '9001', name: 'نظام إدارة الجودة', text: 'المواصفة الأكثر تطبيقاً في العالم. تحسين مستمر ورضا العملاء وفعالية مؤسسية — أساس كل نظام متكامل.', subs: 'التدقيق الداخلي · حالات عدم المطابقة · مراجعة الإدارة · الضبط القانوني · الموردون' },
        { code: '14001', name: 'الإدارة البيئية', text: 'الجوانب والآثار البيئية، والامتثال القانوني، وضبط التصريفات، ومنع التلوّث.', subs: 'الجوانب البيئية · التصريفات · حالات الطوارئ · الضبط القانوني البيئي · التراخيص' },
        { code: '27001', name: 'أمن المعلومات', text: 'تحليل المخاطر، وضوابط الملحق A، واستمرارية الأعمال، وحماية البيانات — الأكثر تطلّباً للساعات.', subs: 'الأمن التشغيلي · الأمن المنطقي · استمرارية الأعمال · البيانات · الأصول' },
        { code: '45001', name: 'الصحة والسلامة المهنية', text: 'تحديد المخاطر، وتقييم مخاطر بيئة العمل، والامتثال القانوني في السلامة المهنية، ومشاركة العاملين.', subs: 'علاقات العمل · المخاطر المهنية · الصيانة · حالات الطوارئ · تراخيص السلامة' },
        { code: '42001', name: 'نظام إدارة الذكاء الاصطناعي', text: 'أول مواصفة قابلة للاعتماد للذكاء الاصطناعي. الحوكمة وتقييم الأثر والاستخدام المسؤول لأنظمة الذكاء الاصطناعي.', subs: 'حصر أنظمة الذكاء الاصطناعي · تقييم الأثر · حوكمة البيانات · الإشراف البشري · دورة الحياة' },
        { code: '56001', name: 'إدارة الابتكار', text: 'نظام لإدارة الابتكار: من الفكرة إلى محفظة المشاريع، بمقاييس العائد وثقافة مبتكرة.', subs: 'إدارة الأفكار · محفظة الابتكار · الاستخبارات الاستراتيجية · التعاون الخارجي · مقاييس الابتكار' },
      ],
    },
    models: {
      eyebrow: 'مدعوم بالذكاء الاصطناعي · الاستشارة كخدمة',
      titleA: 'ثلاثة نماذج. منطق واحد: ', strong: 'أنتم تحدّدون الكثافة', titleB: '',
      sub: 'اشتراك مدفوع مسبقاً في فريق من المستشارين المدعومين بالذكاء الاصطناعي. سعر شهري ثابت بلا مفاجآت — أنتم تختارون مدى كثافة عملنا معكم.',
      from: 'ابتداءً من', unit: '/شهر', currency: '€', popular: 'الأكثر اختياراً', cta: 'اختر هذا النموذج',
      note: 'اشتراك شهري مدفوع مسبقاً · الأسعار لا تشمل ضريبة القيمة المضافة · حدّ أدنى 12 شهراً.',
      priceIn: 'الأسعار بعملة', fromEur: 'محوّلة من اليورو بأسعار استرشادية',
      tiers: [
        { name: 'العلاقة', tagline: 'للبدء في الاستكشاف', price: '350', features: ['أداة Orbital360 PM — التقييم الذاتي O360', 'منصّة TuConsultor للذكاء الاصطناعي', 'مستشار متخصص واحد', 'جلسات عند الطلب', 'تشخيص أولي مجاني', 'دعم محادثة 24/7'] },
        { name: 'المشاركة', tagline: 'للتقدّم بتركيز', price: '625', popular: true, features: ['كل ما في «العلاقة»، +', 'أداة Orbital360 PM — الباقة الكاملة (3 منتجات)', 'مستشاران مخصّصان', '6 ساعات استشارة شهرياً', 'خارطة طريق مخصّصة', 'قوالب متميّزة', 'مراجعة شهرية', 'Teams وSharePoint'] },
        { name: 'الالتزام', tagline: 'للتحوّل الحقيقي', price: '800', features: ['كل ما في «المشاركة»، +', 'أداة Orbital360 PM — تقييم مُدقّق وتراخيص إضافية', 'فريق متعدّد التخصصات', '7 ساعات استشارة شهرياً', 'مؤشرات أداء مشتركة', 'تطبيق مصحوب', 'خبراء قطاعيون', 'مراجعة تنفيذية', 'المساعدة في التدقيق الخارجي'] },
      ],
    },
    newsletter: {
      eyebrow: 'النشرة البريدية',
      titleA: 'رؤى في التميّز، ', strong: 'مرة كل شهر', titleB: '',
      text: 'رؤى عملية حول EFQM وISO، وأدوات جديدة وأخبار الاعتراف — إلى بريدكم مباشرة. بلا إزعاج؛ ألغوا الاشتراك متى شئتم.',
      placeholder: 'بريدكم الإلكتروني', button: 'اشترك', sending: 'جارٍ الاشتراك…',
      consentA: 'أوافق على تلقّي الرسائل وأقبل ', privacyLink: 'سياسة الخصوصية', consentB: '.',
      ok: 'اقتربنا — تحقّقوا من بريدكم لتأكيد الاشتراك.',
      err: 'حدث خطأ. حاولوا مجدداً أو راسلونا على hello@efqmassessors.ae.',
      val: 'يرجى إدخال بريد صحيح والموافقة على سياسة الخصوصية.',
    },
    whatsapp: {
      label: 'تواصل عبر واتساب', greeting: 'مرحباً 👋 كيف يمكننا المساعدة؟',
      prefill: 'مرحباً EFQM and Strategy Assessors، أودّ معرفة المزيد عن خدماتكم.',
      close: 'إغلاق',
    },
    consent: {
      label: 'أوافق على ',
      privacyLink: 'سياسة الخصوصية',
      and: ' وأوافق على استخدام بياناتي للردّ على استفساري.',
      required: 'يرجى الموافقة على سياسة الخصوصية لإرسال استفساركم.',
    },
    notFound: {
      code: '404',
      title: 'الصفحة غير موجودة',
      text: 'الصفحة التي تبحثون عنها غير موجودة أو تم نقلها.',
      home: 'العودة إلى الرئيسية',
      blog: 'اقرأ المدونة',
    },
    model: {
      eyebrow: 'الإطار المرجعي',
      heroA: 'شرح ', strong: 'نموذج EFQM 2025', heroB: '',
      lead: 'إطار إداري معترف به عالمياً يدعم المؤسسات في إدارة التغيير وتحسين الأداء بشكل مستدام. استخدمته أكثر من 50,000 مؤسسة حول العالم على مدى أكثر من 35 عاماً.',
      chips: ['7 معايير', '3 محاور', '32 معياراً فرعياً وبعداً', 'منطق RADAR'],
      logicTitleA: 'ثلاثة ', logicStrong: 'أسئلة', logicTitleB: '، سبعة معايير',
      logicSub: 'يقوم نموذج EFQM 2025 على منطق بسيط وقوي: ثلاثة أسئلة جوهرية — لماذا، كيف، ماذا — يجب على كل مؤسسة متميّزة الإجابة عنها بشكل متسق.',
      blocks: [
        { tag: 'المحور 01', q: 'لماذا', name: 'التوجيه', text: 'لماذا توجد هذه المؤسسة؟ ما الغاية التي تحققها؟ ولماذا هذه الاستراتيجية بالذات؟ يحدد سبب الوجود والطموحات المستقبلية.', crits: 'المعياران 1–2' },
        { tag: 'المحور 02', q: 'كيف', name: 'التنفيذ', text: 'كيف تحقق المؤسسة غايتها واستراتيجيتها؟ يشمل إشراك أصحاب المصلحة، وخلق القيمة المستدامة، وإدارة الأداء والتحوّل.', crits: 'المعايير 3–5' },
        { tag: 'المحور 03', q: 'ماذا', name: 'النتائج', text: 'ماذا حققت المؤسسة حتى الآن وماذا تعتزم تحقيقه غداً؟ يقيس تصورات أصحاب المصلحة والأداء الاستراتيجي والتشغيلي.', crits: 'المعياران 6–7' },
      ],
      critTitleA: 'المعايير السبعة و', critStrong: 'معاييرها الفرعية', critTitleB: '',
      critSub: 'تتفرع المعايير 1–6 إلى معايير فرعية مرقّمة، بينما يُبنى المعيار 7 حول أربع فئات للنتائج تُعرض هنا كـ 7.1–7.4. يجمع كل بند بين النطاق الرسمي وتعليق أصيل من منظور المقيّم.',
      descLabel: 'الوصف', commentLabel: 'تعليق المقيّم',
      ctaTitle: 'هل أنتم مستعدون لرؤية مؤسستكم من منظور النموذج؟',
      cta: 'اطلب تقييماً',
    },
    blog: {
      eyebrow: 'EFQM، مفهوم واحد كل يوم',
      titleA: 'برنامج التميّز في ', strong: '120 يوماً', titleB: '',
      sub: 'مقال يومي بقلم أليخاندرو سان نيكولاس — 90 يوماً حول نموذج EFQM 2025، ثم 30 حالة عملية عبر مواصفات ISO (9001 و14001 و27001 و45001 و42001 و56001). مقال جديد كل صباح، بالعربية والإنجليزية.',
      by: 'بقلم', readMore: 'اقرأ', rss: 'خلاصة RSS', share: 'مشاركة', copy: 'نسخ الرابط', copied: 'تم نسخ الرابط',
      day: 'اليوم', of: 'من 120',
      upcoming: 'قادم قريباً', upcomingSub: 'يستمر البرنامج — مفهوم واحد كل يوم.',
      backToBlog: '→ جميع المقالات', prev: '→ السابق', next: 'التالي ←',
      empty: 'يبدأ البرنامج قريباً — يُنشر المقال الأول في 13 يوليو 2026.',
      ctaEyebrow: 'تحدّث إلى مقيّم',
      ctaTitle: 'حوّلوا القراءة إلى ممارسة',
      ctaText: 'لديكم سؤال حول هذا الموضوع، أو ترغبون في تطبيقه في مؤسستكم؟ راسلونا عبر واتساب أو أرسلوا رسالة — نردّ خلال يوم عمل واحد.',
      ctaWa: 'تواصل عبر واتساب',
      ctaWaPrefill: 'مرحباً، قرأتُ للتوّ مقالكم «{title}» وأودّ معرفة المزيد.',
      ctaSent: 'شكراً لكم — استلمنا رسالتكم وسنردّ خلال يوم عمل واحد.',
    },
    auth: {
      back: '→ العودة إلى efqmassessors.ae',
      eyebrow: 'Orbital360 · أداة إدارة بالذكاء الاصطناعي',
      panelTitle: 'نظام تحوّلكم، في مداره',
      panelLead: 'مساحة العمل التي يُطبَّق فيها نظام الإدارة والحوكمة والتميّز لديكم ويُحافَظ عليه ويُقيَّم ويُدقَّق — مع الأدلة مرفقة.',
      panelPoints: ['التطبيق', 'الاستدامة', 'التقييم', 'التدقيق'],
      secure: 'اتصال مشفّر · محكوم وفق مبادئ ISO 27001',
      whatIs: 'ما هي Orbital360؟',
      requestAccess: 'اطلبوا وصولاً',
      signinTitleA: 'الدخول إلى ', signinStrong: 'Orbital360',
      signupTitleA: 'إنشاء ', signupStrong: 'حساب',
      resetTitleA: 'إعادة تعيين ', resetStrong: 'كلمة المرور',
      signinSub: 'سجّلوا الدخول إلى مساحة عملكم في Orbital360.',
      signupSub: 'اطلب الوصول إلى مساحة عملك الخاصة.',
      resetSub: 'سنرسل إليك رابطاً آمناً لإعادة التعيين.',
      fullName: 'الاسم الكامل', firstName: 'الاسم الأول', lastName: 'اسم العائلة', email: 'البريد الإلكتروني', password: 'كلمة المرور', confirmPassword: 'تكرار كلمة المرور', showPass: 'إظهار كلمة المرور', hidePass: 'إخفاء كلمة المرور', passMismatch: 'كلمتا المرور غير متطابقتين.', passShort: 'ثمانية أحرف على الأقل.', errCreds: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.', errExists: 'يوجد حساب بهذا البريد — جرّبوا تسجيل الدخول.', errRate: 'محاولات كثيرة. انتظروا دقيقة وحاولوا مجدداً.', errSignupsOff: 'التسجيل الذاتي معطّل حالياً. اطلبوا الوصول عبر hello@efqmassessors.ae.', errEmailSend: 'استلمنا طلب حسابكم لكن تعذّر إرسال رسالة التأكيد. تواصلوا معنا عبر hello@efqmassessors.ae وسنقوم بتفعيلكم.', errNet: 'تعذّر الوصول إلى الخادم. تحققوا من الاتصال وحاولوا مجدداً.', alreadyClient: 'عميل بالفعل؟',
      signin: 'تسجيل الدخول', signup: 'إنشاء حساب', reset: 'إرسال رابط إعادة التعيين', working: 'جارٍ التنفيذ…',
      newClient: 'عميل جديد؟', createLink: 'أنشئ حساباً', forgot: 'هل نسيت كلمة المرور؟', backToSignin: 'العودة لتسجيل الدخول',
      created: 'تم إنشاء الحساب. تحقق من بريدك لتأكيد البريد الإلكتروني، ثم سجّل الدخول.',
      resetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور. تحقق من بريدك.',
      notConfigured: 'الوصول إلى Orbital360 غير مفعّل بعد. يرجى التواصل عبر hello@efqmassessors.ae.',
      failed: 'فشل تسجيل الدخول. يرجى المحاولة مرة أخرى.',
    },
    portal: {
      signedInAs: 'مسجّل الدخول باسم', signOut: 'تسجيل الخروج',
      welcomeA: 'مرحباً بكم في ', strong: 'منطقة العملاء',
      sub: 'مساحة عملكم الخاصة — الوثائق وتقدّم التقييم والتواصل المباشر مع فريق المقيّمين.',
      docs: 'الوثائق', docsEmpty: 'لا توجد وثائق مشتركة بعد. ستظهر مخرجات مشروعكم هنا.', docsTag: 'المخرجات',
      radar: 'تقدّم التقييم', radarText: 'تابعوا درجات RADAR لكل معيار مع تقدّم التقييم، من التشخيص الأساسي إلى درجة الاعتراف الموثّقة.', radarTag: 'درجات RADAR',
      support: 'تواصلوا مع المقيّمين', supportTextA: 'لديكم أسئلة بين الجلسات؟ راسلوا فريق مشروعكم على', supportTextB: '— نردّ خلال يوم عمل واحد.', supportTag: 'الدعم',
    },
  },
}

/* Deep-merge: Spanish over English, so any key not yet translated falls back
   to English instead of crashing the UI. */
function deepMerge(base, over) {
  if (Array.isArray(over)) return over
  if (over && typeof over === 'object' && base && typeof base === 'object') {
    const out = { ...base }
    for (const k of Object.keys(over)) out[k] = deepMerge(base[k], over[k])
    return out
  }
  return over === undefined ? base : over
}
STRINGS.es = deepMerge(STRINGS.en, SITE_ES)

const VALID_LANGS = ['en', 'ar', 'es']

const LangContext = createContext({ lang: 'en', t: STRINGS.en, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    const saved = localStorage.getItem('lang')
    return VALID_LANGS.includes(saved) ? saved : 'en'
  })

  useEffect(() => {
    const t = STRINGS[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
    localStorage.setItem('lang', lang)
  }, [lang])

  const setLang = (l) => { if (VALID_LANGS.includes(l)) setLangState(l) }

  return (
    <LangContext.Provider value={{ lang, t: STRINGS[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
