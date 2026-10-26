"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, ShieldAlert, Cpu, Network, Activity, Lock, ArrowRight } from "lucide-react";

export type StrategyKey = "revocation" | "restriction" | "isolation";

interface NodeState {
  id: string;
  label: string;
  type: "it" | "ot" | "gateway";
  status: "normal" | "impacted" | "isolated" | "protected";
  x: number;
  y: number;
}

export const HeroInteractivePreview: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState<"topology" | "specimen">("topology");
  const [strategy, setStrategy] = React.useState<StrategyKey>("revocation");
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);

  // 6 Virtual assets positions in a 360x220 coordinate space
  const nodes: NodeState[] = [
    {
      id: "IDENTITY-SVC-01",
      label: "IDENTITY-SVC-01",
      type: "it",
      status: strategy === "revocation" ? "impacted" : "normal",
      x: 60,
      y: 45,
    },
    {
      id: "APP-GW-02",
      label: "APP-GW-02 (Target)",
      type: "gateway",
      status: strategy === "isolation" ? "isolated" : "impacted",
      x: 180,
      y: 45,
    },
    {
      id: "MONITOR-01",
      label: "MONITOR-01",
      type: "it",
      status: strategy === "isolation" ? "impacted" : "normal",
      x: 300,
      y: 45,
    },
    {
      id: "OPS-DASH-01",
      label: "OPS-DASH-01",
      type: "it",
      status: strategy === "isolation" ? "impacted" : "normal",
      x: 60,
      y: 165,
    },
    {
      id: "TELEMETRY-SIM-01",
      label: "TELEMETRY-SIM-01",
      type: "ot",
      status: strategy === "isolation" ? "isolated" : "protected",
      x: 180,
      y: 165,
    },
    {
      id: "OT-CONTROLLER-SIM-01",
      label: "OT-CONTROLLER-01",
      type: "ot",
      status: strategy === "isolation" ? "isolated" : "protected",
      x: 300,
      y: 165,
    },
  ];

  // Dependencies: A -> B means A depends on B
  const edges = [
    { from: "APP-GW-02", to: "IDENTITY-SVC-01" },
    { from: "OPS-DASH-01", to: "APP-GW-02" },
    { from: "OPS-DASH-01", to: "TELEMETRY-SIM-01" },
    { from: "TELEMETRY-SIM-01", to: "OT-CONTROLLER-SIM-01" },
    { from: "MONITOR-01", to: "APP-GW-02" },
  ];

  return (
    <div className="bg-[#202020] border border-[#383838] rounded-2xl p-6 shadow-2xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[10px] font-mono text-[#A3A3A3] pb-3 border-b border-[#383838]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#FF6B35] animate-pulse" />
          <span>GARDA-SIM AI / RESPONSE WORKSPACE</span>
        </div>
        <span className="text-[#FF6B35] font-semibold">· SIMULATION ONLY</span>
      </div>

      {/* Incident Meta & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[11px] font-mono text-[#737373] block">
            Simulation Lab / Incident detail
          </span>
          <h2 className="text-lg font-bold text-[#F5F5F5] mt-0.5">
            Suspicious Privilege Escalation
          </h2>
          <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mt-0.5 font-mono">
            <span>· INC-2026-0042</span>
            <span className="text-[#FBBF24]">· High</span>
            <span>· Awaiting Review</span>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center bg-[#282828] p-1 rounded-lg border border-[#383838] shrink-0 self-start sm:self-auto text-xs font-mono">
          <button
            type="button"
            onClick={() => setActiveTab("topology")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "topology"
                ? "bg-[#FF6B35] text-white font-medium shadow-sm"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            Digital Twin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("specimen")}
            className={`px-3 py-1 rounded transition-colors ${
              activeTab === "specimen"
                ? "bg-[#FF6B35] text-white font-medium shadow-sm"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            Evidence Data
          </button>
        </div>
      </div>

      {/* Interactive Strategy Selector */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[10px] text-[#737373] uppercase tracking-wider pl-1">
          CANDIDATE:
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setStrategy("revocation")}
            className={`px-2.5 py-1 rounded transition-all text-[11px] ${
              strategy === "revocation"
                ? "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/40 font-semibold"
                : "bg-[#1E1E1E] text-[#A3A3A3] border border-[#383838] hover:text-[#F5F5F5]"
            }`}
          >
            Session Revocation
          </button>
          <button
            type="button"
            onClick={() => setStrategy("restriction")}
            className={`px-2.5 py-1 rounded transition-all text-[11px] ${
              strategy === "restriction"
                ? "bg-[#4ADE80]/15 text-[#4ADE80] border border-[#4ADE80]/40 font-semibold"
                : "bg-[#1E1E1E] text-[#A3A3A3] border border-[#383838] hover:text-[#F5F5F5]"
            }`}
          >
            Access Restriction
          </button>
          <button
            type="button"
            onClick={() => setStrategy("isolation")}
            className={`px-2.5 py-1 rounded transition-all text-[11px] ${
              strategy === "isolation"
                ? "bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40 font-semibold"
                : "bg-[#1E1E1E] text-[#A3A3A3] border border-[#383838] hover:text-[#F5F5F5]"
            }`}
          >
            Asset Isolation
          </button>
        </div>
      </div>

      {/* Mode A: Interactive 2D Digital Twin SVG */}
      {activeTab === "topology" ? (
        <div className="bg-[#1A1A1A] border border-[#383838] rounded-xl p-4 relative overflow-hidden">
          {/* SVG Graph Canvas */}
          <div className="relative w-full aspect-[16/9] min-h-[220px]">
            <svg className="w-full h-full" viewBox="0 0 360 210">
              <defs>
                <marker
                  id="arrow-default"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#525252" />
                </marker>
                <marker
                  id="arrow-green"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#4ADE80" />
                </marker>
                <marker
                  id="arrow-red"
                  viewBox="0 0 10 10"
                  refX="18"
                  refY="5"
                  markerWidth="5"
                  markerHeight="5"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#F87171" />
                </marker>
              </defs>

              {/* Render Directed Edges */}
              {edges.map((edge) => {
                const source = nodes.find((n) => n.id === edge.from)!;
                const target = nodes.find((n) => n.id === edge.to)!;
                const isSevered = strategy === "isolation" && (edge.from === "APP-GW-02" || edge.to === "APP-GW-02");

                return (
                  <g key={`${edge.from}->${edge.to}`}>
                    <line
                      x1={source.x}
                      y1={source.y}
                      x2={target.x}
                      y2={target.y}
                      stroke={isSevered ? "#F87171" : "#525252"}
                      strokeWidth={isSevered ? 2 : 1.5}
                      strokeDasharray={isSevered ? "4 3" : undefined}
                      markerEnd={isSevered ? "url(#arrow-red)" : "url(#arrow-default)"}
                      opacity={isSevered ? 0.9 : 0.6}
                    />
                    {/* Animated flow pulse if online */}
                    {!isSevered && (
                      <circle r="2.5" fill="#FF6B35">
                        <animateMotion
                          path={`M ${source.x} ${source.y} L ${target.x} ${target.y}`}
                          dur="3s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}

              {/* Render Nodes */}
              {nodes.map((node) => {
                const isHovered = hoveredNode === node.id;
                let strokeColor = "#383838";
                let fillColor = "#202020";
                let iconColor = "#A3A3A3";

                if (node.type === "gateway") {
                  strokeColor = strategy === "isolation" ? "#F87171" : "#FF6B35";
                  fillColor = strategy === "isolation" ? "#381818" : "#301D16";
                  iconColor = strategy === "isolation" ? "#F87171" : "#FF6B35";
                } else if (node.type === "ot") {
                  strokeColor = strategy === "isolation" ? "#F87171" : "#4ADE80";
                  fillColor = strategy === "isolation" ? "#2B1616" : "#172A1C";
                  iconColor = strategy === "isolation" ? "#F87171" : "#4ADE80";
                } else if (node.id === "IDENTITY-SVC-01" && strategy === "revocation") {
                  strokeColor = "#FBBF24";
                  fillColor = "#2E2413";
                  iconColor = "#FBBF24";
                }

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-transform"
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Pulse ring for targeted gateway */}
                    {node.type === "gateway" && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r="24"
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="1"
                        opacity="0.3"
                      >
                        <animate attributeName="r" values="18;28;18" dur="2.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.4;0.05;0.4" dur="2.5s" repeatCount="indefinite" />
                      </circle>
                    )}

                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={isHovered ? 18 : 16}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isHovered ? 2.5 : 1.5}
                    />

                    {/* Node Text Label */}
                    <text
                      x={node.x}
                      y={node.y + 28}
                      textAnchor="middle"
                      fill={isHovered ? "#F5F5F5" : "#A3A3A3"}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight={isHovered ? "bold" : "normal"}
                    >
                      {node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Real-time Status Banner below Topology */}
          <div className="mt-2 pt-2 border-t border-[#303030] flex flex-wrap items-center justify-between text-xs font-mono">
            {strategy === "isolation" ? (
              <div className="flex items-center gap-1.5 text-[#F87171]">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>POL-01 VIOLATION: OT-CONTROLLER Telemetry severed!</span>
              </div>
            ) : strategy === "restriction" ? (
              <div className="flex items-center gap-1.5 text-[#4ADE80]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>POL-01 PASS: Gateway filtered; OT equipment unaffected.</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-[#4ADE80]">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>POL-01 PASS: 1 session revoked; 0 downtime on OT.</span>
              </div>
            )}

            <div className="text-[10px] text-[#737373]">
              Directed: A → B means A depends on B
            </div>
          </div>
        </div>
      ) : (
        /* Mode B: Specimen Evidence & Derived Assessment */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Synthetic Evidence */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-3.5 space-y-2">
            <div className="text-[10px] font-bold text-[#FF6B35] font-mono tracking-wider uppercase">
              SYNTHETIC EVIDENCE
            </div>
            <h3 className="text-xs font-semibold text-[#F5F5F5]">
              Evidence, not assumptions
            </h3>
            <div className="font-mono text-[11px] text-[#737373] pt-1">
              EV-0042-01 / 09:14:00 UTC
            </div>
            <p className="text-[11px] text-[#A3A3A3] leading-snug">
              Role elevation requested by analyst-demo-03 on APP-GW-02.
            </p>
            <div className="font-mono text-[11px] text-[#737373]">
              EV-0042-02 / 09:14:08 UTC
            </div>
            <p className="text-[11px] text-[#A3A3A3] leading-snug">
              Synthetic privileged token issued.
            </p>
          </div>

          {/* Derived Assessment */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-3.5 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-bold text-[#FF6B35] font-mono tracking-wider uppercase">
                DERIVED ASSESSMENT
              </div>
              <h3 className="text-xs font-semibold text-[#F5F5F5] mt-1">
                Review the tradeoff
              </h3>
              <div className="space-y-1 text-[11px] mt-2">
                <div>
                  <span className="text-[#737373]">Identity / </span>
                  <span className="font-mono text-[#F5F5F5]">analyst-demo-03</span>
                </div>
                <div>
                  <span className="text-[#737373]">Confidence / </span>
                  <span className="font-mono text-[#F5F5F5]">0.82 illustrative</span>
                </div>
                <div>
                  <span className="text-[#737373]">Status / </span>
                  {strategy === "isolation" ? (
                    <span className="font-mono text-[#F87171] font-semibold">Policy Blocked</span>
                  ) : (
                    <span className="font-mono text-[#4ADE80] font-semibold">Policy Compliant</span>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-[#737373] mt-2 leading-snug">
                Not a calibrated probability. Context remains incomplete.
              </p>
            </div>
            <div className="text-[11px] text-[#FF6B35] font-mono mt-3">
              · Pending Review
            </div>
          </div>
        </div>
      )}

      {/* Footer link to Response Simulator */}
      <div className="pt-2 border-t border-[#383838] flex items-center justify-between">
        <Link
          href="/app/simulator"
          className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-1.5 shadow-sm"
        >
          <span>Compare strategies in simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <span className="text-[11px] text-[#737373] font-mono">
          Interactive digital twin preview
        </span>
      </div>
    </div>
  );
};
