"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldAlert, ServerOff, UserCheck, FlaskConical, ChevronDown, CheckCircle2, Lock } from "lucide-react";

interface FaqItem {
  id: string;
  icon: React.ElementType;
  question: string;
  shortAnswer: string;
  badge: string;
  badgeColor: string;
  technicalInvariant: string;
  detail: string;
}

const FAQS: FaqItem[] = [
  {
    id: "prod",
    icon: ServerOff,
    question: "Does this connect to production?",
    shortAnswer: "No. Every incident and asset is synthetic or virtual.",
    badge: "100% AIR-GAPPED",
    badgeColor: "text-[#4ADE80] border-[#4ADE80]/30 bg-[#4ADE80]/10",
    technicalInvariant: "OUTBOUND_PRODUCTION_TRAFFIC == 0",
    detail:
      "All simulated target assets (APP-GW-02, OT-CONTROLLER-SIM-01) are in-memory virtual graph entities. Network sockets are strictly disabled; no packets ever leave the simulation boundary.",
  },
  {
    id: "execution",
    icon: UserCheck,
    question: "Can AI execute a response?",
    shortAnswer: "No. Explanations do not authorize actions; human review is explicit.",
    badge: "HUMAN IN THE LOOP",
    badgeColor: "text-[#FF6B35] border-[#FF6B35]/30 bg-[#FF6B35]/10",
    technicalInvariant: "AUTONOMOUS_EXECUTION == FALSE",
    detail:
      "AI-generated outputs are unverified text explanations. The application enforces a hard fail-closed gate: 'Pending Review' is the immutable default state, requiring explicit human supervisor authorization.",
  },
  {
    id: "measured",
    icon: FlaskConical,
    question: "Are the example results measured?",
    shortAnswer: "No. Comparisons are illustrative, not recorded experiments.",
    badge: "PROTOTYPE SPECIMEN",
    badgeColor: "text-[#FBBF24] border-[#FBBF24]/30 bg-[#FBBF24]/10",
    technicalInvariant: "RECORDED_BENCHMARK_RUNS == 0",
    detail:
      "All metrics (e.g. 15 min downtime, 0.82 confidence) are layout specimens designed to demonstrate trade-off comparison capabilities. No empirical performance or superiority claims are made.",
  },
];

export function ScopeLimitationsVisualizer() {
  const [activeItem, setActiveItem] = React.useState<string>("prod");

  return (
    <div className="space-y-6">
      {/* 3 Interactive Boundary Scope Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FAQS.map((faq) => {
          const Icon = faq.icon;
          const isActive = activeItem === faq.id;

          return (
            <div
              key={faq.id}
              onClick={() => setActiveItem(faq.id)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer bg-[#202020] flex flex-col justify-between space-y-4 group ${
                isActive
                  ? "border-[#FF6B35] bg-[#242424] shadow-xl shadow-[#FF6B35]/10"
                  : "border-[#383838] hover:border-[#555555]"
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#2A2A2A] flex items-center justify-center text-[#FF6B35] group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${faq.badgeColor}`}>
                    {faq.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#FF6B35] transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-xs text-[#D4D4D4] font-medium leading-relaxed">
                    {faq.shortAnswer}
                  </p>
                </div>
              </div>

              {/* Technical Invariant & Verification Detail */}
              <div className="pt-3 border-t border-[#333333] space-y-2">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#737373]">
                  <span>INVARIANT RULE</span>
                  <span className="text-[#86EFAC] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#4ADE80]" /> ENFORCED
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#181818] border border-[#2B2B2B] font-mono text-[11px] text-[#A3A3A3]">
                  <code>{faq.technicalInvariant}</code>
                </div>
                <p className="text-[11px] text-[#858585] leading-snug">
                  {faq.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Link to Full FAQ Suite */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-[#737373] font-mono">
          Strict deterministic boundaries defined in SECURITY.md & PRD.md
        </span>
        <Link
          href="/faq"
          className="text-xs text-[#FF6B35] font-mono underline hover:text-[#FF8255] transition-colors flex items-center gap-1 group"
        >
          <span>View all FAQs</span>
          <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
        </Link>
      </div>
    </div>
  );
}
