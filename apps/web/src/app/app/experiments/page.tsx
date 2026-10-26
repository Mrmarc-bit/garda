"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown } from "lucide-react";

export default function ExperimentsPage() {
  return (
    <AppLayout breadcrumb="Workspace / Experiments & Evaluation">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/experiments
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Experiments & Evaluation
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Configure a future comparison. This workspace contains no recorded experimental data.
        </p>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center gap-4">
        <button
          type="button"
          className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors"
        >
          Queue experiment — specimen
        </button>
        <span className="text-xs text-[#A3A3A3] cursor-not-allowed">
          Export results
        </span>
      </div>

      {/* Empty State Card */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-8 text-center mt-6">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          No experiment run yet
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 max-w-lg mx-auto">
          No queue, run history, measurements or comparative results exist in this visual prototype.
        </p>
      </div>

      {/* Experiment configuration */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5] mb-4">
          Experiment configuration
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-[11px] text-[#737373]">Dataset</span>
              <span className="text-xs text-[#F5F5F5] font-medium mt-0.5 block">
                Local synthetic dataset · 1 incident
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#737373]" />
          </div>

          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-[11px] text-[#737373]">Scenario</span>
              <span className="text-xs font-mono text-[#F5F5F5] font-medium mt-0.5 block">
                INC-2026-0042
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#737373]" />
          </div>

          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 flex items-center justify-between cursor-pointer">
            <div>
              <span className="block text-[11px] text-[#737373]">Methods</span>
              <span className="text-xs text-[#F5F5F5] font-medium mt-0.5 block">
                A + B + C · all selected
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-[#737373]" />
          </div>

          <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
            <span className="block text-[11px] text-[#737373]">Repetitions</span>
            <span className="text-xs text-[#A3A3A3] mt-0.5 block">
              Not configured
            </span>
          </div>
        </div>

        <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 mt-4">
          <span className="block text-[11px] text-[#737373]">Research note specimen</span>
          <p className="text-xs text-[#F5F5F5] mt-1 leading-relaxed">
            Compare evidence grounding, constraint handling and assumed service tradeoffs. No superiority hypothesis is asserted.
          </p>
        </div>
      </div>

      {/* Methods Table */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                <th className="pb-3 font-medium">METHOD</th>
                <th className="pb-3 font-medium">DEFINITION</th>
                <th className="pb-3 font-medium">REVIEW FOCUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40">
              <tr>
                <td className="py-3.5 font-medium text-[#F5F5F5]">A · Rule-based</td>
                <td className="py-3.5 text-[#A3A3A3]">Predefined response mappings</td>
                <td className="py-3.5 text-[#A3A3A3]">Coverage and missing context</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-[#F5F5F5]">B · AI-only</td>
                <td className="py-3.5 text-[#A3A3A3]">Narrative-led proposal</td>
                <td className="py-3.5 text-[#A3A3A3]">Evidence grounding and unsupported actions</td>
              </tr>
              <tr>
                <td className="py-3.5 font-medium text-[#F5F5F5]">C · Simulation + safety</td>
                <td className="py-3.5 text-[#A3A3A3]">Hypothetical impact + constraints</td>
                <td className="py-3.5 text-[#A3A3A3]">Assumptions and rule handling</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Metric definitions — not measurements */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          Metric definitions — not measurements
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
          Evidence coverage: cited relevant synthetic records / available relevant records. Constraint compliance: acceptable candidates / evaluated candidates, once a validator exists. Service impact: estimated disruption under declared topology assumptions. Human review: documented decision and rationale, not operational success.
        </p>
        <div className="text-xs text-[#737373] mt-4">
          No values are shown because no experiment has run. Methods and metrics require a recorded, reproducible protocol.
        </div>
      </div>

      {/* 3 State Specimen Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              Queued
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Intended state only. No job has been submitted.
            </p>
          </div>
          <div className="text-xs text-[#737373] mt-4 font-mono">
            · State specimen
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              Running
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Loading specimen. Do not show invented progress or results.
            </p>
          </div>
          <div className="text-xs text-[#737373] mt-4 font-mono">
            · State specimen
          </div>
        </div>

        <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#F5F5F5]">
              Error
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Intended failure message: evaluation unavailable. Retain configuration and allow retry.
            </p>
          </div>
          <div className="text-xs text-[#737373] mt-4 font-mono">
            · State specimen
          </div>
        </div>
      </div>

      {/* Exports disabled box */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-4">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Exports disabled
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
          Recorded data and export integration are required. No files have been generated.
        </p>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
