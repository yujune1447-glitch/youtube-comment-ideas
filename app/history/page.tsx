"use client";

import { useEffect, useState } from "react";

type Theme = {
  rank: number;
  title: string;
  description: string;
  count: number;
};

type Analysis = {
  id: number;
  created_at: string;
  comment_count: number;
  themes: Theme[];
};

export default function HistoryPage() {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      const res = await fetch("/api/history");
      const data = await res.json();
      setAnalyses(data.analyses ?? []);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  if (loading) return <p className="p-8 text-sky-700">Loading history...</p>;
  if (analyses.length === 0) return <p className="p-8 text-sky-700">No analyses yet.</p>;

  return (
    <main className="max-w-2xl mx-auto px-6 pt-20 pb-16">
      <h1 className="text-3xl font-black text-sky-950 mb-8">Your History</h1>
      <div className="flex flex-col gap-8">
        {analyses.map((analysis) => (
          <div key={analysis.id} className="bg-white rounded-2xl border border-sky-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-slate-500">
                {new Date(analysis.created_at).toLocaleDateString()}
              </span>
              <span className="text-sm font-medium text-slate-500">
                {analysis.comment_count} comments
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {analysis.themes.map((theme) => (
                <div key={theme.rank} className="p-3 rounded-xl bg-sky-50 border border-sky-100">
                  <p className="text-sm font-bold text-slate-900">#{theme.rank} {theme.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}