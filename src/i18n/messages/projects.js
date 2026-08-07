export const projectsCopy = {
  paradigm: {
    es: {
      rank: '01 — Featured',
      label: 'Data & BI Analytics · Machine Learning aplicado · Operaciones de salud',
      tagline:
        'Caso publicado de análisis de riesgo de no-show con datos sintéticos, validación temporal y un pipeline reproducible.',
      description:
        'Paradigm documenta un caso aplicado a operaciones ambulatorias: analiza un dataset sintético de 12.008 registros y 22 variables, construye indicadores operativos y evalúa el riesgo de inasistencia con un baseline de regresión logística. Los resultados se presentan en Power BI y Streamlit para conectar el análisis con el seguimiento operativo.',
      problem:
        'Las inasistencias afectan el uso de agenda y la capacidad operativa. El caso explora cómo medir el problema y detectar señales de riesgo sin confundir un ejercicio con datos sintéticos con una validación clínica de producción.',
      role: 'Desarrollo completo del caso: generación y control del dataset sintético (12.008 registros, 22 variables), análisis exploratorio, definición de KPIs, split temporal, regresión logística baseline, evaluación del modelo, pipeline reproducible y visualización en Power BI y Streamlit.',
      impact:
        'El resultado es un flujo reproducible que conecta calidad de datos, indicadores operativos y una señal predictiva moderada. El caso explicita sus límites y sirve como apoyo analítico, no como modelo clínico listo para producción.',
      impactHighlight:
        '12.008 registros · 22 variables → KPIs → split temporal → baseline logístico → Power BI + Streamlit.',
      highlights: [
        'Dataset sintético: 12.008 registros y 22 variables',
        'Split temporal para validación',
        'Regresión logística como baseline',
        'Indicadores operativos y métricas de modelo',
        'Dashboards en Power BI y Streamlit',
        'Pipeline reproducible de punta a punta',
      ],
      artifacts: [
        'Dataset sintético (12.008 × 22)',
        'Pipeline Python',
        'Baseline de regresión logística',
        'Indicadores operativos',
        'Dashboard Power BI',
        'Aplicación Streamlit',
      ],
      annotation: 'No-show · Power BI · Machine Learning aplicado',
      signals: [
        'Data Analysis',
        'Power BI',
        'Logistic Regression',
        'Temporal Split',
        'Healthcare Operations',
        'Reproducibility',
      ],
      privacyNote:
        'Caso construido con datos sintéticos. La evidencia publicada documenta el método, las métricas y los límites del análisis; no representa validación clínica de producción.',
      flowLead:
        'Recorrido documentado del caso, desde la definición del problema hasta los entregables analíticos.',
      flowSteps: [
        {
          title: 'Entrada operativa',
          body: 'El caso parte del impacto de las inasistencias sobre la agenda ambulatoria.',
        },
        {
          title: 'Datos sintéticos',
          body: 'Se genera y valida un dataset sintético de 12.008 registros y 22 variables operativas.',
        },
        {
          title: 'Análisis e indicadores',
          body: 'Se exploran patrones y se construyen KPIs para dimensionar el problema.',
        },
        {
          title: 'Validación temporal',
          body: 'Los datos se separan por tiempo para evitar mezclar información futura en la evaluación.',
        },
        {
          title: 'Modelo baseline',
          body: 'Una regresión logística establece una referencia simple y reproducible para el riesgo de no-show.',
        },
        {
          title: 'Salidas',
          body: 'Power BI y Streamlit presentan indicadores, resultados y límites para revisión.',
        },
      ],
      evidenceLead:
        'El caso Clinic No-Show está documentado paso a paso en el Registro de Ingeniería. Un evaluador puede consultar:',
      evidenceItems: [
        'Aplicación Streamlit del caso',
        'Registro de Ingeniería del caso Clinic No-Show',
        'Gráficos y artefactos analíticos del caso',
        'Decisiones metodológicas documentadas',
        'Fragmentos técnicos curados',
        'Resultados de validación reportados',
      ],
    },
    en: {
      rank: '01 — Featured',
      label: 'Data & BI Analytics · Applied Machine Learning · Healthcare Operations',
      tagline:
        'Published no-show risk analysis case using synthetic data, temporal validation, and a reproducible pipeline.',
      description:
        'Paradigm documents a case applied to ambulatory operations: it analyzes a synthetic appointment dataset of 12,008 records and 22 variables, builds operational indicators, and evaluates no-show risk with a logistic regression baseline. Results are presented in Power BI and Streamlit to connect the analysis with operational monitoring.',
      problem:
        'No-shows affect schedule utilization and operational capacity. The case explores how to measure the problem and detect risk signals without presenting a synthetic-data exercise as a production clinical validation.',
      role: 'Full case development: synthetic dataset generation and checks (12,008 records, 22 variables), exploratory analysis, KPI definition, temporal split, logistic regression baseline, model evaluation, reproducible pipeline, and visualization in Power BI and Streamlit.',
      impact:
        'The outcome is a reproducible flow connecting data quality, operational indicators, and a moderate predictive signal. The case states its limits and serves as analytical support, not as a production-ready clinical model.',
      impactHighlight:
        '12,008 records · 22 variables → KPIs → temporal split → logistic baseline → Power BI + Streamlit.',
      highlights: [
        'Synthetic dataset: 12,008 records and 22 variables',
        'Temporal split for validation',
        'Logistic regression baseline',
        'Operational indicators and model metrics',
        'Power BI and Streamlit dashboards',
        'End-to-end reproducible pipeline',
      ],
      artifacts: [
        'Synthetic dataset (12,008 × 22)',
        'Python pipeline',
        'Logistic regression baseline',
        'Operational indicators',
        'Power BI dashboard',
        'Streamlit application',
      ],
      annotation: 'No-show · Power BI · Applied Machine Learning',
      signals: [
        'Data Analysis',
        'Power BI',
        'Logistic Regression',
        'Temporal Split',
        'Healthcare Operations',
        'Reproducibility',
      ],
      privacyNote:
        'Case built with synthetic data. The published evidence documents the method, metrics, and limits of the analysis; it does not represent production clinical validation.',
      flowLead:
        'Documented case path, from problem definition to analytical deliverables.',
      flowSteps: [
        {
          title: 'Operational input',
          body: 'The case starts from the effect of no-shows on ambulatory scheduling.',
        },
        {
          title: 'Synthetic data',
          body: 'A synthetic appointment dataset of 12,008 records and 22 operational variables is generated and validated.',
        },
        {
          title: 'Analysis and indicators',
          body: 'Patterns are explored and KPIs are built to measure the problem.',
        },
        {
          title: 'Temporal validation',
          body: 'Data is split over time to avoid mixing future information into the evaluation.',
        },
        {
          title: 'Baseline model',
          body: 'Logistic regression provides a simple, reproducible reference for no-show risk.',
        },
        {
          title: 'Outputs',
          body: 'Power BI and Streamlit present indicators, results, and limitations for review.',
        },
      ],
      evidenceLead:
        'The Clinic No-Show case is documented step by step in the Engineering Log. An evaluator can review:',
      evidenceItems: [
        'Streamlit application for the case',
        'Engineering Log for the Clinic No-Show case',
        'Charts and analytical artifacts from the case',
        'Documented methodological decisions',
        'Curated technical excerpts',
        'Reported validation results',
      ],
    },
  },

  clarusflow: {
    es: {
      rank: '02 — Featured',
      label: 'Data Science Operations · Data Quality · ETL',
      tagline: 'Pipeline Python que normaliza y valida archivos operativos para análisis y modelado.',
      description:
        'Proyecto de automatización de datos que simula una empresa SaaS B2B recibiendo archivos inconsistentes desde CRM, billing, ERP, soporte y product analytics. El pipeline genera datos sintéticos, ingiere fuentes heterogéneas, normaliza estructura, limpia errores, valida calidad, construye datasets maestros y produce salidas operativas trazables para decisiones.',
      problem:
        'Muchas empresas consolidan archivos operativos manualmente, con duplicados, fechas inconsistentes, importes inválidos, categorías mal escritas y datos incompletos. Ese proceso consume tiempo, genera errores y reduce la confianza en los reportes.',
      role: 'Diseño del pipeline en Python: generación de datos sintéticos, ingesta, normalización, limpieza, reglas de calidad, master dataset, reportes Markdown, visualizaciones y documentación técnica.',
      impact:
        'El caso documenta un flujo de Python, pandas, data cleaning, data quality y ETL liviano hasta obtener datos listos para modelado.',
      impactHighlight:
        'Pipeline end-to-end: raw files → ingestion → cleaning → QA → master dataset → decision-ready data.',
      highlights: [
        'Automatización Python end-to-end',
        'Limpieza y validación de datos',
        'Data quality scores',
        'Master dataset Client 360',
        'Reportes Markdown + visualizaciones',
      ],
      artifacts: [
        'Raw synthetic datasets',
        'Ingestion pipeline',
        'Cleaning & QA pipeline',
        'master_client_360.csv',
        'Operational reports',
        'Matplotlib charts',
      ],
      annotation: 'Data Quality · ETL · Datos listos para análisis',
      signals: ['Python', 'Data Quality', 'ETL', 'Decision-ready data'],
    },
    en: {
      rank: '02 — Featured',
      label: 'Data Science Operations · Data Quality · ETL',
      tagline:
        'Python pipeline that normalizes and validates operational files for analysis and modeling.',
      description:
        'Data automation project that simulates a B2B SaaS company receiving inconsistent files from CRM, billing, ERP, support, and product analytics. The pipeline generates synthetic data, ingests heterogeneous sources, normalizes structure, cleans errors, validates quality, builds master datasets, and produces traceable operational outputs for decisions.',
      problem:
        'Many companies consolidate operational files manually, with duplicates, inconsistent dates, invalid amounts, misspelled categories, and incomplete data. That process wastes time, introduces errors, and erodes trust in reports.',
      role: 'Python pipeline design: synthetic data generation, ingestion, normalization, cleaning, quality rules, master dataset, Markdown reports, visualizations, and technical documentation.',
      impact:
        'The case documents a flow through Python, pandas, data cleaning, data quality, and lightweight ETL until data is ready for modeling.',
      impactHighlight:
        'End-to-end pipeline: raw files → ingestion → cleaning → QA → master dataset → decision-ready data.',
      highlights: [
        'End-to-end Python automation',
        'Data cleaning and validation',
        'Data quality scores',
        'Master dataset Client 360',
        'Markdown reports + visualizations',
      ],
      artifacts: [
        'Raw synthetic datasets',
        'Ingestion pipeline',
        'Cleaning & QA pipeline',
        'master_client_360.csv',
        'Operational reports',
        'Matplotlib charts',
      ],
      annotation: 'Data Quality · ETL · Analysis-ready data',
      signals: ['Python', 'Data Quality', 'ETL', 'Decision-ready data'],
    },
  },

  lumenvox: {
    es: {
      rank: '03 — Featured',
      label: 'NLP · Feedback Analytics · Sentiment Analysis',
      tagline:
        'Pipeline NLP que clasifica sentimiento, temas y señales críticas en feedback no estructurado.',
      description:
        'Proyecto de NLP aplicado a feedback de clientes. Procesa comentarios no estructurados, detecta sentimiento, clasifica temas recurrentes, identifica señales críticas y genera reportes ejecutivos orientados a decisiones de negocio.',
      problem:
        'Las empresas reciben feedback disperso en texto libre, encuestas o comentarios, pero extraer patrones manualmente es lento, subjetivo y difícil de escalar.',
      role: 'Diseño del flujo de análisis: preparación de datos textuales, procesamiento NLP, análisis de sentimiento, clasificación temática, generación de métricas e informes ejecutivos.',
      impact:
        'El resultado organiza texto disperso en señales que pueden revisar equipos de negocio, producto y experiencia de cliente.',
      impactHighlight: 'Feedback no estructurado → sentimiento → temas → insights ejecutivos.',
      highlights: [
        'NLP aplicado a negocio',
        'Sentiment analysis',
        'Clasificación temática',
        'Feedback analytics',
        'Reportes ejecutivos',
      ],
      artifacts: [
        'Dataset de feedback',
        'Pipeline NLP',
        'Métricas de sentimiento',
        'Reporte ejecutivo',
        'Visualizaciones de insights',
      ],
      annotation: 'NLP · Sentiment · Feedback intelligence',
      signals: ['NLP', 'Sentiment', 'Feedback', 'Insights'],
    },
    en: {
      rank: '03 — Featured',
      label: 'NLP · Feedback Analytics · Sentiment Analysis',
      tagline:
        'NLP pipeline that classifies sentiment, themes, and critical signals in unstructured feedback.',
      description:
        'NLP project applied to customer feedback. It processes unstructured comments, detects sentiment, classifies recurring themes, identifies critical signals, and generates executive reports oriented to business decisions.',
      problem:
        'Companies receive scattered feedback in free text, surveys, or comments, but extracting patterns manually is slow, subjective, and hard to scale.',
      role: 'Analysis flow design: textual data preparation, NLP processing, sentiment analysis, thematic classification, and generation of metrics and executive reports.',
      impact:
        'The result organizes scattered text into signals that business, product, and customer experience teams can review.',
      impactHighlight: 'Unstructured feedback → sentiment → themes → executive insights.',
      highlights: [
        'NLP applied to business',
        'Sentiment analysis',
        'Thematic classification',
        'Feedback analytics',
        'Executive reports',
      ],
      artifacts: [
        'Feedback dataset',
        'NLP pipeline',
        'Sentiment metrics',
        'Executive report',
        'Insight visualizations',
      ],
      annotation: 'NLP · Sentiment · Feedback intelligence',
      signals: ['NLP', 'Sentiment', 'Feedback', 'Insights'],
    },
  },

  miconsultorio: {
    es: {
      rank: '01 — En producción',
      label: 'HealthOps · Operación real',
      tagline:
        'Sistema en producción utilizado diariamente por profesionales de salud para gestionar turnos, historias clínicas, caja y seguimiento operativo.',
      description:
        'Sistema de gestión utilizado diariamente por profesionales de salud. Centraliza turnos, historias clínicas, caja y roles; estructura la actividad operativa para análisis y seguimiento administrativo; y funciona con PostgreSQL en Render y automatizaciones de email.',
      problem:
        'Sin un sistema unificado, la operación clínica pierde trazabilidad: agenda, caja e historias se desincronizan y la toma de decisiones depende de trabajo manual repetitivo.',
      role: 'Desarrollo full-stack y modelado de datos orientado a operación: permisos, flujos clínicos/administrativos, automatizaciones, despliegue y mejoras iterativas con feedback de clínicas en producción. Ownership de punta a punta, desde el modelo de datos hasta el sostén en producción.',
      impact:
        'Centraliza flujos clínicos y administrativos, estructura sus datos y reduce tareas de seguimiento manual en un contexto operativo real.',
      impactHighlight:
        'Evidencia de producción: sistema utilizado diariamente por profesionales de salud, desarrollado y sostenido de punta a punta.',
      highlights: [
        'En producción',
        'Clínicas reales',
        'Uso diario por profesionales de salud',
        'Ownership de punta a punta',
        'Visibilidad operativa diaria',
        'Automatización de seguimiento',
      ],
      artifacts: ['PWA operativa', 'Base PostgreSQL', 'Roles y permisos', 'Deploy en Render'],
      annotation: 'Producción real · Clínicas reales · Ownership',
      signals: ['Producción', 'Healthcare ops', 'Operational analytics', 'Automatización'],
    },
    en: {
      rank: '01 — In production',
      label: 'HealthOps · Live operations',
      tagline:
        'Production system used daily by healthcare professionals to manage appointments, clinical records, cash desk, and operational follow-up.',
      description:
        'Management system used daily by healthcare professionals. It centralizes appointments, clinical records, cash desk, and roles; structures operational activity for analysis and administrative follow-up; and runs with PostgreSQL on Render and email automations.',
      problem:
        'Without a unified system, clinical operations lose traceability: scheduling, cash desk, and records drift out of sync, and decision-making depends on repetitive manual work.',
      role: 'Full-stack development and operations-oriented data modeling: permissions, clinical/administrative flows, automations, deployment, and iterative improvements with feedback from clinics in production. End-to-end ownership, from the data model to sustained production support.',
      impact:
        'It centralizes clinical and administrative flows, structures their data, and reduces manual follow-up work in a real operational context.',
      impactHighlight:
        'Production evidence: a system used daily by healthcare professionals, built and sustained end to end.',
      highlights: [
        'In production',
        'Real clinics',
        'Daily use by healthcare professionals',
        'End-to-end ownership',
        'Daily operational visibility',
        'Follow-up automation',
      ],
      artifacts: ['Operational PWA', 'PostgreSQL database', 'Roles and permissions', 'Deploy on Render'],
      annotation: 'Live production · Real clinics · Ownership',
      signals: ['Production', 'Healthcare ops', 'Operational analytics', 'Automation'],
    },
  },

  'halo-brief': {
    es: {
      rank: '03 — Laboratorio',
      label: 'Product Discovery · Laboratorio de producto',
      tagline: 'Experimento de producto: brief guiado para relevar y calificar consultas de apps a medida.',
      description:
        'Flujo experimental de descubrimiento para aplicaciones web, mobile, SaaS o herramientas internas. El brief registra visión, alcance y criterios de éxito para preparar una propuesta técnica. Se mantiene como laboratorio de producto en evolución.',
      problem:
        'Las consultas iniciales suelen llegar sin alcance, prioridades ni criterios de éxito definidos. El proyecto ordena esa información antes de preparar una propuesta.',
      role: 'Diseño del flujo, sistema de preguntas orientado a producto, interfaz, generación interna de brief, panel de contactos y lógica de calificación.',
      impact:
        'Estructura las consultas iniciales y reúne la información necesaria para evaluar alcance y preparar una propuesta.',
      impactHighlight: 'Laboratorio de producto: consulta inicial → alcance → criterios → brief técnico.',
      highlights: [
        'Descubrimiento guiado para apps a medida',
        'Brief estructurado con criterios de éxito',
        'Interfaz guiada de seis pasos',
        'Reglas de calificación de consultas',
        'Trabajo en evolución dentro de Paradise',
      ],
      artifacts: [
        'Landing inmersiva',
        'Formulario guiado (6 pasos)',
        'Confirmación + registro de contacto',
        'Panel interno de consultas',
        'Sistema visual propio',
      ],
      annotation: 'Laboratorio · Product discovery',
      signals: ['Apps a medida', 'Producto digital', 'Calificación de consultas', 'Product discovery'],
    },
    en: {
      rank: '03 — Lab',
      label: 'Product Discovery · Product lab',
      tagline: 'Product experiment: a guided brief to capture and qualify custom-app inquiries.',
      description:
        'Experimental discovery flow for web, mobile, SaaS, or internal tools. The brief records vision, scope, and success criteria to prepare a technical proposal. It remains a product lab in evolution.',
      problem:
        'Initial inquiries often arrive without defined scope, priorities, or success criteria. The project organizes that information before a proposal is prepared.',
      role: 'Flow design, product-oriented question system, interface, internal brief generation, contacts panel, and qualification logic.',
      impact:
        'It structures initial inquiries and gathers the information needed to assess scope and prepare a proposal.',
      impactHighlight: 'Product lab: initial inquiry → scope → criteria → technical brief.',
      highlights: [
        'Guided discovery for custom apps',
        'Structured brief with success criteria',
        'Six-step guided interface',
        'Inquiry qualification rules',
        'Work in progress within Paradise',
      ],
      artifacts: [
        'Immersive landing',
        'Guided form (6 steps)',
        'Confirmation + contact registration',
        'Internal inquiries panel',
        'Custom visual system',
      ],
      annotation: 'Lab · Product discovery',
      signals: ['Custom apps', 'Digital product', 'Inquiry qualification', 'Product discovery'],
    },
  },

  'mediaudit-rcm': {
    es: {
      type: 'HealthTech · Automatización',
      description:
        'Auditoría médica asistida: validación de códigos, reportes y API REST para reducir trabajo manual en procesos administrativos.',
      annotation: 'Automatización · API REST',
    },
    en: {
      type: 'HealthTech · Automation',
      description:
        'Assisted medical audit: code validation, reports, and a REST API to reduce manual work in administrative processes.',
      annotation: 'Automation · REST API',
    },
  },

  'medilens-ai': {
    es: {
      type: 'Applied AI · Documentación',
      description:
        'Consulta asistida sobre documentación clínica con trazabilidad de fuentes — IA aplicada a un flujo operativo concreto.',
      annotation: 'Documentación clínica · Trazabilidad',
    },
    en: {
      type: 'Applied AI · Documentation',
      description:
        'Assisted querying over clinical documentation with source traceability — AI applied to a concrete operational flow.',
      annotation: 'Clinical documentation · Traceability',
    },
  },

  'geriatric-platform': {
    es: {
      title: 'Plataforma geriátrica',
      type: 'React · FastAPI',
      description: 'Gestión asistencial con roles, JWT y migraciones de esquema.',
      annotation: 'Roles · JWT · Migraciones',
    },
    en: {
      title: 'Geriatric platform',
      type: 'React · FastAPI',
      description: 'Care management with roles, JWT, and schema migrations.',
      annotation: 'Roles · JWT · Migrations',
    },
  },
}

export function pickProjectCopy(id, language) {
  const entry = projectsCopy[id]
  if (!entry) return {}
  return entry[language] || entry.es || {}
}
