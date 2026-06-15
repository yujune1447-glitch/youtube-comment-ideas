import { ConnectButton } from "@/components/connect-button";
import { auth } from "@/auth";
import { AnalyseButton } from "@/components/analyse-button";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-sky-100 text-[#0F172A] font-sans">

   

      {/* ── Header ── */}
      <header className="fixed top-0 inset-x-0 z-10 border-b border-sky-200/50 bg-white/30 backdrop-blur-md">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-sky-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-sm font-bold tracking-tight text-sky-900">IdeaSift</span>
          </div>

          {session ? (
  <div className="flex items-center gap-3">
    <a href="/history" className="text-xs font-medium text-sky-600 hover:text-sky-800">
      History
    </a>
    <span className="text-xs text-sky-600/70 hidden sm:block">{session.user?.email}</span>
    <div className="w-7 h-7 rounded-full bg-sky-200/60 border border-sky-300/50 backdrop-blur flex items-center justify-center text-sky-700 text-xs font-bold select-none">
      {session.user?.email?.[0]?.toUpperCase() ?? "?"}
    </div>
  </div>
          ) : (
            <span className="text-xs text-sky-500/60">Not signed in</span>
          )}
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="max-w-2xl mx-auto px-6 pt-16 pb-16 min-h-screen flex flex-col justify-center">
        {session ? (
          <>
            <div className="mb-2 text-center relative z-10">
              <h1 className="text-5xl font-black tracking-tight mb-2 text-sky-950">
                Comment → Content Ideas
              </h1>
              <p className="text-base text-sky-700">
                What your viewers are asking for, distilled into 10 ideas.
              </p>
            </div>
            <AnalyseButton />
          </>
        ) : (
          <div className="flex flex-col items-center text-center gap-8">
            <div className="w-16 h-16 rounded-2xl bg-white/40 border border-sky-200/60 backdrop-blur-md flex items-center justify-center shadow-lg shadow-sky-100">
              <svg className="w-8 h-8 text-sky-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div className="flex flex-col gap-3">
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-b from-sky-900 to-sky-400 bg-clip-text text-transparent">
                Turn comments<br />into content
              </h1>
              <p className="text-base text-sky-700 max-w-xs mx-auto leading-relaxed">
                Connect your YouTube channel and we'll surface the 10 ideas your audience actually wants to see.
              </p>
            </div>
            <ConnectButton />
            <div className="flex items-center gap-4 text-xs text-sky-400/60">
              <span>Read-only access</span>
              <span className="w-1 h-1 rounded-full bg-sky-300" />
              <span>No data stored</span>
              <span className="w-1 h-1 rounded-full bg-sky-300" />
              <span>Free to use</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}