"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface TranscriptViewerProps {
  transcript: string;
  fillerWords: string[];
}

function highlightFillers(text: string, fillers: string[]) {
  if (!fillers.length) return [{ text, isFillerWord: false }];
  const pattern = new RegExp(`\\b(${fillers.join("|")})\\b`, "gi");
  const parts: { text: string; isFillerWord: boolean }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, match.index), isFillerWord: false });
    }
    parts.push({ text: match[0], isFillerWord: true });
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex), isFillerWord: false });
  }
  return parts;
}

export function TranscriptViewer({ transcript, fillerWords }: TranscriptViewerProps) {
  const [expanded, setExpanded] = useState(false);
  const parts = highlightFillers(transcript, fillerWords);

  const fillerCount = parts.filter((p) => p.isFillerWord).length;
  const preview = transcript.slice(0, 280);
  const displayText = expanded ? transcript : preview + (transcript.length > 280 ? "..." : "");
  const displayParts = expanded ? parts : highlightFillers(displayText, fillerWords);

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/7 bg-card p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-200">Full Transcript</h3>
        <div className="flex items-center gap-2">
          {fillerCount > 0 && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary-light border border-primary/20">
              {fillerCount} filler {fillerCount === 1 ? "word" : "words"}
            </span>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <span className="inline-block rounded bg-primary/20 px-1.5 py-0.5 text-primary-light font-medium">
          like this
        </span>
        <span>= filler word</span>
      </div>

      {/* Transcript text */}
      <div className="leading-relaxed text-sm text-slate-300">
        {displayParts.map((part, i) =>
          part.isFillerWord ? (
            <mark
              key={i}
              className="rounded bg-primary/20 px-1 py-0.5 text-primary-light font-medium not-italic"
            >
              {part.text}
            </mark>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </div>

      {transcript.length > 280 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" /> Show less
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" /> Read full transcript
            </>
          )}
        </button>
      )}
    </div>
  );
}
