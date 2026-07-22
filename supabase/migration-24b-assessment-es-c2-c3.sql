-- ============================================================================
-- MIGRATION 24b · Cuestionario O360 en ESPAÑOL — Lote 2: CRITERIOS 2 y 3
-- (20 preguntas: P 2.1–P 2.10 y P 3.1–P 3.10, con bloque, pregunta, contexto,
--  evidencias sugeridas y los 6 niveles). Requiere migration-24 previa.
-- Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

update public.assessment_questions set
  block_es='Cultura y valores', question_es='Valores de la organización',
  context_es='Los valores son principios innegociables que guían el comportamiento. Definen qué tipo de organización quieres ser, no solo qué hacer cada día.',
  evidence_es=E'• Documento formal de valores aprobado por la dirección\n• Manual de acogida con los valores explicados\n• Código ético y/o de conducta\n• Plan de comunicación de los valores (interno y externo)\n• Memoria de sostenibilidad o RSC con los valores integrados',
  levels_es='["No hay evidencia de valores definidos en la organización","Se han identificado valores en la organización","Valores identificados con una definición específica","Valores definidos y alineados con el propósito y la visión","Valores definidos y alineados con el propósito y la visión, revisados periódicamente, actualizados y comunicados","Valores revisados sistemáticamente en el último ciclo estratégico, alineados con el propósito y la visión, que expresan responsabilidad con el entorno, aseguran la conducta ética y se comunican a los grupos de interés"]'::jsonb
where code='P 2.1';

update public.assessment_questions set
  block_es='Cultura y valores', question_es='Despliegue de los valores',
  context_es='Los valores importan cuando se traducen en comportamientos cotidianos, normas de conducta y decisiones reales dentro de los procesos diarios de la organización.',
  evidence_es=E'• Diccionario de comportamientos por valor\n• Código ético desplegado y firmado por las personas\n• Procedimientos operativos que integran los valores\n• Comunicaciones a partners y proveedores sobre los valores esperados\n• Sistema de evaluación del desempeño basado en competencias y valores\n• Programa formal de reconocimiento alineado con los valores',
  levels_es='["No hay evidencia del impacto de los valores en la forma de operar de la organización","Se han identificado comportamientos asociados a los valores","Valores traducidos en normas de conducta (código ético, normativa interna)","Valores traducidos en normas de conducta e integrados en los procesos que afectan a la organización","Valores traducidos en normas, integrados en los procesos y que llegan a los grupos de interés clave","Existen competencias de liderazgo asociadas a los valores, evaluadas y fuente de reconocimiento"]'::jsonb
where code='P 2.2';

update public.assessment_questions set
  block_es='Cultura y valores', question_es='Fomento de los valores (ética, integridad, conciencia social)',
  context_es='Mide hasta qué punto los valores se viven de verdad y todos los grupos de interés los perciben como auténticos y consistentes en el tiempo.',
  evidence_es=E'• Encuestas internas y externas sobre comportamiento ético\n• Canal ético (denuncias) con casos gestionados\n• Informes de compliance\n• Auditorías de comportamiento o cultura\n• Informe público con indicadores de ética e integridad',
  levels_es='["No hay plan de medición sobre si los valores transmiten un comportamiento ético, íntegro y con conciencia social","Mediciones que muestran la conducta deseada en ética, integridad y conciencia social para al menos el 20% de los grupos de interés","Mediciones para al menos el 40% de los grupos de interés","Mediciones para al menos el 60% de los grupos de interés","Mediciones para al menos el 80% de los grupos de interés","Mediciones para el 100% de los grupos de interés"]'::jsonb
where code='P 2.3';

