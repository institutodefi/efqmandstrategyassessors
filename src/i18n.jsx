import { createContext, useContext, useEffect, useState } from 'react'

/* ------------------------------------------------------------------
   Site UI dictionary — English / Arabic (MSA).
   Blog posts are published in English (authored by Alejandro).
------------------------------------------------------------------- */

export const STRINGS = {
  en: {
    dir: 'ltr',
    nav: { about: 'About', services: 'Services', model: 'The EFQM Model', blog: 'Blog', team: 'Team', contact: 'Contact', client: 'Client zone' },
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
      sealCaption: 'EFQM and Strategy Assessors FZCO · Dubai Silicon Oasis · Trade License 59735',
    },
    services: {
      eyebrow: 'Our services',
      titleA: 'Everything your journey to ', strong: 'recognition', titleB: ' needs',
      sub: 'Seven integrated practice areas, one method — the EFQM Model 2025 and its RADAR logic.',
      items: [
        { icon: 'compass', title: 'Strategic Consulting', text: 'Strategy formulation and governance aligned with the EFQM Model — clear direction, priorities and objectives that the whole organisation can execute.' },
        { icon: 'scan', title: 'EFQM Model Assessment', text: 'Full external and self-assessments against the EFQM Model 2025 to identify strengths, improvement areas and a verified maturity score.' },
        { icon: 'shield', title: 'ISO Consultancy', text: 'Implementation and audit-readiness for ISO 9001 (quality), ISO 14001 (environment), ISO 45001 (health & safety) and ISO 27001 (information security) — integrated with your EFQM management system.' },
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
      eyebrow: 'Recognition journey',
      titleA: 'From diagnosis to ', strong: 'EFQM stars', titleB: '',
      sub: 'A staged path with verified milestones — each score opens the door to the next level of international recognition.',
      milestones: [
        { dot: '✓', title: 'Diagnosis', text: 'Baseline self-assessment against the seven criteria of the EFQM Model 2025.' },
        { dot: '1★', title: 'Committed', text: 'Verified 200+ score — EFQM Recognition, first star on the journey.' },
        { dot: '3★', title: 'Advancing', text: 'Consolidated management system with sustained results above 300 points.' },
        { dot: '4★', title: 'Recognised', text: 'Verified 400+ score — an organisation among the region\u2019s reference performers.' },
      ],
    },
    team: {
      eyebrow: 'Core team',
      titleA: 'Assessors who have ', strong: 'seen excellence', titleB: ' up close',
      alex: {
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
      fName: 'Name', fEmail: 'Email', fOrg: 'Organisation', fMsg: 'How can we help?',
      send: 'Send inquiry', sending: 'Sending…',
      okMsg: 'Inquiry sent. We will reply within one business day.',
      errMsg: 'Something went wrong sending your inquiry. Please email hello@efqmassessors.ae.',
      valMsg: 'Please complete name, email and message.',
      note: 'By sending this form you agree to our privacy policy. We only use your details to respond to your inquiry.',
    },
    footer: {
      blurb: 'EFQM and Strategy Assessors FZCO helps organisations achieve sustainable excellence through the EFQM Model — assessment, recognition, strategy and training across the Americas, Europe and MENA.',
      navigate: 'Navigate', contact: 'Contact',
      addr1: 'Building A1, Dubai Digital Park', addr2: 'Dubai Silicon Oasis, Dubai, UAE',
      legal: 'EFQM and Strategy Assessors FZCO · Trade License 59735 · Dubai, UAE',
      group: 'Part of the TuConsultor Group',
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
      titleA: 'The ', strong: '90-day', titleB: ' excellence programme',
      sub: 'A daily post by Alejandro San Nicolás — each one explains a single concept of the EFQM Model 2025 in plain language, from purpose and vision to strategic results. A new post is published every morning.',
      by: 'By', readMore: 'Read',
      day: 'Day', of: 'of 90',
      upcoming: 'Coming up', upcomingSub: 'The programme continues — one concept a day.',
      backToBlog: '← All posts', prev: '← Previous', next: 'Next →',
      langNote: 'Posts are published in English.',
      empty: 'The programme starts soon — the first post publishes on 13 July 2026.',
    },
    auth: {
      back: '← Back to efqmassessors.ae',
      signinTitleA: 'Client ', signinStrong: 'zone',
      signupTitleA: 'Create your ', signupStrong: 'account',
      resetTitleA: 'Reset ', resetStrong: 'password',
      signinSub: 'Sign in to access your engagement workspace.',
      signupSub: 'Request access to your private engagement workspace.',
      resetSub: 'We will email you a secure reset link.',
      fullName: 'Full name', email: 'Email', password: 'Password',
      signin: 'Sign in', signup: 'Create account', reset: 'Send reset link', working: 'Working…',
      newClient: 'New client?', createLink: 'Create an account', forgot: 'Forgot your password?', backToSignin: 'Back to sign in',
      created: 'Account created. Check your inbox to confirm your email, then sign in.',
      resetSent: 'Password reset link sent. Check your inbox.',
      notConfigured: 'The client zone is not configured yet. Please contact hello@efqmassessors.ae.',
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
    nav: { about: 'من نحن', services: 'خدماتنا', model: 'نموذج EFQM', blog: 'المدونة', team: 'الفريق', contact: 'اتصل بنا', client: 'منطقة العملاء' },
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
      sealCaption: 'EFQM and Strategy Assessors FZCO · واحة دبي للسيليكون · رخصة تجارية 59735',
    },
    services: {
      eyebrow: 'خدماتنا',
      titleA: 'كل ما تحتاجه رحلتكم نحو ', strong: 'الاعتراف الدولي', titleB: '',
      sub: 'سبعة مجالات ممارسة متكاملة ومنهجية واحدة — نموذج EFQM 2025 ومنطق RADAR.',
      items: [
        { icon: 'compass', title: 'الاستشارات الاستراتيجية', text: 'صياغة الاستراتيجية والحوكمة بما يتوافق مع نموذج EFQM — اتجاه واضح وأولويات وأهداف يمكن للمؤسسة بأكملها تنفيذها.' },
        { icon: 'scan', title: 'تقييم نموذج EFQM', text: 'تقييمات خارجية وذاتية كاملة وفق نموذج EFQM 2025 لتحديد نقاط القوة ومجالات التحسين ودرجة نضج موثّقة.' },
        { icon: 'shield', title: 'استشارات الأيزو (ISO)', text: 'تطبيق المواصفات والتأهيل للتدقيق: ISO 9001 (الجودة) وISO 14001 (البيئة) وISO 45001 (الصحة والسلامة المهنية) وISO 27001 (أمن المعلومات) — بتكامل مع نظام إدارتكم وفق EFQM.' },
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
      eyebrow: 'رحلة الاعتراف',
      titleA: 'من التشخيص إلى ', strong: 'نجوم EFQM', titleB: '',
      sub: 'مسار مرحلي بمحطات موثّقة — كل درجة تفتح الباب أمام المستوى التالي من الاعتراف الدولي.',
      milestones: [
        { dot: '✓', title: 'التشخيص', text: 'تقييم ذاتي أساسي وفق المعايير السبعة لنموذج EFQM 2025.' },
        { dot: '1★', title: 'الالتزام', text: 'درجة موثّقة تتجاوز 200 نقطة — اعتراف EFQM، النجمة الأولى في الرحلة.' },
        { dot: '3★', title: 'التقدّم', text: 'نظام إداري راسخ ونتائج مستدامة تتجاوز 300 نقطة.' },
        { dot: '4★', title: 'الاعتراف', text: 'درجة موثّقة تتجاوز 400 نقطة — مؤسسة ضمن المؤسسات المرجعية في المنطقة.' },
      ],
    },
    team: {
      eyebrow: 'الفريق الأساسي',
      titleA: 'مقيّمون عاينوا ', strong: 'التميّز', titleB: ' عن قرب',
      alex: {
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
      fName: 'الاسم', fEmail: 'البريد الإلكتروني', fOrg: 'المؤسسة', fMsg: 'كيف يمكننا المساعدة؟',
      send: 'أرسل الاستفسار', sending: 'جارٍ الإرسال…',
      okMsg: 'تم إرسال استفساركم. سنردّ خلال يوم عمل واحد.',
      errMsg: 'حدث خطأ أثناء إرسال الاستفسار. يرجى مراسلتنا على hello@efqmassessors.ae.',
      valMsg: 'يرجى استكمال الاسم والبريد الإلكتروني والرسالة.',
      note: 'بإرسال هذا النموذج فإنكم توافقون على سياسة الخصوصية. نستخدم بياناتكم للرد على استفساركم فقط.',
    },
    footer: {
      blurb: 'تساعد EFQM and Strategy Assessors FZCO المؤسسات على تحقيق التميّز المستدام من خلال نموذج EFQM — تقييم واعتراف واستراتيجية وتدريب في الأمريكتين وأوروبا والشرق الأوسط وشمال أفريقيا.',
      navigate: 'روابط', contact: 'اتصل بنا',
      addr1: 'مبنى A1، حديقة دبي الرقمية', addr2: 'واحة دبي للسيليكون، دبي، الإمارات',
      legal: 'EFQM and Strategy Assessors FZCO · رخصة تجارية 59735 · دبي، الإمارات',
      group: 'جزء من مجموعة TuConsultor',
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
      titleA: 'برنامج التميّز في ', strong: '90 يوماً', titleB: '',
      sub: 'مقال يومي بقلم أليخاندرو سان نيكولاس — يشرح كل مقال مفهوماً واحداً من نموذج EFQM 2025 بلغة بسيطة، من الغاية والرؤية إلى النتائج الاستراتيجية. يُنشر مقال جديد كل صباح.',
      by: 'بقلم', readMore: 'اقرأ',
      day: 'اليوم', of: 'من 90',
      upcoming: 'قادم قريباً', upcomingSub: 'يستمر البرنامج — مفهوم واحد كل يوم.',
      backToBlog: '→ جميع المقالات', prev: '→ السابق', next: 'التالي ←',
      langNote: 'تُنشر المقالات باللغة الإنجليزية.',
      empty: 'يبدأ البرنامج قريباً — يُنشر المقال الأول في 13 يوليو 2026.',
    },
    auth: {
      back: '→ العودة إلى efqmassessors.ae',
      signinTitleA: 'منطقة ', signinStrong: 'العملاء',
      signupTitleA: 'إنشاء ', signupStrong: 'حساب',
      resetTitleA: 'إعادة تعيين ', resetStrong: 'كلمة المرور',
      signinSub: 'سجّل الدخول للوصول إلى مساحة عمل مشروعك.',
      signupSub: 'اطلب الوصول إلى مساحة عملك الخاصة.',
      resetSub: 'سنرسل إليك رابطاً آمناً لإعادة التعيين.',
      fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', password: 'كلمة المرور',
      signin: 'تسجيل الدخول', signup: 'إنشاء حساب', reset: 'إرسال رابط إعادة التعيين', working: 'جارٍ التنفيذ…',
      newClient: 'عميل جديد؟', createLink: 'أنشئ حساباً', forgot: 'هل نسيت كلمة المرور؟', backToSignin: 'العودة لتسجيل الدخول',
      created: 'تم إنشاء الحساب. تحقق من بريدك لتأكيد البريد الإلكتروني، ثم سجّل الدخول.',
      resetSent: 'تم إرسال رابط إعادة تعيين كلمة المرور. تحقق من بريدك.',
      notConfigured: 'منطقة العملاء غير مفعّلة بعد. يرجى التواصل عبر hello@efqmassessors.ae.',
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

const LangContext = createContext({ lang: 'en', t: STRINGS.en, setLang: () => {} })

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'en')

  useEffect(() => {
    const t = STRINGS[lang]
    document.documentElement.lang = lang
    document.documentElement.dir = t.dir
    localStorage.setItem('lang', lang)
  }, [lang])

  const setLang = (l) => setLangState(l)

  return (
    <LangContext.Provider value={{ lang, t: STRINGS[lang], setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
