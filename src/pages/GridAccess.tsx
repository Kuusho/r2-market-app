import { useNavigate } from "react-router-dom";

const GridAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center overflow-hidden">
      {/* Background watermark Japanese text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0 select-none pointer-events-none overflow-hidden" style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 900, fontSize: '96px', lineHeight: '100.8px', letterSpacing: '-3px', color: 'rgba(255,255,255,0.05)' }}>
        <span>データ・ログ ネットワーク アクセス システム マーケット</span>
        <span>デジタル エージェント プロトコル データ・ログ ネット</span>
        <span>ワーク アクセス システム マーケット</span>
        <span>アクセス システム マーケット</span>
        <span>エージェント プロトコル データ・ログ</span>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-neon-cyan opacity-60" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-neon-cyan opacity-60" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-neon-cyan opacity-60" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-neon-cyan opacity-60" />

      {/* Top header text */}
      <div className="absolute top-8 left-0 right-0 flex items-center justify-between px-6">
        <p className="text-neon-cyan text-[9px] tracking-[0.2em] uppercase font-mono-r2 opacity-60">
          SYS.VER // 2.0.6
        </p>
        <p className="text-neon-cyan text-[9px] tracking-[0.2em] uppercase font-mono-r2 opacity-60">
          SERIAL // R2-STANDBY
        </p>
      </div>
      <div className="absolute top-14 text-center w-full">
        <p className="text-neon-cyan text-[10px] tracking-[0.3em] uppercase font-mono-r2 opacity-70">
          // R2-SYSTEMS CORP. — AUTONOMOUS NFT GRID //
        </p>
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Crosshair / icon area */}
        <div className="relative w-24 h-24">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-neon-yellow opacity-40" />
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-neon-yellow opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 border border-neon-yellow rounded-full opacity-60" />
        </div>

        {/* Rainbow gradient line */}
        <div className="gradient-rainbow h-[2px] w-[500px] max-w-[80vw]" />

        {/* Sub text */}
        <p className="text-muted-foreground text-[10px] tracking-[0.2em] uppercase font-mono-r2">
          エージェント・プロトコル &nbsp;///&nbsp; BASE NETWORK &nbsp;///&nbsp; ERC-6551
        </p>

        {/* ACCESS.GRID button */}
        <button
          onClick={() => navigate("/directives")}
          className="relative group mt-2 px-16 py-5 border-2 border-neon-pink text-neon-pink font-display font-bold text-xl tracking-wider uppercase transition-all duration-300 hover:bg-neon-pink/10 glow-pink animate-pulse-glow cursor-pointer"
        >
          <span className="relative z-10">|| ACCESS.GRID</span>
        </button>
      </div>

      {/* Bottom decorative section */}
      <div className="absolute bottom-6 left-0 right-0 px-6">
        {/* Bottom left grid dots */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`r1-${i}`} className={`w-1.5 h-1.5 ${i < 2 ? 'bg-neon-pink' : 'border border-muted-foreground/30'}`} />
              ))}
            </div>
            <div className="flex gap-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`r2-${i}`} className={`w-1.5 h-1.5 ${i === 0 ? 'bg-neon-cyan' : 'border border-muted-foreground/20'}`} />
              ))}
            </div>
            <p className="text-muted-foreground text-[8px] tracking-[0.15em] mt-1 font-mono-r2">
              SERIAL // ALPHA · STATUS // STANDBY
            </p>
          </div>
          
          {/* Bottom center dots */}
          <div className="flex gap-4 items-center">
            <div className="w-2 h-2 bg-neon-pink" />
            <div className="w-2 h-2 border border-neon-cyan" />
            <div className="w-2 h-2 border border-neon-cyan" />
          </div>

          {/* Bottom right info */}
          <div className="text-right">
            <p className="text-muted-foreground text-[8px] tracking-[0.15em] font-mono-r2">
              GRID.QUEUE // 2,014 / 5,000
            </p>
            <div className="flex gap-1 justify-end mt-1">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`br-${i}`} className={`w-1.5 h-1.5 ${i === 0 ? 'bg-neon-yellow' : i === 1 ? 'bg-neon-cyan' : 'border border-muted-foreground/30'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GridAccess;
