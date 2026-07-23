-- ============================================================================
-- MIGRATION 24 · Cuestionario O360 en ESPAÑOL
--   · Columnas _es en assessment_criteria y assessment_questions (nullable:
--     la UI hace fallback a EN cuando falta la traducción).
--   · Títulos de los 7 criterios en ES.
--   · Lote 1 de preguntas: CRITERIO 1 completo (P 1.1 – P 1.10) con pregunta,
--     bloque, contexto, evidencias sugeridas y los 6 niveles.
--   · Los criterios 2-7 llegan en los siguientes lotes (mismo patrón UPDATE).
-- Ejecutar en Supabase → SQL Editor. Re-ejecutable (idempotente).
-- ============================================================================

alter table public.assessment_criteria
  add column if not exists title_es      text,
  add column if not exists title_full_es text;

alter table public.assessment_questions
  add column if not exists block_es    text,
  add column if not exists question_es text,
  add column if not exists context_es  text,
  add column if not exists evidence_es text,
  add column if not exists levels_es   jsonb;

-- ---------------------------------------------------------------------------
-- Títulos de criterios (ES)
-- ---------------------------------------------------------------------------
update public.assessment_criteria set title_es = v.t, title_full_es = v.tf
from (values
  ('c1', 'Propósito, Visión y Estrategia',              'CRITERIO 1 · PROPÓSITO, VISIÓN Y ESTRATEGIA'),
  ('c2', 'Cultura Organizativa y Liderazgo',            'CRITERIO 2 · CULTURA ORGANIZATIVA Y LIDERAZGO'),
  ('c3', 'Implicar a las Personas (Talento)',           'CRITERIO 3 · TALENTO'),
  ('c4', 'Partners y Proveedores',                      'CRITERIO 4 · PARTNERS Y PROVEEDORES'),
  ('c5', 'Clientes',                                    'CRITERIO 5 · CLIENTES'),
  ('c6', 'Sostenibilidad y Responsabilidad Social',     'CRITERIO 6 · SOSTENIBILIDAD Y RSC'),
  ('c7', 'Desempeño Organizativo y Transformación',     'CRITERIO 7 · DESEMPEÑO Y TRANSFORMACIÓN')
) as v(code, t, tf)
where assessment_criteria.code = v.code;

-- ---------------------------------------------------------------------------
-- CRITERIO 1 · 10 preguntas (ES completo)
-- ---------------------------------------------------------------------------
update public.assessment_questions set
  block_es    = 'Propósito y visión',
  question_es = 'Propósito / Misión de la organización',
  context_es  = 'La razón de ser de la organización: qué hace y por qué existe. Sin un propósito claro no hay dirección estratégica.',
  evidence_es = E'• Plan estratégico vigente con la misión/propósito enunciados\n• Acta del Comité de Dirección aprobando o revisando la misión\n• Manual de acogida / dossier corporativo\n• Misión publicada en la web y comunicada a los grupos de interés\n• Encuestas a grupos de interés sobre el conocimiento del propósito',
  levels_es   = '["No se ha definido misión ni propósito",
    "Se ha definido un propósito/misión que refleja la actividad de la organización",
    "Existe un propósito/misión que refleja la actividad y aporta valor a al menos el 40% de sus grupos de interés (clientes, personas, partners y proveedores, inversores y reguladores, sociedad)",
    "Existe un propósito/misión, revisado en el último ciclo estratégico, que aporta valor a al menos el 60% de sus grupos de interés",
    "Existe un propósito/misión revisado que aporta valor a al menos el 80% de sus grupos de interés",
    "Existe un propósito/misión revisado, que aporta valor a al menos el 80% y es percibido como marco de referencia en su ecosistema"]'::jsonb
where code = 'P 1.1';

update public.assessment_questions set
  block_es    = 'Propósito y visión',
  question_es = 'Implicación de los grupos de interés en la definición del propósito',
  context_es  = 'Un propósito solo es real cuando quienes lo reciben lo conocen, lo comprenden y se sienten parte de él de forma medible y sostenida.',
  evidence_es = E'• Encuestas de clima con preguntas sobre identificación con el propósito\n• Encuestas a clientes, partners y sociedad sobre la conexión con la misión\n• Sesiones de co-creación o focus groups con grupos de interés\n• Indicadores de adhesión cultural (compromiso, NPS interno)\n• Informe anual de medición con resultados desglosados por grupo de interés',
  levels_es   = '["No se ha definido un plan de medición para saber si el propósito es inspirador y/o motivador",
    "Existen mediciones que muestran que el propósito es inspirador/motivador para el 20% de los grupos de interés",
    "Mediciones que muestran que el propósito es inspirador/motivador para el 40% de los grupos de interés",
    "Mediciones que muestran que el propósito es inspirador/motivador para el 60% de los grupos de interés",
    "Mediciones que muestran que el propósito es inspirador/motivador para el 80% de los grupos de interés",
    "Mediciones que muestran que el propósito es inspirador/motivador para el 100% de los grupos de interés"]'::jsonb
where code = 'P 1.2';

