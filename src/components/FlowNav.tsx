import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  { num: "01", label: "SPLASH",   path: "/" },
  { num: "02", label: "WAITLIST", path: "/directives" },
  { num: "03", label: "PROFILE",  path: "/profile" },
  { num: "04", label: "DATABANK", path: "/databank" },
];

interface FlowNavProps {
  open: boolean;
  onClose: () => void;
}

const FlowNav = ({ open, onClose }: FlowNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-[180px] z-50 bg-background border-l border-neon-pink/30 flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-muted-foreground/10">
          <span className="font-mono text-[9px] tracking-[0.2em] text-neon-pink uppercase">Flow Map</span>
          <button
            onClick={onClose}
            className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors leading-none"
          >
            ✕
          </button>
        </div>

        <nav className="flex flex-col flex-1 py-2">
          {steps.map((step) => {
            const isActive = location.pathname === step.path;
            return (
              <button
                key={step.path}
                onClick={() => go(step.path)}
                className={`flex items-center gap-3 px-4 py-4 text-left transition-all duration-150 border-l-2 ${
                  isActive
                    ? "border-neon-pink bg-neon-pink/5 text-foreground"
                    : "border-transparent text-muted-foreground hover:border-muted-foreground/30 hover:text-foreground/80"
                }`}
              >
                <span className="font-mono text-[9px] tracking-[0.1em] text-neon-pink/50">
                  #{step.num}
                </span>
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase font-bold">
                  {step.label}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-muted-foreground/10">
          <p className="font-mono text-[8px] tracking-[0.15em] text-muted-foreground/40 uppercase">
            R2-OS // PHASE_1
          </p>
        </div>
      </aside>
    </>
  );
};

export default FlowNav;
