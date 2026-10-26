import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function FeaturesPage() {
  const capabilities = [
    {
      num: "CAPABILITY 01",
      title: "Incident investigation",
      subtitle: "Trace a synthetic incident from identity to affected virtual services.",
      desc: "Inspect identity, severity, status and operational context for INC-2026-0042. Preserve uncertainty rather than treating confidence as truth.",
      linkText: "Incidents → Incident detail ↗",
      linkHref: "/app/incidents/INC-2026-0042",
      tag: "INVESTIGATE / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 02",
      title: "Evidence & timeline",
      subtitle: "Keep source events, derived assessments and explanations distinct.",
      desc: "Search three stable evidence records, inspect their UTC order and open raw synthetic events with source labels.",
      linkText: "Evidence & Timeline ↗",
      linkHref: "/app/evidence",
      tag: "EVIDENCE / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 03",
      title: "Strategy comparison",
      subtitle: "Compare hypothetical responses against explicit assumptions.",
      desc: "Explore session revocation, access restriction, further verification and optional virtual isolation with explicit assumptions.",
      linkText: "Response Simulator ↗",
      linkHref: "/app/simulator",
      tag: "SIMULATE / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 04",
      title: "IT/OT dependencies",
      subtitle: "Follow virtual service dependencies and examine possible propagation.",
      desc: "Trace APP-GW-02 through six virtual assets. Arrows always mean A depends on B.",
      linkText: "IT/OT Digital Twin ↗",
      linkHref: "/app/digital-twin",
      tag: "DEPENDENCIES / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 05",
      title: "Explainable AI",
      subtitle: "Read an explanation with evidence references and uncertainty.",
      desc: "Separate the generated narrative from source facts. Evidence references and unknowns remain visible beside human review.",
      linkText: "AI Recommendations ↗",
      linkHref: "/app/recommendations",
      tag: "EXPLAIN / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 06",
      title: "Policy validation",
      subtitle: "Inspect a proposed deterministic boundary, separate from AI.",
      desc: "Read policy definitions and illustrative pass/fail specimens. Actual validation must be implemented outside the AI layer.",
      linkText: "Settings → Safety policies ↗",
      linkHref: "/app/settings",
      tag: "CONSTRAIN / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 07",
      title: "Experiments",
      subtitle: "Configure rule-based, AI-only and constrained approaches.",
      desc: "Configure dataset, scenario and methods A/B/C. No experiment run yet; no fabricated results or performance claims.",
      linkText: "Experiments & Evaluation ↗",
      linkHref: "/app/experiments",
      tag: "EVALUATE / SYNTHETIC CONTENT ONLY",
    },
    {
      num: "CAPABILITY 08",
      title: "Reports & audit",
      subtitle: "Inspect sample reporting and traceable synthetic event context.",
      desc: "Review sample report structure and synthetic audit events. Export and persistence are not connected.",
      linkText: "Reports / Audit Trail ↗",
      linkHref: "/app/reports",
      tag: "REVIEW / SYNTHETIC CONTENT ONLY",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Hero Header matching docs ui/Public ·/features · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            PRODUCT GUIDE / /features
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            A connected path from evidence to review.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            Eight capabilities for examining defensive responses in a bounded, synthetic environment.
          </p>
        </div>
      </section>

      {/* 8 Capabilities Grid (2 columns on md/lg) */}
      <section className="px-6 md:px-12 lg:px-16 py-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.num}
              className="bg-[#202020] border border-[#383838] rounded-xl p-6 flex flex-col justify-between hover:border-[#FF6B35]/60 transition-colors shadow-sm"
            >
              <div className="space-y-3">
                <div className="text-[11px] font-mono font-bold text-[#FF6B35] tracking-wider uppercase">
                  {cap.num}
                </div>
                <h2 className="text-xl font-bold text-[#F5F5F5]">
                  {cap.title}
                </h2>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  {cap.subtitle}
                </p>

                <div className="pt-2 border-b border-[#303030]" />

                <p className="text-xs text-[#8A8A8A] leading-relaxed pt-1">
                  {cap.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#303030] flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={cap.linkHref}
                  className="text-xs text-[#F5F5F5] hover:text-[#FF6B35] transition-colors font-medium inline-flex items-center gap-1"
                >
                  {cap.linkText}
                </Link>

                <span className="font-mono text-[10px] text-[#A3A3A3] bg-[#282828] px-2.5 py-1 rounded border border-[#383838]">
                  {cap.tag}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scope Notice & CTA matching Figma */}
      <section className="px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-[1440px] mx-auto bg-[#202020] border border-[#383838] rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <p className="text-xs text-[#A3A3A3] max-w-2xl leading-relaxed">
            <strong className="text-[#F5F5F5]">Design scope:</strong> All capabilities shown are editable visual specifications. No functional operation is implied.
          </p>

          <Link
            href="/app"
            className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors shrink-0 shadow-sm"
          >
            Explore the Simulation Lab
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
