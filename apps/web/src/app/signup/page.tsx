"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = React.useState("Demo Analyst");
  const [email, setEmail] = React.useState("analyst@example.test");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);

  // Account creation has no server implementation, so this control deliberately does not
  // pretend to create one: it opens the read-only product tour instead.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/onboarding");
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
              ACCOUNT / /signup
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5F5F5] mt-2">
              Create a lab account.
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Account-creation specimen for a synthetic workspace. Server validation and persistence require implementation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            {/* Display Name */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 focus-within:border-[#FF6B35] transition-colors">
              <label htmlFor="display-name" className="block text-[11px] text-[#737373]">
                Display name
              </label>
              <input
                id="display-name"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none mt-1"
              />
            </div>

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
            </div>

            {/* Password Field */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 focus-within:border-[#FF6B35] transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="pass-input" className="block text-[11px] text-[#737373]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="pass-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none font-mono"
              />
              <span className="block text-[10px] text-[#737373]">
                Intended requirement: 12+ characters. Server policy must be defined and validated.
              </span>
            </div>

            {/* Strength Specimen */}
            <div className="text-[11px] font-mono text-[#FBBF24]">
              · Strength specimen · Moderate
            </div>

            {/* Confirm Password Field */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 flex items-center justify-between focus-within:border-[#FF6B35] transition-colors">
              <div className="flex-1">
                <label htmlFor="confirm-pass-input" className="block text-[11px] text-[#737373]">
                  Confirm password
                </label>
                <input
                  id="confirm-pass-input"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none mt-1 font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Agreement Checkbox */}
            <div className="pt-2 flex items-center gap-2">
              <input
                id="agree-checkbox"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="rounded border-[#383838] bg-[#1D1D1D] text-[#FF6B35] focus:ring-0"
              />
              <label htmlFor="agree-checkbox" className="text-xs text-[#A3A3A3]">
                I agree to the draft Terms and acknowledge the Privacy notice.
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!agreed}
                title={
                  agreed
                    ? "Account creation is not implemented in this build."
                    : "Accept the Terms to enable this control."
                }
                className="bg-[#2C2C2C] border border-[#383838] text-[#A3A3A3] text-xs font-medium px-6 py-2.5 rounded-lg hover:border-[#FF6B35] hover:text-[#F5F5F5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Take the product tour
              </button>
              <p className="text-[11px] text-[#737373] mt-2 leading-relaxed">
                Account creation is not implemented. Use{" "}
                <Link href="/login" className="text-[#FF6B35] hover:underline">
                  Sign in
                </Link>{" "}
                with a demo operator instead.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="text-xs text-[#FF6B35] hover:underline"
              >
                Already have an account? Sign In →
              </Link>
            </div>
          </form>

          {/* Validation Specimens Divider & Box */}
          <div className="pt-6 border-t border-[#383838] max-w-lg space-y-4">
            <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase">
              VALIDATION SPECIMENS
            </div>

            {/* Specimen 1: Weak Password */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="flex items-center justify-between text-[11px] text-[#737373]">
                <span>Password — weak example</span>
                <span className="text-[#A3A3A3]">Show</span>
              </div>
              <div className="font-mono text-xs text-[#F5F5F5] mt-1">
                •••••
              </div>
              <div className="text-xs text-[#F87171] mt-1">
                Use at least 12 characters. Avoid common or reused passwords.
              </div>
            </div>

            {/* Specimen 2: Duplicate Email */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                Duplicate email — intended state
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">
                An account cannot be created with these details. Use Sign In or password recovery. Account lookup and rate limiting require implementation.
              </p>
            </div>

            {/* Specimen 3: Confirmation Mismatch */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="flex items-center justify-between text-[11px] text-[#737373]">
                <span>Confirmation — mismatch example</span>
                <span className="text-[#A3A3A3]">Show</span>
              </div>
              <div className="font-mono text-xs text-[#F5F5F5] mt-1">
                •••••••••
              </div>
              <div className="text-xs text-[#F87171] mt-1">
                Passwords do not match.
              </div>
            </div>

            <div className="text-[11px] text-[#737373] leading-relaxed">
              Terms agreement is required in the intended flow. No account has been created.
            </div>
          </div>
        </div>

        {/* Right Info Column (5 cols) matching Figma */}
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
                6 virtual assets / 4 synthetic evidence records
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
