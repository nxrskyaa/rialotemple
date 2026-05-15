import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract } from 'wagmi'
import { PREDICT_ADDRESS, PREDICT_ABI } from '@/config/contracts'
import { Hexagon, Sparkles, Compass, MessageSquare, Trophy, User } from 'lucide-react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/predict', label: 'Predict', icon: Compass },
  { path: '/grialo', label: 'Grialo', icon: Sparkles },
  { path: '/review', label: 'Review', icon: MessageSquare },
  { path: '/leaderboard', label: 'Board', icon: Trophy },
  { path: '/profile', label: 'Me', icon: User },
]

export default function Navbar() {
  const { isConnected } = useAccount()
  const location = useLocation()

  const { data: userData } = useReadContract({
    address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getMyUser',
    query: { enabled: isConnected },
  })

  const xName = (userData as any)?.xUsername || ''

  return (
    <nav className="fixed top-4 left-1/2 z-50 w-[95%] max-w-[800px] -translate-x-1/2">
      <div
        className="flex h-14 items-center justify-between rounded-2xl border border-[#2A2A3A]/60 px-2 pr-4"
        style={{ backgroundColor: 'rgba(10,10,15,0.75)', backdropFilter: 'blur(20px) saturate(180%)' }}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 px-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: 'rgba(45,212,191,0.15)' }}>
            <Hexagon className="h-5 w-5 text-[#2DD4BF]" fill="rgba(45,212,191,0.2)" />
          </div>
          <span className="hidden text-sm font-bold tracking-tight sm:inline">Rialo Temple</span>
        </Link>

        {/* Nav items */}
        <div className="flex items-center gap-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-medium transition-all sm:px-3 sm:text-sm ${
                  isActive ? 'text-[#2DD4BF]' : 'text-[#5A5A6A] hover:text-[#8A8A9A]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.15)' }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className="relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="relative z-10 hidden sm:inline">{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {xName && (
            <span className="hidden rounded-full px-2 py-0.5 text-[10px] text-[#2DD4BF] sm:inline-block" style={{ backgroundColor: 'rgba(45,212,191,0.08)' }}>
              @{xName.slice(0, 8)}
            </span>
          )}
          <ConnectButton showBalance={false} chainStatus="none" accountStatus="avatar" />
        </div>
      </div>
    </nav>
  )
}
