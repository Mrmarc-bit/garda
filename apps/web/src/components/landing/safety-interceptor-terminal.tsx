"use client";

import * as React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  Cpu,
  Lock,
  Terminal,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCode,
} from "lucide-react";

interface PolicyRule {
  id: string;
  name: string;
  category: "OT Safety" | "Auth Boundary" | "Environment" | "Audit";
  invariant: string;
  status: "PASSED" | "BLOCKED";
  rationale: string;
}

const SCENARIOS = {
  aggressive: {
    id: "aggressive",
    label: "Candidate A: Full Subnet Cut (Aggressive)",
    badgeColor: "text-[#F87171] border-[#F87171]/30 bg-[#F87171]/10",
    aiNarrative:
      "To contain credential abuse on APP-GW-02 immediately, AI recommends isolating subnet 10.200.0.0/24 and severing all inbound/outbound TCP/UDP interfaces on OT-CONTROLLER-SIM-01.",
    confidence: "0.89 (High Narrative Confidence)",
    rules: [
      {
        id: "SEC-OT-01",
        name: "Zero Real-World Containment",
        category: "Environment" as const,
        invariant: "TARGET_ASSET IN SYNTHETIC_INVENTORY",
        status: "PASSED" as const,
        rationale: "Target assets are bounded virtual entities in the synthetic inventory.",
      },
      {
        id: "SEC-OT-02",
        name: "Operator Clearance",
        category: "Auth Boundary" as const,
        invariant: "SESSION_CLEARANCE >= 2",
        status: "PASSED" as const,
        rationale: "Identity is resolved from the server session, never from the request body.",
      },
      {
        id: "SEC-OT-03",
        name: "Protected Identity Asset",
        category: "Auth Boundary" as const,
        invariant: "IDENTITY-SVC-01 NOT TARGETED",
        status: "PASSED" as const,
        rationale: "The core identity service is outside the targetable set.",
      },
      {
        id: "SEC-OT-04",
        name: "Uninterrupted OT Telemetry",
        category: "OT Safety" as const,
        invariant: "OT_TELEMETRY_STREAM_LOSS == 0",
        status: "BLOCKED" as const,
        rationale: "VIOLATION: the modelled impact severs TELEMETRY-SIM-01 and OT-CONTROLLER-SIM-01.",
      },
      {
        id: "SEC-OT-05",
        name: "Ledger Integrity",
        category: "Audit" as const,
        invariant: "AUDIT_CHAIN_VERIFIED == TRUE",
        status: "PASSED" as const,
        rationale: "The HMAC-SHA256 chain verified before this run was accepted.",
      },
    ],
    gateResult: {
      decision: "INTERCEPTED & BLOCKED",
      color: "text-[#F87171]",
      border: "border-[#F87171]/40",
      bg: "bg-[#F87171]/10",
      summary:
        "Deterministic Gate strictly vetoed AI recommendation. Invariant SEC-OT-01 failed. Action cancelled before reaching human queue.",
    },
  },
  scoped: {
    id: "scoped",
    label: "Candidate B: Scoped Token Revocation (Defensive)",
    badgeColor: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/10",
    aiNarrative:
      "To mitigate privilege escalation on analyst-demo-03, AI proposes revoking synthetic OAuth session on APP-GW-02 and enforcing MFA challenge while maintaining OT sensor links.",
    confidence: "0.82 (Calibrated Specimen)",
    rules: [
      {
        id: "SEC-OT-01",
        name: "Zero Real-World Containment",
        category: "Environment" as const,
        invariant: "TARGET_ASSET IN SYNTHETIC_INVENTORY",
        status: "PASSED" as const,
        rationale: "Target assets are bounded virtual entities in the synthetic inventory.",
      },
      {
        id: "SEC-OT-02",
        name: "Operator Clearance",
        category: "Auth Boundary" as const,
        invariant: "SESSION_CLEARANCE >= 2",
        status: "PASSED" as const,
        rationale: "Identity is resolved from the server session, never from the request body.",
      },
      {
        id: "SEC-OT-03",
        name: "Protected Identity Asset",
        category: "Auth Boundary" as const,
        invariant: "IDENTITY-SVC-01 NOT TARGETED",
        status: "PASSED" as const,
        rationale: "The core identity service is outside the targetable set.",
      },
      {
        id: "SEC-OT-04",
        name: "Uninterrupted OT Telemetry",
        category: "OT Safety" as const,
        invariant: "OT_TELEMETRY_STREAM_LOSS == 0",
        status: "PASSED" as const,
        rationale: "COMPLIANT: no modelled impact on the OT telemetry path.",
      },
      {
        id: "SEC-OT-05",
        name: "Ledger Integrity",
        category: "Audit" as const,
        invariant: "AUDIT_CHAIN_VERIFIED == TRUE",
        status: "PASSED" as const,
        rationale: "The HMAC-SHA256 chain verified before this run was accepted.",
      },
    ],
    gateResult: {
      decision: "PERMITTED FOR HUMAN REVIEW",
      color: "text-[#4ADE80]",
      border: "border-[#4ADE80]/40",
      bg: "bg-[#4ADE80]/10",
      summary:
        "All critical safety invariants satisfied. Action promoted to Human Review Queue. Zero automated production execution.",
    },
  },
};

