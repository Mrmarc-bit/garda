"use client";

import * as React from "react";
import { Sliders, BrainCircuit, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Info } from "lucide-react";

interface Approach {
  id: "rule" | "ai" | "sim";
  letter: "A" | "B" | "C";
  title: string;
  badge: string;
  badgeColor: string;
  borderColor: string;
  icon: React.ElementType;
  description: string;
  inspectionTarget: string;
  traits: {
    contextAwareness: string;
    safetyGuarantee: string;
    impactModeling: string;
  };
  pipelineSteps: string[];
}

const APPROACHES: Approach[] = [
  {
    id: "rule",
    letter: "A",
    title: "Rule-based Baseline",
    badge: "STATIC HEURISTICS",
    badgeColor: "text-[#A3A3A3] border-[#383838] bg-[#222222]",
    borderColor: "hover:border-[#737373]",
    icon: Sliders,
    description: "Predefined signature mappings and heuristic triggers. Actions follow fixed if-then branches.",
    inspectionTarget: "Inspect rule coverage gaps, unhandled edge cases, and rigid lack of operational context.",
    traits: {
      contextAwareness: "Low (Static Rules)",
      safetyGuarantee: "High (Deterministic)",
      impactModeling: "None (Service Blind)",
    },
    pipelineSteps: ["Signature Alert", "Static Rule Match", "Heuristic Execution"],
  },
  {
    id: "ai",
    letter: "B",
    title: "AI-Only Narrative",
    badge: "UNCONSTRAINED LLM",
    badgeColor: "text-[#F87171] border-[#F87171]/30 bg-[#F87171]/10",
    borderColor: "hover:border-[#F87171]/60",
    icon: BrainCircuit,
    description: "Narrative-led proposal directly from generative model without formal policy verification.",
    inspectionTarget: "Inspect evidence grounding, hallucinated actions, and unverified containment risks.",
    traits: {
      contextAwareness: "High (Generative)",
      safetyGuarantee: "Zero (Unpredictable)",
      impactModeling: "Qualitative Only",
    },
    pipelineSteps: ["Alert Ingestion", "Prompt Generation", "Autonomous Specimen"],
  },
  {
    id: "sim",
    letter: "C",
    title: "Simulation + Constraints",
    badge: "HYBRID DEFENSE (GARDA-SIM)",
    badgeColor: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/10",
    borderColor: "border-[#FF6B35]/50 hover:border-[#FF6B35]",
    icon: ShieldCheck,
    description: "Multi-candidate impact simulation combined with deterministic policy gates and human sign-off.",
    inspectionTarget: "Inspect assumption models, blast radius calculations, and fail-closed rule enforcement.",
    traits: {
      contextAwareness: "High (Evidence Grounded)",
      safetyGuarantee: "100% Deterministic Gate",
      impactModeling: "Quantitative Blast Radius",
    },
    pipelineSteps: ["Synthetic Evidence", "Impact Simulator", "Policy Gate", "Human Decision"],
  },
];

