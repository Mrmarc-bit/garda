import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  PlayCircle,
  Network,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileSearch,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SYNTHETIC_INCIDENT, CANDIDATE_STRATEGIES } from "@/lib/synthetic-data";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-4 md:px-8 overflow-hidden border-b border-border">
        <div className="max-w-[1440px] mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-accent" />
            <span>Synthetic Incident Defense Simulator · Version 1.0</span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary max-w-4xl mx-auto leading-tight">
            Simulate the impact. Explain the trade-offs.{" "}
            <span className="text-accent">Keep humans in control.</span>
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            GARDA-SIM AI evaluates candidate cybersecurity response actions before execution.
            Estimate operational downtime, protect critical IT/OT dependency chains, and enforce
            hard safety constraints deterministically.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/app/simulator">
              <Button size="lg" className="gap-2">
                <PlayCircle className="w-5 h-5" />
                <span>Launch Response Simulator</span>
              </Button>
            </Link>
            <Link href="/app/incidents/INC-2026-0042">
              <Button variant="secondary" size="lg" className="gap-2">
                <FileSearch className="w-5 h-5" />
                <span>Inspect Scenario INC-2026-0042</span>
              </Button>
            </Link>
          </div>

          {/* Interactive Hero Simulator Preview Card */}
          <div className="pt-10 max-w-4xl mx-auto text-left">
            <div className="rounded-2xl border border-border bg-surface-card shadow-2xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-status-critical animate-pulse" />
                  <div>
                    <div className="text-xs font-mono text-text-muted">ACTIVE SYNTHETIC INCIDENT</div>
                    <div className="text-base font-semibold text-text-primary">
                      {SYNTHETIC_INCIDENT.id} — {SYNTHETIC_INCIDENT.title}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="critical">Critical Severity</Badge>
                  <Badge variant="simulation">Simulation Only</Badge>
                </div>
              </div>

              {/* Multi-Candidate Strategy Evaluation Comparison */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                  Evaluated Response Candidates (Deterministic Engine)
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CANDIDATE_STRATEGIES.map((strat) => (
                    <div
                      key={strat.id}
                      className={`p-4 rounded-xl border transition-all ${
                        strat.isAiRecommended
                          ? "bg-accent/10 border-accent/40 shadow-sm"
                          : "bg-surface-elevated/60 border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono font-bold text-text-muted">{strat.code}</span>
                        {strat.safetyPolicyStatus === "PASSED" ? (
                          <Badge variant="success" size="sm">Safety: Passed</Badge>
                        ) : (
                          <Badge variant="critical" size="sm">Safety: Blocked</Badge>
                        )}
                      </div>
                      <div className="font-semibold text-sm text-text-primary mb-1">{strat.name}</div>
                      <div className="text-xs text-text-muted line-clamp-2 mb-3">{strat.description}</div>
                      <div className="pt-2 border-t border-border/40 grid grid-cols-2 text-xs">
                        <div>
                          <div className="text-[10px] text-text-muted">Risk Reduction</div>
                          <div className="font-semibold text-text-primary">{strat.securityBenefitScore}%</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-text-muted">Downtime</div>
                          <div className="font-semibold text-text-primary">{strat.simulatedDowntimeMinutes}m</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs text-text-muted">
                <span className="flex items-center gap-1.5 text-status-success font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Deterministic Safety Verification Precedes AI Review
                </span>
                <Link href="/app" className="text-accent hover:underline flex items-center gap-1 font-medium">
                  <span>Enter Full Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-20 px-4 md:px-8 border-b border-border bg-[#191919]">
        <div className="max-w-[1440px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl md:text-4xl font-bold text-text-primary">
              Defensive Response Grounded in Reality
            </h2>
            <p className="text-sm md:text-base text-text-secondary">
              A comprehensive system combining deterministic topology modeling with AI-assisted explanation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-status-info/15 border border-status-info/30 flex items-center justify-center text-status-info mb-3">
                  <FileSearch className="w-5 h-5" />
                </div>
                <CardTitle>Evidence Grounding</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary leading-relaxed">
                Connect incidents to traceable synthetic logs and host telemetry. No fabricated evidence IDs or hallucinated network artifacts.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-3">
                  <Network className="w-5 h-5" />
                </div>
                <CardTitle>IT/OT Digital Twin</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary leading-relaxed">
                Model directed dependencies between enterprise identity services, edge gateways, and industrial controller nodes.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success mb-3">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle>Deterministic Safety</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary leading-relaxed">
                Enforce hard safety constraints in code. A model cannot override safety thresholds or authorize destructive containment actions.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-[#9333EA]/15 border border-[#9333EA]/30 flex items-center justify-center text-[#C084FC] mb-3">
                  <Sparkles className="w-5 h-5" />
                </div>
                <CardTitle>Human-in-the-Loop AI</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary leading-relaxed">
                Receive plain-language trade-off analyses, uncertainty ratings, and citations for final SOC analyst review and approval.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Safety & Defensive Boundaries Banner */}
      <section className="py-16 px-4 md:px-8 border-b border-border bg-bg-secondary">
        <div className="max-w-4xl mx-auto rounded-2xl border border-accent/30 bg-accent/10 p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
            <ShieldAlert className="w-8 h-8 text-accent" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-bold text-text-primary">Defensive Decision-Support Boundary</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              GARDA-SIM AI operates strictly on synthetic scenario data. The application does not connect to live operational technology, production enterprise networks, or military infrastructure, and executes no real-world containment.
            </p>
          </div>
          <Link href="/security" className="shrink-0">
            <Button variant="outline" size="sm">
              Read Security Policy
            </Button>
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
