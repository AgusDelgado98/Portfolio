import React from 'react'
import { CV_HREF } from '../i18n/config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from '../constants/links.js'

const EMAIL = 'mailto:augusto.delgado00@hotmail.com'

/**
 * `#contact` (F9): positioning narrative, target roles, and the four channels —
 * as type and lines, not boxes. No form.
 */
export default function ContactView() {
  const { t } = useLanguage()
  const roles = t('contact.roles')

  const channels = [
    { href: EMAIL, label: t('footer.email') },
    { href: LINKEDIN_URL, label: t('footer.linkedin'), external: true },
    { href: GITHUB_PROFILE_URL, label: t('footer.github'), external: true },
    { href: CV_HREF, label: t('contact.cv'), download: true },
  ]

  return (
    <article className="ds-contact-page">
      <header>
        <p className="ds-contact-kicker">{t('contact.pageTitle')}</p>
        <h1>{t('contact.headline')}</h1>
        <p className="ds-contact-lede">{t('contact.pageLede')}</p>
        <p className="ds-contact-status">
          {t('home.contact.location')} · {t('home.contact.availability')}
        </p>
        {Array.isArray(roles) && roles.length ? (
          <div className="ds-contact-roles">
            <h2 className="ds-contact-roles-title">{t('contact.rolesTitle')}</h2>
            <ul>
              {roles.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>

      <nav aria-label={t('contact.pointsTitle')}>
        <ul className="ds-contact-channels">
          {channels.map((channel) => (
            <li key={channel.href}>
              <a
                href={channel.href}
                {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                {...(channel.download ? { download: true } : {})}
              >
                <span className="ds-contact-label">{channel.label}</span>
                <span className="ds-contact-rule" aria-hidden="true" />
                <span className="ds-contact-arrow" aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  )
}
