-- ============================================================================
-- MIGRATION 24c · Cuestionario O360 en ESPAÑOL — Lote 3: CRITERIOS 4 y 5
-- (20 preguntas: P 4.1–P 4.10 Partners y Proveedores · P 5.1–P 5.10 Clientes)
-- Requiere migration-24. Ejecutar en Supabase → SQL Editor. Idempotente.
-- ============================================================================

update public.assessment_questions set
  block_es='Segmentación', question_es='Segmentación de partners y proveedores',
  context_es='No todos los partners aportan lo mismo. Segmentarlos concentra el esfuerzo de gestión donde más valor estratégico genera para la organización.',
  evidence_es=E'• Mapa segmentado de partners y proveedores\n• Criterios de segmentación documentados (estratégicos, tácticos, operativos)\n• Plan de relación diferenciado por segmento\n• Actas de revisiones anuales de la segmentación\n• Decisiones estratégicas que usaron la segmentación',
  levels_es='["No hay evidencia de segmentación de partners y proveedores","Existe segmentación de partners y proveedores","Segmentación basada en el propósito, la visión y la estrategia para al menos el 40% de los partners y proveedores, revisada en el último ciclo estratégico","Segmentación basada en el propósito, la visión y la estrategia para al menos el 60% de los partners y proveedores","Segmentación basada en el propósito, la visión y la estrategia para al menos el 80% de los partners y proveedores, revisada en el último ciclo estratégico","La segmentación cubre al 100% de los partners y proveedores, se revisa anualmente y se usa activamente en la toma de decisiones estratégicas"]'::jsonb
where code='P 4.1';

update public.assessment_questions set
  block_es='Confianza y valor compartido', question_es='Relación de confianza y valor compartido',
  context_es='Las mejores alianzas funcionan cuando ambas partes ganan. Medir el valor compartido evita relaciones desequilibradas que se erosionan en silencio con el tiempo.',
  evidence_es=E'• Encuestas de percepción a partners y proveedores\n• Proyectos conjuntos documentados con resultados\n• Acuerdos de valor compartido (planes de negocio conjuntos)\n• Indicadores de valor mutuo (ahorros, ingresos compartidos)\n• Casos de éxito publicados conjuntamente',
  levels_es='["No hay mediciones de la generación de valor compartido","La organización mide la percepción del valor compartido con sus partners y proveedores","Valor compartido percibido positivamente por el 40%","Valor compartido percibido positivamente por el 60%","Valor compartido percibido positivamente por el 80%","Valor compartido percibido positivamente por el 100% de los partners y proveedores, con resultados medibles en proyectos conjuntos"]'::jsonb
where code='P 4.2';

update public.assessment_questions set
  block_es='Confianza y valor compartido', question_es='Relaciones sostenidas en el tiempo',
  context_es='Las relaciones largas con partners reducen costes y permiten proyectos más ambiciosos. La longevidad señala la salud de la alianza y la confianza mutua.',
  evidence_es=E'• Histórico de antigüedad de las relaciones con partners\n• Renovaciones de contratos a largo plazo\n• Encuestas de satisfacción de partners\n• Premios o menciones a alianzas sostenibles\n• Casos publicados conjuntamente con partners',
  levels_es='["No hay evidencia de sistemas de relación que apoyen la sostenibilidad con los partners","Relaciones de al menos 3 años con al menos el 50% de los partners","Relaciones de 3+ años con el 50% de los partners, percibidas positivamente en al menos el 40% de los casos","Relaciones de 3+ años con el 50% de los partners, percibidas positivamente en al menos el 60% de los casos","Relaciones de 3+ años con el 50% de los partners, percibidas positivamente en al menos el 80% de los casos","Relaciones de más de 5 años con la mayoría de los partners clave, percibidas positivamente en el 100% de los casos, reconocidas externamente como ejemplo de alianza sostenible"]'::jsonb
where code='P 4.3';

update public.assessment_questions set
  block_es='Confianza y valor compartido', question_es='Confianza con partners/proveedores, a corto y largo plazo',
  context_es='La confianza es el cimiento de toda alianza. Sin medirla no puedes saber si se está construyendo o destruyendo en silencio con el tiempo.',
  evidence_es=E'• Encuestas anuales de confianza a partners\n• Indicadores de Net Promoter Score (NPS) de proveedores\n• Planes de acción post-encuesta con seguimiento\n• Comités de seguimiento conjuntos\n• Acuerdos de confidencialidad y colaboración a largo plazo',
  levels_es='["No hay plan para medir el grado de confianza con partners y proveedores","Existen mediciones que muestran confianza entre la organización y los partners/proveedores","Mediciones de confianza para el 40%, a corto y largo plazo","Mediciones de confianza para el 60%, a corto y largo plazo","Mediciones de confianza para el 80%, a corto y largo plazo","Mediciones de confianza para el 100%, a corto y largo plazo, con planes de acción específicos para mantenerla y desarrollarla"]'::jsonb
