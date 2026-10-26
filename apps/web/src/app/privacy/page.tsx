import * as React from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Privacy Policy</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
            Privacy Policy & Synthetic Data Statement
          </h1>
        </div>
      </section>
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-6 text-xs text-text-secondary leading-relaxed">
          <p>
            GARDA-SIM AI is a simulated cybersecurity research platform. All telemetry, IP addresses, asset identifiers, and logs presented in the simulator are synthetic and fictional. No actual personally identifiable information (PII) or production infrastructure telemetry is processed or stored.
          </p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
