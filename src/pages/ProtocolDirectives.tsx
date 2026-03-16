import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSignIn } from "@farcaster/auth-kit";
import { sdk } from "@farcaster/miniapp-sdk";
import DirectiveSidebar from "@/components/DirectiveSidebar";
import DirectiveCard from "@/components/DirectiveCard";
import TerminalButton from "@/components/TerminalButton";
import SocialAuthButton from "@/components/SocialAuthButton";
import FlowNav from "@/components/FlowNav";
import { supabase } from "@/lib/supabase";

const IS_STUB = import.meta.env.VITE_AUTH_STUB === 'true'

const FarcasterIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 1000 1000" fill="currentColor">
    <path d="M257.778 155.556H742.222V844.445H671.111V528.889H670.414C662.554 441.677 589.258 373.333 500 373.333C410.742 373.333 337.446 441.677 329.586 528.889H328.889V844.445H257.778V155.556Z"/>
    <path d="M128.889 253.333L157.778 351.111H182.222V746.667C169.949 746.667 160 756.616 160 768.889V795.556H155.556C143.283 795.556 133.333 805.505 133.333 817.778V844.445H382.222V817.778C382.222 805.505 372.273 795.556 360 795.556H355.556V768.889C355.556 756.616 345.606 746.667 333.333 746.667H306.667V253.333H128.889Z"/>
    <path d="M675.556 746.667C663.283 746.667 653.333 756.616 653.333 768.889V795.556H648.889C636.616 795.556 626.667 805.505 626.667 817.778V844.445H875.556V817.778C875.556 805.505 865.606 795.556 853.333 795.556H848.889V768.889C848.889 756.616 838.939 746.667 826.667 746.667V351.111H851.111L880 253.333H702.222V746.667H675.556Z"/>
  </svg>
)

const DiscordIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
)

// Compact row shown for completed steps
const StepDone = ({ num, label, detail }: { num: string; label: string; detail?: string }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-neon-green/10">
    <div className="flex items-center gap-2 shrink-0">
      <div className="w-1.5 h-1.5 bg-neon-green" />
      <span className="font-mono text-neon-green text-[9px] tracking-[0.15em]">{num}</span>
    </div>
    <span className="font-mono text-muted-foreground/50 text-[9px] tracking-[0.1em] uppercase">{label}</span>
    {detail && <span className="font-mono text-neon-green/60 text-[9px] tracking-wider ml-auto truncate max-w-[100px]">@{detail}</span>}
  </div>
)

