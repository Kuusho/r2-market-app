import FlowNav from "@/components/FlowNav";
import PageHeader from "@/components/PageHeader";
import RobotSchematic from "@/components/RobotSchematic";

interface ParamBarProps {
  label: string;
  value: string;
  segments: { color: string; width: string }[];
}

const ParamBar = ({ label, value, segments }: ParamBarProps) => (
  <div className="flex items-center gap-4 mb-4">
    <span className="text-muted-foreground text-[10px] tracking-[0.12em] w-48 shrink-0 uppercase font-mono-r2">{label}</span>
    <div className="flex-1 flex h-7">
      {segments.map((seg, i) => (
        <div key={i} className={`h-full ${seg.color}`} style={{ width: seg.width }} />
      ))}
      {/* Empty remaining cells */}
      <div className="flex-1 flex">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex-1 h-full bg-muted/20 border-r border-background/20" />
        ))}
      </div>
    </div>
    <span className="text-neon-yellow font-display font-bold text-base w-16 text-right">{value}</span>
  </div>
);

const StrategyConfig = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-12">
      <PageHeader 
        title="STRATEGY CONFIG" 
        breadcrumb="HOME // MAP // AGENT // PARAMETERS"
        rightText="AGENT: R2-ALPHA-01 | BASE NET | BLOCK R2/491842"
      />

      <div className="flex flex-col lg:flex-row gap-6 px-6 py-4">
        {/* Left: Robot Schematic */}
        <div className="w-full lg:w-72 shrink-0">
          <RobotSchematic />
        </div>

        {/* Center: Parameters */}
        <div className="flex-1">
          <h2 className="font-display font-bold text-2xl text-foreground mb-1">PARAMETERS</h2>
          <p className="text-neon-pink text-[9px] tracking-[0.15em] uppercase mb-6 font-mono-r2">
            // AGENT STRATEGY CONFIGURATION
          </p>

          <ParamBar label="BID AGGRESSIVENESS" value="80%" segments={[
            { color: "bg-neon-pink", width: "55%" },
            { color: "bg-neon-cyan", width: "25%" },
          ]} />
          <ParamBar label="SLIPPAGE TOLERANCE" value="2.0%" segments={[
            { color: "bg-neon-yellow", width: "20%" },
          ]} />
          <ParamBar label="GAS PRIORITY BOOST" value="50%" segments={[
            { color: "bg-neon-yellow", width: "25%" },
            { color: "bg-neon-cyan", width: "25%" },
          ]} />
          <ParamBar label="CONFIDENCE THRESHOLD" value="87%" segments={[
            { color: "bg-neon-pink", width: "60%" },
            { color: "bg-neon-cyan", width: "27%" },
          ]} />
          <ParamBar label="MAX BID PER TX" value="Ξ 0.6" segments={[
            { color: "bg-neon-pink", width: "40%" },
            { color: "bg-neon-cyan", width: "25%" },
          ]} />
          <ParamBar label="CONCURRENT BIDS" value="3" segments={[
            { color: "bg-neon-cyan", width: "30%" },
          ]} />
          <ParamBar label="RARITY WEIGHT" value="70%" segments={[
            { color: "bg-neon-pink", width: "50%" },
            { color: "bg-neon-yellow", width: "20%" },
          ]} />
          <ParamBar label="TRAIT CORRELATION" value="MAX" segments={[
            { color: "bg-neon-yellow", width: "45%" },
            { color: "bg-neon-pink", width: "40%" },
          ]} />

          {/* Apply Config Button */}
          <div className="mt-6">
            <button className="w-full py-5 font-display font-bold text-xl tracking-[0.2em] cursor-pointer transition-opacity hover:opacity-90"
              style={{
                background: 'linear-gradient(90deg, hsl(65,100%,50%), hsl(180,100%,50%), hsl(330,100%,50%))',
                color: 'hsl(260,60%,8%)',
              }}
            >
              APPLY CONFIG &gt;&gt;
            </button>
          </div>

          {/* Status line */}
          <p className="text-muted-foreground/40 text-[8px] tracking-[0.15em] mt-2 font-mono-r2">
            TX.MODE // STRATEGY
          </p>
        </div>

        {/* Right: Mode Select */}
        <div className="w-full lg:w-64 shrink-0">
          <p className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase mb-4 font-mono-r2">// MODE SELECT</p>
          
          {/* Mode diagram */}
          <div className="relative w-full aspect-square max-w-[240px] mx-auto">
            <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
              {/* Center node - HYBRID */}
              <circle cx="100" cy="100" r="20" stroke="hsl(65,100%,50%)" strokeWidth="1" />
              <circle cx="100" cy="100" r="8" fill="hsl(65,100%,50%)" opacity="0.3" />
              <text x="100" y="128" textAnchor="middle" fill="hsl(65,100%,50%)" fontSize="7" fontFamily="monospace" fontWeight="bold">HYBRID</text>

              {/* Top - SNIPE */}
              <circle cx="100" cy="30" r="12" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
              <circle cx="100" cy="30" r="5" fill="hsl(330,100%,50%)" opacity="0.6" />
              <text x="100" y="14" textAnchor="middle" fill="hsl(330,100%,50%)" fontSize="7" fontFamily="monospace" fontWeight="bold">SNIPE</text>
              <line x1="100" y1="42" x2="100" y2="80" stroke="hsl(180,100%,50%)" strokeWidth="0.8" opacity="0.5" />

              {/* Top Right - SWEEP */}
              <circle cx="168" cy="55" r="12" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
              <circle cx="168" cy="55" r="5" fill="hsl(330,100%,50%)" opacity="0.6" />
              <text x="188" y="53" fill="hsl(330,100%,50%)" fontSize="7" fontFamily="monospace" fontWeight="bold">SWEEP</text>
              <line x1="156" y1="62" x2="118" y2="88" stroke="hsl(180,100%,50%)" strokeWidth="0.8" opacity="0.5" />

              {/* Bottom Right - HOLD */}
              <circle cx="168" cy="145" r="12" stroke="hsl(65,100%,50%)" strokeWidth="1" />
              <circle cx="168" cy="145" r="5" fill="hsl(65,100%,50%)" opacity="0.4" />
              <text x="188" y="148" fill="hsl(65,100%,50%)" fontSize="7" fontFamily="monospace">HOLD</text>
              <line x1="156" y1="140" x2="118" y2="112" stroke="hsl(180,100%,50%)" strokeWidth="0.8" opacity="0.3" />

              {/* Left - LEARN */}
              <text x="25" y="60" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="monospace">LEARN</text>
              <line x1="40" y1="55" x2="82" y2="88" stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.2" />

              {/* Bottom Left - MONITOR */}
              <text x="28" y="155" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="monospace">MONITOR</text>
              <line x1="42" y1="148" x2="82" y2="112" stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.2" />

              {/* Bottom Center Left - SALE */}
              <text x="55" y="185" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="monospace">SALE</text>

              {/* Bottom Center Right - DUMP */}
              <text x="148" y="185" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="7" fontFamily="monospace">DUMP</text>

              {/* Connecting lines from center */}
              <line x1="82" y1="100" x2="42" y2="100" stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.15" />
              <line x1="100" y1="120" x2="60" y2="175" stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.15" />
              <line x1="100" y1="120" x2="140" y2="175" stroke="hsl(180,100%,50%)" strokeWidth="0.5" opacity="0.15" />
            </svg>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-1.5 text-[9px] tracking-[0.12em] font-mono-r2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-neon-pink" />
              <span className="text-muted-foreground">ACTIVE MODE</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-neon-cyan" />
              <span className="text-muted-foreground">SECONDARY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-neon-yellow" />
              <span className="text-muted-foreground">HYBRID CENTER</span>
            </div>
          </div>
          <p className="text-muted-foreground/40 text-[8px] tracking-[0.15em] mt-3 font-mono-r2">
            LAST SAVE // 08:24D
          </p>
        </div>
      </div>

      <FlowNav />
    </div>
  );
};

export default StrategyConfig;
