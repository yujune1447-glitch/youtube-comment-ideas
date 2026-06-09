"use client";

import { useState } from "react";

export function AnalyseButton() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [count, setCount] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setStatus("loading");
    setError(null);
    const res = await fetch("/api/comments");
    const data = await res.json();
    if (!res.ok) {
      setStatus("error");
      setError(data.error ?? "Unknown error");
      return;
    }
    setCount(data.count);
    setStatus("done");
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={status === "loading"}>
        {status === "loading" ? "Fetching comments…" : "Analyse my channel"}
      </button>
      {status === "done" && <p>Fetched {count} comments ✓</p>}
      {status === "error" && <p>Error: {error}</p>}
    </div>
  );
}
