import FlowNav from "@/components/FlowNav";
import PageHeader from "@/components/PageHeader";

const ExecutionTerminal = () => {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden pb-12">
      <PageHeader
        title="EXECUTION TERMINAL"
        breadcrumb="// MAP // CLUSTER // EXECUTE ORDER"
        rightText="AGENT: R2-ALPHA-01 | BASE NET | BLOCK R2/491842"
      />

      <div className="px-6 py-6 max-w-4xl mx-auto space-y-6">
        {/* Authorization header */}
        <div className="border-b border-muted-foreground/20 pb-4">
          <p className="text-neon-pink text-[9px] tracking-[0.15em] uppercase font-mono-r2 mb-2">
            // AUTHORIZATION INTERFACE — EXECUTE ORDER
          </p>
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono-r2">
            <span className="text-muted-foreground">COLLECTION</span>
            <span className="text-muted-foreground">TOKEN ID</span>
            <span className="text-muted-foreground">BID PRICE</span>
            <span className="text-muted-foreground">CONFIDENCE</span>
          </div>
          <div className="flex flex-wrap items-center gap-6 mt-1">
            <span className="font-display font-bold text-foreground text-lg">MECHDROID</span>
            <span className="font-display font-bold text-neon-pink text-lg">#1024</span>
            <span className="font-display font-bold text-foreground text-lg">Ξ 0.460</span>
            <span className="font-display font-bold text-neon-green text-lg">91%</span>
          </div>
        </div>

        {/* Terminal input */}
        <div>
          <p className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase font-mono-r2 mb-2">
            // AGENT AUTHENTICATION CODE
          </p>
          <div className="border border-neon-pink/60 bg-dark-surface p-4">
            <p className="text-neon-pink font-display font-bold text-lg tracking-wider">
              R2-ALPHA-01=EXEC=0xCC4F9A<span className="animate-pulse">█</span>
            </p>
          </div>
        </div>

        {/* SYNC / OVERRIDE Button */}
        <button className="w-full py-6 bg-neon-pink text-background font-display font-bold text-2xl tracking-[0.25em] hover:opacity-90 transition-opacity cursor-pointer glow-pink">
          &lt;&lt; SYNC / OVERRIDE &gt;&gt;
        </button>

        {/* Status footer */}
        <div className="flex flex-wrap items-center gap-6 text-[9px] tracking-[0.12em] font-mono-r2 text-muted-foreground">
          <span>STATUS: <span className="text-neon-green">ONLINE</span></span>
          <span>WALLET: <span className="text-neon-cyan">ACTIVE</span></span>
          <span>FUNDED: <span className="text-neon-yellow">FUNDED</span></span>
          <span>MARKETING AUTH: <span className="text-foreground">—</span></span>
          <span>SLIPPAGE: <span className="text-foreground">2.0%</span></span>
        </div>
      </div>

      <FlowNav />
    </div>
  );
};

export default ExecutionTerminal;
