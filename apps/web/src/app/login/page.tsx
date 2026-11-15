"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Loader2, Lock, ShieldCheck } from "lucide-react";

import { ApiError, fetchDemoHint, login } from "@/lib/api-client";

/** Where to land after sign-in: the `next` param set by middleware, else /app. */
function resolveDestination(): string {
  if (typeof window === "undefined") return "/app";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/app") ? next : "/app";
}

export default function LoginPage() {
  const router = useRouter();
  const [operatorId, setOperatorId] = React.useState("analyst-demo-03");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const signIn = async (candidateId: string, candidatePassword: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await login(candidateId, candidatePassword);
      router.replace(resolveDestination());
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : "Sign-in failed. Verify the API is running and try again.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    if (isSubmitting) return;
    void signIn(operatorId.trim(), password);
  };

  const handleQuickDemoAccess = async () => {
    if (isSubmitting) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const hint = await fetchDemoHint();
      setOperatorId(hint.operator_id);
      await login(hint.operator_id, hint.password);
      router.replace(resolveDestination());
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 404
          ? "No generated demo credential is available. Set GARDA_DEMO_PASSWORD and restart the API."
          : "Demo access is unavailable. Check that the API is running.";
      setError(message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <header className="px-6 md:px-12 py-5 border-b border-[#303030] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#F5F5F5]">
          <span className="w-3 h-0.5 bg-[#FF6B35]" />
          <span>GARDA-SIM AI</span>
        </Link>
        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
          SIMULATION LAB ACCESS
        </span>
      </header>

      <div className="flex-1 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 items-center">
        <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 space-y-8">
          <div>
            <div className="text-[11px] font-mono text-[#FF6B35] uppercase">
              AUTHENTICATION / SIMULATION LAB
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5F5F5] mt-2">
              Return to the Lab.
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Sign in with your authorized SOC analyst credentials to access the defensive
              simulation engine.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-4 max-w-lg" noValidate>
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 focus-within:border-[#FF6B35] transition-colors">
              <label htmlFor="login-operator" className="block text-[11px] text-[#737373]">
                Operator ID
              </label>
              <input
                id="login-operator"
                name="operatorId"
                type="text"
                autoComplete="username"
                required
                value={operatorId}
                onChange={(event) => setOperatorId(event.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none mt-1 font-mono"
              />
            </div>

            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 flex items-center justify-between focus-within:border-[#FF6B35] transition-colors">
              <div className="flex-1">
                <label htmlFor="login-password" className="block text-[11px] text-[#737373]">
                  Password
                </label>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none mt-1 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                aria-pressed={showPassword}
                className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5] cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {error ? (
              <p
                role="alert"
                className="flex items-start gap-2 text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
              >
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" aria-hidden="true" />
                <span>{error}</span>
              </p>
            ) : null}

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                ) : (
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                )}
                <span>{isSubmitting ? "Signing in…" : "Enter Workspace"}</span>
              </button>

              <button
                type="button"
                onClick={handleQuickDemoAccess}
                disabled={isSubmitting}
                className="bg-[#222B25] border border-emerald-500/40 text-emerald-300 hover:text-white hover:bg-emerald-900/40 text-xs font-medium px-5 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span>Quick Demo Access</span>
              </button>
            </div>

            <p className="text-[11px] text-[#737373] leading-relaxed">
              Demo access signs in as the synthetic operator{" "}
              <span className="font-mono text-[#A3A3A3]">analyst-demo-03</span> using the
              password generated on first boot. No real account is created.
            </p>
          </form>
        </div>

        <div className="lg:col-span-5 p-6 md:p-12 lg:p-16 border-t lg:border-t-0 lg:border-l border-[#303030] space-y-6">
          <div className="bg-[#202020] border border-[#383838] rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#FF6B35]">
              <Lock className="w-4 h-4" aria-hidden="true" />
              <span>DEFENSIVE SIMULATION LAB</span>
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5]">Fail-Closed Safety Policy</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              All containment simulations are isolated to virtual synthetic assets. Deterministic
              safety rules (SEC-OT-01 to 05) are evaluated server-side, and the audit ledger is
              append-only and HMAC-chained.
            </p>
          </div>
        </div>
      </div>

      <footer className="px-6 md:px-12 py-4 border-t border-[#303030] text-xs text-[#737373] flex items-center justify-between">
        <span>GARDA-SIM AI Prototype Lab</span>
        <span className="font-mono text-[11px]">ENVIRONMENT: SYNTHETIC_SIMULATION_ONLY</span>
      </footer>
    </div>
  );
}
