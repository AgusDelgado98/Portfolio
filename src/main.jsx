import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext.jsx'
import { GuideProvider } from './guide/GuideContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <GuideProvider>
        <App />
      </GuideProvider>
    </LanguageProvider>
  </React.StrictMode>,
)
