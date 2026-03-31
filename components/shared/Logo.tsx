import { cn } from "@/lib/utils";
import { Mic2 } from "lucide-react";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/40">
        <Mic2 className="h-4 w-4 text-white" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
      </div>
      {!iconOnly && (
        <span className="text-lg font-bold tracking-tight text-slate-100">
          Speak<span className="text-primary-light">Up</span>
        </span>
      )}
    </div>
  );
}
