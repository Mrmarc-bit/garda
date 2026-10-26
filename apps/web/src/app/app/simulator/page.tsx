"use client";

import * as React from "react";
import Link from "next/link";
import {
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  AlertOctagon,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  ArrowRight,
  HelpCircle,
  FileText,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  SYNTHETIC_INCIDENT,
  CANDIDATE_STRATEGIES,
  CandidateStrategy,
} from "@/lib/synthetic-data";

export default function ResponseSimulatorPage() {
  const [selectedStrategyId, setSelectedStrategyId] = React.useState<string>("strat-02");
  const [isSimulating, setIsSimulating] = React.useState(false);
  const [hasRun, setHasRun] = React.useState(true);

  const selectedStrategy =
    CANDIDATE_STRATEGIES.find((s) => s.id === selectedStrategyId) || CANDIDATE_STRATEGIES[1];

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setHasRun(true);
    }, 600);
  };

  return (
    <AppLayout
      title="Response Simulator"
      subtitle="Deterministic strategy evaluation, operational downtime modeling, and safety constraint verification"
    >
      {/* Mandatory Defensive Disclaimer */}
      <div className="p-3.5 rounded-xl border border-border bg-[#181818] flex items-center justify-between text-xs text-text-muted">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-accent shrink-0" />
          <span>
            <strong className="text-text-primary">Defensive Simulation Mode:</strong> Calculations reflect deterministic synthetic models. No real network modifications or isolation actions occur.
          </span>
        </div>
        <Badge variant="simulation" size="sm">SIMULATION ONLY</Badge>
      </div>

      {/* Scenario Context & Execution Controls */}
      <div className="p-4 rounded-xl border border-border bg-surface-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-elevated border border-border flex items-center justify-center text-accent">
            <PlayCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-text-muted font-mono">SCENARIO: {SYNTHETIC_INCIDENT.id}</div>
            <div className="text-sm font-semibold text-text-primary">
              Target Asset: <span className="font-mono text-accent">{SYNTHETIC_INCIDENT.targetAsset}</span> ({SYNTHETIC_INCIDENT.title})
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setHasRun(false)}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleRunSimulation}
            isLoading={isSimulating}
            className="gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Run Simulation</span>
          </Button>
        </div>
      </div>

      {/* Strategy Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CANDIDATE_STRATEGIES.map((strat) => {
          const isSelected = strat.id === selectedStrategyId;
          const isPassed = strat.safetyPolicyStatus === "PASSED";
          return (
            <button
              key={strat.id}
              type="button"
              onClick={() => setSelectedStrategyId(strat.id)}
              className={`p-4 rounded-xl border text-left transition-all relative ${
                isSelected
                  ? "bg-surface-elevated border-accent shadow-md ring-1 ring-accent"
                  : "bg-surface-card border-border hover:bg-surface-elevated/60"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-text-muted">{strat.code}</span>
                {isPassed ? (
                  <Badge variant="success" size="sm">Safety: PASSED</Badge>
                ) : (
                  <Badge variant="critical" size="sm">Safety: BLOCKED</Badge>
                )}
              </div>
              <div className="font-semibold text-sm text-text-primary mb-1">{strat.name}</div>
              <p className="text-xs text-text-muted line-clamp-2">{strat.description}</p>
              {strat.isAiRecommended && (
                <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-accent">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Recommended Candidate</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Simulation Results & Impact Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Authoritative Deterministic Metrics (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b border-border/60 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Simulated Impact Evaluation · {selectedStrategy.code}
                  </CardTitle>
                  <CardDescription>
                    Authoritative calculations computed deterministically by the Python simulation engine
                  </CardDescription>
                </div>
                <Badge variant={selectedStrategy.safetyPolicyStatus === "PASSED" ? "success" : "critical"}>
                  Policy: {selectedStrategy.safetyPolicyStatus}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Primary Evaluation Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-border bg-[#1C1C1C]">
                  <div className="text-xs text-text-muted mb-1">Risk Reduction Score</div>
                  <div className="text-3xl font-bold font-mono text-text-primary flex items-baseline gap-1">
                    <span>{selectedStrategy.securityBenefitScore}%</span>
                    <span className="text-xs font-normal text-status-success">benefit</span>
                  </div>
                  <div className="mt-2 h-1.5 w-full bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full"
                      style={{ width: `${selectedStrategy.securityBenefitScore}%` }}
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-[#1C1C1C]">
                  <div className="text-xs text-text-muted mb-1">Simulated Service Downtime</div>
                  <div className="text-3xl font-bold font-mono text-text-primary flex items-baseline gap-1">
                    <span>{selectedStrategy.simulatedDowntimeMinutes}</span>
                    <span className="text-xs font-normal text-text-muted">mins</span>
                  </div>
                  <div className="text-[11px] text-text-muted mt-2">
                    {selectedStrategy.simulatedDowntimeMinutes === 0
                      ? "Zero estimated disruption"
                      : "Transient impact on connected dependencies"}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-[#1C1C1C]">
                  <div className="text-xs text-text-muted mb-1">Recovery Effort</div>
                  <div className="text-3xl font-bold text-text-primary">
                    {selectedStrategy.recoveryEffort}
                  </div>
                  <div className="text-[11px] text-text-muted mt-2">
                    Operational overhead for SOC and IT staff
                  </div>
                </div>
              </div>

              {/* Safety Policy Engine Verification Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Deterministic Safety Policy Invariants (5 Enforced)
                </h4>
                <div className="rounded-lg border border-border bg-surface-elevated/40 divide-y divide-border/60 text-xs">
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-text-primary">Rule SEC-OT-01:</span> No real-world containment trigger
                    </div>
                    <span className="flex items-center gap-1 text-status-success font-medium">
                      <CheckCircle2 className="w-4 h-4" /> PASSED
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-text-primary">Rule SEC-OT-02:</span> Operator clearance validation
                    </div>
                    <span className="flex items-center gap-1 text-status-success font-medium">
                      <CheckCircle2 className="w-4 h-4" /> PASSED
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-text-primary">Rule SEC-OT-03:</span> Identity controller availability preservation
                    </div>
                    <span className="flex items-center gap-1 text-status-success font-medium">
                      <CheckCircle2 className="w-4 h-4" /> PASSED
                    </span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-text-primary">Rule SEC-OT-04:</span> Uninterrupted OT controller telemetry feed
                    </div>
                    {selectedStrategy.code === "STRAT-A" ? (
                      <span className="flex items-center gap-1 text-status-critical font-semibold">
                        <XCircle className="w-4 h-4" /> VIOLATION BLOCKED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-status-success font-medium">
                        <CheckCircle2 className="w-4 h-4" /> PASSED
                      </span>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-text-primary">Rule SEC-OT-05:</span> Audit record generation invariant
                    </div>
                    <span className="flex items-center gap-1 text-status-success font-medium">
                      <CheckCircle2 className="w-4 h-4" /> PASSED
                    </span>
                  </div>
                </div>

                {selectedStrategy.safetyViolationReason && (
                  <div className="p-3 rounded-lg border border-status-critical/40 bg-status-critical/10 text-xs text-status-critical flex items-start gap-2">
                    <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{selectedStrategy.safetyViolationReason}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Explanation & Review Card (Col span 1) */}
        <div className="space-y-6">
          <Card className="bg-[#1C1814] border-accent/40">
            <CardHeader className="pb-3 border-b border-border/60">
              <CardTitle className="text-sm font-semibold flex items-center gap-2 text-text-primary">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Explainable AI Trade-off Analysis</span>
              </CardTitle>
              <CardDescription>
                Decision-support reasoning for {selectedStrategy.code}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <p className="text-text-secondary leading-relaxed bg-surface-card p-3 rounded-lg border border-border">
                {selectedStrategy.aiRationale}
              </p>

              <div className="space-y-2">
                <span className="text-text-muted text-[11px] block font-semibold uppercase">
                  Supporting Evidence Citations
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[11px] text-accent">
                    EVD-101
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[11px] text-accent">
                    EVD-102
                  </span>
                  <span className="px-2 py-0.5 rounded bg-surface-elevated border border-border font-mono text-[11px] text-accent">
                    EVD-104
                  </span>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-border">
                <span className="text-text-muted text-[11px] block">Uncertainty Estimation</span>
                <span className="font-semibold text-text-primary">±4.2%</span>
                <p className="text-[10px] text-text-muted leading-relaxed">
                  Reflects synthetic network jitter and process restart variance.
                </p>
              </div>

              <div className="pt-4 space-y-2">
                <Link href="/app/recommendations" className="block">
                  <Button variant="primary" size="sm" className="w-full text-xs">
                    Approve for Demonstration Review
                  </Button>
                </Link>
                <Link href="/app/reports" className="block">
                  <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Generate Simulation Report</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
