import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { PREDICT_ADDRESS, USDC_ADDRESS, PREDICT_ABI, ERC20_ABI } from '@/config/contracts'
import { useCallback } from 'react'

export function useVibeCheck() {
  const { address, isConnected } = useAccount()

  const { data: currentDay } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'currentDay', query: { enabled: isConnected } })
  const { data: stakeAmount } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'stakeAmount', query: { enabled: isConnected } })
  const { data: userData, refetch: refetchUser } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getMyUser', query: { enabled: isConnected } })
  const { data: predictorCount } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getPredictorCount', args: currentDay ? [currentDay] : undefined, query: { enabled: isConnected && !!currentDay } })
  const { data: dayPredictors } = useReadContract({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'getDayPredictors', args: currentDay ? [currentDay] : undefined, query: { enabled: isConnected && !!currentDay } })
  const { data: usdcAllowance } = useReadContract({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'allowance', args: address && PREDICT_ADDRESS ? [address, PREDICT_ADDRESS] : undefined, query: { enabled: isConnected && !!address } })

  const { writeContract: approveWrite, isPending: isApproving } = useWriteContract()
  const { writeContract: predictWrite, isPending: isPredicting } = useWriteContract()
  const { writeContract: linkXWrite, isPending: isLinking } = useWriteContract()

  const needsApproval = useCallback(() => {
    if (!usdcAllowance || !stakeAmount) return true
    return (usdcAllowance as bigint) < (stakeAmount as bigint)
  }, [usdcAllowance, stakeAmount])

  const handleApprove = useCallback(() => {
    approveWrite({ address: USDC_ADDRESS, abi: ERC20_ABI, functionName: 'approve', args: [PREDICT_ADDRESS, BigInt('1000000000000000000')] })
  }, [approveWrite])

  const handlePredict = useCallback((choices: { crypto: number; weather: number; market: number; trending: number }) => {
    predictWrite({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'predict', args: [choices.crypto as 0|1|2|3, choices.weather as 0|1|2|3, choices.market as 0|1|2|3, choices.trending as 0|1|2|3] })
  }, [predictWrite])

  const handleLinkXAccount = useCallback((username: string, followerCount: number, verified: boolean, signature: `0x${string}`) => {
    linkXWrite({ address: PREDICT_ADDRESS, abi: PREDICT_ABI, functionName: 'linkXAccount', args: [username, BigInt(followerCount), verified, signature] })
  }, [linkXWrite])

  const hasPredictedToday = userData && currentDay ? (userData as any).lastDay === currentDay : false

  return {
    address, isConnected, currentDay: currentDay as bigint|undefined, stakeAmount: stakeAmount as bigint|undefined,
    userData: userData as any|undefined, predictorCount: predictorCount as bigint|undefined,
    dayPredictors: dayPredictors as `0x${string}`[]|undefined, usdcAllowance: usdcAllowance as bigint|undefined,
    hasPredictedToday, needsApproval, handleApprove, isApproving, handlePredict, isPredicting,
    handleLinkXAccount, isLinking, refetchUser,
  }
}
