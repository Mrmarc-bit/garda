import * as React from "react";
import Link from "next/link";

export const PublicFooter: React.FC = () => {
  return (
    <footer className="border-t border-[#303030] bg-[#141414] text-[#A3A3A3] text-xs">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="space-y-4">
          <div className="font-bold text-sm tracking-wide text-[#F5F5F5]">
            GARDA-SIM AI
          </div>
          <p className="text-xs text-[#737373] max-w-xl leading-relaxed">
            AI-Assisted Cyber Defense Response Simulator.
            <br />
            Defensive research prototype. Synthetic incidents and virtual IT/OT assets only.
          </p>

          <div className="pt-4 space-y-1.5 text-xs">
            <div>
              <span className="text-[#F5F5F5] font-medium mr-2">Product /</span>
              <Link href="/features" className="hover:text-[#F5F5F5]">Features</Link> ·{" "}
              <Link href="/how-it-works" className="hover:text-[#F5F5F5]">How It Works</Link> ·{" "}
              <Link href="/app" className="hover:text-[#F5F5F5]">Simulation Lab</Link>
            </div>
            <div>
              <span className="text-[#F5F5F5] font-medium mr-2">Resources /</span>
              <Link href="/documentation" className="hover:text-[#F5F5F5]">Documentation</Link> ·{" "}
              <Link href="/faq" className="hover:text-[#F5F5F5]">FAQ</Link> ·{" "}
              <Link href="/contact" className="hover:text-[#F5F5F5]">Contact</Link>
            </div>
            <div>
              <span className="text-[#F5F5F5] font-medium mr-2">Legal /</span>
              <Link href="/privacy" className="hover:text-[#F5F5F5]">Privacy</Link> ·{" "}
              <Link href="/terms" className="hover:text-[#F5F5F5]">Terms</Link> ·{" "}
              <Link href="/security" className="hover:text-[#F5F5F5]">Security</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#303030]/60 text-[11px] text-[#737373]">
          Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
        </div>
      </div>
    </footer>
  );
};
