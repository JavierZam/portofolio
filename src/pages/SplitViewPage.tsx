import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Chrome, Radio, Zap, Sparkles, Send, MoveRight, 
  TrendingUp, BarChart2, Cpu, CheckCircle2, RefreshCw, Shield, Layers, Eye
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

/* ─── 3D WebGL / Canvas Background Emitter ────────────── */

function CrossTabCanvas3D({ 
  laserY, 
  tabRole 
}: { 
  laserY: number | null; 
  tabRole: 'LEFT' | 'RIGHT' 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
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

    // 3D Particles
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5,
      color: tabRole === 'LEFT' ? 'rgba(0, 255, 102, ' : 'rgba(168, 85, 247, ',
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      // Draw Grid Lines (Perspective 3D floor)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 60) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 60) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw 3D Particles
      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0
        if (p.y < 0) p.y = height
        if (p.y > height) p.y = 0

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${0.3 * p.z})`
        ctx.fill()
      })

      // Draw Cross-Tab Laser Beam Connection if mouse is active
      if (laserY !== null) {
        ctx.save()
        const gradient = ctx.createLinearGradient(
          tabRole === 'LEFT' ? width - 200 : 0,
          laserY,
          tabRole === 'LEFT' ? width : 200,
          laserY
        )

        if (tabRole === 'LEFT') {
          gradient.addColorStop(0, 'rgba(0, 255, 102, 0)')
          gradient.addColorStop(1, 'rgba(0, 255, 102, 0.9)')
        } else {
          gradient.addColorStop(0, 'rgba(168, 85, 247, 0.9)')
          gradient.addColorStop(1, 'rgba(168, 85, 247, 0)')
        }

        ctx.strokeStyle = gradient
        ctx.lineWidth = 4
        ctx.shadowBlur = 15
        ctx.shadowColor = tabRole === 'LEFT' ? '#00ff66' : '#a855f7'

        ctx.beginPath()
        ctx.moveTo(tabRole === 'LEFT' ? width - 300 : 0, laserY)
        ctx.lineTo(tabRole === 'LEFT' ? width : 300, laserY)
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
  }, [laserY, tabRole])

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
  const [tabId] = useState(() => Math.random().toString(36).substring(7))
  const [channel, setChannel] = useState<BroadcastChannel | null>(null)
  const [connectedTabsCount, setConnectedTabsCount] = useState(1)
  const [tabRole, setTabRole] = useState<'LEFT' | 'RIGHT'>('LEFT')

  // Shared Cross-Tab Sync States
  const [selectedStock, setSelectedStock] = useState<StockItem>(STOCKS[0])
  const [teleportedCards, setTeleportedCards] = useState<StockItem[]>([])
  const [laserY, setLaserY] = useState<number | null>(null)
  const [activeBeamAnim, setActiveBeamAnim] = useState(false)
  const [lastActionLog, setLastActionLog] = useState<string>('Ready for Chrome Split View sync')

  // Initialize BroadcastChannel for Chrome Multi-Tab / Split View Sync
  useEffect(() => {
    const bc = new BroadcastChannel('chrome_split_view_sync')
    setChannel(bc)

    // Register this tab
    bc.postMessage({ type: 'TAB_JOINED', tabId })

    bc.onmessage = (event) => {
      const { type, senderId, payload } = event.data
      if (senderId === tabId) return

      if (type === 'TAB_JOINED') {
        setConnectedTabsCount(2)
        // Auto assign roles: older tab is LEFT, new tab is RIGHT
        bc.postMessage({ type: 'ROLE_ASSIGN', senderId: tabId, payload: { role: 'RIGHT', forTab: payload?.tabId } })
        setTabRole('LEFT')
        setLastActionLog('Chrome Split View connected! (2 Tabs active)')
      }

      if (type === 'ROLE_ASSIGN' && payload?.forTab === tabId) {
        setTabRole(payload.role)
        setConnectedTabsCount(2)
      }

      if (type === 'MOUSE_BEAM') {
        setLaserY(payload.y)
      }

      if (type === 'SELECT_STOCK') {
        setSelectedStock(payload.stock)
        setLastActionLog(`Received Stock Sync: ${payload.stock.ticker}`)
      }

      if (type === 'TELEPORT_CARD') {
        setTeleportedCards(prev => [payload.stock, ...prev])
        setActiveBeamAnim(true)
        setTimeout(() => setActiveBeamAnim(false), 1500)
        setLastActionLog(`3D Teleported ${payload.stock.ticker} into Right View!`)
      }

      if (type === 'CLEAR_TELEPORT') {
        setTeleportedCards([])
      }
    }

    return () => {
      bc.postMessage({ type: 'TAB_LEFT', tabId })
      bc.close()
    }
  }, [tabId])

  // Mouse Move Broadcast
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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

  // Handle 3D Teleport Card to Right Tab
  const handleTeleportCard = (stock: StockItem) => {
    setActiveBeamAnim(true)
    setTimeout(() => setActiveBeamAnim(false), 1500)
    setLastActionLog(`Teleporting 3D Card: ${stock.ticker} ➔ Right Tab`)

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

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#05070e',
        color: '#ffffff',
        fontFamily: "'Inter', system-ui, sans-serif",
        position: 'relative',
        overflowX: 'hidden',
        boxSizing: 'border-box',
      }}
    >
      {/* 3D Canvas Background Beam */}
      <CrossTabCanvas3D laserY={laserY} tabRole={tabRole} />

      {/* ── TOP HEADER CONTROL BAR ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(9, 13, 22, 0.85)',
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
              color: '#a1a1aa',
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
          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.12)' }} />
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Chrome size={18} color="#a855f7" />
            <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Chrome Split View Dual-Tab Sync
            </span>
          </div>
        </div>

        {/* Multi-Tab Connection Status Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '20px',
              background: connectedTabsCount > 1 ? 'rgba(0, 255, 102, 0.1)' : 'rgba(234, 179, 8, 0.1)',
              border: connectedTabsCount > 1 ? '1px solid rgba(0, 255, 102, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
              fontSize: '12px',
              fontWeight: 700,
              color: connectedTabsCount > 1 ? '#00ff66' : '#eab308',
            }}
          >
            <Radio size={14} className={connectedTabsCount > 1 ? 'animate-pulse' : ''} />
            <span>
              {connectedTabsCount > 1 
                ? `Chrome Split Active (${tabRole} TAB)` 
                : 'Single Tab (Open Chrome Split View to Sync)'}
            </span>
          </div>

          {/* Role Toggle Button */}
          <button
            onClick={() => setTabRole(r => r === 'LEFT' ? 'RIGHT' : 'LEFT')}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Switch Role: {tabRole}
          </button>
        </div>
      </header>

      {/* ── INSTRUCTION / ANNOUNCEMENT BANNER ── */}
      <div
        style={{
          background: tabRole === 'LEFT' ? 'rgba(0, 255, 102, 0.05)' : 'rgba(168, 85, 247, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '10px 24px',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#a1a1aa',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap size={14} color={tabRole === 'LEFT' ? '#00ff66' : '#a855f7'} />
          <span>
            {tabRole === 'LEFT' ? (
              <span>
                <strong style={{ color: '#00ff66' }}>LEFT TAB (CONTROLLER):</strong> Select stocks or click <strong>&quot;Beam 3D Card to Right View ➔&quot;</strong> to teleport objects across Chrome tabs!
              </span>
            ) : (
              <span>
                <strong style={{ color: '#a855f7' }}>RIGHT TAB (3D STAGE):</strong> Receiving real-time 3D telemetry, laser beam & teleported cards from Left Tab!
              </span>
            )}
          </span>
        </div>

        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#71717a' }}>
          {lastActionLog}
        </div>
      </div>

      {/* ── MAIN CONTENT AREA ── */}
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '40px 24px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {/* Render Tab Role Specific View */}
        {tabRole === 'LEFT' ? (
          /* ─── LEFT TAB VIEW: Controller & Emitter ─── */
          <div>
            <div style={{ marginBottom: '32px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#00ff66', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
                ⚡ CHROME SPLIT VIEW • CONTROLLER STAGE
              </div>
              <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px' }}>
                Select & Beam 3D Assets Across Chrome Tabs
              </h1>
              <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, maxWidth: '650px', lineHeight: 1.6 }}>
                Open this exact URL in Chrome&apos;s native Split View (Right Tab). Whatever you click or drag here will trigger 3D teleportation and live sync on the right screen!
              </p>
            </div>

            {/* Stock Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
              {STOCKS.map(stock => {
                const isSelected = selectedStock.ticker === stock.ticker
                return (
                  <motion.div
                    key={stock.ticker}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleSelectStock(stock)}
                    style={{
                      padding: '24px',
                      borderRadius: '16px',
                      background: isSelected ? 'rgba(0, 255, 102, 0.06)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1.5px solid #00ff66' : '1px solid rgba(255, 255, 255, 0.08)',
                      cursor: 'pointer',
                      boxShadow: isSelected ? '0 0 30px rgba(0, 255, 102, 0.15)' : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <div>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>{stock.ticker}</div>
                        <div style={{ fontSize: '12px', color: '#71717a' }}>{stock.name}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>{stock.price}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: stock.isUp ? '#34d399' : '#f87171' }}>{stock.change}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '16px', lineHeight: 1.5 }}>
                      <div>P/E: <strong>{stock.pe}</strong> • Cap: <strong>{stock.marketCap}</strong></div>
                      <div>Broker: <strong>{stock.broker}</strong></div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTeleportCard(stock)
                      }}
                      style={{
                        width: '100%',
                        padding: '10px',
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #059669, #10b981)',
                        border: 'none',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <span>Beam 3D Card to Right View</span>
                      <MoveRight size={14} />
                    </button>
                  </motion.div>
                )
              })}
            </div>

            {/* Active Beam Laser Animation Alert */}
            <AnimatePresence>
              {activeBeamAnim && (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    padding: '14px 24px',
                    borderRadius: '16px',
                    background: 'rgba(0, 255, 102, 0.2)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid #00ff66',
                    boxShadow: '0 0 40px rgba(0, 255, 102, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: '#00ff66',
                    fontWeight: 700,
                    fontSize: '14px',
                    zIndex: 100,
                  }}
                >
                  <Sparkles className="animate-spin" size={20} />
                  <span>3D Energy Beam Dispatched ➔ Emerging on Right Chrome Tab!</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* ─── RIGHT TAB VIEW: 3D Holographic Stage ─── */
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#a855f7', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px', fontFamily: "'JetBrains Mono', monospace" }}>
                  🔮 CHROME SPLIT VIEW • 3D HOLOGRAPHIC RECEIVER
                </div>
                <h1 style={{ fontSize: '36px', fontWeight: 900, margin: '0 0 12px', letterSpacing: '-1px' }}>
                  Live 3D Telemetry & Asset Receptor
                </h1>
                <p style={{ fontSize: '14px', color: '#a1a1aa', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
                  Receiving real-time 3D data streams from the Left Chrome Tab! Any stock selected or beamed will materialize here with 3D animation.
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
                    color: '#a1a1aa',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Clear Teleported Cards
                </button>
              )}
            </div>

            {/* Selected Stock Live 3D Holographic Inspection Card */}
            <div
              style={{
                padding: '32px',
                borderRadius: '24px',
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08), rgba(124, 58, 237, 0.03))',
                border: '1.5px solid rgba(168, 85, 247, 0.3)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(168, 85, 247, 0.15)',
                marginBottom: '40px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#a855f7', fontWeight: 700, marginBottom: '4px' }}>
                    REAL-TIME SYNCED ASSET
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>{selectedStock.ticker}</div>
                  <div style={{ fontSize: '14px', color: '#a1a1aa' }}>{selectedStock.name}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '32px', fontWeight: 900, color: '#ffffff' }}>{selectedStock.price}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: selectedStock.isUp ? '#34d399' : '#f87171' }}>{selectedStock.change}</div>
                </div>
              </div>

              {/* AI Prospectus Report */}
              <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '24px' }}>
                <div style={{ fontSize: '12px', color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Sparkles size={16} />
                  <span>AI Valuation & Broker Prospectus Summary</span>
                </div>
                <div style={{ fontSize: '13px', color: '#e4e4e7', lineHeight: 1.6 }}>
                  {selectedStock.aiSignal} • Broker Flow: <strong>{selectedStock.broker}</strong>. Valuation metrics indicate P/E of {selectedStock.pe} with total Market Capitalization of {selectedStock.marketCap}.
                </div>
              </div>

              {/* 3D Visualizer Bars */}
              <div style={{ fontSize: '12px', color: '#71717a', marginBottom: '10px' }}>3D Momentum Telemetry</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '100px' }}>
                {[35, 45, 60, 52, 78, 85, 92, 100].map((val, idx) => (
                  <div
                    key={idx}
                    style={{
                      flex: 1,
                      height: `${val}%`,
                      background: 'linear-gradient(to top, #7c3aed, #c084fc)',
                      borderRadius: '6px 6px 0 0',
                      boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)',
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Teleported 3D Cards Receive Queue */}
            {teleportedCards.length > 0 && (
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 16px', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={18} color="#a855f7" />
                  <span>Teleported 3D Asset Queue ({teleportedCards.length})</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {teleportedCards.map((card, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -100, rotateY: 90 }}
                      animate={{ opacity: 1, x: 0, rotateY: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      style={{
                        padding: '20px',
                        borderRadius: '16px',
                        background: 'rgba(168, 85, 247, 0.1)',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        boxShadow: '0 10px 30px rgba(168, 85, 247, 0.2)',
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#c084fc', fontWeight: 700, marginBottom: '4px' }}>
                        ✦ TELEPORTED FROM LEFT TAB
                      </div>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>{card.ticker}</div>
                      <div style={{ fontSize: '13px', color: '#a1a1aa' }}>{card.name} — {card.price}</div>
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
