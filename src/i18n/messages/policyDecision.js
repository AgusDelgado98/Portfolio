export const policyDecisionEs = {
  hero: {
    badge: 'Casework · Caso 05',
    caseLine: 'Policy & Decision Intelligence · PROVIDENTIA',
    status: 'PDI-7 APTO · Power BI Desktop: PENDIENTE',
    kicker: 'Cómo construyo · registro de decisiones',
    title: 'Inteligencia de Decisión de Políticas',
    lede: 'Un registro curado de la extensión PDI de PROVIDENTIA: cómo interactúan modelo, política de capacidad y escenario de costo relativo cuando la política se evalúa como una decisión, no solo como precisión de forecast.',
  },
  boundaryNote: 'Case 05 empieza donde terminan Case 03 y Case 04: toma el lockbox P7 ya congelado (B198_FINAL_LOCKBOX_V1, SCORED) y la política incumbente ETS × PI90 como dato de entrada. No repite selección de modelo ni reabre la narrativa de PI90 — evalúa un grid de sensibilidad pre-registrado sobre esa base.',
  actions: {
    aria: 'Acciones del caso',
    backToAtlas: 'Volver al inicio',
    backToCasework: 'Volver a Casework',
    viewCase03: 'Ver Case 03 · Forecasting',
    viewCase04: 'Ver Case 04 · Capacity Decision',
    viewRepo: 'Ver repositorio',
    backToTop: 'Volver arriba',
  },
  artifacts: {
    label: 'Evidencia del caso',
    note: 'Fuente exclusiva: PDI-4 (evaluación empírica) · Estado de proyecto: PDI-7',
    items: {
      claims: { name: 'Claims Contract (.md)', meta: 'Contrato de reclamos permitidos/prohibidos, verbatim' },
      readme: { name: 'Metodología / README', meta: 'Narrativa, arquitectura PDI y límite del caso' },
      manifest: { name: 'Portfolio Manifest (.json)', meta: 'Hashes de las fuentes PDI-4/5/6 citadas' },
    },
  },
  tocAria: 'Índice de etapas',
  pathFast: 'Ruta rápida:',
  pathFastBody: 'títulos, hallazgos permitidos, tablas.',
  pathTech: 'Ruta técnica:',
  pathTechBody: 'notas metodológicas expandibles bajo cada etapa.',
  stagePrefix: 'Etapa {number}',
  stages: {
    decisionProblem: {
      title: 'Qué pregunta queda después de Forecasting + Capacity',
      fast: 'Case 03 cerró el forecast. Case 04 fijó una política de referencia (PI90). PDI pregunta cómo interactúan modelo × política × costo relativo cuando la política se puntúa como decisión.',
      p1: 'Un ranking de precisión predictiva (WAPE) no necesariamente coincide con un ranking de pérdida de decisión — dos modelos pueden pronosticar de forma distinta y aun así producir la misma capacidad recomendada, o al revés.',
      p2: 'PDI no reabre el lockbox ni reentrena modelos: reutiliza el mismo lockbox P7 (SCORED, irreversible) y evalúa un grid de sensibilidad pre-registrado sobre esas series ya congeladas.',
    },
    analyticalDesign: {
      title: 'Diseño analítico',
      fast: 'Capa SQL (SQLite, derivada) → Motor de Decisión en Python (sin fuga hacia la generación de capacidad) → evaluación empírica con bootstrap pareado.',
      architecture: 'PDI-2R reconstruye una capa analítica SQLite desde los ledgers Parquet ya congelados de P7 — derivada, nunca fuente de verdad. PDI-3 es un motor de decisión en Python que genera capacidad sin observar la demanda real. PDI-4 evalúa el grid completo MODELO × POLÍTICA × COSTO con bootstrap pareado pre-registrado sobre contrastes fijados de antemano.',
    },
    evaluationGrid: {
      title: 'Grid de evaluación',
      fast: '210 celdas puntuadas · evaluación retrospectiva sobre el lockbox ya cerrado · sensitivity-grid-only, sin selección posterior de política óptima.',
    },
    predictiveVsDecision: {
      title: 'Ranking predictivo vs. ranking de decisión',
      fast: 'SARIMA lidera precisión predictiva (micro-WAPE). Bajo C10, ETS tiene la menor pérdida de decisión estimada. Los dos rankings no coinciden — precisión ≠ decisión.',
    },
    bootstrap: {
      title: 'Contrastes por bootstrap pareado (pre-registrados)',
      fast: 'ETS vs SARIMA y ETS vs LightGBM no se distinguen claramente bajo C10 (el intervalo de confianza cruza cero) — la ventaja de ETS en el punto no implica superioridad estadística confirmada.',
    },
    policyComparison: {
      title: 'Política de punto vs. PI90 incumbente (solo bajo C10)',
      fast: 'Bajo el escenario simétrico C10, la política de punto (sin buffer) tiene menor pérdida mediana que la PI90 incumbente — porque PI90 reserva más buffer y ese buffer pesa como sobre-capacidad cuando el costo es 1:1.',
    },
    powerBi: {
      title: 'Power BI',
      fast: 'Paquete de implementación completo (datos, modelo semántico, DAX, especificación de páginas). El ensamblaje y la validación en Power BI Desktop siguen PENDIENTES — no existe un .pbix validado.',
    },
    outcome: {
      title: 'Interpretación operacional, evidencia y límites',
      fast: 'Ninguna política es declarada óptima. El hallazgo bajo C10 no se generaliza a escenarios asimétricos (C20/C50/C100), que deben nombrarse explícitamente si se citan.',
      synthesis: 'PDI no reemplaza la política incumbente PI90 ni declara un ganador global: documenta, bajo un escenario de costo nombrado, cuándo una política de punto se comporta mejor que la de referencia — y deja explícito que esa conclusión no se extiende sin nombrar el escenario.',
    },
  },
  labels: {
    role: {
      primary: 'Primario',
      sensitivity: 'Sensibilidad',
    },
    microWape: 'micro-WAPE',
    medianNormLoss: 'Pérdida normalizada mediana',
    iqr: 'IQR',
    verdict: 'Veredicto',
    reproducibility: 'Reproducibilidad',
    globalTestSuite: 'Suite de tests global',
    reconciliationChecks: 'Chequeos de reconciliación',
  },
}

