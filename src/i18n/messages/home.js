/**
 * Home copy — F3 (docs/redesign/F3A-preflight.md). The wording of the hero,
 * the three featured projects, AboutBrief and ContactStrip is frozen there.
 *
 * Deliberately absent from this file: any seniority / "first formal role" line
 * (that belongs to the CV, About / Contact and the application itself), and any
 * claim about Applied AI. A test (home.test.js) keeps both true.
 *
 * The stage names (DATA, EVIDENCE, PREDICTION, DECISION) are not copy: they are
 * the fixed vocabulary, a constant in visual/stages.js.
 */

export const homeEs = {
  hero: {
    kicker: 'Agustín Delgado',
    title: 'Data Analyst',
    subtitle: 'Uso datos para entender problemas, construir modelos y mejorar decisiones.',
    description:
      'SQL, Python y Power BI aplicados a forecasting, analytics engineering y machine learning, con resultados verificables.',
    ctaPrimary: 'Ver proyectos',
    ctaSecondary: 'Contacto',
    minorAria: 'Enlaces secundarios',
    cv: 'CV',
    flow: {
      aria: 'Flujo conceptual de datos a decisión',
      stagesAria: 'Etapas del flujo: pasar el cursor o enfocar para ver una etapa; activar para fijarla',
      captionLead: 'Ilustración conceptual · bandas con las proporciones reales de PROVIDENTIA; la serie es ilustrativa.',
      hint: 'Elegí una etapa para ver qué proyecto la respalda.',
    },
  },
  viewAll: 'Ver todos los proyectos',
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
  pipeline: {
    anchorLabel: 'Proyecto',
    alsoLabel: 'También',
    stages: {
      data: {
        line: 'Datos modelados y gobernados antes de cualquier análisis.',
        factLabel: 'staging · dimensiones · hechos · marts',
      },
      evidence: {
        line: 'Qué datos son comparables y qué se puede afirmar con ellos.',
        factLabel: 'fuentes · objetos estadísticos · quiebres documentados',
      },
      prediction: {
        line: 'Modelos con validación temporal, baselines y cobertura calibrada.',
        factLabel: 'cobertura del intervalo PI90 en el período final de evaluación (nominal 90 %)',
      },
      decision: {
        line: 'De la predicción a una política: qué capacidad, con qué riesgo.',
        factLabel: 'excedencia simulada en el período final de evaluación: PI90 (referencia) frente a PI80',
      },
    },
  },
  about: {
    title: 'Sobre mí',
    p1: 'Vengo de la administración y las operaciones de salud, donde aprendí que los datos importan cuando cambian una decisión. Hoy trabajo con SQL, Python y Power BI en análisis, dashboards y automatización.',
    p2: 'Estoy profundizando en modelado, forecasting, validación y machine learning mediante proyectos auditables, con datos públicos, tests y límites explícitos.',
    cta: 'Conocer mi trayectoria',
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
    kicker: 'Agustín Delgado',
    title: 'Data Analyst',
    subtitle: 'I use data to understand problems, build models, and make better decisions.',
    description:
      'SQL, Python and Power BI applied to forecasting, analytics engineering, and machine learning, with verifiable results.',
    ctaPrimary: 'View projects',
    ctaSecondary: 'Contact',
    minorAria: 'Secondary links',
    cv: 'CV',
    flow: {
      aria: 'Conceptual flow from data to decision',
      stagesAria: 'Flow stages: hover or focus to see a stage; activate to pin it',
      captionLead: "Conceptual illustration · bands keep PROVIDENTIA's real proportions; the series is illustrative.",
      hint: 'Pick a stage to see which project backs it.',
    },
  },
  viewAll: 'View all projects',
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
  pipeline: {
    anchorLabel: 'Project',
    alsoLabel: 'Also',
    stages: {
      data: {
        line: 'Data modeled and governed before any analysis.',
        factLabel: 'staging · dimensions · facts · marts',
      },
      evidence: {
        line: 'Which data are comparable, and what can be claimed from them.',
        factLabel: 'sources · statistical objects · documented breaks',
      },
      prediction: {
        line: 'Models with temporal validation, baselines and calibrated coverage.',
        factLabel: 'PI90 interval coverage over the final evaluation period (nominal 90%)',
      },
      decision: {
        line: 'From a prediction to a policy: how much capacity, at what risk.',
        factLabel: 'simulated exceedance over the final evaluation period: PI90 (reference) vs PI80',
      },
    },
  },
  about: {
    title: 'About',
    p1: 'I come from administration and healthcare operations, where I learned that data matters when it changes a decision. Today I work with SQL, Python, and Power BI across analysis, dashboards, and automation.',
    p2: "I'm deepening my work in modeling, forecasting, validation, and machine learning through auditable projects with public data, tests, and explicit limits.",
    cta: 'Explore my background',
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
