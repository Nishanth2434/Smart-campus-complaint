import { useState, type FormEvent } from "react";
import { faqs } from "../data/mockData";
import { IconCheck } from "../components/icons";
import { Reveal } from "../components/Reveal";

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y-2 divide-ink-950/10 overflow-hidden rounded-2xl border-2 border-ink-950 bg-card shadow-[6px_6px_0_0_#14110d]">
      {faqs.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={faq.question}>
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-brand-50"
            >
              <span className="text-sm font-bold text-ink-950 sm:text-base">{faq.question}</span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`shrink-0 text-brand-600 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className={`grid transition-all duration-200 ${isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden px-6">
                <p className="text-sm leading-relaxed text-ink-700">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[6px_6px_0_0_#14110d] sm:p-8"
    >
      {sent && (
        <div className="flex items-start gap-3 rounded-lg border border-status-resolved/30 bg-status-resolved-bg px-4 py-3 text-status-resolved">
          <IconCheck className="mt-0.5 h-4 w-4 shrink-0" />
          <p className="text-sm font-medium">UI preview only — no message has actually been sent.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-ink-950">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-ink-950">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-bold text-ink-950">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="How can we help?"
          className="mt-2 w-full resize-none rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d] sm:w-auto"
      >
        Send message
      </button>
    </form>
  );
}

export default function Support() {
  return (
    <>
      <section className="border-b-2 border-ink-950 bg-paper py-14 sm:py-20">
        <Reveal className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ink-950 bg-card px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-ink-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
            Support
          </span>
          <h1 className="mt-5 text-balance font-display text-3xl font-semibold text-ink-950 sm:text-4xl">
            Frequently asked questions
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-500 sm:text-base">
            Can't find what you're looking for? Send us a message below.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <FaqAccordion />
        </Reveal>
      </section>

      <section className="border-t-2 border-ink-950 bg-surface-alt py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold text-ink-950 sm:text-3xl">Still need help?</h2>
            <p className="mt-2 text-sm text-ink-500">
              Reach the helpdesk directly or leave a message and we'll get back to you.
            </p>
          </Reveal>
          <Reveal delay={0.08} className="mt-8">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
