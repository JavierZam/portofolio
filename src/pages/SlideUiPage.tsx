import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, GripVertical } from 'lucide-react'

/* ─── Shared Widget State ─────────────────────────────── */

function useWidgetState() {
  const [calcDisplay, setCalcDisplay] = useState('0')
  const [calcPrev, setCalcPrev] = useState<number | null>(null)
  const [calcOp, setCalcOp] = useState<string | null>(null)
  const [calcReset, setCalcReset] = useState(false)
  const [toggleA, setToggleA] = useState(true)
  const [toggleB, setToggleB] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [counter, setCounter] = useState(42)
  const [activeTab, setActiveTab] = useState(0)

  const calcInput = (val: string) => {
    if (calcReset) {
      setCalcDisplay(val)
      setCalcReset(false)
    } else {
      setCalcDisplay(prev => prev === '0' ? val : prev + val)
    }
  }

  const calcOperation = (op: string) => {
    setCalcPrev(parseFloat(calcDisplay))
    setCalcOp(op)
    setCalcReset(true)
  }

  const calcEquals = () => {
    if (calcPrev === null || !calcOp) return
    const curr = parseFloat(calcDisplay)
    let result = 0
    switch (calcOp) {
      case '+': result = calcPrev + curr; break
      case '-': result = calcPrev - curr; break
      case '×': result = calcPrev * curr; break
      case '÷': result = curr !== 0 ? calcPrev / curr : 0; break
    }
    setCalcDisplay(String(parseFloat(result.toFixed(8))))
    setCalcPrev(null)
    setCalcOp(null)
    setCalcReset(true)
  }

  const calcClear = () => {
    setCalcDisplay('0')
    setCalcPrev(null)
    setCalcOp(null)
    setCalcReset(false)
  }

  return {
    calcDisplay, calcInput, calcOperation, calcEquals, calcClear, calcOp,
    toggleA, setToggleA, toggleB, setToggleB,
    textInput, setTextInput,
    counter, setCounter,
    activeTab, setActiveTab,
  }
}

/* ─── Toggle Component ────────────────────────────────── */

function Toggle({ 
  on, onToggle, label, theme 
}: { 
  on: boolean; onToggle: () => void; label: string; theme: 'legacy' | 'modern' 
}) {
  const isLegacy = theme === 'legacy'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <button
        onClick={onToggle}
        style={{
          width: '44px',
          height: '24px',
          borderRadius: isLegacy ? '4px' : '12px',
          border: isLegacy
            ? `1px solid ${on ? '#39ff14' : '#333'}`
            : `1px solid ${on ? 'rgba(168,85,247,0.5)' : 'rgba(255,255,255,0.15)'}`,
          background: on
            ? (isLegacy ? '#39ff1430' : 'linear-gradient(135deg, #7c3aed, #a855f7)')
            : (isLegacy ? '#111' : 'rgba(255,255,255,0.08)'),
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s',
          padding: 0,
        }}
      >
        <div style={{
          width: '18px',
          height: '18px',
          borderRadius: isLegacy ? '3px' : '50%',
          background: on
            ? (isLegacy ? '#39ff14' : '#fff')
            : (isLegacy ? '#555' : 'rgba(255,255,255,0.4)'),
          position: 'absolute',
          top: '2px',
          left: on ? '22px' : '2px',
          transition: 'all 0.3s',
          boxShadow: on ? (isLegacy ? '0 0 8px #39ff14' : '0 0 8px rgba(168,85,247,0.5)') : 'none',
        }} />
      </button>
      <span style={{
        fontSize: '12px',
        color: isLegacy ? '#39ff14' : 'rgba(255,255,255,0.7)',
        fontFamily: isLegacy ? "'JetBrains Mono', monospace" : "'Inter', sans-serif",
      }}>
        {label}: {on ? 'ON' : 'OFF'}
      </span>
    </div>
  )
}

/* ─── Mini Chart ──────────────────────────────────────── */

function MiniChart({ theme, counter }: { theme: 'legacy' | 'modern'; counter: number }) {
  const isLegacy = theme === 'legacy'
  const bars = [35, 52, 28, 65, 45, 72, 38, counter % 80 + 20]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-end',
      gap: isLegacy ? '4px' : '6px',
      height: '80px',
      padding: '8px 0',
    }}>
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: `${h}%`,
            borderRadius: isLegacy ? '1px' : '4px 4px 0 0',
            background: isLegacy
              ? (i === bars.length - 1 ? '#39ff14' : '#39ff1450')
              : `linear-gradient(to top, ${i === bars.length - 1 ? '#a855f7' : 'rgba(168,85,247,0.3)'}, ${i === bars.length - 1 ? '#c084fc' : 'rgba(196,132,252,0.15)'})`,
            transition: 'height 0.5s ease',
            border: isLegacy ? '1px solid #39ff1440' : 'none',
          }}
        />
      ))}
    </div>
  )
}

