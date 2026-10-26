"use client";

import * as React from "react";
import { Play, Pause, ChevronRight, Clock, ShieldAlert, CheckCircle2, RotateCcw } from "lucide-react";

interface StepData {
  num: string;
  name: string;
  category: string;
  lead: string;
  artifactLabel: string;
  artifactContent: string;
  timestamp: string;
  statusText: string;
}

export const TimelineScrubber: React.FC = () => {
  const [currentStep, setCurrentStep] = React.useState<number>(0);
  const [isPlaying, setIsPlaying] = React.useState<boolean>(false);

  const steps: StepData[] = [
    {
      num: "01",
      name: "Scenario Ingestion",
      category: "INCIDENT CONTEXT",
      lead: "Choose INC-2026-0042 and initialize the bounded virtual environment.",
      artifactLabel: "INCIDENT PROFILE SPECIMEN",
      artifactContent: "INC-2026-0042 · High Severity · Target: APP-GW-02 · Gateway Cluster A · Virtual Sandbox",
      timestamp: "09:13:40 UTC",
      statusText: "Scenario Loaded (Synthetic)",
    },
    {
      num: "02",
      name: "Evidence Provenance",
      category: "SYNTHETIC EVIDENCE",
      lead: "Inspect EV-0042-01 through EV-0042-03 and their immutable UTC provenance.",
      artifactLabel: "CHRONOLOGICAL PROVENANCE LOGS",
      artifactContent: "EV-0042-01 [09:14:00 UTC]: Role elevation requested\nEV-0042-02 [09:14:08 UTC]: Privileged token issued\nEV-0042-03 [09:15:10 UTC]: Privileged route accessed",
      timestamp: "09:15:10 UTC",
      statusText: "Evidence Verified (No Fabricated IDs)",
    },
    {
      num: "03",
      name: "Candidate Generation",
      category: "CANDIDATE STRATEGIES",
      lead: "Define session revocation, access restriction or more verification candidates.",
      artifactLabel: "HYPOTHETICAL ACTION PROPOSALS",
      artifactContent: "Option A: Revoke analyst-demo-03 session\nOption B: Restrict APP-GW-02 route access\nOption C: Virtual isolation of gateway & controller",
      timestamp: "09:16:00 UTC",
      statusText: "3 Strategies Formulated",
    },
    {
      num: "04",
      name: "Impact Projection",
      category: "DERIVED ASSESSMENT",
      lead: "Compare possible security benefit and virtual service disruption deterministically.",
      artifactLabel: "ESTIMATED TRADE-OFF MATRIX",
      artifactContent: "Security Benefit: Moderate (A) vs High (C)\nEstimated Downtime: 0 min (A) vs 180 min (C)\nOT Controller Impact: None (A) vs Severe Disruption (C)",
      timestamp: "09:16:45 UTC",
      statusText: "Downtime Modeled",
    },
    {
      num: "05",
      name: "Policy Gate Enforcement",
      category: "POLICY VALIDATION",
      lead: "Inspect proposed constraint checks independent of generated AI text.",
      artifactLabel: "DETERMINISTIC INVARIANT VERDICT",
      artifactContent: "[POL-01 Preserve Monitoring] -> PASS\n[POL-02 Operator Review Required] -> PASS\n[POL-03 Do Not Isolate OT Controller] -> Option C REJECTED",
      timestamp: "09:17:15 UTC",
      statusText: "Hard Constraints Enforced",
    },
    {
      num: "06",
      name: "Human Demonstration Review",
      category: "HUMAN REVIEW",
      lead: "An authorized operator approves for demonstration, rejects or asks for more evidence.",
      artifactLabel: "AUDIT-READY HUMAN VERDICT",
      artifactContent: "Verdict: APPROVED_FOR_DEMONSTRATION (Option A)\nOperator: Security Analyst demo-03\nCryptographic Hash: 8f4c2e...b3a1 (Recorded in Audit Trail)",
      timestamp: "09:18:00 UTC",
      statusText: "Sign-off Recorded",
    },
  ];

  // Auto-play interval
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % steps.length);
      }, 3500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length]);

  const active = steps[currentStep];

  return (
    <div className="bg-[#202020] border border-[#383838] rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header with Play/Pause button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#383838] pb-4">
        <div>
          <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase">
            04 / HOW IT WORKS — INTERACTIVE DECISION PIPELINE
          </div>
          <h3 className="text-xl font-bold text-[#F5F5F5] mt-1">
            From Synthetic Evidence to Human Review
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-[#282828] border border-[#383838] hover:border-[#FF6B35] text-xs font-mono text-[#F5F5F5] px-3.5 py-1.5 rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#FF6B35]" />
                <span>Play sequence</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(0);
            }}
            className="p-1.5 rounded-lg bg-[#282828] border border-[#383838] text-[#737373] hover:text-[#F5F5F5] transition-colors"
            title="Reset to stage 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6 Step Navigation Scrubber Bar */}
      <div className="grid grid-cols-6 gap-2">
        {steps.map((s, idx) => {
          const isSelected = idx === currentStep;
          const isPassed = idx < currentStep;

          return (
            <button
              key={s.num}
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStep(idx);
              }}
              className="text-left group focus:outline-none"
            >
              {/* Progress Line */}
              <div
                className={`h-1.5 rounded-full mb-2 transition-all ${
                  isSelected
                    ? "bg-[#FF6B35]"
                    : isPassed
                    ? "bg-[#FF6B35]/50"
                    : "bg-[#303030] group-hover:bg-[#404040]"
                }`}
              />
              <div className="hidden sm:block">
                <span
                  className={`text-[10px] font-mono block ${
                    isSelected ? "text-[#FF6B35] font-bold" : "text-[#737373]"
                  }`}
                >
                  {s.num}
                </span>
                <span
                  className={`text-xs truncate block ${
                    isSelected ? "text-[#F5F5F5] font-medium" : "text-[#737373]"
                  }`}
                >
                  {s.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Detail Visualizer */}
      <div className="bg-[#1A1A1A] border border-[#383838] rounded-xl p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Side: Stage Context (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#FF6B35]/20 border border-[#FF6B35]/40 text-[#FF6B35] font-mono font-bold text-xs flex items-center justify-center">
              {active.num}
            </span>
            <span className="text-[11px] font-mono text-[#FF6B35] tracking-wider uppercase font-semibold">
              {active.category}
            </span>
          </div>

          <h4 className="text-lg font-bold text-[#F5F5F5]">{active.name}</h4>
          <p className="text-xs text-[#A3A3A3] leading-relaxed">{active.lead}</p>

          <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-[#737373]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#FF6B35]" />
              {active.timestamp}
            </span>
            <span>·</span>
            <span className="text-[#4ADE80] font-medium">{active.statusText}</span>
          </div>
        </div>

        {/* Right Side: Live Specimen Output Box (7 cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-[#2E2E2E] rounded-lg p-5 font-mono text-xs space-y-2.5">
          <div className="flex items-center justify-between text-[10px] text-[#737373] border-b border-[#282828] pb-2">
            <span className="text-[#FF6B35] font-bold tracking-wider uppercase">
              {active.artifactLabel}
            </span>
            <span>SIMULATION LAB DATA</span>
          </div>
          <pre className="text-xs text-[#E5E5E5] whitespace-pre-wrap leading-relaxed font-mono">
            <code>{active.artifactContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
