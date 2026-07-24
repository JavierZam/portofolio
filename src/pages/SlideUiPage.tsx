import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, GripVertical, MapPin, Github, Linkedin, ExternalLink, 
  Briefcase, GraduationCap, Code, Server, Cpu, Terminal as TerminalIcon, 
  Send, CheckCircle2, Sparkles, Sliders, Monitor, Zap
} from 'lucide-react'

/* ─── Shared State & Data ─────────────────────────────── */

const PORTFOLIO_DATA = {
  name: 'Javier Zam',
  role: 'Software Engineer & Cloud Architect',
  location: 'Jakarta, Indonesia',
  bio: 'Building resilient backend microservices, distributed cloud infrastructure on GCP, and high-performance full-stack web applications.',
  stats: [
    { label: 'GitHub Repos', value: '35+' },
    { label: 'Cloud Deploys', value: '150+' },
    { label: 'Uptime Score', value: '99.9%' },
    { label: 'Coffee Level', value: '100%' },
  ],
  skills: [
    { name: 'Golang / Echo', category: 'Backend', level: 95 },
    { name: 'GCP & Cloud Run', category: 'Cloud', level: 92 },
    { name: 'React & TypeScript', category: 'Frontend', level: 88 },
    { name: 'Docker & CI/CD', category: 'DevOps', level: 86 },
    { name: 'PostgreSQL & Redis', category: 'Database', level: 90 },
  ],
  projects: [
    {
      title: 'PayViz Enterprise',
      category: 'Fullstack',
      desc: 'Automated payroll management handling Rp 100M+ monthly with BPJS tax automation & PDF exports.',
      tags: ['Vue.js', 'Node.js', 'PostgreSQL', 'GCP'],
      stars: 42,
    },
    {
      title: 'Pasargamex Engine',
      category: 'Cloud',
      desc: 'Real-time gaming asset marketplace with live WebSocket chat, escrow system & inventory management.',
      tags: ['Golang', 'React', 'WebSocket', 'GCP'],
      stars: 38,
    },
    {
      title: 'Trackori AI',
      category: 'Fullstack',
      desc: 'ML-powered nutrition and calorie tracking mobile system with auto food recognition models.',
      tags: ['FastAPI', 'Python', 'Cloud Run', 'Kotlin'],
      stars: 29,
    },
  ],
  experience: [
    {
      role: 'Software Developer',
      company: 'PT Bisnis Adviz Solusi',
      period: '2025 – Present',
      desc: 'Architecting GCP Cloud Run backend APIs, microservices, and high-scale Postgres schemas.',
      type: 'work',
    },
    {
      role: 'Fullstack Developer',
      company: 'HiColleagues CRM',
      period: '2023 – 2024',
      desc: 'Engineered commercial CRM with Golang Echo, payment gateway integrations, and Telegram bots.',
      type: 'work',
    },
    {
      role: 'Cloud Computing Graduate',
      company: 'Bangkit Academy (Google)',
      period: '2023',
      desc: 'Graduated with distinction. Architected end-to-end cloud infrastructure on GCP.',
      type: 'edu',
    },
  ],
}

/* ─── Identical Metric Layout Component ──────────────── */

interface ThemeProps {
  theme: 'cyberpunk' | 'modern'
  activeTab: string
  setActiveTab: (tab: string) => void
  projectCategory: string
  setProjectCategory: (cat: string) => void
  likedProjects: Record<string, boolean>
  toggleLike: (title: string) => void
  contactName: string
  setContactName: (val: string) => void
  contactMsg: string
  setContactMsg: (val: string) => void
  submitted: boolean
  handleSubmitContact: (e: React.FormEvent) => void
  terminalCmd: string
  setTerminalCmd: (val: string) => void
  terminalLogs: string[]
  handleTerminalSubmit: (e: React.FormEvent) => void
}

