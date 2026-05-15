import { useState } from 'react'
import { motion } from 'framer-motion'
import { Snowflake, Zap, TrendingUp, TrendingDown, Loader2, Check, Wallet, TrendingUp as TUI, Cloud, Activity, Hash } from 'lucide-react'
import { useAccount, useWriteContract } from 'wagmi'
import { PREDICT_ADDRESS, PREDICT_ABI, CATEGORIES, VIBES, ERC20_ABI, USDC_ADDRESS } from '@/config/contracts'
import { useReadContract } from 'wagmi'

const ICON_MAP: Record<string, React.ElementType> = { TrendingUp: TUI, Cloud, Activity, Hash }
const VIBE_ICONS_LUCIDE = [Snowflake, Zap, TrendingUp, TrendingDown]

type Choices = { crypto: number | null; weather: number | null; market: number | null; trending: number | null }

export default function Predict() {
  const { isConnected, address } = useAccount()
  const [choices, setChoices] = useState<Choices>({ crypto: null, weather: null, market: null, trending: null })
  const [status, setStatus] = useState<'idle' | 'approving' | 'done'>('idle')

  const { data: currentDay } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'currentDay', query: { enabled: isConnected } })
  const { data: stakeAmt } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'stakeAmount', query: { enabled: isConnected } })
  const { data: predictorCount } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getPredictorCount', args: currentDay ? [currentDay] : undefined, query: { enabled: isConnected && !!currentDay } })
  const { data: usdcAllowance } = useReadContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'allowance', args: address && PREDICT_ADDRESS ? [address, PREDICT_ADDRESS] : undefined, query: { enabled: isConnected && !!address } })

  const needsApprove = !usdcAllowance || !stakeAmt || (usdcAllowance as bigint) < (stakeAmt as bigint)

  const { writeContract: approveWrite, isPending: isApproving } = useWriteContract()
  const { writeContract: predictWrite, isPending: isPredicting } = useWriteContract({
    mutation: { onSuccess: () => setStatus('done') }
  })

  const dayNum = currentDay ? Number(currentDay) : 1
  const poolSize = predictorCount ? Number(predictorCount) : 0
  const stake = stakeAmt ? Number(stakeAmt) / 1e6 : 1

  const select = (cat: keyof Choices, vibe: number) => setChoices(p => ({ ...p, [cat]: vibe }))
  const allSel = choices.crypto !== null && choices.weather !== null && choices.market !== null && choices.trending !== null

  const handleSubmit = () => {
    if (!allSel) return
    if (needsApprove) {
      setStatus('approving')
      approveWrite({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [PREDICT_ADDRESS, BigInt('1000000000000000000')] })
      return
    }
    predictWrite({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'predict', args: [choices.crypto!, choices.weather!, choices.market!, choices.trending!] as [0|1|2|3, 0|1|2|3, 0|1|2|3, 0|1|2|3] })
  }

  if (status === 'done') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-3xl border border-[#2A2A3A] bg-[#12121A] p-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.2 }} className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#22C55E]/15">
            <Check className="h-10 w-10 text-[#22C55E]" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold">Predictions Locked!</h2>
          <p className="text-[#8A8A9A]">Wait for settlement to see results</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(cat => { const v = VIBES.find(v => v.id === choices[cat.id as keyof Choices]); return v ? (
              <span key={cat.id} className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: v.bg, color: v.color, border: `1px solid ${v.border}` }}>{cat.label}: {v.label}</span>
            ) : null })}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[600px] px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <h1 className="text-3xl font-bold">Vibe Predict</h1>
        <p className="mt-1 text-sm text-[#8A8A9A]">Pick a vibe for each category &middot; Round #{dayNum}</p>
      </motion.div>

      <div className="rounded-3xl border border-[#2A2A3A] bg-[#12121A] p-6">
        {!isConnected ? (
          <div className="flex flex-col items-center gap-4 py-12"><Wallet className="h-12 w-12 text-[#5A5A6A]" /><p className="text-[#8A8A9A]">Connect wallet to predict</p></div>
        ) : (
          <>
            {CATEGORIES.map(cat => {
              const Icon = ICON_MAP[cat.icon] || TUI
              const sel = choices[cat.id as keyof Choices]
              return (
                <div key={cat.id} className="mb-4 rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] p-4">
                  <div className="mb-3 flex items-center gap-2"><Icon className="h-4 w-4 text-[#8A8A9A]" /><span className="text-sm font-medium">{cat.label}</span><span className="text-xs text-[#5A5A6A]">{cat.description}</span></div>
                  <div className="grid grid-cols-4 gap-2">
                    {VIBES.map(v => {
                      const isSel = sel === v.id
                      const VIcon = VIBE_ICONS_LUCIDE[v.id]
                      return (
                        <motion.button key={v.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => select(cat.id as keyof Choices, v.id)}
                          className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 py-3 transition-all"
                          style={{ backgroundColor: isSel ? v.bg : 'transparent', borderColor: isSel ? v.color : v.border }}>
                          <VIcon className="h-4 w-4" style={{ color: v.color }} />
                          <span className="text-[10px] font-semibold" style={{ color: v.color }}>{v.label}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            <div className="mt-4 text-center text-xs text-[#5A5A6A]">{poolSize} predictions &middot; {poolSize * stake} USDC pool</div>
            <button onClick={handleSubmit} disabled={!allSel || isPredicting || isApproving}
              className="mt-4 w-full cursor-pointer rounded-2xl py-3.5 font-semibold text-[#0A0A0F] transition-all hover:brightness-110 disabled:opacity-50"
              style={{ backgroundColor: '#2DD4BF' }}>
              {isApproving ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Approving USDC...</span> :
               isPredicting ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</span> :
               needsApprove ? 'Approve USDC & Predict' : 'Submit Predictions'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
