"use client";

import { cn } from "@/lib/utils";

export type DateRange = "7d" | "30d" | "all";

const options: { value: DateRange; label: string }[] = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "all", label: "All time" },
];

interface DateRangeFilterProps {
  value: DateRange;
  onChange: (v: DateRange) => void;
}

export function DateRangeFilter({ value, onChange }: DateRangeFilterProps) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/7 bg-card p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-lg px-4 py-1.5 text-sm font-medium transition-all duration-150",
            value === opt.value
              ? "bg-primary text-white shadow-sm shadow-primary/30"
              : "text-slate-400 hover:text-slate-200"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
