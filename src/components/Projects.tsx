import { motion } from 'framer-motion'
import { ExternalLink, Github, Star } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function Projects() {
  const { projects } = PORTFOLIO
  const featured = projects.items.filter((p) => p.featured)
  const others = projects.items.filter((p) => !p.featured)

  return (
    <section id="projects" className="section-padding animated-gradient">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={cardVariants} className="mb-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="text-[var(--color-accent-light)] font-mono text-lg md:text-xl block mb-1">
                {'// '}03
              </span>
              {projects.title}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base">
              {projects.subtitle}
            </p>
          </motion.div>

          {/* Featured projects (large cards) */}
          <div className="grid md:grid-cols-2 gap-6 mt-12 mb-8">
            {featured.map((project, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                className="glass rounded-2xl overflow-hidden group hover:glow-border transition-all"
              >
                {/* Image placeholder / gradient header */}
                <div className="relative h-40 bg-gradient-to-br from-[var(--color-accent)] via-[var(--color-bg-card)] to-[var(--color-neon-cyan)] opacity-30 group-hover:opacity-50 transition-opacity">
                  <div className="absolute top-4 right-4 flex items-center gap-1 bg-[var(--color-bg-primary)] bg-opacity-80 rounded-full px-3 py-1 text-xs font-mono text-[var(--color-neon-yellow)]">
                    <Star size={12} /> Featured
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <motion.a
                        href={project.github}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <Github size={16} /> Code
                      </motion.a>
                    )}
                    {project.demo && (
                      <motion.a
                        href={project.demo}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors"
                        whileHover={{ x: 3 }}
                      >
                        <ExternalLink size={16} /> Demo
                      </motion.a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Other projects (smaller cards) */}
          {others.length > 0 && (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {others.map((project, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  className="glass rounded-xl p-5 hover:glow-border transition-all group"
                  whileHover={{ y: -5 }}
                >
                  <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-2 group-hover:text-[var(--color-accent-light)] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded text-[10px] font-mono bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener"
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                      >
                        <Github size={14} />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener"
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-neon-cyan)] transition-colors"
                      >
                        <ExternalLink size={14} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
