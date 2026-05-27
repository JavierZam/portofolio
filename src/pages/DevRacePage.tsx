import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Terminal, Trophy, Zap, Play, RotateCcw, 
  Sparkles, Keyboard, Volume2, VolumeX, AlertTriangle, PlayCircle
} from 'lucide-react'
import { 
  doc, setDoc, deleteDoc, updateDoc, onSnapshot, getDoc, 
  collection, query, getDocs, writeBatch
} from 'firebase/firestore'
import { db } from '../lib/firebase'

// Synthesize mechanical keyboard sounds via Web Audio API
const playKeyboardSound = (type: 'click' | 'clack' | 'error' | 'success' | 'buzzer') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    
    if (type === 'click') {
      // High pitch mechanical switch sound (Cherry MX Blue)
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1400, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.04)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.04)
    } else if (type === 'clack') {
      // Spacebar/Enter key bottom out sound
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(250, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.06)
      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.06)
    } else if (type === 'error') {
      // Dull low-pitch thud
      const osc1 = ctx.createOscillator()
      const gain = ctx.createGain()
      osc1.type = 'sawtooth'
      osc1.frequency.setValueAtTime(120, ctx.currentTime)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      osc1.connect(gain)
      gain.connect(ctx.destination)
      osc1.start()
      osc1.stop(ctx.currentTime + 0.12)
    } else if (type === 'success') {
      // Major scale upward chime
      const notes = [523.25, 659.25, 783.99, 1046.5]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06)
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.15)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.06)
        osc.stop(ctx.currentTime + i * 0.06 + 0.15)
      })
    } else if (type === 'buzzer') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(150, ctx.currentTime)
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    }
  } catch (e) {
    console.warn('Audio Synthesis failed:', e)
  }
}

// Code snippets categorized by language
interface Snippet {
  code: string
  lang: string
}

const SNIPPETS: Record<string, Snippet[]> = {
  javascript: [
    { code: "const res = await fetch('/api/v1/auth', { method: 'POST' });", lang: "JavaScript" },
    { code: "const users = await db.collection('users').where('active', '==', true).get();", lang: "JavaScript" },
    { code: "export default function App() { return <div className=\"noise\" />; }", lang: "JavaScript" }
  ],
  golang: [
    { code: "if err != nil { log.Fatalf(\"failed connection: %v\", err) }", lang: "Go" },
    { code: "func main() { http.ListenAndServe(\":8080\", nil) }", lang: "Go" },
    { code: "go func() { ch <- db.QueryContext(ctx, query) }()", lang: "Go" }
  ],
  python: [
    { code: "def get_user(user_id): return db.users.find_one({\"id\": user_id})", lang: "Python" },
    { code: "@app.get(\"/api/health\")\ndef health(): return {\"status\": \"ok\"}", lang: "Python" },
    { code: "with open('config.yaml', 'r') as file: config = yaml.safe_load(file)", lang: "Python" }
  ],
  css: [
    { code: ".card { display: flex; align-items: center; justify-content: center; }", lang: "CSS" },
    { code: "@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }", lang: "CSS" },
    { code: "button:hover { filter: drop-shadow(0 0 8px var(--color-neon-cyan)); }", lang: "CSS" }
  ]
}

interface Participant {
  id: string
  name: string
  progress: number
  wpm: number
  finished: boolean
  color: string
  isBot?: boolean
  wpmTarget?: number
}

