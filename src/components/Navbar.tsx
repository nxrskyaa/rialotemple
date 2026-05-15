import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Palette, MessageSquare, User, Hexagon } from 'lucide-react'

const NAV_ITEMS = [
  { path: '/review', label: 'Reviews', icon: MessageSquare },
  { path: '/profile', label: 'Profile', icon: User },
]

const THEMES = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
  { id: 'aesthetic', label: 'Aesthetic' },
] as const

export default function Navbar() {
  const location = useLocation()

  const setTheme = (theme: string) => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('rialo_theme', theme)
  }

  return (
    <nav className="fixed inset-x-0 top-4 z-50 mx-auto w-[95%] max-w-5xl rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.88)] px-3 py-2 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 px-2 py-1">
          <Hexagon className="h-5 w-5 text-[hsl(var(--primary))]" />
          <span className="font-semibold tracking-tight">Rialo Temple</span>
        </Link>

        <div className="hidden items-center gap-1 rounded-xl border border-[hsl(var(--border))] p-1 sm:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition ${
                  isActive ? 'bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-lg border border-[hsl(var(--border))] p-1 lg:flex">
            <Palette className="mx-1 h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
            {THEMES.map((theme) => (
              <button key={theme.id} onClick={() => setTheme(theme.id)} className="rounded-md px-2 py-1 text-xs text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--accent))]">
                {theme.label}
              </button>
            ))}
          </div>
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
        </div>
      </div>
    </nav>
  )
}
