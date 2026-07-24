import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Gamepad2, FlaskConical, X } from 'lucide-react'

const hubItems = [
  {
    label: 'GameZone',
    icon: Gamepad2,
    path: '/games',
    color: '#39ff14',
    description: 'Mini-games collection',
  },
  {
    label: 'DevLabs',
    icon: FlaskConical,
    path: '/labs',
    color: '#a855f7',
    description: 'Experimental projects',
  },
]

export default function FloatingHub() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Popup Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            style={{
              position: 'absolute',
              bottom: '72px',
              right: '0',
              width: '220px',
              background: 'rgba(15, 10, 30, 0.92)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(168, 85, 247, 0.15)',
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 14px 8px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '4px',
            }}>
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase' as const,
                color: 'rgba(168, 85, 247, 0.8)',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                ⚡ EXPLORE
              </span>
            </div>

            {/* Menu Items */}
            {hubItems.map((item, i) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setIsOpen(false)}
                style={{ textDecoration: 'none' }}
              >
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: `linear-gradient(135deg, ${item.color}20, ${item.color}08)`,
                    border: `1px solid ${item.color}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <item.icon size={18} color={item.color} />
                  </div>
                  <div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#ffffff',
                      lineHeight: 1.2,
                    }}>
                      {item.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                      marginTop: '2px',
                    }}>
                      {item.description}
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: isOpen
            ? '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.2)'
            : [
                '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)',
                '0 0 30px rgba(168, 85, 247, 0.5), 0 0 60px rgba(168, 85, 247, 0.2)',
                '0 0 20px rgba(168, 85, 247, 0.3), 0 0 40px rgba(168, 85, 247, 0.1)',
              ],
        }}
        transition={isOpen ? {} : {
          boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
        }}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #7c3aed, #a855f7, #c084fc)',
          border: '1px solid rgba(196, 132, 252, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: '#fff',
          position: 'relative',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={22} /> : <Rocket size={22} />}
        </motion.div>

        {/* Notification dot */}
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: '#39ff14',
              border: '2px solid rgba(15, 10, 30, 0.9)',
            }}
          />
        )}
      </motion.button>
    </div>
  )
}
