import React, { useEffect, useRef } from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CV_HREF } from '../../i18n/config.js'
import { ABOUT_HASH, PROJECTS_HASH, projectHash } from '../../router/hashes.js'
import { getComplementaryProjectIds, getProjectEntry, getSpotlightProjectIds } from '../../projects/registry.js'
import LanguageSwitch from './LanguageSwitch.jsx'
import { loadAbout } from '../../aboutLoad.js'

/**
 * Full-screen menu for narrow viewports — "Superficie de decisión" (F3).
 *
 * It covers the viewport under the header bar, which stays on top with the
 * brand and the close button. The same four destinations as the desktop
 * header, large, in the display face; the main projects nested under
 * "Projects" with their number; the complementary one last and quieter; the
 * language switch and the CV download at the bottom. Nothing depends on hover.
 *
 * The nested projects come from the registry's presentation lists, which only
 * hold published projects. A withheld project cannot appear here, and one that
 * is published later shows up without a change to this component.
 *
 * Focus, Escape, scroll lock and closing on route change live in
 * hooks/useModalMenu.js (called by SiteHeader). Opening moves focus to the
 * first item. The panel fades in and out; the fade is removed under
 * `prefers-reduced-motion` (styles/shell.css).
 */
export default function MobileNav({ open, links, currentNavHash, onNavigate }) {
  const { t } = useLanguage()
  const navRef = useRef(null)
  const spotlightIds = getSpotlightProjectIds()
  const complementaryIds = getComplementaryProjectIds()

  useEffect(() => {
    if (open) navRef.current?.querySelector('a')?.focus({ preventScroll: true })
  }, [open])

  return (
    <nav
      ref={navRef}
      id="mobile-navigation"
      className={`mobile-nav ${open ? 'open' : ''}`}
      aria-label={t('nav.mobileAria')}
    >
      <ul className="mobile-nav-list">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              aria-current={currentNavHash === link.href ? 'page' : undefined}
              onClick={onNavigate}
              onFocus={link.href === ABOUT_HASH ? () => loadAbout() : undefined}
              onPointerEnter={link.href === ABOUT_HASH ? () => loadAbout() : undefined}
            >
              {link.label}
            </a>
            {link.href === PROJECTS_HASH && (spotlightIds.length > 0 || complementaryIds.length > 0) && (
              <ul className="mobile-nav-sub" aria-label={t('nav.projectsListAria')}>
                {spotlightIds.map((id, index) => (
                  <li key={id}>
                    <a href={projectHash(id)} onClick={onNavigate}>
                      <span className="mobile-nav-index" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="mobile-nav-project">{getProjectEntry(id)?.title}</span>
                    </a>
                  </li>
                ))}
                {complementaryIds.map((id) => (
                  <li key={id} className="is-complementary">
                    <a href={projectHash(id)} onClick={onNavigate}>
                      <span className="mobile-nav-index" aria-hidden="true">
                        +
                      </span>
                      <span>
                        <span className="mobile-nav-project">{getProjectEntry(id)?.title}</span>
                        <span className="mobile-nav-note">· {t('nav.complementary')}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <div className="mobile-nav-foot">
        <LanguageSwitch onSelect={onNavigate} />
        <a className="mobile-nav-cv" href={CV_HREF} download onClick={onNavigate}>
          {t('footer.cv')}
        </a>
      </div>
    </nav>
  )
}
