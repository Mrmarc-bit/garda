import * as React from "react";
import Link from "next/link";
import { Shield } from "lucide-react";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-border bg-bg-secondary text-text-secondary py-12 px-4 md:px-8">
      <div className="max-w-[1440px] mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
              <Shield className="w-4 h-4 text-accent" />
            </div>
            <span className="font-bold text-sm text-text-primary tracking-wider">GARDA-SIM AI</span>
          </div>
          <p className="text-xs text-text-muted max-w-sm leading-relaxed">
            AI-Assisted Cyber Defense Response Simulator. Evaluate candidate containment actions, model virtual IT/OT impact, and enforce deterministic safety policies.
          </p>
          <div className="text-[11px] text-accent/80 font-mono">
            DEFENSIVE SIMULATION ONLY · SYNTHETIC ENVIRONMENTS
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">Product</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/features" className="hover:text-text-primary">Features</Link></li>
            <li><Link href="/how-it-works" className="hover:text-text-primary">How It Works</Link></li>
            <li><Link href="/app" className="hover:text-text-primary">Response Simulator</Link></li>
            <li><Link href="/app/digital-twin" className="hover:text-text-primary">Digital Twin</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">Security & Trust</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/security" className="hover:text-text-primary">Security Model</Link></li>
            <li><Link href="/documentation" className="hover:text-text-primary">Deterministic Safety</Link></li>
            <li><Link href="/privacy" className="hover:text-text-primary">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-text-primary">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider mb-3">Resources</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/documentation" className="hover:text-text-primary">Documentation</Link></li>
            <li><Link href="/faq" className="hover:text-text-primary">FAQ</Link></li>
            <li><Link href="/about" className="hover:text-text-primary">About GARDA-SIM</Link></li>
            <li><Link href="/contact" className="hover:text-text-primary">Contact & Feedback</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between text-xs text-text-muted gap-4">
        <div>© 2026 GARDA-SIM AI. All rights reserved. Built for defensive security simulation and evaluation.</div>
        <div className="text-[11px] font-mono">Status: All Simulation Engines Operational</div>
      </div>
    </footer>
  );
};
