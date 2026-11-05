import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink-950 bg-ink-950">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo dark />
            <p className="mt-4 text-sm leading-relaxed text-paper/60">
              One place for students, faculty and staff to report campus issues and follow
              them through to resolution.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">Portal</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/70">
              <li>
                <Link to="/submit" className="hover:text-brand-500">
                  Submit a complaint
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-brand-500">
                  Track status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">Help</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/70">
              <li>
                <Link to="/about" className="hover:text-brand-500">
                  About the portal
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-brand-500">
                  Support & FAQs
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-brand-500">
                  Staff / admin login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brand-500">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-paper/70">
              <li>helpdesk@smartcampus.edu</li>
              <li>+1 (555) 010-2947</li>
              <li>Student Services Building, Room 104</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-paper/15 pt-6 font-mono text-xs text-paper/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Smart Campus Complaint Portal. Built for a better campus, one fix at a time.</p>
          <p>Photography via Wikimedia Commons</p>
        </div>
      </div>
    </footer>
  );
}
