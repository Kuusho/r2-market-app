import FlowNav from "@/components/FlowNav";
import PageHeader from "@/components/PageHeader";

type Rarity = "COMMON" | "RARE" | "EPIC" | "UNCOMMON";

interface AgentCardProps {
  name: string;
  id: string;
  rarity: Rarity;
  price: string;
  pnl?: string;
  isSelected?: boolean;
}

const rarityColors: Record<Rarity, { border: string; bg: string; text: string; badge: string }> = {
  COMMON: { border: "border-muted-foreground/30", bg: "bg-muted/10", text: "text-muted-foreground", badge: "bg-muted-foreground/40 text-foreground" },
  RARE: { border: "border-neon-cyan/40", bg: "bg-neon-cyan/5", text: "text-neon-cyan", badge: "bg-neon-cyan/20 text-neon-cyan" },
  EPIC: { border: "border-neon-pink/60", bg: "bg-neon-pink/5", text: "text-neon-pink", badge: "bg-neon-pink/20 text-neon-pink" },
  UNCOMMON: { border: "border-purple-500/40", bg: "bg-purple-500/5", text: "text-purple-400", badge: "bg-purple-500/20 text-purple-400" },
};

const AgentCard = ({ name, id, rarity, price, pnl, isSelected }: AgentCardProps) => {
  const colors = rarityColors[rarity];
  
  return (
    <div className={`relative ${isSelected ? 'border-2 border-neon-pink scale-110 z-10 shadow-[0_0_40px_hsl(330,100%,50%,0.3)]' : `border ${colors.border}`} flex flex-col cursor-pointer hover:border-neon-cyan transition-all duration-300 bg-dark-surface`}>
      {/* Rarity badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className={`px-2 py-0.5 text-[7px] tracking-[0.15em] font-display font-bold ${colors.badge}`}>{rarity}</span>
      </div>

      {/* ID */}
      <p className="absolute top-2 right-2 text-[7px] tracking-[0.12em] text-muted-foreground/60 font-mono-r2">#{id}</p>

      {/* Card image area */}
      <div className={`w-full aspect-[3/5] flex flex-col items-center justify-center ${colors.bg} relative overflow-hidden`}>
        {isSelected ? (
          <>
            {/* Eye icon for selected */}
            <div className="bg-muted/30 w-full flex-1 flex items-center justify-center border-b border-neon-pink/30">
              <svg viewBox="0 0 60 40" className="w-20" fill="none">
                <ellipse cx="30" cy="20" rx="25" ry="15" stroke="hsl(330,100%,50%)" strokeWidth="0.8" />
                <circle cx="30" cy="20" r="8" fill="hsl(330,100%,50%)" opacity="0.4" />
                <circle cx="30" cy="20" r="3" fill="hsl(0,0%,0%)" />
              </svg>
            </div>
            <div className="w-full flex-1 p-3" style={{ background: 'hsl(230,80%,50%)' }}>
              <div className="flex gap-1 mb-2">
                <div className="w-5 h-4 bg-neon-pink" />
                <div className="w-5 h-4" style={{ background: 'hsl(230,60%,30%)' }} />
              </div>
              <div className="space-y-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-0.5 bg-blue-300/20 w-full" />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Robot silhouette for unselected */
          <svg viewBox="0 0 60 90" className="w-16 opacity-30" fill="none" stroke={rarity === "EPIC" ? "hsl(330,100%,50%)" : rarity === "UNCOMMON" ? "hsl(270,60%,60%)" : "hsl(180,100%,50%)"} strokeWidth="0.8">
            <circle cx="30" cy="6" r="2" fill={rarity === "EPIC" ? "hsl(330,100%,50%)" : "hsl(120,100%,40%)"} stroke="none" />
            <line x1="30" y1="8" x2="30" y2="15" />
            <rect x="18" y="15" width="24" height="16" />
            <rect x="22" y="20" width="5" height="4" fill={rarity === "EPIC" ? "hsl(330,100%,50%)" : rarity === "UNCOMMON" ? "hsl(270,60%,60%)" : "hsl(180,100%,50%)"} opacity="0.4" />
            <rect x="33" y="20" width="5" height="4" fill={rarity === "EPIC" ? "hsl(330,100%,50%)" : rarity === "UNCOMMON" ? "hsl(270,60%,60%)" : "hsl(180,100%,50%)"} opacity="0.4" />
            <rect x="14" y="35" width="32" height="22" />
            <rect x="18" y="60" width="10" height="18" />
            <rect x="32" y="60" width="10" height="18" />
          </svg>
        )}
      </div>

      {/* Selection arrow */}
      {isSelected && (
        <div className="flex justify-center -mb-1">
          <span className="text-neon-pink text-sm">▼</span>
        </div>
      )}

      {/* Card footer */}
      <div className="p-2 pt-1">
        <p className="text-[7px] tracking-[0.12em] text-muted-foreground/50 font-mono-r2">#{id}</p>
        <p className={`font-display font-bold text-xs ${isSelected ? 'text-neon-pink' : 'text-foreground'}`}>{name}</p>
        <p className="text-[9px] text-muted-foreground font-mono-r2 mt-0.5">{price}</p>
        {pnl && <p className="text-[8px] text-neon-green font-mono-r2">P&L: {pnl}</p>}
      </div>
    </div>
  );
};

