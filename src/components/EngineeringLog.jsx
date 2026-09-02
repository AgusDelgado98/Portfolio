import React, { useEffect, useId, useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { formatLocaleInt, formatLocalePct, formatLocaleNum } from '../i18n/format.js'
import {
  CLINIC_CASE_EVIDENCE_BASE,
  ENGINEERING_LOG_HASH,
  PARADIGM_APP_URL,
  PARADIGM_REPO_PUBLIC,
  PARADIGM_REPO_URL,
} from '../constants/links.js'
import { CODE_EXCERPTS, REPRODUCE_COMMANDS } from '../data/engineeringLog/excerpts.js'
import {
  FALLBACK_EVIDENCE,
  NARRATIVE,
  loadClinicNoShowEvidence,
} from '../data/engineeringLog/loadEvidence.js'

const EVIDENCE_PACK_BASE = `${CLINIC_CASE_EVIDENCE_BASE}/evidence-pack`

/** Case artifacts — downloadable Evidence Pack files, served as static assets. */
const CASE_ARTIFACTS = [
  { id: 'notebook', href: `${EVIDENCE_PACK_BASE}/no_show_case_notebook.ipynb` },
  { id: 'datasetXlsx', href: `${EVIDENCE_PACK_BASE}/no_show_dataset.xlsx` },
  { id: 'datasetCsv', href: `${EVIDENCE_PACK_BASE}/no_show_dataset.csv` },
  { id: 'dictionary', href: `${EVIDENCE_PACK_BASE}/data_dictionary.xlsx` },
  { id: 'readme', href: `${EVIDENCE_PACK_BASE}/README.md` },
]

function PrivateRepoNote({ compact = false }) {
  const { t } = useLanguage()
  return (
    <p className={`elog-private-repo${compact ? ' elog-private-repo--compact' : ''}`} role="note">
      <span className="elog-private-repo-label">{t('elog.privateRepo.label')}</span>
      <span>{t('elog.privateRepo.note')}</span>
    </p>
  )
}

function Stage({ id, number, title, children, fast }) {
  const { t } = useLanguage()
  return (
    <section className="elog-stage" id={`elog-${id}`} aria-labelledby={`elog-${id}-title`}>
      <header className="elog-stage-head">
        <span className="elog-stage-number" aria-hidden>
          {t('elog.stagePrefix', { number })}
        </span>
        <h2 id={`elog-${id}-title`}>{title}</h2>
        {fast ? <p className="elog-stage-fast">{fast}</p> : null}
      </header>
      <div className="elog-stage-body">{children}</div>
    </section>
  )
}

function EvidencePanel({ label, children }) {
  const { t } = useLanguage()
  return (
    <aside className="elog-evidence" aria-label={label || t('elog.evidence')}>
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

function ChartFigure({ src, caption, missing }) {
  const { t } = useLanguage()
  const [failed, setFailed] = useState(false)
  if (!src || failed || missing) {
    return (
      <figure className="elog-chart elog-chart--missing">
        <div className="elog-chart-fallback" role="img" aria-label={t('elog.chartUnavailableAria')}>
          {t('elog.chartUnavailable')}
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    )
  }
  return (
    <figure className="elog-chart">
      <img
        src={src}
        alt={caption || t('elog.chartAlt')}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function DataModelDiagram({ entities, relationships }) {
  const { t } = useLanguage()
  return (
    <div className="elog-datamodel" role="img" aria-label={t('elog.datamodelAria')}>
      <ul className="elog-datamodel-entities">
        {entities.map((e) => (
          <li key={e.id}>
            <strong>{t(`elog.data.entities.${e.id}.label`)}</strong>
            <span>{t(`elog.data.entities.${e.id}.note`)}</span>
          </li>
        ))}
      </ul>
      <ul className="elog-datamodel-links">
        {relationships.map((r, idx) => (
          <li key={idx}>{t(`elog.data.rel${r.key}`)}</li>
        ))}
      </ul>
    </div>
  )
}

function TemporalStrip({ split }) {
  const { t, language } = useLanguage()
  if (!split) return null
  const folds = [
    {
      key: 'train',
      label: t('elog.temporalTrain'),
      range: `${split.train_start} → ${split.train_end}`,
      rows: split.train_rows,
      rate: split.train_positive_rate,
      role: t('elog.temporalRoleFit'),
    },
    {
      key: 'validation',
      label: t('elog.temporalValidation'),
      range: `${split.validation_start} → ${split.validation_end}`,
      rows: split.validation_rows,
      rate: split.validation_positive_rate,
      role: t('elog.temporalRoleSelect'),
    },
    {
      key: 'test',
      label: t('elog.temporalTest'),
      range: `${split.test_start} → ${split.test_end}`,
      rows: split.test_rows,
      rate: split.test_positive_rate,
      role: t('elog.temporalRoleReport'),
    },
  ]
  return (
    <ol className="elog-temporal" aria-label={t('elog.temporalAria')}>
      {folds.map((fold) => (
        <li key={fold.key} className={`elog-temporal-fold elog-temporal-fold--${fold.key}`}>
          <span className="elog-temporal-label">{fold.label}</span>
          <strong>{fold.range}</strong>
          <span>
            {t('elog.temporalRows', {
              rows: formatLocaleInt(fold.rows, language),
              rate: formatLocalePct(fold.rate, language),
            })}
          </span>
          <span className="elog-temporal-role">{fold.role}</span>
        </li>
      ))}
    </ol>
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

function humanizeModel(model) {
  const map = {
    baseline: 'Baseline',
    logistic_regression: 'Logistic Regression',
    random_forest: 'Random Forest',
    hist_gradient_boosting: 'Histogram Gradient Boosting',
  }
  return map[model] || model
}

function resolveI18n(t, path, fallback) {
  const value = t(path)
  if (typeof value === 'string' && value !== path) return value
  return fallback
}

function humanizeStep(step, t) {
  return resolveI18n(t, `elog.quality.steps.${step}`, step.replace(/_/g, ' '))
}

function translateRule(rule, t) {
  if (!rule) return rule
  return resolveI18n(t, `elog.quality.rules.${rule}`, rule)
}

export default function EngineeringLog({ onExit }) {
  const { t, language } = useLanguage()
  const [evidence, setEvidence] = useState(FALLBACK_EVIDENCE)
  const [status, setStatus] = useState('loading')
  const [activeStage, setActiveStage] = useState('problem')

  useEffect(() => {
    let cancelled = false
    loadClinicNoShowEvidence()
      .then((data) => {
        if (!cancelled) {
          setEvidence(data)
          setStatus(data.source === 'fallback' ? 'fallback' : 'ready')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setEvidence(FALLBACK_EVIDENCE)
          setStatus('fallback')
        }
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  useEffect(() => {
    const stageIds = Object.keys(t('elog.stages'))
    const targets = stageIds.map((stage) => document.getElementById(`elog-${stage}`)).filter(Boolean)
    if (!targets.length) return undefined

    const updateActive = () => {
      const reference = window.innerHeight * 0.28
      let next = stageIds[0]
      targets.forEach((target) => {
        if (target.getBoundingClientRect().top <= reference) {
          next = target.id.replace(/^elog-/, '')
        }
      })
      setActiveStage((current) => (current === next ? current : next))
    }

    const observer = new IntersectionObserver(updateActive, {
      rootMargin: '-20% 0px -65% 0px',
      threshold: [0, 0.25, 0.5],
    })
    targets.forEach((target) => observer.observe(target))
    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', updateActive)
    }
  }, [t])

  const test = evidence.final_test_metrics || {}
  const testRank = test.ranking || {}
  const testAt = test.at_selected_threshold || {}
  const threshold = evidence.threshold ?? testAt.threshold

  const statusMessages = {
    loading: t('elog.status.loading'),
    ready: t('elog.status.ready'),
    fallback: t('elog.status.fallback'),
  }
  
  let statusText = statusMessages[status] || ''
  if (evidence.missingArtifacts?.length > 0 && status !== 'loading') {
    statusText += t('elog.status.missing', { list: evidence.missingArtifacts.join(', ') })
  }

  const stageIds = ['problem', 'data', 'quality', 'eda', 'features', 'model', 'validation', 'drivers', 'product', 'limits', 'outcome']

  const scrollToStage = (stageId, event) => {
    event.preventDefault()
    const target = document.getElementById(`elog-${stageId}`)
    if (!target) return
    setActiveStage(stageId)
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const narrativeEntities = [
    { id: 'patients', label: t('elog.data.entities.patients.label'), note: t('elog.data.entities.patients.note') },
    { id: 'professionals', label: t('elog.data.entities.professionals.label'), note: t('elog.data.entities.professionals.note') },
    { id: 'specialties', label: t('elog.data.entities.specialties.label'), note: t('elog.data.entities.specialties.note') },
    { id: 'appointments', label: t('elog.data.entities.appointments.label'), note: t('elog.data.entities.appointments.note') },
  ]

  const narrativeRelationships = [
    { key: 'Patient', label: t('elog.data.relPatient') },
    { key: 'Pro', label: t('elog.data.relPro') },
    { key: 'Appt', label: t('elog.data.relAppt') },
  ]

  const limitsFromEvidence = (evidence.limitations || []).map((item) => {
    const map = t('elog.limits.fromEvidence')
    return map[item] || item
  })

  return (
    <article className="elog" id="engineering-log" aria-labelledby="elog-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('elog.hero.badge')}</span>
          <span>{t('elog.hero.caseLine')}</span>
          <span>{t('elog.hero.pipeline', { version: evidence.project_summary?.pipeline_version || '—' })}</span>
        </div>
        <p className="elog-kicker">{t('elog.hero.kicker')}</p>
        <h1 id="elog-title">{t('elog.hero.title')}</h1>
        <p className="elog-lede">{t('elog.hero.lede')}</p>

        <nav className="elog-actions" aria-label={t('elog.actions.aria')}>
          <a className="atlas-access atlas-access--primary" href="#proyectos" onClick={onExit}>
            <span>{t('elog.actions.backToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
          <a
            className="atlas-access"
            href={PARADIGM_APP_URL}
            target="_blank"
            rel="noreferrer noopener"
          >
            <span>{t('elog.actions.viewParadigm')}</span>
            <span aria-hidden>↗</span>
          </a>
          {PARADIGM_REPO_PUBLIC && PARADIGM_REPO_URL ? (
            <a
              className="atlas-access"
              href={PARADIGM_REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>{t('elog.actions.repository')}</span>
              <span aria-hidden>↗</span>
            </a>
          ) : (
            <PrivateRepoNote compact />
          )}
        </nav>

        <p className="elog-status" role="status">
          {statusText}
        </p>

        <nav className="elog-toc" aria-label={t('elog.tocAria')}>
          <ol>
            {stageIds.map((id, idx) => (
              <li key={id}>
                <a
                  href={ENGINEERING_LOG_HASH}
                  aria-current={activeStage === id ? 'location' : undefined}
                  onClick={(event) => scrollToStage(id, event)}
                >
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  {t(`elog.stages.${id}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="elog-path-note">
          <strong>{t('elog.pathFast')}</strong> {t('elog.pathFastBody')}{' '}
          <strong>{t('elog.pathTech')}</strong> {t('elog.pathTechBody')}
        </p>
      </header>

      <EvidencePanel label={t('elog.artifacts.label')}>
        <ul className="elog-artifacts">
          {CASE_ARTIFACTS.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                <span className="elog-artifacts-name">{t(`elog.artifacts.items.${item.id}.name`)}</span>
                <span className="elog-artifacts-meta">{t(`elog.artifacts.items.${item.id}.meta`)}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="elog-status" role="note">
          {t('elog.artifacts.note')}
        </p>
      </EvidencePanel>

      <nav className="elog-rail" aria-label={t('elog.railAria')}>
        {stageIds.map((id) => (
          <a
            key={id}
            href={ENGINEERING_LOG_HASH}
            className={activeStage === id ? 'is-active' : undefined}
            aria-current={activeStage === id ? 'location' : undefined}
            onClick={(event) => scrollToStage(id, event)}
          >
            {t(`elog.stages.${id}.rail`)}
          </a>
        ))}
      </nav>

      <Stage
        id="problem"
        number="01"
        title={t('elog.stages.problem.title')}
        fast={t('elog.stages.problem.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <div>
            <p>{t('elog.problem.p1')}</p>
            <p>{t('elog.problem.p2')}</p>
          </div>
          <EvidencePanel label={t('elog.problem.constraints')}>
            <ul className="elog-list">
              <li>{t('elog.problem.specialties', { list: NARRATIVE.specialties.join(', ') })}</li>
              <li>{t('elog.problem.channels')}</li>
              <li>{t('elog.problem.syntheticPhi')}</li>
              <li>{t('elog.problem.nonClinical')}</li>
            </ul>
          </EvidencePanel>
        </div>
        <TechDetails summary={t('elog.problem.techSummary')}>
          <p>{t('elog.problem.techBody')}</p>
        </TechDetails>
      </Stage>

      <Stage
        id="data"
        number="02"
        title={t('elog.stages.data.title')}
        fast={t('elog.stages.data.fast', {
          appointments: formatLocaleInt(evidence.dataset_dimensions?.cleaned_appointments, language),
          patients: formatLocaleInt(evidence.dataset_dimensions?.patients || 2800, language),
          seed: evidence.project_summary?.seed ?? 42,
        })}
      >
        <MetricGrid
          items={[
            {
              label: t('elog.data.cleaned'),
              value: formatLocaleInt(evidence.dataset_dimensions?.cleaned_appointments, language),
            },
            {
              label: t('elog.data.eligibleRows'),
              value: formatLocaleInt(evidence.dataset_dimensions?.eligible_modeling_rows, language),
            },
            {
              label: t('elog.data.eligibleRate'),
              value: formatLocalePct(evidence.dataset_dimensions?.eligible_positive_rate, language),
            },
            {
              label: t('elog.data.dateRange'),
              value: `${evidence.dataset_dimensions?.date_start || evidence.split?.train_start} → ${evidence.dataset_dimensions?.date_end || evidence.split?.test_end}`,
            },
          ]}
        />
        <aside className="elog-synthetic-notice" aria-label={t('elog.synthetic.aria')}>
          <span className="elog-synthetic-label">{t('elog.synthetic.label')}</span>
          <p>{t('elog.synthetic.statement')}</p>
        </aside>
        <DataModelDiagram entities={narrativeEntities} relationships={narrativeRelationships} />
        <p>
          {t('elog.data.target', {
            target: 'no_show_flag',
            population: evidence.split?.modeling_population || 'cancellation_flag == 0',
          })}
        </p>
        <TechDetails summary={t('elog.data.techSummary')}>
          <ul className="elog-list">
            <li>{t('elog.data.techSeed', { seed: evidence.project_summary?.seed ?? 42 })}</li>
            <li>{t('elog.data.techFields')}</li>
            <li>{t('elog.data.techPostVisit')}</li>
          </ul>
          <pre className="elog-code">
            <code>{CODE_EXCERPTS.seed.code}</code>
          </pre>
          <p className="elog-code-label">{t('elog.data.excerptSeed')}</p>
        </TechDetails>
      </Stage>

      <Stage
        id="quality"
        number="03"
        title={t('elog.stages.quality.title')}
        fast={t('elog.stages.quality.fast')}
      >
        <div className="elog-quality">
          {(evidence.data_quality_changes || []).map((step) => (
            <article key={step.step} className="elog-quality-step">
              <h3>{humanizeStep(step.step, t)}</h3>
              <ul className="elog-list">
                {step.rows_before != null && (
                  <li>
                    {t('elog.quality.rows', {
                      before: formatLocaleInt(step.rows_before, language),
                      after: formatLocaleInt(step.rows_after, language),
                      removed:
                        step.rows_removed != null
                          ? t('elog.quality.removed', { n: formatLocaleInt(step.rows_removed, language) })
                          : '',
                    })}
                  </li>
                )}
                {step.casing_fixed_rows != null && (
                  <li>{t('elog.quality.casing', { n: formatLocaleInt(step.casing_fixed_rows, language) })}</li>
                )}
                {step.city_zone_nulls_labeled != null && (
                  <li>
                    {t('elog.quality.nulls', {
                      city: formatLocaleInt(step.city_zone_nulls_labeled, language),
                      insurance: formatLocaleInt(step.insurance_type_nulls_labeled, language),
                    })}
                  </li>
                )}
                {step.mismatches_corrected != null && (
                  <li>
                    {t('elog.quality.mismatches', { n: formatLocaleInt(step.mismatches_corrected, language) })}
                  </li>
                )}
                {step.rule && <li>{t('elog.quality.rule', { rule: translateRule(step.rule, t) })}</li>}
                {step.allowed && <li>{t('elog.quality.allowed', { list: step.allowed.join(', ') })}</li>}
                {step.rows != null && step.rows_before == null && (
                  <li>{t('elog.quality.recomputed', { n: formatLocaleInt(step.rows, language) })}</li>
                )}
              </ul>
            </article>
          ))}
        </div>
        <TechDetails summary={t('elog.quality.techSummary')}>
          <p>{t('elog.quality.techBody')}</p>
        </TechDetails>
      </Stage>

      <Stage
        id="eda"
        number="04"
        title={t('elog.stages.eda.title')}
        fast={t('elog.stages.eda.fast')}
      >
        <p className="elog-caveat">{t('elog.eda.caveat')}</p>
        <div className="elog-charts elog-charts--2">
          <ChartFigure src={evidence.charts?.lead_time} caption={t('elog.eda.leadTime')} />
          <ChartFigure src={evidence.charts?.channel} caption={t('elog.eda.channel')} />
          <ChartFigure src={evidence.charts?.specialty} caption={t('elog.eda.specialty')} />
          <ChartFigure src={evidence.charts?.hour} caption={t('elog.eda.hour')} />
        </div>
        <ul className="elog-insights">
          {(evidence.key_insights || [])
            .filter((k) => k.id !== 'eligible_base_rate')
            .map((insight) => {
              const finding = t(`elog.insights.${insight.id}.finding`) || insight.finding
              const implication = t(`elog.insights.${insight.id}.implication`) || insight.operational_implication
              const caveat = t(`elog.insights.${insight.id}.caveat`) || insight.caveat
              return (
                <li key={insight.id}>
                  <strong>{finding}</strong>
                  <span>{implication}</span>
                  {caveat ? <em>{caveat}</em> : null}
                </li>
              )
            })}
        </ul>
      </Stage>

      <Stage
        id="features"
        number="05"
        title={t('elog.stages.features.title')}
        fast={t('elog.stages.features.fast')}
      >
        <div className="elog-flow" aria-label={t('elog.features.flowAria')}>
          <div>
            <span>{t('elog.features.raw')}</span>
            <p>{t('elog.features.rawBody')}</p>
          </div>
          <span aria-hidden>→</span>
          <div>
            <span>{t('elog.features.transforms')}</span>
            <p>{t('elog.features.transformsBody')}</p>
          </div>
          <span aria-hidden>→</span>
          <div>
            <span>{t('elog.features.modelReady')}</span>
            <p>
              {t('elog.features.modelReadyBody', {
                n: formatLocaleInt(evidence.split?.feature_columns?.length || 22, language),
              })}
            </p>
          </div>
        </div>
        <ul className="elog-feature-examples">
          {NARRATIVE.featureExamples.map((f) => {
            const exampleKey =
              f.name === 'day_of_week / month' ? 'calendar' : f.name
            const notePath = `elog.features.examples.${exampleKey}`
            const note = t(notePath)
            const resolvedNote =
              typeof note === 'string' && !note.startsWith('elog.features.examples.')
                ? note
                : f.note
            return (
              <li key={f.name}>
                <code>{f.name === 'day_of_week / month' ? t('elog.features.exampleCalendarName') : f.name}</code>
                <span>{resolvedNote}</span>
              </li>
            )
          })}
        </ul>
        <EvidencePanel label={t('elog.features.leakageLabel')}>
          <ul className="elog-list elog-list--warn">
            {NARRATIVE.leakageHighlights.map((item) => (
              <li key={item}>
                <code>{item}</code>
              </li>
            ))}
          </ul>
        </EvidencePanel>
        <TechDetails summary={t('elog.features.techSummary')}>
          <pre className="elog-code">
            <code>{CODE_EXCERPTS.leakage.code}</code>
          </pre>
          <p className="elog-code-label">{t('elog.features.excerptLeakage')}</p>
          <p>
            {t('elog.features.featuresList', {
              list: (evidence.split?.feature_columns || []).join(', ') || t('elog.features.unavailable'),
            })}
          </p>
        </TechDetails>
      </Stage>

      <Stage
        id="model"
        number="06"
        title={t('elog.stages.model.title')}
        fast={t('elog.stages.model.fast')}
      >
        <p>
          {t('elog.model.intro', {
            rate: formatLocalePct(evidence.dataset_dimensions?.eligible_positive_rate, language),
          })}
        </p>
        <div className="elog-table-wrap" role="region" aria-label={t('elog.model.tableAria')} tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">{t('elog.model.colModel')}</th>
                <th scope="col">{t('elog.model.colValRoc')}</th>
                <th scope="col">{t('elog.model.colValAp')}</th>
                <th scope="col">{t('elog.model.colTestRoc')}</th>
                <th scope="col">{t('elog.model.colTestAp')}</th>
              </tr>
            </thead>
            <tbody>
              {(evidence.model_comparison || []).map((row) => (
                <tr
                  key={row.model}
                  className={row.model === evidence.selected_model ? 'is-selected' : undefined}
                >
                  <th scope="row">{humanizeModel(row.model)}</th>
                  <td>{formatLocaleNum(row.val_roc_auc)}</td>
                  <td>{formatLocaleNum(row.val_average_precision)}</td>
                  <td>{formatLocaleNum(row.test_roc_auc)}</td>
                  <td>{formatLocaleNum(row.test_average_precision)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="elog-charts elog-charts--2">
          <ChartFigure src={evidence.charts?.roc} caption={t('elog.model.rocCaption')} />
          <ChartFigure src={evidence.charts?.pr} caption={t('elog.model.prCaption')} />
        </div>
      </Stage>

      <Stage
        id="validation"
        number="07"
        title={t('elog.stages.validation.title')}
        fast={t('elog.stages.validation.fast')}
      >
        <TemporalStrip split={evidence.split} />
        <MetricGrid
          items={[
            { label: t('elog.validation.rocAuc'), value: formatLocaleNum(testRank.roc_auc) },
            { label: t('elog.validation.ap'), value: formatLocaleNum(testRank.average_precision) },
            { label: t('elog.validation.precision'), value: formatLocaleNum(testAt.precision) },
            { label: t('elog.validation.recall'), value: formatLocaleNum(testAt.recall) },
            { label: t('elog.validation.f1'), value: formatLocaleNum(testAt.f1) },
            {
              label: t('elog.validation.threshold'),
              value: formatLocaleNum(threshold, 3),
              note: evidence.threshold_source || 'validation',
            },
          ]}
        />
        <EvidencePanel label={t('elog.validation.tradeoff')}>
          <p>
            {t('elog.validation.tradeoffBody', {
              recall: formatLocalePct(testAt.recall, language),
              precision: formatLocalePct(testAt.precision, language),
              flagged: formatLocalePct(testAt.predicted_positive_rate, language),
            })}
          </p>
        </EvidencePanel>
        <ChartFigure src={evidence.charts?.confusion} caption={t('elog.validation.confusion')} />
        <TechDetails summary={t('elog.validation.techSummary')}>
          <pre className="elog-code">
            <code>{CODE_EXCERPTS.temporalSplit.code}</code>
          </pre>
          <p className="elog-code-label">{t('elog.validation.excerptSplit')}</p>
          <pre className="elog-code">
            <code>{CODE_EXCERPTS.threshold.code}</code>
          </pre>
          <p className="elog-code-label">{t('elog.validation.excerptThreshold')}</p>
          <ul className="elog-list">
            <li>{t('elog.validation.valCutoff', { date: evidence.split?.validation_cutoff_date })}</li>
            <li>{t('elog.validation.testCutoff', { date: evidence.split?.test_cutoff_date })}</li>
            <li>
              {t('elog.validation.protocol', {
                fit: evidence.split?.protocol?.fit_on,
                select: evidence.split?.protocol?.select_model_and_threshold_on,
                report: evidence.split?.protocol?.report_final_metrics_on,
              })}
            </li>
          </ul>
        </TechDetails>
      </Stage>

      <Stage
        id="drivers"
        number="08"
        title={t('elog.stages.drivers.title')}
        fast={t('elog.stages.drivers.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <DriverList
            title={t('elog.drivers.positive')}
            items={evidence.drivers?.positive}
            tone="pos"
          />
          <DriverList
            title={t('elog.drivers.negative')}
            items={evidence.drivers?.negative}
            tone="neg"
          />
        </div>
        <ChartFigure src={evidence.charts?.importance} caption={t('elog.drivers.importance')} />
        <p>{t('elog.drivers.association')}</p>
        <EvidencePanel label={t('elog.drivers.whyLabel')}>
          <p>
            {language === 'es'
              ? t('elog.drivers.selectionFallback')
              : evidence.selection_reason || t('elog.drivers.selectionFallback')}
          </p>
          <ul className="elog-list">
            <li>{t('elog.drivers.why1')}</li>
            <li>{t('elog.drivers.why2')}</li>
            <li>{t('elog.drivers.why3')}</li>
            <li>{t('elog.drivers.why4')}</li>
          </ul>
        </EvidencePanel>
      </Stage>

      <Stage
        id="product"
        number="09"
        title={t('elog.stages.product.title')}
        fast={t('elog.stages.product.fast')}
      >
        <ol className="elog-product-flow" aria-label={t('elog.product.flowAria')}>
          {NARRATIVE.productFlow.map((step, index) => {
            const stepKey = step.replace(/\s+/g, '')
            const translated = t(`elog.product.flow.${stepKey}`) || step
            return (
              <li key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {translated}
              </li>
            )
          })}
        </ol>
        <p>{t('elog.product.body')}</p>
        <nav className="elog-actions" aria-label={t('elog.product.linksAria')}>
          <a className="atlas-access" href={PARADIGM_APP_URL} target="_blank" rel="noreferrer noopener">
            <span>{t('elog.product.openWorkspace')}</span>
            <span aria-hidden>↗</span>
          </a>
          {PARADIGM_REPO_PUBLIC && PARADIGM_REPO_URL ? (
            <a className="atlas-access" href={PARADIGM_REPO_URL} target="_blank" rel="noreferrer noopener">
              <span>{t('elog.product.inspectRepo')}</span>
              <span aria-hidden>↗</span>
            </a>
          ) : (
            <PrivateRepoNote />
          )}
        </nav>
      </Stage>

      <Stage
        id="limits"
        number="10"
        title={t('elog.stages.limits.title')}
        fast={t('elog.stages.limits.fast')}
      >
        <ul className="elog-limits">
          {limitsFromEvidence.map((item) => (
            <li key={item}>{item}</li>
          ))}
          <li>{t('elog.limits.aggressive')}</li>
          <li>{t('elog.limits.generator')}</li>
          <li>{t('elog.limits.noAdverse')}</li>
        </ul>
      </Stage>

      <Stage
        id="outcome"
        number="11"
        title={t('elog.stages.outcome.title')}
        fast={t('elog.stages.outcome.fast')}
      >
        <ul className="elog-list">
          {t('elog.outcome.delivered').map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
        <p className="elog-synthesis">{t('elog.outcome.synthesis')}</p>
        <blockquote className="elog-closing">{t('elog.outcome.quote')}</blockquote>
        <p className="elog-synthetic-note">{t('elog.synthetic.statement')}</p>
        <TechDetails summary={t('elog.outcome.techSummary')}>
          <pre className="elog-code">
            <code>{REPRODUCE_COMMANDS.join('\n')}</code>
          </pre>
          <p className="elog-code-label">
            {PARADIGM_REPO_PUBLIC ? t('elog.outcome.reproducePublic') : t('elog.outcome.reproducePrivate')}
          </p>
        </TechDetails>
        <nav className="elog-actions" aria-label={t('elog.outcome.closeAria')}>
          <a
            className="atlas-access atlas-access--primary"
            href={ENGINEERING_LOG_HASH}
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>{t('elog.outcome.backToTop')}</span>
            <span aria-hidden>↑</span>
          </a>
          <a className="atlas-access" href="#proyectos" onClick={onExit}>
            <span>{t('elog.outcome.returnToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
        </nav>
      </Stage>
    </article>
  )
}
