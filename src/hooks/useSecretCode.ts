import { useEffect, useState } from 'react'
import confetti from 'canvas-confetti'

export function useSecretCode() {
  const [inputSequence, setInputSequence] = useState<string[]>([])
  const secretCode = ['a', 'v', 'i', 'e']

  useEffect(() => {
    const triggerConfetti = () => {
      const duration = 3 * 1000
      const end = Date.now() + duration

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#a855f7', '#6366f1', '#e879f9']
        })
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#a855f7', '#6366f1', '#e879f9']
        })

        if (Date.now() < end) {
          requestAnimationFrame(frame)
        }
      }
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#e879f9', '#ffffff']
      })

      frame()
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase()
      
      setInputSequence((prev) => {
        const newSequence = [...prev, key].slice(-secretCode.length)
        if (newSequence.join('') === secretCode.join('')) {
          triggerConfetti()
          return [] 
        }
        return newSequence
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

}
