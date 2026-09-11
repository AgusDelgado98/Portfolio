import React, { useId, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { ALETHEIA_EVIDENCE as EV } from './data.js'

function pct(value, start, end) {
  if (end <= start) return 0
  return Math.max(0, Math.min(100, ((value - start) / (end - start)) * 100))
}

/** Source coverage map — bars from frozen source-manifest coverage_period only. */
export function SourceCoverageChart() {
  const { t } = useLanguage()
  const chart = EV.charts.sourceCoverage
  if (!chart?.sources?.length) return null
  const { axisStart, axisEnd, sources } = chart
  const ticks = [1996, 2000, 2005, 2010, 2015, 2020, 2026].filter(
    (y) => y >= axisStart && y <= axisEnd,
  )

  return (
    <figure className="aletheia-chart" aria-labelledby="aletheia-coverage-caption">
      <figcaption id="aletheia-coverage-caption" className="aletheia-chart-caption">
        {t('aletheia.charts.coverage.title')}
      </figcaption>
      <p className="aletheia-chart-lede">{t('aletheia.charts.coverage.lede')}</p>
      <p className="aletheia-evidence-basis">
        {t('aletheia.charts.evidenceBasisPrefix')}: {t('aletheia.charts.coverage.basis')}
      </p>
      <div className="aletheia-coverage" role="img" aria-label={t('aletheia.charts.coverage.aria')}>
        <div className="aletheia-coverage-axis" aria-hidden>
          {ticks.map((year) => (
            <span key={year} style={{ left: `${pct(year, axisStart, axisEnd)}%` }}>
              {year}
            </span>
          ))}
        </div>
        <ul className="aletheia-coverage-rows">
          {sources.map((src) => {
            const barEnd = src.openEnded ? axisEnd : src.endYear
            const left = pct(src.startYear, axisStart, axisEnd)
            const width = Math.max(1.2, pct(barEnd, axisStart, axisEnd) - left)
            const rangeLabel = src.openEnded
              ? `${src.start} → ${t('aletheia.charts.coverage.openEnded')}`
              : `${src.start} → ${src.end}`
            return (
              <li key={src.id} className="aletheia-coverage-row">
                <span className="aletheia-coverage-label">{src.label}</span>
                <div className="aletheia-coverage-track">
                  <span
                    className={`aletheia-coverage-bar${src.openEnded ? ' aletheia-coverage-bar--open' : ''}`}
                    style={{ left: `${left}%`, width: `${width}%` }}
                    title={`${src.label}: ${rangeLabel}`}
                  />
                </div>
                <span className="aletheia-coverage-range">{rangeLabel}</span>
              </li>
            )
          })}
        </ul>
      </div>
      <p className="aletheia-chart-note">{t('aletheia.charts.coverage.note')}</p>
      <TechProvenance chartKey="sourceCoverage" />
    </figure>
  )
}

/** IPC + EPH statistical break timeline from frozen break registry. */
export function BreakTimelineChart({ focusSeries = null }) {
  const { t } = useLanguage()
  const chart = EV.charts.breakTimeline
  if (!chart?.events?.length) return null
  const { axisStart, axisEnd, events } = chart
  const seriesList = focusSeries
    ? [focusSeries]
    : [...new Set(events.map((e) => e.series))]
  const ticks = [2005, 2010, 2015, 2020, 2026].filter((y) => y >= axisStart && y <= axisEnd)

  return (
    <figure className="aletheia-chart" aria-labelledby="aletheia-breaks-caption">
      <figcaption id="aletheia-breaks-caption" className="aletheia-chart-caption">
        {t('aletheia.charts.breaks.title')}
      </figcaption>
      <p className="aletheia-chart-lede">{t('aletheia.charts.breaks.lede')}</p>
      <p className="aletheia-evidence-basis">
        {t('aletheia.charts.evidenceBasisPrefix')}: {t('aletheia.charts.breaks.basis')}
      </p>
      <div className="aletheia-breaks" role="list" aria-label={t('aletheia.charts.breaks.aria')}>
        <div className="aletheia-breaks-axis" aria-hidden>
          {ticks.map((year) => (
            <span key={year} style={{ left: `${pct(year, axisStart, axisEnd)}%` }}>
              {year}
            </span>
          ))}
        </div>
        {seriesList.map((series) => {
          const seriesEvents = events.filter((e) => e.series === series)
          return (
            <div key={series} className="aletheia-breaks-series" role="listitem">
              <span className="aletheia-breaks-series-label">{series}</span>
              <div className="aletheia-breaks-track">
                <span className="aletheia-breaks-baseline" aria-hidden />
                {seriesEvents.map((ev) => {
                  const left = pct(ev.startYear, axisStart, axisEnd)
                  const width = Math.max(
                    1.4,
                    pct(ev.endYear, axisStart, axisEnd) - left,
                  )
                  const title = [
                    ev.effectivePeriod,
                    ev.breakType || t('aletheia.charts.breaks.typeUnset'),
                    ev.materiality,
                    ev.comparabilityImpact,
                    ev.disposition,
                  ]
                    .filter(Boolean)
                    .join(' · ')
                  return (
                    <button
                      key={ev.id}
                      type="button"
                      className={`aletheia-breaks-mark aletheia-breaks-mark--${ev.markKind}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                      title={title}
                      aria-label={`${series}: ${title}`}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <ul className="aletheia-breaks-legend">
        {events
          .filter((e) => !focusSeries || e.series === focusSeries)
          .map((ev) => (
            <li key={ev.id}>
              <strong>{ev.series}</strong>
              <span>{ev.effectivePeriod}</span>
              <code>{ev.breakType || '—'}</code>
              <code>{ev.disposition}</code>
            </li>
          ))}
      </ul>
      <TechProvenance chartKey="breakTimeline" />
    </figure>
  )
}

const STATUS_CLASS = {
  FORBIDDEN: 'forbidden',
  ALLOWED_WITH_CONDITIONS: 'conditional',
  DESCRIPTIVE_ONLY: 'descriptive',
}

/** Compact compatibility relations from frozen metric-compatibility-matrix. */
export function CompatibilityMatrixChart() {
  const { t } = useLanguage()
  const chart = EV.charts.compatibilityMatrix
  const [showFull, setShowFull] = useState(false)
  if (!chart?.featured?.length) return null
  const rows = showFull ? chart.full : chart.featured

  return (
    <figure className="aletheia-chart" aria-labelledby="aletheia-compat-caption">
      <figcaption id="aletheia-compat-caption" className="aletheia-chart-caption">
        {t('aletheia.charts.compat.title')}
      </figcaption>
      <p className="aletheia-chart-lede">{t('aletheia.charts.compat.lede')}</p>
      <p className="aletheia-evidence-basis">
        {t('aletheia.charts.evidenceBasisPrefix')}: {t('aletheia.charts.compat.basis')}
      </p>
      <div className="aletheia-compat-legend" role="list">
        {chart.statuses.map((status) => (
          <span key={status} className={`aletheia-compat-pill aletheia-compat-pill--${STATUS_CLASS[status]}`} role="listitem">
            {t(`aletheia.charts.compat.status.${status}`)}
          </span>
        ))}
      </div>
      <div className="aletheia-compat-scroll">
        <table className="aletheia-compat-table">
          <caption className="sr-only">{t('aletheia.charts.compat.aria')}</caption>
          <thead>
            <tr>
              <th scope="col">{t('aletheia.charts.compat.colA')}</th>
              <th scope="col">{t('aletheia.charts.compat.colB')}</th>
              <th scope="col">{t('aletheia.charts.compat.colStatus')}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <code>{row.left}</code>
                </td>
                <td>
                  <code>{row.right}</code>
                </td>
                <td>
                  <span className={`aletheia-compat-status aletheia-compat-status--${STATUS_CLASS[row.status]}`}>
                    {t(`aletheia.charts.compat.status.${row.status}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        type="button"
        className="aletheia-text-btn"
        onClick={() => setShowFull((v) => !v)}
        aria-expanded={showFull}
      >
        {showFull ? t('aletheia.charts.compat.hideFull') : t('aletheia.charts.compat.viewFull')}
      </button>
      <TechProvenance chartKey="compatibilityMatrix" />
    </figure>
  )
}

/** Outcome disposition chart — hidden until frozen counts exist. */
export function OutcomeChart() {
  const { t } = useLanguage()
  const outcomes = EV.charts.outcomes
  if (!outcomes || !Array.isArray(outcomes.counts) || outcomes.counts.length === 0) return null

  const max = Math.max(...outcomes.counts.map((c) => c.count), 1)

  return (
    <figure className="aletheia-chart" aria-labelledby="aletheia-outcomes-caption">
      <figcaption id="aletheia-outcomes-caption" className="aletheia-chart-caption">
        {t('aletheia.charts.outcomes.title')}
      </figcaption>
      <ul className="aletheia-outcomes" aria-label={t('aletheia.charts.outcomes.aria')}>
        {outcomes.counts.map((row) => (
          <li key={row.id}>
            <span>{row.id}</span>
            <span className="aletheia-outcomes-bar" style={{ width: `${(row.count / max) * 100}%` }} />
            <strong>{row.count}</strong>
          </li>
        ))}
      </ul>
      <TechProvenance chartKey="outcomes" />
    </figure>
  )
}

function TechProvenance({ chartKey }) {
  const { t } = useLanguage()
  const chart = EV.charts[chartKey]
  const panelId = useId()
  if (!chart?.sourceArtifact) return null
  return (
    <details className="elog-tech aletheia-chart-provenance">
      <summary id={panelId}>{t('aletheia.charts.provenanceSummary')}</summary>
      <div className="elog-tech-body" role="region" aria-labelledby={panelId}>
        <p>
          <strong>sourceArtifact</strong> · <code>{chart.sourceArtifact}</code>
        </p>
        <p>
          <strong>evidenceBasis</strong> · {chart.evidenceBasis}
        </p>
        <p>
          <strong>frozenClaim</strong> · {chart.frozenClaim}
        </p>
      </div>
    </details>
  )
}
