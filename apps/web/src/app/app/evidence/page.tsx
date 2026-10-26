"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown, X } from "lucide-react";

export default function EvidencePage() {
  const [selectedEvidenceId, setSelectedEvidenceId] = React.useState<string>("EV-0042-02");
  const [activeTab, setActiveTab] = React.useState<"timeline" | "logs" | "correlations">("timeline");

  const evidenceRecords: Record<
    string,
    {
      id: string;
      ts: string;
      source: string;
      title: string;
      desc: string;
      actor: string;
      asset: string;
      event: string;
      aiSpecimen: string;
    }
  > = {
    "EV-0042-01": {
      id: "EV-0042-01",
      ts: "2026-10-26 09:14:00 UTC",
      source: "IDENTITY-SVC-01",
      title: "Role elevation requested",
      desc: "analyst-demo-03 requested the synthetic privileged role for APP-GW-02.",
      actor: "analyst-demo-03",
      asset: "APP-GW-02",
      event: "role_elevation_requested",
      aiSpecimen: "Role elevation initiates the privileged access workflow. Source observation only.",
    },
    "EV-0042-02": {
      id: "EV-0042-02",
      ts: "2026-10-26 09:14:08 UTC",
      source: "IDENTITY-SVC-01",
      title: "Privileged token issued",
      desc: "IDENTITY-SVC-01 issued a synthetic privileged token to analyst-demo-03 for APP-GW-02.",
      actor: "analyst-demo-03",
      asset: "APP-GW-02",
      event: "privileged_token_issued",
      aiSpecimen:
        "The token issue may support elevated access. This is interpretation, not additional evidence. Provider integration unverified.",
    },
    "EV-0042-03": {
      id: "EV-0042-03",
      ts: "2026-10-26 09:15:10 UTC",
      source: "APP-GW-02",
      title: "Privileged route accessed",
      desc: "APP-GW-02 recorded synthetic access to /admin/config by analyst-demo-03.",
      actor: "analyst-demo-03",
      asset: "APP-GW-02",
      event: "privileged_route_accessed",
      aiSpecimen:
        "Administrative route access represents the sensitive endpoint invocation in the scenario sequence.",
    },
  };

  const current = evidenceRecords[selectedEvidenceId] || evidenceRecords["EV-0042-02"];

  return (
    <AppLayout breadcrumb="Workspace / Evidence & Timeline">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/evidence
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Evidence & Timeline
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Three synthetic source records. UTC sequence and provenance stay separate from interpretation.
        </p>
      </div>

      {/* 3 Filter Boxes matching Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-[#737373]">Search logs</span>
          <span className="text-xs font-mono text-[#F5F5F5] mt-1">INC-2026-0042</span>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Severity</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>All levels</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Event type</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>All types</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("timeline")}
          className={`pb-2.5 transition-colors ${
            activeTab === "timeline"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Timeline
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("logs")}
          className={`pb-2.5 transition-colors ${
            activeTab === "logs"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Searchable logs
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("correlations")}
          className={`pb-2.5 transition-colors ${
            activeTab === "correlations"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Correlations
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: 26 October 2026 · UTC timeline */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              SYNTHETIC EVIDENCE
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-5">
              26 October 2026 · UTC
            </h2>

            <div className="space-y-6">
              {/* Event 1 */}
              <div
                onClick={() => setSelectedEvidenceId("EV-0042-01")}
                className="space-y-1 cursor-pointer group"
              >
                <div className="text-xs font-mono text-[#FF6B35]">
                  · EV-0042-01 / 2026-10-26 09:14:00 UTC
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF6B35] transition-colors">
                  Role elevation requested
                </div>
                <p className="text-xs text-[#A3A3A3]">
                  analyst-demo-03 requested the synthetic privileged role for APP-GW-02.
                </p>
                <div className="text-[11px] font-mono text-[#737373]">
                  Synthetic Evidence / IDENTITY-SVC-01
                </div>
              </div>

              {/* Event 2 */}
              <div
                onClick={() => setSelectedEvidenceId("EV-0042-02")}
                className="space-y-1 cursor-pointer group"
              >
                <div className="text-xs font-mono text-[#FF6B35]">
                  · EV-0042-02 / 2026-10-26 09:14:08 UTC
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF6B35] transition-colors">
                  Privileged token issued
                </div>
                <p className="text-xs text-[#A3A3A3]">
                  IDENTITY-SVC-01 issued a synthetic privileged token to analyst-demo-03 for APP-GW-02.
                </p>
                <div className="text-[11px] font-mono text-[#737373]">
                  Synthetic Evidence / IDENTITY-SVC-01
                </div>
              </div>

              {/* Event 3 */}
              <div
                onClick={() => setSelectedEvidenceId("EV-0042-03")}
                className="space-y-1 cursor-pointer group"
              >
                <div className="text-xs font-mono text-[#FF6B35]">
                  · EV-0042-03 / 2026-10-26 09:15:10 UTC
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5] group-hover:text-[#FF6B35] transition-colors">
                  Privileged route accessed
                </div>
                <p className="text-xs text-[#A3A3A3]">
                  APP-GW-02 recorded synthetic access to /admin/config by analyst-demo-03.
                </p>
                <div className="text-[11px] font-mono text-[#737373]">
                  Synthetic Evidence / APP-GW-02
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Tabular Evidence List */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                    <th className="pb-3 font-medium">ID</th>
                    <th className="pb-3 font-medium">TYPE / LEVEL</th>
                    <th className="pb-3 font-medium">SOURCE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#383838]/40">
                  <tr
                    onClick={() => setSelectedEvidenceId("EV-0042-01")}
                    className="hover:bg-[#2C2C2C]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono text-[#F5F5F5]">EV-0042-01</td>
                    <td className="py-3 text-[#A3A3A3]">Identity / Warning</td>
                    <td className="py-3 font-mono text-[#A3A3A3]">IDENTITY-SVC-01</td>
                  </tr>
                  <tr
                    onClick={() => setSelectedEvidenceId("EV-0042-02")}
                    className="hover:bg-[#2C2C2C]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono text-[#F5F5F5]">EV-0042-02</td>
                    <td className="py-3 text-[#A3A3A3]">Token / High</td>
                    <td className="py-3 font-mono text-[#A3A3A3]">IDENTITY-SVC-01</td>
                  </tr>
                  <tr
                    onClick={() => setSelectedEvidenceId("EV-0042-03")}
                    className="hover:bg-[#2C2C2C]/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 font-mono text-[#F5F5F5]">EV-0042-03</td>
                    <td className="py-3 text-[#A3A3A3]">Access / High</td>
                    <td className="py-3 font-mono text-[#A3A3A3]">APP-GW-02</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 3: Correlation specimen */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              DERIVED ASSESSMENT
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-3">
              Correlation specimen
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The same identity, analyst-demo-03, appears in all three records. EV-0042-01 precedes token issue by 8 seconds; EV-0042-03 follows by 62 seconds.
            </p>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              A shared sequence is not proof of malicious intent. Authorization context is missing.
            </p>
          </div>
        </div>

        {/* Right Column: Evidence Detail Inspector (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-[#383838]">
              <h2 className="text-sm font-semibold text-[#F5F5F5]">
                Evidence detail
              </h2>
              <button
                type="button"
                className="text-[#737373] hover:text-[#F5F5F5]"
                aria-label="Close detail"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-[#A3A3A3] mt-4">
              · Synthetic Evidence
            </div>
            <div className="font-mono text-sm font-bold text-[#F5F5F5] mt-1">
              {current.id}
            </div>
            <div className="text-base font-bold text-[#F5F5F5] mt-1">
              {current.title}
            </div>

            <div className="font-mono text-xs text-[#737373] mt-2">
              {current.ts} Source: {current.source}
            </div>

            <p className="text-xs text-[#A3A3A3] mt-4 leading-relaxed">
              {current.desc}
            </p>

            {/* Raw JSON Specimen */}
            <div className="mt-5">
              <div className="text-xs text-[#F5F5F5] font-medium mb-2">
                Raw event specimen · expanded ^
              </div>
              <pre className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 text-[11px] font-mono text-[#A3A3A3] overflow-x-auto leading-relaxed">
{`{
  "id": "${current.id}",
  "ts": "${current.ts.split(" ")[0]}T${current.ts.split(" ")[1]}Z",
  "actor": "${current.actor}",
  "asset": "${current.asset}",
  "event": "${current.event}",
  "synthetic": true
}`}
              </pre>
            </div>

            {/* AI-Generated Explanation Specimen Box */}
            <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-4 mt-4">
              <div className="text-xs font-semibold text-[#F5F5F5]">
                AI-Generated Explanation specimen
              </div>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                {current.aiSpecimen}
              </p>
            </div>

            <div className="font-mono text-[11px] text-[#737373] mt-4">
              Related: EV-0042-01 / EV-0042-03 Incident: INC-2026-0042
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