const TargetRoster = () => {
  const agents: AgentCardProps[] = [
    { name: "R2-UNIT", id: "0201", rarity: "COMMON", price: "Ξ 0.48" },
    { name: "R2-DELTA", id: "0088", rarity: "RARE", price: "Ξ 0.72", pnl: "Floor+0.1 Ξ" },
    { name: "R2-ALPHA", id: "0001", rarity: "EPIC", price: "Ξ 1.20", isSelected: true },
    { name: "R2-OMEGA", id: "0017", rarity: "EPIC", price: "Ξ 1.10", pnl: "Floor+1.3%" },
    { name: "R2-VERDE", id: "0103", rarity: "UNCOMMON", price: "Ξ 0.55" },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-12">
      {/* Background watermark */}
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, fontSize: '70px', lineHeight: '80px', color: 'rgba(255,255,255,0.02)' }}>
        <span>システム マーケット デジタル</span>
        <span>エージェント データ・ログ</span>
        <span>ネットワーク アクセス システム</span>
      </div>

      <PageHeader
        title="TARGET ROSTER"
        breadcrumb="// MECHDROID COLLECTION — CHARACTER SELECT"
        rightText="USE ◀ ▶ TO SELECT | PRESS CONFIRM TO ACQUIRE"
      />

      <div className="px-6 py-6">
        {/* Agent Cards - Horizontal carousel style */}
        <div className="flex items-center justify-center gap-4 max-w-6xl mx-auto" style={{ minHeight: '420px' }}>
          {agents.map((agent) => (
            <div key={agent.id} className={`${agent.isSelected ? 'w-52 flex-shrink-0' : 'w-40 flex-shrink-0'} transition-all duration-300`}>
              <AgentCard {...agent} />
            </div>
          ))}
        </div>

        {/* Bottom stats bar */}
        <div className="mt-6 flex items-center justify-between text-[9px] font-mono-r2 border-t border-muted-foreground/20 pt-3">
          <div className="flex items-center gap-6 tracking-[0.12em]">
            <span className="text-muted-foreground">HOLDING: <span className="text-neon-cyan font-bold">25 NFTs</span></span>
            <span className="text-muted-foreground">FLOOR: <span className="text-neon-pink font-bold">Ξ 0.48</span></span>
            <span className="text-muted-foreground">EST. VALUE: <span className="text-neon-pink font-bold">Ξ 11.2</span></span>
            <span className="text-muted-foreground">P&L: <span className="text-neon-green font-bold">+Ξ 0.34</span></span>
          </div>
          <button className="px-6 py-2 border border-neon-cyan text-neon-cyan text-[10px] tracking-[0.15em] font-display font-bold hover:bg-neon-cyan/10 cursor-pointer transition-colors">
            [ CONFIRM TARGET ]
          </button>
        </div>
      </div>

      <FlowNav />
    </div>
  );
};

export default TargetRoster;
