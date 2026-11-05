import { Link } from "react-router-dom";

export default function Logo({ className = "", dark = false }: { className?: string; dark?: boolean }) {
  return (
    <Link to="/" className={`flex items-center gap-3 ${className}`}>
      <span className="relative flex h-10 w-10 shrink-0 -rotate-6 items-center justify-center rounded-lg border-2 border-ink-950 bg-brand-500 shadow-[3px_3px_0_0_#14110d]">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 13l4 4L19 7"
            stroke="#14110d"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-tight">
        <span className={`font-display text-base font-bold ${dark ? "text-paper" : "text-ink-950"}`}>
          Smart Campus
        </span>
        <span
          className={`font-mono text-[10px] font-medium uppercase tracking-[0.18em] ${dark ? "text-paper/60" : "text-ink-500"}`}
        >
          Complaint Portal
        </span>
      </span>
    </Link>
  );
}