update public.assessment_questions set
  block_es='Liderazgo basado en valores', question_es='Referentes en los valores',
  context_es='Los líderes son el espejo de los valores. Su conducta diaria es lo que la organización aprende, observa y reproduce automáticamente sin instrucciones.',
  evidence_es=E'• Definición formal del modelo de liderazgo\n• Programa de desarrollo de líderes alineado con los valores\n• Plan de comunicación del modelo de liderazgo\n• Procedimiento de revisión periódica del modelo\n• Premios o reconocimientos internos a líderes ejemplares\n• Reconocimientos externos del sector (mejor CEO, líder del año…)',
  levels_es='["No hay evidencia de un modelo de liderazgo definido","Existe un modelo de liderazgo definido y coherente con los valores","Modelo de liderazgo coherente con los valores, alineado con el propósito y comunicado a los grupos de interés","Modelo de liderazgo coherente, alineado y comunicado, que se revisa periódicamente","Los líderes son referentes internos en los valores, demuestran las competencias asociadas y obtienen reconocimiento interno","Los líderes son referentes en los valores, demuestran las competencias asociadas y obtienen reconocimiento externo"]'::jsonb
where code='P 2.4';

update public.assessment_questions set
  block_es='Liderazgo que impulsa el cambio', question_es='Gestión del cambio',
  context_es='En un entorno cambiante, la capacidad de adaptarse y transformarse distingue a las organizaciones resilientes de las frágiles ante los desafíos del mercado.',
  evidence_es=E'• Mapa de riesgos y oportunidades del cambio\n• Procedimiento formal de gestión del cambio\n• Plan estratégico de transformación con horizontes\n• Comités de cambio con las personas afectadas\n• Cuadro de mando con indicadores de éxito de los proyectos de cambio',
  levels_es='["No hay evidencia de mecanismos de gestión del cambio en la organización","Existen mecanismos que identifican riesgos y oportunidades y fomentan la gestión del cambio","Mecanismos que identifican riesgos/oportunidades, integrados en la cultura, que analizan las capacidades para afrontar el cambio","Mecanismos sistematizados que identifican riesgos/oportunidades, integrados en la cultura, que analizan capacidades a corto y largo plazo (proyectos/desafíos estratégicos)","Mecanismos sistematizados que implican a las personas afectadas y se revisan para adaptarse y mejorar","Mecanismos sistematizados que miden el éxito de los proyectos/desafíos de cambio"]'::jsonb
where code='P 2.5';

update public.assessment_questions set
  block_es='Liderazgo que impulsa el aprendizaje', question_es='Aprendizaje de las personas',
  context_es='Una organización que no aprende repite errores. Una cultura de aprendizaje captura las experiencias y las convierte en mejora sistemática y sostenida.',
  evidence_es=E'• Repositorio de lecciones aprendidas tras los proyectos\n• Sesiones de aprendizaje entre departamentos (after action reviews)\n• Pertenencia a clubes de excelencia y asociaciones sectoriales\n• Ponencias en congresos del sector\n• Premios externos a buenas prácticas (EFQM, ISO, sector)',
  levels_es='["No hay evidencia de mecanismos que fomenten una cultura de aprendizaje","La organización dispone de mecanismos para identificar y aprender de experiencias de mejora y cambio","Mecanismos sistemáticos e interdisciplinares para identificar y aprender de las experiencias","Mecanismos sistemáticos e interdisciplinares; participa en redes de aprendizaje y colaboración para detectar casos de éxito","Mecanismos sistemáticos; participa en redes para detectar y presentar casos de éxito","La organización dispone de un sistema de buenas prácticas internas y es reconocida externamente por buenas prácticas que contribuyen a la mejora de su entorno y/o sector"]'::jsonb
where code='P 2.6';

