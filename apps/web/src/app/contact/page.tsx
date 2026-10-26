import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/contact · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            PRODUCT GUIDE / /contact
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            A question about the prototype?
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            Use this form design to understand the intended contact experience. Do not submit sensitive operational data.
          </p>
        </div>
      </section>

      {/* 2-Column Form & Safety Cards */}
      <section className="px-6 md:px-12 lg:px-16 py-12 flex-1">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form Specimen */}
          <div className="lg:col-span-8 space-y-6">
            <div className="space-y-4">
              {/* Name */}
              <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-1">
                <label className="text-[11px] font-mono text-[#737373] block">
                  Name
                </label>
                <input
                  type="text"
                  defaultValue="Demo Analyst"
                  className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none"
                />
              </div>

              {/* Email Address with specimen error state */}
              <div className="bg-[#202020] border border-[#EF4444] rounded-xl p-4 space-y-1">
                <label className="text-[11px] font-mono text-[#737373] block">
                  Email address
                </label>
                <input
                  type="text"
                  defaultValue="analyst-demo"
                  className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none"
                />
                <div className="text-[11px] text-[#EF4444] pt-1">
                  Enter a complete email address, such as name@example.test.
                </div>
              </div>

              {/* Topic Select */}
              <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-1">
                <label className="text-[11px] font-mono text-[#737373] block">
                  Topic
                </label>
                <div className="text-sm text-[#F5F5F5] flex items-center justify-between">
                  <span>Prototype feedback</span>
                  <span className="text-[#737373] text-xs">⌄</span>
                </div>
              </div>

              {/* Message */}
              <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-2">
                <label className="text-[11px] font-mono text-[#737373] block">
                  Message
                </label>
                <textarea
                  rows={3}
                  defaultValue="I have a question about how the synthetic dependency model is represented."
                  className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none resize-none"
                />
                <div className="text-[11px] text-[#737373] pt-1 border-t border-[#303030]">
                  Use synthetic examples only. Do not include incident data, credentials or personal information.
                </div>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-[#737373] leading-relaxed">
                By submitting, you would acknowledge the draft Privacy notice. Consent and delivery behavior require implementation.
              </p>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled
                  className="bg-[#252525] border border-[#383838] text-[#737373] text-xs font-medium px-5 py-2.5 rounded-lg cursor-not-allowed"
                >
                  Send message — not connected
                </button>
              </div>

              {/* Alert Callout matching Figma */}
              <div className="bg-[#42271F]/40 border border-[#FF6B35] rounded-xl p-4 text-xs text-[#A3A3A3] mt-6">
                <span className="font-semibold text-[#F5F5F5] block mb-1">
                  Email delivery not configured in this prototype
                </span>
                This is a visual form specimen. No message has been sent or stored.
              </div>
            </div>
          </div>

          {/* Right Column: Specimen Guidance Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Before you write
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Documentation explains the synthetic dataset, dependency arrows, policy boundaries and review workflow.
              </p>
              <div className="pt-1">
                <Link
                  href="/documentation"
                  className="text-xs text-[#F5F5F5] hover:text-[#FF6B35] underline transition-colors"
                >
                  Read documentation
                </Link>
              </div>
            </div>

            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-3">
              <h2 className="text-base font-bold text-[#F5F5F5]">
                Sharing safely
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Describe the screen or concept, not your real infrastructure. There is no verified support inbox, legal entity or delivery service configured in this design.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
