"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("analyst@example.test");
  const [password, setPassword] = React.useState("password123");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/app");
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      {/* Top Header */}
      <header className="px-6 md:px-12 py-5 border-b border-[#303030] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#F5F5F5]">
          <span className="w-3 h-0.5 bg-[#FF6B35]" />
          <span>GARDA-SIM AI</span>
        </Link>
        <span className="text-[11px] font-mono text-[#737373] uppercase tracking-wider">
          VISUAL SPECIMEN / NO AUTHENTICATED SESSION
        </span>
      </header>

      {/* Main Content: 2-Column Split matching Figma */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12">
        {/* Left Form Column (7 cols) */}
        <div className="lg:col-span-7 p-6 md:p-12 lg:p-16 space-y-8">
          <div>
            <div className="text-[11px] font-mono text-[#FF6B35] uppercase">
              ACCOUNT / /login
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5F5F5] mt-2">
              Return to the lab.
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Sign-in layout for the synthetic research workspace. Authentication is not implemented.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            {/* Email Field */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 focus-within:border-[#FF6B35] transition-colors">
              <label htmlFor="email-input" className="block text-[11px] text-[#737373]">
                Email address
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none mt-1 font-mono"
              />
              <span className="block text-[10px] text-[#737373] mt-1">
                Synthetic example address only.
              </span>
            </div>

            {/* Password Field */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 flex items-center justify-between focus-within:border-[#FF6B35] transition-colors">
              <div className="flex-1">
                <label htmlFor="pass-input" className="block text-[11px] text-[#737373]">
                  Password
                </label>
                <input
                  id="pass-input"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none mt-1 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div>
              <Link
                href="/forgot-password"
                className="text-xs text-[#FF6B35] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#FF6B35] text-white text-xs font-medium px-6 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors"
              >
                Sign In
              </button>
            </div>

            <div className="pt-2">
              <Link
                href="/signup"
                className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
              >
                New to GARDA-SIM AI? Create an account →
              </Link>
            </div>
          </form>

          {/* Form State Specimens Divider & Box */}
          <div className="pt-6 border-t border-[#383838] max-w-lg space-y-4">
            <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase">
              FORM STATE SPECIMENS / NOT LIVE RESPONSES
            </div>

            {/* Specimen 1: Email validation error */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="text-[11px] text-[#737373]">
                Email address — validation example
              </div>
              <div className="font-mono text-xs text-[#F5F5F5] mt-1">
                analyst-demo
              </div>
              <div className="text-xs text-[#F87171] mt-1">
                Enter a valid email address.
              </div>
            </div>

            {/* Specimen 2: Invalid credentials */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                Invalid credentials — intended state
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">
                Email or password could not be verified. Check your details and try again. Server authentication required.
              </p>
            </div>

            {/* Specimen 3: Service error */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                Service error — intended state
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">
                Sign-in is unavailable. Try again later. No session has been created by this design.
              </p>
            </div>

            <div className="text-[11px] text-[#737373] leading-relaxed">
              Associate errors with inputs; announce a concise error summary. Keep password visibility control labeled. Focus returns to the first invalid field.
            </div>
          </div>
        </div>

        {/* Right Info Column (5 cols) */}
        <div className="lg:col-span-5 bg-[#202020] border-t lg:border-t-0 lg:border-l border-[#383838] p-8 md:p-12 lg:p-16 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="text-[11px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
              SIMULATION ONLY
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] leading-snug">
              A safe place to examine a difficult decision.
            </h2>

            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Explore synthetic evidence, compare hypothetical responses and keep human review explicit.
            </p>

            <div className="pt-6 border-t border-[#383838] space-y-3">
              <h3 className="text-sm font-semibold text-[#F5F5F5]">
                Simulation Lab
              </h3>
              <div className="space-y-1 font-mono text-xs text-[#A3A3A3]">
                <div>INC-2026-0042</div>
                <div>Suspicious Privilege Escalation</div>
                <div>High / Awaiting Review</div>
              </div>
              <div className="font-mono text-xs text-[#737373] pt-2">
                6 virtual assets / 3 synthetic events
                <br />
                No real action
              </div>
            </div>
          </div>

          <div className="text-xs text-[#737373] mt-8 pt-6 border-t border-[#383838] leading-relaxed">
            Visual specification, not authentication. Forms and account states are specimens. Identity, server validation, email delivery and persistence require implementation.
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 border-t border-[#303030] text-xs text-[#737373] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/privacy" className="hover:text-[#F5F5F5]">Privacy</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-[#F5F5F5]">Terms</Link>
          <span>·</span>
          <Link href="/security" className="hover:text-[#F5F5F5]">Security</Link>
          <span>·</span>
          <Link href="/" className="hover:text-[#F5F5F5]">Back to home</Link>
        </div>
        <div>
          Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
        </div>
      </footer>
    </div>
  );
}
