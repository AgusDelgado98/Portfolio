import React, { useState, useEffect, useRef } from 'react'
import { CASEWORK_HASH } from '../constants/links.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'

/**
 * Global click-first navigation — Phase 2 (Home Hub), item 10.
 *
 * Replaces the old scroll-spy nav (which highlighted a link based on
 * `activePlate`, driven by AtlasProgress's IntersectionObserver over Home
 * sections that no longer exist). Now a persistent set of links to every
 * destination, with `aria-current` driven by the actual resolved route
 * (`currentView`, from App.jsx/resolveAppRoute.js) — works identically
 * regardless of which hash (canonical or legacy alias) got you there.
 *
 * Data & BI keeps a visually heavier treatment (`nav-link--primary`);
 * Operations reads deliberately lighter (`nav-link--secondary`) — visible,
 * legitimate, explicit, but not equal-weight (item 1/7 of the brief).
 */

// Maps a resolved route `view` to the nav link it corresponds to, so
// aria-current is correct however the user got there (canonical hash or a
// legacy alias — e.g. #enfoque and #about both mean "about" here).
const VIEW_TO_NAV_HASH = {
  home: '#home',
  'data-bi': '#data-bi',
  operations: '#operations',
  projects: '#projects',
  'project-detail': '#projects',
  'casework-index': CASEWORK_HASH,
  'casework-detail': CASEWORK_HASH,
  about: '#about',
  contact: '#contact',
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

export default function Header({ currentView = 'home' }) {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuBtnRef = useRef(null)
  const currentNavHash = VIEW_TO_NAV_HASH[currentView] ?? null

  const navLinks = [
    { href: '#home', label: t('nav.home') },
    { href: '#data-bi', label: t('nav.dataBi'), primary: true },
    { href: '#operations', label: t('nav.operations'), secondary: true },
    { href: '#projects', label: t('nav.projects') },
    { href: CASEWORK_HASH, label: t('nav.engineeringLog') },
    { href: '#about', label: t('nav.about') },
    { href: '#contact', label: t('nav.contact') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Mobile menu: Escape closes it and returns focus to the toggle button —
  // the existing click-a-link-to-close (handleNavClick) already covered
  // "close on selecting a destination".
  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuBtnRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const handleNavClick = () => setMenuOpen(false)

  const navLinkClassName = (link) =>
    ['nav-link', link.primary ? 'nav-link--primary' : '', link.secondary ? 'nav-link--secondary' : '']
      .filter(Boolean)
      .join(' ')

  return (
    <header className="header-wrap site-header" role="banner">
      <div className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a className="brand" href="#home">
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
                className={navLinkClassName(link)}
                aria-current={currentNavHash === link.href ? 'page' : undefined}
                onClick={handleNavClick}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="header-aside">
          <LanguageSwitch />
          <div className="header-status">
            <span className="live-dot" />
            {t('nav.available')}
          </div>
        </div>

        <button
          ref={menuBtnRef}
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
            className={navLinkClassName(link)}
            aria-current={currentNavHash === link.href ? 'page' : undefined}
            onClick={handleNavClick}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
