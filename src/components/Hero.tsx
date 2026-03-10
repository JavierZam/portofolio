import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, MapPin } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'
import TerminalDisplay from './TerminalDisplay'

export default function Hero() {
  const [factIndex, setFactIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % PORTFOLIO.hero.funFacts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center section-padding overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 60, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--color-accent)] opacity-[0.07] blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 60, 0],
            y: [0, 100, -50, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--color-neon-cyan)] opacity-[0.05] blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, -80, 0],
            y: [0, -50, 80, 0],
          }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-[var(--color-neon-pink)] opacity-[0.04] blur-3xl"
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-[var(--color-accent-light)] mb-6 font-mono">
            <MapPin size={14} className="inline mr-1.5 -mt-0.5" />
            {PORTFOLIO.location}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
        >
          <span className="text-[var(--color-text-secondary)] text-3xl md:text-4xl lg:text-5xl block mb-2">
            {PORTFOLIO.hero.greeting}
          </span>
          <span className="glow-text text-[var(--color-text-primary)]">
            {PORTFOLIO.fullName}
          </span>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
            className="text-[var(--color-accent)] ml-1"
          >
            _
          </motion.span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-[var(--color-text-secondary)] text-base md:text-lg max-w-2xl mx-auto mb-4 leading-relaxed"
        >
          {PORTFOLIO.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-[var(--color-text-muted)] text-sm md:text-base max-w-xl mx-auto mb-8 leading-relaxed"
        >
          {PORTFOLIO.hero.description}
        </motion.p>

        {/* Rotating fun facts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mb-10 h-8"
        >
          <motion.p
            key={factIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-sm font-mono text-[var(--color-neon-green)]"
          >
            {PORTFOLIO.hero.funFacts[factIndex]}
          </motion.p>
        </motion.div>

        {/* CTA + Socials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a
            href="#projects"
            className="px-8 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-light)] transition-colors glow-box"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            {PORTFOLIO.hero.cta}
          </motion.a>

          <div className="flex items-center gap-3">
            {PORTFOLIO.socials.github && (
              <motion.a
                href={PORTFOLIO.socials.github}
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-xl glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm font-mono"
                whileHover={{ scale: 1.05 }}
              >
                GitHub
              </motion.a>
            )}
            {PORTFOLIO.socials.linkedin && (
              <motion.a
                href={PORTFOLIO.socials.linkedin}
                target="_blank"
                rel="noopener"
                className="px-5 py-3 rounded-xl glass text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors text-sm font-mono"
                whileHover={{ scale: 1.05 }}
              >
                LinkedIn
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* Terminal Boot Sequence */}
        <div className="flex justify-center mt-8">
          <TerminalDisplay lines={PORTFOLIO.hero.terminalLines} />
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={24} className="text-[var(--color-text-muted)]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
