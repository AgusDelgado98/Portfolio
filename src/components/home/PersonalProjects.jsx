import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { getHomePersonalIds, getProjectMeta } from '../../projects/registry.js'
import { PROJECTS_HASH } from '../../router/hashes.js'
import HomeProjectCard, { getHomeCard } from './HomeProjectCard.jsx'

/**
 * Independent personal projects — their own section, apart from the work-linked
 * group. Home shows the ones the registry lists (`getHomePersonalIds`); the
 * whole list is in the catalog.
 *
 * On a phone the cards form one horizontal row. Three things make that row
 * discoverable and reachable: a visible "swipe" hint, the next card peeking in,
 * and a keyboard-focusable scroller (arrow keys scroll it; focusing a link
 * inside also scrolls it into view).
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
      <p className="ds-swipe-hint">
        {t('home.projectGroups.personal.swipeHint')}
        <span aria-hidden="true"> →</span>
      </p>

      <ul
        className="ds-featured-grid ds-featured-grid--pair"
        tabIndex={0}
        aria-label={t('home.projectGroups.personal.listAria')}
      >
        {cards.map((card) => (
          <HomeProjectCard key={card.project.id} {...card} />
        ))}
      </ul>
    </section>
  )
}
