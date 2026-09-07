import React, { useState } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { listCaseworkEntries } from '../casework/registry.js'
import { CASEWORK_HASH } from '../constants/links.js'
import ProjectsCards from './ProjectsCards.jsx'
import ProjectsAtlas from './ProjectsAtlas.jsx'

/**
 * Projects Index — `#projects` (Phase 4, Projects Experience, items 3/6).
 *
 * Replaces the old dialog-driven Projects.jsx + the Phase 1 ProjectsView.jsx
 * bridge wrapper. Cards is the default view; Atlas is reached via the
 * toggle below — a plain accessible button group (`role="group"` +
 * `aria-pressed`), the same pattern already used by Header's
 * LanguageSwitch, rather than a `role="tablist"` that would need its own
 * roving-tabindex wiring for little real benefit here.
 *
 * View-mode is local React state, not persisted in the URL — the brief
 * only requires the *default* to be Cards and the active view to be
 * unambiguous, not that the toggle survive navigation.
 */
export default function ProjectsIndex() {
  const { t } = useLanguage()
  const [view, setView] = useState('cards')

  const caseworkEntries = listCaseworkEntries()
  const caseworkSystemsCount = new Set(caseworkEntries.map((entry) => entry.meta.system)).size

  return (
    <section className="projects-section destination-view">
      <nav className="elog-actions projects-view-topbar" aria-label={t('nav.backToHome')}>
        <a className="atlas-access atlas-access--primary" href="#home">
          <span aria-hidden>←</span>
          <span>{t('nav.backToHome')}</span>
        </a>
      </nav>

      <div className="projects-header section-head">
        <span className="section-label">{t('projects.sectionLabel')}</span>
        <h1 className="display-lg">
          {t('projects.heading')} <span className="grad-text-emerald">{t('projects.headingAccent')}</span>
        </h1>
        <p className="prose-muted lead-tight">{t('projects.lead')}</p>

        <div className="atlas-entry-rail">
          <aside className="elog-entry" aria-label={t('projects.elogAsideAria')}>
            <span className="elog-entry-label">{t('projects.elogAsideLabel')}</span>
            <p>{t('projects.elogAsideBody')}</p>
            <p className="elog-entry-stats">
              {t('projects.elogAsideStats', { cases: caseworkEntries.length, systems: caseworkSystemsCount })}
            </p>
            <a className="atlas-access" href={CASEWORK_HASH}>
              <span>{t('projects.elogAsideCta')}</span>
              <span aria-hidden>↗</span>
            </a>
          </aside>
          <aside className="elog-entry elog-entry--production" aria-label={t('projects.productionAsideAria')}>
            <span className="elog-entry-label">{t('projects.productionAsideLabel')}</span>
            <p>{t('projects.productionAsideBody')}</p>
            <a className="atlas-access" href="#projects/soma">
              <span>{t('projects.productionAsideCta')}</span>
              <span aria-hidden>↗</span>
            </a>
          </aside>
        </div>
      </div>

      <div
        className="projects-view-toggle"
        role="group"
        aria-label={t('projects.viewToggleAria')}
      >
        <button
          type="button"
          className={view === 'cards' ? 'is-active' : undefined}
          aria-pressed={view === 'cards'}
          onClick={() => setView('cards')}
        >
          {t('projects.cardsViewLabel')}
        </button>
        <button
          type="button"
          className={view === 'atlas' ? 'is-active' : undefined}
          aria-pressed={view === 'atlas'}
          onClick={() => setView('atlas')}
        >
          {t('projects.atlasViewLabel')}
        </button>
      </div>

      {view === 'cards' ? <ProjectsCards /> : <ProjectsAtlas />}
    </section>
  )
}
