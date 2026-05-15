import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Flame, Loader2, Medal, BadgeCheck } from 'lucide-react'
import { useReadContracts } from 'wagmi'
import { useVibeCheck } from '@/hooks/useVibeCheck'
import { PREDICT_ADDRESS, PREDICT_ABI } from '@/config/contracts'

const TIER_CFG: Record<string, { label: string; color: string; bg: string }> = {
  Main: { label: 'Main', color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
  Viral: { label: 'Viral', color: '#A855F7', bg: 'rgba(168,85,247,0.1)' },
  Hype: { label: 'Hype', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
  Chill: { label: 'Chill', color: '#8A8A9A', bg: 'rgba(138,138,154,0.1)' },
}

function getTier(score: number): string {
  if (score >= 5000) return 'Main'
  if (score >= 2000) return 'Viral'
  if (score >= 500) return 'Hype'
  return 'Chill'
}

function calcScore(user: any): number {
  if (!user || user.predictions === 0n) return 0
  const f = Number(user.followerCount || 0n)
  const v = user.isVerified ? 500 : 0
  const p = Number(user.predictions || 0n)
  const c = Number(user.correct || 0n)
  const s = Number(user.streak || 0n)
  const a = p > 0 ? (c * 10000) / p : 0
  return Math.floor(f / 100 + v + a * 0.03 + s * 50)
}

export default function Leaderboard() {
  const { isConnected, dayPredictors } = useVibeCheck()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const contracts = (dayPredictors || []).slice(0, 20).map(addr => ({
    address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getUser' as const, args: [addr],
  }))

  const { data } = useReadContracts({ contracts, query: { enabled: isConnected && (dayPredictors?.length || 0) > 0 } })

  useEffect(() => {
    if (!data || !dayPredictors) { setLoading(false); return }
    const processed = dayPredictors.map((addr, i) => {
      const u = (data as any[])?.[i]?.result
      return { address: addr, username: u?.xUsername || '', followers: Number(u?.followerCount || 0n), verified: u?.isVerified || false, predictions: Number(u?.predictions || 0n), correct: Number(u?.correct || 0n), streak: Number(u?.streak || 0n), score: calcScore(u) }
    })
    processed.sort((a, b) => b.score - a.score)
    setUsers(processed)
    setLoading(false)
  }, [data, dayPredictors])

  return (
    <div className="mx-auto max-w-[700px] px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'rgba(255,215,0,0.1)' }}>
          <Trophy className="h-8 w-8 text-[#FFD700]" />
        </div>
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="mt-1 text-sm text-[#8A8A9A]">Real on-chain rankings</p>
      </motion.div>

      {!isConnected ? (
        <div className="rounded-2xl border border-[#2A2A3A] bg-[#12121A] p-10 text-center text-[#8A8A9A]">Connect wallet to view</div>
      ) : loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-[#2DD4BF]" /></div>
      ) : users.length === 0 ? (
        <div className="rounded-2xl border border-[#2A2A3A] bg-[#12121A] p-10 text-center text-[#8A8A9A]">No predictions yet. Be the first!</div>
      ) : (
        <div className="space-y-2">
          {users.map((u, i) => {
            const tier = getTier(u.score)
            const tc = TIER_CFG[tier]
            const top3 = i < 3
            return (
              <motion.div key={u.address} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 ${top3 ? 'border-[#FFD700]/20' : 'border-[#2A2A3A] bg-[#12121A]'}`}
                style={top3 ? { background: 'linear-gradient(90deg, rgba(255,215,0,0.03), transparent)' } : {}}>
                <div className="flex w-7 shrink-0 justify-center">{top3 ? <Medal className={`h-5 w-5 ${i === 0 ? 'text-[#FFD700]' : i === 1 ? 'text-[#C0C0C0]' : 'text-[#CD7F32]'}`} /> : <span className="text-sm text-[#5A5A6A]">#{i + 1}</span>}</div>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2A2A3A] text-sm font-bold">{u.username ? u.username[0].toUpperCase() : u.address[2]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-medium">{u.username ? `@${u.username}` : `${u.address.slice(0, 6)}...${u.address.slice(-4)}`}</span>
                    {u.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#2DD4BF]" />}
                  </div>
                  {u.followers > 0 && <span className="text-[11px] text-[#5A5A6A]">{(u.followers / 1000).toFixed(1)}K followers</span>}
                </div>
                <span className="hidden rounded-full px-2.5 py-0.5 text-[11px] font-medium sm:inline-block" style={{ color: tc.color, backgroundColor: tc.bg, border: `1px solid ${tc.color}30` }}>{tc.label}</span>
                <div className="flex shrink-0 items-center gap-1"><Flame className="h-4 w-4 text-[#F97316]" /><span className="text-sm font-medium text-[#F97316]">{u.streak}</span></div>
                <span className="w-14 shrink-0 text-right text-sm font-bold text-[#2DD4BF]">{u.score.toLocaleString()}</span>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
