import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function SecurityPage() {
  const policies = [
    {
      code: "SEC-OT-01",
      intent: "Zero real-world containment — the target must be a virtual asset in the synthetic inventory",
      status: "Enforced server-side",
    },
    {
      code: "SEC-OT-02",
      intent: "Operator clearance — identity comes from the server session, never the request body",
      status: "Enforced server-side",
    },
    {
      code: "SEC-OT-03",
      intent: "Core identity service availability — protected assets cannot be targeted",
      status: "Enforced server-side",
    },
    {
      code: "SEC-OT-04",
      intent: "Uninterrupted OT telemetry — a strategy whose modelled impact severs a telemetry-critical asset is blocked",
      status: "Enforced server-side",
    },
    {
      code: "SEC-OT-05",
      intent: "Ledger integrity — the audit chain is verified before a run is accepted",
      status: "Enforced server-side",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/security · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            PRODUCT GUIDE / /security
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            Boundaries before capabilities.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
            Security requirements for a defensive research prototype. This page makes no claims of verified controls, certification or production readiness.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-6 md:px-12 lg:px-16 py-12 flex-1">
        <div className="max-w-[1440px] mx-auto space-y-8">
          {/* 4 Cards Grid (2x2) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Synthetic data only
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                The supplied dataset contains two fictional incidents, four evidence records and six virtual assets. No real sensitive data is needed, and nothing in the API resolves a hostname or opens a socket.
              </p>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Access control requirements
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Implemented: PBKDF2-SHA256 password hashing, HttpOnly SameSite session cookies (only a SHA-256 of the token is stored), server-side session resolution on every route, a minimum-clearance gate on simulation and review, an Origin check on state-changing calls, and a fixed-window rate limit. The rate limiter is per-process, so it does not compose across multiple workers.
              </p>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Human oversight
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Recommendations remain Pending Review. Approval means Approved for Demonstration, never permission to act on real systems.
              </p>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Deterministic safety boundary
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                The five invariants below are evaluated in code before any result is returned, and the approval endpoint returns 403 for a blocked strategy even if the browser is bypassed. Unknown strategies are rejected with 422 rather than scored.
              </p>
            </div>
          </div>

          {/* Specimen Policy Table */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] tracking-wider uppercase">
                  <th className="pb-3 font-medium w-1/5">INVARIANT</th>
                  <th className="pb-3 font-medium w-1/2">RULE</th>
                  <th className="pb-3 font-medium">IMPLEMENTATION STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {policies.map((pol) => (
                  <tr key={pol.code}>
                    <td className="py-3 text-[#FF6B35]">{pol.code}</td>
                    <td className="py-3 text-[#F5F5F5] font-sans">{pol.intent}</td>
                    <td className="py-3 text-[#737373]">{pol.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* What this design does not establish */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
            <h2 className="text-sm font-bold text-[#F5F5F5]">
              What this design does not establish
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              No independent penetration test, third-party cryptographic audit or policy-correctness
              certification has been performed. Persistence is a local SQLite file with
              append-only triggers and an HMAC-SHA256 chain — useful for detecting edits, but not an
              external notarisation. AI provider data handling and email delivery remain
              unimplemented. Sample logs and notifications are synthetic examples, not live
              telemetry.
            </p>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              AI provider data handling and email delivery remain unverified. A real implementation needs a threat model, secure development process, independent testing and operational ownership.
            </p>
          </div>

          {/* No verified disclosure channel */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-5 space-y-1">
            <h2 className="text-xs font-bold text-[#F5F5F5]">
              No verified disclosure channel
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The contact screen validates and prepares text but has no delivery endpoint. Do not send sensitive vulnerability details or credentials through it.
            </p>
          </div>

          {/* Bottom Link */}
          <div className="pt-2">
            <Link
              href="/about"
              className="text-xs text-[#F5F5F5] hover:text-[#FF6B35] underline transition-colors"
            >
              Review scope and limitations
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
