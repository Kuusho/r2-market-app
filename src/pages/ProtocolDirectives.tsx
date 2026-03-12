import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import DirectiveSidebar from "@/components/DirectiveSidebar";
import DirectiveCard from "@/components/DirectiveCard";
import TerminalButton from "@/components/TerminalButton";
import SocialAuthButton from "@/components/SocialAuthButton";
import FlowNav from "@/components/FlowNav";
import { Settings } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { generateReferralCode } from "@/lib/referral";

const IS_STUB = import.meta.env.VITE_AUTH_STUB === 'true'

const ProtocolDirectives = () => {
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()

  const [twitterLinked, setTwitterLinked] = useState(false)
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null)
  const [twitterError, setTwitterError] = useState<'error' | 'unverified' | null>(null)
  const [twitterLoading, setTwitterLoading] = useState(false)
  const [discordLinked, setDiscordLinked] = useState(false)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)
  const [referralCount, setReferralCount] = useState(0)
  const [queueSlot, setQueueSlot] = useState<number | null>(null)
  const [initLoading, setInitLoading] = useState(false)

  const completedCount =
    (isConnected && twitterLinked ? 1 : 0) +
    (referralCount >= 3 ? 1 : 0) +
    (discordLinked ? 1 : 0)

  const card2Unlocked = isConnected && twitterLinked
  const card3Unlocked = card2Unlocked && referralCount >= 3
  const waitlistComplete = card3Unlocked && discordLinked

  const registerWallet = useCallback(async (addr: string) => {
    const storedRef = localStorage.getItem('r2_referral_code')
    const code = generateReferralCode(addr)

    await supabase.from('users').upsert(
      { wallet_address: addr.toLowerCase(), referral_code: code },
      { onConflict: 'wallet_address', ignoreDuplicates: true }
    )

    if (storedRef) {
      const { data: referrer } = await supabase
        .from('users').select('wallet_address').eq('referral_code', storedRef).single()
      if (referrer) {
        await supabase.from('referrals').upsert(
          { referrer_wallet: referrer.wallet_address, referred_wallet: addr.toLowerCase() },
          { onConflict: 'referred_wallet', ignoreDuplicates: true }
        )
      }
    }

    const { count } = await supabase
      .from('referrals').select('*', { count: 'exact', head: true })
      .eq('referrer_wallet', addr.toLowerCase())
    setReferralCount(count ?? 0)

    const { data: user } = await supabase
      .from('users').select('status, twitter_username, discord_username')
      .eq('wallet_address', addr.toLowerCase()).single()
    if (user?.twitter_username) { setTwitterLinked(true); setTwitterUsername(user.twitter_username) }
    if (user?.discord_username) { setDiscordLinked(true); setDiscordUsername(user.discord_username) }
    if (user?.status === 'queued') setQueueSlot(1)
  }, [])

  useEffect(() => {
    if (address) registerWallet(address)
  }, [address, registerWallet])

  // Handle OAuth callback redirect params (?twitter=ok&tw_user=handle)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const twitterResult = params.get('twitter')
    const twUser = params.get('tw_user')

    if (twitterResult === 'ok' && twUser) {
      setTwitterLinked(true)
      setTwitterUsername(twUser)
      setTwitterError(null)
    } else if (twitterResult === 'unverified') {
      setTwitterError('unverified')
    } else if (twitterResult === 'error') {
      setTwitterError('error')
    }

    const discordResult = params.get('discord')
    const dcUser = params.get('dc_user')
    if (discordResult === 'ok' && dcUser) {
      setDiscordLinked(true)
      setDiscordUsername(dcUser)
    }

    if (twitterResult || discordResult) {
      window.history.replaceState({}, '', '/directives')
    }
  }, [])

  const handleTwitter = () => {
    if (IS_STUB) { setTwitterLinked(true); return }
    if (!address || twitterLoading) return
    setTwitterLoading(true)
    window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/twitter-auth-start?wallet=${address}`
  }

  const handleDiscord = () => {
    if (IS_STUB) { setDiscordLinked(true); return }
    if (!address) return
    window.location.href = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-auth-start?wallet=${address}`
  }

  const handleClaimSpot = async () => {
    if (!address || !waitlistComplete) return
    setInitLoading(true)
    try {
      const { error } = await supabase.from('users')
        .update({ status: 'queued' })
        .eq('wallet_address', address.toLowerCase())
      if (!error) {
        setQueueSlot(1)
        setTimeout(() => navigate('/profile'), 800)
      }
    } catch (e) {
      console.error('claim spot:', e)
    }
    setInitLoading(false)
  }

  const referralCode = twitterUsername ?? (address ? generateReferralCode(address) : null)
  const referralUrl = referralCode
    ? `${window.location.origin}/ref/${referralCode}`
    : 'Connect wallet to get your recruit URL'

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center watermark-text text-[4rem] md:text-[6rem] leading-none opacity-[0.04] select-none pointer-events-none font-display tracking-widest">
        <span>エージェント プロトコル システム</span>
      </div>
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-neon-cyan opacity-40" />
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-neon-cyan opacity-40" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-neon-cyan opacity-40" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-neon-cyan opacity-40" />

      <div className="flex min-h-screen">
        <DirectiveSidebar completedCount={completedCount} totalCount={3} />

        <div className="flex-1 py-6 px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <h1 className="font-display font-bold text-neon-pink text-lg tracking-wider">PROTOCOL.DIRECTIVES</h1>
              <span className="text-muted-foreground text-[10px] tracking-wider">//</span>
              <span className="text-muted-foreground text-[10px] tracking-wider uppercase">R2-MARKETS :: AGENT_CLAIM :: PHASE_1</span>
            </div>
            <div className="text-right text-[10px] text-muted-foreground tracking-wider hidden md:block">
              <p>OBJECTIVES: {completedCount} / 3 :: SLOT #{queueSlot?.toLocaleString() ?? '—'}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* [01] WALLET + TWITTER */}
            <DirectiveCard
              number="01"
              title="COM_LINK ESTABLISHED"
              description="CONNECT WALLET · AUTHENTICATE TWITTER · SIGNAL :: HANDSHAKE :: COMPLETE"
              borderColor={isConnected && twitterLinked ? "yellow" : "pink"}
            >
              <div className="flex flex-col gap-3">
                {/* Wallet row */}
                <div className="flex flex-wrap items-center gap-3">
                  {!isConnected ? (
                    <TerminalButton label="CONNECT_WALLET" variant="pink" onClick={() => connect({ connector: injected() })} />
                  ) : (
                    <span className="font-mono text-neon-green text-[10px] tracking-wider">
                      ✓ {address?.slice(0,6)}...{address?.slice(-4)} LINKED
                    </span>
                  )}
                </div>

                {/* X auth row */}
                {isConnected && !twitterLinked && (
                  <div className="flex flex-col gap-2">
                    <SocialAuthButton
                      accentColor="pink"
                      label="Authenticate X"
                      sublabel="Follow @r2markets + @korewapandesu to verify"
                      loading={twitterLoading}
                      loadingLabel="Redirecting to X..."
                      onClick={handleTwitter}
                      icon={
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                        </svg>
                      }
                    />
                    {twitterError === 'unverified' && (
                      <div className="border border-neon-yellow/40 bg-neon-yellow/5 px-3 py-2 space-y-1">
                        <p className="font-mono text-neon-yellow text-[9px] tracking-widest uppercase">
                          ⚠ Follow check failed — must follow @r2markets & @korewapandesu
                        </p>
                        <button onClick={handleTwitter} className="font-mono text-neon-pink text-[9px] tracking-widest uppercase underline cursor-pointer hover:opacity-80">
                          Retry →
                        </button>
                      </div>
                    )}
                    {twitterError === 'error' && (
                      <p className="font-mono text-neon-pink text-[9px] tracking-widest uppercase">
                        ⚠ Auth error — retry or check console
                      </p>
                    )}
                  </div>
                )}

                {twitterLinked && (
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-neon-green">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span className="font-mono text-neon-green text-[10px] tracking-wider">
                      {twitterUsername ? `@${twitterUsername} verified` : 'X verified'}
                    </span>
                  </div>
                )}
              </div>
            </DirectiveCard>

            {/* [02] REFERRALS */}
            <DirectiveCard
              number="02"
              title="RECRUITMENT PROTOCOL"
              description="DISTRIBUTE AGENT LINK · TARGET :: 3 RECRUITS · REWARD :: ENHANCED SLOT PRIORITY"
              borderColor={referralCount >= 3 ? "yellow" : "pink"}
              locked={!card2Unlocked}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {[0,1,2].map(i => (
                    <div key={i} className={`w-5 h-5 ${i < referralCount ? 'bg-neon-pink' : 'border border-muted-foreground/40'}`} />
                  ))}
                  <span className="text-neon-pink text-[11px] ml-2 font-bold">{referralCount} / 3 RECRUITS</span>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground text-[10px] tracking-wider">RECRUIT_URL //</span>
                    <span className="text-neon-green text-[11px] truncate max-w-[200px]">{referralUrl}</span>
                  </div>
                  {isConnected && (
                    <TerminalButton label="COPY_LINK" variant="outline" onClick={() => navigator.clipboard.writeText(referralUrl)} />
                  )}
                </div>
              </div>
            </DirectiveCard>

            {/* [03] DISCORD */}
            <DirectiveCard
              number="03"
              title="BASE_CAMP INFILTRATION"
              description="JOIN R2-MARKETS DISCORD · VERIFY HOLDER STATUS · BIND DISCORD ID TO AGENT PROFILE"
              borderColor={discordLinked ? "yellow" : "cyan"}
              locked={!card3Unlocked}
            >
              <div className="flex flex-col gap-2">
                {!discordLinked ? (
                  <SocialAuthButton
                    accentColor="indigo"
                    label="Join Discord"
                    sublabel="Connect your Discord account to R2-Markets"
                    onClick={handleDiscord}
                    icon={
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                      </svg>
                    }
                  />
                ) : (
                  <div className="flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="text-neon-green">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
                    </svg>
                    <span className="font-mono text-neon-green text-[10px] tracking-wider">
                      {discordUsername ? `${discordUsername} verified` : 'Discord verified'}
                    </span>
                  </div>
                )}
              </div>
            </DirectiveCard>

            {/* WAITLIST COMPLETE CTA */}
            {waitlistComplete && (
              <div className="border border-neon-green/40 bg-neon-green/5 p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-neon-green animate-pulse" />
                  <span className="font-display font-bold text-neon-green text-sm tracking-wider">ALL PROTOCOLS COMPLETE</span>
                </div>
                <p className="text-muted-foreground text-[10px] tracking-wider">
                  PROCEED TO CONTROLLER PROFILE — SET YOUR DESIGNATION AND AGENT ARCHETYPE TO SECURE YOUR WAITLIST POSITION.
                </p>
                {queueSlot ? (
                  <span className="text-neon-green text-[11px] tracking-wider font-bold">✓ WAITLIST SPOT CONFIRMED — SLOT #{queueSlot.toLocaleString()}</span>
                ) : (
                  <TerminalButton
                    label={initLoading ? "REGISTERING..." : "PROCEED TO PROFILE >>"}
                    variant="pink"
                    onClick={handleClaimSpot}
                  />
                )}
              </div>
            )}

            {/* [PHASE 2] AGENT DEPLOYMENT — DORMANT */}
            <div className="relative opacity-40 pointer-events-none select-none">
              <DirectiveCard
                number="P2"
                title="AGENT DEPLOYMENT"
                description="DEPLOY ERC-8004 IDENTITY TOKEN · REGISTER TO BASE MARKET · AVAILABLE IN PHASE 2"
                borderColor="muted"
                locked={true}
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-muted-foreground animate-spin" style={{ animationDuration: '8s' }} />
                  <span className="text-muted-foreground text-[10px] tracking-wider">PHASE 2 — AGENT INITIALIZATION PENDING PROTOCOL LAUNCH</span>
                </div>
              </DirectiveCard>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="border border-muted-foreground/40 bg-background px-4 py-1 text-[10px] tracking-[0.2em] text-muted-foreground font-display">PHASE 2</span>
              </div>
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between text-[9px] text-muted-foreground tracking-wider">
            <span>© 2026 R2-SYSTEMS CORP</span>
            <span>QUEUE SLOT #{queueSlot?.toLocaleString() ?? '—'} / 5,000</span>
          </div>
        </div>
      </div>
      <FlowNav />
    </div>
  );
};

export default ProtocolDirectives;
