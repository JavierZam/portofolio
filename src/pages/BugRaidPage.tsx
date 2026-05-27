import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Bug, Terminal, Activity, Shield, Users, 
  Coins, Plus, Settings, Play, Sparkles, Volume2, VolumeX 
} from 'lucide-react'
import { 
  doc, setDoc, updateDoc, onSnapshot, getDoc, 
  collection, query, orderBy, limit, increment, runTransaction 
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import confetti from 'canvas-confetti'

// Synthesize retro laser/explosion sounds via Web Audio API
const playBugSynthSound = (type: 'laser' | 'crit' | 'tick' | 'victory' | 'buy' | 'spawn') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    
    if (type === 'laser') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } else if (type === 'crit') {
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc1.type = 'square'
      osc1.frequency.setValueAtTime(1000, ctx.currentTime)
      osc1.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.25)
      
      osc2.type = 'sawtooth'
      osc2.frequency.setValueAtTime(950, ctx.currentTime)
      osc2.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.25)
      
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25)
      
      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)
      
      osc1.start()
      osc2.start()
      osc1.stop(ctx.currentTime + 0.25)
      osc2.stop(ctx.currentTime + 0.25)
    } else if (type === 'tick') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, ctx.currentTime)
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } else if (type === 'buy') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(300, ctx.currentTime)
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.15)
    } else if (type === 'spawn') {
      const notes = [150, 220, 330, 440]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.2)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.08)
        osc.stop(ctx.currentTime + i * 0.08 + 0.2)
      })
    } else if (type === 'victory') {
      const notes = [523.25, 659.25, 783.99, 1046.50] // C major sweep
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.08)
        gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.08)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.08 + 0.4)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.08)
        osc.stop(ctx.currentTime + i * 0.08 + 0.4)
      })
    }
  } catch (e) {
    console.warn('Audio play error:', e)
  }
}

// Dev Classes definitions
type DevClass = 'backend' | 'frontend' | 'devops'

interface ClassConfig {
  name: string
  perk: string
  damage: number
  color: string
  effectColor: string
}

const CLASS_CONFIGS: Record<DevClass, ClassConfig> = {
  backend: {
    name: 'Backend Dev',
    perk: 'Double damage every 5 clicks (Atomic Query)',
    damage: 25,
    color: 'from-blue-600 to-indigo-700',
    effectColor: '#3b82f6',
  },
  frontend: {
    name: 'Frontend Dev',
    perk: '10 clicks activates a 5-sec passive "Flexbox Auto-Align" (20 dps)',
    damage: 12,
    color: 'from-pink-500 to-rose-600',
    effectColor: '#f43f5e',
  },
  devops: {
    name: 'DevOps Eng',
    perk: 'Earns 1 Coin per click. Buy runners for passive auto-dps.',
    damage: 8,
    color: 'from-cyan-500 to-emerald-600',
    effectColor: '#10b981',
  }
}

const BOSS_NAMES = [
  'Null Pointer Exception',
  'Out Of Memory Error',
  'Memory Leak Detected',
  'Infinite Loop Exception',
  'Database Deadlock Alert',
  'Merge Conflict Blockage',
  'YAML Indentation Nightmare',
  'CSS Center Alignment Crisis'
]

const BOSS_SVG_PATHS = {
  bug: "M10 20 L40 40 L10 60 M90 20 L60 40 L90 60 M50 10 L50 90 M25 50 L75 50",
  overload: "M20 50 A 30 30 0 1 1 80 50 L 50 50 Z",
  spaghetti: "M10 10 Q 50 90 90 10 T 50 90 T 10 50 T 90 50",
}

