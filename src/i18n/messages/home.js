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
      stagesAria: 'Etapas del flujo: resaltar una etapa',
      captionLead: 'Ilustración conceptual.',
      captionDetail:
        'Las bandas conservan las proporciones reales de PROVIDENTIA (PI80 / PI90 / PI95, lockbox final); la serie es ilustrativa.',
    },
  },
  viewAll: 'Ver todos los proyectos',
  featured: {
    title: 'Proyectos destacados',
    cta: 'Ver proyecto',
    cards: {
      providentia: {
        line: 'Forecasting de primeras consultas ambulatorias, con incertidumbre calibrada y política de capacidad fijada de antemano.',
        metricLabel: 'WAPE · modelo primario ETS · lockbox final',
        metricNote: 'frente a naïve',
        caption: 'Datos: policy_tradeoff.csv · lockbox final',
        ariaLabel:
          'Trade-off entre buffer medio de capacidad y tasa de excedencia para tres políticas de protección. {points}. PI90 es la política de referencia congelada.',
        axisX: 'buffer medio',
        axisY: 'excedencia',
        reference: 'referencia',
      },
      caelum: {
        line: 'Plataforma analítica gobernada: contratos de datos, dbt y DuckDB, de un paquete validado a marts listos para Power BI.',
        metricLabel: 'tests dbt · contrato fail-closed',
        caption: 'Arquitectura (esquema conceptual): 8 staging → 5 dimensiones → 3 hechos → 2 marts → Power BI. Conteos de un modelo real, no una medición.',
      },
      aletheia: {
        line: 'Qué datos públicos argentinos pueden compararse de verdad: fuentes, cambios metodológicos y límites de la evidencia.',
        cta: 'Explorar investigación',
        metricLabel: 'fuentes → objetos estadísticos → quiebres documentados',
        caption: 'Conteos del registro de la investigación (esquema conceptual).',
        sources: 'fuentes',
        objects: 'objetos',
        breaks: 'quiebres',
      },
    },
  },
  pipeline: {
    title: 'De los datos a la decisión',
    lead: 'Cuatro etapas, cada una respaldada por un proyecto.',
    tablistAria: 'Etapas del trabajo con datos',
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
        factLabel: 'cobertura del intervalo PI90 en el lockbox final (nominal 90 %)',
      },
      decision: {
        line: 'De la predicción a una política: qué capacidad, con qué riesgo.',
        factLabel: 'excedencia con PI90 (referencia) frente a PI80',
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
      stagesAria: 'Flow stages: highlight a stage',
      captionLead: 'Conceptual illustration.',
      captionDetail:
        "The bands keep PROVIDENTIA's real proportions (PI80 / PI90 / PI95, final lockbox); the series itself is illustrative.",
    },
  },
  viewAll: 'View all projects',
  featured: {
    title: 'Featured projects',
    cta: 'View project',
    cards: {
      providentia: {
        line: 'Forecasting of outpatient first appointments, with calibrated uncertainty and a capacity policy fixed in advance.',
        metricLabel: 'WAPE · primary ETS model · final lockbox',
        metricNote: 'vs. naïve',
        caption: 'Data: policy_tradeoff.csv · final lockbox',
        ariaLabel:
          'Trade-off between mean capacity buffer and exceedance rate for three protection policies. {points}. PI90 is the frozen reference policy.',
        axisX: 'mean buffer',
        axisY: 'exceedance',
        reference: 'reference',
      },
      caelum: {
        line: 'Governed analytics platform: data contracts, dbt and DuckDB, from a validated package to marts ready for Power BI.',
        metricLabel: 'dbt tests · fail-closed contract',
        caption: 'Architecture (conceptual diagram): 8 staging → 5 dimensions → 3 facts → 2 marts → Power BI. Counts of a real model, not a measurement.',
      },
      aletheia: {
        line: 'Which Argentine public datasets can truly be compared: sources, methodological breaks, and the limits of the evidence.',
        cta: 'Explore research',
        metricLabel: 'sources → statistical objects → documented breaks',
        caption: 'Counts from the research registry (conceptual diagram).',
        sources: 'sources',
        objects: 'objects',
        breaks: 'breaks',
      },
    },
  },
  pipeline: {
    title: 'From data to decision',
    lead: 'Four stages, each backed by a project.',
    tablistAria: 'Stages of working with data',
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
        factLabel: 'PI90 interval coverage on the final lockbox (nominal 90%)',
      },
      decision: {
        line: 'From a prediction to a policy: how much capacity, at what risk.',
        factLabel: 'exceedance with PI90 (reference) vs PI80',
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
