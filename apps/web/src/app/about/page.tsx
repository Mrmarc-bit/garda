import * as React from "react";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-primary text-text-primary">
      <PublicHeader />

      <section className="py-16 md:py-24 px-4 md:px-8 border-b border-border bg-[#181818]">
        <div className="max-w-[1440px] mx-auto text-center space-y-4">
          <Badge variant="simulation">About GARDA-SIM AI</Badge>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-text-primary max-w-3xl mx-auto">
            Defensive Decision-Support for Critical Cyber Defense
          </h1>
          <p className="text-sm md:text-base text-text-secondary max-w-2xl mx-auto">
            Created to make incident response trade-offs transparent, defensible, and safe before taking containment action.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 md:px-8">
        <div className="max-w-3xl mx-auto space-y-6 text-xs text-text-secondary leading-relaxed">
          <p>
            In complex cyber incident response, containment actions that seem intuitively effective often trigger unexpected cascading downtime across connected services. GARDA-SIM AI was designed to model these blast radiuses and evaluate candidate response actions in a simulated sandbox.
          </p>
          <p>
            Our core mission is <strong>human empowerment</strong>: providing security operators with deterministic, verified simulations and plain-language trade-off analyses, ensuring human analysts retain ultimate authority over defensive decisions.
          </p>
          <div className="pt-6 text-center">
            <Link href="/app">
              <Button size="sm" className="gap-2 text-xs">
                <span>Enter Simulator</span>
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
