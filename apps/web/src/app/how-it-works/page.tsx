import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function HowItWorksPage() {
  const stages = [
    {
      num: "01",
      title: "Scenario",
      lead: "Choose INC-2026-0042 and the bounded virtual environment.",
      artifact: {
        category: "EXPECTED ARTIFACT",
        title: "Incident context",
        main: "INC-2026-0042",
        status: "High · Awaiting Review · Simulation Lab",
        context: "APP-GW-02 / analyst-demo-03",
      },
    },
    {
      num: "02",
      title: "Evidence",
      lead: "Inspect EV-0042-01 through EV-0042-03 and their provenance.",
      artifact: {
        category: "EXPECTED ARTIFACT",
        title: "Synthetic Evidence",
        main: "EV-0042-01 → EV-0042-02 → EV-0042-03",
        status: "2026-10-26 / 09:14:00 → 09:14:08 → 09:15:10 UTC",
        context: "Elevation request → token issued → privileged route accessed",
      },
    },
    {
      num: "03",
      title: "Candidates",
      lead: "Define session revocation, access restriction or more verification.",
      artifact: {
        category: "EXPECTED ARTIFACT",
        title: "Candidate strategies",
        main: "Session revocation / Virtual access restriction",
        status: "Request more verification / Optional simulated asset isolation",
        context: "Hypothetical actions; nothing executes",
      },
    },
    {
      num: "04",
      title: "Impact",
      lead: "Compare possible security benefit and virtual service disruption.",
      artifact: {
        category: "EXPECTED ARTIFACT",
        title: "Derived Assessment",
        main: "Security benefit / Service impact / Recovery effort",
        status: "Assumptions: one gateway, one synthetic session",
        context: "No measured outcomes; illustrative comparison only",
      },
    },
    {
      num: "05",
      title: "Policy",
      lead: "Inspect proposed constraint checks, independent of generated text.",
      artifact: {
        category: "EXPECTED ARTIFACT",
        title: "Policy Validation",
        main: "POL-01 Preserve monitoring / POL-02 Review before action",
        status: "POL-03 Do not isolate the OT controller",
        context: "Proposed deterministic checks; evaluation not connected",
      },
    },
    {
      num: "06",
      title: "Review",
      lead: "A person approves for demonstration, rejects or asks for evidence.",
      artifact: {
        category: "EXPECTED ARTIFACT",
        title: "Human review",
        main: "Pending Review",
        status: "Approved for Demonstration / Rejected / Requires More Evidence",
        context: "Human decision required; no automatic approval",
      },
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/how-it-works · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            PRODUCT GUIDE / /how-it-works
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            A decision path you can inspect.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            Six explicit stages connect synthetic scenario context to a human-reviewed demonstration decision.
          </p>
        </div>
      </section>

      {/* 6 Stages Vertical Flow */}
      <section className="px-6 md:px-12 lg:px-16 py-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {stages.map((stage) => (
            <div
              key={stage.num}
              className="bg-[#202020] border border-[#383838] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
            >
              {/* Left Column: Stage Header & Lead */}
              <div className="lg:col-span-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center text-[#FF6B35] font-mono font-bold text-xs">
                    {stage.num}
                  </div>
                  <h2 className="text-xl font-bold text-[#F5F5F5]">
                    {stage.title}
                  </h2>
                </div>
                <p className="text-sm text-[#A3A3A3] leading-relaxed">
                  {stage.lead}
                </p>
              </div>

              {/* Right Column: Expected Artifact Specimen Box */}
              <div className="lg:col-span-7 bg-[#252525] border border-[#383838] rounded-xl p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between text-[10px] text-[#737373]">
                  <span className="text-[#FF6B35] font-bold tracking-wider uppercase">
                    {stage.artifact.category}
                  </span>
                  <span>{stage.artifact.title}</span>
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5]">
                  {stage.artifact.main}
                </div>
                <div className="text-xs text-[#A3A3A3]">
                  {stage.artifact.status}
                </div>
                <div className="text-[11px] text-[#737373] pt-1 border-t border-[#383838]">
                  {stage.artifact.context}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer Banner & CTA */}
      <section className="px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
            <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
              SIMULATION ONLY
            </span>
            Results are simulated estimates, not guarantees of real-world outcomes.
          </div>

          <div className="flex justify-start">
            <Link
              href="/app"
              className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Inspect the response workspace</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
