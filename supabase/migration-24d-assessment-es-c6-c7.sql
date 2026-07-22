-- ============================================================================
-- MIGRATION 24d · Cuestionario O360 en ESPAÑOL — Lote 4 (FINAL): CRITERIOS 6 y 7
-- (20 preguntas: P 6.1–P 6.10 Sostenibilidad y RSC · P 7.1–P 7.10 Desempeño)
-- Con esta migración, las 70 preguntas del cuestionario quedan trilingües.
-- Requiere migration-24. Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

update public.assessment_questions set
  block_es='RSC', question_es='Aspectos materiales de la RSC',
  context_es='Los aspectos materiales son los temas de mayor impacto para el negocio y los grupos de interés. Centrarse en ellos hace la RSC eficaz, no decorativa.',
  evidence_es=E'• Análisis de materialidad documentado\n• Matriz de materialidad publicada\n• Plan de acción derivado de los aspectos materiales\n• Memoria anual de sostenibilidad (GRI, SASB)\n• Verificación externa de la memoria',
  levels_es='["No hay planes de evaluación de los aspectos materiales en RSC","Existen planes de evaluación pero apenas sistematizados","Planes de evaluación que cubren el 40% del ecosistema","Planes que cubren el 60% del ecosistema","Planes que cubren más del 80% del ecosistema","Planes que cubren el 100% del ecosistema, con memoria de sostenibilidad publicada periódicamente según estándares internacionales (GRI, SASB o similares)"]'::jsonb
where code='P 6.1';

update public.assessment_questions set
  block_es='ODS', question_es='Alineación estratégica con los ODS',
  context_es='Los ODS son el marco global del desarrollo sostenible. Alinear la estrategia con ellos facilita el reporte, la financiación y la reputación en el ecosistema global actual.',
  evidence_es=E'• Mapa estratégico con ODS asignados a cada línea\n• Indicadores específicos por ODS\n• Informe de avance en ODS publicado\n• Reporte a grupos de interés (Pacto Mundial u otros)\n• Proyectos concretos vinculados a metas de los ODS',
  levels_es='["No hay planes que integren los ODS","La organización analiza e integra en su estrategia los ODS a los que puede contribuir","Despliega y alinea al menos el 40% de sus líneas estratégicas con los ODS","Despliega y alinea al menos el 60% de sus líneas estratégicas con los ODS","Despliega y alinea más del 80% de sus líneas estratégicas con los ODS","Despliega y alinea el 100% de sus líneas estratégicas con los ODS, con indicadores medidos sistemáticamente y reportados a los grupos de interés externos"]'::jsonb
where code='P 6.2';

update public.assessment_questions set
  block_es='Medio ambiente', question_es='Plan de desarrollo ambiental',
  context_es='El impacto ambiental es una exigencia legal, social y de los inversores. Gestionarlo activamente reduce el riesgo operativo y abre oportunidades de negocio nuevas y diferenciadoras.',
  evidence_es=E'• Política ambiental\n• Plan ambiental con objetivos cuantitativos\n• Indicadores de huella ambiental (carbono, agua, residuos)\n• Certificados ISO 14001 / EMAS\n• Plan de descarbonización con horizonte a medio plazo (SBTi)',
  levels_es='["No hay evidencia de planes de responsabilidad ambiental","Existen planes de responsabilidad ambiental que permiten minimizar el impacto","Mediciones que muestran que el impacto se minimiza para el 40% del ecosistema","Mediciones para el 60% del ecosistema","Mediciones para el 80% del ecosistema","Mediciones para el 100% del ecosistema, con certificaciones externas (ISO 14001, EMAS o similares) y metas de neutralidad a medio plazo"]'::jsonb
where code='P 6.3';

update public.assessment_questions set
  block_es='Comunicación', question_es='Comunicación clara y transparente con el ecosistema',
  context_es='La transparencia con el ecosistema construye confianza. Sin comunicación clara, las buenas prácticas pasan desapercibidas y no generan ni reputación ni valor compartido.',
  evidence_es=E'• Plan de comunicación con los grupos de interés\n• Informe integrado o de sostenibilidad publicado\n• Canales de diálogo abiertos (consultas, webinars, foros)\n• Encuestas de percepción de la transparencia\n• Evaluación externa de la transparencia (Dow Jones, FTSE4Good)',
  levels_es='["No hay planes que gestionen una comunicación clara y transparente con el ecosistema","Evidencia de comunicación clara y transparente con el ecosistema","Planes de comunicación percibidos positivamente por el 40% del ecosistema","Planes percibidos por el 60% del ecosistema","Planes percibidos por más del 80% del ecosistema","Planes percibidos por el 100% del ecosistema, con informe integrado público y diálogo activo con los grupos de interés"]'::jsonb
