export const aletheiaEs = {
  meta: {
    description:
      'ALETHEIA: caso de evidencia sobre análisis de datos públicos argentinos — validación de comparabilidad, cambios metodológicos y límites de evidencia antes del análisis. Data Analysis · Business Intelligence.',
  },
  hero: {
    eyebrow: 'EVIDENCE CASE · ALETHEIA',
    title: 'Qué datos públicos se pueden comparar',
    lede:
      'ALETHEIA evalúa comparabilidad, cambios metodológicos y límites de evidencia en fuentes públicas argentinas antes del análisis.',
    thesisLine1: 'El problema no era conseguir más datos.',
    thesisLine2: 'Era saber cuáles podían compararse realmente.',
  },
  snapshot: {
    aria: 'Resumen de evidencia',
    tests: 'Tests',
    freeze: 'Freeze',
    commit: 'Commit',
    provenance: 'Provenance',
  },
  neutralFraming:
    'Este proyecto no evalúa si una cifra oficial es correcta o no. Evalúa bajo qué condiciones dos series pueden compararse entre sí.',
  actions: {
    aria: 'Acciones del caso',
    backToDataBi: 'Data & BI',
    github: 'GitHub',
    technicalDetails: 'Detalles técnicos',
    viewRuling: 'Ver ruling',
    fullResearch: 'Full research',
  },
  tocAria: 'Índice del caso',
  stagePrefix: 'Bloque {number}',
  pipeline: {
    raw: { public: 'DATOS', technical: 'RAW' },
    provenance: { public: 'ORIGEN', technical: 'Provenance' },
    objects: { public: 'QUÉ REPRESENTAN', technical: 'Statistical Objects' },
    breaks: { public: 'CAMBIOS', technical: 'Breaks' },
    compatibility: { public: 'COMPATIBILIDAD', technical: 'Compatibility' },
    evidence: { public: 'EVIDENCIA', technical: 'Evidence' },
    rulings: { public: 'DECISIÓN', technical: 'Rulings' },
  },
  stages: {
    problem: {
      title: 'El problema',
      fast: 'Datasets similares no necesariamente miden lo mismo.',
      intro:
        'ALETHEIA trabaja con fuentes públicas argentinas. Antes de combinar datos hay que verificar qué representan, cómo se construyeron y qué cambios metodológicos atravesaron.',
    },
    method: {
      title: 'Cómo decide qué se puede comparar',
      fast: 'Un flujo de validación — de dato a decisión.',
      copy: 'Antes de usar un dato, ALETHEIA exige justificar qué representa y con qué puede compararse.',
      pipelineAria: 'Flujo de validación de comparabilidad',
      techSummary: 'Technical terminology',
    },
    cases: {
      title: 'Casos seleccionados',
      fast: 'Tres ejemplos: precios, IPC y EPH.',
    },
    refusals: {
      title: 'Lo que se niega a hacer',
      fast: 'También registra cuándo un análisis no debería hacerse.',
      copy: 'ALETHEIA no sólo decide qué análisis puede hacerse. También registra cuándo no debería hacerse.',
    },
    support: {
      title: 'Qué sostiene la evidencia',
      fast: 'Cuatro niveles de soporte.',
      copy: 'Cada claim queda clasificado según la fuerza de la evidencia disponible.',
    },
    verification: {
      title: 'Verificación',
      fast: 'Para quien quiera auditar el trabajo.',
      copy: 'Artefactos seleccionados de la capa pública. La research foundation completa vive fuera de esta página.',
    },
  },
  cases: {
    gov002: {
      headline: 'Tener “precios” en dos datasets no significa que puedan combinarse',
      context:
        'Una fuente registra combustibles en estaciones de servicio. Otra, productos en puntos de venta. Ambas contienen precios, pero representan universos distintos.',
      visualAria: 'Comparación de dos universos de precio',
      sideA: { product: 'COMBUSTIBLE', place: 'Estación de servicio' },
      sideB: { product: 'PRODUCTO DE CONSUMO', place: 'Punto de venta' },
      neq: 'PRECIO ≠ PRECIO',
      compare: {
        products: { label: 'PRODUCTOS', a: 'combustibles', b: 'consumo masivo' },
        establishment: { label: 'ESTABLECIMIENTO', a: 'estación', b: 'punto de venta' },
        capture: { label: 'CAPTURA', a: 'precio informado', b: 'precio vigente informado' },
        universe: { label: 'UNIVERSO', a: 'fuente A', b: 'fuente B' },
      },
      result: 'DESCRIPTIVE ONLY',
      conclusion:
        'Promediarlas era técnicamente fácil. Ese promedio no habría tenido un significado defendible.',
      techSummary: 'Ver decisión técnica',
      techLines: [
        'ESTABLISHMENT + PRICE_QUOTE',
        'PRICE_QUOTE != PRICE_INDEX',
        'ENERGIA × SEPA = DESCRIPTIVE_ONLY',
      ],
    },
    ipc: {
      headline: 'Una serie larga no necesariamente es una serie homogénea',
      conclusion:
        'Hay ventanas comparables y rupturas que impiden unir períodos automáticamente sin evidencia suficiente.',
      timelineRef: 'Los breaks documentados de IPC aparecen en la línea de tiempo de rupturas estadísticas.',
      techSummary: 'Ver decisión técnica',
      techNote: 'NO AUTOMATIC SPLICE — no hay splice automático sin evidencia suficiente.',
    },
    eph: {
      headline:
        'Un cambio en cómo se mide una población puede cambiar lo que significa comparar dos períodos',
      conclusion:
        'Cuando cambia la medición, comparar “antes” y “después” ya no es automáticamente el mismo ejercicio.',
      visualAria: 'Antes, cambio metodológico y después',
      before: 'ANTES',
      change: 'CAMBIO METODOLÓGICO',
      after: 'DESPUÉS',
      whatChanged: 'Qué puede cambiar',
      whyAffects: 'Por qué afecta la comparabilidad',
      whyBody:
        'Si cambian cuestionario, cobertura, clasificación, mecanismo de medición o universo, dos períodos pueden dejar de medir lo mismo — aunque el nombre de la serie no cambie.',
      dimensions: {
        questionnaire: 'Cuestionario',
        coverage: 'Cobertura',
        classification: 'Clasificación',
        measurement: 'Medición',
        population: 'Universo / población',
      },
      timelineRef: 'Los breaks documentados de EPH aparecen en la línea de tiempo de rupturas estadísticas.',
      techSummary: 'Ver decisión técnica',
      techNote:
        'Los breaks no se tratan como una sola categoría. Cada cambio se evalúa según su evidencia.',
    },
  },
  refusals: {
    directPooling: 'NO UNIR FUENTES DIRECTAMENTE',
    automaticSplice: 'NO UNIR SERIES AUTOMÁTICAMENTE',
    alternativeCpi: 'NO CONSTRUIR UN IPC ALTERNATIVO',
    claimWithoutEvidence: 'NO AFIRMAR SIN EVIDENCIA',
    representativeClaim: 'NO CLAIM DE REPRESENTATIVIDAD SIN SOPORTE',
  },
  taxonomy: {
    SUPPORTED: {
      label: 'SUPPORTED',
      desc: 'Evidencia suficiente bajo las condiciones declaradas.',
    },
    PARTIALLY_SUPPORTED: {
      label: 'PARTIALLY SUPPORTED',
      desc: 'Evidencia parcial; el claim cabe solo con límites explícitos.',
    },
    ACCEPTED_LIMITATION: {
      label: 'ACCEPTED LIMITATION',
      desc: 'Limitación aceptada y documentada.',
    },
    OUT_OF_SCOPE: {
      label: 'OUT OF SCOPE',
      desc: 'Pregunta deliberadamente no resuelta aquí.',
    },
  },
  findings: {
    aria: 'Findings seleccionados',
    claim: 'Claim',
    status: 'Status',
    why: 'Why',
  },
  verification: {
    freezeDate: 'Freeze',
    commitSha: 'Commit',
    testCount: 'Tests',
    provenance: 'Provenance',
    ctaAria: 'Verificación y research',
    techIntro:
      'Resumen técnico rápido de la capa de publicación. No reemplaza Full Research.',
    techFlow: 'Flujo de validación',
    techProvenance: 'Base de provenance',
    techArtifacts: 'Artefactos usados en visualizaciones',
    techAudit: 'Reglas de auditabilidad',
    techFrozen: 'Referencia congelada (GOV-002)',
  },
  charts: {
    provenanceSummary: 'Origen de la evidencia',
    evidenceBasisPrefix: 'Base de evidencia',
    coverage: {
      title: 'Cobertura temporal de fuentes',
      lede: 'Fuentes públicas auditadas con ventanas documentadas distintas.',
      basis: 'Source Manifest',
      aria: 'Mapa de cobertura temporal de fuentes ALETHEIA',
      openEnded: 'abierto',
      note: 'Sólo fuentes con coverage_period.start documentado. Las barras abiertas llegan al eje de visualización sin afirmar esa fecha como fin de cobertura.',
    },
    breaks: {
      title: 'Rupturas estadísticas — IPC y EPH',
      lede: 'Breaks reales del Statistical Break Registry. Sin splice automático entre períodos.',
      basis: 'Statistical Break Registry',
      aria: 'Línea de tiempo de breaks IPC y EPH',
      typeUnset: 'tipo no fijado en registro',
    },
    compat: {
      title: 'Matriz de compatibilidad',
      lede: 'Relaciones canónicas entre objetos estadísticos — sin inventar celdas.',
      basis: 'Metric Compatibility Matrix',
      aria: 'Tabla de compatibilidad entre objetos estadísticos',
      colA: 'Objeto A',
      colB: 'Objeto B',
      colStatus: 'Estado',
      viewFull: 'Ver matriz técnica completa',
      hideFull: 'Ver selección',
      status: {
        FORBIDDEN: 'No permitido',
        ALLOWED_WITH_CONDITIONS: 'Compatible con condiciones',
        DESCRIPTIVE_ONLY: 'Sólo descriptivo',
      },
    },
    outcomes: {
      title: 'Disposiciones de evidencia',
      aria: 'Conteo de disposiciones finales',
    },
  },
  rulingModal: {
    close: 'Cerrar',
    decision: 'Decisión',
    why: 'Por qué',
    restrictions: 'Restricciones',
    provenance: 'Referencia',
    gov002: {
      title: 'Compatibilidad de cotizaciones de precio',
      decision:
        'ENERGIA y SEPA pueden describirse lado a lado, pero no se combinan como un nivel de precios común.',
      why: 'Ambas fuentes contienen “precios”, pero representan establecimientos, productos y universos distintos. Un promedio sería fácil de calcular y no tendría significado defendible.',
    },
  },
  research: {
    title: 'Full Research — ALETHEIA',
    lede: 'Vista interna de artefactos de publicación seleccionados. No es un documento crudo.',
    navAria: 'Navegación de research',
    back: 'Volver a ALETHEIA',
    overview: 'Overview',
    overviewBody:
      'ALETHEIA valida comparabilidad, cambios metodológicos y límites de evidencia en fuentes públicas argentinas antes del análisis.',
    rulings: 'Selected rulings',
    ephLine: 'Los breaks se evalúan por evidencia; no como una sola clase equivalente.',
    breaks: 'Breaks',
    compatibility: 'Compatibility',
    limitations: 'Limitations',
    verification: 'Verification',
    verificationBody: 'Cobertura documentada y trazas de publicación seleccionadas.',
    artifacts: 'Artifacts',
    artifactsNote:
      'Los artefactos canónicos viven en el repositorio ALETHEIA. Esta vista no abre .md/.json crudos.',
  },
}

