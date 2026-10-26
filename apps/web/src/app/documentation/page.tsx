import * as React from "react";
import Link from "next/link";
import {
  FileText,
  BookOpen,
  Code,
  ShieldCheck,
  Server,
  ArrowRight,
} from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Documentation & Architecture</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            Technical Documentation & Operational Manual
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            System architecture, deterministic simulation engine specifications, and API contracts.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto space-y-8 text-xs">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent" />
                <span>1. System Architecture Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-relaxed text-text-secondary">
              <p>
                GARDA-SIM AI is structured as a two-tier modular monolith. The web presentation tier is implemented in <strong>Next.js App Router</strong> with TypeScript strict mode and custom Tailwind CSS design tokens. The analytics engine is powered by a Python service enforcing <strong>FastAPI, Pydantic v2 schemas</strong>, and deterministic graph calculations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-accent" />
                <span>2. Deterministic Safety Policy Rules</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 leading-relaxed text-text-secondary">
              <p>
                The platform evaluates candidate response actions against 5 hard deterministic safety rules before presenting recommendations to the human operator:
              </p>
              <ul className="list-disc list-inside space-y-1 text-text-muted">
                <li><strong className="text-text-primary">SEC-OT-01:</strong> Zero Real Containment Invariant.</li>
                <li><strong className="text-text-primary">SEC-OT-02:</strong> Operator Identity & Clearance Verification.</li>
                <li><strong className="text-text-primary">SEC-OT-03:</strong> Core Identity Service Availability Preservation.</li>
                <li><strong className="text-text-primary">SEC-OT-04:</strong> Uninterrupted OT Controller Telemetry Stream.</li>
                <li><strong className="text-text-primary">SEC-OT-05:</strong> Immutable Cryptographic Audit Event Record.</li>
              </ul>
            </CardContent>
          </Card>

          <div className="text-center pt-4">
            <Link href="/app">
              <Button size="sm" className="gap-2 text-xs">
                <span>Open Simulator Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
