import React from 'react'
import { ENGINEERING_LOG_HASH } from '../constants/links.js'
import { CV_HREF } from '../i18n/config.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const territoryCodes = [
  { number: '01', code: 'INT' },
  { number: '02', code: 'DAT' },
  { number: '03', code: 'OPS' },
]

function AccessLink({ link }) {
  const className = [
    'atlas-access',
    link.primary ? 'atlas-access--primary' : '',
    link.featured ? 'atlas-access--log' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <a
      className={className}
      href={link.href}
      {...(link.download ? { download: true } : {})}
      {...(link.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
    >
      <span>{link.label}</span>
      <span aria-hidden>↗</span>
    </a>
  )
}

export default function Hero() {
  const { t } = useLanguage()

  const primaryActions = [
    { label: t('hero.exploreAtlas'), href: '#proyectos', primary: true },
    { label: t('hero.engineeringLog'), href: ENGINEERING_LOG_HASH, featured: true },
  ]

  const secondaryActions = [
    { label: t('hero.cv'), href: CV_HREF, download: true },
    { label: t('hero.github'), href: 'https://github.com/AgusDelgado98', external: true },
    {
      label: t('hero.linkedin'),
      href: 'https://www.linkedin.com/in/agustin-delgado-data98615190/',
      external: true,
    },
  ]

  return (
    <section className="hero-section" id="portada" aria-labelledby="hero-title">
      <article className="hero-atlas-frame fade-in">
        <header className="hero-atlas-meta" aria-label={t('hero.legendAria')}>
          <span>{t('hero.atlas')}</span>
          <span>{t('hero.plateMeta')}</span>
          <span>{t('hero.coords')}</span>
        </header>

        <div className="hero-atlas-grid">
          <div className="hero-atlas-primary">
            <p className="hero-atlas-kicker">{t('hero.kicker')}</p>
            <h1 className="hero-atlas-name" id="hero-title">
              <span>Agustín</span>
              <span className="hero-atlas-surname">Delgado</span>
            </h1>
            <p className="hero-atlas-positioning">{t('hero.positioning')}</p>
            <p className="hero-atlas-experience">{t('hero.experience')}</p>

            <nav className="hero-atlas-actions" aria-label={t('hero.actionsAria')}>
              <div className="hero-atlas-actions-row hero-atlas-actions-row--primary">
                {primaryActions.map((link) => (
                  <AccessLink key={link.label} link={link} />
                ))}
              </div>
              <div className="hero-atlas-actions-row hero-atlas-actions-row--secondary">
                {secondaryActions.map((link) => (
                  <AccessLink key={link.label} link={link} />
                ))}
              </div>
            </nav>
          </div>

          <aside className="hero-territories" aria-labelledby="territories-title">
            <div className="hero-territories-heading">
              <span className="hero-territories-coordinate">{t('hero.territoriesCoord')}</span>
              <h2 id="territories-title">{t('hero.territoriesTitle')}</h2>
            </div>
            <ol className="hero-territories-list">
              {territoryCodes.map((territory) => (
                <li key={territory.code} className="hero-territory">
                  <span className="hero-territory-number">{territory.number}</span>
                  <div className="hero-territory-copy">
                    <div className="hero-territory-title-row">
                      <h3>{t(`hero.territories.${territory.code}.name`)}</h3>
                      <span>{territory.code}</span>
                    </div>
                    <p>{t(`hero.territories.${territory.code}.note`)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <footer className="hero-atlas-legend" aria-label={t('hero.legendAria')}>
          <span>
            <i aria-hidden /> {t('hero.legendFlow')}
          </span>
          <span>{t('hero.legendEdition')}</span>
        </footer>
      </article>
    </section>
  )
}
