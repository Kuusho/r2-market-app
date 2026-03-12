const RobotSchematic = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`relative ${className}`}>
      <p className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase mb-1 font-mono-r2">
        // AGENT SCHEMATIC
      </p>
      <p className="font-display font-bold text-lg text-foreground mb-4">R2-ALPHA-01</p>

      {/* Robot SVG drawing */}
      <svg viewBox="0 0 200 320" className="w-full max-w-[200px] mx-auto" fill="none" stroke="hsl(180,100%,50%)" strokeWidth="1.5">
        {/* Antenna */}
        <circle cx="100" cy="20" r="4" fill="hsl(330,100%,50%)" stroke="none" />
        <line x1="100" y1="24" x2="100" y2="45" />
        
        {/* Head */}
        <rect x="65" y="45" width="70" height="45" />
        {/* Eyes */}
        <rect x="78" y="58" width="16" height="10" fill="hsl(180,100%,50%)" opacity="0.6" />
        <rect x="106" y="58" width="16" height="10" fill="hsl(180,100%,50%)" opacity="0.6" />
        {/* Mouth */}
        <line x1="85" y1="78" x2="115" y2="78" strokeWidth="1" />
        <line x1="88" y1="82" x2="112" y2="82" strokeWidth="1" />
        
        {/* Neck */}
        <line x1="90" y1="90" x2="90" y2="105" />
        <line x1="110" y1="90" x2="110" y2="105" />

        {/* Body outer */}
        <rect x="50" y="105" width="100" height="90" />
        {/* Body inner panels */}
        <rect x="65" y="120" width="25" height="20" stroke="hsl(330,100%,50%)" />
        <rect x="95" y="120" width="25" height="20" stroke="hsl(330,100%,50%)" />
        {/* Core */}
        <circle cx="100" cy="155" r="10" stroke="hsl(65,100%,50%)" />
        <circle cx="100" cy="155" r="4" fill="hsl(65,100%,50%)" opacity="0.8" />

        {/* Arms */}
        <rect x="15" y="115" width="30" height="50" />
        <rect x="155" y="115" width="30" height="50" />
        <circle cx="25" cy="140" r="5" strokeWidth="1" />
        <circle cx="175" cy="140" r="5" strokeWidth="1" />

        {/* Legs */}
        <rect x="60" y="200" width="30" height="50" />
        <rect x="110" y="200" width="30" height="50" />
        
        {/* Feet */}
        <rect x="55" y="255" width="40" height="25" />
        <rect x="105" y="255" width="40" height="25" />

        {/* Dimension lines */}
        <line x1="10" y1="105" x2="10" y2="195" strokeWidth="0.5" strokeDasharray="2 2" stroke="hsl(65,100%,50%)" opacity="0.5" />
        <text x="8" y="150" fill="hsl(65,100%,50%)" fontSize="6" textAnchor="end" opacity="0.5">200px</text>
        <line x1="55" y1="290" x2="145" y2="290" strokeWidth="0.5" strokeDasharray="2 2" stroke="hsl(65,100%,50%)" opacity="0.5" />
        <text x="100" y="298" fill="hsl(65,100%,50%)" fontSize="6" textAnchor="middle" opacity="0.5">140px</text>
      </svg>

      {/* Stats */}
      <div className="mt-6 space-y-1 text-[10px] tracking-[0.12em] font-mono-r2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">UNIT TYPE</span>
          <span className="text-neon-cyan">BIDDER MK.II</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">CPU LOAD</span>
          <span className="text-neon-yellow">23%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">UPTIME</span>
          <span className="text-foreground">14d 06h 22m</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">TX COUNT</span>
          <span className="text-foreground">1,284</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">WIN RATE</span>
          <span className="text-neon-green">91.2%</span>
        </div>
      </div>
    </div>
  );
};

export default RobotSchematic;