where code='P 6.4';

update public.assessment_questions set
  block_es='Reputación', question_es='Percepción de la reputación por el ecosistema',
  context_es='La reputación tarda años en construirse y puede perderse en un día. Medirla permite anticipar riesgos y proteger este activo intangible tan valioso.',
  evidence_es=E'• Estudios de reputación corporativa (RepTrak o similares)\n• Posicionamiento en rankings sectoriales (Merco, Best Place to Work)\n• Proyectos de implicación con la comunidad documentados\n• Informes de impacto social\n• Certificaciones reconocidas (B Corp, EFR, etc.)',
  levels_es='["No hay mediciones que demuestren la percepción de la reputación y la imagen por el ecosistema","Existen proyectos que demuestran el compromiso de la organización con su ecosistema","Proyectos de compromiso percibidos positivamente por el 40% del ecosistema","Proyectos percibidos positivamente por el 60% del ecosistema","Proyectos percibidos positivamente por el 80% del ecosistema","Proyectos percibidos positivamente por el 100% del ecosistema, con presencia en rankings sectoriales de reputación y certificaciones reconocidas"]'::jsonb
where code='P 6.5';

update public.assessment_questions set
  block_es='Experiencia social', question_es='Valor social y experiencia del ecosistema',
  context_es='El valor que la organización aporta a la sociedad va más allá del producto. La experiencia social forma parte de la propuesta ampliada.',
  evidence_es=E'• Estudios de impacto social y económico (SROI u otros)\n• Informe de impacto público\n• Encuestas al ecosistema sobre el valor social percibido\n• Cálculo anual de la huella social y económica\n• Auditoría externa del impacto',
  levels_es='["No hay evidencia de que se revise la experiencia social generada por las propuestas de valor","Las propuestas de valor orientadas al ecosistema se revisan esporádicamente","Mediciones del impacto positivo de la propuesta de valor percibidas al 40%","Mediciones de impacto positivo percibidas al 60%","Mediciones de impacto positivo percibidas a más del 80%","Mediciones de impacto positivo percibidas por el 100% del ecosistema, con divulgación pública de la huella social y económica generada"]'::jsonb
where code='P 6.6';

update public.assessment_questions set
  block_es='Marco regulatorio', question_es='Cambios institucionales y regulatorios',
  context_es='El marco regulatorio cambia constantemente. Anticiparse evita sanciones y permite influir en la regulación que pronto afectará al sector.',
  evidence_es=E'• Procedimiento de vigilancia regulatoria\n• Persona o área responsable del cumplimiento\n• Registro de cambios regulatorios y acciones tomadas\n• Participación en grupos sectoriales / consultas públicas\n• Posicionamiento público ante cambios regulatorios',
  levels_es='["No hay recursos para identificar, actualizar y gestionar los cambios gubernamentales y regulatorios","Se identifican, actualizan y gestionan los cambios gubernamentales y regulatorios, pero sin evidencias","Al menos el 40% de los cambios identificados, actualizados y gestionados con agilidad","Al menos el 60% de los cambios identificados, actualizados y gestionados con agilidad","Más del 80% de los cambios identificados, actualizados y gestionados con agilidad","El 100% de los cambios identificados, actualizados y gestionados con agilidad, con un sistema proactivo de anticipación y participación en consultas públicas o foros sectoriales"]'::jsonb
where code='P 6.7';

update public.assessment_questions set
  block_es='Experiencia social', question_es='Actualización de la propuesta de valor y la experiencia social',
  context_es='El contexto social evoluciona, y la propuesta de valor social debe actualizarse periódicamente para seguir siendo relevante y legítima ante un ecosistema cambiante.',
  evidence_es=E'• Revisión anual de los aspectos materiales\n• Sesiones de escucha activa con los grupos del ecosistema\n• Mediciones cuantitativas de la percepción social\n• Informe con la evolución de los aspectos materiales\n• Plan de acción tras la revisión',
  levels_es='["No hay evidencia de que se identifique la experiencia social","Mediciones que muestran que la organización conoce la experiencia social de los aspectos materiales identificados","Mediciones percibidas positivamente para el 40% del ecosistema","Mediciones percibidas positivamente para el 60% del ecosistema","Mediciones percibidas positivamente para el 80% del ecosistema","Mediciones percibidas positivamente para el 100% del ecosistema, con aspectos materiales revisados periódicamente según evoluciona el contexto"]'::jsonb
where code='P 6.8';

