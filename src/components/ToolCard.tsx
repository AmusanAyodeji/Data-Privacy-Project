import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  variant: "cyan" | "magenta" | "purple";
}

const variantStyles = {
  cyan: {
    bg: "bg-gradient-to-br from-cyan/20 via-cyan/10 to-teal/5",
    border: "border-cyan/30 hover:border-cyan/60",
    glow: "tool-card-cyan",
    iconBg: "bg-gradient-cyan",
    iconText: "text-background",
  },
  magenta: {
    bg: "bg-gradient-to-br from-secondary/20 via-secondary/10 to-orange/5",
    border: "border-secondary/30 hover:border-secondary/60",
    glow: "tool-card-magenta",
    iconBg: "bg-gradient-magenta",
    iconText: "text-foreground",
  },
  purple: {
    bg: "bg-gradient-to-br from-accent/20 via-accent/10 to-secondary/5",
    border: "border-accent/30 hover:border-accent/60",
    glow: "tool-card-purple",
    iconBg: "bg-gradient-purple",
    iconText: "text-foreground",
  },
};

const ToolCard = ({ title, description, href, icon: Icon, variant }: ToolCardProps) => {
  const styles = variantStyles[variant];

  return (
    <Link to={href} className="block group">
      <div
        className={`tool-card ${styles.glow} ${styles.bg} ${styles.border} border-2 h-full`}
      >
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/5 to-transparent animate-shimmer" 
               style={{ backgroundSize: '200% 100%' }} />
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-xl ${styles.iconBg} flex items-center justify-center shadow-lg`}>
            <Icon className={`w-7 h-7 ${styles.iconText}`} />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-foreground group-hover:text-gradient-primary transition-colors">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Arrow indicator */}
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
            <span>Get started</span>
            <svg 
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
