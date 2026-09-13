import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickProjectCopy } from '../i18n/messages/projects.js'
import { ALL_PROJECT_IDS, NODE_PROFILES, getProjectMeta, getTerritoryForProject } from '../projects/registry.js'
import { listCaseworkEntries, groupBySystem } from '../casework/registry.js'
import { CV_HREF } from '../i18n/config.js'
import { CASEWORK_HASH } from '../constants/links.js'
import GuideInvitation from './GuideInvitation.jsx'
import { useGuide } from '../guide/GuideContext.jsx'
import { getHomeLayout, HOME_NUMBERED_SECTIONS } from '../guide/intents.js'

/**
 * Home Hub — Phase 2, visually refreshed by "Home Visual Polish",
 * repositioned by Phase 1 (Data Analyst entry framing). Adapted per
 * visitor intent by Guided Portfolio Experience v0.2, Fase 1B.
 *
 * Still the same five blocks, still click-first — routing, nav and content
 * depth are unchanged, and Default renders them in exactly the original
 * order with exactly the original content. What Fase 1B adds is
 * `getHomeLayout(intent)` (guide/intents.js): the *order* those five
 * blocks render in, *how many* Selected Work cards show, and a couple of
 * small existing-content reveals (the brief experience line, a repo badge)
 * now depend on the visitor's intent. No block is ever removed, no new
 * copy is invented, and no project/casework data is duplicated — every
 * block still reads from the same registries/i18n this file always used.
 *
 *   A. Hero/Positioning  — H1 = Data Analyst; stack SQL · Power BI · Excel ·
 *                           Python; seeking-first-role + opportunity levels
 *                           (Junior · Entry-Level · Trainee · Internship)
 *                           as seniority of opportunity, not title. Hero
 *                           CTAs come from `layout.heroCtas` (Default/
 *                           Technical: Data & BI / Proyectos, unchanged;
 *                           Recruiter: CV / Contact — same existing labels
 *                           and hrefs used elsewhere, just promoted to the
 *                           two primary buttons). Recruiter also shows the
 *                           brief-experience line (`hero.experience`,
 *                           existing copy, previously unused here).
 *   B. Selected Work     — `layout.selectedWorkIds` (Default/Technical: 3;
 *                           Recruiter: 2, the tightest scan). PROVIDENTIA
 *                           stays featured when present. Technical also
 *                           reveals each card's existing `githubUrl` as a
 *                           real, keyboard-reachable link (same field/label
 *                           ProjectDetail.jsx already uses) — that card
 *                           becomes a plain container with two links
 *                           instead of one big <a>, since a link can't
 *                           nest inside another link; Default/Recruiter
 *                           cards are untouched, still a single <a>.
 *   C. Casework teaser   — unchanged content; only its position in the
 *                           page moves per intent (first after Hero for
 *                           Technical, last for Recruiter).
 *   D. Core Toolkit      — unchanged.
 *   E. Contact/Availability strip — unchanged content; moves right after
 *                           the Hero for Recruiter ("disponibilidad" +
 *                           "CV y Contact ≤1 click", both already true
 *                           structurally — this just surfaces them sooner).
 *
 * Everything retired from Home still lives at its real destination — see
 * components/About.jsx, DataBI.jsx, Operations.jsx, ProjectsIndex.jsx,
 * ContactView.jsx, CaseworkIndex.jsx and router/legacyHashRoadmap.js.
 */

const LINKEDIN_HREF = 'https://www.linkedin.com/in/agustin-delgado-data98615190/'
const GITHUB_HREF = 'https://github.com/AgusDelgado98'

