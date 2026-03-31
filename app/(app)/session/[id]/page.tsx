import Link from "next/link";
import { ScoreDisplay } from "@/components/session/ScoreDisplay";
import { MetricCard } from "@/components/session/MetricCard";
import { TranscriptViewer } from "@/components/session/TranscriptViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart2, Upload } from "lucide-react";
import { Gauge, MessageSquareX, BookOpen, Heart, AlignLeft } from "lucide-react";

// Mock session — replace with API fetch by ID
const MOCK_SESSION = {
  id: "mock-session",
  score: 82,
  context: "interview",
  date: "Mar 27, 2026",
  duration: "1m 34s",
  topic: "Introducing myself at a networking event",
  metrics: [
    {
      key: "pace",
      icon: Gauge,
      label: "Speaking Pace",
      value: "147",
      unit: "WPM",
      score: 8.2,
      benchmark: "120–180 WPM",
      flag: null,
    },
    {
      key: "fillers",
      icon: MessageSquareX,
      label: "Filler Words",
      value: "4.1",
      unit: "/min",
      score: 6.8,
      benchmark: "< 5/min",
      flag: null,
    },
    {
      key: "clarity",
      icon: BookOpen,
      label: "Clarity Score",
      value: "6.9",
      unit: "/10",
      score: 6.9,
      benchmark: "≥ 5/10",
      flag: null,
    },
    {
      key: "tone",
      icon: Heart,
      label: "Vocal Tone",
      value: "Confident",
      score: 8.5,
      benchmark: "Positive",
      flag: null,
    },
    {
      key: "structure",
      icon: AlignLeft,
      label: "Talk Structure",
      value: "Partial",
      score: 5.0,
      benchmark: "Intro + Close",
      flag: "No clear closing detected",
    },
  ],
  transcript: `Hey, so, um, I'm Alex. I've been working in product design for about five years now, mostly in, like, early-stage startups where you kind of wear a lot of hats. Um, my last role was at a fintech company where I led the redesign of their onboarding flow — we basically cut drop-off by 40%. I love building things that, you know, feel intuitive right out of the box. I'm here tonight because I'm exploring new opportunities, and I'd love to connect with folks working on interesting problems. Happy to chat more about any of that.`,
  fillerWords: ["um", "uh", "like", "you know", "basically", "so"],
};

export default function SessionPage({ params }: { params: { id: string } }) {
  const session = MOCK_SESSION;

  return (
    <div className="mx-auto max-w-4xl flex flex-col gap-8">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href="/progress">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <BarChart2 className="h-4 w-4" />
              Progress
            </Button>
          </Link>
          <Link href="/upload">
            <Button size="sm" className="gap-1.5">
              <Upload className="h-4 w-4" />
              New Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Page title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Session Report</h1>
        {session.topic && (
          <p className="mt-1 text-sm text-slate-400">Topic: {session.topic}</p>
        )}
      </div>

      {/* Score display */}
      <ScoreDisplay
        score={session.score}
        context={session.context}
        date={session.date}
        duration={session.duration}
      />

      {/* Metric cards */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-200">Metric Breakdown</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {session.metrics.map((m) => (
            <MetricCard
              key={m.key}
              icon={m.icon}
              label={m.label}
              value={m.value}
              unit={m.unit}
              score={m.score}
              benchmark={m.benchmark}
              flag={m.flag}
            />
          ))}
        </div>
      </div>

      {/* Transcript */}
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-200">Transcript</h2>
        <TranscriptViewer
          transcript={session.transcript}
          fillerWords={session.fillerWords}
        />
      </div>
    </div>
  );
}
