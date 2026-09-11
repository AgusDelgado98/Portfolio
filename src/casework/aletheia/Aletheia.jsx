import React, { useEffect, useId, useState } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import {
  CASEWORK_ALETHEIA_HASH,
  ALETHEIA_REPO_URL,
} from '../../constants/links.js'
import {
  ALETHEIA_EVIDENCE as EV,
  CASEWORK_ALETHEIA_RESEARCH_HASH,
  getAletheiaHeroSnapshot,
  getAletheiaVerificationFields,
} from './data.js'
import {
  BreakTimelineChart,
  CompatibilityMatrixChart,
  OutcomeChart,
  SourceCoverageChart,
} from './charts.jsx'
import RulingModal from './RulingModal.jsx'
import AletheiaResearch from './AletheiaResearch.jsx'
import './aletheia.css'

/**
 * ALETHEIA — Evidence Case (Data & BI), V3 evidence showcase.
 * Six blocks. No Evidence Explorer. Publication layer only — no new claims.
 */
function Stage({ id, number, title, children, fast }) {
  const { t } = useLanguage()
  return (
    <section className="elog-stage" id={`aletheia-${id}`} aria-labelledby={`aletheia-${id}-title`}>
      <header className="elog-stage-head">
        <span className="elog-stage-number" aria-hidden>
          {t('aletheia.stagePrefix', { number })}
        </span>
        <h2 id={`aletheia-${id}-title`}>{title}</h2>
        {fast ? <p className="elog-stage-fast">{fast}</p> : null}
      </header>
      <div className="elog-stage-body">{children}</div>
    </section>
  )
}

function TechDetails({ summary, children, detailsRef, className = 'elog-tech' }) {
  const panelId = useId()
  const [expanded, setExpanded] = useState(false)
  return (
    <details
      className={className}
      ref={detailsRef}
      onToggle={(event) => setExpanded(event.currentTarget.open)}
    >
      <summary id={panelId} aria-expanded={expanded}>
        {summary}
      </summary>
      <div className="elog-tech-body" role="region" aria-labelledby={panelId}>
        {children}
      </div>
    </details>
  )
}

