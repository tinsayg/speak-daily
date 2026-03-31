"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface ScoreChartProps {
  data: { date: string; score: number }[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-card px-3 py-2 shadow-xl text-sm">
        <p className="text-slate-400">{label}</p>
        <p className="font-bold text-primary-light text-base">{payload[0].value} pts</p>
      </div>
    );
  }
  return null;
};

export function ScoreChart({ data }: ScoreChartProps) {
  const formatted = data.map((d) => ({
    ...d,
    label: format(new Date(d.date), "MMM d"),
  }));

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>SpeakUp Score Trend</CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={formatted} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
          <defs>
            <linearGradient id="dashScoreGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis domain={[0, 100]} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="score"
            stroke="url(#dashScoreGrad)"
            strokeWidth={2.5}
            dot={{ fill: "#7C3AED", r: 3, strokeWidth: 0 }}
            activeDot={{ fill: "#22D3EE", r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
