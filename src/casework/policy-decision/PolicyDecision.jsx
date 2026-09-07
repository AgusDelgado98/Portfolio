import React, { useEffect, useId } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import {
  CASEWORK_HASH,
  CASEWORK_POLICY_DECISION_HASH,
  CASEWORK_DEMAND_FORECASTING_HASH,
  CASEWORK_CAPACITY_DECISION_HASH,
  POLICY_DECISION_EVIDENCE_BASE,
  PROVIDENTIA_REPO_URL,
} from '../../constants/links.js'
import { POLICY_DECISION_EVIDENCE as EV } from './data.js'

/**
 * Small presentational primitives, duplicated (not imported) from the other
 * casework views on purpose, same as Case 04 — this case stays decoupled
 * from Cases 01–04, rendering through the shared `.elog-*` classes from
 * engineering-log.css (loaded globally via App.jsx). No new CSS needed.
 */
function Stage({ id, number, title, children, fast }) {
  const { t } = useLanguage()
  return (
    <section className="elog-stage" id={`poldec-${id}`} aria-labelledby={`poldec-${id}-title`}>
      <header className="elog-stage-head">
        <span className="elog-stage-number" aria-hidden>
          {t('policyDecision.stagePrefix', { number })}
        </span>
        <h2 id={`poldec-${id}-title`}>{title}</h2>
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

const CASE_ARTIFACTS = [
  { id: 'claims', href: `${POLICY_DECISION_EVIDENCE_BASE}/claims_contract.md` },
  { id: 'readme', href: `${POLICY_DECISION_EVIDENCE_BASE}/README.md` },
  { id: 'manifest', href: `${POLICY_DECISION_EVIDENCE_BASE}/portfolio_manifest.json` },
]

const STAGE_IDS = [
  'decisionProblem', 'analyticalDesign', 'evaluationGrid', 'predictiveVsDecision',
  'bootstrap', 'policyComparison', 'powerBi', 'outcome',
]

export default function PolicyDecision({ onExit }) {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const scrollToStage = (stageId, event) => {
    event.preventDefault()
    const target = document.getElementById(`poldec-${stageId}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const roleLabel = (role) => t(`policyDecision.labels.role.${role}`) || role

  return (
    <article className="elog" id="policy-decision" aria-labelledby="poldec-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('policyDecision.hero.badge')}</span>
          <span>{t('policyDecision.hero.caseLine')}</span>
          <span>{t('policyDecision.hero.status')}</span>
        </div>
        <p className="elog-kicker">{t('policyDecision.hero.kicker')}</p>
        <h1 id="poldec-title">{t('policyDecision.hero.title')}</h1>
        <p className="elog-lede">{t('policyDecision.hero.lede')}</p>
        <p className="elog-caveat">{t('policyDecision.boundaryNote')}</p>

        <nav className="elog-actions" aria-label={t('policyDecision.actions.aria')}>
          <a className="atlas-access atlas-access--primary" href="#home" onClick={onExit}>
            <span>{t('policyDecision.actions.backToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('policyDecision.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
          <a className="atlas-access" href={CASEWORK_DEMAND_FORECASTING_HASH}>
            <span>{t('policyDecision.actions.viewCase03')}</span>
            <span aria-hidden>→</span>
          </a>
          <a className="atlas-access" href={CASEWORK_CAPACITY_DECISION_HASH}>
            <span>{t('policyDecision.actions.viewCase04')}</span>
            <span aria-hidden>→</span>
          </a>
          <a className="atlas-access" href={PROVIDENTIA_REPO_URL} target="_blank" rel="noreferrer noopener">
            <span>{t('policyDecision.actions.viewRepo')}</span>
            <span aria-hidden>↗</span>
          </a>
        </nav>

        <nav className="elog-toc" aria-label={t('policyDecision.tocAria')}>
          <ol>
            {STAGE_IDS.map((id, idx) => (
              <li key={id}>
                <a href={CASEWORK_POLICY_DECISION_HASH} onClick={(event) => scrollToStage(id, event)}>
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  {t(`policyDecision.stages.${id}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <p className="elog-path-note">
          <strong>{t('policyDecision.pathFast')}</strong> {t('policyDecision.pathFastBody')}{' '}
          <strong>{t('policyDecision.pathTech')}</strong> {t('policyDecision.pathTechBody')}
        </p>
      </header>

      <EvidencePanel label={t('policyDecision.artifacts.label')}>
        <ul className="elog-artifacts">
          {CASE_ARTIFACTS.map((item) => (
            <li key={item.id}>
              <a href={item.href} target="_blank" rel="noreferrer noopener">
                <span className="elog-artifacts-name">{t(`policyDecision.artifacts.items.${item.id}.name`)}</span>
                <span className="elog-artifacts-meta">{t(`policyDecision.artifacts.items.${item.id}.meta`)}</span>
              </a>
            </li>
          ))}
        </ul>
        <p className="elog-status" role="note">
          {t('policyDecision.artifacts.note')}
        </p>
      </EvidencePanel>

      {/* 1. Decision problem */}
      <Stage
        id="decisionProblem"
        number="01"
        title={t('policyDecision.stages.decisionProblem.title')}
        fast={t('policyDecision.stages.decisionProblem.fast')}
      >
        <div className="elog-grid elog-grid--2">
          <div>
            <p>{t('policyDecision.stages.decisionProblem.p1')}</p>
            <p>{t('policyDecision.stages.decisionProblem.p2')}</p>
          </div>
          <EvidencePanel label={t('policyDecision.actions.viewCase04')}>
            <p>{EV.caseBoundary.takesAsGiven}</p>
          </EvidencePanel>
        </div>
        <ul className="elog-list elog-list--warn">
          {EV.caseBoundary.doesNotRepeat.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Stage>

      {/* 2. Analytical design */}
      <Stage
        id="analyticalDesign"
        number="02"
        title={t('policyDecision.stages.analyticalDesign.title')}
        fast={t('policyDecision.stages.analyticalDesign.fast')}
      >
        <p>{t('policyDecision.stages.analyticalDesign.architecture')}</p>
      </Stage>

      {/* 3. Evaluation grid */}
      <Stage
        id="evaluationGrid"
        number="03"
        title={t('policyDecision.stages.evaluationGrid.title')}
        fast={t('policyDecision.stages.evaluationGrid.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">SET</th>
                <th scope="col">Cells</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(EV.evaluationDesign.setBreakdown).map(([set, count]) => (
                <tr key={set}>
                  <th scope="row">{set}</th>
                  <td>{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">under:over</th>
                <th scope="col">{t('policyDecision.labels.role.primary')}</th>
              </tr>
            </thead>
            <tbody>
              {EV.costScenarios.map((scenario) => (
                <tr key={scenario.id} className={scenario.role === 'primary' ? 'is-selected' : undefined}>
                  <th scope="row">{scenario.id}</th>
                  <td>{scenario.ratio}</td>
                  <td>{roleLabel(scenario.role)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stage>

      {/* 4. Predictive vs decision ranking */}
      <Stage
        id="predictiveVsDecision"
        number="04"
        title={t('policyDecision.stages.predictiveVsDecision.title')}
        fast={t('policyDecision.stages.predictiveVsDecision.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Model</th>
                <th scope="col">{t('policyDecision.labels.microWape')}</th>
              </tr>
            </thead>
            <tbody>
              {EV.predictiveRanking.map((row) => (
                <tr key={row.model}>
                  <th scope="row">{row.rank}</th>
                  <td>{row.model}</td>
                  <td>{row.microWape}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Model</th>
                <th scope="col">{t('policyDecision.labels.medianNormLoss')}</th>
                <th scope="col">{t('policyDecision.labels.iqr')}</th>
              </tr>
            </thead>
            <tbody>
              {EV.decisionRankingSetA.map((row) => (
                <tr key={row.model} className={row.rank === 1 ? 'is-selected' : undefined}>
                  <th scope="row">{row.rank}</th>
                  <td>{row.model}</td>
                  <td>{row.medianNormLoss}</td>
                  <td>{row.iqr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Stage>

      {/* 5. Bootstrap contrasts */}
      <Stage
        id="bootstrap"
        number="05"
        title={t('policyDecision.stages.bootstrap.title')}
        fast={t('policyDecision.stages.bootstrap.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">Contrast</th>
                <th scope="col">Δ median</th>
                <th scope="col">95% CI</th>
                <th scope="col">{t('policyDecision.labels.verdict')}</th>
              </tr>
            </thead>
            <tbody>
              {EV.bootstrapContrasts.map((row) => (
                <tr key={row.contrast}>
                  <th scope="row">{row.contrast}</th>
                  <td>{row.deltaMedian}</td>
                  <td>[{row.ci[0]}, {row.ci[1]}]</td>
                  <td>{row.verdict}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <TechDetails summary={`n=${EV.evaluationDesign.bootstrap.reps} · seed=${EV.evaluationDesign.bootstrap.seed} · ${EV.evaluationDesign.bootstrap.preRegisteredContrasts} pre-registered contrasts`}>
          <p>{EV.evaluationDesign.evaluationType} — {EV.evaluationDesign.window} · {EV.evaluationDesign.series} series.</p>
        </TechDetails>
      </Stage>

      {/* 6. Policy comparison (C10 only) */}
      <Stage
        id="policyComparison"
        number="06"
        title={t('policyDecision.stages.policyComparison.title')}
        fast={t('policyDecision.stages.policyComparison.fast')}
      >
        <div className="elog-table-wrap" role="region" tabIndex={0}>
          <table className="elog-table">
            <thead>
              <tr>
                <th scope="col">Policy</th>
                <th scope="col">{t('policyDecision.labels.medianNormLoss')}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="is-selected">
                <th scope="row">POLICY_01 (point)</th>
                <td>{EV.policyContinuitySetD.etsPointMedianNormLoss}</td>
              </tr>
              <tr>
                <th scope="row">PI90 (incumbent)</th>
                <td>{EV.policyContinuitySetD.etsPi90MedianNormLoss}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="elog-caveat">{EV.claimBoundary.allowed[4]}</p>
      </Stage>

      {/* 7. Power BI */}
      <Stage
        id="powerBi"
        number="07"
        title={t('policyDecision.stages.powerBi.title')}
        fast={t('policyDecision.stages.powerBi.fast')}
      >
        <EvidencePanel label="Status">
          <p className="elog-status" role="note">{EV.powerBi.status}</p>
        </EvidencePanel>
        <ul className="elog-list">
          {EV.powerBi.packagePages.map((page) => (
            <li key={page}>{page}</li>
          ))}
        </ul>
      </Stage>

      {/* 8. Limitations & outcome */}
      <Stage
        id="outcome"
        number="08"
        title={t('policyDecision.stages.outcome.title')}
        fast={t('policyDecision.stages.outcome.fast')}
      >
        <ul className="elog-limits">
          {EV.limitations.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className="elog-synthesis">{t('policyDecision.stages.outcome.synthesis')}</p>
        <TechDetails summary="Claims contract">
          <p>
            <strong>Allowed:</strong> {EV.claimBoundary.allowed.join(' · ')}
          </p>
          <p>
            <strong>Forbidden (examples):</strong> {EV.claimBoundary.forbidden.join(' · ')}
          </p>
        </TechDetails>
        <TechDetails summary={t('policyDecision.labels.reproducibility')}>
          <p>{t('policyDecision.labels.globalTestSuite')}: {EV.reproducibility.globalTestSuite}</p>
          <p>{t('policyDecision.labels.reconciliationChecks')}: {EV.reproducibility.reconciliationChecks}</p>
        </TechDetails>
        <nav className="elog-actions" aria-label={t('policyDecision.actions.aria')}>
          <a
            className="atlas-access atlas-access--primary"
            href={CASEWORK_POLICY_DECISION_HASH}
            onClick={(event) => {
              event.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <span>{t('policyDecision.actions.backToTop')}</span>
            <span aria-hidden>↑</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH} onClick={onExit}>
            <span>{t('policyDecision.actions.backToCasework')}</span>
            <span aria-hidden>←</span>
          </a>
        </nav>
      </Stage>
    </article>
  )
}
