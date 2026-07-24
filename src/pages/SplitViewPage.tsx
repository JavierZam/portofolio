import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Columns2, ArrowLeftRight, Maximize2, Minimize2, RotateCcw, 
  TrendingUp, Activity, Terminal as TerminalIcon, FileCode, Upload, 
  ChevronRight, Play, RefreshCw, CheckCircle2, AlertTriangle, FileText,
  Search, ShieldCheck, Database, Layers, Sparkles, X
} from 'lucide-react'

/* ─── Mock Data for Stock & IPO Analyzer ───────────────── */

const STOCK_DATA: Record<string, {
  name: string
  price: string
  change: string
  isUp: boolean
  pe: string
  pbv: string
  marketCap: string
  brokerNet: string
  aiVerdict: string
  chartData: number[]
}> = {
  'BBCA.JK': {
    name: 'PT Bank Central Asia Tbk',
    price: 'Rp 10,250',
    change: '+1.75%',
    isUp: true,
    pe: '24.2x',
    pbv: '4.8x',
    marketCap: 'Rp 1,263 T',
    brokerNet: '+Rp 142.5 B (AK, ZP, BK)',
    aiVerdict: 'STRONG BUY (Solid Fundamentals)',
    chartData: [40, 45, 42, 58, 62, 55, 70, 78, 85, 92],
  },
  'GOTO.JK': {
    name: 'GoTo Gojek Tokopedia Tbk',
    price: 'Rp 64',
    change: '-3.03%',
    isUp: false,
    pe: '-12.4x',
    pbv: '0.7x',
    marketCap: 'Rp 76.8 T',
    brokerNet: '-Rp 28.4 B (OD, CC, YU)',
    aiVerdict: 'HOLD (Wait for Ebitda Turnaround)',
    chartData: [80, 75, 60, 65, 50, 45, 52, 48, 42, 38],
  },
  'AMMN.JK': {
    name: 'Amman Mineral Internasional Tbk',
    price: 'Rp 11,800',
    change: '+4.42%',
    isUp: true,
    pe: '38.6x',
    pbv: '7.1x',
    marketCap: 'Rp 854 T',
    brokerNet: '+Rp 89.2 B (CS, AG, RX)',
    aiVerdict: 'BUY ON BREAKOUT (Copper Surge)',
    chartData: [30, 38, 45, 42, 60, 72, 68, 84, 90, 98],
  },
  'IPO_TECH': {
    name: 'PT Cyber Cloud Nusantara (IPO Draft)',
    price: 'Rp 280 (Offer)',
    change: 'NEW IPO',
    isUp: true,
    pe: '18.5x',
    pbv: '2.3x',
    marketCap: 'Rp 420 B',
    brokerNet: 'Underwriter: PT Mandiri Sekuritas',
    aiVerdict: 'OVERSUBSCRIBED (High Growth Sector)',
    chartData: [20, 25, 35, 50, 65, 80, 95, 110, 125, 140],
  },
}

/* ─── MODULE 1: Stock & IPO Analyzer ──────────────────── */

