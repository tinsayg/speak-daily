"use client";

import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StreakCardProps {
  streak: number;
  longestStreak: number;
  history: string[]; // ISO date strings of upload days
}

function getCalendarDays(history: string[]) {
  const historySet = new Set(history);
  const days = [];
  const today = new Date();

  for (let i = 62; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = d.toISOString().split("T")[0];
    days.push({ date: iso, active: historySet.has(iso) });
  }
  return days;
}

const MILESTONES = [7, 14, 30];

export function StreakCard({ streak, longestStreak, history }: StreakCardProps) {
  const calDays = getCalendarDays(history);
  const weeks: typeof calDays[] = [];
  for (let i = 0; i < calDays.length; i += 7) {
    weeks.push(calDays.slice(i, i + 7));
  }

  return (
    <Card className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">Current Streak</p>
          <div className="flex items-center gap-2 mt-1">
            <Flame className="h-6 w-6 text-amber-400" />
            <span className="text-4xl font-bold text-slate-100">{streak}</span>
            <span className="text-slate-400 text-sm mt-1">days</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">Longest</p>
          <p className="text-lg font-semibold text-slate-300">{longestStreak}d</p>
        </div>
      </div>

      {/* Milestone pills */}
      <div className="flex gap-2">
        {MILESTONES.map((m) => (
          <span
            key={m}
            className={`rounded-full px-3 py-1 text-xs font-medium border ${
              streak >= m
                ? "bg-warning/10 text-amber-400 border-warning/20"
                : "bg-white/5 text-slate-500 border-white/10"
            }`}
          >
            {m}d {streak >= m ? "✓" : ""}
          </span>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map(({ date, active }) => (
                <div
                  key={date}
                  title={date}
                  className={`h-3.5 w-3.5 rounded-sm transition-colors ${
                    active
                      ? "bg-primary"
                      : "bg-white/5"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
