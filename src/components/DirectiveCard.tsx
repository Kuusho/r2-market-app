import { ReactNode } from "react";

interface DirectiveCardProps {
  number: string;
  title: string;
  description: string;
  borderColor: "yellow" | "cyan" | "pink" | "muted";
  children: ReactNode;
  locked?: boolean;
}

const borderMap = {
  yellow: "border-neon-yellow",
  cyan:   "border-neon-cyan",
  pink:   "border-neon-pink",
  muted:  "border-muted-foreground/30",
};

const DirectiveCard = ({ number, title, description, borderColor, children, locked }: DirectiveCardProps) => {
  return (
    <div className={`relative border-2 ${borderMap[borderColor]} bg-dark-surface p-4 ${locked ? "opacity-50" : ""}`}>
      <h3 className="font-display font-bold text-base text-neon-yellow mb-1 uppercase">
        [{number}] {title}
      </h3>
      <p className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase mb-3">
        {description}
      </p>
      <div>{children}</div>
    </div>
  );
};

export default DirectiveCard;
