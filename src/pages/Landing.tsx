import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Compass, Sparkles, MessageSquare, Droplets } from 'lucide-react'

// Animated particles canvas
function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const particles: { x: number; y: number; r: number; dx: number; dy: number; a: number }[] = []
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        a: Math.random() * 0.5 + 0.2,
      })
    }
    let anim: number
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(45,212,191,${p.a})`
        ctx.fill()
        p.x += p.dx
        p.y += p.dy
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1
      })
      anim = requestAnimationFrame(loop)
    }
    loop()
    return () => cancelAnimationFrame(anim)
  }, [])
  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />
}

// Animated text scramble
function ScrambleText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [display, setDisplay] = useState('')
  const chars = '!@#$%^&*()_+{}|:<>?~`-=[]\\;\',./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  useEffect(() => {
    const timeout = setTimeout(() => {
      let iteration = 0
      const interval = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (i < iteration) return text[i]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )
        iteration += 1 / 2
        if (iteration >= text.length) {
          setDisplay(text)
          clearInterval(interval)
        }
      }, 30)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [text, delay])
  return <span className="font-mono">{display}</span>
}

const features = [
  { icon: Compass, title: 'Vibe Predict', desc: 'Predict the world\'s vibe across 4 categories', color: '#2DD4BF', path: '/predict' },
  { icon: Sparkles, title: 'Grialo', desc: 'Daily check-in with streak rewards & PTS', color: '#F59E0B', path: '/grialo' },
  { icon: MessageSquare, title: 'Onchain Review', desc: 'Review food & movies permanently on-chain', color: '#EC4899', path: '/review' },
]

export default function Landing() {
  return (
    <div>
      {/* Hero */}
      <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 text-center">
        <Particles />
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/3 left-1/2 h-[500px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.08) 0%, transparent 60%)' }} />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/20 bg-[#2DD4BF]/5 px-4 py-1.5 text-xs text-[#2DD4BF]">
            <Droplets className="h-3 w-3" /> ARC Testnet
          </div>

          <h1 className="mb-2 text-5xl font-extrabold tracking-tight sm:text-7xl">
            <ScrambleText text="Enter The" delay={200} />
          </h1>
          <h1 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-7xl" style={{ background: 'linear-gradient(135deg, #2DD4BF, #3B82F6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            <ScrambleText text="Rialo Temple" delay={600} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mx-auto mb-10 max-w-lg text-lg text-[#8A8A9A]"
          >
            Your daily on-chain ritual. Predict vibes, check in, lock tokens, and review the world.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/predict"
              className="group flex items-center gap-2 rounded-full px-8 py-3.5 text-base font-semibold text-[#0A0A0F] transition-all hover:scale-105"
              style={{ backgroundColor: '#2DD4BF', boxShadow: '0 0 30px rgba(45,212,191,0.3)' }}
            >
              Enter Temple <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a
              href="https://faucet.circle.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full border border-[#2A2A3A] px-6 py-3.5 text-sm font-medium text-[#8A8A9A] transition-all hover:border-[#2775CA] hover:text-[#2775CA]"
            >
              <span className="h-2 w-2 rounded-full bg-[#2775CA]" /> Claim ARC Faucet
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-[1000px] px-4 py-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                to={f.path}
                className="group flex gap-4 rounded-2xl border border-[#2A2A3A] bg-[#12121A] p-6 transition-all hover:scale-[1.02] hover:border-[#3A3A50]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${f.color}15` }}>
                  <f.icon className="h-6 w-6" style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-semibold group-hover:text-[#2DD4BF] transition-colors">{f.title}</h3>
                  <p className="text-sm text-[#8A8A9A]">{f.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2A2A3A] py-8 text-center text-xs text-[#5A5A6A]">
        Built for Rialo &middot; Deployed on ARC &middot; 2025
      </footer>
    </div>
  )
}
