import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CV_HREF } from '../../i18n/config.js'
import { HOME_HASH, PROJECTS_HASH, ABOUT_HASH, CONTACT_HASH } from '../../router/hashes.js'
import useCssVarHeight from '../../hooks/useCssVarHeight.js'
import useModalMenu from '../../hooks/useModalMenu.js'
import BrandMark from './BrandMark.jsx'
import LanguageSwitch from './LanguageSwitch.jsx'
import MobileNav from './MobileNav.jsx'
import ScrollProgress from './ScrollProgress.jsx'

/**
 * Global header — "Superficie de decisión" (F3).
 *
 *   monogram + A. DELGADO | Inicio · Proyectos · Sobre mí · Contacto | CV  ES / EN
 *   ──────────────────────────── reading-progress hairline ────────────────────
 *
 * The brand returns to Home. `aria-current` follows the *resolved* route
 * (`currentView`, from App.jsx / router/resolveAppRoute.js), so it is right
 * however the visitor arrived — canonical hash or legacy alias. A project page
 * and a case study both keep "Projects" current.
 *
 * Under 800px the inline links collapse into <MobileNav>, a full-screen menu.
 * Its behavior (Escape, focus trap, scroll lock, closing on route change) is
 * in hooks/useModalMenu.js. The link list is data: a project that becomes
 * public appears in the menu's project list without touching this file.
 *
 * The header is rendered full-bleed so its hairline and progress bar span the
 * viewport; `.site-header__inner` keeps the content on the page's column.
 */

// A resolved route `view` -> the nav link it belongs to.
const VIEW_TO_NAV_HASH = {
  home: HOME_HASH,
  projects: PROJECTS_HASH,
  'project-detail': PROJECTS_HASH,
  'project-case': PROJECTS_HASH,
  about: ABOUT_HASH,
  contact: CONTACT_HASH,
}

export default function SiteHeader({ currentView = 'home' }) {
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuBtnRef = useRef(null)
  const headerRef = useRef(null)
  const currentNavHash = VIEW_TO_NAV_HASH[currentView] ?? null

  // One source for every sticky top / scroll margin below the header.
  useCssVarHeight(headerRef, '--site-header-h')

  const navLinks = [
    { href: HOME_HASH, label: t('nav.home') },
    { href: PROJECTS_HASH, label: t('nav.projects') },
    { href: ABOUT_HASH, label: t('nav.about') },
    { href: CONTACT_HASH, label: t('nav.contact') },
  ]

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  // Escape closes the menu and returns focus to its toggle; Tab stays inside
  // the header; the page behind is inert and does not scroll.
  useModalMenu({
    open: menuOpen,
    containerRef: headerRef,
    toggleRef: menuBtnRef,
    onClose: closeMenu,
  })

  return (
    <header
      ref={headerRef}
      className={`header-wrap site-header site-header--shell${menuOpen ? ' is-menu-open' : ''}`}
      role="banner"
    >
      <div className="shell site-header__inner">
        <div className="header">
          <a
            className="brand"
            href={HOME_HASH}
            aria-current={currentView === 'home' ? 'page' : undefined}
          >
            <BrandMark />
            <span className="brand-word">A. Delgado</span>
            <span className="ds-visually-hidden"> — {t('nav.home')}</span>
          </a>

          <nav className="nav-rail" aria-label={t('nav.primaryAria')}>
            <div className="nav">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={currentNavHash === link.href ? 'page' : undefined}
                  onFocus={link.href === ABOUT_HASH ? () => import('../About.jsx') : undefined}
                  onPointerEnter={link.href === ABOUT_HASH ? () => import('../About.jsx') : undefined}
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
          </button>
        </div>
      </div>

      <ScrollProgress />
      <MobileNav open={menuOpen} links={navLinks} currentNavHash={currentNavHash} onNavigate={closeMenu} />
    </header>
  )
}
