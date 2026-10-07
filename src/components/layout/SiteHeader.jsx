import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CV_HREF } from '../../i18n/config.js'
import { HOME_HASH, PROJECTS_HASH, ABOUT_HASH, CONTACT_HASH } from '../../router/hashes.js'
import LanguageSwitch from './LanguageSwitch.jsx'
import MobileNav from './MobileNav.jsx'

/**
 * Global header — PLAN-FROZEN v1.1, sections 3 and 13 (F2).
 *
 *   AD | Projects · About · Contact | CV | ES/EN
 *
 * The logo/name returns to Home. `aria-current` follows the *resolved* route
 * (`currentView`, from App.jsx / router/resolveAppRoute.js), so it is right
 * however the visitor arrived — canonical hash or legacy alias. A project page
 * and a case study both keep "Projects" current.
 *
 * Under the layout breakpoint (see styles/shell.css) the inline links collapse
 * into <MobileNav>. This is an intermediate shell: it deliberately reuses the
 * current Atlas header classes so the site keeps its look until F3.
 */

// A resolved route `view` -> the nav link it belongs to.
const VIEW_TO_NAV_HASH = {
  projects: PROJECTS_HASH,
  'project-detail': PROJECTS_HASH,
  'project-case': PROJECTS_HASH,
  about: ABOUT_HASH,
  contact: CONTACT_HASH,
}

export default function SiteHeader({ currentView = 'home' }) {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuBtnRef = useRef(null)
  const currentNavHash = VIEW_TO_NAV_HASH[currentView] ?? null

  const navLinks = [
    { href: PROJECTS_HASH, label: t('nav.projects') },
    { href: ABOUT_HASH, label: t('nav.about') },
    { href: CONTACT_HASH, label: t('nav.contact') },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape closes the mobile menu and returns focus to its toggle.
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

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className="header-wrap site-header site-header--shell" role="banner">
      <div className={`header ${scrolled ? 'scrolled' : ''}`}>
        <a
          className="brand"
          href={HOME_HASH}
          aria-label={`Agustín Delgado — ${t('nav.home')}`}
          aria-current={currentView === 'home' ? 'page' : undefined}
        >
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
                aria-current={currentNavHash === link.href ? 'page' : undefined}
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="header-aside">
          <a className="header-cv" href={CV_HREF} download aria-label={t('footer.cv')}>
            {t('nav.cv')}
          </a>
          <LanguageSwitch />
        </div>

        <button
          ref={menuBtnRef}
          type="button"
          className={`menu-btn ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <MobileNav open={menuOpen} links={navLinks} currentNavHash={currentNavHash} onNavigate={closeMenu} />
    </header>
  )
}
