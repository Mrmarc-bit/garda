"use client";

import * as React from "react";
import Link from "next/link";
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Hash,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  SYNTHETIC_INCIDENT,
  CANDIDATE_STRATEGIES,
  VIRTUAL_ASSETS,
} from "@/lib/synthetic-data";

export default function ReportsPage() {
  const [downloadSuccess, setDownloadSuccess] = React.useState<string | null>(null);

  const selectedStrategy = CANDIDATE_STRATEGIES[1]; // Strategy B

  const handleDownloadJson = () => {
    const reportData = {
      report_id: "REP-2026-0042-B",
      generated_at: new Date().toISOString(),
      scenario: SYNTHETIC_INCIDENT,
      selected_strategy: selectedStrategy,
      evaluated_assets: VIRTUAL_ASSETS,
      safety_rules_passed: 5,
      integrity_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      environment: "SYNTHETIC_SIMULATION_ONLY",
    };
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "garda-sim-report-INC-2026-0042.json";
    a.click();
    setDownloadSuccess("JSON exported successfully");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadMarkdown = () => {
    const mdContent = `# GARDA-SIM AI — Incident Response Simulation Report
**Report ID:** REP-2026-0042-B  
**Scenario ID:** ${SYNTHETIC_INCIDENT.id}  
**Target Asset:** ${SYNTHETIC_INCIDENT.targetAsset}  
**Selected Strategy:** ${selectedStrategy.name} (${selectedStrategy.code})  
**Security Benefit:** ${selectedStrategy.securityBenefitScore}% Risk Reduction  
**Estimated Downtime:** ${selectedStrategy.simulatedDowntimeMinutes} Minutes  
**Deterministic Safety Invariants:** 5/5 PASSED  
**Operator Sign-Off:** analyst-demo-03  
**Integrity Hash:** e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855  
**Notice:** DEFENSIVE SIMULATION ONLY. NO REAL CONTAINMENT COMMANDS EXECUTED.
`;
    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "garda-sim-report-INC-2026-0042.md";
    a.click();
    setDownloadSuccess("Markdown exported successfully");
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <AppLayout
      title="Incident & Simulation Reports"
      subtitle="Auditable decision-support documentation, comparative records, and verified compliance exports"
    >
      {/* Action controls header */}
      <div className="p-4 rounded-xl border border-border bg-surface-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-text-primary">
            Simulation Report Preview · REP-2026-0042-B
          </h2>
          <p className="text-xs text-text-muted">
            Formatted export of evaluated response strategy for incident {SYNTHETIC_INCIDENT.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {downloadSuccess && (
            <span className="text-xs text-status-success font-medium mr-2">
              ✓ {downloadSuccess}
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleDownloadJson} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </Button>
          <Button variant="primary" size="sm" onClick={handleDownloadMarkdown} className="gap-1.5 text-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Download Report (MD)</span>
          </Button>
        </div>
      </div>

      {/* Formatted Report Document View */}
      <Card className="max-w-4xl mx-auto border-border bg-[#1A1A1A] text-text-primary shadow-xl">
        <CardContent className="p-8 space-y-8 text-xs">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-6 border-b border-border">
            <div>
              <div className="font-mono text-xs text-accent font-bold">GARDA-SIM AI DEFENSE LAB</div>
              <h1 className="text-xl font-bold text-text-primary mt-1">
                Incident Response Evaluation Report
              </h1>
              <div className="text-text-muted mt-1">
                Scenario: <span className="font-mono text-text-primary">{SYNTHETIC_INCIDENT.id}</span> — {SYNTHETIC_INCIDENT.title}
              </div>
            </div>
            <div className="text-right space-y-1">
              <Badge variant="simulation">DEFENSIVE SIMULATION ONLY</Badge>
              <div className="text-[11px] font-mono text-text-muted">ID: REP-2026-0042-B</div>
              <div className="text-[11px] text-text-muted">Date: 2026-10-26 15:40 UTC</div>
            </div>
          </div>

          {/* Section 1: Executive Overview */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
              1. Executive Evaluation Summary
            </h3>
            <p className="text-text-secondary leading-relaxed">
              This report documents the deterministic simulation of candidate response strategies for incident{" "}
              <strong>{SYNTHETIC_INCIDENT.id}</strong> targeting edge asset <strong>{SYNTHETIC_INCIDENT.targetAsset}</strong>.
              Strategy candidate <strong>STRAT-B ({selectedStrategy.name})</strong> has been verified against deterministic safety invariants and approved for demonstration.
            </p>
          </div>

          {/* Section 2: Key Evaluation Metrics */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
              2. Deterministic Quantitative Impact
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-surface-card border border-border">
              <div>
                <span className="text-text-muted text-[10px] block">Security Risk Reduction</span>
                <span className="font-bold text-text-primary text-base">{selectedStrategy.securityBenefitScore}%</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">Estimated Downtime</span>
                <span className="font-bold text-text-primary text-base">{selectedStrategy.simulatedDowntimeMinutes} Minutes</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">Recovery Overhead</span>
                <span className="font-bold text-text-primary text-base">{selectedStrategy.recoveryEffort}</span>
              </div>
              <div>
                <span className="text-text-muted text-[10px] block">Safety Policy Checks</span>
                <span className="font-bold text-status-success text-base">5/5 PASSED</span>
              </div>
            </div>
          </div>

          {/* Section 3: Safety Invariants Compliance */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
              3. Deterministic Safety Verification
            </h3>
            <div className="p-4 rounded-xl bg-surface-card border border-border space-y-2 text-text-secondary leading-relaxed">
              <div className="flex items-center gap-2 text-status-success font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>All 5 Deterministic Safety Invariants Enforced and Verified</span>
              </div>
              <p className="text-[11px] text-text-muted">
                Unlike naive isolation approaches (STRAT-A which severed vital OT telemetry violating Rule SEC-OT-04),
                STRAT-B selectively neutralizes external perimeter routing while preserving critical internal Modbus telemetry feeds to OT-CONTROLLER-SIM-01.
              </p>
            </div>
          </div>

          {/* Section 4: Audit Metadata and Integrity Signature */}
          <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4 text-text-muted text-[11px]">
            <div>
              <span className="block font-semibold text-text-primary mb-1">Authorizing SOC Operator</span>
              <div className="flex items-center gap-1.5 font-mono">
                <User className="w-3.5 h-3.5 text-accent" />
                <span>analyst-demo-03 (SOC Tier 2)</span>
              </div>
            </div>
            <div>
              <span className="block font-semibold text-text-primary mb-1">Cryptographic Integrity Hash</span>
              <div className="flex items-center gap-1.5 font-mono text-[10px] truncate text-status-success">
                <Hash className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
