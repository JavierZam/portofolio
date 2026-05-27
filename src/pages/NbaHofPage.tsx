import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Trophy, Zap, Flame, Shield, Activity, 
  RotateCcw, Volume2, VolumeX, TrendingUp, Info, Award
} from 'lucide-react'
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip
} from 'recharts'
import { PORTFOLIO } from '../config/portfolio'

// Synthesize sound effects using Web Audio API
const playSynthSound = (type: 'swish' | 'clank' | 'perfect' | 'beep' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    
    if (type === 'beep') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } else if (type === 'perfect') {
      const notes = [440, 554.37, 659.25, 880] // A major chord
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05)
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.25)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.05)
        osc.stop(ctx.currentTime + i * 0.05 + 0.25)
      })
    } else if (type === 'swish') {
      const bufferSize = ctx.sampleRate * 0.2
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = 1400
      filter.Q.value = 4.0

      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)

      noise.connect(filter)
      filter.connect(gain)
      gain.connect(ctx.destination)
      noise.start()
      noise.stop(ctx.currentTime + 0.2)
    } else if (type === 'clank') {
      // Metallic rim hit
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain1 = ctx.createGain()
      const gain2 = ctx.createGain()

      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(180, ctx.currentTime)
      osc1.frequency.linearRampToValueAtTime(70, ctx.currentTime + 0.12)
      gain1.gain.setValueAtTime(0.08, ctx.currentTime)
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)

      osc2.type = 'triangle'
      osc2.frequency.setValueAtTime(380, ctx.currentTime)
      osc2.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.18)
      gain2.gain.setValueAtTime(0.06, ctx.currentTime)
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18)

      osc1.connect(gain1)
      gain1.connect(ctx.destination)
      osc2.connect(gain2)
      gain2.connect(ctx.destination)

      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.2)
      osc2.stop(ctx.currentTime + 0.2)
    } else if (type === 'success') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99] // C major scale rise
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.08)
        osc.stop(ctx.currentTime + i * 0.08 + 0.2)
      })
    }
  } catch (e) {
    console.warn('Audio synthesis failed to start:', e)
  }
}