where code='P 4.4';

update public.assessment_questions set
  block_es='Sostenibilidad', question_es='Compromiso con la economía circular',
  context_es='Avanzar hacia la economía circular es una responsabilidad compartida con la cadena de valor, que reduce el impacto ambiental y los costes operativos de forma sostenible.',
  evidence_es=E'• Plan de economía circular de la organización\n• Criterios de selección de proveedores que incluyen la circularidad\n• Auditorías de circularidad a proveedores\n• Indicadores (% de material reciclado, residuos evitados)\n• Memoria de sostenibilidad con datos publicados',
  levels_es='["No hay plan de gestión para avanzar hacia la economía circular","Mediciones que muestran el reconocimiento del compromiso y los logros hacia la economía circular entre partners y proveedores","Reconocimiento del compromiso y los logros hacia la economía circular entre el 40% de los partners y proveedores","Reconocimiento y logros entre el 60% de los partners y proveedores","Reconocimiento y logros entre el 80% de los partners y proveedores","Compromiso con la economía circular reconocido por el 100% de los partners y proveedores clave, con indicadores medidos sistemáticamente y resultados publicados en la memoria de sostenibilidad"]'::jsonb
where code='P 4.5';

update public.assessment_questions set
  block_es='Cultura compartida', question_es='Cultura orientada al cliente a través de partners/proveedores',
  context_es='Los partners y proveedores impactan en la experiencia del cliente final. Alinearlos con la cultura de cliente protege la propuesta de valor de la organización.',
  evidence_es=E'• Procedimiento de gestión partner-cliente\n• Encuestas a clientes sobre la experiencia con los partners\n• Acuerdos de nivel de servicio (SLA) tripartitos\n• Planes partner-cliente revisados conjuntamente\n• Indicadores de satisfacción del cliente final con los partners',
  levels_es='["No hay un sistema que apoye la gestión de relaciones alineada con el propósito y la estrategia entre partners y clientes","Existen sistemas que apoyan la gestión de relaciones alineada con el propósito y la estrategia entre partners y clientes","Sistemas percibidos positivamente por el 40% de los clientes","Sistemas percibidos positivamente por el 60% de los clientes","Sistemas percibidos positivamente por el 80% de los clientes","Sistemas percibidos positivamente por el 100% de los clientes, con planes conjuntos partner-cliente revisados periódicamente"]'::jsonb
where code='P 4.6';

update public.assessment_questions set
  block_es='Beneficio mutuo', question_es='Trabajo proactivo para el beneficio mutuo',
  context_es='Cuando partner y organización comparten objetivos y los logran juntos, surgen alianzas resilientes y casos de éxito replicables y reconocibles externamente.',
  evidence_es=E'• Metas compartidas formalizadas con los partners\n• KPIs de beneficio mutuo (ahorros compartidos, ingresos compartidos)\n• Sesiones periódicas de revisión de objetivos compartidos\n• Casos de éxito con resultados cuantificados\n• Planes de mejora conjuntos con responsables',
  levels_es='["No hay evidencia de que la organización fije objetivos con partners/proveedores para lograr el beneficio mutuo","Existen modelos de trabajo que fijan objetivos con partners/proveedores para lograr el beneficio mutuo","Modelos para el 40% de los partners/proveedores alineados con el propósito, la visión y la estrategia","Modelos para el 40% de los partners/proveedores, logrados en el 50% de los casos","Modelos para el 60% de los partners/proveedores, logrados en el 75% de los casos","Modelos para el 80% de los partners/proveedores, logrados en más del 85% de los casos, con revisión sistemática y planes de mejora conjuntos"]'::jsonb
where code='P 4.7';

update public.assessment_questions set
  block_es='Reconocimiento', question_es='Gestión del reconocimiento a partners y proveedores',
  context_es='Reconocer a los partners refuerza el vínculo, los convierte en embajadores y atrae nuevas alianzas estratégicas al ecosistema futuro de la organización.',
  evidence_es=E'• Programa de reconocimiento a partners (Partner del Año)\n• Encuestas de percepción del reconocimiento\n• Eventos anuales de reconocimiento\n• Comunicación pública de buenas prácticas\n• Indicadores de fidelidad y rotación de partners',
  levels_es='["No hay un plan definido para reconocer el trabajo de los partners y/o motivarlos","Existe un plan definido para reconocer el trabajo de los partners y/o motivarlos","Reconocimiento percibido positivamente por el 40%","Reconocimiento percibido positivamente por el 60%","Reconocimiento percibido positivamente por más del 80%","Reconocimiento percibido positivamente por el 100% de los partners, con eventos públicos de reconocimiento y comunicación externa de buenas prácticas"]'::jsonb
