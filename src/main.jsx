import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import App from './App.jsx'
import { identity } from './data/content'

// Easter egg for the devs who look under the hood
console.log(
  '%c TEJ.EXE %c curiosity detected. that’s the whole brand. say hi → ' + identity.email,
  'background:#C8F04B;color:#0E0E0C;font-weight:bold;padding:4px 8px;border-radius:2px;',
  'color:#C8F04B;padding:4px 0;',
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
