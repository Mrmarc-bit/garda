"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Shield,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Server,
  Network,
  Cpu,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = React.useState(1);
  const [role, setRole] = React.useState("soc_analyst");
  const [topology, setTopology] = React.useState("hybrid_ot");
  const [safetyMode, setSafetyMode] = React.useState("strict_ot");
  const [explanationStyle, setExplanationStyle] = React.useState("technical");
  const [isCompleted, setIsCompleted] = React.useState(false);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-bg-primary text-text-primary py-12">
      <div className="w-full max-w-2xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/40 text-accent text-xs font-semibold">
            <Shield className="w-4 h-4" />
            <span>GARDA-SIM AI Setup Wizard</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">
            Configure Your Defensive Simulation Lab
          </h1>
          <p className="text-xs text-text-muted">
            Step {currentStep} of 5 · Customize your synthetic evaluation environment
          </p>
        </div>

        {/* Step Progress Bar */}
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`h-1.5 rounded-full transition-all ${
                step <= currentStep ? "bg-accent" : "bg-border"
              }`}
            />
          ))}
        </div>

        {/* Step Card Content */}
        <Card className="border-border bg-surface-card p-6 md:p-8 shadow-2xl">
          <CardContent className="p-0 space-y-6">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-text-primary">Select Your Operational Role</h2>
                  <p className="text-xs text-text-muted">
                    Tailors dashboard metric density and candidate strategy presentation.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: "soc_analyst", title: "SOC Incident Analyst", desc: "Fast evidence triage & candidate comparison" },
                    { id: "ot_engineer", title: "OT / Industrial Engineer", desc: "Prioritizes controller safety & telemetry uptime" },
                    { id: "incident_commander", title: "Incident Commander", desc: "Executive blast radius & downtime trade-offs" },
                    { id: "security_architect", title: "Security Architect", desc: "Dependency graph & perimeter controls" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        role === item.id
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border bg-surface-elevated/40 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="font-semibold text-text-primary">{item.title}</div>
                      <div className="text-[11px] text-text-muted mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Topology Selection */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-text-primary">Select Virtual Topology Scenario</h2>
                  <p className="text-xs text-text-muted">
                    Preloads synthetic virtual assets and baseline network dependencies.
                  </p>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { id: "hybrid_ot", title: "Enterprise Gateway + Industrial OT Controller (Recommended)", desc: "APP-GW-02 edge gateway linked to Modbus OT-CONTROLLER-SIM-01 and telemetry sensors." },
                    { id: "enterprise_cloud", title: "Cloud Microservices VPC", desc: "Identity providers, API gateways, and distributed database nodes." },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTopology(item.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        topology === item.id
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border bg-surface-elevated/40 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="font-semibold text-text-primary">{item.title}</div>
                      <div className="text-[11px] text-text-muted mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Safety Policy Strictness */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-text-primary">Deterministic Safety Boundary Policy</h2>
                  <p className="text-xs text-text-muted">
                    Defines hard invariants that cannot be overridden by AI outputs.
                  </p>
                </div>
                <div className="space-y-3 text-xs">
                  {[
                    { id: "strict_ot", title: "Strict Fail-Safe OT Constraint (SEC-OT-04 Enabled)", desc: "Hard blocks containment candidates that abruptly sever controller telemetry." },
                    { id: "standard_enterprise", title: "Standard IT Containment Policy", desc: "Emphasizes rapid network isolation with warning alerts for downstream services." },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSafetyMode(item.id)}
                      className={`w-full p-4 rounded-xl border text-left transition-all ${
                        safetyMode === item.id
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border bg-surface-elevated/40 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="font-semibold text-text-primary">{item.title}</div>
                      <div className="text-[11px] text-text-muted mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: AI Explanation Style */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-text-primary">AI Explanation & Synthesis Persona</h2>
                  <p className="text-xs text-text-muted">
                    Formats natural language summaries while authoritative metrics remain deterministic.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { id: "technical", title: "Concise Technical", desc: "Focuses on network packets, ports, process IDs, and hashes." },
                    { id: "operational", title: "Operational Impact", desc: "Focuses on service availability, downtime, and recovery SLA." },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExplanationStyle(item.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        explanationStyle === item.id
                          ? "border-accent bg-accent/10 ring-1 ring-accent"
                          : "border-border bg-surface-elevated/40 hover:bg-surface-elevated"
                      }`}
                    >
                      <div className="font-semibold text-text-primary">{item.title}</div>
                      <div className="text-[11px] text-text-muted mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Verification & Final Confirmation */}
            {currentStep === 5 && (
              <div className="space-y-4 text-xs">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-text-primary">Confirm Simulation Lab Settings</h2>
                  <p className="text-xs text-text-muted">
                    Review selected configurations before launching the live console.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-elevated/40 border border-border space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Selected Role:</span>
                    <span className="font-semibold text-text-primary capitalize">{role.replace("_", " ")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Scenario Topology:</span>
                    <span className="font-semibold text-accent">VIRTUAL-GRID-2026 (IT/OT)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Safety Invariant Mode:</span>
                    <span className="font-semibold text-status-success">Strict (Rule SEC-OT-04 Active)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">AI Synthesis:</span>
                    <span className="font-semibold text-text-primary capitalize">{explanationStyle} Persona</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              {currentStep > 1 ? (
                <Button variant="outline" size="sm" onClick={handlePrev} className="gap-1.5 text-xs">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </Button>
              ) : (
                <div />
              )}
              <Button variant="primary" size="sm" onClick={handleNext} className="gap-1.5 text-xs">
                <span>{currentStep === 5 ? "Complete Setup" : "Next Step"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Completion Modal / State */}
        {isCompleted && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-surface-card border border-accent/40 rounded-2xl p-6 md:p-8 space-y-6 text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-status-success/20 border-2 border-status-success flex items-center justify-center text-status-success mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary">Simulation Lab Ready</h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Active scenario <strong>INC-2026-0042</strong> on <strong>APP-GW-02</strong> is loaded and ready for deterministic response evaluation.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/app" className="block">
                  <Button variant="primary" size="lg" className="w-full gap-2 text-sm">
                    <span>Enter Command Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