export function SafetyInterceptorTerminal() {
  const [selectedScenarioKey, setSelectedScenarioKey] = React.useState<"aggressive" | "scoped">("aggressive");
  const [evaluating, setEvaluating] = React.useState(false);

  const scenario = SCENARIOS[selectedScenarioKey];

  const handleSwitchScenario = (key: "aggressive" | "scoped") => {
    setEvaluating(true);
    setSelectedScenarioKey(key);
    setTimeout(() => {
      setEvaluating(false);
    }, 450);
  };

  return (
    <div className="bg-[#1C1C1C] border border-[#383838] rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Bar */}
      <div className="px-5 py-4 bg-[#232323] border-b border-[#333333] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-xs font-mono font-bold text-[#F5F5F5] tracking-wider uppercase">
            Deterministic Safety Interceptor Gate
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FF6B35]/15 border border-[#FF6B35]/30 text-[#FF6B35]">
            GATE_ENGINE · FAIL-CLOSED · ILLUSTRATIVE
          </span>
        </div>

        {/* Scenario Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#737373]">TEST SPECIMEN:</span>
          <button
            type="button"
            onClick={() => handleSwitchScenario("aggressive")}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              selectedScenarioKey === "aggressive"
                ? "bg-[#F87171]/20 border-[#F87171] text-[#F87171] font-semibold"
                : "bg-[#2A2A2A] border-[#383838] text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            A: Aggressive Cut (Violates Policy)
          </button>
          <button
            type="button"
            onClick={() => handleSwitchScenario("scoped")}
            className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all ${
              selectedScenarioKey === "scoped"
                ? "bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80] font-semibold"
                : "bg-[#2A2A2A] border-[#383838] text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            B: Scoped Revocation (Passes Gate)
          </button>
        </div>
      </div>

      {/* Split Terminal Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#303030]">
        {/* Left Column (5 cols): AI Generated Proposal Specimen */}
        <div className="lg:col-span-5 p-5 space-y-4 bg-[#181818]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#A3A3A3]" />
              <span className="text-xs font-mono font-semibold text-[#F5F5F5]">
                AI Narrative Output (Specimen)
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A2A2A] text-[#737373] border border-[#383838]">
              UNVERIFIED MODEL ASSERTION
            </span>
          </div>

          <div className="p-3.5 bg-[#202020] border border-[#333333] rounded-xl space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#737373]">
              <span>Model: not connected / fixture narrative</span>
              <span className="text-[#FF6B35]">{scenario.confidence}</span>
            </div>
            <div className="font-mono text-xs text-[#E5E5E5] leading-relaxed bg-[#141414] p-3 rounded-lg border border-[#2D2D2D]">
              <span className="text-[#737373] select-none block text-[10px] mb-1">
                // Raw generated mitigation recommendation:
              </span>
              {scenario.aiNarrative}
            </div>
            <div className="text-[10px] text-[#A3A3A3] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FBBF24] shrink-0" />
              <span>AI models cannot execute actions or authorize system state changes.</span>
            </div>
          </div>

          <div className="p-3.5 bg-[#202020]/50 border border-[#333333] rounded-xl space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#737373] tracking-wider block">
              Core Architectural Separation
            </span>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              In GARDA-SIM AI, the generative layer produces explanations and candidate options.
              It is strictly air-gapped from execution channels. The policy engine below operates
              with hard deterministic assertions written in code, evaluating independently of LLM reasoning.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): Deterministic Safety Invariant Engine */}
        <div className="lg:col-span-7 p-5 space-y-4 bg-[#1A1A1A]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-xs font-mono font-semibold text-[#F5F5F5]">
                Policy Invariant Engine (Deterministic Code Gate)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono text-[#737373]">
              {evaluating ? (
                <span className="flex items-center gap-1.5 text-[#FF6B35]">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Evaluating invariants...
                </span>
              ) : (
                <span className="text-[#4ADE80] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" /> Live Guard
                </span>
              )}
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-2.5">
            {scenario.rules.map((rule) => {
              const isBlocked = rule.status === "BLOCKED";

              return (
                <div
                  key={rule.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isBlocked
                      ? "bg-[#2B1B1B] border-[#F87171]/40"
                      : "bg-[#1F2520] border-[#4ADE80]/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#F5F5F5]">
                          {rule.id}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171717] text-[#A3A3A3] border border-[#333333]">
                          {rule.category}
                        </span>
                        <span className="text-xs font-semibold text-[#D4D4D4]">
                          {rule.name}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-[#858585]">
                        <span className="text-[#737373]">Invariant: </span>
                        <code>{rule.invariant}</code>
                      </div>
                      <p
                        className={`text-xs mt-1 leading-snug ${
                          isBlocked ? "text-[#FCA5A5]" : "text-[#86EFAC]"
                        }`}
                      >
                        {rule.rationale}
                      </p>
                    </div>

                    <div className="shrink-0 pt-0.5">
                      {isBlocked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#F87171]/20 text-[#F87171] border border-[#F87171]/40">
                          <XCircle className="w-3.5 h-3.5" /> BLOCKED
                        </span>
                      )}
                      {!isBlocked && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono font-bold bg-[#4ADE80]/20 text-[#4ADE80] border border-[#4ADE80]/40">
                          <CheckCircle2 className="w-3.5 h-3.5" /> PASSED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interception Gate Final Status Banner */}
          <div
            className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${scenario.gateResult.bg} ${scenario.gateResult.border}`}
          >
            <div className="flex items-center gap-3">
              {selectedScenarioKey === "aggressive" ? (
                <ShieldAlert className="w-6 h-6 text-[#F87171] shrink-0" />
              ) : (
                <ShieldCheck className="w-6 h-6 text-[#4ADE80] shrink-0" />
              )}
              <div>
                <div
                  className={`text-xs font-mono font-bold tracking-wider uppercase ${scenario.gateResult.color}`}
                >
                  GATE DECISION: {scenario.gateResult.decision}
                </div>
                <div className="text-xs text-[#A3A3A3] mt-0.5 leading-snug">
                  {scenario.gateResult.summary}
                </div>
              </div>
            </div>

            <div className="shrink-0 text-right font-mono text-[10px] text-[#737373]">
              <div>FAIL-CLOSED POLICY</div>
              <div className="text-[#F5F5F5]">Deterministic Rule</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="px-5 py-3 bg-[#171717] border-t border-[#303030] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#737373]">
        <div className="flex items-center gap-3">
          <span className="text-[#FF6B35]">SAFETY INVARIANTS:</span>
          <span>Zero real-world network packet transmission</span>
          <span>·</span>
          <span>Append-only synthetic log audit</span>
        </div>
        <div className="text-[#A3A3A3]">
          Pending Review remains default in all execution pipelines.
        </div>
      </div>
    </div>
  );
}
