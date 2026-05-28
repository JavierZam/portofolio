import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, Download, Music, AlertCircle, Loader2, Trash2, 
  ExternalLink, Sparkles, Youtube, CheckCircle2 
} from 'lucide-react'

interface DownloadItem {
  id: string
  url: string
  title: string
  author: string
  thumbnail: string
  status: 'pending' | 'metadata' | 'converting' | 'ready' | 'failed'
  downloadUrl: string
  error: string
}

export default function ToolsPage() {
  const [urlsText, setUrlsText] = useState('')
  const [format, setFormat] = useState<'mp3' | 'm4a'>('m4a')
  const [items, setItems] = useState<DownloadItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  // Start processing urls in sequence/parallel
  const handleStartProcess = async () => {
    const rawUrls = urlsText.split('\n')
    const validUrls = rawUrls
      .map(u => u.trim())
      .filter(u => u.startsWith('http://') || u.startsWith('https://'))

    if (validUrls.length === 0) {
      alert('Masukkan setidaknya satu link YouTube yang valid!')
      return
    }

    setIsProcessing(true)
    setUrlsText('') // Clear input area

    // Create new items
    const newItems: DownloadItem[] = validUrls.map(url => ({
      id: 'dl_' + Math.random().toString(36).substr(2, 9),
      url,
      title: 'Mengambil informasi...',
      author: 'YouTube',
      thumbnail: '',
      status: 'pending',
      downloadUrl: '',
      error: ''
    }))

    // Add to state
    setItems(prev => [...newItems, ...prev])

    // Process each item
    for (const item of newItems) {
      processSingleItem(item.id, item.url)
      // Small delay between starting requests to avoid rate limits
      await new Promise(r => setTimeout(r, 600))
    }

    setIsProcessing(false)
  }

  // Handle single item workflow
  const processSingleItem = async (id: string, url: string) => {
    // 1. Fetch metadata (noembed.com - CORS allowed)
    updateItemStatus(id, { status: 'metadata' })
    let title = 'Lagu YouTube'
    let author = 'YouTube Video'
    let thumbnail = ''

    try {
      const metaRes = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
      if (metaRes.ok) {
        const meta = await metaRes.json()
        if (meta && !meta.error) {
          title = meta.title || title
          author = meta.author_name || author
          thumbnail = meta.thumbnail_url || thumbnail
        }
      }
    } catch (e) {
      console.warn('Failed to fetch metadata:', e)
    }

    updateItemStatus(id, { title, author, thumbnail, status: 'converting' })

    // 2. Fetch download link from Cobalt API via CORS Proxy
    try {
      const targetUrl = 'https://api.cobalt.tools/api/json'
      const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`

      const cobaltRes = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          url: url,
          downloadMode: 'audio',
          audioFormat: format,
          audioBitrate: '128'
        })
      })

      if (!cobaltRes.ok) {
        throw new Error(`API Error: ${cobaltRes.statusText}`)
      }

      const resData = await cobaltRes.json()
      
      if (resData.status === 'stream' || resData.status === 'redirect') {
        updateItemStatus(id, {
          status: 'ready',
          downloadUrl: resData.url
        })
        
        // Auto trigger download for ease of use
        triggerBrowserDownload(resData.url, `${title}.${format}`)
      } else if (resData.status === 'error') {
        throw new Error(resData.text || 'Gagal mengonversi audio')
      } else {
        throw new Error('Format respon API tidak dikenal')
      }

    } catch (err: any) {
      console.error(err)
      updateItemStatus(id, {
        status: 'failed',
        error: err.message || 'Gagal mendownload lagu'
      })
    }
  }

  // Helper to update item attributes in state
  const updateItemStatus = (id: string, updates: Partial<DownloadItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item))
  }

  // Clear completed and failed items
  const handleClearList = () => {
    setItems([])
  }

  // Trigger download automatically
  const triggerBrowserDownload = (downloadUrl: string, filename: string) => {
    try {
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      a.target = '_blank'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    } catch (e) {
      console.error('Auto download failed:', e)
    }
  }

  return (
    <div className="noise animated-gradient min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Back to portfolio */}
        <Link
          to="/games"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-white transition-colors mb-8 font-mono"
        >
          <ArrowLeft size={16} /> Back to Hub
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="text-[var(--color-neon-cyan)] animate-pulse" size={36} />
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase">
              Cyber<span className="text-[var(--color-neon-cyan)]">ytdl</span>
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] text-sm font-mono max-w-md mx-auto">
            Online YouTube Audio Downloader. Paste link, download langsung tanpa server lokal.
          </p>
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Left panel: Input Area */}
          <div className="md:col-span-5 space-y-6">
            <div className="glass rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-[var(--color-neon-cyan)] font-mono text-sm uppercase">
                <Youtube size={18} />
                <h2>Input Link Video</h2>
              </div>
              
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                Salin & tempel link YouTube (satu link per baris). Kamu bisa memasukkan banyak link sekaligus untuk diunduh bersamaan.
              </p>

              <textarea
                value={urlsText}
                onChange={(e) => setUrlsText(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=...&#10;https://youtu.be/...&#10;https://www.youtube.com/watch?v=..."
                className="w-full h-64 bg-[#050811]/70 border border-[var(--color-border)] focus:border-[var(--color-neon-cyan)]/50 rounded-2xl p-4 text-xs font-mono text-white outline-none resize-none transition-all"
                spellCheck={false}
                disabled={isProcessing}
              />

              <div className="space-y-1">
                <label className="text-[10px] text-[var(--color-text-secondary)] uppercase font-bold tracking-wider block">Format Audio</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as any)}
                  className="w-full bg-[#050811]/70 border border-[var(--color-border)] focus:border-[var(--color-accent)]/50 rounded-xl p-3 text-xs text-white outline-none cursor-pointer transition-all"
                  disabled={isProcessing}
                >
                  <option value="m4a">🎵 M4A (Sangat Cepat - Kualitas Asli)</option>
                  <option value="mp3">💿 MP3 (Kompatibel Universal)</option>
                </select>
              </div>

              <button
                onClick={handleStartProcess}
                disabled={isProcessing || !urlsText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-[var(--color-neon-cyan)]/20 to-[var(--color-accent)]/20 hover:from-[var(--color-neon-cyan)]/30 hover:to-[var(--color-accent)]/30 border border-[var(--color-neon-cyan)]/30 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[var(--color-neon-cyan)]" />
                    Memproses Antrean...
                  </>
                ) : (
                  <>
                    <Download size={16} className="text-[var(--color-neon-cyan)]" />
                    Mulai Unduh Massal
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: Status / Queue */}
          <div className="md:col-span-7 space-y-4">
            <div className="glass rounded-3xl p-6 min-h-[400px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-4">
                  <div className="flex items-center gap-2 text-white font-mono text-sm uppercase">
                    <Music size={18} className="text-[var(--color-accent-light)]" />
                    <h2>Daftar Lagu ({items.length})</h2>
                  </div>

                  {items.length > 0 && (
                    <button
                      onClick={handleClearList}
                      className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={14} /> Hapus Semua
                    </button>
                  )}
                </div>

                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {items.length === 0 ? (
                      <div className="text-center py-16 text-[var(--color-text-muted)] space-y-3">
                        <Music size={40} className="mx-auto opacity-30" />
                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)]">Antrean Kosong</h3>
                        <p className="text-xs max-w-xs mx-auto">Tempel link YouTube di kiri dan klik tombol untuk memulai unduhan online.</p>
                      </div>
                    ) : (
                      items.map(item => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="bg-[#0c0d16]/60 border border-[var(--color-border)] rounded-2xl p-4 flex gap-4 items-center hover:bg-[#121424]/60 transition-colors"
                        >
                          {/* Thumbnail / Icon */}
                          <div className="w-16 h-12 bg-[#050811] rounded-lg overflow-hidden flex-shrink-0 border border-[var(--color-border)] flex items-center justify-center relative">
                            {item.thumbnail ? (
                              <img src={item.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
                            ) : (
                              <Music size={20} className="text-[var(--color-text-muted)]" />
                            )}
                          </div>

                          {/* Detail */}
                          <div className="flex-grow min-w-0">
                            <h3 className="text-xs font-bold text-white truncate leading-snug" title={item.title}>
                              {item.title}
                            </h3>
                            <p className="text-[10px] text-[var(--color-text-secondary)] truncate mt-0.5">
                              {item.author}
                            </p>
                            
                            {/* Error display */}
                            {item.status === 'failed' && (
                              <span className="text-[9px] text-red-400 block mt-1 leading-normal font-mono">
                                ⚠️ {item.error}
                              </span>
                            )}
                          </div>

                          {/* Action / Status */}
                          <div className="flex-shrink-0">
                            {item.status === 'pending' && (
                              <span className="text-[9px] font-mono px-2.5 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 uppercase">
                                Antre
                              </span>
                            )}

                            {(item.status === 'metadata' || item.status === 'converting') && (
                              <div className="flex items-center gap-1 text-[var(--color-neon-cyan)] text-[10px] font-mono">
                                <Loader2 size={12} className="animate-spin" />
                                <span>Proses</span>
                              </div>
                            )}

                            {item.status === 'ready' && (
                              <a
                                href={item.downloadUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-lg transition-all"
                              >
                                <CheckCircle2 size={12} />
                                Download
                              </a>
                            )}

                            {item.status === 'failed' && (
                              <button
                                onClick={() => processSingleItem(item.id, item.url)}
                                className="px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-bold rounded-lg transition-all cursor-pointer"
                              >
                                Ulangi
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Guide Note */}
              <div className="border-t border-[var(--color-border)] pt-4 mt-4 text-[10px] text-[var(--color-text-secondary)] flex items-center justify-between font-mono">
                <span>API: COBALT_SECURE_TUNNEL</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <Sparkles size={10} /> Online Downloader Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer tip */}
        <div className="text-center text-xs text-[var(--color-text-muted)] mt-12 font-mono flex items-center justify-center gap-1.5">
          <Sparkles size={12} className="text-[var(--color-neon-cyan)] animate-pulse" />
          <span>Tips: Setelah terdownload di folder browser HP/PC, drag file lagu langsung ke WA ayahmu!</span>
        </div>
      </div>
    </div>
  )
}
