import React, { useEffect, useRef, useState } from 'react'
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
 * inside also scrolls it into view). The row only takes a tab stop while it
 * really scrolls: on a wide screen it is a plain grid and adds none.
 */
export default function PersonalProjects() {
  const { t } = useLanguage()
  const listRef = useRef(null)
  const [scrollable, setScrollable] = useState(false)
  const cards = getHomePersonalIds()
    .map((id) => getHomeCard(getProjectMeta(id), t))
    .filter(Boolean)

  useEffect(() => {
    const list = listRef.current
    if (!list) return undefined
    const sync = () => setScrollable(list.scrollWidth > list.clientWidth + 1)
    sync()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', sync)
      return () => window.removeEventListener('resize', sync)
    }
    const observer = new ResizeObserver(sync)
    observer.observe(list)
    return () => observer.disconnect()
  }, [cards.length])

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
        ref={listRef}
        className="ds-featured-grid ds-featured-grid--pair"
        tabIndex={scrollable ? 0 : undefined}
        aria-label={scrollable ? t('home.projectGroups.personal.listAria') : undefined}
      >
        {cards.map((card) => (
          <HomeProjectCard key={card.project.id} {...card} />
        ))}
      </ul>
    </section>
  )
}
