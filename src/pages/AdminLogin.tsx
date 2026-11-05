import { useState, type FormEvent } from "react";
import Logo from "../components/Logo";
import { Reveal } from "../components/Reveal";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // UI-only for now — authentication is not wired up yet.
  }

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-paper px-4 py-16">
      <Reveal className="w-full max-w-sm">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[6px_6px_0_0_#14110d] sm:p-8">
          <h1 className="font-display text-xl font-bold text-ink-950">Staff / Admin login</h1>
          <p className="mt-1.5 text-sm text-ink-500">
            Sign in to manage complaints and view analytics.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-ink-950">
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@smartcampus.edu"
                className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-ink-950">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 pr-14 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-semibold uppercase text-ink-400 hover:text-ink-950"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-500">
                <input type="checkbox" className="h-4 w-4 rounded border-2 border-ink-950 text-brand-600 focus:ring-brand-500" />
                Remember me
              </label>
              <a href="#" className="font-semibold text-brand-600 hover:text-brand-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d]"
            >
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-ink-400">
          Not staff? Head back to the{" "}
          <a href="/" className="font-semibold text-brand-600 hover:text-brand-700">
            main portal
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}