export default function BugRaidPage() {
  const [selectedClass, setSelectedClass] = useState<DevClass | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)
  
  // Game states
  const [bossName, setBossName] = useState('Loading...')
  const [bossHp, setBossHp] = useState(5000)
  const [bossMaxHp, setBossMaxHp] = useState(5000)
  const [bossIndex, setBossIndex] = useState(1)
  const [bossSvgType, setBossSvgType] = useState<'bug' | 'overload' | 'spaghetti'>('bug')
  
  // Player statistics
  const [coins, setCoins] = useState(0)
  const [runners, setRunners] = useState(0)
  const [runnerCost, setRunnerCost] = useState(20)
  const [combo, setCombo] = useState(0)
  const [isFlexing, setIsFlexing] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  
  // UI states
  const [floatingDamage, setFloatingDamage] = useState<{ id: number; x: number; y: number; text: string; isCrit?: boolean }[]>([])
  const [isHit, setIsHit] = useState(false)
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('bug_raid_username') || `Dev #${Math.floor(1000 + Math.random() * 9000)}`
  })
  const [isEditingName, setIsEditingName] = useState(false)
  const [userId] = useState(() => {
    let id = localStorage.getItem('bug_raid_user_id')
    if (!id) {
      id = `uid_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('bug_raid_user_id', id)
    }
    return id
  })

  // Global contributors state
  const [leaderboard, setLeaderboard] = useState<{ name: string; damage: number }[]>([])

  // Buffered writes to prevent database throttling
  const accumulatedDamage = useRef(0)
  const flushTimer = useRef<number | null>(null)

  // Web Audio trigger helper
  const triggerSound = (type: 'laser' | 'crit' | 'tick' | 'victory' | 'buy' | 'spawn') => {
    if (soundEnabled) playBugSynthSound(type)
  }

  // --- FIRESTORE SUBSCRIPTIONS ---
  useEffect(() => {
    // 1. Subscribe to active Boss Document
    const unsubscribeBoss = onSnapshot(doc(db, 'bug_raid_boss', 'active'), (snap) => {
      if (snap.exists()) {
        const data = snap.data()
        setBossName(data.name || 'System Bug')
        setBossHp(data.currentHp)
        setBossMaxHp(snap.data().maxHp || 5000)
        setBossIndex(data.bossIndex || 1)
        
        // Match SVG icon structure
        const idx = data.bossIndex || 1
        if (idx % 3 === 1) setBossSvgType('bug')
        else if (idx % 3 === 2) setBossSvgType('overload')
        else setBossSvgType('spaghetti')
      } else {
        // Initialize doc if missing
        initializeNewBoss(1)
      }
    })

    // 2. Subscribe to Contributor Leaderboard (Top 8 tappers)
    const q = query(
      collection(db, 'bug_raid_contributors'),
      orderBy('damage', 'desc'),
      limit(8)
    )
    const unsubscribeLeaderboard = onSnapshot(q, (snap) => {
      const list: { name: string; damage: number }[] = []
      snap.forEach((docSnap) => {
        const d = docSnap.data()
        list.push({
          name: d.name || 'Anonymous Dev',
          damage: d.damage || 0
        })
      })
      setLeaderboard(list)
    })

    return () => {
      unsubscribeBoss()
      unsubscribeLeaderboard()
      if (flushTimer.current) clearInterval(flushTimer.current)
    }
  }, [])

  // Create a new progressive boss in Firestore
  const initializeNewBoss = async (index: number) => {
    try {
      const name = BOSS_NAMES[(index - 1) % BOSS_NAMES.length]
      const maxHp = 5000 * index
      
      triggerSound('spawn')
      await setDoc(doc(db, 'bug_raid_boss', 'active'), {
        name,
        maxHp,
        currentHp: maxHp,
        bossIndex: index
      })
    } catch (e) {
      console.error('Failed to init boss:', e)
    }
  }

  // --- DAMAGE BUFFER FLUSH LOOP ---
  // Rather than writing on every click, we buffer the damage locally and flush it every 1.5s
  const queueDamage = (damage: number) => {
    accumulatedDamage.current += damage
    
    // Optimistic UI updates
    setBossHp(prev => Math.max(0, prev - damage))

    if (!flushTimer.current) {
      flushTimer.current = window.setInterval(flushBuffer, 1200)
    }
  }

  const flushBuffer = async () => {
    if (accumulatedDamage.current <= 0) return
    const damageToApply = accumulatedDamage.current
    accumulatedDamage.current = 0

    try {
      // Use firestore transaction to atomically subtract HP and avoid races
      await runTransaction(db, async (transaction) => {
        const bossDocRef = doc(db, 'bug_raid_boss', 'active')
        const bossSnap = await transaction.get(bossDocRef)
        
        if (!bossSnap.exists()) return

        const currentHp = bossSnap.data().currentHp
        const index = bossSnap.data().bossIndex || 1

        if (currentHp <= 0) {
          // Boss already defeated by someone else
          return
        }

        const newHp = currentHp - damageToApply
        
        if (newHp <= 0) {
          // We got the final hit! Victory transition
          transaction.update(bossDocRef, { currentHp: 0 })
          // Spawn next boss trigger
          setTimeout(() => {
            initializeNewBoss(index + 1)
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
            triggerSound('victory')
          }, 1000)
        } else {
          // Regular damage deduction
          transaction.update(bossDocRef, { currentHp: newHp })
        }
      })

      // Update player damage profile
      const userRef = doc(db, 'bug_raid_contributors', userId)
      await setDoc(userRef, {
        name: username,
        damage: increment(damageToApply)
      }, { merge: true })

    } catch (e) {
      console.error('Failed to flush damage buffer:', e)
    }
  }

  // --- PASSIVE AUTO-DAMAGE (DEVOPS CLOUD RUNNERS & FRONTEND FLEX CODES) ---
  useEffect(() => {
    const timer = setInterval(() => {
      let passiveDamage = 0
      
      // DevOps cloud server passive damage
      if (selectedClass === 'devops' && runners > 0) {
        passiveDamage += runners * 5
      }

      // Frontend flexbox combo passive damage
      if (selectedClass === 'frontend' && isFlexing) {
        passiveDamage += 20
      }

      if (passiveDamage > 0 && bossHp > 0) {
        queueDamage(passiveDamage)
        triggerSound('tick')
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [selectedClass, runners, isFlexing, bossHp])

  // --- ACTIONS HANDLERS ---
  const handleBossClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!selectedClass || bossHp <= 0) return

    const config = CLASS_CONFIGS[selectedClass]
    let currentDmg = config.damage
    let isCrit = false

    // Backend perk: critical queries
    if (selectedClass === 'backend') {
      const nextClicks = clickCount + 1
      setClickCount(nextClicks)
      if (nextClicks % 5 === 0) {
        currentDmg = config.damage * 4 // Critical 4x hit!
        isCrit = true
        triggerSound('crit')
      } else {
        triggerSound('laser')
      }
    }

    // Frontend perk: active combo multiplier
    if (selectedClass === 'frontend') {
      triggerSound('laser')
      const nextCombo = combo + 1
      setCombo(nextCombo)
      
      if (nextCombo >= 10 && !isFlexing) {
        setIsFlexing(true)
        setCombo(0)
        triggerSound('crit')
        
        // Turn off passive flexbox re-alignment after 5 seconds
        setTimeout(() => {
          setIsFlexing(false)
        }, 5000)
      }
    }

    // DevOps perk: earn coins
    if (selectedClass === 'devops') {
      triggerSound('laser')
      setCoins(prev => prev + 1)
    }

    // Hit animation flash
    setIsHit(true)
    setTimeout(() => setIsHit(false), 80)

    // Damage floating text
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newText = {
      id: Date.now() + Math.random(),
      x,
      y,
      text: isCrit ? `CRIT -${currentDmg}!` : `-${currentDmg}`,
      isCrit
    }
    setFloatingDamage(prev => [...prev, newText])
    
    // Remove floating text
    setTimeout(() => {
      setFloatingDamage(prev => prev.filter(item => item.id !== newText.id))
    }, 800)

    // Inflict damage
    queueDamage(currentDmg)
  }

  // DevOps runner upgrade handler
  const handleBuyRunner = () => {
    if (coins < runnerCost) return
    triggerSound('buy')
    setCoins(prev => prev - runnerCost)
    setRunners(prev => prev + 1)
    setRunnerCost(prev => Math.round(prev * 1.25))
  }

  const saveUsername = (newName: string) => {
    const trimmed = newName.trim().slice(0, 20)
    if (trimmed.length > 0) {
      setUsername(trimmed)
      localStorage.setItem('bug_raid_username', trimmed)
      
      // Update Firestore profile
      const userRef = doc(db, 'bug_raid_contributors', userId)
      setDoc(userRef, { name: trimmed }, { merge: true }).catch(err => console.error(err))
    }
    setIsEditingName(false)
  }

  // Render loading state if boss state is not sync'd yet
  const hpPercentage = bossHp > 0 ? (bossHp / bossMaxHp) * 100 : 0

  return (
    <div className="noise animated-gradient min-h-screen text-slate-100 pb-20 select-none">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_bottom,rgba(57,255,20,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(57,255,20,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-6xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-900">
          <Link
            to="/games"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft size={16} /> Game Hub
          </Link>

          <div className="flex items-center gap-3">
            <Bug className="text-[var(--color-neon-green)] animate-bounce" size={28} />
            <h1 className="text-2xl md:text-3xl font-black font-mono tracking-wider uppercase">
              Bug Raid: Global Co-op
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Audio Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled)
                if (!soundEnabled) playBugSynthSound('tick')
              }}
              className={`p-2 rounded bg-slate-900 border transition-colors ${soundEnabled ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-500 border-slate-800'}`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Profile name tag */}
            <div className="flex items-center gap-2 text-xs font-mono">
              {isEditingName ? (
                <input
                  type="text"
                  maxLength={20}
                  defaultValue={username}
                  onBlur={(e) => saveUsername(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveUsername(e.currentTarget.value)
                  }}
                  className="bg-slate-950 border border-[var(--color-neon-green)] rounded px-2 py-1 text-white focus:outline-none text-[11px] w-32"
                  autoFocus
                />
              ) : (
                <button 
                  onClick={() => setIsEditingName(true)}
                  className="text-slate-300 hover:text-[var(--color-neon-green)] transition-colors border border-slate-800 bg-slate-950 px-3 py-1 rounded"
                >
                  IGN: <span className="font-bold text-white">{username}</span> ✏️
                </button>
              )}
            </div>
          </div>
        </div>

        {/* --- MAIN GAME SCREEN CONTAINER --- */}
        <AnimatePresence mode="wait">
          {!selectedClass ? (
            // CLASS SELECTION SCREEN
            <motion.div
              key="class-select"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-2xl mx-auto text-center"
            >
              <h2 className="text-2xl font-black font-mono tracking-wide text-white uppercase mb-2">
                Pilih Kelas Developer Kamu
              </h2>
              <p className="text-slate-400 text-xs font-mono max-w-md mx-auto mb-8">
                Setiap kelas memiliki damage unik dan spesifikasi keahlian coding tersendiri untuk mengalahkan bug server.
              </p>

              <div className="grid sm:grid-cols-3 gap-6">
                {(Object.keys(CLASS_CONFIGS) as DevClass[]).map(c => {
                  const conf = CLASS_CONFIGS[c]
                  return (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedClass(c)
                        triggerSound('spawn')
                      }}
                      className="glass border border-slate-800 rounded-2xl p-5 hover:glow-border cursor-pointer transition-all flex flex-col items-center hover:-translate-y-1 relative group"
                    >
                      {/* Hover glowing background card */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-10 rounded-2xl blur-lg transition-opacity"
                        style={{ backgroundColor: conf.effectColor }}
                      />
                      
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${conf.color} flex items-center justify-center text-white mb-4`}>
                        {c === 'backend' && <Terminal size={24} />}
                        {c === 'frontend' && <Sparkles size={24} />}
                        {c === 'devops' && <Settings size={24} />}
                      </div>

                      <h3 className="font-bold text-sm text-white mb-2">{conf.name}</h3>
                      <p className="text-[10px] text-slate-400 font-mono leading-relaxed h-12 flex items-center justify-center">
                        {conf.perk}
                      </p>
                      
                      <span className="text-[10px] text-[var(--color-neon-green)] font-mono font-bold mt-4 uppercase">
                        BASE DMG: {conf.damage}
                      </span>
                    </button>
                  )
                })}
              </div>
            </motion.div>
          ) : (
            // IN-GAME PANEL
            <motion.div
              key="game-active"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-4 gap-6 items-start"
            >
              
              {/* Left Column stats & class details */}
              <div className="space-y-4 font-mono">
                
                {/* Active class details */}
                <div className="glass border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-3">
                    [ACTIVE CLASS PROFILE]
                  </span>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${CLASS_CONFIGS[selectedClass].color} flex items-center justify-center text-white`}>
                      {selectedClass === 'backend' && <Terminal size={20} />}
                      {selectedClass === 'frontend' && <Sparkles size={20} />}
                      {selectedClass === 'devops' && <Settings size={20} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{CLASS_CONFIGS[selectedClass].name}</h3>
                      <button 
                        onClick={() => {
                          setSelectedClass(null)
                          setCombo(0)
                          setIsFlexing(false)
                          setRunners(0)
                        }}
                        className="text-[9px] text-red-400 hover:text-red-300 transition-colors uppercase font-bold"
                      >
                        Ganti Kelas
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-900 pt-3 text-[11px] text-slate-400 leading-relaxed">
                    <span className="text-white font-bold">Perk:</span> {CLASS_CONFIGS[selectedClass].perk}
                  </div>
                </div>

                {/* DevOps Idle Shop OR Frontend Combo Meter widget */}
                {selectedClass === 'devops' && (
                  <div className="glass border border-slate-800 rounded-2xl p-5">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-3 flex items-center gap-1">
                      <Coins size={10} className="text-yellow-500" /> Cloud Runner Upgrades
                    </span>
                    
                    <div className="flex justify-between items-center bg-slate-950 p-2.5 rounded-lg border border-slate-900 mb-4">
                      <div>
                        <div className="text-[9px] text-slate-500">COINS POOL</div>
                        <div className="text-lg font-black text-yellow-500">{coins} 🪙</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-slate-500">PASSIVE RUNNERS</div>
                        <div className="text-sm font-bold text-white text-right">{runners} VPS</div>
                      </div>
                    </div>

                    <button
                      onClick={handleBuyRunner}
                      disabled={coins < runnerCost}
                      className="w-full py-2 bg-emerald-950/20 hover:bg-emerald-500 border border-emerald-500/30 text-emerald-400 hover:text-black font-bold text-xs rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed uppercase flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} /> Beli Cloud Runner ({runnerCost} Coins)
                    </button>
                    <p className="text-[9px] text-slate-500 text-center mt-2">
                      Masing-masing runner memberikan passive damage +5 HP/detik secara otomatis.
                    </p>
                  </div>
                )}

                {selectedClass === 'frontend' && (
                  <div className="glass border border-slate-800 rounded-2xl p-5 text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-4">
                      [COMBO FLEX CHARGE]
                    </span>

                    {isFlexing ? (
                      <div className="py-6 text-sm font-black text-pink-500 animate-pulse uppercase tracking-wider">
                        Flexbox Auto-Aligning...<br />
                        <span className="text-xs font-semibold text-white mt-1 block">+20 DPS (Passive)</span>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="text-3xl font-black text-white">{combo} / 10</div>
                        <div className="h-2.5 bg-slate-900 rounded-full border border-slate-800 overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                            style={{ width: `${combo * 10}%` }}
                          />
                        </div>
                        <p className="text-[9px] text-slate-500">
                          Klik bug 10x berturut-turut untuk menyalakan passive alignment otomatis!
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {selectedClass === 'backend' && (
                  <div className="glass border border-slate-800 rounded-2xl p-5 text-center">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-4">
                      [SQL QUERY BUFFER]
                    </span>
                    <div className="space-y-2">
                      <div className="text-2xl font-black text-white">{(clickCount % 5)} / 5</div>
                      <div className="grid grid-cols-5 gap-1">
                        {[0, 1, 2, 3, 4].map(idx => (
                          <div 
                            key={idx}
                            className={`h-2 rounded ${idx < (clickCount % 5) ? 'bg-blue-500 shadow-glow' : 'bg-slate-900 border border-slate-850'}`}
                          />
                        ))}
                      </div>
                      <p className="text-[9px] text-slate-500 leading-normal">
                        Klik ke-5 akan memicu *Atomic Query* yang menghasilkan **100 CRITICAL DAMAGE**!
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Center Column: Interactive Boss Tapper */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Boss Healthbar Panel */}
                <div className="glass border border-slate-800 rounded-2xl p-6 text-center space-y-4">
                  <div>
                    <span className="text-[9px] text-red-500 font-bold font-mono tracking-widest block mb-1 uppercase">
                      [LIVE BOSS TARGET INDEX #{bossIndex}]
                    </span>
                    <h2 className="text-xl md:text-2xl font-black font-mono text-white tracking-wide">
                      {bossName.toUpperCase()}
                    </h2>
                  </div>

                  {/* HP Bar */}
                  <div className="space-y-1 font-mono">
                    <div className="h-6 bg-slate-950 rounded-lg border border-slate-900 p-0.5 relative overflow-hidden flex items-center justify-center">
                      {/* Filling HP bar */}
                      <div 
                        className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-800 via-red-600 to-rose-500 transition-all duration-300"
                        style={{ width: `${hpPercentage}%` }}
                      />
                      {/* HP Numbers */}
                      <span className="relative z-10 text-[10px] font-black text-white tracking-widest drop-shadow-md">
                        {bossHp} / {bossMaxHp} HP ({Math.round(hpPercentage)}%)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Boss Click Area */}
                <div 
                  onClick={handleBossClick}
                  className={`bg-slate-950 rounded-3xl border border-slate-900 h-80 relative overflow-hidden flex items-center justify-center cursor-pointer transition-all active:scale-[0.98] ${
                    isHit ? 'border-red-500/40 shadow-[inset_0_0_20px_rgba(239,68,68,0.15)] bg-slate-950' : 'hover:border-slate-800 hover:bg-slate-950/80'
                  }`}
                >
                  {/* Cyber Grid sweep overlay */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

                  {/* Laser line overlay */}
                  <motion.div 
                    className="absolute left-0 right-0 h-[2px] opacity-15"
                    style={{ background: `linear-gradient(to right, transparent, ${CLASS_CONFIGS[selectedClass].effectColor}, transparent)` }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />

                  {/* Interactive floating damage texts */}
                  <AnimatePresence>
                    {floatingDamage.map(item => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 1, scale: item.isCrit ? 1.4 : 1, y: item.y - 10 }}
                        animate={{ opacity: 0, y: item.y - 120, scale: item.isCrit ? 1.6 : 0.8 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className={`absolute font-mono font-black select-none pointer-events-none drop-shadow-md ${
                          item.isCrit ? 'text-yellow-400 text-lg' : 'text-red-500 text-sm'
                        }`}
                        style={{ left: item.x - 20 }}
                      >
                        {item.text}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* Render animated custom vector boss shapes */}
                  {bossHp > 0 ? (
                    <motion.svg 
                      className={`w-40 h-40 ${isHit ? 'text-red-500 filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]' : 'text-slate-400 group-hover:text-slate-200'}`} 
                      viewBox="0 0 100 100"
                      animate={
                        isHit 
                          ? { x: [0, -6, 6, -3, 3, 0], y: [0, 4, -4, 2, -2, 0] }
                          : { y: [-10, 10, -10], rotate: [-2, 2, -2] }
                      }
                      transition={
                        isHit 
                          ? { duration: 0.15 } 
                          : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
                      }
                    >
                      {/* Laser scanner target crosshair */}
                      <circle cx="50" cy="50" r="45" stroke="#1e293b" strokeWidth="0.5" fill="none" strokeDasharray="3, 3" />
                      <circle cx="50" cy="50" r="30" stroke="#1e293b" strokeWidth="0.5" fill="none" />
                      
                      {/* Main boss vector path */}
                      <path 
                        d={BOSS_SVG_PATHS[bossSvgType]} 
                        stroke="currentColor" 
                        strokeWidth="3.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        fill="none" 
                      />

                      {/* Flashing core */}
                      <circle cx="50" cy="50" r="6" className={bossHp < (bossMaxHp * 0.3) ? 'fill-red-500 animate-ping' : 'fill-slate-600'} />
                    </motion.svg>
                  ) : (
                    // BOSS DEFEATED ANIMATION
                    <motion.div 
                      className="text-center font-mono"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Sparkles className="text-yellow-500 mx-auto animate-spin mb-4" size={48} />
                      <h3 className="text-xl font-black text-[var(--color-neon-green)] tracking-wider">BUG DEFEATED!</h3>
                      <p className="text-xs text-slate-500 mt-1">Mengunduh patch server berikutnya...</p>
                    </motion.div>
                  )}
                </div>

                <p className="text-center text-[10px] text-slate-500 font-mono">
                  💡 Tips: Klik area bug di atas secara beruntun. Kelas DevOps dan Frontend memicu passive damage!
                </p>
              </div>

              {/* Right Column: Live Global Leaderboard & Contributors */}
              <div className="space-y-4 font-mono">
                
                {/* Active Session counters */}
                <div className="glass border border-slate-800 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                    <Users size={16} className="text-cyan-400" /> Tappers Network
                  </div>
                  <span className="text-xs font-black text-emerald-400 animate-pulse bg-emerald-950/20 px-2 py-0.5 border border-emerald-500/20 rounded">
                    ONLINE: CO-OP
                  </span>
                </div>

                {/* Top tappers leaderboard */}
                <div className="glass border border-slate-800 rounded-2xl p-5">
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-4">
                    [TOP CONTRIBUTOR RANKING]
                  </span>
                  
                  <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                    {leaderboard.length > 0 ? (
                      leaderboard.map((user, idx) => (
                        <div 
                          key={idx}
                          className={`flex justify-between items-center p-2 rounded border text-xs ${
                            user.name === username 
                              ? 'bg-[var(--color-bg-card)] border-[var(--color-neon-green)]/30 text-white' 
                              : 'bg-slate-950/80 border-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`text-[10px] font-bold ${
                              idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'
                            }`}>
                              #{idx + 1}
                            </span>
                            <span className="truncate max-w-[90px] font-semibold">{user.name}</span>
                          </div>
                          <span className="font-bold text-slate-400 shrink-0">
                            {user.damage.toLocaleString()} HP
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[10px] text-slate-600 text-center py-8">
                        Belum ada data tappers. Jadilah penyelamat server pertama!
                      </p>
                    )}
                  </div>
                </div>

              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
