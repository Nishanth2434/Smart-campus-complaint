import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { Reveal } from "../components/Reveal";
import { useAuth } from "../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { user, isAdmin, loginAdmin } = useAuth();

  const [email, setEmail] = useState("principle@gmail.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && isAdmin) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [user, isAdmin, navigate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      setLoading(false);
      if (res.success) {
        navigate("/admin/dashboard", { replace: true });
      } else {
        setErrorMessage(res.error || "Login failed");
      }
    }, 300);
  }

  function handleDemoLogin() {
    setEmail("principle@gmail.com");
    setPassword("123456");
    const res = loginAdmin("principle@gmail.com", "123456");
    if (res.success) {
      navigate("/admin/dashboard", { replace: true });
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-paper px-4 py-16">
      <Reveal className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[6px_6px_0_0_#14110d] sm:p-8">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-xl font-bold text-ink-950">Staff / Admin Login</h1>
            <span className="rounded-full border border-ink-950 bg-brand-200 px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink-950">
              Authorized
            </span>
          </div>
          <p className="mt-1.5 text-sm text-ink-500">
            Sign in to manage student complaints, update statuses and view analytics.
          </p>

          {/* Default Credentials Notice */}
          <div className="mt-4 rounded-lg border-2 border-dashed border-brand-600 bg-brand-50 p-3 text-xs text-ink-800">
            <p className="font-bold text-ink-950">🔑 Default Login Credentials:</p>
            <div className="mt-1 flex flex-col gap-0.5 font-mono text-[11px] text-ink-700">
              <p>Email: <span className="font-bold text-ink-950">principle@gmail.com</span></p>
              <p>Password: <span className="font-bold text-ink-950">123456</span></p>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg border-2 border-red-500 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
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
                placeholder="principle@gmail.com"
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
                <input
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded border-2 border-ink-950 text-brand-600 focus:ring-brand-500"
                />
                Remember me
              </label>
              <Link to="/support" className="font-semibold text-brand-600 hover:text-brand-700">
                Need help?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in to Dashboard"}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full rounded-md border-2 border-ink-950 bg-paper-alt px-6 py-2.5 text-xs font-bold text-ink-800 transition-all hover:bg-brand-100"
            >
              ⚡ One-Click Admin Sign In
            </button>
          </form>
        </div>

        <p className="mt-6 text-center font-mono text-xs text-ink-400">
          Student or visitor? Head to the{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Student Portal Login
          </Link>{" "}
          or{" "}
          <Link to="/" className="font-semibold text-brand-600 hover:text-brand-700">
            Main Homepage
          </Link>
          .
        </p>
      </Reveal>
    </section>
  );
}
