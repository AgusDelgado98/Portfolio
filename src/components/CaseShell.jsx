import React, { Suspense } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { PROJECTS_HASH } from '../router/hashes.js'
import '../styles/case-shell.css'

function caseTitle(t, study) {
  const copy = t(`casework.cases.${study.i18nKey}`)
  return copy && typeof copy === 'object' && copy.title ? copy.title : study.slug
}

export function CaseFallback() {
  const { t } = useLanguage()
  return (
    <div className="ds-case-fallback" role="status" aria-live="polite">
      {t('caseShell.loading')}
    </div>
  )
}

/**
 * The bridge from Project Detail into a legacy case. Breadcrumb and the
 * back link are the new chrome; the case component renders underneath,
 * unchanged.
 */
export default function CaseShell({ study, project, backHref, children }) {
  const { t } = useLanguage()
  const title = caseTitle(t, study)
  const projectName = project?.title || study.system

  return (
    <article className="ds-case-shell">
      <header className="ds-case-chrome">
        <nav className="ds-case-crumb" aria-label={t('projectDetail.breadcrumbAria')}>
          <a href={PROJECTS_HASH}>{t('nav.projects')}</a>
          <span aria-hidden="true">/</span>
          <a href={backHref}>{projectName}</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <a className="ds-case-back" href={backHref}>
          <span aria-hidden="true">← </span>
          {projectName}
        </a>
      </header>
      <div className="ds-case-stage">
        <Suspense fallback={<CaseFallback />}>{children}</Suspense>
      </div>
    </article>
  )
}
