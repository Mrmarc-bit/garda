"use client";

import * as React from "react";
import Link from "next/link";
import {
  FlaskConical,
  PlayCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BarChart2,
  FileText,
  RotateCcw,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function ExperimentsPage() {
  const [activeExperiment, setActiveExperiment] = React.useState("EXP-2026-BETA-1");

  const benchmarkRuns = [
    {
      id: "RUN-01",
      method: "Baseline (Heuristic Containment)",
      scenario: "INC-2026-0042",
      safetyViolations: "1 Violation (SEC-OT-04)",
      downtimeMinutes: 45,
      riskReduction: "94%",
      verdict: "FAILED_POLICY",
    },
    {
      id: "RUN-02",
      method: "GARDA-SIM AI (Deterministic Multi-Candidate)",
      scenario: "INC-2026-0042",
      safetyViolations: "0 Violations",
      downtimeMinutes: 0,
      riskReduction: "88%",
      verdict: "PASSED_ALL",
    },
    {
      id: "RUN-03",
      method: "Baseline (Uncoordinated VLAN Drop)",
      scenario: "INC-2026-0038",
      safetyViolations: "2 Violations",
      downtimeMinutes: 60,
      riskReduction: "90%",
      verdict: "FAILED_POLICY",
    },
    {
      id: "RUN-04",
      method: "GARDA-SIM AI (Deterministic Multi-Candidate)",
      scenario: "INC-2026-0038",
      safetyViolations: "0 Violations",
      downtimeMinutes: 4,
      riskReduction: "84%",
      verdict: "PASSED_ALL",
    },
  ];

  return (
    <AppLayout
      title="Experiments & Evaluation"
      subtitle="Defensive simulation benchmark testbench, comparative evaluation, and reproducibility harness"
    >
      {/* Context banner */}
      <div className="p-4 rounded-xl border border-border bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">Evaluation Benchmark Workbench</h2>
          <p className="text-xs text-text-muted">
            Compare deterministic multi-candidate evaluation against naive heuristic containment.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="simulation">Reproducible Fixture</Badge>
          <Badge variant="info">Seed: 0x99A41</Badge>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>GARDA-SIM Safety Compliance</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-status-success">
              100%
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            0 safety invariant violations across all verified runs
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Naive Heuristic Baseline Violations</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-status-critical">
              75%
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            Severed OT telemetry feed without fail-safe buffer
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Downtime Prevention</CardDescription>
            <CardTitle className="text-2xl font-bold font-mono text-text-primary">
              -41 mins
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            Downtime reduced from 45m to 0–4m average
          </CardContent>
        </Card>
      </div>

      {/* Comparative Evaluation Runs Table */}
      <Card>
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Comparative Benchmark Matrix · Seed: 0x99A41
            </CardTitle>
            <span className="text-xs font-mono text-text-muted">Sample: 4 Evaluated Runs</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1C1C1C] border-b border-border text-text-muted uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Run ID</th>
                  <th className="py-3 px-4">Method / Approach</th>
                  <th className="py-3 px-4">Scenario</th>
                  <th className="py-3 px-4">Safety Violations</th>
                  <th className="py-3 px-4">Downtime</th>
                  <th className="py-3 px-4">Risk Reduction</th>
                  <th className="py-3 px-4 text-right">Policy Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {benchmarkRuns.map((run) => (
                  <tr key={run.id} className="hover:bg-surface-elevated/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">{run.id}</td>
                    <td className="py-3.5 px-4 font-semibold text-text-primary">{run.method}</td>
                    <td className="py-3.5 px-4 font-mono text-text-secondary">{run.scenario}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={
                          run.safetyViolations.includes("0")
                            ? "text-status-success font-semibold"
                            : "text-status-critical font-semibold"
                        }
                      >
                        {run.safetyViolations}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-text-primary">{run.downtimeMinutes}m</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-text-primary">{run.riskReduction}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Badge
                        size="sm"
                        variant={run.verdict === "PASSED_ALL" ? "success" : "critical"}
                      >
                        {run.verdict}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
