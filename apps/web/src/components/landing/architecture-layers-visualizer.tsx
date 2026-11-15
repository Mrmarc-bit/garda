"use client";

import * as React from "react";
import { Database, Network, ShieldCheck, UserCheck, Layers, FileCode, CheckCircle2 } from "lucide-react";

interface LayerData {
  id: string;
  num: string;
  name: string;
  lead: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  bgLight: string;
  specimenType: string;
  specimenContent: string;
  guarantee: string;
}

export const ArchitectureLayersVisualizer: React.FC = () => {
  const [activeLayer, setActiveLayer] = React.useState<string>("layer-1");

  const layers: LayerData[] = [
    {
      id: "layer-1",
      num: "LAYER 01",
      name: "Synthetic Evidence",
      lead: "Fictional forensic source observations without inference.",
      icon: Database,
      color: "#FF6B35",
      borderColor: "border-[#FF6B35]/40",
      bgLight: "bg-[#FF6B35]/10",
      specimenType: "FORENSIC LOG RECORD",
      specimenContent: `{"id": "EVD-101", "utc": "2026-10-26T14:10:12Z", "actor": "analyst-demo-03", "asset": "APP-GW-02", "event": "privilege_elevation_request", "source": "synthetic_audit_probe"}`,
      guarantee: "Append-only facts: ledger entries are hash-chained, and AI or simulator inference cannot rewrite them.",
    },
    {
      id: "layer-2",
      num: "LAYER 02",
      name: "Derived Assessment",
      lead: "Interpretations and impact projections under explicit assumptions.",
      icon: Network,
      color: "#FBBF24",
      borderColor: "border-[#FBBF24]/40",
      bgLight: "bg-[#FBBF24]/10",
      specimenType: "DEPENDENCY & CONFIDENCE PROJECTION",
      specimenContent: `{"target": "APP-GW-02", "confidence": 0.82, "confidence_type": "illustrative_uncalibrated", "blast_radius_nodes": 4, "dependencies": ["IDENTITY-SVC-01", "TELEMETRY-SIM-01"]}`,
      guarantee: "Explicit uncertainty: 0.82 is an illustrative demonstration score, never treated as absolute ground truth.",
    },
    {
      id: "layer-3",
      num: "LAYER 03",
      name: "Deterministic Policy Validation",
      lead: "Code-enforced non-negotiable safety invariant boundaries.",
      icon: ShieldCheck,
      color: "#4ADE80",
      borderColor: "border-[#4ADE80]/40",
      bgLight: "bg-[#4ADE80]/10",
      specimenType: "SAFETY INVARIANT AUDIT",
      specimenContent: `[CHECK: SEC-OT-04] Telemetry Uptime Invariant -> PASS\n[CHECK: SEC-OT-01] Real Network Isolation Block -> PASS\n[CHECK: SEC-OT-03] Protected Asset Isolation Blocked -> ENFORCED`,
      guarantee: "Hard invariant: AI output has zero authority to override deterministic safety rules. Fail-closed by design.",
    },
    {
      id: "layer-4",
      num: "LAYER 04",
      name: "AI Explanation & Human Review",
      lead: "Explainable trade-off narrative requiring explicit human operator sign-off.",
      icon: UserCheck,
      color: "#60A5FA",
      borderColor: "border-[#60A5FA]/40",
      bgLight: "bg-[#60A5FA]/10",
      specimenType: "EXPLAINABLE SYNTHESIS & SIGN-OFF",
      specimenContent: `Narrative: "Session revocation neutralizes analyst-demo-03 credentials while preserving 100% Modbus telemetry to OT-CONTROLLER-SIM-01."\nReview Verdict: PENDING_REVIEW (Human signature required)`,
      guarantee: "Human oversight: Every recommendation begins in Pending Review. No automated containment command is ever issued.",
    },
  ];

  const current = layers.find((l) => l.id === activeLayer) || layers[0];

  return (
    <div className="bg-[#202020] border border-[#383838] rounded-2xl p-6 md:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#383838] pb-4">
        <div>
          <div className="text-[11px] font-mono text-[#FF6B35] font-bold tracking-wider uppercase">
            DEFENSIVE ARCHITECTURE
          </div>
          <h3 className="text-xl font-bold text-[#F5F5F5] mt-1">
            Four Layers. Zero Blurred Boundaries.
          </h3>
        </div>
        <div className="text-xs text-[#737373] font-mono">
          Click any layer to inspect boundary invariants
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Stacked Layer Buttons (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          {layers.map((layer) => {
            const isSelected = activeLayer === layer.id;
            const Icon = layer.icon;

            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3.5 ${
                  isSelected
                    ? `${layer.borderColor} ${layer.bgLight} shadow-md`
                    : "border-[#383838] bg-[#252525] hover:border-[#525252]"
                }`}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: isSelected ? `${layer.color}20` : "#1E1E1E",
                    color: isSelected ? layer.color : "#A3A3A3",
                    border: `1px solid ${isSelected ? layer.color : "#383838"}`,
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[10px] font-mono font-bold tracking-wider uppercase"
                      style={{ color: isSelected ? layer.color : "#737373" }}
                    >
                      {layer.num}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: layer.color }} />
                    )}
                  </div>
                  <div className="text-sm font-bold text-[#F5F5F5]">{layer.name}</div>
                  <p className="text-xs text-[#A3A3A3] leading-snug line-clamp-2">{layer.lead}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Active Layer Live Inspector (7 cols) */}
        <div className="lg:col-span-7 bg-[#1A1A1A] border border-[#383838] rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#303030] pb-3">
            <div className="flex items-center gap-2">
              <current.icon className="w-5 h-5" style={{ color: current.color }} />
              <span className="text-sm font-bold text-[#F5F5F5]">{current.name}</span>
            </div>
            <span
              className="text-[10px] font-mono px-2.5 py-0.5 rounded border"
              style={{
                borderColor: `${current.color}40`,
                backgroundColor: `${current.color}15`,
                color: current.color,
              }}
            >
              {current.specimenType}
            </span>
          </div>

          {/* Live Code Specimen */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-[#737373] uppercase tracking-wider block">
              LIVE DATA SPECIMEN:
            </span>
            <pre className="bg-[#141414] border border-[#2E2E2E] rounded-lg p-4 font-mono text-xs text-[#E5E5E5] overflow-x-auto leading-relaxed">
              <code>{current.specimenContent}</code>
            </pre>
          </div>

          {/* Boundary Guarantee Callout */}
          <div className="p-4 rounded-lg bg-[#252525] border border-[#383838] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F5F5F5]">
              <CheckCircle2 className="w-4 h-4 text-[#4ADE80] shrink-0" />
              <span>Architectural Isolation Invariant</span>
            </div>
            <p className="text-xs text-[#A3A3A3] leading-relaxed pl-6">
              {current.guarantee}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
