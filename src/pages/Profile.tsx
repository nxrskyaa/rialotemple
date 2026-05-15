import { Wallet } from 'lucide-react'
import { useAccount, useReadContract } from 'wagmi'
import { ERC20_ABI, USDC_ADDRESS } from '@/config/contracts'

export default function Profile() {
  const { address, isConnected } = useAccount()
  const { data: usdcBal } = useReadContract({
    address: USDC_ADDRESS,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: isConnected && !!address },
  })

  const balance = usdcBal ? (Number(usdcBal) / 1e6).toFixed(2) : '0.00'

  return (
    <section className="mx-auto max-w-xl rounded-3xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 sm:p-8">
      <h1 className="text-2xl font-semibold">Wallet Profile</h1>
      <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">X linking dan signature verification sementara dimatikan sampai flow backend/on-chain sinkron.</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.55)] p-4">
          <p className="text-xs text-[hsl(var(--muted-foreground))]">Wallet Address</p>
          <p className="mt-1 break-all text-sm font-medium">{isConnected ? address : 'Not Connected'}</p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background)/0.55)] p-4">
          <p className="mb-1 text-xs text-[hsl(var(--muted-foreground))]">USDC Balance (ARC)</p>
          <div className="flex items-center gap-2 text-xl font-bold"><Wallet className="h-5 w-5 text-[hsl(var(--primary))]" />{balance}</div>
        </div>
      </div>
    </section>
  )
}
