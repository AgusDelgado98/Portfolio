import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CASEWORK_ALETHEIA_HASH } from '../../constants/links.js'
import { ALETHEIA_EVIDENCE as EV } from './data.js'
import { BreakTimelineChart, CompatibilityMatrixChart, SourceCoverageChart } from './charts.jsx'

/**
 * Internal Full Research surface — styled portfolio view, never raw files.
 * Route: #casework/aletheia/research
 */
export default function AletheiaResearch() {
  const { t } = useLanguage()

  return (
    <article className="elog aletheia-research" aria-labelledby="aletheia-research-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('aletheia.hero.eyebrow')}</span>
        </div>
        <h1 id="aletheia-research-title">{t('aletheia.research.title')}</h1>
        <p className="elog-lede">{t('aletheia.research.lede')}</p>
        <nav className="elog-actions" aria-label={t('aletheia.research.navAria')}>
          <a className="atlas-access atlas-access--primary" href={CASEWORK_ALETHEIA_HASH}>
            <span aria-hidden>←</span>
            <span>{t('aletheia.research.back')}</span>
          </a>
        </nav>
      </header>

      <section className="elog-stage" aria-labelledby="aletheia-research-overview">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-overview">{t('aletheia.research.overview')}</h2>
        </header>
        <div className="elog-stage-body">
          <p>{t('aletheia.research.overviewBody')}</p>
          <p className="elog-caveat" role="note">
            {t('aletheia.neutralFraming')}
          </p>
        </div>
      </section>

      <section className="elog-stage" aria-labelledby="aletheia-research-rulings">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-rulings">{t('aletheia.research.rulings')}</h2>
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

      <section className="elog-stage" aria-labelledby="aletheia-research-breaks">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-breaks">{t('aletheia.research.breaks')}</h2>
        </header>
        <div className="elog-stage-body">
          <BreakTimelineChart />
        </div>
      </section>

      <section className="elog-stage" aria-labelledby="aletheia-research-compat">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-compat">{t('aletheia.research.compatibility')}</h2>
        </header>
        <div className="elog-stage-body">
          <CompatibilityMatrixChart />
        </div>
      </section>

      <section className="elog-stage" aria-labelledby="aletheia-research-limits">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-limits">{t('aletheia.research.limitations')}</h2>
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

      <section className="elog-stage" aria-labelledby="aletheia-research-verify">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-verify">{t('aletheia.research.verification')}</h2>
        </header>
        <div className="elog-stage-body">
          <p>{t('aletheia.research.verificationBody')}</p>
          <SourceCoverageChart />
        </div>
      </section>

      <section className="elog-stage" aria-labelledby="aletheia-research-artifacts">
        <header className="elog-stage-head">
          <h2 id="aletheia-research-artifacts">{t('aletheia.research.artifacts')}</h2>
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
