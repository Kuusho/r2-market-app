import FlowNav from "@/components/FlowNav";
import PageHeader from "@/components/PageHeader";

const FlowMap = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-12">
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none overflow-hidden" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, fontSize: '70px', lineHeight: '80px', color: 'rgba(255,255,255,0.02)' }}>
        <span>フロー マップ ネットワーク</span>
        <span>システム アクセス データ</span>
      </div>

      <PageHeader
        title="FLOW MAP"
        breadcrumb="// SYSTEM OVERVIEW — NAVIGATION INDEX"
        rightText="R2-SYSTEMS // ALL MODULES"
      />

      <div className="px-6 py-8 flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
        <svg viewBox="0 0 600 300" className="w-full max-w-3xl" fill="none">
          {/* Nodes */}
          {[
            { x: 50, y: 150, label: "SPLASH", num: "#1" },
            { x: 125, y: 80, label: "WAITLIST", num: "#2" },
            { x: 200, y: 150, label: "PROFILE", num: "#3" },
            { x: 275, y: 80, label: "STRATEGY", num: "#4" },
            { x: 350, y: 150, label: "DASHBOARD", num: "#5" },
            { x: 425, y: 80, label: "MANIFEST", num: "#6" },
            { x: 500, y: 150, label: "EXECUTE", num: "#7" },
            { x: 550, y: 220, label: "DATABANK", num: "#8" },
            { x: 300, y: 250, label: "FLOW MAP", num: "#9" },
          ].map((node, i) => (
            <g key={i}>
              {i < 8 && (
                <line
                  x1={node.x}
                  y1={node.y}
                  x2={[125, 200, 275, 350, 425, 500, 550, 300][i]}
                  y2={[80, 150, 80, 150, 80, 150, 220, 250][i]}
                  stroke="hsl(180,100%,50%)"
                  strokeWidth="0.5"
                  opacity="0.3"
                />
              )}
              <circle cx={node.x} cy={node.y} r="16" stroke={i === 8 ? "hsl(65,100%,50%)" : "hsl(330,100%,50%)"} strokeWidth="1.5" />
              <circle cx={node.x} cy={node.y} r="6" fill={i === 8 ? "hsl(65,100%,50%)" : "hsl(330,100%,50%)"} opacity="0.4" />
              <text x={node.x} y={node.y - 22} textAnchor="middle" fill="hsl(180,100%,50%)" fontSize="6" fontFamily="monospace">{node.num}</text>
              <text x={node.x} y={node.y + 30} textAnchor="middle" fill="hsl(0,0%,100%)" fontSize="7" fontFamily="monospace" fontWeight="bold">{node.label}</text>
            </g>
          ))}
        </svg>

        <p className="text-muted-foreground text-[9px] tracking-[0.15em] font-mono-r2 mt-8">
          // COMPLETE ALL MODULES TO UNLOCK FULL ACCESS
        </p>
      </div>

      <FlowNav />
    </div>
  );
};

export default FlowMap;