export const policyDecisionEn = {
  hero: {
    badge: 'Casework · Case 05',
    caseLine: 'Policy & Decision Intelligence · PROVIDENTIA',
    status: 'PDI-7 APTO · Power BI Desktop: PENDING',
    kicker: 'How I build · a record of decisions',
    title: 'Policy & Decision Intelligence',
    lede: 'A curated record of PROVIDENTIA\'s PDI extension: how model, capacity policy, and relative cost scenario interact when the policy is evaluated as a decision, not only as forecast accuracy.',
  },
  boundaryNote: 'Case 05 starts where Case 03 and Case 04 end: it takes the already-frozen P7 lockbox (B198_FINAL_LOCKBOX_V1, SCORED) and the incumbent ETS × PI90 policy as a given input. It does not repeat model selection or reopen the PI90 narrative — it evaluates a pre-registered sensitivity grid on top of that frozen base.',
  actions: {
    aria: 'Case actions',
    backToAtlas: 'Back to home',
    backToCasework: 'Back to Casework',
    viewCase03: 'View Case 03 · Forecasting',
    viewCase04: 'View Case 04 · Capacity Decision',
    viewRepo: 'View repository',
    backToTop: 'Back to top',
  },
  artifacts: {
    label: 'Case artifacts',
    note: 'Exclusive source: PDI-4 (empirical evaluation) · Project status: PDI-7',
    items: {
      claims: { name: 'Claims Contract (.md)', meta: 'Allowed/forbidden claims contract, reproduced verbatim' },
      readme: { name: 'Methodology / README', meta: 'Narrative, PDI architecture and case boundary' },
      manifest: { name: 'Portfolio Manifest (.json)', meta: 'Hashes of the cited PDI-4/5/6 sources' },
    },
  },
  tocAria: 'Stage index',
  pathFast: 'Fast path:',
  pathFastBody: 'titles, allowed findings, tables.',
  pathTech: 'Technical path:',
  pathTechBody: 'expandable methodology notes under each stage.',
  stagePrefix: 'Stage {number}',
  stages: {
    decisionProblem: {
      title: 'What question is left after Forecasting + Capacity',
      fast: 'Case 03 closed the forecast. Case 04 fixed a reference policy (PI90). PDI asks how model × policy × relative cost interact when the policy is scored as a decision.',
      p1: 'A predictive-accuracy ranking (WAPE) does not necessarily match a decision-loss ranking — two models can forecast differently and still recommend the same capacity, or vice versa.',
      p2: 'PDI does not reopen the lockbox or retrain models: it reuses the same P7 lockbox (SCORED, irreversible) and evaluates a pre-registered sensitivity grid over those already-frozen series.',
    },
    analyticalDesign: {
      title: 'Analytical design',
      fast: 'SQL layer (SQLite, derived) → Python Decision Engine (no leakage into capacity generation) → empirical evaluation with paired bootstrap.',
      architecture: 'PDI-2R rebuilds a SQLite analytical layer from P7\'s already-frozen Parquet ledgers — derived, never the source of truth. PDI-3 is a Python decision engine that generates capacity without observing real demand. PDI-4 evaluates the full MODEL × POLICY × COST grid with pre-registered paired bootstrap on contrasts fixed in advance.',
    },
    evaluationGrid: {
      title: 'Evaluation grid',
      fast: '210 scored cells · retrospective evaluation on the already-closed lockbox · sensitivity-grid-only, no post-hoc optimal-policy selection.',
    },
    predictiveVsDecision: {
      title: 'Predictive ranking vs. decision ranking',
      fast: 'SARIMA leads predictive accuracy (micro-WAPE). Under C10, ETS has the lowest estimated decision loss. The two rankings do not match — accuracy ≠ decision.',
    },
    bootstrap: {
      title: 'Paired bootstrap contrasts (pre-registered)',
      fast: 'ETS vs SARIMA and ETS vs LightGBM are not clearly distinguishable under C10 (the confidence interval crosses zero) — ETS\'s point-estimate edge does not imply confirmed statistical superiority.',
    },
    policyComparison: {
      title: 'Point policy vs. incumbent PI90 (C10 only)',
      fast: 'Under the symmetric C10 scenario, the point policy (no buffer) has lower median loss than the incumbent PI90 — because PI90 holds more buffer, and that buffer counts as over-capacity when cost is weighted 1:1.',
    },
    powerBi: {
      title: 'Power BI',
      fast: 'Implementation package complete (data, semantic model, DAX, page specs). Power BI Desktop assembly and validation remain PENDING — no validated .pbix exists.',
    },
    outcome: {
      title: 'Operational interpretation, evidence and limits',
      fast: 'No policy is declared optimal. The C10 finding does not generalize to asymmetric scenarios (C20/C50/C100), which must be named explicitly whenever cited.',
      synthesis: 'PDI does not replace the incumbent PI90 policy or declare a global winner: it documents, under one named cost scenario, when a point policy performs better than the reference — and states explicitly that the finding does not extend without naming the scenario.',
    },
  },
  labels: {
    role: {
      primary: 'Primary',
      sensitivity: 'Sensitivity',
    },
    microWape: 'micro-WAPE',
    medianNormLoss: 'Median normalized loss',
    iqr: 'IQR',
    verdict: 'Verdict',
    reproducibility: 'Reproducibility',
    globalTestSuite: 'Global test suite',
    reconciliationChecks: 'Reconciliation checks',
  },
}
