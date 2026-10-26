"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { HeroInteractivePreview } from "@/components/landing/hero-interactive-preview";
import { ResponseDilemmaVisualizer } from "@/components/landing/response-dilemma-visualizer";
import { ArchitectureLayersVisualizer } from "@/components/landing/architecture-layers-visualizer";
import { BentoCapabilitiesGrid } from "@/components/landing/bento-capabilities-grid";
import { TimelineScrubber } from "@/components/landing/timeline-scrubber";
import { SafetyInterceptorTerminal } from "@/components/landing/safety-interceptor-terminal";
import { ResearchEvaluationMatrix } from "@/components/landing/research-evaluation-matrix";
import { ScopeLimitationsVisualizer } from "@/components/landing/scope-limitations-visualizer";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { CyberConstellation3D } from "@/components/motion/cyber-constellation-3d";

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased selection:bg-[#FF6B35]/30 selection:text-white">
        <PublicHeader />

        {/* ========================================================================= */}
        {/* ACT 1: HERO — The Hook & Instant Interactive Digital Twin Preview        */}
        {/* ========================================================================= */}
        <section className="relative px-6 md:px-12 lg:px-16 pt-16 pb-24 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 border-b border-[#303030] overflow-hidden">
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

          <div className="relative z-10 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
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
                  className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 shadow-lg shadow-[#FF6B35]/20 font-sans"
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
        <section className="px-6 md:px-12 lg:px-16 py-8 md:py-10 border-b border-[#303030] bg-[#1E1E1E]">
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

        {/* ========================================================================= */}
        {/* ACT 2: THE DILEMMA — Threat Stopped vs Service Killed                    */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-10 md:space-y-12">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                01 / THE RESPONSE DILEMMA
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                A response can stop a threat. It can also stop a service.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
                An alert alone does not explain operational consequences. Blind host containment neutralizes attackers, but risks catastrophic plant telemetry blackouts. GARDA-SIM connects evidence, hypothetical actions and virtual dependencies before explicit human review.
              </p>
            </div>

            {/* Interactive Response Dilemma Simulator Component */}
            <ResponseDilemmaVisualizer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ACT 3: THE DEFENSIVE ENGINE — 4 Layers with Zero Blurred Boundaries      */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36 border-b border-[#303030] bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto space-y-10 md:space-y-12">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#FF6B35] tracking-wider uppercase font-bold">
                02 / THE DEFENSIVE ARCHITECTURE
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
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

        {/* ========================================================================= */}
        {/* ACT 4: THE CAPABILITIES — Modern Asymmetric Bento Grid                   */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-10 md:space-y-12">
            <div>
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                03 / BOUNDED SIMULATION WORKSPACE
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5] mt-1">
                Eight capabilities. Zero real-world risk.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
                Explore an integrated defensive environment designed for incident investigation, impact modeling, and transparent human review.
              </p>
            </div>

            {/* Modern Asymmetric Bento Grid Component */}
            <BentoCapabilitiesGrid />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ACT 5: HOW IT WORKS — Interactive Forensic Timeline Scrubber             */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36 border-b border-[#303030] bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto space-y-10 md:space-y-12">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                04 / HOW IT WORKS
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                Evidence to a human decision.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
                Step through the six phases from synthetic scenario ingestion to human review, ensuring every recommendation is anchored in verifiable observations.
              </p>
            </div>

            {/* Interactive Timeline Scrubber with Live Forensics & Playback */}
            <TimelineScrubber />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ACT 6: THE SAFETY GATE — AI Explains. Code Enforces. People Decide.       */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-10 md:space-y-12">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                05 / THE SAFETY BOUNDARY
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
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

        {/* ========================================================================= */}
        {/* ACT 7: TRUST & SCOPE CENTER — Research Plan + FAQs & Invariants           */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-24 md:py-32 lg:py-36 border-b border-[#303030] bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto space-y-12">
            <div className="space-y-4">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                06 / TRUST, SCOPE & RESEARCH RIGOR
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                Clear scope. Clear limitations. Zero production path.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-4xl leading-relaxed">
                Every asset is bounded within an isolated synthetic sandbox. We evaluate responses transparently across rule-based heuristics, unconstrained generative models, and constrained simulation architectures.
              </p>
            </div>

            {/* 2-Part Trust & Scope Visual Deck */}
            <div className="space-y-10">
              {/* Part A: 3 Boundary Cards & Invariants */}
              <ScopeLimitationsVisualizer />

              {/* Part B: Transparent 3-Approach Evaluation Plan */}
              <ResearchEvaluationMatrix />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* ACT 8: EXPLORE THE DESIGN CTA — Direct Action                            */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-28 md:py-36 lg:py-40 border-b border-[#303030] bg-[#202020]">
          <div className="max-w-[1440px] mx-auto space-y-6 text-center">
            <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
              07 / EXPLORE THE DESIGN
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#F5F5F5]">
              Make the reasoning visible.
            </h2>
            <p className="text-sm md:text-base text-[#A3A3A3] max-w-xl mx-auto leading-relaxed">
              Enter a bounded simulation workspace. Examine the evidence, the tradeoffs and the limits. Research prototype; no subscription or availability commitment.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/app"
                className="bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-lg hover:bg-[#FF8255] transition-all transform hover:-translate-y-0.5 shadow-lg shadow-[#FF6B35]/20 font-sans"
              >
                Start Exploring ↗
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
