import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { mergeProjectCopy } from '../../projects/mergeProjectCopy.js'
import { getOtherProjectIds, getProjectEntry } from '../../projects/registry.js'
import { projectHash } from '../../router/hashes.js'

/**
 * Compact «Otros proyectos» (F5). The five personal projects that are not in
 * the spotlight or complementary lists. Existing copy only (EG11): title from
 * the registry, one-line summary from the project messages. No filters, no
 * carousel, no new claims.
 */
export default function OtherProjects() {
  const { t, language } = useLanguage()
  const ids = getOtherProjectIds()
  if (ids.length === 0) return null

  return (
    <section className="proj-other" aria-labelledby="proj-other-title">
      <div className="proj-other__head">
        <h2 id="proj-other-title" className="home-label home-label--ink">
          {t('projects.other.title')}
        </h2>
        <span className="proj-other__rule" aria-hidden="true" />
      </div>
      <p className="proj-other__lead">{t('projects.other.lead')}</p>
      <ul className="proj-other__list">
        {ids.map((id) => {
          const title = getProjectEntry(id)?.title
          const copy = mergeProjectCopy(id, language)
          const line = copy.nodeSummary || copy.tagline
          return (
            <li key={id}>
              <a className="proj-other__link" href={projectHash(id)}>
                <span className="proj-other__name">{title}</span>
                <span className="proj-other__line">{line}</span>
                <span className="proj-other__cta" aria-hidden="true">
                  →
                </span>
                <span className="ds-visually-hidden">: {t('projects.viewProject')}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
