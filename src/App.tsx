import { useState, useCallback } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Projects from './components/Projects'
import SecretGaming from './components/SecretGaming'
import Guestbook from './components/Guestbook'
import Footer from './components/Footer'

export default function App() {
  const [secretClickCount, setSecretClickCount] = useState(0)
  const [gamingOpen, setGamingOpen] = useState(false)

  const handleSecretClick = useCallback(() => {
    setSecretClickCount((prev) => {
      const next = prev + 1
      if (next >= 5) {
        setGamingOpen(true)
        return 0
      }
      return next
    })
  }, [])

  return (
    <div className="noise animated-gradient min-h-screen">
      <Navbar onSecretClick={handleSecretClick} secretClickCount={secretClickCount} />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Guestbook />
      <Footer />
      <SecretGaming isOpen={gamingOpen} onClose={() => setGamingOpen(false)} />
    </div>
  )
}
