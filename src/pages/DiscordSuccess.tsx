const DiscordSuccess = () => (
  <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8 gap-6">
    <div className="absolute top-4 left-4 w-6 h-6 border-l-2 border-t-2 border-neon-cyan opacity-40" />
    <div className="absolute top-4 right-4 w-6 h-6 border-r-2 border-t-2 border-neon-pink opacity-40" />
    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-2 border-b-2 border-neon-yellow opacity-40" />
    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-2 border-b-2 border-neon-cyan opacity-40" />

    <div className="flex flex-col items-center gap-4 text-center max-w-sm">
      <span className="font-mono text-neon-green text-2xl">✓</span>
      <h1 className="font-display font-bold text-neon-green text-base tracking-wider uppercase">
        Discord Connected
      </h1>
      <p className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase leading-relaxed">
        Return to Warpcast to continue your agent registration.
      </p>
      <div className="border-t border-muted-foreground/10 w-full pt-4">
        <p className="font-mono text-[9px] tracking-wider text-muted-foreground/40 uppercase">
          You can close this tab.
        </p>
      </div>
    </div>
  </div>
)

export default DiscordSuccess
