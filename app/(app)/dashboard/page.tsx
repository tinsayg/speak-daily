import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StreakCard } from "@/components/dashboard/StreakCard";
import { ScoreChart } from "@/components/dashboard/ScoreChart";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { WeeklySummaryCard } from "@/components/dashboard/WeeklySummaryCard";
import { Upload, ArrowRight } from "lucide-react";

// Mock data — will come from API when connected
const MOCK_SCORE_DATA = [
  { date: "2026-03-01", score: 54 },
  { date: "2026-03-03", score: 61 },
  { date: "2026-03-05", score: 58 },
  { date: "2026-03-07", score: 67 },
  { date: "2026-03-10", score: 72 },
  { date: "2026-03-13", score: 69 },
  { date: "2026-03-17", score: 78 },
  { date: "2026-03-20", score: 83 },
  { date: "2026-03-24", score: 81 },
  { date: "2026-03-27", score: 86 },
];

const MOCK_HISTORY = [
  "2026-03-01","2026-03-03","2026-03-05","2026-03-07","2026-03-10",
  "2026-03-13","2026-03-17","2026-03-20","2026-03-24","2026-03-27",
];

const MOCK_STATS = [
  { label: "Sessions This Week", value: "4", change: 1 },
  { label: "Avg SpeakUp Score", value: "84", unit: "pts", change: 5 },
  { label: "Avg Filler Rate", value: "2.8", unit: "/min", change: -1 },
  { label: "Avg WPM", value: "147", unit: "wpm", change: 3 },
];

export default function DashboardPage() {
  const uploadedToday = false; // will come from API

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-400">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <Link href="/upload">
          <Button className="gap-2">
            <Upload className="h-4 w-4" />
            Upload Today&apos;s Video
          </Button>
        </Link>
      </div>

      {/* Upload CTA banner if not uploaded today */}
      {!uploadedToday && (
        <div className="flex items-center justify-between rounded-2xl border border-primary/20 bg-primary/5 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15">
              <Upload className="h-5 w-5 text-primary-light" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">You haven&apos;t uploaded today</p>
              <p className="text-xs text-slate-500">Keep your streak alive — upload your daily video now</p>
            </div>
          </div>
          <Link href="/upload">
            <Button size="sm" className="gap-1.5 shrink-0">
              Upload Now <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}

      {/* Weekly summary */}
      <WeeklySummaryCard
        avgScore={79}
        mostImproved="Filler Words"
        topFlag="Talk Structure"
        streakStatus={4}
        weekStart="Mar 24"
      />

      {/* Main grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <QuickStats stats={MOCK_STATS} />
      </div>

      {/* Charts row */}
      <div className="grid gap-5 lg:grid-cols-3">
        <ScoreChart data={MOCK_SCORE_DATA} />
        <StreakCard streak={10} longestStreak={14} history={MOCK_HISTORY} />
      </div>

      {/* Recent sessions */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-200">Recent Sessions</h2>
          <Link href="/progress" className="text-sm text-primary-light hover:underline">
            View all →
          </Link>
        </div>
        <div className="flex flex-col gap-3">
          {MOCK_SCORE_DATA.slice(-4).reverse().map((s) => (
            <Link
              key={s.date}
              href={`/session/mock-${s.date}`}
              className="flex items-center justify-between rounded-xl border border-white/7 bg-card px-5 py-3.5 transition-colors hover:border-primary/20 hover:bg-primary/5"
            >
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
                <p className="text-xs text-slate-500">Casual Conversation · 1m 23s</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold text-primary-light">{s.score}</span>
                <ArrowRight className="h-4 w-4 text-slate-600" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
