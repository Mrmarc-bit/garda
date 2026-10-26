"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";

export default function RecommendationsPage() {
  const [reviewDecision, setReviewDecision] = React.useState<
    "Pending Review" | "Approved for Demonstration" | "Rejected" | "Requires More Evidence"
  >("Pending Review");

  return (
    <AppLayout breadcrumb="Workspace / AI Recommendations">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/recommendations
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          AI Recommendations
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Explanation specimens support review. They are not source evidence, policy decisions or permission to act.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          className="pb-2.5 text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
        >
          Pending Review · 1
        </button>
        <button
          type="button"
          className="pb-2.5 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
        >
          Reviewed · 0
        </button>
        <button
          type="button"
          className="pb-2.5 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
        >
          All · 1
        </button>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-6">
        {/* Left Column (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Card 1: Selected recommendation list item */}
          <div className="bg-[#252525] border border-[#FF6B35] rounded-xl p-5">
            <div className="text-xs text-[#FF6B35] font-mono">
              · Pending Review
            </div>
            <div className="text-xs font-mono text-[#A3A3A3] mt-2">
              REC-0042-01
            </div>
            <h2 className="text-sm font-bold text-[#F5F5F5] mt-1 leading-snug">
              Review the synthetic session before broad isolation
            </h2>
            <div className="text-xs font-mono text-[#737373] mt-3">
              INC-2026-0042 · APP-GW-02
            </div>
            <div className="text-xs text-[#A3A3A3] mt-4 pt-3 border-t border-[#383838]">
              0.82 illustrative confidence Not calibrated probability
            </div>
          </div>

          {/* Card 2: Provider integration unverified */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-5">
            <h2 className="text-xs font-semibold text-[#F5F5F5]">
              Provider integration unverified
            </h2>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              This is a locally authored explanation specimen, not a response from an integrated AI service.
            </p>
          </div>
        </div>

        {/* Right Column: Detailed Explanation & Review Decisions (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Card 1: Recommendation Header */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase font-mono">
              REC-0042-01 / PENDING REVIEW
            </div>
            <h2 className="text-lg font-bold text-[#F5F5F5] mt-1">
              Review the synthetic session before broad isolation
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#A3A3A3] mt-2">
              <span>· INC-2026-0042</span>
              <span>· Awaiting Review</span>
            </div>
            <p className="text-xs text-[#A3A3A3] mt-4 leading-relaxed">
              A human must inspect context and choose a demonstration decision. No recommendation has been approved or executed.
            </p>
          </div>

          {/* Card 2: Source facts */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              SYNTHETIC EVIDENCE
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-3">
              Source facts
            </h2>
            <div className="font-mono text-xs text-[#A3A3A3] leading-relaxed break-words">
              EV-0042-01 · 09:14:00 UTC · elevation request EV-0042-02 · 09:14:08 UTC · privileged token issued EV-0042-03 · 09:15:10 UTC · privileged route access
            </div>
            <p className="text-xs text-[#737373] mt-3">
              All records: 2026-10-26 UTC, analyst-demo-03, APP-GW-02. The authorization basis is absent.
            </p>
          </div>

          {/* Card 3: Interpretation and uncertainty */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              DERIVED ASSESSMENT
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-2">
              Interpretation and uncertainty
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              The sequence may indicate privilege misuse, but does not establish intent. Illustrative confidence 0.82 is not a calibrated probability. Service impact depends on the virtual topology assumptions.
            </p>
          </div>

          {/* Card 4: Why examine a narrow response first? */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <div className="text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
              AI-GENERATED EXPLANATION / SPECIMEN
            </div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-3">
              Why examine a narrow response first?
            </h2>
            <blockquote className="text-xs text-[#F5F5F5] italic leading-relaxed pl-3 border-l-2 border-[#FF6B35]">
              “Review whether revoking the synthetic elevated session can limit access while preserving the gateway and monitoring dependencies. Request more verification if authorization context is unresolved.”
            </blockquote>
            <p className="text-xs text-[#737373] mt-4 leading-relaxed">
              Narrative specimen linked to EV-0042-01–03. Not an additional fact, computed conclusion or policy approval.
            </p>
          </div>

          {/* Card 5: Tradeoffs & policy specimen */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-2">
              Tradeoffs & policy specimen
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Session revocation may narrow exposure with low assumed service impact. Virtual access restriction may affect OPS-DASH-01. More verification delays a decision. Broad simulated isolation may impair MONITOR-01.
            </p>
            <div className="text-xs text-[#FF6B35] mt-4 font-mono">
              · Illustrative comparison — not a recorded run
            </div>
            <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
              Policy Validation: POL-01 / POL-02 / POL-03 shown as illustrative pass for session review; isolation shown as illustrative fail under POL-01. No actual evaluation occurred.
            </p>
            <div className="text-xs text-[#737373] mt-3">
              Results are simulated estimates, not guarantees of real-world outcomes.
            </div>
          </div>

          {/* Card 6: Human review decision */}
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Human review decision
            </h2>
            <div className="text-xs text-[#FF6B35] font-mono mt-1">
              · {reviewDecision}
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => setReviewDecision("Approved for Demonstration")}
                className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2 rounded-lg hover:bg-[#FF8255] transition-colors"
              >
                Approve for Demonstration
              </button>
              <button
                type="button"
                onClick={() => setReviewDecision("Rejected")}
                className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => setReviewDecision("Requires More Evidence")}
                className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors"
              >
                Request More Evidence
              </button>
            </div>

            <div className="text-xs text-[#737373] mt-4">
              Resulting labels: Approved for Demonstration / Rejected / Requires More Evidence. Saving and authorization require implementation.
            </div>
          </div>
        </div>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