where code='P 4.8';

update public.assessment_questions set
  block_es='Colaboración', question_es='Colaboración en redes de aprendizaje',
  context_es='Colaborar en redes amplifica el aprendizaje, acelera la innovación y multiplica el impacto más allá de las capacidades individuales de cada organización.',
  evidence_es=E'• Proyectos colaborativos documentados con resultados\n• Pertenencia a asociaciones o clústeres sectoriales\n• Participación en proyectos europeos o de I+D conjunta\n• Publicaciones conjuntas con partners\n• Reconocimiento externo de la cultura colaborativa',
  levels_es='["No hay proyectos colaborativos que evidencien el intercambio de conocimiento, el aprendizaje y el feedback entre la organización y sus partners","Existen proyectos colaborativos que aseguran el intercambio de conocimiento, el aprendizaje y el feedback","Proyectos colaborativos que logran el 40% de los resultados","Proyectos colaborativos que logran el 60% de los resultados","Proyectos colaborativos que logran más del 80% de los resultados","La organización lidera o pertenece activamente a redes/asociaciones sectoriales con sus partners, con resultados publicables y reconocimiento externo de su cultura colaborativa"]'::jsonb
where code='P 4.9';

update public.assessment_questions set
  block_es='Mejora', question_es='Mejora de la propuesta de valor a los partners',
  context_es='Si no mides cómo perciben los partners el valor que reciben, la propuesta se erosiona sin que la organización lo note a tiempo.',
  evidence_es=E'• Cuadro de mando con indicadores de partners\n• Planes de mejora documentados por partner\n• Sesiones de revisión anual con los partners clave\n• Encuestas de satisfacción de partners con resultados de mejora\n• Indicadores de la evolución del valor generado conjuntamente',
  levels_es='["No hay indicadores para detectar oportunidades de mejora de la propuesta de valor a los partners","Los indicadores detectan esporádicamente oportunidades de mejora de la propuesta de valor","Indicadores y planes de mejora para al menos el 40% de los partners","Indicadores y planes de mejora para al menos el 60% de los partners","Indicadores y planes de mejora para al menos el 80% de los partners","Indicadores y planes de mejora para el 100% de los partners clave, con revisión anual y resultados medibles en satisfacción y valor generado"]'::jsonb
where code='P 4.10';

-- ------------------------- CRITERIO 5 · CLIENTES ----------------------------

update public.assessment_questions set
  block_es='Segmentación', question_es='Identificación de los tipos de cliente (segmentación)',
  context_es='Cada segmento de clientes tiene necesidades distintas. Segmentar permite ofrecer a cada uno propuestas de valor adecuadas y eficientes sin desperdiciar recursos.',
  evidence_es=E'• CRM con segmentación operativa\n• Documento formal de criterios de segmentación\n• Encuestas de percepción por segmento\n• Acciones de marketing y servicio diferenciadas por segmento\n• Resultados de ventas y satisfacción por segmento',
  levels_es='["No hay evidencia de segmentación de clientes ni de identificación de sus necesidades","Se identifican y segmentan los clientes actuales y potenciales según sus necesidades, para establecer acciones orientadas al cliente","Segmentación percibida positivamente por el 40% de los clientes","Segmentación percibida positivamente por el 60% de los clientes","Segmentación percibida positivamente por el 80% de los clientes","Segmentación percibida positivamente por el 100% de los clientes, con revisión anual y acciones por segmento que generan resultados medibles"]'::jsonb
where code='P 5.1';

update public.assessment_questions set
  block_es='Experiencia de cliente', question_es='Propuesta de valor y experiencia de cliente',
  context_es='La experiencia de cliente impulsa la fidelidad y la recomendación. Si no se mide, la organización gestiona a ciegas su relación más importante y crítica.',
  evidence_es=E'• Customer journey map por segmento\n• Indicadores NPS, CSAT, CES\n• Programa de Voz del Cliente (VoC)\n• Puntos de contacto documentados en preventa, venta y posventa\n• Planes de mejora basados en los datos de experiencia',
  levels_es='["No hay evidencia de que se identifique la experiencia de cliente","Evidencia de que la organización conoce la experiencia antes, durante y después de adquirir el producto/servicio, pero no se ha medido","Mediciones de la experiencia para el 40% de los clientes","Mediciones de la experiencia para el 60% de los clientes","Mediciones de la experiencia para el 80% de los clientes","Mediciones de la experiencia para el 100% de los clientes, con planes de mejora continua basados en los resultados (NPS, CSAT u otros indicadores de referencia del sector)"]'::jsonb
