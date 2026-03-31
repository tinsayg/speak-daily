"use client";

import { motion } from "framer-motion";
import { Upload, Cpu, TrendingUp } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Upload,
    title: "Upload Your Video",
    description:
      "Record a 1–2 minute video on any topic — a pitch, interview answer, presentation, or casual talk. Upload it once a day.",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(124,58,237,0.2)",
  },
  {
    step: "02",
    icon: Cpu,
    title: "We Analyze It",
    description:
      "Our engine transcribes your audio and scores you on 5 core metrics: pace, filler words, clarity, vocal tone, and talk structure.",
    color: "from-cyan-400 to-blue-500",
    glow: "rgba(34,211,238,0.15)",
  },
  {
    step: "03",
    icon: TrendingUp,
    title: "Track Your Growth",
    description:
      "See your SpeakUp Score trend over time. Watch filler words drop, pace improve, and confidence grow — session by session.",
    color: "from-emerald-400 to-teal-500",
    glow: "rgba(16,185,129,0.15)",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-3 text-sm font-medium uppercase tracking-widest text-primary-light"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold sm:text-4xl"
          >
            Three steps to a better speaker
          </motion.h2>
        </div>

        {/* Steps */}
        <div className="relative grid gap-8 md:grid-cols-3">
          {/* Connector line */}
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-white/10 to-transparent md:block" />

          {steps.map(({ step, icon: Icon, title, description, color, glow }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Icon circle */}
              <div
                className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl"
                style={{
                  background: `linear-gradient(135deg, ${glow.replace("0.2", "0.15")}, transparent)`,
                  boxShadow: `0 0 40px ${glow}`,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${color} opacity-20`} />
                <Icon className="relative z-10 h-8 w-8 text-white" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-surface text-xs font-bold text-slate-400 ring-1 ring-white/10">
                  {step}
                </span>
              </div>

              <h3 className="mb-3 text-xl font-semibold text-slate-100">{title}</h3>
              <p className="text-sm leading-relaxed text-slate-400">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
