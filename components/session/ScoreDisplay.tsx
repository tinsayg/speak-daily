"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScoreDisplayProps {
  score: number;
  context: string;
  date: string;
  duration: string;
}

function getScoreColor(score: number) {
  if (score >= 80) return { stroke: "#10B981", text: "text-emerald-400", label: "Excellent" };
  if (score >= 65) return { stroke: "#7C3AED", text: "text-primary-light", label: "Good" };
  if (score >= 50) return { stroke: "#F59E0B", text: "text-amber-400", label: "Fair" };
  return { stroke: "#EF4444", text: "text-red-400", label: "Needs Work" };
}

export function ScoreDisplay({ score, context, date, duration }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const { stroke, text, label } = getScoreColor(score);

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = score / 60;
      const interval = setInterval(() => {
        current += step;
        if (current >= score) {
          setDisplayScore(score);
          clearInterval(interval);
        } else {
          setDisplayScore(Math.round(current));
        }
      }, 16);
      return () => clearInterval(interval);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-white/7 bg-card p-8 text-center">
      {/* SVG ring */}
      <div className="relative flex items-center justify-center">
        <svg width="180" height="180" className="-rotate-90">
          <circle cx="90" cy="90" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <motion.circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={stroke}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            style={{ filter: `drop-shadow(0 0 8px ${stroke}60)` }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-5xl font-bold", text)}>{displayScore}</span>
          <span className="text-sm text-slate-500">/ 100</span>
        </div>
      </div>

      <div>
        <p className={cn("text-lg font-semibold", text)}>{label}</p>
        <p className="mt-1 text-sm text-slate-500">SpeakUp Score</p>
      </div>

      {/* Meta */}
      <div className="flex gap-6 text-sm">
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500">Context</span>
          <span className="font-medium text-slate-200 capitalize">{context}</span>
        </div>
        <div className="h-full w-px bg-white/5" />
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500">Duration</span>
          <span className="font-medium text-slate-200">{duration}</span>
        </div>
        <div className="h-full w-px bg-white/5" />
        <div className="flex flex-col items-center">
          <span className="text-xs text-slate-500">Date</span>
          <span className="font-medium text-slate-200">{date}</span>
        </div>
      </div>
    </div>
  );
}
