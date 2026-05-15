import { Link } from 'react-router-dom'
import { Sparkles, MessageSquare, ShieldCheck, Paintbrush } from 'lucide-react'

export default function Landing() {
  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-[hsl(var(--border))] bg-[linear-gradient(135deg,hsl(var(--card)),hsl(var(--card)/0.75))] p-8 sm:p-12">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.6)] px-3 py-1 text-xs text-[hsl(var(--muted-foreground))]">
          <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--primary))]" /> ARC Testnet Deployment
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Rialo Temple</h1>
        <p className="mt-4 max-w-2xl text-[hsl(var(--muted-foreground))]">
          Clean, focused, and production-ready. Core flow sekarang fokus ke on-chain review yang stabil dan lebih reliable.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/review" className="rounded-xl bg-[hsl(var(--primary))] px-5 py-3 font-semibold text-[hsl(var(--primary-foreground))]">
            Open Review Hub
          </Link>
          <Link to="/profile" className="rounded-xl border border-[hsl(var(--border))] px-5 py-3 font-semibold text-[hsl(var(--foreground))]">
            Wallet Profile
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { icon: MessageSquare, title: 'Onchain Review', desc: 'Submit & browse review langsung dari contract RialoTempleReview.' },
          { icon: ShieldCheck, title: 'Streamlined Scope', desc: 'Prediction, leaderboard, streak, dan social score dihapus supaya UX lebih konsisten.' },
          { icon: Paintbrush, title: '3 Theme Modes', desc: 'Dark, Light, dan Aesthetic dengan visual yang clean dan modern.' },
        ].map((item) => (
          <article key={item.title} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
            <item.icon className="mb-3 h-5 w-5 text-[hsl(var(--primary))]" />
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{item.desc}</p>
          </article>
        ))}
      </section>
    </div>
  )
}
