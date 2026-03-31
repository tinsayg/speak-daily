"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { signup } from "@/lib/auth";

const perks = [
  "Daily score tracking across 5 metrics",
  "Full transcript with filler word highlights",
  "Streak calendar & weekly summaries",
];

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    try {
      await signup(displayName, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-bg px-4 py-12">
      <div className="pointer-events-none fixed inset-0 bg-hero-glow opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block mb-6">
            <Logo />
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">Create your account</h1>
          <p className="mt-1 text-sm text-slate-400">
            Free to start — no credit card needed
          </p>
        </div>

        {/* Perks */}
        <div className="mb-6 flex flex-col gap-2">
          {perks.map((perk) => (
            <div key={perk} className="flex items-center gap-2 text-sm text-slate-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
              {perk}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/7 bg-card p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              id="name"
              label="Display Name"
              type="text"
              placeholder="Alex Johnson"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              autoComplete="name"
            />
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              hint="Minimum 8 characters"
              autoComplete="new-password"
            />

            {error && (
              <p className="rounded-lg bg-danger/10 border border-danger/20 px-4 py-2.5 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" loading={loading} size="lg" className="mt-1 w-full gap-2">
              Create Account
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-light hover:underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
