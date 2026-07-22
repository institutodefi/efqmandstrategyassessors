import { MODEL_ES } from './modelES.js'
// The EFQM Model 2025 - criteria & sub-criteria content (EN/AR)
export const MODEL = {
 "en": [
  {
   "num": "1",
   "block": "Direction",
   "title": "Purpose, Vision & Strategy",
   "desc": "An excellent organisation is defined by an inspiring purpose, a future-oriented vision and a strategy focused on creating sustainable value.",
   "subs": [
    {
     "id": "1.1",
     "name": "Define Purpose & Vision",
     "desc": "The organisation clearly articulates why it exists (purpose) and what it aspires to become (vision), demonstrating leadership commitment and communicating both in an inspiring way to key stakeholders.",
     "comment": "Purpose is not a slogan on the wall: you recognise it because hard executive decisions are made in its light. A compelling vision describes a future worth reaching for — not a larger version of today. The evaluator's question: could employees explain both purpose and vision, without rehearsal, and link them to their daily work?"
    },
    {
     "id": "1.2",
     "name": "Understand the Ecosystem, Own Capabilities & Major Challenges",
     "desc": "Analyses the external ecosystem (megatrends, market, technology, regulation, SDGs), assesses internal capabilities, and models scenarios to anticipate challenges and opportunities.",
     "comment": "Identifying stakeholders is easy; understanding their real needs is hard because they rarely articulate them in full. Excellent organisations read between the lines: they combine quantitative data with deep qualitative listening and revisit the map periodically. Expectations change faster than internal processes — and emerging voices (new regulators, younger generations, digital communities) often slip past the traditional radar."
    },
    {
     "id": "1.3",
     "name": "Identify & Understand the Needs of Key Stakeholders",
     "desc": "Prioritises stakeholders that impact strategy, segments their categories and understands their needs, expectations and contribution to value creation.",
     "comment": "Ecosystem analysis is an annual ritual in many organisations, but the difference is made by those who connect it to their real capabilities — without self-indulgence. Confusing what we actually do well with what we claim to do well is the most common mistake. Truly disruptive challenges are not managed; they are anticipated, which demands deliberate spaces to look outward and challenge comfortable assumptions."
    },
    {
     "id": "1.4",
     "name": "Develop & Adapt Strategy",
     "desc": "Translates purpose and vision into a strategy with clear priorities, measurable targets and a coherent business model, reviewing it at the ecosystem's pace and managing strategic risks.",
     "comment": "A good strategy is a series of choices: where to compete, how to win, what to stop doing. Excellent organisations do not present strategies without explicit trade-offs. Coherence between purpose, strategy and resource allocation is the first credibility test — a strategic plan that does not move the budget is a document, not a strategy. Anticipating strategic risks is part of the design, not of the annual report."
    },
    {
     "id": "1.5",
     "name": "Design & Implement a Performance Management & Governance System",
     "desc": "Establishes governance structures, clear accountabilities and an integrated performance management system aligned with strategy, sustainability principles and regulatory requirements.",
     "comment": "A robust governance system defines who decides what and with what information; without that clarity, strategy dilutes into meetings. Performance management only works if the cascade of objectives reaches the individual team and returns upward as learning, not as a report. Transparency, ethics and regulatory compliance are the foundation, not differentiators: the bar is raised when sustainability principles are structurally integrated."
    }
   ]
  },
  {
   "num": "2",
   "block": "Direction",
   "title": "Organisational Culture & Leadership",
   "desc": "Culture defines how the organisation behaves and works day-to-day. Leadership — understood as a set of behaviours at every level — shapes that culture, inspires people and drives transformation.",
   "subs": [
    {
     "id": "2.1",
     "name": "Steer the Organisation's Culture & Nurture its Core Values",
     "desc": "Defines the desired culture, values and expected behaviours, role-models them from leadership and reinforces them through aligned appraisal, development, recognition and reward systems.",
     "comment": "Culture is measured by how the organisation behaves when no one is watching. Values are credible only if they guide hard calls: who you promote, who you let go, which customer you turn down, which project you kill. Desired culture and actual culture rarely match — leadership actively manages that gap by aligning recognition, reward and development with the behaviours it claims to value."
    },
    {
     "id": "2.2",
     "name": "Create the Conditions for Realising Change",
     "desc": "Builds an environment of psychological safety, a no-blame culture, continuous learning from failure and feedback, where agility and transformation are core leadership behaviours.",
     "comment": "Change happens when people sense the cost of trying is lower than the cost of standing still. Psychological safety is not a soft value: it is the technical precondition for an organisation to learn and experiment. Leaders who celebrate well-intentioned failures accelerate transformation; those who punish honest mistakes turn every decision into internal politics and block learning."
    },
    {
     "id": "2.3",
     "name": "Enable Creativity & Innovation",
     "desc": "Sets ambitious goals that encourage disruptive thinking, removes barriers to change, and provides the resources, tools and cognitive diversity needed for innovation to become value.",
     "comment": "Innovation rarely comes from committees: it comes from people with time, resources and explicit permission to fail. Cognitive diversity multiplies possibilities; organisational silos cancel them. Innovating without discipline is waste; innovating without freedom is repetition. Leadership sets the direction — which problems are worth solving — and then steps out of the way on how."
    },
    {
     "id": "2.4",
     "name": "Unite & Engage Key Stakeholders with its Purpose, Vision & Strategy",
     "desc": "Ensures key stakeholders share a common narrative, understand the impact and relevance of their contribution, and receive recognition for milestones achieved.",
     "comment": "People commit to what they help build. A communicated purpose is only step one; a co-created purpose is the actual engine of engagement. The evaluator's practical question: how many people, outside the leadership team, could explain the strategy without slides? If the answer is few, there is no alignment — there is compliance."
    }
   ]
  },
  {
   "num": "3",
   "block": "Execution",
   "title": "Engaging Stakeholders",
   "desc": "Relationships with customers, people, business and governing stakeholders, society, partners and suppliers determine the organisation's legitimacy and sustainability.",
   "subs": [
    {
     "id": "3.1",
     "name": "Customers: Build Sustainable Relationships",
     "desc": "Segments current and potential customers by needs, behaviour and characteristics; designs effective communication channels and maintains long-term relationships based on trust and mutual value.",
     "comment": "Building sustainable customer relationships means moving beyond transactional logic: every interaction is a chance to learn, not only to sell. Segmentation is useful when it drives different relationship strategies; if every segment gets the same treatment, segmentation is not real — it is an illusion of it. Feedback channels create value only when the loop is visibly closed for the customer."
    },
    {
     "id": "3.2",
     "name": "People: Attract, Engage, Develop & Retain",
     "desc": "Builds an employee value proposition aligned with strategy: employer brand, diversity and inclusion, new ways of working, development, recognition and well-being.",
     "comment": "Talent decisions reveal the real strategy. An employee value proposition is coherent when it attracts, retains and develops people who fit the purpose — and lets those who do not fit move on, with dignity. Diversity and inclusion are necessary but insufficient if they are not paired with equitable development and recognition. New work models (hybrid, AI as a co-worker) are no longer experimental: they are the norm to be managed."
    },
    {
     "id": "3.3",
     "name": "Business & Governing Stakeholders: Secure & Sustain Ongoing Support",
     "desc": "Identifies the needs of owners, investors, funders, public bodies and regulators, involves them in transformation and maintains transparent, mutually beneficial relationships.",
     "comment": "Investor and regulator trust is earned by consistency, not by campaigns: communicating bad news before they uncover it. Anticipating regulatory requirements turns compliance into competitive advantage; reacting late turns it into cost. Honest transparency is counter-intuitive but pays in the medium term: it protects reputation when problems happen, not if."
    },
    {
     "id": "3.4",
     "name": "Society: Contribute to Development, Wellbeing & Prosperity",
     "desc": "Takes social, environmental and economic responsibility based on the SDGs; measures its impact, contributes to the communities in which it operates and promotes sustainable role models.",
     "comment": "Contributing to society is more than philanthropy: it means accepting the organisation is part of the fabric, and its long-term success depends on the health of its surroundings. The UN SDGs are a useful common language, but real impact is measured in the specific community where the organisation operates. Corporate volunteering and donations are visible; environmental footprint, labour practices and tax impact are less visible — and weigh more."
    },
    {
     "id": "3.5",
     "name": "Partners & Suppliers: Build Relationships & Ensure Support for Creating Sustainable Value",
     "desc": "Selects and segments partners and suppliers in line with purpose; builds trust-based relationships with mutual transparency, fosters ethical sourcing and jointly evaluates capabilities.",
     "comment": "The supply chain is an extension of the organisation's value proposition; supplier risks are your own risks. A strategic partnership differs from a transactional contract in the mutual willingness to invest in each other's capabilities. Ethical and sustainability criteria in supplier selection are now table stakes — and worth auditing, not merely declaring."
    }
   ]
  },
  {
   "num": "4",
   "block": "Execution",
   "title": "Creating Sustainable Value",
   "desc": "Designing, communicating, delivering and shaping an end-to-end experience that generates economic, social and environmental value on an ongoing basis for customers and other key stakeholders.",
   "subs": [
    {
     "id": "4.1",
     "name": "Define the Value & How it is Created",
     "desc": "Designs a value proposition and portfolio of products, services and solutions from a deep understanding of customers, integrating circularity, sustainability and ethical behaviour.",
     "comment": "Value is designed outside-in: understand the customer before the product. Sustainable differentiation rests on capabilities hard to imitate, not on temporary features. Co-creation with customers accelerates fit and reduces the risk of launching a technically perfect but commercially irrelevant product. Building circularity into design is already a future cost saving, not an optional ethical choice."
    },
    {
     "id": "4.2",
     "name": "Communicate & Sell the Value",
     "desc": "Articulates differentiators and value proposition in messages aligned with the brand, deploys consultative selling strategies and turns people in the organisation into credible ambassadors.",
     "comment": "Communicating value with coherence demands brand discipline: the customer does not distinguish channels, only total experience. Consultative selling helps the customer make the best decision, even if that decision is not to buy today — trust is built this way. Turning your people into credible ambassadors requires that they first believe in the proposition."
    },
    {
     "id": "4.3",
     "name": "Deliver the Value",
     "desc": "Ensures impeccable, efficient delivery of the promised value, manages a resilient supply chain and minimises social and environmental impact with end-to-end technologies.",
     "comment": "Delivery is the moment of truth: the brand promise is kept or broken with every operation. Operational excellence is invisible from outside, but its absence is always felt. Reducing environmental and social impact in delivery is no longer optional; regulators and customers demand it. The ability to respond quickly to changing demand — without sacrificing quality or purpose — is the real indicator of operational maturity."
    },
    {
     "id": "4.4",
     "name": "Define & Implement the Overall Experience",
     "desc": "Intentionally designs the end-to-end customer experience — before, during and after — with appropriate personalisation, agile support and feedback systems that close the loop.",
     "comment": "The overall experience is the sum of memorable moments and the average of forgettable ones. Designing it intentionally requires mapping the full journey — before, during, after — and giving every team the ability to resolve. Personalisation is valuable; intrusion is costly: the line is drawn by the customer, not by available technology. Feedback is collected at many points, but learning only happens if someone reads and acts on it."
    }
   ]
  },
  {
   "num": "5",
   "block": "Execution",
   "title": "Driving Performance & Transformation",
   "desc": "Balancing today's operational excellence with the transformation that prepares the organisation for tomorrow, managing performance, risks, data, technology, innovation and resources.",
   "subs": [
    {
     "id": "5.1",
     "name": "Drive Performance",
     "desc": "Manages processes and projects with agile and lean principles, deploys an enterprise risk system and develops business continuity plans for different scenarios using foresight programmes.",
     "comment": "The indicators you measure are the behaviours you get. Good performance management balances outcomes with levers, leading with lagging indicators. Mature risk management goes beyond compliance: it anticipates scenarios, simulates responses and prepares continuity before it is needed. The pattern of dashboards full of metrics but conversations empty of substance is the clearest sign of a decorative system."
    },
    {
     "id": "5.2",
     "name": "Transform the Organisation for the Future",
     "desc": "Applies systemic change management approaches, evaluates new business models and restructures processes and organisational design to better serve purpose and strategy.",
     "comment": "Organisational transformation requires running and changing at the same time — operational ambidexterity. Adapting the business model before it is urgent is strategic; doing it when it is urgent is survival. Change that is carefully communicated and sponsored moves faster than change that is imposed. Restructuring the org chart without restructuring the actual dynamics (incentives, decisions, information flows) is expensive cosmetics."
    },
    {
     "id": "5.3",
     "name": "Drive Innovation & Technology",
     "desc": "Establishes culture, capabilities and channels for innovation, allocates resources to R&D and leverages emerging technologies — including AI — from a circular and regenerative lifecycle view.",
     "comment": "Technology is a lever, not a destination: the right question is not 'which technology to adopt' but 'which problem to solve better'. AI multiplies existing capabilities — for better or worse: if processes are messy, AI scales the mess. Considering the full lifecycle of technology, including circularity and energy footprint, is now standard — not a voluntary commitment."
    },
    {
     "id": "5.4",
     "name": "Leverage Data-Driven Insights & Knowledge",
     "desc": "Turns data into information, information into knowledge and knowledge into better decisions, with strong data governance, AI and advanced analytics, respecting ethics and cybersecurity.",
     "comment": "More data does not equal better decisions; data governance and quality are preconditions. The gap between data and insight is human work: the algorithm finds patterns, people make meaning and choose action. Data ethics — privacy, bias, transparency, consent — sets the trust with which customers share more data. The tacit knowledge of people is the most underrated data asset."
    },
    {
     "id": "5.5",
     "name": "Manage Assets & Resources",
     "desc": "Optimises financial resources, tangible and intangible assets (data, brand, intellectual property), applying circularity and sustainability principles throughout the lifecycle.",
     "comment": "Intangible assets — brand, data, talent, IP — often generate the most value and are the least disciplined in their management. Sustainable resource management covers the full lifecycle, from acquisition through recycling, and directly impacts cost and reputation. Balancing present and future investment, without sacrificing one for the other, is one of the least-taught crafts of leadership."
    }
   ]
  },
  {
   "num": "6",
   "block": "Results",
   "title": "Stakeholder Perceptions",
   "desc": "Qualitative and quantitative feedback results from key stakeholders: customers, people, business and governing stakeholders, society, partners and suppliers.",
   "subs": [
    {
     "id": "6.1",
     "name": "Customer Perception Results",
     "desc": "Perceptions of the delivered experience, culture and people commitment, brand and reputation, products and services, use of innovation and technology, and quality of support and communication.",
     "comment": "Satisfaction scores and NPS are thermometers, not strategies. The richness is in verbatim feedback and trends by segment, not in the global average. A slight drop in a critical segment matters more than an overall improvement. Comparing customer perception with internal results reveals blind spots: when the organisation thinks it is doing well and the customer disagrees, the problem is not the survey."
    },
    {
     "id": "6.2",
     "name": "People Perception Results",
     "desc": "Perceptions of culture, work experience, change management, diversity and inclusion, new ways of working, development, recognition, well-being and confidence in strategic direction.",
     "comment": "Engagement is more predictive than satisfaction and is better measured with short, frequent surveys than with the annual one. Representativeness by team, gender, tenure and seniority avoids false aggregate conclusions. What people do not say is often more relevant than what they do — silent voluntary attrition is the most honest data point. Results are useful only when they translate into visible actions, with progress reported back."
    },
    {
     "id": "6.3",
     "name": "Business & Governing Stakeholders' Perception Results",
     "desc": "Perceptions from owners, investors, funders and regulators about financial management, governance, transparency, ethics, risk management, brand and ability to anticipate megatrends.",
     "comment": "Investor and regulator trust is built over years and eroded by a single mishandled event. Consistency of narrative — good quarters and bad — is the underlying currency. Treating regulators as allies rather than adversaries opens doors to shaping the sector's future. Credit ratings and ESG rankings are outputs, not objectives: optimising for them without substance is quickly spotted."
    },
    {
     "id": "6.4",
     "name": "Society Perception Results",
     "desc": "Perceptions of community impact, transparency and ethics, economic, social and environmental sustainability, commitment to the circular economy and progress on equality, diversity and inclusion.",
     "comment": "Social reputation lags reality — for better and for worse. ESG ratings are useful inputs, but the real measure is what the specific community says when the organisation is not in the room. Positive impact amplifies only if it is visible and attributable. The silence of civil society is ambiguous: it can be agreement or indifference. Telling them apart requires active listening, not just annual reports."
    },
    {
     "id": "6.5",
     "name": "Partners & Suppliers Perception Results",
     "desc": "Perceptions of the relationship experience, commitment to co-creation, implementation of technologies, social commitment, sustainability of the relationship and shared values.",
     "comment": "Being a preferred customer opens doors to innovation, priority and better terms — but only if the supplier sees it that way. Supplier surveys are rarely done, and when they are, they expose costly internal inefficiencies (slow payments, shifting specs, chaotic communication). Mutual investment in capabilities is the best evidence of a real alliance, beyond signed agreements."
    }
   ]
  },
  {
   "num": "7",
   "block": "Results",
   "title": "Strategic & Operational Performance",
   "desc": "Strategic performance results (linked to purpose, vision and strategy) and operational results (day-to-day activities), grouped into four official EFQM 2025 categories: fulfilment of expectations, economics and financials, performance and transformation, and sustainability.",
   "subs": [
    {
     "id": "7.1",
     "name": "Fulfilment of Stakeholder Expectations and their Contribution",
     "desc": "Strategic and operational results of value delivered by and to the five stakeholder groups (customers, people, business and governing, society, partners and suppliers). Examples: delivery quality, NPS, turnover, regulatory compliance, donations, supplier evaluation.",
     "comment": "This dimension consolidates fulfilment results across the five stakeholder groups. The evaluator's question: are all groups above the excellence threshold, or does the aggregate average hide critical zones? An organisation with uneven results — strong customers, mediocre people — has a structural risk, not a partial success. Traceability between each indicator and the purpose's value proposition separates narrative results from real ones."
    },
    {
     "id": "7.2",
     "name": "Economics & Financials",
     "desc": "Results representative of the organisation's economic and financial objectives: revenue, profitability, EBITDA, ROI/ROE, cash flow, financial ratios and credit rating.",
     "comment": "Economic and financial indicators — revenue, profitability, EBITDA, ROI/ROE, cash flow, ratios, credit rating — are the tangible outcome of strategic and operational decisions. A good read combines absolute level, multi-year trend, and comparison with peers and best-in-class. The quality of profit matters as much as its quantity: sustainable margins, diversified sources, low concentration risk. Financial results without causal explanation are numbers, not intelligence."
    },
    {
     "id": "7.3",
     "name": "Performance & Transformation",
     "desc": "Results of the main performance and transformation challenges: change and restructuring, supply chain, safety and compliance, innovation and research, processes and projects, productivity and efficiency, quality and performance.",
     "comment": "Performance and transformation indicators balance what the organisation does today with what it prepares for tomorrow. Change, supply chain, safety and compliance, innovation and R&D, processes and projects, productivity and quality — everything counts as a system, not a list. Improvement velocity — how today's cost compares to last year's — is one of the most sensitive indicators of real organisational capability, and it is usually missing from dashboards."
    },
    {
     "id": "7.4",
     "name": "Sustainability",
     "desc": "Results representative of sustainability ambitions: carbon reduction and neutrality, natural resource consumption, Scope 1/2/3 emissions, responsible procurement, SDG progress, circular economy, sustainable financing and diversity and inclusion.",
     "comment": "Sustainability results — carbon reduction, resource consumption, Scope 1/2/3 emissions, circular economy, SDG progress, diversity and inclusion, sustainable financing — have moved from an annex of the annual report to a strategic lever measured with the same rigour as financials. Regulators, investors and customers scrutinise them; the gap between leaders and laggards is the auditability of the data and the integration of targets into variable compensation."
    }
   ]
  }
 ],
 "ar": [
  {
   "num": "1",
   "block": "التوجيه",
   "title": "الغاية والرؤية والاستراتيجية",
   "desc": "تتميز المؤسسة المتميزة بغايةٍ ملهمة ورؤيةٍ تطلعية واستراتيجية تركز على خلق قيمة مستدامة.",
   "subs": [
    {
     "id": "1.1",
     "name": "تحديد الغاية والرؤية",
     "desc": "تُحدد المؤسسة بوضوح سبب وجودها (الغاية) وما تطمح إلى أن تكونه في المستقبل (الرؤية)، وتُظهر التزام القيادة، وتنقلهما بأسلوب ملهم إلى أصحاب المصلحة الرئيسيين.",
     "comment": "الغاية ليست شعاراً معلقاً على الجدار: تُعرف من خلال قرارات الإدارة الصعبة التي تُتخذ في ضوئها. الرؤية الملهمة تصف مستقبلاً يستحق السعي إليه — لا مجرد نسخة أكبر من الحاضر. السؤال التقييمي: هل يستطيع الموظفون شرح كليهما دون تحضير مسبق وربطهما بعملهم اليومي؟"
    },
    {
     "id": "1.2",
     "name": "فهم البيئة المحيطة والقدرات الذاتية والتحديات الكبرى",
     "desc": "تُحلل البيئة الخارجية (الاتجاهات الكبرى والسوق والتكنولوجيا والتنظيم وأهداف التنمية المستدامة)، وتُقيّم قدراتها الداخلية، وتُحاكي السيناريوهات لاستباق التحديات والفرص.",
     "comment": "تحديد أصحاب المصلحة سهل، أما فهم احتياجاتهم الحقيقية فصعب لأنهم نادراً ما يُعبّرون عنها كاملةً. المؤسسات المتميزة تقرأ ما بين السطور: تمزج البيانات الكمية بالإصغاء النوعي العميق وتُحدّث خريطتها دورياً. التوقعات تتغير أسرع من العمليات الداخلية، والأصوات الناشئة (جهات تنظيمية جديدة، أجيال شابة، مجتمعات رقمية) كثيراً ما تبقى خارج الرادار التقليدي."
    },
    {
     "id": "1.3",
     "name": "تحديد وفهم احتياجات أصحاب المصلحة الرئيسيين",
     "desc": "تُحدد أولوية أصحاب المصلحة المؤثرين في الاستراتيجية، وتُقسّم فئاتهم، وتفهم احتياجاتهم وتوقعاتهم ومساهمتهم في خلق القيمة.",
     "comment": "تحليل البيئة المحيطة طقس سنوي في كثير من المؤسسات، لكن الفارق يصنعه من يربطه بقدراته الحقيقية دون تساهل مع الذات. الخلط بين ما نُجيده فعلاً وما ندّعي إجادته هو الخطأ الأكثر شيوعاً. التحديات الجذرية لا تُدار؛ تُستبق، وهذا يتطلب مساحات مقصودة للنظر إلى الخارج وتحدي الافتراضات المريحة."
    },
    {
     "id": "1.4",
     "name": "تطوير الاستراتيجية وتكييفها",
     "desc": "تُترجم الغاية والرؤية إلى استراتيجية ذات أولويات واضحة وأهداف قابلة للقياس ونموذج أعمال متماسك، وتُراجعها بإيقاع البيئة المحيطة وتُدير المخاطر الاستراتيجية.",
     "comment": "الاستراتيجية الجيدة سلسلة من الخيارات: أين تتنافس، كيف تفوز، ماذا تتوقف عن فعله. المؤسسات المتميزة لا تقدم استراتيجيات بلا مقايضات صريحة. التناغم بين الغاية والاستراتيجية وتخصيص الموارد هو أول اختبار للمصداقية — خطة استراتيجية لا تُحرّك الميزانية هي وثيقة لا استراتيجية. واستباق المخاطر الاستراتيجية جزء من التصميم لا من التقرير السنوي."
    },
    {
     "id": "1.5",
     "name": "تصميم وتنفيذ نظام لإدارة الأداء والحوكمة",
     "desc": "تُؤسس هياكل الحوكمة وصلاحيات واضحة ونظاماً متكاملاً لإدارة الأداء، متوافقاً مع الاستراتيجية ومبادئ الاستدامة والمتطلبات التنظيمية.",
     "comment": "نظام الحوكمة المتين يُحدد من يُقرر ماذا وبأي معلومات؛ بدون هذا الوضوح تتبدد الاستراتيجية في الاجتماعات. إدارة الأداء لا تعمل إلا إذا وصل تدرّج الأهداف إلى الفريق الفردي وعاد صعوداً كتعلّم، لا كتقرير. الشفافية والأخلاق والامتثال أُسس لا عوامل تمييز: ترتفع المعايير عندما تُدمج مبادئ الاستدامة هيكلياً."
    }
   ]
  },
  {
   "num": "2",
   "block": "التوجيه",
   "title": "الثقافة المؤسسية والقيادة",
   "desc": "تُحدد الثقافة كيف تتصرف المؤسسة وتعمل يومياً. والقيادة — كمجموعة سلوكيات على كل المستويات — تُشكل تلك الثقافة، وتُلهم الناس، وتقود التحوّل.",
   "subs": [
    {
     "id": "2.1",
     "name": "توجيه ثقافة المؤسسة ورعاية قيمها الأساسية",
     "desc": "تُحدد الثقافة المرجوّة والقيم والسلوكيات المتوقعة، وتقتدي بها القيادة، وتعززها عبر أنظمة التقييم والتطوير والتقدير والمكافأة.",
     "comment": "الثقافة تُقاس بتصرف المؤسسة حين لا يراها أحد. القيم مصداقها أنها توجّه القرارات الصعبة: من تُرقّي، ومن تستغني عنه، وأي عميل ترفض، وأي مشروع توقف. الثقافة المرجوّة والفعلية نادراً ما تتطابقان — القيادة تُدير تلك الفجوة بنشاط، عبر مواءمة التقدير والمكافآت والتطوير مع السلوكيات التي تدّعي تقديرها."
    },
    {
     "id": "2.2",
     "name": "تهيئة الظروف اللازمة لتحقيق التغيير",
     "desc": "تخلق بيئة ذات أمان نفسي وثقافة دون لوم وتعلّم مستمر من الإخفاق والتغذية الراجعة، حيث تُمثّل الرشاقة والتحوّل سلوكيات قيادية محورية.",
     "comment": "التغيير يتحقق حين يُدرك الناس أن كلفة المحاولة أقل من كلفة الجمود. الأمان النفسي ليس قيمة هيّنة، بل شرطاً تقنياً ليتعلّم التنظيم ويُجرّب. القادة الذين يحتفون بالإخفاقات حسنة النية يُسرّعون التحوّل؛ ومن يُعاقبون الأخطاء الصادقة يحوّلون كل قرار إلى سياسة داخلية ويُعطّلون التعلّم."
    },
    {
     "id": "2.3",
     "name": "تمكين الإبداع والابتكار",
     "desc": "تُحدد أهدافاً طموحة تحفّز التفكير الجذري، وتُزيل عوائق التغيير، وتُوفر الموارد والأدوات والتنوع المعرفي اللازم لتحويل الابتكار إلى قيمة.",
     "comment": "الابتكار نادراً ما يأتي من اللجان، بل من أشخاص لديهم وقت وموارد وإذن صريح بالإخفاق. التنوع المعرفي يُضاعف الاحتمالات، والصوامع التنظيمية تُلغيها. الابتكار بلا انضباط هدر، وبلا حرية تكرار. تُحدد القيادة الاتجاه — أي المشكلات تستحق الحل — ثم تبتعد عن «الكيف»."
    },
    {
     "id": "2.4",
     "name": "توحيد أصحاب المصلحة الرئيسيين وإشراكهم في الغاية والرؤية والاستراتيجية",
     "desc": "تضمن أن يتبنى أصحاب المصلحة الرئيسيون سرديةً مشتركة، ويفهموا أثر مساهمتهم وأهميتها، ويحظوا بالتقدير على الإنجازات.",
     "comment": "يلتزم الناس بما يُساهمون في بنائه. الغاية المُعلنة مجرد خطوة أولى؛ أما الغاية المُشتركة في صياغتها فهي المحرك الفعلي للالتزام. السؤال التقييمي العملي: كم شخصاً خارج فريق القيادة يستطيع شرح الاستراتيجية بلا شرائح عرض؟ إن قلّ العدد، فلا توجد مواءمة، بل امتثال."
    }
   ]
  },
  {
   "num": "3",
   "block": "التنفيذ",
   "title": "إشراك أصحاب المصلحة",
   "desc": "العلاقات مع العملاء والموظفين وأصحاب المصلحة في الأعمال والحوكمة والمجتمع والشركاء والموردين تُحدد شرعية المؤسسة واستدامتها.",
   "subs": [
    {
     "id": "3.1",
     "name": "العملاء: بناء علاقات مستدامة",
     "desc": "تُقسّم العملاء الحاليين والمحتملين حسب الاحتياجات والسلوك والخصائص، وتُصمم قنوات تواصل فعّالة، وتحافظ على علاقات طويلة الأمد مبنية على الثقة والقيمة المتبادلة.",
     "comment": "بناء علاقات مستدامة مع العملاء يتطلب تجاوز المنطق التعاملي: كل تفاعل فرصة للتعلّم لا للبيع فحسب. التجزئة مفيدة حين تقود إلى استراتيجيات علاقة مختلفة؛ فإن تلقّت كل الشرائح المعاملة ذاتها، فلا تجزئة حقيقية بل وهم بها. وقنوات التغذية الراجعة تخلق قيمة حين تُغلق دورتها بشكل ظاهر للعميل."
    },
    {
     "id": "3.2",
     "name": "الموظفون: الاستقطاب والإشراك والتطوير والاحتفاظ",
     "desc": "تبني عرض قيمة للموظف منسجماً مع الاستراتيجية: علامة صاحب العمل والتنوع والشمول وأنماط العمل الجديدة والتطوير والتقدير والرفاهية.",
     "comment": "قرارات المواهب تكشف الاستراتيجية الحقيقية. عرض قيمة الموظف يكون متماسكاً حين يجذب ويُبقي ويُطوّر من ينسجمون مع الغاية، ويتيح بكرامة لمن لا ينسجم أن يمضي. التنوع والشمول ضروريان لكنهما غير كافيين إن لم يُرافقهما تطوير وتقدير عادلان. ونماذج العمل الجديدة (الهجين، الذكاء الاصطناعي كزميل) لم تعد تجريبية، بل هي الواقع الذي يُدار."
    },
    {
     "id": "3.3",
     "name": "أصحاب المصلحة في الأعمال والحوكمة: ضمان دعمهم المتواصل",
     "desc": "تُحدد احتياجات المُلّاك والمستثمرين والممولين والجهات العامة والتنظيمية، وتُشركهم في التحوّل، وتحافظ على علاقات شفافة ومتبادلة المنفعة.",
     "comment": "ثقة المستثمرين والجهات التنظيمية تُكتسب بالاتساق لا بالحملات: إعلان الأخبار السيئة قبل أن يكتشفوها. استباق المتطلبات التنظيمية يُحوّل الامتثال إلى ميزة تنافسية؛ بينما رد الفعل المتأخر يُحوّله إلى تكلفة. الشفافية الصادقة قد تبدو غير بديهية لكنها مربحة على المدى المتوسط: تحمي السمعة عند وقوع المشكلات، لا في حال وقوعها."
    },
    {
     "id": "3.4",
     "name": "المجتمع: المساهمة في التنمية والرفاه والازدهار",
     "desc": "تتحمل المسؤولية الاجتماعية والبيئية والاقتصادية استناداً إلى أهداف التنمية المستدامة، وتقيس أثرها، وتُساهم في مجتمعاتها، وتُروّج لقدوات سلوك مستدام.",
     "comment": "المساهمة في المجتمع أكبر من الإحسان: تعني الإقرار بأن المؤسسة جزء من النسيج، وأن نجاحها على المدى الطويل مرهون بسلامة محيطها. أهداف التنمية المستدامة الأممية لغة مشتركة مفيدة، لكن الأثر الحقيقي يُقاس في المجتمع المحدد الذي تعمل فيه المؤسسة. التطوع المؤسسي والتبرعات ظاهرة؛ بينما البصمة البيئية وممارسات العمل والأثر الضريبي أقل ظهوراً — وأكثر ثقلاً."
    },
    {
     "id": "3.5",
     "name": "الشركاء والموردون: بناء علاقات تضمن خلق قيمة مستدامة",
     "desc": "تختار وتُقسّم الشركاء والموردين بما يتوافق مع الغاية، وتبني علاقات قائمة على الثقة بشفافية متبادلة، وتُروّج التوريد الأخلاقي، وتُقيّم القدرات بشكل مشترك.",
     "comment": "سلسلة التوريد امتداد لعرض قيمة المؤسسة؛ ومخاطر المورّد هي مخاطرك أنت. الشراكة الاستراتيجية تختلف عن العقد التعاملي بالاستعداد المتبادل للاستثمار في قدرات الطرف الآخر. ومعايير الأخلاق والاستدامة في اختيار المورّدين باتت حداً أدنى — يستحق التدقيق لا مجرد الإعلان."
    }
   ]
  },
  {
   "num": "4",
   "block": "التنفيذ",
   "title": "خلق قيمة مستدامة",
   "desc": "تصميم وتوصيل وتقديم تجربة شاملة تُولّد قيمة اقتصادية واجتماعية وبيئية بشكل مستمر للعملاء وسائر أصحاب المصلحة الرئيسيين.",
   "subs": [
    {
     "id": "4.1",
     "name": "تحديد القيمة وكيفية خلقها",
     "desc": "تُصمم عرض قيمة ومحفظة منتجات وخدمات وحلول بناءً على فهم عميق للعملاء، مع دمج مبادئ الاقتصاد الدائري والاستدامة والسلوك الأخلاقي.",
     "comment": "القيمة تُصمَّم من الخارج إلى الداخل: افهم العميل قبل المنتج. التميز المستدام يقوم على قدرات يصعب تقليدها، لا على خصائص مؤقتة. التشارك في الإبداع مع العملاء يُسرّع المواءمة ويُقلّل مخاطر إطلاق منتج كامل تقنياً لكنه غير مهم تجارياً. ودمج مبادئ الاقتصاد الدائري منذ التصميم وفر مستقبلي لا خيار أخلاقي اختياري."
    },
    {
     "id": "4.2",
     "name": "توصيل القيمة وبيعها",
     "desc": "تُصيغ عوامل التمييز وعرض القيمة في رسائل منسجمة مع العلامة، وتعتمد استراتيجيات بيع استشارية، وتُحوّل موظفي المؤسسة إلى سفراء موثوقين.",
     "comment": "التواصل مع القيمة باتساق يتطلب انضباطاً للعلامة: العميل لا يُميّز بين القنوات، بل يرى التجربة الكاملة. البيع الاستشاري يُرافق العميل لاتخاذ القرار الأمثل، حتى لو لم يكن هذا القرار الشراء اليوم — هكذا تُبنى الثقة. وتحويل الموظفين إلى سفراء موثوقين يقتضي أولاً أن يؤمنوا هم بالعرض."
    },
    {
     "id": "4.3",
     "name": "تقديم القيمة",
     "desc": "تضمن تقديماً سلساً وفعّالاً للقيمة الموعودة، وتُدير سلسلة توريد مرنة، وتُقلّل الأثر الاجتماعي والبيئي عبر تقنيات شاملة من الطرف إلى الطرف.",
     "comment": "التسليم هو لحظة الحقيقة: وعد العلامة يُوفى أو يُكسر في كل عملية. التميز التشغيلي لا يُرى من الخارج، لكن غيابه يُلاحَظ دائماً. تقليل الأثر البيئي والاجتماعي عند التسليم لم يعد اختيارياً؛ الجهات التنظيمية والعملاء يطالبون به. والقدرة على الاستجابة السريعة لتغير الطلب دون التضحية بالجودة أو الغاية هي المؤشر الحقيقي للنضج التشغيلي."
    },
    {
     "id": "4.4",
     "name": "تحديد التجربة الشاملة وتطبيقها",
     "desc": "تُصمم بشكل مقصود تجربة العميل الشاملة — قبل وأثناء وبعد — بتخصيص ملائم ودعم سريع وأنظمة تغذية راجعة تُغلق الدورة.",
     "comment": "التجربة الشاملة هي مجموع اللحظات التي لا تُنسى ومتوسط اللحظات العادية. تصميمها بقصد يتطلب رسم الرحلة كاملةً — قبل وأثناء وبعد — ومنح كل فريق صلاحية الحل. التخصيص قيّم، والتطفل مكلف: الخط يرسمه العميل لا التقنية المتاحة. تُجمع التغذية الراجعة في نقاط كثيرة، لكن التعلّم لا يحدث إلا حين يقرأها أحد ويتصرف."
    }
   ]
  },
  {
   "num": "5",
   "block": "التنفيذ",
   "title": "إدارة الأداء والتحوّل",
   "desc": "تحقيق التوازن بين التميز التشغيلي اليوم والتحوّل الذي يُهيّئ المؤسسة للغد، عبر إدارة الأداء والمخاطر والبيانات والتكنولوجيا والابتكار والموارد.",
   "subs": [
    {
     "id": "5.1",
     "name": "تعزيز الأداء",
     "desc": "تُدير العمليات والمشاريع بمبادئ الرشاقة واللين، وتُطبّق نظاماً متكاملاً للمخاطر، وتُطوّر خطط استمرارية الأعمال لسيناريوهات مختلفة عبر برامج الاستشراف.",
     "comment": "المؤشرات التي تقيسها هي السلوكيات التي ستحصل عليها. الإدارة الجيدة للأداء توازن بين النتائج والروافع، والمؤشرات الاستباقية والرجعية. وإدارة المخاطر الناضجة تتجاوز الامتثال: تستبق السيناريوهات وتُحاكي الاستجابات وتُهيّئ الاستمرارية قبل الحاجة إليها. ووجود لوحات قياس مزدحمة وحوارات فارغة هو أوضح علامة على نظام شكلي."
    },
    {
     "id": "5.2",
     "name": "تحويل المؤسسة من أجل المستقبل",
     "desc": "تطبّق مناهج منهجية لإدارة التغيير، وتُقيّم نماذج أعمال جديدة، وتُعيد هيكلة العمليات والتصميم المؤسسي لخدمة الغاية والاستراتيجية بشكل أفضل.",
     "comment": "التحوّل المؤسسي يتطلب الجري والتغيير في آنٍ واحد — البراعة التشغيلية. تكييف نموذج الأعمال قبل أن يصبح ملحاً استراتيجي؛ فعله عند الإلحاح هو بقاء. والتغيير المُعلن بعناية والمدعوم يسير أسرع من التغيير المفروض. وإعادة هيكلة الخريطة دون إعادة هيكلة الديناميات الفعلية (الحوافز، القرارات، تدفقات المعلومات) تجميل باهظ."
    },
    {
     "id": "5.3",
     "name": "تعزيز الابتكار والتكنولوجيا",
     "desc": "تُؤسس ثقافة وقدرات وقنوات للابتكار، وتُخصص موارد للبحث والتطوير، وتُسخّر التقنيات الناشئة — بما فيها الذكاء الاصطناعي — برؤية دورية ومتجددة لدورة حياتها.",
     "comment": "التقنية رافعة لا غاية: السؤال الصحيح ليس «أي تقنية نتبنى» بل «أي مشكلة نحلّها أفضل». الذكاء الاصطناعي يُضاعف القدرات القائمة — للأفضل وللأسوأ: إن كانت العمليات مضطربة، فالذكاء الاصطناعي يُوسّع الاضطراب. ومراعاة دورة حياة التقنية كاملةً — بما فيها الاقتصاد الدائري والبصمة الطاقية — صار معياراً لا التزاماً اختيارياً."
    },
    {
     "id": "5.4",
     "name": "الاستفادة من الرؤى المستندة إلى البيانات والمعرفة",
     "desc": "تُحوّل البيانات إلى معلومات، والمعلومات إلى معرفة، والمعرفة إلى قرارات أفضل، عبر حوكمة بيانات متينة وذكاء اصطناعي وتحليلات متقدمة، مع احترام الأخلاق والأمن السيبراني.",
     "comment": "المزيد من البيانات لا يعني قرارات أفضل؛ حوكمة البيانات وجودتها شرطان مسبقان. والفجوة بين البيانات والرؤية شغل بشري: الخوارزمية تجد الأنماط، والناس يصنعون المعنى ويختارون الفعل. وأخلاقيات البيانات — الخصوصية والتحيز والشفافية والموافقة — تُحدد مستوى الثقة الذي يُشارك العميل عنده مزيداً من البيانات. والمعرفة الضمنية لدى الموظفين هي أصل البيانات الأكثر بخساً في التقدير."
    },
    {
     "id": "5.5",
     "name": "إدارة الأصول والموارد",
     "desc": "تُحسّن الموارد المالية والأصول الملموسة وغير الملموسة (البيانات والعلامة والملكية الفكرية)، وتُطبّق مبادئ الاقتصاد الدائري والاستدامة على دورة الحياة كاملةً.",
     "comment": "الأصول غير الملموسة — العلامة، البيانات، المواهب، الملكية الفكرية — هي غالباً الأكثر توليداً للقيمة والأقل انضباطاً في إدارتها. الإدارة المستدامة للموارد تشمل دورة الحياة كاملةً، من الاستحواذ حتى التدوير، وتؤثر مباشرةً في التكلفة والسمعة. وموازنة الاستثمار الحاضر بالمستقبلي، دون التضحية بأحدهما للآخر، من أقل حرف القيادة تدريساً."
    }
   ]
  },
  {
   "num": "6",
   "block": "النتائج",
   "title": "تصورات أصحاب المصلحة",
   "desc": "نتائج التغذية الراجعة النوعية والكمية من أصحاب المصلحة الرئيسيين: العملاء والموظفون وأصحاب المصلحة في الأعمال والحوكمة والمجتمع والشركاء والموردون.",
   "subs": [
    {
     "id": "6.1",
     "name": "نتائج تصور العملاء",
     "desc": "تصورات عن التجربة المُقدَّمة وثقافة الموظفين والتزامهم، والعلامة والسمعة، والمنتجات والخدمات، واستخدام الابتكار والتكنولوجيا، وجودة الدعم والتواصل.",
     "comment": "نقاط الرضا وصافي نقاط المروّجين موازين حرارة لا استراتيجيات. الثراء في التعليقات الحرفية وفي اتجاهات الشرائح، لا في المتوسط الإجمالي. تراجع طفيف في شريحة حرجة أهم من تحسّن إجمالي. ومقارنة إدراك العميل بالنتائج الداخلية تكشف النقاط العمياء: حين تظن المؤسسة أنها على ما يُرام ويرى العميل العكس، فالمشكلة ليست في الاستبيان."
    },
    {
     "id": "6.2",
     "name": "نتائج تصور الموظفين",
     "desc": "تصورات عن الثقافة وتجربة العمل وإدارة التغيير والتنوع والشمول وأنماط العمل الجديدة والتطوير والتقدير والرفاهية والثقة في الاتجاه الاستراتيجي.",
     "comment": "الانخراط أكثر استشرافاً من الرضا، ويُقاس بدقة أكبر باستبيانات متكررة قصيرة لا بالاستبيان السنوي. والتمثيلية حسب الفريق والجنس والأقدمية والمستوى تمنع الاستنتاجات الإجمالية المضللة. وما لا يقوله الناس غالباً أهم مما يقولونه — الاستقالات الصامتة هي أصدق البيانات. النتائج لا تنفع ما لم تتحول إلى أفعال ظاهرة، يُحاسَب على تقدّمها."
    },
    {
     "id": "6.3",
     "name": "نتائج تصور أصحاب المصلحة في الأعمال والحوكمة",
     "desc": "تصورات المُلّاك والمستثمرين والممولين والجهات التنظيمية حول الإدارة المالية والحوكمة والشفافية والأخلاق وإدارة المخاطر والعلامة والقدرة على استباق الاتجاهات الكبرى.",
     "comment": "ثقة المستثمرين والجهات التنظيمية تُبنى عبر سنوات وتُهدمها واقعة واحدة سيئة المعالجة. اتساق السردية — في الفصول الجيدة والسيئة — هو العملة الكامنة. والتعامل مع الجهة التنظيمية كحليف لا كخصم يفتح أبواب التأثير في مستقبل القطاع. والتصنيفات الائتمانية وتقييمات الحوكمة البيئية والاجتماعية مخرجات لا أهداف: التحسين لها بلا جوهر يُكشَف سريعاً."
    },
    {
     "id": "6.4",
     "name": "نتائج تصور المجتمع",
     "desc": "تصورات عن الأثر المجتمعي والشفافية والأخلاق والاستدامة الاقتصادية والاجتماعية والبيئية والالتزام بالاقتصاد الدائري والتقدم في المساواة والتنوع والشمول.",
     "comment": "السمعة الاجتماعية تسير خلف الواقع — في الخير والشر. تقييمات الحوكمة البيئية والاجتماعية مدخلات مفيدة، لكن المقياس الحقيقي ما يقوله المجتمع المحدد حين لا تكون المؤسسة في الغرفة. الأثر الإيجابي يتضخّم فقط إن كان ظاهراً ومنسوباً. وصمت المجتمع المدني ملتبس: قد يكون قبولاً وقد يكون لامبالاة. التمييز بينهما يتطلب إصغاءً فاعلاً لا مجرد تقارير سنوية."
    },
    {
     "id": "6.5",
     "name": "نتائج تصور الشركاء والموردين",
     "desc": "تصورات عن تجربة العلاقة والالتزام بالإبداع المشترك وتطبيق التقنيات والالتزام الاجتماعي واستدامة العلاقة والقيم المشتركة.",
     "comment": "كون المؤسسة عميلاً مفضلاً يفتح أبواب الابتكار والأولوية والشروط الأفضل — لكن فقط إن رأى المورّد ذلك. استبيانات المورّدين نادراً ما تُنفّذ، وحين تُنفّذ تكشف اختلالات داخلية مكلفة (مدفوعات بطيئة، مواصفات متبدّلة، تواصل فوضوي). والاستثمار المتبادل في القدرات أفضل دليل على شراكة حقيقية، بعيداً عن الاتفاقات الموقّعة."
    }
   ]
  },
  {
   "num": "7",
   "block": "النتائج",
   "title": "الأداء الاستراتيجي والتشغيلي",
   "desc": "نتائج الأداء الاستراتيجي (المرتبطة بالغاية والرؤية والاستراتيجية) والتشغيلي (أنشطة اليوم بيوم)، مُصنّفة في أربع فئات رسمية لنموذج EFQM 2025: تلبية التوقعات، الاقتصاد والمالية، الأداء والتحوّل، الاستدامة.",
   "subs": [
    {
     "id": "7.1",
     "name": "تلبية توقعات أصحاب المصلحة ومساهمتهم",
     "desc": "نتائج استراتيجية وتشغيلية للقيمة المُقدَّمة من وإلى مجموعات أصحاب المصلحة الخمس (العملاء، الموظفون، الأعمال والحوكمة، المجتمع، الشركاء والموردون). أمثلة: جودة التسليم، صافي نقاط المروّجين، الدوران، الامتثال التنظيمي، التبرعات، تقييم المورّدين.",
     "comment": "تجمّع هذه الدلالة نتائج تلبية التوقعات عبر مجموعات أصحاب المصلحة الخمس. السؤال التقييمي الجوهري: هل تجاوزت كل المجموعات عتبة التميّز، أم أن المتوسط الإجمالي يُخفي مناطق حرجة؟ المؤسسة ذات النتائج غير المتكافئة — عملاء ممتازون وموظفون متوسطون — أمام مخاطرة بنيوية لا نجاح جزئي. وتتبّع كل مؤشر إلى عرض القيمة الذي تنبثق منه الغاية يفصل النتائج السردية عن الفعلية."
    },
    {
     "id": "7.2",
     "name": "الاقتصاد والمالية",
     "desc": "نتائج تُمثّل الأهداف الاقتصادية والمالية للمؤسسة: الإيرادات والربحية والـEBITDA وROI/ROE والتدفق النقدي والنسب المالية والتصنيف الائتماني.",
     "comment": "المؤشرات الاقتصادية والمالية — الإيرادات والربحية والـEBITDA وROI/ROE والتدفق النقدي والنسب والتصنيف الائتماني — هي النتيجة الملموسة للقرارات الاستراتيجية والتشغيلية. القراءة الجيدة تجمع المستوى المطلق والاتجاه على عدة سنوات والمقارنة مع الأقران والأفضل في الفئة. ونوعية الربح تساوي كميته أهميةً: هوامش مستدامة، ومصادر متنوعة، وانخفاض مخاطر التركّز. والنتائج المالية بلا تفسير سببي أرقام لا ذكاء."
    },
    {
     "id": "7.3",
     "name": "الأداء والتحوّل",
     "desc": "نتائج تحديات الأداء والتحوّل الرئيسية: التغيير وإعادة الهيكلة، وسلسلة التوريد، والسلامة والامتثال، والابتكار والبحث، والعمليات والمشاريع، والإنتاجية والكفاءة، والجودة والأداء.",
     "comment": "تُوازن مؤشرات الأداء والتحوّل بين ما تفعله المؤسسة اليوم وما تُهيّئه للغد. التغيير وسلسلة التوريد والسلامة والامتثال والابتكار والبحث والتطوير والعمليات والمشاريع والإنتاجية والجودة — كل ذلك يُحتسب كنظام لا كقائمة. وسرعة التحسّن — كلفة اليوم مقارنةً بكلفة العام الماضي — من أكثر المؤشرات حساسيةً للقدرة المؤسسية الفعلية، وغالباً ما تغيب عن لوحات القياس."
    },
    {
     "id": "7.4",
     "name": "الاستدامة",
     "desc": "نتائج تُمثّل طموحات الاستدامة: خفض الكربون والحياد الكربوني واستهلاك الموارد الطبيعية وانبعاثات النطاقات 1/2/3 والشراء المسؤول وتقدّم أهداف التنمية المستدامة والاقتصاد الدائري والتمويل المستدام والتنوع والشمول.",
     "comment": "نتائج الاستدامة — خفض الكربون واستهلاك الموارد وانبعاثات النطاقات 1/2/3 والاقتصاد الدائري وتقدّم أهداف التنمية المستدامة والتنوع والشمول والتمويل المستدام — انتقلت من ملحق للتقرير السنوي إلى رافعة استراتيجية تُقاس بالصرامة ذاتها للمؤشرات المالية. الجهات التنظيمية والمستثمرون والعملاء يُدققون فيها؛ والفارق بين المؤسسات القائدة والمتأخرة هو قابلية تدقيق البيانات ودمج الأهداف في الأجر المتغير."
    }
   ]
  }
 ]
}

MODEL.es = MODEL_ES
