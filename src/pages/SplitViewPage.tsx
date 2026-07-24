import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Chrome, Radio, Zap, Sparkles, MoveRight, 
  ExternalLink, Layers, RefreshCw, CheckCircle2, TrendingUp, Info,
  Sliders, Eye, EyeOff
} from 'lucide-react'

/* ─── Shared Types & Data ─────────────────────────────── */

interface StockItem {
  ticker: string
  name: string
  price: string
  change: string
  isUp: boolean
  pe: string
  marketCap: string
  broker: string
  aiSignal: string
  color: string
}

const STOCKS: StockItem[] = [
  {
    ticker: 'BBCA.JK',
    name: 'PT Bank Central Asia Tbk',
    price: 'Rp 10,250',
    change: '+1.75%',
    isUp: true,
    pe: '24.2x',
    marketCap: 'Rp 1,263 T',
    broker: 'AK, ZP, BK (Net Buy)',
    aiSignal: 'BULLISH • Solid Banking Growth',
    color: '#10b981',
  },
  {
    ticker: 'GOTO.JK',
    name: 'GoTo Gojek Tokopedia Tbk',
    price: 'Rp 64',
    change: '-3.03%',
    isUp: false,
    pe: '-12.4x',
    marketCap: 'Rp 76.8 T',
    broker: 'OD, CC (Net Sell)',
    aiSignal: 'NEUTRAL • Ebitda Turning Point',
    color: '#ef4444',
  },
  {
    ticker: 'AMMN.JK',
    name: 'Amman Mineral Internasional',
    price: 'Rp 11,800',
    change: '+4.42%',
    isUp: true,
    pe: '38.6x',
    marketCap: 'Rp 854 T',
    broker: 'CS, AG (Net Buy)',
    aiSignal: 'STRONG BUY • Copper Surge',
    color: '#3b82f6',
  },
  {
    ticker: 'IPO_CYBER',
    name: 'PT Cyber Cloud Nusantara (IPO)',
    price: 'Rp 280',
    change: 'NEW IPO',
    isUp: true,
    pe: '18.5x',
    marketCap: 'Rp 420 B',
    broker: 'Mandiri Sekuritas (UW)',
    aiSignal: 'OVERSUBSCRIBED • High Cloud Growth',
    color: '#a855f7',
  },
]

/* ─── Smooth & Subtle Ambient Background Emitter ────────── */

