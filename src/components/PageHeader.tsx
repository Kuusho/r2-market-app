import { useState } from "react";
import FlowNav from "@/components/FlowNav";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  rightText?: string;
}

const PageHeader = ({ title, breadcrumb, rightText }: PageHeaderProps) => {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-neon-pink/40">
        <div className="flex flex-col gap-0.5 min-w-0">
          <h1 className="font-display font-bold text-neon-pink text-sm tracking-wider uppercase truncate">
            {title}
          </h1>
          <span className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase font-mono">
            {rightText ?? breadcrumb}
          </span>
        </div>
        <button
          onClick={() => setNavOpen(true)}
          className="shrink-0 ml-3 border border-neon-pink/40 px-3 py-2 font-mono text-[9px] tracking-[0.2em] text-neon-pink hover:border-neon-pink hover:bg-neon-pink/10 transition-all duration-200"
        >
          ≡ NAV
        </button>
      </div>
      <FlowNav open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
};

export default PageHeader;
