import { useState, type FormEvent } from "react";
import StatusBadge from "../components/StatusBadge";
import { mockTrackResult } from "../data/mockData";
import { IconCheck } from "../components/icons";
import { Reveal } from "../components/Reveal";

export default function Track() {
  const [complaintId, setComplaintId] = useState("");
  const [showResult, setShowResult] = useState(false);

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    if (complaintId.trim()) setShowResult(true);
  }

  return (
    <section className="bg-paper py-14 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-950 bg-card px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Track Status
          </span>
          <h1 className="mt-5 text-balance font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Check on your complaint
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
            Enter the complaint ID you received on submission (e.g. CMP-1042).
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <form
            onSubmit={handleSearch}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              placeholder="CMP-1042"
              className="w-full rounded-lg border-2 border-ink-950/25 bg-card px-4 py-3.5 font-mono text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d]"
            >
              Track
            </button>
          </form>
        </Reveal>

        {showResult && (
          <Reveal delay={0.05}>
            <div className="mx-auto mt-10 max-w-2xl rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[6px_6px_0_0_#14110d] sm:p-8">
              <p className="font-mono text-xs font-medium text-ink-400">Showing mock result for demo purposes</p>

              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs text-ink-400">{mockTrackResult.id}</p>
                  <h2 className="mt-1 font-display text-lg font-bold text-ink-950">{mockTrackResult.title}</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    {mockTrackResult.category} · Submitted {mockTrackResult.submittedAt}
                  </p>
                </div>
                <StatusBadge status={mockTrackResult.currentStatus} />
              </div>

              <div className="mt-8">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-950">
                  Status timeline
                </h3>
                <ol className="mt-5 space-y-6">
                  {mockTrackResult.timeline.map((t, i) => (
                    <li key={t.status} className="relative flex gap-4 pl-1">
                      {i < mockTrackResult.timeline.length - 1 && (
                        <span
                          className={`absolute left-[15px] top-8 h-[calc(100%-8px)] w-0.5 ${
                            t.done ? "bg-brand-500" : "bg-ink-950/15"
                          }`}
                        />
                      )}
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink-950 ${
                          t.done ? "bg-brand-500 text-ink-950" : "bg-paper-alt text-ink-400"
                        }`}
                      >
                        {t.done ? <IconCheck /> : <span className="h-2 w-2 rounded-full bg-current" />}
                      </span>
                      <div>
                        <p className={`text-sm font-bold ${t.done ? "text-ink-950" : "text-ink-400"}`}>
                          {t.status}
                        </p>
                        <p className="font-mono text-xs text-ink-400">{t.date}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
