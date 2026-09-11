import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickProjectCopy } from '../i18n/messages/projects.js'
import { ALL_PROJECT_IDS, NODE_PROFILES, getProjectMeta, getTerritoryForProject } from '../projects/registry.js'
import { listCaseworkEntries, groupBySystem } from '../casework/registry.js'
import { CV_HREF } from '../i18n/config.js'
import { CASEWORK_HASH } from '../constants/links.js'

/**
 * Home Hub — Phase 2, visually refreshed by "Home Visual Polish",
 * repositioned by Phase 1 (Data Analyst entry framing).
 *
 * Still five short blocks, still click-first (Home = quién soy, clicks =
 * qué sé hacer, vistas profundas = evidencia) — routing, nav and content
 * depth are unchanged. What changed is the Hero and Selected Work's visual
 * treatment: they now reuse the site's own Atlas visual system (atlas.css:
 * `.hero-atlas-frame` / `.hero-atlas-grid` / `.hero-territories`, the same
 * classes the pre-Phase-2 Hero.jsx used) instead of the plain, undecorated
 * `.home-hero` block Phase 2 shipped — recovering the Atlas identity
 * without reintroducing scroll-first Home or a second full Atlas map.
 *
 *   A. Hero/Positioning  — H1 = Data Analyst; stack SQL · Power BI · Excel ·
 *                           Python; seeking-first-role + opportunity levels
 *                           (Junior · Entry-Level · Trainee · Internship)
 *                           as seniority of opportunity, not title. Primary
 *                           CTA → #data-bi; secondary CTA → #projects.
 *                           Operations stays reachable via Atlas panel /
 *                           nav as Secondary track. Right column is a
 *                           compact CSS-only index panel; Casework /
 *                           Systems counts come from registries.
 *   B. Selected Work     — same 3 projects, same copy; PROVIDENTIA now
 *                           reads visually first (wider card, featured
 *                           border/shadow), Paradigm/Soma secondary. Adds
 *                           Atlas micro-labels (index, territory, status)
 *                           already available from the registry/i18n —
 *                           no new copy invented for these.
 *   C. Casework teaser   — a compact panel (case count + the real
 *                           Paradigm/PROVIDENTIA case-number ranges,
 *                           derived from the same registry CaseworkIndex
 *                           uses) instead of one generic line, still just
 *                           a teaser with one CTA to #casework.
 *   D. Core Toolkit      — SQL · Power BI · Excel · Python · Data Analysis
 *                           (ML stays elsewhere: Data & BI, projects,
 *                           Casework, full stack).
 *   E. Contact/Availability strip — estimated availability ~2 weeks.
 *
 * Everything retired from Home still lives at its real destination — see
 * components/About.jsx, DataBI.jsx, Operations.jsx, ProjectsIndex.jsx,
 * ContactView.jsx, CaseworkIndex.jsx and router/legacyHashRoadmap.js.
 */

const SELECTED_WORK_IDS = ['providentia', 'paradigm', 'soma']
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
      href: '#data-bi',
      number: '01',
      label: t('home.atlasPanel.entries.dataBi.label'),
      tag: t('home.atlasPanel.entries.dataBi.tag'),
      note: t('home.atlasPanel.entries.dataBi.note'),
    },
    {
      id: 'operations',
      href: '#operations',
      number: '02',
      label: t('home.atlasPanel.entries.operations.label'),
      tag: t('home.atlasPanel.entries.operations.tag'),
      note: t('home.atlasPanel.entries.operations.note'),
    },
    {
      id: 'casework',
      href: CASEWORK_HASH,
      number: String(caseworkCount).padStart(2, '0'),
      label: t('home.atlasPanel.entries.casework.label'),
      tag: t('home.atlasPanel.entries.casework.tag'),
      note: t('home.atlasPanel.entries.casework.note'),
    },
    {
      id: 'systems',
      href: '#projects',
      number: String(systemsCount).padStart(2, '0'),
      label: t('home.atlasPanel.entries.systems.label'),
      tag: t('home.atlasPanel.entries.systems.tag'),
      note: t('home.atlasPanel.entries.systems.note'),
    },
  ]

  return (
    <div className="home-hub">
      {/* A. Hero / Positioning — Atlas plate: two-column on desktop, the
          right column a compact CSS-built index panel, collapsing to a
          single compact column on mobile via existing atlas breakpoints. */}
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
                <a className="atlas-access atlas-access--primary home-cta-primary" href="#data-bi">
                  <span>{t('home.hero.ctaPrimary')}</span>
                  <span aria-hidden>↗</span>
                </a>
                <a className="atlas-access home-cta-secondary" href="#projects">
                  <span>{t('home.hero.ctaSecondary')}</span>
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

      {/* B. Selected Work — same 3 projects/copy; PROVIDENTIA reads first
          (wider, featured border), Paradigm/Soma secondary. Micro-labels
          (index, territory, status) all come from the existing registry
          + i18n — no new copy. */}
      <section className="home-section home-selected-work" aria-labelledby="home-selected-work-title">
        <div className="home-section-head">
          <span className="section-label">01</span>
          <h2 id="home-selected-work-title" className="home-section-title">
            {t('home.selectedWork.title')}
          </h2>
        </div>

        <div className="home-work-grid">
          {selectedWork.map((project) => (
            <a
              key={project.id}
              className={`home-work-card${project.featured ? ' home-work-card--featured' : ''}`}
              href={`#projects/${project.id}`}
            >
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
            </a>
          ))}
        </div>

        <a className="atlas-access home-section-cta" href="#projects">
          <span>{t('home.selectedWork.viewAll')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>

      {/* C. Casework teaser — compact panel: real case count + the real
          Paradigm/PROVIDENTIA case-number ranges (same registry grouping
          CaseworkIndex uses), still just a teaser with one CTA. */}
      <section className="home-section home-casework" aria-labelledby="home-casework-title">
        <div className="home-section-head">
          <span className="section-label">02</span>
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

        <a className="atlas-access atlas-access--primary home-section-cta" href={CASEWORK_HASH}>
          <span>{t('home.casework.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>

      {/* D. Core Toolkit */}
      <section className="home-section home-toolkit" aria-labelledby="home-toolkit-title">
        <div className="home-section-head">
          <span className="section-label">03</span>
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
        <a className="atlas-access home-section-cta" href="#data-bi">
          <span>{t('home.toolkit.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>

      {/* E. Contact / Availability strip */}
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
    </div>
  )
}
