import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Music, Play, RotateCcw, Trophy, Zap } from 'lucide-react'
import { useYouTubePlayer, extractVideoId } from '../../hooks/useYouTubePlayer'

type Direction = 'left' | 'down' | 'up' | 'right'
type Difficulty = 'easy' | 'normal' | 'hard'
type GamePhase = 'setup' | 'countdown' | 'playing' | 'results'
type HitGrade = 'perfect' | 'good' | 'miss'

interface Arrow {
  id: number
  direction: Direction
  time: number // when it should be hit (seconds)
  hit: boolean
  missed: boolean
}

interface HitEffect {
  id: number
  direction: Direction
  grade: HitGrade
  timestamp: number
}

const ARROW_SYMBOLS: Record<Direction, string> = {
  left: '←',
  down: '↓',
  up: '↑',
  right: '→',
}

const ARROW_KEYS: Record<string, Direction> = {
  ArrowLeft: 'left',
  ArrowDown: 'down',
  ArrowUp: 'up',
  ArrowRight: 'right',
}

const LANE_COLORS: Record<Direction, string> = {
  left: 'from-cyan-400 to-blue-500',
  down: 'from-green-400 to-emerald-500',
  up: 'from-pink-400 to-rose-500',
  right: 'from-yellow-400 to-orange-500',
}

const DIFFICULTY_CONFIG: Record<Difficulty, { arrowsPerBeat: number; label: string }> = {
  easy: { arrowsPerBeat: 0.5, label: 'Easy (Chill)' },
  normal: { arrowsPerBeat: 1, label: 'Normal (Vibing)' },
  hard: { arrowsPerBeat: 2, label: 'Hard (Sweating)' },
}

// Travel time: how many seconds an arrow takes to scroll from bottom to hit zone
const TRAVEL_TIME = 2.0
// Hit zone position (percentage from top of arena)
const HIT_ZONE_Y = 6
// Hit window thresholds (seconds)
const PERFECT_WINDOW = 0.12
const GOOD_WINDOW = 0.25

function generateArrows(duration: number, bpm: number, difficulty: Difficulty): Arrow[] {
  const arrows: Arrow[] = []
  const beatInterval = 60 / bpm
  const density = DIFFICULTY_CONFIG[difficulty].arrowsPerBeat
  const directions: Direction[] = ['left', 'down', 'up', 'right']
  let id = 0

  // Start generating from 3s in (give player time after countdown)
  const startTime = 3
  const endTime = duration - 1

  for (let t = startTime; t < endTime; t += beatInterval / density) {
    const dir = directions[Math.floor(Math.random() * directions.length)]
    arrows.push({ id: id++, direction: dir, time: t, hit: false, missed: false })
  }

  return arrows
}

