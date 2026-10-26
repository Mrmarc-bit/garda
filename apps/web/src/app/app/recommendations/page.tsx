"use client";

import * as React from "react";
import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  AlertTriangle,
  Send,
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

export default function RecommendationsPage() {
  const [reviewStatus, setReviewStatus] = React.useState<
    Record<string, "Pending Review" | "Approved for Demonstration" | "Rejected" | "Requires More Evidence">
  >({
    "strat-02": "Pending Review",
    "strat-03": "Pending Review",
    "strat-01": "Rejected",
  });

  const [analystNotes, setAnalystNotes] = React.useState(
    "Verified against virtual topology. Strategy B preserves uninterrupted Modbus telemetry for OT Controller."
  );
  const [isSaved, setIsSaved] = React.useState(false);

  const handleUpdateStatus = (
    stratId: string,
    status: "Pending Review" | "Approved for Demonstration" | "Rejected" | "Requires More Evidence"
  ) => {
    setReviewStatus((prev) => ({ ...prev, [stratId]: status }));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <AppLayout
      title="AI Recommendations & Review"
      subtitle="Explainable decision-support synthesis with mandatory human-in-the-loop validation"
    >
      {/* Defensive Boundary & Human Review Gate */}
      <div className="p-4 rounded-xl border border-accent/40 bg-accent/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider">
              Human-in-the-Loop Review Authority
            </div>
            <div className="text-sm font-semibold text-text-primary">
              AI provides explainable trade-offs. The human operator retains exclusive review authority.
            </div>
          </div>
        </div>
        <Badge variant="simulation">Simulation Approval Only</Badge>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-6">
        {CANDIDATE_STRATEGIES.map((strat) => {
          const currentStatus = reviewStatus[strat.id] || "Pending Review";
          const isPassed = strat.safetyPolicyStatus === "PASSED";

          return (
            <Card
              key={strat.id}
              className={`border transition-all ${
                strat.isAiRecommended
                  ? "border-accent/40 bg-surface-card shadow-lg"
                  : "border-border bg-surface-card/60"
              }`}
            >
              <CardHeader className="border-b border-border/60 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-elevated border border-border text-accent">
                      {strat.code}
                    </span>
                    <CardTitle className="text-base font-semibold">{strat.name}</CardTitle>
                    {strat.isAiRecommended && (
                      <Badge variant="simulation" size="sm">
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted">Review State:</span>
                    <Badge
                      variant={
                        currentStatus === "Approved for Demonstration"
                          ? "success"
                          : currentStatus === "Rejected"
                          ? "critical"
                          : "warning"
                      }
                      size="sm"
                    >
                      {currentStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4 text-xs">
                {/* AI Rationale & Citations */}
                <div className="p-3.5 rounded-lg bg-[#191919] border border-border space-y-2">
                  <div className="flex items-center justify-between text-text-muted text-[11px]">
                    <span className="flex items-center gap-1 font-semibold text-accent">
                      <Sparkles className="w-3.5 h-3.5" /> Explainable Synthesis
                    </span>
                    <span className="font-mono">Uncertainty: ±4.2%</span>
                  </div>
                  <p className="text-text-secondary leading-relaxed">{strat.aiRationale}</p>
                  <div className="flex items-center gap-2 pt-2 border-t border-border/40 text-[11px] text-text-muted">
                    <span>Evidence Citations:</span>
                    <span className="font-mono font-semibold text-accent">EVD-101, EVD-102, EVD-104</span>
                  </div>
                </div>

                {/* Quantitative Impact Comparison Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-lg bg-surface-elevated/40 border border-border">
                  <div>
                    <span className="text-text-muted text-[10px] block">Risk Reduction</span>
                    <span className="font-bold text-text-primary text-sm">{strat.securityBenefitScore}%</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Simulated Downtime</span>
                    <span className="font-bold text-text-primary text-sm">{strat.simulatedDowntimeMinutes} mins</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Recovery Complexity</span>
                    <span className="font-bold text-text-primary text-sm">{strat.recoveryEffort}</span>
                  </div>
                  <div>
                    <span className="text-text-muted text-[10px] block">Deterministic Safety</span>
                    <span
                      className={`font-semibold text-xs ${
                        isPassed ? "text-status-success" : "text-status-critical"
                      }`}
                    >
                      {isPassed ? "PASSED (5 Rules)" : "BLOCKED"}
                    </span>
                  </div>
                </div>

                {/* Review Action Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={!isPassed}
                      onClick={() => handleUpdateStatus(strat.id, "Approved for Demonstration")}
                      className="text-xs gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve for Demonstration</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUpdateStatus(strat.id, "Requires More Evidence")}
                      className="text-xs gap-1.5"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Request Evidence</span>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(strat.id, "Rejected")}
                      className="text-xs gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </Button>
                  </div>

                  <Link href="/app/audit-trail">
                    <span className="text-text-muted hover:text-text-primary text-xs flex items-center gap-1">
                      <span>View Audit Log</span>
                    </span>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Reviewer Sign-Off Box */}
      <Card className="border-border bg-surface-card">
        <CardHeader className="pb-3 border-b border-border/60">
          <CardTitle className="text-sm font-semibold">SOC Reviewer Audit Sign-Off</CardTitle>
          <CardDescription>
            Enter rationale for audit log persistence (Actor: analyst-demo-03)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <textarea
            rows={3}
            value={analystNotes}
            onChange={(e) => setAnalystNotes(e.target.value)}
            className="w-full rounded-lg border border-border bg-surface-input p-3 text-text-primary focus:outline-none focus:border-accent"
          />
          <div className="flex items-center justify-between">
            <span className="text-text-muted text-[11px]">
              {isSaved ? "✓ Audit record updated in simulation log" : "Review notes will be permanently recorded in audit trail"}
            </span>
            <Link href="/app/audit-trail">
              <Button size="sm" variant="outline" className="gap-2 text-xs">
                <FileText className="w-3.5 h-3.5" />
                <span>Open Audit Trail</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
