import { ReactNode } from "react"

interface SocialAuthButtonProps {
  icon: ReactNode
  label: string
  sublabel?: string
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  loadingLabel?: string
  accentColor?: "pink" | "cyan" | "indigo"
}

const accentMap = {
  pink: {
    border:    "border-neon-pink/50 hover:border-neon-pink",
    text:      "text-neon-pink",
    glow:      "hover:shadow-[0_0_18px_hsl(330_100%_50%/0.25)]",
    bg:        "hover:bg-neon-pink/5",
    indicator: "bg-neon-pink",
  },
  cyan: {
    border:    "border-neon-cyan/50 hover:border-neon-cyan",
    text:      "text-neon-cyan",
    glow:      "hover:shadow-[0_0_18px_hsl(180_100%_50%/0.25)]",
    bg:        "hover:bg-neon-cyan/5",
    indicator: "bg-neon-cyan",
  },
  indigo: {
    border:    "border-[#5865F2]/50 hover:border-[#5865F2]",
    text:      "text-[#5865F2]",
    glow:      "hover:shadow-[0_0_18px_rgba(88,101,242,0.25)]",
    bg:        "hover:bg-[#5865F2]/5",
    indicator: "bg-[#5865F2]",
  },
}

const SocialAuthButton = ({
  icon,
  label,
  sublabel,
  onClick,
  disabled,
  loading,
  loadingLabel,
  accentColor = "pink",
}: SocialAuthButtonProps) => {
  const a = accentMap[accentColor]

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        group relative flex items-center gap-3
        border ${a.border} bg-dark-surface
        px-4 py-3 transition-all duration-300
        ${a.glow} ${a.bg}
        disabled:opacity-40 disabled:cursor-not-allowed
        overflow-hidden
      `}
    >
      {/* scanline sweep on hover */}
      <span
        className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
        style={{
          background: `linear-gradient(90deg, transparent 0%, hsl(var(--${accentColor === "indigo" ? "neon-cyan" : `neon-${accentColor}`}) / 0.08) 50%, transparent 100%)`,
        }}
      />

      {/* signal indicator */}
      <span className="relative flex items-center gap-1.5">
        <span
          className={`w-1.5 h-1.5 ${a.indicator} ${loading ? "animate-pulse" : "group-hover:animate-pulse"}`}
        />
        <span className={`font-mono text-[9px] tracking-widest ${a.text} opacity-60`}>
          {loading ? "SIG" : "SIG"}
        </span>
      </span>

      {/* icon */}
      <span className={`${a.text} transition-transform duration-200 group-hover:scale-110 flex-shrink-0`}>
        {icon}
      </span>

      {/* label */}
      <span className="flex flex-col items-start gap-0.5">
        <span className={`font-mono text-[11px] tracking-[0.18em] uppercase ${a.text} font-bold`}>
          {loading && loadingLabel ? loadingLabel : label}
        </span>
        {sublabel && !loading && (
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground uppercase">
            {sublabel}
          </span>
        )}
      </span>

      {/* right bracket */}
      <span className={`ml-auto font-mono text-[10px] ${a.text} opacity-40 group-hover:opacity-100 transition-opacity`}>
        {">>"}
      </span>
    </button>
  )
}

export default SocialAuthButton
