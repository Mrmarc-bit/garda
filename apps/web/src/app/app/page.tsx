"use client";

import * as React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown } from "lucide-react";

export default function OverviewDashboard() {
  return (
    <AppLayout breadcrumb="Workspace / Overview">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app
        </div>
      </div>

      {/* Heading & Supporting Lead */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Simulation overview
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          One incident, three source events, six virtual assets. Local synthetic dataset — no live telemetry.
        </p>
      </div>

      {/* Primary Actions & Time range selector */}
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Link
          href="/app/simulator"
          className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center justify-center shadow-sm"
        >
          Run Simulation
        </Link>
        <Link
          href="/app/reports"
          className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
        >
          View Reports
        </Link>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-xs text-[#A3A3A3]">
        <span>26 Oct 2026 · UTC</span>
        <span className="text-[#383838]">/</span>
        <div className="flex items-center gap-1 cursor-pointer hover:text-[#F5F5F5]">
          <span>Scenario time range</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
        </div>
      </div>

      {/* 4 Metric / KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">Active incidents</div>
          <div className="text-3xl font-semibold font-mono text-[#F5F5F5] my-2">1</div>
          <div className="text-xs text-[#737373]">Awaiting Review</div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">High-risk scenarios</div>
          <div className="text-3xl font-semibold font-mono text-[#F5F5F5] my-2">1</div>
          <div className="text-xs text-[#737373]">Severity: High</div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">Virtual services at risk</div>
          <div className="text-3xl font-semibold font-mono text-[#F5F5F5] my-2">2</div>
          <div className="text-xs text-[#737373]">Illustrative assessment</div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
          <div className="text-xs text-[#A3A3A3]">Policy definitions</div>
          <div className="text-3xl font-semibold font-mono text-[#F5F5F5] my-2">3</div>
          <div className="text-xs text-[#737373]">Not evaluated</div>
        </div>
      </div>

      {/* Middle row: Synthetic Incident Activity & Service Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Synthetic incident activity chart card */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              SCENARIO EVENTS / NOT LIVE
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-6">
              Synthetic incident activity
            </h2>

            {/* Custom 4-bar SVG/HTML chart matching Figma */}
            <div className="h-28 flex items-end justify-between px-6 pb-2 border-b border-[#383838]">
              {/* 09:13 - 0 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-1 bg-[#FF6B35]/30 rounded-t-sm" />
              </div>

              {/* 09:14 - 2 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-24 bg-[#FF6B35] rounded-t-sm" />
              </div>

              {/* 09:15 - 1 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-12 bg-[#FF6B35] rounded-t-sm" />
              </div>

              {/* 09:16 - 0 */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-1 bg-[#FF6B35]/30 rounded-t-sm" />
              </div>
            </div>

            {/* X-axis labels in monospace */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono text-[#A3A3A3] mt-3">
              <div>09:13 · 0</div>
              <div>09:14 · 2</div>
              <div>09:15 · 1</div>
              <div>09:16 · 0 UTC</div>
            </div>
          </div>

          <div className="text-xs text-[#737373] mt-6">
            3 synthetic events total. Y: event count / X: UTC minute.
          </div>
        </div>

        {/* Service health card */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              VIRTUAL BASELINE / NOT OBSERVED
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-5">
              Service health
            </h2>

            <ul className="space-y-3 font-mono text-xs">
              <li className="text-[#F5F5F5]">
                APP-GW-02 / At risk · assumed
              </li>
              <li className="text-[#F5F5F5]">
                OPS-DASH-01 / Dependent · assumed
              </li>
              <li className="text-[#F5F5F5]">
                MONITOR-01 / Preserve monitoring
              </li>
            </ul>
          </div>

          <div className="text-xs text-[#737373] mt-6">
            2 virtual services assessed at risk. Other assets retain baseline assumptions, not measured health.
          </div>
        </div>
      </div>

      {/* Recent incidents full-width table card */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5] mb-4">
          Recent incidents
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider">
                <th className="pb-2.5 font-medium">INCIDENT</th>
                <th className="pb-2.5 font-medium">SCENARIO</th>
                <th className="pb-2.5 font-medium">SEVERITY / STATUS</th>
                <th className="pb-2.5 font-medium">CONFIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40">
              <tr className="hover:bg-[#2C2C2C]/50 transition-colors">
                <td className="py-3 font-mono text-[#F5F5F5]">
                  <Link href="/app/incidents/INC-2026-0042" className="hover:text-[#FF6B35] underline-offset-2 hover:underline">
                    INC-2026-0042
                  </Link>
                </td>
                <td className="py-3 text-[#A3A3A3]">
                  Suspicious Privilege Escalation
                </td>
                <td className="py-3 text-[#F5F5F5]">
                  High / Awaiting Review
                </td>
                <td className="py-3 font-mono text-[#A3A3A3]">
                  0.82 illustrative
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Lower grid: Pending recommendations & No experiment run yet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Pending recommendations
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              1 / Pending Review REC-0042-01 / Review the synthetic session before broad isolation. AI explanation specimen / EV-0042-01–03
            </p>
          </div>
          <div className="mt-4">
            <Link
              href="/app/recommendations"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Review recommendation
            </Link>
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
          <h2 className="text-base font-semibold text-[#F5F5F5]">
            No experiment run yet
          </h2>
          <p className="text-xs text-[#737373] mt-2 leading-relaxed">
            No recorded simulation or experimental result exists. Configure a future method comparison.
          </p>
        </div>
      </div>

      {/* Bottom Card: Scenario activity timeline */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
          SYNTHETIC EVIDENCE
        </div>
        <h2 className="text-base font-semibold text-[#F5F5F5] mt-1">
          Scenario activity timeline
        </h2>
        <div className="font-mono text-xs text-[#737373] mt-2 mb-3">
          2026-10-26 UTC
        </div>

        <div className="space-y-1.5 font-mono text-xs text-[#F5F5F5]">
          <div>09:14:00 / EV-0042-01 / Role elevation requested</div>
          <div>09:14:08 / EV-0042-02 / Privileged token issued</div>
          <div>09:15:10 / EV-0042-03 / Privileged route accessed</div>
        </div>

        <div className="font-mono text-xs text-[#737373] mt-4">
          Identity: analyst-demo-03 / Asset: APP-GW-02
        </div>
      </div>

      {/* Persistent Disclaimer from Figma */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