const ProtocolDirectives = () => {
  const navigate = useNavigate()

  // Farcaster auth state
  const [farcasterLinked, setFarcasterLinked] = useState(false)
  const [farcasterUsername, setFarcasterUsername] = useState<string | null>(null)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [farcasterError, setFarcasterError] = useState<'error' | 'unverified' | null>(null)
  const [farcasterLoading, setFarcasterLoading] = useState(false)

  // Desktop SIWF fallback
  const { signIn, isSuccess: siwfSuccess, isError: siwfIsError, data: siwfData } = useSignIn()

  // Downstream state
  const [discordLinked, setDiscordLinked] = useState(false)
  const [discordUsername, setDiscordUsername] = useState<string | null>(null)
  const [discordPending, setDiscordPending] = useState(false)
  const [referralAcknowledged, setReferralAcknowledged] = useState(false)
  const [queueSlot, setQueueSlot] = useState<number | null>(null)
  const [initLoading, setInitLoading] = useState(false)
  const [navOpen, setNavOpen] = useState(false)

  // Progressive step derivation
  const step1Done = farcasterLinked
  const step2Done = step1Done && referralAcknowledged
  const step3Done = discordLinked
  const step4Done = !!queueSlot

  const activeStep = !step1Done ? 1 : !step2Done ? 2 : !step3Done ? 3 : 4
  const waitlistComplete = step2Done && step3Done

  const completedCount =
    (step1Done ? 1 : 0) +
    (step3Done ? 1 : 0) +
    (step4Done ? 1 : 0)

  const referralUrl = farcasterUsername
    ? `${window.location.origin}/ref/${farcasterUsername}`
    : null

  // Hydrate from DB after wallet is known
  const hydrateUser = useCallback(async (wallet: string) => {
    const { data: user } = await supabase
      .from('users')
      .select('status, farcaster_username, discord_username')
      .eq('wallet_address', wallet.toLowerCase())
      .single()
    if (user?.farcaster_username) {
      setFarcasterLinked(true)
      setFarcasterUsername(user.farcaster_username)
    }
    if (user?.discord_username) {
      setDiscordLinked(true)
      setDiscordUsername(user.discord_username)
      setReferralAcknowledged(true)
    }
    if (user?.status === 'queued') setQueueSlot(1)
  }, [])

  // On mount: try to detect Farcaster context and pre-load wallet
  useEffect(() => {
    sdk.context.then(ctx => {
      if (ctx?.user?.fid) {
        // Inside Warpcast — try to find existing user by attempting Quick Auth silently
        // (actual auth still requires button tap; this just surfaces context)
        console.log('Farcaster context detected, FID:', ctx.user.fid)
      }
    }).catch(() => {})
  }, [])

  // Poll Supabase for Discord completion when user has gone to external browser to auth
  useEffect(() => {
    if (!discordPending || discordLinked || !walletAddress) return
    const interval = setInterval(async () => {
      const { data } = await supabase
        .from('users')
        .select('discord_username')
        .eq('wallet_address', walletAddress.toLowerCase())
        .single()
      if (data?.discord_username) {
        setDiscordLinked(true)
        setDiscordUsername(data.discord_username)
        setDiscordPending(false)
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [discordPending, discordLinked, walletAddress])

  const verifyWithEdgeFunction = useCallback(async (payload: {
    type: 'quickauth' | 'siwf'
    token?: string
    fid?: number
  }) => {
    setFarcasterLoading(true)
    setFarcasterError(null)
    const referralCode = localStorage.getItem('r2_referral_code') ?? undefined
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/farcaster-auth-verify`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ ...payload, referralCode }),
        }
      )
      const result = await res.json()
      if (result.ok) {
        setFarcasterLinked(true)
        setFarcasterUsername(result.username)
        setWalletAddress(result.wallet)
        hydrateUser(result.wallet)
      } else if (result.unverified) {
        setFarcasterError('unverified')
        // Still set wallet so we can show the profile if needed
        if (result.wallet) setWalletAddress(result.wallet)
      } else {
        setFarcasterError('error')
      }
    } catch (e) {
      console.error('farcaster verify:', e)
      setFarcasterError('error')
    } finally {
      setFarcasterLoading(false)
    }
  }, [hydrateUser])

  const handleFarcasterClick = async () => {
    if (IS_STUB) {
      setFarcasterLinked(true)
      setFarcasterUsername('agent_stub')
      setWalletAddress('0xstub')
      return
    }
    if (farcasterLoading || farcasterLinked) return
    setFarcasterLoading(true)
    setFarcasterError(null)

    try {
      const context = await sdk.context
      if (context?.user?.fid) {
        const { token } = await sdk.quickAuth.getToken()
        await verifyWithEdgeFunction({ type: 'quickauth', token })
        return
      }
    } catch {
      // Not inside Farcaster client — fall through to desktop QR
    }

    setFarcasterLoading(false)
    signIn()
  }

  useEffect(() => {
    if (siwfSuccess && siwfData) {
      verifyWithEdgeFunction({ type: 'siwf', fid: siwfData.fid })
    }
  }, [siwfSuccess, siwfData, verifyWithEdgeFunction])

  useEffect(() => {
    if (siwfIsError) {
      setFarcasterError('error')
      setFarcasterLoading(false)
    }
  }, [siwfIsError])

  const handleDiscord = async () => {
    if (IS_STUB) { setDiscordLinked(true); return }
    if (!walletAddress) return
    const discordUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/discord-auth-start?wallet=${walletAddress}`
    setDiscordPending(true)
    try {
      await sdk.actions.openUrl(discordUrl)
    } catch {
      // Outside Warpcast — open in same tab as fallback
      window.open(discordUrl, '_blank')
    }
  }

  const handleClaimSpot = async () => {
    if (!walletAddress || !waitlistComplete) return
    setInitLoading(true)
    try {
      const { error } = await supabase.from('users')
        .update({ status: 'queued' })
        .eq('wallet_address', walletAddress.toLowerCase())
      if (!error) {
        setQueueSlot(1)
        setTimeout(() => navigate('/profile'), 800)
      }
    } catch (e) {
      console.error('claim spot:', e)
    }
    setInitLoading(false)
  }

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center watermark-text text-[4rem] leading-none opacity-[0.04] select-none pointer-events-none font-display tracking-widest">
        <span>エージェント プロトコル システム</span>
      </div>
      <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-neon-cyan opacity-40" />
      <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-neon-pink opacity-40" />
      <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-neon-yellow opacity-40" />
      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-neon-cyan opacity-40" />

      <div className="flex min-h-screen">
        <DirectiveSidebar completedCount={completedCount} totalCount={4} />

        <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">

          {/* Header */}
          <div className="px-7 pt-4 pb-2">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <h1 className="font-display font-bold text-neon-pink text-sm tracking-wider">PROTOCOL.DIRECTIVES</h1>
                <span className="font-mono text-[9px] tracking-wider text-muted-foreground uppercase">
                  {completedCount} / 4 COMPLETE · SLOT #{queueSlot?.toLocaleString() ?? '—'}
                </span>
              </div>
              <button
                onClick={() => setNavOpen(true)}
                className="border border-neon-pink/40 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-neon-pink hover:border-neon-pink hover:bg-neon-pink/10 transition-all duration-200 shrink-0"
              >
                ≡ NAV
              </button>
            </div>

            {/* Completed step summaries */}
            {step1Done && activeStep > 1 && (
              <div className="mt-4">
                <StepDone num="01" label="COM_LINK" detail={farcasterUsername ?? undefined} />
              </div>
            )}
            {step2Done && activeStep > 2 && (
              <StepDone num="02" label="RECRUITMENT" />
            )}
            {step3Done && activeStep > 3 && (
              <StepDone num="03" label="BASE_CAMP" detail={discordUsername ?? undefined} />
            )}
          </div>

          {/* Active card — centered in remaining space */}
          <div className="flex-1 flex items-center justify-center px-7 py-8">

            {/* [01] FARCASTER */}
            {activeStep === 1 && (
              <DirectiveCard
                number="01"
                title="COM_LINK ESTABLISHED"
                description="AUTHENTICATE FARCASTER · FOLLOW @R2MARKETS · HANDSHAKE COMPLETE"
                borderColor="pink"
              >
                <div className="flex flex-col gap-4 pt-1">
                  {!farcasterLinked ? (
                    <div className="flex flex-col gap-3">
                      <SocialAuthButton
                        accentColor="purple"
                        label="Connect Farcaster"
                        sublabel="Follow @r2markets on Farcaster to verify"
                        loading={farcasterLoading}
                        loadingLabel="Connecting..."
                        onClick={handleFarcasterClick}
                        icon={<FarcasterIcon />}
                      />
                      {farcasterError === 'unverified' && (
                        <div className="border border-neon-yellow/40 bg-neon-yellow/5 px-3 py-3 space-y-2">
                          <p className="font-mono text-neon-yellow text-[9px] tracking-widest uppercase">
                            ⚠ Follow @r2markets on Farcaster first
                          </p>
                          <div className="flex gap-4">
                            <button
                              onClick={() => {
                                try { sdk.actions.openUrl('https://farcaster.xyz/r2markets') }
                                catch { window.open('https://farcaster.xyz/r2markets', '_blank') }
                              }}
                              className="font-mono text-neon-cyan text-[9px] tracking-widest uppercase underline cursor-pointer hover:opacity-80"
                            >
                              Open @r2markets →
                            </button>
                            <button onClick={handleFarcasterClick} className="font-mono text-neon-pink text-[9px] tracking-widest uppercase underline cursor-pointer hover:opacity-80">
                              Retry →
                            </button>
                          </div>
                        </div>
                      )}
                      {farcasterError === 'error' && (
                        <p className="font-mono text-neon-pink text-[9px] tracking-widest uppercase">⚠ Auth error — retry</p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <FarcasterIcon size={12} />
                      <span className="font-mono text-neon-green text-[10px] tracking-wider">
                        @{farcasterUsername} verified
                      </span>
                    </div>
                  )}
                </div>
              </DirectiveCard>
            )}

            {/* [02] REFERRAL */}
            {activeStep === 2 && (
              <DirectiveCard
                number="02"
                title="RECRUITMENT PROTOCOL"
                description="DISTRIBUTE YOUR AGENT LINK · RECRUIT OPERATORS · EARN COMMISSION"
                borderColor="pink"
              >
                <div className="flex flex-col gap-4 pt-1">
                  <div className="space-y-1">
                    <p className="font-mono text-muted-foreground/50 text-[8px] tracking-[0.15em] uppercase">Your recruit link</p>
                    <p className="font-mono text-neon-yellow text-[10px] tracking-wider break-all">{referralUrl}</p>
                  </div>
                  <TerminalButton
                    label="COPY_LINK"
                    variant="outline"
                    onClick={() => referralUrl && navigator.clipboard.writeText(referralUrl)}
                  />
                  <div className="pt-2 border-t border-muted-foreground/10">
                    <button
                      onClick={() => setReferralAcknowledged(true)}
                      className="w-full font-mono text-[9px] tracking-[0.2em] text-neon-cyan/60 hover:text-neon-cyan uppercase transition-colors py-2"
                    >
                      CONTINUE TO DISCORD →
                    </button>
                  </div>
                </div>
              </DirectiveCard>
            )}

            {/* [03] DISCORD */}
            {activeStep === 3 && (
              <DirectiveCard
                number="03"
                title="BASE_CAMP INFILTRATION"
                description="JOIN R2-MARKETS DISCORD · BIND DISCORD ID TO AGENT PROFILE"
                borderColor={step3Done ? "yellow" : "cyan"}
              >
                <div className="flex flex-col gap-4 pt-1">
                  {!discordLinked ? (
                    <div className="flex flex-col gap-3">
                      <SocialAuthButton
                        accentColor="indigo"
                        label={discordPending ? "Waiting for Discord..." : "Join Discord"}
                        sublabel={discordPending ? "Complete auth in your browser, then return here" : "Connect your Discord account to R2-Markets"}
                        loading={discordPending}
                        loadingLabel="Waiting for Discord..."
                        onClick={discordPending ? undefined : handleDiscord}
                        icon={<DiscordIcon />}
                      />
                      {discordPending && (
                        <p className="font-mono text-[9px] tracking-widest text-muted-foreground/50 uppercase text-center">
                          Return to Warpcast after authorising
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <DiscordIcon size={12} />
                      <span className="font-mono text-neon-green text-[10px] tracking-wider">
                        {discordUsername ?? 'Discord'} verified
                      </span>
                    </div>
                  )}
                </div>
              </DirectiveCard>
            )}

            {/* [04] INITIALIZE AGENT */}
            {activeStep === 4 && (
              <DirectiveCard
                number="04"
                title="INITIALIZE AGENT"
                description="DEPLOY ERC-8004 IDENTITY TOKEN · REGISTER TO BASE MAINNET"
                borderColor={step4Done ? "yellow" : "muted"}
              >
                <div className="flex flex-col gap-4 pt-1">
                  {queueSlot ? (
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-neon-green text-[10px] tracking-wider font-bold">
                        ✓ SLOT #{queueSlot.toLocaleString()} CONFIRMED
                      </span>
                      <TerminalButton label="VIEW PROFILE" variant="outline" onClick={() => navigate('/profile')} />
                    </div>
                  ) : (
                    <TerminalButton
                      label={initLoading ? "REGISTERING..." : "◈ INITIALIZE AGENT"}
                      variant="pink"
                      onClick={handleClaimSpot}
                    />
                  )}
                </div>
              </DirectiveCard>
            )}

          </div>

          {/* Footer */}
          <div className="px-7 pb-6 flex items-center justify-between text-[9px] text-muted-foreground tracking-wider">
            <span>© 2026 R2-SYSTEMS CORP</span>
            <span>SLOT #{queueSlot?.toLocaleString() ?? '—'} / 5,000</span>
          </div>
        </div>
      </div>

      <FlowNav open={navOpen} onClose={() => setNavOpen(false)} />
    </div>
  );
};

export default ProtocolDirectives;