update public.assessment_questions set
  block_es='Liderazgo que fomenta la creatividad y la innovación', question_es='Cultura que fomenta la creatividad y la innovación',
  context_es='La innovación necesita espacio, tiempo y permiso. La cultura puede habilitarla o asfixiarla aun disponiendo de buenos recursos financieros y humanos.',
  evidence_es=E'• Buzón de ideas con proceso de selección documentado\n• Programa de formación en creatividad e innovación\n• Sistema de gestión de la innovación (UNE 166002 o similar)\n• Plan anual de innovación con metas e indicadores\n• Proyectos de innovación implantados con resultados medibles',
  levels_es='["No hay evidencia de una cultura que promueva la creatividad y la innovación","Existen espacios donde plantear ideas y propuestas de mejora","Espacios para proponer ideas + desarrollo de competencias para llevarlas a cabo","Proceso de innovación que estimula la creatividad y la innovación con espacios sistemáticos de generación y selección de ideas, desarrollo de competencias y metodologías de proyecto","Proceso de innovación con planes, metas y objetivos, que aporta tiempo y espacio para desarrollar proyectos","Proceso de innovación con planes, metas y objetivos, implantado con éxito"]'::jsonb
where code='P 2.7';

update public.assessment_questions set
  block_es='Liderazgo que fomenta la creatividad y la innovación', question_es='Cultura innovadora',
  context_es='Mide si la innovación es un proyecto puntual o parte del ADN, percibida como tal por todos los grupos de interés clave del ecosistema.',
  evidence_es=E'• Encuestas de cultura innovadora por área\n• Indicadores de innovación (% de empleados que proponen, ideas/persona/año)\n• Cuadro de mando del impacto de la innovación en el negocio\n• Reconocimientos externos en innovación\n• Participación en redes y observatorios de innovación',
  levels_es='["No hay evidencia de una cultura de innovación","Existe evidencia de que la organización tiene una cultura de innovación","Cultura de innovación en al menos el 50% de la organización con percepción positiva","Cultura de innovación medida sistemáticamente con percepción positiva entre los grupos de interés","Cultura de innovación medida sistemáticamente con percepción positiva superior al 80% y proyectos con impacto medible en el negocio","La cultura de innovación es referente externo en el sector: prácticas compartidas, reconocimientos sectoriales y participación en redes/observatorios de innovación"]'::jsonb
where code='P 2.8';

update public.assessment_questions set
  block_es='Liderazgo que fomenta la unidad y el compromiso', question_es='Control operativo y toma de decisiones',
  context_es='Decidir con datos exige un control sistemático y programado. Sin medición, las decisiones son intuiciones y no verdadera gestión profesional.',
  evidence_es=E'• Cuadro de mando con frecuencia de actualización definida\n• Plan de despliegue del control operativo\n• Dashboards y herramientas de business intelligence\n• Actas de comités que muestran datos usados para decidir\n• Informe que vincula decisiones y resultados estratégicos',
  levels_es='["No hay evidencia de que el control de indicadores esté programado","La organización dispone de un proceso de control operativo","Proceso de control operativo claro y programado en el 50% del despliegue previsto","Proceso de control operativo claro y programado en el 100% del despliegue previsto","Control operativo al 100% con analítica predictiva y dashboards en tiempo real para la toma de decisiones","Control operativo integrado en el sistema de toma de decisiones, revisado sistemáticamente, con impacto demostrado en los resultados estratégicos de los últimos 2 años"]'::jsonb
where code='P 2.9';

update public.assessment_questions set
  block_es='Liderazgo que fomenta la unidad y el compromiso', question_es='Reconocimiento de los logros',
  context_es='Reconocer los logros refuerza los comportamientos deseados y dice al ecosistema qué valora y celebra de verdad la organización como hitos.',
  evidence_es=E'• Procedimiento formal de reconocimiento\n• Encuestas de percepción del reconocimiento\n• Comunicaciones internas y externas de los logros\n• Eventos de reconocimiento públicos o internos\n• Informe con casos de éxito comunicados',
  levels_es='["No hay plan de medición para reconocer los éxitos/logros de las personas","Mediciones que muestran que se reconocen los logros de las personas","Logros reconocidos, compartidos y percibidos positivamente por el 20% de los grupos de interés","Logros percibidos positivamente por el 40% de los grupos de interés","Logros percibidos positivamente por el 60% de los grupos de interés","Logros percibidos positivamente por el 80% de los grupos de interés"]'::jsonb
