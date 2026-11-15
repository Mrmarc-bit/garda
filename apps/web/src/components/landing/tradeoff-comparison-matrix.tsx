"use client";

import * as React from "react";
import { ShieldCheck, ShieldAlert, Clock, Gauge, BarChart3, Table as TableIcon } from "lucide-react";

interface StratDetail {
  id: string;
  name: string;
  securityBenefitText: string;
  securityScore: number;
  serviceImpactText: string;
  downtimeMinutes: number;
  blastRadiusNodes: number;
  policyStatus: "pass" | "fail";
  policyLabel: string;
  summary: string;
}

export const TradeoffComparisonMatrix: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<"visual" | "table">("visual");

  const strategies: StratDetail[] = [
    {
      id: "strat-a",
      name: "Session revocation",
      securityBenefitText: "Moderate · assumed",
      securityScore: 65,
      serviceImpactText: "Low · assumed",
      downtimeMinutes: 0,
      blastRadiusNodes: 1,
      policyStatus: "pass",
      policyLabel: "Illustrative pass",
      summary: "Invalidates the compromised synthetic bearer token without severing gateway connections or telemetry streams.",
    },
    {
      id: "strat-b",
      name: "Virtual access restriction",
      securityBenefitText: "Moderate · assumed",
      securityScore: 78,
      serviceImpactText: "Medium · assumed",
      downtimeMinutes: 15,
      blastRadiusNodes: 2,
      policyStatus: "pass",
      policyLabel: "Illustrative pass",
      summary: "Applies targeted ACL route restrictions on APP-GW-02. Telemetry feeds remain active through fail-safe paths.",
    },
    {
      id: "strat-c",
      name: "Simulated asset isolation",
      securityBenefitText: "Broad containment",
      securityScore: 95,
      serviceImpactText: "High · assumed",
      downtimeMinutes: 180,
      blastRadiusNodes: 5,
      policyStatus: "fail",
      policyLabel: "Illustrative fail · SEC-OT-04",
      summary: "Aggressive perimeter isolation cuts all network ingress/egress, triggering the SEC-OT-04 telemetry violation.",
    },
  ];

  return (
    <div className="bg-[#202020] border border-[#383838] rounded-2xl p-6 md:p-8 space-y-6">
      {/* Header with View Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#383838] pb-4">
        <div>
          <div className="text-[11px] font-mono text-[#737373] tracking-wider uppercase">
            05 / ILLUSTRATIVE COMPARISON — NOT A RECORDED RUN
          </div>
          <h3 className="text-xl font-bold text-[#F5F5F5] mt-1">
            Not just “what works,” but “what changes?”
          </h3>
          <p className="text-xs text-[#A3A3A3] mt-1">
            Evidence: EVD-101 / EVD-102 / EVD-103. All ratings are assumptions for layout comparison.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-[#282828] p-1 rounded-lg border border-[#383838] shrink-0 text-xs font-mono">
          <button
            type="button"
            onClick={() => setViewMode("visual")}
            className={`px-3 py-1 rounded transition-colors inline-flex items-center gap-1.5 ${
              viewMode === "visual"
                ? "bg-[#FF6B35] text-white font-medium shadow-sm"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Visual Gauges</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1 rounded transition-colors inline-flex items-center gap-1.5 ${
              viewMode === "table"
                ? "bg-[#FF6B35] text-white font-medium shadow-sm"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Specimen Table</span>
          </button>
        </div>
      </div>

      {/* Mode A: Visual Comparison Gauges */}
      {viewMode === "visual" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {strategies.map((strat) => {
            const isPass = strat.policyStatus === "pass";

            return (
              <div
                key={strat.id}
                className={`bg-[#1A1A1A] border rounded-xl p-5 space-y-4 transition-all flex flex-col justify-between ${
                  isPass
                    ? "border-[#383838] hover:border-[#4ADE80]/50"
                    : "border-[#F87171]/40 bg-[#251717]/30"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#737373] uppercase tracking-wider">
                      CANDIDATE ACTION
                    </span>
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                        isPass
                          ? "bg-[#4ADE80]/15 border-[#4ADE80]/40 text-[#4ADE80]"
                          : "bg-[#F87171]/20 border-[#F87171]/40 text-[#F87171]"
                      }`}
                    >
                      {strat.policyLabel}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#F5F5F5]">{strat.name}</h4>
                  <p className="text-xs text-[#A3A3A3] leading-relaxed">{strat.summary}</p>

                  <div className="space-y-3 pt-3 border-t border-[#303030] text-xs font-mono">
                    {/* Security Benefit Meter */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#737373]">Security Benefit:</span>
                        <span className="text-[#F5F5F5]">{strat.securityBenefitText} ({strat.securityScore}%)</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#282828] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#FF6B35] rounded-full"
                          style={{ width: `${strat.securityScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Projected Downtime */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-[#737373]">Service Downtime:</span>
                        <span className={strat.downtimeMinutes > 0 ? "text-[#FBBF24]" : "text-[#4ADE80]"}>
                          {strat.downtimeMinutes} min projected
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-[#282828] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            strat.downtimeMinutes === 0
                              ? "bg-[#4ADE80] w-[5%]"
                              : strat.downtimeMinutes < 60
                              ? "bg-[#FBBF24] w-[35%]"
                              : "bg-[#F87171] w-[95%]"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Blast Radius */}
                    <div className="flex justify-between text-[11px] pt-1">
                      <span className="text-[#737373]">Blast Radius Impact:</span>
                      <span className="text-[#F5F5F5]">{strat.blastRadiusNodes} nodes affected</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#303030] text-[10px] font-mono text-[#737373]">
                  {isPass ? "✓ Deterministic constraints satisfied" : "⚠ Invariant SEC-OT-04 violated"}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mode B: Specimen Table View */
        <div className="bg-[#1A1A1A] border border-[#383838] rounded-xl p-5 overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#FF6B35]/40 text-[#FF6B35] font-medium tracking-wider uppercase">
                <th className="pb-3 font-medium w-1/4">STRATEGY</th>
                <th className="pb-3 font-medium w-1/4">SECURITY BENEFIT</th>
                <th className="pb-3 font-medium w-1/4">SERVICE IMPACT</th>
                <th className="pb-3 font-medium">POLICY SPECIMEN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#383838]/40">
              {strategies.map((s) => (
                <tr key={s.id}>
                  <td className="py-3.5 text-[#F5F5F5] font-sans font-medium">{s.name}</td>
                  <td className="py-3.5 text-[#A3A3A3]">{s.securityBenefitText}</td>
                  <td className="py-3.5 text-[#A3A3A3]">{s.serviceImpactText}</td>
                  <td className="py-3.5">
                    <span
                      className={`px-2.5 py-1 rounded text-[11px] font-mono ${
                        s.policyStatus === "pass"
                          ? "bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80]"
                          : "bg-[#F87171]/15 border border-[#F87171]/30 text-[#F87171]"
                      }`}
                    >
                      {s.policyLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Mandatory Safety Notice */}
      <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3]">
        <span className="font-semibold text-[#F5F5F5] uppercase tracking-wider block mb-1">
          SIMULATION ONLY
        </span>
        Results are simulated estimates, not guarantees of real-world outcomes.
      </div>
    </div>
  );
};
