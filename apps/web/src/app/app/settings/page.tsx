"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = React.useState<"general" | "environment" | "ai" | "safety" | "privacy">("general");

  return (
    <AppLayout breadcrumb="Workspace / Settings">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/settings
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Settings
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Configuration reference. Unsupported controls are read-only or not connected; nothing is saved.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          className={`pb-2.5 transition-colors ${
            activeTab === "general"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("environment")}
          className={`pb-2.5 transition-colors ${
            activeTab === "environment"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Environment
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`pb-2.5 transition-colors ${
            activeTab === "ai"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          AI & explanations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("safety")}
          className={`pb-2.5 transition-colors ${
            activeTab === "safety"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Safety policies
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("privacy")}
          className={`pb-2.5 transition-colors ${
            activeTab === "privacy"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Privacy & export
        </button>
      </div>

      {/* Row 1: General & Environment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Card: General */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4">
              General
            </h2>
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
              <span className="block text-[11px] text-[#737373]">
                Workspace name · read-only
              </span>
              <span className="text-xs text-[#F5F5F5] font-medium mt-0.5 block">
                Simulation Lab
              </span>
            </div>

            <div className="space-y-2 text-xs mt-4">
              <div>
                <span className="text-[#A3A3A3]">Time display / </span>
                <span className="font-mono text-[#F5F5F5]">UTC · read-only</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Theme / </span>
                <span className="text-[#F5F5F5]">Charcoal · specified</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-[#737373] mt-6">
            · Not connected
          </div>
        </div>

        {/* Card: Environment & dataset */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4">
              Environment & dataset
            </h2>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[#A3A3A3]">Mode / </span>
                <span className="text-[#F5F5F5]">Synthetic only</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Dataset / </span>
                <span className="font-mono text-[#F5F5F5]">1 incident / 3 events</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Topology / </span>
                <span className="font-mono text-[#F5F5F5]">6 virtual assets</span>
              </div>
            </div>
          </div>
          <div className="text-xs text-[#737373] mt-6 leading-relaxed">
            Dataset import and topology editing are unavailable. Do not supply production data.
          </div>
        </div>
      </div>

      {/* Row 2: AI provider & Human review */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Card: AI provider */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              AI provider
            </h2>
            <div className="text-xs text-[#FF6B35] font-mono mt-1">
              · Unavailable / integration unverified
            </div>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              Fallback: locally authored explanation specimens. No provider credentials or live model response.
            </p>

            <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 mt-4 flex items-center justify-between cursor-pointer">
              <div>
                <span className="block text-[11px] text-[#737373]">Explanation verbosity · specimen</span>
                <span className="text-xs text-[#F5F5F5] font-medium mt-0.5 block">Detailed</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[#737373]" />
            </div>
          </div>
          <div className="text-xs text-[#737373] mt-6">
            Connect provider — unavailable
          </div>
        </div>

        {/* Card: Human review */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Human review
            </h2>
            <div className="text-xs text-[#FF6B35] font-mono mt-1">
              · Required · read-only
            </div>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              Recommendations begin Pending Review. Demonstration decisions remain explicit; no automatic approval.
            </p>
          </div>
          <div className="text-xs text-[#737373] mt-6 leading-relaxed">
            Approved for Demonstration / Rejected / Requires More Evidence
          </div>
        </div>
      </div>

      {/* Full-width Card: Safety policy definitions */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
          POLICY VALIDATION / PROPOSED DETERMINISTIC LAYER
        </div>
        <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-4">
          Safety policy definitions
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                <th className="pb-3 font-medium">POLICY</th>
                <th className="pb-3 font-medium">DEFINITION</th>
                <th className="pb-3 font-medium">STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40">
              <tr>
                <td className="py-3.5 font-mono text-[#F5F5F5]">POL-01</td>
                <td className="py-3.5 text-[#F5F5F5]">Preserve MONITOR-01 observability</td>
                <td className="py-3.5 text-[#737373]">Read-only / not evaluated</td>
              </tr>
              <tr>
                <td className="py-3.5 font-mono text-[#F5F5F5]">POL-02</td>
                <td className="py-3.5 text-[#F5F5F5]">Require human review before demonstration action</td>
                <td className="py-3.5 text-[#737373]">Read-only / not evaluated</td>
              </tr>
              <tr>
                <td className="py-3.5 font-mono text-[#F5F5F5]">POL-03</td>
                <td className="py-3.5 text-[#F5F5F5]">Do not isolate OT-CONTROLLER-SIM-01</td>
                <td className="py-3.5 text-[#737373]">Read-only / not evaluated</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-xs text-[#737373] mt-4">
          Validation must be implemented separately from AI. Definitions do not demonstrate correct enforcement.
        </div>
      </div>

      {/* Card: Privacy & export */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          Privacy & export
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
          Use synthetic content only. Retention, deletion, access requests and export authorization require a future implementation and reviewed privacy notice.
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs">
          <button type="button" className="text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors">
            Export workspace
          </button>
          <button type="button" className="text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors">
            Delete workspace data
          </button>
        </div>
      </div>

      {/* Card: Prototype limitations */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-4">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Prototype limitations / visual version 0.1
        </h2>
        <p className="text-xs text-[#737373] mt-1 leading-relaxed">
          Version label describes this design, not deployed software. No persistence, AI integration, safety computation, production connection or export service is verified.
        </p>
      </div>

      <div className="text-xs text-[#737373] mt-5">
        Save settings — not connected
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
