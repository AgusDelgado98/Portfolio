import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { pickProjectCopy } from '../i18n/messages/projects.js'
import ProjectEvidenceGallery from './ProjectEvidenceGallery.jsx'
import {
  CLARUSFLOW_REPO_URL,
  CLARUSFLOW_REVENUE_SRC,
  CLARUSFLOW_RISK_SRC,
  ENGINEERING_LOG_HASH,
  KAIROS_LIBRARY_SRC,
  KAIROS_OVERVIEW_SRC,
  LUMENVOX_CONFUSION_SRC,
  LUMENVOX_REPO_URL,
  LUMENVOX_UNRESOLVED_SRC,
  PARADIGM_APP_URL,
  PARADIGM_IMPORTANCE_CHART_SRC,
  PARADIGM_LEAD_CHART_SRC,
  PARADIGM_WEB_REPO_URL,
  PROVIDENTIA_EXCEEDANCE_SRC,
  PROVIDENTIA_FORECAST_SRC,
  PROVIDENTIA_REPO_URL,
  SOMA_DEMO_POSTER_SRC,
  SOMA_DEMO_VIDEO_SRC,
  TEKMERION_REPO_URL,
  TEKMERION_RULES_VS_ML_SRC,
  TEKMERION_SHOWROOM_SRC,
} from '../constants/links.js'

const featuredProjectsBase = [
  {
    id: 'paradigm',
    title: 'Paradigm',
    accent: 'emerald',
    accentColor: '#00d4b0',
    stack: ['Python', 'SQL', 'pandas', 'scikit-learn', 'Power BI', 'Streamlit'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </svg>
    ),
    projectUrl: PARADIGM_APP_URL,
    githubUrl: PARADIGM_WEB_REPO_URL,
    githubCtaKey: 'projects.githubPublicInterface',
    hasEngineeringLog: true,
    evidenceVisuals: [
      { id: 'lead', src: PARADIGM_LEAD_CHART_SRC },
      { id: 'importance', src: PARADIGM_IMPORTANCE_CHART_SRC },
    ],
  },
  {
    id: 'soma',
    title: 'Soma',
    accent: 'violet',
    accentColor: '#8b6fff',
    stack: ['React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Vercel'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    hasLiveDemo: false,
    privateRepo: true,
    hasDemoVideo: true,
  },
  {
    id: 'providentia',
    title: 'PROVIDENTIA',
    accent: 'sky',
    accentColor: '#37677a',
    stack: ['Python', 'pandas', 'statsmodels', 'LightGBM', 'matplotlib', 'pytest'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 15l4-5 4 3 6-8" />
      </svg>
    ),
    githubUrl: PROVIDENTIA_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'forecast', src: PROVIDENTIA_FORECAST_SRC },
      { id: 'exceedance', src: PROVIDENTIA_EXCEEDANCE_SRC },
    ],
  },
]

const applicationProjectsBase = [
  {
    id: 'hogares',
    title: 'Hogares',
    accent: 'violet',
    stack: ['React', 'TypeScript', 'Vite', 'PWA', 'Vercel', 'Cloudflare Worker', 'Hono', 'Cloudflare D1', 'JWT', 'scrypt'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M3 10.5L12 4l9 6.5" />
        <path d="M5 9.5V20h14V9.5" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
    hasLiveDemo: false,
    privateRepo: true,
  },
  {
    id: 'tekmerion',
    title: 'Tekmérion',
    accent: 'sky',
    stack: ['Python', 'Evidence pipeline', 'Grounding', 'scikit-learn', 'Rules engine'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M12 3l8 4-8 4-8-4z" />
        <path d="M4 11l8 4 8-4M4 15l8 4 8-4" />
      </svg>
    ),
    githubUrl: TEKMERION_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'showroom', src: TEKMERION_SHOWROOM_SRC },
      { id: 'rulesVsMl', src: TEKMERION_RULES_VS_ML_SRC },
    ],
  },
  {
    id: 'kairos',
    title: 'Kairós',
    accent: 'emerald',
    stack: ['React 19', 'TypeScript', 'Vite', 'PWA', 'localStorage', 'IndexedDB', 'Web Speech API', 'Cloudflare Worker', 'D1', 'Better Auth'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.5 2" />
      </svg>
    ),
    hasLiveDemo: false,
    privateRepo: true,
    evidenceVisuals: [
      { id: 'overview', src: KAIROS_OVERVIEW_SRC },
      { id: 'library', src: KAIROS_LIBRARY_SRC },
    ],
  },
  {
    id: 'clarusflow',
    title: 'ClarusFlow',
    accent: 'sky',
    stack: ['Python', 'pandas', 'NumPy', 'Matplotlib', 'python-dateutil'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <path d="M17 14v7M14 17.5h6" />
      </svg>
    ),
    githubUrl: CLARUSFLOW_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'revenue', src: CLARUSFLOW_REVENUE_SRC },
      { id: 'risk', src: CLARUSFLOW_RISK_SRC },
    ],
  },
  {
    id: 'lumenvox',
    title: 'LumenVox',
    accent: 'violet',
    stack: ['Python', 'pandas', 'NLP', 'scikit-learn', 'Matplotlib'],
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        <path d="M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
    githubUrl: LUMENVOX_REPO_URL,
    githubCtaKey: 'projects.viewGithub',
    hasLiveDemo: false,
    evidenceVisuals: [
      { id: 'confusion', src: LUMENVOX_CONFUSION_SRC },
      { id: 'unresolved', src: LUMENVOX_UNRESOLVED_SRC },
    ],
  },
]