where code='P 2.10';

-- ------------------------- CRITERIO 3 · TALENTO -----------------------------

update public.assessment_questions set
  block_es='Entorno y bienestar', question_es='Entorno de trabajo (bienestar y seguridad)',
  context_es='El entorno físico y emocional moldea el desempeño, la salud y la atracción de talento. Es la base del compromiso real de las personas.',
  evidence_es=E'• Evaluación de riesgos psicosociales actualizada\n• Encuestas de clima y bienestar con resultados desagregados\n• Plan de bienestar laboral con acciones y responsables\n• Indicadores de absentismo, accidentalidad y satisfacción\n• Certificaciones externas (GPTW, B Corp, EFR, ISO 45003)',
  levels_es='["No hay evidencia de un entorno de trabajo orientado al bienestar","Entorno deseado y seguro que fomenta el bienestar, percibido positivamente por al menos el 50% de las personas","Entorno deseado y seguro percibido por al menos el 75% de las personas","Entorno deseado y seguro percibido por el 100% de las personas","Entorno con planes de bienestar de mejora continua activos, indicadores medidos sistemáticamente y resultados positivos sostenidos en los últimos 2 años","Referente sectorial en bienestar laboral, con certificaciones externas (Great Place to Work, B Corp, EFR o similares) y benchmarking con otras organizaciones"]'::jsonb
where code='P 3.1';

update public.assessment_questions set
  block_es='Empoderamiento y capacidades', question_es='Empoderamiento de las personas',
  context_es='Cuando las personas tienen capacidades, herramientas y autonomía, deciden mejor y más rápido. El empoderamiento libera todo el potencial productivo del equipo.',
  evidence_es=E'• Descripciones de puestos y mapas de capacidades\n• Plan de empoderamiento documentado\n• Comunidades de práctica internas\n• Indicadores de delegación y decisión autónoma\n• Resultados de proyectos liderados por equipos autoorganizados',
  levels_es='["No hay planes que identifiquen las actividades funcionales de las personas","Existen planes que identifican las actividades funcionales de las personas","Planes que identifican actividades y capacidades y aseguran las herramientas para desarrollarlas","Planes que identifican actividades, capacidades y herramientas, y al menos el 75% de las personas comunica y comparte su aprendizaje","Planes que cubren al 100% de las personas; la organización mide el impacto del empoderamiento en los resultados de los proyectos y en la satisfacción","Empoderamiento plenamente integrado en la cultura: las personas asumen responsabilidades y deciden con autonomía, con impacto demostrable en los resultados estratégicos"]'::jsonb
where code='P 3.2';

update public.assessment_questions set
  block_es='Creatividad e innovación', question_es='Creatividad e innovación',
  context_es='La innovación nace de quienes están más cerca del problema. Fomentar la creatividad de las personas construye una ventaja competitiva sostenible y diferenciadora en el sector.',
  evidence_es=E'• Procedimiento de gestión de proyectos de innovación\n• Indicadores de impacto (% de éxito, retorno, ideas implantadas)\n• Encuestas de percepción tras cada proyecto\n• Informe anual de innovación\n• Reconocimientos externos o nuevas líneas de negocio resultantes',
  levels_es='["No hay evidencia de proyectos que fomenten la creatividad, la innovación y el pensamiento disruptivo","Existen proyectos estructurados que fomentan la creatividad, la innovación y el pensamiento disruptivo","Proyectos estructurados; el impacto se mide y se percibe positivamente en el 50% de los proyectos","Proyectos estructurados; el impacto se mide y se percibe positivamente en el 75% de los proyectos","Proyectos estructurados; impacto medido y percibido positivamente en el 100% de los proyectos, con resultados medibles en innovación implantada","Referente en creatividad e innovación: las personas lideran proyectos disruptivos reconocidos externamente o que han generado nuevas líneas de negocio"]'::jsonb
where code='P 3.3';

