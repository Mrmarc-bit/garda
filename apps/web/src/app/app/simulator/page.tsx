"use client";

import * as React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown, Play, CheckSquare } from "lucide-react";

export default function ResponseSimulatorPage() {
  const [selectedCandidates, setSelectedCandidates] = React.useState<Record<string, boolean>>({
    session: true,
    access: true,
    verify: true,
    isolation: false,
  });

  const toggleCandidate = (key: string) => {
    setSelectedCandidates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AppLayout breadcrumb="Workspace / Response Simulator">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/simulator
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Response Simulator
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Inspect assumptions, service impact and constraints before human review. No real actions are available.
        </p>
      </div>

      {/* Primary Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 shadow-sm"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
          <span>Run Simulation</span>
        </button>
        <button
          type="button"
          onClick={() => setSelectedCandidates({ session: true, access: true, verify: true, isolation: false })}
          className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Ready State Callout Container with soft orange surface */}
      <div className="mt-6 bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-5">
        <div className="text-xs font-semibold text-[#F5F5F5]">
          Ready state · no simulation run yet
        </div>
        <p className="text-xs text-[#A3A3A3] mt-1">
          Results are simulated estimates, not guarantees of real-world outcomes. Run control is a visual affordance only.
        </p>
      </div>

      {/* Scenario Selector Dropdown Box */}
      <div className="mt-4 bg-[#252525] border border-[#383838] rounded-xl p-4 flex items-center justify-between cursor-pointer">
        <div>
          <span className="block text-[11px] text-[#737373]">Scenario selector</span>
          <span className="text-xs font-mono text-[#F5F5F5] mt-0.5 block">
            INC-2026-0042 — Suspicious Privilege Escalation
          </span>
        </div>
        <ChevronDown className="w-4 h-4 text-[#737373]" />
      </div>

      {/* 2-Column: Incident Context & Policy Constraints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Left Card: Incident summary */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-mono text-[#FF6B35]">
              INC-2026-0042
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5] mt-1">
              Suspicious Privilege Escalation
            </h2>

            <div className="flex items-center gap-3 text-xs mt-3">
              <span className="text-[#FBBF24]">· High</span>
              <span className="text-[#A3A3A3]">· Awaiting Review</span>
              <span className="text-[#A3A3A3]">· Simulation Lab</span>
            </div>

            <div className="space-y-1.5 text-xs mt-4">
              <div>
                <span className="text-[#A3A3A3]">Primary asset / </span>
                <span className="font-mono text-[#F5F5F5]">APP-GW-02</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Synthetic identity / </span>
                <span className="font-mono text-[#F5F5F5]">analyst-demo-03</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Evidence records / </span>
                <span className="font-mono text-[#F5F5F5]">3 · EV-0042-01-03</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-[#383838]">
            <div className="text-[11px] text-[#A3A3A3] mb-2">
              Illustrative confidence
            </div>
            <div className="w-full h-1.5 bg-[#171717] rounded-full overflow-hidden">
              <div className="h-full bg-[#FF6B35] rounded-full w-[82%]" />
            </div>
            <div className="font-mono text-xs text-[#A3A3A3] mt-2">
              0.82 / not calibrated probability
            </div>
          </div>
        </div>

        {/* Right Card: Constraint definitions */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              POLICY VALIDATION / PROPOSED LAYER
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5] mt-1 mb-4">
              Constraint definitions
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#F5F5F5]">
                <CheckSquare className="w-4 h-4 text-[#A3A3A3]" />
                <span className="font-mono">POL-01 · Preserve MONITOR-01 observability</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F5F5]">
                <CheckSquare className="w-4 h-4 text-[#A3A3A3]" />
                <span className="font-mono">POL-02 · Require explicit human review</span>
              </div>
              <div className="flex items-center gap-2 text-[#F5F5F5]">
                <CheckSquare className="w-4 h-4 text-[#A3A3A3]" />
                <span className="font-mono">POL-03 · Do not isolate OT-CONTROLLER-SIM-01</span>
              </div>
            </div>

            <p className="text-xs text-[#A3A3A3] mt-5 leading-relaxed">
              Definitions only. Deterministic validation and fail-closed execution require separate implementation.
            </p>
          </div>

          <div className="text-xs text-[#737373] mt-6">
            · Simulation Lab · 6 virtual assets
          </div>
        </div>
      </div>

      {/* Candidate Strategies Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#F5F5F5] mb-4">
          Candidate strategies
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Session revocation */}
          <div
            onClick={() => toggleCandidate("session")}
            className={`bg-[#252525] rounded-xl p-5 cursor-pointer transition-colors ${
              selectedCandidates.session ? "border border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCandidates.session}
                onChange={() => {}}
                className="accent-[#FF6B35]"
              />
              <span className="text-xs font-semibold text-[#F5F5F5]">
                Session revocation
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Revoke only the fictional elevated session. Preserve service and monitoring dependencies.
            </p>
            <div className="text-xs text-[#FF6B35] mt-4 font-mono">
              · Selected · hypothetical
            </div>
          </div>

          {/* Card 2: Virtual access restriction */}
          <div
            onClick={() => toggleCandidate("access")}
            className={`bg-[#252525] rounded-xl p-5 cursor-pointer transition-colors ${
              selectedCandidates.access ? "border border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCandidates.access}
                onChange={() => {}}
                className="accent-[#FF6B35]"
              />
              <span className="text-xs font-semibold text-[#F5F5F5]">
                Virtual access restriction
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Restrict the privileged route in the virtual gateway. May affect OPS-DASH-01.
            </p>
            <div className="text-xs text-[#FF6B35] mt-4 font-mono">
              · Selected · hypothetical
            </div>
          </div>

          {/* Card 3: Request more verification */}
          <div
            onClick={() => toggleCandidate("verify")}
            className={`bg-[#252525] rounded-xl p-5 cursor-pointer transition-colors ${
              selectedCandidates.verify ? "border border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCandidates.verify}
                onChange={() => {}}
                className="accent-[#FF6B35]"
              />
              <span className="text-xs font-semibold text-[#F5F5F5]">
                Request more verification
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Pause the proposal and ask for synthetic authorization context. Threat exposure may remain.
            </p>
            <div className="text-xs text-[#FF6B35] mt-4 font-mono">
              · Selected · hypothetical
            </div>
          </div>

          {/* Card 4: Simulated asset isolation */}
          <div
            onClick={() => toggleCandidate("isolation")}
            className={`bg-[#252525] rounded-xl p-5 cursor-pointer transition-colors ${
              selectedCandidates.isolation ? "border border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedCandidates.isolation}
                onChange={() => {}}
                className="accent-[#FF6B35]"
              />
              <span className="text-xs font-semibold text-[#F5F5F5]">
                Simulated asset isolation
              </span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Optional comparison candidate. Broad service disruption; preserve OT constraints.
            </p>
            <div className="text-xs text-[#737373] mt-4 font-mono">
              · Optional · not selected
            </div>
          </div>
        </div>
      </div>

      {/* Evidence and Assumptions */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          Evidence and assumptions
        </h2>
        <div className="font-mono text-xs text-[#A3A3A3] mt-2">
          EV-0042-01 / EV-0042-02 / EV-0042-03
        </div>
        <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
          One synthetic privileged session on APP-GW-02. OPS-DASH-01 depends on the gateway; MONITOR-01 must remain observable. No measured baseline or calibrated impact model is available.
        </p>
      </div>

      {/* No acceptable candidate — state specimen */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          No acceptable candidate — state specimen
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
          If every hypothetical candidate violates a constraint, stop and request more evidence or revise assumptions. Never auto-select a failing candidate.
        </p>
        <div className="mt-4">
          <Link
            href="/app/evidence"
            className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
          >
            Request More Evidence
          </Link>
        </div>
        <div className="text-xs text-[#737373] mt-4">
          Intended failure boundary; not a computed evaluation.
        </div>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
