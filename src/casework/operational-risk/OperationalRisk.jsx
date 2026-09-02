import React, { useEffect, useId } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { formatLocaleInt, formatLocalePct, formatLocaleNum } from '../../i18n/format.js'
import {
  CASEWORK_HASH,
  CASEWORK_OPERATIONAL_RISK_HASH,
  OPERATIONAL_RISK_EVIDENCE_BASE,
  PARADIGM_APP_URL,
} from '../../constants/links.js'
import { OPERATIONAL_RISK_EVIDENCE as EV } from './data.js'
import './operational-risk.css'

/**
 * Small presentational primitives, adapted from EngineeringLog.jsx's local
 * helpers. Duplicated on purpose (not imported) so this case stays fully
 * decoupled from the No-Show view — but they render through the exact same
 * `.elog-*` classes from engineering-log.css (already loaded globally via
 * App.jsx), so no visual system is duplicated, only ~40 lines of glue.
 */
function Stage({ id, number, title, children, fast }) {
  const { t } = useLanguage()
  return (
    <section className="elog-stage" id={`oprisk-${id}`} aria-labelledby={`oprisk-${id}-title`}>
      <header className="elog-stage-head">
        <span className="elog-stage-number" aria-hidden>
          {t('operationalRisk.stagePrefix', { number })}
        </span>
        <h2 id={`oprisk-${id}-title`}>{title}</h2>
        {fast ? <p className="elog-stage-fast">{fast}</p> : null}
      </header>
      <div className="elog-stage-body">{children}</div>
    </section>
  )
}

function EvidencePanel({ label, children }) {
  return (
    <aside className="elog-evidence" aria-label={label}>
      {label ? <span className="elog-evidence-label">{label}</span> : null}
      {children}
    </aside>
  )
}

