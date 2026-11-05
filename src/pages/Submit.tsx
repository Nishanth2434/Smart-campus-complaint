import { useState, type FormEvent } from "react";
import { allCategories } from "../data/mockData";
import { IconCheck } from "../components/icons";
import { Reveal } from "../components/Reveal";

export default function Submit() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [anonymous, setAnonymous] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // UI-only for now — no backend wired up yet.
    setSubmitted(true);
  }

  return (
    <section className="bg-paper py-14 sm:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-950 bg-card px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Submit Complaint
          </span>
          <h1 className="mt-5 text-balance font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Tell us what's wrong — we'll route it to the right team.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
            Fill in as much detail as you can. You'll receive a tracking ID once submitted.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.6fr_1fr]">
          <Reveal delay={0.05}>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[6px_6px_0_0_#14110d] sm:p-8"
            >
              {submitted && (
                <div className="flex items-start gap-3 rounded-lg border border-status-resolved/30 bg-status-resolved-bg px-4 py-3 text-status-resolved">
                  <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  <p className="text-sm font-medium">
                    This is a UI preview — no complaint has actually been submitted yet.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="title" className="block text-sm font-bold text-ink-950">
                  Complaint title
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Projector not working — Room B-204"
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-bold text-ink-950">
                  Category
                </label>
                <select
                  id="category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {allCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-bold text-ink-950">
                  Description
                </label>
                <textarea
                  id="description"
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue, its location and any relevant detail..."
                  className="mt-2 w-full resize-none rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="photo" className="block text-sm font-bold text-ink-950">
                  Photo evidence <span className="font-normal text-ink-400">(optional)</span>
                </label>
                <label
                  htmlFor="photo"
                  className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-950/30 px-4 py-8 text-center transition-colors hover:border-brand-500 hover:bg-brand-50"
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="text-ink-400">
                    <path d="M4 8h3l1.5-2h7L17 8h3v11H4V8Z" strokeLinejoin="round" />
                    <circle cx="12" cy="13.5" r="3.2" />
                  </svg>
                  <span className="text-sm font-medium text-ink-700">
                    {fileName ?? "Click to upload a photo"}
                  </span>
                  <span className="text-xs text-ink-400">PNG or JPG, up to 10MB</span>
                  <input
                    id="photo"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                  />
                </label>
              </div>

              <div className="flex items-center justify-between rounded-lg border-2 border-ink-950/15 px-4 py-3.5">
                <div>
                  <p className="text-sm font-bold text-ink-950">Submit anonymously</p>
                  <p className="text-xs text-ink-500">Your identity will be hidden from staff.</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={anonymous}
                  onClick={() => setAnonymous((v) => !v)}
                  className={`relative h-6 w-11 shrink-0 rounded-full border-2 border-ink-950 transition-colors ${
                    anonymous ? "bg-brand-500" : "bg-paper-alt"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full border border-ink-950 bg-card transition-transform ${
                      anonymous ? "translate-x-5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>

              <button
                type="submit"
                className="w-full rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d]"
              >
                Submit complaint
              </button>
            </form>
          </Reveal>

          <Reveal delay={0.12}>
            <aside className="h-fit space-y-4 rounded-2xl border-2 border-ink-950 bg-card p-6">
              <h2 className="font-mono text-xs font-semibold uppercase tracking-wide text-ink-950">
                What happens next
              </h2>
              <ol className="space-y-4">
                {["Your complaint is logged with a unique ID", "It's routed to the right campus team", "You can track its status any time"].map(
                  (step, i) => (
                    <li key={step} className="flex gap-3 text-sm text-ink-700">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink-950 bg-brand-100 text-xs font-bold text-ink-950">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ),
                )}
              </ol>
              <div className="rounded-lg bg-surface-alt p-4 text-xs leading-relaxed text-ink-700">
                Average response time is <span className="font-bold text-ink-950">18 hours</span>,
                with <span className="font-bold text-ink-950">92%</span> of complaints resolved
                within 72 hours.
              </div>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
