import React, { useEffect, useId, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { formatLocaleInt, formatLocalePct, formatLocaleNum } from '../../i18n/format.js'
import {
  CASEWORK_HASH,
  CASEWORK_CAPACITY_DECISION_HASH,
  CASEWORK_DEMAND_FORECASTING_HASH,
  CAPACITY_DECISION_EVIDENCE_BASE,
  PROVIDENTIA_REPO_URL,
} from '../../constants/links.js'
import { CAPACITY_DECISION_EVIDENCE as EV } from './data.js'
import './capacity-decision.css'

/**
 * Small presentational primitives, duplicated (not imported) from the other
 * casework views on purpose so this case stays decoupled from Cases 01–03 —
 * but they render through the exact same `.elog-*` classes from
 * engineering-log.css (already loaded globally via App.jsx). The only new
 * CSS this case needs is the PI80/PI90/PI95 selector (capacity-decision.css).
 */
function Stage({ id, number, title, children, fast }) {
  const { t } = useLanguage()
  return (
    <section className="elog-stage" id={`capdec-${id}`} aria-labelledby={`capdec-${id}-title`}>
      <header className="elog-stage-head">
        <span className="elog-stage-number" aria-hidden>
          {t('capacityDecision.stagePrefix', { number })}
        </span>
        <h2 id={`capdec-${id}-title`}>{title}</h2>
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

/**
 * PI80 / PI90 / PI95 selector. Local state only, no side effects — every
 * value it displays is a lookup into the already-frozen Evidence Pack data
 * (EV.policyMetrics), never recomputed.
 */
function PolicySwitch({ value, onChange, ariaLabel }) {
  const options = ['PI80', 'PI90', 'PI95']
  return (
    <div className="policy-switch" role="group" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button key={opt} type="button" aria-pressed={value === opt} onClick={() => onChange(opt)}>
          {opt}
        </button>
      ))}
    </div>
  )
}

const CASE_ARTIFACTS = [
  { id: 'notebook', href: `${CAPACITY_DECISION_EVIDENCE_BASE}/capacity_decision_case_notebook.ipynb` },
  { id: 'metrics', href: `${CAPACITY_DECISION_EVIDENCE_BASE}/decision_metrics.csv` },
  { id: 'tradeoff', href: `${CAPACITY_DECISION_EVIDENCE_BASE}/policy_tradeoff.csv` },
  { id: 'claims', href: `${CAPACITY_DECISION_EVIDENCE_BASE}/claims_contract.md` },
  { id: 'readme', href: `${CAPACITY_DECISION_EVIDENCE_BASE}/README.md` },
]

const FIGURES = {
  tradeoff: `${CAPACITY_DECISION_EVIDENCE_BASE}/figures/p6-01-policy-tradeoff-exceedance-buffer.png`,
  exceedanceVsBuffer: `${CAPACITY_DECISION_EVIDENCE_BASE}/figures/p6-02-exceedance-vs-buffer.png`,
  shortfallVsExcess: `${CAPACITY_DECISION_EVIDENCE_BASE}/figures/p6-03-shortfall-vs-excess.png`,
  finalByPolicy: `${CAPACITY_DECISION_EVIDENCE_BASE}/figures/p7-decision-exceedance-by-policy.png`,
}

const STAGE_IDS = [
  'decisionProblem', 'forecastInput', 'intervals', 'requiredCapacity',
  'exceedance', 'buffer', 'shortfall', 'tradeoff',
  'referencePolicy', 'lockbox', 'outcome',
]

