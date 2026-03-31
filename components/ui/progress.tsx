"use client";

import { cn } from "@/lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
  color?: "primary" | "success" | "warning" | "danger" | "accent";
}

function Progress({
  value,
  max = 100,
  className,
  barClassName,
  showLabel = false,
  color = "primary",
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    primary: "bg-primary",
    success: "bg-success",
    warning: "bg-warning",
    danger: "bg-danger",
    accent: "bg-accent",
  };

  return (
    <div className={cn("relative h-2 w-full overflow-hidden rounded-full bg-white/10", className)}>
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700 ease-out",
          colors[color],
          barClassName
        )}
        style={{ width: `${percentage}%` }}
      />
      {showLabel && (
        <span className="absolute right-0 top-3 text-xs text-slate-400">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}

export { Progress };