export default function DevRacePage() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('bug_raid_username') || `Racer #${Math.floor(1000 + Math.random() * 9000)}`
  })
  const [selectedLang, setSelectedLang] = useState('javascript')
  const [gameState, setGameState] = useState<'setup' | 'countdown' | 'racing' | 'podium'>('setup')
  const [countdown, setCountdown] = useState(5)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Typing state variables
  const [activeSnippet, setActiveSnippet] = useState('')
  const [typedIndex, setTypedIndex] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [totalKeypresses, setTotalKeypresses] = useState(0)
  const [finishedTime, setFinishedTime] = useState<number | null>(null)

  // Opponents & racers synchronizations
  const [userId] = useState(() => {
    return localStorage.getItem('bug_raid_user_id') || `uid_${Math.random().toString(36).substr(2, 9)}`
  })
  const [opponents, setOpponents] = useState<Participant[]>([])
  
  // Bot racers logic
  const [bots, setBots] = useState<Participant[]>([])

  const startTimeRef = useRef<number | null>(null)
  const countdownInterval = useRef<number | null>(null)
  
  const triggerAudio = (type: 'click' | 'clack' | 'error' | 'success' | 'buzzer') => {
    if (soundEnabled) playKeyboardSound(type)
  }

  // --- FIRESTORE SUBSCRIPTIONS ---
  useEffect(() => {
    if (gameState === 'setup') return

    // Listen to all players in the active room
    const unsubscribe = onSnapshot(collection(db, 'dev_race_lobby', 'active', 'players'), (snap) => {
      const list: Participant[] = []
      snap.forEach((docSnap) => {
        const d = docSnap.data()
        // Skip self
        if (docSnap.id !== userId) {
          list.push({
            id: docSnap.id,
            name: d.name || 'Racer',
            progress: d.progress || 0,
            wpm: d.wpm || 0,
            finished: d.finished || false,
            color: d.color || '#3b82f6'
          })
        }
      })
      setOpponents(list)
    })

    return () => unsubscribe()
  }, [gameState, userId])

  // --- BOT SIMULATION CYCLE ---
  useEffect(() => {
    if (gameState !== 'racing') return

    const botConfig = [
      { id: 'bot_stackoverflow', name: 'StackOverflow Bot', color: '#ea580c', wpmTarget: 60 },
      { id: 'bot_copilot', name: 'Copilot Bot', color: '#a855f7', wpmTarget: 80 }
    ]

    // Create initial bots
    setBots(botConfig.map(b => ({
      ...b,
      progress: 0,
      wpm: 0,
      finished: false,
      isBot: true
    })))

    const interval = setInterval(() => {
      setBots(prevBots => {
        return prevBots.map(b => {
          if (b.finished) return b
          
          const targetSpeed = b.wpmTarget || 60
          // Random type increments matching target speed
          const charsPerSec = (targetSpeed * 5) / 60
          const increment = (charsPerSec * (0.8 + Math.random() * 0.4)) / activeSnippet.length * 100
          
          let nextProgress = b.progress + increment
          let finished = false
          if (nextProgress >= 100) {
            nextProgress = 100
            finished = true
          }

          // Calculate current simulated WPM
          const elapsedTime = (Date.now() - (startTimeRef.current || Date.now())) / 60000
          const currentWpm = Math.round((activeSnippet.length * (nextProgress / 100)) / 5 / (elapsedTime || 0.01))

          return {
            ...b,
            progress: Math.min(100, nextProgress),
            wpm: Math.min(targetSpeed + Math.floor(Math.random() * 6 - 3), currentWpm),
            finished
          }
        })
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [gameState, activeSnippet])

  // --- CORE GAME CONTROLLERS ---
  const joinLobby = async () => {
    // Generate username in local cache
    localStorage.setItem('bug_raid_username', username)
    
    // Choose a random snippet from language
    const list = SNIPPETS[selectedLang] || SNIPPETS.javascript
    const randomSnip = list[Math.floor(Math.random() * list.length)]
    setActiveSnippet(randomSnip.code)

    // Clear previous lobby players in Firestore (safety wipe)
    try {
      const lobbyQuery = collection(db, 'dev_race_lobby', 'active', 'players')
      const snapshot = await getDocs(lobbyQuery)
      
      // Clean up old sessions that might be stale
      const batch = writeBatch(db)
      snapshot.forEach(docSnap => {
        batch.delete(docSnap.ref)
      })
      await batch.commit()

      // Register self
      await setDoc(doc(db, 'dev_race_lobby', 'active', 'players', userId), {
        name: username,
        progress: 0,
        wpm: 0,
        finished: false,
        color: '#00fff7', // Neon Cyan for player
        joinedAt: Date.now()
      })
    } catch (e) {
      console.warn('Firestore lobby preparation skipped:', e)
    }

    // Move to Countdown state
    setGameState('countdown')
    setCountdown(5)
    setTypedIndex(0)
    setErrorCount(0)
    setWpm(0)
    setAccuracy(100)
    setTotalKeypresses(0)
    setFinishedTime(null)

    if (countdownInterval.current) clearInterval(countdownInterval.current)
    
    countdownInterval.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!)
          startRace()
          return 0
        }
        triggerAudio('click')
        return prev - 1
      })
    }, 1000)
  }

  const startRace = () => {
    triggerAudio('buzzer')
    setGameState('racing')
    startTimeRef.current = Date.now()
  }

  // --- KEYBOARD INPUT DISPATCHER ---
  useEffect(() => {
    if (gameState !== 'racing') return

    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore functional controls
      if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Shift') return
      
      const targetChar = activeSnippet[typedIndex]
      if (!targetChar) return

      setTotalKeypresses(prev => prev + 1)
      const isCorrect = e.key === targetChar

      if (isCorrect) {
        // Character correct
        const nextIndex = typedIndex + 1
        setTypedIndex(nextIndex)
        
        // Spacebar gets a deeper sound
        if (e.key === ' ') {
          triggerAudio('clack')
        } else {
          triggerAudio('click')
        }

        const percentage = (nextIndex / activeSnippet.length) * 100
        
        // Update WPM
        const timeElapsed = (Date.now() - (startTimeRef.current || Date.now())) / 60000 // minutes
        const calculatedWpm = Math.round((nextIndex / 5) / (timeElapsed || 0.01))
        setWpm(calculatedWpm)

        // Write progress to Firestore
        updateDoc(doc(db, 'dev_race_lobby', 'active', 'players', userId), {
          progress: Math.round(percentage),
          wpm: calculatedWpm
        }).catch(err => console.error(err))

        // Check if finished
        if (nextIndex === activeSnippet.length) {
          triggerAudio('success')
          setFinishedTime(timeElapsed * 60) // store in seconds
          setGameState('podium')
          updateDoc(doc(db, 'dev_race_lobby', 'active', 'players', userId), {
            finished: true
          }).catch(err => console.error(err))
        }

      } else {
        // Mistake typed
        triggerAudio('error')
        setErrorCount(prev => prev + 1)
      }

      // Recalculate accuracy
      setTotalKeypresses(total => {
        setErrorCount(errs => {
          const acc = total > 0 ? Math.round(((total - errs) / total) * 100) : 100
          setAccuracy(acc)
          return errs
        })
        return total
      })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, typedIndex, activeSnippet, userId])

  // Combine and sort all racers for track & podium displays
  const getLeaderboardList = () => {
    const list: Participant[] = [
      { id: userId, name: username, progress: Math.round((typedIndex / activeSnippet.length) * 100), wpm, finished: gameState === 'podium', color: '#00fff7' },
      ...opponents,
      ...bots
    ]
    return list.sort((a, b) => b.progress - a.progress)
  }

  const handleReset = () => {
    setGameState('setup')
    // Clear player session
    deleteDoc(doc(db, 'dev_race_lobby', 'active', 'players', userId)).catch(err => console.error(err))
  }

  // Code visual helper: highlight typed vs untyped chars
  const renderHighlightedCode = () => {
    return activeSnippet.split('').map((char, index) => {
      let charClass = "text-slate-400 font-mono"
      let isCurrent = index === typedIndex

      if (index < typedIndex) {
        charClass = "text-[var(--color-neon-green)] font-bold font-mono"
      }

      return (
        <span 
          key={index} 
          className={`${charClass} relative`}
          style={{
            borderBottom: isCurrent ? '2px solid #00fff7' : undefined,
            backgroundColor: isCurrent ? 'rgba(0, 255, 247, 0.08)' : undefined
          }}
        >
          {char}
          {isCurrent && (
            <motion.span 
              className="absolute left-0 bottom-0 top-0 w-[2px] bg-[var(--color-neon-cyan)]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </span>
      )
    })
  }

  return (
    <div className="noise animated-gradient min-h-screen text-slate-100 pb-20 select-none">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_bottom,rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-5xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-900">
          <Link
            to="/games"
            onClick={handleReset}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors font-mono"
          >
            <ArrowLeft size={16} /> Game Hub
          </Link>

          <div className="flex items-center gap-3">
            <Keyboard className="text-[var(--color-accent-light)] animate-pulse" size={28} />
            <h1 className="text-2xl md:text-3xl font-black font-mono tracking-wider uppercase">
              Dev Race: Typing Arena
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded bg-slate-900 border transition-colors ${soundEnabled ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-500 border-slate-800'}`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <span className="text-[10px] font-mono text-slate-500 uppercase">SPEEDTEST_v2</span>
          </div>
        </div>

        {/* --- DYNAMIC STATES RENDERER --- */}
        <AnimatePresence mode="wait">
          
          {gameState === 'setup' && (
            // LOBBY SETUP SCREEN
            <motion.div
              key="setup-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black font-mono tracking-wide text-white uppercase mb-1">
                  Persiapan Balapan
                </h2>
                <p className="text-slate-400 text-xs font-mono">
                  Ketik kode pemrograman secepat & seakurat mungkin untuk menang!
                </p>
              </div>

              {/* Username field */}
              <div className="space-y-1 font-mono">
                <label className="text-[10px] text-slate-500 uppercase">Nama Pembalap (Racer Nickname)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-[var(--color-accent-light)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              {/* Language choice selection */}
              <div className="space-y-2 font-mono">
                <label className="text-[10px] text-slate-500 uppercase">Bahasa Pemrograman</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'javascript', name: 'JS / TS' },
                    { id: 'golang', name: 'Golang' },
                    { id: 'python', name: 'Python' },
                    { id: 'css', name: 'HTML / CSS' }
                  ].map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setSelectedLang(lang.id)
                        triggerAudio('click')
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        selectedLang === lang.id 
                          ? 'border-[var(--color-accent-light)] bg-[var(--color-bg-card)] text-white shadow-glow' 
                          : 'border-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={joinLobby}
                className="w-full py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] hover:opacity-90 font-mono font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-[var(--color-accent-glow)] text-white"
              >
                <PlayCircle size={16} /> Masuk Arena Balap
              </button>
            </motion.div>
          )}

          {gameState === 'countdown' && (
            // COUNTDOWN SCREEN
            <motion.div
              key="countdown-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass border border-slate-800 rounded-3xl p-12 max-w-md mx-auto text-center space-y-4"
            >
              <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase block">
                [SYNCHRONIZING arena CLOCK]
              </span>
              <motion.div 
                key={countdown}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black font-mono text-[var(--color-accent-light)] select-none drop-shadow-glow"
              >
                {countdown}
              </motion.div>
              <p className="text-xs text-slate-400 font-mono uppercase tracking-wider animate-pulse">
                Siap-siap mengetik kode...
              </p>
            </motion.div>
          )}

          {(gameState === 'racing' || gameState === 'podium') && (
            // RACING & RESULTS ARENA SCREEN
            <motion.div
              key="racing-arena"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6 items-start"
            >
              
              {/* Left Column: Cyber Race Track */}
              <div className="md:col-span-1 glass border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block font-mono">
                  [NEON SPEEDWAY]
                </span>

                {/* Track lines representation */}
                <div className="space-y-4 bg-slate-950/80 border border-slate-900 rounded-xl p-4 relative font-mono">
                  {getLeaderboardList().map(player => (
                    <div key={player.id} className="space-y-1 relative">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`font-semibold ${player.id === userId ? 'text-[var(--color-neon-cyan)]' : 'text-slate-400'}`}>
                          {player.name} {player.isBot && <span className="text-[8px] opacity-50 bg-slate-800 px-1 rounded">BOT</span>}
                        </span>
                        <span className="text-slate-500 text-[9px]">{player.wpm} WPM</span>
                      </div>

                      {/* track lane progress */}
                      <div className="h-3 bg-slate-900 rounded-full border border-slate-850 p-0.5 relative overflow-hidden">
                        {/* Lane grids sweep */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_100%] pointer-events-none" />
                        
                        {/* Racer icon progress */}
                        <motion.div 
                          className="absolute top-0 bottom-0 w-2.5 rounded-full z-10"
                          style={{ 
                            left: `${Math.min(player.progress, 95)}%`,
                            backgroundColor: player.color,
                            boxShadow: `0 0 8px ${player.color}`
                          }}
                          transition={{ type: 'spring', stiffness: 80 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Code input terminal or Podium results */}
              <div className="md:col-span-2 space-y-6">
                
                {gameState === 'racing' ? (
                  // ACTIVE KEYBOARD TYPING INPUT SCREEN
                  <div className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-6">
                    {/* HUD metrics dashboard */}
                    <div className="grid grid-cols-3 gap-3 border-b border-slate-900 pb-4 font-mono">
                      <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500">SPEED (WPM)</div>
                        <div className="text-xl font-black text-white mt-0.5">{wpm}</div>
                      </div>
                      
                      <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500">ACCURACY</div>
                        <div className="text-xl font-black text-[var(--color-neon-cyan)] mt-0.5">{accuracy}%</div>
                      </div>

                      <div className="bg-slate-950/80 border border-slate-900 p-2.5 rounded-lg text-center">
                        <div className="text-[9px] text-slate-500">MISTAKES</div>
                        <div className="text-xl font-black text-red-500 mt-0.5">{errorCount}</div>
                      </div>
                    </div>

                    {/* Display coding snippet box */}
                    <div className="bg-slate-950 border border-slate-900 rounded-xl p-5 relative overflow-hidden min-h-[100px] flex items-center justify-start select-none">
                      {/* Laser scanning line */}
                      <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[var(--color-accent-light)] opacity-20 pointer-events-none" />
                      
                      <code className="text-sm md:text-base leading-relaxed tracking-wider break-all whitespace-pre-wrap select-none font-mono">
                        {renderHighlightedCode()}
                      </code>
                    </div>

                    <p className="text-[10px] text-slate-500 font-mono text-center">
                      🔊 Tips: Aktifkan efek suara untuk mendengarkan ketikan keyboard mekanik!
                    </p>
                  </div>
                ) : (
                  // PODIUM / WINNING SCREEN
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass border border-slate-800 rounded-2xl p-6 text-center space-y-6"
                  >
                    <Trophy className="text-yellow-500 mx-auto animate-bounce" size={48} />
                    
                    <div>
                      <h2 className="text-xl font-black font-mono tracking-wide text-white uppercase">
                        Balapan Selesai!
                      </h2>
                      <p className="text-xs text-slate-400 font-mono">
                        Hasil akhir balapan coding arena.
                      </p>
                    </div>

                    {/* Score stats summary */}
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto font-mono bg-slate-950 border border-slate-900 p-4 rounded-xl">
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase">FINAL WPM</div>
                        <div className="text-lg font-black text-white mt-1">{wpm}</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase">ACCURACY</div>
                        <div className="text-lg font-black text-[var(--color-neon-cyan)] mt-1">{accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-[8px] text-slate-500 uppercase">TIME</div>
                        <div className="text-lg font-black text-emerald-400 mt-1">
                          {finishedTime ? finishedTime.toFixed(1) : 0}s
                        </div>
                      </div>
                    </div>

                    {/* Final Podium Positions list */}
                    <div className="space-y-2 max-w-md mx-auto font-mono">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block text-left mb-2">
                        [LOBBY PODIUM OVERVIEW]
                      </span>
                      {getLeaderboardList()
                        .sort((a, b) => b.progress - a.progress)
                        .map((player, idx) => (
                          <div 
                            key={player.id}
                            className={`flex justify-between items-center p-3 rounded border text-xs ${
                              player.id === userId 
                                ? 'bg-[var(--color-bg-card)] border-[var(--color-neon-green)]/30 text-white' 
                                : 'bg-slate-950/80 border-slate-900 text-slate-400'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className={`text-[10px] font-bold ${
                                idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-300' : idx === 2 ? 'text-amber-600' : 'text-slate-600'
                              }`}>
                                #{idx + 1}
                              </span>
                              <span className="font-bold">{player.name} {player.isBot && '[BOT]'}</span>
                            </div>
                            <span className="font-bold text-slate-300 shrink-0">
                              {player.wpm} WPM {player.progress < 100 && `(${player.progress}%)`}
                            </span>
                          </div>
                        ))}
                    </div>

                    <div className="flex gap-4 max-w-md mx-auto">
                      <button
                        onClick={joinLobby}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] hover:opacity-90 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer text-white"
                      >
                        Balapan Lagi
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 font-mono font-bold text-xs rounded-xl transition-all cursor-pointer text-slate-300"
                      >
                        Kembali Ke Setup
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  )
}