function MetricGrid({ items }) {
  return (
    <dl className="elog-metrics">
      {items.map((item) => (
        <div key={item.label} className="elog-metric">
          <dt>{item.label}</dt>
          <dd>
            {item.value}
            {item.note ? <span className="elog-metric-note">{item.note}</span> : null}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function TechDetails({ summary, children }) {
  const panelId = useId()
  return (
    <details className="elog-tech">
      <summary id={panelId}>{summary}</summary>
      <div className="elog-tech-body" role="region" aria-labelledby={panelId}>
        {children}
      </div>
    </details>
  )
}

function DriverList({ title, items, tone }) {
  return (
    <div className={`elog-drivers elog-drivers--${tone}`}>
      <h3>{title}</h3>
      <ol>
        {(items || []).map((item) => (
          <li key={item.feature}>
            <code>{item.feature}</code>
            <span>{formatLocaleNum(item.coefficient, 3)}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

/** RULES vs ML bar comparison — true positives captured out of total positives, same N. */
function RulesVsMlBars({ mlValue, rulesValue, maxValue, mlLabel, rulesLabel }) {
  const mlPct = maxValue ? Math.round((mlValue / maxValue) * 100) : 0
  const rulesPct = maxValue ? Math.round((rulesValue / maxValue) * 100) : 0
  return (
    <div className="opr-compare">
      <div className="opr-compare-row">
        <span className="opr-compare-label">{mlLabel}</span>
        <span className="opr-compare-track">
          <span className="opr-compare-fill" style={{ width: `${mlPct}%` }} />
        </span>
        <span className="opr-compare-value">{mlValue}</span>
      </div>
      <div className="opr-compare-row opr-compare-row--rules">
        <span className="opr-compare-label">{rulesLabel}</span>
        <span className="opr-compare-track">
          <span className="opr-compare-fill" style={{ width: `${rulesPct}%` }} />
        </span>
        <span className="opr-compare-value">{rulesValue}</span>
      </div>
    </div>
  )
}

function humanizeModel(model) {
  const map = {
    majority_baseline: 'Baseline',
    logistic_regression: 'Logistic Regression',
    random_forest: 'Random Forest',
  }
  return map[model] || model
}

const CASE_ARTIFACTS = [
  { id: 'notebook', href: `${OPERATIONAL_RISK_EVIDENCE_BASE}/operational_risk_case_notebook.ipynb` },
  { id: 'datasetXlsx', href: `${OPERATIONAL_RISK_EVIDENCE_BASE}/operational_risk_dataset.xlsx` },
  { id: 'datasetCsv', href: `${OPERATIONAL_RISK_EVIDENCE_BASE}/operational_risk_dataset.csv` },
  { id: 'dictionary', href: `${OPERATIONAL_RISK_EVIDENCE_BASE}/data_dictionary.xlsx` },
  { id: 'readme', href: `${OPERATIONAL_RISK_EVIDENCE_BASE}/README.md` },
]

const STAGE_IDS = [
  'problem', 'dataset', 'quality', 'eda', 'rules', 'features',
  'models', 'validation', 'policy', 'comparison', 'drivers', 'outcome',
]

const QUALITY_STEP_KEYS = {
  drop_duplicate_event_ids: 'dropDuplicateEventIds',
  normalize_source_system: 'normalizeSourceSystem',
  impute_null_categories: 'imputeNullCategories',
  fix_entity_type_from_entity_dimension: 'fixEntityType',
  fix_invalid_value_amount: 'fixInvalidValueAmount',
  cast_types_and_parse_timestamp: 'castTypes',
}

function qualityParams(step) {
  switch (step.step) {
    case 'drop_duplicate_event_ids':
      return { removed: step.rows_removed, before: step.rows_before, after: step.rows_after }
    case 'normalize_source_system':
      return { n: step.casing_fixed_rows, allowed: step.allowed.join(', ') }
    case 'impute_null_categories':
      return { region: step.region_nulls_labeled, source: step.source_system_nulls_labeled }
    case 'fix_entity_type_from_entity_dimension':
      return { n: step.mismatches_corrected }
    case 'fix_invalid_value_amount':
      return { n: step.negative_values_corrected }
    case 'cast_types_and_parse_timestamp':
      return { n: step.rows }
    default:
      return {}
  }
}

export default function OperationalRisk({ onExit }) {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const scrollToStage = (stageId, event) => {
    event.preventDefault()
    const target = document.getElementById(`oprisk-${stageId}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const insightText = (id, field, fallback) => {
    const value = t(`operationalRisk.insights.${id}.${field}`)
    return typeof value === 'string' && value !== `operationalRisk.insights.${id}.${field}` ? value : fallback
  }

  const limitText = (item) => {
    const map = t('operationalRisk.limits.fromEvidence')
    return (map && map[item]) || item
  }

  const temporalFolds = [
    {
      key: 'train',
      label: t('operationalRisk.temporal.train'),
      range: `${EV.split.train.start} → ${EV.split.train.end}`,
      rows: EV.split.train.rows,
      rate: EV.split.train.positiveRate,
      role: t('operationalRisk.temporal.roleFit'),
    },
    {
      key: 'validation',
      label: t('operationalRisk.temporal.validation'),
      range: `${EV.split.validation.start} → ${EV.split.validation.end}`,
      rows: EV.split.validation.rows,
      rate: EV.split.validation.positiveRate,
      role: t('operationalRisk.temporal.roleSelect'),
    },
    {
      key: 'test',
      label: t('operationalRisk.temporal.test'),
      range: `${EV.split.test.start} → ${EV.split.test.end}`,
      rows: EV.split.test.rows,
      rate: EV.split.test.positiveRate,
      role: t('operationalRisk.temporal.roleReport'),
    },
  ]

  const comparisonRatio = formatLocaleNum(EV.comparison.headline.ratio, 2)

  return (
    <article className="elog" id="operational-risk" aria-labelledby="oprisk-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('operationalRisk.hero.badge')}</span>
          <span>{t('operationalRisk.hero.caseLine')}</span>
          <span>{t('operationalRisk.hero.pipeline', { version: EV.project_summary.pipeline_version })}</span>
        </div>
        <p className="elog-kicker">{t('operationalRisk.hero.kicker')}</p>
        <h1 id="oprisk-title">{t('operationalRisk.hero.title')}</h1>
        <p className="elog-lede">{t('operationalRisk.hero.lede')}</p>

        <nav className="elog-actions" aria-label={t('operationalRisk.actions.aria')}>
          <a className="atlas-access atlas-access--primary" href="#proyectos" onClick={onExit}>
            <span>{t('operationalRisk.actions.backToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('operationalRisk.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={PARADIGM_APP_URL} target="_blank" rel="noreferrer noopener">
            <span>{t('operationalRisk.actions.viewParadigm')}</span>
            <span aria-hidden>↗</span>
          </a>
        </nav>

        <nav className="elog-toc" aria-label={t('operationalRisk.tocAria')}>
          <ol>
            {STAGE_IDS.map((id, idx) => (
              <li key={id}>
                <a href={CASEWORK_OPERATIONAL_RISK_HASH} onClick={(event) => scrollToStage(id, event)}>
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  {t(`operationalRisk.stages.${id}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="elog-path-note">
          <strong>{t('operationalRisk.pathFast')}</strong> {t('operationalRisk.pathFastBody')}{' '}
          <strong>{t('operationalRisk.pathTech')}</strong> {t('operationalRisk.pathTechBody')}
        </p>
      </header>

      <EvidencePanel label={t('operationalRisk.artifacts.label')}>
        <ul className="elog-artifacts">
          {CASE_ARTIFACTS.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                <span className="elog-artifacts-name">{t(`operationalRisk.artifacts.items.${item.id}.name`)}</span>
                <span className="elog-artifacts-meta">{t(`operationalRisk.artifacts.items.${item.id}.meta`)}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="elog-status" role="note">
          {t('operationalRisk.artifacts.note')}
        </p>
      </EvidencePanel>

      {/* 1. Problem */}
      <Stage
        id="problem"
        number="01"
        title={t('operationalRisk.stages.problem.title')}
        fast={t('operationalRisk.stages.problem.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <div>
            <p>{t('operationalRisk.stages.problem.p1')}</p>
            <p>{t('operationalRisk.stages.problem.p2')}</p>
          </div>
          <EvidencePanel label={t('operationalRisk.stages.problem.title')}>
            <p>{EV.project_summary.domain}</p>
          </EvidencePanel>
        </div>
      </Stage>

      {/* 2. Synthetic dataset */}
      <Stage
        id="dataset"
        number="02"
        title={t('operationalRisk.stages.dataset.title')}
        fast={t('operationalRisk.stages.dataset.fast', {
          events: formatLocaleInt(EV.dataset_dimensions.events_cleaned_rows, language),
          entities: formatLocaleInt(EV.dataset_dimensions.n_entities, language),
          types: EV.dataset_dimensions.n_event_types,
          seed: EV.project_summary.seed,
        })}
      >
        <MetricGrid
          items={[
            { label: 'Raw events', value: formatLocaleInt(EV.dataset_dimensions.events_raw_rows, language) },
            { label: 'Cleaned events', value: formatLocaleInt(EV.dataset_dimensions.events_cleaned_rows, language) },
            { label: 'Eligible rows', value: formatLocaleInt(EV.dataset_dimensions.eligible_modeling_rows, language) },
            { label: 'Entities', value: formatLocaleInt(EV.dataset_dimensions.n_entities, language) },
            { label: 'Event types', value: EV.dataset_dimensions.n_event_types },
            { label: 'Risk rate', value: formatLocalePct(EV.target.eligible_risk_rate, language) },
          ]}
        />
        <aside className="elog-synthetic-notice" aria-label={t('operationalRisk.synthetic.label')}>
          <span className="elog-synthetic-label">{t('operationalRisk.synthetic.label')}</span>
          <p>{t('operationalRisk.synthetic.statement')}</p>
        </aside>
        <p>
          {EV.target.name} · {EV.target.modeling_population} · imbalance ≈ 1:{Math.round(EV.target.class_imbalance_ratio)}
        </p>
      </Stage>

      {/* 3. Data quality */}
      <Stage
        id="quality"
        number="03"
        title={t('operationalRisk.stages.quality.title')}
        fast={t('operationalRisk.stages.quality.fast')}
      >
        <ul className="elog-list">
          {EV.quality_changes.map((step) => {
            const key = QUALITY_STEP_KEYS[step.step]
            return (
              <li key={step.step}>
                {key ? t(`operationalRisk.stages.quality.items.${key}`, qualityParams(step)) : step.step}
              </li>
            )
          })}
        </ul>
      </Stage>

      {/* 4. EDA */}
      <Stage
        id="eda"
        number="04"
        title={t('operationalRisk.stages.eda.title')}
        fast={t('operationalRisk.stages.eda.fast')}
      >
        <ul className="elog-insights">
          {EV.insights.map((insight) => (
            <li key={insight.id}>
              <strong>{insightText(insight.id, 'finding', insight.finding)}</strong>
              <span>{insightText(insight.id, 'implication', insight.implication)}</span>
              {insight.caveat ? <em>{insightText(insight.id, 'caveat', insight.caveat)}</em> : null}
            </li>
          ))}
        </ul>
      </Stage>

      {/* 5. Rules baseline */}
      <Stage
        id="rules"
        number="05"
        title={t('operationalRisk.stages.rules.title')}
        fast={t('operationalRisk.stages.rules.fast')}
      >
        <p>{t('operationalRisk.stages.rules.intro')}</p>
        <ul className="elog-list">
          {EV.rules.definitions.map((rule) => (
            <li key={rule.id}>
              <code>
                {rule.id}: {rule.rule}
              </code>{' '}
              — {t(`operationalRisk.stages.rules.labels.${rule.id}`)}
            </li>
          ))}
        </ul>
        <TechDetails summary={EV.rules.flagRule}>
          <MetricGrid
            items={[
              { label: t('operationalRisk.metrics.precision'), value: formatLocaleNum(EV.rules.testReference.precision) },
              { label: t('operationalRisk.metrics.recall'), value: formatLocaleNum(EV.rules.testReference.recall) },
              { label: t('operationalRisk.metrics.f1'), value: formatLocaleNum(EV.rules.testReference.f1) },
              { label: t('operationalRisk.metrics.nFlagged'), value: formatLocaleInt(EV.rules.testReference.nFlagged, language), note: 'test' },
            ]}
          />
        </TechDetails>
      </Stage>

      {/* 6. Features & leakage */}
      <Stage
        id="features"
        number="06"
        title={t('operationalRisk.stages.features.title')}
        fast={t('operationalRisk.stages.features.fast')}
      >
        <EvidencePanel label={t('operationalRisk.stages.features.includedLabel')}>
          <p>{EV.featureColumns.join(', ')}</p>
        </EvidencePanel>
        <EvidencePanel label={t('operationalRisk.stages.features.leakageLabel')}>
          <ul className="elog-list elog-list--warn">
            {EV.excludedColumns.map((item) => (
              <li key={item}>
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </EvidencePanel>
      </Stage>

      {/* 7. Models */}
      <Stage
        id="models"
        number="07"
        title={t('operationalRisk.stages.models.title')}
        fast={t('operationalRisk.stages.models.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">{t('operationalRisk.stages.models.colModel')}</th>
                <th scope="col">{t('operationalRisk.stages.models.colValRoc')}</th>
                <th scope="col">{t('operationalRisk.stages.models.colValPr')}</th>
                <th scope="col">{t('operationalRisk.stages.models.colTestRoc')}</th>
                <th scope="col">{t('operationalRisk.stages.models.colTestPr')}</th>
              </tr>
            </thead>
            <tbody>
              {EV.models.map((row) => (
                <tr key={row.model} className={row.model === EV.selectedModel ? 'is-selected' : undefined}>
                  <th scope="row">{humanizeModel(row.model)}</th>
                  <td>{formatLocaleNum(row.valRocAuc)}</td>
                  <td>{formatLocaleNum(row.valPrAuc)}</td>
                  <td>{formatLocaleNum(row.testRocAuc)}</td>
                  <td>{formatLocaleNum(row.testPrAuc)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>{EV.selectionReason}</p>
      </Stage>

      {/* 8. Temporal validation */}
      <Stage
        id="validation"
        number="08"
        title={t('operationalRisk.stages.validation.title')}
        fast={t('operationalRisk.stages.validation.fast')}
      >
        <ol className="elog-temporal" aria-label={t('operationalRisk.temporal.aria')}>
          {temporalFolds.map((fold) => (
            <li key={fold.key} className={`elog-temporal-fold elog-temporal-fold--${fold.key}`}>
              <span className="elog-temporal-label">{fold.label}</span>
              <strong>{fold.range}</strong>
              <span>
                {t('operationalRisk.temporal.rows', {
                  rows: formatLocaleInt(fold.rows, language),
                  rate: formatLocalePct(fold.rate, language),
                })}
              </span>
              <span className="elog-temporal-role">{fold.role}</span>
            </li>
          ))}
        </ol>
      </Stage>

      {/* 9. Review policy */}
      <Stage
        id="policy"
        number="09"
        title={t('operationalRisk.stages.policy.title')}
        fast={t('operationalRisk.stages.policy.fast')}
      >
        <EvidencePanel label={EV.policy.label}>
          <p>{t('operationalRisk.stages.policy.definition')}</p>
        </EvidencePanel>
        <MetricGrid
          items={[
            { label: t('operationalRisk.metrics.nReviewed'), value: formatLocaleInt(EV.policyMetrics.test.nReviewed, language), note: 'test' },
            { label: t('operationalRisk.metrics.precision'), value: formatLocaleNum(EV.policyMetrics.test.precision) },
            { label: t('operationalRisk.metrics.recall'), value: formatLocaleNum(EV.policyMetrics.test.recall) },
            { label: t('operationalRisk.metrics.f1'), value: formatLocaleNum(EV.policyMetrics.test.f1) },
            { label: t('operationalRisk.metrics.lift'), value: `${formatLocaleNum(EV.policyMetrics.test.lift, 2)}×` },
          ]}
        />
      </Stage>

      {/* 10. ML vs rules at identical capacity */}
      <Stage
        id="comparison"
        number="10"
        title={t('operationalRisk.stages.comparison.title')}
        fast={t('operationalRisk.stages.comparison.fast')}
      >
        <MetricGrid
          items={[
            {
              label: t('operationalRisk.stages.comparison.capacityLabel'),
              value: `N = ${EV.comparison.headline.nReviewed}`,
            },
            {
              label: t('operationalRisk.stages.comparison.mlLabel'),
              value: String(EV.comparison.headline.mlTruePositives),
              note: t('operationalRisk.stages.comparison.risksCaptured'),
            },
            {
              label: t('operationalRisk.stages.comparison.rulesLabel'),
              value: String(EV.comparison.headline.rulesTruePositives),
              note: t('operationalRisk.stages.comparison.risksCaptured'),
            },
            {
              label: t('operationalRisk.stages.comparison.additionalLabel'),
              value: `+${EV.comparison.headline.additionalCaptured}`,
            },
          ]}
        />
        <div aria-label={t('operationalRisk.stages.comparison.compareAria')}>
          <RulesVsMlBars
            mlValue={EV.comparison.headline.mlTruePositives}
            rulesValue={EV.comparison.headline.rulesTruePositives}
            maxValue={EV.comparison.test.totalPositives}
            mlLabel={t('operationalRisk.stages.comparison.mlLabel')}
            rulesLabel={t('operationalRisk.stages.comparison.rulesLabel')}
          />
        </div>
        <p>
          {t('operationalRisk.stages.comparison.ratioNote', { ratio: comparisonRatio })}
        </p>
      </Stage>

      {/* 11. Drivers */}
      <Stage
        id="drivers"
        number="11"
        title={t('operationalRisk.stages.drivers.title')}
        fast={t('operationalRisk.stages.drivers.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <DriverList title={t('operationalRisk.stages.drivers.positive')} items={EV.drivers.positive} tone="pos" />
          <DriverList title={t('operationalRisk.stages.drivers.negative')} items={EV.drivers.negative} tone="neg" />
        </div>
      </Stage>

      {/* 12. Limitations & outcome */}
      <Stage
        id="outcome"
        number="12"
        title={t('operationalRisk.stages.outcome.title')}
        fast={t('operationalRisk.stages.outcome.fast')}
      >
        <ul className="elog-limits">
          {EV.limitations.map((item) => (
            <li key={item}>{limitText(item)}</li>
          ))}
        </ul>
        <p className="elog-synthesis">{t('operationalRisk.stages.outcome.synthesis')}</p>
        <p className="elog-synthetic-note">{t('operationalRisk.synthetic.statement')}</p>
        <nav className="elog-actions" aria-label={t('operationalRisk.actions.aria')}>
          <a
            className="atlas-access atlas-access--primary"
            href={CASEWORK_OPERATIONAL_RISK_HASH}
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>{t('operationalRisk.actions.backToTop')}</span>
            <span aria-hidden>↑</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('operationalRisk.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
        </nav>
      </Stage>
    </article>
  )
}
