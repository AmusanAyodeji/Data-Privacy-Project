import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureIconProps {
  icon: LucideIcon;
  label: string;
  className?: string;
}

const FeatureIcon = ({ icon: Icon, label, className }: FeatureIconProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
};

export default FeatureIcon;