function StockAnalyzerModule() {
  const [selectedStock, setSelectedStock] = useState('BBCA.JK')
  const [importedFile, setImportedFile] = useState<string | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const stock = STOCK_DATA[selectedStock]

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsParsing(true)
      setTimeout(() => {
        setImportedFile(file.name)
        setIsParsing(false)
        setSelectedStock('IPO_TECH')
      }, 1200)
    }
  }

  return (
    <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box', overflowY: 'auto', color: '#e4e4e7', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TrendingUp size={20} color="#10b981" />
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>Stock & IPO Intelligence</h3>
        </div>
        <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          AI PDF Parser Ready
        </span>
      </div>

      {/* Stock Ticker Buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {Object.keys(STOCK_DATA).map(ticker => (
          <button
            key={ticker}
            onClick={() => setSelectedStock(ticker)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: selectedStock === ticker ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.04)',
              border: selectedStock === ticker ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.08)',
              color: selectedStock === ticker ? '#c084fc' : '#a1a1aa',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {ticker}
          </button>
        ))}
      </div>

      {/* PDF Import Drag Box */}
      <div
        style={{
          border: '1.5px dashed rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.02)',
          marginBottom: '20px',
          position: 'relative',
        }}
      >
        <input
          type="file"
          accept=".pdf,.json,.csv"
          onChange={handleFileUpload}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
        />
        <Upload size={22} color="#a855f7" style={{ margin: '0 auto 6px' }} />
        <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff' }}>
          {isParsing ? 'Parsing Broker Prospectus PDF...' : importedFile ? `Imported: ${importedFile}` : 'Drop Broker Prospectus / IPO PDF here'}
        </div>
        <div style={{ fontSize: '11px', color: '#71717a', marginTop: '2px' }}>
          Supports Mandiri Sekuritas, Stockbit, & IDX Prospectus PDF
        </div>
      </div>

      {/* Selected Stock Overview Card */}
      <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff' }}>{selectedStock}</div>
            <div style={{ fontSize: '12px', color: '#71717a' }}>{stock.name}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#ffffff' }}>{stock.price}</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: stock.isUp ? '#34d399' : '#f87171' }}>{stock.change}</div>
          </div>
        </div>

        {/* AI Verdict */}
        <div style={{ padding: '10px 12px', borderRadius: '8px', background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)', fontSize: '12px', color: '#c084fc', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} />
          <span>AI Insight: {stock.aiVerdict}</span>
        </div>
      </div>

      {/* Sparkline Chart */}
      <div style={{ padding: '16px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#a1a1aa', fontWeight: 600, marginBottom: '12px' }}>Price Momentum Trend</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '90px' }}>
          {stock.chartData.map((val, idx) => (
            <div
              key={idx}
              style={{
                flex: 1,
                height: `${val}%`,
                background: stock.isUp ? 'linear-gradient(to top, #059669, #34d399)' : 'linear-gradient(to top, #dc2626, #f87171)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.4s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Valuation Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '11px', color: '#71717a' }}>P/E Ratio</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{stock.pe}</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '11px', color: '#71717a' }}>P/BV Ratio</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{stock.pbv}</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '11px', color: '#71717a' }}>Market Cap</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>{stock.marketCap}</div>
        </div>
        <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '11px', color: '#71717a' }}>Broker Summary</div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#34d399' }}>{stock.brokerNet}</div>
        </div>
      </div>
    </div>
  )
}

/* ─── MODULE 2: GCP Live Cloud Run Console ────────────── */

function GcpCloudModule() {
  const [method, setMethod] = useState('GET')
  const [endpoint, setEndpoint] = useState('/api/v1/stocks/BBCA.JK')
  const [status, setStatus] = useState(200)
  const [latency, setLatency] = useState(42)
  const [jsonResponse, setJsonResponse] = useState<string>(
    JSON.stringify({
      symbol: 'BBCA.JK',
      status: 'ACTIVE',
      last_price: 10250,
      currency: 'IDR',
      gcp_cluster: 'asia-southeast2-a',
      cloud_run_revision: 'stock-api-00042-xyz',
      cached_in_redis: true,
      timestamp: new Date().toISOString(),
    }, null, 2)
  )

  const handleTestApi = () => {
    setLatency(Math.floor(Math.random() * 30) + 15)
    const codes = [200, 200, 200, 201, 429]
    const chosenStatus = codes[Math.floor(Math.random() * codes.length)]
    setStatus(chosenStatus)

    setJsonResponse(
      JSON.stringify({
        endpoint: endpoint,
        status_code: chosenStatus,
        executed_at: new Date().toISOString(),
        latency_ms: latency,
        data: {
          gcp_project: 'javier-cloud-prod',
          instance: 'cloud-run-worker-01',
          uptime: '99.99%',
        }
      }, null, 2)
    )
  }

  return (
    <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box', overflowY: 'auto', color: '#e4e4e7', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={20} color="#38bdf8" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>GCP Cloud Run API Console</h3>
        </div>
        <span style={{ fontSize: '11px', color: '#38bdf8', padding: '2px 8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '12px' }}>
          asia-southeast2 (Jakarta)
        </span>
      </div>

      {/* Microservice Health Indicators */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '16px' }}>
        <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '10px', color: '#71717a' }}>Requests/sec</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#34d399' }}>1,240 req/s</div>
        </div>
        <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '10px', color: '#71717a' }}>Latency</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#38bdf8' }}>{latency} ms</div>
        </div>
        <div style={{ padding: '10px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
          <div style={{ fontSize: '10px', color: '#71717a' }}>HTTP Status</div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: status === 200 ? '#34d399' : '#f87171' }}>{status} OK</div>
        </div>
      </div>

      {/* API Tester Bar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#34d399',
            padding: '8px',
            borderRadius: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
        </select>
        <input
          type="text"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          style={{
            flex: 1,
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '12px',
            outline: 'none',
          }}
        />
        <button
          onClick={handleTestApi}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: '#0284c7',
            color: '#ffffff',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
          }}
        >
          <Play size={12} /> Send
        </button>
      </div>

      {/* JSON Viewer */}
      <div style={{ borderRadius: '10px', background: '#070a12', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '14px', overflowX: 'auto' }}>
        <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', paddingBottom: '6px' }}>
          RESPONSE PAYLOAD (application/json)
        </div>
        <pre style={{ margin: 0, fontSize: '12px', color: '#a5f3fc', lineHeight: 1.5 }}>
          {jsonResponse}
        </pre>
      </div>
    </div>
  )
}