/* ─── Legacy Terminal UI (Left Side) ──────────────────── */

function LegacyUI({ state }: { state: ReturnType<typeof useWidgetState> }) {
  const { calcDisplay, calcInput, calcOperation, calcEquals, calcClear, calcOp,
    toggleA, setToggleA, toggleB, setToggleB,
    textInput, setTextInput, counter, setCounter, activeTab, setActiveTab } = state

  const tabLabels = ['CALC', 'I/O', 'STATS']
  const btnStyle = (highlight = false): React.CSSProperties => ({
    padding: '8px',
    background: highlight ? '#39ff1420' : '#0d0d12',
    border: `1px solid ${highlight ? '#39ff14' : '#1a1a24'}`,
    color: highlight ? '#39ff14' : '#888',
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '13px',
    cursor: 'pointer',
    borderRadius: '2px',
    transition: 'all 0.15s',
  })

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: '#0a0a0f',
      color: '#39ff14',
      fontFamily: "'JetBrains Mono', monospace",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid #1a1a24',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#39ff14', fontSize: '14px' }}>▶</span>
          <span style={{ color: '#39ff14', fontSize: '16px', fontWeight: 700 }}>LEGACY_TERMINAL v2.0</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['#ff5f57', '#ffbd2e', '#28c840'].map((c, i) => (
            <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: c, opacity: 0.7 }} />
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #1a1a24',
      }}>
        {tabLabels.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            style={{
              flex: 1,
              padding: '10px',
              background: activeTab === i ? '#39ff1410' : 'transparent',
              border: 'none',
              borderBottom: activeTab === i ? '2px solid #39ff14' : '2px solid transparent',
              color: activeTab === i ? '#39ff14' : '#444',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '2px',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            [{t}]
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 24px', overflow: 'auto' }}>
        {activeTab === 0 && (
          <div>
            <div style={{ fontSize: '10px', color: '#444', marginBottom: '8px', letterSpacing: '1px' }}>
              // CALCULATOR MODULE
            </div>
            {/* Calculator Display */}
            <div style={{
              background: '#0d0d12',
              border: '1px solid #1a1a24',
              padding: '12px 16px',
              marginBottom: '12px',
              textAlign: 'right',
              fontSize: '24px',
              color: '#39ff14',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {calcOp && <span style={{ fontSize: '12px', color: '#39ff1460', marginRight: '8px' }}>{calcOp}</span>}
              {calcDisplay}
            </div>
            {/* Calculator Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
              {['7','8','9','÷','4','5','6','×','1','2','3','-','C','0','=','+'].map(b => (
                <button
                  key={b}
                  onClick={() => {
                    if (b === 'C') calcClear()
                    else if (b === '=') calcEquals()
                    else if (['+','-','×','÷'].includes(b)) calcOperation(b)
                    else calcInput(b)
                  }}
                  style={btnStyle(['÷','×','-','+','=','C'].includes(b))}
                  onMouseEnter={e => { e.currentTarget.style.background = '#39ff1420'; e.currentTarget.style.borderColor = '#39ff14' }}
                  onMouseLeave={e => { 
                    const hl = ['÷','×','-','+','=','C'].includes(b)
                    e.currentTarget.style.background = hl ? '#39ff1420' : '#0d0d12'
                    e.currentTarget.style.borderColor = hl ? '#39ff14' : '#1a1a24'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            <div style={{ fontSize: '10px', color: '#444', marginBottom: '16px', letterSpacing: '1px' }}>
              // INPUT / OUTPUT MODULE
            </div>
            {/* Text Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '10px', color: '#39ff1480', display: 'block', marginBottom: '6px' }}>
                $ echo &quot;message&quot; &gt;
              </label>
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="type here..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: '#0d0d12',
                  border: '1px solid #1a1a24',
                  color: '#39ff14',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: '13px',
                  outline: 'none',
                  borderRadius: '2px',
                  boxSizing: 'border-box',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#39ff14'}
                onBlur={e => e.currentTarget.style.borderColor = '#1a1a24'}
              />
              {textInput && (
                <div style={{ marginTop: '8px', padding: '8px 12px', background: '#0d0d12', border: '1px solid #1a1a24', fontSize: '12px', color: '#39ff1480' }}>
                  stdout: &quot;{textInput}&quot;
                </div>
              )}
            </div>

            {/* Toggles */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Toggle on={toggleA} onToggle={() => setToggleA(!toggleA)} label="DAEMON_A" theme="legacy" />
              <Toggle on={toggleB} onToggle={() => setToggleB(!toggleB)} label="DAEMON_B" theme="legacy" />
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            <div style={{ fontSize: '10px', color: '#444', marginBottom: '16px', letterSpacing: '1px' }}>
              // STATS MODULE
            </div>
            {/* Counter */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginBottom: '20px',
            }}>
              <button onClick={() => setCounter(c => c - 1)} style={btnStyle(true)}>--</button>
              <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '32px',
                fontWeight: 700,
                color: '#39ff14',
                textShadow: '0 0 20px rgba(57,255,20,0.3)',
              }}>
                {counter}
              </div>
              <button onClick={() => setCounter(c => c + 1)} style={btnStyle(true)}>++</button>
            </div>
            <div style={{ fontSize: '10px', color: '#444', marginBottom: '8px' }}>// CHART OUTPUT</div>
            <MiniChart theme="legacy" counter={counter} />
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={{
        padding: '8px 24px',
        borderTop: '1px solid #1a1a24',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '10px',
        color: '#39ff1460',
      }}>
        <span>LEGACY_OS // BUILD 1997.04.20</span>
        <span>▮ {toggleA ? 'DAEMON_A:RUN' : 'DAEMON_A:STOP'} | {toggleB ? 'DAEMON_B:RUN' : 'DAEMON_B:STOP'}</span>
      </div>
    </div>
  )
}

/* ─── Modern Glass UI (Right Side) ────────────────────── */

function ModernUI({ state }: { state: ReturnType<typeof useWidgetState> }) {
  const { calcDisplay, calcInput, calcOperation, calcEquals, calcClear, calcOp,
    toggleA, setToggleA, toggleB, setToggleB,
    textInput, setTextInput, counter, setCounter, activeTab, setActiveTab } = state

  const tabLabels = ['Calculator', 'Controls', 'Analytics']

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(135deg, #0f0a1e 0%, #1a1040 40%, #0d1025 100%)',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
          }}>✦</div>
          <span style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.5px' }}>Modern Dashboard</span>
        </div>
        <div style={{
          padding: '4px 12px',
          borderRadius: '20px',
          background: 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.25)',
          fontSize: '11px',
          color: '#c084fc',
          fontWeight: 600,
        }}>
          v3.0
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        padding: '12px 24px 0',
      }}>
        {tabLabels.map((t, i) => (
          <button
            key={t}
            onClick={() => setActiveTab(i)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px 10px 0 0',
              background: activeTab === i ? 'rgba(168,85,247,0.12)' : 'transparent',
              border: 'none',
              borderBottom: activeTab === i ? '2px solid #a855f7' : '2px solid transparent',
              color: activeTab === i ? '#c084fc' : 'rgba(255,255,255,0.35)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 24px', overflow: 'auto' }}>
        {activeTab === 0 && (
          <div>
            {/* Calculator Display */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '12px',
              textAlign: 'right',
            }}>
              {calcOp && <div style={{ fontSize: '11px', color: 'rgba(168,85,247,0.5)', marginBottom: '4px' }}>{calcOp}</div>}
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#fff', letterSpacing: '-1px' }}>{calcDisplay}</div>
            </div>
            {/* Calculator Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {['7','8','9','÷','4','5','6','×','1','2','3','-','C','0','=','+'].map(b => {
                const isOp = ['÷','×','-','+','=','C'].includes(b)
                return (
                  <button
                    key={b}
                    onClick={() => {
                      if (b === 'C') calcClear()
                      else if (b === '=') calcEquals()
                      else if (['+','-','×','÷'].includes(b)) calcOperation(b)
                      else calcInput(b)
                    }}
                    style={{
                      padding: '12px',
                      background: isOp ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isOp ? 'rgba(168,85,247,0.3)' : 'rgba(255,255,255,0.06)'}`,
                      color: isOp ? '#c084fc' : 'rgba(255,255,255,0.8)',
                      fontSize: '15px',
                      fontWeight: 600,
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      fontFamily: "'Inter', sans-serif",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = isOp ? 'rgba(168,85,247,0.25)' : 'rgba(255,255,255,0.08)'
                      e.currentTarget.style.transform = 'scale(1.05)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = isOp ? 'rgba(168,85,247,0.15)' : 'rgba(255,255,255,0.04)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    {b}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 1 && (
          <div>
            {/* Text Input */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '16px',
            }}>
              <label style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                Message
              </label>
              <input
                type="text"
                value={textInput}
                onChange={e => setTextInput(e.target.value)}
                placeholder="Type something..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: "'Inter', sans-serif",
                  boxSizing: 'border-box',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => e.currentTarget.style.borderColor = 'rgba(168,85,247,0.5)'}
                onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {textInput && (
                <div style={{
                  marginTop: '10px',
                  padding: '10px 14px',
                  background: 'rgba(168,85,247,0.08)',
                  borderRadius: '10px',
                  border: '1px solid rgba(168,85,247,0.15)',
                  fontSize: '13px',
                  color: 'rgba(196,132,252,0.8)',
                }}>
                  Output: "{textInput}"
                </div>
              )}
            </div>

            {/* Toggles */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Toggles</div>
              <Toggle on={toggleA} onToggle={() => setToggleA(!toggleA)} label="Feature A" theme="modern" />
              <Toggle on={toggleB} onToggle={() => setToggleB(!toggleB)} label="Feature B" theme="modern" />
            </div>
          </div>
        )}

        {activeTab === 2 && (
          <div>
            {/* Counter */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '12px' }}>Counter</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                <button
                  onClick={() => setCounter(c => c - 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(168,85,247,0.15)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    color: '#c084fc',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >−</button>
                <span style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-2px',
                  minWidth: '60px',
                }}>
                  {counter}
                </span>
                <button
                  onClick={() => setCounter(c => c + 1)}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'rgba(168,85,247,0.15)',
                    border: '1px solid rgba(168,85,247,0.3)',
                    color: '#c084fc',
                    fontSize: '18px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >+</button>
              </div>
            </div>

            {/* Chart */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '16px',
              padding: '16px 20px',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginBottom: '8px' }}>Activity</div>
              <MiniChart theme="modern" counter={counter} />
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div style={{
        padding: '10px 24px',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.3)',
        background: 'rgba(255,255,255,0.02)',
      }}>
        <span>Modern Dashboard</span>
        <div style={{ display: 'flex', gap: '12px' }}>
          <span style={{ color: toggleA ? '#a855f7' : undefined }}>● Feature A</span>
          <span style={{ color: toggleB ? '#a855f7' : undefined }}>● Feature B</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Main Slide UI Page ──────────────────────────────── */

