import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickProjectCopy } from '../i18n/messages/projects.js'
import {
  ALL_PROJECT_IDS,
  NODE_PROFILES,
  getProjectMeta,
  getTerritoryForProject,
  hasProject,
} from '../projects/registry.js'
import { listCaseworkEntries, groupBySystem } from '../casework/registry.js'
import { CV_HREF } from '../i18n/config.js'
import { PROJECTS_HASH, aboutSectionHash } from '../router/hashes.js'

/**
 * Home — interim version for F2 (PLAN-FROZEN v1.1). F3 replaces it.
 *
 * Phase 2's Home Hub, minus the Guided Portfolio Experience: the Recruiter /
 * Technical / Default layouts and the soft invitation are gone, so Home renders
 * ONE fixed order — exactly what "Default" used to render — and every link
 * points at a canonical route (About's sections stand in for the retired Data &
 * BI and Operations destinations; the Casework teaser now leads to Projects).
 *
 *   A. Hero/Positioning  — Data Analyst; stack; seeking-first-role line.
 *   B. Selected Work     — PROVIDENTIA · Caelum · Paradigm.
 *   C. Casework teaser   — real case count and the Paradigm / PROVIDENTIA
 *                           grouping; its CTA opens Projects (cases live under
 *                           their projects now).
 *   D. Core Toolkit
 *   E. Contact / availability strip
 *
 * Nothing here is redesigned yet; that is F3.
 */

// Fixed Home order and content.
const HOME_SECTIONS = ['hero', 'selectedWork', 'casework', 'toolkit', 'availability']
const SELECTED_WORK_IDS = ['providentia', 'caelum', 'paradigm'].filter(hasProject)
const SECTION_NUMBERS = { selectedWork: '01', casework: '02', toolkit: '03' }
const HERO_CTAS = {
  primary: { labelKey: 'home.hero.ctaPrimary', href: aboutSectionHash('skills') },
  secondary: { labelKey: 'home.hero.ctaSecondary', href: PROJECTS_HASH },
}

const LINKEDIN_HREF = 'https://www.linkedin.com/in/agustin-delgado-data98615190/'
const GITHUB_HREF = 'https://github.com/AgusDelgado98'

