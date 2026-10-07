import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CV_HREF } from '../i18n/config.js'
import { ABOUT_HASH, ABOUT_SECTIONS, PROJECTS_HASH, aboutSectionHash } from '../router/hashes.js'

/**
 * The one About page. `#about/<section>` is a canonical route that scrolls to
 * and focuses that block. The in-page links use those routes as their href so
 * a copied link or a new tab still opens the section; a plain click only
 * scrolls and leaves the address bar as it is.
 */
const SECTION_DOM_ID = {
  profile: 'about-profile',
  skills: 'about-skills',
  experience: 'about-experience',
  education: 'about-education',
  method: 'about-method',
}

const NAV = ['profile', ...ABOUT_SECTIONS]

const SKILL_GROUPS = ['analysis', 'engineering', 'modeling', 'tools']

const LEARNING = [
  { id: 'issd-cs-ai', status: 'in_progress' },
  { id: 'ibm-gai', status: 'completed' },
  { id: 'coderhouse-data', status: 'completed' },
]

function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function AboutNav({ t }) {
  const openSection = (event, id) => {
    if (!plainClick(event)) return
    const target = document.getElementById(SECTION_DOM_ID[id])
    if (!target) return
    event.preventDefault()
    target.scrollIntoView({ block: 'start' })
    target.focus({ preventScroll: true })
  }

  return (
    <nav className="ds-section-nav" aria-label={t('about.navAria')}>
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

export default function About({ section = null }) {
  const { t } = useLanguage()
  const previousSectionRef = useRef(section)

  useEffect(() => {
    const target = section ? document.getElementById(SECTION_DOM_ID[section]) : null
    if (target) {
      target.scrollIntoView({ block: 'start', behavior: 'instant' })
      target.focus({ preventScroll: true })
    } else if (previousSectionRef.current) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
    previousSectionRef.current = section
  }, [section])

  const jobs = t('contact.experienceJobs')
  const stages = t('about.method.stages')

  return (
    <article className="ds-about-page">
      <AboutNav t={t} />

      <section id="about-profile" tabIndex={-1} aria-labelledby="about-title">
        <p className="ds-about-kicker">{t('about.profile.kicker')}</p>
        <h1 id="about-title">{t('about.profile.title')}</h1>
        <p className="ds-about-lede">{t('about.profile.lede')}</p>
        <p className="ds-about-actions">
          <a className="ds-btn ds-btn--primary" href={PROJECTS_HASH}>
            {t('about.profile.ctaProjects')}
          </a>
          <a className="ds-btn ds-btn--secondary" href={CV_HREF} download>
            {t('about.profile.ctaCv')}
          </a>
        </p>
      </section>

      <section id="about-skills" tabIndex={-1} aria-labelledby="about-skills-title">
        <h2 id="about-skills-title">{t('about.skills.title')}</h2>
        <div className="ds-about-groups">
          {SKILL_GROUPS.map((key) => {
            const group = t(`about.skills.groups.${key}`)
            return (
              <div key={key}>
                <h3>{group.title}</h3>
                <ul>
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>

      <section id="about-experience" tabIndex={-1} aria-labelledby="about-experience-title">
        <h2 id="about-experience-title">{t('about.experience.title')}</h2>
        <p className="ds-about-note">{t('about.experience.note')}</p>
        <div className="ds-about-jobs">
          {jobs.map((job) => (
            <article key={job.role}>
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
            </article>
          ))}
        </div>
      </section>

      <section id="about-education" tabIndex={-1} aria-labelledby="about-education-title">
        <h2 id="about-education-title">{t('about.education.title')}</h2>
        <div className="ds-about-records">
          {LEARNING.map((item) => {
            const progressNote = t(`stack.learning.${item.id}.progressNote`)
            const hasProgress = progressNote && !String(progressNote).startsWith('stack.learning')
            const institution = t(`stack.learning.${item.id}.institution`)
            const hasInstitution = institution && !String(institution).startsWith('stack.learning')
            const statusLabel =
              item.status === 'completed' ? t('stack.statusCompleted') : t('stack.statusInProgress')
            return (
              <article key={item.id}>
                <h3>{t(`stack.learning.${item.id}.title`)}</h3>
                <p className="ds-about-meta">
                  {hasInstitution ? <span>{institution}</span> : null}
                  {hasProgress ? <span>{progressNote}</span> : null}
                  <span className="ds-about-status">{statusLabel}</span>
                </p>
                <p>{t(`stack.learning.${item.id}.description`)}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section id="about-method" tabIndex={-1} aria-labelledby="about-method-title">
        <h2 id="about-method-title">{t('about.method.title')}</h2>
        <p className="ds-about-sequence">{t('about.method.sequence')}</p>
        <ol className="ds-about-stages">
          {stages.map((stage) => (
            <li key={stage.title}>
              <h3>{stage.title}</h3>
              <p>{stage.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </article>
  )
}