update public.assessment_questions set
  block_es='Buenas prácticas', question_es='Compartir buenas prácticas',
  context_es='Compartir buenas prácticas multiplica el impacto positivo en el ecosistema y posiciona a la organización como referente sectorial reconocido externamente y con reputación creciente.',
  evidence_es=E'• Repositorio de buenas prácticas compartidas\n• Ponencias en congresos del sector\n• Casos de estudio publicados\n• Premios externos a buenas prácticas\n• Acceso público a metodologías o guías',
  levels_es='["No hay evidencia de que la organización comparta buenas prácticas","Evidencia de que la organización comparte buenas prácticas","Buenas prácticas percibidas positivamente por el 40% del ecosistema","Buenas prácticas percibidas positivamente por el 60% del ecosistema","Buenas prácticas percibidas positivamente por más del 80% del ecosistema","Buenas prácticas percibidas positivamente por el 100% del ecosistema, con reconocimiento externo (premios, casos publicados, ponencias en foros sectoriales)"]'::jsonb
where code='P 6.9';

update public.assessment_questions set
  block_es='Inversión sostenible', question_es='Planes de inversión sostenible',
  context_es='Las decisiones de inversión moldean el futuro. Aplicar criterios ESG asegura la sostenibilidad financiera y la alineación real con los valores declarados de la organización.',
  evidence_es=E'• Plan financiero a 3-5 años\n• Política de inversión con criterios ESG\n• Análisis de liquidez a corto y largo plazo\n• Informe con los resultados de las inversiones estratégicas\n• Adhesión a principios de inversión responsable (UNPRI)',
  levels_es='["No hay planes de inversión","Existen planes de inversión y financiación que identifican los activos tangibles e intangibles y analizan las necesidades de liquidez a corto y largo plazo","Planes percibidos positivamente por el 50% del ecosistema, que demuestran el 50% de los resultados estratégicos","Planes percibidos por el 50% del ecosistema, que demuestran el 75% de los resultados estratégicos","Planes percibidos por el 75% del ecosistema, que demuestran el 75% de los resultados estratégicos","Planes percibidos por el 100% del ecosistema, que demuestran más del 90% de los resultados estratégicos y aplican criterios ESG a cada decisión de inversión"]'::jsonb
where code='P 6.10';

-- ------------------- CRITERIO 7 · DESEMPEÑO Y TRANSFORMACIÓN ----------------

update public.assessment_questions set
  block_es='Procesos', question_es='Identificación y despliegue de los procesos clave',
  context_es='Los procesos clave son la columna vertebral operativa. Identificarlos y medirlos es la base de toda mejora sistemática y de la eficiencia organizativa real.',
  evidence_es=E'• Mapa de procesos con los procesos clave identificados\n• Fichas de proceso con indicadores y responsables\n• Cuadro de mando con el seguimiento de los indicadores\n• Procedimiento de revisión periódica de procesos\n• Informes de mejora de procesos',
  levels_es='["No hay evidencia de que los procesos clave estén identificados en la organización","Se identifican los procesos clave y se establecen indicadores de medición para su mejora","Procesos clave con indicadores que permiten el análisis y la mejora del 40% de ellos","Procesos clave con indicadores que permiten el análisis y la mejora del 60% de ellos","Procesos clave con indicadores que permiten el análisis y la mejora del 80% de ellos","Procesos clave con indicadores que permiten el análisis y la mejora del 100% de ellos, con ciclos de revisión sistemáticos"]'::jsonb
where code='P 7.1';

update public.assessment_questions set
  block_es='Procesos', question_es='Gestión y control de riesgos en los procesos',
  context_es='Todo proceso conlleva riesgo. Gestionarlo proactivamente evita interrupciones costosas y daños reputacionales, y permite anticipar la acción correctiva a tiempo.',
  evidence_es=E'• Mapa de riesgos por proceso\n• Procedimiento de gestión de riesgos (ISO 31000)\n• Planes de tratamiento de riesgos\n• Indicadores de eficiencia/eficacia por proceso\n• Certificación ISO 31000 o equivalente',
  levels_es='["No hay evidencia de proyectos orientados a la gestión de riesgos","La organización dispone de procesos sistemáticos orientados a la gestión de riesgos","Procesos sistemáticos con eficiencia y eficacia demostradas en el 40% de los procesos","Procesos sistemáticos con eficiencia y eficacia demostradas en el 60% de los procesos","Procesos sistemáticos con eficiencia y eficacia demostradas en el 80% de los procesos","Procesos sistemáticos con eficiencia y eficacia demostradas en el 100% de los procesos, con un sistema de gestión de riesgos certificado (ISO 31000 o similar)"]'::jsonb
