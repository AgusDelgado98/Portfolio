/** Curated publication chart extract from frozen ALETHEIA metadata. Do not invent values. */
export default {
  "sourceCoverage": {
    "sourceArtifact": "metadata/source_manifest/source-manifest.json",
    "evidenceBasis": "coverage_period.start/end as recorded in the frozen source manifest; sources with null start omitted; open end remains null (not inferred)",
    "frozenClaim": "ALETHEIA works over public sources with documented, non-uniform temporal coverage windows",
    "axisStart": 1996,
    "axisEnd": 2026,
    "axisNote": "Display axis only; open-ended bars extend to axisEnd without claiming that year as a documented coverage end",
    "sources": [
      {
        "id": "SRC-SRT-COBERTURA-FINANCIACION",
        "label": "SRT",
        "start": "1996-07",
        "end": null,
        "startYear": 1996.5,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-OEDE-MLER-2021",
        "label": "OEDE MLER",
        "start": "1996-01",
        "end": "2021-12",
        "startYear": 1996.0,
        "endYear": 2021.9166666666667,
        "openEnded": false
      },
      {
        "id": "SRC-BCRA-ITCRM",
        "label": "BCRA ITCRM",
        "start": "1997-01",
        "end": null,
        "startYear": 1997.0,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-INDEC-EPH",
        "label": "EPH",
        "start": "2003-Q3",
        "end": null,
        "startYear": 2003.5,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-SSS-BESS",
        "label": "BESS",
        "start": "2011",
        "end": null,
        "startYear": 2011.0,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-STEYSS-SIPA-TRABAJO-REGISTRADO",
        "label": "SIPA",
        "start": "2012-01",
        "end": null,
        "startYear": 2012.0,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-ANSES-ESTADISTICAS-SEGURIDAD-SOCIAL",
        "label": "ANSES",
        "start": "2013",
        "end": null,
        "startYear": 2013.0,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-ENERGIA-PRECIOS-SURTIDOR",
        "label": "ENERGIA",
        "start": "2016-01",
        "end": "2026-09",
        "startYear": 2016.0,
        "endYear": 2026.6666666666667,
        "openEnded": false
      },
      {
        "id": "SRC-SEPA-PRECIOS",
        "label": "SEPA",
        "start": "2016",
        "end": null,
        "startYear": 2016.0,
        "endYear": null,
        "openEnded": true
      },
      {
        "id": "SRC-INDEC-IPC-NACIONAL",
        "label": "IPC",
        "start": "2016-12",
        "end": null,
        "startYear": 2016.9166666666667,
        "endYear": null,
        "openEnded": true
      }
    ]
  },
  "breakTimeline": {
    "sourceArtifact": "metadata/statistical_breaks/statistical-break-registry.json",
    "evidenceBasis": "IPC and EPH break records: effective_period, break_type, materiality, comparability_impact class, governance disposition",
    "frozenClaim": "IPC and EPH contain ruled methodological breaks; automatic splice across breaks is not established",
    "axisStart": 2005,
    "axisEnd": 2026,
    "events": [
      {
        "id": "BRK-INDEC-IPC-2007-2015-COMPARABILITY",
        "series": "IPC",
        "effectivePeriod": "2007-01 through 2015-12 (outer provisional window; ruled boundary, not a final determination — internal sub-breaks within this window remain unresolved)",
        "breakType": null,
        "materiality": "MATERIAL",
        "comparabilityImpact": "NOT_HOMOGENEOUS",
        "disposition": "RULED",
        "startYear": 2007.0,
        "endYear": 2015.999,
        "markKind": "window"
      },
      {
        "id": "BRK-INDEC-IPC-2016-2017-RESTART",
        "series": "IPC",
        "effectivePeriod": "approximately 2016-2017",
        "breakType": "METHODOLOGY",
        "materiality": "MATERIAL",
        "comparabilityImpact": "NOT_HOMOGENEOUS",
        "disposition": "RULED",
        "startYear": 2016.0,
        "endYear": 2017.999,
        "markKind": "window"
      },
      {
        "id": "BRK-INDEC-EPH-2015-2016-DISCONTINUITY",
        "series": "EPH",
        "effectivePeriod": "approximately 2015-2016",
        "breakType": "METHODOLOGY",
        "materiality": "MATERIAL",
        "comparabilityImpact": "OPEN",
        "disposition": "RULED",
        "startYear": 2015.0,
        "endYear": 2016.999,
        "markKind": "window"
      },
      {
        "id": "BRK-INDEC-EPH-2019-OPERATIONAL-CHANGE",
        "series": "EPH",
        "effectivePeriod": "around 2019",
        "breakType": "WEIGHTING",
        "materiality": "MATERIAL",
        "comparabilityImpact": "NOT_HOMOGENEOUS",
        "disposition": "RULED",
        "startYear": 2019.0,
        "endYear": 2019.999,
        "markKind": "point"
      },
      {
        "id": "BRK-INDEC-EPH-2020-COVID-COLLECTION",
        "series": "EPH",
        "effectivePeriod": "2020",
        "breakType": "DATA_COLLECTION",
        "materiality": "MATERIAL",
        "comparabilityImpact": "NOT_HOMOGENEOUS",
        "disposition": "RULED",
        "startYear": 2020.0,
        "endYear": 2020.999,
        "markKind": "point"
      },
      {
        "id": "BRK-INDEC-EPH-2023-Q4-INFORMAL-LABOUR",
        "series": "EPH",
        "effectivePeriod": "2023-Q4",
        "breakType": "QUESTIONNAIRE",
        "materiality": "MATERIAL",
        "comparabilityImpact": "OPEN",
        "disposition": "RULED",
        "startYear": 2023.75,
        "endYear": 2023.999,
        "markKind": "point"
      },
      {
        "id": "BRK-INDEC-EPH-2024-Q4-INCOME-MEASUREMENT",
        "series": "EPH",
        "effectivePeriod": "2024-Q4",
        "breakType": "QUESTIONNAIRE",
        "materiality": "MATERIAL",
        "comparabilityImpact": "OPEN",
        "disposition": "RULED",
        "startYear": 2024.75,
        "endYear": 2024.999,
        "markKind": "point"
      }
    ]
  },
  "compatibilityMatrix": {
    "sourceArtifact": "metadata/metric_compatibility/metric-compatibility-matrix.json",
    "evidenceBasis": "Existing compatibility_status values only; no invented pairwise cells",
    "frozenClaim": "Distinct statistical objects are not interchangeable; some relations are descriptive-only or conditional",
    "statuses": [
      "FORBIDDEN",
      "ALLOWED_WITH_CONDITIONS",
      "DESCRIPTIVE_ONLY"
    ],
    "featured": [
      {
        "id": "CMP-PERSON-JOB-EQUIVALENCE",
        "left": "PERSON",
        "right": "JOB",
        "status": "FORBIDDEN",
        "rationale": "PERSON and JOB are distinct statistical objects and cannot be treated as equivalent."
      },
      {
        "id": "CMP-PERSON-EMPLOYMENT-RELATIONSHIP-EQUIVALENCE",
        "left": "PERSON",
        "right": "EMPLOYMENT_RELATIONSHIP",
        "status": "FORBIDDEN",
        "rationale": "PERSON and EMPLOYMENT_RELATIONSHIP are distinct statistical objects and cannot be treated as equivalent."
      },
      {
        "id": "CMP-SALARIED-MONOTRIBUTO-UNIQUE-PERSON",
        "left": "SALARIED_EMPLOYMENT_STOCK + MONOTRIBUTO_STOCK",
        "right": "UNIQUE_PERSONS",
        "status": "ALLOWED_WITH_CONDITIONS",
        "rationale": "Adding the two stocks without the stated adjustment does not establish a unique-person total; no overlap magnitude is inferred."
      },
      {
        "id": "CMP-STOCK-DIVERGENCE-LEVEL-1-COMPOSITION",
        "left": "STOCK_DIVERGENCE",
        "right": "LEVEL_1_COMPOSITION",
        "status": "DESCRIPTIVE_ONLY",
        "rationale": "Stock movement may support a LEVEL_1 description of composition or divergence only."
      },
      {
        "id": "CMP-STOCK-DIVERGENCE-LEVEL-2-TRANSITION",
        "left": "STOCK_DIVERGENCE",
        "right": "LEVEL_2_TRANSITION",
        "status": "FORBIDDEN",
        "rationale": "Opposite movements in aggregate stocks do not by themselves identify individual transitions."
      },
      {
        "id": "CMP-STOCK-DIVERGENCE-LEVEL-3-SUBSTITUTION",
        "left": "STOCK_DIVERGENCE",
        "right": "LEVEL_3_SUBSTITUTION",
        "status": "FORBIDDEN",
        "rationale": "Opposite movements in aggregate stocks do not by themselves establish substitution."
      }
    ],
    "full": [
      {
        "id": "CMP-PERSON-JOB-EQUIVALENCE",
        "left": "PERSON",
        "right": "JOB",
        "status": "FORBIDDEN",
        "rationale": "PERSON and JOB are distinct statistical objects and cannot be treated as equivalent.",
        "conditions": []
      },
      {
        "id": "CMP-PERSON-EMPLOYMENT-RELATIONSHIP-EQUIVALENCE",
        "left": "PERSON",
        "right": "EMPLOYMENT_RELATIONSHIP",
        "status": "FORBIDDEN",
        "rationale": "PERSON and EMPLOYMENT_RELATIONSHIP are distinct statistical objects and cannot be treated as equivalent.",
        "conditions": []
      },
      {
        "id": "CMP-PERSON-TAX-REGISTRATION-EQUIVALENCE",
        "left": "PERSON",
        "right": "TAX_REGISTRATION",
        "status": "FORBIDDEN",
        "rationale": "PERSON and TAX_REGISTRATION are distinct statistical objects and cannot be treated as equivalent.",
        "conditions": []
      },
      {
        "id": "CMP-JOB-TAX-REGISTRATION-EQUIVALENCE",
        "left": "JOB",
        "right": "TAX_REGISTRATION",
        "status": "FORBIDDEN",
        "rationale": "JOB and TAX_REGISTRATION are distinct statistical objects and cannot be treated as equivalent.",
        "conditions": []
      },
      {
        "id": "CMP-SALARIED-MONOTRIBUTO-UNIQUE-PERSON",
        "left": "SALARIED_EMPLOYMENT_STOCK + MONOTRIBUTO_STOCK",
        "right": "UNIQUE_PERSONS",
        "status": "ALLOWED_WITH_CONDITIONS",
        "rationale": "Adding the two stocks without the stated adjustment does not establish a unique-person total; no overlap magnitude is inferred.",
        "conditions": [
          "The source supplies person-level deduplication or an explicit overlap adjustment for people appearing in both stocks."
        ]
      },
      {
        "id": "CMP-STOCK-DIVERGENCE-LEVEL-1-COMPOSITION",
        "left": "STOCK_DIVERGENCE",
        "right": "LEVEL_1_COMPOSITION",
        "status": "DESCRIPTIVE_ONLY",
        "rationale": "Stock movement may support a LEVEL_1 description of composition or divergence only.",
        "conditions": [
          "Use is limited to describing stock composition or divergence and does not identify individual movement."
        ]
      },
      {
        "id": "CMP-STOCK-DIVERGENCE-LEVEL-2-TRANSITION",
        "left": "STOCK_DIVERGENCE",
        "right": "LEVEL_2_TRANSITION",
        "status": "FORBIDDEN",
        "rationale": "Opposite movements in aggregate stocks do not by themselves identify individual transitions.",
        "conditions": []
      },
      {
        "id": "CMP-STOCK-DIVERGENCE-LEVEL-3-SUBSTITUTION",
        "left": "STOCK_DIVERGENCE",
        "right": "LEVEL_3_SUBSTITUTION",
        "status": "FORBIDDEN",
        "rationale": "Opposite movements in aggregate stocks do not by themselves establish substitution.",
        "conditions": []
      }
    ]
  },
  "outcomes": null
}
