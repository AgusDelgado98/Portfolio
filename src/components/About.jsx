import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CV_HREF } from '../i18n/config.js'
import useCssVarHeight from '../hooks/useCssVarHeight.js'
import useSelectable from '../hooks/useSelectable.js'
import { getVisibleProjects } from '../projects/registry.js'
import { ABOUT_HASH, ABOUT_SECTIONS, PROJECTS_HASH, aboutSectionHash, projectHash } from '../router/hashes.js'

/**
 * The one About page. `#about/<section>` is a canonical route that scrolls to
 * that block and moves focus to its heading. The in-page links use those
 * routes as their href so a copied link or a new tab still opens the section;
 * a plain click only scrolls and leaves the address bar as it is.
 *
 * Reading order — and nav order, which must match it: profile, path,
 * capabilities, education, method. No section is focusable and none draws an
 * outline; the heading takes focus.
 */
const SECTION_DOM_ID = {
  profile: 'about-profile',
  experience: 'about-experience',
  skills: 'about-skills',
  education: 'about-education',
  method: 'about-method',
}

const NAV = ['profile', 'experience', 'skills', 'education', 'method']

/** Chronological, so the education line reads left to right. */
const LEARNING = [
  { id: 'coderhouse-data', status: 'completed' },
  { id: 'ibm-gai', status: 'completed' },
  { id: 'issd-cs-ai', status: 'in_progress' },
]

/** The path's three steps, and which registry projects back each (derived, not typed). */
const PATH_PROJECTS = [null, (project) => project.categories.includes('analytics-bi'), (project) => project.categories.includes('ds-ml')]

/** Capabilities: tools and the registry projects that prove them. Tools are spread over the three areas. */
const AREAS = [
  { id: 'analysis', group: 'analysis', extraTools: ['Streamlit', 'Tableau'], backs: (project) => project.categories.includes('analytics-bi') },
  { id: 'engineering', group: 'engineering', extraTools: ['Airflow', 'Git'], backs: (project) => project.stages.includes('data') },
  { id: 'modeling', group: 'modeling', extraTools: [], backs: (project) => project.categories.includes('ds-ml') },
]

const STAGE_COLOR = ['data', 'evidence', 'prediction', 'decision']

function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function focusHeading(target) {
  target?.querySelector('h1, h2')?.focus({ preventScroll: true })
}

function AboutNav({ t }) {
  const navRef = useRef(null)
  useCssVarHeight(navRef, '--section-nav-h', '0px')

  const openSection = (event, id) => {
    if (!plainClick(event)) return
    const target = document.getElementById(SECTION_DOM_ID[id])
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ block: 'start' })
    focusHeading(target)
  }

  return (
    <nav ref={navRef} className="ds-section-nav" aria-label={t('about.navAria')}>
      {NAV.map((id) => (
        <a
          key={id}
          href={ABOUT_SECTIONS.includes(id) ? aboutSectionHash(id) : ABOUT_HASH}
          onClick={(event) => openSection(event, id)}
        >
          {t(`about.sections.${id}`)}
        </a>
      ))}
    </nav>
  )
}

function ProjectLinks({ projects }) {
  if (!projects.length) return null
  return (
    <ul className="ds-about-links">
      {projects.map((project) => (
        <li key={project.id}>
          <a href={projectHash(project.id)}>{project.title}</a>
        </li>
      ))}
    </ul>
  )
}