const atlasNodeProfiles = {
  paradigm: {
    status: 'Active',
    weight: 'major',
  },
  soma: {
    status: 'Production',
    weight: 'major',
  },
  providentia: {
    status: 'Active',
    weight: 'major',
  },
  hogares: {
    status: 'Active',
  },
  tekmerion: {
    status: 'Active',
  },
  kairos: {
    status: 'Active',
  },
  clarusflow: {
    status: 'Active',
  },
  lumenvox: {
    status: 'Active',
  },
}

const atlasTerritoriesIds = [
  {
    id: 'intelligence',
    number: '01',
    code: 'INT',
    coordinates: 'N 34° / E 12°',
    projectIds: ['paradigm', 'providentia', 'tekmerion', 'lumenvox'],
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
    projectIds: ['soma', 'hogares', 'kairos'],
  },
]

function SomaDemoVideo({ active, label, fallback }) {
  const videoRef = useRef(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReducedMotion(media.matches)
    sync()
    media.addEventListener?.('change', sync)
    return () => media.removeEventListener?.('change', sync)
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !active) return undefined

    if (reducedMotion) {
      video.pause()
      video.currentTime = 0
      return undefined
    }

    const play = video.play()
    if (play && typeof play.catch === 'function') {
      play.catch(() => {})
    }
    return undefined
  }, [active, reducedMotion])

  if (!active) return null

  return (
    <figure className="atlas-sheet-demo" id="soma-demo">
      <div className="atlas-sheet-demo-frame">
        <video
          ref={videoRef}
          className="atlas-sheet-demo-video"
          autoPlay={!reducedMotion}
          muted
          loop={!reducedMotion}
          playsInline
          preload="metadata"
          controls={false}
          poster={SOMA_DEMO_POSTER_SRC}
          aria-label={label}
        >
          <source src={SOMA_DEMO_VIDEO_SRC} type="video/webm" />
          {fallback}
        </video>
      </div>
      <figcaption className="atlas-sheet-demo-caption">{label}</figcaption>
    </figure>
  )
}

