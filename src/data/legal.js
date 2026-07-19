// ------------------------------------------------------------------
// Legal & compliance content — English + Arabic.
// Structured as ordered sections so the same renderer handles every
// document. Body arrays: strings render as <p>; { list: [...] } renders
// a bulleted list; { sub: '…' } renders a sub-heading.
//
// Company facts used throughout (single source of truth):
//   Entity   : EFQM and Strategy Assessors FZCO
//   Reg      : Dubai Silicon Oasis / DIEZA, Trade License 59735
//   Address  : Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE
//   Email    : hello@efqmassessors.ae   Privacy: privacy@efqmassessors.ae
//   Group    : TuConsultor Group (tuconsultor.com)
// Applicable law: UAE Federal Decree-Law No. 45 of 2021 (PDPL) and,
// where the firm processes EU/EEA personal data, the EU GDPR.
// ------------------------------------------------------------------

export const LEGAL_UPDATED = '2026-07-19' // review date; edit when policies change

export const LEGAL = {
  en: {
    updatedLabel: 'Last updated',
    tocLabel: 'On this page',
    contactBox: {
      title: 'Data protection contact',
      lines: [
        'EFQM and Strategy Assessors FZCO',
        'Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE',
        'privacy@efqmassessors.ae',
      ],
    },

    privacy: {
      slug: 'privacy',
      title: 'Privacy Policy',
      intro:
        'This Privacy Policy explains how EFQM and Strategy Assessors FZCO ("we", "us", "our") collects, uses, discloses and protects personal data when you visit efqmassessors.ae, contact us, or use our client zone. We are committed to processing personal data lawfully, fairly and transparently.',
      sections: [
        {
          h: 'Who we are (data controller)',
          body: [
            'The data controller responsible for your personal data is EFQM and Strategy Assessors FZCO, a Free Zone Company registered in Dubai Silicon Oasis (DIEZA), Trade License 59735, the UAE delivery entity of the TuConsultor Group.',
            'Registered address: Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, United Arab Emirates.',
            'For any question about this policy or your personal data, contact us at privacy@efqmassessors.ae.',
          ],
        },
        {
          h: 'The law we follow',
          body: [
            'We process personal data in accordance with UAE Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data (the "PDPL"). Where we process the personal data of individuals located in the European Union or European Economic Area — for example, clients or contacts based there — we also apply the EU General Data Protection Regulation (GDPR).',
          ],
        },
        {
          h: 'What personal data we collect',
          body: [
            'We only collect data that we need for the purposes described below:',
            {
              list: [
                'Contact and enquiry data — the name, email address, organisation and message you provide through our contact form.',
                'Client account data — the name and email address you use to register for the client zone, and any organisation details you add.',
                'Engagement data — documents, assessment records and correspondence created during a consultancy engagement, stored in your private client workspace.',
                'Technical data — our hosting provider processes standard server logs (including IP address) for a short period purely for security and to deliver the site. If, and only if, you consent to analytics or marketing cookies, we also use Google Tag Manager (GTM-MGHZNN9K) and Google Analytics 4 (G-VJ8ZCVTKG8), which set cookies and process usage data — including a truncated IP address — to tell us how the site is used. You can refuse or withdraw this at any time from Cookie settings, and nothing is loaded until you agree.',
                'Approximate location — to display prices in your local currency, we make a one-off lookup of your country from your IP address using a third-party geolocation service. We store only the resulting currency choice in your browser, never your IP address, and this is used solely to localise pricing.',
              ],
            },
            'We do not knowingly collect special categories of data (such as health, religion or political opinions), and we ask you not to include such data in the contact form.',
          ],
        },
        {
          h: 'How and why we use your data (purposes and legal bases)',
          body: [
            {
              list: [
                'To respond to your enquiries — legal basis: your consent, and our legitimate interest in answering the requests we receive.',
                'To provide and administer the client zone — legal basis: performance of a contract with you or your organisation.',
                'To deliver consultancy services — legal basis: performance of a contract, and our legitimate interest in delivering professional assessments.',
                'To keep the website secure and functioning — legal basis: our legitimate interest in operating a safe, reliable service, and compliance with legal obligations.',
                'To meet legal, accounting and regulatory requirements — legal basis: compliance with a legal obligation.',
              ],
            },
            'Where we rely on consent, you may withdraw it at any time without affecting the lawfulness of processing carried out before withdrawal.',
          ],
        },
        {
          h: 'Cookies and similar technologies',
          body: [
            'We use strictly necessary storage that is essential for the website to function — for example, remembering your language choice, your currency and your cookie preference. We also offer optional analytics and marketing cookies, delivered through Google Tag Manager; these are switched off by default and load only after you consent. We never sell your data. See our Cookie Policy for the full list.',
          ],
        },
        {
          h: 'Who we share data with',
          body: [
            'We never sell your personal data. We share it only where necessary:',
            {
              list: [
                'Service providers who process data on our behalf under written agreements — our hosting provider (Netlify) and our authentication and database provider (Supabase).',
                'TuConsultor Group specialists assigned to your engagement, under confidentiality obligations, where their expertise is required to deliver the service.',
                'Authorities or advisers where we are required to disclose by law, or to establish, exercise or defend legal claims.',
              ],
            },
          ],
        },
        {
          h: 'International transfers',
          body: [
            'Our service providers may process data on servers located outside the UAE, including in the European Union and the United States. Where personal data is transferred across borders, we rely on appropriate safeguards — such as adequacy decisions or standard contractual clauses — and on the transfer conditions permitted under the PDPL.',
          ],
        },
        {
          h: 'How long we keep data',
          body: [
            {
              list: [
                'Enquiry messages: kept for up to 24 months, then deleted, unless they become part of an engagement.',
                'Client account and engagement data: kept for the duration of the engagement and for up to 6 years afterwards to meet professional, contractual and legal obligations.',
                'Server security logs: kept for a short period (typically up to 30 days) by our hosting provider.',
              ],
            },
          ],
        },
        {
          h: 'Your rights',
          body: [
            'Subject to applicable law, you have the right to:',
            {
              list: [
                'Access the personal data we hold about you and request a copy.',
                'Rectify inaccurate or incomplete data.',
                'Erase your data ("right to be forgotten") where there is no overriding reason to keep it.',
                'Restrict or object to certain processing.',
                'Data portability — receive your data in a structured, commonly used format.',
                'Withdraw consent at any time where processing is based on consent.',
              ],
            },
            'To exercise any of these rights, email privacy@efqmassessors.ae. We will respond within the period required by applicable law. You also have the right to lodge a complaint with the UAE Data Office or, if you are in the EU/EEA, your local supervisory authority.',
          ],
        },
        {
          h: 'How we protect your data',
          body: [
            'We apply appropriate technical and organisational measures — including encryption in transit (HTTPS), access controls, row-level security on our database, and least-privilege access for our team — to protect personal data against unauthorised access, loss or misuse.',
          ],
        },
        {
          h: "Children's privacy",
          body: [
            'Our services are intended for organisations and professionals. We do not knowingly collect personal data from children.',
          ],
        },
        {
          h: 'Changes to this policy',
          body: [
            'We may update this policy from time to time. The date at the top shows when it was last revised. Material changes will be highlighted on this page.',
          ],
        },
      ],
    },

    cookies: {
      slug: 'cookies',
      title: 'Cookie Policy',
      intro:
        'This Cookie Policy explains how EFQM and Strategy Assessors FZCO uses cookies and similar browser storage on efqmassessors.ae. We take a privacy-first approach: we use only what is strictly necessary for the site to work.',
      sections: [
        {
          h: 'What cookies are',
          body: [
            'Cookies and similar technologies (such as localStorage) are small pieces of data stored in your browser. They let a website remember your actions and preferences over time.',
          ],
        },
        {
          h: 'The storage we use',
          body: [
            'We use strictly necessary storage, plus optional analytics and marketing cookies that are disabled until you consent. The optional categories are delivered by Google Tag Manager (container GTM-MGHZNN9K) and Google Analytics 4 (measurement ID G-VJ8ZCVTKG8). Analytics cookies are set by Google and typically expire within two years; IP addresses are truncated before storage. We do not sell your data or use it for profiling beyond aggregate usage statistics.',
            {
              list: [
                'lang — remembers whether you are reading the site in English or Arabic. Stored in your browser (localStorage). No expiry until you clear it.',
                'cookie-consent — remembers that you have seen and answered the cookie notice, so we do not show it again. Stored in your browser (localStorage).',
                'Authentication session — if you sign in to the client zone, our provider (Supabase) sets a secure session token so you stay logged in. Cleared when you sign out.',
              ],
            },
          ],
        },
        {
          h: 'Consent',
          body: [
            'Strictly necessary storage does not require consent under the PDPL or GDPR, because the site cannot function without it. Analytics and marketing cookies do require consent: they are set to “denied” by default, Google Tag Manager is not loaded at all until you allow one of those categories, and you can change or withdraw your choice at any time from Cookie settings.',
          ],
        },
        {
          h: 'Managing cookies',
          body: [
            'You can delete or block browser storage at any time through your browser settings. Doing so will reset your language preference and make the cookie notice appear again. Because we use no tracking, blocking storage will not affect your privacy on this site.',
          ],
        },
      ],
    },

    terms: {
      slug: 'terms',
      title: 'Terms of Use',
      intro:
        'These Terms of Use govern your access to and use of the efqmassessors.ae website. By using the site, you agree to these terms.',
      sections: [
        {
          h: 'About us',
          body: [
            'This website is operated by EFQM and Strategy Assessors FZCO, Trade License 59735, registered in Dubai Silicon Oasis (DIEZA), United Arab Emirates.',
          ],
        },
        {
          h: 'Use of the website',
          body: [
            'You may use this website for lawful purposes only. You agree not to misuse the site, attempt to gain unauthorised access, disrupt its operation, or use it in any way that infringes the rights of others.',
          ],
        },
        {
          h: 'Intellectual property',
          body: [
            'All content on this website — including text, branding, the RADAR and model visualisations, and the blog articles authored by our team — is owned by EFQM and Strategy Assessors FZCO or its licensors and is protected by intellectual property law. "EFQM" and the EFQM Model are the property of the EFQM organisation; we reference them as a certified partner and for educational purposes. You may read and share links to our content, but you may not reproduce it commercially without our written permission.',
          ],
        },
        {
          h: 'No professional advice',
          body: [
            'The information on this website, including the blog and the explanation of the EFQM Model, is provided for general information and educational purposes. It does not constitute professional consulting advice and should not be relied upon as such. For advice tailored to your organisation, please engage us directly.',
          ],
        },
        {
          h: 'The client zone',
          body: [
            'Access to the client zone is restricted to authorised users. You are responsible for keeping your login credentials confidential and for all activity under your account. Notify us immediately of any unauthorised use.',
          ],
        },
        {
          h: 'Limitation of liability',
          body: [
            'The website is provided "as is". To the fullest extent permitted by law, we exclude liability for any indirect or consequential loss arising from your use of, or inability to use, the website. Nothing in these terms limits liability that cannot be limited by law.',
          ],
        },
        {
          h: 'External links',
          body: [
            'Our website may link to third-party sites. We are not responsible for their content or privacy practices.',
          ],
        },
        {
          h: 'Governing law',
          body: [
            'These terms are governed by the laws of the United Arab Emirates as applied in the Emirate of Dubai, and you submit to the jurisdiction of the Dubai courts.',
          ],
        },
      ],
    },

    notice: {
      slug: 'legal-notice',
      title: 'Legal Notice',
      intro: 'Company and publisher information for efqmassessors.ae.',
      sections: [
        {
          h: 'Publisher',
          body: [
            {
              list: [
                'Company: EFQM and Strategy Assessors FZCO',
                'Legal form: Free Zone Company (FZCO)',
                'Registration: Dubai Silicon Oasis Authority / DIEZA',
                'Trade License: 59735',
                'Registered office: Building A1, Dubai Digital Park, Dubai Silicon Oasis, Dubai, UAE',
                'Group: Member of the TuConsultor Group (tuconsultor.com)',
              ],
            },
          ],
        },
        {
          h: 'Contact',
          body: [
            {
              list: [
                'General: hello@efqmassessors.ae',
                'Data protection: privacy@efqmassessors.ae',
                'Telephone: +971 50 736 9400',
              ],
            },
          ],
        },
        {
          h: 'Responsible for content',
          body: ['Alejandro San Nicolás Medina, Company Manager.'],
        },
        {
          h: 'Hosting',
          body: [
            'This website is hosted by Netlify, with authentication and database services provided by Supabase.',
          ],
        },
      ],
    },

    accessibility: {
      slug: 'accessibility',
      title: 'Accessibility Statement',
      intro:
        'EFQM and Strategy Assessors FZCO is committed to making efqmassessors.ae accessible to as many people as possible, regardless of ability or technology.',
      sections: [
        {
          h: 'Our commitment',
          body: [
            'We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 at Level AA. We build with semantic HTML, meaningful colour contrast, keyboard-operable navigation, descriptive text alternatives for images, and full right-to-left support for Arabic.',
          ],
        },
        {
          h: 'Ongoing work',
          body: [
            'Accessibility is an ongoing effort. Some content may not yet fully meet our target; where that is the case, we work to correct it.',
          ],
        },
        {
          h: 'Feedback',
          body: [
            'If you encounter any barrier using this website, please tell us at hello@efqmassessors.ae and we will do our best to help and to fix the issue.',
          ],
        },
      ],
    },
  },

  /* ================================================================ */

  ar: {
    updatedLabel: 'آخر تحديث',
    tocLabel: 'في هذه الصفحة',
    contactBox: {
      title: 'جهة التواصل بشأن حماية البيانات',
      lines: [
        'EFQM and Strategy Assessors FZCO',
        'مبنى A1، حديقة دبي الرقمية، واحة دبي للسيليكون، دبي، الإمارات',
        'privacy@efqmassessors.ae',
      ],
    },

    privacy: {
      slug: 'privacy',
      title: 'سياسة الخصوصية',
      intro:
        'توضّح سياسة الخصوصية هذه كيف تجمع شركة EFQM and Strategy Assessors FZCO («نحن») البيانات الشخصية وتستخدمها وتفصح عنها وتحميها عند زيارتكم لموقع efqmassessors.ae أو التواصل معنا أو استخدام منطقة العملاء. ونحن ملتزمون بمعالجة البيانات الشخصية بشكل قانوني وعادل وشفّاف.',
      sections: [
        {
          h: 'من نحن (المتحكّم في البيانات)',
          body: [
            'المتحكّم في البيانات المسؤول عن بياناتكم الشخصية هو شركة EFQM and Strategy Assessors FZCO، وهي شركة منطقة حرة مسجّلة في واحة دبي للسيليكون (DIEZA)، رخصة تجارية 59735، والذراع التنفيذية في الإمارات لمجموعة TuConsultor.',
            'العنوان المسجّل: مبنى A1، حديقة دبي الرقمية، واحة دبي للسيليكون، دبي، الإمارات العربية المتحدة.',
            'لأي استفسار بشأن هذه السياسة أو بياناتكم الشخصية، تواصلوا معنا على privacy@efqmassessors.ae.',
          ],
        },
        {
          h: 'القانون الذي نتبعه',
          body: [
            'نعالج البيانات الشخصية وفقاً للمرسوم بقانون اتحادي رقم 45 لسنة 2021 في شأن حماية البيانات الشخصية («قانون حماية البيانات الإماراتي»). وحين نعالج بيانات أفراد في الاتحاد الأوروبي أو المنطقة الاقتصادية الأوروبية — كعملاء أو جهات اتصال هناك — نطبّق أيضاً اللائحة العامة لحماية البيانات الأوروبية (GDPR).',
          ],
        },
        {
          h: 'البيانات الشخصية التي نجمعها',
          body: [
            'لا نجمع إلا البيانات التي نحتاجها للأغراض الموضّحة أدناه:',
            {
              list: [
                'بيانات التواصل والاستفسار — الاسم والبريد الإلكتروني والمؤسسة والرسالة التي تقدّمونها عبر نموذج التواصل.',
                'بيانات حساب العميل — الاسم والبريد الإلكتروني اللذان تستخدمونهما للتسجيل في منطقة العملاء، وأي تفاصيل مؤسسية تضيفونها.',
                'بيانات المشروع — الوثائق وسجلات التقييم والمراسلات المنشأة خلال مشروع استشاري، والمخزّنة في مساحة عملكم الخاصة.',
                'البيانات التقنية — يعالج مزوّد الاستضافة سجلات خادم قياسية (تشمل عنوان IP) لفترة قصيرة لأغراض الأمن وتقديم الموقع. وإذا وافقتم — وفقط إذا وافقتم — على ملفات التحليلات أو التسويق، فإننا نستخدم أيضاً Google Tag Manager (GTM-MGHZNN9K) وGoogle Analytics 4 (G-VJ8ZCVTKG8)، وهي تضبط ملفات تعريف ارتباط وتعالج بيانات الاستخدام — بما في ذلك عنوان IP مختصر — لتخبرنا كيف يُستخدم الموقع. ويمكنكم الرفض أو سحب الموافقة في أي وقت من إعدادات ملفات تعريف الارتباط، ولا يُحمَّل شيء قبل موافقتكم.',
                'الموقع التقريبي — لعرض الأسعار بعملتكم المحلية، نجري استعلاماً واحداً عن بلدكم من عنوان IP عبر خدمة تحديد موقع من طرف ثالث. ولا نخزّن سوى اختيار العملة الناتج في متصفّحكم، لا عنوان IP، ويُستخدم ذلك فقط لعرض الأسعار محلياً.',
              ],
            },
            'لا نجمع عن قصد فئات خاصة من البيانات (كالصحة أو الدين أو الآراء السياسية)، ونرجو ألّا تُدرجوا مثل هذه البيانات في نموذج التواصل.',
          ],
        },
        {
          h: 'كيف نستخدم بياناتكم ولماذا (الأغراض والأسس القانونية)',
          body: [
            {
              list: [
                'للردّ على استفساراتكم — الأساس القانوني: موافقتكم ومصلحتنا المشروعة في الردّ على ما نتلقّاه من طلبات.',
                'لتوفير منطقة العملاء وإدارتها — الأساس القانوني: تنفيذ عقد معكم أو مع مؤسستكم.',
                'لتقديم الخدمات الاستشارية — الأساس القانوني: تنفيذ العقد ومصلحتنا المشروعة في تقديم تقييمات مهنية.',
                'للحفاظ على أمن الموقع وعمله — الأساس القانوني: مصلحتنا المشروعة في تشغيل خدمة آمنة وموثوقة، والامتثال للالتزامات القانونية.',
                'للوفاء بالمتطلبات القانونية والمحاسبية والتنظيمية — الأساس القانوني: الامتثال لالتزام قانوني.',
              ],
            },
            'حيث نعتمد على الموافقة، يمكنكم سحبها في أي وقت دون التأثير على قانونية المعالجة التي تمّت قبل السحب.',
          ],
        },
        {
          h: 'ملفات تعريف الارتباط والتقنيات المشابهة',
          body: [
            'نستخدم التخزين الضروري تماماً لعمل الموقع — مثل تذكّر اختياركم للغة والعملة وتفضيلكم بشأن ملفات تعريف الارتباط. ونوفّر كذلك ملفات تحليلات وتسويق اختيارية تُقدَّم عبر Google Tag Manager؛ وهي معطّلة افتراضياً ولا تُحمَّل إلا بعد موافقتكم. ولا نبيع بياناتكم أبداً. راجعوا سياسة ملفات تعريف الارتباط للقائمة الكاملة.',
          ],
        },
        {
          h: 'مع من نشارك البيانات',
          body: [
            'لا نبيع بياناتكم الشخصية أبداً. ونشاركها فقط عند الضرورة:',
            {
              list: [
                'مزوّدو الخدمات الذين يعالجون البيانات نيابةً عنّا بموجب اتفاقيات مكتوبة — مزوّد الاستضافة (Netlify) ومزوّد المصادقة وقاعدة البيانات (Supabase).',
                'مختصّو مجموعة TuConsultor المكلّفون بمشروعكم، ضمن التزامات السرية، حين تتطلّب الخدمة خبرتهم.',
                'السلطات أو المستشارون حين يُلزمنا القانون بالإفصاح، أو لإثبات حقوق قانونية أو ممارستها أو الدفاع عنها.',
              ],
            },
          ],
        },
        {
          h: 'عمليات النقل الدولية',
          body: [
            'قد يعالج مزوّدو خدماتنا البيانات على خوادم خارج الإمارات، بما في ذلك في الاتحاد الأوروبي والولايات المتحدة. وحين تُنقل البيانات الشخصية عبر الحدود، نعتمد على ضمانات مناسبة — كقرارات الكفاية أو الشروط التعاقدية المعيارية — وعلى شروط النقل المسموح بها بموجب قانون حماية البيانات الإماراتي.',
          ],
        },
        {
          h: 'مدة الاحتفاظ بالبيانات',
          body: [
            {
              list: [
                'رسائل الاستفسار: تُحفظ حتى 24 شهراً ثم تُحذف، ما لم تصبح جزءاً من مشروع.',
                'بيانات حساب العميل والمشروع: تُحفظ طوال مدة المشروع وحتى 6 سنوات بعده للوفاء بالالتزامات المهنية والتعاقدية والقانونية.',
                'سجلات أمن الخادم: يحتفظ بها مزوّد الاستضافة لفترة قصيرة (عادة حتى 30 يوماً).',
              ],
            },
          ],
        },
        {
          h: 'حقوقكم',
          body: [
            'رهناً بالقانون المعمول به، لكم الحق في:',
            {
              list: [
                'الوصول إلى بياناتكم الشخصية لدينا وطلب نسخة منها.',
                'تصحيح البيانات غير الدقيقة أو غير المكتملة.',
                'محو بياناتكم («الحق في النسيان») حيث لا يوجد سبب راجح للاحتفاظ بها.',
                'تقييد بعض المعالجة أو الاعتراض عليها.',
                'قابلية نقل البيانات — تلقّي بياناتكم بصيغة منظّمة وشائعة الاستخدام.',
                'سحب الموافقة في أي وقت حيث تقوم المعالجة على الموافقة.',
              ],
            },
            'لممارسة أيٍّ من هذه الحقوق، راسلونا على privacy@efqmassessors.ae. وسنردّ خلال المدة التي يقتضيها القانون المعمول به. ولكم أيضاً حق تقديم شكوى إلى مكتب البيانات في الإمارات، أو — إن كنتم في الاتحاد الأوروبي — إلى سلطة الرقابة المحلية لديكم.',
          ],
        },
        {
          h: 'كيف نحمي بياناتكم',
          body: [
            'نطبّق تدابير تقنية وتنظيمية مناسبة — تشمل التشفير أثناء النقل (HTTPS)، وضوابط الوصول، وأمن مستوى الصفوف في قاعدة بياناتنا، ومبدأ أقلّ صلاحية لازمة لفريقنا — لحماية البيانات الشخصية من الوصول غير المصرّح به أو الفقد أو سوء الاستخدام.',
          ],
        },
        {
          h: 'خصوصية الأطفال',
          body: [
            'خدماتنا موجّهة للمؤسسات والمهنيين. ولا نجمع عن قصد بيانات شخصية من الأطفال.',
          ],
        },
        {
          h: 'التعديلات على هذه السياسة',
          body: [
            'قد نحدّث هذه السياسة من حين لآخر. ويبيّن التاريخ في الأعلى موعد آخر مراجعة. وستُبرَز التغييرات الجوهرية في هذه الصفحة.',
          ],
        },
      ],
    },

    cookies: {
      slug: 'cookies',
      title: 'سياسة ملفات تعريف الارتباط',
      intro:
        'توضّح هذه السياسة كيف تستخدم شركة EFQM and Strategy Assessors FZCO ملفات تعريف الارتباط والتخزين المشابه في المتصفح على موقع efqmassessors.ae. ونحن نتبع نهجاً يضع الخصوصية أولاً: لا نستخدم إلا ما هو ضروري تماماً لعمل الموقع.',
      sections: [
        {
          h: 'ما ملفات تعريف الارتباط',
          body: [
            'ملفات تعريف الارتباط والتقنيات المشابهة (مثل localStorage) قطع صغيرة من البيانات تُخزَّن في متصفّحكم. وهي تتيح للموقع تذكّر أفعالكم وتفضيلاتكم عبر الزمن.',
          ],
        },
        {
          h: 'التخزين الذي نستخدمه',
          body: [
            'نستخدم التخزين الضروري تماماً، إضافةً إلى ملفات تحليلات وتسويق اختيارية معطّلة حتى تمنحوا موافقتكم. وتُقدَّم الفئات الاختيارية عبر Google Tag Manager (الحاوية GTM-MGHZNN9K) وGoogle Analytics 4 (معرّف القياس G-VJ8ZCVTKG8). وتضبط Google ملفات التحليلات وتنتهي عادةً خلال سنتين، وتُختصر عناوين IP قبل تخزينها. ولا نبيع بياناتكم ولا نستخدمها للتنميط خارج إحصاءات الاستخدام المجمّعة.',
            {
              list: [
                'lang — يتذكّر ما إذا كنتم تقرؤون الموقع بالعربية أو الإنجليزية. يُخزَّن في متصفّحكم (localStorage) ولا ينتهي حتى تمسحوه.',
                'cookie-consent — يتذكّر أنكم اطّلعتم على إشعار ملفات تعريف الارتباط وأجبتم عليه كي لا نعرضه مجدداً. يُخزَّن في متصفّحكم (localStorage).',
                'جلسة المصادقة — إذا سجّلتم الدخول إلى منطقة العملاء، يضبط مزوّدنا (Supabase) رمز جلسة آمناً لإبقائكم مسجّلين. يُمسح عند تسجيل الخروج.',
              ],
            },
          ],
        },
        {
          h: 'الموافقة',
          body: [
            'التخزين الضروري تماماً لا يتطلّب موافقة بموجب قانون حماية البيانات الإماراتي أو GDPR، لأن الموقع لا يعمل دونه. أما ملفات التحليلات والتسويق فتتطلّب موافقة: فهي مضبوطة على «مرفوض» افتراضياً، ولا يُحمَّل Google Tag Manager إطلاقاً حتى تسمحوا بإحدى هاتين الفئتين، ويمكنكم تغيير اختياركم أو سحبه في أي وقت من إعدادات ملفات تعريف الارتباط.',
          ],
        },
        {
          h: 'إدارة ملفات تعريف الارتباط',
          body: [
            'يمكنكم حذف تخزين المتصفح أو حجبه في أي وقت من إعدادات المتصفح. وسيؤدي ذلك إلى إعادة ضبط تفضيل اللغة وإظهار الإشعار مجدداً. ولأننا لا نستخدم أي تتبّع، فإن حجب التخزين لن يؤثّر على خصوصيتكم على هذا الموقع.',
          ],
        },
      ],
    },

    terms: {
      slug: 'terms',
      title: 'شروط الاستخدام',
      intro:
        'تحكم شروط الاستخدام هذه وصولكم إلى موقع efqmassessors.ae واستخدامكم له. وباستخدام الموقع، فإنكم توافقون على هذه الشروط.',
      sections: [
        {
          h: 'من نحن',
          body: [
            'يُدار هذا الموقع من قبل شركة EFQM and Strategy Assessors FZCO، رخصة تجارية 59735، المسجّلة في واحة دبي للسيليكون (DIEZA)، الإمارات العربية المتحدة.',
          ],
        },
        {
          h: 'استخدام الموقع',
          body: [
            'يجوز لكم استخدام هذا الموقع للأغراض المشروعة فقط. وتوافقون على عدم إساءة استخدام الموقع، أو محاولة الوصول غير المصرّح به، أو تعطيل عمله، أو استخدامه بأي طريقة تنتهك حقوق الآخرين.',
          ],
        },
        {
          h: 'الملكية الفكرية',
          body: [
            'جميع محتويات هذا الموقع — بما في ذلك النصوص والعلامة التجارية ورسوم RADAR والنموذج والمقالات التي يؤلّفها فريقنا — مملوكة لشركة EFQM and Strategy Assessors FZCO أو للمرخّصين لها، ومحميّة بقانون الملكية الفكرية. و«EFQM» ونموذج EFQM ملك لمنظمة EFQM، ونشير إليهما بصفتنا شريكاً معتمداً ولأغراض تعليمية. يمكنكم قراءة محتوانا ومشاركة روابطه، لكن لا يجوز إعادة إنتاجه تجارياً دون إذن مكتوب منّا.',
          ],
        },
        {
          h: 'لا تُعدّ مشورة مهنية',
          body: [
            'المعلومات في هذا الموقع، بما فيها المدونة وشرح نموذج EFQM، مقدّمة لأغراض المعلومات العامة والتعليم. وهي لا تشكّل مشورة استشارية مهنية ولا ينبغي الاعتماد عليها كذلك. وللحصول على مشورة مصمّمة لمؤسستكم، يُرجى التعاقد معنا مباشرة.',
          ],
        },
        {
          h: 'منطقة العملاء',
          body: [
            'الوصول إلى منطقة العملاء مقصور على المستخدمين المصرّح لهم. وأنتم مسؤولون عن الحفاظ على سرية بيانات دخولكم وعن كل نشاط يجري تحت حسابكم. أبلغونا فوراً بأي استخدام غير مصرّح به.',
          ],
        },
        {
          h: 'حدود المسؤولية',
          body: [
            'يُقدَّم الموقع «كما هو». وإلى أقصى حدّ يسمح به القانون، نستبعد المسؤولية عن أي خسارة غير مباشرة أو تبعية تنشأ عن استخدامكم الموقع أو عدم قدرتكم على استخدامه. ولا يحدّ أيٌّ من هذه الشروط من مسؤولية لا يمكن تحديدها قانوناً.',
          ],
        },
        {
          h: 'الروابط الخارجية',
          body: [
            'قد يرتبط موقعنا بمواقع أطراف ثالثة. ولسنا مسؤولين عن محتواها أو ممارسات الخصوصية لديها.',
          ],
        },
        {
          h: 'القانون الحاكم',
          body: [
            'تخضع هذه الشروط لقوانين الإمارات العربية المتحدة كما تُطبَّق في إمارة دبي، وتخضعون لاختصاص محاكم دبي.',
          ],
        },
      ],
    },

    notice: {
      slug: 'legal-notice',
      title: 'البيان القانوني',
      intro: 'معلومات الشركة والناشر لموقع efqmassessors.ae.',
      sections: [
        {
          h: 'الناشر',
          body: [
            {
              list: [
                'الشركة: EFQM and Strategy Assessors FZCO',
                'الشكل القانوني: شركة منطقة حرة (FZCO)',
                'التسجيل: سلطة واحة دبي للسيليكون / DIEZA',
                'الرخصة التجارية: 59735',
                'المقر المسجّل: مبنى A1، حديقة دبي الرقمية، واحة دبي للسيليكون، دبي، الإمارات',
                'المجموعة: عضو في مجموعة TuConsultor (tuconsultor.com)',
              ],
            },
          ],
        },
        {
          h: 'التواصل',
          body: [
            {
              list: [
                'عام: hello@efqmassessors.ae',
                'حماية البيانات: privacy@efqmassessors.ae',
                'الهاتف: +971 50 736 9400',
              ],
            },
          ],
        },
        {
          h: 'المسؤول عن المحتوى',
          body: ['أليخاندرو سان نيكولاس ميدينا، مدير الشركة.'],
        },
        {
          h: 'الاستضافة',
          body: [
            'يُستضاف هذا الموقع لدى Netlify، مع خدمات المصادقة وقاعدة البيانات المقدّمة من Supabase.',
          ],
        },
      ],
    },

    accessibility: {
      slug: 'accessibility',
      title: 'بيان إمكانية الوصول',
      intro:
        'تلتزم شركة EFQM and Strategy Assessors FZCO بجعل موقع efqmassessors.ae متاحاً لأكبر عدد ممكن من الناس، بغضّ النظر عن القدرة أو التقنية.',
      sections: [
        {
          h: 'التزامنا',
          body: [
            'نهدف إلى مطابقة إرشادات إتاحة محتوى الويب (WCAG) 2.1 عند المستوى AA. ونبني بلغة HTML دلالية، وتباين ألوان واضح، وتنقّل قابل للتشغيل بلوحة المفاتيح، وبدائل نصية وصفية للصور، ودعم كامل للكتابة من اليمين إلى اليسار للعربية.',
          ],
        },
        {
          h: 'عمل مستمر',
          body: [
            'إمكانية الوصول جهد مستمر. وقد لا يفي بعض المحتوى بعد بهدفنا؛ وحيثما كان الأمر كذلك، نعمل على تصحيحه.',
          ],
        },
        {
          h: 'ملاحظاتكم',
          body: [
            'إذا واجهتم أي عائق في استخدام هذا الموقع، فأخبرونا على hello@efqmassessors.ae وسنبذل قصارى جهدنا للمساعدة وإصلاح المشكلة.',
          ],
        },
      ],
    },
  },
}

// Order in which legal pages appear in the footer / index.
export const LEGAL_ORDER = ['privacy', 'cookies', 'terms', 'notice', 'accessibility']
