import { cn } from "@/lib/utils";

interface PillProps {
  children: React.ReactNode;
  variant?: "cyan" | "magenta" | "purple" | "orange" | "green" | "default";
  className?: string;
}

const variantStyles = {
  cyan: "bg-cyan/20 text-cyan border-cyan/30",
  magenta: "bg-secondary/20 text-secondary border-secondary/30",
  purple: "bg-accent/20 text-accent border-accent/30",
  orange: "bg-orange/20 text-orange border-orange/30",
  green: "bg-green/20 text-green border-green/30",
  default: "bg-muted text-muted-foreground border-border",
};

const Pill = ({ children, variant = "default", className }: PillProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Pill;