/* ─── MODULE 3: Code & JSON Transformer ────────────────── */

function CodeTransformerModule() {
  const [rawJson, setRawJson] = useState(`{\n  "broker": "Mandiri Sekuritas",\n  "target_price": 12500,\n  "recommendation": "BUY"\n}`)
  const [outputFormat, setOutputFormat] = useState<'ts' | 'golang' | 'minified'>('ts')

  const getTransformed = () => {
    try {
      const parsed = JSON.parse(rawJson)
      if (outputFormat === 'minified') {
        return JSON.stringify(parsed)
      } else if (outputFormat === 'golang') {
        return `type StockReport struct {\n` +
          Object.keys(parsed).map(k => `  ${k.toUpperCase()} interface{} \`json:"${k}"\``).join('\n') +
          `\n}`
      } else {
        return `export interface StockReport {\n` +
          Object.keys(parsed).map(k => `  ${k}: ${typeof parsed[k]};`).join('\n') +
          `\n}`
      }
    } catch {
      return '// Invalid JSON Syntax'
    }
  }

  return (
    <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box', overflowY: 'auto', color: '#e4e4e7', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCode size={20} color="#f43f5e" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Schema Transformer</h3>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {(['ts', 'golang', 'minified'] as const).map(fmt => (
            <button
              key={fmt}
              onClick={() => setOutputFormat(fmt)}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                background: outputFormat === fmt ? 'rgba(244, 63, 94, 0.2)' : 'transparent',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fda4af',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {fmt.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', height: 'calc(100% - 60px)' }}>
        <div>
          <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '6px' }}>INPUT JSON</div>
          <textarea
            value={rawJson}
            onChange={e => setRawJson(e.target.value)}
            style={{
              width: '100%',
              height: '240px',
              background: '#080c14',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              color: '#34d399',
              padding: '12px',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: '#71717a', marginBottom: '6px' }}>GENERATED TYPE / OUTPUT</div>
          <div style={{ height: '240px', background: '#080c14', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '12px', color: '#fda4af', overflow: 'auto', fontSize: '12px', boxSizing: 'border-box' }}>
            <pre style={{ margin: 0 }}>{getTransformed()}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── MODULE 4: Real-time System Logs ─────────────────── */

