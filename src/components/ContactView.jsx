import React from 'react'
import { CV_HREF } from '../i18n/config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { GITHUB_PROFILE_URL, LINKEDIN_URL } from '../constants/links.js'

const EMAIL = 'mailto:augusto.delgado00@hotmail.com'

/**
 * `#contact`: where, when, and the four real channels — as type and lines, not
 * boxes. Each channel is one row: its name, a rule that extends on hover or
 * focus, and an arrow. No form, no extra channels.
 */
export default function ContactView() {
  const { t } = useLanguage()

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
        <p className="ds-contact-status">
          {t('home.contact.location')} · {t('home.contact.availability')}
        </p>
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
