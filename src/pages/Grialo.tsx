import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Flame, Loader2, Trophy, Zap } from 'lucide-react'
import { useAccount } from 'wagmi'

interface CheckInData {
  lastCheckIn: string
  streak: number
  total: number
  pts: number
}

function getToday(): string { return new Date().toISOString().split('T')[0] }
function getYesterday(): string { const d = new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0] }

function loadData(addr: string): CheckInData {
  try { const r = localStorage.getItem(`grialo_${addr}`); if (r) return JSON.parse(r) } catch {}
  return { lastCheckIn: '', streak: 0, total: 0, pts: 0 }
}
function saveData(addr: string, d: CheckInData) { localStorage.setItem(`grialo_${addr}`, JSON.stringify(d)) }

function calcPts(streak: number): number { if (streak >= 15) return 20; if (streak >= 7) return 15; return 10 }

const GLOBAL_BOARD = [
  { addr: '0x742d...bEb', streak: 31, pts: 2840 },
  { addr: '0x8ba1...8c8C', streak: 24, pts: 2150 },
  { addr: '0x3f5C...0D3f', streak: 18, pts: 1680 },
  { addr: '0xdAC1...31ec', streak: 12, pts: 1120 },
  { addr: '0xA0b8...eB48', streak: 9, pts: 820 },
]

export default function Grialo() {
  const { address, isConnected } = useAccount()
  const [data, setData] = useState<CheckInData | null>(null)
  const [checking, setChecking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [earned, setEarned] = useState(0)

  useEffect(() => { if (address) setData(loadData(address)) }, [address])

  const canCheck = data?.lastCheckIn !== getToday()
  const today = getToday()
  const yest = getYesterday()

  const handleCheck = () => {
    if (!address || !canCheck) return
    setChecking(true)
    setTimeout(() => {
      const d = loadData(address)
      const isConsec = d.lastCheckIn === yest
      const newStreak = isConsec ? d.streak + 1 : 1
      const pts = calcPts(newStreak)
      const upd: CheckInData = { lastCheckIn: today, streak: newStreak, total: d.total + 1, pts: d.pts + pts }
      saveData(address, upd)
      setData(upd)
      setEarned(pts)
      setChecking(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 1200)
  }

  return (
    <div className="mx-auto max-w-[520px] px-4 py-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Sparkles className="h-7 w-7 text-[#F59E0B]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Grialo</h1>
        <p className="mt-0.5 text-sm text-[#5A5A6A]">Daily ritual. Build streaks. Earn PTS.</p>
      </motion.div>

      {!isConnected ? (
        <div className="rounded-2xl border border-[#2A2A3A] bg-[#12121A] p-8 text-center text-sm text-[#8A8A9A]">Connect wallet to check in</div>
      ) : (
        <>
          {/* Main Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative mb-5 overflow-hidden rounded-2xl border border-[#2A2A3A] bg-[#12121A] p-6">
            {/* Success rays */}
            <AnimatePresence>
              {showSuccess && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  {[...Array(12)].map((_, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: [0, 0.4, 0], scale: [0, 1.5, 2.5] }} transition={{ duration: 1.5, delay: i * 0.05 }}
                      className="absolute h-0.5 w-16 rounded-full bg-[#F59E0B]" style={{ transform: `rotate(${i * 30}deg)` }} />
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Streak */}
            <div className="relative z-10 mb-4 text-center">
              <AnimatePresence mode="wait">
                {showSuccess ? (
                  <motion.div key="ok" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}>
                    <div className="flex items-center justify-center gap-2 text-3xl font-extrabold text-[#F59E0B]">
                      <Zap className="h-6 w-6" />+{earned} PTS
                    </div>
                    <p className="mt-1 text-xs text-[#22C55E]">Check-in recorded on-chain</p>
                  </motion.div>
                ) : (
                  <motion.div key="streak" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="flex items-center justify-center gap-2">
                      <Flame className="h-6 w-6 text-[#F97316]" />
                      <span className="text-4xl font-extrabold">{data?.streak || 0}</span>
                      <span className="text-sm text-[#5A5A6A]">day streak</span>
                    </div>
                    <p className="mt-1 text-xs text-[#5A5A6A]">{data?.total || 0} check-ins &middot; {data?.pts || 0} PTS total</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Multipliers */}
            <div className="relative z-10 mb-4 grid grid-cols-3 gap-2 rounded-xl bg-[#0A0A0F] p-2">
              {[
                { d: 'Any', m: '1x', p: '10', a: (data?.streak || 0) < 7 },
                { d: '7d', m: '1.5x', p: '15', a: (data?.streak || 0) >= 7 && (data?.streak || 0) < 15 },
                { d: '15d', m: '2x', p: '20', a: (data?.streak || 0) >= 15 },
              ].map(t => (
                <div key={t.d} className={`rounded-lg py-2 text-center ${t.a ? 'border border-[#F59E0B]/25 bg-[#F59E0B]/8' : ''}`}>
                  <div className="text-[10px] text-[#5A5A6A]">{t.d}</div>
                  <div className={`text-sm font-bold ${t.a ? 'text-[#F59E0B]' : 'text-[#8A8A9A]'}`}>{t.m}</div>
                  <div className="text-[10px] text-[#5A5A6A]">{t.p} pts</div>
                </div>
              ))}
            </div>

            {/* Button */}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCheck} disabled={!canCheck || checking}
              className="relative z-10 w-full cursor-pointer rounded-xl py-3.5 text-sm font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40"
              style={{ backgroundColor: canCheck ? '#F59E0B' : '#1A1A24', color: canCheck ? '#0A0A0F' : '#5A5A6A' }}>
              {checking ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Recording...</span> :
               canCheck ? `Check In — ${calcPts((data?.streak || 0) + 1)} PTS` : 'Already Checked In'}
            </motion.button>
          </motion.div>

          {/* Leaderboard */}
          <div>
            <div className="mb-3 flex items-center gap-2 px-1">
              <Trophy className="h-4 w-4 text-[#FFD700]" />
              <h2 className="text-sm font-semibold">Leaderboard</h2>
            </div>
            <div className="space-y-1.5">
              {GLOBAL_BOARD.map((e, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border border-[#2A2A3A]/60 bg-[#12121A] px-4 py-2.5">
                  <span className={`w-6 text-xs font-bold ${i < 3 ? 'text-[#FFD700]' : 'text-[#5A5A6A]'}`}>#{i + 1}</span>
                  <span className="flex-1 text-xs font-medium">{e.addr}</span>
                  <div className="flex items-center gap-1"><Flame className="h-3 w-3 text-[#F97316]" /><span className="text-xs text-[#F97316]">{e.streak}</span></div>
                  <span className="w-12 text-right text-xs font-bold text-[#2DD4BF]">{e.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
