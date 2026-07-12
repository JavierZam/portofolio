import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Gamepad2 } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Guestbook', href: '#guestbook' },
]

interface NavbarProps {
  onSecretClick: () => void
  secretClickCount: number
}

export default function Navbar({ onSecretClick, secretClickCount }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? 'glass-strong shadow-lg shadow-[var(--color-accent-glow)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="text-xl font-bold tracking-tight"
          whileHover={{ scale: 1.05 }}
        >
          <span className="text-[var(--color-accent-light)]">{'<'}</span>
          <span className="text-[var(--color-text-primary)]">{PORTFOLIO.name}</span>
          <span className="text-[var(--color-accent-light)]">{' />'}</span>
        </motion.a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <motion.a
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-bg-card)] transition-colors"
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              {item.label}
            </motion.a>
          ))}

          {/* Secret Gamepad Icon */}
          <motion.button
            onClick={onSecretClick}
            className="ml-3 p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-neon-green)] transition-colors relative"
            whileHover={{ scale: 1.2, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            title="👀"
          >
            <Gamepad2 size={18} />
            {secretClickCount > 0 && secretClickCount < 5 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[var(--color-accent)] text-[10px] flex items-center justify-center text-white font-bold"
              >
                {secretClickCount}
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[var(--color-text-secondary)]"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-strong border-t border-[var(--color-border)]"
          >
            <div className="px-6 py-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] transition-colors"
                >
                  {item.label}
                </a>
              ))}
              <button
                onClick={() => { onSecretClick(); setMobileOpen(false) }}
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-neon-green)] transition-colors w-full"
              >
                <Gamepad2 size={18} /> <span className="text-sm">???</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
