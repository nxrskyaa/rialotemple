import { useMemo, useState } from 'react'
import { MessageSquare, Star, Loader2, Film, Utensils } from 'lucide-react'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { REVIEW_ADDRESS, REVIEW_ABI, USDC_ADDRESS, ERC20_ABI } from '@/config/contracts'

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

  const { data: reviewFee } = useReadContract({ address: REVIEW_ADDRESS, abi: REVIEW_ABI, functionName: 'reviewFee' })
  const { data: reviewCount, refetch: refetchCount } = useReadContract({ address: REVIEW_ADDRESS, abi: REVIEW_ABI, functionName: 'getReviewCount' })
  const total = Number(reviewCount || 0n)

  const { data: latestData, refetch: refetchList, isLoading: loadingList } = useReadContract({
    address: REVIEW_ADDRESS,
    abi: REVIEW_ABI,
    functionName: 'getLatestReviews',
    args: [BigInt(0), BigInt(Math.min(total, 30))],
    query: { enabled: total > 0 },
  })

  const items = useMemo(() => {
    if (!latestData || !Array.isArray(latestData) || latestData.length < 6) return []
    const [ids, reviewers, categories, names, ratings, timestamps] = latestData as any[]
    return ids.map((id: bigint, i: number) => ({
      id: Number(id),
      reviewer: reviewers[i],
      category: Number(categories[i]),
      name: names[i],
      rating: Number(ratings[i]),
      ts: Number(timestamps[i]),
    }))
  }, [latestData])

  const { data: allowance } = useReadContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'allowance', args: address && REVIEW_ADDRESS ? [address, REVIEW_ADDRESS] : undefined, query: { enabled: isConnected && !!address } })
  const fee = Number(reviewFee || 100000n)
  const isApproved = allowance ? Number(allowance) >= fee : false

  const { writeContract: doApprove, isPending: approving } = useWriteContract()
  const { writeContract: doSubmit, isPending: submitting } = useWriteContract({ mutation: { onSuccess: async () => { await refetchCount(); await refetchList(); setTab('browse') } } })

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6">
        <div className="mb-2 flex items-center gap-2"><MessageSquare className="h-5 w-5 text-[hsl(var(--primary))]" /><h1 className="text-2xl font-semibold">RialoTempleReview</h1></div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">Contract: {REVIEW_ADDRESS}. Fee submit: {(fee / 1e6).toFixed(1)} USDC.</p>
      </div>

      <div className="mb-5 flex gap-2">
        <button onClick={() => setTab('browse')} className={`flex-1 rounded-xl py-2.5 ${tab === 'browse' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))]'}`}>Browse</button>
        <button onClick={() => setTab('write')} className={`flex-1 rounded-xl py-2.5 ${tab === 'write' ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]' : 'border border-[hsl(var(--border))]'}`}>Write</button>
      </div>

      {tab === 'browse' ? (
        <div className="space-y-3">
          {loadingList && <p className="text-sm text-[hsl(var(--muted-foreground))]">Loading on-chain reviews...</p>}
          {!loadingList && items.length === 0 && <p className="rounded-xl border border-[hsl(var(--border))] p-5 text-sm text-[hsl(var(--muted-foreground))]">Belum ada review on-chain.</p>}
          {items.map((r) => (
            <div key={r.id} className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm">{r.category === 0 ? <Utensils className="h-4 w-4" /> : <Film className="h-4 w-4" />}{r.name}</div>
                <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4" fill={s <= r.rating ? 'currentColor' : 'none'} />)}</div>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">by {r.reviewer.slice(0, 6)}...{r.reviewer.slice(-4)} · {new Date(r.ts * 1000).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Food/Movie name" className="mb-3 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent p-2.5" />
          <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Country, City" className="mb-3 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent p-2.5" />
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Review text" className="mb-3 h-24 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent p-2.5" />
          <input value={photo1} onChange={e => setPhoto1(e.target.value)} placeholder="Photo URL 1" className="mb-2 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent p-2.5" />
          <input value={photo2} onChange={e => setPhoto2(e.target.value)} placeholder="Photo URL 2" className="mb-3 w-full rounded-lg border border-[hsl(var(--border))] bg-transparent p-2.5" />
          <div className="mb-4 flex gap-2">{([0,1] as const).map(v => <button key={v} onClick={() => setCat(v)} className={`rounded-lg border px-3 py-2 ${cat === v ? 'border-[hsl(var(--primary))] text-[hsl(var(--primary))]' : 'border-[hsl(var(--border))]'}`}>{v === 0 ? 'Food' : 'Movie'}</button>)}</div>
          <div className="mb-4 flex gap-1">{[1,2,3,4,5].map(v => <button key={v} onClick={() => setRating(v)}><Star className="h-6 w-6" fill={v <= rating ? 'currentColor' : 'none'} /></button>)}</div>

          {!isConnected ? <p className="text-sm text-[hsl(var(--muted-foreground))]">Connect wallet to submit.</p> : !isApproved ? (
            <button onClick={() => doApprove({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [REVIEW_ADDRESS, BigInt(fee * 10)] })} className="w-full rounded-xl bg-[hsl(var(--primary))] py-3 font-semibold text-[hsl(var(--primary-foreground))]">{approving ? 'Approving...' : `Approve ${(fee/1e6).toFixed(1)} USDC`}</button>
          ) : (
            <button onClick={() => doSubmit({ address: REVIEW_ADDRESS, abi: REVIEW_ABI, functionName: 'submitReview', args: [cat, name, origin, rating, text, photo1, photo2] })} className="w-full rounded-xl bg-[hsl(var(--primary))] py-3 font-semibold text-[hsl(var(--primary-foreground))]">{submitting ? <span className='inline-flex items-center gap-2'><Loader2 className='h-4 w-4 animate-spin'/>Submitting...</span> : 'Submit Review'}</button>
          )}
        </div>
      )}
    </div>
  )
}
