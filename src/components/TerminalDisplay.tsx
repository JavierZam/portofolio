import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'

interface TerminalDisplayProps {
  lines: string[]
}

export default function TerminalDisplay({ lines }: TerminalDisplayProps) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (currentLineIndex >= lines.length) {
      setIsTyping(false)
      return
    }

    const currentLine = lines[currentLineIndex]

    if (currentCharIndex < currentLine.length) {
      const timeout = setTimeout(() => {
        setDisplayedLines(prev => {
          const newLines = [...prev]
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = ''
          }
          newLines[currentLineIndex] += currentLine[currentCharIndex]
          return newLines
        })
        setCurrentCharIndex(prev => prev + 1)
      }, Math.random() * 30 + 10) // Fast typing speed

      return () => clearTimeout(timeout)
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1)
        setCurrentCharIndex(0)
      }, 300) // Pause between lines

      return () => clearTimeout(timeout)
    }
  }, [currentLineIndex, currentCharIndex, lines])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className="w-full max-w-lg mt-8 rounded-xl overflow-hidden shadow-2xl border border-[var(--color-border)] bg-[#0d1117] font-mono text-sm"
    >
      {/* Terminal Header */}
      <div className="flex items-center px-4 py-2 bg-[#161b22] border-b border-[var(--color-border)]">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex items-center text-xs text-gray-400 gap-2">
          <Terminal size={14} /> javier@dev-machine: ~
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 text-green-400 h-[220px] overflow-y-auto">
        {displayedLines.map((line, i) => (
          <div key={i} className="mb-1 opacity-90">
            {line}
          </div>
        ))}
        {isTyping && (
          <span className="inline-block w-2 h-4 bg-green-400 animate-pulse ml-1 align-middle"></span>
        )}
      </div>
    </motion.div>
  )
}
