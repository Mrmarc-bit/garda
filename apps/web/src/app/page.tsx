"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Hero Section matching Figma */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-20 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
              DEFENSIVE SIMULATION PLATFORM
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F5F5F5] leading-[1.15]">
              Before you respond, understand the impact.
            </h1>

            <p className="text-base md:text-lg text-[#A3A3A3] max-w-xl leading-relaxed">
              AI-assisted cyber defense, grounded in synthetic evidence. Explore response strategies and their possible service impact before a human makes the call.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/app"
                className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 shadow-sm"
              >
                <span>↗ Start Exploring</span>
              </Link>
              <Link
                href="/app/simulator"
                className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
              >
                Explore the Simulator
              </Link>
            </div>

            <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase pt-4">
              SYNTHETIC INCIDENTS / VIRTUAL IT & OT / HUMAN REVIEW
            </div>
          </div>

          {/* Right Column: Interactive Workspace Preview Card (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-[#202020] border border-[#383838] rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between text-[10px] text-[#A3A3A3] pb-3 border-b border-[#383838]">
                <span>GARDA-SIM AI / RESPONSE WORKSPACE</span>
                <span className="text-[#FF6B35] font-semibold">· SIMULATION ONLY</span>
              </div>

              <div className="mt-4">
                <span className="text-[11px] text-[#737373] block">
                  Simulation Lab / Incident detail
                </span>
                <h2 className="text-lg font-bold text-[#F5F5F5] mt-0.5">
                  Suspicious Privilege Escalation
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mt-1">
                  <span className="font-mono">· INC-2026-0042</span>
                  <span className="text-[#FBBF24]">· High</span>
                  <span>· Awaiting Review</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {/* Synthetic Evidence */}
                <div className="bg-[#252525] border border-[#383838] rounded-xl p-3.5">
                  <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
                    SYNTHETIC EVIDENCE
                  </div>
                  <h3 className="text-xs font-semibold text-[#F5F5F5] mt-1">
                    Evidence, not assumptions
                  </h3>
                  <div className="font-mono text-[11px] text-[#737373] mt-2">
                    EV-0042-01 / 09:14:00 UTC
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                    Role elevation requested by analyst-demo-03 on APP-GW-02.
                  </p>
                  <div className="font-mono text-[11px] text-[#737373] mt-2">
                    EV-0042-02 / 09:14:08 UTC
                  </div>
                  <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                    Synthetic privileged token issued.
                  </p>
                </div>

                {/* Derived Assessment */}
                <div className="bg-[#252525] border border-[#383838] rounded-xl p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
                      DERIVED ASSESSMENT
                    </div>
                    <h3 className="text-xs font-semibold text-[#F5F5F5] mt-1">
                      Review the tradeoff
                    </h3>
                    <div className="space-y-1 text-[11px] mt-2">
                      <div>
                        <span className="text-[#737373]">Identity / </span>
                        <span className="font-mono text-[#F5F5F5]">analyst-demo-03</span>
                      </div>
                      <div>
                        <span className="text-[#737373]">Confidence / </span>
                        <span className="font-mono text-[#F5F5F5]">0.82 illustrative</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#737373] mt-2">
                      Not a calibrated probability. Context remains incomplete.
                    </p>
                  </div>
                  <div className="text-[11px] text-[#FF6B35] font-mono mt-3">
                    · Pending Review
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-[#383838] flex items-center justify-between">
                <Link
                  href="/app/simulator"
                  className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors"
                >
                  Compare strategies
                </Link>
                <span className="text-[11px] text-[#737373]">
                  Preview only. No simulation has been run.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Pillars Value Props Strip */}
      <section className="px-6 md:px-12 lg:px-16 py-6 border-b border-[#303030] bg-[#1E1E1E]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#A3A3A3]">
          <div>
            <span className="font-mono text-[#FF6B35] mr-2">01</span>
            <span className="text-[#F5F5F5] font-medium">Synthetic by design</span>
          </div>
          <div>
            <span className="font-mono text-[#FF6B35] mr-2">02</span>
            <span className="text-[#F5F5F5] font-medium">Evidence before explanation</span>
          </div>
          <div>
            <span className="font-mono text-[#FF6B35] mr-2">03</span>
            <span className="text-[#F5F5F5] font-medium">Human review, always</span>
          </div>
        </div>
      </section>

      {/* Section 01: The Response Problem */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <div className="text-xs font-mono text-[#737373]">
            01 / THE RESPONSE PROBLEM
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
            A response can stop a threat. It can also stop a service.
          </h2>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
            An alert alone does not explain operational consequences. A confident narrative does not validate a response. GARDA-SIM AI connects evidence, hypothetical actions and virtual dependencies before explicit human review.
          </p>
        </div>
      </section>

      {/* Section 02: Four Layers */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030] bg-[#1A1A1A]">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <div className="text-xs font-mono text-[#FF6B35]">
            KNOW WHAT YOU ARE READING
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
            Four layers. No blurred boundaries.
          </h2>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-4xl leading-relaxed">
            Synthetic Evidence — fictional source observations. Derived Assessment — interpretations, not facts. AI-Generated Explanation — a narrative specimen with unverified provider integration. Policy Validation — a separately proposed deterministic layer, not an AI assertion.
          </p>
        </div>
      </section>

      {/* Section 03: Connected Workspace (8 Capabilities) */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <div>
            <div className="text-xs font-mono text-[#737373]">
              03 / A CONNECTED WORKSPACE
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] mt-1">
              Investigate. Compare. Review.
            </h2>
            <p className="text-sm text-[#A3A3A3] mt-2">
              Eight capabilities for examining decisions in a bounded synthetic environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/app/incidents" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">01 / Incidents → Incident detail</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Incident investigation</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Trace a synthetic incident from identity to affected virtual services.
              </p>
            </Link>

            <Link href="/app/evidence" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">02 / Evidence & Timeline</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Evidence & timeline</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Keep source events, derived assessments and explanations distinct.
              </p>
            </Link>

            <Link href="/app/simulator" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">03 / Response Simulator</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Strategy comparison</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Compare hypothetical responses against explicit assumptions.
              </p>
            </Link>

            <Link href="/app/digital-twin" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">04 / IT/OT Digital Twin</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">IT/OT dependencies</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Follow virtual service dependencies and examine possible propagation.
              </p>
            </Link>

            <Link href="/app/recommendations" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">05 / AI Recommendations</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Explainable AI</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Read an explanation with evidence references and uncertainty.
              </p>
            </Link>

            <Link href="/app/settings" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">06 / Settings → Safety policies</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Policy validation</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Inspect a proposed deterministic boundary, separate from AI.
              </p>
            </Link>

            <Link href="/app/experiments" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">07 / Experiments & Evaluation</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Experiments</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Configure rule-based, AI-only and constrained approaches.
              </p>
            </Link>

            <Link href="/app/reports" className="bg-[#252525] border border-[#383838] rounded-xl p-5 hover:border-[#FF6B35] transition-colors block">
              <span className="text-[11px] font-mono text-[#737373]">08 / Reports / Audit Trail</span>
              <h3 className="text-sm font-semibold text-[#F5F5F5] mt-2">Reports & audit</h3>
              <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
                Inspect sample reporting and traceable synthetic event context.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Section 04: How It Works */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="text-xs font-mono text-[#737373]">
            04 / HOW IT WORKS
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
            Evidence to a human decision.
          </h2>

          <div className="space-y-4 text-xs md:text-sm text-[#A3A3A3] max-w-3xl leading-relaxed font-mono">
            <div>1. Scenario — Choose INC-2026-0042 and the bounded virtual environment. <span className="text-[#737373]">[Incident context]</span></div>
            <div>2. Evidence — Inspect EV-0042-01 through EV-0042-03 and their provenance. <span className="text-[#737373]">[Synthetic Evidence]</span></div>
            <div>3. Candidates — Define session revocation, access restriction or more verification. <span className="text-[#737373]">[Candidate strategies]</span></div>
            <div>4. Impact — Compare possible security benefit and virtual service disruption. <span className="text-[#737373]">[Derived Assessment]</span></div>
            <div>5. Policy — Inspect proposed constraint checks, independent of generated text. <span className="text-[#737373]">[Policy Validation]</span></div>
            <div>6. Review — A person approves for demonstration, rejects or asks for evidence. <span className="text-[#737373]">[Human review]</span></div>
          </div>
        </div>
      </section>

      {/* Section 05: Illustrative Comparison */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030] bg-[#1A1A1A]">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div>
            <div className="text-xs font-mono text-[#737373]">
              05 / ILLUSTRATIVE COMPARISON — NOT A RECORDED RUN
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] mt-1">
              Not just “what works,” but “what changes?”
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2">
              Evidence: EV-0042-01 / EV-0042-02 / EV-0042-03. All ratings are assumptions for layout comparison; no actual policy evaluation occurred.
            </p>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                  <th className="pb-3 font-medium">STRATEGY</th>
                  <th className="pb-3 font-medium">SECURITY BENEFIT</th>
                  <th className="pb-3 font-medium">SERVICE IMPACT</th>
                  <th className="pb-3 font-medium">POLICY SPECIMEN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                <tr>
                  <td className="py-3 text-[#F5F5F5]">Session revocation</td>
                  <td className="py-3 text-[#A3A3A3]">Moderate · assumed</td>
                  <td className="py-3 text-[#A3A3A3]">Low · assumed</td>
                  <td className="py-3 text-[#4ADE80]">Illustrative pass</td>
                </tr>
                <tr>
                  <td className="py-3 text-[#F5F5F5]">Virtual access restriction</td>
                  <td className="py-3 text-[#A3A3A3]">Moderate · assumed</td>
                  <td className="py-3 text-[#A3A3A3]">Medium · assumed</td>
                  <td className="py-3 text-[#4ADE80]">Illustrative pass</td>
                </tr>
                <tr>
                  <td className="py-3 text-[#F5F5F5]">Simulated asset isolation</td>
                  <td className="py-3 text-[#A3A3A3]">Broad containment</td>
                  <td className="py-3 text-[#A3A3A3]">High · assumed</td>
                  <td className="py-3 text-[#F87171]">Illustrative fail · POL-01</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
            <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
              SIMULATION ONLY
            </span>
            Results are simulated estimates, not guarantees of real-world outcomes.
          </div>
        </div>
      </section>

      {/* Section 06: Safety Boundary */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <div className="text-xs font-mono text-[#737373]">
            06 / THE SAFETY BOUNDARY
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
            AI explains. Constraints are separate. People decide.
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-4xl leading-relaxed">
            No production path: synthetic incidents, virtual IT/OT assets and hypothetical actions only. Nothing connects to or changes a real environment. A proposed deterministic layer: policy definitions are explicit design artifacts. Server-side validation, fail-closed behavior and authorization require implementation. Review stays visible: Pending Review is the default. No generated explanation constitutes permission to act.
          </p>
        </div>
      </section>

      {/* Section 07: Research Plan */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030] bg-[#1A1A1A]">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <div className="text-xs font-mono text-[#737373]">
            07 / RESEARCH, NOT A PERFORMANCE CLAIM
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
            Three approaches. One transparent evaluation plan.
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-4xl leading-relaxed">
            A / Rule-based — predefined mappings; inspect rule coverage and missing context. B / AI-only — narrative-led proposal; inspect evidence grounding and unsupported actions. C / Simulation + constraints — hypothetical impact plus policy checks; inspect assumptions and constraint handling. No experiment run yet. No comparative results, measured improvements or superiority claims are available.
          </p>
        </div>
      </section>

      {/* Section 08: Scope & Limitations */}
      <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-4">
          <div className="text-xs font-mono text-[#737373]">
            08 / QUESTIONS BEFORE YOU BEGIN
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
            Clear scope. Clear limitations.
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-3xl leading-relaxed">
            Does this connect to production? No. Every incident and asset is synthetic or virtual. Can AI execute a response? No. Explanations do not authorize actions; human review is explicit. Are the example results measured? No. Comparisons are illustrative, not recorded experiments.
          </p>
          <div className="pt-2">
            <Link href="/faq" className="text-xs text-[#FF6B35] underline hover:text-[#FF8255]">
              View all FAQs ↗
            </Link>
          </div>
        </div>
      </section>

      {/* Section 09: Explore the Design CTA */}
      <section className="px-6 md:px-12 lg:px-16 py-20 border-b border-[#303030] bg-[#202020]">
        <div className="max-w-[1440px] mx-auto space-y-4 text-center">
          <div className="text-xs font-mono text-[#737373]">
            09 / EXPLORE THE DESIGN
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5F5F5]">
            Make the reasoning visible.
          </h2>
          <p className="text-sm text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
            Enter a bounded simulation workspace. Examine the evidence, the tradeoffs and the limits. Research prototype; no subscription or availability commitment.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/app"
              className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors"
            >
              Get Started
            </Link>
            <Link
              href="/docs"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Read the documentation
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
