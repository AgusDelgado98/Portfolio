import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickCategoryLabel } from '../i18n/messages/projects.js'
import { getPrimaryCategory } from '../projects/categories.js'
import { buildDetailSections } from '../projects/detailModel.js'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'
import { PROJECTS_HASH } from '../router/hashes.js'
import { getPublicCaseStudiesForProject } from '../projects/caseStudies.js'
import ProjectEvidenceGallery from './ProjectEvidenceGallery.jsx'
import SomaDemoVideo from './SomaDemoVideo.jsx'
import ProjectVisual from './projects/ProjectVisual.jsx'
import SectionNav from './projects/SectionNav.jsx'

const STATUS_KEY = { active: 'Active', production: 'Production' }

function chipsFor(project) {
  if (project.stack?.length) return project.stack
  return project.tags || []
}

function CaseList({ studies, t }) {
  return (
    <ul className="ds-case-list">
      {studies.map((study) => {
        const copy = t(`casework.cases.${study.i18nKey}`)
        const title = copy && typeof copy === 'object' ? copy.title : study.slug
        const summary =
          copy && typeof copy === 'object'
            ? copy.description || copy.lede || (Array.isArray(copy.tags) ? copy.tags.join(' · ') : '')
            : ''
        const kicker = study.number
          ? t('projectDetail.caseNumber', { number: study.number })
          : t('casework.evidenceCaseLabel')
        return (
          <li key={study.slug}>
            <a href={study.canonicalHash}>
              <span className="ds-case-kicker">{kicker}</span>
              <span className="ds-case-title">{title}</span>
              {summary ? <span className="ds-case-summary">{summary}</span> : null}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

function Steps({ steps }) {
  return (
    <ol className="ds-steps">
      {steps.map((step) => (
        <li key={step.title}>
          <h3>{step.title}</h3>
          <p>{step.body}</p>
        </li>
      ))}
    </ol>
  )
}

export default function ProjectDetail({ id }) {
  const { t, language } = useLanguage()
  const project = mergeProjectCopy(id, language)
  if (!project?.id) return null

  const sections = buildDetailSections(project, project)
  const statusKey = STATUS_KEY[project.status] || 'Active'
  const chipLabel = project.stack?.length ? t('projects.factStack') : t('projects.factTags')

  return (
    <article className="ds-detail" aria-labelledby="project-detail-title">
      <nav className="ds-breadcrumb" aria-label={t('projectDetail.breadcrumbAria')}>
        <a href={PROJECTS_HASH}>{t('projects.title')}</a>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{project.title}</span>
      </nav>

      <header className="ds-detail-hero">
        <ProjectVisual project={project} language={language} t={t} />
        <div>
          <p className="ds-proj-kicker">{pickCategoryLabel(getPrimaryCategory(project), language)}</p>
          <h1 id="project-detail-title">{project.title}</h1>
          {project.tagline ? <p className="ds-detail-tagline">{project.tagline}</p> : null}
          <dl className="ds-facts">
            <div>
              <dt>{t('projects.factStatus')}</dt>
              <dd>{t(`projects.status.${statusKey}`)}</dd>
            </div>
            {chipsFor(project).length ? (
              <div>
                <dt>{chipLabel}</dt>
                <dd>
                  <ul className="ds-chips">
                    {chipsFor(project).map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            ) : null}
          </dl>
        </div>
      </header>

      <SectionNav projectId={project.id} sections={sections} t={t} />

      {sections.map((section) => {
        if (section.id === 'overview') {
          return (
            <section key={section.id} id="detail-overview" tabIndex={-1} aria-labelledby="detail-overview-title">
              <h2 id="detail-overview-title">{t('projectDetail.sections.overview')}</h2>
              {section.problem ? (
                <div>
                  <h3>{t('projects.factProblem')}</h3>
                  <p>{section.problem}</p>
                </div>
              ) : null}
              {section.built ? (
                <div>
                  <h3>{t('projects.factBuilt')}</h3>
                  <p>{section.built}</p>
                </div>
              ) : null}
              {section.role ? (
                <div>
                  <h3>{t('projects.factRole')}</h3>
                  <p>{section.role}</p>
                </div>
              ) : null}
            </section>
          )
        }
        if (section.id === 'data' || section.id === 'approach' || section.id === 'decision') {
          return (
            <section key={section.id} id={`detail-${section.id}`} tabIndex={-1} aria-labelledby={`detail-${section.id}-title`}>
              <h2 id={`detail-${section.id}-title`}>{t(`projectDetail.sections.${section.id}`)}</h2>
              {section.lead ? <p className="ds-detail-lead">{section.lead}</p> : null}
              <Steps steps={section.steps} />
            </section>
          )
        }
        if (section.id === 'results' || section.id === 'product') {
          return (
            <section key={section.id} id={`detail-${section.id}`} tabIndex={-1} aria-labelledby={`detail-${section.id}-title`}>
              <h2 id={`detail-${section.id}-title`}>{t(`projectDetail.sections.${section.id}`)}</h2>
              {section.impactHighlight ? <p className="ds-detail-highlight">{section.impactHighlight}</p> : null}
              {section.impact ? <p>{section.impact}</p> : null}
              {section.highlights?.length ? (
                <ul className="ds-detail-points">
                  {section.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.demo ? <SomaDemoVideo label={t('projects.demoLabel')} fallback={t('projects.demoFallback')} /> : null}
              {section.visuals?.length ? <ProjectEvidenceGallery items={project.evidenceVisuals} /> : null}
            </section>
          )
        }
        if (section.id === 'limits') {
          return (
            <section key={section.id} id="detail-limits" tabIndex={-1} aria-labelledby="detail-limits-title">
              <h2 id="detail-limits-title">{t('projectDetail.sections.limits')}</h2>
              {section.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </section>
          )
        }
        if (section.id === 'cases') {
          return (
            <section key={section.id} id="detail-cases" tabIndex={-1} aria-labelledby="detail-cases-title">
              <h2 id="detail-cases-title">{t('projectDetail.sections.cases')}</h2>
              <CaseList studies={getPublicCaseStudiesForProject(project.id)} t={t} />
            </section>
          )
        }
        if (section.id === 'technical') {
          return (
            <section key={section.id} id="detail-technical" tabIndex={-1} aria-labelledby="detail-technical-title">
              <details className="ds-details">
                <summary>
                  <h2 id="detail-technical-title">{t('projectDetail.sections.technical')}</h2>
                </summary>
                {section.stack?.length ? (
                  <div>
                    <h3>{t('projects.factStack')}</h3>
                    <ul className="ds-chips">
                      {section.stack.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {section.artifacts?.length ? (
                  <ul className="ds-detail-points">
                    {section.artifacts.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </details>
            </section>
          )
        }
        if (section.id === 'links') {
          return (
            <section key={section.id} id="detail-links" tabIndex={-1} aria-labelledby="detail-links-title">
              <h2 id="detail-links-title">{t('projectDetail.sections.links')}</h2>
              <ul className="ds-link-list">
                {project.projectUrl ? (
                  <li>
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                      {t('projects.openProjectLink')}
                    </a>
                  </li>
                ) : null}
                {project.githubUrl ? (
                  <li>
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                      {t(project.githubCtaKey || 'projects.viewGithub')}
                    </a>
                  </li>
                ) : null}
                {project.privateRepo ? <li>{t('projects.privateRepo')}</li> : null}
              </ul>
            </section>
          )
        }
        return null
      })}
    </article>
  )
}
