/* Páginas de servicios en español. Se fusionan sobre el inglés en services.js
   (fallback automático a EN para cualquier clave ausente). */
export const SERVICES_ES = {
  tabs: { assessments: 'Evaluaciones', consultancy: 'Consultoría como Servicio', training: 'Talleres y Formación' },
  hub: {
    eyebrow: 'Nuestros servicios',
    titleA: 'Tres formas de ', strong: 'trabajar contigo', titleB: '',
    lead: 'La evaluación te dice dónde estás. La consultoría te hace avanzar. La formación lo consolida. La mayoría de los proyectos usa las tres.',
    wa: 'WhatsApp', request: 'Solicitar', requestFull: 'Solicitar este servicio',
    waMsg: 'Hola, me gustaría hablar con un evaluador sobre vuestros servicios.',
    waService: 'Hola, me interesa {service}. ¿Podéis contarme más?',
    reqEyebrow: 'Solicitar un servicio',
    reqTitleA: 'Cuéntanos qué ', reqStrong: 'necesitas', reqTitleB: '',
    reqLead: 'Envía el formulario y responderemos en un día laborable — normalmente con una llamada breve para entender tu situación antes que nada. ¿Prefieres hablar ya? Usa WhatsApp.',
    reqService: 'Servicio de interés', reqAny: 'Consulta general',
  },
  consultancy: {
    seoTitle: 'Servicios de Consultoría — Normas ISO y Consultoría como Servicio | Dubái',
    seoDesc:
      'Consultoría de gestión en Dubái: suscripciones de Consultoría como Servicio potenciadas con IA y consultoría ISO en ISO 9001, 14001, 27001, 45001, 42001 y 56001. Precio mensual fijo en tu moneda local.',
    keywords:
      'consultoría de gestión Dubái, consultoría ISO EAU, consultor ISO 9001 Dubái, consultor ISO 27001, ISO 14001, ISO 45001, ISO 42001 sistema de gestión de IA, ISO 56001 innovación, consultoría como servicio, consultoría IA, consultor de calidad MENA',
    eyebrow: 'Servicios de Consultoría',
    titleA: 'Dos servicios, una forma de trabajar ', strong: 'digital-first', titleB: '',
    lead:
      'Entregamos consultoría en dos formas complementarias: una suscripción continua potenciada con IA que pone un equipo consultor a tu lado mes tras mes, y consultoría ISO enfocada que lleva una norma del análisis de brechas a la preparación de auditoría. Ambas funcionan dentro del mismo entorno digital de IA, y ambas se tarifan con transparencia en tu moneda local.',
    chips: ['Consultoría como Servicio', 'ISO 9001 · 14001 · 27001', 'ISO 45001 · 42001 · 56001', 'Entrega con IA', 'Dubái · MENA · Europa'],

    caas: {
      eyebrow: 'Servicio uno',
      title: 'Consultoría como Servicio',
      intro:
        'La consultoría tradicional te vende un proyecto: un alcance, un informe, una factura y un adiós. El conocimiento se marcha con el consultor, y seis meses después estás comprando la misma expertise otra vez. La Consultoría como Servicio invierte ese modelo. Te suscribes a una capacidad de consultoría en lugar de encargar un entregable — un equipo con nombre, una cuota mensual fija y una relación de trabajo que se capitaliza.',
      paras: [
        'En la práctica esto significa que tus consultores conocen tu organización. No dedican las tres primeras semanas de cada proyecto a redescubrir tus procesos, tus políticas internas y tus datos. Ya tienen el contexto, así que el tiempo que pagas va al trabajo en sí — diseñar un proceso, preparar una auditoría, arreglar un sistema de medición, acompañar a un directivo en un cambio difícil.',
        'El precio mensual fijo es deliberado. La facturación por horas te castiga en silencio por hacer preguntas, así que la gente deja de preguntar, y los asuntos pequeños que habrían sido baratos de arreglar se convierten en caros. Una suscripción elimina esa fricción: llamas cuando nos necesitas, y el coste no se mueve.',
        'También eliges la intensidad. Algunas organizaciones necesitan un toque ligero — una plataforma, un especialista disponible, una sesión ocasional para desbloquear una decisión. Otras están en plena transformación y necesitan un equipo multidisciplinar, KPIs definidos, implantación guiada y acompañamiento en una auditoría externa. Los tres modelos de abajo cubren ese espectro, y puedes moverte entre ellos según cambien tus necesidades.',
        'Todos los modelos los entregan evaluadores EFQM certificados y especialistas en sistemas de gestión, y todos incluyen el entorno digital de IA descrito más abajo en esta página.',
      ],
      modelsTitle: 'Los tres modelos',
      modelsSub:
        'Una lógica: tú decides la intensidad. Los precios se muestran en tu moneda local y puedes cambiarlos en cualquier momento.',
    },

    ai: {
      eyebrow: 'Incluido en todos los modelos',
      title: 'Un entorno digital de IA, no una presentación de diapositivas',
      intro:
        'Todos los modelos de Consultoría como Servicio — y todos los proyectos ISO — funcionan dentro de un entorno digital donde la inteligencia artificial hace el trabajo pesado que antes consumía horas de consultoría. No es una función que atornillamos para los clientes más grandes. Es cómo trabajamos, en todos los niveles.',
      items: [
        { icon: 'scan', title: 'Análisis de evidencias a escala', text: 'La IA lee tus procedimientos, actas, informes de auditoría y datos de desempeño y los mapea contra el Modelo EFQM o las cláusulas ISO relevantes — sacando a la luz brechas, contradicciones y riesgos huérfanos en horas en lugar de semanas.' },
        { icon: 'doc', title: 'Documentación que se redacta sola', text: 'Políticas, mapas de procesos, declaraciones de aplicabilidad y paquetes de revisión por la dirección se generan a partir de tu evidencia real, y después los revisa y da forma un evaluador humano. Editas en lugar de empezar de una página en blanco.' },
        { icon: 'chart', title: 'Diagnóstico continuo', text: 'En lugar de una foto anual, tu madurez se sigue de forma continua. Puntuaciones, tendencias y acciones prioritarias se mantienen al día, de modo que la revisión por la dirección se convierte en una reunión de decisiones y no en un ejercicio de arqueología.' },
        { icon: 'chat', title: 'Un especialista disponible, siempre', text: 'Un asistente privado entrenado en tu sistema de gestión responde las preguntas del día a día de tu equipo — qué procedimiento aplica, qué exige la norma, qué evidencia querrá un auditor — sin esperar a una sesión programada.' },
        { icon: 'shield', title: 'Tus datos siguen siendo tuyos', text: 'El entorno se gobierna bajo principios ISO 27001 y, para la propia IA, ISO 42001: propiedad definida, control de accesos, supervisión humana de cada recomendación y ningún entrenamiento con tu material confidencial.' },
        { icon: 'radar', title: 'Criterio humano, amplificado', text: 'La IA acelera el análisis; no firma la evaluación. Cada hallazgo, puntuación y recomendación lo revisa un evaluador certificado antes de llegarte — la máquina redacta, el evaluador decide.' },
      ],
      note:
        'El resultado es simple: una parte mayor de tu presupuesto compra criterio y cambio, y una parte menor compra manejo de documentos.',
    },

    iso: {
      eyebrow: 'Servicio dos',
      title: 'Consultoría en Normas ISO',
      intro:
        'Un certificado en la pared no es el objetivo. El objetivo es un sistema de gestión que tu gente usa de verdad — uno que sobrevive a un auditor y, más importante, sobrevive a un martes ajetreado. Implantamos las normas ISO como sistemas que funcionan, integrados entre sí y con el Modelo EFQM, para que acabes con una arquitectura y no con seis burocracias paralelas.',
      paras: [
        'La mayoría de las organizaciones llega a ISO por presión comercial: un cliente lo exige, una licitación lo requiere, un regulador lo espera. Esa presión produce el fracaso clásico — un consultor escribe un manual, la organización lo firma, nadie lo lee, y el sistema solo existe la semana antes de cada auditoría. Aprueba, y no cambia nada.',
        'Nosotros trabajamos al revés. Partimos de cómo operas realmente, lo mapeamos contra la norma y cerramos la distancia con el menor número de cambios que aguanten. Cuando una cláusula exige algo que genuinamente no necesitas a plena potencia, lo dimensionamos y documentamos el razonamiento — para eso existe la Declaración de Aplicabilidad.',
        'Como además de implantar también evaluamos, sabemos qué buscan los auditores y dónde fallan los sistemas bajo examen. Y como el mismo equipo lleva tu trabajo EFQM, tus sistemas ISO refuerzan tu camino a la excelencia en lugar de competir con él por la atención de las mismas personas.',
      ],
      standardsTitle: 'Seis normas, una arquitectura',
      approachTitle: 'Cómo transcurre un proyecto ISO',
      approach: [
        { step: '01', title: 'Análisis de brechas', text: 'Una comparación estructurada de tu realidad actual contra cada cláusula de la norma, que produce un registro de brechas priorizado y no un checklist genérico.' },
        { step: '02', title: 'Diseño e integración', text: 'Diseñamos el sistema alrededor de tus procesos existentes y lo integramos con las normas que ya tengas, para que mantengas un único conjunto de documentación, un programa de auditoría y una revisión por la dirección.' },
        { step: '03', title: 'Implantación y formación', text: 'La documentación se redacta en el entorno de IA y se refina con tus dueños de proceso, que se forman para operar el sistema — no meramente para sobrevivir a la auditoría.' },
        { step: '04', title: 'Auditoría interna y preparación', text: 'Ejecutamos una auditoría interna completa en condiciones reales, cerramos los hallazgos y ensayamos la auditoría de certificación para que no haya sorpresas ese día.' },
        { step: '05', title: 'Certificación y más allá', text: 'Te acompañamos en la auditoría de la entidad certificadora y después mantenemos el sistema vivo con seguimiento continuo, preparación de auditorías de seguimiento y ciclos de mejora.' },
      ],
    },

    cta: { title: '¿No sabes qué servicio encaja?', text: 'Cuéntanos dónde estás y qué está forzando el cambio — un requisito de cliente, una licitación, una decisión del consejo o un sistema que dejó de funcionar. Te diremos con honestidad qué hace falta, incluso cuando la respuesta sea menos de lo que esperabas.', btn: 'Habla con un evaluador' },
  },

  assessments: {
    seoTitle: 'Evaluación EFQM, Consultoría Estratégica y Coaching Ejecutivo | Dubái',
    seoDesc:
      'Evaluaciones certificadas del Modelo EFQM 2025, consultoría estratégica, acompañamiento de implantación de alto valor y coaching ejecutivo de primer nivel. EGA Senior Assessors con 250+ evaluaciones externas en Europa, MENA y América.',
    keywords:
      'evaluación EFQM Dubái, evaluación Modelo EFQM 2025, evaluador certificado EFQM, consultoría estratégica Dubái, evaluación de excelencia organizacional, lógica RADAR, reconocimiento EFQM, coaching ejecutivo, coaching C-level, excelencia empresarial MENA',
    eyebrow: 'Evaluaciones',
    titleA: 'Sabe exactamente dónde estás — y ', strong: 'qué hacer después', titleB: '',
    lead:
      'Una evaluación solo vale lo que cambia. Las nuestras las dirigen evaluadores EFQM certificados con más de 250 evaluaciones externas a sus espaldas, y todas terminan donde deben: con una foto puntuada y basada en evidencias de tu organización y un plan priorizado del que el equipo directivo se hace dueño de verdad.',
    chips: ['Modelo EFQM 2025', 'Lógica RADAR', 'EGA Senior Assessors', 'Reconocimiento externo', '250+ evaluaciones'],

    items: [
      {
        icon: 'compass',
        title: 'Consultoría Estratégica',
        lead: 'La dirección antes que la mejora. No tiene sentido optimizar la ejecución si la estrategia a la que sirve es confusa, está en disputa o ha quedado obsoleta en silencio.',
        paras: [
          'Trabajamos con los equipos directivos para formular una estrategia que sobreviva al contacto con la realidad: un propósito definido, una visión que la gente puede repetir sin leerla, y un número pequeño de prioridades con dueños, medidas y plazos asignados. El Modelo EFQM 2025 aporta el marco — propósito y visión, expectativas de los grupos de interés, ecosistema y megatendencias — para que la estrategia se construya sobre evidencia y no sobre la voz más alta de la sala.',
          'El despliegue es donde mueren la mayoría de las estrategias, así que ahí es donde invertimos el tiempo. Traducimos la dirección a un ritmo de gobernanza: qué se revisa, quién, con qué frecuencia, y qué pasa cuando una medida se mueve en la dirección equivocada. El resultado no es un documento. Es una rutina de gestión que mantiene la estrategia visible cuando el offsite termina.',
        ],
      },
      {
        icon: 'scan',
        title: 'Evaluación Modelo EFQM',
        lead: 'Un diagnóstico riguroso y puntuado frente al Modelo EFQM 2025 — autoevaluación, evaluación externa o el camino completo al reconocimiento internacional.',
        paras: [
          'Evaluamos los siete criterios y los 32 subcriterios con la lógica RADAR, trabajando con evidencia real: documentos, datos y entrevistas estructuradas en todos los niveles, del consejo a la primera línea. El resultado es una puntuación de madurez que puedes defender, una declaración clara de puntos fuertes y áreas de mejora ordenadas por impacto y no por facilidad.',
          'Las evaluaciones tienen varias profundidades. Un diagnóstico rápido establece una línea base y despierta el apetito. Una autoevaluación completa desarrolla a tu propia gente como evaluadores, que es donde reside buena parte del valor duradero. Una evaluación externa aporta escrutinio independiente y comparabilidad — y, cuando estés listo, prepara la candidatura al reconocimiento EFQM.',
          'Lo que distingue una evaluación útil de una cara es el feedback. El nuestro nombra lo que es genuinamente fuerte, lo que es frágil bajo una superficie confiada y lo que el equipo directivo debe decidir. Si la respuesta honesta es que no estás listo para el reconocimiento, te lo diremos y te contaremos qué te dejaría listo.',
        ],
      },
      {
        icon: 'support',
        title: 'Acompañamiento de Alto Valor',
        lead: 'Apoyo a la implantación de las prioridades de mejora que más importan — porque un informe en una estantería no cambia nada.',
        paras: [
          'La brecha entre una evaluación y un resultado es la ejecución, y la ejecución es donde las organizaciones se quedan sin tiempo, capacidad e impulso. El acompañamiento de alto valor pone a nuestra gente senior junto a la tuya en las dos o tres iniciativas con mayor efecto en tu puntuación y en tu negocio — no en las treinta.',
          'Eso puede significar reconstruir un sistema de medición para que la dirección pilote por fin con datos reales, rediseñar un proceso central de punta a punta, establecer la arquitectura de escucha a los grupos de interés que el modelo espera, o preparar una candidatura al reconocimiento basada en evidencias. Trabajamos como parte de tu equipo con entregables definidos, y vamos transfiriendo la capacidad por el camino.',
        ],
      },
      {
        icon: 'org',
        title: 'Coaching Directivo (C-Class)',
        lead: 'Coaching confidencial para directores generales, consejeros y equipos de alta dirección que cargan con una transformación.',
        paras: [
          'Los marcos de excelencia fracasan por razones humanas mucho más a menudo que por razones técnicas. Un CEO que no puede articular el propósito de forma convincente, un comité de dirección en desacuerdo privado sobre las prioridades, un líder que pide franqueza y luego la castiga — ningún modelo sobrevive a eso, por bien documentado que esté.',
          'El coaching C-class aborda la capa de liderazgo directamente. Trabajamos uno a uno con los directivos en las exigencias concretas que el Modelo EFQM plantea al liderazgo — marcar dirección en la incertidumbre, implicar a grupos de interés que no están de acuerdo contigo, impulsar el desempeño sin apagar la iniciativa, y modelar la cultura que has pedido adoptar a todos los demás.',
          'Para los equipos directivos facilitamos las conversaciones que rara vez ocurren sin ayuda: dónde la estrategia está genuinamente en disputa, qué compromisos no está cumpliendo el equipo, y qué cree la organización sobre sus líderes. Estas sesiones son confidenciales, informadas por evidencia y deliberadamente incómodas donde deben serlo — eso es lo que las hace dignas del tiempo de personas cuya agenda es el recurso más escaso de la organización.',
        ],
      },
    ],

    cta: { title: 'Empieza con un diagnóstico honesto', text: 'Todos los proyectos empiezan igual: una conversación sobre dónde estás, seguida de un diagnóstico inicial gratuito. Sin compromiso, y sin intentar venderte un programa más grande del que necesitas.', btn: 'Solicita tu diagnóstico' },
  },

  training: {
    seoTitle: 'Talleres de Alto Impacto y Formación EFQM | Dubái y MENA',
    seoDesc:
      'Formación EFQM certificada y talleres de alto impacto en Dubái y toda la región MENA: fundamentos del Modelo EFQM 2025, formación de evaluadores, lógica RADAR, programas de liderazgo y sensibilización ISO. In-company, en inglés y árabe.',
    keywords:
      'formación EFQM Dubái, formación certificada EFQM, formación de evaluadores EFQM, taller lógica RADAR, formación excelencia empresarial MENA, talleres de liderazgo Dubái, formación sensibilización ISO, formación corporativa árabe inglés, formación gestión de calidad',
    eyebrow: 'Talleres y Formación',
    titleA: 'Talleres de alto impacto que ', strong: 'cambian lo que la gente hace', titleB: ' el lunes',
    lead:
      'La formación que termina en aplausos y no cambia nada es un coste, no una inversión. Nuestros talleres se construyen alrededor de tus propias evidencias y tus propios problemas, impartidos por evaluadores en ejercicio que dan menos clase y facilitan más — en inglés o árabe, en tus instalaciones o en las nuestras.',
    chips: ['Modelo EFQM 2025', 'Formadores certificados', 'Inglés y árabe', 'In-company', 'Nivel ejecutivo'],

    approach: {
      title: 'Cómo dirigimos un taller',
      items: [
        { icon: 'doc', title: 'Construido con tu material', text: 'Preparamos con tu estrategia, tus procesos y tus datos. Los participantes trabajan sobre su propia organización, no sobre un caso ficticio de otro sector y otra década.' },
        { icon: 'org', title: 'Facilitado, no dictado', text: 'Inputs cortos seguidos de trabajo estructurado en grupos. El trabajo del formador es provocar mejor pensamiento y zanjar los desacuerdos con evidencia, no leer diapositivas en voz alta.' },
        { icon: 'check', title: 'Termina con compromisos', text: 'Cada sesión se cierra con acciones con nombre, dueños y fechas que alimentan directamente tu plan de mejora — para que la energía de la sala sobreviva a la semana.' },
        { icon: 'chat', title: 'Impartido en tu idioma', text: 'Entrega completa en inglés o árabe, con materiales bilingües. La terminología sigue el vocabulario EFQM árabe estandarizado que usamos en toda nuestra documentación del modelo.' },
      ],
    },

    programmesTitle: 'Programas',
    programmes: [
      { title: 'Fundamentos del Modelo EFQM 2025', dur: '1 día', who: 'Directivos y equipos de mejora', text: 'La arquitectura completa — Dirección, Ejecución, Resultados, los siete criterios y los 32 subcriterios — y qué pide realmente cada uno a una organización. Los participantes salen sabiendo leer el modelo y ubicar su propio trabajo dentro de él.' },
      { title: 'La lógica RADAR en la práctica', dur: '1–2 días', who: 'Evaluadores internos, equipos de calidad y estrategia', text: 'El motor de puntuación del modelo, enseñado puntuando. Los participantes aplican RADAR a evidencia real de su propia organización, se calibran entre sí y aprenden por qué dos evaluadores honestos llegan a puntuaciones distintas — y cómo cerrar esa brecha.' },
      { title: 'Formación de Evaluadores Internos', dur: '2–3 días', who: 'Futuros equipos de autoevaluación', text: 'Cómo planificar y ejecutar una autoevaluación: recogida de evidencias, entrevistas, consenso, puntuación y — lo más difícil — escribir un feedback sobre el que los líderes actúen en vez de resentirse. Incluye un ejercicio de evaluación en vivo.' },
      { title: 'Programa para Dirección y Consejo', dur: 'Media jornada', who: 'C-suite, consejos, propietarios', text: 'Una sesión condensada y de alta intensidad para personas sin tiempo y con toda la responsabilidad. Qué exige el modelo específicamente al liderazgo, qué implica tu madurez actual para la estrategia, y las tres decisiones que solo esta sala puede tomar.' },
      { title: 'Taller de Despliegue de la Estrategia', dur: '1–2 días', who: 'Equipos de dirección y planificación', text: 'Convertir la dirección estratégica en un plan ejecutable: prioridades, dueños, medidas, ritmo de revisión y la disciplina de parar cosas. El resultado es un mapa de despliegue con el que dirigir el año.' },
      { title: 'Sensibilización ISO y Auditor Interno', dur: '1–3 días', who: 'Dueños de proceso y auditores internos', text: 'Formación práctica en ISO 9001, 14001, 27001, 45001, 42001 y 56001 — qué exige la norma, cómo se integra con tu sistema EFQM, y cómo auditarla para que la auditoría encuentre algo que merezca la pena encontrar.' },
      { title: 'Innovación y Gobernanza de la IA', dur: '1 día', who: 'Dirección, TI, riesgos e innovación', text: 'Gestionar la innovación como cartera (ISO 56001) y gobernar la inteligencia artificial con responsabilidad (ISO 42001): inventario, evaluación de impacto, supervisión humana significativa y gobierno del dato, usando tus propios casos de uso reales.' },
      { title: 'Programa In-Company a Medida', dur: 'Diseñado contigo', who: 'Cualquier nivel', text: 'Construido alrededor de un desafío concreto — una candidatura a reconocimiento, una fusión, un cambio cultural, un sistema de medición que falla — y secuenciado en varias sesiones para que el aprendizaje se aplique entre ellas en lugar de olvidarse después.' },
    ],

    cta: { title: 'Diseña un programa con nosotros', text: 'Cuéntanos la audiencia, la restricción y el resultado que necesitas. Te propondremos un formato — un taller único, una secuencia, o formación integrada en una evaluación más amplia — y seremos francos sobre lo que la formación puede y no puede arreglar.', btn: 'Habla de tu programa' },
  },
}
