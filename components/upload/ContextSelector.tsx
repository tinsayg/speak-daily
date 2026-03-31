"use client";

import { cn } from "@/lib/utils";
import { Users, Briefcase, Presentation, Megaphone } from "lucide-react";

export type SpeakingContext = "casual" | "interview" | "presentation" | "pitch";

const contexts: { id: SpeakingContext; label: string; icon: React.ElementType; description: string }[] = [
  {
    id: "casual",
    label: "Casual Conversation",
    icon: Users,
    description: "Natural flow, coherence, filler reduction",
  },
  {
    id: "interview",
    label: "Job Interview",
    icon: Briefcase,
    description: "Clarity, structured answers, confident pacing",
  },
  {
    id: "presentation",
    label: "Presentation",
    icon: Presentation,
    description: "Delivery, structure, vocal variety",
  },
  {
    id: "pitch",
    label: "Pitch / Persuasion",
    icon: Megaphone,
    description: "Conciseness, conviction, logical flow",
  },
];

interface ContextSelectorProps {
  value: SpeakingContext | null;
  onChange: (ctx: SpeakingContext) => void;
}

export function ContextSelector({ value, onChange }: ContextSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {contexts.map(({ id, label, icon: Icon, description }) => {
        const selected = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex flex-col gap-2 rounded-xl border p-4 text-left transition-all duration-200",
              selected
                ? "border-primary/50 bg-primary/10 shadow-lg shadow-primary/10"
                : "border-white/7 bg-card hover:border-white/20 hover:bg-white/5"
            )}
          >
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-lg",
                selected ? "bg-primary/20" : "bg-white/5"
              )}
            >
              <Icon className={cn("h-4 w-4", selected ? "text-primary-light" : "text-slate-400")} />
            </div>
            <p className={cn("text-sm font-medium", selected ? "text-slate-100" : "text-slate-300")}>
              {label}
            </p>
            <p className="text-xs leading-relaxed text-slate-500">{description}</p>
          </button>
        );
      })}
    </div>
  );
}
