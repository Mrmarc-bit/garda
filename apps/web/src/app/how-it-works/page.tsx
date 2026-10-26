import * as React from "react";
import Link from "next/link";
import {
  FileSearch,
  Network,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HowItWorksPage() {
  const steps = [
    {
      num: "01",
      title: "Load Synthetic Incident Scenario",
      desc: "Ingest structured synthetic telemetry, audit logs, and network flow probes without connecting to live operational systems.",
      icon: FileSearch,
    },
    {
      num: "02",
      title: "Map Virtual IT/OT Blast Radius",
      desc: "Compute directed dependencies between edge gateways, identity controllers, and virtual industrial equipment to identify vulnerable downstream nodes.",
      icon: Network,
    },
    {
      num: "03",
      title: "Simulate Candidate Response Strategies",
      desc: "Run deterministic calculations of containment effectiveness, projected service downtime, and recovery overhead for multiple candidate actions.",
      icon: PlayCircle,
    },
    {
      num: "04",
      title: "Enforce Deterministic Safety Policies",
      desc: "Automatically evaluate candidate actions against hard constraints (e.g. Rule SEC-OT-04). Block any containment that violates critical safety invariants.",
      icon: ShieldCheck,
    },
    {
      num: "05",
      title: "Review Explainable AI Analysis & Sign Off",
      desc: "Inspect plain-language trade-off rationales with cited evidence and uncertainty bounds before recording permanent sign-off in the immutable audit trail.",
      icon: Sparkles,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Decision-Support Workflow</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            How GARDA-SIM AI Evaluates Incident Response
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            A deterministic 5-step decision cycle keeping human analysts in control of defensive cybersecurity operations.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="flex flex-col sm:flex-row items-start gap-6 p-6 md:p-8 rounded-2xl border border-border bg-surface-card"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent shrink-0 font-mono font-bold text-lg">
                  {step.num}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-accent" />
                    <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
                  </div>
                  <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}

          <div className="text-center pt-8">
            <Link href="/app">
              <Button size="lg" className="gap-2">
                <span>Try the Interactive Simulator</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
