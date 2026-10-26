import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function AboutPage() {
  const principles = [
    {
      name: "Evidence first",
      meaning: "Stable source IDs and UTC timestamps remain visible.",
    },
    {
      name: "Explicit uncertainty",
      meaning: "0.82 is illustrative confidence, not calibrated probability.",
    },
    {
      name: "Separate responsibilities",
      meaning: "AI explanation and deterministic policy validation are distinct.",
    },
    {
      name: "Human oversight",
      meaning: "Every recommendation starts Pending Review.",
    },
    {
      name: "Bounded scope",
      meaning: "Synthetic incidents and six virtual assets; no production path.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/about · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            PRODUCT GUIDE / /about
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            Better questions before a response.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
            GARDA-SIM AI is an AI-Assisted Cyber Defense Response Simulator: a defensive research prototype for studying decisions, evidence and operational tradeoffs.
          </p>
        </div>
      </section>

      {/* Mission & Target Audience */}
      <section className="px-6 md:px-12 lg:px-16 py-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-8">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-[#FF6B35] tracking-wider uppercase">
              MISSION
            </div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">
              Make response reasoning visible.
            </h2>
            <p className="text-sm text-[#A3A3A3] max-w-3xl leading-relaxed">
              A useful decision surface should expose what is known, what is inferred, what is generated and what still needs a person’s judgment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-2">
              <h3 className="text-base font-bold text-[#F5F5F5]">
                Security analysts
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Practice evidence review and compare hypothetical containment actions.
              </p>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-2">
              <h3 className="text-base font-bold text-[#F5F5F5]">
                Researchers & educators
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Study the structure of rule-based, AI-only and simulation-plus-constraint approaches.
              </p>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-2">
              <h3 className="text-base font-bold text-[#F5F5F5]">
                IT/OT stakeholders
              </h3>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Examine virtual dependencies without touching operational infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Principles Table */}
      <section className="px-6 md:px-12 lg:px-16 py-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="space-y-2">
            <div className="text-xs font-mono font-bold text-[#FF6B35] tracking-wider uppercase">
              DESIGN PRINCIPLES
            </div>
            <h2 className="text-2xl font-bold text-[#F5F5F5]">
              Precision without false certainty.
            </h2>
          </div>

          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-mono tracking-wider uppercase">
                  <th className="pb-3 font-medium w-1/3">PRINCIPLE</th>
                  <th className="pb-3 font-medium">WHAT IT MEANS IN THE DESIGN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/40">
                {principles.map((p) => (
                  <tr key={p.name}>
                    <td className="py-3.5 font-semibold text-[#F5F5F5]">{p.name}</td>
                    <td className="py-3.5 text-[#A3A3A3]">{p.meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Scope, Limitations & Research Callouts */}
      <section className="px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-[1440px] mx-auto space-y-6">
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-2">
            <h3 className="text-sm font-bold text-[#F5F5F5]">
              Prototype scope and limitations
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The design contains local synthetic content, illustrative comparisons and intended-state specimens. No organizational endorsements, team biographies, certifications or operational success claims are implied.
            </p>
          </div>

          <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
            <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
              A research artifact, not an operational defense system
            </span>
            Use the workspace to inspect assumptions. Do not use simulated estimates as guarantees or instructions for real environments.
          </div>

          <div className="flex justify-start pt-2">
            <Link
              href="/app"
              className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore the prototype workspace</span>
              <span>↗</span>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
