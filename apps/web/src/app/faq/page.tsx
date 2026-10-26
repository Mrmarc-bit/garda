import * as React from "react";
import Link from "next/link";
import { HelpCircle, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FaqPage() {
  const faqs = [
    {
      q: "Does GARDA-SIM AI execute real containment actions against my network?",
      a: "No. GARDA-SIM AI is strictly a defensive decision-support simulator. It operates entirely on synthetic data, virtual IT/OT asset models, and synthetic incident logs. It cannot execute live containment, modify network firewalls, or terminate live accounts.",
    },
    {
      q: "Can the AI model override a safety policy verdict?",
      a: "Never. All safety invariants are enforced deterministically by code before recommendations are displayed. If an action violates a safety rule (such as severing OT telemetry), it is marked as BLOCKED, and the AI model cannot authorize or execute it.",
    },
    {
      q: "Can the simulator operate if an external AI provider goes offline?",
      a: "Yes. The deterministic simulation calculations and safety policy engine operate completely offline and independently of external LLMs. A local deterministic fallback persona generates structured explanations directly from the rule graph.",
    },
    {
      q: "Are the metrics and incident records consistent across the platform?",
      a: "Yes. The entire application uses a unified synthetic dataset: incident INC-2026-0042 targeting edge gateway APP-GW-02, connected to virtual assets IDENTITY-SVC-01, MONITOR-01, OPS-DASH-01, OT-CONTROLLER-SIM-01, and TELEMETRY-SIM-01.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Frequently Asked Questions</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            Questions & Operational Clarifications
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Clear answers on simulation scope, deterministic safety, and synthetic boundaries.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {faqs.map((faq) => (
            <Card key={faq.q} className="border-border bg-surface-card">
              <CardHeader>
                <CardTitle className="text-sm md:text-base font-semibold flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0 text-xs text-text-secondary leading-relaxed pl-10">
                {faq.a}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
