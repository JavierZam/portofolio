import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Gamepad2, ArrowLeft, Music, Crosshair, Trophy, Bug, Terminal, Swords } from 'lucide-react'

const games = [
  {
    title: 'Arrow Dance',
    description: 'DDR-style rhythm game. Paste a YouTube link, feel the beat, smash the arrows.',
    icon: Music,
    path: '/games/arrow-dance',
    color: 'from-pink-500 to-purple-600',
    status: 'Play Now',
  },
  {
    title: 'Aim Trainer',
    description: 'Test your FPS reflexes. Click targets before they disappear in 1 second.',
    icon: Crosshair,
    path: '/games',
    color: 'from-red-500 to-orange-600',
    status: 'In Secret Gaming',
  },
  {
    title: 'NBA HOF & Arcade',
    description: 'Explore player statistics (GOATs, legends) and shoot hoops in the 3PT Shooter game.',
    icon: Trophy,
    path: '/nba',
    color: 'from-amber-500 to-red-600',
    status: 'Explore Now',
  },
  {
    title: 'Bug Raid: Global Co-op',
    description: 'Cooperative real-time multiplayer clicker. Choose your dev class and tap to defeat production bugs!',
    icon: Bug,
    path: '/games/bug-raid',
    color: 'from-cyan-500 to-emerald-600',
    status: 'Join Raid',
  },
  {
    title: 'Dev Race: Typing Arena',
    description: 'Real-time multiplayer coding speed test. Race other players (or bots) to type syntax correctly!',
    icon: Terminal,
    path: '/games/dev-race',
    color: 'from-violet-600 to-indigo-600',
    status: 'Race Now',
  },
  {
    title: 'Git Push-of-War',
    description: 'Multiplayer keyboard mashing duel. Play PUSH vs PULL and pull the commit node to your side!',
    icon: Swords,
    path: '/games/git-war',
    color: 'from-emerald-500 to-cyan-500',
    status: 'Duel Now',
  },
]

export default function GamesHub() {
  return (
    <div className="noise animated-gradient min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back to portfolio */}
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
            <Gamepad2 size={40} className="text-[var(--color-neon-green)]" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tight">
              <span className="text-[var(--color-neon-green)]">Game</span>
              <span className="text-white">Zone</span>
            </h1>
          </div>
          <p className="text-gray-400 text-sm font-mono">
            Mini-games I built when I should have been debugging production
          </p>
        </motion.div>

        {/* Game Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, i) => (
            <motion.div
              key={game.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
            >
              <Link
                to={game.path}
                className="block glass rounded-2xl overflow-hidden hover:glow-border transition-all group"
              >
                {/* Gradient Banner */}
                <div className={`h-32 bg-gradient-to-br ${game.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                  <game.icon size={48} className="text-white drop-shadow-lg" />
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-white">{game.title}</h2>
                    <span className="text-xs font-mono px-3 py-1 rounded-full bg-[var(--color-neon-green)]/10 text-[var(--color-neon-green)] border border-[var(--color-neon-green)]/20">
                      {game.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{game.description}</p>
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
          more games coming when I run out of production bugs to fix
        </motion.p>
      </div>
    </div>
  )
}
