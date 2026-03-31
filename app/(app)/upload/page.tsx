"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropZone } from "@/components/upload/DropZone";
import { ContextSelector, SpeakingContext } from "@/components/upload/ContextSelector";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, CheckCircle2 } from "lucide-react";

type UploadState = "idle" | "uploading" | "analyzing" | "done";

const ANALYSIS_STEPS = [
  "Extracting audio from video...",
  "Transcribing with Whisper...",
  "Calculating speaking pace...",
  "Detecting filler words...",
  "Scoring clarity & structure...",
  "Generating SpeakUp Score...",
];

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [context, setContext] = useState<SpeakingContext | null>(null);
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !context) return;

    setState("uploading");
    setProgress(10);

    // Simulate upload progress
    await new Promise((r) => setTimeout(r, 800));
    setProgress(30);
    setState("analyzing");

    // Simulate analysis steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setStepIdx(i);
      setProgress(30 + Math.round((i + 1) * (70 / ANALYSIS_STEPS.length)));
      await new Promise((r) => setTimeout(r, 900));
    }

    setState("done");
    setProgress(100);
    await new Promise((r) => setTimeout(r, 1200));
    router.push("/session/latest");
  }

  const canSubmit = !!file && !!context && state === "idle";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-100">Upload Today&apos;s Video</h1>
        <p className="mt-1 text-sm text-slate-400">
          Record a 1–2 minute video then upload it for analysis.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {state === "idle" && (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="flex flex-col gap-8"
          >
            {/* Drop zone */}
            <section>
              <p className="mb-3 text-sm font-medium text-slate-300">1. Select Your Video</p>
              <DropZone
                file={file}
                onFile={setFile}
                onClear={() => setFile(null)}
              />
            </section>

            {/* Context selector */}
            <section>
              <p className="mb-3 text-sm font-medium text-slate-300">2. Speaking Context</p>
              <ContextSelector value={context} onChange={setContext} />
            </section>

            {/* Optional topic */}
            <section>
              <p className="mb-3 text-sm font-medium text-slate-300">
                3. Topic <span className="text-slate-600 font-normal">(optional)</span>
              </p>
              <Input
                placeholder="e.g. Introducing myself at a networking event"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={200}
              />
            </section>

            <Button type="submit" size="lg" disabled={!canSubmit} className="w-full">
              Analyze My Speaking
            </Button>
          </motion.form>
        )}

        {(state === "uploading" || state === "analyzing" || state === "done") && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-8 rounded-2xl border border-white/7 bg-card px-8 py-14 text-center"
          >
            {state === "done" ? (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex h-20 w-20 items-center justify-center rounded-full bg-success/15"
              >
                <CheckCircle2 className="h-10 w-10 text-success" />
              </motion.div>
            ) : (
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
                  <Cpu className="h-8 w-8 text-primary-light animate-pulse" />
                </div>
              </div>
            )}

            <div>
              <p className="text-lg font-semibold text-slate-100">
                {state === "done" ? "Analysis Complete!" : "Analyzing your video..."}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {state === "done"
                  ? "Redirecting to your session report"
                  : ANALYSIS_STEPS[stepIdx]}
              </p>
            </div>

            <div className="w-full max-w-sm">
              <Progress value={progress} color="primary" className="h-2" />
              <p className="mt-2 text-xs text-slate-600">{progress}%</p>
            </div>

            {state !== "done" && (
              <p className="text-xs text-slate-600">This typically takes 30–90 seconds</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
