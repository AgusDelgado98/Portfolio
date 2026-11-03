import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { loadAbout } from './aboutLoad.js'

async function boot() {
  // Cold `#about`: finish the About chunk (JS + its CSS) before the first paint
  // so Suspense never swaps a short shell for the full page (F11 CLS ~0.96).
  if (/^#about(?:\/|$)/i.test(window.location.hash || '')) {
    await loadAbout()
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </React.StrictMode>,
  )
}

boot()
