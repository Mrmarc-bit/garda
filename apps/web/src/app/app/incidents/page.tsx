"use client";

import * as React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown, ArrowDown } from "lucide-react";

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [severityFilter, setSeverityFilter] = React.useState("all");

  const isFiltered = searchQuery.trim() !== "" || severityFilter !== "all";

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
          /app/incidents
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Incidents
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          One synthetic incident in the bounded local dataset. No production alerts or historical runs.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="mt-6 bg-[#252525] border border-[#383838] rounded-xl p-4 flex items-center justify-between">
        <div className="flex-1">
          <label htmlFor="search-incidents" className="block text-[11px] text-[#737373] mb-1">
            Search incidents
          </label>
          <input
            id="search-incidents"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search ID, title or virtual asset"
            className="w-full bg-transparent border-none text-xs text-[#F5F5F5] placeholder-[#737373] focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 text-xs text-[#A3A3A3] cursor-pointer hover:text-[#F5F5F5]">
          <span>Newest first</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#737373]" />
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-3">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Severity</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>All severities</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Status</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>All statuses</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Confidence</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>Any range</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Date · UTC</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>26 Oct 2026</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-3 flex flex-col justify-between cursor-pointer">
          <span className="text-[11px] text-[#737373]">Service</span>
          <div className="flex items-center justify-between text-xs text-[#F5F5F5] mt-1">
            <span>All virtual assets</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
        </div>
      </div>

      {/* Result Count and Clear Filters */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-[#A3A3A3]">1 incident · synthetic dataset</span>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setSeverityFilter("all");
          }}
          className="text-[#A3A3A3] underline hover:text-[#FF6B35] transition-colors"
        >
          Clear filters
        </button>
      </div>

      {/* Incident Table Card */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-3">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] tracking-wider uppercase font-medium">
                <th className="pb-3 font-medium">INCIDENT ⇅</th>
                <th className="pb-3 font-medium">SCENARIO</th>
                <th className="pb-3 font-medium">SEVERITY / STATUS</th>
                <th className="pb-3 font-medium">SERVICE</th>
                <th className="pb-3 font-medium">CONFIDENCE</th>
                <th className="pb-3 font-medium">FIRST EVENT · UTC</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40">
              <tr className="hover:bg-[#2C2C2C]/50 transition-colors">
                <td className="py-4 font-mono text-[#F5F5F5]">
                  <Link
                    href="/app/incidents/INC-2026-0042"
                    className="hover:text-[#FF6B35] underline-offset-2 hover:underline"
                  >
                    INC-2026-0042
                  </Link>
                </td>
                <td className="py-4 text-[#A3A3A3]">
                  Suspicious Privilege Escalation
                </td>
                <td className="py-4 text-[#F5F5F5]">
                  High / Awaiting Review
                </td>
                <td className="py-4 font-mono text-[#A3A3A3]">
                  APP-GW-02
                </td>
                <td className="py-4 font-mono text-[#A3A3A3]">
                  0.82 illustrative
                </td>
                <td className="py-4 font-mono text-[#A3A3A3]">
                  2026-10-26 09:14:00
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Confidence Callout */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-4">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Confidence is not calibrated probability
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1">
          The displayed 0.82 is an illustrative assessment label, not a measured certainty or automated decision.
        </p>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between text-xs text-[#737373]">
        <button type="button" disabled className="hover:text-[#F5F5F5] disabled:opacity-50 cursor-not-allowed">
          Previous
        </button>
        <div className="flex items-center gap-1.5 font-mono">
          <span>•</span>
          <span>Page 1 of 1 · 1-1 of 1</span>
        </div>
        <button type="button" disabled className="hover:text-[#F5F5F5] disabled:opacity-50 cursor-not-allowed">
          Next
        </button>
      </div>

      {/* Filtered Empty-State Specimen */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6">
        <h2 className="text-sm font-semibold text-[#F5F5F5]">
          Filtered empty-state specimen
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
          No synthetic incidents match these filters. Clear filters to return to the single-record dataset.
        </p>
        <button
          type="button"
          onClick={() => {
            setSearchQuery("");
            setSeverityFilter("all");
          }}
          className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] mt-4 block"
        >
          Reset filters
        </button>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
