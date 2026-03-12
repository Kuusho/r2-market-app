import FlowNav from "@/components/FlowNav";
import PageHeader from "@/components/PageHeader";

interface StatusBarProps {
  label: string;
  value: string;
  color: string;
  width: string;
}

const StatusBar = ({ label, value, color, width }: StatusBarProps) => (
  <div className="mb-4">
    <p className="text-muted-foreground text-[9px] tracking-[0.12em] uppercase font-mono-r2 mb-1">{label}</p>
    <div className="flex items-center gap-3">
      <div className="flex-1 h-7 bg-muted/20 relative">
        <div className={`h-full ${color} flex items-center pl-2`} style={{ width }}>
          <span className="text-background font-display font-bold text-[11px]">{value}</span>
        </div>
      </div>
    </div>
  </div>
);

const CombatHUD = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-12">
      {/* Background watermark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, fontSize: '70px', lineHeight: '80px', color: 'rgba(255,255,255,0.02)' }}>
        <span>データ・ログ ネットワーク アクセス</span>
        <span>エージェント プロトコル データ</span>
        <span>システム マーケット コントローラ</span>
      </div>

      <PageHeader
        title="COMBAT HUD"
        breadcrumb="// LIVE MARKET FEED — BASE NETWORK — 7 NODES TRACKED"
        rightText="AGENT: R2-ALPHA-01 BLOCK: R2/491842"
      />

      <div className="flex flex-col lg:flex-row gap-6 px-6 py-4">
        {/* Left: Market Status */}
        <div className="w-full lg:w-80 shrink-0 border border-neon-cyan/30 p-5">
          <p className="text-neon-pink text-[10px] tracking-[0.15em] uppercase font-mono-r2 mb-5">// MARKET STATUS</p>
          
          <StatusBar label="MECHDROID — FLOOR HEALTH" value="78%" color="bg-neon-pink" width="78%" />
          <StatusBar label="VOLUME ACTIVITY" value="62%" color="bg-neon-yellow" width="62%" />
          <StatusBar label="LIQUIDITY INDEX" value="45%" color="bg-neon-cyan" width="45%" />
          <StatusBar label="SNIPE SUCCESS RATE" value="91%" color="bg-neon-pink" width="91%" />
          <StatusBar label="AGENT UPTIME" value="99%" color="bg-neon-yellow" width="99%" />
          <StatusBar label="GAS EFFICIENCY" value="88%" color="bg-neon-cyan" width="88%" />
        </div>

        {/* Center: Target crosshair */}
        <div className="flex-1 flex items-center justify-center relative">
          <svg viewBox="0 0 300 300" className="w-full max-w-[350px]" fill="none">
            {/* Outer circle */}
            <circle cx="150" cy="150" r="120" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
            {/* Inner circle (dashed) */}
            <circle cx="150" cy="150" r="80" stroke="hsl(180,100%,50%)" strokeWidth="0.8" strokeDasharray="4 3" />
            {/* Crosshair lines */}
            <line x1="150" y1="20" x2="150" y2="70" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
            <line x1="150" y1="230" x2="150" y2="280" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
            <line x1="20" y1="150" x2="70" y2="150" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
            <line x1="230" y1="150" x2="280" y2="150" stroke="hsl(330,100%,50%)" strokeWidth="1.5" />
            {/* Center dot */}
            <circle cx="150" cy="150" r="8" stroke="hsl(65,100%,50%)" strokeWidth="1" />
            <circle cx="150" cy="150" r="3" fill="hsl(330,100%,50%)" />
            {/* Label */}
            <text x="178" y="143" fill="hsl(65,100%,50%)" fontSize="8" fontFamily="monospace">TARGET</text>
            <text x="172" y="155" fill="hsl(120,100%,40%)" fontSize="9" fontFamily="monospace" fontWeight="bold">LOCKED</text>
          </svg>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-72 shrink-0 space-y-4">
          {/* Floor Price */}
          <div className="border-2 border-neon-pink p-5">
            <div className="text-center">
              <p className="font-display font-bold text-5xl text-neon-yellow">0.48</p>
              <p className="text-muted-foreground text-[9px] tracking-[0.15em] mt-2 font-mono-r2">FLOOR PRICE Ξ</p>
              <p className="font-display font-bold text-3xl text-neon-pink mt-2">124</p>
            </div>
          </div>

          {/* Collection Feed */}
          <div className="border-2 border-neon-yellow p-4">
            <p className="font-display font-bold text-sm text-foreground mb-4">// COLLECTION FEED</p>
            <div className="space-y-3 text-[10px] font-mono-r2">
              {[
                { name: "MECHDROID", floor: "Ξ 0.48", change: "+2.1%", positive: true },
                { name: "VOIDBOTS", floor: "Ξ 0.22", change: "+0.8%", positive: true },
                { name: "STARFORGE", floor: "Ξ 0.09", change: "-14.2%", positive: false },
                { name: "CRYPTOWRAITH", floor: "Ξ 0.31", change: "+1.4%", positive: true },
              ].map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <span className="font-display font-bold text-foreground text-xs">{item.name}</span>
                  <span className="text-muted-foreground">{item.floor}</span>
                  <span className={`text-[9px] flex items-center gap-0.5 ${item.positive ? 'text-neon-green' : 'text-neon-pink'}`}>
                    {item.positive ? '▲' : '▼'} {item.change}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom agent bar */}
      <div className="mx-6 mt-4 border-2 border-neon-pink p-4 flex items-center gap-4">
        <div className="w-12 h-12 border border-neon-pink flex items-center justify-center bg-dark-surface">
          <svg viewBox="0 0 40 40" className="w-8 h-8" fill="none">
            <rect x="10" y="8" width="20" height="12" stroke="hsl(180,100%,50%)" strokeWidth="1" />
            <rect x="14" y="12" width="5" height="4" fill="hsl(330,100%,50%)" />
            <rect x="21" y="12" width="5" height="4" fill="hsl(65,100%,50%)" />
            <rect x="12" y="24" width="16" height="10" stroke="hsl(180,100%,50%)" strokeWidth="1" />
          </svg>
        </div>
        <div>
          <p className="font-display font-bold text-sm text-neon-pink">R2-ALPHA-01</p>
          <p className="text-muted-foreground text-[8px] tracking-[0.12em] font-mono-r2">STRATEGY: FLOOR SNIPER + TRAIT ARB |</p>
          <p className="text-muted-foreground text-[8px] tracking-[0.12em] font-mono-r2">TRADES: 14 | WIN: 78.5%</p>
        </div>
        <div className="ml-auto">
          <span className="font-display font-bold text-3xl text-neon-pink">+Ξ0.012</span>
        </div>
      </div>

      <FlowNav />
    </div>
  );
};

export default CombatHUD;
