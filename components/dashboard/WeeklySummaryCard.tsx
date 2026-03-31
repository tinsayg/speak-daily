import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, Flag } from "lucide-react";

interface WeeklySummaryProps {
  avgScore: number;
  mostImproved: string;
  topFlag: string;
  streakStatus: number;
  weekStart: string;
}

export function WeeklySummaryCard({
  avgScore,
  mostImproved,
  topFlag,
  streakStatus,
  weekStart,
}: WeeklySummaryProps) {
  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
            <Sparkles className="h-4 w-4 text-primary-light" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">Weekly Summary</p>
            <p className="text-xs text-slate-500">Week of {weekStart}</p>
          </div>
        </div>
        <Badge variant="primary">New</Badge>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-500">Avg Score</p>
          <p className="text-xl font-bold text-slate-100">{avgScore}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-500">Most Improved</p>
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-success shrink-0" />
            <p className="text-xs font-medium text-slate-200 truncate">{mostImproved}</p>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xs text-slate-500">Top Flag</p>
          <div className="flex items-center gap-1">
            <Flag className="h-3 w-3 text-warning shrink-0" />
            <p className="text-xs font-medium text-slate-200 truncate">{topFlag}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-lg bg-white/5 px-3 py-2 text-xs text-slate-400">
        Streak this week: <span className="font-semibold text-amber-400">{streakStatus} days</span>
      </div>
    </Card>
  );
}
