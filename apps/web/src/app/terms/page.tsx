import * as React from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Intended use",
      desc: "Use GARDA-SIM AI only to inspect defensive research concepts with synthetic incidents and virtual IT/OT assets. It is not a production incident response platform, security service or source of operational instructions.",
    },
    {
      title: "2. No real response actions",
      desc: "All strategies are hypothetical. Do not connect real systems, run actions against third parties or treat demonstration approval as authorization for production activity. No production connection exists in this visual design.",
    },
    {
      title: "3. Responsibility and human review",
      desc: "A person must assess evidence, assumptions, uncertainty and policy context. AI-generated explanations are not facts or approvals. Proposed deterministic validation is a separate implementation responsibility.",
    },
    {
      title: "4. No guarantees",
      desc: "Simulated estimates cannot establish security effectiveness, availability, safety or recovery time in a real environment. Illustrative comparisons are not recorded experiments, benchmarks or evidence of superiority.",
    },
    {
      title: "5. Acceptable content",
      desc: "Use local synthetic information only. Do not enter credentials, personal information, real logs, proprietary configurations or harmful instructions. This prototype is intended for defensive education and research.",
    },
    {
      title: "6. Implementation boundaries",
      desc: "Navigation, authentication, storage, AI integration, policy evaluation, reports, exports and email delivery require engineering and review. The design does not warrant that any of these capabilities operates.",
    },
    {
      title: "7. Before deployment",
      desc: "An accountable operator must establish applicable terms, privacy practices, security controls and support contacts. This draft needs legal review; no company, jurisdiction or verified legal contact is asserted.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/terms · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            LEGAL / DRAFT / /terms
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            Prototype use terms.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
            Draft content for legal review. These terms are a visual design artifact, not a claim of an available or legally approved service.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-6 md:px-12 lg:px-16 py-12 flex-1">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Simulation-only Limits Alert Callout */}
          <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
            <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
              Simulation-only limits
            </span>
            Results are simulated estimates, not guarantees of real-world outcomes.
          </div>

          {/* 7 Terms Section Cards */}
          {sections.map((sec) => (
            <div
              key={sec.title}
              className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-2"
            >
              <h2 className="text-base font-bold text-[#F5F5F5]">
                {sec.title}
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
