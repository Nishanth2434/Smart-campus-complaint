import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/submit", label: "Submit Complaint" },
  { to: "/track", label: "Track Status" },
  { to: "/support", label: "Support" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  function handleSignOut() {
    logout();
    navigate("/");
  }

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
          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                `rounded-md px-3.5 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "bg-brand-500 text-ink-950 font-bold"
                    : "text-brand-700 hover:bg-brand-50 font-bold"
                }`
              }
            >
              Admin Dashboard
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <span className="rounded-full border border-ink-950/20 bg-paper-alt px-3 py-1 font-mono text-xs font-semibold text-ink-800">
                👤 {user?.name}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-md border-2 border-ink-950 bg-paper-alt px-3 py-1.5 text-xs font-bold text-ink-950 transition-colors hover:bg-brand-100"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-md border-2 border-ink-950 bg-paper-alt px-3.5 py-2 text-sm font-bold text-ink-950 transition-colors hover:bg-brand-100"
            >
              Sign In
            </Link>
          )}

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

            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm font-bold text-brand-700 ${
                    isActive ? "bg-brand-500 text-ink-950" : "hover:bg-brand-50"
                  }`
                }
              >
                Admin Dashboard
              </NavLink>
            )}

            <div className="mt-2 flex flex-col gap-2 border-t border-ink-950/15 pt-3">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-ink-800">
                    👤 {user?.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="rounded border border-ink-950 bg-paper-alt px-3 py-1 text-xs font-bold"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-md border-2 border-ink-950 bg-paper-alt px-4 py-2 text-center text-sm font-bold text-ink-950"
                >
                  Sign In
                </Link>
              )}

              <Link
                to="/submit"
                onClick={() => setOpen(false)}
                className="rounded-md border-2 border-ink-950 bg-brand-500 px-4 py-2.5 text-center text-sm font-bold text-ink-950 shadow-[3px_3px_0_0_#14110d]"
              >
                Start complaint
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
