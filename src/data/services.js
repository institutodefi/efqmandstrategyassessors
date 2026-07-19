// ------------------------------------------------------------------
// Content for the three service pages:
//   /consultancy  — Consultancy as a Service + ISO Standards
//   /assessments  — Strategic consulting, EFQM assessment, support, C-level coaching
//   /training     — High-impact workshops and training
// Kept out of i18n.jsx so the pages can be code-split.
// ------------------------------------------------------------------

export const SERVICES = {
  en: {
    tabs: { assessments: 'Assessments', consultancy: 'Consultancy as a Service', training: 'Workshops & Training' },
    hub: {
      eyebrow: 'Our services',
      titleA: 'Three ways we ', strong: 'work with you', titleB: '',
      lead: 'Assessment tells you where you stand. Consultancy moves you forward. Training makes it stick. Most engagements use all three.',
    },
    consultancy: {
      seoTitle: 'Consultancy Services — ISO Standards & Consultancy as a Service | Dubai',
      seoDesc:
        'Management consultancy in Dubai: AI-boosted Consultancy as a Service subscriptions and ISO consultancy across ISO 9001, 14001, 27001, 45001, 42001 and 56001. Fixed monthly pricing in your local currency.',
      keywords:
        'management consultancy Dubai, ISO consultancy UAE, ISO 9001 consultant Dubai, ISO 27001 consultant UAE, ISO 14001, ISO 45001, ISO 42001 AI management system, ISO 56001 innovation, consultancy as a service, AI consulting Dubai, quality management consultant MENA',
      eyebrow: 'Consultancy Services',
      titleA: 'Two services, one ', strong: 'digital-first', titleB: ' way of working',
      lead:
        'We deliver consultancy in two complementary forms: a continuous, AI-boosted subscription that puts a consulting team alongside you month after month, and focused ISO consultancy that takes a standard from gap analysis to audit readiness. Both run inside the same digital AI environment, and both are priced transparently in your local currency.',
      chips: ['Consultancy as a Service', 'ISO 9001 · 14001 · 27001', 'ISO 45001 · 42001 · 56001', 'AI-enabled delivery', 'Dubai · MENA · Europe'],

      caas: {
        eyebrow: 'Service one',
        title: 'Consultancy as a Service',
        intro:
          'Traditional consultancy sells you a project: a scope, a report, an invoice and a goodbye. The knowledge leaves with the consultant, and six months later you are buying the same expertise again. Consultancy as a Service inverts that model. You subscribe to a consulting capability rather than commissioning a deliverable — a named team, a fixed monthly fee, and a working relationship that compounds.',
        paras: [
          'In practice this means your consultants know your organisation. They do not spend the first three weeks of every engagement rediscovering your processes, your politics and your data. They already hold the context, so the time you pay for goes into the work itself — designing a process, preparing an audit, fixing a measurement system, coaching a manager through a difficult change.',
          'The fixed monthly price is deliberate. Hourly billing quietly punishes you for asking questions, so people stop asking, and the small issues that would have been cheap to fix become expensive ones. A subscription removes that friction: you call when you need us, and the cost does not move.',
          'You also choose the intensity. Some organisations need a light touch — a platform, a specialist on call, an occasional session to unblock a decision. Others are mid-transformation and need a multidisciplinary team, defined KPIs, guided implementation and support through an external audit. The three models below cover that spectrum, and you can move between them as your needs change.',
          'Every model is delivered by certified EFQM assessors and management-system specialists, and every model includes the digital AI environment described further down this page.',
        ],
        modelsTitle: 'The three models',
        modelsSub:
          'One logic: you decide the intensity. Prices are shown in your local currency and can be switched at any time.',
      },

      ai: {
        eyebrow: 'Included in every model',
        title: 'A digital AI environment, not a slide deck',
        intro:
          'Every Consultancy as a Service model — and every ISO engagement — runs inside a digital environment where artificial intelligence does the heavy lifting that used to consume consulting hours. This is not a feature we bolt on for the largest clients. It is how we work, at every tier.',
        items: [
          { icon: 'scan', title: 'Evidence analysis at scale', text: 'AI reads your procedures, minutes, audit reports and performance data and maps them against the EFQM Model or the relevant ISO clauses — surfacing gaps, contradictions and orphan risks in hours rather than weeks.' },
          { icon: 'doc', title: 'Documentation that drafts itself', text: 'Policies, process maps, statements of applicability and management-review packs are generated from your real evidence, then reviewed and shaped by a human assessor. You edit rather than start from a blank page.' },
          { icon: 'chart', title: 'Continuous diagnosis', text: 'Instead of an annual snapshot, your maturity is tracked continuously. Scores, trends and priority actions stay current, so management review becomes a decision meeting rather than an archaeology exercise.' },
          { icon: 'chat', title: 'A specialist on call, always', text: 'A private assistant trained on your management system answers day-to-day questions from your team — which procedure applies, what the standard requires, what evidence an auditor will want — without waiting for a scheduled session.' },
          { icon: 'shield', title: 'Your data stays yours', text: 'The environment is governed under ISO 27001 principles and, for the AI itself, ISO 42001: defined ownership, access control, human oversight of every recommendation and no training on your confidential material.' },
          { icon: 'radar', title: 'Human judgement, amplified', text: 'AI accelerates the analysis; it does not sign the assessment. Every finding, score and recommendation is reviewed by a certified assessor before it reaches you — the machine drafts, the assessor decides.' },
        ],
        note:
          'The result is simple: more of your budget buys judgement and change, and less of it buys document handling.',
      },

      iso: {
        eyebrow: 'Service two',
        title: 'ISO Standards Consultancy',
        intro:
          'A certificate on the wall is not the point. The point is a management system your people actually use — one that survives an auditor, and more importantly survives a busy Tuesday. We implement ISO standards as working systems, integrated with each other and with the EFQM Model, so you end up with one architecture rather than six parallel bureaucracies.',
        paras: [
          'Most organisations meet ISO under commercial pressure: a client demands it, a tender requires it, a regulator expects it. That pressure produces the classic failure — a consultant writes a manual, the organisation signs it, nobody reads it, and the system exists only in the week before each audit. It passes, and it changes nothing.',
          'We work the other way round. We start from how you actually operate, map that against the standard, and close the distance with the smallest number of changes that will hold. Where a clause demands something you genuinely do not need at full strength, we right-size it and document the reasoning — that is what a Statement of Applicability is for.',
          'Because we assess as well as implement, we know what auditors look for and where systems fail under examination. And because the same team holds your EFQM work, your ISO systems reinforce your excellence journey instead of competing with it for the same people’s attention.',
        ],
        standardsTitle: 'Six standards, one architecture',
        approachTitle: 'How an ISO engagement runs',
        approach: [
          { step: '01', title: 'Gap analysis', text: 'A structured comparison of your current reality against every clause of the standard, producing a prioritised gap register rather than a generic checklist.' },
          { step: '02', title: 'Design & integration', text: 'We design the system around your existing processes and integrate it with any standards you already hold, so you maintain one set of documentation, one audit programme and one management review.' },
          { step: '03', title: 'Implementation & training', text: 'Documentation is drafted in the AI environment and refined with your process owners, who are trained to run the system — not merely to survive the audit.' },
          { step: '04', title: 'Internal audit & readiness', text: 'We run a full internal audit under real conditions, close the findings, and rehearse the certification audit so there are no surprises on the day.' },
          { step: '05', title: 'Certification & beyond', text: 'We support you through the certification body’s audit and then keep the system alive with continuous monitoring, surveillance-audit preparation and improvement cycles.' },
        ],
      },

      cta: { title: 'Not sure which service fits?', text: 'Tell us where you are and what is forcing the change — a client requirement, a tender, a board decision or a system that stopped working. We will tell you honestly what is needed, including when the answer is less than you expected.', btn: 'Talk to an assessor' },
    },

    assessments: {
      seoTitle: 'EFQM Assessment, Strategic Consulting & Executive Coaching | Dubai',
      seoDesc:
        'Certified EFQM Model 2025 assessments, strategic consulting, high-value implementation support and C-level executive coaching. EGA Senior Assessors with 250+ external assessments across Europe, MENA and the Americas.',
      keywords:
        'EFQM assessment Dubai, EFQM Model 2025 assessment, EFQM certified assessor UAE, strategic consulting Dubai, organisational excellence assessment, RADAR logic, EFQM recognition, executive coaching Dubai, C-level coaching UAE, business excellence MENA',
      eyebrow: 'Assessments',
      titleA: 'Know exactly where you stand — and ', strong: 'what to do next', titleB: '',
      lead:
        'An assessment is only worth what it changes. Ours are run by certified EFQM assessors with more than 250 external assessments behind them, and every one ends where it should: with a scored, evidence-based picture of your organisation and a prioritised plan the leadership team actually owns.',
      chips: ['EFQM Model 2025', 'RADAR logic', 'EGA Senior Assessors', 'External recognition', '250+ assessments'],

      items: [
        {
          icon: 'compass',
          title: 'Strategic Consulting',
          lead: 'Direction before improvement. There is no point optimising execution if the strategy it serves is unclear, contested or quietly obsolete.',
          paras: [
            'We work with leadership teams to formulate strategy that can survive contact with reality: a defined purpose, a vision people can repeat without reading it, and a small number of priorities with owners, measures and deadlines attached. The EFQM Model 2025 provides the frame — purpose and vision, stakeholder expectations, ecosystem and megatrends — so strategy is built on evidence rather than on the loudest voice in the room.',
            'Deployment is where most strategies die, so that is where we spend the time. We translate direction into a governance rhythm: what is reviewed, by whom, how often, and what happens when a measure moves the wrong way. The output is not a document. It is a management routine that keeps the strategy visible after the offsite ends.',
          ],
        },
        {
          icon: 'scan',
          title: 'EFQM Model Assessment',
          lead: 'A rigorous, scored diagnosis against the EFQM Model 2025 — self-assessment, external assessment, or the full path to international recognition.',
          paras: [
            'We assess across all seven criteria and 32 sub-criteria using RADAR logic, working from real evidence: documents, data, and structured interviews at every level from the board to the front line. The result is a maturity score you can defend, a clear statement of strengths, and improvement areas ranked by impact rather than by ease.',
            'Assessments come in several depths. A rapid diagnosis establishes a baseline and builds appetite. A full self-assessment develops your own people as assessors, which is where much of the lasting value sits. An external assessment brings independent scrutiny and comparability — and, when you are ready, prepares the submission for EFQM recognition.',
            'What distinguishes a useful assessment from an expensive one is the feedback. Ours names what is genuinely strong, what is fragile beneath a confident surface, and what the leadership team must decide. If the honest answer is that you are not ready for recognition, we will say so and tell you what would make you ready.',
          ],
        },
        {
          icon: 'support',
          title: 'High-Value Support',
          lead: 'Implementation support for the improvement priorities that matter most — because a report on a shelf changes nothing.',
          paras: [
            'The gap between an assessment and a result is execution, and execution is where organisations run out of time, capacity and momentum. High-value support puts our senior people alongside yours on the two or three initiatives with the largest effect on your score and your business — not on all thirty.',
            'That might mean rebuilding a measurement system so leadership is finally steering by real data, redesigning a core process end to end, establishing the stakeholder-listening architecture the model expects, or preparing an evidence-based submission for recognition. We work as part of your team with defined deliverables, and we hand the capability over as we go.',
          ],
        },
        {
          icon: 'org',
          title: 'C-Class Coaching',
          lead: 'Confidential coaching for chief executives, board members and senior leadership teams carrying a transformation.',
          paras: [
            'Excellence frameworks fail for human reasons far more often than technical ones. A CEO who cannot articulate the purpose convincingly, an executive team privately disagreeing about priorities, a leader who asks for candour and then punishes it — no model survives that, however well documented.',
            'C-class coaching addresses the leadership layer directly. We work one to one with executives on the specific demands the EFQM Model places on leadership — setting direction under uncertainty, engaging stakeholders who disagree with you, driving performance without extinguishing initiative, and modelling the culture you have asked everyone else to adopt.',
            'For leadership teams we facilitate the conversations that rarely happen unaided: where the strategy is genuinely contested, which commitments the team is not keeping, and what the organisation believes about its leaders. These sessions are confidential, evidence-informed, and deliberately uncomfortable where they need to be — that is what makes them worth the time of people whose diaries are the scarcest resource in the organisation.',
          ],
        },
      ],

      cta: { title: 'Start with an honest diagnosis', text: 'Every engagement begins the same way: a conversation about where you are, followed by a free initial diagnosis. No obligation, and no attempt to sell you a bigger programme than you need.', btn: 'Request your diagnosis' },
    },

    training: {
      seoTitle: 'High-Impact Workshops & EFQM Training | Dubai & MENA',
      seoDesc:
        'Certified EFQM training and high-impact workshops in Dubai and across MENA: EFQM Model 2025 foundation, assessor training, RADAR logic, leadership programmes and ISO awareness. In-company, in English and Arabic.',
      keywords:
        'EFQM training Dubai, EFQM certified training UAE, EFQM assessor training, RADAR logic workshop, business excellence training MENA, leadership workshops Dubai, ISO awareness training UAE, corporate training Arabic English, quality management training Dubai',
      eyebrow: 'Workshops & Training',
      titleA: 'High-impact workshops that ', strong: 'change what people do', titleB: ' on Monday',
      lead:
        'Training that ends in applause and changes nothing is a cost, not an investment. Our workshops are built around your own evidence and your own problems, delivered by practising assessors who lecture less and facilitate more — in English or Arabic, at your premises or ours.',
      chips: ['EFQM Model 2025', 'Certified trainers', 'English & Arabic', 'In-company', 'Executive level'],

      approach: {
        title: 'How we run a workshop',
        items: [
          { icon: 'doc', title: 'Built on your material', text: 'We prepare using your strategy, your processes and your data. Participants work on their own organisation, not on a fictional case study from another sector and another decade.' },
          { icon: 'org', title: 'Facilitated, not lectured', text: 'Short inputs followed by structured work in groups. The trainer’s job is to provoke better thinking and settle disagreements with evidence, not to read slides aloud.' },
          { icon: 'check', title: 'Ends with commitments', text: 'Every session closes with named actions, owners and dates that feed straight into your improvement plan — so the energy in the room survives the week.' },
          { icon: 'chat', title: 'Delivered in your language', text: 'Full delivery in English or Arabic, with bilingual materials. Terminology follows the standardised Arabic EFQM vocabulary we use across our model documentation.' },
        ],
      },

      programmesTitle: 'Programmes',
      programmes: [
        { title: 'EFQM Model 2025 Foundation', dur: '1 day', who: 'Managers and improvement teams', text: 'The complete architecture — Direction, Execution, Results, the seven criteria and 32 sub-criteria — and what each one actually asks of an organisation. Participants leave able to read the model and locate their own work inside it.' },
        { title: 'RADAR Logic in Practice', dur: '1–2 days', who: 'Internal assessors, quality and strategy teams', text: 'The scoring engine of the model, taught by scoring. Participants apply RADAR to real evidence from their own organisation, calibrate against each other, and learn why two honest assessors reach different scores — and how to close that gap.' },
        { title: 'Internal Assessor Training', dur: '2–3 days', who: 'Future internal assessment teams', text: 'How to plan and run a self-assessment: evidence gathering, interviewing, consensus, scoring and — hardest of all — writing feedback that leaders act on rather than resent. Includes a live assessment exercise.' },
        { title: 'Executive & Board Programme', dur: 'Half day', who: 'C-suite, boards, owners', text: 'A condensed, high-intensity session for people with no time and full accountability. What the model demands of leadership specifically, what your current maturity implies for strategy, and the three decisions only this room can make.' },
        { title: 'Strategy Deployment Workshop', dur: '1–2 days', who: 'Leadership and planning teams', text: 'Turning strategic direction into an executable plan: priorities, owners, measures, review rhythm and the discipline of stopping things. Output is a deployment map you can run the year on.' },
        { title: 'ISO Awareness & Internal Auditor', dur: '1–3 days', who: 'Process owners and internal auditors', text: 'Practical training across ISO 9001, 14001, 27001, 45001, 42001 and 56001 — what the standard requires, how it integrates with your EFQM system, and how to audit it so the audit finds something worth finding.' },
        { title: 'Innovation & AI Governance', dur: '1 day', who: 'Leadership, IT, risk and innovation teams', text: 'Managing innovation as a portfolio (ISO 56001) and governing artificial intelligence responsibly (ISO 42001): inventory, impact assessment, meaningful human oversight and data governance, using your own live use cases.' },
        { title: 'Custom In-Company Programme', dur: 'Designed with you', who: 'Any level', text: 'Built around a specific challenge — a recognition submission, a merger, a culture shift, a failing measurement system — and sequenced across several sessions so learning is applied between them rather than forgotten after them.' },
      ],

      cta: { title: 'Design a programme with us', text: 'Tell us the audience, the constraint and the outcome you need. We will propose a format — a single workshop, a sequence, or training embedded in a wider assessment — and be straightforward about what training can and cannot fix.', btn: 'Discuss your programme' },
    },
  },

  ar: {
    tabs: { assessments: 'التقييمات', consultancy: 'الاستشارة كخدمة', training: 'ورش العمل والتدريب' },
    hub: {
      eyebrow: 'خدماتنا',
      titleA: 'ثلاث طرق ', strong: 'نعمل بها معكم', titleB: '',
      lead: 'التقييم يخبركم أين تقفون. والاستشارة تدفعكم إلى الأمام. والتدريب يجعل الأثر يدوم. ومعظم المشاريع تستخدم الثلاث.',
    },
    consultancy: {
      seoTitle: 'الخدمات الاستشارية — مواصفات ISO والاستشارة كخدمة | دبي',
      seoDesc:
        'استشارات إدارية في دبي: اشتراكات الاستشارة كخدمة المدعومة بالذكاء الاصطناعي واستشارات ISO عبر 9001 و14001 و27001 و45001 و42001 و56001، بأسعار شهرية ثابتة بعملتكم المحلية.',
      keywords:
        'استشارات إدارية دبي, استشارات ISO الإمارات, استشاري ISO 9001 دبي, ISO 27001 الإمارات, الاستشارة كخدمة, الذكاء الاصطناعي في الاستشارات, إدارة الجودة',
      eyebrow: 'الخدمات الاستشارية',
      titleA: 'خدمتان، وطريقة عمل واحدة ', strong: 'رقمية أولاً', titleB: '',
      lead:
        'نقدّم الاستشارات في صورتين متكاملتين: اشتراك مستمر مدعوم بالذكاء الاصطناعي يضع فريقاً استشارياً إلى جانبكم شهراً بعد شهر، واستشارات ISO مركّزة تنقل المواصفة من تحليل الفجوات إلى الجاهزية للتدقيق. وكلتاهما تعملان داخل البيئة الرقمية الذكية نفسها، وبأسعار شفافة بعملتكم المحلية.',
      chips: ['الاستشارة كخدمة', 'ISO 9001 · 14001 · 27001', 'ISO 45001 · 42001 · 56001', 'تنفيذ مدعوم بالذكاء الاصطناعي', 'دبي · الشرق الأوسط · أوروبا'],

      caas: {
        eyebrow: 'الخدمة الأولى',
        title: 'الاستشارة كخدمة',
        intro:
          'تبيعكم الاستشارة التقليدية مشروعاً: نطاقاً وتقريراً وفاتورة ووداعاً. تغادر المعرفة مع المستشار، وبعد ستة أشهر تشترون الخبرة نفسها من جديد. أما الاستشارة كخدمة فتقلب هذا النموذج: أنتم تشتركون في قدرة استشارية بدل أن تطلبوا مُخرجاً — فريق مسمّى، ورسم شهري ثابت، وعلاقة عمل تتراكم قيمتها.',
        paras: [
          'عملياً، هذا يعني أن مستشاريكم يعرفون مؤسستكم. لا يقضون الأسابيع الثلاثة الأولى من كل مهمة في إعادة اكتشاف عملياتكم وتوازناتكم وبياناتكم. فالسياق لديهم أصلاً، ما يعني أن الوقت الذي تدفعون مقابله يذهب إلى العمل نفسه — تصميم عملية، أو الإعداد لتدقيق، أو إصلاح نظام قياس، أو مصاحبة مدير عبر تغيير صعب.',
          'والسعر الشهري الثابت مقصود. فالفوترة بالساعة تعاقبكم بهدوء على طرح الأسئلة، فيتوقّف الناس عن السؤال، وتتحوّل المشكلات الصغيرة التي كان إصلاحها رخيصاً إلى مشكلات مكلفة. الاشتراك يزيل هذا الاحتكاك: تتّصلون حين تحتاجون، والتكلفة لا تتحرّك.',
          'وأنتم تختارون الكثافة أيضاً. بعض المؤسسات تحتاج لمسة خفيفة — منصّة ومتخصّص عند الطلب وجلسة عرضية لفكّ عقدة قرار. وأخرى في منتصف تحوّل وتحتاج فريقاً متعدّد التخصصات ومؤشرات محدّدة وتطبيقاً مصحوباً ودعماً خلال تدقيق خارجي. والنماذج الثلاثة أدناه تغطّي هذا الطيف، ويمكنكم الانتقال بينها مع تغيّر احتياجاتكم.',
          'كل نموذج يُنفَّذ على يد مقيّمين معتمدين من EFQM ومتخصّصين في أنظمة الإدارة، وكل نموذج يتضمّن البيئة الرقمية الذكية الموضّحة أدناه.',
        ],
        modelsTitle: 'النماذج الثلاثة',
        modelsSub: 'منطق واحد: أنتم تحدّدون الكثافة. تُعرض الأسعار بعملتكم المحلية ويمكن تبديلها في أي وقت.',
      },

      ai: {
        eyebrow: 'مُضمَّنة في كل نموذج',
        title: 'بيئة رقمية ذكية، لا عرض شرائح',
        intro:
          'كل نموذج من نماذج الاستشارة كخدمة — وكل مشروع ISO — يعمل داخل بيئة رقمية يتولّى فيها الذكاء الاصطناعي العمل الثقيل الذي كان يلتهم ساعات الاستشارة. وهذه ليست ميزة نضيفها لأكبر العملاء، بل هي طريقة عملنا في كل المستويات.',
        items: [
          { icon: 'scan', title: 'تحليل الأدلة على نطاق واسع', text: 'يقرأ الذكاء الاصطناعي إجراءاتكم ومحاضركم وتقارير التدقيق وبيانات الأداء، ويقابلها بنموذج EFQM أو ببنود ISO ذات الصلة — فيكشف الفجوات والتناقضات والمخاطر بلا مالك خلال ساعات بدل أسابيع.' },
          { icon: 'doc', title: 'توثيق يكتب نفسه', text: 'تُولَّد السياسات وخرائط العمليات وبيانات القابلية للتطبيق وحزم مراجعة الإدارة من أدلتكم الحقيقية، ثم يراجعها ويصوغها مقيّم بشري. فتحرّرون بدل أن تبدأوا من صفحة بيضاء.' },
          { icon: 'chart', title: 'تشخيص مستمر', text: 'بدل لقطة سنوية، يُتابَع نضجكم باستمرار. تبقى الدرجات والاتجاهات وأولويات العمل محدّثة، فتصير مراجعة الإدارة اجتماع قرار لا تمريناً في علم الآثار.' },
          { icon: 'chat', title: 'متخصّص متاح دائماً', text: 'مساعد خاص مُدرَّب على نظام إدارتكم يجيب أسئلة فريقكم اليومية — أي إجراء ينطبق، وما الذي تطلبه المواصفة، وأي دليل سيطلبه المدقّق — دون انتظار جلسة مجدولة.' },
          { icon: 'shield', title: 'بياناتكم تبقى لكم', text: 'تُحكَم البيئة وفق مبادئ ISO 27001، والذكاء الاصطناعي نفسه وفق ISO 42001: ملكية محدّدة، وضبط وصول، وإشراف بشري على كل توصية، وبلا تدريب على موادّكم السرّية.' },
          { icon: 'radar', title: 'حكم بشري مُضاعَف', text: 'الذكاء الاصطناعي يسرّع التحليل ولا يوقّع التقييم. كل ملاحظة ودرجة وتوصية يراجعها مقيّم معتمد قبل أن تصلكم — الآلة تصوغ، والمقيّم يقرّر.' },
        ],
        note: 'والنتيجة بسيطة: جزء أكبر من ميزانيتكم يشتري الحكم والتغيير، وجزء أقلّ يشتري مناولة الوثائق.',
      },

      iso: {
        eyebrow: 'الخدمة الثانية',
        title: 'استشارات مواصفات ISO',
        intro:
          'الشهادة على الجدار ليست الغاية. الغاية نظام إدارة يستخدمه موظفوكم فعلاً — نظام ينجو من المدقّق، والأهمّ أن ينجو من يوم ثلاثاء مزدحم. نطبّق مواصفات ISO كأنظمة عاملة، متكاملة فيما بينها ومع نموذج EFQM، فتنتهون ببنية واحدة لا بستّ بيروقراطيات متوازية.',
        paras: [
          'معظم المؤسسات تلتقي ISO تحت ضغط تجاري: عميل يطلبها، أو مناقصة تشترطها، أو جهة تنظيمية تتوقّعها. وينتج هذا الضغط الفشل الكلاسيكي — يكتب مستشار دليلاً، وتوقّعه المؤسسة، ولا يقرؤه أحد، ولا يوجد النظام إلا في الأسبوع السابق لكل تدقيق. فيجتاز التدقيق، ولا يغيّر شيئاً.',
          'ونحن نعمل بالعكس. نبدأ من طريقة عملكم الفعلية، ونقابلها بالمواصفة، ونردم المسافة بأقلّ عدد من التغييرات القابلة للثبات. وحين يطلب بند شيئاً لا تحتاجونه بكامل قوّته فعلاً، نضبط حجمه ونوثّق المنطق — فهذا ما وُجد له بيان القابلية للتطبيق.',
          'ولأننا نقيّم كما نطبّق، نعرف ما يبحث عنه المدقّقون وأين تنهار الأنظمة تحت الفحص. ولأن الفريق نفسه يحمل عملكم في EFQM، تعزّز أنظمة ISO لديكم رحلة التميّز بدل أن تنافسها على انتباه الأشخاص أنفسهم.',
        ],
        standardsTitle: 'ست مواصفات، بنية واحدة',
        approachTitle: 'كيف يسير مشروع ISO',
        approach: [
          { step: '01', title: 'تحليل الفجوات', text: 'مقارنة منهجية بين واقعكم الحالي وكل بند في المواصفة، تنتج سجلّ فجوات مرتّب الأولويات لا قائمة تحقّق عامة.' },
          { step: '02', title: 'التصميم والتكامل', text: 'نصمّم النظام حول عملياتكم القائمة وندمجه مع أي مواصفات تحملونها، فتحتفظون بمجموعة توثيق واحدة وبرنامج تدقيق واحد ومراجعة إدارة واحدة.' },
          { step: '03', title: 'التطبيق والتدريب', text: 'تُصاغ الوثائق في البيئة الذكية وتُنقَّح مع مالكي العمليات لديكم، الذين يُدرَّبون على تشغيل النظام لا على النجاة من التدقيق فحسب.' },
          { step: '04', title: 'التدقيق الداخلي والجاهزية', text: 'ننفّذ تدقيقاً داخلياً كاملاً بظروف حقيقية، ونغلق الملاحظات، ونتمرّن على تدقيق الاعتماد كي لا تكون هناك مفاجآت في يومه.' },
          { step: '05', title: 'الاعتماد وما بعده', text: 'ندعمكم خلال تدقيق جهة المنح، ثم نُبقي النظام حيّاً عبر مراقبة مستمرة وإعداد لتدقيقات المتابعة ودورات تحسين.' },
        ],
      },

      cta: { title: 'غير متأكّدين أي خدمة تناسبكم؟', text: 'أخبرونا أين أنتم وما الذي يفرض التغيير — متطلّب عميل، أو مناقصة، أو قرار مجلس، أو نظام توقّف عن العمل. وسنخبركم بصدق بما يلزم، بما في ذلك حين يكون الجواب أقلّ ممّا توقّعتم.', btn: 'تحدّث إلى مقيّم' },
    },

    assessments: {
      seoTitle: 'تقييم EFQM والاستشارات الاستراتيجية وتدريب القيادات | دبي',
      seoDesc:
        'تقييمات معتمدة وفق نموذج EFQM 2025، واستشارات استراتيجية، ودعم تنفيذ عالي القيمة، وتوجيه تنفيذي للإدارة العليا. مقيّمون كبار بأكثر من 250 تقييماً خارجياً عبر أوروبا والشرق الأوسط والأمريكتين.',
      keywords:
        'تقييم EFQM دبي, نموذج EFQM 2025, مقيّم EFQM معتمد الإمارات, استشارات استراتيجية دبي, تقييم التميّز المؤسسي, منطق RADAR, التوجيه التنفيذي',
      eyebrow: 'التقييمات',
      titleA: 'اعرفوا أين تقفون بالضبط — و', strong: 'ما الخطوة التالية', titleB: '',
      lead:
        'لا يساوي التقييم إلا ما يغيّره. تقييماتنا ينفّذها مقيّمون معتمدون من EFQM خلفهم أكثر من 250 تقييماً خارجياً، وكلٌّ منها ينتهي حيث ينبغي: بصورة مُقيَّمة قائمة على الأدلة لمؤسستكم، وخطة أولويات يملكها فريق القيادة فعلاً.',
      chips: ['نموذج EFQM 2025', 'منطق RADAR', 'مقيّمون كبار', 'الاعتراف الخارجي', '+250 تقييماً'],

      items: [
        {
          icon: 'compass',
          title: 'الاستشارات الاستراتيجية',
          lead: 'الاتجاه قبل التحسين. لا معنى لتحسين التنفيذ إذا كانت الاستراتيجية التي يخدمها غامضة أو متنازعاً عليها أو متقادمة بصمت.',
          paras: [
            'نعمل مع فرق القيادة على صياغة استراتيجية تصمد أمام الواقع: غاية محدّدة، ورؤية يستطيع الناس ترديدها دون قراءتها، وعدد صغير من الأولويات المرفقة بمالكين ومقاييس ومواعيد. ويوفّر نموذج EFQM 2025 الإطار — الغاية والرؤية، وتوقّعات أصحاب المصلحة، والمنظومة والاتجاهات الكبرى — فتُبنى الاستراتيجية على الأدلة لا على أعلى صوت في الغرفة.',
            'والنشر هو حيث تموت معظم الاستراتيجيات، ولذلك نصرف الوقت هناك. نترجم الاتجاه إلى إيقاع حوكمة: ما الذي يُراجَع، وبواسطة من، وكم مرة، وماذا يحدث حين يتحرّك مقياس في الاتجاه الخاطئ. والمُخرَج ليس وثيقة، بل روتين إداري يُبقي الاستراتيجية مرئية بعد انتهاء اللقاء.',
          ],
        },
        {
          icon: 'scan',
          title: 'تقييم نموذج EFQM',
          lead: 'تشخيص صارم ومُقيَّم وفق نموذج EFQM 2025 — تقييم ذاتي، أو تقييم خارجي، أو المسار الكامل نحو الاعتراف الدولي.',
          paras: [
            'نقيّم عبر المعايير السبعة والمعايير الفرعية الاثنين والثلاثين بمنطق RADAR، انطلاقاً من أدلة حقيقية: وثائق وبيانات ومقابلات منظّمة على كل المستويات من المجلس إلى خطّ المواجهة. والنتيجة درجة نضج يمكنكم الدفاع عنها، وبيان واضح لنقاط القوة، ومجالات تحسين مرتّبة بحسب الأثر لا بحسب السهولة.',
            'وتأتي التقييمات بأعماق متعدّدة. التشخيص السريع يرسي خطّ أساس ويبني الرغبة. والتقييم الذاتي الكامل يطوّر موظفيكم كمقيّمين، وهنا يكمن كثير من القيمة الدائمة. أما التقييم الخارجي فيجلب تدقيقاً مستقلاً وقابلية للمقارنة — ويُعدّ الملف لاعتراف EFQM حين تكونون جاهزين.',
            'وما يميّز التقييم المفيد عن التقييم المكلف هو التغذية الراجعة. تسمّي تغذيتنا ما هو قويّ حقاً، وما هو هشّ تحت سطح واثق، وما الذي يجب أن يقرّره فريق القيادة. وإن كان الجواب الصادق أنكم غير جاهزين للاعتراف، سنقولها ونخبركم بما يجعلكم جاهزين.',
          ],
        },
        {
          icon: 'support',
          title: 'الدعم عالي القيمة',
          lead: 'دعم تنفيذي لأولويات التحسين الأكثر أهمية — فالتقرير على الرفّ لا يغيّر شيئاً.',
          paras: [
            'الفجوة بين التقييم والنتيجة هي التنفيذ، والتنفيذ هو حيث ينفد من المؤسسات الوقت والقدرة والزخم. يضع الدعم عالي القيمة كبار خبرائنا إلى جانب فريقكم في المبادرتين أو الثلاث ذات الأثر الأكبر على درجتكم وعلى أعمالكم — لا في الثلاثين جميعاً.',
            'وقد يعني ذلك إعادة بناء نظام قياس كي تقود الإدارة أخيراً ببيانات حقيقية، أو إعادة تصميم عملية جوهرية من طرف إلى طرف، أو إرساء بنية الإنصات لأصحاب المصلحة التي يتوقّعها النموذج، أو إعداد ملف قائم على الأدلة للاعتراف. نعمل كجزء من فريقكم بمُخرَجات محدّدة، ونسلّم القدرة تباعاً.',
          ],
        },
        {
          icon: 'org',
          title: 'توجيه الإدارة العليا',
          lead: 'توجيه سرّي للرؤساء التنفيذيين وأعضاء المجالس وفرق القيادة العليا الذين يحملون تحوّلاً.',
          paras: [
            'تفشل أُطُر التميّز لأسباب بشرية أكثر بكثير من الأسباب التقنية. رئيس تنفيذي لا يستطيع التعبير عن الغاية بإقناع، وفريق تنفيذي يختلف سرّاً على الأولويات، وقائد يطلب الصراحة ثم يعاقب عليها — لا ينجو نموذج من ذلك مهما أُحسِن توثيقه.',
            'يعالج توجيه الإدارة العليا طبقة القيادة مباشرة. نعمل فردياً مع التنفيذيين على ما يطلبه نموذج EFQM من القيادة تحديداً — تحديد الاتجاه في ظلّ عدم اليقين، وإشراك أصحاب مصلحة يخالفونكم الرأي، ودفع الأداء دون إطفاء المبادرة، وتجسيد الثقافة التي طلبتم من الجميع تبنّيها.',
            'ولفرق القيادة، نيسّر المحادثات التي نادراً ما تحدث بلا مساعدة: أين الاستراتيجية متنازع عليها فعلاً، وأي الالتزامات لا يفي بها الفريق، وما الذي تعتقده المؤسسة عن قادتها. هذه الجلسات سرّية، ومستندة إلى الأدلة، ومزعجة عن قصد حيث يلزم — وهذا ما يجعلها تستحقّ وقت أشخاص جداولهم أندر مورد في المؤسسة.',
          ],
        },
      ],

      cta: { title: 'ابدأوا بتشخيص صادق', text: 'كل تعاون يبدأ بالطريقة نفسها: حديث عن موقعكم الحالي، يتبعه تشخيص أولي مجاني. بلا التزام، وبلا محاولة لبيعكم برنامجاً أكبر ممّا تحتاجون.', btn: 'اطلبوا تشخيصكم' },
    },

    training: {
      seoTitle: 'ورش عمل عالية الأثر وتدريب EFQM | دبي والشرق الأوسط',
      seoDesc:
        'تدريب معتمد على EFQM وورش عمل عالية الأثر في دبي والمنطقة: أساسيات نموذج EFQM 2025، وتدريب المقيّمين، ومنطق RADAR، وبرامج القيادة، والتوعية بمواصفات ISO — داخل المؤسسة وبالعربية والإنجليزية.',
      keywords:
        'تدريب EFQM دبي, تدريب معتمد EFQM الإمارات, تدريب مقيّمي EFQM, ورشة منطق RADAR, تدريب التميّز المؤسسي, ورش القيادة دبي, تدريب ISO الإمارات',
      eyebrow: 'ورش العمل والتدريب',
      titleA: 'ورش عمل عالية الأثر ', strong: 'تغيّر ما يفعله الناس', titleB: ' يوم الاثنين',
      lead:
        'التدريب الذي ينتهي بالتصفيق ولا يغيّر شيئاً كلفة لا استثمار. تُبنى ورشنا حول أدلّتكم أنتم ومشكلاتكم أنتم، ويقدّمها مقيّمون ممارسون يحاضرون أقلّ وييسّرون أكثر — بالعربية أو الإنجليزية، في مقرّكم أو مقرّنا.',
      chips: ['نموذج EFQM 2025', 'مدرّبون معتمدون', 'العربية والإنجليزية', 'داخل المؤسسة', 'مستوى تنفيذي'],

      approach: {
        title: 'كيف ندير ورشة',
        items: [
          { icon: 'doc', title: 'مبنيّة على موادّكم', text: 'نحضّر باستخدام استراتيجيتكم وعملياتكم وبياناتكم. يعمل المشاركون على مؤسستهم، لا على حالة دراسية خيالية من قطاع آخر وعقد آخر.' },
          { icon: 'org', title: 'تيسير لا محاضرة', text: 'مداخلات قصيرة يتبعها عمل منظّم في مجموعات. مهمّة المدرّب استفزاز تفكير أفضل وحسم الخلافات بالأدلة، لا قراءة الشرائح بصوت عالٍ.' },
          { icon: 'check', title: 'تنتهي بالتزامات', text: 'تُختَم كل جلسة بإجراءات مسمّاة ومالكين ومواعيد تصبّ مباشرة في خطة تحسينكم — فيبقى زخم الغرفة بعد انتهاء الأسبوع.' },
          { icon: 'chat', title: 'بلغتكم', text: 'تقديم كامل بالعربية أو الإنجليزية، بموادّ ثنائية اللغة. وتتبع المصطلحات المفردات العربية الموحّدة لـ EFQM التي نستخدمها في وثائق النموذج لدينا.' },
        ],
      },

      programmesTitle: 'البرامج',
      programmes: [
        { title: 'أساسيات نموذج EFQM 2025', dur: 'يوم واحد', who: 'المدراء وفرق التحسين', text: 'البنية الكاملة — التوجيه والتنفيذ والنتائج، والمعايير السبعة والمعايير الفرعية الاثنان والثلاثون — وما يطلبه كلٌّ منها فعلاً من المؤسسة. يغادر المشاركون قادرين على قراءة النموذج وتحديد موقع عملهم داخله.' },
        { title: 'منطق RADAR في الممارسة', dur: 'يوم إلى يومين', who: 'المقيّمون الداخليون وفرق الجودة والاستراتيجية', text: 'محرّك التقييم في النموذج، يُدرَّس بالتقييم. يطبّق المشاركون RADAR على أدلة حقيقية من مؤسستهم، ويعايرون فيما بينهم، ويتعلّمون لماذا يصل مقيّمان صادقان إلى درجتين مختلفتين — وكيف تُردَم تلك الفجوة.' },
        { title: 'تدريب المقيّمين الداخليين', dur: 'يومان إلى ثلاثة', who: 'فرق التقييم الداخلي المستقبلية', text: 'كيف تُخطَّط عملية تقييم ذاتي وتُدار: جمع الأدلة، والمقابلات، والتوافق، والتقييم، والأصعب — كتابة تغذية راجعة يتصرّف القادة بناءً عليها بدل أن يستاؤوا منها. يشمل تمرين تقييم حيّ.' },
        { title: 'برنامج التنفيذيين والمجالس', dur: 'نصف يوم', who: 'الإدارة العليا والمجالس والمُلّاك', text: 'جلسة مكثّفة موجزة لمن لا وقت لديهم ومسؤوليتهم كاملة. ما يطلبه النموذج من القيادة تحديداً، وما يعنيه نضجكم الحالي للاستراتيجية، والقرارات الثلاثة التي لا يستطيع اتخاذها إلا من في هذه الغرفة.' },
        { title: 'ورشة نشر الاستراتيجية', dur: 'يوم إلى يومين', who: 'فرق القيادة والتخطيط', text: 'تحويل الاتجاه الاستراتيجي إلى خطة قابلة للتنفيذ: أولويات ومالكون ومقاييس وإيقاع مراجعة، وانضباط التوقّف عن أشياء. والمُخرَج خريطة نشر تديرون بها العام.' },
        { title: 'التوعية بـ ISO والمدقّق الداخلي', dur: 'يوم إلى ثلاثة', who: 'مالكو العمليات والمدقّقون الداخليون', text: 'تدريب عملي عبر ISO 9001 و14001 و27001 و45001 و42001 و56001 — ما تطلبه المواصفة، وكيف تتكامل مع نظام EFQM لديكم، وكيف تُدقَّق بحيث يجد التدقيق ما يستحقّ أن يُوجد.' },
        { title: 'الابتكار وحوكمة الذكاء الاصطناعي', dur: 'يوم واحد', who: 'القيادة وتقنية المعلومات والمخاطر والابتكار', text: 'إدارة الابتكار كمحفظة (ISO 56001) وحوكمة الذكاء الاصطناعي بمسؤولية (ISO 42001): الحصر، وتقييم الأثر، والإشراف البشري ذو المعنى، وحوكمة البيانات — باستخدام حالات استخدامكم الحيّة.' },
        { title: 'برنامج مخصّص داخل المؤسسة', dur: 'يُصمَّم معكم', who: 'أي مستوى', text: 'مبنيّ حول تحدٍّ محدّد — ملف اعتراف، أو اندماج، أو تحوّل ثقافي، أو نظام قياس متعثّر — ومتسلسل عبر جلسات عدّة كي يُطبَّق التعلّم بينها بدل أن يُنسى بعدها.' },
      ],

      cta: { title: 'صمّموا برنامجاً معنا', text: 'أخبرونا بالجمهور والقيد والنتيجة التي تحتاجونها. سنقترح صيغة — ورشة واحدة، أو سلسلة، أو تدريباً مدمجاً في تقييم أوسع — وسنكون صرحاء بشأن ما يستطيع التدريب إصلاحه وما لا يستطيع.', btn: 'ناقشوا برنامجكم' },
    },
  },
}