export default function ArrowDance() {
  const [phase, setPhase] = useState<GamePhase>('setup')
  const [youtubeUrl, setYoutubeUrl] = useState('')
  const [bpm, setBpm] = useState(120)
  const [difficulty, setDifficulty] = useState<Difficulty>('normal')
  const [countdown, setCountdown] = useState(3)

  // Game state
  const [arrows, setArrows] = useState<Arrow[]>([])
  const [score, setScore] = useState(0)
  const [combo, setCombo] = useState(0)
  const [maxCombo, setMaxCombo] = useState(0)
  const [perfects, setPerfects] = useState(0)
  const [goods, setGoods] = useState(0)
  const [misses, setMisses] = useState(0)
  const [hitEffects, setHitEffects] = useState<HitEffect[]>([])
  const [laneFlash, setLaneFlash] = useState<Record<Direction, boolean>>({
    left: false, down: false, up: false, right: false,
  })
  // Force re-render for arrow positions
  const [, setTick] = useState(0)

  const arrowsRef = useRef<Arrow[]>([])
  const phaseRef = useRef<GamePhase>('setup')
  const effectIdRef = useRef(0)

  const yt = useYouTubePlayer('yt-player')
  const ytRef = useRef(yt)
  ytRef.current = yt

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = phase }, [phase])

  // Handle YouTube URL submission
  const handleLoadVideo = () => {
    const videoId = extractVideoId(youtubeUrl)
    if (videoId) {
      yt.loadVideo(videoId)
    }
  }

  // Start game
  const startGame = () => {
    if (!yt.isReady || yt.duration === 0) return
    const generated = generateArrows(yt.duration, bpm, difficulty)
    setArrows(generated)
    arrowsRef.current = generated
    setScore(0)
    setCombo(0)
    setMaxCombo(0)
    setPerfects(0)
    setGoods(0)
    setMisses(0)
    setHitEffects([])
    setPhase('countdown')
    setCountdown(3)
  }

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdown <= 0) {
      setPhase('playing')
      yt.play()
      return
    }
    const timer = setTimeout(() => setCountdown(c => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [phase, countdown])

  // Main game loop: uses a single setInterval that reads current time from the ref
  useEffect(() => {
    if (phase !== 'playing') return

    const interval = window.setInterval(() => {
      const now = ytRef.current.currentTime
      const dur = ytRef.current.duration
      let anyMissed = false

      arrowsRef.current = arrowsRef.current.map(arrow => {
        if (!arrow.hit && !arrow.missed && now > arrow.time + GOOD_WINDOW) {
          anyMissed = true
          return { ...arrow, missed: true }
        }
        return arrow
      })

      if (anyMissed) {
        setArrows([...arrowsRef.current])
        setMisses(m => m + 1)
        setCombo(0)
      }

      // Check if song ended
      if (dur > 0 && now >= dur - 0.5) {
        setPhase('results')
        ytRef.current.stop()
        return
      }

      // Force a re-render so arrows reposition
      setTick(t => t + 1)
    }, 33) // ~30fps

    return () => clearInterval(interval)
  }, [phase])

  // Keyboard handler
  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (phaseRef.current !== 'playing') return
    const direction = ARROW_KEYS[e.key]
    if (!direction) return
    e.preventDefault()

    // Flash the lane
    setLaneFlash(prev => ({ ...prev, [direction]: true }))
    setTimeout(() => setLaneFlash(prev => ({ ...prev, [direction]: false })), 150)

    const now = ytRef.current.currentTime

    // Find the closest unhit arrow in this lane within hit window
    let bestArrow: Arrow | null = null
    let bestDiff = Infinity

    for (const arrow of arrowsRef.current) {
      if (arrow.direction !== direction || arrow.hit || arrow.missed) continue
      const diff = Math.abs(now - arrow.time)
      if (diff < bestDiff && diff <= GOOD_WINDOW) {
        bestDiff = diff
        bestArrow = arrow
      }
    }

    if (bestArrow) {
      const grade: HitGrade = bestDiff <= PERFECT_WINDOW ? 'perfect' : 'good'
      bestArrow.hit = true
      setArrows([...arrowsRef.current])

      const points = grade === 'perfect' ? 300 : 100
      setScore(s => s + points)
      setCombo(c => {
        const next = c + 1
        setMaxCombo(m => Math.max(m, next))
        return next
      })
      if (grade === 'perfect') setPerfects(p => p + 1)
      else setGoods(g => g + 1)

      // Add hit effect
      const eid = effectIdRef.current++
      setHitEffects(prev => [...prev, { id: eid, direction, grade, timestamp: Date.now() }])
      setTimeout(() => setHitEffects(prev => prev.filter(e => e.id !== eid)), 500)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // Calculate arrow Y position: scrolls from BOTTOM (100%) up to HIT_ZONE (6%)
  const getArrowY = (arrowTime: number) => {
    const diff = arrowTime - ytRef.current.currentTime
    const progress = diff / TRAVEL_TIME // 1 = just spawned (bottom), 0 = at hit zone
    return HIT_ZONE_Y + progress * (100 - HIT_ZONE_Y)
  }

  const getRank = () => {
    const total = perfects + goods + misses
    if (total === 0) return { name: 'N/A', color: 'text-gray-400' }
    const accuracy = ((perfects * 300 + goods * 100) / (total * 300)) * 100
    if (accuracy >= 95) return { name: 'SSS', color: 'text-yellow-400' }
    if (accuracy >= 90) return { name: 'SS', color: 'text-yellow-400' }
    if (accuracy >= 80) return { name: 'S', color: 'text-purple-400' }
    if (accuracy >= 70) return { name: 'A', color: 'text-cyan-400' }
    if (accuracy >= 60) return { name: 'B', color: 'text-green-400' }
    return { name: 'C', color: 'text-gray-400' }
  }

  return (
    <div className="w-full max-w-3xl mx-auto select-none">
      {/* ===== SETUP PHASE ===== */}
      {phase === 'setup' && (
        <motion.div
          key="setup"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 space-y-6"
        >
          <div className="text-center mb-6">
            <Music size={40} className="mx-auto mb-3 text-pink-400" />
            <h2 className="text-2xl font-black text-white">Arrow Dance</h2>
            <p className="text-sm text-gray-400 mt-1">Paste a YouTube link, pick your difficulty, and dance.</p>
          </div>

          {/* YouTube URL */}
          <div>
            <label className="text-xs font-mono text-gray-400 mb-2 block">YouTube URL</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={youtubeUrl}
                onChange={e => setYoutubeUrl(e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-white text-sm font-mono focus:outline-none focus:border-pink-500 transition-colors"
              />
              <button
                onClick={handleLoadVideo}
                className="px-4 py-3 rounded-xl bg-pink-500/20 text-pink-400 hover:bg-pink-500/30 border border-pink-500/30 text-sm font-bold transition-colors"
              >
                Load
              </button>
            </div>
            {yt.isReady && (
              <p className="text-xs text-green-400 mt-2 font-mono">
                ✓ Video loaded ({Math.round(yt.duration)}s)
              </p>
            )}
          </div>

          {/* BPM */}
          <div>
            <label className="text-xs font-mono text-gray-400 mb-2 block">BPM (Beats Per Minute)</label>
            <input
              type="number"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              min={60}
              max={300}
              className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-white text-sm font-mono focus:outline-none focus:border-pink-500 transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Tip: Search "[song name] BPM" on Google to find the tempo.</p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-xs font-mono text-gray-400 mb-2 block">Difficulty</label>
            <div className="grid grid-cols-3 gap-3">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-3 rounded-xl text-sm font-bold border transition-all ${
                    difficulty === d
                      ? 'bg-pink-500/20 border-pink-500 text-pink-400'
                      : 'bg-[var(--color-bg-secondary)] border-[var(--color-border)] text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {DIFFICULTY_CONFIG[d].label}
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <button
            onClick={startGame}
            disabled={!yt.isReady}
            className={`w-full py-4 rounded-xl font-black text-lg flex items-center justify-center gap-2 transition-all ${
              yt.isReady
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-[0_0_30px_rgba(236,72,153,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)]'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Play size={20} /> {yt.isReady ? 'Start Dance' : 'Load a video first'}
          </button>
        </motion.div>
      )}

      {/* ===== COUNTDOWN ===== */}
      {phase === 'countdown' && (
        <div className="flex items-center justify-center h-[500px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={countdown}
              initial={{ scale: 2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-8xl font-black text-pink-400"
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.span>
          </AnimatePresence>
        </div>
      )}

      {/* ===== PLAYING PHASE ===== */}
      {phase === 'playing' && (
        <div>
          {/* Score bar */}
          <div className="flex justify-between items-center mb-4 px-2 font-mono text-sm">
            <div className="text-pink-400 font-bold">Score: {score}</div>
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-yellow-400" />
              <span className={`font-bold ${combo >= 10 ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}>
                {combo}x Combo
              </span>
            </div>
          </div>

          {/* Game Arena */}
          <div className="relative w-full h-[480px] glass rounded-2xl overflow-hidden border border-[var(--color-border)]">
            {/* Lane separators */}
            <div className="absolute inset-0 flex">
              {(['left', 'down', 'up', 'right'] as Direction[]).map(dir => (
                <div
                  key={dir}
                  className={`flex-1 border-x border-white/5 transition-colors duration-150 ${
                    laneFlash[dir] ? 'bg-white/10' : ''
                  }`}
                />
              ))}
            </div>

            {/* Hit Zone (top ~12%) */}
            <div className="absolute top-0 left-0 right-0 h-[12%] border-b-2 border-pink-500/50 bg-gradient-to-b from-pink-500/10 to-transparent flex z-10">
              {(['left', 'down', 'up', 'right'] as Direction[]).map(dir => (
                <div key={dir} className="flex-1 flex items-center justify-center">
                  <div className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-black transition-all ${
                    laneFlash[dir]
                      ? 'border-pink-400 text-pink-400 bg-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.5)]'
                      : 'border-white/20 text-white/30'
                  }`}>
                    {ARROW_SYMBOLS[dir]}
                  </div>
                </div>
              ))}
            </div>

            {/* Hit Effects */}
            <AnimatePresence>
              {hitEffects.map(effect => {
                const laneIndex = ['left', 'down', 'up', 'right'].indexOf(effect.direction)
                return (
                  <motion.div
                    key={effect.id}
                    initial={{ opacity: 1, scale: 1, y: 0 }}
                    animate={{ opacity: 0, scale: 1.5, y: -30 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute z-20 pointer-events-none"
                    style={{ top: '14%', left: `${laneIndex * 25 + 12.5}%`, transform: 'translateX(-50%)' }}
                  >
                    <span className={`text-sm font-black ${effect.grade === 'perfect' ? 'text-yellow-400' : 'text-green-400'}`}>
                      {effect.grade === 'perfect' ? 'PERFECT!' : 'GOOD'}
                    </span>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {/* Scrolling Arrows */}
            {arrows
              .filter(a => {
                if (a.hit) return false
                const yPct = getArrowY(a.time)
                return yPct > -10 && yPct < 110
              })
              .map(arrow => {
                const yPct = getArrowY(arrow.time)
                const laneIndex = ['left', 'down', 'up', 'right'].indexOf(arrow.direction)
                return (
                  <div
                    key={arrow.id}
                    className={`absolute w-14 h-14 rounded-xl flex items-center justify-center text-2xl font-black ${
                      arrow.missed
                        ? 'opacity-20 text-red-400 border border-red-400/30'
                        : `bg-gradient-to-br ${LANE_COLORS[arrow.direction]} text-white shadow-lg`
                    }`}
                    style={{
                      top: `${yPct}%`,
                      left: `${laneIndex * 25 + 12.5}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {ARROW_SYMBOLS[arrow.direction]}
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* ===== RESULTS ===== */}
      {phase === 'results' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center"
        >
          <Trophy size={48} className={`mx-auto mb-4 ${getRank().color}`} />
          <h2 className="text-4xl font-black mb-1">Rank: <span className={getRank().color}>{getRank().name}</span></h2>
          <p className="text-3xl font-bold text-white mb-8">Score: {score}</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-black text-yellow-400">{perfects}</p>
              <p className="text-xs text-gray-400">Perfect</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-black text-green-400">{goods}</p>
              <p className="text-xs text-gray-400">Good</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-2xl font-black text-red-400">{misses}</p>
              <p className="text-xs text-gray-400">Miss</p>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-6 font-mono">Max Combo: {maxCombo}x</p>

          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                setPhase('setup')
                yt.stop()
              }}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center gap-2"
            >
              <RotateCcw size={18} /> Play Again
            </button>
          </div>
        </motion.div>
      )}

      {/* YouTube Player - hidden but rendered (not display:none!) */}
      <div className="fixed -top-[9999px] -left-[9999px] w-0 h-0 overflow-hidden">
        <div id="yt-player" />
      </div>
    </div>
  )
}
