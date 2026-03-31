"use client";

import { useState } from "react";
import { DateRangeFilter, DateRange } from "@/components/progress/DateRangeFilter";
import { MetricChart } from "@/components/progress/MetricChart";
import { ScoreChart } from "@/components/dashboard/ScoreChart";
import { format, subDays } from "date-fns";

function makeDays(n: number, baseValue: number, variance: number) {
  return Array.from({ length: n }, (_, i) => {
    const date = subDays(new Date(), n - 1 - i);
    return {
      label: format(date, "MMM d"),
      date: date.toISOString().split("T")[0],
      value: Math.max(0, Math.round(baseValue + (Math.random() - 0.4) * variance)),
    };
  });
}

const ALL_DATA = {
  score: makeDays(30, 72, 20).map((d) => ({ date: d.date, score: d.value })),
  wpm: makeDays(30, 145, 25),
  fillers: makeDays(30, 4.2, 3),
  clarity: makeDays(30, 7.0, 2),
  tone: makeDays(30, 7.8, 1.5),
  structure: makeDays(30, 6.5, 2),
};

function filterData<T extends { date?: string; label?: string }>(data: T[], range: DateRange): T[] {
  if (range === "all") return data;
  const cutoff = subDays(new Date(), range === "7d" ? 7 : 30);
  return data.filter((d: any) => new Date(d.date || d.label) >= cutoff);
}

export default function ProgressPage() {
  const [range, setRange] = useState<DateRange>("30d");

  const scoreData = filterData(ALL_DATA.score, range);
  const wpmData = filterData(ALL_DATA.wpm, range);
  const fillersData = filterData(ALL_DATA.fillers, range);
  const clarityData = filterData(ALL_DATA.clarity, range);
  const toneData = filterData(ALL_DATA.tone, range);
  const structureData = filterData(ALL_DATA.structure, range);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Progress</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track how each metric evolves over time
          </p>
        </div>
        <DateRangeFilter value={range} onChange={setRange} />
      </div>

      {/* SpeakUp Score — main chart */}
      <div className="grid gap-5">
        <ScoreChart data={scoreData} />
      </div>

      {/* Individual metric charts */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-200">Metric Trends</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricChart
            title="Speaking Pace (WPM)"
            data={wpmData}
            unit="wpm"
            color="#7C3AED"
            domain={[80, 220]}
          />
          <MetricChart
            title="Filler Word Rate"
            data={fillersData}
            unit="/min"
            color="#F59E0B"
            domain={[0, 12]}
          />
          <MetricChart
            title="Clarity Score"
            data={clarityData}
            unit="/10"
            color="#22D3EE"
            domain={[0, 10]}
          />
          <MetricChart
            title="Vocal Tone"
            data={toneData}
            unit="/10"
            color="#10B981"
            domain={[0, 10]}
          />
          <MetricChart
            title="Talk Structure"
            data={structureData}
            unit="/10"
            color="#8B5CF6"
            domain={[0, 10]}
          />
        </div>
      </div>
    </div>
  );
}