export default function Home() {
  const { t, language } = useLanguage()

  const selectedWork = SELECTED_WORK_IDS.map((id, index) => {
    const meta = getProjectMeta(id)
    const copy = pickProjectCopy(id, language)
    const territory = getTerritoryForProject(id)
    const status = NODE_PROFILES[id]?.status
    return {
      id,
      title: meta?.title || id,
      label: copy.label,
      annotation: copy.annotation,
      number: String(index + 1).padStart(2, '0'),
      territoryName: territory ? t(`projects.territories.${territory.id}.name`) : null,
      status,
      featured: id === 'providentia',
    }
  })

  const toolkitItems = ['SQL', 'Power BI', 'Excel', 'Python', 'Data Analysis']

  const caseworkEntries = listCaseworkEntries()
  const caseworkGroups = groupBySystem(caseworkEntries)
  const caseworkCount = caseworkEntries.length
  const systemsCount = ALL_PROJECT_IDS.length

  const atlasPanelRows = [
    {
      id: 'data-bi',
      href: aboutSectionHash('skills'),
      number: '01',
      label: t('home.atlasPanel.entries.dataBi.label'),
      tag: t('home.atlasPanel.entries.dataBi.tag'),
      note: t('home.atlasPanel.entries.dataBi.note'),
    },
    {
      id: 'operations',
      href: aboutSectionHash('experience'),
      number: '02',
      label: t('home.atlasPanel.entries.operations.label'),
      tag: t('home.atlasPanel.entries.operations.tag'),
      note: t('home.atlasPanel.entries.operations.note'),
    },
    {
      id: 'casework',
      href: PROJECTS_HASH,
      number: String(caseworkCount).padStart(2, '0'),
      label: t('home.atlasPanel.entries.casework.label'),
      tag: t('home.atlasPanel.entries.casework.tag'),
      note: t('home.atlasPanel.entries.casework.note'),
    },
    {
      id: 'systems',
      href: PROJECTS_HASH,
      number: String(systemsCount).padStart(2, '0'),
      label: t('home.atlasPanel.entries.systems.label'),
      tag: t('home.atlasPanel.entries.systems.tag'),
      note: t('home.atlasPanel.entries.systems.note'),
    },
  ]

  const sectionNumber = (key) => SECTION_NUMBERS[key]

  const sectionsByKey = {
    // A. Hero / Positioning — Atlas plate: two-column on desktop, the
    // right column a compact CSS-built index panel, collapsing to a
    // single compact column on mobile via existing atlas breakpoints.
    hero: (
      <section className="hero-section home-hero" id="portada" aria-labelledby="home-hero-title">
        <article className="hero-atlas-frame">
          <header className="hero-atlas-meta" aria-hidden="true">
            <span>{t('hero.atlas')}</span>
            <span>{t('hero.plateMeta')}</span>
            <span>{t('hero.coords')}</span>
          </header>

          <div className="hero-atlas-grid">
            <div className="hero-atlas-primary">
              <p className="hero-atlas-kicker">Agustín Delgado</p>
              <h1 id="home-hero-title" className="home-hero-tagline safe-text-render">
                {t('home.hero.title')}
              </h1>
              <p className="home-hero-stack">{t('home.hero.stack')}</p>
              <p className="home-hero-positioning">{t('home.hero.positioning')}</p>
              <div className="home-hero-seeking" aria-label={t('home.hero.seekingAria')}>
                <p className="home-hero-seeking-line">{t('home.hero.seeking')}</p>
                <p className="home-hero-levels">{t('home.hero.opportunityLevels')}</p>
              </div>

              <div className="home-hero-ctas">
                <a
                  className="atlas-access atlas-access--primary home-cta-primary"
                  href={HERO_CTAS.primary.href}
                >
                  <span>{t(HERO_CTAS.primary.labelKey)}</span>
                  <span aria-hidden>↗</span>
                </a>
                <a
                  className="atlas-access home-cta-secondary"
                  href={HERO_CTAS.secondary.href}
                >
                  <span>{t(HERO_CTAS.secondary.labelKey)}</span>
                  <span aria-hidden>↗</span>
                </a>
              </div>

              <nav className="home-hero-minor" aria-label={t('home.hero.minorAria')}>
                <a href={CV_HREF} download>
                  {t('hero.cv')}
                </a>
                <a href={LINKEDIN_HREF} target="_blank" rel="noopener noreferrer">
                  {t('hero.linkedin')}
                </a>
                <a href={GITHUB_HREF} target="_blank" rel="noopener noreferrer">
                  {t('hero.github')}
                </a>
                <a href="#about">{t('nav.about')}</a>
              </nav>
            </div>

            <aside className="hero-territories home-atlas-panel" aria-labelledby="home-atlas-panel-title">
              <div className="hero-territories-heading">
                <span className="hero-territories-coordinate">{t('hero.coords')}</span>
                <h2 id="home-atlas-panel-title">{t('home.atlasPanel.title')}</h2>
              </div>

              <ol className="hero-territories-list">
                {atlasPanelRows.map((row) => (
                  <li key={row.id}>
                    <a className="hero-territory home-atlas-panel-row" href={row.href}>
                      <span className="hero-territory-number">{row.number}</span>
                      <div className="hero-territory-copy">
                        <div className="hero-territory-title-row">
                          <h3>{row.label}</h3>
                          <span>{row.tag}</span>
                        </div>
                        <p>{row.note}</p>
                      </div>
                    </a>
                  </li>
                ))}
              </ol>

              <p className="home-atlas-panel-lang" aria-label={t('home.atlasPanel.langAria')}>
                <span aria-hidden="true">ES / EN</span>
              </p>
            </aside>
          </div>

          <footer className="hero-atlas-legend" aria-label={t('hero.legendAria')}>
            <span>
              <i aria-hidden /> {t('hero.legendFlow')}
            </span>
            <span>{t('hero.legendEdition')}</span>
          </footer>
        </article>
      </section>
    ),

    // B. Selected Work — PROVIDENTIA reads first (wider, featured border).
    // Micro-labels (index, territory, status) from registry + i18n.
    selectedWork: (
      <section className="home-section home-selected-work" aria-labelledby="home-selected-work-title">
        <div className="home-section-head">
          <span className="section-label">{sectionNumber('selectedWork')}</span>
          <h2 id="home-selected-work-title" className="home-section-title">
            {t('home.selectedWork.title')}
          </h2>
        </div>

        <div className="home-work-grid">
          {selectedWork.map((project) => {
            const cardClassName = `home-work-card${project.featured ? ' home-work-card--featured' : ''}`
            const cardContent = (
              <>
                <span className="home-work-card-meta" aria-hidden="true">
                  <span className="home-work-card-index">{project.number}</span>
                  {project.territoryName ? (
                    <span className="home-work-card-territory">{project.territoryName}</span>
                  ) : null}
                  {project.status ? (
                    <span className={`atlas-node-status atlas-node-status--${project.status.toLowerCase()}`}>
                      {t(`projects.status.${project.status}`)}
                    </span>
                  ) : null}
                </span>
                <span className="home-work-card-title safe-text-render">{project.title}</span>
                {project.label ? <span className="home-work-card-label">{project.label}</span> : null}
                {project.annotation ? <span className="home-work-card-annotation">{project.annotation}</span> : null}
                <span className="home-work-card-cta">{t('projects.consultSheet')}</span>
              </>
            )

            return (
              <a key={project.id} className={cardClassName} href={`${PROJECTS_HASH}/${project.id}`}>
                {cardContent}
              </a>
            )
          })}
        </div>

        <a className="atlas-access home-section-cta" href={PROJECTS_HASH}>
          <span>{t('home.selectedWork.viewAll')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    ),

    // C. Casework teaser — compact panel: real case count + the real
    // Paradigm/PROVIDENTIA case-number ranges (same registry grouping the
    // retired Casework index used), still just a teaser with one CTA.
    casework: (
      <section className="home-section home-casework" aria-labelledby="home-casework-title">
        <div className="home-section-head">
          <span className="section-label">{sectionNumber('casework')}</span>
          <h2 id="home-casework-title" className="home-section-title">
            {t('casework.hero.badge')}
          </h2>
        </div>
        <p className="home-section-lede">{t('home.casework.lede')}</p>

        <div className="home-casework-panel">
          <div className="home-casework-count">
            <span className="home-casework-count-number">{String(caseworkCount).padStart(2, '0')}</span>
            <span className="home-casework-count-label">{t('casework.hero.stats.casesLabel')}</span>
          </div>
          <ul className="home-casework-groups">
            {caseworkGroups.map((group) => {
              const isEvidenceGroup = group.entries.every(
                (entry) => entry.meta.classification === 'evidenceCase',
              )
              const first = group.entries[0]?.meta.number
              const last = group.entries[group.entries.length - 1]?.meta.number
              const range = isEvidenceGroup
                ? t('casework.evidenceCaseLabel')
                : first === last
                  ? first
                  : `${first}–${last}`
              return (
                <li key={group.system} className="home-casework-group">
                  <span className="home-casework-group-system">{group.system}</span>
                  <span className="home-casework-group-range">{range}</span>
                </li>
              )
            })}
          </ul>
        </div>

        <a className="atlas-access atlas-access--primary home-section-cta" href={PROJECTS_HASH}>
          <span>{t('home.casework.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    ),

    // D. Core Toolkit.
    toolkit: (
      <section className="home-section home-toolkit" aria-labelledby="home-toolkit-title">
        <div className="home-section-head">
          <span className="section-label">{sectionNumber('toolkit')}</span>
          <h2 id="home-toolkit-title" className="home-section-title">
            {t('home.toolkit.title')}
          </h2>
        </div>
        <ul className="home-toolkit-list" aria-label={t('home.toolkit.title')}>
          {toolkitItems.map((item) => (
            <li key={item} className="pill accent">
              {item}
            </li>
          ))}
        </ul>
        <a className="atlas-access home-section-cta" href={aboutSectionHash('skills')}>
          <span>{t('home.toolkit.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    ),

    // E. Contact / Availability strip.
    availability: (
      <section className="home-availability" aria-label={t('home.availability.aria')}>
        <div className="home-availability-facts">
          <span>{t('contact.aboutFacts.locationValue')} · {t('contact.tags.remote')}</span>
          <span>{t('contact.aboutFacts.availabilityLabel')}: {t('contact.aboutFacts.availabilityValue')}</span>
        </div>
        <div className="home-availability-ctas">
          <a className="atlas-access atlas-access--primary" href="#contact">
            <span>{t('nav.contact')}</span>
            <span aria-hidden>↗</span>
          </a>
          <a className="btn btn-ghost" href={CV_HREF} download>
            {t('hero.cv')}
          </a>
        </div>
      </section>
    ),
  }

  return (
    <div className="home-hub">
      {HOME_SECTIONS.map((key) => (
        <React.Fragment key={key}>{sectionsByKey[key]}</React.Fragment>
      ))}
    </div>
  )
}
