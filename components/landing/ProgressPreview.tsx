"use client";

import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flame, TrendingUp } from "lucide-react";

const mockData = [
  { day: "W1", score: 54 },
  { day: "W2", score: 61 },
  { day: "W3", score: 58 },
  { day: "W4", score: 67 },
  { day: "W5", score: 72 },
  { day: "W6", score: 69 },
  { day: "W7", score: 78 },
  { day: "W8", score: 83 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-card px-3 py-2 shadow-xl">
        <p className="text-xs text-slate-400">{label}</p>
        <p className="text-base font-bold text-primary-light">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export function ProgressPreview() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-sm font-medium uppercase tracking-widest text-primary-light">
              Progress Tracking
            </p>
            <h2 className="mb-5 text-3xl font-bold sm:text-4xl">
              Watch your score{" "}
              <span className="text-gradient-primary">climb week by week</span>
            </h2>
            <p className="mb-8 text-slate-400 leading-relaxed">
              Every session updates your charts. See your SpeakUp Score trend,
              identify which metrics are improving fastest, and stay on streak.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <TrendingUp className="h-4 w-4 text-primary-light" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Per-metric trend charts</p>
                  <p className="text-sm text-slate-500">Track all 5 metrics individually over 7d, 30d, or all time</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-warning/10">
                  <Flame className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">Daily streak system</p>
                  <p className="text-sm text-slate-500">GitHub-style calendar + milestones at 7, 14, 30 days</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: chart mockup */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative rounded-2xl border border-white/7 bg-card p-6 glow-primary"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">SpeakUp Score</p>
                <p className="text-2xl font-bold text-primary-light">+29 pts</p>
              </div>
              <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-emerald-400 border border-success/20">
                ↑ 53% improvement
              </span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[40, 100]} tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="url(#scoreGrad)"
                  strokeWidth={2.5}
                  dot={{ fill: "#7C3AED", strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: "#22D3EE", r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
