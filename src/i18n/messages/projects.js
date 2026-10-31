export const projectsCopy = {
  paradigm: {
    es: {
      rank: '01 — Featured',
      label: 'Análisis · Calidad de datos · Reporting',
      nodeSummary: 'Análisis de datos, calidad y reporting',
      tagline:
        'Análisis de datos, calidad y reporting: indicadores de turnos, cancelaciones y riesgo de inasistencia en un mismo entorno.',
      description:
        'Entorno de análisis que utilizo en mi actividad profesional para trabajar con bases de datos, verificar su calidad y generar visualizaciones e informes. Sus casos públicos se construyen sobre datos sintéticos de turnos ambulatorios: un mart analítico en SQLite con 14 controles de calidad, un modelo de riesgo de inasistencia con partición temporal y explicación con SHAP, y un caso aparte de riesgo operacional.',
      problem:
        'Las inasistencias y cancelaciones afectan el uso de la agenda y la capacidad operativa. Medir el problema con datos de calidad verificada es el paso previo a cualquier intento de predecirlo.',
      role: 'Desarrollo completo de los casos públicos: datos sintéticos y controles de calidad, mart analítico, indicadores, modelo de riesgo con su explicación, aplicación Streamlit local e insumos de BI.',
      impact:
        'Un flujo reproducible que conecta calidad de datos, indicadores operativos y un modelo de riesgo con capacidad predictiva limitada. Los casos explicitan sus límites y sirven como apoyo analítico, no como modelo clínico.',
      impactHighlight: 'Uso profesional · demostración pública con datos sintéticos',
      highlights: [
        'Mart analítico en SQLite con indicadores y 14 controles de calidad',
        'Predicción de inasistencias con partición temporal y explicación con SHAP',
        'Aplicación Streamlit incluida en el repositorio, para ejecutar de forma local',
        'Insumos de BI: CSV y fórmulas DAX para Power BI, CSV para Tableau',
      ],
      artifacts: [
        'Mart analítico en SQLite',
        '14 controles de calidad',
        'Modelo de riesgo con explicación SHAP',
        'Aplicación Streamlit (ejecución local)',
        'Insumos de BI: CSV y DAX (Power BI), CSV (Tableau)',
      ],
      annotation: 'Análisis · Calidad de datos · Reporting',
      signals: [
        'Data Analysis',
        'Data Quality',
        'Logistic Regression',
        'Temporal Split',
        'Healthcare Operations',
        'Reproducibility',
      ],
      privacyNote:
        'Los casos públicos usan datos 100 % sintéticos, sin pacientes ni organizaciones reales. Documentan el método, las métricas y los límites del análisis; no representan validación clínica ni resultados de mi lugar de trabajo.',
      flowLead:
        'Recorrido documentado del caso de inasistencias, desde la definición del problema hasta los entregables analíticos.',
      flowSteps: [
        {
          title: 'Entrada operativa',
          body: 'El caso parte del impacto de las inasistencias sobre la agenda ambulatoria.',
        },
        {
          title: 'Datos sintéticos',
          body: 'Se genera y valida un dataset sintético: 12.000 turnos tras quitar 8 duplicados (12.008 en bruto) y 22 variables operativas.',
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
          body: 'Un mart analítico, una aplicación Streamlit local e insumos de BI presentan indicadores, resultados y límites para revisión.',
        },
      ],
      evidenceLead:
        'El caso Clinic No-Show está documentado paso a paso en Casework · Caso 01. Un evaluador puede consultar:',
      evidenceItems: [
        'Casework · Caso 01 — Clinic No-Show',
        'Gráficos y artefactos analíticos del caso',
        'Decisiones metodológicas documentadas',
        'Fragmentos técnicos curados',
        'Resultados de validación reportados',
      ],
      evidenceCaptions: {
        lead: 'Tasa de no-show por horizonte de reserva (lead time) en el caso sintético.',
        importance: 'Importancia por permutación del modelo seleccionado: contribución relativa de cada feature.',
      },
      detail: {
        work: 'Utilizo PARADIGM en mi actividad profesional para trabajar con bases de datos, verificar su calidad, analizar información operativa y generar visualizaciones e informes. Me permite estudiar indicadores relacionados con turnos, cancelaciones y riesgos de inasistencia desde un mismo entorno de análisis. Conceptualmente, funciona como un espacio que reúne tareas que normalmente realizaría entre Excel y una herramienta de BI. Esto es una comparación funcional, no una afirmación de que integra esos productos.',
        facts: [{ label: 'Datos de la demo', value: 'Sintéticos' }],
        what: {
          points: [
            'Mart analítico en SQLite con indicadores y 14 controles de calidad.',
            'Predicción de inasistencias con partición temporal y explicación del modelo con SHAP.',
            'Aplicación Streamlit incluida en el repositorio, para ejecutar de forma local: no hay un despliegue público.',
            'Insumos de BI: CSV y fórmulas DAX para Power BI, CSV para Tableau. No hay un tablero publicado.',
            'El código es privado; la evidencia pública son los evidence packs del portfolio.',
          ],
        },
        method: [
          { title: 'Datos y calidad', body: 'Una base sintética se limpia (8 duplicados eliminados) y pasa 14 controles de calidad.' },
          { title: 'Indicadores', body: 'Un mart analítico en SQLite reúne indicadores de turnos, cancelaciones y riesgo.' },
          { title: 'Validación temporal', body: 'La partición es por tiempo, para no usar información del futuro en la evaluación.' },
          { title: 'Modelo y explicación', body: 'Una regresión logística estima el riesgo y SHAP explica qué variables lo mueven.' },
        ],
        demo: 'Los casos publicados usan datos 100 % sintéticos, sin pacientes ni organizaciones reales. Documentan el método, no resultados de mi lugar de trabajo.',
        titles: { results: 'Resultados verificables de los casos públicos' },
        result: {
          groups: [
            {
              title: 'Caso de inasistencias (datos sintéticos)',
              points: [
                '12.000 turnos tras quitar 8 duplicados (12.008 en bruto) y 22 columnas; 10.496 elegibles para modelar, con 14,4 % de inasistencias.',
                'Modelo elegido: regresión logística con partición temporal. En la prueba: AUC 0,605 y precisión promedio 0,178, frente a 0,133 del baseline.',
                'Con el umbral elegido (0,41): recall 0,86 y precisión 0,15.',
              ],
            },
            {
              title: 'Caso de riesgo operacional (datos sintéticos)',
              points: [
                '15.000 eventos. Con la misma capacidad de revisión (272 eventos), el modelo capturó 49 riesgos frente a 31 de las reglas fijas.',
              ],
            },
          ],
        },
        limits: [
          'La capacidad predictiva es limitada. No es un modelo clínico ni valida políticas reales.',
          'Asociación no es causalidad.',
          'Estas cifras pertenecen a casos públicos con datos sintéticos; no son resultados de mi lugar de trabajo.',
          'La aplicación Streamlit se ejecuta de forma local: no hay un despliegue público de Streamlit ni un tablero de Power BI publicado.',
        ],
        technical: [
          { label: 'Datos', value: 'Sintéticos, sin pacientes ni organizaciones reales.' },
          { label: 'Modelo', value: 'Regresión logística con partición temporal; explicación con SHAP.' },
          { label: 'Ejecución', value: 'Aplicación Streamlit local.' },
          { label: 'Insumos de BI', value: 'CSV y fórmulas DAX para Power BI; CSV para Tableau.' },
        ],
      },
    },
    en: {
      rank: '01 — Featured',
      label: 'Analysis · Data quality · Reporting',
      nodeSummary: 'Data analysis, quality and reporting',
      tagline:
        'Data analysis, quality checks and reporting: appointment, cancellation and no-show risk indicators in one environment.',
      description:
        'An analysis environment I use in my professional work to handle databases, check their quality and produce visualizations and reports. Its public cases are built on synthetic outpatient appointment data: an analytical SQLite mart with 14 data-quality checks, a no-show risk model with a temporal split and SHAP explanation, and a separate operational-risk case.',
      problem:
        'No-shows and cancellations affect schedule utilization and operational capacity. Measuring the problem with verified data quality comes before any attempt to predict it.',
      role: 'Full development of the public cases: synthetic data and quality checks, analytical mart, indicators, risk model and its explanation, a local Streamlit app and BI inputs.',
      impact:
        'A reproducible flow connecting data quality, operational indicators and a risk model with limited predictive capacity. The cases state their limits and serve as analytical support, not as a clinical model.',
      impactHighlight: 'Professional use · public demonstration on synthetic data',
      highlights: [
        'Analytical SQLite mart with indicators and 14 data-quality checks',
        'No-show prediction with a temporal split and SHAP explanation',
        'Streamlit app included in the repository, to run locally',
        'BI inputs: CSV and DAX formulas for Power BI, CSV for Tableau',
      ],
      artifacts: [
        'Analytical SQLite mart',
        '14 data-quality checks',
        'Risk model with SHAP explanation',
        'Streamlit app (local execution)',
        'BI inputs: CSV and DAX (Power BI), CSV (Tableau)',
      ],
      annotation: 'Analysis · Data quality · Reporting',
      signals: [
        'Data Analysis',
        'Data Quality',
        'Logistic Regression',
        'Temporal Split',
        'Healthcare Operations',
        'Reproducibility',
      ],
      privacyNote:
        'The public cases use 100% synthetic data, with no real patients or organizations. They document the method, metrics and limits of the analysis; they do not represent clinical validation or results from my workplace.',
      flowLead:
        'Documented path of the no-show case, from problem definition to analytical deliverables.',
      flowSteps: [
        {
          title: 'Operational input',
          body: 'The case starts from the effect of no-shows on ambulatory scheduling.',
        },
        {
          title: 'Synthetic data',
          body: 'A synthetic appointment dataset is generated and validated: 12,000 appointments after removing 8 duplicates (12,008 raw) and 22 operational variables.',
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
          body: 'An analytical mart, a local Streamlit app and BI inputs present indicators, results and limitations for review.',
        },
      ],
      evidenceLead:
        'The Clinic No-Show case is documented step by step in Casework · Case 01. An evaluator can review:',
      evidenceItems: [
        'Casework · Case 01 — Clinic No-Show',
        'Charts and analytical artifacts from the case',
        'Documented methodological decisions',
        'Curated technical excerpts',
        'Reported validation results',
      ],
      evidenceCaptions: {
        lead: 'No-show rate by booking lead-time bucket in the synthetic case.',
        importance: 'Permutation importance for the selected model: relative contribution of each feature.',
      },
      detail: {
        work: 'I use PARADIGM in my professional work to handle databases, check their quality, analyze operational information and produce visualizations and reports. It lets me study appointment, cancellation and no-show risk indicators from a single analysis environment. Conceptually, it works as a space that brings together tasks I would normally split between Excel and a BI tool. This is a functional comparison, not a claim that it integrates those products.',
        facts: [{ label: 'Demo data', value: 'Synthetic' }],
        what: {
          points: [
            'SQLite analytical mart with indicators and 14 data-quality checks.',
            'No-show prediction with a temporal split, and model explanation with SHAP.',
            'A Streamlit app included in the repository, to run locally: there is no public deployment.',
            'BI inputs: CSV and DAX formulas for Power BI, CSV for Tableau. No published dashboard.',
            'The code is private; the public evidence is the portfolio evidence packs.',
          ],
        },
        method: [
          { title: 'Data and quality', body: 'A synthetic dataset is cleaned (8 duplicates removed) and passes 14 data-quality checks.' },
          { title: 'Indicators', body: 'A SQLite analytical mart brings together appointment, cancellation and risk indicators.' },
          { title: 'Temporal validation', body: 'The split is by time, so no information from the future enters the evaluation.' },
          { title: 'Model and explanation', body: 'A logistic regression estimates the risk and SHAP explains which variables move it.' },
        ],
        demo: 'The published cases use 100% synthetic data, with no real patients or organizations. They document the method, not results from my workplace.',
        titles: { results: 'Verifiable results of the public cases' },
        result: {
          groups: [
            {
              title: 'No-show case (synthetic data)',
              points: [
                '12,000 appointments after removing 8 duplicates (12,008 raw) and 22 columns; 10,496 eligible for modeling, with a 14.4% no-show rate.',
                'Selected model: logistic regression with a temporal split. On the test set: AUC 0.605 and average precision 0.178, against a 0.133 baseline.',
                'At the chosen threshold (0.41): recall 0.86 and precision 0.15.',
              ],
            },
            {
              title: 'Operational-risk case (synthetic data)',
              points: [
                '15,000 events. With the same review capacity (272 events), the model caught 49 risks against 31 for the fixed rules.',
              ],
            },
          ],
        },
        limits: [
          'Predictive capacity is limited. It is not a clinical model and does not validate real policies.',
          'Association is not causation.',
          'These figures belong to public cases built on synthetic data; they are not results from my workplace.',
          'The Streamlit app runs locally: there is no public Streamlit deployment and no published Power BI dashboard.',
        ],
        technical: [
          { label: 'Data', value: 'Synthetic, with no real patients or organizations.' },
          { label: 'Model', value: 'Logistic regression with a temporal split; explanation with SHAP.' },
          { label: 'Execution', value: 'Local Streamlit app.' },
          { label: 'BI inputs', value: 'CSV and DAX formulas for Power BI; CSV for Tableau.' },
        ],
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
      label: 'Gestión clínica y operativa',
      nodeSummary: 'Plataforma de gestión clínica y operativa',
      tagline:
        'Plataforma de gestión clínica y operativa. Gestión de pacientes, turnos, documentación y herramientas operativas.',
      description:
        'Desarrollo utilizado en mi actividad profesional para organizar procesos administrativos y clínicos. Incluye gestión de pacientes, turnos, documentación y herramientas operativas. La demostración pública utiliza exclusivamente datos ficticios para proteger la privacidad y confidencialidad de la información clínica.',
      problem:
        'Sin una plataforma unificada, la operación clínica pierde trazabilidad entre agenda, historias, documentos y seguimiento.',
      role: 'Diseño y desarrollo de la plataforma: modelado de datos, flujos clínicos y administrativos, permisos por rol con aislamiento entre profesionales y un asistente determinista.',
      impact:
        'Reúne procesos administrativos y clínicos en una sola plataforma, con datos estructurados para seguimiento y estadísticas.',
      impactHighlight: 'Uso profesional · demostración pública con datos ficticios',
      highlights: [
        'Pacientes: ficha, búsqueda e importación desde Excel',
        'Historia clínica, medicación, estudios y documentos',
        'Agenda, finanzas, derivaciones y seguimientos',
        'Permisos por rol y aislamiento entre profesionales',
        'Estadísticas operativas',
        'Asistente determinista, sin IA externa',
      ],
      artifacts: [
        'App React/TypeScript',
        'Backend Supabase (PostgreSQL, Auth y Storage)',
        'Seguridad a nivel de fila (RLS)',
        'Asistente determinista',
        'Estadísticas operativas',
      ],
      annotation: 'Uso profesional · Gestión clínica y operativa',
      signals: ['Uso profesional', 'Healthcare ops', 'Role-based access', 'Row-level security'],
      detail: {
        work: 'Desarrollo utilizado en mi actividad profesional para organizar procesos administrativos y clínicos. Incluye gestión de pacientes, turnos, documentación y herramientas operativas.',
        facts: [{ label: 'Datos de la demo', value: 'Ficticios' }],
        what: {
          points: [
            'Pacientes: ficha, búsqueda e importación desde Excel.',
            'Historia clínica con guardado automático; medicación, estudios y documentos en almacenamiento privado.',
            'Agenda y jornada, finanzas, derivaciones y seguimientos, y estadísticas.',
            'Usuarios con permisos por rol y aislamiento entre profesionales, con seguridad a nivel de fila (RLS) en la base de datos.',
            'Asistente determinista: interpreta frases habituales, valida permisos antes de leer datos y no usa IA externa.',
          ],
        },
        demo: 'La demostración pública utiliza exclusivamente datos ficticios para proteger la privacidad y confidencialidad de la información clínica. El sistema que uso en el trabajo no se muestra.',
        titles: { demo: 'Vista previa' },
        limits: [
          'La demostración pública no contiene información clínica real ni se conecta con el entorno donde utilizo la plataforma.',
        ],
        technical: [
          { label: 'Backend', value: 'Supabase: PostgreSQL, Auth y Storage.' },
          { label: 'Seguridad', value: 'Permisos por rol y seguridad a nivel de fila (RLS).' },
        ],
      },
    },
    en: {
      rank: '02 — Featured',
      label: 'Clinical and operational management',
      nodeSummary: 'Clinical and operational management platform',
      tagline:
        'Clinical and operational management platform. Patient management, appointments, documentation and operational tools.',
      description:
        'A development I use in my professional work to organize administrative and clinical processes. It includes patient management, appointments, documentation and operational tools. The public demonstration uses exclusively fictitious data to protect the privacy and confidentiality of clinical information.',
      problem:
        'Without a unified platform, clinical operations lose traceability across scheduling, records, documents and follow-up.',
      role: 'Platform design and development: data modeling, clinical and administrative workflows, role-based permissions with isolation between professionals, and a deterministic assistant.',
      impact:
        'It brings administrative and clinical processes into one platform, with structured data for follow-up and statistics.',
      impactHighlight: 'Professional use · public demonstration on fictitious data',
      highlights: [
        'Patients: record, search and Excel import',
        'Clinical history, medication, studies and documents',
        'Schedule, finances, referrals and follow-ups',
        'Role-based permissions and isolation between professionals',
        'Operational statistics',
        'Deterministic assistant, no external AI',
      ],
      artifacts: [
        'React/TypeScript app',
        'Supabase backend (PostgreSQL, Auth and Storage)',
        'Row-level security (RLS)',
        'Deterministic assistant',
        'Operational statistics',
      ],
      annotation: 'Professional use · Clinical and operational management',
      signals: ['Professional use', 'Healthcare ops', 'Role-based access', 'Row-level security'],
      detail: {
        work: 'A development I use in my professional work to organize administrative and clinical processes. It includes patient management, appointments, documentation and operational tools.',
        facts: [{ label: 'Demo data', value: 'Fictitious' }],
        what: {
          points: [
            'Patients: record, search and Excel import.',
            'Clinical history with autosave; medication, studies and documents in private storage.',
            'Schedule and daily workflow, finances, referrals and follow-ups, and statistics.',
            'Users with role-based permissions and isolation between professionals, using row-level security (RLS) in the database.',
            'A deterministic assistant: it parses common phrases, checks permissions before reading data and uses no external AI.',
          ],
        },
        demo: 'The public demonstration uses exclusively fictitious data to protect the privacy and confidentiality of clinical information. The system I use at work is not shown.',
        titles: { demo: 'Preview' },
        limits: [
          'The public demonstration contains no real clinical information and is not connected to the environment where I use the platform.',
        ],
        technical: [
          { label: 'Backend', value: 'Supabase: PostgreSQL, Auth and Storage.' },
          { label: 'Security', value: 'Role-based permissions and row-level security (RLS).' },
        ],
      },
    },
  },

  providentia: {
    es: {
      rank: '03 — Featured',
      label: 'Forecasting · Análisis predictivo · Series temporales',
      nodeSummary: 'Forecasting y análisis predictivo',
      tagline:
        'Forecasting y análisis predictivo: proyecciones de demanda que complementan el análisis descriptivo.',
      description:
        'Herramienta de forecasting que utilizo en mi actividad profesional y que complementa a PARADIGM con una perspectiva predictiva. Su caso público pronostica la demanda mensual de derivaciones (referrals) a una primera consulta ambulatoria con datos públicos de StatsWales, con validación temporal sin fuga de información, intervalos calibrados y una política de capacidad simulada fijada antes de ver el período final de evaluación.',
      problem:
        'Los servicios ambulatorios necesitan anticipar cuántas derivaciones para una primera consulta recibirán el mes siguiente y qué capacidad de manejo planificar, sin tratar un pronóstico como ocupación hospitalaria real ni una derivación como una cita atendida.',
      role: 'Desarrollo del caso público: protocolo temporal con prevención de fuga de información, modelos de referencia, ETS, SARIMA y LightGBM, calibración de intervalos, simulación de políticas de capacidad y evaluación del período final.',
      impact:
        'En el período final de evaluación, ETS logra un WAPE de 9,2 % frente a 10,7 % del naïve y los intervalos PI90 cubren 89,6 % (nominal 90 %). La política de referencia (ETS × PI90) se fijó antes de ver ese período; una extensión posterior la contextualiza sin reemplazarla (ver Caso 05). Son resultados del caso público, no de mi lugar de trabajo.',
      impactHighlight: 'Período final de evaluación (caso público): WAPE de 9,2 % con ETS frente a 10,7 % del naïve.',
      highlights: [
        'Pronóstico mensual de derivaciones a una primera consulta ambulatoria (horizonte de 1 mes)',
        'Validación temporal con orígenes expanding/rolling y prevención de fuga de información',
        'Modelos de referencia (naïve, naïve estacional), ETS, SARIMA y LightGBM',
        'Período final reservado, abierto una sola vez',
        'Extensión de evaluación de políticas con grilla pre-registrada',
        'Paquete de implementación para Power BI; el ensamblado en Desktop está pendiente',
      ],
      artifacts: [
        'Pipeline Python de forecasting',
        'Extensión de evaluación de políticas (grilla pre-registrada)',
        'Capa analítica SQL / SQLite',
        'Motor de decisión en Python',
        'Paquete de implementación para Power BI (ensamblado en Desktop pendiente)',
        'Suite de pruebas pytest',
      ],
      annotation: 'Forecasting · Incertidumbre · Evaluación de políticas',
      signals: ['Time series', 'Forecasting', 'Uncertainty', 'Decision support', 'Leakage control'],
      privacyNote:
        'Datos públicos de StatsWales (Outpatient Referrals) bajo Open Government Licence v3.0. El caso no estima ocupación hospitalaria real, dotación de personal ni demanda no observada.',
      flowLead:
        'Recorrido del núcleo científico, desde la pregunta de capacidad hasta el período final puntuado.',
      flowSteps: [
        {
          title: 'Pregunta de capacidad',
          body: 'Cuántas derivaciones para una primera consulta esperar a un mes vista y qué capacidad implica una política de protección elegida de antemano.',
        },
        {
          title: 'Datos públicos',
          body: 'Cohorte analítica sobre StatsWales Outpatient Referrals: series mensuales por health board y especialidad.',
        },
        {
          title: 'Protocolo temporal',
          body: 'Orígenes expanding/rolling: el entrenamiento termina en el origen y el objetivo es exactamente el mes siguiente, sin fuga de información del futuro.',
        },
        {
          title: 'Modelos de referencia y modelos',
          body: 'Naïve y naïve estacional como referencia; ETS y SARIMA por origen; LightGBM global como sensibilidad.',
        },
        {
          title: 'Incertidumbre y decisión',
          body: 'Intervalos calibrados y capacidad requerida como techo del percentil de protección (PI80 / PI90 / PI95).',
        },
        {
          title: 'Período final',
          body: 'El período reservado se abre una sola vez y se puntúa; no hay reajuste ni cambio de política después de abrirlo.',
        },
      ],
      evidenceLead:
        'Figuras del repositorio público: un pronóstico representativo del desarrollo y la excedencia simulada por política en el período final de evaluación.',
      evidenceCaptions: {
        forecast: 'Pronóstico representativo',
        exceedance: 'Política de capacidad y riesgo de excedencia en el período final de evaluación',
      },
      nextStep:
        'El caso afirma desempeño de pronóstico puntual, de incertidumbre y de decisión, y la excedencia simulada en el período final reservado, más los hallazgos de la extensión de políticas condicionados a su escenario de costo (ver Caso 05). No afirma capacidad hospitalaria real, dotación de personal, demanda no observada, un óptimo global de política, ahorro monetario ni un tablero de Power BI terminado.',
      detail: {
        work: 'Utilizo PROVIDENTIA en mi actividad profesional para profundizar el análisis mediante técnicas de forecasting. Complementa a PARADIGM porque permite estudiar tendencias y elaborar proyecciones de demanda, aportando una perspectiva predictiva que va más allá del análisis descriptivo.',
        facts: [{ label: 'Datos de la demo', value: 'StatsWales · públicos' }],
        what: {
          points: [
            'Pronóstico mensual de derivaciones (referrals) a una primera consulta ambulatoria, un mes por delante.',
            'Validación temporal sin fuga de información y un período final reservado, abierto una sola vez.',
            'Modelos de referencia (naïve), ETS, SARIMA y LightGBM, con intervalos calibrados.',
            'Política de capacidad simulada (PI80 / PI90 / PI95), fijada antes de ver el período final.',
            'Extensión de evaluación de políticas con grilla pre-registrada, y una suite de pruebas pytest.',
            'Power BI: paquete de implementación. El armado y la validación en Desktop están pendientes; no hay un tablero terminado.',
          ],
        },
        method: [
          { title: 'Datos públicos', body: 'StatsWales: series mensuales por health board y especialidad.' },
          { title: 'Validación temporal', body: 'Orígenes expanding/rolling, sin información del futuro.' },
          { title: 'Modelos de referencia y modelos', body: 'Naïve y naïve estacional frente a ETS, SARIMA y LightGBM.' },
          { title: 'Incertidumbre y período final', body: 'Intervalos PI80 / PI90 / PI95 y un período final reservado, abierto una sola vez.' },
        ],
        demo: 'El caso publicado usa datos públicos y reales de StatsWales (Outpatient Referrals, licencia OGL v3), del sistema de salud de Gales. Son derivaciones (referrals) a una primera consulta ambulatoria: una derivación no es una cita atendida. No son datos de mi lugar de trabajo.',
        titles: { results: 'Resultados verificables del caso público' },
        result: {
          groups: [
            {
              title: 'Período final de evaluación (3.564 pronósticos, 198 series)',
              points: [
                'WAPE de 9,15 % con ETS frente a 10,69 % del naïve. SARIMA queda levemente mejor (8,84 %), solo como ranking descriptivo.',
                'Cobertura de los intervalos: 80,9 % (nominal 80 %), 89,6 % (nominal 90 %) y 94,5 % (nominal 95 %).',
              ],
            },
            {
              title: 'Capacidad simulada en el período final',
              points: ['Excedencia de 6,06 % con PI90 (política de referencia), 10,91 % con PI80 y 3,56 % con PI95.'],
            },
          ],
        },
        decision: {
          body: 'La política de referencia fijada de antemano sigue siendo ETS × PI90. Una extensión posterior evaluó las políticas como decisión bajo un escenario de costo simétrico: contextualiza esa referencia, no la reemplaza.',
          caseNumber: '05',
        },
        limits: [
          'No estima ocupación hospitalaria real, dotación de personal ni demanda potencial.',
          'No garantiza un nivel de servicio futuro, una capacidad óptima ni ahorros. Una derivación no equivale a una cita atendida.',
          'Los resultados valen para el período final y el escenario de costo evaluados. Pertenecen al caso público y no son resultados de mi lugar de trabajo.',
          'Power BI queda como paquete de implementación: no hay un tablero validado.',
        ],
        technical: [
          { label: 'Validación', value: 'Validación temporal sin fuga de información y un período final puntuado una sola vez.' },
          { label: 'Reproducibilidad', value: 'Pipeline en Python de punta a punta, con pruebas pytest, en el repositorio.' },
        ],
      },
    },
    en: {
      rank: '03 — Featured',
      label: 'Forecasting · Predictive analysis · Time series',
      nodeSummary: 'Forecasting and predictive analysis',
      tagline:
        'Forecasting and predictive analysis: demand projections that complement descriptive analysis.',
      description:
        'A forecasting tool I use in my professional work, complementing PARADIGM with a predictive perspective. Its public case forecasts monthly demand for referrals to a first outpatient appointment using public StatsWales data, with leakage-free temporal validation, calibrated intervals and a simulated capacity policy fixed before the final evaluation period is seen.',
      problem:
        'Outpatient services need to anticipate how many referrals for a first appointment the next month will bring and what handling capacity to plan, without treating a forecast as observed hospital occupancy or a referral as an attended appointment.',
      role: 'Development of the public case: temporal protocol with leakage prevention, baselines, ETS, SARIMA and LightGBM, interval calibration, capacity-policy simulation and the final-period evaluation.',
      impact:
        'Over the final evaluation period, ETS reaches a WAPE of 9.2% against 10.7% for the naïve baseline and PI90 intervals cover 89.6% (nominal 90%). The reference policy (ETS × PI90) was fixed before that period was seen; a later extension contextualizes it without replacing it (see Case 05). These are results of the public case, not of my workplace.',
      impactHighlight: 'Final evaluation period (public case): WAPE of 9.2% with ETS against 10.7% for naïve.',
      highlights: [
        'Monthly forecast of referrals to a first outpatient appointment (1-month horizon)',
        'Expanding/rolling-origin temporal validation and leakage prevention',
        'Baselines (naïve, seasonal naïve), ETS, SARIMA and LightGBM',
        'Reserved final period, opened only once',
        'Policy-evaluation extension with a pre-registered grid',
        'Power BI implementation package; Desktop assembly is pending',
      ],
      artifacts: [
        'Python forecasting pipeline',
        'Policy-evaluation extension (pre-registered grid)',
        'SQL / SQLite analytical layer',
        'Python decision engine',
        'Power BI implementation package (Desktop assembly pending)',
        'pytest test suite',
      ],
      annotation: 'Forecasting · Uncertainty · Policy evaluation',
      signals: ['Time series', 'Forecasting', 'Uncertainty', 'Decision support', 'Leakage control'],
      privacyNote:
        'Public StatsWales data (Outpatient Referrals) under Open Government Licence v3.0. The case does not estimate real hospital occupancy, staffing or unobserved demand.',
      flowLead:
        'Path through the scientific core, from the capacity question to the scored final period.',
      flowSteps: [
        {
          title: 'Capacity question',
          body: 'How many referrals for a first appointment to expect one month ahead, and what capacity a pre-chosen protection policy implies.',
        },
        {
          title: 'Public data',
          body: 'Analytical cohort from StatsWales Outpatient Referrals: monthly series by health board and specialty.',
        },
        {
          title: 'Temporal protocol',
          body: 'Expanding/rolling origins: training ends at the origin and the target is exactly the next month, with no leakage from the future.',
        },
        {
          title: 'Baselines and models',
          body: 'Naïve and seasonal naïve as reference; ETS and SARIMA by origin; global LightGBM as a sensitivity check.',
        },
        {
          title: 'Uncertainty and decision',
          body: 'Calibrated intervals and required capacity as the ceiling of the protection percentile (PI80 / PI90 / PI95).',
        },
        {
          title: 'Final period',
          body: 'The reserved period is opened once and scored; there is no retuning or policy change after opening it.',
        },
      ],
      evidenceLead:
        'Figures from the public repository: a representative development forecast and simulated exceedance by policy over the final evaluation period.',
      evidenceCaptions: {
        forecast: 'Representative forecast',
        exceedance: 'Capacity policy and exceedance risk over the final evaluation period',
      },
      nextStep:
        'The case claims point-forecast, uncertainty and decision performance and simulated exceedance over the reserved final period, plus the policy-extension findings conditioned on their cost scenario (see Case 05). It does not claim real hospital capacity, staffing, unobserved demand, a global policy optimum, monetary savings or a finished Power BI dashboard.',
      detail: {
        work: 'I use PROVIDENTIA in my professional work to deepen analysis with forecasting techniques. It complements PARADIGM: it lets me study trends and build demand projections, adding a predictive perspective beyond descriptive analysis.',
        facts: [{ label: 'Demo data', value: 'StatsWales · public' }],
        what: {
          points: [
            'Monthly forecast of referrals to a first outpatient appointment, one month ahead.',
            'Leakage-free temporal validation and a reserved final period, opened only once.',
            'Naïve baselines, ETS, SARIMA and LightGBM, with calibrated intervals.',
            'A simulated capacity policy (PI80 / PI90 / PI95), fixed before the final period is seen.',
            'A policy-evaluation extension with a pre-registered grid, and a pytest suite.',
            'Power BI: an implementation package. Desktop assembly and validation are pending; there is no finished dashboard.',
          ],
        },
        method: [
          { title: 'Public data', body: 'StatsWales: monthly series by health board and specialty.' },
          { title: 'Temporal validation', body: 'Expanding/rolling origins, no information from the future.' },
          { title: 'Baselines and models', body: 'Naïve and seasonal naïve against ETS, SARIMA and LightGBM.' },
          { title: 'Uncertainty and final period', body: 'PI80 / PI90 / PI95 intervals and a reserved final period opened only once.' },
        ],
        demo: 'The published case uses real, public StatsWales data (Outpatient Referrals, OGL v3 licence) from the Welsh health system. These are referrals for a first outpatient appointment: a referral is not an attended appointment. It is not data from my workplace.',
        titles: { results: 'Verifiable results of the public case' },
        result: {
          groups: [
            {
              title: 'Final evaluation period (3,564 forecasts, 198 series)',
              points: [
                'WAPE of 9.15% with ETS against 10.69% for naïve. SARIMA is slightly better (8.84%), as a descriptive ranking only.',
                'Interval coverage: 80.9% (nominal 80%), 89.6% (nominal 90%) and 94.5% (nominal 95%).',
              ],
            },
            {
              title: 'Simulated capacity over the final period',
              points: ['Exceedance of 6.06% with PI90 (reference policy), 10.91% with PI80 and 3.56% with PI95.'],
            },
          ],
        },
        decision: {
          body: 'The reference policy fixed in advance is still ETS × PI90. A later extension scored the policies as a decision under a symmetric cost scenario: it contextualizes that reference, it does not replace it.',
          caseNumber: '05',
        },
        limits: [
          'It does not estimate real hospital occupancy, staffing or potential demand.',
          'It does not guarantee a future service level, an optimal capacity or savings. A referral is not an attended appointment.',
          'Results hold for the evaluated final period and cost scenario. They belong to the public case and are not results from my workplace.',
          'Power BI stays an implementation package: there is no validated dashboard.',
        ],
        technical: [
          { label: 'Validation', value: 'Leakage-free temporal validation and a final period scored only once.' },
          { label: 'Reproducibility', value: 'End-to-end Python pipeline, with pytest tests, in the repository.' },
        ],
      },
    },
  },

  caelum: {
    es: {
      rank: '04 — Featured',
      label: 'Analytics Engineering · BI · Data Quality',
      nodeSummary: 'Plataforma analítica gobernada',
      tagline:
        'Plataforma de Analytics Engineering que convierte outputs validados de forecasting y capacity planning en datasets gobernados y listos para BI mediante contratos de datos, dbt, DuckDB y orquestación reproducible.',
      description:
        'Caelum es la capa de operacionalización downstream del upstream analítico real de PROVIDENTIA/PDI. Consume paquetes Parquet versionados publicados por PROVIDENTIA y deliberadamente no recalcula forecasts, incertidumbre, decisiones de capacidad, buffers, riesgo ni lógica de política. Su trabajo es validar el contrato de forma fail-closed, publicar releases inmutables, proyectar un modelo dimensional delgado en DuckDB/dbt y entregar marts listos para Power BI, con orquestación local en Airflow y una arquitectura AWS objetivo validada en Terraform sin despliegue.',
      problem:
        'Los outputs analíticos validados no son suficientes por sí solos para un flujo de BI confiable: necesitan contratos, validación, trazabilidad, modelos dimensionales y una capa de consumo que preserve su granularidad y semántica.',
      role: 'Implementación del consumidor gobernado: validación fail-closed del contrato externo en Python, publicación inmutable de releases raw/validated, capa DuckDB/dbt con staging, dimensiones, hechos y marts, export Parquet listo para Power BI Desktop, orquestación local con un DAG de Airflow, arquitectura AWS objetivo en Terraform (sin apply) y CI completa en GitHub Actions.',
      impact:
        'El resultado es un flujo reproducible y gobernado desde el paquete upstream hasta marts listos para BI: el contrato falla cerrado ante paquetes inválidos, las capas dimensionales preservan el grain upstream, 103 tests dbt resguardan integridad y el export Power BI evita agregaciones inseguras. AWS permanece como arquitectura objetivo validada sin credenciales ni gasto cloud.',
      impactHighlight:
        'Contrato fail-closed → 8 staging → 5 dimensiones → 3 hechos → 2 marts → Power BI export → Airflow → Terraform + CI.',
      highlights: [
        'Contrato de datos externo versionado (fail-closed)',
        'Releases raw/validated inmutables',
        'Modelado dimensional que preserva el grain upstream',
        '103 tests dbt de integridad y relaciones',
        'Capa de consumo segura para Power BI Desktop',
        'Orquestación local con Apache Airflow',
        'Validación Terraform sin credenciales ni apply',
        'CI completa en GitHub Actions (Python, dbt, Airflow, export, Terraform)',
      ],
      artifacts: [
        'Validador de contrato / capa de ingesta',
        'Modelos y tests dbt',
        'Capa analítica DuckDB',
        'Especificación de export Power BI',
        'DAG de Airflow',
        'Arquitectura AWS en Terraform',
        'Workflow de GitHub Actions',
      ],
      annotation: 'dbt · DuckDB · Power BI · Airflow · Terraform',
      signals: [
        'Analytics Engineering',
        'SQL',
        'dbt',
        'Data Quality',
        'Dimensional Modeling',
        'Power BI',
        'Airflow',
        'Terraform',
        'CI/CD',
      ],
      privacyNote:
        'Los outputs analíticos de PROVIDENTIA/PDI son upstream y no se recalculan aquí. No hay despliegue real en AWS, ni credenciales cloud, ni gasto de infraestructura (USD 0). No se incluye un `.pbix` en el repositorio; AWS es arquitectura/IaC validada localmente, no operación en producción.',
      flowLead:
        'Pasos 1–6 son locales y reproducibles. El paso 7 documenta la arquitectura AWS objetivo y la validación CI — sin despliegue.',
      flowSteps: [
        {
          title: 'Paquete upstream validado',
          body: 'Consumo de un paquete Parquet versionado publicado por PROVIDENTIA/PDI, sin recalcular ciencia ni lógica de decisión.',
        },
        {
          title: 'Validación fail-closed del contrato',
          body: 'El validador Python rechaza paquetes incompletos, corruptos, vencidos o semánticamente inválidos antes de publicar cualquier release.',
        },
        {
          title: 'Publicación inmutable',
          body: 'Releases raw y validated bajo identificadores fijos; no se sobrescriben releases existentes.',
        },
        {
          title: 'Modelado dimensional dbt',
          body: 'Staging, cinco dimensiones y tres hechos en DuckDB que preservan columnas, grains y conteos del upstream.',
        },
        {
          title: 'Marts y export listos para BI',
          body: 'Dos marts de negocio y export Parquet para Power BI Desktop, con medidas SELECTEDVALUE-safe que evitan sumas inseguras entre alternativas analíticas.',
        },
        {
          title: 'Orquestación Airflow',
          body: 'Un DAG local disparado manualmente encadena validación → publicación → dbt → export, llamando solo a CLIs y funciones existentes.',
        },
        {
          title: 'Arquitectura AWS objetivo + CI',
          body: 'Terraform define S3/IAM/CloudWatch como destino de diseño; fmt/init/validate/test corren sin credenciales. GitHub Actions evidencia el flujo completo. Sin terraform apply.',
        },
      ],
      nextStep:
        'Caelum afirma gobernanza de contrato, modelado dimensional reproducible y handoff BI local. No afirma despliegue AWS, Airflow gestionado, dashboards en la nube, KPIs ejecutivos inventados ni un `.pbix` validado en el repositorio.',
    },
    en: {
      rank: '04 — Featured',
      label: 'Analytics Engineering · BI · Data Quality',
      nodeSummary: 'Governed analytics platform',
      tagline:
        'Analytics Engineering platform that turns validated forecasting and capacity-planning outputs into governed, BI-ready datasets through data contracts, dbt, DuckDB, and reproducible orchestration.',
      description:
        'Caelum is the downstream operationalization layer for the real PROVIDENTIA/PDI analytical upstream. It consumes versioned Parquet packages published by PROVIDENTIA and deliberately does not recalculate forecasts, uncertainty, capacity decisions, buffers, risk, or policy logic. Its job is fail-closed contract validation, immutable release publication, a thin DuckDB/dbt dimensional projection, and Power BI–ready marts — with local Airflow orchestration and a Terraform AWS target architecture validated without deployment.',
      problem:
        'Validated analytical outputs are not enough on their own for a trustworthy BI flow: they need contracts, validation, lineage, dimensional models, and a consumption layer that preserves their grain and semantics.',
      role: 'Implementation of the governed consumer: fail-closed external-contract validation in Python, immutable raw/validated release publication, a DuckDB/dbt layer with staging, dimensions, facts, and marts, Parquet export ready for Power BI Desktop, local orchestration via one Airflow DAG, an AWS target architecture in Terraform (no apply), and full GitHub Actions CI.',
      impact:
        'The result is a reproducible, governed path from the upstream package to BI-ready marts: the contract fails closed on invalid packages, dimensional layers preserve upstream grain, 103 dbt tests guard integrity, and the Power BI export blocks unsafe aggregations. AWS remains a validated target architecture with no credentials and no cloud spend.',
      impactHighlight:
        'Fail-closed contract → 8 staging → 5 dimensions → 3 facts → 2 marts → Power BI export → Airflow → Terraform + CI.',
      highlights: [
        'Versioned external data contract (fail-closed)',
        'Immutable raw/validated releases',
        'Grain-preserving dimensional modeling',
        '103 dbt integrity and relationship tests',
        'Power BI Desktop–safe consumption layer',
        'Local Apache Airflow orchestration',
        'Credential-free Terraform validation (no apply)',
        'Full GitHub Actions CI (Python, dbt, Airflow, export, Terraform)',
      ],
      artifacts: [
        'Contract validator / ingestion layer',
        'dbt models and tests',
        'DuckDB analytical layer',
        'Power BI export specification',
        'Airflow DAG',
        'Terraform AWS architecture',
        'GitHub Actions workflow',
      ],
      annotation: 'dbt · DuckDB · Power BI · Airflow · Terraform',
      signals: [
        'Analytics Engineering',
        'SQL',
        'dbt',
        'Data Quality',
        'Dimensional Modeling',
        'Power BI',
        'Airflow',
        'Terraform',
        'CI/CD',
      ],
      privacyNote:
        'PROVIDENTIA/PDI analytical outputs are upstream and are not recalculated here. There is no real AWS deployment, no cloud credentials, and no infrastructure spend (USD 0). No `.pbix` is committed; AWS is architecture/IaC validation only — not production cloud operation.',
      flowLead:
        'Steps 1–6 are local and reproducible. Step 7 documents the AWS target architecture and CI validation — without deployment.',
      flowSteps: [
        {
          title: 'Validated upstream package',
          body: 'Consume a versioned Parquet package published by PROVIDENTIA/PDI, without recalculating science or decision logic.',
        },
        {
          title: 'Fail-closed contract validation',
          body: 'The Python validator rejects incomplete, corrupt, stale, or semantically invalid packages before any release is published.',
        },
        {
          title: 'Immutable release publication',
          body: 'Raw and validated releases under fixed identifiers; existing releases are never overwritten.',
        },
        {
          title: 'dbt dimensional modeling',
          body: 'Staging, five dimensions, and three facts on DuckDB that preserve upstream columns, grains, and row counts.',
        },
        {
          title: 'BI-ready marts and export',
          body: 'Two business marts and a Parquet export for Power BI Desktop, with SELECTEDVALUE-safe measures that block unsafe sums across analytical alternatives.',
        },
        {
          title: 'Airflow orchestration',
          body: 'One manually triggered local DAG chains validation → publish → dbt → export, calling only existing CLIs and functions.',
        },
        {
          title: 'AWS target architecture + CI',
          body: 'Terraform defines S3/IAM/CloudWatch as a design target; fmt/init/validate/test run without credentials. GitHub Actions evidences the full flow. No terraform apply.',
        },
      ],
      nextStep:
        'Caelum claims contract governance, reproducible dimensional modeling, and a local BI handoff. It does not claim AWS deployment, managed Airflow, cloud dashboards, invented executive KPIs, or a validated `.pbix` in the repository.',
    },
  },

  // ALETHEIA (F1) — copy reused from i18n/messages/aletheia.js and
  // casework/aletheia/data.js (hero, stages, neutral framing, metrics, freeze
  // status). No new sources, analysis, metrics or claims: the evidence pack's
  // own rule is "select · simplify · visualize · explain · present". The
  // project is `hidden` in projects/registry.js until F4.
  aletheia: {
    es: {
      rank: '05 — Featured',
      label: 'Evidence · Research · Data Analysis',
      nodeSummary: 'Investigación guiada por evidencia',
      tagline:
        'Investigación guiada por evidencia sobre el trabajo en Argentina: 18 preguntas investigadas con fuentes públicas, resultados auditables y límites explícitos cuando la evidencia no alcanza.',
      description:
        'ALETHEIA trabaja con fuentes públicas argentinas. Antes de combinar datos verifica qué representan, cómo se construyeron y qué cambios metodológicos atravesaron. No evalúa si una cifra oficial es correcta o no: evalúa bajo qué condiciones dos series pueden compararse entre sí.',
      problem:
        'Datasets similares no necesariamente miden lo mismo. El problema no era conseguir más datos: era saber cuáles podían compararse realmente.',
      role: 'Investigación y capa de publicación del caso: registro de fuentes y de su procedencia, qué representa cada dato (statistical objects), cambios metodológicos (breaks), matriz de compatibilidad y rulings sobre qué comparaciones están justificadas y cuáles no.',
      impact:
        'El resultado es un registro auditable de decisiones de comparabilidad: 22 registros en el manifiesto de fuentes, 16 objetos estadísticos, 8 breaks documentados y 8 relaciones de compatibilidad. De 36 asuntos residuales, 2 se resolvieron, 26 quedaron como limitaciones aceptadas y 8 fuera de alcance. La research foundation está cerrada y congelada, con 749 tests y 0 failures.',
      impactHighlight:
        'Datos → origen → qué representan → cambios → compatibilidad → evidencia → decisión.',
      highlights: [
        'Evalúa condiciones de comparabilidad, no la exactitud de las cifras oficiales',
        'Tres casos seleccionados: precios (GOV-002), IPC y EPH',
        'Rulings explícitos, incluido lo que no debe hacerse: sin unión directa de fuentes, sin splice automático, sin IPC alternativo',
        'Cada claim clasificado en cuatro niveles de soporte',
        'Research foundation congelada y verificable (749 tests, 0 failures)',
      ],
      artifacts: [
        'Evidence Case público',
        'Full research (vista estilizada)',
        'Rulings seleccionados',
        'Source Manifest y Compatibility Matrix',
        'Break Registry',
      ],
      annotation: 'Evidence · Comparabilidad · Fuentes públicas argentinas',
      signals: ['Evidence', 'Research', 'Data Analysis', 'Comparability', 'Provenance'],
      flowLead: 'Recorrido del caso, del problema a la verificación.',
      flowSteps: [
        {
          title: 'El problema',
          body: 'Datasets similares no necesariamente miden lo mismo.',
        },
        {
          title: 'Cómo decide qué se puede comparar',
          body: 'Antes de usar un dato, ALETHEIA exige justificar qué representa y con qué puede compararse.',
        },
        {
          title: 'Casos seleccionados',
          body: 'Tres ejemplos: precios, IPC y EPH.',
        },
        {
          title: 'Lo que se niega a hacer',
          body: 'También registra cuándo un análisis no debería hacerse.',
        },
        {
          title: 'Qué sostiene la evidencia',
          body: 'Cada claim queda clasificado según la fuerza de la evidencia disponible.',
        },
        {
          title: 'Verificación',
          body: 'Artefactos seleccionados de la capa pública. La research foundation completa vive fuera de esta página.',
        },
      ],
      evidenceLead:
        'El Evidence Case documenta el razonamiento completo. Un evaluador puede consultar:',
      evidenceItems: [
        'Evidence Case de ALETHEIA (casos GOV-002, IPC y EPH)',
        'Full research (vista estilizada)',
        'Rulings seleccionados',
        'Detalles técnicos de verificación (freeze y tests)',
      ],
      nextStep:
        'La research foundation está cerrada y congelada. La capa pública presenta una selección de casos y no incorpora nuevas fuentes, análisis ni métricas.',
    },
    en: {
      rank: '05 — Featured',
      label: 'Evidence · Research · Data Analysis',
      nodeSummary: 'Evidence-driven research',
      tagline:
        'Evidence-driven research on labor in Argentina: 18 research questions using public sources, auditable findings, and explicit limits when the evidence is insufficient.',
      description:
        'ALETHEIA works with Argentine public sources. Before combining data it checks what they represent, how they were built and which methodological changes they went through. It does not evaluate whether an official figure is correct: it evaluates under what conditions two series can be compared with each other.',
      problem:
        'Similar datasets do not necessarily measure the same thing. The problem was not getting more data: it was knowing which datasets could actually be compared.',
      role: 'Research and publication layer of the case: a registry of sources and their provenance, what each dataset represents (statistical objects), methodological changes (breaks), a compatibility matrix, and rulings on which comparisons are justified and which are not.',
      impact:
        'The result is an auditable record of comparability decisions: 22 records in the source manifest, 16 statistical objects, 8 documented breaks and 8 compatibility relationships. Of 36 residual issues, 2 were resolved, 26 stayed as accepted limitations and 8 as out of scope. The research foundation is closed and frozen, with 749 tests and 0 failures.',
      impactHighlight:
        'Data → origin → what it represents → changes → compatibility → evidence → decision.',
      highlights: [
        'Evaluates comparability conditions, not the accuracy of official figures',
        'Three selected cases: prices (GOV-002), CPI/IPC and EPH',
        'Explicit rulings, including what must not be done: no direct pooling of sources, no automatic splice, no alternative CPI',
        'Every claim classified into four support levels',
        'Frozen, verifiable research foundation (749 tests, 0 failures)',
      ],
      artifacts: [
        'Public Evidence Case',
        'Full research (styled view)',
        'Selected rulings',
        'Source Manifest and Compatibility Matrix',
        'Break Registry',
      ],
      annotation: 'Evidence · Comparability · Argentine public data',
      signals: ['Evidence', 'Research', 'Data Analysis', 'Comparability', 'Provenance'],
      flowLead: 'Case walkthrough, from the problem to verification.',
      flowSteps: [
        {
          title: 'The problem',
          body: 'Similar datasets do not necessarily measure the same thing.',
        },
        {
          title: 'How it decides what can be compared',
          body: 'Before using a datapoint, ALETHEIA requires a justification of what it represents and what it can be compared with.',
        },
        {
          title: 'Selected cases',
          body: 'Three examples: prices, CPI/IPC, and EPH.',
        },
        {
          title: 'What it refuses to do',
          body: 'It also records when an analysis should not be done.',
        },
        {
          title: 'What the evidence supports',
          body: 'Each claim is classified by the strength of the available evidence.',
        },
        {
          title: 'Verification',
          body: 'Selected artifacts from the public layer. The full research foundation lives outside this page.',
        },
      ],
      evidenceLead:
        'The Evidence Case documents the full reasoning. A reviewer can consult:',
      evidenceItems: [
        'ALETHEIA Evidence Case (GOV-002, CPI/IPC and EPH cases)',
        'Full research (styled view)',
        'Selected rulings',
        'Technical verification details (freeze and tests)',
      ],
      nextStep:
        'The research foundation is closed and frozen. The public layer presents a selection of cases and adds no new sources, analysis or metrics.',
    },
  },

  hogares: {
    es: {
      rank: '05 — Secondary',
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
      rank: '05 — Secondary',
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
      rank: '06 — Secondary',
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
      rank: '06 — Secondary',
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

/**
 * Human-readable labels for project categories and the `all` pseudo-filter
 * (PLAN-FROZEN v1.1, F1). The category ids and the visibility rule live in
 * projects/categories.js; only the wording lives here. Every category has a
 * label even when its filter is hidden — the label is used the moment a second
 * project activates it.
 */
export const categoryLabels = {
  es: {
    all: 'Todos',
    'analytics-bi': 'Analytics & BI',
    'ds-ml': 'Data Science / ML',
    'applied-ai': 'Applied AI',
    products: 'Products & Engineering',
    'evidence-research': 'Evidence / Research',
  },
  en: {
    all: 'All',
    'analytics-bi': 'Analytics & BI',
    'ds-ml': 'Data Science / ML',
    'applied-ai': 'Applied AI',
    products: 'Products & Engineering',
    'evidence-research': 'Evidence / Research',
  },
}

export function pickCategoryLabel(categoryId, language) {
  const labels = categoryLabels[language] || categoryLabels.es
  return labels[categoryId] ?? categoryId
}