where code='P 5.2';

update public.assessment_questions set
  block_es='Experiencia de cliente', question_es='Gestión de las necesidades del cliente',
  context_es='Conocer las necesidades del cliente en cada etapa evita sorpresas y permite anticipar soluciones antes de que el cliente las pida explícitamente.',
  evidence_es=E'• Sistema CRM con histórico de interacciones\n• Procedimiento de gestión de reclamaciones y solicitudes\n• Indicadores de tiempos de respuesta y resolución\n• Casos de personalización documentados\n• Trazabilidad de las acciones por cliente',
  levels_es='["No hay evidencia de una relación con los clientes en cada etapa de creación de valor","Mediciones que identifican la relación con los clientes en cada etapa de la cadena de valor","Mediciones, actuando sobre las necesidades del 40% de los clientes","Mediciones, actuando sobre las necesidades del 60% de los clientes","Mediciones, actuando sobre las necesidades del 80% de los clientes","Mediciones, actuando sobre las necesidades del 100% de los clientes, con respuestas personalizadas y trazabilidad de las acciones"]'::jsonb
where code='P 5.3';

update public.assessment_questions set
  block_es='Comportamiento', question_es='Conocimiento del comportamiento del cliente',
  context_es='Entender por qué los clientes compran, se van o repiten permite anticipar tendencias y diseñar mejores experiencias en cada punto de contacto del viaje del cliente.',
  evidence_es=E'• Analítica de comportamiento (web, app, punto de venta)\n• Estudios de mercado y de comportamiento del consumidor\n• Modelos predictivos de abandono o compra\n• Personalización dinámica de la oferta\n• Casos donde la analítica anticipó necesidades',
  levels_es='["No hay evidencia de acciones o datos que identifiquen el comportamiento del cliente","Mediciones que muestran el conocimiento del comportamiento antes, durante y después de la propuesta de valor, para clientes actuales y potenciales","Mediciones percibidas para el 40% de los clientes","Mediciones percibidas para el 60% de los clientes","Mediciones percibidas para el 80% de los clientes","Mediciones para el 100% de los clientes, con analítica predictiva que anticipa necesidades y se traduce en propuestas de valor personalizadas"]'::jsonb
where code='P 5.4';

update public.assessment_questions set
  block_es='Comportamiento', question_es='Plan de toma de decisiones del cliente',
  context_es='Conocer qué factores influyen en la decisión (precio, calidad, marca, recomendación) permite invertir en lo que de verdad convierte y fideliza al cliente final.',
  evidence_es=E'• Estudios cualitativos (focus groups, entrevistas en profundidad)\n• Mapas de factores de decisión por segmento\n• Resultados de tests A/B\n• Documentación del proceso de diseño basado en insights\n• Decisiones estratégicas vinculadas a los factores del cliente',
  levels_es='["No hay evidencia de la identificación de los factores que intervienen en la toma de decisiones del cliente","Se identifican los factores que intervienen en la toma de decisiones del cliente","Factores identificados, percibidos positivamente al 40% en la organización","Factores identificados, percibidos positivamente al 60% en la organización","Factores identificados, percibidos positivamente en más del 80% de la organización","Factores identificados, percibidos positivamente por el 100% de la organización, integrados en el sistema de decisiones estratégicas y de diseño de la propuesta de valor"]'::jsonb
where code='P 5.5';

update public.assessment_questions set
  block_es='Relación', question_es='Relación con el cliente (aprendizaje y orientación)',
  context_es='Acompañar al cliente con formación y orientación maximiza el valor que extrae del producto/servicio, y la fidelidad y rentabilidad resultantes a largo plazo.',
  evidence_es=E'• Programas de onboarding y formación de clientes\n• Recursos de aprendizaje (academia, webinars, materiales)\n• Indicadores de adopción y uso por cliente\n• Encuestas de satisfacción con la orientación\n• Tasa de fidelidad y crecimiento por cliente formado',
  levels_es='["No hay evidencia de gestión de la orientación","Existen proyectos personalizados de aprendizaje y orientación para los clientes según sus necesidades y expectativas","Proyectos personalizados para el 50% de los clientes, percibidos positivamente en el 80% de los casos","Proyectos personalizados para el 75% de los clientes, percibidos positivamente en el 50% de los casos","Proyectos personalizados para el 75% de los clientes, percibidos positivamente en el 80% de los casos","Proyectos personalizados para el 100% de los clientes clave, percibidos positivamente en más del 85% de los casos, con resultados medibles en fidelidad y crecimiento"]'::jsonb