update public.assessment_questions set
  block_es='Aprendizaje', question_es='Aprendizaje de las personas',
  context_es='La formación continua mantiene competitivas a las personas y adaptable a la organización. Es inversión estratégica, no un gasto que recortar en tiempos difíciles.',
  evidence_es=E'• Plan anual de formación con presupuesto\n• Detección sistemática de necesidades formativas\n• Indicadores del impacto de la formación en el desempeño\n• Evaluaciones Kirkpatrick (reacción, aprendizaje, conducta, resultados)\n• Universidad corporativa o escuela interna formalizada\n• Premios o menciones a la gestión del talento',
  levels_es='["No hay evidencia de acciones formativas para las personas","Acciones formativas esporádicas para las personas","Indicadores y planes de formación que apoyan la gestión del cambio y la mejora del desempeño para al menos el 50% de las personas implicadas en los procesos","Indicadores y planes de formación para al menos el 75% de las personas implicadas en los procesos","Planes de formación para el 100% de las personas con indicadores de impacto en el desempeño y resultados medidos sistemáticamente","Universidad corporativa o escuela propia y reconocimiento externo como referente en formación y desarrollo del talento"]'::jsonb
where code='P 3.4';

update public.assessment_questions set
  block_es='Dirección por objetivos', question_es='Dirección por objetivos para las personas',
  context_es='Unos objetivos individuales claros conectan el esfuerzo diario con la estrategia y hacen medible la contribución de cada persona al resultado común.',
  evidence_es=E'• Procedimiento de dirección por objetivos (MBO/OKR)\n• Plantillas de fijación de objetivos individuales\n• Sesiones de revisión del desempeño documentadas\n• Cuadro de mando con % de logro por persona/área\n• Encuestas de percepción sobre el sistema de objetivos',
  levels_es='["No hay evidencia de políticas de dirección por objetivos para las personas","Políticas de dirección por objetivos para algunas personas","Políticas percibidas positivamente por el 50% de las personas y objetivos logrados en el 25% de los casos en los últimos 2 años","Políticas percibidas positivamente por el 75% y objetivos logrados en el 50% de los casos en los últimos 2 años","Políticas percibidas positivamente por el 100% y objetivos logrados en el 70% de los casos en los últimos 2 años","Políticas plenamente desplegadas, percibidas positivamente por el 100% y objetivos logrados en más del 85% de los casos, con revisión continua"]'::jsonb
where code='P 3.5';

update public.assessment_questions set
  block_es='Motivación y compromiso', question_es='Motivación en los proyectos',
  context_es='Un equipo motivado entrega mejor, retiene clientes y atrae talento. La motivación se ve desde fuera y se contagia rápido a otros equipos.',
  evidence_es=E'• Encuestas de compromiso / motivación\n• Indicadores de rotación voluntaria desagregados\n• Sesiones 1:1 con seguimiento de la motivación\n• Programas de motivación específicos por proyecto\n• Tasa de retención del talento clave',
  levels_es='["No hay evidencia de motivación en los proyectos","Evidencia de personas motivadas en los proyectos","Al menos el 40% de las personas muestra motivación, percibida positivamente por sus grupos de interés","Al menos el 60% de las personas muestra motivación","Al menos el 80% de las personas muestra motivación","El 100% de las personas muestra motivación, percibida por todos los grupos de interés, que se traduce en baja rotación voluntaria"]'::jsonb
where code='P 3.6';

update public.assessment_questions set
  block_es='Conciliación y vida personal', question_es='Conciliación de la vida laboral y personal',
  context_es='La conciliación es hoy un factor clave de salud, productividad y retención del talento en cualquier sector exigente.',
  evidence_es=E'• Política de conciliación documentada\n• Medidas concretas (horario flexible, teletrabajo, permisos)\n• Encuestas de percepción de la conciliación\n• Certificación EFR (empresa familiarmente responsable) o similar\n• Casos publicados como buenas prácticas del sector',
  levels_es='["No hay evidencia de un plan que asegure la conciliación","Existe un plan que asegura la conciliación de la vida laboral y personal","La organización es flexible en el apoyo a la conciliación, percibida positivamente por el 40% de las personas","Conciliación percibida positivamente por el 80% de las personas","Conciliación percibida positivamente por el 100% de las personas","Referente en conciliación: certificaciones específicas (EFR, B Corp o similares) y citada como buena práctica por otras organizaciones del sector"]'::jsonb