/** Three steps on a line. Hover, focus or tap shows the evidence behind a step. */
function Path({ t }) {
  const steps = t('about.experience.arc')
  const evidence = t('about.experience.evidence')
  const { shown, bind } = useSelectable(1)
  const projects = getVisibleProjects()
  const backing = PATH_PROJECTS[shown] ? projects.filter(PATH_PROJECTS[shown]) : []

  return (
    <div className="ds-path">
      <ol className="ds-rail" aria-label={t('about.experience.arcAria')}>
        {steps.map((label, index) => (
          <li key={label} className={`ds-stage--${STAGE_COLOR[index]}`}>
            <button type="button" className="ds-rail-step" {...bind(index)}>
              <span className="ds-rail-node" aria-hidden="true" />
              <span className="ds-rail-label">{label}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="ds-evidence" aria-live="polite">
        <p>{evidence[shown]}</p>
        {backing.length ? (
          <>
            <p className="ds-about-minor">{t('about.experience.projectsLabel')}</p>
            <ProjectLinks projects={backing} />
          </>
        ) : null}
      </div>
    </div>
  )
}

/** Three capability areas. Choosing one lists its tools and the projects that back it. */
function Capabilities({ t }) {
  const { shown, bind } = useSelectable(0)
  const projects = getVisibleProjects()
  const area = AREAS[shown]
  const group = t(`about.skills.groups.${area.group}`)
  const tools = [...group.items, ...area.extraTools]
  const backing = projects.filter(area.backs)

  return (
    <div className="ds-caps">
      <ul className="ds-cap-list">
        {AREAS.map((item, index) => (
          <li key={item.id}>
            <button type="button" className="ds-cap" {...bind(index)}>
              {t(`about.skills.groups.${item.group}.title`)}
            </button>
          </li>
        ))}
      </ul>
      <div className="ds-evidence" aria-live="polite">
        <p className="ds-about-minor">{t('about.skills.toolsLabel')}</p>
        <p>{tools.join(' · ')}</p>
        {backing.length ? (
          <>
            <p className="ds-about-minor">{t('about.skills.projectsLabel')}</p>
            <ProjectLinks projects={backing} />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default function About({ section = null }) {
  const { t } = useLanguage()
  const previousSectionRef = useRef(section)

  useEffect(() => {
    const target = section ? document.getElementById(SECTION_DOM_ID[section]) : null
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
      focusHeading(target)
    } else if (previousSectionRef.current) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
    previousSectionRef.current = section
  }, [section])

  const stages = t('about.method.stages')
  const jobs = t('contact.experienceJobs')

  return (
    <article className="ds-about-page">
      <AboutNav t={t} />

      <section id="about-profile" aria-labelledby="about-title">
        <p className="ds-about-kicker">{t('about.profile.kicker')}</p>
        <h1 id="about-title" tabIndex={-1}>
          {t('about.profile.title')}
        </h1>
        <p className="ds-about-lede">{t('about.profile.lede')}</p>
        <p className="ds-about-minor">{t('about.profile.english')}</p>
        <p className="ds-about-actions">
          <a className="ds-btn ds-btn--primary" href={PROJECTS_HASH}>
            {t('about.profile.ctaProjects')}
          </a>
          <a className="ds-btn ds-btn--secondary" href={CV_HREF} download>
            {t('about.profile.ctaCv')}
          </a>
        </p>
      </section>

      <section id="about-experience" aria-labelledby="about-experience-title">
        <h2 id="about-experience-title" tabIndex={-1}>
          {t('about.experience.title')}
        </h2>
        <Path t={t} />
        <p className="ds-about-note">{t('about.experience.note')}</p>
        <details className="ds-more ds-roles">
          <summary>{t('about.experience.detailLabel')}</summary>
          {jobs.map((job) => (
            <div key={job.role} className="ds-role">
              <h3>{job.role}</h3>
              <p className="ds-about-meta">
                {job.org}
                <span>{job.meta}</span>
              </p>
              <ul>
                {job.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
          ))}
        </details>
      </section>

      <section id="about-skills" aria-labelledby="about-skills-title">
        <h2 id="about-skills-title" tabIndex={-1}>
          {t('about.skills.title')}
        </h2>
        <Capabilities t={t} />
      </section>

      <section id="about-education" aria-labelledby="about-education-title">
        <h2 id="about-education-title" tabIndex={-1}>
          {t('about.education.title')}
        </h2>
        <ol className="ds-timeline">
          {LEARNING.map((item) => {
            const progressNote = t(`stack.learning.${item.id}.progressNote`)
            const hasProgress = progressNote && !String(progressNote).startsWith('stack.learning')
            const institution = t(`stack.learning.${item.id}.institution`)
            const hasInstitution = institution && !String(institution).startsWith('stack.learning')
            const statusLabel =
              item.status === 'completed' ? t('stack.statusCompleted') : t('stack.statusInProgress')
            return (
              <li key={item.id} data-status={item.status}>
                <span className="ds-timeline-node" aria-hidden="true" />
                <h3>{t(`stack.learning.${item.id}.title`)}</h3>
                <p className="ds-about-meta">
                  {hasInstitution ? <span>{institution}</span> : null}
                  {hasProgress ? <span>{progressNote}</span> : null}
                  <span className="ds-about-status">{statusLabel}</span>
                </p>
              </li>
            )
          })}
        </ol>
      </section>

      <section id="about-method" aria-labelledby="about-method-title">
        <h2 id="about-method-title" tabIndex={-1}>
          {t('about.method.title')}
        </h2>
        <p className="ds-about-sequence">{t('about.method.sequence')}</p>
        <ol className="ds-about-stages">
          {stages.map((stage, index) => (
            <li key={stage.title} className={`ds-stage--${STAGE_COLOR[index]}`}>
              <span className="ds-about-stage-node" aria-hidden="true" />
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
