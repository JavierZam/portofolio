import { useState, useEffect } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { delay, motion } from 'framer-motion'

interface SkillRadarProps {
  data: Array<{ subject: string; A: number; fullMark: number }>
}

export default function SkillRadar({ data }: SkillRadarProps) {
  const [mounted, setMounted] = useState(false)

  // Wait a tick for responsive container to measure itself
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Custom tool tip to make it look premium
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass p-3 rounded-lg border border-[var(--color-accent)]/30 text-sm">
          <p className="font-bold text-[var(--color-neon-cyan)]">{payload[0].payload.subject}</p>
          <p className="text-[var(--color-text-primary)]">Power Level: {payload[0].value}/100</p>
        </div>
      )
    }
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full h-[350px] relative glass rounded-2xl p-4 flex flex-col items-center justify-center glow-border"
    >
      <div className="absolute top-4 left-4 text-xs font-mono text-[var(--color-accent-light)] opacity-70">
        [Skill_Distribution_Scanner]
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="var(--color-border)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: 'var(--color-text-secondary)', fontSize: 12, fontWeight: 'bold' }} 
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Skills"
            dataKey="A"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fill="var(--color-accent)"
            fillOpacity={0.4}
            animationBegin={500}
            animationDuration={1500}
          />
        </RadarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
