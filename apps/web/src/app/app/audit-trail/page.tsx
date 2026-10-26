"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown } from "lucide-react";

export default function AuditTrailPage() {
  const [selectedEventId, setSelectedEventId] = React.useState<string>("REC-0042-01");

  return (
    <AppLayout breadcrumb="Workspace / Audit Trail">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/audit-trail
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Audit Trail
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Synthetic example events for visual review. These are not persisted activity or immutable records.
        </p>
      </div>

      {/* Synthetic examples callout box */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-6">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Synthetic examples — not actual user history
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1">
          Timestamps below belong to the scenario specimen. No real review, simulation or save event has occurred.
        </p>
      </div>

      {/* Filter Row matching Figma */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Actor</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>All synthetic actors</span>
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

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between">
          <span className="text-[11px] text-[#737373]">Related ID</span>
          <span className="text-xs font-mono text-[#F5F5F5] mt-1">INC-2026-0042</span>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Date · UTC</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>26 Oct 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>
      </div>

      {/* Audit Table Card */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                <th className="pb-3 font-medium">TIMESTAMP · UTC</th>
                <th className="pb-3 font-medium">ACTOR / TYPE</th>
                <th className="pb-3 font-medium">RELATED ID</th>
                <th className="pb-3 font-medium">SUMMARY</th>
                <th className="pb-3 font-medium">RESULT</th>
                <th className="pb-3 font-medium">EVIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40 font-mono">
              <tr
                onClick={() => setSelectedEventId("INC-2026-0042")}
                className="hover:bg-[#2C2C2C]/50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 text-[#A3A3A3]">2026-10-26 09:16:00</td>
                <td className="py-3.5 text-[#F5F5F5]">analyst-demo-03 / View</td>
                <td className="py-3.5 text-[#F5F5F5]">INC-2026-0042</td>
                <td className="py-3.5 font-sans text-[#A3A3A3]">Incident context opened · example</td>
                <td className="py-3.5 font-sans text-[#F5F5F5]">Display specimen</td>
                <td className="py-3.5 text-[#A3A3A3]">EV-0042-01</td>
              </tr>
              <tr
                onClick={() => setSelectedEventId("EV-0042-02")}
                className="hover:bg-[#2C2C2C]/50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 text-[#A3A3A3]">2026-10-26 09:16:20</td>
                <td className="py-3.5 text-[#F5F5F5]">analyst-demo-03 / Inspect</td>
                <td className="py-3.5 text-[#F5F5F5]">EV-0042-02</td>
                <td className="py-3.5 font-sans text-[#A3A3A3]">Synthetic token event inspected · example</td>
                <td className="py-3.5 font-sans text-[#F5F5F5]">Display specimen</td>
                <td className="py-3.5 text-[#A3A3A3]">EV-0042-02</td>
              </tr>
              <tr
                onClick={() => setSelectedEventId("REC-0042-01")}
                className="hover:bg-[#2C2C2C]/50 cursor-pointer transition-colors"
              >
                <td className="py-3.5 text-[#A3A3A3]">2026-10-26 09:17:00</td>
                <td className="py-3.5 text-[#F5F5F5]">analyst-demo-03 / Review</td>
                <td className="py-3.5 text-[#F5F5F5]">REC-0042-01</td>
                <td className="py-3.5 font-sans text-[#A3A3A3]">Review requested · example</td>
                <td className="py-3.5 font-sans text-[#FF6B35]">Pending Review specimen</td>
                <td className="py-3.5 text-[#A3A3A3]">EV-0042-01–03</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower 2-Column: Audit Requirements & Selected Event Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Left Card: Audit design requirements */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Audit design requirements
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              A real implementation needs server-attributed actors, authorization, timestamps, retention, access controls and integrity protections. No immutable or tamper-proof property is asserted.
            </p>
          </div>
          <div className="text-xs text-[#737373] mt-6">
            Export audit — not connected
          </div>
        </div>

        {/* Right Card: Selected event drawer · example */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              REVIEW CONTEXT
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1">
              Selected event drawer · example
            </h2>
            <div className="text-xs text-[#A3A3A3] mt-2">
              · Synthetic example
            </div>

            <div className="font-mono text-xs text-[#F5F5F5] mt-4 leading-relaxed">
              2026-10-26 09:17:00 UTC Actor: analyst-demo-03 Type: Review / Related: REC-0042-01 Incident: INC-2026-0042
            </div>

            <p className="text-xs text-[#A3A3A3] mt-3">
              Summary: human review requested for a hypothetical session response.
            </p>

            <p className="text-xs text-[#737373] mt-3">
              Result: Pending Review specimen Evidence: EV-0042-01 / EV-0042-02 / EV-0042-03 No record has been saved by this design.
            </p>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Close drawer
            </button>
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
