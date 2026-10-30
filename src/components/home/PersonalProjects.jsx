import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { getHomePersonalIds, getProjectMeta } from '../../projects/registry.js'
import { PROJECTS_HASH } from '../../router/hashes.js'
import HomeProjectCard, { getHomeCard } from './HomeProjectCard.jsx'

/**
 * Independent personal projects — their own section, apart from the work-linked
 * group. Home shows the ones the registry lists (`getHomePersonalIds`); the
 * whole list is in the catalog.
 */
export default function PersonalProjects() {
  const { t } = useLanguage()
  const cards = getHomePersonalIds()
    .map((id) => getHomeCard(getProjectMeta(id), t))
    .filter(Boolean)

  return (
    <section aria-labelledby="home-personal-title">
      <div className="ds-section-head">
        <div>
          <h2 id="home-personal-title" className="ds-h2">
            {t('home.projectGroups.personal.title')}
          </h2>
          <p className="ds-lead">{t('home.projectGroups.personal.lead')}</p>
        </div>
        <a className="ds-link" href={PROJECTS_HASH}>
          {t('home.viewAll')}
        </a>
      </div>

      <ul className="ds-featured-grid ds-featured-grid--pair">
        {cards.map((card) => (
          <HomeProjectCard key={card.project.id} {...card} />
        ))}
      </ul>
    </section>
  )
}
