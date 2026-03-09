import { motion } from 'framer-motion'
import { Briefcase, GraduationCap } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
}

export default function Experience() {
  const { experience } = PORTFOLIO

  return (
    <section id="experience" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="text-[var(--color-accent-light)] font-mono text-lg md:text-xl block mb-1">
                {'// '}02
              </span>
              {experience.title}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base">
              {experience.subtitle}
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative mt-12">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--color-accent)] via-[var(--color-border)] to-transparent" />

            <div className="space-y-8">
              {experience.items.map((item, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="relative pl-16 md:pl-20 group"
                >
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-4 md:left-6 top-1 w-5 h-5 rounded-full border-2 border-[var(--color-accent)] bg-[var(--color-bg-primary)] flex items-center justify-center z-10 group-hover:bg-[var(--color-accent)] transition-colors"
                    whileHover={{ scale: 1.3 }}
                  >
                    {item.type === 'education' ? (
                      <GraduationCap size={10} className="text-[var(--color-accent-light)] group-hover:text-white" />
                    ) : (
                      <Briefcase size={10} className="text-[var(--color-accent-light)] group-hover:text-white" />
                    )}
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="glass rounded-2xl p-6 hover:glow-border transition-all"
                    whileHover={{ x: 8 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-1">
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                        {item.title}
                      </h3>
                      <span className="text-xs font-mono text-[var(--color-accent-light)] bg-[var(--color-accent-glow)] px-3 py-1 rounded-full w-fit">
                        {item.period}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--color-accent-light)] font-medium mb-3">
                      {item.company}
                    </p>
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs font-mono bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
