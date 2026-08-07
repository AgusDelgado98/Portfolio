export const elogEs = {
  "stagePrefix": "Etapa {number}",
  "evidence": "Evidencia",
  "chartUnavailable": "Artefacto de gráfico no disponible",
  "chartUnavailableAria": "Gráfico no disponible",
  "chartAlt": "Gráfico del caso de estudio",
  "datamodelAria": "Vista de entidades y relaciones",
  "temporalAria": "Partición temporal train / validation / test",
  "temporalTrain": "Train",
  "temporalValidation": "Validation",
  "temporalTest": "Test final",
  "temporalRoleFit": "Solo ajuste",
  "temporalRoleSelect": "Modelo + umbral",
  "temporalRoleReport": "Reportar una vez",
  "temporalRows": "{rows} filas · {rate} positivos",
  "synthetic": {
    "label": "Datos sintéticos",
    "aria": "Declaración de datos sintéticos",
    "statement": "Todos los datos utilizados en este caso de estudio son completamente sintéticos y fueron creados exclusivamente con fines demostrativos. No contienen información real de pacientes, profesionales ni instituciones médicas."
  },
  "privateRepo": {
    "label": "Repositorio privado",
    "note": "Recorrido técnico disponible a solicitud"
  },
  "hero": {
    "badge": "Registro de Ingeniería",
    "caseLine": "Clinic No-Show · Paradigm",
    "pipeline": "Pipeline {version}",
    "kicker": "Cómo construyo · registro de decisiones",
    "title": "Registro de Ingeniería · Inasistencia a turnos",
    "lede": "Un registro curado de cómo un problema operativo sintético de clínica se convirtió en un modelo de riesgo consciente de leakage y en un workspace Paradigm — no es una segunda implementación analítica."
  },
  "actions": {
    "aria": "Acciones del Registro de Ingeniería",
    "backToAtlas": "Volver al Atlas",
    "viewParadigm": "Ver Paradigm",
    "repository": "Repositorio"
  },
  "status": {
    "loading": "Cargando artefactos del caso…",
    "ready": "Evidencia cargada desde portfolio_manifest.json y artefactos asociados.",
    "fallback": "Artefactos en vivo no disponibles — se muestran valores de respaldo del caso publicado.",
    "missing": " Faltan: {list}."
  },
  "tocAria": "Índice de etapas",
  "pathFast": "Ruta rápida:",
  "pathFastBody": "títulos, métricas, diagramas, gráficos.",
  "pathTech": "Ruta técnica:",
  "pathTechBody": "notas metodológicas expandibles bajo cada etapa.",
  "railAria": "Progreso del Registro de Ingeniería",
  "stages": {
    "problem": {
      "title": "Problema operativo",
      "rail": "Problema",
      "fast": "Clínica ambulatoria de seis especialidades · pérdida de capacidad por no-show · priorización previa a la visita."
    },
    "data": {
      "title": "Diseño de datos sintéticos",
      "rail": "Datos",
      "fast": "{appointments} turnos · {patients} pacientes · seed {seed}."
    },
    "quality": {
      "title": "Calidad de datos",
      "rail": "Calidad",
      "fast": "Defectos inyectados resueltos: duplicados, mayúsculas, nulos, desajustes de especialidad."
    },
    "eda": {
      "title": "Análisis exploratorio",
      "rail": "Análisis",
      "fast": "Patrones sintéticos más fuertes: lead time, canal, especialidad, historial, hora."
    },
    "features": {
      "title": "Ingeniería de features",
      "rail": "Features",
      "fast": "Campos crudos de reserva → 22 features pre-visita · exclusiones de leakage."
    },
    "model": {
      "title": "Desarrollo del modelo",
      "rail": "Modelo",
      "fast": "Comparar baseline, regresión logística, random forest e hist GB — ranking por ROC AUC y AP."
    },
    "validation": {
      "title": "Validación temporal",
      "rail": "Validación",
      "fast": "Train → validation (umbral) → test final intacto reportado una vez."
    },
    "drivers": {
      "title": "Interpretación del modelo",
      "rail": "Interpretación",
      "fast": "Regresión logística elegida por interpretabilidad dentro del margen de AP en validation."
    },
    "product": {
      "title": "De análisis a producto",
      "rail": "Producto",
      "fast": "Pack de evidencia → Paradigm Workspaces → Clinic Case Study."
    },
    "limits": {
      "title": "Limitaciones y decisiones",
      "rail": "Limitaciones",
      "fast": "Juicio antes que humo: señal sintética, lift moderado, umbral agresivo, sin uso clínico."
    },
    "outcome": {
      "title": "Resultado final",
      "rail": "Resultado",
      "fast": "Un camino reproducible desde la definición del problema hasta un workspace operativo."
    }
  },
  "problem": {
    "p1": "Una clínica ambulatoria privada agenda visitas con seis profesionales y seis especialidades. Los pacientes que no cancelan ni asisten dejan tiempo clínico ocioso y listas de espera más largas.",
    "p2": "Objetivo: priorizar el outreach de confirmación según riesgo de no-show en el momento de reserva / pre-visita — alcance solo operativo, sin diagnóstico clínico.",
    "constraints": "Restricciones del escenario",
    "specialties": "Especialidades: {list}",
    "channels": "Canales: web · phone · reception",
    "syntheticPhi": "Datos completamente sintéticos — sin PHI real",
    "nonClinical": "Modelado operativo no clínico",
    "techSummary": "Notas metodológicas — encuadre del problema",
    "techBody": "El caso se concentra en el riesgo de inasistencia y sus indicadores operativos. Los criterios de éxito enfatizan reproducibilidad, límites de leakage y una señal sintética honesta — no validez clínica de producción."
  },
  "data": {
    "cleaned": "Turnos limpios",
    "eligibleRows": "Filas elegibles para modelado",
    "eligibleRate": "Tasa de no-show elegible",
    "dateRange": "Rango de fechas",
    "entities": {
      "patients": {
        "label": "Pacientes",
        "note": "~2.800 pacientes sintéticos"
      },
      "professionals": {
        "label": "Profesionales",
        "note": "6 clínicos · 1 por especialidad"
      },
      "specialties": {
        "label": "Especialidades",
        "note": "6 especialidades ambulatorias"
      },
      "appointments": {
        "label": "Turnos",
        "note": "12.008 brutas · 12.000 limpias"
      }
    },
    "relPatient": "Paciente → muchos turnos",
    "relPro": "Profesional → Especialidad (1:1 en este diseño)",
    "relAppt": "Turno → Paciente + Profesional + Especialidad",
    "target": "Target: {target} sobre la población elegible ({population}). El dataset existe para demostrar un pipeline reproducible completo con issues de calidad controlados y límites de leakage.",
    "techSummary": "Ruta técnica — contrato del generador",
    "techSeed": "Seed {seed} para regeneración",
    "techFields": "Campos representativos: lead time, canal, especialidad, historial previo, hora, edad",
    "techPostVisit": "Campos post-visita existen solo para análisis descriptivo y no deben filtrar al modelo",
    "excerptSeed": "config / generación — seed reproducible"
  },
  "quality": {
    "rows": "Filas {before} → {after}{removed}",
    "removed": " (−{n})",
    "casing": "{n} mayúsculas de canal normalizadas",
    "nulls": "Nulos etiquetados como unknown: city_zone {city}, insurance {insurance}",
    "mismatches": "{n} desajustes especialidad↔profesional corregidos",
    "rule": "Regla: {rule}",
    "allowed": "Canales permitidos: {list}",
    "recomputed": "{n} filas recalculadas / casteadas",
    "techSummary": "Ruta técnica — validación de limpieza",
    "techBody": "Los defectos fueron inyectados a propósito por el generador y luego limpiados con reglas explícitas. El portfolio muestra evidencia before/after desde data_quality_summary.json / el manifesto — no KPIs decorativos.",
    "steps": {
      "drop_duplicate_appointment_ids": "Eliminar appointment_id duplicados",
      "normalize_booking_channel": "Normalizar booking_channel",
      "impute_null_categories": "Imputar categorías nulas",
      "fix_specialty_from_professional": "Corregir specialty desde professional",
      "recompute_lead_time_and_cast_types": "Recalcular lead time y castear tipos",
      "1_read_raw": "1. Lectura raw",
      "2_drop_duplicates": "2. Eliminar duplicados",
      "3_normalize_channel": "3. Normalizar canal",
      "4_label_nulls": "4. Etiquetar nulos",
      "5_fix_specialty_professional_mismatch": "5. Corregir desajuste specialty↔professional",
      "6_filter_channel": "6. Filtrar canales permitidos",
      "7_recast_datatypes": "7. Recastear tipos"
    },
    "rules": {
      "keep first occurrence of each appointment_id": "conservar la primera aparición de cada appointment_id",
      "appointments.specialty := professionals.specialty_code": "appointments.specialty := professionals.specialty_code"
    }
  },
  "eda": {
    "caveat": "Los patrones son sintéticos y no causales. Demuestran el proceso de análisis sobre una señal diseñada.",
    "leadTime": "Tasa de no-show por bucket de lead time",
    "channel": "Tasa de no-show por canal de reserva",
    "specialty": "Tasa de no-show por especialidad",
    "hour": "Tasa de no-show por hora de turno"
  },
  "insights": {
    "lead_time": {
      "finding": "El no-show crece con el lead time (0-3d: 6,7% en n=15; 15-30d: 15,3%). El bucket 31+ es demasiado escaso para interpretar (n=2).",
      "implication": "Los horizontes de reserva más largos siguen siendo candidatos prioritarios para outreach de confirmación.",
      "caveat": "Patrón inyectado a propósito por el generador; buckets extremos pueden ser escasos."
    },
    "channel": {
      "finding": "Reservas por teléfono (16,4%) superan recepción (10,7%).",
      "implication": "En un entorno real podrían justificarse scripts de recordatorio por canal.",
      "caveat": "Asociación sintética; no es prueba causal de que reservar por teléfono cause no-shows."
    },
    "specialty": {
      "finding": "Dermatología (17,2%) y ginecología (16,3%) quedan por encima de pediatría (10,6%).",
      "implication": "Los buffers de staffing por especialidad difieren; evitar overbooking único para todos.",
      "caveat": "Un profesional por especialidad en este diseño sintético."
    },
    "history": {
      "finding": "Pacientes con no-shows previos muestran riesgo elevado frente a primera visita y repeticiones limpias.",
      "implication": "La priorización consciente del historial es más accionable que la demografía sola.",
      "caveat": "Las features de historial están alineadas al generador y conocidas antes de la visita."
    }
  },
  "features": {
    "flowAria": "Flujo de transformación de features",
    "raw": "Crudo",
    "rawBody": "fechas · canal · especialidad · historial · edad",
    "transforms": "Transformaciones",
    "transformsBody": "buckets · rates · bands · flags · calendario",
    "modelReady": "Listo para modelo",
    "modelReadyBody": "{n} features",
    "examples": {
      "lead_time_bucket": "desde lead_time_days — Bandas discretas de horizonte",
      "historical_no_show_rate": "desde outcomes previos — Conocido al reservar",
      "hour_band": "desde appointment_hour — Mañana / tarde / tarde-noche",
      "age_group_feat": "desde patient_age — Bandas operativas de edad",
      "is_first_appointment": "desde previous_appointments — Indicador de primera visita",
      "calendar": "desde appointment_date — Estacionalidad de calendario"
    },
    "exampleCalendarName": "day_of_week / month",
    "leakageLabel": "Campos excluidos por leakage / no disponibles en la decisión",
    "techSummary": "Ruta técnica — lista de features y set de leakage",
    "featuresList": "Features: {list}",
    "unavailable": "no disponible",
    "excerptLeakage": "features.py — campos de leakage excluidos"
  },
  "model": {
    "intro": "La accuracy es una métrica primaria pobre bajo desbalance de clases (~{rate} positivos). La calidad de ranking (ROC AUC, average precision) guía la selección; el umbral es una elección operativa posterior.",
    "tableAria": "Comparación de modelos",
    "colModel": "Modelo",
    "colValRoc": "Val ROC AUC",
    "colValAp": "Val AP",
    "colTestRoc": "Test ROC AUC",
    "colTestAp": "Test AP",
    "rocCaption": "Curvas ROC (validation / comparación)",
    "prCaption": "Curvas precision–recall"
  },
  "validation": {
    "rocAuc": "ROC AUC en test final",
    "ap": "Average precision",
    "precision": "Precision @ umbral",
    "recall": "Recall @ umbral",
    "f1": "F1 @ umbral",
    "threshold": "Umbral seleccionado",
    "tradeoff": "Trade-off operativo",
    "tradeoffBody": "Alto recall ({recall}) con baja precision ({precision}) marca alrededor del {flagged} de la población de test final. Ese volumen de revisión necesitaría ajuste operativo antes de cualquier despliegue real.",
    "confusion": "Matriz de confusión del modelo seleccionado en test final",
    "techSummary": "Ruta técnica — protocolo de split y regla de umbral",
    "valCutoff": "Corte de validation: {date}",
    "testCutoff": "Corte de test: {date}",
    "protocol": "Protocolo: ajustar en {fit}; seleccionar en {select}; reportar en {report}",
    "excerptSplit": "features.py — cortes temporales por appointment_date",
    "excerptThreshold": "model.py — regla de umbral solo en validation"
  },
  "drivers": {
    "positive": "Coeficientes positivos más fuertes",
    "negative": "Coeficientes negativos más fuertes",
    "importance": "Permutation importance (modelo seleccionado)",
    "association": "Los coeficientes describen dirección asociativa en el modelo ajustado — no efectos causales. La fuerza asociativa puede invertir el signo respecto a un EDA ingenuo cuando features correlacionadas compiten (p. ej. conteos de historial vs. rates).",
    "whyLabel": "Por qué regresión logística",
    "why1": "Desempeño dentro del margen aceptado de 0,02 AP respecto al mejor modelo en validation",
    "why2": "Mayor interpretabilidad para revisión operativa",
    "why3": "Comunicación más simple de drivers ordenados",
    "why4": "Proceso de decisión más transparente que ensembles de caja negra",
    "selectionFallback": "En validation, la regresión logística queda dentro de 0,02 AP del mejor modelo (random_forest, AP=0.209); se prioriza interpretabilidad para revisión operativa. Las métricas finales usan solo el fold temporal de test intacto."
  },
  "product": {
    "flowAria": "Flujo Clinic Case Study en Paradigm",
    "flow": {
      "Overview": "Resumen",
      "Quality": "Calidad",
      "Patterns": "Patrones",
      "Model": "Modelo",
      "Drivers": "Drivers",
      "Prioritization": "Priorización",
      "Limitations": "Limitaciones"
    },
    "body": "El portfolio no ejecuta el modelo. Paradigm carga los mismos artefactos congelados para revisión operativa: overview, quality, patterns, model, drivers, prioritization y limitations.",
    "linksAria": "Enlaces de producto",
    "openWorkspace": "Abrir workspace Paradigm",
    "inspectRepo": "Inspeccionar metodología en el repo"
  },
  "limits": {
    "fromEvidence": {
      "Fully synthetic operational data": "Datos operativos completamente sintéticos",
      "Moderate predictive signal": "Señal predictiva moderada",
      "Scores not fully calibrated; use for ranking": "Scores no plenamente calibrados; usar para ranking",
      "One professional per specialty": "Un profesional por especialidad",
      "No clinical prediction or causal claims": "Sin predicción clínica ni claims causales",
      "Not an automated decision system": "No es un sistema de decisión automatizado"
    },
    "aggressive": "El umbral agresivo marca ~75% de la ventana de test final",
    "generator": "Relaciones creadas por el generador — no comportamiento orgánico de clínica",
    "noAdverse": "Sin acción adversa automatizada contra pacientes"
  },
  "outcome": {
    "delivered": [
      "Dataset sintético reproducible (seed 42)",
      "Pipeline de limpieza y validación",
      "Análisis exploratorio con gráficos seleccionados",
      "Protocolo de evaluación ML temporal",
      "Modelo de riesgo logístico interpretable",
      "Workspace Paradigm Clinic Case Study",
      "Pack de evidencia para portfolio (manifest + gráficos)"
    ],
    "synthesis": "El modelo aún no está listo para producción. El caso sirve como apoyo analítico para priorizar outreach, no como sistema clínico desplegado.",
    "quote": "Método antes que teatro: definir el momento de decisión, limpiar lo que se inyecta, partir en el tiempo, preferir métricas que sobrevivan al desbalance y publicar limitaciones junto al producto.",
    "techSummary": "Ruta técnica — reproducir el pipeline",
    "reproducePublic": "Desde la raíz del repositorio Paradigm",
    "reproducePrivate": "Comandos de reproducción (repositorio privado — recorrido disponible a solicitud)",
    "closeAria": "Cerrar Registro de Ingeniería",
    "backToTop": "Volver arriba",
    "returnToAtlas": "Volver al Atlas"
  }
}