export default function Projects() {
  const { t, language } = useLanguage()
  const [openId, setOpenId] = useState(null)
  const [activeNodeId, setActiveNodeId] = useState(null)
  const dialogRef = useRef(null)
  const openerRef = useRef(null)
  const demoSectionRef = useRef(null)

  const allProjectsBase = [...featuredProjectsBase, ...applicationProjectsBase]
  const projectsById = Object.fromEntries(allProjectsBase.map((p) => [p.id, p]))

  function mergeProjectCopy(id) {
    const base = projectsById[id] || {}
    const copy = pickProjectCopy(id, language)
    const profile = atlasNodeProfiles[id] || {}
    const captions = copy.evidenceCaptions || {}
    return {
      ...base,
      ...copy,
      annotation: copy.annotation || profile.annotation,
      signals: copy.signals || base.signals || [],
      evidenceVisuals: (base.evidenceVisuals || []).map((item) => ({
        ...item,
        caption: captions[item.id] || item.caption,
        alt: captions[item.id] || item.alt || item.caption,
      })),
    }
  }

  const featuredProjects = featuredProjectsBase.map((p) => mergeProjectCopy(p.id))
  const applicationProjects = applicationProjectsBase.map((p) => mergeProjectCopy(p.id))
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
  const nextStep = openProject?.nextStep
    ? openProject.nextStep
    : openProject?.hasLiveDemo === false && !openProject?.hasDemoVideo && !openProject?.githubUrl
      ? t('projects.nextStepDev')
      : null
  const sheetNo = (() => {
    let n = 0
    return () => String(++n).padStart(2, '0')
  })()
  const showDemo = Boolean(openProject?.hasDemoVideo)
  const showFlow = Boolean(openProject?.flowSteps?.length)
  const showEvidence = Boolean(
    openProject?.evidenceItems?.length || openProject?.evidenceVisuals?.length,
  )

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

  function focusSomaDemo() {
    const target = demoSectionRef.current || document.getElementById('soma-demo')
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
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
                const project = mergeProjectCopy('soma')
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
                  const summary = project.nodeSummary ?? project.tagline ?? project.description
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
                        <strong className="atlas-node-title">{project.title}</strong>
                        {summary ? (
                          <span className="atlas-project-node-summary">{summary}</span>
                        ) : null}
                        <span className="atlas-node-extra" aria-hidden="true">
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
                <h3
                  id="project-dialog-title"
                  className="project-dialog-title safe-text-render"
                >
                  {openProject.title}
                </h3>
                <p id="project-dialog-tagline" className="project-dialog-tagline">
                  {openProject.tagline}
                </p>
                {openProject.privacyNote ? (
                  <p className="atlas-sheet-privacy" role="note">
                    <span className="atlas-sheet-privacy-label">{t('projects.privacyLabel')}</span>
                    <span>{openProject.privacyNote}</span>
                  </p>
                ) : null}
              </header>

              <div className="atlas-sheet-body">
                {openProject.problem && (
                  <section className="atlas-sheet-section atlas-sheet-section--lead" aria-labelledby="sheet-problem">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-problem">{t('projects.sectionProblem')}</h4>
                    <p>{openProject.problem}</p>
                  </section>
                )}

                {openProject.description && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-context">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-context">{t('projects.sectionContext')}</h4>
                    <p>{openProject.description}</p>
                  </section>
                )}

                {openProject.role && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-solution">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-solution">{t('projects.sectionSystem')}</h4>
                    <p>{openProject.role}</p>
                  </section>
                )}

                {showDemo ? (
                  <section
                    ref={demoSectionRef}
                    className="atlas-sheet-section atlas-sheet-section--demo"
                    aria-labelledby="sheet-demo"
                  >
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-demo">{t('projects.sectionDemo')}</h4>
                    <SomaDemoVideo
                      active={openProject.id === 'soma'}
                      label={t('projects.demoLabel')}
                      fallback={t('projects.demoFallback')}
                    />
                  </section>
                ) : null}

                {showFlow ? (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-flow">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
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
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-decisions">{t('projects.sectionDecisions')}</h4>
                    <ul className="atlas-sheet-list">
                      {openProject.highlights.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  </section>
                )}

                {(openProject.impact || openProject.impactHighlight) && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-result">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-result">{t('projects.sectionResult')}</h4>
                    <div className="atlas-sheet-result">
                      {openProject.impactHighlight && <p className="atlas-sheet-annotation">{openProject.impactHighlight}</p>}
                      {openProject.impact && <p>{openProject.impact}</p>}
                    </div>
                  </section>
                )}

                {(openProject.artifacts?.length > 0 || openProject.stack?.length > 0) && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-technical">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
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

                {showEvidence ? (
                  <section className="atlas-sheet-section atlas-sheet-section--evidence" aria-labelledby="sheet-evidence">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
                    <h4 id="sheet-evidence">{t('projects.sectionEvidence')}</h4>
                    <div className="atlas-sheet-evidence">
                      {openProject.evidenceLead ? <p>{openProject.evidenceLead}</p> : null}
                      {openProject.evidenceItems?.length > 0 ? (
                        <ul className="atlas-sheet-inline-list">
                          {openProject.evidenceItems.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      ) : null}
                      <ProjectEvidenceGallery items={openProject.evidenceVisuals} />
                      {openProject.hasEngineeringLog ? (
                        <a
                          href={ENGINEERING_LOG_HASH}
                          className="atlas-sheet-link atlas-sheet-link--evidence"
                          onClick={openEngineeringLog}
                        >
                          {t('projects.engineeringLogLink')}
                        </a>
                      ) : null}
                    </div>
                  </section>
                ) : null}

                {nextStep && (
                  <section className="atlas-sheet-section" aria-labelledby="sheet-next">
                    <span className="atlas-sheet-number">{sheetNo()}</span>
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
                {openProject.hasDemoVideo ? (
                  <button type="button" className="atlas-sheet-link" onClick={focusSomaDemo}>
                    {t('projects.viewDemoLink')}
                  </button>
                ) : null}
                {openProject.hasLiveDemo !== false && openProject.projectUrl ? (
                  <a href={openProject.projectUrl} target="_blank" rel="noopener noreferrer" className="atlas-sheet-link">
                    {t('projects.openProjectLink')}
                  </a>
                ) : null}
                {openProject.githubUrl ? (
                  <a
                    href={openProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="atlas-sheet-link"
                  >
                    {t(openProject.githubCtaKey || 'projects.viewGithub')}
                  </a>
                ) : null}
                {openProject.privateRepo ? (
                  <span className="atlas-sheet-private">{t('projects.privateRepo')}</span>
                ) : null}
                {openProject.hasEngineeringLog ? (
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
