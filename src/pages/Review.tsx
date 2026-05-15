import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageSquare, Star, Loader2, Image, MapPin, Film, Utensils, ExternalLink, Check } from 'lucide-react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { REVIEW_ADDRESS, REVIEW_ABI, USDC_ADDRESS, ERC20_ABI } from '@/config/contracts'

interface Rev {
  id: number; category: number; name: string; origin: string; rating: number;
  reviewText: string; photoUrl1: string; reviewer: string;
}

const MOCK: Rev[] = [
  { id: 1, category: 0, name: 'Nasi Goreng Kampung', origin: 'Indonesia, Jakarta', rating: 5, reviewText: 'Best nasi goreng in the city!', photoUrl1: 'https://images.unsplash.com/photo-1603088549155-4a5e7c6b9e5c?w=400', reviewer: '0x742d...bEb' },
  { id: 2, category: 1, name: 'Dune: Part Two', origin: 'USA, Hollywood', rating: 5, reviewText: 'Visually stunning masterpiece.', photoUrl1: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400', reviewer: '0x8ba1...8c8C' },
  { id: 3, category: 0, name: 'Ramen Ichiran', origin: 'Japan, Fukuoka', rating: 4, reviewText: 'Rich tonkotsu broth.', photoUrl1: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=400', reviewer: '0x3f5C...0D3f' },
]

export default function Review() {
  const { isConnected, address } = useAccount()
  const [tab, setTab] = useState<'browse' | 'write'>('browse')
  const [cat, setCat] = useState<0 | 1>(0)
  const [name, setName] = useState('')
  const [origin, setOrigin] = useState('')
  const [rating, setRating] = useState(0)
  const [text, setText] = useState('')
  const [photo1, setPhoto1] = useState('')
  const [photo2, setPhoto2] = useState('')
  const [step, setStep] = useState<'form' | 'approve' | 'submit' | 'done'>('form')

  const { data: reviewFee } = useReadContract({ address: REVIEW_ADDRESS, abi: REVIEW_ABI, functionName: 'reviewFee', query: { enabled: isConnected } })
  const { data: allowance } = useReadContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'allowance', args: address && REVIEW_ADDRESS ? [address, REVIEW_ADDRESS] : undefined, query: { enabled: isConnected && !!address } })

  const fee = reviewFee ? Number(reviewFee) : 100000
  const isApproved = allowance ? Number(allowance) >= fee : false

  const { writeContract: doApprove, isPending: approving } = useWriteContract({
    mutation: { onSuccess: () => setStep('submit') }
  })
  const { writeContract: doSubmit, isPending: submitting } = useWriteContract({
    mutation: { onSuccess: () => setStep('done'), onError: () => setStep('submit') }
  })

  const handleApprove = () => {
    setStep('approve')
    doApprove({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [REVIEW_ADDRESS, BigInt(fee * 10)] })
  }

  const handleSubmit = () => {
    setStep('submit')
    doSubmit({
      address: REVIEW_ADDRESS, abi: REVIEW_ABI, functionName: 'submitReview',
      args: [cat, name, origin, rating, text, photo1, photo2],
    })
  }

  const reset = () => { setStep('form'); setName(''); setOrigin(''); setRating(0); setText(''); setPhoto1(''); setPhoto2(''); setTab('browse') }

  return (
    <div className="mx-auto max-w-[640px] px-4 py-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)' }}>
          <MessageSquare className="h-7 w-7 text-[#EC4899]" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Onchain Review</h1>
        <p className="mt-0.5 text-sm text-[#5A5A6A]">Food &amp; Movie reviews. Forever on-chain. {(fee / 1e6).toFixed(1)} USDC.</p>
      </motion.div>

      <div className="mb-5 flex gap-2">
        {[{ k: 'browse' as const, l: 'Browse' }, { k: 'write' as const, l: 'Write' }].map(t => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`flex-1 rounded-xl py-2.5 text-sm font-medium transition-all ${tab === t.k ? 'bg-[#EC4899] text-white' : 'border border-[#2A2A3A] text-[#8A8A9A]'}`}>{t.l}</button>
        ))}
      </div>

      {tab === 'browse' ? (
        <div className="space-y-3">
          {MOCK.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="rounded-2xl border border-[#2A2A3A]/60 bg-[#12121A] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">{r.category === 0 ? <Utensils className="h-3.5 w-3.5 text-[#F59E0B]" /> : <Film className="h-3.5 w-3.5 text-[#3B82F6]" />}<span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: r.category === 0 ? '#F59E0B' : '#3B82F6' }}>{r.category === 0 ? 'Food' : 'Movie'}</span></div>
                <div className="flex gap-0.5">{[1,2,3,4,5].map(s => <Star key={s} className="h-3 w-3" style={{ color: s <= r.rating ? '#F59E0B' : '#2A2A3A' }} fill={s <= r.rating ? '#F59E0B' : 'none'} />)}</div>
              </div>
              <h3 className="mb-0.5 text-base font-semibold">{r.name}</h3>
              <div className="mb-2 flex items-center gap-1 text-[11px] text-[#5A5A6A]"><MapPin className="h-2.5 w-2.5" />{r.origin}</div>
              {r.reviewText && <p className="mb-2 text-xs text-[#8A8A9A]">{r.reviewText}</p>}
              {r.photoUrl1 && <img src={r.photoUrl1} alt="" className="mb-2 h-32 w-full rounded-lg object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
              <span className="text-[10px] text-[#5A5A6A]">by {r.reviewer}</span>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#2A2A3A]/60 bg-[#12121A] p-5">
          {step === 'done' ? (
            <div className="flex flex-col items-center py-8">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#22C55E]/10"><Check className="h-7 w-7 text-[#22C55E]" /></div>
              <h3 className="text-lg font-bold text-[#22C55E]">Review On-Chain!</h3>
              <p className="mb-4 text-xs text-[#8A8A9A]">Permanently recorded at {REVIEW_ADDRESS.slice(0, 10)}...</p>
              <button onClick={reset} className="cursor-pointer rounded-lg bg-[#2DD4BF] px-6 py-2 text-sm font-semibold text-[#0A0A0F]">Back to Browse</button>
            </div>
          ) : (
            <>
              {/* Category */}
              <label className="mb-1.5 block text-xs text-[#8A8A9A]">Category</label>
              <div className="mb-3 flex gap-2">
                {[{ id: 0 as 0, l: 'Food', i: Utensils, c: '#F59E0B' }, { id: 1 as 1, l: 'Movie', i: Film, c: '#3B82F6' }].map(x => (
                  <button key={x.id} onClick={() => setCat(x.id)} className="flex flex-1 items-center justify-center gap-2 rounded-xl border py-2.5 text-sm font-medium transition-all" style={cat === x.id ? { borderColor: x.c, color: x.c, backgroundColor: `${x.c}10` } : { borderColor: '#2A2A3A', color: '#8A8A9A' }}>
                    <x.i className="h-4 w-4" />{x.l}
                  </button>
                ))}
              </div>

              <label className="mb-1.5 block text-xs text-[#8A8A9A]">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder={cat === 0 ? 'e.g. Nasi Goreng' : 'e.g. Dune Part Two'} className="mb-3 w-full rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F0F0F5] outline-none focus:border-[#EC4899]" />

              <label className="mb-1.5 block text-xs text-[#8A8A9A]">Origin (Country, City)</label>
              <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="e.g. Indonesia, Jakarta" className="mb-3 w-full rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F0F0F5] outline-none focus:border-[#EC4899]" />

              <label className="mb-1.5 block text-xs text-[#8A8A9A]">Rating</label>
              <div className="mb-3 flex gap-1">{[1,2,3,4,5].map(v => <button key={v} onClick={() => setRating(v)} className="cursor-pointer transition-colors" style={{ color: v <= rating ? '#F59E0B' : '#2A2A3A' }}><Star className="h-6 w-6" fill={v <= rating ? '#F59E0B' : 'none'} /></button>)}</div>

              <label className="mb-1.5 block text-xs text-[#8A8A9A]">Review (optional)</label>
              <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Your thoughts..." className="mb-3 h-20 w-full resize-none rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F0F0F5] outline-none focus:border-[#EC4899]" />

              <label className="mb-1.5 flex items-center gap-1 text-xs text-[#8A8A9A]"><Image className="h-3 w-3" />Photo URL</label>
              <input value={photo1} onChange={e => setPhoto1(e.target.value)} placeholder="https://i.imgur.com/xxx.jpg" className="mb-2 w-full rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F0F0F5] outline-none focus:border-[#EC4899]" />
              <input value={photo2} onChange={e => setPhoto2(e.target.value)} placeholder="2nd photo (optional)" className="mb-1 w-full rounded-xl border border-[#2A2A3A] bg-[#0A0A0F] px-3.5 py-2.5 text-sm text-[#F0F0F5] outline-none focus:border-[#EC4899]" />
              <p className="mb-4 text-[10px] text-[#5A5A6A]"><a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-0.5 text-[#3B82F6] hover:underline"><ExternalLink className="h-2.5 w-2.5" />Upload photo to imgur</a></p>

              {/* Action Button */}
              {!isConnected ? (
                <div className="rounded-lg border border-[#F59E0B]/20 bg-[#F59E0B]/5 py-2.5 text-center text-xs text-[#F59E0B]">Connect wallet to submit</div>
              ) : step === 'form' && !isApproved ? (
                <button onClick={handleApprove} disabled={!name || rating === 0} className="w-full cursor-pointer rounded-xl bg-[#F59E0B] py-3 text-sm font-bold text-[#0A0A0F] transition-all hover:brightness-110 disabled:opacity-40">
                  {approving ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Approving USDC...</span> : `Approve ${(fee / 1e6).toFixed(1)} USDC`}
                </button>
              ) : step === 'approve' ? (
                <div className="flex items-center justify-center gap-2 rounded-xl bg-[#F59E0B]/10 py-3 text-sm text-[#F59E0B]"><Loader2 className="h-4 w-4 animate-spin" /> Approving...</div>
              ) : (
                <button onClick={handleSubmit} disabled={submitting} className="w-full cursor-pointer rounded-xl bg-[#EC4899] py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:opacity-50">
                  {submitting ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Writing to chain...</span> : 'Submit Review On-Chain'}
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
