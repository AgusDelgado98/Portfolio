import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CASEWORK_HASH } from '../constants/links.js'
import { getProjectMeta } from '../projects/registry.js'
import StackGroups from './StackGroups.jsx'

/**
 * Data & BI — Phase 1 (Destination Foundation), refined in Phase 3
 * (Professional Views Refinement, item 3).
 *
 * The primary professional destination. Answers, in order: qué hago
 * (Positioning) → qué capacidades tengo (Capabilities, grouped) → con qué
 * herramientas (Toolkit: 5 core tools first, the full 32-item stack behind
 * a native `<details>` disclosure — never a flat wall of tech) → dónde
 * está la evidencia (Evidence Paths: Projects, Casework, PROVIDENTIA,
 * Paradigm, Contact).
 *
 * Capabilities are grouped labels (Analytics & BI / Python & Automation /
 * ML & Applied AI / Decision Intelligence) — distinct from the raw Toolkit
 * list below; this is what makes the page read as capability-oriented
 * rather than just a tag cloud.
 *
 * <details>/<summary> is used for the full-stack disclosure rather than a
 * custom button+state widget: it's natively keyboard-operable and exposes
 * its own expanded/collapsed state to assistive tech with zero extra ARIA
 * plumbing (see item 17) — the same "real button, keyboard accessible"
 * contract with less code and less risk.
 *
 * No PDI/PROVIDENTIA metrics or new claims are introduced here (item 12) —
 * PROVIDENTIA's evidence link uses only its existing, already-approved
 * `annotation` copy (surfaced on Home's Selected Work card, not repeated
 * here — this is just a link out).
 */
export default function DataBI() {
  const { t } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  const positioningItems = t('dataBi.positioning.items')
  const items = Array.isArray(positioningItems) ? positioningItems : []

  const capabilityGroupKeys = ['analyticsBi', 'pythonAutomation', 'mlAppliedAi', 'decisionIntelligence']

  const coreToolkitItems = ['Python', 'SQL', 'Power BI', 'Excel', 'Machine Learning']

  const providentiaTitle = getProjectMeta('providentia')?.title || 'PROVIDENTIA'
  const paradigmTitle = getProjectMeta('paradigm')?.title || 'Paradigm'

  return (
    <article className="elog destination-view" aria-labelledby="data-bi-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('dataBi.hero.badge')}</span>
          <span>{t('dataBi.hero.kicker')}</span>
        </div>
        <h1 id="data-bi-title">{t('dataBi.hero.title')}</h1>
        <p className="elog-lede">{t('dataBi.hero.lede')}</p>

        <nav className="elog-actions" aria-label={t('nav.backToHome')}>
          <a className="atlas-access atlas-access--primary" href="#home">
            <span aria-hidden>←</span>
            <span>{t('nav.backToHome')}</span>
          </a>
        </nav>
      </header>

      {/* 1. Positioning — qué hago */}
      <section className="destination-section" aria-labelledby="data-bi-positioning-title">
        <h2 id="data-bi-positioning-title" className="destination-section-title">
          {t('dataBi.positioning.title')}
        </h2>
        <div className="destination-grid">
          {items.map((item) => (
            <div key={item.title} className="destination-card">
              <h3>{item.title}</h3>
              {item.description ? <p className="destination-card-desc">{item.description}</p> : null}
            </div>
          ))}
        </div>
      </section>

      {/* 2. Capabilities — qué capacidades tengo (grouped, not the raw stack) */}
      <section className="destination-section" aria-labelledby="data-bi-capabilities-title">
        <h2 id="data-bi-capabilities-title" className="destination-section-title">
          {t('dataBi.capabilitiesTitle')}
        </h2>
        <div className="destination-grid">
          {capabilityGroupKeys.map((key) => {
            const groupItems = t(`dataBi.capabilityGroups.${key}.items`)
            return (
              <div key={key} className="destination-card">
                <h3>{t(`dataBi.capabilityGroups.${key}.title`)}</h3>
                {Array.isArray(groupItems) && groupItems.length > 0 && (
                  <ul>
                    {groupItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* 3. Toolkit — con qué herramientas (core first, full stack on disclosure) */}
      <section className="destination-section" aria-labelledby="data-bi-toolkit-title">
        <h2 id="data-bi-toolkit-title" className="destination-section-title">
          {t('dataBi.coreToolkitTitle')}
        </h2>
        <ul className="home-toolkit-list" aria-label={t('dataBi.coreToolkitTitle')}>
          {coreToolkitItems.map((item) => (
            <li key={item} className="pill accent">
              {item}
            </li>
          ))}
        </ul>
        <details className="toolkit-disclosure">
          <summary>{t('dataBi.fullToolkitToggle')}</summary>
          <div className="toolkit-disclosure-body">
            <StackGroups />
          </div>
        </details>
      </section>

      {/* 4. Evidence Paths — dónde está la evidencia */}
      <section className="destination-section" aria-labelledby="data-bi-evidence-title">
        <h2 id="data-bi-evidence-title" className="destination-section-title">
          {t('dataBi.evidenceTitle')}
        </h2>
        <p className="destination-section-lead">{t('dataBi.evidenceLede')}</p>
        <div className="destination-cross-links">
          <a className="atlas-access" href="#projects">
            <span>{t('dataBi.evidenceProjects')}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="atlas-access" href={CASEWORK_HASH}>
            <span>{t('dataBi.evidenceCasework')}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="atlas-access" href="#projects/providentia">
            <span>{providentiaTitle}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="atlas-access" href="#projects/paradigm">
            <span>{paradigmTitle}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="atlas-access" href="#contact">
            <span>{t('dataBi.evidenceContact')}</span>
            <span aria-hidden>↗</span>
          </a>
        </div>
      </section>
    </article>
  )
}
