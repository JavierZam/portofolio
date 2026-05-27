import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import GamesHub from './pages/GamesHub.tsx'
import ArrowDancePage from './pages/ArrowDancePage.tsx'
import NbaHofPage from './pages/NbaHofPage.tsx'
import BugRaidPage from './pages/BugRaidPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/games" element={<GamesHub />} />
        <Route path="/games/arrow-dance" element={<ArrowDancePage />} />
        <Route path="/nba" element={<NbaHofPage />} />
        <Route path="/games/bug-raid" element={<BugRaidPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