function LogsModule() {
  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] GCP Cloud Run worker spawned in asia-southeast2',
    '[INFO] Worker connected to Firestore cluster',
    '[SUCCESS] Stock data index synchronized for BBCA.JK',
    '[INFO] Broker PDF parsing queue idle',
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      const sample = [
        `[METRIC] Latency check: ${Math.floor(Math.random() * 20) + 15}ms OK`,
        `[CACHE] Redis key 'stock_bbca' hit count: ${Math.floor(Math.random() * 500) + 100}`,
        `[CRON] Auto-fetch IDX broker summary completed`,
        `[HEALTH] Service status 200 OK`,
      ]
      const log = sample[Math.floor(Math.random() * sample.length)]
      setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()} ${log}`])
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{ padding: '20px', height: '100%', boxSizing: 'border-box', overflowY: 'auto', color: '#e4e4e7', fontFamily: "'JetBrains Mono', monospace" }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <TerminalIcon size={20} color="#fbbf24" />
          <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#ffffff' }}>Live Cloud Telemetry</h3>
        </div>
        <span style={{ fontSize: '11px', color: '#fbbf24', padding: '2px 8px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', borderRadius: '12px' }}>
          LIVE STREAM
        </span>
      </div>

      <div style={{ background: '#05070f', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', padding: '16px', minHeight: '300px' }}>
        {logs.map((l, i) => (
          <div key={i} style={{ fontSize: '12px', lineHeight: 1.7, color: l.includes('SUCCESS') ? '#34d399' : l.includes('METRIC') ? '#38bdf8' : '#fbbf24' }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── MAIN SPLIT VIEW PAGE COMPONENT ──────────────────── */

export default function SplitViewPage() {
  const [splitRatio, setSplitRatio] = useState(50) // percentage for left pane
  const [leftModule, setLeftModule] = useState<'stock' | 'gcp' | 'code' | 'logs'>('stock')
  const [rightModule, setRightModule] = useState<'stock' | 'gcp' | 'code' | 'logs'>('gcp')
  const [focusedPane, setFocusedPane] = useState<'both' | 'left' | 'right'>('both')

  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSwap = () => {
    const temp = leftModule
    setLeftModule(rightModule)
    setRightModule(temp)
  }

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(15, Math.min(85, (x / rect.width) * 100))
    setSplitRatio(pct)
  }, [])

  const handleMouseDown = () => { isDragging.current = true }
  const handleMouseUp = () => { isDragging.current = false }

  const handleMouseMove = useCallback((e: MouseEvent) => handleMove(e.clientX), [handleMove])
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length > 0) handleMove(e.touches[0].clientX)
  }, [handleMove])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })
    window.addEventListener('touchend', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove])

  const renderModule = (mod: 'stock' | 'gcp' | 'code' | 'logs') => {
    switch (mod) {
      case 'stock': return <StockAnalyzerModule />
      case 'gcp': return <GcpCloudModule />
      case 'code': return <CodeTransformerModule />
      case 'logs': return <LogsModule />
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#05070e', overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: "'Inter', sans-serif" }}>
      
      {/* ── CHROME SPLIT VIEW INSPIRED ACTION BAR (Top Header) ── */}
      <header
        style={{
          height: '52px',
          background: '#090d16',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Link to="/labs" style={{ color: '#a1a1aa', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600 }}>
            <ArrowLeft size={16} /> DevLabs
          </Link>
          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffffff', fontSize: '14px', fontWeight: 700 }}>
            <Columns2 size={18} color="#a855f7" />
            <span>Chrome Split View Lab</span>
          </div>
        </div>

        {/* Chrome Split View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleSwap}
            title="Reverse Views (Swap Left & Right)"
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ArrowLeftRight size={14} /> Reverse Views
          </button>

          <div style={{ width: '1px', height: '18px', background: 'rgba(255, 255, 255, 0.1)' }} />

          <button
            onClick={() => setFocusedPane('left')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: focusedPane === 'left' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Focus Left
          </button>
          <button
            onClick={() => setFocusedPane('both')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: focusedPane === 'both' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Split (50:50)
          </button>
          <button
            onClick={() => setFocusedPane('right')}
            style={{
              padding: '6px 10px',
              borderRadius: '8px',
              background: focusedPane === 'right' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Focus Right
          </button>
        </div>
      </header>

      {/* ── DUAL PANE WORKSPACE ── */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* LEFT PANE */}
        {(focusedPane === 'both' || focusedPane === 'left') && (
          <div
            style={{
              width: focusedPane === 'left' ? '100%' : `${splitRatio}%`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderRight: focusedPane === 'both' ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
              background: '#060911',
            }}
          >
            {/* Left Selector Bar */}
            <div style={{ padding: '8px 16px', background: '#0c101c', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: '8px' }}>
              {(['stock', 'gcp', 'code', 'logs'] as const).map(mod => (
                <button
                  key={mod}
                  onClick={() => setLeftModule(mod)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: leftModule === mod ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    border: leftModule === mod ? '1px solid rgba(168, 85, 247, 0.4)' : 'none',
                    color: leftModule === mod ? '#c084fc' : '#71717a',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {mod}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              {renderModule(leftModule)}
            </div>
          </div>
        )}

        {/* DRAGGABLE RESIZER BAR */}
        {focusedPane === 'both' && (
          <div
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{
              width: '10px',
              margin: '0 -5px',
              height: '100%',
              cursor: 'col-resize',
              zIndex: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '2px', height: '100%', background: 'rgba(168, 85, 247, 0.4)' }} />
          </div>
        )}

        {/* RIGHT PANE */}
        {(focusedPane === 'both' || focusedPane === 'right') && (
          <div
            style={{
              width: focusedPane === 'right' ? '100%' : `${100 - splitRatio}%`,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              background: '#060812',
            }}
          >
            {/* Right Selector Bar */}
            <div style={{ padding: '8px 16px', background: '#0b0d1a', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', gap: '8px' }}>
              {(['stock', 'gcp', 'code', 'logs'] as const).map(mod => (
                <button
                  key={mod}
                  onClick={() => setRightModule(mod)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '6px',
                    background: rightModule === mod ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    border: rightModule === mod ? '1px solid rgba(56, 189, 248, 0.4)' : 'none',
                    color: rightModule === mod ? '#38bdf8' : '#71717a',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                  }}
                >
                  {mod}
                </button>
              ))}
            </div>

            <div style={{ flex: 1, overflow: 'hidden' }}>
              {renderModule(rightModule)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
