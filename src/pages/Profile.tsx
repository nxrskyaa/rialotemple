import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Twitter, Wallet, Trophy, Flame, Target, Check, Compass, MessageSquare, Sparkles } from 'lucide-react'
import { useAccount, useReadContract, useSignMessage, useWriteContract } from 'wagmi'
import { PREDICT_ADDRESS, PREDICT_ABI, USDC_ADDRESS, ERC20_ABI } from '@/config/contracts'

export default function Profile() {
  const { address, isConnected } = useAccount()
  const [editing, setEditing] = useState(false)
  const [xInput, setXInput] = useState('')
  const [linkStep, setLinkStep] = useState<'idle' | 'signing' | 'sending' | 'done'>('idle')

  const { data: userData, refetch } = useReadContract({
    address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getMyUser',
    query: { enabled: isConnected },
  })
  const { data: usdcBal } = useReadContract({
    address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'balanceOf',
    args: address ? [address] : undefined, query: { enabled: isConnected && !!address },
  })

  const { signMessageAsync } = useSignMessage()
  const { writeContractAsync } = useWriteContract()

  const u = userData as any
  const username = u?.xUsername || ''
  const hasX = username && username !== ''
  const predictions = Number(u?.predictions || 0n)
  const correct = Number(u?.correct || 0n)
  const streak = Number(u?.streak || 0n)
  const balance = usdcBal ? (Number(usdcBal) / 1e6).toFixed(2) : '0.00'

  const linkX = async () => {
    if (!xInput || !address) return
    setLinkStep('signing')
    try {
      const clean = xInput.replace(/^@/, '').trim()
      const msg = `VibeCheck:LinkX:@${clean}:${address}`
      const sig = await signMessageAsync({ message: msg })
      setLinkStep('sending')
      await writeContractAsync({
        address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'linkXAccount',
        args: [clean, BigInt(0), false, sig],
      })
      setLinkStep('done')
      await refetch()
      setTimeout(() => { setLinkStep('idle'); setEditing(false); setXInput('') }, 1500)
    } catch {
      setLinkStep('idle')
    }
  }

  return (
    <div className="mx-auto max-w-[520px] px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2" style={{ borderColor: hasX ? 'rgba(45,212,191,0.3)' : 'rgba(42,42,58,0.6)' }}>
          {hasX ? (
            <img src={`https://unavatar.io/twitter/${username}`} alt="" className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
          ) : (
            <User className="h-8 w-8 text-[#5A5A6A]" />
          )}
        </div>
        <h1 className="text-xl font-bold">{isConnected ? (hasX ? `@${username}` : `${address?.slice(0, 6)}...${address?.slice(-4)}`) : 'Not Connected'}</h1>
        {u?.isVerified && <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-[#2DD4BF]/10 px-2 py-0.5 text-[10px] text-[#2DD4BF]"><Check className="h-3 w-3" />Verified</span>}
      </motion.div>

      {!isConnected ? (
        <div className="rounded-2xl border border-[#2A2A3A] bg-[#12121A] p-8 text-center text-sm text-[#8A8A9A]"><Wallet className="mx-auto mb-2 h-8 w-8 text-[#5A5A6A]" />Connect wallet</div>
      ) : (
        <>
          {/* Stats */}
          <div className="mb-5 grid grid-cols-4 gap-2">
            {[
              { l: 'Predicts', v: predictions.toString(), i: Target, c: '#2DD4BF' },
              { l: 'Correct', v: correct.toString(), i: Check, c: '#22C55E' },
              { l: 'Streak', v: streak.toString(), i: Flame, c: '#F97316' },
              { l: 'USDC', v: balance, i: Wallet, c: '#2775CA' },
            ].map(s => (
              <div key={s.l} className="rounded-xl border border-[#2A2A3A]/60 bg-[#12121A] p-3 text-center">
                <s.i className="mx-auto mb-1 h-4 w-4" style={{ color: s.c }} />
                <div className="text-sm font-bold">{s.v}</div>
                <div className="text-[9px] text-[#5A5A6A]">{s.l}</div>
              </div>
            ))}
          </div>

          {/* X Account */}
          <div className="mb-5 rounded-2xl border border-[#2A2A3A]/60 bg-[#12121A] p-4">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Twitter className="h-4 w-4 text-[#1DA1F2]" /><span className="text-sm font-medium">X Account</span></div>
              {hasX ? (
                <span className="rounded-full bg-[#22C55E]/10 px-2 py-0.5 text-[10px] text-[#22C55E]">Linked</span>
              ) : (
                <button onClick={() => setEditing(!editing)} className="text-xs text-[#2DD4BF]">{editing ? 'Cancel' : 'Link'}</button>
              )}
            </div>

            {hasX ? (
              <div className="flex items-center gap-3">
                <img src={`https://unavatar.io/twitter/${username}`} alt="" className="h-10 w-10 rounded-full" onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${username}` }} />
                <div><p className="text-sm font-medium">@{username}</p><p className="text-[10px] text-[#5A5A6A]">{Number(u?.followerCount || 0n) > 0 ? `${Number(u?.followerCount)} followers` : 'No follower data'}</p></div>
              </div>
            ) : editing ? (
              <div>
                <div className="relative mb-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5A5A6A]">@</span>
                  <input value={xInput} onChange={e => setXInput(e.target.value.replace('@', ''))} placeholder="username" className="w-full rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] py-2.5 pr-3 pl-7 text-sm text-[#F0F0F5] outline-none focus:border-[#1DA1F2]" />
                </div>
                {xInput && (
                  <div className="mb-2 flex items-center gap-2">
                    <img src={`https://unavatar.io/twitter/${xInput}`} alt="" className="h-8 w-8 rounded-full bg-[#2A2A3A]" onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/identicon/svg?seed=${xInput}` }} />
                    <span className="text-xs text-[#8A8A9A]">@{xInput}</span>
                  </div>
                )}
                <button onClick={linkX} disabled={!xInput || linkStep !== 'idle'} className="w-full cursor-pointer rounded-xl bg-[#1DA1F2] py-2.5 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50">
                  {linkStep === 'signing' ? 'Sign in wallet...' : linkStep === 'sending' ? 'Saving on-chain...' : linkStep === 'done' ? 'Done!' : 'Link X Account'}
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#8A8A9A]">Link your X account to unlock social score and appear on leaderboard.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-2">
            <Link to="/predict" className="flex items-center gap-2 rounded-xl border border-[#2A2A3A]/60 bg-[#12121A] p-3 text-xs font-medium transition-all hover:border-[#2DD4BF]/40"><Compass className="h-4 w-4 text-[#2DD4BF]" /> Predict</Link>
            <Link to="/grialo" className="flex items-center gap-2 rounded-xl border border-[#2A2A3A]/60 bg-[#12121A] p-3 text-xs font-medium transition-all hover:border-[#F59E0B]/40"><Sparkles className="h-4 w-4 text-[#F59E0B]" /> Grialo</Link>
            <Link to="/leaderboard" className="flex items-center gap-2 rounded-xl border border-[#2A2A3A]/60 bg-[#12121A] p-3 text-xs font-medium transition-all hover:border-[#FFD700]/40"><Trophy className="h-4 w-4 text-[#FFD700]" /> Board</Link>
            <Link to="/review" className="flex items-center gap-2 rounded-xl border border-[#2A2A3A]/60 bg-[#12121A] p-3 text-xs font-medium transition-all hover:border-[#EC4899]/40"><MessageSquare className="h-4 w-4 text-[#EC4899]" /> Review</Link>
          </div>
        </>
      )}
    </div>
  )
}
