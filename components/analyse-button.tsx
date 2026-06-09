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
    <div style={{ marginTop: "1rem" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "loading"}
        style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
      >
        {status === "loading" ? "Analysing comments… (this takes ~15s)" : "Analyse my channel"}
      </button>

      {status === "error" && (
        <p style={{ color: "red" }}>Error: {error}</p>
      )}

      {status === "done" && (
        <div style={{ marginTop: "1.5rem" }}>
          <p>Analysed <strong>{commentCount}</strong> comments across your recent videos.</p>
          <h2 style={{ marginTop: "1rem" }}>Top 10 Content Ideas</h2>
          {themes.map((theme) => (
            <div key={theme.rank} style={{ borderBottom: "1px solid #eee", padding: "0.75rem 0" }}>
              <strong>#{theme.rank} {theme.title}</strong>
              <p style={{ margin: "0.25rem 0", color: "#444" }}>{theme.description}</p>
              <small style={{ color: "#888" }}>~{theme.count} comments</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