where code='P 7.2';

update public.assessment_questions set
  block_es='Transformación', question_es='Convertir desafíos y oportunidades en proyectos de transformación',
  context_es='Convertir desafíos y oportunidades en proyectos concretos separa la estrategia declarada de la transformación real, medible en resultados tangibles y comunicables externamente.',
  evidence_es=E'• Cartera de proyectos de transformación (PMO)\n• Patrocinadores y comités de seguimiento\n• Encuestas de percepción a los grupos de interés\n• Cuadro de mando de la transformación\n• Casos de éxito con impacto cuantificado',
  levels_es='["No hay evidencia de que existan proyectos de transformación gestionados adecuadamente","Existen proyectos de transformación gestionados adecuadamente","Proyectos basados en desafíos/oportunidades, percibidos positivamente por el 40% de las partes interesadas","Proyectos percibidos positivamente por el 60% de las partes interesadas","Proyectos percibidos positivamente por el 80% de las partes interesadas","Proyectos percibidos positivamente por el 100% de las partes interesadas, con resultados medibles en innovación y competitividad"]'::jsonb
where code='P 7.3';

update public.assessment_questions set
  block_es='Transformación', question_es='Gestión de la innovación',
  context_es='Las metodologías ágiles aceleran la innovación, reducen el riesgo de fracaso y permiten validar ideas con clientes reales en ciclos de aprendizaje cortos e iterativos.',
  evidence_es=E'• Metodologías ágiles documentadas (Scrum, Design Thinking)\n• Inventario de proyectos de innovación por metodología\n• Formación en metodologías ágiles\n• Sistema de gestión de la innovación (UNE 166002)\n• Resultados de proyectos ejecutados con metodologías ágiles',
  levels_es='["No hay evidencia de que la innovación se gestione con una metodología adecuada","Existen metodologías ágiles para la gestión de la innovación de forma esporádica","El 40% de los proyectos de innovación se gestiona con metodologías ágiles","El 60% de los proyectos de innovación se gestiona con metodologías ágiles","El 80% de los proyectos de innovación se gestiona con metodologías ágiles","El 100% de los proyectos de innovación se gestiona con metodologías ágiles, con un sistema de gestión de la innovación reconocido (UNE 166002 o similar)"]'::jsonb
where code='P 7.4';

update public.assessment_questions set
  block_es='Ciclo de vida', question_es='Gestión del ciclo de vida (productos/servicios)',
  context_es='Gestionar el ciclo de vida completo del producto/servicio reduce el impacto ambiental, optimiza recursos y responde a las expectativas crecientes del mercado y los reguladores actuales.',
  evidence_es=E'• Análisis de ciclo de vida (ACV) de los principales productos/servicios\n• Procedimiento de evaluación del impacto ambiental y en la salud\n• Etiquetado ambiental (huella de carbono, ecoetiquetas)\n• Comunicación externa del ACV\n• Encuestas de percepción a los grupos de interés',
  levels_es='["No hay evidencia de la gestión del ciclo de vida de productos/servicios y de su impacto ambiental/en la salud","Evidencia de la gestión del ciclo de vida y de su impacto en el medio ambiente y la salud","Gestión del ciclo de vida percibida positivamente por el 40% de los grupos de interés clave","Gestión percibida por el 60% de los grupos de interés clave","Gestión percibida por el 80% de los grupos de interés clave","Gestión percibida por el 100% de los grupos de interés clave, con un ACV documentado y comunicado externamente"]'::jsonb
where code='P 7.5';

update public.assessment_questions set
  block_es='Activos', question_es='Gestión de los activos',
  context_es='Los activos físicos e intangibles son a la vez inversión y riesgo. Gestionarlos bien optimiza el coste, la vida útil y el impacto ambiental durante toda su operación.',
  evidence_es=E'• Inventario de activos (tangibles e intangibles)\n• Plan de mantenimiento y renovación de activos\n• Análisis del impacto ambiental y en la salud de los activos\n• Procedimiento ISO 55001 (gestión de activos)\n• Encuestas de percepción a los grupos de interés',
  levels_es='["No hay evidencia de la gestión de activos","Evidencia de la gestión de activos","Activos gestionados con impacto ambiental/en la salud revisado, percibidos por el 40% de las partes interesadas","Activos gestionados, percibidos por el 60% de las partes interesadas","Activos gestionados, percibidos por el 80% de las partes interesadas","Activos gestionados, percibidos por el 100% de las partes interesadas, con un sistema de gestión de activos reconocido (ISO 55001 o similar)"]'::jsonb
where code='P 7.6';

