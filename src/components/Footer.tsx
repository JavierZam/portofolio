import { motion } from 'framer-motion'
import { Heart, Github, Linkedin, Mail } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'

export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">
              {PORTFOLIO.footer.text}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">
              © {PORTFOLIO.footer.year} {PORTFOLIO.fullName}. All rights reserved.
            </p>
          </motion.div>

          {/* Right: socials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-3"
          >
            {PORTFOLIO.socials.github && (
              <motion.a
                href={PORTFOLIO.socials.github}
                target="_blank"
                rel="noopener"
                className="p-2.5 rounded-xl glass text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                whileHover={{ scale: 1.1, y: -3 }}
              >
                <Github size={18} />
              </motion.a>
            )}
            {PORTFOLIO.socials.linkedin && (
              <motion.a
                href={PORTFOLIO.socials.linkedin}
                target="_blank"
                rel="noopener"
                className="p-2.5 rounded-xl glass text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                whileHover={{ scale: 1.1, y: -3 }}
              >
                <Linkedin size={18} />
              </motion.a>
            )}
            {PORTFOLIO.email && (
              <motion.a
                href={`mailto:${PORTFOLIO.email}`}
                className="p-2.5 rounded-xl glass text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                whileHover={{ scale: 1.1, y: -3 }}
              >
                <Mail size={18} />
              </motion.a>
            )}
          </motion.div>
        </div>

        {/* Made with love */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-xs text-[var(--color-text-muted)] flex items-center justify-center gap-1">
            Made with <Heart size={12} className="text-[var(--color-neon-pink)] fill-[var(--color-neon-pink)]" /> and too much mendoan
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
