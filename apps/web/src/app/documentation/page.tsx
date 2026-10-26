import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/documentation · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            DOCUMENTATION / /documentation
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            The model behind the workspace.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            A concise guide to the concepts, artifacts and boundaries used throughout GARDA-SIM AI.
          </p>
        </div>
      </section>

      {/* Two-Column Documentation Layout */}
      <section className="px-6 md:px-12 lg:px-16 py-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Sticky Table of Contents & Specimen Box */}
          <aside className="lg:col-span-4 sticky top-24 space-y-6">
            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6">
              <div className="text-xs font-mono font-bold text-[#737373] uppercase tracking-wider mb-4">
                CONTENTS
              </div>
              <nav className="space-y-2 text-xs">
                <a
                  href="#overview"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Product overview
                </a>
                <a
                  href="#concepts"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Simulator concepts
                </a>
                <a
                  href="#evidence"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Synthetic evidence
                </a>
                <a
                  href="#dependencies"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Dependencies
                </a>
                <a
                  href="#safety"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Safety model
                </a>
                <a
                  href="#workflows"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Supported workflows
                </a>
                <a
                  href="#limitations"
                  className="block text-[#A3A3A3] hover:text-[#FF6B35] transition-colors py-1"
                >
                  Limitations
                </a>
              </nav>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-5 space-y-1.5">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                Prototype documentation
              </div>
              <div className="text-[11px] text-[#A3A3A3]">
                Visual specification
              </div>
              <div className="font-mono text-[10px] text-[#FF6B35] pt-1">
                Local synthetic content only
              </div>
            </div>
          </aside>

          {/* Right Column: Documentation Panels 01 - 06 */}
          <main className="lg:col-span-8 space-y-8">
            {/* 01 Product Overview */}
            <div id="overview" className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                01 Product overview
              </h2>
              <p className="text-xs md:text-sm text-[#A3A3A3] leading-relaxed">
                The Simulation Lab connects an incident, a bounded event set and a virtual dependency model. Candidate strategies are hypothetical. No action is sent to a real service.
              </p>
              <div className="pt-2">
                <span className="font-mono text-xs text-[#FF6B35] bg-[#282828] px-3 py-1.5 rounded border border-[#383838] inline-block">
                  INC-2026-0042 · APP-GW-02 · analyst-demo-03
                </span>
              </div>
            </div>

            {/* 02 Simulator Concepts */}
            <div id="concepts" className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                02 Simulator concepts
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-mono tracking-wider uppercase">
                      <th className="pb-3 font-medium w-1/4">CONCEPT</th>
                      <th className="pb-3 font-medium">DEFINITION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#383838]/40">
                    <tr>
                      <td className="py-3 font-semibold text-[#F5F5F5]">Scenario</td>
                      <td className="py-3 text-[#A3A3A3]">A synthetic incident plus environment assumptions</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#F5F5F5]">Candidate</td>
                      <td className="py-3 text-[#A3A3A3]">A hypothetical response to compare, not an executable command</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#F5F5F5]">Impact</td>
                      <td className="py-3 text-[#A3A3A3]">An estimate under assumptions, not a measured outcome</td>
                    </tr>
                    <tr>
                      <td className="py-3 font-semibold text-[#F5F5F5]">Review</td>
                      <td className="py-3 text-[#A3A3A3]">An explicit human decision for demonstration only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 03 Synthetic Evidence */}
            <div id="evidence" className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                03 Synthetic evidence
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] tracking-wider uppercase font-medium">
                      <th className="pb-3 w-1/4">EVIDENCE</th>
                      <th className="pb-3 w-1/4">UTC</th>
                      <th className="pb-3">SYNTHETIC FACT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#383838]/40 text-xs">
                    <tr>
                      <td className="py-3 text-[#FF6B35]">EV-0042-01</td>
                      <td className="py-3 text-[#A3A3A3]">09:14:00</td>
                      <td className="py-3 text-[#F5F5F5] font-sans">Role elevation requested</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-[#FF6B35]">EV-0042-02</td>
                      <td className="py-3 text-[#A3A3A3]">09:14:08</td>
                      <td className="py-3 text-[#F5F5F5] font-sans">Privileged token issued</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-[#FF6B35]">EV-0042-03</td>
                      <td className="py-3 text-[#A3A3A3]">09:15:10</td>
                      <td className="py-3 text-[#F5F5F5] font-sans">Privileged route accessed</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 04 Dependencies */}
            <div id="dependencies" className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                04 Dependencies
              </h2>
              <p className="text-xs text-[#A3A3A3]">
                Directed graph rule: <strong className="text-[#F5F5F5]">A → B means A depends on B</strong>.
              </p>
              <div className="bg-[#252525] border border-[#383838] rounded-lg p-4 font-mono text-xs text-[#A3A3A3] space-y-1.5 leading-relaxed">
                <div>APP-GW-02 → IDENTITY-SVC-01</div>
                <div>OPS-DASH-01 → APP-GW-02</div>
                <div>OPS-DASH-01 → TELEMETRY-SIM-01</div>
                <div>TELEMETRY-SIM-01 → OT-CONTROLLER-SIM-01</div>
                <div>MONITOR-01 → APP-GW-02</div>
              </div>
            </div>

            {/* 05 Safety Model */}
            <div id="safety" className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                05 Safety model
              </h2>
              <p className="text-xs md:text-sm text-[#A3A3A3] leading-relaxed">
                Clear separation between observations, interpretation, narrative generation, and hard safety constraints:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#252525] border border-[#383838] rounded-lg p-3">
                  <span className="font-mono text-[#FF6B35] font-bold block mb-1">Synthetic Evidence</span>
                  <p className="text-[#A3A3A3]">Factual source observations from synthetic logs without inference.</p>
                </div>
                <div className="bg-[#252525] border border-[#383838] rounded-lg p-3">
                  <span className="font-mono text-[#FF6B35] font-bold block mb-1">Derived Assessment</span>
                  <p className="text-[#A3A3A3]">Interpretations with explicit confidence (e.g. 0.82 illustrative).</p>
                </div>
                <div className="bg-[#252525] border border-[#383838] rounded-lg p-3">
                  <span className="font-mono text-[#FF6B35] font-bold block mb-1">AI Explanation</span>
                  <p className="text-[#A3A3A3]">Generated narrative specimen; unverified provider integration.</p>
                </div>
                <div className="bg-[#252525] border border-[#383838] rounded-lg p-3">
                  <span className="font-mono text-[#FF6B35] font-bold block mb-1">Policy Validation</span>
                  <p className="text-[#A3A3A3]">Proposed deterministic rules (POL-01, POL-02, POL-03) outside AI.</p>
                </div>
              </div>
            </div>

            {/* 06 Supported Workflows */}
            <div id="workflows" className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-[#F5F5F5]">
                06 Supported workflows
              </h2>
              <div className="font-mono text-xs text-[#A3A3A3] space-y-2">
                <div>1. Inspect incident context and scope</div>
                <div>2. Review verified synthetic evidence records</div>
                <div>3. Define candidate defensive response strategies</div>
                <div>4. Compare estimated security and service impact</div>
                <div>5. Inspect deterministic safety constraints</div>
                <div>6. Request human operator demonstration review</div>
              </div>
            </div>

            {/* Limitations Callout */}
            <div id="limitations" className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
              <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
                LIMITATIONS & RESEARCH SCOPE
              </span>
              Results are simulated estimates, not guarantees of real-world outcomes. Do not execute commands in live production or OT networks.
            </div>
          </main>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
