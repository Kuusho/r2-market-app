interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  rightText?: string;
}

const PageHeader = ({ title, breadcrumb, rightText }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-neon-pink/40">
      <div className="flex items-center gap-4">
        <h1 className="font-display font-bold text-neon-pink text-sm tracking-wider uppercase">
          {title}
        </h1>
        <span className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase font-mono-r2">
          {breadcrumb}
        </span>
      </div>
      {rightText && (
        <span className="text-muted-foreground text-[9px] tracking-[0.15em] uppercase font-mono-r2 hidden md:block">
          {rightText}
        </span>
      )}
    </div>
  );
};

export default PageHeader;
