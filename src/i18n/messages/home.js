/**
 * Home copy — "Superficie de decisión" (F4).
 *
 * `hero`, `journey`, `profile` and `selected` are the new Home. `projectGroups`, `featured`
 * and `contact` are still read by the Projects page, the project cards and Contact (F5, F9).
 *
 * Nothing here names or describes a withheld project: `selected.projects` only has
 * entries for published ones, and a test keeps the registry and this table in step.
 * The step names (explore, model, evaluate, decide) are the registry's `journey` ids;
 * they are not the legacy stage ids (data, evidence, prediction, decision).
 */

export const homeEs = {
  hero: {
    eyebrow: 'Data Science · Machine Learning · IA aplicada',
    eyebrowShort: 'Data Science · ML · IA aplicada',
    titleLead: 'Datos, evidencia',
    titleAnd: 'y',
    titleEm: 'decisiones',
    subtitle: 'Uso datos para entender, predecir y decidir, y explico cuánta evidencia respalda cada conclusión.',
    ctaPrimary: 'Ver proyectos',
    ctaSecondary: 'Sobre mí',
    figure: {
      alt: 'Superficie de respuesta estimada sobre un plano de observaciones: un pico principal, uno menor, barras de incertidumbre y una región delimitada por el umbral de decisión.',
      caption: 'FIG. 1 — Superficie de respuesta estimada · figura conceptual, datos simulados',
      captionShort: 'FIG. 1 · figura conceptual, datos simulados',
      legendAria: 'Lectura de la figura',
      labels: {
        obs: { title: 'Observaciones', note: 'Datos simulados' },
        surf: { title: 'Superficie estimada', note: 'Respuesta del modelo' },
        unc: { title: 'Incertidumbre', note: 'Mayor donde hay menos datos' },
        thr: { title: 'Umbral de decisión', note: 'Región que justifica actuar' },
      },
    },
  },
  journey: {
    aria: 'Cuatro pasos: explorar, modelar, evaluar y decidir',
    steps: {
      explore: { title: 'Explorar', line: 'Estructura, calidad y patrones en los datos.' },
      model: { title: 'Modelar', line: 'Hipótesis y modelos que se pueden contrastar.' },
      evaluate: { title: 'Evaluar', line: 'Incertidumbre y validez antes que el resultado.' },
      decide: { title: 'Decidir', line: 'Conclusiones que sostienen una decisión.' },
    },
  },
  profile: {
    label: 'Perfil',
    title: 'Llego a la ciencia de datos desde una base de análisis de datos aplicada.',
    rows: [
      { label: 'Base', text: 'Data Analyst con dedicación parcial en una red de consultorios médicos: análisis, calidad de datos y reporting para decisiones operativas.' },
      { label: 'Formación', text: 'Tecnicatura en Ciencia de Datos (en curso) y formación continua en DataCamp.' },
      { label: 'Dirección', text: 'Modelado predictivo, inferencia causal, experimentación y machine learning aplicado.' },
    ],
    cta: 'Ver trayectoria',
  },
  selected: {
    label: 'Proyectos seleccionados',
    aria: 'Proyectos seleccionados',
    dataLabel: 'Datos',
    cta: 'Ver proyecto',
    complementary: 'Trabajo complementario',
    professionalUse: 'Uso profesional',
    viewAll: 'Ver todos los proyectos',
    projects: {
      providentia: {
        question: '¿Qué va a pasar?',
        line: 'Forecasting y modelado predictivo sobre series temporales, con la incertidumbre del pronóstico a la vista.',
        tags: ['Series temporales', 'Pronóstico'],
        data: 'públicos (StatsWales)',
        facts: {
          methodLabel: 'Método',
          method: 'ETS (modelo principal) · LightGBM evaluado como sensibilidad · SARIMA y referencias',
          resultLabel: 'Resultado',
          resultTemplate:
            'WAPE {ets} con ETS frente a {naive} del naïve · período final de evaluación (caso público)',
          scopeLabel: 'Alcance',
          scope: 'Pronóstico y simulación de políticas de capacidad · no capacidad hospitalaria real',
        },
        figure: {
          alt: 'Serie observada y pronóstico con bandas de incertidumbre del 50 % y del 90 %.',
          note: 'Figura conceptual · serie ilustrativa · no es un pronóstico del caso',
          observed: 'Observado',
          forecast: 'Pronóstico · 50 % / 90 %',
        },
      },
      paradigm: {
        question: '¿Qué muestran los datos?',
        line: 'Análisis de datos, BI e inteligencia operativa: la base profesional de la que parte la transición.',
        tags: ['Base profesional', 'Calidad de datos', 'ML aplicado'],
        data: 'sintéticos en el caso público',
        facts: {
          methodLabel: 'Método',
          method: 'Calidad de datos, indicadores operativos y ML aplicado con señal predictiva moderada',
          resultLabel: 'Límite',
          result: 'Evaluaciones sobre datos sintéticos · señal moderada · no es un modelo clínico',
          scopeLabel: 'Alcance',
          scope: 'Analítica operativa y reporting · demostración pública sin pacientes reales',
        },
        figure: {
          alt: 'Mosaico de celdas que pasa de datos en bruto, con huecos y valores marcados, a datos depurados y confiables.',
          note: 'Figura conceptual · calidad de datos ilustrativa',
          raw: 'Bruto',
          clean: 'Depuración',
          reliable: 'Confiable',
        },
      },
      soma: {
        line: 'Plataforma de gestión clínica y operativa',
        note: 'demostración pública solo con datos ficticios',
      },
    },
  },
  projectGroups: {
    work: {
      title: 'Proyectos vinculados a mi trabajo',
      lead: 'Estos tres desarrollos los utilizo en mi actividad profesional. Cada ficha distingue ese uso de la demostración pública, que se construye con datos sintéticos, públicos o ficticios.',
      usage: 'Uso profesional',
      provenanceLabel: 'Demostración pública',
    },
    personal: {
      title: 'Proyectos personales',
      lead: 'Proyectos independientes, desarrollados por iniciativa propia.',
      swipeHint: 'Deslizá para ver más',
      listAria: 'Proyectos personales, lista desplazable horizontalmente',
    },
  },
  featured: {
    cta: 'Ver proyecto',
    hint: 'Pasá el cursor, enfocá o tocá una parte del esquema.',
    cards: {
      paradigm: {
        line: 'Análisis de datos, calidad y reporting. Indicadores de turnos, cancelaciones y riesgo de inasistencia en un mismo entorno.',
        provenance: 'Casos con datos sintéticos, sin pacientes ni organizaciones reales.',
        caption: 'Ilustración conceptual: probabilidad, umbral y decisión.',
        score: 'probabilidad',
        threshold: 'umbral',
        decision: 'decisión',
        readout: {
          score: 'El modelo estima una probabilidad de inasistencia.',
          threshold: 'Un umbral define a partir de qué probabilidad se actúa.',
          decision: 'La decisión sale de comparar la probabilidad con el umbral.',
        },
      },
      providentia: {
        line: 'Forecasting y análisis predictivo. Proyecciones de demanda que complementan el análisis descriptivo.',
        provenance:
          'Caso con datos públicos de StatsWales: derivaciones (referrals) a una primera consulta ambulatoria. Una derivación no es una cita atendida.',
        metricLabel: 'Caso público · WAPE de ETS en el período final de evaluación',
        metricNote: 'frente a naïve',
        caption: 'Caso público · policy_tradeoff.csv · período final de evaluación',
        ariaLabel:
          'Trade-off entre buffer medio de capacidad y tasa de excedencia para tres políticas de protección. {points}. PI90 es la política de referencia congelada.',
        axisX: 'buffer medio',
        axisY: 'excedencia',
        reference: 'referencia',
      },
      soma: {
        line: 'Plataforma de gestión clínica y operativa. Gestión de pacientes, turnos, documentación y herramientas operativas.',
        provenance: 'Demostración con datos exclusivamente ficticios.',
        caption: 'Ilustración conceptual: agenda, ficha, timeline y estadísticas.',
        agenda: 'Agenda',
        record: 'Ficha',
        timeline: 'Timeline',
        stats: 'Estadísticas',
        readout: {
          agenda: 'Turnos y agenda de la consulta',
          record: 'Ficha clínica del paciente',
          timeline: 'Línea de tiempo de cada paciente',
          stats: 'Analítica operativa',
        },
      },
      caelum: {
        line: 'Plataforma analítica gobernada: contratos de datos, dbt y DuckDB, de un paquete validado a marts listos para Power BI.',
        metricLabel: 'tests dbt · contrato fail-closed',
        caption: 'Arquitectura (esquema conceptual): 8 staging → 5 dimensiones → 3 hechos → 2 marts → Power BI. Conteos de un modelo real, no una medición.',
        layers: { staging: 'staging', dimensions: 'dimensiones', facts: 'hechos', marts: 'marts', bi: 'Power BI' },
      },
      aletheia: {
        line: 'Investigación guiada por evidencia sobre el trabajo en Argentina: 18 preguntas con fuentes públicas, resultados auditables y límites explícitos.',
        cta: 'Explorar investigación',
        metricLabel: 'fuentes → objetos estadísticos → quiebres documentados',
        caption: 'Conteos del registro de la investigación (esquema conceptual).',
        sources: 'fuentes',
        objects: 'objetos',
        breaks: 'quiebres',
        readout: {
          sources: '{n} fuentes en el manifiesto',
          objects: '{n} objetos estadísticos',
          breaks: '{n} quiebres metodológicos documentados',
          compat:
            '{n} relaciones de compatibilidad entre objetos: {forbidden} prohibidas · {conditional} con condiciones · {descriptive} solo descriptiva',
        },
      },
    },
  },
  contact: {
    aria: 'Contacto y disponibilidad',
    location: 'Buenos Aires · Remoto',
    availability: 'Disponibilidad estimada: ~2 semanas',
    contact: 'Contacto',
    cv: 'Descargar CV',
    actionsAria: 'Acciones de contacto',
  },
}

