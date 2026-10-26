import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Server,
  FileText,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Security & Safety Posture</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            Defensive Boundaries & Deterministic Safety Assurance
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            GARDA-SIM AI is built as a defensive decision-support prototype operating strictly on synthetic evidence.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Boundary Card */}
          <div className="p-6 md:p-8 rounded-2xl border border-accent/40 bg-accent/10 flex flex-col sm:flex-row items-start gap-6">
            <div className="w-14 h-14 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shrink-0">
              <ShieldAlert className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-text-primary">Non-Negotiable Isolation Boundaries</h3>
              <p className="text-xs md:text-sm text-text-secondary leading-relaxed">
                The platform contains no live operational connectors. It cannot execute network commands, configure hardware firewalls, isolate live endpoints, or modify production/OT environments. All telemetry, assets, and incidents are synthetic.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-bold">Deterministic Safety Invariants</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary leading-relaxed">
                Safety rules are enforced deterministically in Python/Pydantic code. An AI model has zero authority to override policy verdicts or authorize containment actions that violate hard constraints.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-10 h-10 rounded-lg bg-status-info/15 border border-status-info/30 flex items-center justify-center text-status-info mb-2">
                  <Lock className="w-5 h-5" />
                </div>
                <CardTitle className="text-base font-bold">Immutable Audit Trail</CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-text-secondary leading-relaxed">
                Every simulation execution, policy evaluation, and operator review sign-off generates a cryptographic hash event in an append-only log, ensuring reproducible post-incident reviews.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
