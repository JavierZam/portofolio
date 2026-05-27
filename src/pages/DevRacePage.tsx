import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Terminal, Trophy, Zap, Play, RotateCcw, 
  Sparkles, Keyboard, Volume2, VolumeX, AlertTriangle, 
  PlayCircle, Users, Copy, Check, LogOut, Swords
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

// Expanded code snippets db (8 snippets per language)
interface Snippet {
  code: string
  lang: string
}

const SNIPPETS: Record<string, Snippet[]> = {
  javascript: [
    { code: "const res = await fetch('/api/v1/auth', { method: 'POST' });", lang: "JavaScript" },
    { code: "const users = await db.collection('users').where('active', '==', true).get();", lang: "JavaScript" },
    { code: "export default function App() { return <div className=\"noise\" />; }", lang: "JavaScript" },
    { code: "const middleware = (req, res, next) => { console.log(req.path); next(); };", lang: "JavaScript" },
    { code: "const [count, setCount] = useState(() => calculateInitialCount());", lang: "JavaScript" },
    { code: "const getAverage = arr => arr.reduce((a, b) => a + b, 0) / arr.length;", lang: "JavaScript" },
    { code: "const filtered = data.filter(item => item.score > 80 && item.verified);", lang: "JavaScript" },
    { code: "import { createRoot } from 'react-dom/client'; import './index.css';", lang: "JavaScript" }
  ],
  golang: [
    { code: "if err != nil { log.Fatalf(\"failed connection: %v\", err) }", lang: "Go" },
    { code: "func main() { http.ListenAndServe(\":8080\", nil) }", lang: "Go" },
    { code: "go func() { ch <- db.QueryContext(ctx, query) }()", lang: "Go" },
    { code: "type User struct { ID string `json:\"id\"`; Name string `json:\"name\"` }", lang: "Go" },
    { code: "defer resp.Body.Close(); body, err := io.ReadAll(resp.Body)", lang: "Go" },
    { code: "for i := 0; i < len(items); i++ { fmt.Println(items[i]) }", lang: "Go" },
    { code: "c.JSON(http.StatusOK, gin.H{\"status\": \"ok\", \"data\": result})", lang: "Go" },
    { code: "select { case msg := <-ch: fmt.Println(msg) default: time.Sleep(100) }", lang: "Go" }
  ],
  python: [
    { code: "def get_user(user_id): return db.users.find_one({\"id\": user_id})", lang: "Python" },
    { code: "@app.get(\"/api/health\")\ndef health(): return {\"status\": \"ok\"}", lang: "Python" },
    { code: "with open('config.yaml', 'r') as file: config = yaml.safe_load(file)", lang: "Python" },
    { code: "users = [user for user in db_users if user['active'] and user['age'] > 18]", lang: "Python" },
    { code: "try:\n    response = requests.post(url, json=data)\nexcept Exception as e:\n    print(e)", lang: "Python" },
    { code: "import pandas as pd; df = pd.read_csv('dataset.csv'); print(df.head())", lang: "Python" },
    { code: "class DatabaseConnection:\n    def __init__(self): self.connected = True", lang: "Python" },
    { code: "results = list(map(lambda x: x * 2, filter(lambda x: x % 2 == 0, numbers)))", lang: "Python" }
  ],
  css: [
    { code: ".card { display: flex; align-items: center; justify-content: center; }", lang: "CSS" },
    { code: "@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }", lang: "CSS" },
    { code: "button:hover { filter: drop-shadow(0 0 8px var(--color-neon-cyan)); }", lang: "CSS" },
    { code: "<div className=\"flex items-center justify-between min-h-screen\">", lang: "CSS" },
    { code: "@keyframes pulse { 0% { opacity: 0.3; } 100% { opacity: 1; } }", lang: "CSS" },
    { code: ".container { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); }", lang: "CSS" },
    { code: "<form onSubmit={handleSubmit} className=\"glass border p-6 rounded-2xl\">", lang: "CSS" },
    { code: "body { font-family: 'Outfit', sans-serif; background-color: var(--color-bg); }", lang: "CSS" }
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
  const [gameState, setGameState] = useState<'setup' | 'lobby' | 'countdown' | 'racing' | 'podium'>('setup')
  const [countdown, setCountdown] = useState(5)
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Rooms logic states
  const [roomCode, setRoomCode] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [enableBots, setEnableBots] = useState(true)
  const [joinError, setJoinError] = useState('')
  const [copied, setCopied] = useState(false)

  // Typing states
  const [activeSnippet, setActiveSnippet] = useState('')
  const [typedIndex, setTypedIndex] = useState(0)
  const [errorCount, setErrorCount] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [totalKeypresses, setTotalKeypresses] = useState(0)
  const [finishedTime, setFinishedTime] = useState<number | null>(null)

  // Racers sync array
  const [userId] = useState(() => {
    return localStorage.getItem('bug_raid_user_id') || `uid_${Math.random().toString(36).substr(2, 9)}`
  })
  const [lobbyPlayers, setLobbyPlayers] = useState<Participant[]>([])
  const [bots, setBots] = useState<Participant[]>([])

  const startTimeRef = useRef<number | null>(null)
  const countdownInterval = useRef<number | null>(null)
  
  const triggerAudio = (type: 'click' | 'clack' | 'error' | 'success' | 'buzzer') => {
    if (soundEnabled) playKeyboardSound(type)
  }

  // --- FIRESTORE ACTIVE ROOM & LOBBY SUBSCRIPTION ---
  useEffect(() => {
    if (!roomCode) return

    // 1. Subscribe to Room Document to monitor status changes (countdown, racing, closing)
    const unsubscribeRoom = onSnapshot(doc(db, 'dev_race_lobby', roomCode), (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        setEnableBots(d.enableBots ?? true)
        setActiveSnippet(d.snippet || '')
        setSelectedLang(d.language || 'javascript')

        // If status changed to countdown, sync local countdown start
        if (d.status === 'countdown' && gameState === 'lobby') {
          startCountdownFlow()
        }
      } else {
        // Room was closed/deleted
        if (gameState !== 'setup') {
          alert('Room telah dibubarkan oleh Host.')
          handleLeaveRoom()
        }
      }
    })

    // 2. Subscribe to Players Subcollection to track connected racers in real-time
    const playersRef = collection(db, 'dev_race_lobby', roomCode, 'players')
    const unsubscribePlayers = onSnapshot(playersRef, (snap) => {
      const list: Participant[] = []
      snap.forEach((docSnap) => {
        const d = docSnap.data()
        list.push({
          id: docSnap.id,
          name: d.name || 'Racer',
          progress: d.progress || 0,
          wpm: d.wpm || 0,
          finished: d.finished || false,
          color: d.color || '#3b82f6'
        })
      })
      setLobbyPlayers(list)
    })

    return () => {
      unsubscribeRoom()
      unsubscribePlayers()
    }
  }, [roomCode, gameState])

  // --- BOT SIMULATION CYCLE (RACING MODE) ---
  useEffect(() => {
    if (gameState !== 'racing' || !enableBots) return

    const botConfig = [
      { id: 'bot_stackoverflow', name: 'StackOverflow Bot', color: '#ea580c', wpmTarget: 60 },
      { id: 'bot_copilot', name: 'Copilot Bot', color: '#a855f7', wpmTarget: 80 }
    ]

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
          const charsPerSec = (targetSpeed * 5) / 60
          const increment = (charsPerSec * (0.8 + Math.random() * 0.4)) / activeSnippet.length * 100
          
          let nextProgress = b.progress + increment
          let finished = false
          if (nextProgress >= 100) {
            nextProgress = 100
            finished = true
          }

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
  }, [gameState, activeSnippet, enableBots])

  // --- ROOM HANDLERS ---
  const handleCreateRoom = async () => {
    // Generate code ABCD
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    
    // Choose random language snippet
    const list = SNIPPETS[selectedLang] || SNIPPETS.javascript
    const randomSnip = list[Math.floor(Math.random() * list.length)]
    
    localStorage.setItem('bug_raid_username', username)
    setJoinError('')

    try {
      // 1. Create Room Document
      await setDoc(doc(db, 'dev_race_lobby', code), {
        code,
        language: selectedLang,
        snippet: randomSnip.code,
        status: 'waiting',
        hostId: userId,
        enableBots,
        createdAt: Date.now()
      })

      // 2. Add Host to Players subcollection
      await setDoc(doc(db, 'dev_race_lobby', code, 'players', userId), {
        name: username,
        progress: 0,
        wpm: 0,
        finished: false,
        color: '#00fff7', // Neon cyan
        joinedAt: Date.now()
      })

      setRoomCode(code)
      setIsHost(true)
      setActiveSnippet(randomSnip.code)
      setGameState('lobby')
    } catch (e) {
      console.error('Failed to create room:', e)
      setJoinError('Gagal membuat room. Silakan coba lagi.')
    }
  }

  const handleJoinRoom = async () => {
    const code = roomInput.trim().toUpperCase()
    if (code.length !== 4) {
      setJoinError('Kode room harus 4 karakter!')
      return
    }
    
    localStorage.setItem('bug_raid_username', username)
    setJoinError('')

    try {
      const roomRef = doc(db, 'dev_race_lobby', code)
      const roomSnap = await getDoc(roomRef)

      if (!roomSnap.exists()) {
        setJoinError('Room tidak ditemukan!')
        return
      }

      const rData = roomSnap.data()
      if (rData.status !== 'waiting') {
        setJoinError('Game sudah dimulai di room ini!')
        return
      }

      // Add to Players subcollection
      const playerColors = ['#f43f5e', '#eab308', '#10b981', '#a855f7', '#3b82f6']
      const color = playerColors[Math.floor(Math.random() * playerColors.length)]
      
      await setDoc(doc(db, 'dev_race_lobby', code, 'players', userId), {
        name: username,
        progress: 0,
        wpm: 0,
        finished: false,
        color,
        joinedAt: Date.now()
      })

      setRoomCode(code)
      setIsHost(false)
      setActiveSnippet(rData.snippet)
      setSelectedLang(rData.language)
      setGameState('lobby')
    } catch (e) {
      console.error('Failed to join room:', e)
      setJoinError('Gagal masuk room.')
    }
  }

  const startCountdownFlow = () => {
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

  const handleStartRace = async () => {
    if (!isHost) return
    triggerAudio('click')

    try {
      // Set room status to countdown
      await updateDoc(doc(db, 'dev_race_lobby', roomCode), {
        status: 'countdown'
      })
    } catch (e) {
      console.error('Failed to start countdown:', e)
    }
  }

  const startRace = () => {
    triggerAudio('buzzer')
    setGameState('racing')
    startTimeRef.current = Date.now()
  }

  const handleLeaveRoom = async () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current)
    
    if (roomCode) {
      try {
        await deleteDoc(doc(db, 'dev_race_lobby', roomCode, 'players', userId))
        if (isHost) {
          // Host leaving deletes the entire room
          await deleteDoc(doc(db, 'dev_race_lobby', roomCode))
        }
      } catch (e) {
        console.warn('Cleanup failed:', e)
      }
    }
    
    setRoomCode('')
    setIsHost(false)
    setGameState('setup')
    setBots([])
  }

  // --- KEYBOARD KEYLISTENERS ---
  useEffect(() => {
    if (gameState !== 'racing') return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey || e.key === 'Shift') return
      
      const targetChar = activeSnippet[typedIndex]
      if (!targetChar) return

      setTotalKeypresses(prev => prev + 1)
      const isCorrect = e.key === targetChar

      if (isCorrect) {
        const nextIndex = typedIndex + 1
        setTypedIndex(nextIndex)
        
        if (e.key === ' ') {
          triggerAudio('clack')
        } else {
          triggerAudio('click')
        }

        const percentage = (nextIndex / activeSnippet.length) * 100
        const timeElapsed = (Date.now() - (startTimeRef.current || Date.now())) / 60000
        const calculatedWpm = Math.round((nextIndex / 5) / (timeElapsed || 0.01))
        setWpm(calculatedWpm)

        // Write progress to subcollection
        updateDoc(doc(db, 'dev_race_lobby', roomCode, 'players', userId), {
          progress: Math.round(percentage),
          wpm: calculatedWpm
        }).catch(err => console.error(err))

        if (nextIndex === activeSnippet.length) {
          triggerAudio('success')
          setFinishedTime(timeElapsed * 60)
          setGameState('podium')
          updateDoc(doc(db, 'dev_race_lobby', roomCode, 'players', userId), {
            finished: true
          }).catch(err => console.error(err))
        }

      } else {
        triggerAudio('error')
        setErrorCount(prev => prev + 1)
      }

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
  }, [gameState, typedIndex, activeSnippet, roomCode, userId])

  // Get combined list of players & simulated bots sorted by progress
  const getLeaderboardList = () => {
    const list = [...lobbyPlayers]
    
    // Add local simulated bots if enabled
    if (enableBots && gameState === 'racing') {
      list.push(...bots)
    }

    return list.sort((a, b) => b.progress - a.progress)
  }

  // Copy room code utility
  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    triggerAudio('click')
    setTimeout(() => setCopied(false), 2000)
  }

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
          {char === '\n' ? '↵\n' : char}
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
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_bottom,rgba(124,58,237,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(124,58,237,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-5xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-900">
          <Link
            to="/games"
            onClick={handleLeaveRoom}
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
            <span className="text-[10px] font-mono text-slate-500 uppercase">SYS: MULTIPLAYER_LOBBY</span>
          </div>
        </div>

        {/* --- STATE PANELS --- */}
        <AnimatePresence mode="wait">
          
          {gameState === 'setup' && (
            // SETUP / ENTER ROOM SCREEN
            <motion.div
              key="setup-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-lg mx-auto space-y-6"
            >
              <div className="text-center">
                <h2 className="text-xl font-black font-mono tracking-wide text-white uppercase mb-1">
                  Typing Speedway Lobby
                </h2>
                <p className="text-slate-400 text-xs font-mono">
                  Buat room bermain bersama teman secara real-time, atau gabung room yang sudah ada!
                </p>
              </div>

              {joinError && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 text-center text-xs font-mono text-red-400 flex items-center justify-center gap-2">
                  <AlertTriangle size={14} /> {joinError}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1 font-mono">
                <label className="text-[10px] text-slate-500 uppercase">Nama Pembalap (Racer Nickname)</label>
                <input
                  type="text"
                  maxLength={15}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-[var(--color-accent-light)] rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* Column A: Create Room */}
                <div className="space-y-4 font-mono sm:border-r sm:border-slate-900 sm:pr-6">
                  <span className="text-[10px] text-slate-500 uppercase block font-bold">Opsi A: Buat Room Baru</span>
                  
                  <div className="space-y-2">
                    <label className="text-[9px] text-slate-500 uppercase">Pilih Bahasa</label>
                    <select 
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs font-mono text-white focus:outline-none"
                    >
                      <option value="javascript">JavaScript / TypeScript</option>
                      <option value="golang">Go (Golang)</option>
                      <option value="python">Python</option>
                      <option value="css">HTML / CSS</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="bots-check"
                      checked={enableBots}
                      onChange={(e) => setEnableBots(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-800 text-[var(--color-accent)] bg-slate-950"
                    />
                    <label htmlFor="bots-check" className="text-[10px] text-slate-400">Aktifkan AI Bots</label>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    className="w-full py-2.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] hover:opacity-90 font-bold text-xs rounded-xl transition-all cursor-pointer text-white text-center uppercase"
                  >
                    Buat Room 🛠️
                  </button>
                </div>

                {/* Column B: Join Room */}
                <div className="space-y-4 font-mono flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Opsi B: Gabung Room</span>
                    
                    <div className="space-y-2 mt-4">
                      <label className="text-[9px] text-slate-500 uppercase">Kode Room (4 Huruf)</label>
                      <input 
                        type="text"
                        maxLength={4}
                        placeholder="ABCD"
                        value={roomInput}
                        onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-center font-bold tracking-widest text-white uppercase focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    className="w-full py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-white uppercase mt-4"
                  >
                    Gabung Room ⚔️
                  </button>
                </div>

              </div>

            </motion.div>
          )}

          {gameState === 'lobby' && (
            // WAITING ROOM LOBBY SCREEN
            <motion.div
              key="lobby-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-6 font-mono"
            >
              {/* Room Header Code */}
              <div className="text-center space-y-3">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  [LOBBY KODE MULTIPLAYER]
                </span>
                
                <div className="flex items-center justify-center gap-3">
                  <div className="text-4xl font-black text-white bg-slate-950 border border-slate-900 rounded-2xl px-6 py-3 tracking-widest shadow-glow">
                    {roomCode}
                  </div>
                  <button
                    onClick={copyRoomCode}
                    className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition-colors cursor-pointer text-slate-300 hover:text-white"
                    title="Copy Code"
                  >
                    {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Bagikan kode di atas kepada temanmu agar mereka bisa bergabung!
                </p>
              </div>

              {/* Lobby settings metadata */}
              <div className="grid grid-cols-2 gap-4 bg-slate-950/80 border border-slate-900 rounded-xl p-4 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px]">BAHASA</span>
                  <div className="font-bold text-white uppercase mt-0.5">{selectedLang}</div>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">AI BOT OPPONENTS</span>
                  <div className="font-bold text-white uppercase mt-0.5">{enableBots ? 'AKTIF' : 'NONAKTIF'}</div>
                </div>
              </div>

              {/* Connected players list */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block flex items-center gap-1">
                  <Users size={12} className="text-cyan-400" /> Pemain Terhubung ({lobbyPlayers.length})
                </span>
                
                <div className="space-y-2 bg-slate-950 border border-slate-900 p-4 rounded-xl max-h-44 overflow-y-auto">
                  {lobbyPlayers.map((player, idx) => (
                    <div key={player.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: player.color }} />
                        <span className="font-bold text-white">{player.name}</span>
                        {idx === 0 && <span className="text-[9px] bg-yellow-500/20 text-yellow-500 px-1 rounded border border-yellow-500/30">Host</span>}
                      </div>
                      <span className="text-slate-500 text-[10px]">Ready</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isHost ? (
                  <button
                    onClick={handleStartRace}
                    className="flex-1 py-3 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] hover:opacity-90 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer text-white flex items-center justify-center gap-1.5"
                  >
                    <Play size={14} /> Mulai Balapan (Start)
                  </button>
                ) : (
                  <div className="flex-1 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-400 text-center flex items-center justify-center gap-2 animate-pulse">
                    <Zap size={14} className="text-yellow-500" /> Menunggu Host memulai balapan...
                  </div>
                )}
                
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-red-400 hover:text-red-300 font-bold text-xs transition-all cursor-pointer flex items-center gap-1"
                >
                  <LogOut size={14} /> Keluar
                </button>
              </div>

            </motion.div>
          )}

          {gameState === 'countdown' && (
            // COUNTDOWN DIALOG
            <motion.div
              key="countdown-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass border border-slate-800 rounded-3xl p-12 max-w-md mx-auto text-center space-y-4 font-mono"
            >
              <span className="text-[10px] text-slate-500 tracking-widest uppercase block">
                [SYNCHRONIZING arena CLOCK]
              </span>
              <motion.div 
                key={countdown}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black text-[var(--color-accent-light)] select-none drop-shadow-glow"
              >
                {countdown}
              </motion.div>
              <p className="text-xs text-slate-400 uppercase tracking-wider animate-pulse">
                Balapan akan segera dimulai...
              </p>
            </motion.div>
          )}

          {(gameState === 'racing' || gameState === 'podium') && (
            // ACTIVE TYPING ARENA
            <motion.div
              key="racing-arena"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid md:grid-cols-3 gap-6 items-start font-mono"
            >
              
              {/* Left Column: Cyber Speedway Track */}
              <div className="md:col-span-1 glass border border-slate-800 rounded-2xl p-5 space-y-4 relative overflow-hidden">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block">
                  [NEON SPEEDWAY]
                </span>

                <div className="space-y-4 bg-slate-950/80 border border-slate-900 rounded-xl p-4 relative">
                  {getLeaderboardList().map(player => (
                    <div key={player.id} className="space-y-1 relative">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className={`font-semibold ${player.id === userId ? 'text-[var(--color-neon-cyan)]' : 'text-slate-400'}`}>
                          {player.name} {player.isBot && <span className="text-[8px] opacity-50 bg-slate-800 px-1 rounded">BOT</span>}
                        </span>
                        <span className="text-slate-500 text-[9px]">{player.wpm} WPM</span>
                      </div>

                      <div className="h-3 bg-slate-900 rounded-full border border-slate-850 p-0.5 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:10px_100%] pointer-events-none" />
                        
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

              {/* Right Column: Code block typing input or Podium results */}
              <div className="md:col-span-2 space-y-6">
                
                {gameState === 'racing' ? (
                  // TYPING INTERACTIVE TERMINAL
                  <div className="glass border border-slate-800 rounded-2xl p-6 relative overflow-hidden space-y-6">
                    <div className="grid grid-cols-3 gap-3 border-b border-slate-900 pb-4">
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
                      <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[var(--color-accent-light)] opacity-20 pointer-events-none" />
                      
                      <code className="text-sm md:text-base leading-relaxed tracking-wider break-all whitespace-pre-wrap select-none font-mono">
                        {renderHighlightedCode()}
                      </code>
                    </div>

                    <p className="text-[10px] text-slate-500 text-center">
                      🔊 Tips: Gunakan keyboard fisik untuk mengetik kode di atas secepat mungkin!
                    </p>
                  </div>
                ) : (
                  // PODIUM RESULTS DASHBOARD
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass border border-slate-800 rounded-2xl p-6 text-center space-y-6"
                  >
                    <Trophy className="text-yellow-500 mx-auto animate-bounce" size={48} />
                    
                    <div>
                      <h2 className="text-xl font-black tracking-wide text-white uppercase font-mono">
                        Balapan Selesai!
                      </h2>
                      <p className="text-xs text-slate-400">
                        Hasil akhir balapan coding room {roomCode}.
                      </p>
                    </div>

                    {/* Score stats summary */}
                    <div className="grid grid-cols-3 gap-4 max-w-md mx-auto bg-slate-950 border border-slate-900 p-4 rounded-xl">
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
                    <div className="space-y-2 max-w-md mx-auto">
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block text-left mb-2">
                        [LOBBY PODIUM OVERVIEW]
                      </span>
                      {getLeaderboardList()
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
                        onClick={startCountdownFlow}
                        className="flex-1 py-2.5 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-accent-light)] hover:opacity-90 font-bold text-xs rounded-xl transition-all cursor-pointer text-white uppercase"
                      >
                        Tanding Ulang ⚔️
                      </button>
                      <button
                        onClick={handleLeaveRoom}
                        className="flex-1 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-slate-300 uppercase"
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
