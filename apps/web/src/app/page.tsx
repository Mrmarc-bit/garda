"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { HeroInteractivePreview } from "@/components/landing/hero-interactive-preview";
import { ArchitectureLayersVisualizer } from "@/components/landing/architecture-layers-visualizer";
import { TimelineScrubber } from "@/components/landing/timeline-scrubber";
import { TradeoffComparisonMatrix } from "@/components/landing/tradeoff-comparison-matrix";
import { SafetyInterceptorTerminal } from "@/components/landing/safety-interceptor-terminal";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { CyberConstellation3D } from "@/components/motion/cyber-constellation-3d";

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased selection:bg-[#FF6B35]/30 selection:text-white">
        <PublicHeader />

        {/* Hero Section with Ambient 3D Three.js Constellation & Technical Grid */}
        <section className="relative px-6 md:px-12 lg:px-16 pt-12 pb-16 border-b border-[#303030] overflow-hidden">
          {/* Ambient Interactive 3D Three.js Constellation Canvas */}
          <div className="absolute inset-0 pointer-events-none opacity-40 z-0">
            <CyberConstellation3D nodeCount={36} interactive={true} />
          </div>

          {/* Subtle hairline technical grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20 z-0"
            style={{
              backgroundImage: "radial-gradient(#404040 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6 lg:pt-4">
              <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
                DEFENSIVE SIMULATION PLATFORM
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-5.5xl font-bold tracking-tight text-[#F5F5F5] leading-[1.12]">
                Before you respond, understand the impact.
              </h1>

              <p className="text-base md:text-lg text-[#A3A3A3] max-w-xl leading-relaxed">
                AI-assisted cyber defense, grounded in synthetic evidence. Explore response strategies and their possible service impact before a human makes the call.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/app"
                  className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 shadow-lg shadow-[#FF6B35]/20"
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

              <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase pt-4 flex flex-wrap gap-2">
                <span className="text-[#A3A3A3]">SYNTHETIC INCIDENTS</span>
                <span>/</span>
                <span className="text-[#A3A3A3]">VIRTUAL IT & OT</span>
                <span>/</span>
                <span className="text-[#A3A3A3]">HUMAN REVIEW</span>
              </div>
            </div>

            {/* Right Column (7 cols): Interactive Digital Twin Topology & Strategy Simulator */}
            <div className="lg:col-span-7">
              <HeroInteractivePreview />
            </div>
          </div>
        </section>

        {/* 3 Pillars Value Props Strip */}
        <section className="px-6 md:px-12 lg:px-16 py-6 border-b border-[#303030] bg-[#1E1E1E]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#A3A3A3]">
            <div className="flex items-center group">
              <span className="font-mono text-[#FF6B35] font-bold mr-2 group-hover:scale-110 transition-transform">01</span>
              <span className="text-[#F5F5F5] font-medium">Synthetic by design</span>
            </div>
            <div className="flex items-center group">
              <span className="font-mono text-[#FF6B35] font-bold mr-2 group-hover:scale-110 transition-transform">02</span>
              <span className="text-[#F5F5F5] font-medium">Evidence before explanation</span>
            </div>
            <div className="flex items-center group">
              <span className="font-mono text-[#FF6B35] font-bold mr-2 group-hover:scale-110 transition-transform">03</span>
              <span className="text-[#F5F5F5] font-medium">Human review, always</span>
            </div>
          </div>
        </section>

        {/* Section 01: The Response Problem */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-4">
            <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
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
          <div className="max-w-[1440px] mx-auto space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#FF6B35] tracking-wider uppercase font-bold">
                KNOW WHAT YOU ARE READING
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
                Four layers. No blurred boundaries.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-4xl leading-relaxed">
                <strong className="text-[#F5F5F5]">Synthetic Evidence</strong> — fictional source observations.{" "}
                <strong className="text-[#F5F5F5]">Derived Assessment</strong> — interpretations, not facts.{" "}
                <strong className="text-[#F5F5F5]">AI-Generated Explanation</strong> — a narrative specimen with unverified provider integration.{" "}
                <strong className="text-[#F5F5F5]">Policy Validation</strong> — a separately proposed deterministic layer, not an AI assertion.
              </p>
            </div>

            {/* Interactive Architectural Layers Visualizer Workbench */}
            <ArchitectureLayersVisualizer />
          </div>
        </section>

        {/* Section 03: Connected Workspace (8 Capabilities Grid - 2 columns matching Figma) */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-8">
            <div>
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                03 / A CONNECTED WORKSPACE
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] mt-1">
                Investigate. Compare. Review.
              </h2>
              <p className="text-sm text-[#A3A3A3] mt-2">
                Eight capabilities for examining decisions in a bounded synthetic environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/app/incidents"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  01 / Incidents → Incident detail ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Incident investigation</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Trace a synthetic incident from identity to affected virtual services.
                </p>
              </Link>

              <Link
                href="/app/evidence"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  02 / Evidence & Timeline ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Evidence & timeline</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Keep source events, derived assessments and explanations distinct.
                </p>
              </Link>

              <Link
                href="/app/simulator"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  03 / Response Simulator ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Strategy comparison</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Compare hypothetical responses against explicit assumptions.
                </p>
              </Link>

              <Link
                href="/app/digital-twin"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  04 / IT/OT Digital Twin ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">IT/OT dependencies</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Follow virtual service dependencies and examine possible propagation.
                </p>
              </Link>

              <Link
                href="/app/recommendations"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  05 / AI Recommendations ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Explainable AI</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Read an explanation with evidence references and uncertainty.
                </p>
              </Link>

              <Link
                href="/app/settings"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  06 / Settings → Safety policies ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Policy validation</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Inspect a proposed deterministic boundary, separate from AI.
                </p>
              </Link>

              <Link
                href="/app/experiments"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  07 / Experiments & Evaluation ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Experiments</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Configure rule-based, AI-only and constrained approaches.
                </p>
              </Link>

              <Link
                href="/app/reports"
                className="bg-[#202020] border border-[#383838] rounded-xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block space-y-2 group shadow-sm"
              >
                <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors">
                  08 / Reports / Audit Trail ↗
                </span>
                <h3 className="text-base font-bold text-[#F5F5F5]">Reports & audit</h3>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  Inspect sample reporting and traceable synthetic event context.
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 04: How It Works */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                04 / HOW IT WORKS
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
                Evidence to a human decision.
              </h2>
              <p className="text-sm text-[#A3A3A3] max-w-3xl leading-relaxed">
                Step through the six phases from synthetic scenario ingestion to human review, ensuring every recommendation is anchored in verifiable observations.
              </p>
            </div>

            {/* Interactive Timeline Scrubber with Live Forensics & Playback */}
            <TimelineScrubber />
          </div>
        </section>

        {/* Section 05: Illustrative Comparison */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030] bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto space-y-8">
            <div>
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                05 / ILLUSTRATIVE COMPARISON — NOT A RECORDED RUN
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5] mt-1">
                Not just “what works,” but “what changes?”
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-2">
                Evidence: EV-0042-01 / EV-0042-02 / EV-0042-03. All ratings are assumptions for layout comparison; no actual policy evaluation occurred.
              </p>
            </div>

            {/* Visual Matrix with Metric Gauges & Table Switcher */}
            <TradeoffComparisonMatrix />

            <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
              <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
                SIMULATION ONLY
              </span>
              Results are simulated estimates, not guarantees of real-world outcomes.
            </div>
          </div>
        </section>

        {/* Section 06: Safety Boundary (Structured into 3 distinct paragraphs matching Figma + Live Interceptor Terminal) */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-8">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                06 / THE SAFETY BOUNDARY
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
                AI explains. Constraints are separate. People decide.
              </h2>

              <div className="space-y-3 text-sm text-[#A3A3A3] max-w-4xl leading-relaxed">
                <p>
                  <strong className="text-[#F5F5F5]">No production path:</strong> synthetic incidents, virtual IT/OT assets and hypothetical actions only. Nothing connects to or changes a real environment.
                </p>
                <p>
                  <strong className="text-[#F5F5F5]">A proposed deterministic layer:</strong> policy definitions are explicit design artifacts. Server-side validation, fail-closed behavior and authorization require implementation.
                </p>
                <p>
                  <strong className="text-[#F5F5F5]">Review stays visible:</strong> Pending Review is the default. No generated explanation constitutes permission to act.
                </p>
              </div>
            </div>

            {/* Interactive Split Terminal Interceptor */}
            <SafetyInterceptorTerminal />
          </div>
        </section>

        {/* Section 07: Research Plan (Structured into 4 method points matching Figma) */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030] bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto space-y-6">
            <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
              07 / RESEARCH, NOT A PERFORMANCE CLAIM
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
              Three approaches. One transparent evaluation plan.
            </h2>

            <div className="space-y-3 text-sm text-[#A3A3A3] max-w-4xl leading-relaxed">
              <p>
                <strong className="text-[#F5F5F5]">A / Rule-based</strong> — predefined mappings; inspect rule coverage and missing context.
              </p>
              <p>
                <strong className="text-[#F5F5F5]">B / AI-only</strong> — narrative-led proposal; inspect evidence grounding and unsupported actions.
              </p>
              <p>
                <strong className="text-[#F5F5F5]">C / Simulation + constraints</strong> — hypothetical impact plus policy checks; inspect assumptions and constraint handling.
              </p>
              <p className="text-xs text-[#737373] pt-2 border-t border-[#303030]">
                No experiment run yet. No comparative results, measured improvements or superiority claims are available.
              </p>
            </div>
          </div>
        </section>

        {/* Section 08: Scope & Limitations (Structured into 3 distinct Q&As matching Figma) */}
        <section className="px-6 md:px-12 lg:px-16 py-16 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-6">
            <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
              08 / QUESTIONS BEFORE YOU BEGIN
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#F5F5F5]">
              Clear scope. Clear limitations.
            </h2>

            <div className="space-y-4 text-sm text-[#A3A3A3] max-w-3xl leading-relaxed">
              <div>
                <strong className="text-[#F5F5F5] block mb-1">Does this connect to production?</strong>
                <p className="text-xs text-[#A3A3A3]">No. Every incident and asset is synthetic or virtual.</p>
              </div>
              <div>
                <strong className="text-[#F5F5F5] block mb-1">Can AI execute a response?</strong>
                <p className="text-xs text-[#A3A3A3]">No. Explanations do not authorize actions; human review is explicit.</p>
              </div>
              <div>
                <strong className="text-[#F5F5F5] block mb-1">Are the example results measured?</strong>
                <p className="text-xs text-[#A3A3A3]">No. Comparisons are illustrative, not recorded experiments.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/faq" className="text-xs text-[#FF6B35] underline hover:text-[#FF8255] transition-colors">
                View all FAQs ↗
              </Link>
            </div>
          </div>
        </section>

        {/* Section 09: Explore the Design CTA */}
        <section className="px-6 md:px-12 lg:px-16 py-20 border-b border-[#303030] bg-[#202020]">
          <div className="max-w-[1440px] mx-auto space-y-4 text-center">
            <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
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
                className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#FF6B35]/20"
              >
                Get Started
              </Link>
              <Link
                href="/documentation"
                className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
              >
                Read the documentation
              </Link>
            </div>
          </div>
        </section>

        <PublicFooter />
      </div>
    </SmoothScrollProvider>
  );
}