update public.assessment_questions set
  block_es='Recursos', question_es='Recursos financieros',
  context_es='Los recursos financieros sostienen la operación actual y el futuro. Planificarlos es condición necesaria para la continuidad y el crecimiento sostenido a medio plazo.',
  evidence_es=E'• Plan financiero plurianual\n• Análisis de fuentes de financiación diversificadas\n• Histórico de ejecución presupuestaria\n• Plan de inversiones futuras\n• Indicadores de salud financiera (ratios, liquidez)',
  levels_es='["No hay evidencia de recursos financieros que garanticen el éxito actual y la inversión futura","Se identifican los recursos financieros que garantizan el éxito","Recursos que garantizan el éxito y la inversión futura en el 40% de los casos","Recursos que garantizan el éxito y la inversión futura en el 60% de los casos","Recursos que garantizan el éxito y la inversión futura en el 80% de los casos","Recursos que garantizan el éxito y la inversión futura en el 100% de los casos, con un plan financiero a más de 5 años y fuentes diversificadas"]'::jsonb
where code='P 7.7';

update public.assessment_questions set
  block_es='Recursos', question_es='Nuevas tecnologías',
  context_es='Las tecnologías emergentes redefinen los sectores. Ignorarlas es un riesgo competitivo; adoptarlas con criterio es ventaja sostenible y diferenciación estratégica de futuro.',
  evidence_es=E'• Plan tecnológico con horizonte temporal\n• Procedimiento de vigilancia tecnológica\n• Inversión en I+D+i / nuevas tecnologías\n• Laboratorio o área de prototipado tecnológico\n• Casos de adopción de tecnologías emergentes con resultados',
  levels_es='["No hay evidencia de que la organización evalúe el potencial de las nuevas tecnologías para apoyar la creación de valor","Evidencia de que la organización evalúa el potencial de las nuevas tecnologías","La organización despliega y revisa el 40% del plan de mejora tecnológica, midiendo su eficacia","Despliega y revisa el 60% del plan","Despliega y revisa el 80% del plan","Despliega y revisa el 100% del plan, con vigilancia tecnológica activa y prototipado de tecnologías emergentes"]'::jsonb
where code='P 7.8';

update public.assessment_questions set
  block_es='Seguridad', question_es='Seguridad de la información y los datos',
  context_es='Los datos son un activo crítico y objetivo de ciberataques. Gestionarlos y protegerlos es ya un requisito para operar en cualquier sector y una exigencia legal creciente.',
  evidence_es=E'• Política de seguridad de la información\n• Análisis de riesgos de seguridad\n• Plan de formación en ciberseguridad para todas las personas\n• Certificado ISO 27001 o esquema nacional equivalente\n• Auditorías periódicas con resultados publicados',
  levels_es='["No hay evidencia de que la organización gestione la seguridad de la información y los datos","Evidencia de que la organización gestiona la seguridad de la información y los datos","La organización fija objetivos para la seguridad de la información y los datos","Objetivos ligados a los riesgos de seguridad, con planificación y seguimiento","Objetivos ligados a los riesgos, con planificación, seguimiento y formación sistemática para el 80% de las personas","Sistema de gestión certificado (ISO 27001 o equivalente), con auditorías periódicas y comunicación transparente de los incidentes al ecosistema"]'::jsonb
where code='P 7.9';

update public.assessment_questions set
  block_es='Impacto ambiental', question_es='Impacto ambiental',
  context_es='Reducir el impacto ambiental es una responsabilidad ética, una exigencia regulatoria y un factor de competitividad ante clientes e inversores cada vez más exigentes con la sostenibilidad.',
  evidence_es=E'• Política y plan ambiental\n• Indicadores cuantitativos de huella ambiental\n• Plan de descarbonización con metas (SBTi)\n• Certificado ISO 14001 o EMAS\n• Reporte CDP, GRI, TCFD o similar',
  levels_es='["No hay evidencia de que la organización gestione su impacto ambiental","Evidencia de que la organización gestiona su impacto ambiental","La organización fija objetivos para su impacto ambiental","Objetivos ligados a los riesgos ambientales, con planificación y seguimiento","Objetivos ambientales con seguimiento y resultados demostrables de reducción en el 80% de los indicadores clave","Sistema de gestión ambiental certificado (ISO 14001/EMAS), con metas de neutralidad y reporte público según estándares internacionales (GRI, CDP)"]'::jsonb
where code='P 7.10';

-- Verificación FINAL: las 70 preguntas con ES
select criterion_code, count(*) filter (where question_es is not null) as con_es, count(*) as total
from public.assessment_questions group by 1 order by 1;
