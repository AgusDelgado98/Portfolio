import React, { useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { mergeProjectCopy } from '../projects/mergeProjectCopy.js'
import { getTerritoryForProject, getCaseworkSlugsForProject } from '../projects/registry.js'
import { getCaseworkEntry } from '../casework/registry.js'
import ProjectEvidenceGallery from './ProjectEvidenceGallery.jsx'
import SomaDemoVideo from './SomaDemoVideo.jsx'

/**
 * Project Detail — `#projects/<id>` (Phase 4, Projects Experience, items
 * 8-10). A real, shareable page — not a `<dialog>` — replacing the Phase 1
 * transitional bridge entirely (see App.jsx and the removed
 * router/projectsBridge.js).
 *
 * Reuses the *exact* conditional content logic the old dialog had (same
 * fields, same "only render if present" checks — see the old
 * components/Projects.jsx in git history) — only the presentation changed,
 * from `.atlas-sheet-*` dialog chrome to the `.elog-hero`/`.destination-*`
 * scaffolding every other Phase 3 destination (Data & BI, Operations,
 * About, Contact) already uses, per item 20: Project Detail should feel
 * like the same portfolio, not a one-off dialog layout turned into a page.
 * The Atlas map itself (ProjectsAtlas.jsx) is where the literal Atlas DNA
 * (territories, coordinates, node styling) survives, per item 6.
 *
 * Section 9's "Results / Product / Proof" heading is picked per project
 * via `resultsSectionKey` in projects/registry.js ('results' vs
 * 'product' — Soma is a shipped product, not an analytical result).
 *
 * Related Casework (item 10) reads `caseworkSlugs` from the registry —
 * centralized there, not duplicated here — and renders nothing when empty
 * (most projects have no case; only Paradigm and PROVIDENTIA do). Case 05
 * does not exist, so nothing here can accidentally link to it (item 1/16).
 *
 * No PDI/PROVIDENTIA metrics or claims beyond what's already in
 * i18n/messages/projects.js are introduced here (item 16).
 */
export default function ProjectDetail({ id }) {
  const { t, language } = useLanguage()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [id])

  const project = mergeProjectCopy(id, language)
  const territory = getTerritoryForProject(id)
  const caseworkSlugs = getCaseworkSlugsForProject(id)
  const relatedCases = caseworkSlugs
    .map((slug) => getCaseworkEntry(slug))
    .filter(Boolean)
    .map((entry) => {
      const copy = t(`casework.cases.${entry.meta.i18nKey}`)
      return {
        slug: entry.slug,
        hash: entry.hash,
        title: typeof copy === 'object' && copy ? copy.title : entry.meta.i18nKey,
        system: entry.meta.system,
      }
    })

  const showDemo = Boolean(project.hasDemoVideo)
  const showFlow = Boolean(project.flowSteps?.length)
  const showHighlights = Boolean(project.highlights?.length)
  const showResult = Boolean(project.impact || project.impactHighlight)
  const showResultsSection = showDemo || showFlow || showHighlights || showResult
  const resultsTitleKey = project.resultsSectionKey === 'product' ? 'projectDetail.productTitle' : 'projectDetail.resultsTitle'

  const showTechnical = Boolean(project.artifacts?.length > 0 || project.stack?.length > 0)
  // Includes `privateRepo` (not just visuals/links) — Soma and Hogares have
  // no public repo/demo/gallery at all, but "source is private" is itself
  // a real evidence fact that must not silently disappear just because
  // there's nothing else to show alongside it.
  const showEvidence = Boolean(
    project.evidenceItems?.length || project.evidenceVisuals?.length || project.githubUrl || project.projectUrl || project.privateRepo,
  )
  const nextStep = project.nextStep
    ? project.nextStep
    : project.hasLiveDemo === false && !project.hasDemoVideo && !project.githubUrl
      ? t('projects.nextStepDev')
      : null

  return (
    <article className="elog destination-view project-detail" aria-labelledby="project-detail-title">
      <header className="elog-hero">
        <div className="elog-hero-meta">
          <span>{t('projectDetail.badge')}</span>
          {territory ? <span>{territory.code} · {t(`projects.territories.${territory.id}.name`)}</span> : null}
          <span className={`atlas-node-status atlas-node-status--${project.status?.toLowerCase() || 'active'}`}>
            {t(`projects.status.${project.status || 'Active'}`)}
          </span>
        </div>
        <h1 id="project-detail-title" className="safe-text-render">{project.title}</h1>
        {project.tagline ? <p className="elog-lede">{project.tagline}</p> : null}
        {project.privacyNote ? (
          <p className="atlas-sheet-privacy" role="note">
            <span className="atlas-sheet-privacy-label">{t('projects.privacyLabel')}</span>
            <span>{project.privacyNote}</span>
          </p>
        ) : null}

        <nav className="elog-actions" aria-label={t('projectDetail.backToProjects')}>
          <a className="atlas-access atlas-access--primary" href="#projects">
            <span aria-hidden>←</span>
            <span>{t('projectDetail.backToProjects')}</span>
          </a>
        </nav>
      </header>

      {(project.problem || project.description || project.role) && (
        <section className="destination-section" aria-labelledby="detail-overview-title">
          <h2 id="detail-overview-title" className="destination-section-title">
            {t('projectDetail.overviewTitle')}
          </h2>
          {project.problem && (
            <div className="detail-block">
              <h3>{t('projects.sectionProblem')}</h3>
              <p>{project.problem}</p>
            </div>
          )}
          {project.description && (
            <div className="detail-block">
              <h3>{t('projects.sectionContext')}</h3>
              <p>{project.description}</p>
            </div>
          )}
          {project.role && (
            <div className="detail-block">
              <h3>{t('projects.sectionSystem')}</h3>
              <p>{project.role}</p>
            </div>
          )}
        </section>
      )}

      {showResultsSection && (
        <section className="destination-section" aria-labelledby="detail-results-title">
          <h2 id="detail-results-title" className="destination-section-title">
            {t(resultsTitleKey)}
          </h2>

          {showDemo && (
            <div className="detail-block">
              <SomaDemoVideo label={t('projects.demoLabel')} fallback={t('projects.demoFallback')} />
            </div>
          )}

          {showFlow && (
            <div className="detail-block">
              {project.flowLead ? <p>{project.flowLead}</p> : null}
              <ol className="atlas-sheet-flow" aria-label={t('projects.flowAria')}>
                {project.flowSteps.map((step, index) => (
                  <li key={step.title}>
                    <span className="atlas-sheet-flow-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {showHighlights && (
            <div className="detail-block">
              <h3>{t('projects.sectionDecisions')}</h3>
              <ul>
                {project.highlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}

          {showResult && (
            <div className="detail-block">
              <h3>{t('projects.sectionResult')}</h3>
              {project.impactHighlight && <p className="atlas-sheet-annotation">{project.impactHighlight}</p>}
              {project.impact && <p>{project.impact}</p>}
            </div>
          )}
        </section>
      )}

      {showTechnical && (
        <section className="destination-section" aria-labelledby="detail-technical-title">
          <h2 id="detail-technical-title" className="destination-section-title">
            {t('projects.sectionTechnical')}
          </h2>
          <div className="destination-grid">
            {project.stack?.length > 0 && (
              <div className="destination-card">
                <h3>{t('projects.stack')}</h3>
                <ul>
                  {project.stack.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
            {project.artifacts?.length > 0 && (
              <div className="destination-card">
                <h3>{t('projects.deliverables')}</h3>
                <ul>
                  {project.artifacts.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {showEvidence && (
        <section className="destination-section" aria-labelledby="detail-evidence-title">
          <h2 id="detail-evidence-title" className="destination-section-title">
            {t('projects.sectionEvidence')}
          </h2>
          {project.evidenceLead ? <p className="destination-section-lead">{project.evidenceLead}</p> : null}
          {project.evidenceItems?.length > 0 && (
            <ul>
              {project.evidenceItems.map((item) => <li key={item}>{item}</li>)}
            </ul>
          )}
          <ProjectEvidenceGallery items={project.evidenceVisuals} />
          <div className="destination-cross-links">
            {project.hasLiveDemo !== false && project.projectUrl ? (
              <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="atlas-access">
                <span>{t('projects.openProjectLink')}</span>
                <span aria-hidden>↗</span>
              </a>
            ) : null}
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="atlas-access">
                <span>{t(project.githubCtaKey || 'projects.viewGithub')}</span>
                <span aria-hidden>↗</span>
              </a>
            ) : null}
            {project.privateRepo ? (
              <span className="atlas-sheet-private">{t('projects.privateRepo')}</span>
            ) : null}
          </div>
        </section>
      )}

      {relatedCases.length > 0 && (
        <section className="destination-section" aria-labelledby="detail-casework-title">
          <h2 id="detail-casework-title" className="destination-section-title">
            {t('projectDetail.relatedCaseworkTitle')}
          </h2>
          <div className="destination-cross-links">
            {relatedCases.map((entry) => (
              <a key={entry.slug} className="atlas-access" href={entry.hash}>
                <span>{entry.title}</span>
                <span aria-hidden>↗</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {nextStep && (
        <section className="destination-section" aria-labelledby="detail-next-title">
          <h2 id="detail-next-title" className="destination-section-title">
            {t('projects.sectionNext')}
          </h2>
          <p>{nextStep}</p>
        </section>
      )}
    </article>
  )
}