export const aletheiaEn = {
  meta: {
    description:
      'ALETHEIA: evidence case on Argentine public data analysis — validating comparability, methodological changes and evidence boundaries before analysis. Data Analysis · Business Intelligence.',
  },
  hero: {
    eyebrow: 'EVIDENCE CASE · ALETHEIA',
    title: 'Which public datasets can actually be compared',
    lede:
      'ALETHEIA assesses comparability, methodological changes and evidence boundaries in Argentine public sources before analysis.',
    thesisLine1: 'The problem wasn’t getting more data.',
    thesisLine2: 'It was knowing which datasets could actually be compared.',
  },
  snapshot: {
    aria: 'Evidence snapshot',
    tests: 'Tests',
    freeze: 'Freeze',
    commit: 'Commit',
    provenance: 'Provenance',
  },
  neutralFraming:
    'This project does not evaluate whether an official figure is correct. It evaluates under what conditions two series can be compared with each other.',
  actions: {
    aria: 'Case actions',
    backToDataBi: 'Data & BI',
    github: 'GitHub',
    technicalDetails: 'Technical details',
    viewRuling: 'View ruling',
    fullResearch: 'Full research',
  },
  tocAria: 'Case outline',
  stagePrefix: 'Block {number}',
  pipeline: {
    raw: { public: 'DATA', technical: 'RAW' },
    provenance: { public: 'ORIGIN', technical: 'Provenance' },
    objects: { public: 'WHAT IT REPRESENTS', technical: 'Statistical Objects' },
    breaks: { public: 'CHANGES', technical: 'Breaks' },
    compatibility: { public: 'COMPATIBILITY', technical: 'Compatibility' },
    evidence: { public: 'EVIDENCE', technical: 'Evidence' },
    rulings: { public: 'DECISION', technical: 'Rulings' },
  },
  stages: {
    problem: {
      title: 'The problem',
      fast: 'Similar datasets do not necessarily measure the same thing.',
      intro:
        'ALETHEIA works with Argentine public sources. Before combining data, you have to check what they represent, how they were built, and which methodological changes they went through.',
    },
    method: {
      title: 'How it decides what can be compared',
      fast: 'One validation flow — from data to decision.',
      copy: 'Before using a datapoint, ALETHEIA requires a justification of what it represents and what it can be compared with.',
      pipelineAria: 'Comparability validation flow',
      techSummary: 'Technical terminology',
    },
    cases: {
      title: 'Selected cases',
      fast: 'Three examples: prices, CPI/IPC, and EPH.',
    },
    refusals: {
      title: 'What it refuses to do',
      fast: 'It also records when an analysis should not be done.',
      copy: 'ALETHEIA does not only decide which analyses can be done. It also records when one should not be done.',
    },
    support: {
      title: 'What the evidence supports',
      fast: 'Four support levels.',
      copy: 'Each claim is classified by the strength of the available evidence.',
    },
    verification: {
      title: 'Verification',
      fast: 'For anyone who wants to audit the work.',
      copy: 'Selected artifacts from the public layer. The full research foundation lives outside this page.',
    },
  },
  cases: {
    gov002: {
      headline: 'Having “prices” in two datasets does not mean they can be combined',
      context:
        'One source records fuel prices at service stations. The other records product prices at points of sale. Both contain prices, but they represent different universes.',
      visualAria: 'Comparison of two price universes',
      sideA: { product: 'FUEL', place: 'Service station' },
      sideB: { product: 'CONSUMER PRODUCT', place: 'Point of sale' },
      neq: 'PRICE ≠ PRICE',
      compare: {
        products: { label: 'PRODUCTS', a: 'fuels', b: 'mass consumption' },
        establishment: { label: 'ESTABLISHMENT', a: 'station', b: 'point of sale' },
        capture: { label: 'CAPTURE', a: 'reported price', b: 'reported current price' },
        universe: { label: 'UNIVERSE', a: 'source A', b: 'source B' },
      },
      result: 'DESCRIPTIVE ONLY',
      conclusion:
        'Averaging them was technically easy. That average would not have had a defensible meaning.',
      techSummary: 'View technical decision',
      techLines: [
        'ESTABLISHMENT + PRICE_QUOTE',
        'PRICE_QUOTE != PRICE_INDEX',
        'ENERGIA × SEPA = DESCRIPTIVE_ONLY',
      ],
    },
    ipc: {
      headline: 'A long series is not necessarily a homogeneous series',
      conclusion:
        'There are comparable windows and breaks that prevent joining periods automatically without sufficient evidence.',
      timelineRef: 'Documented IPC breaks appear in the statistical break timeline.',
      techSummary: 'View technical decision',
      techNote: 'NO AUTOMATIC SPLICE — no automatic splice without sufficient evidence.',
    },
    eph: {
      headline:
        'A change in how a population is measured can change what it means to compare two periods',
      conclusion:
        'When measurement changes, comparing “before” and “after” is no longer automatically the same exercise.',
      visualAria: 'Before, methodological change, and after',
      before: 'BEFORE',
      change: 'METHODOLOGICAL CHANGE',
      after: 'AFTER',
      whatChanged: 'What can change',
      whyAffects: 'Why it affects comparability',
      whyBody:
        'If questionnaire, coverage, classification, measurement mechanism, or universe changes, two periods may stop measuring the same thing — even if the series name stays the same.',
      dimensions: {
        questionnaire: 'Questionnaire',
        coverage: 'Coverage',
        classification: 'Classification',
        measurement: 'Measurement',
        population: 'Universe / population',
      },
      timelineRef: 'Documented EPH breaks appear in the statistical break timeline.',
      techSummary: 'View technical decision',
      techNote:
        'Breaks are not treated as a single category. Each change is evaluated according to its evidence.',
    },
  },
  refusals: {
    directPooling: 'NO DIRECT SOURCE POOLING',
    automaticSplice: 'NO AUTOMATIC SERIES SPLICE',
    alternativeCpi: 'NO ALTERNATIVE CPI',
    claimWithoutEvidence: 'NO CLAIM WITHOUT EVIDENCE',
    representativeClaim: 'NO REPRESENTATIVE CLAIM WITHOUT SUPPORT',
  },
  taxonomy: {
    SUPPORTED: {
      label: 'SUPPORTED',
      desc: 'Sufficient evidence under the stated conditions.',
    },
    PARTIALLY_SUPPORTED: {
      label: 'PARTIALLY SUPPORTED',
      desc: 'Partial evidence; the claim holds only with explicit limits.',
    },
    ACCEPTED_LIMITATION: {
      label: 'ACCEPTED LIMITATION',
      desc: 'Accepted, documented limitation.',
    },
    OUT_OF_SCOPE: {
      label: 'OUT OF SCOPE',
      desc: 'Question deliberately left unresolved here.',
    },
  },
  findings: {
    aria: 'Selected findings',
    claim: 'Claim',
    status: 'Status',
    why: 'Why',
  },
  verification: {
    freezeDate: 'Freeze',
    commitSha: 'Commit',
    testCount: 'Tests',
    provenance: 'Provenance',
    ctaAria: 'Verification and research',
    techIntro:
      'Quick technical summary of the publication layer. It does not replace Full Research.',
    techFlow: 'Validation flow',
    techProvenance: 'Provenance basis',
    techArtifacts: 'Artifacts used in visualizations',
    techAudit: 'Auditability rules',
    techFrozen: 'Frozen reference (GOV-002)',
  },
  charts: {
    provenanceSummary: 'Evidence provenance',
    evidenceBasisPrefix: 'Evidence basis',
    coverage: {
      title: 'Source temporal coverage',
      lede: 'Audited public sources with distinct documented windows.',
      basis: 'Source Manifest',
      aria: 'ALETHEIA source temporal coverage map',
      openEnded: 'open',
      note: 'Only sources with a documented coverage_period.start. Open-ended bars reach the display axis without claiming that year as a coverage end.',
    },
    breaks: {
      title: 'Statistical breaks — IPC and EPH',
      lede: 'Real breaks from the Statistical Break Registry. No automatic splice across periods.',
      basis: 'Statistical Break Registry',
      aria: 'IPC and EPH break timeline',
      typeUnset: 'type unset in registry',
    },
    compat: {
      title: 'Compatibility matrix',
      lede: 'Canonical relations between statistical objects — no invented cells.',
      basis: 'Metric Compatibility Matrix',
      aria: 'Statistical-object compatibility table',
      colA: 'Object A',
      colB: 'Object B',
      colStatus: 'Status',
      viewFull: 'View full technical matrix',
      hideFull: 'Show selection',
      status: {
        FORBIDDEN: 'Not permitted',
        ALLOWED_WITH_CONDITIONS: 'Compatible with conditions',
        DESCRIPTIVE_ONLY: 'Descriptive only',
      },
    },
    outcomes: {
      title: 'Evidence dispositions',
      aria: 'Final disposition counts',
    },
  },
  rulingModal: {
    close: 'Close',
    decision: 'Decision',
    why: 'Why',
    restrictions: 'Restrictions',
    provenance: 'Reference',
    gov002: {
      title: 'Price quote compatibility',
      decision:
        'ENERGIA and SEPA can be described side by side, but they are not combined into a common price level.',
      why: 'Both sources contain “prices”, but they represent different establishments, products, and universes. An average would be easy to compute and would not have a defensible meaning.',
    },
  },
  research: {
    title: 'Full Research — ALETHEIA',
    lede: 'Internal view of selected publication artifacts. Not a raw document.',
    navAria: 'Research navigation',
    back: 'Back to ALETHEIA',
    overview: 'Overview',
    overviewBody:
      'ALETHEIA validates comparability, methodological changes and evidence boundaries in Argentine public sources before analysis.',
    rulings: 'Selected rulings',
    ephLine: 'Breaks are evaluated by evidence — not as one equivalent class.',
    breaks: 'Breaks',
    compatibility: 'Compatibility',
    limitations: 'Limitations',
    verification: 'Verification',
    verificationBody: 'Documented coverage and selected publication traces.',
    artifacts: 'Artifacts',
    artifactsNote:
      'Canonical artifacts live in the ALETHEIA repository. This view does not open raw .md/.json files.',
  },
}
