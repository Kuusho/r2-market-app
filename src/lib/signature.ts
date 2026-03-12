import { verifyMessage } from 'viem'

export function buildInitMessage(walletAddress: string, timestamp: number): string {
  return `R2 Markets Agent Init | wallet: ${walletAddress.toLowerCase()} | ts: ${timestamp}`
}

export async function verifyInitSignature(
  walletAddress: string,
  signature: string,
  message: string
): Promise<boolean> {
  return verifyMessage({
    address: walletAddress as `0x${string}`,
    message,
    signature: signature as `0x${string}`,
  })
}
