import { useState, type FormEvent, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { Reveal } from "../components/Reveal";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { user, loginStudent, registerStudent } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [rollId, setRollId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/submit", { replace: true });
      }
    }
  }, [user, navigate]);

  function handleSignIn(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      const res = loginStudent(email, password);
      setLoading(false);
      if (res.success) {
        navigate("/submit", { replace: true });
      } else {
        setErrorMessage(res.error || "Login failed");
      }
    }, 300);
  }

  function handleSignUp(e: FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      const res = registerStudent(fullName, email, password, rollId);
      setLoading(false);
      if (res.success) {
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => navigate("/submit", { replace: true }), 600);
      } else {
        setErrorMessage(res.error || "Registration failed");
      }
    }, 300);
  }

  function handleDemoStudentLogin() {
    setEmail("student@smartcampus.edu");
    setPassword("123456");
    const res = loginStudent("student@smartcampus.edu", "123456");
    if (res.success) {
      navigate("/submit", { replace: true });
    }
  }

  return (
    <section className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-paper px-4 py-16">
      <Reveal className="w-full max-w-md">
        <div className="flex justify-center">
          <Logo />
        </div>

        <div className="mt-8 rounded-2xl border-2 border-ink-950 bg-card p-6 shadow-[6px_6px_0_0_#14110d] sm:p-8">
          <div className="flex rounded-lg border-2 border-ink-950 bg-paper-alt p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setErrorMessage("");
              }}
              className={`flex-1 rounded-md py-2 text-xs font-bold transition-colors ${
                mode === "signin" ? "bg-ink-950 text-paper shadow-sm" : "text-ink-600 hover:text-ink-950"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setErrorMessage("");
              }}
              className={`flex-1 rounded-md py-2 text-xs font-bold transition-colors ${
                mode === "signup" ? "bg-ink-950 text-paper shadow-sm" : "text-ink-600 hover:text-ink-950"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mt-6">
            <h1 className="font-display text-xl font-bold text-ink-950">
              {mode === "signin" ? "Student Portal Sign In" : "Register Student Account"}
            </h1>
            <p className="mt-1 text-sm text-ink-500">
              {mode === "signin"
                ? "Sign in to submit complaints and track their live progress."
                : "Join the campus community to report issues and stay notified."}
            </p>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg border-2 border-red-500 bg-red-50 p-3 text-xs font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mt-4 rounded-lg border-2 border-green-600 bg-green-50 p-3 text-xs font-semibold text-green-700">
              {successMessage}
            </div>
          )}

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="mt-5 space-y-4">
              <div>
                <label htmlFor="signin-email" className="block text-sm font-bold text-ink-950">
                  Student email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@smartcampus.edu"
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="signin-password" className="block text-sm font-bold text-ink-950">
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="signin-password"
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

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d] disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign in to Portal"}
              </button>

              <button
                type="button"
                onClick={handleDemoStudentLogin}
                className="w-full rounded-md border-2 border-ink-950 bg-paper-alt px-6 py-2.5 text-xs font-bold text-ink-800 transition-all hover:bg-brand-100"
              >
                ⚡ Use Demo Student Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="mt-5 space-y-4">
              <div>
                <label htmlFor="fullname" className="block text-sm font-bold text-ink-950">
                  Full name
                </label>
                <input
                  id="fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Aarav Sharma"
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="roll" className="block text-sm font-bold text-ink-950">
                  Roll / Student ID <span className="text-xs font-normal text-ink-400">(optional)</span>
                </label>
                <input
                  id="roll"
                  type="text"
                  value={rollId}
                  onChange={(e) => setRollId(e.target.value)}
                  placeholder="24CS012"
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-bold text-ink-950">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aarav@smartcampus.edu"
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-bold text-ink-950">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="mt-2 w-full rounded-lg border-2 border-ink-950/25 bg-paper-alt px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-md border-2 border-ink-950 bg-brand-500 px-6 py-3.5 text-sm font-bold text-ink-950 shadow-[4px_4px_0_0_#14110d] transition-all hover:-translate-y-0.5 hover:shadow-[5px_6px_0_0_#14110d] disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Complete Registration"}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-ink-950/15 pt-4 text-center">
            <Link
              to="/admin/login"
              className="font-mono text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
            >
              Are you staff / faculty? Access Staff Admin Login →
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
