import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { listAdditionalCaseworkEntries, groupBySystem } from '../casework/registry.js'
import { CASEWORK_HASH } from '../constants/links.js'
import '../casework-index.css'

function CaseCard({ entry }) {
  const { t } = useLanguage()
  const copy = t(`casework.cases.${entry.meta.i18nKey}`)
  const title = typeof copy === 'object' && copy ? copy.title : entry.meta.i18nKey
  const tags = typeof copy === 'object' && copy && Array.isArray(copy.tags) ? copy.tags : []

  return (
    <article className="casework-card">
      <span className="casework-card-number">
        {t('casework.caseNumber', { number: entry.meta.number })}
      </span>
      <h2>{title}</h2>
      <p className="casework-card-system">{t('casework.system', { system: entry.meta.system })}</p>
      {tags.length > 0 ? <p className="casework-card-tags">{tags.join(' · ')}</p> : null}
      <p className="casework-card-evidence">{t('casework.cardEvidence')}</p>
      <a className="atlas-access atlas-access--primary casework-card-cta" href={entry.hash}>
        <span>{t('casework.cta')}</span>
        <span aria-hidden>↗</span>
      </a>
    </article>
  )
}

function CaseworkGroup({ system, entries }) {
  const { t } = useLanguage()
  return (
    <div className="casework-group">
      <h2 className="casework-group-head">
        <span className="casework-group-system">{system}</span>
        <span className="casework-group-count">
          {t('casework.groupCount', { count: entries.length })}
        </span>
      </h2>
      <div className="casework-grid">
        {entries.map((entry) => (
          <CaseCard key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  )
}

export default function CaseworkArchive() {
  const { t } = useLanguage()
  const entries = listAdditionalCaseworkEntries()
  const groups = groupBySystem(entries)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <article className="elog casework-index" aria-labelledby="casework-archive-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('casework.archive.badge')}</span>
        </div>
        <p className="elog-kicker">{t('casework.archive.kicker')}</p>
        <h1 id="casework-archive-title">{t('casework.archive.title')}</h1>
        <p className="elog-lede">{t('casework.archive.lede')}</p>

        <dl className="elog-metrics casework-hero-stats">
          <div className="elog-metric">
            <dt>{t('casework.hero.stats.casesLabel')}</dt>
            <dd>{String(entries.length).padStart(2, '0')}</dd>
          </div>
          <div className="elog-metric">
            <dt>{t('casework.hero.stats.systemsLabel')}</dt>
            <dd>{String(groups.length).padStart(2, '0')}</dd>
          </div>
          <div className="elog-metric">
            <dt>{t('casework.hero.stats.disciplinesLabel')}</dt>
            <dd>{t('casework.hero.stats.disciplinesValue')}</dd>
          </div>
          <div className="elog-metric">
            <dt>{t('casework.hero.stats.evidenceLabel')}</dt>
            <dd>{t('casework.hero.stats.evidenceValue')}</dd>
          </div>
        </dl>

        <nav className="elog-actions" aria-label={t('casework.actionsAria')}>
          <a className="atlas-access atlas-access--primary" href={CASEWORK_HASH}>
            <span aria-hidden>←</span>
            <span>{t('casework.archive.back')}</span>
          </a>
        </nav>
      </header>

      <section className="casework-groups" aria-label={t('casework.grid.aria')}>
        {groups.map((group) => (
          <CaseworkGroup key={group.system} system={group.system} entries={group.entries} />
        ))}
      </section>
    </article>
  )
}
