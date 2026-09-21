import React, { useState, useEffect, useRef } from 'react'
import { CASEWORK_HASH } from '../constants/links.js'
import { useLanguage } from '../i18n/LanguageContext.jsx'
import { useGuide } from '../guide/GuideContext.jsx'
import { GUIDE_INTENTS, VALID_INTENTS } from '../guide/intents.js'

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
  'casework-archive': CASEWORK_HASH,
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

/**
 * "Vista: X · Cambiar" — Guided Portfolio Experience v0.2.
 *
 * Persistent, global, never a modal. Two different expansion shapes by
 * viewport, both reusing the same label/button and the same
 * `chooseIntent` — never a dialog, never an overlay that covers other
 * header content:
 *   - Desktop: "Cambiar" expands `GuideViewBar`, a compact sub-bar that
 *     renders as part of the page layout right below the header row (see
 *     Header's own `guideBarOpen` state) — it pushes content down, it
 *     never floats over the nav links or Contacto.
 *   - Mobile: "Cambiar" expands an inline picker inside the already-open
 *     hamburger panel (`GuideViewControl` below), unchanged from before.
 *
 * Always rendered — even before any explicit choice, `intent` is `null`
 * and displayed as `default` ("Exploración libre") purely as a label; that
 * display never itself persists anything (only picking an option calls
 * `chooseIntent`), so it doesn't violate "nunca persistir default por
 * simple impresión".
 */
function GuideViewLabel({ open, onToggle, buttonRef }) {
  const { t } = useLanguage()
  const { intent } = useGuide()
  const displayIntent = intent ?? GUIDE_INTENTS.DEFAULT

  return (
    <div className="guide-view-control">
      <span className="guide-view-control-label">
        {t('guide.header.prefix')}: {t(`guide.header.values.${displayIntent}`)}
      </span>
      <button
        ref={buttonRef}
        type="button"
        className="guide-view-control-change"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="guide-view-bar"
        onClick={onToggle}
      >
        {t('guide.header.change')}
      </button>
    </div>
  )
}

/**
 * Desktop-only sub-bar (see GuideViewLabel above): a normal-flow row below
 * the header, not an absolutely-positioned dropdown — it cannot overlap
 * `.nav-rail`/`.header-aside` because it isn't stacked over them, it's laid
 * out after them. Closes on Escape, on an outside click, on picking an
 * option, or on its own "Cerrar" — never navigates, so the current route
 * (Home or anywhere else) is untouched.
 */
function GuideViewBar({ onClose, triggerRef }) {
  const { t } = useLanguage()
  const { intent, chooseIntent } = useGuide()
  const barRef = useRef(null)
  const displayIntent = intent ?? GUIDE_INTENTS.DEFAULT

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    const onPointerDown = (event) => {
      const inBar = barRef.current?.contains(event.target)
      const inTrigger = triggerRef.current?.contains(event.target)
      if (!inBar && !inTrigger) onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [onClose, triggerRef])

  const handlePick = (next) => {
    chooseIntent(next)
    onClose()
  }

  return (
    <div id="guide-view-bar" className="guide-view-bar" role="menu" aria-label={t('guide.header.changeAria')} ref={barRef}>
      <div className="guide-view-bar-options">
        {VALID_INTENTS.map((value) => (
          <button
            key={value}
            type="button"
            role="menuitemradio"
            aria-checked={displayIntent === value}
            className={`guide-view-bar-option${displayIntent === value ? ' is-active' : ''}`}
            onClick={() => handlePick(value)}
          >
            {t(`guide.header.values.${value}`)}
          </button>
        ))}
      </div>
      <button type="button" className="guide-view-bar-close" onClick={onClose}>
        {t('guide.header.close')}
      </button>
    </div>
  )
}

/** Mobile-only: the inline picker inside the hamburger panel — unchanged. */
function GuideViewControl({ onChange }) {
  const { t } = useLanguage()
  const { intent, chooseIntent } = useGuide()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const displayIntent = intent ?? GUIDE_INTENTS.DEFAULT

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }
    const onPointerDown = (event) => {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const handlePick = (next) => {
    chooseIntent(next)
    setOpen(false)
    onChange?.()
  }

  return (
    <div className="guide-view-control" ref={wrapRef}>
      <span className="guide-view-control-label">
        {t('guide.header.prefix')}: {t(`guide.header.values.${displayIntent}`)}
      </span>
      <button
        type="button"
        className="guide-view-control-change"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {t('guide.header.change')}
      </button>
      {open ? (
        <div className="guide-view-picker" role="menu" aria-label={t('guide.header.changeAria')}>
          {VALID_INTENTS.map((value) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={displayIntent === value}
              className={`guide-view-picker-option${displayIntent === value ? ' is-active' : ''}`}
              onClick={() => handlePick(value)}
            >
              {t(`guide.header.values.${value}`)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default function Header({ currentView = 'home' }) {
  const { t } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [guideBarOpen, setGuideBarOpen] = useState(false)
  const menuBtnRef = useRef(null)
  const guideTriggerRef = useRef(null)
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
          <GuideViewLabel
            open={guideBarOpen}
            onToggle={() => setGuideBarOpen((current) => !current)}
            buttonRef={guideTriggerRef}
          />
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

      {/* Desktop-only sub-bar — part of the header's own layout (a normal
          sibling row inside this sticky header-wrap), never an overlay over
          .nav-rail/.header-aside. Hidden on mobile widths via CSS; mobile
          keeps its own inline picker inside the hamburger panel below. */}
      {guideBarOpen ? <GuideViewBar onClose={() => setGuideBarOpen(false)} triggerRef={guideTriggerRef} /> : null}

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${menuOpen ? 'open' : ''}`}
        aria-label={t('nav.mobileAria')}
      >
        <div className="mobile-nav-guide">
          <GuideViewControl onChange={handleNavClick} />
        </div>
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