export default function SlideUiPage() {
  const state = useWidgetState()
  const [sliderPos, setSliderPos] = useState(50)
  const isDragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100))
    setSliderPos(pct)
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
      window.removeEventListener('touchend', handleMouseUp)
    }
  }, [handleMouseMove, handleTouchMove])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      fontFamily: "'Inter', sans-serif",
    }}>
      {/* Top Bar */}
      <div style={{
        padding: '12px 24px',
        background: 'rgba(255,255,255,0.02)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link
          to="/labs"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.5)',
            textDecoration: 'none',
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        >
          <ArrowLeft size={16} /> Back to DevLabs
        </Link>

        <div style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          slider: {sliderPos.toFixed(0)}%
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          textAlign: 'center',
          padding: '20px 24px 12px',
        }}
      >
        <h1 style={{
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 800,
          letterSpacing: '-1px',
          margin: 0,
        }}>
          <span style={{ color: '#39ff14' }}>Legacy</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', margin: '0 12px' }}>⟵ slide ⟶</span>
          <span style={{ color: '#a855f7' }}>Modern</span>
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'rgba(255,255,255,0.35)',
          marginTop: '6px',
        }}>
          Drag the handle to morph between two fully functional UIs
        </p>
      </motion.div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          height: 'calc(100vh - 160px)',
          maxHeight: '600px',
          margin: '0 auto',
          borderRadius: '16px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
          userSelect: 'none',
          cursor: isDragging.current ? 'col-resize' : 'default',
        }}
      >
        {/* Layer 1: Legacy (full width, behind) */}
        <LegacyUI state={state} />

        {/* Layer 2: Modern (clipped from right side) */}
        <div style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 0 0 ${sliderPos}%)`,
          transition: isDragging.current ? 'none' : 'clip-path 0.1s ease',
        }}>
          <ModernUI state={state} />
        </div>

        {/* Slider Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${sliderPos}%`,
            transform: 'translateX(-50%)',
            width: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'col-resize',
            zIndex: 10,
          }}
        >
          {/* Vertical Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, #39ff14, #a855f7)',
            boxShadow: '0 0 12px rgba(168,85,247,0.4), 0 0 4px rgba(57,255,20,0.3)',
          }} />

          {/* Handle Grip */}
          <div style={{
            width: '32px',
            height: '48px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1a1a24, #0f0a1e)',
            border: '1px solid rgba(168,85,247,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(168,85,247,0.2)',
            zIndex: 1,
          }}>
            <GripVertical size={16} color="rgba(168,85,247,0.7)" />
          </div>
        </div>

        {/* Side Labels */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '12px',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '3px',
          color: '#39ff1430',
          fontFamily: "'JetBrains Mono', monospace",
          pointerEvents: 'none',
        }}>
          LEGACY
        </div>
        <div style={{
          position: 'absolute',
          top: '50%',
          right: '12px',
          transform: 'translateY(-50%)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontSize: '10px',
          fontWeight: 700,
          letterSpacing: '3px',
          color: 'rgba(168,85,247,0.2)',
          fontFamily: "'Inter', sans-serif",
          pointerEvents: 'none',
        }}>
          MODERN
        </div>
      </div>
    </div>
  )
}