export default function CapacityDecision({ onExit }) {
  const { t, language } = useLanguage()
  const [policy, setPolicy] = useState('PI90')

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const scrollToStage = (stageId, event) => {
    event.preventDefault()
    const target = document.getElementById(`capdec-${stageId}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const roleLabel = (role) => t(`capacityDecision.labels.role.${role}`) || role
  const finalSelected = EV.policyMetrics.final[policy]

  return (
    <article className="elog" id="capacity-decision" aria-labelledby="capdec-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('capacityDecision.hero.badge')}</span>
          <span>{t('capacityDecision.hero.caseLine')}</span>
          <span>{t('capacityDecision.hero.status')}</span>
        </div>
        <p className="elog-kicker">{t('capacityDecision.hero.kicker')}</p>
        <h1 id="capdec-title">{t('capacityDecision.hero.title')}</h1>
        <p className="elog-lede">{t('capacityDecision.hero.lede')}</p>
        <p className="elog-caveat">{t('capacityDecision.boundaryNote')}</p>

        <nav className="elog-actions" aria-label={t('capacityDecision.actions.aria')}>
          <a className="atlas-access atlas-access--primary" href="#proyectos" onClick={onExit}>
            <span>{t('capacityDecision.actions.backToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('capacityDecision.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={CASEWORK_DEMAND_FORECASTING_HASH}>
            <span>{t('capacityDecision.actions.viewCase03')}</span>
            <span aria-hidden>→</span>
          </a>
          <a className="atlas-access" href={PROVIDENTIA_REPO_URL} target="_blank" rel="noreferrer noopener">
            <span>{t('capacityDecision.actions.viewRepo')}</span>
            <span aria-hidden>↗</span>
          </a>
        </nav>

        <nav className="elog-toc" aria-label={t('capacityDecision.tocAria')}>
          <ol>
            {STAGE_IDS.map((id, idx) => (
              <li key={id}>
                <a href={CASEWORK_CAPACITY_DECISION_HASH} onClick={(event) => scrollToStage(id, event)}>
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  {t(`capacityDecision.stages.${id}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="elog-path-note">
          <strong>{t('capacityDecision.pathFast')}</strong> {t('capacityDecision.pathFastBody')}{' '}
          <strong>{t('capacityDecision.pathTech')}</strong> {t('capacityDecision.pathTechBody')}
        </p>
      </header>

      <EvidencePanel label={t('capacityDecision.artifacts.label')}>
        <ul className="elog-artifacts">
          {CASE_ARTIFACTS.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                <span className="elog-artifacts-name">{t(`capacityDecision.artifacts.items.${item.id}.name`)}</span>
                <span className="elog-artifacts-meta">{t(`capacityDecision.artifacts.items.${item.id}.meta`)}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="elog-status" role="note">
          {t('capacityDecision.artifacts.note')}
        </p>
      </EvidencePanel>

      {/* 1. Decision problem */}
      <Stage
        id="decisionProblem"
        number="01"
        title={t('capacityDecision.stages.decisionProblem.title')}
        fast={t('capacityDecision.stages.decisionProblem.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <div>
            <p>{t('capacityDecision.stages.decisionProblem.p1')}</p>
            <p>{t('capacityDecision.stages.decisionProblem.p2')}</p>
          </div>
          <EvidencePanel label={t('capacityDecision.realData.label')}>
            <p>{t('capacityDecision.realData.statement')}</p>
          </EvidencePanel>
        </div>
      </Stage>

      {/* 2. Forecast + uncertainty as input */}
      <Stage
        id="forecastInput"
        number="02"
        title={t('capacityDecision.stages.forecastInput.title')}
        fast={t('capacityDecision.stages.forecastInput.fast')}
      >
        <EvidencePanel label={t('capacityDecision.actions.viewCase03')}>
          <p>{EV.caseBoundary.takesAsGiven}</p>
        </EvidencePanel>
        <ul className="elog-list elog-list--warn">
          {EV.caseBoundary.doesNotRepeat.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Stage>

      {/* 3. PI80 / PI90 / PI95 */}
      <Stage
        id="intervals"
        number="03"
        title={t('capacityDecision.stages.intervals.title')}
        fast={t('capacityDecision.stages.intervals.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">Policy</th>
                <th scope="col">Level</th>
                <th scope="col">{t('capacityDecision.labels.policyRole')}</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(EV.policies).map(([id, policyDef]) => (
                <tr key={id} className={policyDef.role === 'reference' ? 'is-selected' : undefined}>
                  <th scope="row">{id}</th>
                  <td>{formatLocalePct(policyDef.level, language, 0)}</td>
                  <td>{roleLabel(policyDef.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stage>

      {/* 4. Required capacity */}
      <Stage
        id="requiredCapacity"
        number="04"
        title={t('capacityDecision.stages.requiredCapacity.title')}
        fast={t('capacityDecision.stages.requiredCapacity.fast')}
      >
        <pre className="elog-code">
          <code>
            {EV.formula.requiredCapacity}
            {'\n'}
            {EV.formula.buffer}
          </code>
        </pre>
        <MetricGrid
          items={[
            { label: t('capacityDecision.labels.currentCapacitySource'), value: EV.currentCapacity.source },
            { label: t('capacityDecision.labels.currentCapacityInvented'), value: EV.currentCapacity.invented ? 'true' : 'false' },
            { label: t('capacityDecision.actions.viewCase03'), value: EV.decisionUnit },
          ]}
        />
      </Stage>

      {/* 5. Exceedance */}
      <Stage
        id="exceedance"
        number="05"
        title={t('capacityDecision.stages.exceedance.title')}
        fast={t('capacityDecision.stages.exceedance.fast')}
      >
        <MetricGrid
          items={[
            {
              label: `PI90 · ${t('capacityDecision.labels.final')}`,
              value: formatLocalePct(EV.policyMetrics.final.PI90.exceedanceRate, language, 2),
              note: t('capacityDecision.labels.exceedance'),
            },
          ]}
        />
      </Stage>

      {/* 6. Buffer */}
      <Stage
        id="buffer"
        number="06"
        title={t('capacityDecision.stages.buffer.title')}
        fast={t('capacityDecision.stages.buffer.fast')}
      >
        <MetricGrid
          items={[
            {
              label: `PI90 · ${t('capacityDecision.labels.final')}`,
              value: formatLocaleNum(EV.policyMetrics.final.PI90.meanBuffer, 1),
              note: t('capacityDecision.labels.meanBuffer'),
            },
          ]}
        />
      </Stage>

      {/* 7. Shortfall */}
      <Stage
        id="shortfall"
        number="07"
        title={t('capacityDecision.stages.shortfall.title')}
        fast={t('capacityDecision.stages.shortfall.fast')}
      >
        <MetricGrid
          items={[
            {
              label: `PI90 · ${t('capacityDecision.labels.final')}`,
              value: formatLocaleInt(EV.policyMetrics.final.PI90.maximumShortfall, language),
              note: t('capacityDecision.labels.maximumShortfall'),
            },
          ]}
        />
        <p className="elog-caveat">{EV.limitations[3]}</p>
      </Stage>

      {/* 8. Trade-off */}
      <Stage
        id="tradeoff"
        number="08"
        title={t('capacityDecision.stages.tradeoff.title')}
        fast={t('capacityDecision.stages.tradeoff.fast')}
      >
        <p className="elog-synthesis">{t('capacityDecision.stages.tradeoff.conclusion')}</p>
        <p>{t('capacityDecision.stages.tradeoff.conclusionNote')}</p>
        <div className="elog-charts">
          <ChartFigure src={FIGURES.tradeoff} caption="Policy trade-off — exceedance vs. buffer (PI80/90/95)" />
          <ChartFigure src={FIGURES.exceedanceVsBuffer} caption="Exceedance vs. buffer" />
          <ChartFigure src={FIGURES.shortfallVsExcess} caption="Shortfall vs. excess" />
        </div>
        <TechDetails summary={EV.lightgbmAgreementAtPI90.note.split('.')[0]}>
          <p>{EV.lightgbmAgreementAtPI90.note}</p>
        </TechDetails>
      </Stage>

      {/* 9. Reference policy */}
      <Stage
        id="referencePolicy"
        number="09"
        title={t('capacityDecision.stages.referencePolicy.title')}
        fast={t('capacityDecision.stages.referencePolicy.fast')}
      >
        <EvidencePanel label={EV.frozenPolicy.decisionRecord}>
          <p>{EV.frozenPolicy.note}</p>
        </EvidencePanel>
        <MetricGrid
          items={[
            { label: 'Primary model', value: EV.primaryModel },
            { label: 'Sensitivity model', value: EV.sensitivityModel },
            { label: 'Reference policy', value: EV.frozenPolicy.referencePolicy },
          ]}
        />
      </Stage>

      {/* 10. Final lockbox — interactive PI80/PI90/PI95 selector */}
      <Stage
        id="lockbox"
        number="10"
        title={t('capacityDecision.stages.lockbox.title')}
        fast={t('capacityDecision.stages.lockbox.fast')}
      >
        <div className="policy-switch-row">
          <PolicySwitch value={policy} onChange={setPolicy} ariaLabel={t('capacityDecision.labels.switchAria')} />
          <p className="policy-switch-note">{t('capacityDecision.labels.selectorNote')}</p>
        </div>

        <MetricGrid
          items={[
            {
              label: t('capacityDecision.labels.exceedance'),
              value: formatLocalePct(finalSelected.exceedanceRate, language, 2),
            },
            {
              label: t('capacityDecision.labels.meanBuffer'),
              value: formatLocaleNum(finalSelected.meanBuffer, 1),
            },
            {
              label: t('capacityDecision.labels.maximumShortfall'),
              value: formatLocaleInt(finalSelected.maximumShortfall, language),
            },
            {
              label: t('capacityDecision.labels.policyRole'),
              value: roleLabel(finalSelected.role),
              note: t('capacityDecision.labels.final'),
            },
          ]}
        />

        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">{t('capacityDecision.labels.development')}</th>
                <th scope="col">{t('capacityDecision.labels.exceedance')}</th>
                <th scope="col">{t('capacityDecision.labels.meanBuffer')}</th>
                <th scope="col">{t('capacityDecision.labels.maximumShortfall')}</th>
              </tr>
            </thead>
            <tbody>
              {['PI80', 'PI90', 'PI95'].map((id) => {
                const row = EV.policyMetrics.development[id]
                return (
                  <tr key={id} className={id === policy ? 'is-selected' : undefined}>
                    <th scope="row">{id}</th>
                    <td>{formatLocalePct(row.exceedanceRate, language, 2)}</td>
                    <td>{formatLocaleNum(row.meanBuffer, 1)}</td>
                    <td>{formatLocaleInt(row.maximumShortfall, language)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">{t('capacityDecision.labels.final')}</th>
                <th scope="col">{t('capacityDecision.labels.exceedance')}</th>
                <th scope="col">{t('capacityDecision.labels.meanBuffer')}</th>
                <th scope="col">{t('capacityDecision.labels.maximumShortfall')}</th>
              </tr>
            </thead>
            <tbody>
              {['PI80', 'PI90', 'PI95'].map((id) => {
                const row = EV.policyMetrics.final[id]
                return (
                  <tr key={id} className={id === policy ? 'is-selected' : undefined}>
                    <th scope="row">{id}</th>
                    <td>{formatLocalePct(row.exceedanceRate, language, 2)}</td>
                    <td>{formatLocaleNum(row.meanBuffer, 1)}</td>
                    <td>{formatLocaleInt(row.maximumShortfall, language)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <ChartFigure src={FIGURES.finalByPolicy} caption="Final lockbox — exceedance by policy" />

        <TechDetails summary={EV.lockbox.stateTransition}>
          <ul className="elog-list">
            <li>
              {t('capacityDecision.labels.postLockboxTuning')}: {EV.lockbox.postLockboxTuning ? 'true' : 'false'}
            </li>
            <li>
              {t('capacityDecision.labels.postLockboxSelection')}: {EV.lockbox.postLockboxSelection ? 'true' : 'false'}
            </li>
            <li>
              {t('capacityDecision.labels.leakageAudit')}: {EV.lockbox.leakageAuditFinal}
            </li>
            <li>SHA-256: {EV.lockbox.freezeManifestSha256}</li>
          </ul>
        </TechDetails>
      </Stage>

      {/* 11. Limitations & outcome */}
      <Stage
        id="outcome"
        number="11"
        title={t('capacityDecision.stages.outcome.title')}
        fast={t('capacityDecision.stages.outcome.fast')}
      >
        <ul className="elog-limits">
          {EV.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="elog-synthesis">{t('capacityDecision.stages.outcome.synthesis')}</p>
        <TechDetails summary="Claims contract">
          <p>
            <strong>Allowed:</strong> {EV.claimBoundary.allowedFinal.join(' · ')}
          </p>
          <p>
            <strong>Forbidden (examples):</strong> {EV.claimBoundary.forbiddenExamples.join(' · ')}
          </p>
        </TechDetails>
        <nav className="elog-actions" aria-label={t('capacityDecision.actions.aria')}>
          <a
            className="atlas-access atlas-access--primary"
            href={CASEWORK_CAPACITY_DECISION_HASH}
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>{t('capacityDecision.actions.backToTop')}</span>
            <span aria-hidden>↑</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('capacityDecision.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
        </nav>
      </Stage>
    </article>
  )
}
