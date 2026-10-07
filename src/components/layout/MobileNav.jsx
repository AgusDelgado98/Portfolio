import React from 'react'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import { CV_HREF } from '../../i18n/config.js'
import LanguageSwitch from './LanguageSwitch.jsx'

/**
 * Narrow-viewport menu — PLAN-FROZEN v1.1, section 13 (F2).
 *
 * The same five things the desktop header shows (Projects · About · Contact ·
 * CV · ES/EN), stacked in a panel under the header bar. Nothing depends on
 * hover: it opens from a real <button> (SiteHeader) and every item is a plain
 * link or button with a 44px target. Closes on selecting a link, on choosing a
 * language, and on Escape (handled by SiteHeader, which also returns focus to
 * the toggle).
 */
export default function MobileNav({ open, links, currentNavHash, onNavigate }) {
  const { t } = useLanguage()

  return (
    <nav
      id="mobile-navigation"
      className={`mobile-nav ${open ? 'open' : ''}`}
      aria-label={t('nav.mobileAria')}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          aria-current={currentNavHash === link.href ? 'page' : undefined}
          onClick={onNavigate}
        >
          {link.label}
        </a>
      ))}
      <a href={CV_HREF} download aria-label={t('footer.cv')} onClick={onNavigate}>
        {t('nav.cv')}
      </a>
      <div className="mobile-nav-lang">
        <LanguageSwitch onSelect={onNavigate} />
      </div>
    </nav>
  )
}