where code='P 3.7';

update public.assessment_questions set
  block_es='Reconocimiento del talento', question_es='Recompensa, reconocimiento y cuidado',
  context_es='El talento se cuida o se va. Reconocer, retener y motivar evita perder conocimiento crítico y reduce la rotación y los costes de contratación.',
  evidence_es=E'• Programa de reconocimiento (monetario y no monetario)\n• Política retributiva con benchmarking sectorial\n• Encuestas de reconocimiento (¿te sientes valorado?)\n• Indicadores de rotación frente al sector\n• Número de candidaturas espontáneas / referidos',
  levels_es='["No hay un plan definido para reconocer, retener y/o motivar el talento","Existe un plan definido para reconocer, retener y/o motivar el talento","Mediciones de reconocimiento y retención del talento percibidas positivamente por el 50% de las personas","Reconocimiento y retención percibidos por el 75% de las personas","Reconocimiento y retención percibidos por el 100% de las personas","Referente en gestión y retención del talento: rotación por debajo del sector y atracción espontánea de candidaturas"]'::jsonb
where code='P 3.8';

update public.assessment_questions set
  block_es='Comunicación interna', question_es='Comunicación interna y transparencia',
  context_es='Una comunicación clara y transparente alinea a las personas, evita rumores y construye confianza en la dirección y en el proyecto compartido.',
  evidence_es=E'• Plan anual de comunicación interna\n• Canales activos (intranet, newsletter, town halls)\n• Encuestas de percepción de la comunicación\n• Comités de escucha activa o consejos de personas\n• Casos donde la opinión de los equipos cambió decisiones',
  levels_es='["No hay planes de comunicación clara y transparente","Existen planes de gestión que evidencian una comunicación clara y transparente","Planes de comunicación percibidos positivamente por el 50% de las personas","Planes de comunicación percibidos positivamente por el 75% de las personas","Planes de comunicación percibidos positivamente por el 100% de las personas","Comunicación interna bidireccional y sistemática: la dirección rinde cuentas periódicamente y las personas perciben que sus opiniones impactan en las decisiones"]'::jsonb
where code='P 3.9';

update public.assessment_questions set
  block_es='Diversidad e igualdad', question_es='Diversidad e igualdad de oportunidades',
  context_es='La diversidad enriquece la toma de decisiones, refleja la realidad social y es una exigencia legal y reputacional creciente en el mercado actual.',
  evidence_es=E'• Plan de igualdad registrado y vigente\n• Indicadores de paridad por nivel y categoría\n• Auditoría retributiva con la brecha salarial\n• Encuestas de percepción de inclusión\n• Certificaciones (distintivos de igualdad, Bequal, EDGE) y adhesión a iniciativas sectoriales',
  levels_es='["No hay plan de diversidad de género y/o igualdad de oportunidades","Plan que define la diversidad de género y/o la igualdad de oportunidades en el último ciclo estratégico, sin mediciones definidas","Paridad en diversidad de género e igualdad de oportunidades, percibida positivamente por el 50% de las personas","Paridad percibida positivamente por el 75% de las personas","Paridad percibida positivamente por el 100% de las personas","Referente en diversidad, equidad e inclusión: certificaciones externas y participación activa en iniciativas sectoriales de igualdad"]'::jsonb
where code='P 3.10';

-- Verificación rápida: preguntas con ES por criterio
select criterion_code, count(*) filter (where question_es is not null) as con_es, count(*) as total
from public.assessment_questions group by 1 order by 1;
