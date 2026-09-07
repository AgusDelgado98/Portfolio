import React from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Extracted from Contact.jsx (Phase 1 — Destination Foundation, item 13:
 * "Separar Contact de las responsabilidades que hoy comparte con
 * About/Experience"). Same markup, same i18n keys (`contact.about*`,
 * `contact.experience*`) — Contact.jsx renders this unchanged on Home
 * (identical DOM/behavior), and components/About.jsx renders it as the
 * standalone `#about` destination. No content was invented for this split;
 * it was already real, bilingual copy living in Contact.jsx.
 */
export default function AboutProfile() {
  const { t } = useLanguage()

  const aboutFacts = [
    { icon: '📍', label: t('contact.aboutFacts.locationLabel'), value: t('contact.aboutFacts.locationValue') },
    { icon: '🎯', label: t('contact.aboutFacts.roleLabel'), value: t('contact.aboutFacts.roleValue') },
    { icon: '🏥', label: t('contact.aboutFacts.contextLabel'), value: t('contact.aboutFacts.contextValue') },
    { icon: '⚡', label: t('contact.aboutFacts.availabilityLabel'), value: t('contact.aboutFacts.availabilityValue') },
  ]

  const experienceJobs = t('contact.experienceJobs')
  const experienceList = Array.isArray(experienceJobs) ? experienceJobs : []

  return (
    <div className="about-card card card--spotlight fade-in fade-in-delay-2">
      <div className="profile-strip">
        <img
          src="/img/foto.jpg"
          alt={t('contact.profileAlt')}
          loading="lazy"
          decoding="async"
          width="160"
          height="160"
          style={{
            width: 'clamp(112px, 30vw, 160px)',
            height: 'clamp(112px, 30vw, 160px)',
            borderRadius: '999px',
            objectFit: 'cover',
            border: '2px solid rgba(34, 211, 238, 0.5)',
            boxShadow: '0 0 24px rgba(34, 211, 238, 0.15)',
          }}
        />
        <div>
          <h2 className="about-title">{t('contact.aboutTitle')}</h2>
          <p className="profile-note">{t('contact.aboutRole')}</p>
        </div>
      </div>

      <p className="about-text">{t('contact.aboutP1')}</p>
      <p className="about-text about-text--secondary">{t('contact.aboutP2')}</p>

      {experienceList.length > 0 && (
        <div className="about-experience">
          <h3 className="about-experience-title">{t('contact.experienceTitle')}</h3>
          <ol className="about-experience-list">
            {experienceList.map((job) => (
              <li key={`${job.role}-${job.org}`} className="about-experience-item">
                <div className="about-experience-head">
                  <strong className="about-experience-role">{job.role}</strong>
                  <span className="about-experience-org">{job.org}</span>
                  <span className="about-experience-meta">{job.meta}</span>
                </div>
                {Array.isArray(job.bullets) && job.bullets.length > 0 && (
                  <ul className="about-experience-bullets">
                    {job.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="about-divider" />

      <div className="about-facts">
        {aboutFacts.map((f) => (
          <div key={f.label} className="about-fact">
            <div className="about-fact-icon">{f.icon}</div>
            <span className="about-fact-label">{f.label}</span>
            <span className="about-fact-value">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
