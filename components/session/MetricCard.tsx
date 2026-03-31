import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  score: number; // 0–10
  benchmark: string;
  flag?: string | null;
}

export function MetricCard({ icon: Icon, label, value, unit, score, benchmark, flag }: MetricCardProps) {
  const scoreColor =
    score >= 7 ? "success" : score >= 5 ? "primary" : score >= 3 ? "warning" : "danger";

  const barColor =
    score >= 7 ? "success" : score >= 5 ? "primary" : score >= 3 ? "warning" : "danger";

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-white/7 bg-card p-5 transition-all hover:border-white/12">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
            <Icon className="h-4 w-4 text-primary-light" />
          </div>
          <span className="text-sm font-medium text-slate-300">{label}</span>
        </div>
        <Badge variant={scoreColor}>{score.toFixed(1)}/10</Badge>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-100">{value}</span>
        {unit && <span className="text-sm text-slate-500">{unit}</span>}
      </div>

      {/* Progress bar */}
      <Progress value={score} max={10} color={barColor} />

      {/* Benchmark */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Target: {benchmark}</span>
        {flag ? (
          <div className="flex items-center gap-1 text-amber-400">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs">{flag}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-success">
            <CheckCircle2 className="h-3 w-3" />
            <span>On track</span>
          </div>
        )}
      </div>
    </div>
  );
}
