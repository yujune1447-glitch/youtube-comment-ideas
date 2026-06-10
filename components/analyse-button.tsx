"use client";

import { useState } from "react";

type Theme = {
  rank: number;
  title: string;
  description: string;
  count: number;
};

export function AnalyseButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setStatus("loading");
    setError(null);
    const res = await fetch("/api/analyse");
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Unknown error");
      return;
    }
    setThemes(data.themes);
    setCommentCount(data.commentCount);
    setStatus("done");
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Idle ── */}
      {status === "idle" && (
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="w-10 h-10 rounded-full bg-[#EEF2FF] flex items-center justify-center">
            <svg className="w-5 h-5 text-[#6366F1]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Ready to analyse</p>
            <p className="text-xs text-[#64748B] mt-0.5">We'll scan your recent comments and cluster them into 10 content ideas</p>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6366F1] text-white text-sm font-medium hover:bg-[#4F46E5] transition-colors"
          >
            Analyse my channel
          </button>
        </div>
      )}

      {/* ── Loading ── */}
{status === "loading" && (
  <div className="flex flex-col gap-4 py-4">
    <div className="flex items-center gap-2 text-sm text-[#64748B]">
      <svg className="w-4 h-4 animate-spin text-[#6366F1]" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      Analysing comments… this takes ~15s
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-2 p-4 rounded-xl bg-white border border-[#E2E8F0]">
          <div className="h-3 w-3/4 bg-[#E2E8F0] rounded-full animate-pulse" />
          <div className="h-2.5 w-full bg-[#F1F5F9] rounded-full animate-pulse" />
          <div className="h-2.5 w-2/3 bg-[#F1F5F9] rounded-full animate-pulse" />
          <div className="h-2 w-1/4 bg-[#F1F5F9] rounded-full animate-pulse mt-2" />
        </div>
      ))}
    </div>
  </div>
)}

      {/* ── Error ── */}
      {status === "error" && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <svg className="w-4 h-4 mt-0.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm-1 13a1 1 0 102 0v-4a1 1 0 10-2 0v4zm1-8a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* ── Results ── */}
      {status === "done" && (
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-sm text-[#64748B]">
            <span>Analysed</span>
            <span className="font-semibold text-[#0F172A]">{commentCount.toLocaleString()}</span>
            <span>comments across your recent videos</span>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold tracking-tight">Top 10 Content Ideas</h2>
            <span className="text-xs text-[#64748B]">{themes.length} ideas</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((theme) => (
              <div
                key={theme.rank}
                className="relative flex flex-col gap-2 p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#6366F1]/40 hover:shadow-sm transition-all"
              >
                <span className="absolute top-3 right-3 text-xs font-medium text-[#6366F1] bg-[#EEF2FF] px-2 py-0.5 rounded-full">
                  #{theme.rank}
                </span>
                <p className="text-sm font-semibold text-[#0F172A] pr-8 leading-snug">{theme.title}</p>
                <p className="text-xs text-[#64748B] leading-relaxed">{theme.description}</p>
                <div className="mt-auto pt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-[#94A3B8]">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
                    </svg>
                    ~{theme.count} comments
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}