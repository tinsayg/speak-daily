import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stat {
  label: string;
  value: string;
  change?: number;
  unit?: string;
}

interface QuickStatsProps {
  stats: Stat[];
}

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <>
      {stats.map(({ label, value, change, unit }) => (
        <Card key={label} className="flex flex-col gap-2">
          <p className="text-xs font-medium text-slate-500">{label}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-100">{value}</span>
            {unit && <span className="text-sm text-slate-500">{unit}</span>}
          </div>
          {change !== undefined && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                change > 0 ? "text-success" : change < 0 ? "text-danger" : "text-slate-500"
              )}
            >
              {change > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : change < 0 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <Minus className="h-3 w-3" />
              )}
              {change > 0 ? "+" : ""}{change} from last week
            </div>
          )}
        </Card>
      ))}
    </>
  );
}
