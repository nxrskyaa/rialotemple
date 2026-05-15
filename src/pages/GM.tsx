import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Loader2, Trophy, Flame } from 'lucide-react'
import { useAccount } from 'wagmi'

// GM data stored in localStorage (simulated on-chain)
interface GMData {
  lastCheckIn: string // YYYY-MM-DD
  streak: number
  totalCheckIns: number
  pts: number
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function loadGM(address: string): GMData {
  try {
    const raw = localStorage.getItem(`rialo_gm_${address}`)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { lastCheckIn: '', streak: 0, totalCheckIns: 0, pts: 0 }
}

function saveGM(address: string, data: GMData) {
  localStorage.setItem(`rialo_gm_${address}`, JSON.stringify(data))
}

function getPts(streak: number): number {
  if (streak >= 15) return 20
  if (streak >= 7) return 15
  return 10
}

const LEADERBOARD = [
  { name: '0x742d...bEb', streak: 31, pts: 2840, tier: 'gold' },
  { name: '0x8ba1...8c8C', streak: 24, pts: 2150, tier: 'silver' },
  { name: '0x3f5C...0D3f', streak: 18, pts: 1680, tier: 'bronze' },
  { name: '0xdAC1...31ec', streak: 12, pts: 1120, tier: 'normal' },
  { name: '0xA0b8...eB48', streak: 9, pts: 820, tier: 'normal' },
]

export default function GM() {
  const { isConnected, address } = useAccount()
  const [gm, setGm] = useState<GMData | null>(null)
  const [checkingIn, setCheckingIn] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earnedPts, setEarnedPts] = useState(0)

  useEffect(() => {
    if (address) setGm(loadGM(address))
  }, [address])

  const canCheckIn = gm?.lastCheckIn !== getToday()
  const today = getToday()
  const yesterday = getYesterday()

  const handleCheckIn = () => {
    if (!address || !canCheckIn) return
    setCheckingIn(true)

    // Simulate on-chain delay
    setTimeout(() => {
      const data = loadGM(address)
      const isConsecutive = data.lastCheckIn === yesterday
      const newStreak = isConsecutive ? data.streak + 1 : 1
      const pts = getPts(newStreak)

      const updated: GMData = {
        lastCheckIn: today,
        streak: newStreak,
        totalCheckIns: data.totalCheckIns + 1,
        pts: data.pts + pts,
      }

      saveGM(address, updated)
      setGm(updated)
      setEarnedPts(pts)
      setCheckingIn(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(245,158,11,0.15)' }}>
          <Sun className="h-8 w-8 text-[#F59E0B]" />
        </div>
        <h1 className="text-3xl font-bold">GM Onchain</h1>
        <p className="mt-1 text-sm text-[#8A8A9A]">Daily check-in. Build streaks. Earn PTS.</p>
      </motion.div>

      {/* Check-in Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="relative overflow-hidden rounded-3xl border border-[#2A2A3A] bg-[#12121A] p-8">
        {/* Animated rays */}
        {showSuccess && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {[...Array(8)].map((_, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0, rotate: i * 45 }} animate={{ opacity: [0, 0.6, 0], scale: [0, 2, 3] }} transition={{ duration: 1.5 }} className="absolute h-1 w-20 rounded-full bg-[#F59E0B]" />
            ))}
          </div>
        )}

        {!isConnected ? (
          <div className="py-8 text-center text-[#8A8A9A]">Connect wallet to check in</div>
        ) : (
          <>
            {/* Streak Display */}
            <div className="mb-6 text-center">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div key="success" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="text-5xl font-extrabold text-[#F59E0B]">+{earnedPts} PTS</div>
                    <p className="mt-1 text-sm text-[#22C55E]">GM Check-in Successful!</p>
                  </motion.div>
                ) : (
                  <motion.div key="streak" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="h-6 w-6 text-[#F97316]" />
                      <span className="text-4xl font-extrabold">{gm?.streak || 0}</span>
                      <span className="text-lg text-[#8A8A9A]">day streak</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5A5A6A]">Total check-ins: {gm?.totalCheckIns || 0} &middot; {gm?.pts || 0} PTS</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Multiplier Info */}
            <div className="mb-6 grid grid-cols-3 gap-2 rounded-xl bg-[#0A0A0F] p-3">
              {[
                { days: 'Any', mult: '1x', pts: '10', active: (gm?.streak || 0) < 7 },
                { days: '7 Day', mult: '1.5x', pts: '15', active: (gm?.streak || 0) >= 7 && (gm?.streak || 0) < 15 },
                { days: '15 Day', mult: '2x', pts: '20', active: (gm?.streak || 0) >= 15 },
              ].map(t => (
                <div key={t.days} className={`rounded-lg p-2 text-center ${t.active ? 'border border-[#F59E0B]/30 bg-[#F59E0B]/10' : ''}`}>
                  <div className="text-xs text-[#5A5A6A]">{t.days}</div>
                  <div className={`text-sm font-bold ${t.active ? 'text-[#F59E0B]' : 'text-[#8A8A9A]'}`}>{t.mult}</div>
                  <div className="text-[10px] text-[#5A5A6A]">{t.pts} pts</div>
                </div>
              ))}
            </div>

            {/* Check-in Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCheckIn}
              disabled={!canCheckIn || checkingIn}
              className="w-full cursor-pointer rounded-2xl py-4 font-bold text-lg transition-all disabled:opacity-40"
              style={{
                backgroundColor: canCheckIn ? '#F59E0B' : '#2A2A3A',
                color: canCheckIn ? '#0A0A0F' : '#5A5A6A',
              }}
            >
              {checkingIn ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Checking in...</span> :
               canCheckIn ? `GM - Claim ${getPts((gm?.streak || 0) + 1)} PTS` : 'Already Checked In Today'}
            </motion.button>
          </>
        )}
      </motion.div>

      {/* Mini Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6">
        <div className="mb-3 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-[#FFD700]" />
          <h2 className="text-lg font-semibold">GM Leaderboard</h2>
        </div>
        <div className="space-y-2">
          {LEADERBOARD.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-[#2A2A3A] bg-[#12121A] px-4 py-3">
              <span className={`w-6 text-sm font-bold ${i < 3 ? 'text-[#FFD700]' : 'text-[#5A5A6A]'}`}>#{i + 1}</span>
              <span className="flex-1 text-sm font-medium">{entry.name}</span>
              <div className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-[#F97316]" /><span className="text-sm text-[#F97316]">{entry.streak}</span></div>
              <span className="w-16 text-right text-sm font-bold text-[#2DD4BF]">{entry.pts}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
