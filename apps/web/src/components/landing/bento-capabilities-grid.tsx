"use client";

import * as React from "react";
import Link from "next/link";
import {
  Compass,
  Network,
  ShieldCheck,
  FileSearch,
  Cpu,
  Lock,
  FlaskConical,
  ScrollText,
  ArrowUpRight,
  Activity,
  Layers,
} from "lucide-react";

export function BentoCapabilitiesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
      {/* 01. Response Simulator - Featured Card (7 cols on lg) */}
      <Link
        href="/app/simulator"
        className="lg:col-span-7 bg-[#202020] border border-[#383838] rounded-2xl p-6 lg:p-8 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg flex flex-col justify-between space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
              <Compass className="w-4 h-4 text-[#FF6B35]" /> 01 / RESPONSE SIMULATOR
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-[#737373] group-hover:text-white group-hover:bg-[#FF6B35] transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#F5F5F5] group-hover:text-white transition-colors">
              Multi-Candidate Strategy Comparison
            </h3>
            <p className="text-sm text-[#A3A3A3] mt-2 leading-relaxed">
              Compare hypothetical defensive actions against explicit operational assumptions.
              Simulate collateral service downtime, security efficacy, and deterministic safety checks before touching production.
            </p>
          </div>
        </div>

        {/* Mini Specimen Visual */}
        <div className="p-3.5 rounded-xl bg-[#171717] border border-[#2E2E2E] space-y-2 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#737373]">
            <span>INC-2026-0042 STRATEGIES</span>
            <span className="text-[#4ADE80]">POLICY READY</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded bg-[#222222] border border-[#303030] flex items-center justify-between">
              <span className="text-[#D4D4D4]">STRAT-A (Isolation)</span>
              <span className="text-[#F87171] font-semibold">BLOCKED · POL-01</span>
            </div>
            <div className="p-2 rounded bg-[#222222] border border-[#303030] flex items-center justify-between">
              <span className="text-[#D4D4D4]">STRAT-B (Revocation)</span>
              <span className="text-[#4ADE80] font-semibold">PASS · 15m DOWNTIME</span>
            </div>
          </div>
        </div>
      </Link>

      {/* 02. IT/OT Virtual Digital Twin - Featured Card (5 cols on lg) */}
      <Link
        href="/app/digital-twin"
        className="lg:col-span-5 bg-[#202020] border border-[#383838] rounded-2xl p-6 lg:p-8 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg flex flex-col justify-between space-y-6"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
              <Network className="w-4 h-4 text-[#38BDF8]" /> 02 / DIGITAL TWIN
            </span>
            <span className="w-7 h-7 rounded-lg bg-[#2A2A2A] flex items-center justify-center text-[#737373] group-hover:text-white group-hover:bg-[#FF6B35] transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>

          <div>
            <h3 className="text-xl font-bold text-[#F5F5F5] group-hover:text-white transition-colors">
              IT/OT Dependency Topology
            </h3>
            <p className="text-sm text-[#A3A3A3] mt-2 leading-relaxed">
              Trace directional dependency propagation between identity boundaries, application gateways, and physical OT controller sensors.
            </p>
          </div>
        </div>

        {/* Mini Dependency Node Chain */}
        <div className="p-3.5 rounded-xl bg-[#171717] border border-[#2E2E2E] flex items-center justify-between font-mono text-[10px]">
          <span className="px-2 py-1 rounded bg-[#252525] text-[#38BDF8] border border-[#333]">
            IDENTITY-SVC
          </span>
          <span className="text-[#555]">→</span>
          <span className="px-2 py-1 rounded bg-[#252525] text-[#FF6B35] border border-[#333]">
            APP-GW-02
          </span>
          <span className="text-[#555]">→</span>
          <span className="px-2 py-1 rounded bg-[#252525] text-[#4ADE80] border border-[#333]">
            OT-CTRL-01
          </span>
        </div>
      </Link>

      {/* 03. Incident Investigation (4 cols on lg) */}
      <Link
        href="/app/incidents"
        className="lg:col-span-4 bg-[#202020] border border-[#383838] rounded-2xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
            <Activity className="w-4 h-4 text-[#FBBF24]" /> 03 / INCIDENTS
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F5F5F5]">Incident Investigation</h3>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Correlate synthetic observations from identity abuse to affected operational plant services.
          </p>
        </div>
        <div className="text-[10px] font-mono text-[#737373] pt-2 border-t border-[#2B2B2B]">
          INC-2026-0042 · HIGH SEVERITY
        </div>
      </Link>

      {/* 04. Evidence & Forensics (4 cols on lg) */}
      <Link
        href="/app/evidence"
        className="lg:col-span-4 bg-[#202020] border border-[#383838] rounded-2xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
            <FileSearch className="w-4 h-4 text-[#38BDF8]" /> 04 / EVIDENCE & FORENSICS
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F5F5F5]">Evidence & Timeline</h3>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Keep source factual events, derived graph assessments, and AI narrative distinct without confusion.
          </p>
        </div>
        <div className="text-[10px] font-mono text-[#737373] pt-2 border-t border-[#2B2B2B]">
          EV-0042-01 · SHA-256 VERIFIED
        </div>
      </Link>

      {/* 05. Explainable AI & Human Review (4 cols on lg) */}
      <Link
        href="/app/recommendations"
        className="lg:col-span-4 bg-[#202020] border border-[#383838] rounded-2xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
            <Cpu className="w-4 h-4 text-[#A78BFA]" /> 05 / EXPLAINABLE AI
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F5F5F5]">Human-In-The-Loop AI</h3>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Read AI explanations with evidence citations, uncertainty scores (0.82), and human sign-off gates.
          </p>
        </div>
        <div className="text-[10px] font-mono text-[#737373] pt-2 border-t border-[#2B2B2B]">
          PENDING REVIEW BY DEFAULT
        </div>
      </Link>

      {/* 06. Deterministic Safety Gate (4 cols on lg) */}
      <Link
        href="/app/settings"
        className="lg:col-span-4 bg-[#202020] border border-[#383838] rounded-2xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
            <Lock className="w-4 h-4 text-[#4ADE80]" /> 06 / POLICY GATES
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F5F5F5]">Deterministic Policies</h3>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Enforce hardcoded invariants (SEC-OT-01 to SEC-OT-05) that AI text cannot override or bypass.
          </p>
        </div>
        <div className="text-[10px] font-mono text-[#737373] pt-2 border-t border-[#2B2B2B]">
          FAIL-CLOSED ENFORCEMENT
        </div>
      </Link>

      {/* 07. Evaluation Experiments (4 cols on lg) */}
      <Link
        href="/app/experiments"
        className="lg:col-span-4 bg-[#202020] border border-[#383838] rounded-2xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
            <FlaskConical className="w-4 h-4 text-[#FBBF24]" /> 07 / EXPERIMENTS
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F5F5F5]">Research Benchmarking</h3>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Configure rule-based heuristics, AI-only prompts, and constrained simulation approaches.
          </p>
        </div>
        <div className="text-[10px] font-mono text-[#737373] pt-2 border-t border-[#2B2B2B]">
          TRANSPARENT EVALUATION
        </div>
      </Link>

      {/* 08. Cryptographic Audit Trail (4 cols on lg) */}
      <Link
        href="/app/audit-trail"
        className="lg:col-span-4 bg-[#202020] border border-[#383838] rounded-2xl p-6 hover:border-[#FF6B35] transition-all transform hover:-translate-y-1 block group shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-[#737373] group-hover:text-[#FF6B35] transition-colors flex items-center gap-1.5 font-bold">
            <ScrollText className="w-4 h-4 text-[#38BDF8]" /> 08 / AUDIT & REPORTS
          </span>
          <ArrowUpRight className="w-4 h-4 text-[#737373] group-hover:text-white transition-colors" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#F5F5F5]">Immutable Audit Trail</h3>
          <p className="text-xs text-[#A3A3A3] mt-1.5 leading-relaxed">
            Inspect sample reporting and traceable synthetic event provenance with SHA-256 hashes.
          </p>
        </div>
        <div className="text-[10px] font-mono text-[#737373] pt-2 border-t border-[#2B2B2B]">
          STRUCTURED JSON / MD EXPORT
        </div>
      </Link>
    </div>
  );
}
