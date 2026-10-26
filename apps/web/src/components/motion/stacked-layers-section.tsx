"use client";

import * as React from "react";
import { Shield, Eye, Cpu, Lock, Database, ArrowRight } from "lucide-react";
import { DecryptedText } from "./decrypted-text";
import { TextBlockAnimation } from "./text-block-animation";

interface LayerData {
  index: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  icon: React.ElementType;
  description: string;
  guarantee: string;
  specimenJson: Record<string, unknown>;
  bgColor: string;
}

const LAYERS: LayerData[] = [
  {
    index: "01",
    title: "Synthetic Evidence Layer",
    subtitle: "Source observations, strictly isolated from production.",
    badge: "LAYER 1 · PROVENANCE",
    badgeColor: "text-[#38BDF8] border-[#38BDF8]/30 bg-[#38BDF8]/10",
    icon: Database,
    description:
      "All logs, events, and metrics are deterministically generated synthetic artifacts. Zero connection to live SCADA, cloud production, or military infrastructure. Every event is cryptographic hash-linked.",
    guarantee: "INVARIANT: PRODUCTION_TRAFFIC_BYTES == 0",
    specimenJson: {
      event_id: "EV-0042-01",
      timestamp: "2026-10-26T09:14:00Z",
      source_host: "APP-GW-02 (Virtual)",
      action: "OAUTH_ELEVATION_REQUEST",
      actor: "analyst-demo-03",
      hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    },
    bgColor: "bg-[#161616]",
  },
  {
    index: "02",
    title: "Derived Assessment Layer",
    subtitle: "Quantitative service impact and blast radius modeling.",
    badge: "LAYER 2 · GRAPH SIMULATION",
    badgeColor: "text-[#FBBF24] border-[#FBBF24]/30 bg-[#FBBF24]/10",
    icon: Eye,
    description:
      "Simulates downstream cascading effects on dependent IT/OT assets. Computes estimated recovery time, operational availability, and security containment benefit without applying live firewall changes.",
    guarantee: "INVARIANT: VIRTUAL_CONTAINMENT_EVAL == TRUE",
    specimenJson: {
      assessment_id: "ASM-2026-088",
      target_asset: "APP-GW-02",
      downstream_nodes: ["OT-CONTROLLER-SIM-01", "MONITOR-01"],
      computed_blast_radius: "2 of 6 virtual nodes",
      downtime_projection_min: 15,
      operational_disruption: "LOW_TO_MODERATE",
    },
    bgColor: "bg-[#181818]",
  },
  {
    index: "03",
    title: "Explainable AI Advisory Layer",
    subtitle: "Narrative synthesis with explicit uncertainty quantification.",
    badge: "LAYER 3 · GENERATIVE REASONING",
    badgeColor: "text-[#A78BFA] border-[#A78BFA]/30 bg-[#A78BFA]/10",
    icon: Cpu,
    description:
      "Generates human-readable trade-off rationales grounded in synthetic evidence. Calibrates confidence scores (0.82) and highlights unverified assumptions. AI outputs are treated as proposals, not authorizations.",
    guarantee: "INVARIANT: AI_AUTONOMOUS_EXECUTION == FALSE",
    specimenJson: {
      model_specimen: "Claude-3.5-Sonnet-Specimen",
      calibrated_confidence: 0.82,
      proposed_strategy: "Session Revocation + Target Challenge",
      why_narrow_response: "Preserves telemetry continuity while evicting unauthorized token",
      grounded_evidence_ids: ["EV-0042-01", "EV-0042-02"],
    },
    bgColor: "bg-[#1A1A1A]",
  },
  {
    index: "04",
    title: "Deterministic Safety Policy Gate",
    subtitle: "Fail-closed rules that cannot be bypassed by AI text.",
    badge: "LAYER 4 · FAIL-CLOSED GATE",
    badgeColor: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/10",
    icon: Lock,
    description:
      "Hardcoded invariant checks (SEC-OT-01 to SEC-OT-05) run independently of LLM reasoning. Vetoes any proposal that cuts critical OT telemetry. Enforces mandatory Level-2 Human In The Loop sign-off.",
    guarantee: "INVARIANT: OT_TELEMETRY_STREAM_LOSS == 0",
    specimenJson: {
      gate_engine: "DETERMINISTIC_V2.4",
      rule_id: "SEC-OT-01",
      result: "PASSED (Compliant with Telemetry Preservation)",
      enforcement: "HARD_FAIL_CLOSED",
      human_sign_off_required: true,
      execution_permission: "HELD_PENDING_REVIEW",
    },
    bgColor: "bg-[#1C1C1C]",
  },
];

