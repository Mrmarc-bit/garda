"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/login");
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
              ACCOUNT / /reset-password
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#F5F5F5] mt-2">
              Choose a new password.
            </h1>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Token-bound reset form specimen. Token verification, password policy and session revocation require server implementation.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            {/* New Password Field */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 focus-within:border-[#FF6B35] transition-colors space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="new-pass-input" className="block text-[11px] text-[#737373]">
                  New password
                </label>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>
              <input
                id="new-pass-input"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-transparent border-none text-xs text-[#F5F5F5] focus:outline-none font-mono"
              />
              <span className="block text-[10px] text-[#737373]">
                Use a unique password of at least 12 characters.
              </span>
            </div>

            {/* Strength Specimen */}
            <div className="text-[11px] font-mono text-[#4ADE80]">
              · Strength specimen · Strong
            </div>

            {/* Confirm New Password Field */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-3.5 flex items-center justify-between focus-within:border-[#FF6B35] transition-colors">
              <div className="flex-1">
                <label htmlFor="confirm-pass-input" className="block text-[11px] text-[#737373]">
                  Confirm new password
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

            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#FF6B35] text-white text-xs font-medium px-6 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors"
              >
                Reset password
              </button>
            </div>
          </form>

          {/* Reset State Specimens */}
          <div className="pt-6 border-t border-[#383838] max-w-lg space-y-4">
            <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase">
              RESET STATE SPECIMENS
            </div>

            {/* Specimen 1: Invalid link */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                Invalid reset link
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">
                This link cannot be verified. Request a new reset link. Token validation is not implemented.
              </p>
            </div>

            {/* Specimen 2: Expired link */}
            <div className="bg-[#1D1D1D] border border-[#F87171] rounded-xl p-3.5">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                Expired reset link
              </div>
              <p className="text-xs text-[#A3A3A3] mt-1">
                This link is no longer valid. Request another link to continue. Expiry must be enforced by the server.
              </p>
            </div>

            {/* Specimen 3: Intended completion design */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-xl p-5 space-y-3">
              <div className="text-[10px] font-mono text-[#FF6B35] tracking-wider uppercase">
                SPECIMEN ONLY — NO PASSWORD CHANGED
              </div>
              <h2 className="text-sm font-bold text-[#F5F5F5]">
                Intended completion design
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Your password would now be reset. Return to Sign In with your new password.
              </p>
              <div className="pt-1">
                <Link
                  href="/login"
                  className="text-xs text-[#FF6B35] hover:underline"
                >
                  Return to Sign In
                </Link>
              </div>
              <p className="text-[11px] text-[#737373] pt-2 border-t border-[#303030] leading-relaxed">
                Display only after a verified server response. This design has not changed credentials or invalidated sessions.
              </p>
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
