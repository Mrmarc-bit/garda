import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  PlayCircle,
  Network,
  ShieldCheck,
  Sparkles,
  FileSearch,
  CheckCircle2,
  ArrowRight,
  Cpu,
  History,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FeaturesPage() {
  const features = [
    {
      title: "Evidence-Grounded Investigation",
      icon: FileSearch,
      desc: "Connects simulated cyber incidents directly to verifiable synthetic forensic artifacts, system logs, and network flow probes without hallucinations.",
      bullets: ["Observed forensic facts vs derived assertions", "Structured JSON payload inspection", "Zero fabricated evidence IDs"],
    },
    {
      title: "IT/OT Virtual Digital Twin",
      icon: Network,
      desc: "Visualizes complex dependency chains between enterprise edge services and critical operational technology controllers in an interactive 2D directed graph.",
      bullets: ["Downstream dependency blast radius modeling", "SCADA and Modbus controller boundary simulation", "Asset criticality tiering (High/Critical)"],
    },
    {
      title: "Deterministic Response Simulator",
      icon: PlayCircle,
      desc: "Computes projected downtime, containment efficacy, and recovery effort deterministically. Multi-candidate evaluation ensures transparent trade-offs.",
      bullets: ["Multi-candidate strategy comparison", "Quantitative downtime modeling (Minutes)", "100% reproducible evaluation seeds"],
    },
    {
      title: "Deterministic Safety Constraint Enforcement",
      icon: ShieldCheck,
      desc: "Enforces hard safety invariants (e.g. SEC-OT-04 telemetry protection) directly in code. AI output cannot override safety policies.",
      bullets: ["5 non-negotiable safety invariant checks", "Deterministic containment blocking", "Independent of external LLM availability"],
    },
    {
      title: "Explainable AI Trade-Off Synthesis",
      icon: Sparkles,
      desc: "Generates clear, natural language trade-off summaries, uncertainty quantification, and citations for human review and final approval.",
      bullets: ["Direct evidence citations (e.g. EVD-101)", "Explicit uncertainty scoring (±4%)", "Local deterministic fallback persona"],
    },
    {
      title: "Immutable Simulation Audit Trail",
      icon: History,
      desc: "Records every simulation run, safety verdict, and human sign-off in an append-only event ledger with cryptographic hash chaining.",
      bullets: ["Cryptographic hash signature verification", "Searchable by actor, resource, and result", "JSON and Markdown report export"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Platform Capabilities</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            Architected for High-Trust Defensive Cybersecurity Simulation
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Discover the six core pillars that make GARDA-SIM AI a defensible, reproducible decision-support system.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} className="bg-surface-card border-border flex flex-col justify-between">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-bold">{feat.title}</CardTitle>
                  <p className="text-xs text-text-secondary leading-relaxed pt-2">{feat.desc}</p>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="pt-4 border-t border-border/60 space-y-2 text-xs">
                    {feat.bullets.map((b) => (
                      <div key={b} className="flex items-center gap-2 text-text-muted">
                        <CheckCircle2 className="w-3.5 h-3.5 text-status-success shrink-0" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
