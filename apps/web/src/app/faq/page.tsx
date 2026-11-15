"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeTab, setActiveTab] = React.useState<"all" | "scenarios" | "ai" | "results">("all");

  const faqGroups = [
    {
      id: "scenarios",
      title: "Scenarios & data",
      items: [
        {
          q: "What can I investigate?",
          a: "INC-2026-0042 — Suspicious Privilege Escalation, with three synthetic events and six virtual IT/OT assets in Simulation Lab.",
        },
        {
          q: "Does any content come from production?",
          a: "No. The specified dataset is local and synthetic. Do not enter real credentials, incident records or sensitive operational information.",
        },
        {
          q: "What does a dependency arrow mean?",
          a: "A → B means A depends on B. It is not an attack path, data flow or proof of propagation.",
        },
      ],
    },
    {
      id: "ai",
      title: "AI & safety",
      items: [
        {
          q: "Can AI take a response action?",
          a: "No. AI assists explanation only. Candidate actions are hypothetical and require explicit human review for demonstration.",
        },
        {
          q: "Is confidence a probability?",
          a: "No. The example 0.82 is illustrative confidence and has not been calibrated. It is not evidence of correctness.",
        },
        {
          q: "Does the design validate policy?",
          a: "No. Policy Validation is a separate proposed deterministic layer. Pass/fail labels are illustrative specimens, not computed checks.",
        },
      ],
    },
    {
      id: "results",
      title: "Results & access",
      items: [
        {
          q: "Are comparisons recorded experiments?",
          a: "No. Every sample comparison is labeled Illustrative comparison — not a recorded run. Experiments default to No experiment run yet.",
        },
        {
          q: "Can I export results?",
          a: "Export controls remain disabled until recorded data exists and an export implementation is provided. Sample report layouts do not create files.",
        },
        {
          q: "Is account or email behavior implemented?",
          a: "No. Account forms and verification messages are visual specimens. Server validation, sessions, email delivery and persistence require implementation.",
        },
      ],
    },
  ];

  const filteredGroups = faqGroups
    .filter((group) => (activeTab === "all" ? true : group.id === activeTab))
    .map((group) => {
      if (!searchQuery.trim()) return group;
      const lower = searchQuery.toLowerCase();
      const filteredItems = group.items.filter(
        (item) => item.q.toLowerCase().includes(lower) || item.a.toLowerCase().includes(lower)
      );
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/faq · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-10 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            PRODUCT GUIDE / /faq
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            Know the boundaries.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            Answers about scenarios, synthetic data, AI assistance and the meaning of simulated results.
          </p>
        </div>
      </section>

      {/* Main FAQ Content */}
      <section className="px-6 md:px-12 lg:px-16 py-10 flex-1">
        <div className="max-w-[1440px] mx-auto space-y-10">
          {/* Search Bar Specimen Box */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-5 max-w-4xl space-y-2">
            <label htmlFor="search-input" className="text-xs font-mono text-[#737373] block">
              Search questions
            </label>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic or keyword"
              className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none"
            />
            <div className="text-[11px] text-[#737373] pt-1 border-t border-[#303030]">
              Filters this page&apos;s questions as you type.
            </div>
          </div>

          {/* Category Tabs */}
          <div
            className="flex flex-wrap items-center gap-6 text-xs border-b border-[#303030] pb-3 max-w-4xl"
            role="tablist"
            aria-label="FAQ categories"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "all"}
              onClick={() => setActiveTab("all")}
              className={`transition-colors cursor-pointer ${
                activeTab === "all" ? "text-[#FF6B35] font-semibold" : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              All questions
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "scenarios"}
              onClick={() => setActiveTab("scenarios")}
              className={`transition-colors cursor-pointer ${
                activeTab === "scenarios" ? "text-[#FF6B35] font-semibold" : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              Scenarios & data
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "ai"}
              onClick={() => setActiveTab("ai")}
              className={`transition-colors cursor-pointer ${
                activeTab === "ai" ? "text-[#FF6B35] font-semibold" : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              AI & safety
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "results"}
              onClick={() => setActiveTab("results")}
              className={`transition-colors cursor-pointer ${
                activeTab === "results" ? "text-[#FF6B35] font-semibold" : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              Results & access
            </button>
          </div>

          {/* Groups and Cards */}
          <div className="space-y-12 max-w-4xl">
            {filteredGroups.map((group) => (
              <div key={group.id} className="space-y-4">
                <h2 className="text-xl font-bold text-[#F5F5F5]">
                  {group.title}
                </h2>

                <div className="space-y-4">
                  {group.items.map((item) => (
                    <div
                      key={item.q}
                      className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3"
                    >
                      <h3 className="text-base font-bold text-[#F5F5F5]">
                        {item.q}
                      </h3>
                      <p className="text-xs text-[#A3A3A3] leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Link */}
          <div className="pt-4">
            <Link
              href="/contact"
              className="text-xs text-[#F5F5F5] hover:text-[#FF6B35] underline transition-colors"
            >
              Ask a question → Contact
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