// Stylized Futuristic Glowing Avatar Component
function HoloAvatar({ name, jersey, team, accentColor }: { name: string; jersey: string; team: string; accentColor: string }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('.')
  
  return (
    <div className="relative w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:border-opacity-50 transition-all">
      {/* HUD background grid */}
      <div 
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `linear-gradient(to right, ${accentColor} 1px, transparent 1px), linear-gradient(to bottom, ${accentColor} 1px, transparent 1px)`,
          backgroundSize: '16px 16px'
        }}
      />

      {/* Radial neon glow */}
      <div 
        className="absolute w-24 h-24 rounded-full blur-2xl opacity-20 animate-pulse"
        style={{ backgroundColor: accentColor }}
      />

      {/* Rotating Ring */}
      <motion.svg 
        className="absolute w-36 h-36 opacity-30" 
        viewBox="0 0 100 100"
        animate={{ rotate: 360 }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="50" cy="50" r="45" stroke={accentColor} strokeWidth="1" fill="none" strokeDasharray="5, 10" />
        <circle cx="50" cy="50" r="40" stroke={accentColor} strokeWidth="0.5" fill="none" strokeDasharray="30, 8" />
      </motion.svg>

      {/* Counter-rotating Inner Ring */}
      <motion.svg 
        className="absolute w-28 h-28 opacity-25" 
        viewBox="0 0 100 100"
        animate={{ rotate: -360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx="50" cy="50" r="45" stroke={accentColor} strokeWidth="0.8" fill="none" strokeDasharray="15, 25" />
      </motion.svg>

      {/* Digital HUD Crosshairs */}
      <div className="absolute inset-x-4 top-4 flex justify-between text-[9px] font-mono opacity-40" style={{ color: accentColor }}>
        <span>[SYS.INIT]</span>
        <span>{team.toUpperCase().slice(0, 3)}</span>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex justify-between text-[9px] font-mono opacity-40" style={{ color: accentColor }}>
        <span>AI.MODEL v3.5</span>
        <span>SYS.OK</span>
      </div>

      {/* Jersey Number & Initials Display */}
      <div className="text-center z-10">
        <motion.div 
          className="text-5xl font-black tracking-widest font-mono drop-shadow-glow"
          style={{ 
            color: '#ffffff',
            textShadow: `0 0 8px ${accentColor}, 0 0 20px ${accentColor}`
          }}
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          {jersey.split(' ')[0]}
        </motion.div>
        <div className="text-[11px] font-bold font-mono text-slate-400 mt-1 tracking-wider uppercase">
          {initials}
        </div>
      </div>

      {/* Cyber Scanning Line */}
      <motion.div 
        className="absolute left-0 right-0 h-[2px] opacity-25"
        style={{ 
          background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`
        }}
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// 3-Point Shooting Arcade Game Component
function CurryArcade({ soundEnabled }: { soundEnabled: boolean }) {
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(() => {
    return Number(localStorage.getItem('nba_3pt_best_streak') || 0)
  })
  const [shots, setShots] = useState(0)
  const [isShooting, setIsShooting] = useState(false)
  const [shotResult, setShotResult] = useState<'make' | 'miss' | 'perfect' | null>(null)
  
  // Shooting meter state
  const [meterValue, setMeterValue] = useState(0)
  const [isMeterRunning, setIsMeterRunning] = useState(true)
  
  const meterDirection = useRef(1) // 1: up, -1: down
  const animationFrameId = useRef<number | null>(null)
  
  // Start/Stop Meter loop
  useEffect(() => {
    if (!isMeterRunning) return

    const updateMeter = () => {
      setMeterValue(prev => {
        let next = prev + meterDirection.current * 1.2
        if (next >= 100) {
          next = 100
          meterDirection.current = -1
        } else if (next <= 0) {
          next = 0
          meterDirection.current = 1
        }
        return next
      })
      animationFrameId.current = requestAnimationFrame(updateMeter)
    }

    animationFrameId.current = requestAnimationFrame(updateMeter)
    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current)
    }
  }, [isMeterRunning])

  const handleShoot = useCallback(() => {
    if (isShooting || !isMeterRunning) return
    setIsMeterRunning(false)
    setIsShooting(true)
    
    if (soundEnabled) playSynthSound('beep')

    // Evaluate timing accuracy
    // Target is 50. Green success range is 45 - 55. Perfect range is 49 - 51.
    const accuracy = Math.abs(meterValue - 50)
    let result: 'make' | 'miss' | 'perfect' = 'miss'
    
    if (accuracy <= 2.0) {
      result = 'perfect'
    } else if (accuracy <= 7.0) {
      result = 'make'
    }
    
    setShotResult(result)
    setShots(prev => prev + 1)

    // Trigger ball shooting animation delay, then resolution
    setTimeout(() => {
      if (result === 'perfect') {
        if (soundEnabled) playSynthSound('perfect')
        setScore(prev => prev + 3)
        setStreak(prev => {
          const next = prev + 1
          if (next > bestStreak) {
            setBestStreak(next)
            localStorage.setItem('nba_3pt_best_streak', String(next))
          }
          return next
        })
      } else if (result === 'make') {
        if (soundEnabled) playSynthSound('swish')
        setScore(prev => prev + 3)
        setStreak(prev => {
          const next = prev + 1
          if (next > bestStreak) {
            setBestStreak(next)
            localStorage.setItem('nba_3pt_best_streak', String(next))
          }
          return next
        })
      } else {
        if (soundEnabled) playSynthSound('clank')
        setStreak(0)
      }
    }, 800) // Timing fits the shot flight animation

    // Reset game state after animation
    setTimeout(() => {
      setIsShooting(false)
      setShotResult(null)
      setIsMeterRunning(true)
    }, 1800)
  }, [isShooting, isMeterRunning, meterValue, streak, bestStreak, soundEnabled])

  // Key listener for Spacebar to shoot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        handleShoot()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleShoot])

  return (
    <div className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
      {/* Background Court Neon Glows */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-44 h-44 bg-yellow-500/5 rounded-full blur-3xl" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-white">
            <Flame className="text-[var(--color-neon-yellow)] animate-pulse" size={20} />
            Chef Curry 3-Point Arcade
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Tekan [SPACEBAR] atau klik tombol tembak saat slider berada di zona hijau!
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-slate-400 bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
            SHOTS: <span className="text-white font-bold">{shots}</span>
          </div>
          <div className="text-slate-400 bg-slate-900 border border-slate-800 rounded px-2.5 py-1">
            ACCURACY: <span className="text-[var(--color-neon-cyan)] font-bold">
              {shots > 0 ? Math.round(((score / 3) / shots) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-center">
        {/* Game Stats Screen */}
        <div className="space-y-4">
          <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-[var(--color-neon-cyan)]" />
            <div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider">TOTAL SCORE</div>
              <div className="text-3xl font-black font-mono text-white mt-1">{score} PTS</div>
            </div>
            <Trophy className="text-slate-600 opacity-40" size={32} />
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-[var(--color-neon-yellow)]" />
            <div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider">CURRENT STREAK</div>
              <div className="text-2xl font-black font-mono text-[var(--color-neon-yellow)] mt-1">{streak} 🔥</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-900 rounded-xl p-4 flex justify-between items-center relative overflow-hidden">
            <div className="absolute left-0 top-0 w-1 h-full bg-emerald-500" />
            <div>
              <div className="text-[10px] text-slate-500 font-mono tracking-wider">BEST STREAK</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{bestStreak} 🔥</div>
            </div>
            <button 
              onClick={() => {
                setScore(0)
                setStreak(0)
                setShots(0)
              }}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-500 hover:text-slate-300 transition-colors"
              title="Reset current game"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>

        {/* Shoot Screen Animation Panel */}
        <div className="md:col-span-2 bg-slate-950 rounded-xl border border-slate-900 h-52 relative overflow-hidden flex flex-col justify-between p-4">
          {/* Cyber HUD Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

          {/* Holographic hoop */}
          {/* Holographic hoop */}
          <div className="absolute right-[10%] top-[15%] flex flex-col items-center">
            {/* Backboard */}
            <div className="w-16 h-12 border-2 border-cyan-500/30 bg-slate-950/40 rounded flex items-center justify-center relative">
              <div className="w-8 h-6 border border-cyan-500/40" />
              {/* Rim & net */}
              <div className="absolute bottom-0 -left-4 w-4 h-1 bg-orange-500 rounded-full" />
              <div className="absolute bottom-0 -left-4 w-4 h-4 border-l border-r border-b border-orange-500/30 rounded-b-md" />
            </div>
            <div className="w-1 h-14 bg-slate-800" />
          </div>

          {/* Steph Curry Shooter Placeholder Silhouette */}
          <div className="absolute left-[10%] bottom-[8%] flex flex-col items-center">
            <div className="w-12 h-16 border-2 border-slate-700 bg-slate-900/50 rounded-t-full flex items-center justify-center relative">
              <span className="text-[10px] text-yellow-500 font-bold font-mono">#30</span>
              
              {/* Ball in hand */}
              {!isShooting && (
                <div className="absolute -top-3 -right-2 w-5 h-5 bg-orange-600 border border-orange-500 rounded-full flex items-center justify-center text-[10px] shadow-lg shadow-orange-500/30">
                  🏀
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1">CURRY</span>
          </div>

          {/* Flying Ball Animation */}
          {isShooting && (
            <motion.div 
              className="absolute w-5 h-5 text-lg flex items-center justify-center pointer-events-none"
              initial={{ left: "14%", top: "65%" }}
              animate={
                shotResult === 'miss' 
                  ? {
                      left: ["14%", "50%", "83%", "80%", "79%"],
                      top: ["65%", "12%", "33%", "25%", "95%"]
                    }
                  : {
                      left: ["14%", "50%", "86.5%"],
                      top: ["65%", "12%", "37.5%"]
                    }
              }
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              🏀
            </motion.div>
          )}

          {/* Success / Failure popups */}
          <AnimatePresence>
            {shotResult !== null && !isMeterRunning && (
              <motion.div 
                className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {shotResult === 'perfect' && (
                  <motion.div 
                    className="text-2xl font-black tracking-widest text-[var(--color-neon-yellow)] font-mono text-center drop-shadow-glow"
                    initial={{ scale: 0.4 }}
                    animate={{ scale: [0.4, 1.2, 1] }}
                  >
                    GREEN RELEASE!<br />
                    <span className="text-sm font-semibold text-white">PERFECT SWISH (+3)</span>
                  </motion.div>
                )}
                {shotResult === 'make' && (
                  <motion.div 
                    className="text-2xl font-black tracking-widest text-[var(--color-neon-cyan)] font-mono text-center"
                    initial={{ scale: 0.4 }}
                    animate={{ scale: [0.4, 1.1, 1] }}
                  >
                    SWISH!<br />
                    <span className="text-sm font-semibold text-white">NICE SHOT (+3)</span>
                  </motion.div>
                )}
                {shotResult === 'miss' && (
                  <motion.div 
                    className="text-2xl font-black tracking-widest text-red-500 font-mono text-center"
                    initial={{ scale: 0.4 }}
                    animate={{ scale: [0.4, 1.1, 1] }}
                  >
                    CLANK!<br />
                    <span className="text-sm font-semibold text-white">BRICK! STREAK RESET</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Space filler / empty space */}
          <div />

          {/* Shooting Slider UI */}
          <div className="w-full space-y-2">
            <div className="relative h-6 bg-slate-900 rounded border border-slate-800 overflow-hidden">
              {/* Green/Yellow target area in center */}
              <div className="absolute left-[43%] right-[43%] top-0 bottom-0 bg-yellow-500/20 border-l border-r border-yellow-500/40" />
              <div className="absolute left-[48%] right-[48%] top-0 bottom-0 bg-emerald-500/40 border-l border-r border-emerald-400" />
              
              {/* Moving pointer cursor */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white shadow-glow z-10"
                style={{ left: `${meterValue}%` }}
              />

              {/* Target labels */}
              <div className="absolute inset-0 flex items-center justify-between px-3 text-[8px] font-mono text-slate-500 pointer-events-none">
                <span>[MISS]</span>
                <span>[GREEN]</span>
                <span>[MISS]</span>
              </div>
            </div>

            {/* Shoot Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleShoot}
                disabled={isShooting}
                className="flex-1 py-2 font-mono font-bold text-xs rounded border border-emerald-500/30 text-emerald-400 bg-emerald-950/20 hover:bg-emerald-500 hover:text-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-center"
              >
                {isShooting ? 'Shooting...' : 'Release Ball (Space)'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Stats Table Comparison Component
function StatsRow({ label, valA, valB, format = 'normal' }: { label: string; valA: number; valB: number; format?: 'normal' | 'pct' }) {
  const isAHigher = valA > valB
  const isBHigher = valB > valA
  const isEqual = valA === valB

  const showVal = (val: number) => {
    if (format === 'pct') return `${val}%`
    return val
  }

  return (
    <div className="grid grid-cols-3 py-2 border-b border-slate-900/60 items-center text-xs font-mono">
      <div className={`text-left pl-2 ${isAHigher ? 'text-[var(--color-neon-cyan)] font-bold' : 'text-slate-400'}`}>
        {showVal(valA)}
        {isAHigher && <span className="ml-1 text-[9px] text-[var(--color-neon-cyan)] opacity-80">▲</span>}
      </div>
      
      <div className="text-center text-slate-500 text-[10px] tracking-widest uppercase">{label}</div>
      
      <div className={`text-right pr-2 ${isBHigher ? 'text-[var(--color-neon-yellow)] font-bold' : 'text-slate-400'}`}>
        {showVal(valB)}
        {isBHigher && <span className="mr-1 text-[9px] text-[var(--color-neon-yellow)] opacity-80">▲</span>}
      </div>
    </div>
  )
}

// Main NBA HOF Page Component
export default function NbaHofPage() {
  const { title, subtitle, players } = PORTFOLIO.nba
  const [selectedPlayerId, setSelectedPlayerId] = useState('jordan')
  const [compareMode, setCompareMode] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Compare mode states
  const [comparePlayerAId, setComparePlayerAId] = useState('jordan')
  const [comparePlayerBId, setComparePlayerBId] = useState('lebron')

  const selectedPlayer = players.find(p => p.id === selectedPlayerId) || players[0]
  const playerA = players.find(p => p.id === comparePlayerAId) || players[0]
  const playerB = players.find(p => p.id === comparePlayerBId) || players[1]

  // Synthesize custom GOAT debate comments based on comparison selection
  const getDebateCommentary = () => {
    if (comparePlayerAId === 'jordan' && comparePlayerBId === 'lebron' || comparePlayerAId === 'lebron' && comparePlayerBId === 'jordan') {
      return "GOAT OVERLOAD: MJ memiliki 6 Cincin & 6-0 Rekor Final yang tak terbantahkan. Namun LeBron memimpin semua metrik akumulasi poin sepanjang sejarah NBA (40K+ PTS) dan konsistensi 20+ tahun. Siapa GOAT pilihanmu? Sistem kami mengalami overheat!"
    }
    if (comparePlayerAId === 'jordan' && comparePlayerBId === 'kobe' || comparePlayerAId === 'kobe' && comparePlayerBId === 'jordan') {
      return "DNA COPY DETECTED: Kobe meniru setiap gerakan Jordan hingga detail terkecil (fadeaway, turnaround, killer glare). Tingkat kemiripan 99.9%. Jordan memimpin dalam statistik efisiensi, namun Kobe memimpin dalam kegilaan volume skor (81 PTS game)!"
    }
    if (comparePlayerAId === 'curry' || comparePlayerBId === 'curry') {
      return "GRAVITY ALERT: Stephen Curry merusak sistem radar penahan bola karena dia menarik perhatian bek 30 kaki dari ring basket. Menembak 400+ Three Point dalam semusim membuat kalkulator kami error."
    }
    if (comparePlayerAId === 'wemby' || comparePlayerBId === 'wemby') {
      return "ALIEN DETECTED: Victor Wembanyama memiliki tinggi 7'4\" dan wingspan 8 kaki namun menggiring bola layaknya seorang guard. Ini adalah kecurangan genetik. Rekor blok 5x5 menyarankan sistem keamanan untuk dimatikan."
    }
    if (comparePlayerAId === 'iverson' || comparePlayerBId === 'iverson') {
      return "ANKLE BREAKER METRICS: Allen Iverson meruntuhkan bek dengan crossover legendarisnya. Pemain terpendek dalam sejarah yang memenangkan MVP (6'0\") dengan hati terbesar di lapangan."
    }
    return "Membandingkan dua legenda basket... Kedua pemain memiliki warisan legendaris yang menginspirasi jutaan pebasket di seluruh dunia."
  }

  return (
    <div className="noise animated-gradient min-h-screen text-slate-100 pb-20 select-none">
      {/* HUD Scanner Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_bottom,rgba(0,255,247,0.15)_1px,transparent_1px),linear-gradient(to_right,rgba(0,255,247,0.15)_1px,transparent_1px)] bg-[size:40px_40px] z-0" />
      
      <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Navigation / Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-900">
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft size={16} /> Kembali ke Game Hub
          </Link>
          
          <div className="flex items-center gap-3">
            <Trophy className="text-[var(--color-neon-yellow)] animate-pulse" size={28} />
            <h1 className="text-2xl md:text-3xl font-black font-mono tracking-wider uppercase">
              {title}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) playSynthSound('beep')
              }}
              className={`p-2 rounded bg-slate-900 border transition-colors ${soundEnabled ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-500 border-slate-800'}`}
              title="Toggle Audio Synth"
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <span className="text-[10px] font-mono text-slate-500 uppercase">SYS_TIME: 2026</span>
          </div>
        </div>

        {/* Players Showcase Grid Selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
          {players.map((player) => {
            const isSelected = selectedPlayerId === player.id && !compareMode
            return (
              <motion.button
                key={player.id}
                onClick={() => {
                  setSelectedPlayerId(player.id)
                  setCompareMode(false)
                  if (soundEnabled) playSynthSound('beep')
                }}
                className={`glass border rounded-xl overflow-hidden text-left transition-all p-3 group relative cursor-pointer ${
                  isSelected ? 'shadow-lg border-opacity-100 glow-border' : 'border-slate-800/80'
                }`}
                style={{ 
                  borderColor: isSelected ? player.accentColor : undefined,
                  boxShadow: isSelected ? `0 0 15px ${player.accentColor}30` : undefined
                }}
                whileHover={{ y: -3 }}
              >
                <HoloAvatar 
                  name={player.name} 
                  jersey={player.jersey} 
                  team={player.team} 
                  accentColor={player.accentColor} 
                />
                
                <div className="mt-2.5">
                  <h4 className="font-bold text-xs text-white tracking-wide truncate">
                    {player.name}
                  </h4>
                  <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-slate-400">
                    <span>{player.team.split(' ').pop()}</span>
                    <span style={{ color: player.accentColor }}>{player.jersey.split(' ')[0]}</span>
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Action Tabs Mode Selection */}
        <div className="flex gap-2 mb-8 bg-slate-950 p-1.5 rounded-xl border border-slate-900 max-w-sm">
          <button
            onClick={() => {
              setCompareMode(false)
              if (soundEnabled) playSynthSound('beep')
            }}
            className={`flex-1 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-colors ${!compareMode ? 'bg-[var(--color-bg-card)] text-white border border-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Hologram Mode
          </button>
          <button
            onClick={() => {
              setCompareMode(true)
              if (soundEnabled) playSynthSound('beep')
            }}
            className={`flex-1 py-2 text-xs font-mono font-bold tracking-wider rounded-lg transition-colors ${compareMode ? 'bg-[var(--color-bg-card)] text-white border border-slate-800' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Compare Mode
          </button>
        </div>

        {/* Display Container: Normal Showcase vs Compare Matrix */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8 items-start">
          
          {/* Showcase Panel Content */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="wait">
              {!compareMode ? (
                // HOLOGRAM SHOWCASE SCREEN
                <motion.div
                  key={`showcase-${selectedPlayer.id}`}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
                >
                  {/* Decorative laser light overlay */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-[3px] opacity-35" 
                    style={{ 
                      background: `linear-gradient(to right, transparent, ${selectedPlayer.accentColor}, transparent)`
                    }} 
                  />

                  <div className="grid md:grid-cols-2 gap-6 items-center">
                    {/* Left stats cards */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            {selectedPlayer.position}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                            Jersey {selectedPlayer.jersey}
                          </span>
                        </div>
                        <h2 className="text-2xl font-black font-mono text-white tracking-wide">
                          {selectedPlayer.fullName.toUpperCase()}
                        </h2>
                        <p className="text-xs text-slate-400 font-mono italic mt-0.5">
                          "{selectedPlayer.nickname}"
                        </p>
                      </div>

                      {/* Bio Quote */}
                      <div className="bg-slate-950/80 border border-slate-900/60 rounded-xl p-4 relative">
                        <span className="text-2xl text-slate-600 font-serif absolute left-2 top-0">“</span>
                        <p className="text-xs text-slate-300 leading-relaxed pl-4 font-mono">
                          {selectedPlayer.quote}
                        </p>
                      </div>

                      {/* Fun facts */}
                      <div className="bg-slate-950/40 border border-slate-900/40 rounded-xl p-3 flex items-start gap-2.5">
                        <Info className="text-slate-500 shrink-0 mt-0.5" size={14} />
                        <div>
                          <div className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Fact File</div>
                          <p className="text-[11px] text-slate-400 leading-relaxed font-mono mt-0.5">
                            {selectedPlayer.funFact}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right attributes radar chart */}
                    <div className="h-64 flex flex-col justify-center items-center relative bg-slate-950/30 rounded-xl border border-slate-900/60 p-4">
                      <span className="absolute top-3 left-3 text-[9px] font-mono text-slate-500 tracking-wider">
                        [ATTRIBUTE MATRIX]
                      </span>
                      <ResponsiveContainer width="100%" height="90%">
                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={selectedPlayer.skills}>
                          <PolarGrid stroke="#1e293b" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} stroke="#1e293b" />
                          <Radar
                            name={selectedPlayer.name}
                            dataKey="A"
                            stroke={selectedPlayer.accentColor}
                            fill={selectedPlayer.accentColor}
                            fillOpacity={0.25}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Career Metrics Section */}
                  <div className="mt-8 border-t border-slate-900/80 pt-6">
                    <h3 className="text-xs font-mono text-slate-400 tracking-wider uppercase mb-4 flex items-center gap-1.5">
                      <TrendingUp size={14} className="text-slate-500" />
                      Statistik Karir Utama & Rekor HOF
                    </h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                      {[
                        { label: 'Points / Game', val: selectedPlayer.careerStats.ppg, max: 32, suffix: ' PPG' },
                        { label: 'Rebounds / Game', val: selectedPlayer.careerStats.rpg, max: 12, suffix: ' RPG' },
                        { label: 'Assists / Game', val: selectedPlayer.careerStats.apg, max: 10, suffix: ' APG' },
                        { label: 'Steals / Game', val: selectedPlayer.careerStats.spg, max: 2.5, suffix: ' SPG' },
                        { label: 'Blocks / Game', val: selectedPlayer.careerStats.bpg, max: 4.0, suffix: ' BPG' },
                        { label: 'Championships', val: selectedPlayer.careerStats.rings, max: 6, suffix: ' RINGS', color: '#fbbf24' }
                      ].map(stat => (
                        <div key={stat.label} className="bg-slate-950/80 border border-slate-900/80 rounded-xl p-3">
                          <div className="text-[9px] text-slate-500 font-mono truncate">{stat.label}</div>
                          <div className="text-lg font-black font-mono text-white mt-1">
                            {stat.val}{stat.suffix}
                          </div>
                          {/* Mini Progress Bar */}
                          <div className="w-full bg-slate-900 h-1 rounded overflow-hidden mt-2">
                            <motion.div 
                              className="h-full rounded" 
                              style={{ backgroundColor: stat.color || selectedPlayer.accentColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((stat.val / stat.max) * 100, 100)}%` }}
                              transition={{ duration: 0.8, delay: 0.2 }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                // HOLOGRAPHIC COMPARE MODE
                <motion.div
                  key="compare-mode-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[var(--color-neon-cyan)] to-[var(--color-neon-yellow)] opacity-35" />

                  {/* Player Selectors Dropdowns */}
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Legend A</label>
                      <select 
                        value={comparePlayerAId}
                        onChange={(e) => {
                          setComparePlayerAId(e.target.value)
                          if (soundEnabled) playSynthSound('beep')
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-[var(--color-neon-cyan)] font-bold focus:outline-none focus:border-[var(--color-neon-cyan)]"
                      >
                        {players.map(p => (
                          <option key={p.id} value={p.id} disabled={p.id === comparePlayerBId}>
                            {p.name} (#{p.jersey.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1 text-right sm:text-left">
                      <label className="text-[10px] font-mono text-slate-500 uppercase">Legend B</label>
                      <select 
                        value={comparePlayerBId}
                        onChange={(e) => {
                          setComparePlayerBId(e.target.value)
                          if (soundEnabled) playSynthSound('beep')
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs font-mono text-[var(--color-neon-yellow)] font-bold focus:outline-none focus:border-[var(--color-neon-yellow)]"
                      >
                        {players.map(p => (
                          <option key={p.id} value={p.id} disabled={p.id === comparePlayerAId}>
                            {p.name} (#{p.jersey.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Head-to-Head Compare Grid */}
                  <div className="grid md:grid-cols-5 gap-6 items-center">
                    
                    {/* Visual Player A */}
                    <div className="md:col-span-2 text-center bg-slate-950/30 border border-slate-900/60 rounded-xl p-4 relative">
                      <div className="text-[9px] font-mono absolute top-2 left-2 text-[var(--color-neon-cyan)] font-bold">[HOST_A]</div>
                      <HoloAvatar 
                        name={playerA.name} 
                        jersey={playerA.jersey} 
                        team={playerA.team} 
                        accentColor={playerA.accentColor} 
                      />
                      <h3 className="font-mono text-sm font-black text-white mt-2.5 tracking-wider uppercase">
                        {playerA.name}
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono">{playerA.team}</p>
                    </div>

                    {/* Mid Stats Rows Column */}
                    <div className="md:col-span-3 space-y-1 bg-slate-950/80 border border-slate-900 rounded-xl p-4 relative">
                      <div className="text-[9px] font-mono absolute top-2 left-3 text-slate-600">HEAD-TO-HEAD STATS</div>
                      <div className="h-4" /> {/* Space padding */}
                      
                      <StatsRow label="PPG" valA={playerA.careerStats.ppg} valB={playerB.careerStats.ppg} />
                      <StatsRow label="RPG" valA={playerA.careerStats.rpg} valB={playerB.careerStats.rpg} />
                      <StatsRow label="APG" valA={playerA.careerStats.apg} valB={playerB.careerStats.apg} />
                      <StatsRow label="SPG" valA={playerA.careerStats.spg} valB={playerB.careerStats.spg} />
                      <StatsRow label="BPG" valA={playerA.careerStats.bpg} valB={playerB.careerStats.bpg} />
                      <StatsRow label="RINGS" valA={playerA.careerStats.rings} valB={playerB.careerStats.rings} />
                    </div>
                  </div>

                  {/* Comparative Commentary debate block */}
                  <div className="mt-6 bg-slate-950 border border-slate-900 rounded-xl p-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-1.5">
                      <Activity size={12} className="text-cyan-500" />
                      Cyber Debate Analysis Engine
                    </div>
                    <p className="text-xs text-slate-400 font-mono leading-relaxed">
                      {getDebateCommentary()}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column achievements sidebar */}
          <div className="space-y-6">
            {/* Quick Achievements Box */}
            <div className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase block mb-3">
                [LEGEND HOF CREDENTIALS]
              </span>
              
              <div className="flex items-center gap-3 mb-4">
                <Award className="text-yellow-500" size={24} />
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {selectedPlayer.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedPlayer.team}</p>
                </div>
              </div>

              <div className="space-y-2">
                {selectedPlayer.achievements.map((ach, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-2 bg-slate-950/60 border border-slate-900 rounded-lg p-2.5 text-xs font-mono text-slate-300"
                  >
                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedPlayer.accentColor }} />
                    {ach}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick GOAT Meter widget */}
            <div className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden text-center">
              <span className="text-[9px] font-mono text-slate-500 tracking-wider uppercase block mb-4">
                [GOAT CONSENSUS METER]
              </span>
              
              <div className="flex justify-between items-center text-xs font-mono text-slate-400 mb-2">
                <span>MJ (6 RINGS)</span>
                <span>LBJ (ALL-TIME PT)</span>
              </div>
              
              {/* Sliding consensus gauge */}
              <div className="h-3 bg-slate-900 rounded-full border border-slate-800 p-0.5 relative overflow-hidden">
                <div className="absolute top-0 bottom-0 left-0 right-[48%] bg-red-600/40 rounded-l-full" />
                <div className="absolute top-0 bottom-0 left-[52%] right-0 bg-purple-600/40 rounded-r-full" />
                
                {/* Needle */}
                <motion.div 
                  className="absolute top-0 bottom-0 w-1 bg-white z-10"
                  animate={{ 
                    left: ['50%', '48%', '53%', '50%']
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              
              <p className="text-[10px] text-slate-500 font-mono mt-3">
                Debat tidak berujung. Keduanya adalah makhluk planet lain di era masing-masing.
              </p>
            </div>
          </div>
        </div>

        {/* Curry Arcade shooting section at the bottom */}
        <div className="mt-8">
          <CurryArcade soundEnabled={soundEnabled} />
        </div>

      </div>
    </div>
  )
}
