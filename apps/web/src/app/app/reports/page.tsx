"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";

export default function ReportsPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "incident" | "strategy" | "evaluation">("all");

  return (
    <AppLayout breadcrumb="Workspace / Reports">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/reports
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Reports
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Report types and sample structure. No report has been generated or persisted.
        </p>
      </div>

      {/* Export requirement text */}
      <div className="text-xs text-[#737373] mt-4">
        Export — integration required
      </div>

      {/* Navigation Filter Tabs */}
      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`pb-2.5 transition-colors ${
            activeTab === "all"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          All reports · 0
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("incident")}
          className={`pb-2.5 transition-colors ${
            activeTab === "incident"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Incident summary
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("strategy")}
          className={`pb-2.5 transition-colors ${
            activeTab === "strategy"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Strategy comparison
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("evaluation")}
          className={`pb-2.5 transition-colors ${
            activeTab === "evaluation"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Evaluation
        </button>
      </div>

      {/* Empty State Banner */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-8 text-center mt-6">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          No generated reports
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 max-w-lg mx-auto">
          A report list will appear only after recorded data and report generation exist. The preview below is not a saved report.
        </p>
      </div>

      {/* Report Types Table */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                <th className="pb-3 font-medium">REPORT TYPE</th>
                <th className="pb-3 font-medium">INTENDED CONTENT</th>
                <th className="pb-3 font-medium">STATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40">
              <tr>
                <td className="py-3.5 text-[#F5F5F5] font-medium">Incident summary</td>
                <td className="py-3.5 text-[#A3A3A3]">Context, evidence and analyst notes</td>
                <td className="py-3.5 text-[#737373]">Not generated</td>
              </tr>
              <tr>
                <td className="py-3.5 text-[#F5F5F5] font-medium">Strategy comparison</td>
                <td className="py-3.5 text-[#A3A3A3]">Candidates, assumptions and policy context</td>
                <td className="py-3.5 text-[#737373]">Not generated</td>
              </tr>
              <tr>
                <td className="py-3.5 text-[#F5F5F5] font-medium">Evaluation report</td>
                <td className="py-3.5 text-[#A3A3A3]">Methods, protocol and recorded metrics</td>
                <td className="py-3.5 text-[#737373]">No experiment run yet</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Layout Preview — Sample Only */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
          NOT GENERATED / NOT EXPORTED
        </div>
        <h2 className="text-sm font-semibold text-[#A3A3A3] mt-1">
          Report layout preview — sample only
        </h2>
        <h3 className="text-xl font-bold font-mono text-[#F5F5F5] mt-2">
          INC-2026-0042 · Response review
        </h3>
        <div className="text-xs text-[#FF6B35] font-mono mt-1">
          · Illustrative comparison — not a recorded run
        </div>

        {/* Structured Specimen Table */}
        <div className="mt-4 border border-[#383838] rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] tracking-wider uppercase bg-[#1E1E1E]">
                <th className="py-2.5 px-4 font-medium w-40">SECTION</th>
                <th className="py-2.5 px-4 font-medium">SAMPLE CONTENT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40 bg-[#1D1D1D]">
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Summary</td>
                <td className="py-3 px-4 text-[#F5F5F5]">
                  Suspicious Privilege Escalation · High · Awaiting Review
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Configuration</td>
                <td className="py-3 px-4 font-mono text-[#F5F5F5]">
                  Simulation Lab · analyst-demo-03 · APP-GW-02
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Evidence</td>
                <td className="py-3 px-4 font-mono text-[#F5F5F5]">
                  EV-0042-01 / EV-0042-02 / EV-0042-03 · 26 Oct 2026 UTC
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Strategies</td>
                <td className="py-3 px-4 text-[#F5F5F5]">
                  Session revocation / access restriction / verification / optional isolation
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Policy</td>
                <td className="py-3 px-4 font-mono text-[#F5F5F5]">
                  POL-01–03 definitions; illustrative pass/fail only
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Review</td>
                <td className="py-3 px-4 text-[#F5F5F5]">
                  Pending Review; no decision saved
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-[#A3A3A3] font-medium align-top">Limitations</td>
                <td className="py-3 px-4 text-[#A3A3A3]">
                  Synthetic data; unknown authorization; no calibrated model
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-xs text-[#A3A3A3] mt-5 leading-relaxed">
          Sample narrative: examine a narrow session response before broad simulated isolation. This explanation is not a measured conclusion or operational recommendation.
        </p>
        <div className="text-xs text-[#737373] mt-2">
          Results are simulated estimates, not guarantees of real-world outcomes.
        </div>
      </div>

      {/* Export Not Connected Alert Box */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-4">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Export not connected
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
          PDF, CSV and evidence bundles require generation, authorization, storage and download implementation. No export success is shown.
        </p>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