export const elogEn = {
  "stagePrefix": "Stage {number}",
  "evidence": "Evidence",
  "chartUnavailable": "Chart artifact unavailable",
  "chartUnavailableAria": "Chart unavailable",
  "chartAlt": "Case study chart",
  "datamodelAria": "Entity relationship overview",
  "temporalAria": "Temporal train validation test split",
  "temporalTrain": "Train",
  "temporalValidation": "Validation",
  "temporalTest": "Final test",
  "temporalRoleFit": "Fit only",
  "temporalRoleSelect": "Model + threshold",
  "temporalRoleReport": "Report once",
  "temporalRows": "{rows} rows · {rate} positives",
  "synthetic": {
    "label": "Synthetic data",
    "aria": "Synthetic data declaration",
    "statement": "All data used in this case study is entirely synthetic and was created exclusively for demonstration purposes. It contains no real patient, professional, or medical information."
  },
  "privateRepo": {
    "label": "Private repository",
    "note": "Technical walkthrough available upon request"
  },
  "hero": {
    "badge": "Engineering Log",
    "caseLine": "Clinic No-Show · Paradigm",
    "pipeline": "Pipeline {version}",
    "kicker": "How I build · decision trail",
    "title": "Engineering Log · Clinic No-Show",
    "lede": "A curated record of how a synthetic clinic operations problem became a leakage-aware risk model and a Paradigm workspace — not a second analytics implementation."
  },
  "actions": {
    "aria": "Engineering Log actions",
    "backToAtlas": "Back to Atlas",
    "viewParadigm": "View Paradigm",
    "repository": "Repository"
  },
  "status": {
    "loading": "Loading case artifacts…",
    "ready": "Evidence loaded from portfolio_manifest.json and companion artifacts.",
    "fallback": "Live artifacts unavailable — showing embedded fallback values from the published case.",
    "missing": " Missing: {list}."
  },
  "tocAria": "Stage index",
  "pathFast": "Fast path:",
  "pathFastBody": "headings, metrics, diagrams, charts.",
  "pathTech": "Technical path:",
  "pathTechBody": "expandable methodology notes below each stage.",
  "railAria": "Engineering Log progress",
  "stages": {
    "problem": {
      "title": "Operational Problem",
      "rail": "Problem",
      "fast": "Six-specialty outpatient clinic · no-show capacity loss · pre-visit prioritization."
    },
    "data": {
      "title": "Synthetic Data Design",
      "rail": "Data",
      "fast": "{appointments} appointments · {patients} patients · seed {seed}."
    },
    "quality": {
      "title": "Data Quality",
      "rail": "Quality",
      "fast": "Injected defects resolved: duplicates, casing, nulls, specialty mismatches."
    },
    "eda": {
      "title": "Exploratory Analysis",
      "rail": "Analysis",
      "fast": "Strongest synthetic patterns: lead time, channel, specialty, history, hour."
    },
    "features": {
      "title": "Feature Engineering",
      "rail": "Features",
      "fast": "Raw booking fields → 22 pre-visit features · leakage fields excluded."
    },
    "model": {
      "title": "Model Development",
      "rail": "Model",
      "fast": "Compare baseline, logistic regression, random forest, histogram GB — rank by ROC AUC and AP."
    },
    "validation": {
      "title": "Temporal Validation",
      "rail": "Validation",
      "fast": "Train → validation (threshold) → untouched final test reported once."
    },
    "drivers": {
      "title": "Model Interpretation",
      "rail": "Interpretation",
      "fast": "Logistic regression selected for interpretability within the validation AP margin."
    },
    "product": {
      "title": "From Analysis to Product",
      "rail": "Product",
      "fast": "Evidence pack → Paradigm Workspaces → Clinic Case Study."
    },
    "limits": {
      "title": "Limitations and Decisions",
      "rail": "Limitations",
      "fast": "Judgment over hype: synthetic signal, modest lift, aggressive threshold, no clinical use."
    },
    "outcome": {
      "title": "Final Outcome",
      "rail": "Outcome",
      "fast": "A reproducible path from problem definition to an operational workspace."
    }
  },
  "problem": {
    "p1": "A private outpatient clinic books visits across six professionals and six specialties. Patients who neither cancel nor attend leave idle clinician time and longer waitlists.",
    "p2": "Objective: prioritize confirmation outreach for no-show risk at booking / pre-visit time — operational scope only, no clinical diagnosis.",
    "constraints": "Scenario constraints",
    "specialties": "Specialties: {list}",
    "channels": "Channels: web · phone · reception",
    "syntheticPhi": "Fully synthetic data — no real PHI",
    "nonClinical": "Non-clinical operational modeling",
    "techSummary": "Methodology notes — problem framing",
    "techBody": "The case focuses on no-show risk and its operational indicators. Success criteria emphasize reproducibility, leakage boundaries, and an honest synthetic signal — not production clinical validity."
  },
  "data": {
    "cleaned": "Cleaned appointments",
    "eligibleRows": "Eligible modeling rows",
    "eligibleRate": "Eligible no-show rate",
    "dateRange": "Date range",
    "entities": {
      "patients": {
        "label": "Patients",
        "note": "~2,800 synthetic patients"
      },
      "professionals": {
        "label": "Professionals",
        "note": "6 clinicians · 1 per specialty"
      },
      "specialties": {
        "label": "Specialties",
        "note": "6 outpatient specialties"
      },
      "appointments": {
        "label": "Appointments",
        "note": "12,008 raw · 12,000 cleaned"
      }
    },
    "relPatient": "Patient → many Appointments",
    "relPro": "Professional → Specialty (1:1 in this design)",
    "relAppt": "Appointment → Patient + Professional + Specialty",
    "target": "Target: {target} on the eligible population ({population}). The dataset exists to demonstrate a full reproducible pipeline with controlled quality issues and leakage boundaries.",
    "techSummary": "Technical path — generator contract",
    "techSeed": "Seed {seed} for regeneration",
    "techFields": "Representative fields: lead time, channel, specialty, prior history, hour, age",
    "techPostVisit": "Post-visit fields exist for descriptive analysis only and must not leak",
    "excerptSeed": "config / generation — reproducible seed"
  },
  "quality": {
    "rows": "Rows {before} → {after}{removed}",
    "removed": " (−{n})",
    "casing": "{n} channel casings normalized",
    "nulls": "Nulls labeled unknown: city_zone {city}, insurance {insurance}",
    "mismatches": "{n} specialty↔professional mismatches fixed",
    "rule": "Rule: {rule}",
    "allowed": "Allowed channels: {list}",
    "recomputed": "{n} rows recomputed / cast",
    "techSummary": "Technical path — cleaning validation",
    "techBody": "Defects were deliberately injected by the generator, then cleaned with explicit rules. The portfolio shows before/after evidence from data_quality_summary.json / the manifest — not decorative KPIs.",
    "steps": {
      "drop_duplicate_appointment_ids": "Drop duplicate appointment_ids",
      "normalize_booking_channel": "Normalize booking_channel",
      "impute_null_categories": "Impute null categories",
      "fix_specialty_from_professional": "Fix specialty from professional",
      "recompute_lead_time_and_cast_types": "Recompute lead time and cast types",
      "1_read_raw": "1. Read raw",
      "2_drop_duplicates": "2. Drop duplicates",
      "3_normalize_channel": "3. Normalize channel",
      "4_label_nulls": "4. Label nulls",
      "5_fix_specialty_professional_mismatch": "5. Fix specialty↔professional mismatch",
      "6_filter_channel": "6. Filter allowed channels",
      "7_recast_datatypes": "7. Recast datatypes"
    },
    "rules": {
      "keep first occurrence of each appointment_id": "keep first occurrence of each appointment_id",
      "appointments.specialty := professionals.specialty_code": "appointments.specialty := professionals.specialty_code"
    }
  },
  "eda": {
    "caveat": "Patterns are synthetic and not causal. They demonstrate analysis process on a designed signal.",
    "leadTime": "No-show rate by lead-time bucket",
    "channel": "No-show rate by booking channel",
    "specialty": "No-show rate by specialty",
    "hour": "No-show rate by appointment hour"
  },
  "insights": {
    "lead_time": {
      "finding": "No-show rises with lead time (0-3d: 6.7% on n=15; 15-30d: 15.3%). The 31+ bucket is too sparse to interpret (n=2).",
      "implication": "Longer booking horizons remain priority candidates for confirmation outreach.",
      "caveat": "Pattern was intentionally injected by the generator; extreme buckets may be sparse."
    },
    "channel": {
      "finding": "Phone bookings (16.4%) exceed reception (10.7%).",
      "implication": "Channel-specific reminder scripts may be warranted in a live setting.",
      "caveat": "Synthetic association; not causal proof that phone booking causes no-shows."
    },
    "specialty": {
      "finding": "Dermatology (17.2%) and gynecology (16.3%) sit above pediatrics (10.6%).",
      "implication": "Specialty-level staffing buffers differ; avoid one-size-fits-all overbooking.",
      "caveat": "One professional per specialty in this synthetic design."
    },
    "history": {
      "finding": "Patients with prior no-shows show elevated risk versus first-visit and clean repeats.",
      "implication": "History-aware prioritization is more actionable than demographics alone.",
      "caveat": "History features are generator-aligned and known before the visit."
    }
  },
  "features": {
    "flowAria": "Feature transformation flow",
    "raw": "Raw",
    "rawBody": "dates · channel · specialty · history · age",
    "transforms": "Transforms",
    "transformsBody": "buckets · rates · bands · flags · calendar",
    "modelReady": "Model-ready",
    "modelReadyBody": "{n} features",
    "examples": {
      "lead_time_bucket": "from lead_time_days — Discrete horizon bands",
      "historical_no_show_rate": "from prior outcomes — Known at booking time",
      "hour_band": "from appointment_hour — Morning / afternoon / late",
      "age_group_feat": "from patient_age — Operational age bands",
      "is_first_appointment": "from previous_appointments — First-visit indicator",
      "calendar": "from appointment_date — Calendar seasonality"
    },
    "exampleCalendarName": "day_of_week / month",
    "leakageLabel": "Excluded leakage / unavailable-at-decision fields",
    "techSummary": "Technical path — feature list and leakage set",
    "featuresList": "Features: {list}",
    "unavailable": "unavailable",
    "excerptLeakage": "features.py — excluded leakage fields"
  },
  "model": {
    "intro": "Accuracy is a poor primary metric under class imbalance (~{rate} positives). Ranking quality (ROC AUC, average precision) guides selection; thresholding is a later operational choice.",
    "tableAria": "Model comparison",
    "colModel": "Model",
    "colValRoc": "Val ROC AUC",
    "colValAp": "Val AP",
    "colTestRoc": "Test ROC AUC",
    "colTestAp": "Test AP",
    "rocCaption": "ROC curves (validation / comparison)",
    "prCaption": "Precision–recall curves"
  },
  "validation": {
    "rocAuc": "Final test ROC AUC",
    "ap": "Average precision",
    "precision": "Precision @ thr",
    "recall": "Recall @ thr",
    "f1": "F1 @ thr",
    "threshold": "Selected threshold",
    "tradeoff": "Operational trade-off",
    "tradeoffBody": "High recall ({recall}) with low precision ({precision}) flags about {flagged} of the final test population. That review volume would need operational adjustment before any real deployment.",
    "confusion": "Confusion matrix for the selected model on final test",
    "techSummary": "Technical path — split protocol and threshold rule",
    "valCutoff": "Validation cutoff: {date}",
    "testCutoff": "Test cutoff: {date}",
    "protocol": "Protocol: fit on {fit}; select on {select}; report on {report}",
    "excerptSplit": "features.py — temporal cutoffs by appointment_date",
    "excerptThreshold": "model.py — validation-only threshold rule"
  },
  "drivers": {
    "positive": "Strongest positive coefficients",
    "negative": "Strongest negative coefficients",
    "importance": "Permutation importance (selected model)",
    "association": "Coefficients describe associative direction in the fitted model — not causal effects. Association strength can reverse sign relative to naive EDA when correlated features compete (e.g. history counts vs. rates).",
    "whyLabel": "Why logistic regression",
    "why1": "Performance within the accepted 0.02 AP margin of the best validation model",
    "why2": "Stronger interpretability for operations review",
    "why3": "Simpler communication of ranked drivers",
    "why4": "More transparent decision process than black-box ensembles",
    "selectionFallback": "On validation, logistic regression is within 0.02 AP of best model (random_forest, AP=0.209); prefer interpretability for ops review. Final reported metrics use the untouched temporal test fold only."
  },
  "product": {
    "flowAria": "Paradigm Clinic Case Study flow",
    "flow": {
      "Overview": "Overview",
      "Quality": "Quality",
      "Patterns": "Patterns",
      "Model": "Model",
      "Drivers": "Drivers",
      "Prioritization": "Prioritization",
      "Limitations": "Limitations"
    },
    "body": "The portfolio does not run the model. Paradigm loads the same frozen artifacts for operational review: overview, quality, patterns, model, drivers, prioritization, and limitations.",
    "linksAria": "Product links",
    "openWorkspace": "Open Paradigm workspace",
    "inspectRepo": "Inspect methodology in repo"
  },
  "limits": {
    "fromEvidence": {
      "Fully synthetic operational data": "Fully synthetic operational data",
      "Moderate predictive signal": "Moderate predictive signal",
      "Scores not fully calibrated; use for ranking": "Scores not fully calibrated; use for ranking",
      "One professional per specialty": "One professional per specialty",
      "No clinical prediction or causal claims": "No clinical prediction or causal claims",
      "Not an automated decision system": "Not an automated decision system"
    },
    "aggressive": "Aggressive threshold flags ~75% of the final test window",
    "generator": "Generator-created relationships — not organic clinic behavior",
    "noAdverse": "No automated adverse action against patients"
  },
  "outcome": {
    "delivered": [
      "Reproducible synthetic dataset (seed 42)",
      "Cleaning and validation pipeline",
      "Exploratory analysis with selected charts",
      "Temporal ML evaluation protocol",
      "Interpretable logistic risk model",
      "Paradigm Clinic Case Study workspace",
      "Portfolio evidence pack (manifest + charts)"
    ],
    "synthesis": "The model is not deployment-ready. The case is analytical support for outreach prioritization, not a deployed clinical system.",
    "quote": "Method over theater: define the decision time, clean what you inject, split in time, prefer metrics that survive imbalance, and ship limitations next to the product.",
    "techSummary": "Technical path — reproduce the pipeline",
    "reproducePublic": "From the Paradigm repository root",
    "reproducePrivate": "Reproduction commands (private repository — walkthrough available upon request)",
    "closeAria": "Close Engineering Log",
    "backToTop": "Back to top",
    "returnToAtlas": "Return to Atlas"
  }
}
