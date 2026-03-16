interface TerminalButtonProps {
  label: string;
  variant?: "pink" | "cyan" | "yellow" | "outline";
  onClick?: () => void;
  disabled?: boolean;
}

const variantClasses = {
  pink:    "border-neon-pink text-neon-pink hover:bg-neon-pink/10 glow-pink",
  cyan:    "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 glow-cyan",
  yellow:  "border-neon-yellow text-neon-yellow bg-neon-yellow text-background font-bold hover:opacity-90",
  outline: "border-muted-foreground/40 text-muted-foreground hover:border-foreground hover:text-foreground",
};

const TerminalButton = ({ label, variant = "outline", onClick, disabled }: TerminalButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-5 py-3 border text-[11px] tracking-[0.15em] uppercase font-mono transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${variantClasses[variant]}`}
    >
      [ {label} ]
    </button>
  );
};

export default TerminalButton;
