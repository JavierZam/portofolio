import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, GripVertical, MapPin, Github, Linkedin, ExternalLink, Briefcase, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

/* ─── Portfolio Data (mirrors real portfolio) ─────────── */

const portfolio = {
  name: 'Javier Zam',
  greeting: "Hey, I'm",
  subtitle: 'Software Engineer · Cloud Enthusiast · Occasional Gamer',
  location: 'Jakarta, Indonesia',
  bio: 'I build backend systems, break things in production, and deploy to GCP at 3 AM.',
  skills: [
    { name: 'Golang', level: 95 },
    { name: 'React', level: 80 },
    { name: 'GCP', level: 90 },
    { name: 'Docker', level: 85 },
    { name: 'Node.js', level: 82 },
    { name: 'PostgreSQL', level: 88 },
  ],
  projects: [
    { title: 'PayViz', desc: 'Enterprise payroll management system', tags: ['Vue.js', 'Node.js', 'PostgreSQL'] },
    { title: 'Pasargamex', desc: 'Online game marketplace with real-time chat', tags: ['Golang', 'React', 'GCP'] },
    { title: 'Trackori', desc: 'ML-powered calorie tracking app', tags: ['GCP', 'FastAPI', 'ML'] },
  ],
  experience: [
    { title: 'Software Developer', company: 'PT Bisnis Adviz Solusi', period: '2025 – Present', type: 'work' as const },
    { title: 'Fullstack Developer', company: 'HiColleagues', period: '2023 – 2024', type: 'work' as const },
    { title: 'Cloud Computing', company: 'Bangkit Academy (Google)', period: '2023', type: 'education' as const },
  ],
  stats: [
    { label: 'GitHub Repos', value: '35+' },
    { label: 'Bugs Created', value: '∞' },
    { label: 'Bugs Fixed', value: 'Most?' },
    { label: 'Coffee/Day', value: '☕×4' },
  ],
}

/* ─── Retro Terminal Theme (Left) ─────────────────────── */

