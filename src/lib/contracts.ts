import { type Address } from 'viem'

export const R2_VAULT_ADDRESS = '0xCc615F59EEadb99253379f257c2Ada42ffC38062' as Address

export const R2VaultABI = [
  {
    type: 'function',
    name: 'createVault',
    inputs: [
      { name: 'operator', type: 'address' },
      { name: 'deadline', type: 'uint256' },
      { name: 'signature', type: 'bytes' },
    ],
    outputs: [{ name: 'vaultId', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'creationFee',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getUserVault',
    inputs: [{ name: 'wallet', type: 'address' }],
    outputs: [
      { name: 'hasVault', type: 'bool' },
      { name: 'vaultId', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'nextVaultId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'maxVaults',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'VaultCreated',
    inputs: [
      { name: 'vaultId', type: 'uint256', indexed: true },
      { name: 'owner', type: 'address', indexed: true },
      { name: 'agentId', type: 'uint256', indexed: true },
    ],
  },
] as const