export default function Home() {
  const { t, language } = useLanguage()
  const { intent } = useGuide()
  const layout = getHomeLayout(intent)

  const selectedWork = layout.selectedWorkIds.map((id, index) => {
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
      githubUrl: meta?.githubUrl || null,
      githubCtaKey: meta?.githubCtaKey || 'projects.viewGithub',
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

  // Numbered sections' labels ("01"/"02"/"03") follow *this intent's own
  // order, not a hardcoded position — so Technical's Casework legitimately
  // reads "01" when it renders first, instead of keeping Default's "02".
  const numberedSections = layout.sections.filter((key) => HOME_NUMBERED_SECTIONS.includes(key))
  const sectionNumber = (key) => String(numberedSections.indexOf(key) + 1).padStart(2, '0')

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
              {layout.showExperienceLine ? <p className="home-hero-experience">{t('hero.experience')}</p> : null}
              <div className="home-hero-seeking" aria-label={t('home.hero.seekingAria')}>
                <p className="home-hero-seeking-line">{t('home.hero.seeking')}</p>
                <p className="home-hero-levels">{t('home.hero.opportunityLevels')}</p>
              </div>

              <div className="home-hero-ctas">
                <a
                  className="atlas-access atlas-access--primary home-cta-primary"
                  href={layout.heroCtas.primary.href}
                  {...(layout.heroCtas.primary.download ? { download: true } : {})}
                >
                  <span>{t(layout.heroCtas.primary.labelKey)}</span>
                  <span aria-hidden>↗</span>
                </a>
                <a
                  className="atlas-access home-cta-secondary"
                  href={layout.heroCtas.secondary.href}
                  {...(layout.heroCtas.secondary.download ? { download: true } : {})}
                >
                  <span>{t(layout.heroCtas.secondary.labelKey)}</span>
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

    // B. Selected Work — ids come from `layout.selectedWorkIds`; PROVIDENTIA
    // reads first (wider, featured border) whenever it's included.
    // Micro-labels (index, territory, status) from registry + i18n, same
    // as always. Technical additionally reveals each card's existing
    // `githubUrl` (registry field ProjectDetail.jsx already links) as a
    // plain badge inside the same aria-hidden meta row the status/
    // territory chips already use — no new link target, no new copy.
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

            // Technical only, and only when the project actually has a real
            // repo: the card can no longer be a single big <a> (a nested
            // <a> would be invalid HTML and unreachable by keyboard/screen
            // reader), so it becomes a plain container with two real,
            // independently focusable links — the project link (unchanged
            // destination/copy) and the GitHub link (same `githubUrl`/
            // `githubCtaKey` projects/registry.js and ProjectDetail.jsx
            // already use — no new URL, no new copy), both outside any
            // aria-hidden wrapper. Default and Recruiter never take this
            // branch — their cards stay the original single <a>.
            if (layout.showRepoBadge && project.githubUrl) {
              return (
                <div key={project.id} className={cardClassName}>
                  <a className="home-work-card-link" href={`#projects/${project.id}`}>
                    {cardContent}
                  </a>
                  <a
                    className="home-work-card-repo-link"
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t(project.githubCtaKey)}
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )
            }

            return (
              <a key={project.id} className={cardClassName} href={`#projects/${project.id}`}>
                {cardContent}
              </a>
            )
          })}
        </div>

        <a className="atlas-access home-section-cta" href="#projects">
          <span>{t('home.selectedWork.viewAll')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    ),

    // C. Casework teaser — compact panel: real case count + the real
    // Paradigm/PROVIDENTIA case-number ranges (same registry grouping
    // CaseworkIndex uses), still just a teaser with one CTA. Content is
    // unchanged across intents — only its position in `layout.sections`
    // (and therefore its number) moves.
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

        <a className="atlas-access atlas-access--primary home-section-cta" href={CASEWORK_HASH}>
          <span>{t('home.casework.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    ),

    // D. Core Toolkit — unchanged across intents.
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
        <a className="atlas-access home-section-cta" href="#data-bi">
          <span>{t('home.toolkit.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    ),

    // E. Contact / Availability strip — unchanged content; Recruiter moves
    // it right after the Hero (see HOME_SECTION_ORDER in guide/intents.js).
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
      {/* Guided Portfolio Experience v0.2 — soft invitation, not a modal: a
          plain inline section, first thing in the flow, gone once the
          visitor has an intent (see GuideInvitation.jsx). */}
      <GuideInvitation />

      {layout.sections.map((key) => (
        <React.Fragment key={key}>{sectionsByKey[key]}</React.Fragment>
      ))}
    </div>
  )
}
