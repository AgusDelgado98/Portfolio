import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { TERRITORIES } from '../projects/registry.js'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'

/**
 * Atlas — the secondary Projects Index view (Phase 4, item 6). The same
 * territory map/nodes/visual system Projects.jsx always had, preserved as-
 * is: SVG connections, territories, coordinates, node metadata, responsive
 * behavior (see atlas.css, untouched). The one real change (item 0/8):
 * every node is now a genuine `<a href="#projects/<id>">` link straight to
 * Project Detail — not a `<button>` that opened a `<dialog>`. Cards is the
 * default view; this is reached only via the view toggle (item 3).
 */
export default function ProjectsAtlas() {
  const { t, language } = useLanguage()

  const atlasTerritories = TERRITORIES.map((territory) => ({
    ...territory,
    name: t(`projects.territories.${territory.id}.name`),
    note: t(`projects.territories.${territory.id}.note`),
    projects: territory.projectIds.map((id) => mergeProjectCopy(id, language)),
  }))

  return (
    <div className="atlas-map-wrap">
      <div className="atlas-map-meta" aria-hidden="true">
        <span>{t('projects.mapMeta1')}</span>
        <span>{t('projects.mapMeta2')}</span>
        <span>{t('projects.mapMeta3')}</span>
      </div>

      <div className="atlas-project-map" aria-label={t('projects.mapAria')}>
        <svg
          className="atlas-map-connections"
          viewBox="0 0 1200 820"
          preserveAspectRatio="none"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M410 215 C560 190 650 160 815 185" />
          <path d="M330 300 C375 430 430 500 520 590" />
          <path d="M835 260 C860 390 865 455 910 560" />
          <path d="M545 620 C700 650 790 630 915 585" />
          <circle cx="410" cy="215" r="5" />
          <circle cx="815" cy="185" r="5" />
          <circle cx="520" cy="590" r="5" />
          <circle cx="915" cy="585" r="5" />
        </svg>

        {atlasTerritories.map((territory) => (
          <section
            key={territory.id}
            className={`atlas-territory atlas-territory--${territory.id}`}
            aria-labelledby={`territory-${territory.id}`}
          >
            <header className="atlas-territory-head">
              <div className="atlas-territory-index">
                <span>{territory.number}</span>
                <span>{territory.code}</span>
              </div>
              <div>
                <h2 id={`territory-${territory.id}`}>{territory.name}</h2>
                <p>{territory.note}</p>
              </div>
              <span className="atlas-territory-coordinates">{territory.coordinates}</span>
            </header>

            <div className="atlas-node-list">
              {territory.projects.map((project, index) => {
                const category = (project.label ?? project.type ?? '').split(' · ')[0]
                const summary = project.nodeSummary ?? project.tagline ?? project.description
                const nodeCode = `${territory.code}–${String(index + 1).padStart(2, '0')}`
                const nodeClasses = [
                  'atlas-project-node',
                  'atlas-project-node--detail',
                  project.weight === 'major' ? 'atlas-project-node--major' : '',
                ].filter(Boolean).join(' ')

                return (
                  <a
                    key={project.id}
                    className={nodeClasses}
                    href={`#projects/${project.id}`}
                    aria-label={`${t('projects.openProject')} ${project.title}: ${category}`}
                  >
                    <span className="atlas-node-marker" aria-hidden="true" />
                    <span className="atlas-node-content">
                      <span className="atlas-node-meta">
                        <span>{nodeCode}</span>
                        <span className={`atlas-node-status atlas-node-status--${project.status?.toLowerCase() || 'active'}`}>
                          {t(`projects.status.${project.status || 'Active'}`)}
                        </span>
                      </span>
                      <strong className="atlas-node-title">{project.title}</strong>
                      {summary ? (
                        <span className="atlas-project-node-summary">{summary}</span>
                      ) : null}
                      <span className="atlas-node-extra" aria-hidden="true">
                        <span className="atlas-node-action">{t('projects.consultSheet')}</span>
                      </span>
                    </span>
                  </a>
                )
              })}
            </div>
          </section>
        ))}
      </div>

      <aside className="atlas-map-legend" aria-label={t('projects.legendAria')}>
        <span><i className="legend-territory" aria-hidden="true" /> {t('projects.legendTerritory')}</span>
        <span><i className="legend-node" aria-hidden="true" /> {t('projects.legendNode')}</span>
        <span><i className="legend-connection" aria-hidden="true" /> {t('projects.legendConnection')}</span>
      </aside>
    </div>
  )
}
