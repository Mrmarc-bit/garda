"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { HeroInteractivePreview } from "@/components/landing/hero-interactive-preview";
import { ResponseDilemmaVisualizer } from "@/components/landing/response-dilemma-visualizer";
import { BentoCapabilitiesGrid } from "@/components/landing/bento-capabilities-grid";
import { ScopeLimitationsVisualizer } from "@/components/landing/scope-limitations-visualizer";
import { SmoothScrollProvider } from "@/components/motion/smooth-scroll-provider";
import { CyberConstellation3D } from "@/components/motion/cyber-constellation-3d";

export default function LandingPage() {
  return (
    <SmoothScrollProvider>
      <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased selection:bg-[#FF6B35]/30 selection:text-white">
        <PublicHeader />

        {/* ========================================================================= */}
        {/* SECTION 1: HERO — The Hook & Interactive Digital Twin Preview             */}
        {/* ========================================================================= */}
        <section className="relative px-6 md:px-12 lg:px-16 pt-16 pb-20 md:pt-20 md:pb-24 lg:pt-24 lg:pb-28 border-b border-[#303030] overflow-hidden">
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
                  className="bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-lg hover:bg-[#FF8255] transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-2 shadow-lg shadow-[#FF6B35]/20 font-sans"
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
        <section className="px-6 md:px-12 lg:px-16 py-6 md:py-8 border-b border-[#303030] bg-[#1E1E1E]">
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
        {/* SECTION 2: THE DILEMMA — Threat Stopped vs Service Killed                 */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-32 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-8 md:space-y-10">
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                01 / THE RESPONSE DILEMMA
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                A response can stop a threat. It can also stop a service.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
                An alert alone does not explain operational consequences. Blind host containment neutralizes attackers, but risks catastrophic plant telemetry blackouts. GARDA-SIM connects dependencies before human review.
              </p>
            </div>

            {/* Interactive Response Dilemma Simulator Component */}
            <ResponseDilemmaVisualizer />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: THE CAPABILITIES — Modern Asymmetric Bento Grid                */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-32 border-b border-[#303030] bg-[#1A1A1A]">
          <div className="max-w-[1440px] mx-auto space-y-8 md:space-y-10">
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                02 / BOUNDED SIMULATION WORKSPACE
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                Eight capabilities. Zero real-world risk.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
                Explore an integrated defensive environment designed for incident investigation, impact modeling, and transparent human review.
              </p>
            </div>

            {/* Modern Asymmetric Bento Grid Component */}
            <BentoCapabilitiesGrid />
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: TRUST, SAFETY GUARANTEES & EXPLORE CTA                         */}
        {/* ========================================================================= */}
        <section className="px-6 md:px-12 lg:px-16 py-20 md:py-28 lg:py-32 border-b border-[#303030]">
          <div className="max-w-[1440px] mx-auto space-y-14">
            <div className="space-y-3">
              <div className="text-xs font-mono text-[#737373] tracking-wider uppercase">
                03 / SAFETY GUARANTEES & SCOPE
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                AI explains. Constraints are separate. People decide.
              </h2>
              <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
                Every incident and asset is synthetic. Deterministic fail-closed policy checks operate independently of generative text, requiring mandatory human sign-off.
              </p>
            </div>

            {/* 3 Interactive Boundary Cards */}
            <ScopeLimitationsVisualizer />

            {/* Clean Direct Action CTA Box */}
            <div className="bg-[#202020] border border-[#383838] rounded-2xl p-8 md:p-12 text-center space-y-5 shadow-2xl relative overflow-hidden">
              <div className="space-y-3 max-w-2xl mx-auto">
                <div className="text-xs font-mono text-[#FF6B35] tracking-wider uppercase font-bold">
                  EXPLORE THE DESIGN
                </div>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#F5F5F5]">
                  Make the reasoning visible.
                </h3>
                <p className="text-sm md:text-base text-[#A3A3A3] leading-relaxed">
                  Enter a bounded simulation workspace. Examine the evidence, the tradeoffs and the limits. Research prototype; no subscription or availability commitment.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
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
          </div>
        </section>

        <PublicFooter />
      </div>
    </SmoothScrollProvider>
  );
}
