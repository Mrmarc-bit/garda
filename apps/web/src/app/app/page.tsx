"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  PlayCircle,
  Network,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  Server,
  Activity,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { AppLayout } from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  SYNTHETIC_INCIDENT,
  VIRTUAL_ASSETS,
  CANDIDATE_STRATEGIES,
} from "@/lib/synthetic-data";

export default function OverviewDashboard() {
  return (
    <AppLayout
      title="Overview Dashboard"
      subtitle="Synthetic Incident Defense & Blast-Radius Simulator"
    >
      {/* Top operational alert banner */}
      <div className="p-4 rounded-xl border border-accent/40 bg-accent/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
            <ShieldAlert className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="text-xs font-semibold text-accent uppercase tracking-wider">
              Active Simulation Scenario: {SYNTHETIC_INCIDENT.id}
            </div>
            <div className="text-sm font-semibold text-text-primary">
              {SYNTHETIC_INCIDENT.title} detected on {SYNTHETIC_INCIDENT.targetAsset}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/app/incidents/${SYNTHETIC_INCIDENT.id}`}>
            <Button variant="outline" size="sm">
              Inspect Evidence
            </Button>
          </Link>
          <Link href="/app/simulator">
            <Button variant="primary" size="sm" className="gap-2">
              <PlayCircle className="w-4 h-4" />
              <span>Run Simulator</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-text-muted">Simulated Incidents</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>1 Active</span>
              <Badge variant="critical" size="sm">Critical</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            Target Asset: <span className="text-text-primary font-mono">{SYNTHETIC_INCIDENT.targetAsset}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-text-muted">Services in Blast Radius</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>2 Services</span>
              <Badge variant="warning" size="sm">At Risk</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            OPS-DASH-01, TELEMETRY-SIM-01
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-text-muted">Candidate Strategies</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>3 Evaluated</span>
              <Badge variant="success" size="sm">1 Recommended</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            Strat-B: 88% Risk Reduction, 0m Downtime
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="text-text-muted">Deterministic Safety Rules</CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center justify-between">
              <span>5 / 5 Enforced</span>
              <Badge variant="info" size="sm">100% Policy</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-text-muted">
            Independent of AI evaluation
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Incident Investigation & Response Strategy Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Spotlight & Strategies (Col span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Evaluated Response Strategies</CardTitle>
                <CardDescription>
                  Deterministic simulation of containment actions on scenario {SYNTHETIC_INCIDENT.id}
                </CardDescription>
              </div>
              <Link href="/app/simulator" className="text-xs text-accent hover:underline flex items-center gap-1">
                <span>Open Simulator</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {CANDIDATE_STRATEGIES.map((strat) => (
                <div
                  key={strat.id}
                  className={`p-4 rounded-xl border transition-all ${
                    strat.isAiRecommended
                      ? "bg-accent/10 border-accent/40"
                      : "bg-surface-elevated/40 border-border"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-card border border-border">
                        {strat.code}
                      </span>
                      <span className="text-sm font-semibold text-text-primary">{strat.name}</span>
                    </div>
                    <div>
                      {strat.safetyPolicyStatus === "PASSED" ? (
                        <Badge variant="success" size="sm">Safety Rule: PASSED</Badge>
                      ) : (
                        <Badge variant="critical" size="sm">Safety Rule: BLOCKED</Badge>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                    {strat.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-border/40 text-xs">
                    <div>
                      <span className="text-text-muted text-[11px] block">Risk Reduction</span>
                      <span className="font-semibold text-text-primary">{strat.securityBenefitScore}%</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] block">Est. Downtime</span>
                      <span className="font-semibold text-text-primary">{strat.simulatedDowntimeMinutes} mins</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] block">Recovery Effort</span>
                      <span className="font-semibold text-text-primary">{strat.recoveryEffort}</span>
                    </div>
                    <div>
                      <span className="text-text-muted text-[11px] block">Status</span>
                      <span className="font-medium text-accent">
                        {strat.isAiRecommended ? "AI Recommended" : "Alternative"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Digital Twin Topology Status (Col span 1) */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 pb-4">
              <div>
                <CardTitle className="text-base font-semibold">Virtual IT/OT Asset Topology</CardTitle>
                <CardDescription>Simulated dependency status</CardDescription>
              </div>
              <Link href="/app/digital-twin" className="text-xs text-accent hover:underline flex items-center gap-1">
                <span>2D Graph</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {VIRTUAL_ASSETS.map((asset) => {
                const isCompromised = asset.status === "compromised";
                const isAtRisk = asset.status === "at_risk";
                return (
                  <div
                    key={asset.id}
                    className="p-3 rounded-lg border border-border bg-surface-elevated/40 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${
                          isCompromised
                            ? "bg-status-critical animate-pulse"
                            : isAtRisk
                            ? "bg-status-warning"
                            : "bg-status-success"
                        }`}
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-text-primary truncate">{asset.id}</div>
                        <div className="text-[10px] text-text-muted truncate">{asset.name}</div>
                      </div>
                    </div>
                    <Badge
                      size="sm"
                      variant={isCompromised ? "critical" : isAtRisk ? "warning" : "success"}
                    >
                      {asset.status.replace("_", " ").toUpperCase()}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick Guidance Card */}
          <Card className="bg-[#1E1E1E]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Explainable AI Review</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-text-secondary space-y-3">
              <p className="leading-relaxed">
                Strategy B is highlighted because it selectively neutralizes outbound command routes without severing the OT telemetry pipeline.
              </p>
              <Link href="/app/recommendations" className="block">
                <Button variant="secondary" size="sm" className="w-full text-xs">
                  Review AI Decision Log
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
