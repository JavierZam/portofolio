import { motion } from 'framer-motion'
import { PORTFOLIO } from '../config/portfolio'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export default function About() {
  const { about } = PORTFOLIO

  return (
    <section id="about" className="section-padding animated-gradient">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="text-[var(--color-accent-light)] font-mono text-lg md:text-xl block mb-1">
                {'// '}01
              </span>
              {about.title}
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Bio */}
            <motion.div variants={itemVariants}>
              {about.bio.split('\n\n').map((paragraph, i) => (
                <p
                  key={i}
                  className="text-[var(--color-text-secondary)] leading-relaxed mb-4 text-sm md:text-base"
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>

            {/* Skills */}
            <motion.div variants={itemVariants} className="space-y-5">
              {about.skills.map((skillGroup) => (
                <div key={skillGroup.category}>
                  <h3 className="text-xs uppercase tracking-widest text-[var(--color-accent-light)] font-mono mb-2">
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.items.map((skill) => (
                      <motion.span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg glass text-xs font-mono text-[var(--color-text-secondary)] hover:text-[var(--color-neon-cyan)] hover:border-[var(--color-neon-cyan)] transition-colors cursor-default"
                        whileHover={{ scale: 1.08, y: -2 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Fun Stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {about.stats.map((stat) => (
              <motion.div
                key={stat.label}
                className="glass rounded-2xl p-6 text-center hover:glow-border transition-all"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="text-xl md:text-2xl font-bold text-[var(--color-text-primary)] font-mono">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
