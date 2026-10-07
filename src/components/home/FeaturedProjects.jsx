import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { pickCategoryLabel } from '../../i18n/messages/projects.js'
import { getHomeFeaturedIds, getProjectMeta } from '../../projects/registry.js'
import { getPrimaryCategory } from '../../projects/categories.js'
import { PROJECTS_HASH, projectHash } from '../../router/hashes.js'
import { FEATURED_VISUALS } from '../../visual/featured.jsx'

/**
 * Home's featured projects (F3A §4). Which projects, and in which order, comes
 * from the registry (`getHomeFeaturedIds`); which picture and which headline
 * metric a card shows comes from the project's registry `visual`
 * (visual/featured.jsx). Nothing here names a project, so DECERNO joins by
 * data. A card is a visual, a category, a title, one line, one metric, a few
 * chips and ONE link — not a miniature Project Detail.
 */
export default function FeaturedProjects() {
  const { t, language } = useLanguage()

  const cards = getHomeFeaturedIds()
    .map((id) => {
      const project = getProjectMeta(id)
      const labels = t(`home.featured.cards.${id}`)
      const renderer = FEATURED_VISUALS[project?.visual]
      if (!project || !renderer || typeof labels !== 'object') return null
      return { project, labels, renderer }
    })
    .filter(Boolean)

  return (
    <section aria-labelledby="home-featured-title">
      <div className="ds-section-head">
        <h2 id="home-featured-title" className="ds-h2">
          {t('home.featured.title')}
        </h2>
        <a className="ds-link" href={PROJECTS_HASH}>
          {t('home.viewAll')}
        </a>
      </div>

      <ul className="ds-featured-grid">
        {cards.map(({ project, labels, renderer }, index) => {
          const metric = renderer.getMetric({ language, labels })
          const chips = project.homeStack?.length ? project.homeStack : project.tags
          const cta = labels.cta ?? t('home.featured.cta')
          return (
            <li
              key={project.id}
              className={`ds-card ds-stage--${renderer.stage}${index === 0 ? ' ds-card--flagship' : ''}`}
            >
              <figure className="ds-card-visual">
                {renderer.renderVisual({ language, labels })}
                <figcaption>{labels.caption}</figcaption>
              </figure>

              <div className="ds-card-body">
                <p className="ds-card-kicker">{pickCategoryLabel(getPrimaryCategory(project), language)}</p>
                <h3 className="ds-card-title">{project.title}</h3>
                <p className="ds-card-line">{labels.line}</p>

                <dl className="ds-metric">
                  <dt>{labels.metricLabel}</dt>
                  <dd>
                    {metric.value}
                    {metric.note ? <span className="ds-metric-note">{metric.note}</span> : null}
                  </dd>
                </dl>

                {chips?.length ? (
                  <ul className="ds-chips">
                    {chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                ) : null}

                <p className="ds-card-cta">
                  <a className="ds-card-link" href={projectHash(project.id)}>
                    {cta}
                    <span aria-hidden="true"> →</span>
                    <span className="ds-visually-hidden">: {project.title}</span>
                  </a>
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
