import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import {
  listFeaturedCaseworkEntries,
  listAdditionalCaseworkEntries,
} from '../casework/registry.js'
import { CASEWORK_ARCHIVE_HASH } from '../constants/links.js'
import '../casework-index.css'

function FeaturedCaseCard({ entry }) {
  const { t } = useLanguage()
  const copy = t(`casework.cases.${entry.meta.i18nKey}`)
  const title = typeof copy === 'object' && copy ? copy.title : entry.meta.i18nKey
  const tags = typeof copy === 'object' && copy && Array.isArray(copy.tags) ? copy.tags : []
  const lede = typeof copy === 'object' && copy && copy.lede ? copy.lede : null

  return (
    <article className="casework-card casework-card--evidence">
      <span className="casework-card-number">{t('casework.evidenceCaseLabel')}</span>
      <h2>{title}</h2>
      {lede ? <p className="casework-card-system">{lede}</p> : null}
      {tags.length > 0 ? <p className="casework-card-tags">{tags.join(' · ')}</p> : null}
      <a className="atlas-access atlas-access--primary casework-card-cta" href={entry.hash}>
        <span>{t('casework.evidenceCaseCta')}</span>
        <span aria-hidden>↗</span>
      </a>
    </article>
  )
}

function UpcomingCaseCard() {
  const { t } = useLanguage()
  const tags = t('casework.featured.upcomingTags')
  return (
    <article className="casework-card casework-card--upcoming" aria-label={t('casework.featured.comingSoonLabel')}>
      <span className="casework-card-number">{t('casework.featured.comingSoonLabel')}</span>
      <h2>{t('casework.featured.upcomingTitle')}</h2>
      <p className="casework-card-system">{t('casework.featured.upcomingLede')}</p>
      {Array.isArray(tags) && tags.length > 0 ? (
        <p className="casework-card-tags">{tags.join(' · ')}</p>
      ) : null}
      <span className="casework-upcoming-status">{t('casework.featured.comingSoonLabel')}</span>
    </article>
  )
}

export default function CaseworkIndex({ onExit }) {
  const { t } = useLanguage()
  const featuredEntries = listFeaturedCaseworkEntries()
  const additionalEntries = listAdditionalCaseworkEntries()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <article className="elog casework-index" id="casework" aria-labelledby="casework-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('casework.hero.badge')}</span>
        </div>
        <p className="elog-kicker">{t('casework.hero.kicker')}</p>
        <h1 id="casework-title">{t('casework.hero.title')}</h1>
        <p className="elog-lede">{t('casework.hero.lede')}</p>

        <ol className="casework-concept" aria-label={t('casework.concept.aria')}>
          <li>{t('casework.concept.problem')}</li>
          <li>{t('casework.concept.analysis')}</li>
          <li>{t('casework.concept.evidence')}</li>
          <li>{t('casework.concept.decision')}</li>
        </ol>

        <dl className="elog-metrics casework-hero-stats">
          <div className="elog-metric">
            <dt>{t('casework.featured.countLabel')}</dt>
            <dd>02</dd>
          </div>
          <div className="elog-metric">
            <dt>{t('casework.featured.availableLabel')}</dt>
            <dd>{String(featuredEntries.length).padStart(2, '0')}</dd>
          </div>
          <div className="elog-metric">
            <dt>{t('casework.featured.comingSoonLabel')}</dt>
            <dd>01</dd>
          </div>
          <div className="elog-metric">
            <dt>{t('casework.archivePreview.title')}</dt>
            <dd>{String(additionalEntries.length).padStart(2, '0')}</dd>
          </div>
        </dl>

        <nav className="elog-actions" aria-label={t('casework.actionsAria')}>
          <a className="atlas-access atlas-access--primary" href="#home" onClick={onExit}>
            <span>{t('elog.actions.backToAtlas')}</span>
            <span aria-hidden>←</span>
          </a>
        </nav>
      </header>

      <section className="casework-featured" aria-labelledby="casework-featured-title">
        <div className="casework-section-head">
          <h2 id="casework-featured-title">{t('casework.featured.title')}</h2>
          <p>{t('casework.featured.lede')}</p>
        </div>
        <div className="casework-grid casework-grid--featured">
          {featuredEntries.map((entry) => (
            <FeaturedCaseCard key={entry.slug} entry={entry} />
          ))}
          <UpcomingCaseCard />
        </div>
      </section>

      <section className="casework-archive-callout" aria-labelledby="casework-archive-preview-title">
        <div>
          <h2 id="casework-archive-preview-title">{t('casework.archivePreview.title')}</h2>
          <p>{t('casework.archivePreview.lede')}</p>
        </div>
        <a className="atlas-access casework-archive-cta" href={CASEWORK_ARCHIVE_HASH}>
          <span>{t('casework.archivePreview.cta')}</span>
          <span aria-hidden>↗</span>
        </a>
      </section>
    </article>
  )
}