/** Verification-block technical summary — quick depth, not Full Research. */
function VerificationTechnicalDetails() {
  const { t } = useLanguage()
  return (
    <TechDetails
      className="elog-tech aletheia-tech-disclosure"
      summary={t('aletheia.actions.technicalDetails')}
    >
      <p>{t('aletheia.verification.techIntro')}</p>
      <div>
        <h3 className="aletheia-tech-h">{t('aletheia.verification.techFlow')}</h3>
        <p className="aletheia-tech-flow">
          {EV.pipeline.map((step) => step.technical).join(' → ')}
        </p>
      </div>
      <div>
        <h3 className="aletheia-tech-h">{t('aletheia.verification.techProvenance')}</h3>
        <p>{EV.meta.researchFoundationStatus}</p>
      </div>
      <div>
        <h3 className="aletheia-tech-h">{t('aletheia.verification.techArtifacts')}</h3>
        <ul className="elog-list">
          {EV.researchArtifacts.map((item) => (
            <li key={item.id}>
              <strong>{item.label}</strong>
              <span> — {item.role}</span>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="aletheia-tech-h">{t('aletheia.verification.techAudit')}</h3>
        <ul className="elog-list">
          {EV.refusals.map((rule) => (
            <li key={rule.id}>
              <code>{rule.technical}</code>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="aletheia-tech-h">{t('aletheia.verification.techFrozen')}</h3>
        <p>
          <code>{EV.gov002.ruling}</code>
          <span> · </span>
          <code>{EV.gov002.quoteVsIndex}</code>
        </p>
      </div>
    </TechDetails>
  )
}

const STAGE_IDS = ['problem', 'method', 'cases', 'refusals', 'support', 'verification']

const PIPELINE_KEYS = ['raw', 'provenance', 'objects', 'breaks', 'compatibility', 'evidence', 'rulings']

export default function Aletheia({ onExit, section = null }) {
  const { t, language } = useLanguage()
  const snapshot = getAletheiaHeroSnapshot(EV.meta)
  const verificationFields = getAletheiaVerificationFields(EV.meta)
  const findings = Array.isArray(EV.findings) ? EV.findings : []
  const [openRuling, setOpenRuling] = useState(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [section])

  useEffect(() => {
    const description = document.querySelector('meta[name="description"]')
    const ogDescription = document.querySelector('meta[property="og:description"]')
    const prevDescription = description?.getAttribute('content')
    const prevOg = ogDescription?.getAttribute('content')
    const next = t('aletheia.meta.description')
    if (description && typeof next === 'string') description.setAttribute('content', next)
    if (ogDescription && typeof next === 'string') ogDescription.setAttribute('content', next)
    return () => {
      if (description && prevDescription != null) description.setAttribute('content', prevDescription)
      if (ogDescription && prevOg != null) ogDescription.setAttribute('content', prevOg)
    }
  }, [t, language])

  if (section === 'research') {
    return <AletheiaResearch />
  }

  const scrollToStage = (stageId, event) => {
    event.preventDefault()
    const target = document.getElementById(`aletheia-${stageId}`)
    if (!target) return
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <article className="elog" id="aletheia" aria-labelledby="aletheia-title">
      <header className="elog-hero aletheia-hero">
        <div className="elog-hero-meta">
          <span>{t('aletheia.hero.eyebrow')}</span>
        </div>
        <h1 id="aletheia-title">{t('aletheia.hero.title')}</h1>
        <p className="elog-lede">{t('aletheia.hero.lede')}</p>
        <p className="aletheia-thesis" role="note">
          <em>{t('aletheia.hero.thesisLine1')}</em>
          <br />
          <em>{t('aletheia.hero.thesisLine2')}</em>
        </p>

        {snapshot.length > 0 ? (
          <dl className="aletheia-snapshot" aria-label={t('aletheia.snapshot.aria')}>
            {snapshot.map((item) => (
              <div key={item.id} className="aletheia-snapshot-item">
                <dt>{t(`aletheia.snapshot.${item.id}`)}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <nav className="elog-actions" aria-label={t('aletheia.actions.aria')}>
          <a className="atlas-access atlas-access--primary" href="#data-bi" onClick={onExit}>
            <span aria-hidden>←</span>
            <span>{t('aletheia.actions.backToDataBi')}</span>
          </a>
        </nav>

        <nav className="elog-toc" aria-label={t('aletheia.tocAria')}>
          <ol>
            {STAGE_IDS.map((id, idx) => (
              <li key={id}>
                <a href={CASEWORK_ALETHEIA_HASH} onClick={(event) => scrollToStage(id, event)}>
                  <span>{String(idx + 1).padStart(2, '0')}</span>
                  {t(`aletheia.stages.${id}.title`)}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      {/* BLOCK 1 — Problem + first evidence */}
      <Stage
        id="problem"
        number="01"
        title={t('aletheia.stages.problem.title')}
        fast={t('aletheia.stages.problem.fast')}
      >
        <p>{t('aletheia.stages.problem.intro')}</p>
        <SourceCoverageChart />
      </Stage>

      {/* BLOCK 2 — Method flow */}
      <Stage
        id="method"
        number="02"
        title={t('aletheia.stages.method.title')}
        fast={t('aletheia.stages.method.fast')}
      >
        <p>{t('aletheia.stages.method.copy')}</p>
        <div className="aletheia-pipeline" role="list" aria-label={t('aletheia.stages.method.pipelineAria')}>
          {PIPELINE_KEYS.map((key, index) => (
            <React.Fragment key={key}>
              {index > 0 ? (
                <span className="aletheia-pipeline-arrow" aria-hidden>
                  →
                </span>
              ) : null}
              <span className="aletheia-pipeline-step" role="listitem">
                {t(`aletheia.pipeline.${key}.public`)}
              </span>
            </React.Fragment>
          ))}
        </div>
        <TechDetails summary={t('aletheia.stages.method.techSummary')}>
          <ol className="elog-list">
            {EV.pipeline.map((step) => (
              <li key={step.id}>
                <code>{step.technical}</code>
              </li>
            ))}
          </ol>
        </TechDetails>
      </Stage>

      {/* BLOCK 3 — Selected Cases */}
      <Stage
        id="cases"
        number="03"
        title={t('aletheia.stages.cases.title')}
        fast={t('aletheia.stages.cases.fast')}
      >
        <p className="elog-caveat" role="note">
          {t('aletheia.neutralFraming')}
        </p>

        <div className="aletheia-cases">
          <article className="aletheia-case aletheia-case--featured" aria-labelledby="aletheia-case-gov002">
            <span className="aletheia-case-code">{EV.gov002.id}</span>
            <h3 id="aletheia-case-gov002">{t('aletheia.cases.gov002.headline')}</h3>
            <p className="aletheia-case-lead">{t('aletheia.cases.gov002.context')}</p>

            <div className="aletheia-price-compare" aria-label={t('aletheia.cases.gov002.visualAria')}>
              <div className="aletheia-price-side">
                <strong>{t('aletheia.cases.gov002.sideA.product')}</strong>
                <span>{t('aletheia.cases.gov002.sideA.place')}</span>
              </div>
              <div className="aletheia-price-neq" aria-hidden>
                {t('aletheia.cases.gov002.neq')}
              </div>
              <div className="aletheia-price-side">
                <strong>{t('aletheia.cases.gov002.sideB.product')}</strong>
                <span>{t('aletheia.cases.gov002.sideB.place')}</span>
              </div>
            </div>

            <div className="aletheia-compare-rows">
              {EV.gov002.compareRows.map((row) => (
                <div key={row.id} className="aletheia-compare-row">
                  <span className="aletheia-compare-label">{t(`aletheia.cases.gov002.compare.${row.id}.label`)}</span>
                  <span className="aletheia-compare-a">{t(`aletheia.cases.gov002.compare.${row.id}.a`)}</span>
                  <span className="aletheia-compare-sep" aria-hidden>
                    ↔
                  </span>
                  <span className="aletheia-compare-b">{t(`aletheia.cases.gov002.compare.${row.id}.b`)}</span>
                </div>
              ))}
            </div>

            <p className="aletheia-result-badge">{t('aletheia.cases.gov002.result')}</p>
            <p className="aletheia-case-conclusion">
              <strong>{t('aletheia.cases.gov002.conclusion')}</strong>
            </p>

            <div className="aletheia-case-actions">
              <button type="button" className="atlas-access" onClick={() => setOpenRuling('gov002')}>
                <span>{t('aletheia.actions.viewRuling')}</span>
              </button>
            </div>

            <TechDetails summary={t('aletheia.cases.gov002.techSummary')}>
              <ul className="elog-list">
                {(Array.isArray(t('aletheia.cases.gov002.techLines'))
                  ? t('aletheia.cases.gov002.techLines')
                  : []
                ).map((line) => (
                  <li key={line}>
                    <code>{line}</code>
                  </li>
                ))}
                {EV.gov002.restrictions.map((rule) => (
                  <li key={rule}>
                    <code>{rule}</code>
                  </li>
                ))}
              </ul>
            </TechDetails>
          </article>

          <BreakTimelineChart />

          <article className="aletheia-case" aria-labelledby="aletheia-case-ipc">
            <span className="aletheia-case-code">{EV.ipc.id}</span>
            <h3 id="aletheia-case-ipc">{t('aletheia.cases.ipc.headline')}</h3>
            <p className="aletheia-case-conclusion">
              <strong>{t('aletheia.cases.ipc.conclusion')}</strong>
            </p>
            <p className="aletheia-case-ref">{t('aletheia.cases.ipc.timelineRef')}</p>
            <TechDetails summary={t('aletheia.cases.ipc.techSummary')}>
              <p>{t('aletheia.cases.ipc.techNote')}</p>
            </TechDetails>
          </article>

          <article className="aletheia-case" aria-labelledby="aletheia-case-eph">
            <span className="aletheia-case-code">{EV.eph.id}</span>
            <h3 id="aletheia-case-eph">{t('aletheia.cases.eph.headline')}</h3>

            <div className="aletheia-before-after" aria-label={t('aletheia.cases.eph.visualAria')}>
              <div className="aletheia-ba-step">
                <strong>{t('aletheia.cases.eph.before')}</strong>
              </div>
              <span className="aletheia-ba-arrow" aria-hidden>
                ↓
              </span>
              <div className="aletheia-ba-change">
                <strong>{t('aletheia.cases.eph.change')}</strong>
              </div>
              <span className="aletheia-ba-arrow" aria-hidden>
                ↓
              </span>
              <div className="aletheia-ba-step">
                <strong>{t('aletheia.cases.eph.after')}</strong>
              </div>
            </div>

            <div className="aletheia-eph-grid">
              <div>
                <h4 className="aletheia-eph-heading">{t('aletheia.cases.eph.whatChanged')}</h4>
                <ul className="aletheia-dimension-list">
                  {EV.eph.changeDimensions.map((dim) => (
                    <li key={dim}>{t(`aletheia.cases.eph.dimensions.${dim}`)}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="aletheia-eph-heading">{t('aletheia.cases.eph.whyAffects')}</h4>
                <p>{t('aletheia.cases.eph.whyBody')}</p>
              </div>
            </div>

            <p className="aletheia-case-conclusion">
              <strong>{t('aletheia.cases.eph.conclusion')}</strong>
            </p>
            <p className="aletheia-case-ref">{t('aletheia.cases.eph.timelineRef')}</p>

            <TechDetails summary={t('aletheia.cases.eph.techSummary')}>
              <p>{t('aletheia.cases.eph.techNote')}</p>
            </TechDetails>
          </article>
        </div>

        <CompatibilityMatrixChart />
      </Stage>

      {/* BLOCK 4 — Refusals */}
      <Stage
        id="refusals"
        number="04"
        title={t('aletheia.stages.refusals.title')}
        fast={t('aletheia.stages.refusals.fast')}
      >
        <p>{t('aletheia.stages.refusals.copy')}</p>
        <div className="aletheia-refuse-grid" role="list">
          {EV.refusals.map((rule) => (
            <div key={rule.id} className="aletheia-refuse-item" role="listitem">
              <span className="aletheia-refuse-public">{t(`aletheia.refusals.${rule.id}`)}</span>
              <code className="aletheia-refuse-tech">{rule.technical}</code>
            </div>
          ))}
        </div>
      </Stage>

      {/* BLOCK 5 — Support taxonomy + findings + optional outcomes */}
      <Stage
        id="support"
        number="05"
        title={t('aletheia.stages.support.title')}
        fast={t('aletheia.stages.support.fast')}
      >
        <p>{t('aletheia.stages.support.copy')}</p>
        <OutcomeChart />
        <div className="aletheia-taxonomy">
          {EV.supportTaxonomy.map((item) => {
            const examples = Array.isArray(item.examples) ? item.examples : []
            return (
              <div key={item.id} className="aletheia-taxonomy-item">
                <span className="aletheia-taxonomy-label">{t(`aletheia.taxonomy.${item.id}.label`)}</span>
                <p>{t(`aletheia.taxonomy.${item.id}.desc`)}</p>
                {examples.length > 0 ? (
                  <ul className="aletheia-taxonomy-examples">
                    {examples.slice(0, 2).map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>

        {findings.length > 0 ? (
          <div className="aletheia-findings" aria-label={t('aletheia.findings.aria')}>
            {findings.map((finding) => (
              <article key={finding.id} className="aletheia-finding">
                <p className="aletheia-finding-claim">
                  <span className="aletheia-finding-k">{t('aletheia.findings.claim')}</span>
                  {finding.claim}
                </p>
                <p className="aletheia-finding-status">
                  <span className="aletheia-finding-k">{t('aletheia.findings.status')}</span>
                  {finding.status}
                </p>
                <p className="aletheia-finding-why">
                  <span className="aletheia-finding-k">{t('aletheia.findings.why')}</span>
                  {finding.reason}
                </p>
              </article>
            ))}
          </div>
        ) : null}
      </Stage>

      {/* BLOCK 6 — Verification */}
      <Stage
        id="verification"
        number="06"
        title={t('aletheia.stages.verification.title')}
        fast={t('aletheia.stages.verification.fast')}
      >
        <p>{t('aletheia.stages.verification.copy')}</p>

        {verificationFields.length > 0 ? (
          <ul className="aletheia-verify-slots">
            {verificationFields.map((field) => (
              <li key={field.id}>
                <span className="aletheia-verify-key">{t(`aletheia.verification.${field.id}`)}</span>
                <span>{field.value}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <VerificationTechnicalDetails />

        <nav className="elog-actions" aria-label={t('aletheia.verification.ctaAria')}>
          <button type="button" className="atlas-access" onClick={() => setOpenRuling('gov002')}>
            <span>{t('aletheia.actions.viewRuling')}</span>
          </button>
          <a className="atlas-access" href={CASEWORK_ALETHEIA_RESEARCH_HASH}>
            <span>{t('aletheia.actions.fullResearch')}</span>
          </a>
          {ALETHEIA_REPO_URL ? (
            <a
              className="atlas-access atlas-access--primary"
              href={ALETHEIA_REPO_URL}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span>{t('aletheia.actions.github')}</span>
              <span aria-hidden>↗</span>
            </a>
          ) : null}
        </nav>
      </Stage>

      {openRuling ? <RulingModal rulingId={openRuling} onClose={() => setOpenRuling(null)} /> : null}
    </article>
  )
}