function CrossTabCanvas3D({ 
  laserY, 
  tabRole,
  effectsEnabled
}: { 
  laserY: number | null; 
  tabRole: 'LEFT' | 'RIGHT';
  effectsEnabled: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentLaserYRef = useRef<number | null>(null)

  useEffect(() => {
    if (!effectsEnabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Very Slow & Subtle Ambient Floating Particles (Reduced Speed & Count)
    const particles = Array.from({ length: 22 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 1.5 + 0.5,
      radius: Math.random() * 1.5 + 1,
      vx: (Math.random() - 0.5) * 0.25, // Slowed down from 1.5 to 0.25
      vy: (Math.random() - 0.5) * 0.25,
      color: tabRole === 'LEFT' ? 'rgba(16, 185, 129, ' : 'rgba(139, 92, 246, ',
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Soft Subtle Grid Floor Lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 80) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw Slow Floating Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${0.2 * p.z})`
        ctx.fill()
      })

      // Smooth Linear Interpolation (LERP) for Laser Beam
      if (laserY !== null) {
        if (currentLaserYRef.current === null) {
          currentLaserYRef.current = laserY
        } else {
          // Soft LERP gliding effect (0.08 speed factor)
          currentLaserYRef.current += (laserY - currentLaserYRef.current) * 0.08
        }

        const y = currentLaserYRef.current
        ctx.save()
        const gradient = ctx.createLinearGradient(
          tabRole === 'LEFT' ? width - 200 : 0,
          y,
          tabRole === 'LEFT' ? width : 200,
          y
        )

        if (tabRole === 'LEFT') {
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0)')
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.6)')
        } else {
          gradient.addColorStop(0, 'rgba(139, 92, 246, 0.6)')
          gradient.addColorStop(1, 'rgba(139, 92, 246, 0)')
        }

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.shadowBlur = 8
        ctx.shadowColor = tabRole === 'LEFT' ? '#10b981' : '#8b5cf6'

        ctx.beginPath()
        ctx.moveTo(tabRole === 'LEFT' ? width - 250 : 0, y)
        ctx.lineTo(tabRole === 'LEFT' ? width : 250, y)
        ctx.stroke()
        ctx.restore()
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
    }
  }, [laserY, tabRole, effectsEnabled])

  if (!effectsEnabled) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

/* ─── MAIN PAGE COMPONENT ─────────────────────────────── */

export default function SplitViewPage() {
  const [searchParams] = useSearchParams()
  const initialViewParam = searchParams.get('view') // 'left' or 'right'

  const [tabId] = useState(() => Math.random().toString(36).substring(7))
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)
  const [connectedTabsCount, setConnectedTabsCount] = useState(1)
  const [effectsEnabled, setEffectsEnabled] = useState(true)
  
  // Tab Role
  const [tabRole, setTabRole] = useState<'LEFT' | 'RIGHT'>(() => {
    if (initialViewParam === 'right') return 'RIGHT'
    return 'LEFT'
  })

  // Shared Sync States
  const [selectedStock, setSelectedStock] = useState<StockItem>(STOCKS[0])
  const [teleportedCards, setTeleportedCards] = useState<StockItem[]>([])
  const [laserY, setLaserY] = useState<number | null>(null)
  const [activeBeamAnim, setActiveBeamAnim] = useState(false)
  const [lastActionLog, setLastActionLog] = useState<string>('Chrome Split View Ready')
  const [showGuideTooltip, setShowGuideTooltip] = useState(false)

  // BroadcastChannel Handshake
  useEffect(() => {
    const bc = new BroadcastChannel('chrome_split_view_sync')
    setChannel(bc)

    bc.postMessage({ type: 'WHO_IS_LEFT', tabId })

    bc.onmessage = (event) => {
      const { type, senderId, payload } = event.data
      if (senderId === tabId) return

      if (type === 'WHO_IS_LEFT') {
        if (tabRole === 'LEFT') {
          bc.postMessage({ type: 'I_AM_LEFT', senderId: tabId })
          setConnectedTabsCount(2)
          setLastActionLog('Chrome 2nd Tab connected!')
        }
      }

      if (type === 'I_AM_LEFT') {
        setConnectedTabsCount(2)
        if (!initialViewParam) {
          setTabRole('RIGHT')
        }
        setLastActionLog('Assigned as RIGHT TAB (3D Stage)')
      }

      if (type === 'MOUSE_BEAM') {
        setLaserY(payload.y)
      }

      if (type === 'SELECT_STOCK') {
        setSelectedStock(payload.stock)
        setLastActionLog(`Synced Stock: ${payload.stock.ticker}`)
      }

      if (type === 'TELEPORT_CARD') {
        setTeleportedCards(prev => [payload.stock, ...prev])
        setActiveBeamAnim(true)
        setTimeout(() => setActiveBeamAnim(false), 1500)
        setLastActionLog(`Teleported ${payload.stock.ticker} into Right View!`)
      }

      if (type === 'CLEAR_TELEPORT') {
        setTeleportedCards([])
      }
    }

    return () => {
      bc.postMessage({ type: 'TAB_LEFT', tabId })
      bc.close()
    }
  }, [tabId, tabRole, initialViewParam])

  // Mouse Move Broadcast (Debounced/Throttled slightly for smooth performance)
  const lastMouseTime = useRef(0)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const now = Date.now()
    if (now - lastMouseTime.current < 25) return // max 40fps event broadcast
    lastMouseTime.current = now

    setLaserY(e.clientY)
    if (channel) {
      channel.postMessage({
        type: 'MOUSE_BEAM',
        senderId: tabId,
        payload: { y: e.clientY },
      })
    }
  }, [channel, tabId])

  // Handle Stock Select & Broadcast
  const handleSelectStock = (stock: StockItem) => {
    setSelectedStock(stock)
    setLastActionLog(`Selected Stock: ${stock.ticker}`)
    if (channel) {
      channel.postMessage({
        type: 'SELECT_STOCK',
        senderId: tabId,
        payload: { stock },
      })
    }
  }

  // Handle 3D Teleport Card
  const handleTeleportCard = (stock: StockItem) => {
    setActiveBeamAnim(true)
    setTimeout(() => setActiveBeamAnim(false), 1500)
    setLastActionLog(`Teleported: ${stock.ticker} ➔ Right Tab`)

    if (channel) {
      channel.postMessage({
        type: 'TELEPORT_CARD',
        senderId: tabId,
        payload: { stock },
      })
    }
  }

  const handleClearTeleport = () => {
    setTeleportedCards([])
    if (channel) {
      channel.postMessage({ type: 'CLEAR_TELEPORT', senderId: tabId })
    }
  }

  const handleOpenSecondTab = () => {
    const rightTabUrl = `${window.location.origin}/labs/split-view?view=right`
    window.open(rightTabUrl, '_blank')
    setShowGuideTooltip(true)
    setTimeout(() => setShowGuideTooltip(false), 8000)
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#0a0d16',
        color: '#f4f4f5',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* Smooth Background Emitter */}
      <CrossTabCanvas3D laserY={laserY} tabRole={tabRole} effectsEnabled={effectsEnabled} />

      {/* ── TOP CONTROL BAR ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link
            to="/labs"
            style={{
              color: '#94a3b8',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={16} /> DevLabs
          </Link>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Chrome size={18} color="#a855f7" />
            <span style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.3px', color: '#ffffff' }}>
              Chrome Native Split View
            </span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Toggle Background FX */}
          <button
            onClick={() => setEffectsEnabled(!effectsEnabled)}
            title="Toggle Ambient Particle & Laser Effects"
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: effectsEnabled ? '#38bdf8' : '#64748b',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {effectsEnabled ? <Eye size={14} /> : <EyeOff size={14} />}
            <span>FX {effectsEnabled ? 'ON' : 'OFF'}</span>
          </button>

          {/* Open 2nd Tab Button */}
          <button
            onClick={handleOpenSecondTab}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)',
              border: 'none',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 14px rgba(139, 92, 246, 0.25)',
            }}
          >
            <ExternalLink size={14} />
            <span>➕ Open 2nd Tab</span>
          </button>

          {/* Role Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              background: tabRole === 'LEFT' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              border: tabRole === 'LEFT' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(139, 92, 246, 0.3)',
              fontSize: '12px',
              fontWeight: 700,
              color: tabRole === 'LEFT' ? '#34d399' : '#c084fc',
            }}
          >
            <Radio size={14} />
            <span>{tabRole} TAB</span>
          </div>
        </div>
      </header>

      {/* ── TOOLTIP GUIDE ── */}
      <AnimatePresence>
        {showGuideTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(124, 58, 237, 0.2))',
              borderBottom: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '10px 24px',
              fontSize: '13px',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 60,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Info size={18} color="#c084fc" />
              <span>
                <strong>Tab 2 Terbuka!</strong> Klik kanan pada Tab 2 di bagian atas Chrome ➔ Pilih <strong>&quot;Arrange split view&quot;</strong>.
              </span>
            </div>
            <button onClick={() => setShowGuideTooltip(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer' }}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── INSTRUCTION BAR ── */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          padding: '10px 24px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#94a3b8',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} color={tabRole === 'LEFT' ? '#34d399' : '#c084fc'} />
          <span>
            {tabRole === 'LEFT' ? (
              <span>
                <strong style={{ color: '#34d399' }}>LEFT TAB:</strong> Select stocks or click <strong>&quot;Beam Card ➔&quot;</strong> to teleport objects across Chrome tabs!
              </span>
            ) : (
              <span>
                <strong style={{ color: '#c084fc' }}>RIGHT TAB:</strong> Receiving live 3D laser telemetry & teleported cards from Left Chrome Tab!
              </span>
            )}
          </span>
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#64748b' }}>
          {lastActionLog}
        </div>
      </div>

      {/* ── MAIN CONTENT (Clean Executive UI) ── */}
      <div
        style={{
          maxWidth: '1050px',
          margin: '0 auto',
          padding: '36px 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {tabRole === 'LEFT' ? (
          /* ─── LEFT TAB VIEW ─── */
          <div>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#34d399', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                CONTROLLER STAGE
              </div>
              <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', color: '#ffffff' }}>
                Stock & IPO Prospectus Intelligence
              </h1>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, maxWidth: '650px', lineHeight: 1.6 }}>
                Click <strong>&quot;➕ Open 2nd Tab&quot;</strong> at top-right, then right-click Tab 2 ➔ Arrange Split View.
              </p>
            </div>

            {/* Stock Cards Grid (Sleek Clean Styling) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px', marginBottom: '40px' }}>
              {STOCKS.map(stock => {
                const isSelected = selectedStock.ticker === stock.ticker
                return (
                  <motion.div
                    key={stock.ticker}
                    whileHover={{ y: -2 }}
                    onClick={() => handleSelectStock(stock)}
                    style={{
                      padding: '20px',
                      borderRadius: '14px',
                      background: 'rgba(15, 23, 42, 0.6)',
                      backdropFilter: 'blur(8px)',
                      border: isSelected ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 4px 20px rgba(16, 185, 129, 0.15)' : '0 2px 10px rgba(0,0,0,0.2)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{stock.ticker}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{stock.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{stock.price}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: stock.isUp ? '#34d399' : '#f87171' }}>{stock.change}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '14px', lineHeight: 1.5 }}>
                      <div>P/E: <strong>{stock.pe}</strong> • Cap: <strong>{stock.marketCap}</strong></div>
                      <div>Broker Flow: <strong>{stock.broker}</strong></div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTeleportCard(stock)
                      }}
                      style={{
                        width: '100%',
                        padding: '9px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)',
                      }}
                    >
                      <span>Beam Card to Right View</span>
                      <MoveRight size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Notification Pop */}
            <AnimatePresence>
              {activeBeamAnim && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  style={{
                    position: 'fixed',
                    bottom: '24px',
                    right: '24px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid #10b981',
                    color: '#34d399',
                    fontWeight: 600,
                    fontSize: '13px',
                    zIndex: 100,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Sparkles size={16} />
                  <span>3D Card Beam Transmitted ➔ Right Tab</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* ─── RIGHT TAB VIEW ─── */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#c084fc', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
                  RECEIVER STAGE
                </div>
                <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 8px', letterSpacing: '-0.5px', color: '#ffffff' }}>
                  Live Telemetry & Asset Receptor
                </h1>
                <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
                  Receiving real-time data streams & teleported stock cards from Left Chrome Tab.
                </p>
              </div>

              {teleportedCards.length > 0 && (
                <button
                  onClick={handleClearTeleport}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#94a3b8',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Queue
                </button>
              )}
            </div>

            {/* Selected Stock Live Inspection */}
            <div
              style={{
                padding: '24px',
                borderRadius: '16px',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(139, 92, 246, 0.3)',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
                marginBottom: '32px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700, marginBottom: '2px' }}>
                    REAL-TIME SYNCED ASSET
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>{selectedStock.ticker}</div>
                  <div style={{ fontSize: '13px', color: '#64748b' }}>{selectedStock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff' }}>{selectedStock.price}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: selectedStock.isUp ? '#34d399' : '#f87171' }}>{selectedStock.change}</div>
                </div>
              </div>

              {/* AI Prospectus Summary */}
              <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)', marginBottom: '18px' }}>
                <div style={{ fontSize: '12px', color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                  <Sparkles size={14} />
                  <span>AI Valuation & Broker Summary</span>
                </div>
                <div style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {selectedStock.aiSignal} • Broker Flow: <strong>{selectedStock.broker}</strong>. Valuation P/E: {selectedStock.pe} • Cap: {selectedStock.marketCap}.
                </div>
              </div>

              {/* Momentum Bars */}
              <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '8px' }}>Momentum Telemetry</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '80px' }}>
                {[35, 45, 60, 52, 78, 85, 92, 100].map((val, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${val}%`,
                      background: 'linear-gradient(to top, #7c3aed, #a78bfa)',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Teleported Cards Queue */}
            {teleportedCards.length > 0 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 14px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="#c084fc" />
                  <span>Teleported Assets ({teleportedCards.length})</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {teleportedCards.map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                      }}
                    >
                      <div style={{ fontSize: '10px', color: '#c084fc', fontWeight: 700, marginBottom: '2px' }}>
                        ✦ TELEPORTED FROM LEFT TAB
                      </div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{card.ticker}</div>
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{card.name} — {card.price}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
