import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CASEWORK_ALETHEIA_HASH } from '../../constants/links.js'
import {
  ALETHEIA_EVIDENCE as EV,
  formatAletheiaSubtests,
  getAletheiaVerificationFields,
} from './data.js'
import { BreakTimelineChart, CompatibilityMatrixChart, SourceCoverageChart } from './charts.jsx'

/**
 * Internal Full Research surface — styled portfolio view, never raw files.
 * Route: #casework/aletheia/research
 */
export default function AletheiaResearch() {
  const { t } = useLanguage()
  const { meta, metrics, residuals, actionable } = EV
  const verificationFields = getAletheiaVerificationFields(EV)

  return (
    <article className="elog aletheia-research" aria-labelledby="aletheia-research-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('aletheia.research.headerSystem')}</span>
        </div>
        <h1 id="aletheia-research-title">{t('aletheia.research.title')}</h1>
        <p className="aletheia-research-version">{t('aletheia.research.version')}</p>
        <p className="aletheia-freeze-status aletheia-freeze-status--research">
          <span>{meta.researchFoundationStatus}</span>
        </p>
        <p className="elog-lede">{t('aletheia.research.lede')}</p>
        <nav className="elog-actions" aria-label={t('aletheia.research.navAria')}>
          <a className="atlas-access atlas-access--primary" href={CASEWORK_ALETHEIA_HASH}>
            <span aria-hidden>←</span>
            <span>{t('aletheia.research.back')}</span>
          </a>
        </nav>
        <nav className="elog-toc aletheia-research-toc" aria-label={t('aletheia.research.tocAria')}>
          <ol>
            {[
              'closeout',
              'finalVerification',
              'finalFreeze',
              'rulings',
              'breaks',
              'compatibility',
              'limitations',
            ].map((id) => (
              <li key={id}>
                <a href={`#aletheia-research-${id}`}>{t(`aletheia.research.toc.${id}`)}</a>
              </li>
            ))}
          </ol>
        </nav>
      </header>

      <section className="elog-stage" id="aletheia-research-closeout" aria-labelledby="aletheia-research-closeout-h">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-closeout-h">{t('aletheia.research.closeout')}</h2>
        </header>
        <div className="elog-stage-body">
          <p>{t('aletheia.research.closeoutBody')}</p>
          <ul className="elog-list">
            <li>
              <strong>{residuals.total}</strong> {t('aletheia.research.residualTotal')}
            </li>
            <li>
              <strong>{residuals.resolved}</strong> {t('aletheia.research.residualResolved')}
            </li>
            <li>
              <strong>{residuals.acceptedLimitation}</strong>{' '}
              {t('aletheia.research.residualAccepted')}
            </li>
            <li>
              <strong>{residuals.outOfScope}</strong> {t('aletheia.research.residualOut')}
            </li>
          </ul>
          <p className="aletheia-chart-note">{t('aletheia.research.actionableNote')}</p>
          <ul className="elog-list">
            <li>
              {t('aletheia.research.actionableGov')}: {actionable.governance}
            </li>
            <li>
              {t('aletheia.research.actionableBreak')}: {actionable.breakBridge}
            </li>
            <li>
              {t('aletheia.research.actionableCompat')}: {actionable.compatibility}
            </li>
            <li>
              {t('aletheia.research.actionableProv')}: {actionable.provenanceSource}
            </li>
          </ul>
        </div>
      </section>

      <section
        className="elog-stage"
        id="aletheia-research-finalVerification"
        aria-labelledby="aletheia-research-verify-h"
      >
        <header className="elog-stage-head">
          <h2 id="aletheia-research-verify-h">{t('aletheia.research.finalVerification')}</h2>
        </header>
        <div className="elog-stage-body">
          <ul className="aletheia-verify-slots">
            {verificationFields.map((field) => (
              <li key={field.id}>
                <span className="aletheia-verify-key">{t(`aletheia.verification.${field.id}`)}</span>
                <span>{field.value}</span>
              </li>
            ))}
          </ul>
          <p className="aletheia-chart-note">
            {formatAletheiaSubtests(meta.subtestCount)} {t('aletheia.verification.techSubtests')} ·{' '}
            {meta.openpyxlWarnings} {t('aletheia.research.warningsNote')}
          </p>
          <SourceCoverageChart />
        </div>
      </section>

      <section
        className="elog-stage"
        id="aletheia-research-finalFreeze"
        aria-labelledby="aletheia-research-freeze-h"
      >
        <header className="elog-stage-head">
          <h2 id="aletheia-research-freeze-h">{t('aletheia.research.finalFreeze')}</h2>
        </header>
        <div className="elog-stage-body">
          <ul className="elog-list">
            <li>
              <strong>{t('aletheia.verification.techFreezeTag')}</strong>
              <span> — </span>
              <code>{meta.freezeTag}</code>
            </li>
            <li>
              <strong>{t('aletheia.verification.techFreezeCommit')}</strong>
              <span> — </span>
              <code>{meta.freezeCommit}</code>
            </li>
            <li>
              <strong>{t('aletheia.research.finalFreezeState')}</strong>
              <span> — </span>
              {meta.finalFreeze}
            </li>
            <li>
              {metrics.sourceManifestRecords} {t('aletheia.verification.techManifestRecords')}
            </li>
            <li>
              {metrics.statisticalObjects} {t('aletheia.verification.techObjects')}
            </li>
            <li>
              {metrics.statisticalBreaks} {t('aletheia.verification.techBreaks')}
            </li>
            <li>
              {metrics.compatibilityRelationships} {t('aletheia.verification.techCompat')}
            </li>
          </ul>
        </div>
      </section>

      <section className="elog-stage" id="aletheia-research-rulings" aria-labelledby="aletheia-research-rulings-h">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-rulings-h">{t('aletheia.research.rulings')}</h2>
        </header>
        <div className="elog-stage-body">
          <ul className="elog-list">
            <li>
              <strong>GOV-002</strong> — {EV.gov002.ruling}
            </li>
            <li>
              <strong>IPC</strong> — {EV.ipc.refusal}
            </li>
            <li>
              <strong>EPH</strong> — {t('aletheia.research.ephLine')}
            </li>
          </ul>
        </div>
      </section>

      <section className="elog-stage" id="aletheia-research-breaks" aria-labelledby="aletheia-research-breaks-h">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-breaks-h">{t('aletheia.research.breaks')}</h2>
        </header>
        <div className="elog-stage-body">
          <BreakTimelineChart />
        </div>
      </section>

      <section
        className="elog-stage"
        id="aletheia-research-compatibility"
        aria-labelledby="aletheia-research-compat-h"
      >
        <header className="elog-stage-head">
          <h2 id="aletheia-research-compat-h">{t('aletheia.research.compatibility')}</h2>
        </header>
        <div className="elog-stage-body">
          <CompatibilityMatrixChart />
        </div>
      </section>

      <section
        className="elog-stage"
        id="aletheia-research-limitations"
        aria-labelledby="aletheia-research-limits-h"
      >
        <header className="elog-stage-head">
          <h2 id="aletheia-research-limits-h">{t('aletheia.research.limitations')}</h2>
        </header>
        <div className="elog-stage-body">
          <ul className="elog-list">
            {EV.refusals.map((rule) => (
              <li key={rule.id}>
                <code>{rule.technical}</code> — {t(`aletheia.refusals.${rule.id}`)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="elog-stage" aria-labelledby="aletheia-research-artifacts-h">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-artifacts-h">{t('aletheia.research.artifacts')}</h2>
        </header>
        <div className="elog-stage-body">
          <ul className="elog-list">
            {EV.researchArtifacts.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <span> — {item.role}</span>
              </li>
            ))}
          </ul>
          <p className="aletheia-chart-note">{t('aletheia.research.artifactsNote')}</p>
        </div>
      </section>
    </article>
  )
}