function RetroPortfolio() {
  const s = {
    bg: '#0a0a0f',
    card: '#0d0d14',
    border: '#1a1a24',
    accent: '#39ff14',
    accentDim: '#39ff1460',
    text: '#39ff14',
    textDim: '#39ff1480',
    textMuted: '#333',
    font: "'JetBrains Mono', 'Fira Code', monospace",
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: s.bg, color: s.text,
      fontFamily: s.font, overflow: 'auto',
    }}>
      {/* ── Navbar ── */}
      <div style={{
        padding: '12px 20px', borderBottom: `1px solid ${s.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontWeight: 700, fontSize: '14px' }}>
          <span style={{ color: s.accent }}>&lt;</span>Javier Zam<span style={{ color: s.accent }}> /&gt;</span>
        </span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: s.textDim }}>
          {['About', 'Exp', 'Projects'].map(l => (
            <span key={l} style={{ cursor: 'pointer' }}>[{l}]</span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ padding: '28px 20px 20px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '3px 12px', border: `1px solid ${s.border}`,
          fontSize: '10px', color: s.textDim, marginBottom: '12px',
        }}>
          <MapPin size={10} /> {portfolio.location}
        </div>
        <div style={{ fontSize: '11px', color: s.textDim, marginBottom: '4px' }}>
          $ echo "{portfolio.greeting}"
        </div>
        <h1 style={{
          fontSize: '28px', fontWeight: 900, color: s.accent, margin: '0 0 6px',
          textShadow: `0 0 20px ${s.accentDim}`, letterSpacing: '-1px',
        }}>
          {portfolio.name}<span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
        </h1>
        <p style={{ fontSize: '10px', color: s.textDim, margin: '0 0 14px', letterSpacing: '1px' }}>
          {portfolio.subtitle.toUpperCase()}
        </p>
        <p style={{ fontSize: '11px', color: s.textDim, margin: '0 0 16px', lineHeight: 1.6, maxWidth: '400px', marginInline: 'auto' }}>
          // {portfolio.bio}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button style={{
            padding: '8px 20px', background: s.accent, color: '#000',
            border: 'none', fontFamily: s.font, fontSize: '11px', fontWeight: 700,
            cursor: 'pointer', letterSpacing: '1px',
          }}>
            SEE_WORK ↓
          </button>
          <button style={{
            padding: '8px 16px', background: 'transparent',
            border: `1px solid ${s.border}`, color: s.textDim,
            fontFamily: s.font, fontSize: '11px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Github size={12} /> GitHub
          </button>
          <button style={{
            padding: '8px 16px', background: 'transparent',
            border: `1px solid ${s.border}`, color: s.textDim,
            fontFamily: s.font, fontSize: '11px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Linkedin size={12} /> LinkedIn
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: '10px', color: s.textMuted, marginBottom: '8px', letterSpacing: '1px' }}>
          // QUICK_STATS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
          {portfolio.stats.map(st => (
            <div key={st.label} style={{
              padding: '10px 8px', background: s.card, border: `1px solid ${s.border}`,
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 700, color: s.accent }}>{st.value}</div>
              <div style={{ fontSize: '9px', color: s.textDim, marginTop: '2px' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skills ── */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: '10px', color: s.textMuted, marginBottom: '10px', letterSpacing: '1px' }}>
          // SKILL_PROFICIENCY
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {portfolio.skills.map(sk => (
            <div key={sk.name} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', color: s.textDim, width: '80px', textAlign: 'right' }}>{sk.name}</span>
              <div style={{ flex: 1, height: '8px', background: s.card, border: `1px solid ${s.border}` }}>
                <div style={{
                  height: '100%', width: `${sk.level}%`,
                  background: s.accent, boxShadow: `0 0 6px ${s.accentDim}`,
                  transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontSize: '9px', color: s.accent, width: '28px' }}>{sk.level}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Experience ── */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: '10px', color: s.textMuted, marginBottom: '10px', letterSpacing: '1px' }}>
          // EXPERIENCE_LOG
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {portfolio.experience.map((exp, i) => (
            <div key={i} style={{
              padding: '10px 12px', background: s.card, border: `1px solid ${s.border}`,
              display: 'flex', alignItems: 'center', gap: '10px',
            }}>
              <div style={{
                width: '24px', height: '24px', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${s.border}`, color: s.accent, fontSize: '12px',
              }}>
                {exp.type === 'work' ? <Briefcase size={12} /> : <GraduationCap size={12} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: s.accent }}>{exp.title}</div>
                <div style={{ fontSize: '10px', color: s.textDim }}>{exp.company} | {exp.period}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Projects ── */}
      <div style={{ padding: '0 20px 16px' }}>
        <div style={{ fontSize: '10px', color: s.textMuted, marginBottom: '10px', letterSpacing: '1px' }}>
          // PROJECT_INDEX
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {portfolio.projects.map((p, i) => (
            <div key={i} style={{
              padding: '12px', background: s.card, border: `1px solid ${s.border}`,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: s.accent }}>{p.title}</span>
                <ExternalLink size={10} color={s.textDim} style={{ cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '10px', color: s.textDim, margin: '0 0 6px', lineHeight: 1.5 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    padding: '2px 6px', fontSize: '9px', border: `1px solid ${s.border}`,
                    color: s.textDim,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '12px 20px', borderTop: `1px solid ${s.border}`,
        fontSize: '9px', color: s.textMuted, textAlign: 'center',
      }}>
        LEGACY_OS // BUILT_WITH: mendoan + late-night deploys
      </div>
    </div>
  )
}

/* ─── Modern Glass Theme (Right) ──────────────────────── */

function ModernPortfolio() {
  const s = {
    bg: 'linear-gradient(135deg, #0f0a1e 0%, #1a1040 40%, #0d1025 100%)',
    card: 'rgba(255,255,255,0.04)',
    cardBorder: 'rgba(255,255,255,0.08)',
    accent: '#a855f7',
    accentLight: '#c084fc',
    accentBg: 'rgba(168,85,247,0.12)',
    accentBorder: 'rgba(168,85,247,0.25)',
    text: '#ffffff',
    textSec: 'rgba(255,255,255,0.6)',
    textMuted: 'rgba(255,255,255,0.35)',
    font: "'Inter', 'Segoe UI', sans-serif",
  }

  return (
    <div style={{
      position: 'absolute', inset: 0, background: s.bg, color: s.text,
      fontFamily: s.font, overflow: 'auto',
    }}>
      {/* ── Navbar ── */}
      <div style={{
        padding: '14px 20px', borderBottom: `1px solid ${s.cardBorder}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(12px)',
      }}>
        <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.5px' }}>
          <span style={{ color: s.accentLight }}>&lt;</span>Javier Zam<span style={{ color: s.accentLight }}> /&gt;</span>
        </span>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: s.textMuted }}>
          {['About', 'Exp', 'Projects'].map(l => (
            <span key={l} style={{ cursor: 'pointer', transition: 'color 0.2s' }}>{l}</span>
          ))}
        </div>
      </div>

      {/* ── Hero ── */}
      <div style={{ padding: '32px 20px 24px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '5px 14px', borderRadius: '20px',
          background: s.accentBg, border: `1px solid ${s.accentBorder}`,
          fontSize: '11px', color: s.accentLight, marginBottom: '14px',
        }}>
          <MapPin size={11} /> {portfolio.location}
        </div>
        <div style={{ fontSize: '13px', color: s.textMuted, marginBottom: '4px' }}>
          {portfolio.greeting}
        </div>
        <h1 style={{
          fontSize: '32px', fontWeight: 800, color: s.text, margin: '0 0 6px',
          letterSpacing: '-1.5px',
        }}>
          {portfolio.name}
        </h1>
        <p style={{ fontSize: '12px', color: s.textSec, margin: '0 0 14px', letterSpacing: '0.5px' }}>
          {portfolio.subtitle}
        </p>
        <p style={{ fontSize: '12px', color: s.textMuted, margin: '0 0 18px', lineHeight: 1.6, maxWidth: '400px', marginInline: 'auto' }}>
          {portfolio.bio}
        </p>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button style={{
            padding: '10px 22px', background: `linear-gradient(135deg, #7c3aed, ${s.accent})`,
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            fontFamily: s.font, boxShadow: '0 4px 20px rgba(168,85,247,0.3)',
          }}>
            See my work ↓
          </button>
          <button style={{
            padding: '10px 16px', background: s.card, borderRadius: '10px',
            border: `1px solid ${s.cardBorder}`, color: s.textSec,
            fontSize: '12px', cursor: 'pointer', fontFamily: s.font,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Github size={13} /> GitHub
          </button>
          <button style={{
            padding: '10px 16px', background: s.card, borderRadius: '10px',
            border: `1px solid ${s.cardBorder}`, color: s.textSec,
            fontSize: '12px', cursor: 'pointer', fontFamily: s.font,
            display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Linkedin size={13} /> LinkedIn
          </button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div style={{ padding: '0 20px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {portfolio.stats.map(st => (
            <div key={st.label} style={{
              padding: '12px 8px', background: s.card, borderRadius: '12px',
              border: `1px solid ${s.cardBorder}`, textAlign: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{ fontSize: '18px', fontWeight: 700, color: s.accentLight }}>{st.value}</div>
              <div style={{ fontSize: '10px', color: s.textMuted, marginTop: '2px' }}>{st.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Skills ── */}
      <div style={{ padding: '0 20px 18px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: s.textSec, marginBottom: '10px' }}>Skills</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {portfolio.skills.map(sk => (
            <div key={sk.name} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '11px', color: s.textSec, width: '80px', textAlign: 'right' }}>{sk.name}</span>
              <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: `${sk.level}%`, borderRadius: '4px',
                  background: `linear-gradient(90deg, #7c3aed, ${s.accentLight})`,
                  boxShadow: '0 0 8px rgba(168,85,247,0.3)',
                  transition: 'width 1s ease',
                }} />
              </div>
              <span style={{ fontSize: '10px', color: s.accentLight, width: '28px' }}>{sk.level}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Experience ── */}
      <div style={{ padding: '0 20px 18px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: s.textSec, marginBottom: '10px' }}>Experience</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {portfolio.experience.map((exp, i) => (
            <div key={i} style={{
              padding: '12px 14px', background: s.card, borderRadius: '12px',
              border: `1px solid ${s.cardBorder}`,
              display: 'flex', alignItems: 'center', gap: '12px',
              backdropFilter: 'blur(8px)',
            }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: s.accentBg, border: `1px solid ${s.accentBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.accentLight,
              }}>
                {exp.type === 'work' ? <Briefcase size={14} /> : <GraduationCap size={14} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: s.text }}>{exp.title}</div>
                <div style={{ fontSize: '10px', color: s.textMuted }}>{exp.company} · {exp.period}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Projects ── */}
      <div style={{ padding: '0 20px 18px' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 700, color: s.textSec, marginBottom: '10px' }}>Projects</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {portfolio.projects.map((p, i) => (
            <div key={i} style={{
              padding: '14px', background: s.card, borderRadius: '14px',
              border: `1px solid ${s.cardBorder}`, backdropFilter: 'blur(8px)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: s.text }}>{p.title}</span>
                <ExternalLink size={12} color={s.textMuted} style={{ cursor: 'pointer' }} />
              </div>
              <p style={{ fontSize: '11px', color: s.textMuted, margin: '0 0 8px', lineHeight: 1.5 }}>{p.desc}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' as const }}>
                {p.tags.map(t => (
                  <span key={t} style={{
                    padding: '3px 8px', fontSize: '10px', borderRadius: '6px',
                    background: s.accentBg, border: `1px solid ${s.accentBorder}`,
                    color: s.accentLight,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ── */}
      <div style={{
        padding: '14px 20px', borderTop: `1px solid ${s.cardBorder}`,
        fontSize: '10px', color: s.textMuted, textAlign: 'center',
        background: 'rgba(255,255,255,0.02)',
      }}>
        Built with mendoan, late-night deploys, and questionable life choices.
      </div>
    </div>
  )
}

/* ─── Main Slide UI Page ──────────────────────────────── */

export default function SlideUiPage() {
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
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link
          to="/labs"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '13px', color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
          }}
        >
          <ArrowLeft size={16} /> Back to DevLabs
        </Link>
        <div style={{
          fontSize: '13px', color: 'rgba(255,255,255,0.4)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          slider: {sliderPos.toFixed(0)}%
        </div>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '20px 24px 12px' }}
      >
        <h1 style={{
          fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 800,
          letterSpacing: '-1px', margin: 0,
        }}>
          <span style={{ color: '#39ff14' }}>Retro Terminal</span>
          <span style={{ color: 'rgba(255,255,255,0.25)', margin: '0 12px' }}>⟵ slide ⟶</span>
          <span style={{ color: '#a855f7' }}>Modern Glass</span>
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.3)', marginTop: '6px' }}>
          Same portfolio, two completely different design systems — drag to compare
        </p>
      </motion.div>

      {/* Slider Container */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: 'calc(100% - 32px)', maxWidth: '800px',
          height: 'calc(100vh - 150px)', maxHeight: '680px',
          margin: '0 auto', borderRadius: '16px', overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 80px rgba(0,0,0,0.5)',
          userSelect: 'none',
        }}
      >
        {/* Layer 1: Retro (full, behind) */}
        <RetroPortfolio />

        {/* Layer 2: Modern (clipped from right) */}
        <div style={{
          position: 'absolute', inset: 0,
          clipPath: `inset(0 0 0 ${sliderPos}%)`,
        }}>
          <ModernPortfolio />
        </div>

        {/* Slider Handle */}
        <div
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          style={{
            position: 'absolute', top: 0, bottom: 0,
            left: `${sliderPos}%`, transform: 'translateX(-50%)',
            width: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'col-resize', zIndex: 10,
          }}
        >
          {/* Line */}
          <div style={{
            position: 'absolute', top: 0, bottom: 0, width: '2px',
            background: 'linear-gradient(to bottom, #39ff14, #a855f7)',
            boxShadow: '0 0 12px rgba(168,85,247,0.4), 0 0 4px rgba(57,255,20,0.3)',
          }} />
          {/* Grip */}
          <div style={{
            width: '34px', height: '52px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #1a1a24, #0f0a1e)',
            border: '1px solid rgba(168,85,247,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 15px rgba(168,85,247,0.2)',
            zIndex: 1,
          }}>
            <GripVertical size={16} color="rgba(168,85,247,0.7)" />
          </div>
        </div>

        {/* Side labels */}
        <div style={{
          position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)',
          writingMode: 'vertical-rl', fontSize: '10px', fontWeight: 700,
          letterSpacing: '3px', color: '#39ff1425', fontFamily: "'JetBrains Mono', monospace",
          pointerEvents: 'none',
        }}>RETRO</div>
        <div style={{
          position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)',
          writingMode: 'vertical-rl', fontSize: '10px', fontWeight: 700,
          letterSpacing: '3px', color: 'rgba(168,85,247,0.15)',
          pointerEvents: 'none',
        }}>MODERN</div>
      </div>

      {/* Blink animation */}
      <style>{`@keyframes blink { 50% { opacity: 0; } }`}</style>
    </div>
  )
}
