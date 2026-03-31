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

interface DataPoint {
  label: string;
  value: number;
}

interface MetricChartProps {
  title: string;
  data: DataPoint[];
  unit?: string;
  color?: string;
  domain?: [number, number];
}

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload?.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-card px-3 py-2 shadow-xl text-sm">
        <p className="text-slate-400">{label}</p>
        <p className="font-bold text-slate-100">
          {payload[0].value}
          {unit ? ` ${unit}` : ""}
        </p>
      </div>
    );
  }
  return null;
};

export function MetricChart({
  title,
  data,
  unit,
  color = "#7C3AED",
  domain,
}: MetricChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -28 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={domain}
            tick={{ fill: "#64748b", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip unit={unit} />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ fill: color, r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}
