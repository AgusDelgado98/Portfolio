import React from 'react'
import { CV_HREF } from '../i18n/config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { CASEWORK_HASH } from '../constants/links.js'

export default function Footer() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  const footerLinks = [
    { href: '#proyectos', label: t('footer.projects') },
    { href: CASEWORK_HASH, label: t('footer.engineeringLog') },
    { href: '#contacto', label: t('footer.contact') },
    {
      href: 'https://www.linkedin.com/in/agustin-delgado-data98615190/',
      label: t('footer.linkedin'),
      external: true,
    },
    { href: 'https://github.com/AgusDelgado98', label: t('footer.github'), external: true },
    { href: CV_HREF, label: t('footer.cv'), download: true },
    { href: 'mailto:augusto.delgado00@hotmail.com', label: t('footer.email') },
  ]

  return (
    <footer className="footer" id="legal">
      <div className="footer-ribbon" aria-hidden />
      <div className="footer-grid">
        <div className="footer-brand-block">
          <div className="footer-logo">AD</div>
          <div>
            <div className="footer-name">Agustín Delgado</div>
            <p className="footer-tagline">{t('footer.tagline')}</p>
          </div>
        </div>

        <nav className="footer-links" aria-label={t('footer.aria')}>
          {footerLinks.map((item) => (
            <a
              key={item.href + item.label}
              href={item.href}
              {...(item.download ? { download: true } : {})}
              {...(item.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="footer-legal">
        <p className="footer-disclaimer">{t('footer.disclaimer')}</p>
        <p className="footer-copy">{t('footer.copy', { year })}</p>
      </div>
    </footer>
  )
}
