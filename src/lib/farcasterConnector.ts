import { sdk } from '@farcaster/miniapp-sdk'
import { custom, createWalletClient, type WalletClient } from 'viem'
import { base } from 'viem/chains'

let _provider: any = null
let _walletClient: WalletClient | null = null

export async function getFarcasterProvider() {
  if (_provider) return _provider
  _provider = await sdk.wallet.getEthereumProvider()
  return _provider
}

export async function getFarcasterWalletClient() {
  if (_walletClient) return _walletClient
  const provider = await getFarcasterProvider()
  _walletClient = createWalletClient({
    chain: base,
    transport: custom(provider),
  })
  return _walletClient
}

export async function getFarcasterAddress(): Promise<`0x${string}` | null> {
  try {
    const client = await getFarcasterWalletClient()
    const [address] = await client.getAddresses()
    return address ?? null
  } catch {
    return null
  }
}
