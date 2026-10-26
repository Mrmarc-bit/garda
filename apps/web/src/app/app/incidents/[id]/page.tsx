"use client";

import * as React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";

export default function IncidentDetailPage() {
  const [activeTab, setActiveTab] = React.useState<"summary" | "evidence" | "timeline" | "review">("summary");

  return (
    <AppLayout breadcrumb="Workspace / Incidents">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/incidents/INC-2026-0042
        </div>
      </div>

      {/* Main Heading & Breadcrumb text */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Suspicious Privilege Escalation
        </h1>
        <p className="text-xs text-[#A3A3A3] mt-2">
          INC-2026-0042 / Simulation Lab / Synthetic incident detail
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-5 flex items-center gap-4">
        <Link
          href="/app/simulator"
          className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors"
        >
          Open Response Simulator
        </Link>
        <Link
          href="/app/evidence"
          className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
        >
          View evidence
        </Link>
      </div>

      {/* Navigation Tabs matching Figma */}
      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("summary")}
          className={`pb-2.5 transition-colors ${
            activeTab === "summary"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Summary
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("evidence")}
          className={`pb-2.5 transition-colors ${
            activeTab === "evidence"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Evidence · 3
        </button>
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
          onClick={() => setActiveTab("review")}
          className={`pb-2.5 transition-colors ${
            activeTab === "review"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Review context
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Incident Header & Confidence */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[11px] font-mono text-[#FF6B35]">
              INC-2026-0042
            </div>
            <h2 className="text-xl font-bold text-[#F5F5F5] mt-1">
              Suspicious Privilege Escalation
            </h2>

            <div className="flex items-center gap-3 text-xs mt-3">
              <span className="text-[#FBBF24]">· High</span>
              <span className="text-[#A3A3A3]">· Awaiting Review</span>
              <span className="text-[#A3A3A3]">· Simulation Lab</span>
            </div>

            <div className="space-y-1.5 text-xs mt-5">
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
                <span className="font-mono text-[#F5F5F5]">3 · EV-0042-01–03</span>
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

          {/* Card 2: Synthetic Event Timeline */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-5">
              Synthetic event timeline
            </h2>

            <div className="space-y-6">
              {/* Event 1 */}
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#FF6B35]">
                  · EV-0042-01 / 2026-10-26 09:14:00 UTC
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5]">
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
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#FF6B35]">
                  · EV-0042-02 / 2026-10-26 09:14:08 UTC
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5]">
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
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#FF6B35]">
                  · EV-0042-03 / 2026-10-26 09:15:10 UTC
                </div>
                <div className="text-sm font-semibold text-[#F5F5F5]">
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

          {/* Card 3: Analyst Note Specimen */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4">
              Analyst note specimen
            </h2>

            <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-4">
              <span className="block text-[11px] text-[#737373] mb-1">
                Review note
              </span>
              <p className="text-xs text-[#F5F5F5] leading-relaxed">
                Verify whether the synthetic role elevation had an approved context before comparing broad isolation.
              </p>
              <div className="text-[11px] text-[#737373] mt-3">
                Unsaved visual specimen. Persistence and actor attribution require implementation.
              </div>
            </div>

            <div className="text-xs text-[#737373] mt-4">
              Save note — not connected
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Synthetic Evidence */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              Synthetic Evidence
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              EV-0042-01 → EV-0042-03 record a request, token issue and privileged access. These are fictional source facts.
            </p>
          </div>

          {/* Derived Assessment */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              Derived Assessment
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              The sequence may indicate privilege misuse. Intent and authorization context are unknown. Confidence 0.82 is illustrative only.
            </p>
          </div>

          {/* AI-Generated Explanation */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              AI-Generated Explanation
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Specimen narrative: review the session before broad virtual isolation. Provider integration unverified; not an observed fact or action approval.
            </p>
          </div>

          {/* Possible Operational Impact */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              DERIVED ASSESSMENT
            </div>
            <h2 className="text-sm font-semibold text-[#F5F5F5] mt-1">
              Possible operational impact
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              APP-GW-02 supports OPS-DASH-01. Restricting gateway access may affect that dashboard. MONITOR-01 depends on the gateway and must remain observable.
            </p>
            <div className="text-xs text-[#737373] mt-3">
              2 virtual services at risk is an illustrative assessment, not observed downtime.
            </div>
          </div>

          {/* Audit Context Specimen */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              Audit context specimen
            </h2>
            <div className="space-y-1.5 text-xs mt-3">
              <div>
                <span className="text-[#A3A3A3]">Example actor / </span>
                <span className="font-mono text-[#F5F5F5]">analyst-demo-03</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Related incident / </span>
                <span className="font-mono text-[#F5F5F5]">INC-2026-0042</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Review state / </span>
                <span className="text-[#F5F5F5]">Awaiting Review</span>
              </div>
            </div>
            <div className="text-xs text-[#737373] mt-3 leading-relaxed">
              Context specimen only. No note, review decision or immutable record has been saved.
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
