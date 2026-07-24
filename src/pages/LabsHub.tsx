import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FlaskConical, ArrowLeft, SlidersHorizontal, BarChart3, Columns2 } from 'lucide-react'

const projects = [
  {
    title: 'Slide UI',
    description: 'Interactive before/after slider with two fully functional UI themes. Drag to morph between Legacy Terminal and Modern Glass dashboards.',
    icon: SlidersHorizontal,
    path: '/labs/slide-ui',
    color: 'from-violet-500 to-fuchsia-600',
    status: 'Try Now',
  },
  {
    title: 'Stock Analyzer',
    description: 'Analyze stocks, IPO data & broker reports by importing PDFs. AI-powered insights for smarter investment decisions.',
    icon: BarChart3,
    path: '/labs',
    color: 'from-emerald-500 to-teal-600',
    status: 'Coming Soon',
  },
  {
    title: 'Split View Lab',
    description: 'Simulated browser split-view experience inside a web app. Compare and interact with two independent panels side by side.',
    icon: Columns2,
    path: '/labs',
    color: 'from-cyan-500 to-blue-600',
    status: 'Coming Soon',
  },
]

export default function LabsHub() {
  return (
    <div className="noise animated-gradient min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-8 font-mono"
        >
          <ArrowLeft size={16} /> Back to Portfolio
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <FlaskConical size={40} className="text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              <span className="text-purple-400">Dev</span>
              <span className="text-white">Labs</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm font-mono">
            experimental ideas & proof-of-concept projects from my brain
          </p>
        </motion.div>

        {/* Project Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={project.path}
                className={`block glass rounded-2xl overflow-hidden hover:glow-border transition-all group ${
                  project.status === 'Coming Soon' ? 'opacity-60 pointer-events-none' : ''
                }`}
              >
                {/* Gradient Banner */}
                <div className={`h-32 bg-gradient-to-br ${project.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center relative`}>
                  <project.icon size={48} className="text-white drop-shadow-lg" />
                  {project.status === 'Coming Soon' && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="text-xs font-mono text-white/70 bg-black/50 px-3 py-1 rounded-full border border-white/10">
                        🔒 Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white">{project.title}</h2>
                    <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                      project.status === 'Coming Soon'
                        ? 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                        : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{project.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-xs text-gray-500 mt-16 font-mono"
        >
          more experiments brewing in my mind... stay tuned ⚡
        </motion.p>
      </div>
    </div>
  )
}
