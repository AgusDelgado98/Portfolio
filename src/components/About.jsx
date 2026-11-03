import React, { useEffect, useRef } from 'react'
import '../styles/about.css'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CV_HREF } from '../i18n/config.js'
import useCssVarHeight from '../hooks/useCssVarHeight.js'
import useSelectable from '../hooks/useSelectable.js'
import Seam from './home/Seam.jsx'
import EvolutionRoute from './figures/EvolutionRoute.jsx'
import {
  ABOUT_HASH,
  ABOUT_SECTIONS,
  PROJECTS_HASH,
  CONTACT_HASH,
  aboutSectionHash,
  projectHash,
} from '../router/hashes.js'

/**
 * About — «Superficie de decisión» F8 (R4 / R5).
 *
 * Dark editorial hero with EvolutionRoute → seam → paper: trayectoria in three
 * areas, evidence matrix, sober close. `#about/<section>` scrolls to the block
 * and focuses its heading. Nav order matches DOM section order.
 */
const SECTION_DOM_ID = {
  profile: 'about-profile',
  experience: 'about-experience',
  education: 'about-education',
  skills: 'about-skills',
  method: 'about-method',
}

const NAV = ['profile', 'experience', 'education', 'skills', 'method']

const LEARNING_EXTRA = [
  { id: 'coderhouse-data', status: 'completed' },
  { id: 'ibm-gai', status: 'completed' },
]

/** Matrix columns: role + published projects only. Withheld work is not a column. */
const MATRIX_COLS = ['experience', 'paradigm', 'providentia']
const MATRIX_ROWS = [
  { id: 'analysis', marks: { experience: 'full', paradigm: 'full' } },
  { id: 'quality', marks: { experience: 'full', paradigm: 'full' } },
  { id: 'forecasting', marks: { providentia: 'full' } },
  { id: 'ml', marks: { paradigm: 'full', providentia: 'full' } },
]

const PATH_AREAS = ['practice', 'training', 'direction']

function plainClick(event) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey
}

function focusHeading(target) {
  target?.querySelector('h1, h2')?.focus({ preventScroll: true })
}

