import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickProjectCopy } from '../i18n/messages/projects.js'
import {
  ENGINEERING_LOG_HASH,
  HALO_BRIEF_URL,
  MICONSULTORIO_APP_URL,
  PARADIGM_APP_URL,
  isHaloBriefLive,
} from '../constants/links.js'

const featuredProjectsBase = [
  {
    id: 'paradigm',
    title: 'Paradigm',
    accent: 'emerald',
    accentColor: '#00d4b0',
    stack: ['Python', 'pandas', 'scikit-learn', 'Logistic Regression', 'Power BI', 'Streamlit', 'Plotly', 'Git'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    projectUrl: PARADIGM_APP_URL,
  },
  {
    id: 'clarusflow',
    title: 'ClarusFlow',
    accent: 'sky',
    stack: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'pathlib', 'logging', 'Markdown', 'Git'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M17 14v7M14 17.5h6" />
      </svg>
    ),
    // No public demo of its own in this repo — do not reuse Paradigm's deploy.
    hasLiveDemo: false,
  },
  {
    id: 'lumenvox',
    title: 'LumenVox',
    accent: 'violet',
    stack: ['Python', 'pandas', 'NLP', 'scikit-learn', 'Matplotlib', 'Git'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
    // No public demo of its own in this repo — do not reuse Paradigm's deploy.
    hasLiveDemo: false,
  },
]

const applicationProjectsBase = [
  {
    id: 'miconsultorio',
    title: 'Mi Consultorio',
    accent: 'violet',
    accentColor: '#8b6fff',
    stack: ['Python', 'Django', 'PostgreSQL', 'PWA', 'REST', 'Operational Analytics'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    projectUrl: MICONSULTORIO_APP_URL,
  },
  {
    id: 'halo-brief',
    title: 'Paradise Halo',
    accent: 'orange',
    accentColor: '#f59e0b',
    stack: ['React 19', 'TypeScript', 'Vite', 'Glassmorphism', 'Custom CSS', 'LocalStorage'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </svg>
    ),
    projectUrl: HALO_BRIEF_URL,
  },
]

const experimentalProjectsBase = [
  {
    id: 'mediaudit-rcm',
    title: 'MediAudit RCM',
    accent: 'emerald',
  },
  {
    id: 'medilens-ai',
    title: 'MediLens AI',
    accent: 'sky',
  },
  {
    id: 'geriatric-platform',
    title: 'Plataforma geriátrica',
    accent: 'sky',
  },
]

const atlasNodeProfiles = {
  paradigm: {
    status: 'Active',
    weight: 'major',
  },
  clarusflow: {
    status: 'Active',
  },
  lumenvox: {
    status: 'Research',
  },
  miconsultorio: {
    status: 'Production',
    weight: 'major',
  },
  'halo-brief': {
    status: 'Experimental',
  },
  'mediaudit-rcm': {
    status: 'Experimental',
  },
  'medilens-ai': {
    status: 'Research',
  },
  'geriatric-platform': {
    status: 'Archived',
  },
}

const atlasTerritoriesIds = [
  {
    id: 'intelligence',
    number: '01',
    code: 'INT',
    coordinates: 'N 34° / E 12°',
    projectIds: ['paradigm', 'lumenvox', 'medilens-ai'],
  },
  {
    id: 'data-systems',
    number: '02',
    code: 'DAT',
    coordinates: 'N 18° / E 68°',
    projectIds: ['clarusflow'],
  },
  {
    id: 'operational-products',
    number: '03',
    code: 'OPS',
    coordinates: 'S 28° / E 24°',
    projectIds: ['miconsultorio', 'halo-brief'],
  },
  {
    id: 'applied-contexts',
    number: '04',
    code: 'CTX',
    coordinates: 'S 42° / E 76°',
    projectIds: ['mediaudit-rcm', 'geriatric-platform'],
  },
]

export default function Projects() {
  const { t, language } = useLanguage()
  const [openId, setOpenId] = useState(null)
  const [activeNodeId, setActiveNodeId] = useState(null)
  const dialogRef = useRef(null)
  const openerRef = useRef(null)

  const allProjectsBase = [...featuredProjectsBase, ...applicationProjectsBase, ...experimentalProjectsBase]
  const projectsById = Object.fromEntries(allProjectsBase.map((p) => [p.id, p]))
  
  function mergeProjectCopy(id) {
    const base = projectsById[id] || {}
    const copy = pickProjectCopy(id, language)
    const profile = atlasNodeProfiles[id] || {}
    return {
      ...base,
      ...copy,
      annotation: copy.annotation || profile.annotation,
      signals: copy.signals || base.signals || [],
    }
  }

  const featuredProjects = featuredProjectsBase.map((p) => mergeProjectCopy(p.id))
  const applicationProjects = applicationProjectsBase.map((p) => mergeProjectCopy(p.id))
  const experimentalProjects = experimentalProjectsBase.map((p) => mergeProjectCopy(p.id))
  const allDetailProjects = [...featuredProjects, ...applicationProjects]

  const atlasTerritories = atlasTerritoriesIds.map((territory) => ({
    ...territory,
    name: t(`projects.territories.${territory.id}.name`),
    note: t(`projects.territories.${territory.id}.note`),
    projects: territory.projectIds.map((id) => mergeProjectCopy(id)),
  }))

  const openProject = allDetailProjects.find((p) => p.id === openId) ?? null
  const openProjectIndex = openProject
    ? allDetailProjects.findIndex((project) => project.id === openProject.id)
    : -1
  const previousProject = openProject
    ? allDetailProjects[(openProjectIndex - 1 + allDetailProjects.length) % allDetailProjects.length]
    : null
  const nextProject = openProject
    ? allDetailProjects[(openProjectIndex + 1) % allDetailProjects.length]
    : null
  const openTerritory = openProject
    ? atlasTerritories.find((territory) =>
        territory.projects.some((project) => project.id === openProject.id),
      )
    : null
  const openProfile = openProject ? atlasNodeProfiles[openProject.id] : null
  const openTerritoryProjectIndex = openProject && openTerritory
    ? openTerritory.projects.findIndex((project) => project.id === openProject.id)
    : -1
  const openSheetCode = openProject && openTerritory
    ? `${openTerritory.code}–${String(openTerritoryProjectIndex + 1).padStart(2, '0')}`
    : ''
  const nextStep = openProject?.hasLiveDemo === false
    ? t('projects.nextStepDev')
    : openProject?.id === 'halo-brief' && !isHaloBriefLive(openProject.projectUrl)
      ? t('projects.nextStepHalo')
      : null

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    document.body.classList.toggle('project-dialog-is-open', Boolean(openProject))
    if (openProject) {
      if (!d.open) d.showModal()
      requestAnimationFrame(() => {
        const closeBtn = d.querySelector('[data-project-dialog-close]')
        closeBtn?.focus()
      })
    } else if (d.open) {
      d.close()
    }

    return () => {
      document.body.classList.remove('project-dialog-is-open')
    }
  }, [openProject])

  useEffect(() => {
    const d = dialogRef.current
    if (!d) return
    const onClose = () => {
      setOpenId(null)
      requestAnimationFrame(() => openerRef.current?.focus())
    }
    d.addEventListener('close', onClose)
    return () => d.removeEventListener('close', onClose)
  }, [])

  function selectProject(project, triggerElement) {
    setActiveNodeId(project.id)
    if (allDetailProjects.some((item) => item.id === project.id)) {
      openerRef.current = triggerElement
      setOpenId(project.id)
    }
  }

  function navigateProject(project) {
    setActiveNodeId(project.id)
    setOpenId(project.id)
  }

  function openEngineeringLog() {
    setOpenId(null)
  }

  function handleDialogKeyDown(event) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setOpenId(null)
      return
    }
    if (event.key !== 'Tab') return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = Array.from(
      dialog.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter((element) => !element.hasAttribute('hidden'))
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <section className="projects-section" id="proyectos">
      <div className="projects-header section-head fade-in">
        <span className="section-label">{t('projects.sectionLabel')}</span>
        <h2 className="display-lg">
          {t('projects.heading')} <span className="grad-text-emerald">{t('projects.headingAccent')}</span>
        </h2>
        <p className="prose-muted lead-tight">
          {t('projects.lead')}
        </p>
        <div className="atlas-entry-rail">
          <aside className="elog-entry" aria-label={t('projects.elogAsideAria')}>
            <span className="elog-entry-label">{t('projects.elogAsideLabel')}</span>
            <p>
              {t('projects.elogAsideBody')}
            </p>
            <a className="atlas-access" href={ENGINEERING_LOG_HASH}>
              <span>{t('projects.elogAsideCta')}</span>
              <span aria-hidden>↗</span>
            </a>
          </aside>
          <aside className="elog-entry elog-entry--production" aria-label={t('projects.productionAsideAria')}>
            <span className="elog-entry-label">{t('projects.productionAsideLabel')}</span>
            <p>
              {t('projects.productionAsideBody')}
            </p>
            <button
              type="button"
              className="atlas-access"
              onClick={(event) => {
                const project = mergeProjectCopy('miconsultorio')
                selectProject(project, event.currentTarget)
              }}
            >
              <span>{t('projects.productionAsideCta')}</span>
              <span aria-hidden>↗</span>
            </button>
          </aside>
        </div>
      </div>

      <div className="atlas-map-wrap fade-in">
        <div className="atlas-map-meta" aria-hidden="true">
          <span>{t('projects.mapMeta1')}</span>
          <span>{t('projects.mapMeta2')}</span>
          <span>{t('projects.mapMeta3')}</span>
        </div>

        <div className="atlas-project-map" aria-label={t('projects.mapAria')}>
          <svg
            className="atlas-map-connections"
            viewBox="0 0 1200 820"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M410 215 C560 190 650 160 815 185" />
            <path d="M330 300 C375 430 430 500 520 590" />
            <path d="M835 260 C860 390 865 455 910 560" />
            <path d="M545 620 C700 650 790 630 915 585" />
            <circle cx="410" cy="215" r="5" />
            <circle cx="815" cy="185" r="5" />
            <circle cx="520" cy="590" r="5" />
            <circle cx="915" cy="585" r="5" />
          </svg>

          {atlasTerritories.map((territory) => (
            <section
              key={territory.id}
              className={`atlas-territory atlas-territory--${territory.id}`}
              aria-labelledby={`territory-${territory.id}`}
            >
              <header className="atlas-territory-head">
                <div className="atlas-territory-index">
                  <span>{territory.number}</span>
                  <span>{territory.code}</span>
                </div>
                <div>
                  <h3 id={`territory-${territory.id}`}>{territory.name}</h3>
                  <p>{territory.note}</p>
                </div>
                <span className="atlas-territory-coordinates">{territory.coordinates}</span>
              </header>

              <div className="atlas-node-list">
                {territory.projects.map((project, index) => {
                  const hasDetail = allDetailProjects.some((item) => item.id === project.id)
                  const profile = atlasNodeProfiles[project.id]
                  const category = (project.label ?? project.type ?? '').split(' · ')[0]
                  const summary = project.tagline ?? project.description
                  const nodeCode = `${territory.code}–${String(index + 1).padStart(2, '0')}`
                  const nodeClasses = [
                    'atlas-project-node',
                    hasDetail ? 'atlas-project-node--detail' : 'atlas-project-node--reference',
                    profile?.weight === 'major' ? 'atlas-project-node--major' : '',
                    activeNodeId === project.id ? 'is-active' : '',
                  ].filter(Boolean).join(' ')

                  return (
                    <button
                      key={project.id}
                      type="button"
                      className={nodeClasses}
                      aria-pressed={activeNodeId === project.id}
                      aria-label={`${hasDetail ? t('projects.openProject') : t('projects.selectProject')} ${project.title}: ${category}`}
                      onClick={(event) => selectProject(project, event.currentTarget)}
                    >
                      <span className="atlas-node-marker" aria-hidden="true" />
                      <span className="atlas-node-content">
                        <span className="atlas-node-meta">
                          <span>{nodeCode}</span>
                          <span className={`atlas-node-status atlas-node-status--${profile?.status?.toLowerCase() || 'active'}`}>
                            {t(`projects.status.${profile?.status || 'Active'}`)}
                          </span>
                        </span>
                        <strong>{project.title}</strong>
                        <span className="atlas-node-category">{category}</span>
                        <span className="atlas-node-description">{summary}</span>
                        <span className="atlas-node-extra" aria-hidden="true">
                          <span>{project.annotation}</span>
                          <span className="atlas-node-action">
                            {hasDetail ? t('projects.consultSheet') : t('projects.documentaryNode')}
                          </span>
                        </span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        <aside className="atlas-map-legend" aria-label={t('projects.legendAria')}>
          <span><i className="legend-territory" aria-hidden="true" /> {t('projects.legendTerritory')}</span>
          <span><i className="legend-node" aria-hidden="true" /> {t('projects.legendNode')}</span>
          <span><i className="legend-connection" aria-hidden="true" /> {t('projects.legendConnection')}</span>
        </aside>
      </div>

      <dialog
        ref={dialogRef}
        className={`project-dialog project-dialog--${openProject?.accent ?? 'neutral'}`}
        aria-labelledby="project-dialog-title"
        aria-describedby="project-dialog-tagline"
        onCancel={(event) => {
          event.preventDefault()
          setOpenId(null)
        }}
        onKeyDown={handleDialogKeyDown}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpenId(null)
        }}
      >
        {openProject && openTerritory && openProfile && (
          <article className="project-dialog-inner atlas-sheet">
            <div className="atlas-sheet-bar">
              <div className="atlas-sheet-register">
                <span>{openSheetCode}</span>
                <span>{openTerritory.number} / {openTerritory.name}</span>
                <span className={`atlas-sheet-status atlas-sheet-status--${openProfile.status.toLowerCase()}`}>
                  {t(`projects.status.${openProfile.status}`)}
                </span>
              </div>
              <button
                type="button"
                className="atlas-sheet-close"
                data-project-dialog-close
                aria-label={t('projects.closeSheetAria', { title: openProject.title })}
                onClick={() => setOpenId(null)}
              >
                <span>{t('projects.closeSheet')}</span>
                <span aria-hidden>×</span>
              </button>
            </div>

            <div className="atlas-sheet-scroll">
              <header className="atlas-sheet-header">
                <p className="atlas-sheet-eyebrow">{t('projects.sheetEyebrow')}</p>
                <h3 id="project-dialog-title" className="project-dialog-title safe-text-render">
                  {openProject.title}
                </h3>
                <p id="project-dialog-tagline" className="project-dialog-tagline">
                  {openProject.tagline}
                </p>
                {openProject.id === 'paradigm' && openProject.privacyNote ? (
                  <p className="atlas-sheet-privacy" role="note">
                    <span className="atlas-sheet-privacy-label">{t('projects.privacyLabel')}</span>
                    <span>{openProject.privacyNote}</span>
                  </p>
                ) : null}
              </header>

              <div className="atlas-sheet-body">
                {openProject.problem && (
                  <section className="atlas-sheet-section atlas-sheet-section--lead" aria-labelledby="sheet-problem">
                    <span className="atlas-sheet-number">01</span>
                    <h4 id="sheet-problem">{t('projects.sectionProblem')}</h4>
                    <p>{openProject.problem}</p>
                  </section>
                )}

                {openProject.description && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-context">
                    <span className="atlas-sheet-number">02</span>
                    <h4 id="sheet-context">{t('projects.sectionContext')}</h4>
                    <p>{openProject.description}</p>
                  </section>
                )}

                {openProject.role && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-solution">
                    <span className="atlas-sheet-number">03</span>
                    <h4 id="sheet-solution">{t('projects.sectionSystem')}</h4>
                    <p>{openProject.role}</p>
                  </section>
                )}

                {openProject.id === 'paradigm' && openProject.flowSteps?.length > 0 ? (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-flow">
                    <span className="atlas-sheet-number">04</span>
                    <h4 id="sheet-flow">{t('projects.sectionFlow')}</h4>
                    <div className="atlas-sheet-flow-block">
                      {openProject.flowLead ? <p>{openProject.flowLead}</p> : null}
                      <ol className="atlas-sheet-flow" aria-label={t('projects.flowAria')}>
                        {openProject.flowSteps.map((step, index) => (
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
                  </section>
                ) : null}

                {openProject.highlights?.length > 0 && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-decisions">
                    <span className="atlas-sheet-number">{openProject.id === 'paradigm' ? '05' : '04'}</span>
                    <h4 id="sheet-decisions">{t('projects.sectionDecisions')}</h4>
                    <ul className="atlas-sheet-list">
                      {openProject.highlights.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                )}

                {(openProject.impact || openProject.impactHighlight) && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-result">
                    <span className="atlas-sheet-number">{openProject.id === 'paradigm' ? '06' : '05'}</span>
                    <h4 id="sheet-result">{t('projects.sectionResult')}</h4>
                    <div className="atlas-sheet-result">
                      {openProject.impactHighlight && <p className="atlas-sheet-annotation">{openProject.impactHighlight}</p>}
                      {openProject.impact && <p>{openProject.impact}</p>}
                    </div>
                  </section>
                )}

                {(openProject.artifacts?.length > 0 || openProject.stack?.length > 0) && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-technical">
                    <span className="atlas-sheet-number">{openProject.id === 'paradigm' ? '07' : '06'}</span>
                    <h4 id="sheet-technical">{t('projects.sectionTechnical')}</h4>
                    <div className="atlas-sheet-technical">
                      {openProject.artifacts?.length > 0 && (
                        <div>
                          <h5>{t('projects.deliverables')}</h5>
                          <ul className="atlas-sheet-inline-list">
                            {openProject.artifacts.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                      {openProject.stack?.length > 0 && (
                        <div>
                          <h5>{t('projects.stack')}</h5>
                          <ul className="atlas-sheet-inline-list">
                            {openProject.stack.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  </section>
                )}

                {openProject.id === 'paradigm' && openProject.evidenceItems?.length > 0 ? (
                  <section className="atlas-sheet-section atlas-sheet-section--evidence" aria-labelledby="sheet-evidence">
                    <span className="atlas-sheet-number">08</span>
                    <h4 id="sheet-evidence">{t('projects.sectionEvidence')}</h4>
                    <div className="atlas-sheet-evidence">
                      {openProject.evidenceLead ? <p>{openProject.evidenceLead}</p> : null}
                      <ul className="atlas-sheet-inline-list">
                        {openProject.evidenceItems.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <a
                        href={ENGINEERING_LOG_HASH}
                        className="atlas-sheet-link atlas-sheet-link--evidence"
                        onClick={openEngineeringLog}
                      >
                        {t('projects.engineeringLogLink')}
                      </a>
                    </div>
                  </section>
                ) : null}

                {nextStep && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-next">
                    <span className="atlas-sheet-number">{openProject.id === 'paradigm' ? '09' : '07'}</span>
                    <h4 id="sheet-next">{t('projects.sectionNext')}</h4>
                    <p>{nextStep}</p>
                  </section>
                )}
              </div>
            </div>

            <footer className="atlas-sheet-footer">
              <button
                type="button"
                className="atlas-sheet-nav atlas-sheet-nav--previous"
                aria-label={t('projects.prevSheetAria', { title: previousProject.title })}
                onClick={() => navigateProject(previousProject)}
              >
                <span aria-hidden>←</span>
                <span><small>{t('projects.prevSheet')}</small>{previousProject.title}</span>
              </button>

              <div className="atlas-sheet-actions">
                {openProject.id === 'halo-brief' ? (
                  isHaloBriefLive(openProject.projectUrl) ? (
                    <a href={openProject.projectUrl} target="_blank" rel="noopener noreferrer" className="atlas-sheet-link">
                      {t('projects.openProjectLink')}
                    </a>
                  ) : (
                    <span className="atlas-sheet-unavailable">{t('projects.unavailable')}</span>
                  )
                ) : openProject.hasLiveDemo !== false && openProject.projectUrl ? (
                  <a href={openProject.projectUrl} target="_blank" rel="noopener noreferrer" className="atlas-sheet-link">
                    {t('projects.openProjectLink')}
                  </a>
                ) : null}
                {openProject.id === 'paradigm' ? (
                  <a
                    href={ENGINEERING_LOG_HASH}
                    className="atlas-sheet-link"
                    onClick={openEngineeringLog}
                  >
                    {t('projects.engineeringLogLink')}
                  </a>
                ) : null}
                <span>{openProjectIndex + 1} / {allDetailProjects.length}</span>
              </div>

              <button
                type="button"
                className="atlas-sheet-nav atlas-sheet-nav--next"
                aria-label={t('projects.nextSheetAria', { title: nextProject.title })}
                onClick={() => navigateProject(nextProject)}
              >
                <span><small>{t('projects.nextSheet')}</small>{nextProject.title}</span>
                <span aria-hidden>→</span>
              </button>
            </footer>
          </article>
        )}
      </dialog>

    </section>
  )
}