function UnifiedPortfolioLayout({
  theme,
  activeTab,
  setActiveTab,
  projectCategory,
  setProjectCategory,
  likedProjects,
  toggleLike,
  contactName,
  setContactName,
  contactMsg,
  setContactMsg,
  submitted,
  handleSubmitContact,
  terminalCmd,
  setTerminalCmd,
  terminalLogs,
  handleTerminalSubmit,
}: ThemeProps) {
  const isCyber = theme === 'cyberpunk'

  // Styling Tokens with Identical Heights, Spacings, and Structural Dimensions
  const style = {
    bg: isCyber ? '#05080c' : '#0a0915',
    textPrimary: isCyber ? '#00ff66' : '#ffffff',
    textSecondary: isCyber ? '#00cc52' : '#a1a1aa',
    textMuted: isCyber ? '#007733' : '#71717a',
    accent: isCyber ? '#00ff66' : '#a855f7',
    accentGlow: isCyber ? 'rgba(0, 255, 102, 0.25)' : 'rgba(168, 85, 247, 0.25)',
    cardBg: isCyber ? '#080d14' : 'rgba(255, 255, 255, 0.03)',
    cardBorder: isCyber ? '1px solid #00441b' : '1px solid rgba(255, 255, 255, 0.08)',
    buttonBg: isCyber ? '#00ff66' : 'linear-gradient(135deg, #8b5cf6, #d946ef)',
    buttonText: isCyber ? '#05080c' : '#ffffff',
    badgeBg: isCyber ? 'rgba(0, 255, 102, 0.1)' : 'rgba(168, 85, 247, 0.15)',
    badgeBorder: isCyber ? '1px solid rgba(0, 255, 102, 0.3)' : '1px solid rgba(168, 85, 247, 0.3)',
    fontFamily: isCyber ? "'JetBrains Mono', monospace" : "'Inter', system-ui, sans-serif",
    borderRadiusCard: isCyber ? '2px' : '16px',
    borderRadiusBtn: isCyber ? '2px' : '10px',
  }

  const filteredProjects = projectCategory === 'All' 
    ? PORTFOLIO_DATA.projects 
    : PORTFOLIO_DATA.projects.filter(p => p.category === projectCategory)

  return (
    <div
      style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: style.bg,
        color: style.textPrimary,
        fontFamily: style.fontFamily,
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      {/* ── Main Container (identical 1100px max-width) ── */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '90px 24px 80px' }}>
        
        {/* ── Header / Navbar ── */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: '32px',
            borderBottom: style.cardBorder,
            marginBottom: '48px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: style.borderRadiusBtn,
                background: style.badgeBg,
                border: style.badgeBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isCyber ? <TerminalIcon size={20} color={style.accent} /> : <Sparkles size={20} color={style.accent} />}
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: isCyber ? '0px' : '-0.5px' }}>
                {isCyber ? `> ${PORTFOLIO_DATA.name}` : PORTFOLIO_DATA.name}
              </div>
              <div style={{ fontSize: '12px', color: style.textMuted }}>
                {isCyber ? '// PORTFOLIO_SYS_V2' : 'Software Engineer & Cloud Architect'}
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', gap: '8px' }}>
            {['Overview', 'Projects', 'Terminal', 'Contact'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px',
                  borderRadius: style.borderRadiusBtn,
                  background: activeTab === tab ? style.badgeBg : 'transparent',
                  border: activeTab === tab ? style.badgeBorder : '1px solid transparent',
                  color: activeTab === tab ? style.accent : style.textSecondary,
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: style.fontFamily,
                  transition: 'all 0.2s ease',
                }}
              >
                {isCyber ? `[${tab.toUpperCase()}]` : tab}
              </button>
            ))}
          </nav>
        </header>

        {/* ── HERO SECTION ── */}
        <section style={{ marginBottom: '64px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: style.borderRadiusBtn,
              background: style.badgeBg,
              border: style.badgeBorder,
              fontSize: '12px',
              color: style.accent,
              marginBottom: '20px',
            }}
          >
            <MapPin size={14} />
            <span>{PORTFOLIO_DATA.location} • Available for Cloud & Fullstack Projects</span>
          </div>

          <h1
            style={{
              fontSize: '44px',
              fontWeight: 900,
              lineHeight: 1.15,
              margin: '0 0 16px',
              letterSpacing: isCyber ? '0px' : '-1.5px',
              color: style.textPrimary,
            }}
          >
            {isCyber ? (
              <span>
                SYSTEM.<span style={{ color: '#ffffff' }}>ARCHITECT</span>()
              </span>
            ) : (
              <span>
                Crafting High-Scale <span style={{ color: style.accent }}>Cloud Systems</span> & UIs
              </span>
            )}
          </h1>

          <p
            style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: style.textSecondary,
              maxWidth: '720px',
              margin: '0 0 28px',
            }}
          >
            {PORTFOLIO_DATA.bio}
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTab('Contact')}
              style={{
                padding: '12px 28px',
                borderRadius: style.borderRadiusBtn,
                background: style.buttonBg,
                color: style.buttonText,
                border: 'none',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: style.fontFamily,
                boxShadow: isCyber ? `0 0 20px ${style.accentGlow}` : `0 4px 20px ${style.accentGlow}`,
              }}
            >
              {isCyber ? '$ EXECUTE_CONTACT' : 'Get In Touch →'}
            </button>

            <button
              onClick={() => setActiveTab('Projects')}
              style={{
                padding: '12px 24px',
                borderRadius: style.borderRadiusBtn,
                background: style.cardBg,
                border: style.cardBorder,
                color: style.textSecondary,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: style.fontFamily,
              }}
            >
              {isCyber ? 'VIEW_PROJECTS()' : 'Explore Projects'}
            </button>
          </div>
        </section>

        {/* ── STATS GRID (Identical 4-Column Grid) ── */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '64px',
          }}
        >
          {PORTFOLIO_DATA.stats.map(stat => (
            <div
              key={stat.label}
              style={{
                padding: '20px',
                background: style.cardBg,
                border: style.cardBorder,
                borderRadius: style.borderRadiusCard,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  fontSize: '28px',
                  fontWeight: 900,
                  color: style.accent,
                  lineHeight: 1,
                  marginBottom: '6px',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: style.textMuted }}>{stat.label}</div>
            </div>
          ))}
        </section>

        {/* ── SKILLS & EXPERIENCES (2-Column Grid) ── */}
        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            marginBottom: '64px',
          }}
        >
          {/* Skills Column */}
          <div
            style={{
              padding: '24px',
              background: style.cardBg,
              border: style.cardBorder,
              borderRadius: style.borderRadiusCard,
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 800,
                margin: '0 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: style.textPrimary,
              }}
            >
              <Cpu size={18} color={style.accent} />
              <span>{isCyber ? 'TECHNICAL_STACK' : 'Core Technologies'}</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {PORTFOLIO_DATA.skills.map(skill => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 600, color: style.textSecondary }}>{skill.name}</span>
                    <span style={{ color: style.accent, fontWeight: 700 }}>{skill.level}%</span>
                  </div>
                  <div
                    style={{
                      height: '8px',
                      width: '100%',
                      background: isCyber ? '#02150a' : 'rgba(255, 255, 255, 0.06)',
                      borderRadius: isCyber ? '0' : '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${skill.level}%`,
                        background: style.buttonBg,
                        borderRadius: isCyber ? '0' : '4px',
                        boxShadow: isCyber ? `0 0 10px ${style.accent}` : 'none',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Column */}
          <div
            style={{
              padding: '24px',
              background: style.cardBg,
              border: style.cardBorder,
              borderRadius: style.borderRadiusCard,
            }}
          >
            <h2
              style={{
                fontSize: '18px',
                fontWeight: 800,
                margin: '0 0 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: style.textPrimary,
              }}
            >
              <Briefcase size={18} color={style.accent} />
              <span>{isCyber ? 'WORK_HISTORY' : 'Work Experience'}</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {PORTFOLIO_DATA.experience.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    paddingBottom: idx !== PORTFOLIO_DATA.experience.length - 1 ? '16px' : '0',
                    borderBottom: idx !== PORTFOLIO_DATA.experience.length - 1 ? style.cardBorder : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: style.textPrimary }}>{item.role}</div>
                    <span style={{ fontSize: '11px', color: style.accent, padding: '2px 8px', background: style.badgeBg, borderRadius: style.borderRadiusBtn }}>
                      {item.period}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: style.textMuted, marginBottom: '6px' }}>{item.company}</div>
                  <div style={{ fontSize: '12px', color: style.textSecondary, lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURED PROJECTS SECTION ── */}
        <section style={{ marginBottom: '64px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 800, margin: 0, color: style.textPrimary }}>
              {isCyber ? 'PROJECT_CATALOG' : 'Featured Projects'}
            </h2>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '6px' }}>
              {['All', 'Fullstack', 'Cloud'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setProjectCategory(cat)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: style.borderRadiusBtn,
                    background: projectCategory === cat ? style.badgeBg : style.cardBg,
                    border: projectCategory === cat ? style.badgeBorder : style.cardBorder,
                    color: projectCategory === cat ? style.accent : style.textMuted,
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontFamily: style.fontFamily,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {filteredProjects.map(proj => (
              <div
                key={proj.title}
                style={{
                  padding: '20px',
                  background: style.cardBg,
                  border: style.cardBorder,
                  borderRadius: style.borderRadiusCard,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '200px',
                  boxSizing: 'border-box',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: style.textPrimary }}>{proj.title}</div>
                    <button
                      onClick={() => toggleLike(proj.title)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: likedProjects[proj.title] ? '#ff4757' : style.textMuted,
                        cursor: 'pointer',
                        fontSize: '13px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ♥ {proj.stars + (likedProjects[proj.title] ? 1 : 0)}
                    </button>
                  </div>
                  <p style={{ fontSize: '13px', color: style.textSecondary, margin: '0 0 16px', lineHeight: 1.5 }}>
                    {proj.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {proj.tags.map(t => (
                    <span
                      key={t}
                      style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: style.borderRadiusBtn,
                        background: style.badgeBg,
                        border: style.badgeBorder,
                        color: style.accent,
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── INTERACTIVE TERMINAL SECTION ── */}
        <section style={{ marginBottom: '64px' }}>
          <div
            style={{
              background: isCyber ? '#020b05' : 'rgba(0, 0, 0, 0.4)',
              border: style.cardBorder,
              borderRadius: style.borderRadiusCard,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 18px',
                background: isCyber ? '#041409' : 'rgba(255, 255, 255, 0.04)',
                borderBottom: style.cardBorder,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700 }}>
                <TerminalIcon size={14} color={style.accent} />
                <span>Interactive Cloud CLI</span>
              </div>
              <div style={{ fontSize: '11px', color: style.textMuted }}>Type 'help' for available commands</div>
            </div>

            <div style={{ padding: '18px', minHeight: '140px', fontSize: '13px', lineHeight: 1.6, color: style.textSecondary }}>
              {terminalLogs.map((log, i) => (
                <div key={i} style={{ color: log.startsWith('>') ? style.accent : style.textSecondary }}>
                  {log}
                </div>
              ))}
            </div>

            <form onSubmit={handleTerminalSubmit} style={{ display: 'flex', borderTop: style.cardBorder }}>
              <span style={{ padding: '12px 14px', color: style.accent, fontWeight: 700 }}>&gt;</span>
              <input
                type="text"
                value={terminalCmd}
                onChange={e => setTerminalCmd(e.target.value)}
                placeholder="type command (e.g. help, skills, deploy, clear)..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: style.textPrimary,
                  fontFamily: style.fontFamily,
                  fontSize: '13px',
                }}
              />
            </form>
          </div>
        </section>

        {/* ── CONTACT FORM ── */}
        <section style={{ marginBottom: '40px' }}>
          <div
            style={{
              padding: '32px',
              background: style.cardBg,
              border: style.cardBorder,
              borderRadius: style.borderRadiusCard,
            }}
          >
            <h2 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 8px', color: style.textPrimary }}>
              {isCyber ? 'SEND_TRANSMISSION' : 'Let\'s Connect & Build Together'}
            </h2>
            <p style={{ fontSize: '13px', color: style.textMuted, margin: '0 0 24px' }}>
              Have a project in mind or interested in backend cloud architecture? Send a direct message below.
            </p>

            {submitted ? (
              <div style={{ padding: '16px', background: style.badgeBg, border: style.badgeBorder, color: style.accent, borderRadius: style.borderRadiusBtn, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} />
                <span>Transmission received successfully! I'll reply to your message soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                  <input
                    type="text"
                    value={contactName}
                    onChange={e => setContactName(e.target.value)}
                    placeholder="Your Name"
                    required
                    style={{
                      padding: '12px 16px',
                      background: isCyber ? '#040b06' : 'rgba(255, 255, 255, 0.04)',
                      border: style.cardBorder,
                      borderRadius: style.borderRadiusBtn,
                      color: style.textPrimary,
                      outline: 'none',
                      fontFamily: style.fontFamily,
                      fontSize: '13px',
                    }}
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    required
                    style={{
                      padding: '12px 16px',
                      background: isCyber ? '#040b06' : 'rgba(255, 255, 255, 0.04)',
                      border: style.cardBorder,
                      borderRadius: style.borderRadiusBtn,
                      color: style.textPrimary,
                      outline: 'none',
                      fontFamily: style.fontFamily,
                      fontSize: '13px',
                    }}
                  />
                </div>
                <textarea
                  value={contactMsg}
                  onChange={e => setContactMsg(e.target.value)}
                  placeholder="Your Message or Project Inquiry..."
                  required
                  rows={3}
                  style={{
                    padding: '12px 16px',
                    background: isCyber ? '#040b06' : 'rgba(255, 255, 255, 0.04)',
                    border: style.cardBorder,
                    borderRadius: style.borderRadiusBtn,
                    color: style.textPrimary,
                    outline: 'none',
                    fontFamily: style.fontFamily,
                    fontSize: '13px',
                    resize: 'none',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    borderRadius: style.borderRadiusBtn,
                    background: style.buttonBg,
                    color: style.buttonText,
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: style.fontFamily,
                    alignSelf: 'flex-start',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <Send size={14} />
                  <span>{isCyber ? 'TRANSMIT_MESSAGE' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: style.cardBorder, paddingTop: '24px', display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: style.textMuted }}>
          <div>© {new Date().getFullYear()} Javier Zam • All Rights Reserved</div>
          <div>Built with React, TypeScript & Dual Design System Engine</div>
        </footer>

      </div>
    </div>
  )
}

/* ─── FULLSCREEN SLIDER PAGE COMPONENT ───────────────── */

export default function SlideUiPage() {
  const [sliderPos, setSliderPos] = useState(50)
  const isDragging = useRef(false)

  // Shared Interactive State across BOTH themes
  const [activeTab, setActiveTab] = useState('Overview')
  const [projectCategory, setProjectCategory] = useState('All')
  const [likedProjects, setLikedProjects] = useState<Record<string, boolean>>({})
  const [contactName, setContactName] = useState('')
  const [contactMsg, setContactMsg] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Terminal State
  const [terminalCmd, setTerminalCmd] = useState('')
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '> Initialized Javier Cloud CLI v2.4',
    '> Connection to GCP Asia-Southeast2 established.',
    '> Status: Systems Nominal.',
  ])

  const toggleLike = (title: string) => {
    setLikedProjects(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactMsg) return
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setContactName('')
      setContactMsg('')
    }, 4000)
  }

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const cmd = terminalCmd.trim().toLowerCase()
    if (!cmd) return

    let response = `Command not recognized: '${cmd}'. Type 'help' for command list.`
    if (cmd === 'help') {
      response = 'Available commands: help, skills, deploy, stats, clear'
    } else if (cmd === 'skills') {
      response = 'Golang (95%), GCP (92%), React (88%), Docker (86%), Postgres (90%)'
    } else if (cmd === 'deploy') {
      response = 'Deploying build to GCP Cloud Run... Done! Status 200 OK.'
    } else if (cmd === 'stats') {
      response = 'Repos: 35+ | Cloud Deploys: 150+ | Uptime: 99.9%'
    } else if (cmd === 'clear') {
      setTerminalLogs(['> Terminal cleared.'])
      setTerminalCmd('')
      return
    }

    setTerminalLogs(prev => [...prev, `> ${cmd}`, response])
    setTerminalCmd('')
  }

  // Mouse / Touch Slider Dragging Logic across 100vw Viewport
  const handleMove = useCallback((clientX: number) => {
    if (!isDragging.current) return
    const pct = Math.max(2, Math.min(98, (clientX / window.innerWidth) * 100))
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

  const sharedProps: ThemeProps = {
    activeTab,
    setActiveTab,
    projectCategory,
    setProjectCategory,
    likedProjects,
    toggleLike,
    contactName,
    setContactName,
    contactMsg,
    setContactMsg,
    submitted,
    handleSubmitContact,
    terminalCmd,
    setTerminalCmd,
    terminalLogs,
    handleTerminalSubmit,
    theme: 'cyberpunk',
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#05080c',
        overflowX: 'hidden',
        userSelect: isDragging.current ? 'none' : 'auto',
      }}
    >
      {/* ── TOP FLOATING CONTROL BAR (Fixed) ── */}
      <div
        style={{
          position: 'fixed',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          padding: '8px 20px',
          borderRadius: '30px',
          background: 'rgba(10, 10, 20, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.6)',
        }}
      >
        <Link
          to="/labs"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#a1a1aa',
            textDecoration: 'none',
            fontSize: '12px',
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={14} /> Back to Labs
        </Link>

        <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.15)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700 }}>
          <span style={{ color: '#00ff66' }}>Cyberpunk Terminal</span>
          <span style={{ color: '#71717a', fontSize: '10px' }}>({sliderPos.toFixed(0)}%)</span>
          <span style={{ color: '#a855f7' }}>Modern Glass</span>
        </div>

        <div style={{ width: '1px', height: '16px', background: 'rgba(255, 255, 255, 0.15)' }} />

        <div style={{ display: 'flex', gap: '6px' }}>
          {[25, 50, 75].map(preset => (
            <button
              key={preset}
              onClick={() => setSliderPos(preset)}
              style={{
                padding: '3px 8px',
                borderRadius: '12px',
                background: sliderPos === preset ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {preset}%
            </button>
          ))}
        </div>
      </div>

      {/* ── LAYER 1: Cyberpunk Theme (Base Layer - 100vw) ── */}
      <UnifiedPortfolioLayout {...sharedProps} theme="cyberpunk" />

      {/* ── LAYER 2: Modern Theme (Overlay Clipped from Left by sliderPos) ── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100%',
          clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)`,
          pointerEvents: 'auto',
        }}
      >
        <UnifiedPortfolioLayout {...sharedProps} theme="modern" />
      </div>

      {/* ── FULL-SCREEN VERTICAL SLIDER HANDLE (Fixed 100vh Line) ── */}
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          transform: 'translateX(-50%)',
          width: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'col-resize',
          zIndex: 90,
        }}
      >
        {/* Glowing Divider Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: '2px',
            background: 'linear-gradient(to bottom, #00ff66, #a855f7)',
            boxShadow: '0 0 15px rgba(0, 255, 102, 0.6), 0 0 15px rgba(168, 85, 247, 0.6)',
          }}
        />

        {/* Central Drag Handle Pill */}
        <div
          style={{
            width: '36px',
            height: '56px',
            borderRadius: '18px',
            background: 'linear-gradient(135deg, #0a0a14, #140d24)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(168, 85, 247, 0.4)',
            zIndex: 1,
          }}
        >
          <GripVertical size={18} color="#ffffff" />
        </div>
      </div>
    </div>
  )
}
