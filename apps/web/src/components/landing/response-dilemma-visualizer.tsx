"use client";

import * as React from "react";
import {
  AlertOctagon,
  ShieldAlert,
  ShieldCheck,
  Activity,
  ArrowRight,
  ZapOff,
  Radio,
  Server,
  Layers,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export function ResponseDilemmaVisualizer() {
  const [mode, setMode] = React.useState<"blind" | "simulated">("blind");

  return (
    <div className="bg-[#1C1C1C] border border-[#383838] rounded-2xl overflow-hidden shadow-2xl">
      {/* Top Controller Bar */}
      <div className="px-6 py-4 bg-[#232323] border-b border-[#333333] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-xs font-mono font-bold text-[#F5F5F5] tracking-wider uppercase">
            Interactive Response Dilemma Simulator
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2E2E2E] text-[#A3A3A3] border border-[#383838]">
            INC-2026-0042 · TARGET: APP-GW-02
          </span>
        </div>

        {/* Toggle Mode */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-[#737373]">SELECT RESPONSE STRATEGY:</span>
          <button
            type="button"
            onClick={() => setMode("blind")}
            className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all ${
              mode === "blind"
                ? "bg-[#F87171]/20 border-[#F87171] text-[#F87171] font-semibold shadow-lg shadow-[#F87171]/10"
                : "bg-[#282828] border-[#383838] text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            A: Blind Host Isolation (Naive)
          </button>
          <button
            type="button"
            onClick={() => setMode("simulated")}
            className={`text-xs font-mono px-3.5 py-1.5 rounded-lg border transition-all ${
              mode === "simulated"
                ? "bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80] font-semibold shadow-lg shadow-[#4ADE80]/10"
                : "bg-[#282828] border-[#383838] text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            B: GARDA-SIM Context Simulation (Defensive)
          </button>
        </div>
      </div>

      {/* Main Comparison Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#303030]">
        {/* Left Column (5 cols): Incident Trigger & Target Asset */}
        <div className="lg:col-span-5 p-6 space-y-5 bg-[#181818]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase text-[#737373] tracking-wider block">
              Observed Invariant Trigger
            </span>
            <h3 className="text-base font-bold text-[#F5F5F5]">
              Privilege Elevation on Critical Bridge
            </h3>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Analyst-demo-03 requested elevation on virtual host <code className="text-[#FF6B35]">APP-GW-02</code>.
              This asset bridges the corporate identity boundary with physical OT sensor telemetry.
            </p>
          </div>

          {/* Asset Architecture Node Card */}
          <div className="p-4 rounded-xl bg-[#202020] border border-[#333333] space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between text-[11px] pb-2 border-b border-[#2C2C2C]">
              <span className="text-[#F5F5F5] font-semibold flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-[#38BDF8]" /> APP-GW-02 (Virtual)
              </span>
              <span className="text-[#FBBF24]">PORT 8443 / ACTIVE</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#737373]">Downstream Dependency:</span>
                <span className="text-[#E5E5E5]">OT-CONTROLLER-SIM-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Telemetry Protocol:</span>
                <span className="text-[#E5E5E5]">DNP3 / Modbus TCP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#737373]">Safety Requirement:</span>
                <span className="text-[#4ADE80]">Zero stream interruption</span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#202020]/60 border border-[#303030] space-y-2">
            <span className="text-[10px] font-mono uppercase text-[#FF6B35] tracking-wider block font-bold">
              The Fundamental Dilemma
            </span>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              In traditional SOC playbooks, isolating the host is the reflexive standard. But in combined IT/OT environments,
              uninformed isolation destroys sensor visibility, causing physical emergency shutdowns.
            </p>
          </div>
        </div>

        {/* Right Column (7 cols): The Divergent Operational Outcomes */}
        <div className="lg:col-span-7 p-6 space-y-5 bg-[#1B1B1B]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {mode === "blind" ? (
                <ShieldAlert className="w-5 h-5 text-[#F87171]" />
              ) : (
                <ShieldCheck className="w-5 h-5 text-[#4ADE80]" />
              )}
              <h3 className="text-sm font-bold text-[#F5F5F5]">
                {mode === "blind"
                  ? "Outcome: Threat Stopped, Service Collapsed"
                  : "Outcome: Threat Contained, Service Preserved"}
              </h3>
            </div>
            <span
              className={`text-[10px] font-mono px-2.5 py-0.5 rounded border font-semibold ${
                mode === "blind"
                  ? "bg-[#F87171]/15 text-[#F87171] border-[#F87171]/30"
                  : "bg-[#4ADE80]/15 text-[#4ADE80] border-[#4ADE80]/30"
              }`}
            >
              {mode === "blind" ? "NAIVE ISOLATION COLLATERAL" : "BALANCED DEFENSIVE SIMULATION"}
            </span>
          </div>

          {/* Live Telemetry Heartbeat Stream Canvas */}
          <div className="p-4 rounded-xl bg-[#141414] border border-[#2E2E2E] space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#737373] flex items-center gap-1.5">
                <Radio
                  className={`w-3.5 h-3.5 ${
                    mode === "blind" ? "text-[#F87171]" : "text-[#4ADE80] animate-pulse"
                  }`}
                />
                OT-CONTROLLER TELEMETRY HEARTBEAT
              </span>
              <span
                className={`font-semibold ${
                  mode === "blind" ? "text-[#F87171]" : "text-[#4ADE80]"
                }`}
              >
                {mode === "blind" ? "0 bps · STREAM DEAD" : "64 kbps · CONTINUOUS ACTIVE"}
              </span>
            </div>

            {/* Simulated Dynamic Telemetry Waveform */}
            <div className="h-16 w-full rounded-lg bg-[#0C0C0C] border border-[#222222] relative overflow-hidden flex items-center px-4">
              {mode === "blind" ? (
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#F87171]">
                  <span className="flex items-center gap-2">
                    <ZapOff className="w-4 h-4 text-[#F87171]" /> TELEMETRY BLACKOUT · EMERGENCY SENSOR BLINDNESS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#F87171]/20 border border-[#F87171]/40 text-[10px]">
                    TRIP TRIGGERED
                  </span>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between text-[11px] font-mono text-[#4ADE80]">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-[#4ADE80] animate-pulse" /> NORMAL SCADA TRANSMISSION CONTINUOUS
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#4ADE80]/20 border border-[#4ADE80]/40 text-[10px]">
                    100% HEALTHY
                  </span>
                </div>
              )}

              {/* Animated waveform line */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
                preserveAspectRatio="none"
                viewBox="0 0 400 60"
              >
                {mode === "blind" ? (
                  <path
                    d="M 0 30 Q 30 10 60 30 T 120 30 L 140 58 L 400 58"
                    fill="none"
                    stroke="#F87171"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                ) : (
                  <path
                    d="M 0 30 Q 25 15 50 30 T 100 30 T 150 30 T 200 30 T 250 30 T 300 30 T 350 30 T 400 30"
                    fill="none"
                    stroke="#4ADE80"
                    strokeWidth="2"
                  />
                )}
              </svg>
            </div>
          </div>

          {/* 3 Metric Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`p-3.5 rounded-xl border font-mono text-xs ${
                mode === "blind"
                  ? "bg-[#2B1B1B] border-[#F87171]/30"
                  : "bg-[#1E2520] border-[#4ADE80]/30"
              }`}
            >
              <div className="text-[10px] text-[#737373] uppercase">Security Containment</div>
              <div
                className={`text-base font-bold mt-1 ${
                  mode === "blind" ? "text-[#F87171]" : "text-[#4ADE80]"
                }`}
              >
                {mode === "blind" ? "High (Brute Force)" : "Moderate (Surgical)"}
              </div>
              <p className="text-[10px] text-[#A3A3A3] mt-1">
                {mode === "blind" ? "Full host interface severed" : "Specific OAuth session revoked"}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl border font-mono text-xs ${
                mode === "blind"
                  ? "bg-[#2B1B1B] border-[#F87171]/30"
                  : "bg-[#1E2520] border-[#4ADE80]/30"
              }`}
            >
              <div className="text-[10px] text-[#737373] uppercase">Service Disruption</div>
              <div
                className={`text-base font-bold mt-1 ${
                  mode === "blind" ? "text-[#F87171]" : "text-[#4ADE80]"
                }`}
              >
                {mode === "blind" ? "100% Outage" : "0% Telemetry Drop"}
              </div>
              <p className="text-[10px] text-[#A3A3A3] mt-1">
                {mode === "blind" ? "Critical SCADA feeds offline" : "Operational continuity intact"}
              </p>
            </div>

            <div
              className={`p-3.5 rounded-xl border font-mono text-xs ${
                mode === "blind"
                  ? "bg-[#2B1B1B] border-[#F87171]/30"
                  : "bg-[#1E2520] border-[#4ADE80]/30"
              }`}
            >
              <div className="text-[10px] text-[#737373] uppercase">Safety Policy Check</div>
              <div
                className={`text-base font-bold mt-1 flex items-center gap-1 ${
                  mode === "blind" ? "text-[#F87171]" : "text-[#4ADE80]"
                }`}
              >
                {mode === "blind" ? (
                  <>
                    <XCircle className="w-4 h-4" /> VETOED
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> PASSED
                  </>
                )}
              </div>
              <p className="text-[10px] text-[#A3A3A3] mt-1">
                {mode === "blind" ? "Rule SEC-OT-01 violated" : "Compliant with safety rules"}
              </p>
            </div>
          </div>

          {/* Actionable Summary Footer */}
          <div
            className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
              mode === "blind"
                ? "bg-[#251818] border-[#F87171]/40 text-[#FCA5A5]"
                : "bg-[#18231B] border-[#4ADE80]/40 text-[#86EFAC]"
            }`}
          >
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 shrink-0" />
              <span>
                {mode === "blind"
                  ? "Caution: Host isolation stopped threat actor, but cost $450k/hr in unintended plant downtime."
                  : "GARDA-SIM AI connected evidence and virtual dependencies before execution, protecting service uptime."}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#737373] shrink-0 uppercase">
              {mode === "blind" ? "POLICY REJECTED" : "AWAITING HUMAN SIGN-OFF"}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="px-6 py-3 bg-[#171717] border-t border-[#303030] flex flex-wrap items-center justify-between text-[11px] font-mono text-[#737373]">
        <div className="flex items-center gap-2">
          <span className="text-[#FF6B35]">KEY TAKEAWAY:</span>
          <span>A response can stop a threat, but simulation ensures it doesn't stop your service.</span>
        </div>
        <div className="text-[#A3A3A3]">
          Evidence-based candidate trade-offs · Human review required
        </div>
      </div>
    </div>
  );
}