export function StackedLayersSection() {
  return (
    <div className="relative w-full">
      {LAYERS.map((layer, index) => {
        const IconComponent = layer.icon;

        return (
          <section
            key={layer.index}
            className={`sticky top-0 min-h-screen w-full ${layer.bgColor} border-t border-[#383838] shadow-[0_-20px_50px_rgba(0,0,0,0.85)] flex flex-col justify-center px-6 md:px-12 lg:px-16 py-16 overflow-hidden transition-all`}
            style={{
              zIndex: index + 1,
            }}
          >
            {/* Subtle hairline technical grid */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(#505050 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
              aria-hidden="true"
            />

            <div className="relative max-w-[1440px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column (6 cols): Copy & Description */}
              <div className="lg:col-span-6 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl md:text-4xl font-bold text-[#FF6B35]">
                    {layer.index}
                  </span>
                  <span
                    className={`text-xs font-mono px-3 py-1 rounded-full border font-semibold ${layer.badgeColor}`}
                  >
                    <DecryptedText text={layer.badge} speed={30} />
                  </span>
                </div>

                <div className="space-y-2">
                  <TextBlockAnimation
                    text={layer.title}
                    as="h3"
                    className="text-3xl md:text-4xl font-bold text-[#F5F5F5] tracking-tight leading-tight"
                    variant="mask"
                  />
                  <p className="text-base text-[#D4D4D4] font-medium leading-relaxed">
                    {layer.subtitle}
                  </p>
                </div>

                <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-xl">
                  {layer.description}
                </p>

                <div className="pt-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#252525] border border-[#383838] font-mono text-xs text-[#86EFAC]">
                    <Shield className="w-3.5 h-3.5 text-[#4ADE80]" />
                    <span>{layer.guarantee}</span>
                  </div>
                </div>

                {index < LAYERS.length - 1 ? (
                  <div className="text-[11px] font-mono text-[#737373] flex items-center gap-1.5 pt-2">
                    <span>Scroll to reveal Layer {LAYERS[index + 1].index}</span>
                    <ArrowRight className="w-3 h-3 text-[#FF6B35] animate-pulse" />
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-[#4ADE80] pt-2">
                    ✓ All 4 Architectural Layers Enforced
                  </div>
                )}
              </div>

              {/* Right Column (6 cols): Code Specimen Terminal */}
              <div className="lg:col-span-6">
                <div className="bg-[#121212] border border-[#383838] rounded-2xl p-5 shadow-2xl space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#2B2B2B] text-[11px] text-[#737373]">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-[#FF6B35]" />
                      <span className="text-[#F5F5F5] font-semibold">
                        LAYER_{layer.index}_SPECIMEN.json
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#252525] text-[#A3A3A3]">
                      SIMULATED DATA
                    </span>
                  </div>

                  <div className="bg-[#0A0A0A] p-4 rounded-xl border border-[#222222] text-[#D4D4D4] overflow-x-auto text-[11px] leading-relaxed">
                    <pre className="text-[#A3A3A3]">
                      {JSON.stringify(layer.specimenJson, null, 2)}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-[#737373]">
                    <span>STATUS: ENFORCED IN SIMULATION</span>
                    <span className="text-[#FF6B35]">GARDA-SIM AI BOUNDARY</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
