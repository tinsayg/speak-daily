import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "primary" | "accent";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "bg-white/10 text-slate-300 border-white/10",
    primary: "bg-primary/15 text-primary-light border-primary/25",
    accent: "bg-accent/10 text-accent border-accent/20",
    success: "bg-success/10 text-emerald-400 border-success/20",
    warning: "bg-warning/10 text-amber-400 border-warning/20",
    danger: "bg-danger/10 text-red-400 border-danger/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
