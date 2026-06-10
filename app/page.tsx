import { ConnectButton } from "@/components/connect-button";
import { auth } from "@/auth";
import { AnalyseButton } from "@/components/analyse-button";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] font-sans">

      {/* ── Header ── */}
      <header className="fixed top-0 inset-x-0 z-10 bg-[#FAFAFA]/90 backdrop-blur-sm border-b border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-[#FF0000] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <span className="text-sm font-semibold tracking-tight">IdeaSift</span>
          </div>

          {session ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-[#64748B] hidden sm:block">{session.user?.email}</span>
              <div className="w-7 h-7 rounded-full bg-[#6366F1] flex items-center justify-center text-white text-xs font-medium select-none">
                {session.user?.email?.[0]?.toUpperCase() ?? "?"}
              </div>
            </div>
          ) : (
            <span className="text-xs text-[#64748B]">Not signed in</span>
          )}
        </div>
      </header>

      {/* ── Page body ── */}
      <main className="max-w-xl mx-auto px-6 pt-28 pb-16">
        {session ? (
          <>
            <div className="mb-10">
              <h1 className="text-2xl font-semibold tracking-tight mb-1">Comment → Content Ideas</h1>
              <p className="text-sm text-[#64748B]">What your viewers are asking for, distilled into 10 ideas.</p>
            </div>
            <AnalyseButton />
          </>
        ) : (
          /* ── Sign-in hero ── */
          <div className="mt-24 flex flex-col items-center text-center gap-8">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] flex items-center justify-center">
              <svg className="w-6 h-6 text-[#6366F1]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 2H4a2 2 0 00-2 2v18l4-4h14a2 2 0 002-2V4a2 2 0 00-2-2z" />
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight">Turn comments into content</h1>
              <p className="text-sm text-[#64748B] max-w-xs mx-auto leading-relaxed">
                Connect your YouTube channel and we'll surface the 10 ideas your audience actually wants to see.
              </p>
            </div>
            <ConnectButton />
            <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
              <span>Read-only access</span>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              <span>No data stored</span>
              <span className="w-1 h-1 rounded-full bg-[#CBD5E1]" />
              <span>Free to use</span>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}