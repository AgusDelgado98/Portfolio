export const projectsCopy = {
  paradigm: {
    es: {
      rank: '01 — Featured',
      label: 'Data Analytics · Machine Learning · Operaciones de salud',
      nodeSummary: 'Análisis predictivo y ML aplicado',
      tagline:
        'Caso end-to-end de análisis de riesgo de no-show sobre un dataset sintético ambulatorio, con validación temporal y pipeline reproducible.',
      description:
        'Proyecto analítico de punta a punta construido sobre un dataset sintético de atención ambulatoria (12.008 registros, 22 variables) para estudiar el riesgo de inasistencia de pacientes. Apliqué un split temporal train/validation/test y construí un modelo baseline de regresión logística para estimar la probabilidad de no-show. Diseñé indicadores operativos y estructuras de datos analíticas, y armé un pipeline reproducible que cubre preparación de datos, entrenamiento, evaluación y visualización en Power BI y Streamlit. Documenté performance y limitaciones del modelo para sostener iteraciones posteriores.',
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
      evidenceCaptions: {
        lead: 'Tasa de no-show por horizonte de reserva (lead time) en el caso sintético.',
        importance: 'Importancia por permutación del modelo seleccionado: contribución relativa de cada feature.',
      },
    },
    en: {
      rank: '01 — Featured',
      label: 'Data Analytics · Machine Learning · Healthcare Operations',
      nodeSummary: 'Predictive analytics and applied ML',
      tagline:
        'End-to-end no-show risk analysis on a synthetic ambulatory dataset, with temporal validation and a reproducible pipeline.',
      description:
        'End-to-end analytics project built on a synthetic ambulatory healthcare dataset (12,008 records, 22 variables) to study patient no-show risk. Applied a temporal train/validation/test split and built a baseline logistic regression model to estimate no-show probability. Designed operational indicators and analytical data structures, and built a reproducible pipeline covering data preparation, model training, evaluation, and visualization in Power BI and Streamlit. Documented model performance and limitations to support further iteration.',
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
      evidenceCaptions: {
        lead: 'No-show rate by booking lead-time bucket in the synthetic case.',
        importance: 'Permutation importance for the selected model: relative contribution of each feature.',
      },
    },
  },

  clarusflow: {
    es: {
      rank: '06 — Secondary',
      label: 'Data Science Operations · Data Quality · ETL',
      nodeSummary: 'Pipeline de datos SaaS',
      tagline:
        'Pipeline reproducible que transforma exports operativos sintéticos y heterogéneos en un modelo Client 360 con QA, KPIs y reporting ejecutivo.',
      description:
        'Pipeline reproducible en Python organizado en cuatro bloques que simulan una empresa SaaS B2B: generación de datos operativos sintéticos y heterogéneos (CRM, billing, ERP, soporte y product analytics), ingesta y normalización de esos exports, limpieza y control de calidad mediante un motor genérico de reglas, y una capa de transformación que construye dimensiones y hechos hasta un dataset maestro Client 360 con scoring de riesgo determinista y reporting ejecutivo automático.',
      problem:
        'Muchas empresas consolidan archivos operativos manualmente, con duplicados, fechas inconsistentes, importes inválidos, categorías mal escritas y datos incompletos. Ese proceso consume tiempo, genera errores y reduce la confianza en los reportes.',
      role: 'Diseño del pipeline en cuatro bloques: generación de datos sintéticos, ingesta y normalización multi-formato, limpieza mediante un motor genérico de reglas de calidad, y una capa de transformación (dimensiones, hechos, master Client 360) con scoring de riesgo determinista y reportes ejecutivos en Markdown con gráficos.',
      impact:
        'El caso documenta un flujo reproducible desde datos sintéticos hasta un dataset analítico Client 360 con calidad controlada y reglas de riesgo explícitas.',
      impactHighlight:
        'Datos sintéticos → ingesta → limpieza + QA → master Client 360 → scoring de riesgo determinista → reporting ejecutivo.',
      highlights: [
        'Pipeline Python en 4 bloques: generación, ingesta, limpieza, transformación',
        'Generación de datos operativos sintéticos y heterogéneos',
        'Motor genérico de reglas de calidad de datos',
        'Modelo dim/fact y master dataset Client 360',
        'Scoring de riesgo determinista (reglas, no ML)',
        'Reporting ejecutivo automático (Markdown + gráficos)',
      ],
      artifacts: [
        'Datasets sintéticos raw',
        'Pipeline de ingesta',
        'Pipeline de limpieza y QA',
        'master_client_360.csv',
        'Reportes ejecutivos',
        'Gráficos Matplotlib',
      ],
      annotation: 'Data Quality · ETL · Scoring determinista',
      signals: ['Python', 'Data Quality', 'ETL', 'Deterministic scoring'],
      privacyNote:
        'Pipeline construido sobre datos sintéticos generados por el propio proyecto: no usa datos reales, no corre en tiempo real, el scoring de riesgo es determinista (reglas) y no incluye una suite de tests automatizados.',
      evidenceCaptions: {
        revenue: 'Revenue por plan en el dataset sintético Client 360.',
        risk: 'Resumen de riesgo de clientes (scoring determinista) en el dataset sintético.',
      },
    },
    en: {
      rank: '06 — Secondary',
      label: 'Data Science Operations · Data Quality · ETL',
      nodeSummary: 'SaaS data pipeline',
      tagline:
        'Reproducible pipeline that turns synthetic, heterogeneous operational exports into a Client 360 model with QA, KPIs, and executive reporting.',
      description:
        'Reproducible Python pipeline organized in four blocks that simulate a B2B SaaS company: generation of synthetic, heterogeneous operational data (CRM, billing, ERP, support, and product analytics), ingestion and normalization of those exports, cleaning and quality control through a generic rules engine, and a transformation layer that builds dimensions and facts up to a master Client 360 dataset with deterministic risk scoring and automated executive reporting.',
      problem:
        'Many companies consolidate operational files manually, with duplicates, inconsistent dates, invalid amounts, misspelled categories, and incomplete data. That process wastes time, introduces errors, and erodes trust in reports.',
      role: 'Four-block pipeline design: synthetic data generation, multi-format ingestion and normalization, cleaning through a generic data-quality rules engine, and a transformation layer (dimensions, facts, master Client 360) with deterministic risk scoring and Markdown executive reports with charts.',
      impact:
        'The case documents a reproducible flow from synthetic data to an analytical Client 360 dataset with controlled quality and explicit risk rules.',
      impactHighlight:
        'Synthetic data → ingestion → cleaning + QA → master Client 360 → deterministic risk scoring → executive reporting.',
      highlights: [
        'Python pipeline in 4 blocks: generation, ingestion, cleaning, transformation',
        'Generation of synthetic, heterogeneous operational data',
        'Generic data-quality rules engine',
        'Dim/fact model and master Client 360 dataset',
        'Deterministic risk scoring (rules, not ML)',
        'Automated executive reporting (Markdown + charts)',
      ],
      artifacts: [
        'Raw synthetic datasets',
        'Ingestion pipeline',
        'Cleaning & QA pipeline',
        'master_client_360.csv',
        'Executive reports',
        'Matplotlib charts',
      ],
      annotation: 'Data Quality · ETL · Deterministic scoring',
      signals: ['Python', 'Data Quality', 'ETL', 'Deterministic scoring'],
      privacyNote:
        'Pipeline built on synthetic data generated by the project itself: no real data, no real-time processing, deterministic (rule-based) risk scoring, and no automated test suite.',
      evidenceCaptions: {
        revenue: 'Revenue by plan in the synthetic Client 360 dataset.',
        risk: 'Customer risk summary (deterministic scoring) in the synthetic dataset.',
      },
    },
  },

  lumenvox: {
    es: {
      rank: '07 — Secondary',
      label: 'NLP · Feedback Analytics · Model Selection',
      nodeSummary: 'NLP aplicado a feedback',
      tagline:
        'Pipeline de NLP y ML clásico que convierte feedback abierto de clientes en reportes de riesgo por área de producto, con selección de modelo guiada por negocio.',
      description:
        'Pipeline de NLP y Machine Learning clásico sobre un dataset sintético y bilingüe de feedback abierto de clientes: preprocesamiento de texto, vectorización TF-IDF y comparación de Regresión Logística, LinearSVC y Naive Bayes multinomial, con selección del modelo guiada por negocio (negative recall y Macro F1) en lugar del score más alto sin más. El resultado se traduce en análisis por área de producto, canal y segmento, una cola de casos de alto riesgo y un reporte ejecutivo.',
      problem:
        'Las empresas reciben feedback disperso en texto libre, encuestas o comentarios, pero extraer patrones manualmente es lento, subjetivo y difícil de escalar, y priorizar qué casos revisar primero requiere un criterio explícito, no solo la métrica de mayor precisión.',
      role: 'Diseño del pipeline: generación del dataset sintético bilingüe, preprocesamiento de texto, vectorización TF-IDF, entrenamiento y comparación de Regresión Logística, LinearSVC y Naive Bayes multinomial, selección de modelo por negative recall y Macro F1, análisis por área/canal/segmento, cola de casos críticos sin resolver y reporte ejecutivo.',
      impact:
        'El modelo seleccionado (LinearSVC) prioriza detectar feedback negativo por sobre otras métricas, coherente con el costo de negocio de no ver a un cliente insatisfecho. Los resultados se traducen en un análisis por área de producto y una cola de casos críticos sin resolver, priorizada para revisión humana.',
      impactHighlight:
        'Dataset sintético bilingüe → TF-IDF → selección de modelo por negocio → cola de riesgo por área.',
      highlights: [
        'Dataset sintético bilingüe (inglés/español)',
        'Preprocesamiento de texto y vectorización TF-IDF',
        'Comparación de Regresión Logística, LinearSVC y Naive Bayes',
        'Selección de modelo guiada por negocio (negative recall + Macro F1)',
        'Análisis por área de producto, canal y segmento',
        'Cola de casos críticos sin resolver y reporte ejecutivo',
      ],
      artifacts: [
        'Dataset sintético de feedback',
        'Pipeline de NLP',
        'Comparación de modelos',
        'Cola de casos de alto riesgo',
        'Reporte ejecutivo',
      ],
      annotation: 'NLP · Selección de modelo · Cola de riesgo',
      signals: ['NLP', 'Classic ML', 'Model selection', 'Risk queue'],
      privacyNote:
        'Dataset sintético y bilingüe generado para este proyecto: el texto y las etiquetas de sentimiento se generaron de forma conjunta, por lo que las métricas del modelo seleccionado (incluido un negative recall de 1.0000) describen ese experimento puntual y no un desempeño garantizado sobre feedback real. No se implementa IA generativa en este pipeline.',
      evidenceCaptions: {
        confusion: 'Matriz de confusión del modelo seleccionado (LinearSVC).',
        unresolved: 'Casos críticos sin resolver por área de producto.',
      },
    },
    en: {
      rank: '07 — Secondary',
      label: 'NLP · Feedback Analytics · Model Selection',
      nodeSummary: 'NLP on customer feedback',
      tagline:
        'Classic NLP and ML pipeline that turns open customer feedback into risk reports by product area, with business-guided model selection.',
      description:
        'Classic NLP and Machine Learning pipeline over a synthetic, bilingual dataset of open customer feedback: text preprocessing, TF-IDF vectorization, and comparison of Logistic Regression, LinearSVC, and Multinomial Naive Bayes, with model selection guided by business criteria (negative recall and Macro F1) rather than the highest raw score. The output feeds analysis by product area, channel, and segment, a high-risk case queue, and an executive report.',
      problem:
        'Companies receive scattered feedback in free text, surveys, or comments, but extracting patterns manually is slow, subjective, and hard to scale, and deciding which cases to review first requires an explicit criterion, not just the highest-scoring metric.',
      role: 'Pipeline design: synthetic bilingual dataset generation, text preprocessing, TF-IDF vectorization, training and comparison of Logistic Regression, LinearSVC, and Multinomial Naive Bayes, model selection by negative recall and Macro F1, analysis by area/channel/segment, an unresolved critical-case queue, and an executive report.',
      impact:
        'The selected model (LinearSVC) prioritizes catching negative feedback over other metrics, consistent with the business cost of missing a dissatisfied customer. Results feed into analysis by product area and a prioritized queue of unresolved critical cases for human review.',
      impactHighlight:
        'Synthetic bilingual dataset → TF-IDF → business-guided model selection → risk queue by area.',
      highlights: [
        'Synthetic bilingual dataset (English/Spanish)',
        'Text preprocessing and TF-IDF vectorization',
        'Comparison of Logistic Regression, LinearSVC, and Naive Bayes',
        'Business-guided model selection (negative recall + Macro F1)',
        'Analysis by product area, channel, and segment',
        'Unresolved critical-case queue and executive report',
      ],
      artifacts: [
        'Synthetic feedback dataset',
        'NLP pipeline',
        'Model comparison',
        'High-risk case queue',
        'Executive report',
      ],
      annotation: 'NLP · Model selection · Risk queue',
      signals: ['NLP', 'Classic ML', 'Model selection', 'Risk queue'],
      privacyNote:
        'Synthetic, bilingual dataset generated for this project: text and sentiment labels were generated together, so the selected model’s metrics (including a 1.0000 negative recall) describe that specific experiment and not guaranteed performance on real feedback. This pipeline does not implement generative AI.',
      evidenceCaptions: {
        confusion: 'Confusion matrix for the selected model (LinearSVC).',
        unresolved: 'Unresolved critical cases by product area.',
      },
    },
  },

  soma: {
    es: {
      rank: '02 — Featured',
      label: 'HealthOps · Producto operativo',
      nodeSummary: 'Producto clínico operativo',
      tagline:
        'Plataforma de gestión clínica y operativa utilizada por profesionales de salud, con flujos clínicos, facturación y analítica operativa.',
      description:
        'Plataforma de gestión clínica y operativa actualmente utilizada por profesionales de salud. Soporta historias de pacientes, agenda, flujos clínicos, facturación, documentos, acceso basado en roles y analítica operativa. Construida con React/TypeScript y Supabase/PostgreSQL, con flujos automatizados y un asistente integrado consciente de roles.',
      problem:
        'Sin una plataforma unificada, la operación clínica pierde trazabilidad entre agenda, historias, facturación y seguimiento, y la toma de decisiones depende de trabajo manual fragmentado.',
      role: 'Diseño y desarrollo del producto: modelado de datos, flujos clínicos y administrativos, permisos por rol, automatizaciones, analítica operativa y un asistente integrado consciente de roles.',
      impact:
        'Centraliza la operación clínica y administrativa en un sistema en uso real, con datos estructurados para seguimiento y apoyo a la decisión.',
      impactHighlight:
        'Producto en uso: historias · agenda · flujos clínicos · facturación · analítica operativa · asistente por roles.',
      highlights: [
        'En uso por profesionales de salud',
        'Historias, agenda y flujos clínicos',
        'Facturación y documentos',
        'Acceso basado en roles',
        'Analítica operativa integrada',
        'Asistente consciente de roles',
      ],
      artifacts: [
        'App React/TypeScript',
        'Backend Supabase/PostgreSQL',
        'Flujos automatizados',
        'Analítica operativa',
        'Asistente por roles',
      ],
      annotation: 'Producción · HealthOps · Ownership',
      signals: ['Producción', 'Healthcare ops', 'Operational analytics', 'Role-based access'],
    },
    en: {
      rank: '02 — Featured',
      label: 'HealthOps · Operational product',
      nodeSummary: 'Operational clinical product',
      tagline:
        'Clinical and operational management platform used by healthcare professionals, with clinical workflows, billing, and operational analytics.',
      description:
        'Clinical and operational management platform currently used by healthcare professionals. Supports patient records, scheduling, clinical workflows, billing, documents, role-based access and operational analytics. Built with React/TypeScript and Supabase/PostgreSQL, with automated workflows and an integrated role-aware assistant.',
      problem:
        'Without a unified platform, clinical operations lose traceability across scheduling, records, billing, and follow-up, and decision-making depends on fragmented manual work.',
      role: 'Product design and development: data modeling, clinical and administrative workflows, role-based permissions, automations, operational analytics, and an integrated role-aware assistant.',
      impact:
        'It centralizes clinical and administrative operations in a system in real use, with structured data for follow-up and decision support.',
      impactHighlight:
        'In-use product: records · scheduling · clinical workflows · billing · operational analytics · role-aware assistant.',
      highlights: [
        'Used by healthcare professionals',
        'Patient records, scheduling, and clinical workflows',
        'Billing and documents',
        'Role-based access',
        'Integrated operational analytics',
        'Role-aware assistant',
      ],
      artifacts: [
        'React/TypeScript app',
        'Supabase/PostgreSQL backend',
        'Automated workflows',
        'Operational analytics',
        'Role-aware assistant',
      ],
      annotation: 'Production · HealthOps · Ownership',
      signals: ['Production', 'Healthcare ops', 'Operational analytics', 'Role-based access'],
    },
  },

  providentia: {
    es: {
      rank: '03 — Featured',
      label: 'Data Science · Time Series Forecasting · Decision Support',
      nodeSummary: 'Forecasting y soporte de decisiones',
      tagline:
        'Forecasting de demanda mensual de primeras consultas ambulatorias, con validación temporal, calibración de incertidumbre y traducción a una política de capacidad simulada.',
      description:
        'MVP científico de forecasting sobre referrals ambulatorios públicos (StatsWales): predice la demanda mensual de primeras consultas a un mes vista y la convierte en una capacidad de referencia simulada bajo una política de protección fijada antes de ver el período final. El desarrollo compara baselines y modelos, backtestea con orígenes temporales y reserva un lockbox que se puntúa una sola vez.',
      problem:
        'Los servicios ambulatorios necesitan anticipar cuántas primeras citas deberán absorber el mes siguiente y qué capacidad planificar para reducir saturación y capacidad ociosa, sin tratar un forecast puntual como si fuera ocupación hospitalaria real.',
      role: 'Diseño y cierre del núcleo científico: protocolo temporal con prevención de leakage, baselines (Naïve y Seasonal Naïve), modelos estadísticos (ETS y SARIMA) y LightGBM, calibración de intervalos, simulación de políticas de capacidad y evaluación final del lockbox bajo autorización humana.',
      impact:
        'El lockbox B198_FINAL_LOCKBOX_V1 quedó SCORED de forma irreversible. El veredicto del MVP es científicamente válido (164/164 tests). La política de referencia congelada es ETS × PI90; el ranking descriptivo del período reservado no cambia esa política.',
      impactHighlight:
        'Lockbox B198 puntuado una sola vez · política ETS × PI90 · MVP scientifically valid · 164/164 PASS.',
      highlights: [
        'Forecasting de demanda de primeras referrals ambulatorias (horizonte 1 mes)',
        'Validación temporal expanding/rolling origin y prevención de leakage',
        'Comparación de baselines (Naïve, Seasonal Naïve) y modelos (ETS, SARIMA, LightGBM)',
        'Backtesting sobre soporte de desarrollo, con período final reservado',
        'Calibración de intervalos de incertidumbre (80/90/95)',
        'Traducción del forecast a capacidad de referencia simulada (PI80 / PI90 / PI95)',
        'Lockbox final científicamente validado, abierto una sola vez',
      ],
      artifacts: [
        'Pipeline Python P0–P7',
        'Baselines y modelos statsmodels (ETS / SARIMA)',
        'LightGBM global con contrato de features',
        'Figuras y ledgers de evidencia',
        'Suite pytest (164 tests)',
        'Decisiones DDR-001 … DDR-008',
      ],
      annotation: 'Forecasting · Incertidumbre · Decisión de capacidad',
      signals: ['Time series', 'Forecasting', 'Uncertainty', 'Decision support', 'Leakage control'],
      privacyNote:
        'Datos públicos de StatsWales (Outpatient Referrals) bajo Open Government Licence v3.0. El caso no estima ocupación hospitalaria real, staffing ni demanda no observada.',
      flowLead:
        'Recorrido del núcleo científico, desde la pregunta de capacidad hasta el lockbox puntuado.',
      flowSteps: [
        {
          title: 'Pregunta de capacidad',
          body: 'Cuánta demanda de primeras referrals esperar a un mes vista y qué capacidad implica una política de protección elegida de antemano.',
        },
        {
          title: 'Datos públicos',
          body: 'Cohorte analítica sobre StatsWales Outpatient Referrals: series mensuales por health board y especialidad.',
        },
        {
          title: 'Protocolo temporal',
          body: 'Orígenes expanding/rolling: el entrenamiento termina en el origen y el target es exactamente el mes siguiente, sin leakage de futuro.',
        },
        {
          title: 'Baselines y modelos',
          body: 'Naïve y Seasonal Naïve como referencia; ETS y SARIMA por origen; LightGBM global como sensibilidad.',
        },
        {
          title: 'Incertidumbre y decisión',
          body: 'Intervalos calibrados y capacidad requerida como techo del percentil de protección (PI80 / PI90 / PI95).',
        },
        {
          title: 'Lockbox final',
          body: 'El período reservado se abre una sola vez, se puntúa y queda SCORED; sin retuning ni cambio de política post-apertura.',
        },
      ],
      evidenceLead:
        'Figuras del repositorio público: un forecast representativo de desarrollo y la exceedance simulada por política en el lockbox final.',
      evidenceCaptions: {
        forecast: 'Forecast representativo',
        exceedance: 'Política de capacidad y riesgo de excedencia',
      },
      nextStep:
        'El caso afirma desempeño de point / uncertainty / decision y exceedance simulada sobre el lockbox reservado. No afirma capacidad hospitalaria real, staffing, demanda no observada ni un sistema clínico listo para producción.',
    },
    en: {
      rank: '03 — Featured',
      label: 'Data Science · Time Series Forecasting · Decision Support',
      nodeSummary: 'Forecasting and decision support',
      tagline:
        'Monthly forecasting of first outpatient appointments, with temporal validation, uncertainty calibration, and translation into a simulated capacity policy.',
      description:
        'Scientific forecasting MVP on public outpatient referrals (StatsWales): it predicts one-month-ahead demand for first appointments and turns that forecast into a simulated reference capacity under a protection policy frozen before the final period is seen. Development compares baselines and models, backtests with temporal origins, and reserves a lockbox that is scored only once.',
      problem:
        'Ambulatory services need to anticipate how many first appointments the next month will bring and what capacity to plan, without treating a point forecast as if it were observed hospital occupancy.',
      role: 'Design and closure of the scientific core: temporal protocol with leakage prevention, baselines (Naïve and Seasonal Naïve), statistical models (ETS and SARIMA) and LightGBM, interval calibration, capacity-policy simulation, and a one-shot lockbox evaluation under human authorization.',
      impact:
        'Lockbox B198_FINAL_LOCKBOX_V1 is irreversibly SCORED. The MVP verdict is scientifically valid (164/164 tests). The frozen reference policy is ETS × PI90; descriptive ranking on the reserved period does not change that policy.',
      impactHighlight:
        'Lockbox B198 scored once · ETS × PI90 policy · MVP scientifically valid · 164/164 PASS.',
      highlights: [
        'Forecasting of first outpatient referral demand (1-month horizon)',
        'Expanding/rolling-origin temporal validation and leakage prevention',
        'Comparison of baselines (Naïve, Seasonal Naïve) and models (ETS, SARIMA, LightGBM)',
        'Backtesting on the development support, with a reserved final period',
        'Uncertainty interval calibration (80/90/95)',
        'Translation of the forecast into simulated reference capacity (PI80 / PI90 / PI95)',
        'Scientifically validated final lockbox, opened once',
      ],
      artifacts: [
        'Python pipeline P0–P7',
        'statsmodels baselines and models (ETS / SARIMA)',
        'Global LightGBM with a feature contract',
        'Evidence figures and ledgers',
        'pytest suite (164 tests)',
        'DDR-001 … DDR-008 decisions',
      ],
      annotation: 'Forecasting · Uncertainty · Capacity decisions',
      signals: ['Time series', 'Forecasting', 'Uncertainty', 'Decision support', 'Leakage control'],
      privacyNote:
        'Public StatsWales data (Outpatient Referrals) under Open Government Licence v3.0. The case does not estimate real hospital occupancy, staffing, or unobserved demand.',
      flowLead:
        'Path through the scientific core, from the capacity question to the scored lockbox.',
      flowSteps: [
        {
          title: 'Capacity question',
          body: 'How much first-referral demand to expect one month ahead, and what capacity a pre-chosen protection policy implies.',
        },
        {
          title: 'Public data',
          body: 'Analytical cohort from StatsWales Outpatient Referrals: monthly series by health board and specialty.',
        },
        {
          title: 'Temporal protocol',
          body: 'Expanding/rolling origins: training ends at the origin and the target is exactly the next month, with no future leakage.',
        },
        {
          title: 'Baselines and models',
          body: 'Naïve and Seasonal Naïve as reference; ETS and SARIMA by origin; global LightGBM as a sensitivity check.',
        },
        {
          title: 'Uncertainty and decision',
          body: 'Calibrated intervals and required capacity as the ceiling of the protection percentile (PI80 / PI90 / PI95).',
        },
        {
          title: 'Final lockbox',
          body: 'The reserved period is opened once, scored, and left SCORED — no retuning or policy change after opening.',
        },
      ],
      evidenceLead:
        'Figures from the public repository: a representative development forecast and simulated exceedance by policy on the final lockbox.',
      evidenceCaptions: {
        forecast: 'Representative forecast',
        exceedance: 'Capacity policy and exceedance risk',
      },
      nextStep:
        'The case claims point / uncertainty / decision performance and simulated exceedance on the reserved lockbox. It does not claim real hospital capacity, staffing, unobserved demand, or a production-ready clinical system.',
    },
  },

  hogares: {
    es: {
      rank: '04 — Secondary',
      label: 'HealthTech · Gestión geriátrica multi-sede',
      nodeSummary: 'Gestión clínica multi-sede',
      tagline:
        'App médica para geriátricos que centraliza pacientes, historia clínica, indicaciones y certificados por sede, con una experiencia mobile-first para el profesional.',
      description:
        'Aplicación médica para geriátricos que centraliza la gestión de residentes en múltiples sedes: historia clínica, medicación e indicaciones, certificados y documentación, con acceso diferenciado para profesionales de salud y personal administrativo. El frontend es una PWA mobile-first en React, TypeScript y Vite, desplegada en Vercel. El backend actual corre en un Cloudflare Worker con Hono y Cloudflare D1, con autenticación JWT y contraseñas resguardadas con scrypt; la versión anterior sobre FastAPI y PostgreSQL en Render queda fuera del flujo activo.',
      problem:
        'Gestionar residentes, historia clínica, medicación y documentación en más de una sede geriátrica sin un sistema unificado dispersa la información entre planillas y sistemas puntuales, y dificulta el acceso rápido del profesional de salud a los datos que necesita.',
      role: 'Diseño y desarrollo end-to-end de la plataforma: modelo de datos multi-sede, gestión de pacientes e historia clínica, planes de medicación e indicaciones, certificados por sede, autenticación con JWT y scrypt, y migración del backend desde FastAPI + PostgreSQL (Render) hacia un Cloudflare Worker con Hono y Cloudflare D1, validada con una suite de 59 tests de contrato.',
      impact:
        'El resultado es una PWA mobile-first para profesionales de salud en geriátricos multi-sede, con historia clínica, medicación y certificados centralizados por sede, sobre un backend serverless en Cloudflare validado por tests de contrato.',
      impactHighlight:
        'Multi-sede · historia clínica · medicación · certificados → Cloudflare Worker + D1 · 59 tests de contrato.',
      highlights: [
        'Arquitectura médica multi-sede para geriátricos',
        'Pacientes e historia clínica centralizada',
        'Medicación e indicaciones por paciente',
        'Certificados médicos y administrativos por sede',
        'Migración de backend a Cloudflare Worker + D1, con 59 tests de contrato',
      ],
      artifacts: [
        'PWA React/TypeScript/Vite',
        'Backend Cloudflare Worker (Hono)',
        'Base de datos Cloudflare D1',
        'Autenticación JWT + scrypt',
      ],
      annotation: 'Multi-sede · PWA · Cloudflare',
      signals: ['Healthcare ops', 'PWA', 'Cloudflare Worker', 'D1'],
    },
    en: {
      rank: '04 — Secondary',
      label: 'HealthTech · Multi-site nursing home management',
      nodeSummary: 'Multi-site clinical management',
      tagline:
        'Medical app for nursing homes that centralizes patients, clinical records, medication instructions, and certificates by site, with a mobile-first experience for the professional.',
      description:
        'Medical application for nursing homes that centralizes resident management across multiple sites: clinical records, medication and instructions, certificates, and documentation, with differentiated access for healthcare professionals and administrative staff. The frontend is a mobile-first PWA in React, TypeScript, and Vite, deployed on Vercel. The current backend runs on a Cloudflare Worker with Hono and Cloudflare D1, with JWT authentication and scrypt-hashed passwords; the earlier FastAPI + PostgreSQL version on Render is out of the active flow.',
      problem:
        'Managing residents, clinical records, medication, and documentation across more than one nursing-home site without a unified system scatters information across spreadsheets and point systems, and slows down a healthcare professional’s access to the data they need.',
      role: 'End-to-end platform design and development: multi-site data model, patient and clinical-record management, medication plans and instructions, per-site certificates, JWT + scrypt authentication, and backend migration from FastAPI + PostgreSQL (Render) to a Cloudflare Worker with Hono and Cloudflare D1, validated with a 59-test contract suite.',
      impact:
        'The result is a mobile-first PWA for healthcare professionals across multi-site nursing homes, with clinical records, medication, and certificates centralized by site, on a serverless Cloudflare backend validated by contract tests.',
      impactHighlight:
        'Multi-site · clinical records · medication · certificates → Cloudflare Worker + D1 · 59 contract tests.',
      highlights: [
        'Multi-site medical architecture for nursing homes',
        'Patients and centralized clinical records',
        'Medication and per-patient instructions',
        'Medical and administrative certificates by site',
        'Backend migration to Cloudflare Worker + D1, with 59 contract tests',
      ],
      artifacts: [
        'React/TypeScript/Vite PWA',
        'Cloudflare Worker backend (Hono)',
        'Cloudflare D1 database',
        'JWT + scrypt authentication',
      ],
      annotation: 'Multi-site · PWA · Cloudflare',
      signals: ['Healthcare ops', 'PWA', 'Cloudflare Worker', 'D1'],
    },
  },

  tekmerion: {
    es: {
      rank: '05 — Secondary',
      label: 'Market Intelligence · Evidence-first Analytics',
      nodeSummary: 'Evidencia del mercado Data y AI',
      tagline:
        'Análisis evidence-first de señales del mercado laboral Data/BI/AI mediante un pipeline determinista, con guardrails y evaluación de ML aplicada.',
      description:
        'Tekmérion analiza señales del mercado laboral de Data, BI y AI a partir de vacantes: un pipeline determinista extrae skills, roles y seniority y arma un EvidenceReport verificable, y una capa de análisis narrativo con grounding y guardrails solo puede describir esa evidencia, sin inventar datos fuera de ella. El proyecto incluye además una evaluación de Machine Learning para la clasificación de role family sobre un dataset Gold de 159 ejemplos, comparando reglas determinísticas contra modelos de scikit-learn.',
      problem:
        'Las vacantes de Data/BI/AI son heterogéneas y ambiguas: distinto vocabulario, seniority implícito y descripciones incompletas dificultan comparar mercado, roles y skills de forma confiable, y una narrativa generada libremente sobre esos datos puede afirmar cosas que la evidencia no respalda.',
      role: 'Diseño del pipeline determinista de extracción y clasificación de vacantes, del contrato EvidenceReport, de las reglas de grounding y guardrails para el análisis narrativo, y de la evaluación de ML: curación del dataset Gold (159 ejemplos), comparación de reglas contra Regresión Logística, Linear SVM y Random Forest, y la decisión de mantener las reglas como método vigente (promote_ml=false).',
      impact:
        'El pipeline determinista y el EvidenceReport permiten auditar cada afirmación del análisis contra la evidencia real de las vacantes. La evaluación de ML confirmó que las reglas superan a los modelos supervisados en este dataset (Macro F1 0.866 frente a 0.816 de Linear SVM), por lo que el proyecto sostiene las reglas como método vigente y no promueve el modelo de ML.',
      impactHighlight:
        '159 ejemplos Gold · Reglas Macro F1 0.866 vs. Linear SVM 0.816 · promote_ml=false.',
      highlights: [
        'Pipeline determinista de extracción y clasificación de vacantes',
        'EvidenceReport auditable por vacante',
        'Grounding y guardrails para el análisis narrativo',
        'Análisis de roles, skills y seniority',
        'Evaluación de ML: 159 ejemplos Gold, reglas vs. scikit-learn',
        'Reglas vigentes en producción (promote_ml=false)',
      ],
      artifacts: [
        'EvidenceReport',
        'Dataset Gold (159 ejemplos)',
        'Comparación Rules vs. ML',
        'Showroom de mercado',
      ],
      annotation: 'Evidence-first · Guardrails · promote_ml=false',
      signals: ['Evidence-first', 'Grounding', 'Guardrails', 'Model evaluation'],
      evidenceCaptions: {
        showroom: 'Overview del showroom Tekmérion sobre el dataset demo.',
        rulesVsMl:
          'Comparación Rules vs. ML por role family: Macro F1 0.866 (reglas) vs. 0.816 (Linear SVM), con promote_ml=false.',
      },
    },
    en: {
      rank: '05 — Secondary',
      label: 'Market Intelligence · Evidence-first Analytics',
      nodeSummary: 'Data & AI market evidence',
      tagline:
        'Evidence-first analysis of Data/BI/AI job-market signals through a deterministic pipeline, with guardrails and applied ML evaluation.',
      description:
        'Tekmérion analyzes Data, BI, and AI job-market signals from job postings: a deterministic pipeline extracts skills, roles, and seniority into a verifiable EvidenceReport, and a narrative-analysis layer with grounding and guardrails can only describe that evidence, without inventing anything beyond it. The project also includes a Machine Learning evaluation for role-family classification on a 159-example Gold dataset, comparing deterministic rules against scikit-learn models.',
      problem:
        'Data/BI/AI job postings are heterogeneous and ambiguous: different vocabulary, implicit seniority, and incomplete descriptions make it hard to compare market, roles, and skills reliably, and a freely generated narrative over that data can assert things the evidence does not support.',
      role: 'Design of the deterministic job-posting extraction and classification pipeline, the EvidenceReport contract, the grounding and guardrail rules for narrative analysis, and the ML evaluation: curating the Gold dataset (159 examples), comparing rules against Logistic Regression, Linear SVM, and Random Forest, and the decision to keep rules as the production method (promote_ml=false).',
      impact:
        'The deterministic pipeline and the EvidenceReport let every claim in the analysis be audited against the actual job-posting evidence. The ML evaluation confirmed that rules outperform supervised models on this dataset (Macro F1 0.866 vs. 0.816 for Linear SVM), so the project keeps rules as the production method and does not promote the ML model.',
      impactHighlight:
        '159 Gold examples · Rules Macro F1 0.866 vs. Linear SVM 0.816 · promote_ml=false.',
      highlights: [
        'Deterministic job-posting extraction and classification pipeline',
        'Auditable EvidenceReport per posting',
        'Grounding and guardrails for narrative analysis',
        'Role, skill, and seniority analysis',
        'ML evaluation: 159 Gold examples, rules vs. scikit-learn',
        'Rules in production (promote_ml=false)',
      ],
      artifacts: [
        'EvidenceReport',
        'Gold dataset (159 examples)',
        'Rules vs. ML comparison',
        'Market showroom',
      ],
      annotation: 'Evidence-first · Guardrails · promote_ml=false',
      signals: ['Evidence-first', 'Grounding', 'Guardrails', 'Model evaluation'],
      evidenceCaptions: {
        showroom: 'Tekmérion showroom overview on the demo dataset.',
        rulesVsMl:
          'Rules vs. ML comparison by role family: Macro F1 0.866 (rules) vs. 0.816 (Linear SVM), with promote_ml=false.',
      },
    },
  },

  kairos: {
    es: {
      rank: '06 — Secondary',
      label: 'Personal Software · Local-first',
      nodeSummary: 'Biblioteca personal local-first',
      tagline:
        'App personal para descubrir, leer y escuchar conocimiento curado, con biblioteca propia y funcionamiento local-first. El acceso actual está protegido mediante autenticación, mientras que el contenido, la lectura y la biblioteca se gestionan principalmente en el dispositivo.',
      description:
        'Kairós es una aplicación personal para descubrir, guardar y consumir contenido curado —lectura y escucha— como una biblioteca propia de conocimiento. Construida como PWA con React 19, TypeScript y Vite, guarda biblioteca, progreso y preferencias principalmente en el dispositivo mediante localStorage e IndexedDB, con lector de PDF integrado y lectura en voz alta mediante Web Speech API y Media Session. El acceso a la aplicación está protegido por autenticación, resuelta con un Cloudflare Worker, Cloudflare D1 y Better Auth para sostener la sesión.',
      problem:
        'El contenido curado que una persona quiere leer o escuchar suele quedar disperso entre pestañas y notas sueltas, sin una biblioteca propia ni una forma simple de retomarlo más tarde.',
      role: 'Diseño y desarrollo de la aplicación: descubrimiento determinista de contenido, biblioteca personal, lector de PDF, lectura en voz alta con Web Speech API y Media Session, almacenamiento local con localStorage e IndexedDB, y la capa de autenticación con Cloudflare Worker, Cloudflare D1 y Better Auth.',
      impact:
        'El resultado es una biblioteca personal local-first, instalable como PWA, que prioriza el almacenamiento en el dispositivo y un descubrimiento de contenido determinista, con autenticación resuelta en un backend propio sobre Cloudflare.',
      impactHighlight:
        'PWA local-first · localStorage + IndexedDB · lector PDF · Web Speech API · Cloudflare Worker + D1 + Better Auth.',
      highlights: [
        'Descubrimiento determinista de contenido curado',
        'Biblioteca personal (guardados, vistos, escuchas)',
        'Lector de PDF integrado',
        'Lectura en voz alta con Web Speech API y Media Session',
        'Datos principalmente locales (localStorage + IndexedDB)',
        'Autenticación con Cloudflare Worker, D1 y Better Auth',
      ],
      artifacts: [
        'PWA React 19 / TypeScript / Vite',
        'Lector de PDF',
        'Motor de descubrimiento determinista',
        'Backend de autenticación (Worker + D1 + Better Auth)',
      ],
      annotation: 'Local-first · PWA · Descubrimiento determinista',
      signals: ['Local-first', 'PWA', 'IndexedDB', 'Web Speech API'],
      evidenceCaptions: {
        overview: 'Vista de inicio de Kairós: descubrimiento de contenido curado.',
        library: 'Biblioteca personal de Kairós: guardados, vistos y escuchas.',
      },
    },
    en: {
      rank: '06 — Secondary',
      label: 'Personal Software · Local-first',
      nodeSummary: 'Local-first personal library',
      tagline:
        'A personal app to discover, read, and listen to curated knowledge, with its own library and local-first behavior. Access is currently protected by authentication, while content, reading, and the library are managed primarily on-device.',
      description:
        'Kairós is a personal app to discover, save, and consume curated content — reading and listening — as a personal knowledge library. Built as a PWA with React 19, TypeScript, and Vite, it keeps library, progress, and preferences primarily on-device via localStorage and IndexedDB, with a built-in PDF reader and read-aloud powered by the Web Speech API and Media Session. Access to the app is protected by authentication, backed by a Cloudflare Worker, Cloudflare D1, and Better Auth to sustain the session.',
      problem:
        'Curated content someone wants to read or listen to tends to get scattered across tabs and loose notes, without a personal library or a simple way to pick it back up later.',
      role: 'App design and development: deterministic content discovery, personal library, PDF reader, read-aloud with the Web Speech API and Media Session, on-device storage with localStorage and IndexedDB, and the authentication layer with Cloudflare Worker, Cloudflare D1, and Better Auth.',
      impact:
        'The result is a local-first personal library, installable as a PWA, that prioritizes on-device storage and deterministic content discovery, with authentication handled by a purpose-built backend on Cloudflare.',
      impactHighlight:
        'Local-first PWA · localStorage + IndexedDB · PDF reader · Web Speech API · Cloudflare Worker + D1 + Better Auth.',
      highlights: [
        'Deterministic discovery of curated content',
        'Personal library (saved, viewed, listened)',
        'Built-in PDF reader',
        'Read-aloud with the Web Speech API and Media Session',
        'Primarily on-device data (localStorage + IndexedDB)',
        'Authentication with Cloudflare Worker, D1, and Better Auth',
      ],
      artifacts: [
        'React 19 / TypeScript / Vite PWA',
        'PDF reader',
        'Deterministic discovery engine',
        'Authentication backend (Worker + D1 + Better Auth)',
      ],
      annotation: 'Local-first · PWA · Deterministic discovery',
      signals: ['Local-first', 'PWA', 'IndexedDB', 'Web Speech API'],
      evidenceCaptions: {
        overview: 'Kairós home view: curated content discovery.',
        library: 'Kairós personal library: saved, viewed, and listened items.',
      },
    },
  },
}

export function pickProjectCopy(id, language) {
  const entry = projectsCopy[id]
  if (!entry) return {}
  return entry[language] || entry.es || {}
}
