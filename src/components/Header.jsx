import React, { useState, useEffect } from 'react'
import { ENGINEERING_LOG_HASH } from '../constants/links.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const activeHrefByPlate = {
  '01': '#proyectos',
  '02': '#enfoque',
  '03': '#stack',
  '04': '#stack',
  '05': '#contacto',
}

function LanguageSwitch({ onSelect }) {
  const { language, setLanguage, t } = useLanguage()

  return (
    <div className="lang-switch" role="group" aria-label={t('lang.switchAria')}>
      <button
        type="button"
        className={language === 'es' ? 'is-active' : undefined}
        aria-pressed={language === 'es'}
        onClick={() => {
          setLanguage('es')
          onSelect?.()
        }}
      >
        {t('lang.es')}
      </button>
      <span aria-hidden>|</span>
      <button
        type="button"
        className={language === 'en' ? 'is-active' : undefined}
        aria-pressed={language === 'en'}
        onClick={() => {
          setLanguage('en')
          onSelect?.()
        }}
      >
        {t('lang.en')}
      </button>
    </div>
  )
}

export default function Header({ activePlate = '00', view = 'atlas', children }) {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const onLog = view === 'log'

  const navLinks = [
    { href: '#proyectos', label: t('nav.projects') },
    { href: '#enfoque', label: t('nav.approach') },
    { href: '#stack', label: t('nav.stack') },
    { href: '#contacto', label: t('nav.contact') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = () => setMenuOpen(false)

  return (
    <header className="header-wrap site-header" role="banner">
      <div className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#portada">
          <div className="brand-logo brand-spotlight">AD</div>
          <div className="brand-text">
            <div className="brand-name safe-text-render">Agustín Delgado</div>
            <div className="brand-role">{t('nav.brandRole')}</div>
          </div>
        </a>

        <nav className="nav-rail" aria-label={t('nav.primaryAria')}>
          <div className="nav">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                aria-current={
                  !onLog && activeHrefByPlate[activePlate] === link.href ? 'location' : undefined
                }
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="header-aside">
          <LanguageSwitch />
          <a
            className="header-elog-link"
            href={ENGINEERING_LOG_HASH}
            aria-current={onLog ? 'page' : undefined}
            onClick={handleNavClick}
          >
            {t('nav.engineeringLog')}
          </a>
          <div className="header-status">
            <span className="live-dot" />
            {t('nav.available')}
          </div>
        </div>

        <button
          type="button"
          className={`menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {children}

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        aria-label={t('nav.mobileAria')}
      >
        <div className="mobile-nav-lang">
          <LanguageSwitch onSelect={handleNavClick} />
        </div>
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={
              !onLog && activeHrefByPlate[activePlate] === link.href ? 'location' : undefined
            }
            onClick={handleNavClick}
          >
            {link.label}
          </a>
        ))}
        <a
          href={ENGINEERING_LOG_HASH}
          aria-current={onLog ? 'page' : undefined}
          onClick={handleNavClick}
        >
          {t('nav.engineeringLog')}
        </a>
      </nav>
    </header>
  )
}