export function ResearchEvaluationMatrix() {
  const [selectedApproach, setSelectedApproach] = React.useState<"rule" | "ai" | "sim">("sim");

  return (
    <div className="space-y-6">
      {/* 3 Approach Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {APPROACHES.map((app) => {
          const Icon = app.icon;
          const isSelected = selectedApproach === app.id;

          return (
            <div
              key={app.id}
              onClick={() => setSelectedApproach(app.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative bg-[#202020] flex flex-col justify-between space-y-4 group ${
                isSelected
                  ? "border-[#FF6B35] shadow-xl shadow-[#FF6B35]/10 bg-[#242424]"
                  : "border-[#383838] hover:border-[#555555]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                        isSelected
                          ? "bg-[#FF6B35] text-white"
                          : "bg-[#2A2A2A] text-[#A3A3A3] group-hover:text-[#F5F5F5]"
                      }`}
                    >
                      {app.letter}
                    </div>
                    <span className="text-sm font-bold text-[#F5F5F5]">{app.title}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${app.badgeColor}`}>
                    {app.badge}
                  </span>
                </div>

                <p className="text-xs text-[#A3A3A3] leading-relaxed">{app.description}</p>
              </div>

              {/* Pipeline Step Flow */}
              <div className="pt-3 border-t border-[#333333] space-y-2">
                <span className="text-[10px] font-mono uppercase text-[#737373] tracking-wider block">
                  Execution Pipeline:
                </span>
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px]">
                  {app.pipelineSteps.map((step, idx) => (
                    <React.Fragment key={step}>
                      <span
                        className={`px-2 py-1 rounded text-[10px] border ${
                          app.id === "sim" && step === "Policy Gate"
                            ? "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30 font-semibold"
                            : app.id === "sim" && step === "Human Decision"
                            ? "bg-[#FF6B35]/15 text-[#FF6B35] border-[#FF6B35]/30 font-semibold"
                            : app.id === "ai" && step === "Autonomous Specimen"
                            ? "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30 font-semibold"
                            : "bg-[#282828] text-[#D4D4D4] border-[#383838]"
                        }`}
                      >
                        {step}
                      </span>
                      {idx < app.pipelineSteps.length - 1 && (
                        <span className="text-[#555555]">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Inspection Target Highlight */}
              <div className="p-3 rounded-xl bg-[#181818] border border-[#2F2F2F] space-y-1">
                <span className="text-[10px] font-mono uppercase text-[#FF6B35] tracking-wider block">
                  Evaluation Focus:
                </span>
                <p className="text-[11px] text-[#A3A3A3] leading-snug">{app.inspectionTarget}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparative Evaluation Specimen Table */}
      <div className="bg-[#202020] border border-[#383838] rounded-xl p-5 overflow-x-auto space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#303030]">
          <span className="text-xs font-mono font-bold text-[#F5F5F5] uppercase tracking-wider">
            Evaluation Criteria Comparison Specimen
          </span>
          <span className="text-[10px] font-mono text-[#737373]">
            BENCHMARK PLAN · METHODOLOGICAL MATRIX
          </span>
        </div>

        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-[#333333] text-[#737373]">
              <th className="pb-2.5 font-medium w-1/4">APPROACH</th>
              <th className="pb-2.5 font-medium w-1/4">CONTEXT AWARENESS</th>
              <th className="pb-2.5 font-medium w-1/4">SAFETY GUARANTEE</th>
              <th className="pb-2.5 font-medium">IMPACT MODELING</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2E2E2E]">
            <tr>
              <td className="py-3 text-[#F5F5F5] font-sans font-medium flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#2A2A2A] text-center leading-5 text-[11px] font-mono text-[#A3A3A3]">
                  A
                </span>
                Rule-based
              </td>
              <td className="py-3 text-[#A3A3A3]">Low · Predefined signatures</td>
              <td className="py-3 text-[#4ADE80]">High · Deterministic execution</td>
              <td className="py-3 text-[#737373]">None · Service blind</td>
            </tr>
            <tr>
              <td className="py-3 text-[#F5F5F5] font-sans font-medium flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#2A2A2A] text-center leading-5 text-[11px] font-mono text-[#A3A3A3]">
                  B
                </span>
                AI-only
              </td>
              <td className="py-3 text-[#A3A3A3]">High · Generative contextual synthesis</td>
              <td className="py-3 text-[#F87171]">Zero · Unreliable unconstrained model</td>
              <td className="py-3 text-[#A3A3A3]">Qualitative only · Text narrative</td>
            </tr>
            <tr className="bg-[#262626]">
              <td className="py-3 text-[#F5F5F5] font-sans font-bold flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-[#FF6B35] text-white text-center leading-5 text-[11px] font-mono">
                  C
                </span>
                Simulation + constraints
              </td>
              <td className="py-3 text-[#F5F5F5]">High · Grounded in synthetic evidence</td>
              <td className="py-3 text-[#4ADE80] font-semibold">100% · Independent code gate</td>
              <td className="py-3 text-[#4ADE80] font-semibold">Quantitative blast radius</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Mandatory Disclaimer Note */}
      <div className="p-4 rounded-xl bg-[#232323] border border-[#383838] flex items-center gap-3 text-xs text-[#A3A3A3]">
        <Info className="w-4 h-4 text-[#737373] shrink-0" />
        <div>
          <strong className="text-[#F5F5F5]">Evaluation Notice:</strong> No experiment run yet.
          No comparative results, measured improvements or superiority claims are available.
        </div>
      </div>
    </div>
  );
}
