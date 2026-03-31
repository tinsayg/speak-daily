"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, FileVideo, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface DropZoneProps {
  onFile: (file: File) => void;
  file: File | null;
  onClear: () => void;
}

const MAX_SIZE = 200 * 1024 * 1024; // 200MB
const ACCEPTED = { "video/mp4": [".mp4"], "video/quicktime": [".mov"], "video/webm": [".webm"] };

function formatBytes(bytes: number) {
  return bytes > 1_000_000 ? `${(bytes / 1_000_000).toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export function DropZone({ onFile, file, onClear }: DropZoneProps) {
  const [rejected, setRejected] = useState<string | null>(null);

  const onDrop = useCallback(
    (accepted: File[], rejected: any[]) => {
      setRejected(null);
      if (rejected.length > 0) {
        const err = rejected[0].errors[0];
        if (err.code === "file-too-large") setRejected("File must be under 200MB.");
        else if (err.code === "file-invalid-type") setRejected("Only MP4, MOV, and WebM files are supported.");
        else setRejected("Invalid file.");
        return;
      }
      if (accepted[0]) onFile(accepted[0]);
    },
    [onFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED,
    maxSize: MAX_SIZE,
    maxFiles: 1,
    disabled: !!file,
  });

  if (file) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center justify-between rounded-2xl border border-success/30 bg-success/5 px-5 py-4"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10">
            <FileVideo className="h-5 w-5 text-success" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200 truncate max-w-[240px]">{file.name}</p>
            <p className="text-xs text-slate-500">{formatBytes(file.size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-white/5 hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        {...getRootProps()}
        className={cn(
          "group flex cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed px-6 py-14 text-center transition-all duration-200",
          isDragActive
            ? "border-primary/70 bg-primary/10 scale-[1.01]"
            : "border-white/10 hover:border-primary/40 hover:bg-white/3"
        )}
      >
        <input {...getInputProps()} />
        <div
          className={cn(
            "flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-colors",
            isDragActive && "border-primary/40 bg-primary/10"
          )}
        >
          <Upload className={cn("h-7 w-7", isDragActive ? "text-primary-light" : "text-slate-400")} />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-200">
            {isDragActive ? "Drop your video here" : "Drag & drop your video"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            or <span className="text-primary-light">click to browse</span>
          </p>
        </div>
        <p className="text-xs text-slate-600">MP4, MOV, WebM · Max 200MB · 1–2 minutes recommended</p>
      </div>
      <AnimatePresence>
        {rejected && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-xs text-red-400"
          >
            {rejected}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
