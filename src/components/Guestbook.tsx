import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, MessageCircle, Loader2, User } from 'lucide-react'
import { PORTFOLIO } from '../config/portfolio'
import {
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '../lib/firebase'

interface GuestMessage {
  id: string
  name: string
  message: string
  createdAt: Timestamp | null
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

export default function Guestbook() {
  const { guestbook } = PORTFOLIO
  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [isFirebaseReady, setIsFirebaseReady] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)

  useEffect(() => {
    const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
    if (!projectId) {
      setIsFirebaseReady(false)
      setMessages([
        { id: '1', name: 'Cool Visitor', message: 'Nice portfolio, really clean design.', createdAt: null },
        { id: '2', name: 'Anonymous', message: 'Found the secret section lol, your rank is insane', createdAt: null },
        { id: '3', name: 'Fellow Dev', message: 'Clean architecture, I respect it', createdAt: null },
      ])
      return
    }

    setIsFirebaseReady(true)
    const q = query(
      collection(db, 'guestbook'),
      orderBy('createdAt', 'desc'),
      limit(20)
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: GuestMessage[] = []
        snapshot.forEach((doc) => {
          msgs.push({ id: doc.id, ...doc.data() } as GuestMessage)
        })
        setMessages(msgs)
        setDbError(null)
      },
      (error) => {
        console.error('Firestore listener error:', error)
        setDbError('Listen Error: ' + error.message)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !isFirebaseReady) return

    setSending(true)
    setDbError(null)

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim() || guestbook.namePlaceholder,
        message: message.trim(),
        createdAt: serverTimestamp(),
      })
      
      // Clear inputs ON SUCCESS
      setMessage('')
      setName('')
    } catch (err: any) {
      console.error('Failed to send message:', err)
      setDbError('Send Error: ' + err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <section id="guestbook" className="section-padding">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
        >
          {/* Title */}
          <motion.div variants={itemVariants} className="mb-4">
            <h2 className="text-3xl md:text-5xl font-bold mb-2">
              <span className="text-[var(--color-accent-light)] font-mono text-lg md:text-xl block mb-1">
                {'// '}04
              </span>
              {guestbook.title}
            </h2>
            <p className="text-[var(--color-text-muted)] text-sm md:text-base">
              {guestbook.subtitle}
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 mt-8 mb-8"
          >
            <div className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="text"
                placeholder={guestbook.namePlaceholder}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder={guestbook.placeholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                required
              />
              <motion.button
                type="submit"
                disabled={sending || !message.trim()}
                className="px-5 py-3 rounded-xl bg-[var(--color-accent)] text-white font-semibold hover:bg-[var(--color-accent-light)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {sending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Send size={18} />
                )}
              </motion.button>
            </div>

            {!isFirebaseReady && (
              <p className="text-xs text-[var(--color-neon-yellow)] mt-3 font-mono">
                Firebase not configured — showing demo messages. Add your config to .env
              </p>
            )}

            {dbError && (
              <div className="mt-4 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono">
                <p className="font-bold mb-1">Firestore Connection Error:</p>
                <p>{dbError}</p>
                <p className="mt-2 text-[var(--color-text-muted)]">Check browser console for more details.</p>
              </div>
            )}
          </motion.form>

          {/* Messages */}
          <div className="space-y-3">
            {messages.map((msg, index) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-[var(--color-bg-card-hover)] transition-colors"
                whileHover={{ x: 4 }}
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-accent-glow)] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User size={14} className="text-[var(--color-accent-light)]" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[var(--color-text-primary)]">
                      {msg.name}
                    </span>
                    {msg.createdAt && (
                      <span className="text-[10px] text-[var(--color-text-muted)] font-mono">
                        {new Date(msg.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[var(--color-text-secondary)] break-words">
                    {msg.message}
                  </p>
                </div>
              </motion.div>
            ))}

            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-[var(--color-text-muted)]"
              >
                <MessageCircle size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-sm">No messages yet. Be the first.</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
