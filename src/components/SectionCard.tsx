import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface SectionCardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "cyan" | "magenta" | "purple";
}

const variantStyles = {
  default: "glass-card",
  cyan: "glass-card-glow-cyan border-cyan/20",
  magenta: "glass-card-glow-magenta border-secondary/20",
  purple: "glass-card-glow-purple border-accent/20",
};

const SectionCard = ({
  title,
  subtitle,
  icon: Icon,
  children,
  className,
  variant = "default",
}: SectionCardProps) => {
  return (
    <div className={cn("p-6 space-y-4", variantStyles[variant], className)}>
      {(title || subtitle || Icon) && (
        <div className="flex items-start gap-3">
          {Icon && (
            <div className="p-2 rounded-lg bg-muted/50">
              <Icon className="w-5 h-5 text-primary" />
            </div>
          )}
          <div className="space-y-1">
            {title && (
              <h3 className="font-semibold text-foreground">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

export default SectionCard;