export const homeEn = {
  hero: {
    eyebrow: 'Data Science · Machine Learning · Applied AI',
    eyebrowShort: 'Data Science · ML · Applied AI',
    titleLead: 'Data, evidence',
    titleAnd: 'and',
    titleEm: 'decisions',
    subtitle: 'I use data to understand, predict and decide, and I explain how much evidence supports each conclusion.',
    ctaPrimary: 'View projects',
    ctaSecondary: 'About me',
    figure: {
      alt: 'Estimated response surface over a plane of observations: a main peak, a smaller one, uncertainty bars and a region bounded by the decision threshold.',
      caption: 'FIG. 1 — Estimated response surface · conceptual figure, simulated data',
      captionShort: 'FIG. 1 · conceptual figure, simulated data',
      legendAria: 'How to read the figure',
      labels: {
        obs: { title: 'Observations', note: 'Simulated data' },
        surf: { title: 'Estimated surface', note: 'Model response' },
        unc: { title: 'Uncertainty', note: 'Greater where there is less data' },
        thr: { title: 'Decision threshold', note: 'Region that justifies acting' },
      },
    },
  },
  journey: {
    aria: 'Four steps: explore, model, evaluate and decide',
    steps: {
      explore: { title: 'Explore', line: 'Structure, quality and patterns in the data.' },
      model: { title: 'Model', line: 'Hypotheses and models that can be tested.' },
      evaluate: { title: 'Evaluate', line: 'Uncertainty and validity before the result.' },
      decide: { title: 'Decide', line: 'Conclusions that support a decision.' },
    },
  },
  profile: {
    label: 'Profile',
    title: 'I come to data science from a foundation in applied data analysis.',
    rows: [
      { label: 'Base', text: 'Part-time Data Analyst at a network of medical practices: analysis, data quality and reporting for operational decisions.' },
      { label: 'Training', text: 'Higher technical degree in Data Science (in progress) and continuing education on DataCamp.' },
      { label: 'Direction', text: 'Predictive modeling, causal inference, experimentation and applied machine learning.' },
    ],
    cta: 'View background',
  },
  selected: {
    label: 'Selected projects',
    aria: 'Selected projects',
    dataLabel: 'Data',
    cta: 'View project',
    complementary: 'Complementary work',
    professionalUse: 'Professional use',
    viewAll: 'View all projects',
    projects: {
      providentia: {
        question: 'What will happen?',
        line: 'Forecasting and predictive modeling of time series, with the forecast uncertainty in plain view.',
        tags: ['Time series', 'Forecast'],
        data: 'public (StatsWales)',
        facts: {
          methodLabel: 'Method',
          method: 'ETS (primary model) · LightGBM evaluated as sensitivity · SARIMA and baselines',
          resultLabel: 'Result',
          resultTemplate:
            'WAPE {ets} with ETS against {naive} for naïve · final evaluation period (public case)',
          scopeLabel: 'Scope',
          scope: 'Forecasting and capacity-policy simulation · not real hospital capacity',
        },
        figure: {
          alt: 'Observed series and forecast with 50 % and 90 % uncertainty bands.',
          note: 'Conceptual figure · illustrative series · not a forecast from the case',
          observed: 'Observed',
          forecast: 'Forecast · 50 % / 90 %',
        },
      },
      paradigm: {
        question: 'What do the data show?',
        line: 'Data analysis, BI and operational intelligence: the professional base the transition starts from.',
        tags: ['Professional base', 'Data quality', 'Applied ML'],
        data: 'synthetic in the public case',
        facts: {
          methodLabel: 'Method',
          method: 'Data quality, operational indicators and applied ML with moderate predictive signal',
          resultLabel: 'Limit',
          result: 'Evaluations on synthetic data · moderate signal · not a clinical model',
          scopeLabel: 'Scope',
          scope: 'Operational analytics and reporting · public demo with no real patients',
        },
        figure: {
          alt: 'Mosaic of cells that goes from raw data, with gaps and flagged values, to cleaned and reliable data.',
          note: 'Conceptual figure · illustrative data quality',
          raw: 'Raw',
          clean: 'Cleaned',
          reliable: 'Reliable',
        },
      },
      soma: {
        line: 'Clinical and operational management platform',
        note: 'public demonstration with fictitious data only',
      },
    },
  },
  projectGroups: {
    work: {
      title: 'Work-related projects',
      lead: 'I use these three tools in my professional work. Each page separates that use from the public demonstration, which is built with synthetic, public or fictitious data.',
      usage: 'Professional use',
      provenanceLabel: 'Public demonstration',
    },
    personal: {
      title: 'Personal projects',
      lead: 'Independent projects, built on my own initiative.',
      swipeHint: 'Swipe to see more',
      listAria: 'Personal projects, horizontally scrollable list',
    },
  },
  featured: {
    cta: 'View project',
    hint: 'Hover, focus or tap a part of the diagram.',
    cards: {
      paradigm: {
        line: 'Data analysis, quality checks and reporting. Appointment, cancellation and no-show risk indicators in one environment.',
        provenance: 'Cases built on synthetic data, with no real patients or organizations.',
        caption: 'Conceptual illustration: probability, threshold and decision.',
        score: 'probability',
        threshold: 'threshold',
        decision: 'decision',
        readout: {
          score: 'The model estimates a no-show probability.',
          threshold: 'A threshold sets the probability from which action is taken.',
          decision: 'The decision comes from comparing the probability with the threshold.',
        },
      },
      providentia: {
        line: 'Forecasting and predictive analysis. Demand projections that complement descriptive analysis.',
        provenance:
          'Case built on public StatsWales data: referrals for a first outpatient appointment. A referral is not an attended appointment.',
        metricLabel: 'Public case · ETS WAPE over the final evaluation period',
        metricNote: 'vs. naïve',
        caption: 'Public case · policy_tradeoff.csv · final evaluation period',
        ariaLabel:
          'Trade-off between mean capacity buffer and exceedance rate for three protection policies. {points}. PI90 is the frozen reference policy.',
        axisX: 'mean buffer',
        axisY: 'exceedance',
        reference: 'reference',
      },
      soma: {
        line: 'Clinical and operational management platform. Patient management, appointments, documentation and operational tools.',
        provenance: 'Demonstration using exclusively fictitious data.',
        caption: 'Conceptual illustration: schedule, record, timeline and statistics.',
        agenda: 'Schedule',
        record: 'Record',
        timeline: 'Timeline',
        stats: 'Statistics',
        readout: {
          agenda: 'Appointments and the practice schedule',
          record: "The patient's clinical record",
          timeline: 'A timeline for each patient',
          stats: 'Operational analytics',
        },
      },
      caelum: {
        line: 'Governed analytics platform: data contracts, dbt and DuckDB, from a validated package to marts ready for Power BI.',
        metricLabel: 'dbt tests · fail-closed contract',
        caption: 'Architecture (conceptual diagram): 8 staging → 5 dimensions → 3 facts → 2 marts → Power BI. Counts of a real model, not a measurement.',
        layers: { staging: 'staging', dimensions: 'dimensions', facts: 'facts', marts: 'marts', bi: 'Power BI' },
      },
      aletheia: {
        line: 'Evidence-driven research on labor in Argentina: 18 questions with public sources, auditable findings and explicit limits.',
        cta: 'Explore research',
        metricLabel: 'sources → statistical objects → documented breaks',
        caption: 'Counts from the research registry (conceptual diagram).',
        sources: 'sources',
        objects: 'objects',
        breaks: 'breaks',
        readout: {
          sources: '{n} sources in the manifest',
          objects: '{n} statistical objects',
          breaks: '{n} documented methodological breaks',
          compat:
            '{n} compatibility relationships between objects: {forbidden} forbidden · {conditional} allowed with conditions · {descriptive} descriptive only',
        },
      },
    },
  },
  contact: {
    aria: 'Contact and availability',
    location: 'Buenos Aires · Remote',
    availability: 'Estimated availability: ~2 weeks',
    contact: 'Contact',
    cv: 'Download CV',
    actionsAria: 'Contact actions',
  },
}