update public.assessment_questions set
  block_es    = 'Propósito y visión',
  question_es = 'Visión de la organización',
  context_es  = 'Describe el futuro deseado a corto y largo plazo. Una imagen ambiciosa que guía las decisiones estratégicas y moviliza a toda la organización.',
  evidence_es = E'• Documento formal de visión incluido en el plan estratégico\n• Mapa estratégico con horizonte a 3-5-10 años\n• Actas de las sesiones de definición de la visión con grupos de interés\n• Cuadro de mando con indicadores de logro de la visión\n• Plan de mejora vinculado a la visión con responsables y plazos',
  levels_es   = '["No hay evidencia de que la organización haya definido su visión",
    "Existe una visión que describe logros a corto plazo",
    "Existe una visión, basada en el propósito, que describe logros a corto y largo plazo",
    "Visión a corto y largo plazo que implica a sus grupos de interés (partes interesadas)",
    "Visión que implica a los grupos de interés con indicadores de logro",
    "Visión que implica a los grupos de interés con indicadores de logro y objetivos de mejora claros"]'::jsonb
where code = 'P 1.3';

update public.assessment_questions set
  block_es    = 'Propósito y visión',
  question_es = 'La visión es inspiradora/motivadora para los grupos de interés',
  context_es  = 'Una visión cumple su papel cuando inspira y motiva a personas, clientes y partners a avanzar en la misma dirección compartida.',
  evidence_es = E'• Encuestas específicas sobre la percepción de la visión\n• Informe anual con los resultados de medición\n• Indicadores cualitativos (entrevistas) y cuantitativos (NPS)\n• Sesiones de feedback con los grupos de interés clave\n• Cuadro de mando integral con un indicador de identificación con la visión',
  levels_es   = '["No existe un plan de medición para saber si la visión es inspiradora/motivadora",
    "Mediciones que muestran que la visión es inspiradora/motivadora para el 20% de los grupos de interés",
    "Mediciones que muestran que la visión es inspiradora/motivadora para el 40% de los grupos de interés",
    "Mediciones que muestran que la visión es inspiradora/motivadora para el 60% de los grupos de interés",
    "Mediciones que muestran que la visión es inspiradora/motivadora para el 80% de los grupos de interés",
    "Mediciones que muestran que la visión es inspiradora/motivadora para el 100% de los grupos de interés"]'::jsonb
where code = 'P 1.4';

update public.assessment_questions set
  block_es    = 'Grupos de interés',
  question_es = 'Grupos de interés clave (partes interesadas)',
  context_es  = 'Identificar quién impacta y es impactado por la organización es la base para diseñar relaciones estratégicas equilibradas con cada parte interesada.',
  evidence_es = E'• Mapa de grupos de interés con priorización (matriz poder/interés)\n• Plan de relación con grupos de interés (frecuencia, canal, responsable)\n• Actas de sesiones de escucha activa con cada grupo\n• Análisis documentado de necesidades y expectativas\n• Plan estratégico que refleja las aportaciones de los grupos de interés',
  levels_es   = '["No hay evidencia de la identificación de los grupos de interés clave",
    "Existe identificación y priorización de los grupos de interés clave",
    "Identificación, priorización, necesidades y expectativas, y valoración del impacto del propósito y la visión sobre ellos",
    "Existe un sistema de relación con los grupos de interés clave (al menos clientes más otro): identifica necesidades, expectativas, impacto y comportamiento y los implica en la estrategia",
    "Sistema de relación con la mayoría de los grupos de interés (clientes más 2 secundarios) que identifica necesidades, expectativas e impacto y los implica en la estrategia",
    "Sistema de relación con la mayoría de los grupos de interés (clientes más 3 secundarios) que identifica necesidades, expectativas e impacto y los implica en la estrategia"]'::jsonb
where code = 'P 1.5';

update public.assessment_questions set
  block_es    = 'Ecosistema',
  question_es = 'Definición del ecosistema',
  context_es  = 'Comprender el entorno completo (mercados, megatendencias, riesgos) permite anticipar oportunidades y amenazas más allá del corto plazo en cualquier sector.',
  evidence_es = E'• Análisis PESTEL o equivalente del entorno\n• Mapa del ecosistema con los flujos de valor\n• Identificación de megatendencias del sector\n• Análisis DAFO actualizado\n• Mapa de riesgos del ecosistema con planes de mitigación',
  levels_es   = '["No hay evidencia de análisis del contexto ni de identificación del ecosistema",
    "Solo se han identificado los grupos de interés",
    "Identificación de los grupos de interés y de sus necesidades y expectativas",
    "Ecosistema definido: grupos de interés, alcance, mercados y megatendencias",
    "Ecosistema definido con sistemas de relación con los grupos de interés, alcance, mercados y megatendencias",
    "Ecosistema definido con sistemas de relación y análisis de riesgos de los grupos de interés, alcance, mercados y megatendencias"]'::jsonb
where code = 'P 1.6';