where code='P 5.6';

update public.assessment_questions set
  block_es='Comunicación', question_es='Comunicación y contacto directo con los clientes',
  context_es='Los canales de comunicación son la cara visible de la organización. Su eficacia moldea la percepción y la satisfacción del cliente final en cada interacción.',
  evidence_es=E'• Inventario de canales (web, app, redes, teléfono, presencial)\n• Estrategia omnicanal documentada\n• SLAs de tiempos de respuesta por canal\n• Indicadores de uso y satisfacción por canal\n• Histórico de mejoras de respuesta y resolución',
  levels_es='["No hay evidencia de que la organización se comunique con los clientes","Existen canales de comunicación para los clientes","Canales de comunicación con impacto positivo en los objetivos, que llegan al 40% de los clientes","Canales con impacto positivo para el 60% de los clientes","Canales con impacto positivo para el 80% de los clientes","Comunicación omnicanal con impacto positivo para el 100% de los clientes, con tiempos de respuesta medidos y mejorados sistemáticamente"]'::jsonb
where code='P 5.7';

update public.assessment_questions set
  block_es='Percepción', question_es='Percepción de la propuesta de valor y la experiencia',
  context_es='Lo que importa no es lo que ofreces sino lo que el cliente percibe. Sin medición, propuesta y realidad pueden divergir peligrosamente sin avisar.',
  evidence_es=E'• Encuestas de percepción de la propuesta de valor\n• Indicadores de NPS y recomendación espontánea\n• Casos / testimonios de clientes\n• Benchmark de NPS del sector\n• Resultados del programa de referidos',
  levels_es='["No hay evidencia de que las propuestas de valor al cliente se revisen y analicen","Las propuestas de valor orientadas al cliente se revisan esporádicamente","Propuesta de valor desplegada y el 40% de los clientes la percibe positivamente","Propuesta de valor desplegada y el 60% de los clientes la percibe positivamente","Propuesta de valor desplegada y más del 80% la percibe positivamente","Propuesta de valor desplegada y el 100% de los clientes clave la percibe positivamente, generando recomendación espontánea (NPS sobresaliente)"]'::jsonb
where code='P 5.8';

update public.assessment_questions set
  block_es='Reputación', question_es='Imagen y reputación percibidas por los clientes',
  context_es='Los clientes también evalúan el impacto social y ambiental. La reputación es un activo cada vez más decisivo en su decisión de comprar y de quedarse.',
  evidence_es=E'• Proyectos sociales/ambientales con participación de clientes\n• Informe de impacto\n• Encuestas de percepción del impacto\n• Reconocimientos externos del sector\n• Comunicación pública de los resultados',
  levels_es='["No hay proyectos con participación de clientes y con impacto social y ambiental positivo","Existen proyectos con participación de clientes e impacto social y ambiental positivo","Proyectos percibidos positivamente por al menos el 40% del ecosistema","Proyectos percibidos positivamente por al menos el 60% del ecosistema","Proyectos percibidos positivamente por al menos el 80% del ecosistema","Proyectos percibidos positivamente por el 100% del ecosistema, con reconocimiento externo y comunicación pública del impacto generado"]'::jsonb
where code='P 5.9';

update public.assessment_questions set
  block_es='Mejora', question_es='Mejora de la propuesta de valor y la experiencia de cliente',
  context_es='La propuesta de valor no es estática. Medir y mejorar continuamente sostiene la competitividad en un mercado siempre cambiante y cada vez más exigente.',
  evidence_es=E'• Cuadro de mando de clientes con indicadores y umbrales\n• Procedimiento de gestión de mejoras\n• Planes de mejora por segmento o cliente clave\n• Sistema de mejora continua (PDCA, Kaizen)\n• Resultados anuales de la evolución de la propuesta de valor',
  levels_es='["No hay indicadores para detectar oportunidades de mejora de la propuesta de valor","Los indicadores detectan esporádicamente oportunidades de mejora","Indicadores y planes de mejora para el 40% de los clientes","Indicadores y planes de mejora para el 60% de los clientes","Indicadores y planes de mejora para más del 80% de los clientes","Indicadores y planes de mejora para el 100% de los clientes clave, con un ciclo de mejora continua integrado en el sistema de gestión"]'::jsonb
where code='P 5.10';

-- Verificación
select criterion_code, count(*) filter (where question_es is not null) as con_es, count(*) as total
from public.assessment_questions group by 1 order by 1;
