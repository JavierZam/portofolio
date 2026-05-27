import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Swords, Play, RotateCcw, Volume2, VolumeX, 
  Users, Copy, Check, LogOut, Terminal, Keyboard, AlertTriangle, Trophy
} from 'lucide-react'
import { 
  doc, setDoc, deleteDoc, updateDoc, onSnapshot, getDoc, 
  collection, query, increment
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import confetti from 'canvas-confetti'

// Synthesize retro mechanical keys & alarm audio signals
const playWarSynthSound = (type: 'push' | 'pull' | 'click' | 'victory' | 'buzzer' | 'beep') => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    
    if (type === 'push') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(500, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } else if (type === 'pull') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } else if (type === 'click') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(1000, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } else if (type === 'beep') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      gain.gain.setValueAtTime(0.06, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.08)
    } else if (type === 'buzzer') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(180, ctx.currentTime)
      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.4)
    } else if (type === 'victory') {
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06)
        gain.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.06)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.3)
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.start(ctx.currentTime + i * 0.06)
        osc.stop(ctx.currentTime + i * 0.06 + 0.3)
      })
    }
  } catch (e) {
    console.warn('Audio Synthesis failed:', e)
  }
}

export default function GitWarPage() {
  const [username, setUsername] = useState(() => {
    return localStorage.getItem('bug_raid_username') || `Dev #${Math.floor(1000 + Math.random() * 9000)}`
  })
  
  // Game state modes
  const [playMode, setPlayMode] = useState<'solo' | 'multiplayer' | null>(null)
  const [gameState, setGameState] = useState<'setup' | 'lobby' | 'countdown' | 'playing' | 'finished'>('setup')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [roomCode, setRoomCode] = useState('')
  const [roomInput, setRoomInput] = useState('')
  const [isHost, setIsHost] = useState(false)
  const [team, setTeam] = useState<'push' | 'pull'>('push') // Host is PUSH (0%), Guest is PULL (100%)

  // Tug of war numeric positions
  const [dbPosition, setDbPosition] = useState(50) // 0 (PUSH wins) - 100 (PULL wins)
  const [renderPosition, setRenderPosition] = useState(50) // Smooth interpolated position
  const [countdown, setCountdown] = useState(3)
  const [winner, setWinner] = useState<'push' | 'pull' | null>(null)

  // Subscriptions & active racers
  const [userId] = useState(() => {
    return localStorage.getItem('bug_raid_user_id') || `uid_${Math.random().toString(36).substr(2, 9)}`
  })
  const [lobbyPlayers, setLobbyPlayers] = useState<{ id: string; name: string; team: 'push' | 'pull' }[]>([])
  
  // Settings & feedback state
  const [copied, setCopied] = useState(false)
  const [joinError, setJoinError] = useState('')
  const [isShaking, setIsShaking] = useState(false)
  const [botDifficulty, setBotDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')

  // Mashing buffering refs
  const accumulatedPull = useRef(0)
  const dbFlushTimer = useRef<number | null>(null)
  const botInterval = useRef<number | null>(null)
  const lerpAnimationFrame = useRef<number | null>(null)
  const countdownInterval = useRef<number | null>(null)
  const startTimeRef = useRef<number>(0)

  const gameStateRef = useRef(gameState)
  const teamRef = useRef(team)
  const playModeRef = useRef(playMode)
  const roomCodeRef = useRef(roomCode)
  const soundEnabledRef = useRef(soundEnabled)

  useEffect(() => { gameStateRef.current = gameState }, [gameState])
  useEffect(() => { teamRef.current = team }, [team])
  useEffect(() => { playModeRef.current = playMode }, [playMode])
  useEffect(() => { roomCodeRef.current = roomCode }, [roomCode])
  useEffect(() => { soundEnabledRef.current = soundEnabled }, [soundEnabled])

  // Focus window when game starts playing
  useEffect(() => {
    if (gameState === 'playing') {
      window.focus()
    }
  }, [gameState])

  const triggerAudio = (type: 'push' | 'pull' | 'click' | 'victory' | 'buzzer' | 'beep') => {
    if (soundEnabledRef.current) playWarSynthSound(type)
  }

  // --- LERP ANIMATION LOOP (Smooth Commit Node Sliding) ---
  useEffect(() => {
    const updateLerp = () => {
      setRenderPosition(prev => {
        const diff = dbPosition - prev
        if (Math.abs(diff) < 0.05) return dbPosition
        return prev + diff * 0.15 // lerp equation
      })
      lerpAnimationFrame.current = requestAnimationFrame(updateLerp)
    }
    lerpAnimationFrame.current = requestAnimationFrame(updateLerp)
    return () => {
      if (lerpAnimationFrame.current) cancelAnimationFrame(lerpAnimationFrame.current)
    }
  }, [dbPosition])

  // --- FIRESTORE ACTIVE ROOM SYNC (MULTIPLAYER MODE) ---
  useEffect(() => {
    if (playMode !== 'multiplayer' || !roomCode) return

    // 1. Subscribe to Room document for position & status
    const unsubscribeRoom = onSnapshot(doc(db, 'dev_race_lobby', roomCode), (snap) => {
      if (snap.exists()) {
        const d = snap.data()
        
        // Sync database commit position
        if (d.position !== undefined) {
          setDbPosition(d.position)
          
          // Check win conditions in database
          if (d.position <= 0 && gameState === 'playing') {
            handleWinnerDeclare('push')
          } else if (d.position >= 100 && gameState === 'playing') {
            handleWinnerDeclare('pull')
          }
        }

        // Sync game lifecycle triggers
        if (d.status === 'countdown' && gameState === 'lobby') {
          startCountdownFlow()
        }
      } else {
        if (gameState !== 'setup') {
          alert('Room dibubarkan.')
          handleLeaveRoom()
        }
      }
    })

    // 2. Subscribe to Players subcollection
    const unsubscribePlayers = onSnapshot(collection(db, 'dev_race_lobby', roomCode, 'players'), (snap) => {
      const list: { id: string; name: string; team: 'push' | 'pull' }[] = []
      snap.forEach(docSnap => {
        const d = docSnap.data()
        list.push({
          id: docSnap.id,
          name: d.name || 'Racer',
          team: d.team || 'push'
        })
      })
      setLobbyPlayers(list)
    })

    return () => {
      unsubscribeRoom()
      unsubscribePlayers()
    }
  }, [roomCode, playMode, gameState])

  // --- OFFLINE BOT PULL SIMULATION CYCLE (SOLO PLAY MODE) ---
  useEffect(() => {
    if (gameState !== 'playing') return

    if (playMode === 'solo') {
      // Local bot click loop
      const delay = botDifficulty === 'easy' ? 260 : botDifficulty === 'medium' ? 180 : 120
      
      botInterval.current = window.setInterval(() => {
        setDbPosition(prev => {
          const next = prev + 1.8 // Bot pulls right (PULL)
          if (next >= 100) {
            handleWinnerDeclare('pull')
            return 100
          }
          triggerAudio('pull')
          return next
        })
      }, delay)
    }

    return () => {
      if (botInterval.current) clearInterval(botInterval.current)
    }
  }, [gameState, playMode, botDifficulty])

  // --- ACTIONS HANDLERS ---
  const handleCreateRoom = async () => {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase()
    localStorage.setItem('bug_raid_username', username)
    setJoinError('')

    try {
      // Create room metadata doc
      await setDoc(doc(db, 'dev_race_lobby', code), {
        code,
        gameType: 'git_war',
        status: 'waiting',
        position: 50,
        hostId: userId,
        createdAt: Date.now()
      })

      // Add Host to players (Team PUSH)
      await setDoc(doc(db, 'dev_race_lobby', code, 'players', userId), {
        name: username,
        team: 'push',
        joinedAt: Date.now()
      })

      setRoomCode(code)
      setIsHost(true)
      setTeam('push')
      setDbPosition(50)
      setRenderPosition(50)
      setGameState('lobby')
    } catch (e) {
      console.error('Failed to create room:', e)
      setJoinError('Gagal membuat room.')
    }
  }

  const handleJoinRoom = async () => {
    const code = roomInput.trim().toUpperCase()
    if (code.length !== 4) {
      setJoinError('Kode room harus 4 digit!')
      return
    }

    localStorage.setItem('bug_raid_username', username)
    setJoinError('')

    try {
      const roomSnap = await getDoc(doc(db, 'dev_race_lobby', code))
      if (!roomSnap.exists()) {
        setJoinError('Room tidak ditemukan!')
        return
      }

      const rData = roomSnap.data()
      if (rData.gameType !== 'git_war') {
        setJoinError('Room ini bukan room Git War!')
        return
      }
      if (rData.status !== 'waiting') {
        setJoinError('Game sudah berjalan!')
        return
      }

      // Add Guest to players (Team PULL)
      await setDoc(doc(db, 'dev_race_lobby', code, 'players', userId), {
        name: username,
        team: 'pull',
        joinedAt: Date.now()
      })

      setRoomCode(code)
      setIsHost(false)
      setTeam('pull')
      setDbPosition(50)
      setRenderPosition(50)
      setGameState('lobby')
    } catch (e) {
      console.error('Failed to join room:', e)
      setJoinError('Gagal masuk room.')
    }
  }

  const handleStartRace = async () => {
    if (!isHost) return
    triggerAudio('click')
    
    try {
      await updateDoc(doc(db, 'dev_race_lobby', roomCode), {
        status: 'countdown',
        position: 50
      })
    } catch (e) {
      console.error('Failed to start countdown:', e)
    }
  }

  const startCountdownFlow = () => {
    setGameState('countdown')
    setCountdown(3)
    setDbPosition(50)
    setRenderPosition(50)
    setWinner(null)

    if (countdownInterval.current) clearInterval(countdownInterval.current)

    countdownInterval.current = window.setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!)
          triggerAudio('buzzer')
          setGameState('playing')
          startTimeRef.current = Date.now()
          return 0
        }
        triggerAudio('beep')
        return prev - 1
      })
    }, 1000)
  }

  const handleStartSolo = () => {
    triggerAudio('click')
    setPlayMode('solo')
    setTeam('push') // In solo, you are always Team PUSH mashing 'A'
    startCountdownFlow()
  }

  // --- KEYBOARD MASHING LISTENERS ---
  const handlePullMash = useCallback(() => {
    if (gameStateRef.current !== 'playing') return

    // Trigger local audio click
    triggerAudio(teamRef.current)

    // Visual screen shake vibration
    setIsShaking(true)
    setTimeout(() => setIsShaking(false), 50)

    if (playModeRef.current === 'solo') {
      // Offline local update
      setDbPosition(prev => {
        const next = Math.max(0, prev - 2) // You pull left (PUSH)
        if (next <= 0) {
          handleWinnerDeclare('push')
          return 0
        }
        return next
      })
    } else {
      // Online buffer delta update
      const step = teamRef.current === 'push' ? -2 : 2
      accumulatedPull.current += step

      // Optimistic local UI position shift
      setDbPosition(prev => Math.max(0, Math.min(100, prev + step)))

      if (!dbFlushTimer.current) {
        dbFlushTimer.current = window.setInterval(flushPullBuffer, 180)
      }
    }
  }, [])

  const flushPullBuffer = useCallback(async () => {
    if (accumulatedPull.current === 0) return
    const delta = accumulatedPull.current
    accumulatedPull.current = 0

    try {
      const roomRef = doc(db, 'dev_race_lobby', roomCodeRef.current)
      await updateDoc(roomRef, {
        position: increment(delta)
      })
    } catch (e) {
      console.error('Failed to sync pull delta:', e)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is focused on username input or lobby input, don't trigger game mashing
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return
      }

      if (gameStateRef.current !== 'playing') return
      
      const key = e.key.toLowerCase()
      const code = e.code

      // PUSH host mashes 'A', PULL guest mashes 'L'
      if (teamRef.current === 'push' && (key === 'a' || code === 'KeyA')) {
        e.preventDefault()
        handlePullMash()
      } else if (teamRef.current === 'pull' && (key === 'l' || code === 'KeyL')) {
        e.preventDefault()
        handlePullMash()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handlePullMash])

  const handleWinnerDeclare = (winSide: 'push' | 'pull') => {
    setWinner(winSide)
    setGameState('finished')
    triggerAudio('victory')
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })

    if (botInterval.current) clearInterval(botInterval.current)
    if (dbFlushTimer.current) clearInterval(dbFlushTimer.current)
  }

  const handleLeaveRoom = async () => {
    if (countdownInterval.current) clearInterval(countdownInterval.current)
    if (botInterval.current) clearInterval(botInterval.current)
    if (dbFlushTimer.current) clearInterval(dbFlushTimer.current)

    if (playMode === 'multiplayer' && roomCode) {
      try {
        await deleteDoc(doc(db, 'dev_race_lobby', roomCode, 'players', userId))
        if (isHost) {
          await deleteDoc(doc(db, 'dev_race_lobby', roomCode))
        }
      } catch (e) {
        console.warn('Cleanup failed:', e)
      }
    }

    setRoomCode('')
    setIsHost(false)
    setPlayMode(null)
    setGameState('setup')
    setWinner(null)
    setDbPosition(50)
    setRenderPosition(50)
  }

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode)
    setCopied(true)
    triggerAudio('click')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`noise animated-gradient min-h-screen text-slate-100 pb-20 select-none ${isShaking ? 'animate-shake' : ''}`}>
      <div className="fixed inset-0 pointer-events-none opacity-5 bg-[linear-gradient(to_bottom,rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(to_right,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-5xl mx-auto px-6 pt-10 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-900 font-mono">
          <Link
            to="/games"
            onClick={handleLeaveRoom}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Game Hub
          </Link>

          <div className="flex items-center gap-3">
            <Swords className="text-emerald-400 animate-pulse" size={28} />
            <h1 className="text-2xl md:text-3xl font-black tracking-wider uppercase">
              Git Push-of-War
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded bg-slate-900 border transition-colors ${soundEnabled ? 'text-emerald-400 border-emerald-500/20' : 'text-slate-500 border-slate-800'}`}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <span className="text-[10px] text-slate-500">SYS: KEY_MASH_DUEL</span>
          </div>
        </div>

        {/* --- DYNAMIC STATE LAYOUTS --- */}
        <AnimatePresence mode="wait">
          
          {gameState === 'setup' && (
            // SETUP SCREEN (CHOOSE PLAY MODE)
            <motion.div
              key="setup-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-xl mx-auto space-y-6 font-mono"
            >
              <div className="text-center">
                <h2 className="text-xl font-black text-white uppercase mb-1">
                  Git Branch Tug of War
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Lawan Script Bot atau duel 1v1 dengan teman! Mash keyboard kamu untuk memenangkan kontrol repositori.
                </p>
              </div>

              {joinError && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3 text-center text-xs text-red-400 flex items-center justify-center gap-2">
                  <AlertTriangle size={14} /> {joinError}
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-bold">Racer Name</label>
                <input
                  type="text"
                  maxLength={15}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-emerald-500/40 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                {/* Column A: Play Offline vs Bot */}
                <div className="space-y-4 sm:border-r sm:border-slate-900 sm:pr-6 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Mode A: Solo vs Bot</span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                      Kamu berada di Team PUSH mashing tombol **[A]**. Bot berada di Team PULL.
                    </p>
                    
                    <div className="space-y-1.5 mt-3">
                      <label className="text-[9px] text-slate-500 uppercase">Tingkat Kesulitan Bot</label>
                      <select 
                        value={botDifficulty}
                        onChange={(e) => setBotDifficulty(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="easy">Easy (60 CPM)</option>
                        <option value="medium">Medium (90 CPM)</option>
                        <option value="hard">Hard (130 CPM)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleStartSolo}
                    className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 font-bold text-xs rounded-xl transition-all cursor-pointer text-white uppercase text-center"
                  >
                    Latihan vs Bot 🤖
                  </button>
                </div>

                {/* Column B: Play Online 1v1 */}
                <div className="space-y-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-bold">Mode B: Online Multiplayer</span>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                      Buat room sebagai PUSH host, atau gabung room teman sebagai PULL guest.
                    </p>
                    
                    <div className="space-y-1.5 mt-3">
                      <label className="text-[9px] text-slate-500 uppercase">Gabung via Kode Room</label>
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

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setPlayMode('multiplayer')
                        handleCreateRoom()
                      }}
                      className="flex-1 py-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-white text-center uppercase"
                    >
                      Buat Room
                    </button>
                    <button
                      onClick={() => {
                        setPlayMode('multiplayer')
                        handleJoinRoom()
                      }}
                      className="flex-1 py-2 bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-lg transition-all cursor-pointer text-center uppercase"
                    >
                      Gabung
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'lobby' && (
            // WAIT LOBBY SCREEN (MULTIPLAYER ONLY)
            <motion.div
              key="lobby-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-md mx-auto space-y-6 font-mono"
            >
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
                  >
                    {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400">
                  Kirimkan kode room ke temanmu. Host otomatis mewakili **Team PUSH**, Guest yang bergabung mewakili **Team PULL**!
                </p>
              </div>

              {/* Lobby connected players overview */}
              <div className="space-y-2">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block">
                  Connected Racers ({lobbyPlayers.length} / 2)
                </span>
                <div className="space-y-2 bg-slate-950 border border-slate-900 p-4 rounded-xl">
                  {lobbyPlayers.map((player, idx) => (
                    <div key={player.id} className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">
                        {player.name} {idx === 0 ? '(Host)' : '(Guest)'}
                      </span>
                      <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                        player.team === 'push' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-950 text-cyan-400 border border-cyan-500/20'
                      }`}>
                        Team {player.team.toUpperCase()}
                      </span>
                    </div>
                  ))}
                  {lobbyPlayers.length < 2 && (
                    <div className="text-[10px] text-slate-600 text-center py-2 animate-pulse">
                      Menunggu musuh bergabung...
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {isHost ? (
                  <button
                    onClick={handleStartRace}
                    disabled={lobbyPlayers.length < 2}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 font-bold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer text-white flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Mulai Duel (Start)
                  </button>
                ) : (
                  <div className="flex-1 py-3 bg-slate-950 border border-slate-900 rounded-xl text-xs text-slate-400 text-center flex items-center justify-center gap-2 animate-pulse">
                    Menunggu host memulai duel...
                  </div>
                )}
                
                <button
                  onClick={handleLeaveRoom}
                  className="px-4 py-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-red-400 hover:text-red-300 font-bold text-xs transition-all cursor-pointer"
                >
                  <LogOut size={14} /> Keluar
                </button>
              </div>

            </motion.div>
          )}

          {gameState === 'countdown' && (
            // COUNTDOWN SCREEN
            <motion.div
              key="countdown-screen"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="glass border border-slate-800 rounded-3xl p-12 max-w-md mx-auto text-center space-y-4 font-mono"
            >
              <span className="text-[10px] text-slate-500 tracking-widest uppercase block">
                [SYNCHRONIZING arena POSITION]
              </span>
              <motion.div 
                key={countdown}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black text-emerald-400 select-none drop-shadow-glow"
              >
                {countdown}
              </motion.div>
              <p className="text-xs text-slate-400 uppercase tracking-wider animate-pulse">
                Siap-siap menekan tombol mashing!
              </p>
            </motion.div>
          )}

          {gameState === 'playing' && (
            // PLAYING TUG OF WAR SCREEN
            <motion.div
              key="playing-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-3xl mx-auto space-y-8 font-mono text-center relative overflow-hidden"
            >
              {/* Grid scanner animation line */}
              <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:15px_15px] pointer-events-none" />

              <div>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                  [GIT MASTER BRANCH TUG-OF-WAR]
                </span>
                <h2 className="text-lg font-black text-white mt-1 uppercase">
                  MASH KEYBOARD KAMU!
                </h2>
              </div>

              {/* Mash Instructions Overlay */}
              <div className="flex justify-between items-center max-w-md mx-auto">
                <div className={`p-4 bg-slate-950 border rounded-2xl text-center w-32 ${team === 'push' ? 'border-emerald-500/40 shadow-glow' : 'border-slate-900 opacity-40'}`}>
                  <div className="text-[9px] text-slate-500">TEAM PUSH</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">A</div>
                  <div className="text-[8px] text-slate-500 mt-1">Tekan terus tombol A!</div>
                </div>

                <div className="text-xs text-slate-500 font-bold uppercase animate-pulse">
                  VS
                </div>

                <div className={`p-4 bg-slate-950 border rounded-2xl text-center w-32 ${team === 'pull' ? 'border-cyan-500/40 shadow-glow' : 'border-slate-900 opacity-40'}`}>
                  <div className="text-[9px] text-slate-500">TEAM PULL</div>
                  <div className="text-2xl font-black text-cyan-400 mt-1">L</div>
                  <div className="text-[8px] text-slate-500 mt-1">Tekan terus tombol L!</div>
                </div>
              </div>

              {/* Speedway Tug of War Slider bar */}
              <div className="space-y-2 relative">
                <div className="flex justify-between text-[10px] font-bold text-slate-500 px-1">
                  <span className="text-emerald-400">git push -f (PUSH)</span>
                  <span className="text-cyan-400">(PULL) git pull origin</span>
                </div>

                {/* Tug of war horizontal line */}
                <div className="h-4 bg-slate-950 rounded-full border border-slate-900 relative p-1 overflow-hidden">
                  {/* Center divide line indicator */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-800" />
                  
                  {/* Red/Green zone bars */}
                  <div className="absolute left-0 top-0 bottom-0 bg-emerald-500/10" style={{ right: '50%' }} />
                  <div className="absolute right-0 top-0 bottom-0 bg-cyan-500/10" style={{ left: '50%' }} />
                </div>

                {/* Sliding Commit Node icon */}
                <div className="relative h-12">
                  <motion.div 
                    className="absolute top-0 w-24 -ml-12 h-10 bg-slate-900 border rounded-xl flex items-center justify-center z-20 cursor-pointer shadow-lg active:scale-95"
                    style={{ 
                      left: `${renderPosition}%`,
                      borderColor: renderPosition < 50 ? '#10b981' : renderPosition > 50 ? '#06b6d4' : '#64748b',
                      boxShadow: renderPosition < 50 ? '0 0 10px rgba(16,185,129,0.3)' : renderPosition > 50 ? '0 0 10px rgba(6,180,212,0.3)' : 'none'
                    }}
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                    onClick={handlePullMash} // Fallback click handler
                  >
                    <span className="text-[10px] font-black text-white tracking-widest font-mono">
                      💾 COMMIT
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Local Mash Assist buttons for mobile tap */}
              <div className="block sm:hidden max-w-sm mx-auto">
                <button
                  onClick={handlePullMash}
                  className="w-full py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-2xl active:bg-slate-800 uppercase text-xs"
                >
                  TAP TOMBOL DISINI UNTUK MENARIK!
                </button>
              </div>

              <div className="border-t border-slate-900 pt-4 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>ROOM: {roomCode || 'OFFLINE'}</span>
                <span>STATUS: ACTIVE_MATCH</span>
              </div>
            </motion.div>
          )}

          {gameState === 'finished' && (
            // PODIUM RESULTS SCREEN
            <motion.div
              key="podium-screen"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass border border-slate-800 rounded-3xl p-8 max-w-md mx-auto text-center space-y-6 font-mono"
            >
              <Trophy className="text-yellow-500 mx-auto animate-bounce" size={48} />
              
              <div>
                <h2 className="text-2xl font-black text-white uppercase">
                  Duel Selesai!
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Kontrol server repo berhasil dipertahankan!
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-900 rounded-xl p-6 text-center">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-2">
                  WINNING TEAM
                </span>
                
                {winner === 'push' ? (
                  <div className="text-3xl font-black text-emerald-400 drop-shadow-glow">
                    TEAM PUSH WINS!
                    <span className="text-xs text-white font-semibold mt-1 block">git push -f --force berhasil dideploy!</span>
                  </div>
                ) : (
                  <div className="text-3xl font-black text-cyan-400 drop-shadow-glow">
                    TEAM PULL WINS!
                    <span className="text-xs text-white font-semibold mt-1 block">git pull origin sukses sinkronisasi!</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={startCountdownFlow}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-90 font-bold text-xs rounded-xl transition-all cursor-pointer text-white uppercase text-center"
                >
                  Tanding Ulang ⚔️
                </button>
                <button
                  onClick={handleLeaveRoom}
                  className="flex-1 py-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-slate-300 uppercase text-center"
                >
                  Keluar Arena
                </button>
              </div>

            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  )
}
