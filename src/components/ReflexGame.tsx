import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Target, Trophy, RotateCcw, Crosshair } from 'lucide-react'

type GameState = 'idle' | 'playing' | 'ended'

export default function ReflexGame() {
  const [gameState, setGameState] = useState<GameState>('idle')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(15)
  const [targetPos, setTargetPos] = useState({ x: 50, y: 50 })
  const arenaRef = useRef<HTMLDivElement>(null)

  // Move target logic
  const moveTarget = () => {
    if (!arenaRef.current) return
    const padding = 10 // keep away from edges
    const x = Math.floor(Math.random() * (100 - padding * 2)) + padding
    const y = Math.floor(Math.random() * (100 - padding * 2)) + padding
    setTargetPos({ x, y })
  }

  // Handle click on target
  const handleHit = (e: React.MouseEvent) => {
    e.stopPropagation() // prevent missing click
    if (gameState === 'playing') {
      setScore(s => s + 1)
      moveTarget()
    }
  }

  // Start game
  const startGame = () => {
    setScore(0)
    setTimeLeft(15)
    setGameState('playing')
    moveTarget()
  }

  // Game timer loop
  useEffect(() => {
    if (gameState !== 'playing') return

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timer)
          setGameState('ended')
          return 0
        }
        return t - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  // Ranking logic
  const getRank = (finalScore: number) => {
    if (finalScore >= 25) return { name: 'Radiant 👑', color: 'text-yellow-400', msg: 'You have actual aimbot! Tenz is shaking.' }
    if (finalScore >= 20) return { name: 'Immortal 💀', color: 'text-red-500', msg: 'Go pro right now. What are you doing parsing JSON?' }
    if (finalScore >= 15) return { name: 'Diamond 💎', color: 'text-cyan-400', msg: 'Solid clicks. Probably a fragger in every lobby.' }
    if (finalScore >= 10) return { name: 'Gold 🥇', color: 'text-amber-500', msg: 'Average joe. You definitely blame your teammates.' }
    return { name: 'Iron 🪵', color: 'text-stone-400', msg: 'Did you play with a trackpad? Shame.' }
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-12 glass rounded-2xl p-6 md:p-8 overflow-hidden relative">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold flex items-center justify-center gap-2 mb-2">
          <Crosshair className="text-[var(--color-accent)]" /> 
          Aim Trainer Check
        </h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Claim you are good at FPS? Prove it. Click the targets. You have 15 seconds.
        </p>
      </div>

      {/* Game Arena */}
      <div 
        ref={arenaRef}
        className="w-full relative h-[300px] md:h-[400px] bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl overflow-hidden cursor-crosshair transition-colors"
        onClick={() => {
          // Optional: penalty for missing if we want to be cruel.
        }}
      >
        <AnimatePresence mode="wait">
          {gameState === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10"
            >
              <button 
                onClick={startGame}
                className="px-6 py-3 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-white font-bold rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-2"
              >
                <Target size={20} /> Start Challenge
              </button>
            </motion.div>
          )}

          {gameState === 'playing' && (
            <motion.div
              key="target"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              style={{ top: `${targetPos.y}%`, left: `${targetPos.x}%` }}
              className="absolute w-10 h-10 md:w-12 md:h-12 -ml-5 -mt-5 md:-ml-6 md:-mt-6 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)] cursor-pointer flex items-center justify-center border-2 border-white/20"
              onPointerDown={handleHit}
            >
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </motion.div>
          )}

          {gameState === 'ended' && (
            <motion.div
              key="ended"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md z-10 p-6 text-center"
            >
              <Trophy size={48} className={`mb-4 ${getRank(score).color}`} />
              <h4 className="text-3xl font-black mb-1">Score: {score}</h4>
              <p className={`text-xl font-bold mb-2 ${getRank(score).color}`}>
                Rank: {getRank(score).name}
              </p>
              <p className="text-sm text-[var(--color-text-muted)] mb-8 max-w-sm">
                "{getRank(score).msg}"
              </p>
              <button 
                onClick={startGame}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all flex items-center gap-2"
              >
                <RotateCcw size={18} /> Play Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between items-center mt-4 px-2 font-mono text-sm">
        <div className="text-[var(--color-accent-light)] font-bold">
          Score: {score}
        </div>
        <div className={`font-bold ${timeLeft <= 5 && gameState === 'playing' ? 'text-red-400 animate-pulse' : 'text-[var(--color-text-secondary)]'}`}>
          Time: 00:{timeLeft.toString().padStart(2, '0')}
        </div>
      </div>
    </div>
  )
}
