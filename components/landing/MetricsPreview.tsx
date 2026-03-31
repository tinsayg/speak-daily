"use client";

import { motion } from "framer-motion";
import { Gauge, MessageSquareX, BookOpen, Heart, AlignLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const metrics = [
  {
    icon: Gauge,
    label: "Speaking Pace",
    unit: "WPM",
    value: "143",
    benchmark: "120–180",
    status: "good",
    description: "Words per minute — too slow bores, too fast loses people.",
  },
  {
    icon: MessageSquareX,
    label: "Filler Word Rate",
    unit: "/min",
    value: "3.2",
    benchmark: "< 5",
    status: "good",
    description: "Counts um, uh, like, you know, basically per minute.",
  },
  {
    icon: BookOpen,
    label: "Clarity Score",
    unit: "/10",
    value: "7.4",
    benchmark: "≥ 5",
    status: "good",
    description: "Readability index based on sentence length and vocabulary variety.",
  },
  {
    icon: Heart,
    label: "Vocal Tone",
    unit: "",
    value: "Confident",
    benchmark: "Positive",
    status: "good",
    description: "Sentiment polarity from your transcript — hesitant vs confident.",
  },
  {
    icon: AlignLeft,
    label: "Talk Structure",
    unit: "",
    value: "Complete",
    benchmark: "Intro + Close",
    status: "good",
    description: "Detects whether your talk has a clear opening, body, and closing.",
  },
];

const statusConfig = {
  good: { label: "On Track", variant: "success" as const },
  warn: { label: "Flagged", variant: "warning" as const },
  bad: { label: "Needs Work", variant: "danger" as const },
};

export function MetricsPreview() {
  return (
    <section className="px-6 py-24 bg-surface/50">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-widest text-primary-light"
          >
            5 Core Metrics
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold sm:text-4xl"
          >
            Objective feedback, zero guesswork
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="mt-4 text-slate-400"
          >
            Every session scores you on these five dimensions — automatically, from audio alone.
          </motion.p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {metrics.map(({ icon: Icon, label, unit, value, benchmark, status, description }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-2xl border border-white/7 bg-card p-5 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
            >
              {/* Subtle top glow on hover */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Icon className="h-5 w-5 text-primary-light" />
              </div>

              <p className="mb-1 text-xs font-medium text-slate-500">{label}</p>
              <div className="mb-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-slate-100">{value}</span>
                {unit && <span className="text-sm text-slate-500">{unit}</span>}
              </div>

              <Badge variant={statusConfig[status as keyof typeof statusConfig].variant} className="mb-3">
                {statusConfig[status as keyof typeof statusConfig].label}
              </Badge>

              <p className="text-xs leading-relaxed text-slate-500">{description}</p>

              <div className="mt-3 flex items-center gap-1 text-xs text-slate-600">
                <span>Target:</span>
                <span className="text-slate-400">{benchmark}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
