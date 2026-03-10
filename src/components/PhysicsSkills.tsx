import { useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { motion } from 'framer-motion'
import { PORTFOLIO } from '../config/portfolio'

export default function PhysicsSkills() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const engineRef = useRef<Matter.Engine | null>(null)
  const renderRef = useRef<Matter.Render | null>(null)

  useEffect(() => {
    if (!sceneRef.current) return

    // 1. Setup Engine & Render
    const engine = Matter.Engine.create()
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: 350,
        wireframes: false,
        background: 'transparent',
      }
    })

    engineRef.current = engine
    renderRef.current = render

    // 2. Extract skills from the portfolio config
    const allSkills = PORTFOLIO.about.skills.flatMap(s => s.items)

    // 3. Create boundaries
    const { width, height } = render.options
    if (!width || !height) return

    const wallOptions = { 
      isStatic: true, 
      render: { fillStyle: 'transparent' } 
    }

    const ground = Matter.Bodies.rectangle(width / 2, height + 25, width, 50, wallOptions)
    const leftWall = Matter.Bodies.rectangle(-25, height / 2, 50, height, wallOptions)
    const rightWall = Matter.Bodies.rectangle(width + 25, height / 2, 50, height, wallOptions)

    Matter.Composite.add(engine.world, [ground, leftWall, rightWall])

    // 4. Create skill balls
    const skillBodies = allSkills.map((skill, index) => {
      // Randomize starting position slightly
      const x = (width / 2) + (Math.random() * 100 - 50)
      const y = -100 - (index * 40) // Drop them staggered
      
      return Matter.Bodies.circle(x, y, 35, {
        restitution: 0.8, // Bounciness
        friction: 0.1,
        render: {
          fillStyle: index % 2 === 0 ? 'var(--color-bg-card)' : 'transparent',
          strokeStyle: 'var(--color-accent-light)',
          lineWidth: 2,
        },
        plugin: {
          label: skill // Store the text to draw manually
        }
      })
    })

    Matter.Composite.add(engine.world, skillBodies)

    // 5. Add Mouse Interaction
    const mouse = Matter.Mouse.create(render.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    })
    
    Matter.Composite.add(engine.world, mouseConstraint)
    render.mouse = mouse // Keep mouse in sync with render

    // 6. Run Engine and Renderer
    Matter.Runner.run(Matter.Runner.create(), engine)
    Matter.Render.run(render)

    // 7. Custom drawing for text (since Matter.js render options only support basic sprites)
    Matter.Events.on(render, 'afterRender', () => {
      const context = render.context
      context.font = "12px 'JetBrains Mono', monospace"
      context.textAlign = "center"
      context.textBaseline = "middle"

      skillBodies.forEach((body) => {
        const { x, y } = body.position
        
        context.save()
        context.translate(x, y)
        context.rotate(body.angle) // Rotate text with the body!
        
        // Pick colors
        context.fillStyle = "white"
        context.fillText(body.plugin.label || "Skill", 0, 0)
        
        context.restore()
      })
    })

    return () => {
      // Cleanup on unmount
      Matter.Render.stop(render)
      Matter.Engine.clear(engine)
      if (render.canvas) {
        render.canvas.remove()
      }
    }
  }, [])

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full relative glass rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="absolute top-4 left-4 z-10 text-xs font-mono text-[var(--color-text-muted)] pointer-events-none">
        [Physics_Engine_Online]
      </div>
      <div className="absolute top-4 right-4 z-10 text-xs font-mono text-[var(--color-accent-light)] pointer-events-none animate-pulse">
        {/* Instruction */}
        Drag and throw the tech stack
      </div>
      {/* Container for Matter.js canvas */}
      <div ref={sceneRef} className="w-full h-[350px] cursor-grab active:cursor-grabbing" />
    </motion.div>
  )
}
