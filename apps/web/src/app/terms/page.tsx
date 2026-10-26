import * as React from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Badge } from "@/components/ui/badge";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />
      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">Terms of Service</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary">
            Terms of Service & Non-Liability Notice
          </h1>
        </div>
      </section>
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-6 text-xs text-text-secondary leading-relaxed">
          <p>
            GARDA-SIM AI is provided for educational, research, and defensive evaluation purposes. Output metrics, downtime estimates, and AI recommendations are simulated projections and do not constitute warranties or real-world containment authorizations.
          </p>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
