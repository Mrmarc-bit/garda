"use client";

import * as React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";

export default function DigitalTwinPage() {
  const [selectedAsset, setSelectedAsset] = React.useState<string>("APP-GW-02");

  const assetDetails: Record<
    string,
    {
      role: string;
      dependsOn: string;
      dependents: string;
      context: string;
    }
  > = {
    "APP-GW-02": {
      role: "Application gateway",
      dependsOn: "IDENTITY-SVC-01",
      dependents: "OPS-DASH-01, MONITOR-01",
      context: "Identity context: analyst-demo-03. Related incident: INC-2026-0042.",
    },
    "IDENTITY-SVC-01": {
      role: "Identity service",
      dependsOn: "None (baseline core)",
      dependents: "APP-GW-02",
      context: "Auth realm for analyst-demo-03 token generation.",
    },
    "OPS-DASH-01": {
      role: "Operations dashboard",
      dependsOn: "APP-GW-02, TELEMETRY-SIM-01",
      dependents: "None (terminal node)",
      context: "Operator monitoring surface for telemetry ingestion.",
    },
    "MONITOR-01": {
      role: "Observability probe",
      dependsOn: "APP-GW-02",
      dependents: "None (terminal node)",
      context: "Subject to policy POL-01 (observability preservation).",
    },
    "TELEMETRY-SIM-01": {
      role: "Industrial telemetry forwarder",
      dependsOn: "OT-CONTROLLER-SIM-01",
      dependents: "OPS-DASH-01",
      context: "OT telemetry gateway bridger.",
    },
    "OT-CONTROLLER-SIM-01": {
      role: "Virtual OT controller",
      dependsOn: "None (field baseline)",
      dependents: "TELEMETRY-SIM-01",
      context: "Subject to policy POL-03 (prohibit OT isolation).",
    },
  };

  const currentDetails = assetDetails[selectedAsset] || assetDetails["APP-GW-02"];

  return (
    <AppLayout breadcrumb="Workspace / IT/OT Digital Twin">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/digital-twin
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          IT/OT Digital Twin
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Six virtual assets and explicit dependency assumptions. A topology design, not a working graph.
        </p>
      </div>

      {/* Control Bar matching Figma */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search input box */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl px-4 py-2.5 w-full sm:w-72">
          <label htmlFor="search-asset" className="block text-[11px] text-[#737373]">
            Find virtual asset
          </label>
          <input
            id="search-asset"
            type="text"
            value={selectedAsset}
            onChange={(e) => setSelectedAsset(e.target.value)}
            className="w-full bg-transparent border-none text-xs font-mono text-[#F5F5F5] focus:outline-none mt-0.5"
          />
        </div>

        {/* Zoom & Canvas controls */}
        <div className="flex items-center gap-4 text-xs text-[#A3A3A3]">
          <div className="flex items-center gap-2">
            <button type="button" className="hover:text-[#F5F5F5]">-</button>
            <span className="font-mono text-xs">100%</span>
            <button type="button" className="hover:text-[#F5F5F5]">+</button>
          </div>
          <span>Pan</span>
          <span>Fit</span>
          <button
            type="button"
            onClick={() => setSelectedAsset("APP-GW-02")}
            className="text-[#F5F5F5] underline hover:text-[#FF6B35]"
          >
            Reset baseline
          </button>
        </div>
      </div>

      {/* Interactive 2D Topology Canvas matching Figma */}
      <div className="mt-4 bg-[#1E1E1E] border border-[#383838] rounded-xl p-8 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
        {/* SVG connection lines matching arrows in Figma */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="6"
              refX="7"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 8 3, 0 6" fill="#737373" />
            </marker>
          </defs>

          {/* APP-GW-02 -> IDENTITY-SVC-01 */}
          <line
            x1="45%"
            y1="40%"
            x2="28%"
            y2="20%"
            stroke="#737373"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* OPS-DASH-01 -> APP-GW-02 */}
          <line
            x1="68%"
            y1="22%"
            x2="52%"
            y2="38%"
            stroke="#737373"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* MONITOR-01 -> APP-GW-02 */}
          <line
            x1="28%"
            y1="64%"
            x2="45%"
            y2="46%"
            stroke="#737373"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* OPS-DASH-01 -> TELEMETRY-SIM-01 */}
          <line
            x1="70%"
            y1="24%"
            x2="52%"
            y2="76%"
            stroke="#737373"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />

          {/* TELEMETRY-SIM-01 -> OT-CONTROLLER-SIM-01 */}
          <line
            x1="52%"
            y1="76%"
            x2="68%"
            y2="64%"
            stroke="#737373"
            strokeWidth="1.5"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* Nodes Layout Grid in Relative Viewport */}
        <div className="relative z-10 w-full h-[400px]">
          {/* Node 1: IDENTITY-SVC-01 (Top Left) */}
          <div
            onClick={() => setSelectedAsset("IDENTITY-SVC-01")}
            className={`absolute left-[10%] top-[8%] w-48 bg-[#252525] rounded-xl p-4 cursor-pointer transition-colors ${
              selectedAsset === "IDENTITY-SVC-01" ? "border-2 border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="font-mono text-xs font-semibold text-[#F5F5F5]">
              IDENTITY-SVC-01
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Virtual baseline
            </div>
          </div>

          {/* Node 2: OPS-DASH-01 (Top Right) */}
          <div
            onClick={() => setSelectedAsset("OPS-DASH-01")}
            className={`absolute right-[15%] top-[8%] w-48 bg-[#252525] rounded-xl p-4 cursor-pointer transition-colors ${
              selectedAsset === "OPS-DASH-01" ? "border-2 border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="font-mono text-xs font-semibold text-[#F5F5F5]">
              OPS-DASH-01
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Virtual baseline
            </div>
          </div>

          {/* Node 3: APP-GW-02 (Center - Selected in Figma) */}
          <div
            onClick={() => setSelectedAsset("APP-GW-02")}
            className={`absolute left-[40%] top-[36%] w-52 bg-[#252525] rounded-xl p-4 cursor-pointer transition-colors ${
              selectedAsset === "APP-GW-02" ? "border-2 border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="font-mono text-xs font-semibold text-[#F5F5F5]">
              APP-GW-02
            </div>
            <div className="text-[11px] text-[#A3A3A3] mt-1">
              Selected · gateway
            </div>
          </div>

          {/* Node 4: MONITOR-01 (Mid Left) */}
          <div
            onClick={() => setSelectedAsset("MONITOR-01")}
            className={`absolute left-[10%] top-[60%] w-48 bg-[#252525] rounded-xl p-4 cursor-pointer transition-colors ${
              selectedAsset === "MONITOR-01" ? "border-2 border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="font-mono text-xs font-semibold text-[#F5F5F5]">
              MONITOR-01
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Virtual baseline
            </div>
          </div>

          {/* Node 5: TELEMETRY-SIM-01 (Bottom Center) */}
          <div
            onClick={() => setSelectedAsset("TELEMETRY-SIM-01")}
            className={`absolute left-[38%] top-[72%] w-52 bg-[#252525] rounded-xl p-4 cursor-pointer transition-colors ${
              selectedAsset === "TELEMETRY-SIM-01" ? "border-2 border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="font-mono text-xs font-semibold text-[#F5F5F5]">
              TELEMETRY-SIM-01
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Virtual baseline
            </div>
          </div>

          {/* Node 6: OT-CONTROLLER-SIM-01 (Mid Right) */}
          <div
            onClick={() => setSelectedAsset("OT-CONTROLLER-SIM-01")}
            className={`absolute right-[15%] top-[56%] w-52 bg-[#252525] rounded-xl p-4 cursor-pointer transition-colors ${
              selectedAsset === "OT-CONTROLLER-SIM-01" ? "border-2 border-[#FF6B35]" : "border border-[#383838]"
            }`}
          >
            <div className="font-mono text-xs font-semibold text-[#F5F5F5]">
              OT-CONTROLLER-SIM-01
            </div>
            <div className="text-[11px] text-[#737373] mt-1">
              Virtual OT controller
            </div>
          </div>
        </div>

        {/* Baseline topology label inside canvas */}
        <div className="text-xs text-[#737373] font-mono mt-4">
          Baseline topology
        </div>
      </div>

      {/* Dependency Legend Card */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          Dependency legend
        </h2>
        <div className="text-xs font-mono text-[#F5F5F5] mt-2">
          A → B means “A depends on B”
        </div>
        <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
          Not traffic flow, attack direction or proof of causation. Orange outline = selected asset. Baseline = assumed virtual configuration, not live health.
        </p>
        <div className="font-mono text-xs text-[#737373] mt-4 leading-relaxed break-words">
          APP-GW-02 → IDENTITY-SVC-01 · OPS-DASH-01 → APP-GW-02 · OPS-DASH-01 → TELEMETRY-SIM-01 · TELEMETRY-SIM-01 → OT-CONTROLLER-SIM-01 · MONITOR-01 → APP-GW-02
        </div>
      </div>

      {/* Lower 2-Column: Selected Virtual Asset & Evidence/Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Selected Virtual Asset Card */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              SELECTED VIRTUAL ASSET
            </div>
            <h2 className="text-xl font-bold font-mono text-[#F5F5F5] mt-1">
              {selectedAsset}
            </h2>

            <div className="space-y-2 text-xs mt-4">
              <div>
                <span className="text-[#A3A3A3]">Role / </span>
                <span className="text-[#F5F5F5]">{currentDetails.role}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Depends on / </span>
                <span className="font-mono text-[#F5F5F5]">{currentDetails.dependsOn}</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Dependents / </span>
                <span className="font-mono text-[#F5F5F5]">{currentDetails.dependents}</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#737373] mt-6 leading-relaxed">
            {currentDetails.context}
          </div>
        </div>

        {/* Evidence & Policies Card */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Evidence & policies
            </h2>
            <div className="font-mono text-xs text-[#A3A3A3] mt-2">
              EV-0042-01 · EV-0042-02 · EV-0042-03
            </div>
            <p className="text-xs text-[#A3A3A3] mt-3 leading-relaxed">
              POL-01 preserves monitoring. POL-02 requires human review. POL-03 protects OT controller isolation. Definitions are not evaluated here.
            </p>
            <div className="text-xs text-[#FF6B35] mt-3 font-mono">
              · Policy Validation · proposed layer
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/app/simulator"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
            >
              Open Response Simulator
            </Link>
          </div>
        </div>
      </div>

      <div className="text-xs text-[#737373] mt-4">
        Controls are visual affordances. On mobile the topology stays inside this bounded viewport; details follow below, with no page-level horizontal scrolling.
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