function Mark({ kind, label }) {
  if (!kind) {
    return <span className="about-mark about-mark--empty" role="img" aria-label={label} />
  }
  if (kind === 'full') {
    return (
      <svg className="about-mark" width="18" height="18" viewBox="0 0 18 18" aria-label={label} role="img">
        <circle cx="9" cy="9" r="6.5" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg className="about-mark" width="18" height="18" viewBox="0 0 18 18" aria-label={label} role="img">
      <circle cx="9" cy="9" r="6" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 3A6 6 0 0 0 9 15Z" fill="currentColor" />
    </svg>
  )
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

function PathStroke({ variant }) {
  const dash = variant === 'dashed' ? '8 6' : variant === 'dotted' ? '1.5 7' : undefined
  return (
    <svg className="about-stroke" width="120" height="6" viewBox="0 0 120 6" aria-hidden="true" focusable="false">
      <line
        x1="0"
        y1="3"
        x2="120"
        y2="3"
        stroke="currentColor"
        strokeWidth={variant === 'dotted' ? 2.6 : 2.4}
        strokeDasharray={dash}
        strokeLinecap={variant === 'dotted' ? 'round' : undefined}
      />
    </svg>
  )
}

function Trajectory({ t }) {
  const { shown, bind } = useSelectable(0)
  const jobs = t('contact.experienceJobs')
  const areas = PATH_AREAS.map((id) => ({
    id,
    title: t(`about.path.areas.${id}.title`),
    note: t(`about.path.areas.${id}.note`),
    stroke: id === 'practice' ? 'solid' : id === 'training' ? 'dashed' : 'dotted',
    items: t(`about.path.areas.${id}.items`),
  }))

  return (
    <div className="about-path">
      <div className="about-path__tabs" role="tablist" aria-label={t('about.path.tabsAria')}>
        {areas.map((area, index) => {
          // Tabs use aria-selected; strip aria-pressed from useSelectable (not allowed on role=tab).
          const { 'aria-pressed': _pressed, ...tabBind } = bind(index)
          return (
          <button
            key={area.id}
            type="button"
            role="tab"
            id={`about-path-tab-${area.id}`}
            aria-selected={shown === index}
            aria-controls="about-path-panel"
            className="about-path__tab"
            {...tabBind}
          >
            {area.title}
          </button>
          )
        })}
      </div>

      <div id="about-path-panel" className="about-path__grid" aria-live="polite">
        {areas.map((area, index) => {
          const isEducation = area.id === 'training'
          const body = (
            <>
              {isEducation ? (
                <h2 id="about-education-title" className="about-path__heading" tabIndex={-1}>
                  {area.title}
                </h2>
              ) : (
                <p className="home-label home-label--ink">{area.title}</p>
              )}
              <p className="about-path__note">{area.note}</p>
              <PathStroke variant={area.stroke} />
              <ul className="about-path__list">
                {area.items.map((item) => (
                  <li key={item.title}>
                    <span className="about-path__bullet" aria-hidden="true">
                      {area.id === 'practice' ? '●' : area.id === 'training' ? '◐' : '○'}
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p className="about-path__meta">{item.meta}</p>
                      {item.bullets?.length ? (
                        <ul>
                          {item.bullets.map((bullet) => (
                            <li key={bullet}>{bullet}</li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
              {isEducation ? (
                <details className="about-more">
                  <summary>{t('about.path.moreLearning')}</summary>
                  <ol className="about-learning">
                    {LEARNING_EXTRA.map((item) => {
                      const progressNote = t(`stack.learning.${item.id}.progressNote`)
                      const hasProgress = progressNote && !String(progressNote).startsWith('stack.learning')
                      const institution = t(`stack.learning.${item.id}.institution`)
                      const hasInstitution = institution && !String(institution).startsWith('stack.learning')
                      return (
                        <li key={item.id} data-status={item.status}>
                          <h3>{t(`stack.learning.${item.id}.title`)}</h3>
                          <p className="about-path__meta">
                            {hasInstitution ? <span>{institution}</span> : null}
                            {hasProgress ? <span>{progressNote}</span> : null}
                            <span>{t('stack.statusCompleted')}</span>
                          </p>
                        </li>
                      )
                    })}
                  </ol>
                </details>
              ) : null}
              {area.id === 'practice' ? (
                <details className="about-more">
                  <summary>{t('about.experience.detailLabel')}</summary>
                  <div className="about-roles" aria-live="polite">
                    {jobs.map((job) => (
                      <div key={job.role} className="about-role">
                        <h3>{job.role}</h3>
                        <p className="about-path__meta">
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
                  </div>
                </details>
              ) : null}
            </>
          )
          if (isEducation) {
            return (
              <section id="about-education" key={area.id} className="about-path__col" data-active={shown === index ? 'true' : undefined} aria-labelledby="about-education-title">
                {body}
              </section>
            )
          }
          return (
            <div
              key={area.id}
              className="about-path__col"
              data-active={shown === index ? 'true' : undefined}
            >
              {body}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function EvidenceMatrix({ t }) {
  const colHref = {
    experience: aboutSectionHash('experience'),
    paradigm: projectHash('paradigm'),
    providentia: projectHash('providentia'),
  }

  return (
    <div className="about-matrix">
      <p className="about-matrix__lede">{t('about.skills.lede')}</p>
      <div className="about-matrix__legend" aria-hidden="true">
        <span>
          <Mark kind="full" label="" /> {t('about.skills.legendFull')}
        </span>
      </div>

      <div className="about-matrix__table" role="table" aria-label={t('about.skills.title')}>
        <div className="about-matrix__head" role="row">
          <div role="columnheader" className="about-matrix__corner" />
          {MATRIX_COLS.map((col) => (
            <div key={col} role="columnheader" className="about-matrix__col">
              <a href={colHref[col]}>{t(`about.skills.cols.${col}`)}</a>
            </div>
          ))}
        </div>
        {MATRIX_ROWS.map((row) => (
          <div key={row.id} className="about-matrix__row" role="row">
            <div role="rowheader" className="about-matrix__name">
              {t(`about.skills.rows.${row.id}`)}
            </div>
            {MATRIX_COLS.map((col) => {
              const kind = row.marks[col] || null
              const skill = t(`about.skills.rows.${row.id}`)
              const source = t(`about.skills.cols.${col}`)
              const label = kind
                ? t('about.skills.markFull', { skill, source })
                : t('about.skills.markNone', { skill, source })
              return (
                <div key={col} role="cell" className="about-matrix__cell">
                  {kind ? (
                    <a href={colHref[col]} className="about-matrix__link">
                      <Mark kind={kind} label={label} />
                    </a>
                  ) : (
                    <Mark kind={null} label={label} />
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <ul className="about-matrix__notes">
        {t('about.skills.notes').map((note) => (
          <li key={note}>{note}</li>
        ))}
      </ul>
      <p className="about-matrix__rule">{t('about.skills.rule')}</p>
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

  return (
    <article className="ds-home ds-about-page">
      <AboutNav t={t} />

      <section id="about-profile" className="home-band about-hero" aria-labelledby="about-title">
        <div className="about-hero__grid">
          <div className="about-hero__copy">
            <p className="home-eyebrow">{t('about.profile.kicker')}</p>
            <h1 id="about-title" className="about-hero__title" tabIndex={-1}>
              <span>{t('about.profile.titleLead')}</span>{' '}
              <em>{t('about.profile.titleEm')}</em>
              {t('about.profile.titleAfter')}
            </h1>
            <p className="about-hero__lede">{t('about.profile.lede')}</p>
            <p className="about-hero__lede">{t('about.profile.lede2')}</p>
            <p className="about-hero__meta">{t('about.profile.english')}</p>
            <p className="about-hero__actions">
              <a className="home-btn" href={PROJECTS_HASH}>
                {t('about.profile.ctaProjects')} <span aria-hidden="true">→</span>
              </a>
              <a className="home-link" href={CV_HREF} download>
                {t('about.profile.ctaCv')}
              </a>
            </p>
          </div>
          <EvolutionRoute copy={t('about.route')} lazy={false} />
        </div>
      </section>

      <Seam />

      <div className="home-band home-paper about-paper">
        <section id="about-experience" className="about-block" aria-labelledby="about-experience-title">
          <div className="about-block__head">
            <span className="home-label home-label--ink" aria-hidden="true">
              01
            </span>
            <h2 id="about-experience-title" tabIndex={-1}>
              {t('about.experience.title')}
            </h2>
            <p className="about-block__hint">{t('about.path.legend')}</p>
          </div>
          <Trajectory t={t} />
        </section>

        <section id="about-skills" className="about-block" aria-labelledby="about-skills-title">
          <div className="about-block__head">
            <span className="home-label home-label--ink" aria-hidden="true">
              02
            </span>
            <h2 id="about-skills-title" tabIndex={-1}>
              {t('about.skills.title')}
            </h2>
          </div>
          <EvidenceMatrix t={t} />
        </section>

        <section id="about-method" className="about-block about-close" aria-labelledby="about-method-title">
          <h2 id="about-method-title" tabIndex={-1}>
            {t('about.method.title')}
          </h2>
          <p className="about-close__sequence">{t('about.method.sequence')}</p>
          <ol className="about-close__stages">
            {stages.map((stage) => (
              <li key={stage.title}>
                <strong>{stage.title}</strong>
                <p>{stage.body}</p>
              </li>
            ))}
          </ol>
          <p className="about-close__cta">
            <a className="home-btn" href={CONTACT_HASH}>
              {t('about.method.cta')} <span aria-hidden="true">→</span>
            </a>
          </p>
        </section>
      </div>
    </article>
  )
}
