interface DirectiveSidebarProps {
  completedCount: number;
  totalCount: number;
}

const DirectiveSidebar = ({ completedCount, totalCount }: DirectiveSidebarProps) => {
  const lines = Array.from({ length: 28 }, (_, i) => {
    const isBold = i === 4 || i === 5 || i === 11 || i === 17 || i === 18;
    const isMedium = i === 3 || i === 10 || i === 12 || i === 16;
    return (
      <p
        key={i}
        className={`text-[10px] leading-[18px] tracking-wider whitespace-nowrap ${
          isBold
            ? "text-neon-cyan font-bold"
            : isMedium
            ? "text-neon-cyan/60"
            : "text-neon-cyan/25"
        }`}
      >
        // DIRECTIVES_PENDING //
      </p>
    );
  });

  return (
    <div className="w-52 shrink-0 py-8 px-5 hidden lg:flex flex-col border-r border-muted-foreground/10 bg-dark-surface/50">
      <p className="text-[9px] text-muted-foreground tracking-[0.2em] uppercase mb-1">STATUS</p>
      <h2 className="text-neon-cyan font-display font-bold text-lg tracking-wider mb-6">DIRECTIVES</h2>
      
      <div className="space-y-0 mb-8 overflow-hidden flex-1">
        {lines}
      </div>

      <div className="mt-auto space-y-2 pt-4 border-t border-muted-foreground/10">
        <p className="text-[9px] text-muted-foreground tracking-[0.15em] mb-2">OBJECTIVE_STATUS</p>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 bg-neon-yellow" />
          <span className="text-neon-yellow text-[10px] font-bold tracking-wider">COM_LINK</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 border border-neon-pink" />
          <span className="text-neon-pink text-[10px] tracking-wider">RECRUITMENT</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 border border-neon-cyan" />
          <span className="text-neon-cyan text-[10px] tracking-wider">BASE_CAMP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 border border-muted-foreground/50" />
          <span className="text-muted-foreground text-[10px] tracking-wider">INIT_AGENT</span>
        </div>
      </div>
    </div>
  );
};

export default DirectiveSidebar;