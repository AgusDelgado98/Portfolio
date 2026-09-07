import React, { useEffect, useId, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { formatLocaleInt, formatLocalePct, formatLocaleNum } from '../../i18n/format.js'
import {
  CASEWORK_HASH,
  CASEWORK_DEMAND_FORECASTING_HASH,
  DEMAND_FORECASTING_EVIDENCE_BASE,
  PROVIDENTIA_REPO_URL,
} from '../../constants/links.js'
import { DEMAND_FORECASTING_EVIDENCE as EV } from './data.js'

/**
 * Small presentational primitives, duplicated (not imported) from
 * EngineeringLog.jsx / OperationalRisk.jsx on purpose so this case stays
 * decoupled from Cases 01/02 — but they render through the exact same
 * `.elog-*` classes from engineering-log.css (already loaded globally via
 * App.jsx). No new CSS file is needed for this case.
 */
function Stage({ id, number, title, children, fast }) {
  const { t } = useLanguage()
  return (
    <section className="elog-stage" id={`dforecast-${id}`} aria-labelledby={`dforecast-${id}-title`}>
      <header className="elog-stage-head">
        <span className="elog-stage-number" aria-hidden>
          {t('demandForecasting.stagePrefix', { number })}
        </span>
        <h2 id={`dforecast-${id}-title`}>{title}</h2>
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

function ChartFigure({ src, caption }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) {
    return (
      <figure className="elog-chart elog-chart--missing">
        <div className="elog-chart-fallback" role="img" aria-label={caption || 'Chart unavailable'}>
          —
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    )
  }
  return (
    <figure className="elog-chart">
      <img src={src} alt={caption || ''} loading="eager" decoding="async" onError={() => setFailed(true)} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

function humanizeModel(id) {
  const map = {
    naive: 'Naive',
    seasonal_naive: 'Seasonal Naive',
    ets_aicc: 'ETS (AICc)',
    sarima_aicc: 'SARIMA (AICc)',
    lightgbm_global_full_v1: 'LightGBM (global)',
  }
  return map[id] || id
}

const CASE_ARTIFACTS = [
  { id: 'notebook', href: `${DEMAND_FORECASTING_EVIDENCE_BASE}/forecasting_case_notebook.ipynb` },
  { id: 'metrics', href: `${DEMAND_FORECASTING_EVIDENCE_BASE}/forecasting_metrics.csv` },
  { id: 'devVsFinal', href: `${DEMAND_FORECASTING_EVIDENCE_BASE}/development_vs_final.csv` },
  { id: 'attribution', href: `${DEMAND_FORECASTING_EVIDENCE_BASE}/data_attribution.md` },
  { id: 'readme', href: `${DEMAND_FORECASTING_EVIDENCE_BASE}/README.md` },
]

const FIGURES = {
  profiling: `${DEMAND_FORECASTING_EVIDENCE_BASE}/figures/p1-06-representative-series.png`,
  headlineWape: `${DEMAND_FORECASTING_EVIDENCE_BASE}/figures/p3-01-headline-wape.png`,
  devVsFinal: `${DEMAND_FORECASTING_EVIDENCE_BASE}/figures/p7-point-wape-development-vs-final.png`,
  intervalCalibration: `${DEMAND_FORECASTING_EVIDENCE_BASE}/figures/p7-interval-calibration-final.png`,
}

const STAGE_IDS = [
  'problem', 'data', 'protocol', 'leakage', 'baselines',
  'statistical', 'lightgbm', 'backtesting', 'uncertainty', 'lockbox', 'outcome',
]

export default function DemandForecasting({ onExit }) {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const scrollToStage = (stageId, event) => {
    event.preventDefault()
    const target = document.getElementById(`dforecast-${stageId}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const roleLabel = (role) => t(`demandForecasting.labels.role.${role}`) || role

  const modelById = (id) => EV.models.find((m) => m.id === id)
  const ets = modelById('ets_aicc')
  const sarima = modelById('sarima_aicc')

  return (
    <article className="elog" id="demand-forecasting" aria-labelledby="dforecast-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('demandForecasting.hero.badge')}</span>
          <span>{t('demandForecasting.hero.caseLine')}</span>
          <span>{t('demandForecasting.hero.status')}</span>
        </div>
        <p className="elog-kicker">{t('demandForecasting.hero.kicker')}</p>
        <h1 id="dforecast-title">{t('demandForecasting.hero.title')}</h1>
        <p className="elog-lede">{t('demandForecasting.hero.lede')}</p>

        <nav className="elog-actions" aria-label={t('demandForecasting.actions.aria')}>
          <a className="atlas-access atlas-access--primary" href="#home" onClick={onExit}>
            <span>{t('demandForecasting.actions.backToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('demandForecasting.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={PROVIDENTIA_REPO_URL} target="_blank" rel="noreferrer noopener">
            <span>{t('demandForecasting.actions.viewRepo')}</span>
            <span aria-hidden>↗</span>
          </a>
        </nav>

        <nav className="elog-toc" aria-label={t('demandForecasting.tocAria')}>
          <ol>
            {STAGE_IDS.map((id, idx) => (
              <li key={id}>
                <a href={CASEWORK_DEMAND_FORECASTING_HASH} onClick={(event) => scrollToStage(id, event)}>
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  {t(`demandForecasting.stages.${id}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="elog-path-note">
          <strong>{t('demandForecasting.pathFast')}</strong> {t('demandForecasting.pathFastBody')}{' '}
          <strong>{t('demandForecasting.pathTech')}</strong> {t('demandForecasting.pathTechBody')}
        </p>
      </header>

      <EvidencePanel label={t('demandForecasting.artifacts.label')}>
        <ul className="elog-artifacts">
          {CASE_ARTIFACTS.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                <span className="elog-artifacts-name">{t(`demandForecasting.artifacts.items.${item.id}.name`)}</span>
                <span className="elog-artifacts-meta">{t(`demandForecasting.artifacts.items.${item.id}.meta`)}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="elog-status" role="note">
          {t('demandForecasting.artifacts.note')}
        </p>
      </EvidencePanel>

      {/* 1. Problem */}
      <Stage
        id="problem"
        number="01"
        title={t('demandForecasting.stages.problem.title')}
        fast={t('demandForecasting.stages.problem.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <div>
            <p>{t('demandForecasting.stages.problem.p1')}</p>
            <p>{t('demandForecasting.stages.problem.p2')}</p>
          </div>
          <EvidencePanel label={EV.dataset.target}>
            <p>
              {EV.dataset.unit} · {EV.dataset.horizon}
            </p>
          </EvidencePanel>
        </div>
      </Stage>

      {/* 2. Real public data & profiling */}
      <Stage
        id="data"
        number="02"
        title={t('demandForecasting.stages.data.title')}
        fast={t('demandForecasting.stages.data.fast', {
          rows: formatLocaleInt(EV.profiling.rows, language),
          series: EV.profiling.series,
          boards: EV.profiling.boards,
          specialties: EV.profiling.specialties,
          range: EV.profiling.dateRange,
        })}
      >
        <aside className="elog-synthetic-notice" aria-label={t('demandForecasting.realData.label')}>
          <span className="elog-synthetic-label">{t('demandForecasting.realData.label')}</span>
          <p>{t('demandForecasting.realData.statement')}</p>
        </aside>
        <MetricGrid
          items={[
            { label: 'Rows', value: formatLocaleInt(EV.profiling.rows, language) },
            { label: 'Series', value: EV.profiling.series },
            { label: 'Health boards', value: EV.profiling.boards },
            { label: 'Specialties', value: EV.profiling.specialties },
            { label: 'Mean', value: formatLocaleNum(EV.profiling.mean, 1) },
            { label: 'Median', value: formatLocaleNum(EV.profiling.median, 1) },
          ]}
        />
        <ChartFigure src={FIGURES.profiling} caption="Representative series (profiling)" />
        <p>{EV.profiling.covidNote}</p>
        <TechDetails summary={EV.dataset.sourceName}>
          <p>
            {EV.dataset.sourceOwner} · {EV.dataset.licence} ·{' '}
            <a href={EV.dataset.sourceUrl} target="_blank" rel="noreferrer noopener">
              {EV.dataset.sourceUrl}
            </a>
          </p>
          <p>
            {t('demandForecasting.artifacts.items.attribution.meta')} — {EV.dataset.datasetId}
          </p>
        </TechDetails>
      </Stage>

      {/* 3. Temporal protocol */}
      <Stage
        id="protocol"
        number="03"
        title={t('demandForecasting.stages.protocol.title')}
        fast={t('demandForecasting.stages.protocol.fast')}
      >
        <p>{EV.protocol.validationType}</p>
        <EvidencePanel label="DEVELOPMENT">
          <p>
            {EV.evaluationSets.development.support} · {formatLocaleInt(EV.evaluationSets.development.rows, language)}{' '}
            rows · {EV.evaluationSets.development.series} series · {EV.evaluationSets.development.origins} origins
          </p>
        </EvidencePanel>
        <EvidencePanel label="FINAL_LOCKED_EVALUATION">
          <p>
            {EV.evaluationSets.final.support} · {formatLocaleInt(EV.evaluationSets.final.rows, language)} rows ·{' '}
            {EV.evaluationSets.final.series} series · {EV.evaluationSets.final.origins} origins · targets{' '}
            {EV.evaluationSets.final.targets}
          </p>
        </EvidencePanel>
      </Stage>

      {/* 4. Leakage prevention */}
      <Stage
        id="leakage"
        number="04"
        title={t('demandForecasting.stages.leakage.title')}
        fast={t('demandForecasting.stages.leakage.fast')}
      >
        <ul className="elog-list">
          {EV.protocol.leakageChecks.map((item) => (
            <li key={item}>
              <code>{item}</code>
            </li>
          ))}
        </ul>
      </Stage>

      {/* 5. Baselines */}
      <Stage
        id="baselines"
        number="05"
        title={t('demandForecasting.stages.baselines.title')}
        fast={t('demandForecasting.stages.baselines.fast')}
      >
        <MetricGrid
          items={EV.models
            .filter((m) => m.role === 'baseline')
            .flatMap((m) => [
              {
                label: `${humanizeModel(m.id)} · ${t('demandForecasting.labels.devWape')}`,
                value: formatLocalePct(m.devWape, language),
              },
              {
                label: `${humanizeModel(m.id)} · ${t('demandForecasting.labels.finalWape')}`,
                value: formatLocalePct(m.finalWape, language),
              },
            ])}
        />
      </Stage>

      {/* 6. ETS / SARIMA */}
      <Stage
        id="statistical"
        number="06"
        title={t('demandForecasting.stages.statistical.title')}
        fast={t('demandForecasting.stages.statistical.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Role</th>
                <th scope="col">{t('demandForecasting.labels.devWape')}</th>
                <th scope="col">{t('demandForecasting.labels.finalWape')}</th>
              </tr>
            </thead>
            <tbody>
              {[ets, sarima].map((row) => (
                <tr key={row.id} className={row.id === EV.primaryModel.id ? 'is-selected' : undefined}>
                  <th scope="row">{humanizeModel(row.id)}</th>
                  <td>{roleLabel(row.role)}</td>
                  <td>{formatLocalePct(row.devWape, language)}</td>
                  <td>{formatLocalePct(row.finalWape, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ChartFigure src={FIGURES.headlineWape} caption="Headline WAPE — model comparison" />
        <p>{EV.primaryModel.note}</p>
      </Stage>

      {/* 7. LightGBM */}
      <Stage
        id="lightgbm"
        number="07"
        title={t('demandForecasting.stages.lightgbm.title')}
        fast={t('demandForecasting.stages.lightgbm.fast')}
      >
        <MetricGrid
          items={[
            { label: t('demandForecasting.labels.devWape'), value: formatLocalePct(modelById('lightgbm_global_full_v1').devWape, language) },
            { label: t('demandForecasting.labels.finalWape'), value: formatLocalePct(modelById('lightgbm_global_full_v1').finalWape, language) },
          ]}
        />
      </Stage>

      {/* 8. Backtesting: full DEVELOPMENT vs FINAL_LOCKED_EVALUATION comparison */}
      <Stage
        id="backtesting"
        number="08"
        title={t('demandForecasting.stages.backtesting.title')}
        fast={t('demandForecasting.stages.backtesting.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Role</th>
                <th scope="col">DEVELOPMENT WAPE (n={formatLocaleInt(EV.evaluationSets.development.rows, language)})</th>
                <th scope="col">FINAL_LOCKED_EVALUATION WAPE (n={formatLocaleInt(EV.evaluationSets.final.rows, language)})</th>
              </tr>
            </thead>
            <tbody>
              {EV.models.map((row) => (
                <tr key={row.id} className={row.id === EV.primaryModel.id ? 'is-selected' : undefined}>
                  <th scope="row">{humanizeModel(row.id)}</th>
                  <td>{roleLabel(row.role)}</td>
                  <td>{formatLocalePct(row.devWape, language)}</td>
                  <td>{formatLocalePct(row.finalWape, language)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ChartFigure src={FIGURES.devVsFinal} caption="Point WAPE — development vs final" />
        <p>{EV.backtesting.generalizationGapNote}</p>
      </Stage>

      {/* 9. Uncertainty */}
      <Stage
        id="uncertainty"
        number="09"
        title={t('demandForecasting.stages.uncertainty.title')}
        fast={t('demandForecasting.stages.uncertainty.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">{t('demandForecasting.labels.level')}</th>
                <th scope="col">{t('demandForecasting.labels.coverage')}</th>
                <th scope="col">{t('demandForecasting.labels.gap')}</th>
              </tr>
            </thead>
            <tbody>
              {EV.intervalsFinalEts.map((row) => (
                <tr key={row.level}>
                  <th scope="row">{formatLocalePct(row.level, language, 0)}</th>
                  <td>{formatLocalePct(row.coverage, language)}</td>
                  <td>
                    {row.gap >= 0 ? '+' : ''}
                    {formatLocaleNum(row.gap * 100, 2)} pp
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ChartFigure src={FIGURES.intervalCalibration} caption="Interval calibration — final lockbox (ETS)" />
      </Stage>

      {/* 10. Final lockbox */}
      <Stage
        id="lockbox"
        number="10"
        title={t('demandForecasting.stages.lockbox.title')}
        fast={t('demandForecasting.stages.lockbox.fast')}
      >
        <MetricGrid
          items={[
            { label: t('demandForecasting.labels.frozenPrimary'), value: humanizeModel(EV.primaryModel.id) },
            {
              label: `ETS · ${t('demandForecasting.labels.finalWape')}`,
              value: formatLocalePct(EV.finalComparison.etsWape, language),
            },
            {
              label: `SARIMA · ${t('demandForecasting.labels.finalWape')}`,
              value: formatLocalePct(EV.finalComparison.sarimaWape, language),
            },
            { label: t('demandForecasting.labels.postLockboxSelection'), value: EV.lockbox.postLockboxSelection ? 'Yes' : 'No' },
          ]}
        />
        <p className="elog-caveat">{t('demandForecasting.labels.noSwitchNote')}</p>
        <TechDetails summary={EV.lockbox.stateTransition}>
          <ul className="elog-list">
            <li>
              {t('demandForecasting.labels.postLockboxTuning')}: {EV.lockbox.postLockboxTuning ? 'true' : 'false'}
            </li>
            <li>
              {t('demandForecasting.labels.postLockboxSelection')}: {EV.lockbox.postLockboxSelection ? 'true' : 'false'}
            </li>
            <li>
              {t('demandForecasting.labels.ensemble')}: {EV.lockbox.ensemble ? 'true' : 'false'}
            </li>
            <li>
              {t('demandForecasting.labels.leakageAudit')}: {EV.lockbox.leakageAuditFinal}
            </li>
            <li>SHA-256: {EV.lockbox.freezeManifestSha256}</li>
          </ul>
        </TechDetails>
      </Stage>

      {/* 11. Conclusion & limitations */}
      <Stage
        id="outcome"
        number="11"
        title={t('demandForecasting.stages.outcome.title')}
        fast={t('demandForecasting.stages.outcome.fast')}
      >
        <ul className="elog-limits">
          {EV.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="elog-synthesis">{t('demandForecasting.stages.outcome.synthesis')}</p>
        <p className="elog-synthetic-note">{EV.excludedScope}</p>
        <nav className="elog-actions" aria-label={t('demandForecasting.actions.aria')}>
          <a
            className="atlas-access atlas-access--primary"
            href={CASEWORK_DEMAND_FORECASTING_HASH}
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>{t('demandForecasting.actions.backToTop')}</span>
            <span aria-hidden>↑</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('demandForecasting.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
        </nav>
      </Stage>
    </article>
  )
}
