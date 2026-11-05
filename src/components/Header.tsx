import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Logo from "./Logo";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit Complaint" },
  { to: "/track", label: "Track Status" },
  { to: "/support", label: "Support" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-2 border-ink-950 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-ink-950 text-paper"
                    : "text-ink-700 hover:bg-ink-950/5"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/submit"
            className="rounded-md border-2 border-ink-950 bg-brand-500 px-4 py-2 text-sm font-bold text-ink-950 shadow-[3px_3px_0_0_#14110d] transition-transform hover:-translate-y-0.5 hover:shadow-[4px_5px_0_0_#14110d]"
          >
            Start complaint
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-md border-2 border-ink-950 text-ink-950 md:hidden"
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <nav className="border-t-2 border-ink-950 bg-paper px-4 pb-4 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-semibold ${
                    isActive ? "bg-ink-950 text-paper" : "text-ink-700 hover:bg-ink-950/5"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/submit"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md border-2 border-ink-950 bg-brand-500 px-4 py-2.5 text-center text-sm font-bold text-ink-950 shadow-[3px_3px_0_0_#14110d]"
            >
              Start complaint
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
