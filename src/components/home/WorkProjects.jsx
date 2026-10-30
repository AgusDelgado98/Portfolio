import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { getHomeWorkIds, getProjectMeta } from '../../projects/registry.js'
import HomeProjectCard, { getHomeCard } from './HomeProjectCard.jsx'

/**
 * The projects linked to the owner's professional activity, in the order the
 * registry declares (`getHomeWorkIds`). The section lead says what the group is;
 * each card keeps professional use and public demonstration apart.
 */
export default function WorkProjects() {
  const { t } = useLanguage()
  const cards = getHomeWorkIds()
    .map((id) => getHomeCard(getProjectMeta(id), t))
    .filter(Boolean)

  return (
    <section aria-labelledby="home-work-title">
      <div className="ds-section-head">
        <div>
          <h2 id="home-work-title" className="ds-h2">
            {t('home.projectGroups.work.title')}
          </h2>
          <p className="ds-lead">{t('home.projectGroups.work.lead')}</p>
        </div>
      </div>

      <ul className="ds-featured-grid">
        {cards.map((card) => (
          <HomeProjectCard key={card.project.id} {...card} />
        ))}
      </ul>
    </section>
  )
}
