import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Clock, X, ExternalLink } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'

interface SecretGamingProps {
  isOpen: boolean
  onClose: () => void
}

export default function SecretGaming({ isOpen, onClose }: SecretGamingProps) {
  const { gaming } = PORTFOLIO

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass-strong rounded-3xl p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto pointer-events-auto relative border border-[var(--color-neon-green)]/30 shadow-[0_0_60px_var(--color-neon-green)20]">
              {/* Close button */}
              <motion.button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-card)] transition-colors"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} />
              </motion.button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--color-neon-green)] glow-text mb-2">
                  {gaming.title}
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {gaming.subtitle}
                </p>
                <p className="text-xs text-[var(--color-accent-light)] font-mono mt-2">
                  {gaming.gamertags}
                </p>
              </motion.div>

              {/* Rank Cards */}
              <div className="space-y-4">
                {gaming.ranks.map((rank, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="glass rounded-2xl p-5 hover:border-[var(--color-neon-green)]/30 transition-all group"
                    whileHover={{ x: 5 }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Game image */}
                      <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-[var(--color-bg-secondary)] flex items-center justify-center">
                        <img
                          src={rank.image}
                          alt={rank.game}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback: show first letter if image not found
                            const target = e.currentTarget
                            target.style.display = 'none'
                            const parent = target.parentElement
                            if (parent && !parent.querySelector('span')) {
                              const fallback = document.createElement('span')
                              fallback.className = 'text-lg font-bold text-[var(--color-accent-light)]'
                              fallback.textContent = rank.game.charAt(0)
                              parent.appendChild(fallback)
                            }
                          }}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                          <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                            {rank.game}
                          </h3>
                          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] border border-[var(--color-neon-green)]/20">
                            {rank.rank}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-3 text-xs text-[var(--color-text-muted)] mb-2">
                          <span className="flex items-center gap-1">
                            <Trophy size={12} className="text-[var(--color-neon-yellow)]" />
                            Peak: {rank.peak}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={12} className="text-[var(--color-neon-cyan)]" />
                            {rank.hours}
                          </span>
                        </div>

                        <p className="text-xs text-[var(--color-text-secondary)] italic mb-1">
                          "{rank.note}"
                        </p>
                        <p className="text-[10px] font-mono text-[var(--color-text-muted)]">
                          {rank.account}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Steam Links */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 flex flex-wrap gap-3 justify-center"
              >
                {gaming.steamLinks.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors"
                  >
                    <ExternalLink size={12} />
                    {link.label}
                  </a>
                ))}
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="text-center text-xs text-[var(--color-text-muted)] mt-6 font-mono"
              >
                this section doesn't exist on my resume
              </motion.p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
