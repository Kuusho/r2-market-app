import { useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import FlowNav from "@/components/FlowNav";
import PageHeader from "@/components/PageHeader";
import TerminalButton from "@/components/TerminalButton";
import { supabase } from "@/lib/supabase";
import { generateReferralCode } from "@/lib/referral";

const ARCHETYPES = [
  {
    key: 'SNIPER',
    label: 'SNIPER',
    sub: 'Precision entry. Targets undervalued agents at discovery.',
    color: 'neon-pink',
  },
  {
    key: 'ARBITRAGEUR',
    label: 'ARBITRAGEUR',
    sub: 'Cross-market spread hunter. Exploits price inefficiencies.',
    color: 'neon-cyan',
  },
  {
    key: 'ACCUMULATOR',
    label: 'ACCUMULATOR',
    sub: 'Long-position strategist. Builds conviction positions over time.',
    color: 'neon-yellow',
  },
  {
    key: 'MARKET_MAKER',
    label: 'MARKET_MAKER',
    sub: 'Liquidity provider. Runs bid/ask spreads on active pairs.',
    color: 'neon-green',
  },
  {
    key: 'CURATOR',
    label: 'CURATOR',
    sub: 'Intelligence operator. Specialises in agent discovery and ranking.',
    color: 'foreground',
  },
  {
    key: 'SCOUT',
    label: 'SCOUT',
    sub: 'Early detection unit. Finds emerging agents before price discovery.',
    color: 'muted-foreground',
  },
] as const

type Archetype = typeof ARCHETYPES[number]['key']

type UserRow = {
  wallet_address: string
  status: string
  twitter_username?: string
  discord_username?: string
  display_name?: string
  archetype?: string
  referral_code?: string
  created_at: string
}

const AgentProfile = () => {
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const [user, setUser] = useState<UserRow | null>(null)
  const [handle, setHandle] = useState('')
  const [archetype, setArchetype] = useState<Archetype | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!address) return
    supabase
      .from('users')
      .select('*')
      .eq('wallet_address', address.toLowerCase())
      .single()
      .then(({ data }) => {
        if (data) {
          setUser(data as UserRow)
          setHandle(data.display_name || `CTR-${address.slice(-4).toUpperCase()}`)
          if (data.archetype) setArchetype(data.archetype as Archetype)
        } else {
          setHandle(`CTR-${address.slice(-4).toUpperCase()}`)
        }
      })
  }, [address])

  const handleSave = async () => {
    if (!address) return
    setSaving(true)
    setSaved(false)
    await supabase
      .from('users')
      .update({ display_name: handle, archetype: archetype ?? undefined })
      .eq('wallet_address', address.toLowerCase())
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const shortAddr = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : '0x????????????????'

  const issuedDate = user
    ? new Date(user.created_at).toISOString().slice(0, 10).replace(/-/g, '.')
    : '——'

  const selectedArchetype = ARCHETYPES.find(a => a.key === archetype)

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-20">
      {/* Background watermark */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden"
        style={{
          fontFamily: "'Noto Sans JP', sans-serif",
          fontWeight: 900,
          fontSize: '72px',
          lineHeight: '84px',
          color: 'rgba(255,255,255,0.025)',
        }}
      >
        <span>コントローラー データ 識別</span>
        <span>ネットワーク ストラテジスト</span>
        <span>アーカイブ プロファイル</span>
      </div>

      <PageHeader
        title="CONTROLLER PROFILE"
        breadcrumb="HOME // REGISTRY // CONTROLLER_ID"
        rightText={`CONTROLLER: ${isConnected ? shortAddr : 'UNLINKED'} | BASE NET`}
      />

      {!isConnected && (
        <div className="mx-6 mt-4 px-4 py-3 border border-neon-pink/40 bg-neon-pink/5 flex flex-wrap items-center gap-4">
          <span className="text-neon-pink text-[10px] tracking-wider font-mono-r2">
            ⚠ NO CONTROLLER LINKED — WALLET REQUIRED TO LOAD CREDENTIALS
          </span>
          <TerminalButton label="CONNECT_WALLET" variant="pink" onClick={() => connect({ connector: injected() })} />
        </div>
      )}

      <div className="px-6 py-3 text-[9px] tracking-[0.15em] text-neon-cyan font-mono-r2 space-y-0.5">
        <p>REGISTRY // {user ? 'LOADED' : 'PENDING'}</p>
        <p>STATUS // {user?.status?.toUpperCase() ?? 'UNKNOWN'}</p>
        <p>VER // 1.0.4</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 px-6">

        {/* LEFT: ID Card */}
        <div className="lg:w-[380px] shrink-0">
          <div className="border-2 border-neon-cyan bg-dark-surface relative">
            <div className="bg-neon-cyan/10 border-b border-neon-cyan px-4 py-2 flex items-center justify-between">
              <span className="font-display font-bold text-neon-yellow text-xs tracking-wider">R2 MARKETS</span>
              <span className="text-muted-foreground text-[8px] tracking-[0.15em]">// CONTROLLER CREDENTIALS</span>
            </div>

            <div className="p-5 space-y-4">
              {/* Handle */}
              <div>
                <p className="text-neon-cyan text-[8px] tracking-[0.2em] uppercase mb-1">CONTROLLER HANDLE</p>
                <p className="font-display font-bold text-xl text-foreground border-b border-muted-foreground/20 pb-2">
                  {handle || `CTR-????`}
                </p>
              </div>

              {/* Archetype badge */}
              <div>
                <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-1">ARCHETYPE</p>
                {selectedArchetype ? (
                  <span className={`font-display font-bold text-sm text-${selectedArchetype.color}`}>
                    {selectedArchetype.label}
                  </span>
                ) : (
                  <span className="text-muted-foreground/40 text-sm font-display">— UNASSIGNED —</span>
                )}
              </div>

              {/* Linked accounts */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 pt-1">
                <div>
                  <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-1">WALLET</p>
                  <p className="text-neon-cyan text-xs font-bold">{shortAddr}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-1">REGISTERED</p>
                  <p className="text-foreground text-xs">{issuedDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-1">TWITTER</p>
                  {user?.twitter_username ? (
                    <p className="text-neon-green text-xs font-bold">@{user.twitter_username}</p>
                  ) : (
                    <p className="text-muted-foreground/40 text-xs">— UNLINKED</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-1">DISCORD</p>
                  {user?.discord_username ? (
                    <p className="text-neon-green text-xs font-bold">{user.discord_username}</p>
                  ) : (
                    <p className="text-muted-foreground/40 text-xs">— UNLINKED</p>
                  )}
                </div>
              </div>

              {/* Referral code */}
              {address && (
                <div>
                  <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-1">REFERRAL CODE</p>
                  <p className="text-neon-pink text-sm font-bold tracking-widest">{generateReferralCode(address)}</p>
                </div>
              )}
            </div>

            <div className="border-t border-muted-foreground/20 px-4 py-2">
              <p className="text-muted-foreground/30 text-[7px] tracking-[0.15em] text-center">
                R2.MARKETS // CONTROLLER CREDENTIALS // WAITLIST PHASE 1
              </p>
            </div>
          </div>

          {/* Phase 2 dormant preview */}
          <div className="mt-4 border border-muted-foreground/20 p-4 opacity-40 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="border border-muted-foreground/40 bg-background px-3 py-1 text-[9px] tracking-[0.2em] text-muted-foreground font-display">PHASE 2</span>
            </div>
            <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-2">AGENT IDENTITY</p>
            <p className="text-muted-foreground/60 text-[10px] font-display">ERC-8004 DEPLOYMENT — LOCKED</p>
            <p className="text-muted-foreground/40 text-[9px] mt-1 tracking-wider">
              AGENT INITIALIZATION AVAILABLE IN PHASE 2 UPON PROTOCOL LAUNCH.
            </p>
          </div>
        </div>

        {/* RIGHT: Edit panel */}
        <div className="flex-1 space-y-8">

          {/* Handle input */}
          <div>
            <h2 className="font-display font-bold text-neon-cyan text-sm tracking-wider mb-4">// CONTROLLER DESIGNATION</h2>
            <p className="text-muted-foreground text-[8px] tracking-[0.2em] uppercase mb-2">HANDLE</p>
            <div className="flex items-center gap-2 border-b border-muted-foreground/30 pb-2">
              <input
                value={handle}
                onChange={e => { setHandle(e.target.value); setSaved(false) }}
                className="font-display font-bold text-lg text-foreground bg-transparent border-none outline-none w-full"
                spellCheck={false}
                maxLength={32}
              />
              <div className="w-3 h-4 bg-neon-cyan animate-pulse shrink-0" />
            </div>
            <p className="text-muted-foreground/40 text-[8px] tracking-wider mt-1">{handle.length}/32 CHARACTERS</p>
          </div>

          {/* Archetype picker */}
          <div>
            <h2 className="font-display font-bold text-neon-cyan text-sm tracking-wider mb-1">// AGENT ARCHETYPE</h2>
            <p className="text-muted-foreground/60 text-[9px] tracking-wider mb-4">
              LABELS YOUR DEFAULT AGENT STRATEGY CLASS. COSMETIC ONLY DURING PHASE 1.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ARCHETYPES.map(a => (
                <button
                  key={a.key}
                  onClick={() => { setArchetype(a.key); setSaved(false) }}
                  className={`text-left px-4 py-3 border transition-all cursor-pointer ${
                    archetype === a.key
                      ? `border-${a.color} bg-${a.color}/10`
                      : 'border-muted-foreground/30 hover:border-muted-foreground/60'
                  }`}
                >
                  <p className={`font-display font-bold text-xs tracking-wider ${
                    archetype === a.key ? `text-${a.color}` : 'text-foreground'
                  }`}>
                    {a.label}
                  </p>
                  <p className="text-muted-foreground/60 text-[9px] tracking-wider mt-0.5">{a.sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="space-y-2">
            <button
              onClick={handleSave}
              disabled={saving || !isConnected}
              className="w-full py-4 bg-neon-cyan text-background font-display font-bold text-base tracking-[0.2em] hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'SAVING...' : saved ? '✓ PROFILE SAVED' : 'SAVE CONTROLLER PROFILE >>'}
            </button>
            {saved && (
              <p className="text-neon-green text-[9px] tracking-wider text-center">
                CREDENTIALS UPDATED — PROFILE LOCKED TO WALLET {shortAddr}
              </p>
            )}
            {!isConnected && (
              <p className="text-muted-foreground/50 text-[9px] tracking-wider text-center">
                CONNECT WALLET TO SAVE PROFILE
              </p>
            )}
          </div>

          <p className="text-muted-foreground/30 text-[8px] tracking-[0.15em] text-right">
            CREDENTIALS // {user ? 'VALID' : 'PENDING'} — PHASE 1 WAITLIST
          </p>
        </div>
      </div>

      <FlowNav />
    </div>
  );
};

export default AgentProfile;
