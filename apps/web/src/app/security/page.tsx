import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function SecurityPage() {
  const policies = [
    {
      code: "POL-01",
      intent: "Preserve MONITOR-01 observability",
      status: "Not connected",
    },
    {
      code: "POL-02",
      intent: "Human review before demonstration action",
      status: "Not connected",
    },
    {
      code: "POL-03",
      intent: "Block OT-CONTROLLER-SIM-01 isolation",
      status: "Not connected",
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
                The supplied dataset contains one fictional incident, three evidence records and six virtual assets. No real sensitive data is needed.
              </p>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Access control requirements
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                A future service needs server-validated identity, least privilege, protected sessions, authorization checks and abuse controls. Form designs do not implement these.
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
                Policy rules must be evaluated by a separate deterministic implementation, not inferred from an AI explanation. Fail-closed behavior requires engineering and testing.
              </p>
            </div>
          </div>

          {/* Specimen Policy Table */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] tracking-wider uppercase">
                  <th className="pb-3 font-medium w-1/4">PROPOSED POLICY</th>
                  <th className="pb-3 font-medium w-1/2">DESIGN INTENT</th>
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
              No penetration testing, cryptographic validation, secure persistence, immutable auditing, calibrated model performance or policy correctness is verified. Sample logs and notifications are synthetic examples, not live telemetry.
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
              The contact screen is an unconnected form specimen. Do not send sensitive vulnerability details or credentials through it.
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
