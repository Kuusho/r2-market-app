import { useNavigate, useLocation } from "react-router-dom";

const steps = [
  { num: "#1", label: "SPLASH",   path: "/" },
  { num: "#2", label: "WAITLIST", path: "/directives" },
  { num: "#3", label: "PROFILE",  path: "/profile" },
  { num: "#4", label: "DATABANK", path: "/databank" },
];

const FlowNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentIndex = steps.findIndex((s) => s.path === location.pathname);

  const handlePrev = () => {
    if (currentIndex > 0) navigate(steps[currentIndex - 1].path);
  };

  const handleNext = () => {
    if (currentIndex < steps.length - 1) navigate(steps[currentIndex + 1].path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="h-[2px] bg-neon-pink w-full" />
      <div className="bg-background/95 backdrop-blur-sm flex items-center h-10">
        <button
          onClick={handlePrev}
          disabled={currentIndex <= 0}
          className="px-4 text-[10px] tracking-[0.15em] text-neon-cyan font-mono-r2 hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
        >
          ◀ PREV
        </button>

        <div className="flex-1 flex items-center justify-center">
          {steps.map((step, i) => {
            const isActive = i === currentIndex;
            return (
              <button
                key={step.path}
                onClick={() => navigate(step.path)}
                className={`flex-1 text-center py-2 cursor-pointer transition-all duration-200 ${
                  isActive
                    ? "bg-neon-pink/20 border-t-2 border-neon-pink"
                    : "hover:bg-muted/20"
                }`}
              >
                <span className={`block text-[8px] tracking-[0.1em] ${isActive ? "text-neon-pink" : "text-muted-foreground/60"}`}>
                  {step.num}
                </span>
                <span className={`block text-[9px] tracking-[0.12em] font-bold ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex >= steps.length - 1}
          className="px-4 text-[10px] tracking-[0.15em] text-neon-pink font-mono-r2 hover:text-foreground disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed flex items-center gap-1"
        >
          NEXT ▶
        </button>
      </div>
    </div>
  );
};

export default FlowNav;
