import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { projectHash } from '../../router/hashes.js'
import { getComplementaryProjectIds, getProjectEntry } from '../../projects/registry.js'

/**
 * «Proyectos en uso» — the applications that people and organizations use in
 * their daily work (CONSTANTIA, SOMA, HOGARES). All of them get the same
 * editorial row, so none outranks another. Existing row/tag/data classes only;
 * copy comes from home.selected.projects.<id>.
 */
export default function ProjectsInUse() {
  const { t } = useLanguage()
  const copyOf = (id) => {
    const copy = t(`home.selected.projects.${id}`)
    return copy && typeof copy === 'object' ? copy : null
  }
  const ids = getComplementaryProjectIds().filter(copyOf)
  if (ids.length === 0) return null

  return (
    <section className="proj-spotlight proj-inuse" aria-labelledby="proj-inuse-title">
      <div className="proj-other__head">
        <h2 id="proj-inuse-title" className="home-label home-label--ink">
          {t('home.projectGroups.work.title')}
        </h2>
        <span className="proj-other__rule" aria-hidden="true" />
      </div>
      <p className="proj-other__lead">{t('home.projectGroups.work.lead')}</p>
      {ids.map((id, index) => {
        const copy = copyOf(id)
        const title = getProjectEntry(id)?.title
        return (
          <article className="home-row home-row--plain" key={id}>
            <span className="home-row__n">{String(index + 1).padStart(2, '0')}</span>
            <div className="home-row__body">
              <p className="home-eyebrow home-eyebrow--ink">{copy.question}</p>
              <h3 className="home-ptitle">{title}</h3>
              <p className="home-row__line">{copy.line}</p>
              <ul className="home-tags">
                {copy.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              {copy.data ? (
                <p className="home-data">
                  <span>{t('home.selected.dataLabel')}</span> · {copy.data}
                </p>
              ) : null}
            </div>
            <a className="home-open" href={projectHash(id)}>
              <span className="home-open__text">
                {t('home.selected.cta')} <span aria-hidden="true">→</span>
              </span>
              <span className="ds-visually-hidden">: {title}</span>
            </a>
          </article>
        )
      })}
    </section>
  )
}