update public.assessment_questions set
  block_es    = 'Estrategia',
  question_es = 'Desarrollo de la estrategia',
  context_es  = 'La estrategia traduce el propósito y la visión en un plan concreto que responde a los desafíos del entorno y prioriza los recursos para alcanzar los objetivos.',
  evidence_es = E'• Plan estratégico vigente y formalmente aprobado\n• Mapa estratégico con las prioridades identificadas\n• Iniciativas de transformación con responsables y métricas\n• Análisis de megatendencias incorporado al plan\n• Plan a 10 años con escenarios y opciones estratégicas',
  levels_es   = '["No hay evidencia de una estrategia definida para lograr el propósito",
    "Existe una estrategia definida que muestra cómo lograr el propósito y responde a los principales desafíos",
    "Estrategia definida que responde a los principales desafíos y establece prioridades estratégicas",
    "Estrategia con prioridades, que asegura acciones de gestión del cambio y se traduce en objetivos de desempeño e iniciativas de transformación",
    "Estrategia que responde a los principales desafíos basada en megatendencias, prioridades, gestión del cambio y objetivos de transformación",
    "Estrategia basada en megatendencias analizadas a un horizonte de 10 años, con prioridades, gestión del cambio y objetivos de transformación"]'::jsonb
where code = 'P 1.7';

update public.assessment_questions set
  block_es    = 'Estrategia',
  question_es = 'Objetivos estratégicos',
  context_es  = 'Convierten la estrategia en metas medibles. Sin objetivos cuantitativos claros no hay forma de verificar el avance ni de asegurar una rendición de cuentas adecuada.',
  evidence_es = E'• Cuadro de mando integral (BSC) con los objetivos estratégicos\n• Despliegue de objetivos por departamento/proceso\n• Comunicaciones internas y externas sobre los objetivos\n• Metas cuantitativas SMART con responsables y plazos\n• Benchmark sectorial y posicionamiento de la organización',
  levels_es   = '["No hay objetivos estratégicos definidos",
    "Objetivos estratégicos definidos, basados en el propósito, e implantados",
    "Objetivos estratégicos definidos, implantados y priorizados",
    "Objetivos estratégicos revisados en el último ciclo estratégico, implantados, priorizados y comunicados a los grupos de interés prioritarios",
    "Objetivos revisados, implantados, priorizados, comunicados y convertidos en metas cuantitativas específicas",
    "Objetivos convertidos en metas cuantitativas específicas con la ambición de ser los mejores"]'::jsonb
where code = 'P 1.8';

update public.assessment_questions set
  block_es    = 'Sistema de gestión y gobernanza',
  question_es = 'Sistema de gestión (desempeño y operación)',
  context_es  = 'El conjunto de procesos que asegura que la operación diaria está alineada con la estrategia y produce resultados consistentes, medibles y mejorables.',
  evidence_es = E'• Certificados ISO 9001, ISO 14001, ISO 45001, ISO 27001\n• Manual del Sistema de Gestión Integrado\n• Mapa de procesos con indicadores\n• Auditorías internas y externas con resultados\n• Plan de integración de sistemas con responsables',
  levels_es   = '["No hay evidencia de un sistema de gestión implantado",
    "Sistema de gestión alineado con el propósito, la visión y la estrategia en al menos un ámbito (calidad)",
    "Sistema alineado en al menos dos ámbitos (calidad, medio ambiente)",
    "Sistema alineado en al menos tres ámbitos (calidad, medio ambiente, seguridad y salud en el trabajo)",
    "Sistema alineado en al menos cuatro ámbitos (incluida la seguridad de la información)",
    "Sistema alineado en todos los ámbitos (calidad, medio ambiente, seguridad y salud en el trabajo, seguridad de la información)"]'::jsonb
where code = 'P 1.9';

update public.assessment_questions set
  block_es    = 'Sistema de gestión y gobernanza',
  question_es = 'Sistema de gobernanza',
  context_es  = 'Define quién toma qué decisiones y cómo funciona la rendición de cuentas. Es el marco de responsabilidad y cumplimiento normativo de toda la organización.',
  evidence_es = E'• Reglamento o estatutos del órgano de gobierno\n• Política de cumplimiento normativo\n• Actas del consejo con decisiones de transformación\n• Plan de gobierno corporativo con responsables\n• Mecanismos formales de participación de los grupos de interés en las decisiones',
  levels_es   = '["No hay evidencia de un sistema de gobernanza implantado",
    "Sistema de gobernanza básico alineado con el propósito, la visión y la estrategia, que establece responsabilidades sobre el desempeño",
    "Sistema de gobernanza alineado, con responsabilidades, que asegura el cumplimiento legal y normativo",
    "Sistema de gobernanza alineado, conforme a la legalidad, que aporta prioridades de transformación y responsables",
    "Sistema de gobernanza (implantado hace menos de 3 años) alineado, conforme, que aporta prioridades de transformación e implica a los grupos de interés en la toma de decisiones",
    "Sistema de gobernanza (implantado hace más de 3 años) alineado, conforme, con prioridades de transformación y que implica a los grupos de interés en la toma de decisiones"]'::jsonb
where code = 'P 1.10';
