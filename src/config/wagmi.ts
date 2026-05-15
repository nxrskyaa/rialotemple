import { http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { ARC_TESTNET } from './contracts'

export const config = getDefaultConfig({
  appName: 'Rialo Temple',
  projectId: 'rialo_temple_arc_2025',
  chains: [ARC_TESTNET as any],
  transports: {
    [ARC_TESTNET.id]: http('https://rpc.testnet.arc.network'),
  },
  ssr: false,
})
