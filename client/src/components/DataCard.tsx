import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export function DataCard({ title, value, subtitle, icon: Icon, variant = "default", className }: DataCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-2xl p-6 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group",
      className
    )}>
      {/* Background decoration */}
      <div className={cn(
        "absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150",
        variant === "primary" ? "bg-primary" : 
        variant === "accent" ? "bg-indigo-500" : "bg-slate-500"
      )} />

      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-display font-bold tracking-tight text-foreground">{value}</h3>
          {subtitle && (
            <p className="mt-2 text-xs font-medium text-muted-foreground flex items-center gap-1">
              {subtitle}
            </p>
          )}
        </div>
        <div className={cn(
          "p-3 rounded-xl",
          variant === "primary" ? "bg-primary/10 text-primary" :
          variant === "accent" ? "bg-indigo-500/10 text-indigo-500" :
          "bg-muted text-muted-foreground"
        )}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}
