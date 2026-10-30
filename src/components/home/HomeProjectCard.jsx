import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { pickCategoryLabel } from '../../i18n/messages/projects.js'
import { getPrimaryCategory } from '../../projects/categories.js'
import { projectHash } from '../../router/hashes.js'
import { FEATURED_VISUALS } from '../../visual/featured.jsx'

/**
 * One project card on Home (F3A §4), shared by both groups. Which picture and
 * which headline metric it shows comes from the project's registry `visual`
 * (visual/featured.jsx); the copy comes from `home.featured.cards.<id>`.
 * Nothing here names a project.
 *
 * A card is a visual, a category, a title, one line, an optional metric, a few
 * chips and ONE link. A work-linked card (`project.usage`) also states, apart
 * from the line, that the use is professional and what its PUBLIC demonstration
 * is built on — so declared use and public case never read as the same thing.
 */
export function getHomeCard(project, t) {
  const labels = t(`home.featured.cards.${project.id}`)
  const renderer = FEATURED_VISUALS[project.visual]
  if (!renderer || typeof labels !== 'object') return null
  return { project, labels, renderer }
}

export default function HomeProjectCard({ project, labels, renderer }) {
  const { t, language } = useLanguage()
  const metric = renderer.getMetric({ language, labels })
  const chips = project.homeStack?.length ? project.homeStack : project.tags
  const cta = labels.cta ?? t('home.featured.cta')
  const professional = project.usage === 'professional'
  // Work-linked cards are the main ones: their picture is explorable (parts are
  // buttons with a one-line readout). Personal cards stay light and static.
  const interactive = professional
  const visualLabels = interactive ? { ...labels, hint: t('home.featured.hint') } : labels

  return (
    <li className={`ds-card ds-stage--${renderer.stage}`}>
      <figure className="ds-card-visual">
        {renderer.renderVisual({ language, labels: visualLabels, interactive })}
        <figcaption>{labels.caption}</figcaption>
      </figure>

      <div className="ds-card-body">
        <p className="ds-card-kicker">{pickCategoryLabel(getPrimaryCategory(project), language)}</p>
        <h3 className="ds-card-title">{project.title}</h3>
        {professional ? <p className="ds-badge">{t('home.projectGroups.work.usage')}</p> : null}
        <p className="ds-card-line">{labels.line}</p>

        {professional && labels.provenance ? (
          <dl className="ds-provenance">
            <dt>{t('home.projectGroups.work.provenanceLabel')}</dt>
            <dd>{labels.provenance}</dd>
          </dl>
        ) : null}

        {metric ? (
          <dl className="ds-metric">
            <dt>{labels.metricLabel}</dt>
            <dd>
              {metric.value}
              {metric.note ? <span className="ds-metric-note">{metric.note}</span> : null}
            </dd>
          </dl>
        ) : null}

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
}
