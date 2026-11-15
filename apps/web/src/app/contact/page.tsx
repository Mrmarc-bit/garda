"use client";

import * as React from "react";
import Link from "next/link";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { Send, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = React.useState("Demo Analyst");
  const [email, setEmail] = React.useState("analyst-demo@garda-sim.test");
  const [topic, setTopic] = React.useState("Prototype feedback");
  const [message, setMessage] = React.useState(
    "I have a question about how the synthetic dependency model is represented."
  );
  const [isComposed, setIsComposed] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "failed">("idle");

  const composedText = `Topic: ${topic}\nFrom: ${name} <${email}>\n\n${message}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address (e.g. name@domain.test).");
      return;
    }
    if (!message.trim()) {
      setError("Please enter a message before continuing.");
      return;
    }
    setError(null);
    setCopyState("idle");
    setIsComposed(true);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(composedText);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  };

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
            Have a question about the simulation?
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-2xl leading-relaxed">
            Compose a question about the synthetic simulation. This form validates your input and
            prepares the text, but this build has no contact endpoint, so nothing is transmitted or stored.
          </p>
        </div>
      </section>

      {/* 2-Column Form & Safety Cards */}
      <section className="px-6 md:px-12 lg:px-16 py-12 flex-1">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-8 space-y-6">
            {isComposed ? (
              <div
                role="status"
                className="bg-[#202020] border border-amber-500/50 rounded-2xl p-8 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#F5F5F5]">
                      Message prepared — not sent
                    </h2>
                    <p className="text-xs text-[#A3A3A3] mt-0.5">
                      This build has no contact endpoint, so nothing was transmitted or stored.
                    </p>
                  </div>
                </div>
                <p className="text-xs text-[#A3A3A3] leading-relaxed">
                  The form validates your input, but delivery is not implemented. Copy the text
                  below and send it through a channel you control. No message is logged to the
                  audit ledger either, because the ledger only records simulation and review events.
                </p>
                <pre className="bg-[#141414] border border-[#2D2D2D] rounded-xl p-4 text-[11px] font-mono text-[#E5E5E5] whitespace-pre-wrap break-words">
                  {composedText}
                </pre>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => void handleCopy()}
                    className="bg-[#FF6B35] text-white text-xs font-medium px-4 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors cursor-pointer"
                  >
                    Copy message
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsComposed(false)}
                    className="text-xs text-[#FF6B35] hover:underline cursor-pointer"
                  >
                    Edit the message
                  </button>
                  {copyState === "copied" ? (
                    <span className="text-[11px] font-mono text-emerald-400">COPIED TO CLIPBOARD</span>
                  ) : null}
                  {copyState === "failed" ? (
                    <span className="text-[11px] font-mono text-amber-400">
                      CLIPBOARD BLOCKED — SELECT THE TEXT ABOVE
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Name */}
                <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-1 focus-within:border-[#FF6B35] transition-colors">
                  <label htmlFor="contact-name" className="text-[11px] font-mono text-[#737373] block">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none"
                  />
                </div>

                {/* Email Address */}
                <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-1 focus-within:border-[#FF6B35] transition-colors">
                  <label htmlFor="contact-email" className="text-[11px] font-mono text-[#737373] block">
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none font-mono"
                  />
                </div>

                {/* Topic Select */}
                <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-1">
                  <label htmlFor="contact-topic" className="text-[11px] font-mono text-[#737373] block">
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none cursor-pointer"
                  >
                    <option value="Prototype feedback" className="bg-[#202020]">Prototype feedback</option>
                    <option value="Deterministic Safety Policies" className="bg-[#202020]">Deterministic Safety Policies</option>
                    <option value="Virtual IT/OT Digital Twin" className="bg-[#202020]">Virtual IT/OT Digital Twin</option>
                    <option value="Academic Collaboration" className="bg-[#202020]">Academic Collaboration</option>
                  </select>
                </div>

                {/* Message */}
                <div className="bg-[#202020] border border-[#383838] rounded-xl p-4 space-y-2 focus-within:border-[#FF6B35] transition-colors">
                  <label htmlFor="contact-msg" className="text-[11px] font-mono text-[#737373] block">
                    Message
                  </label>
                  <textarea
                    id="contact-msg"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-transparent text-sm text-[#F5F5F5] focus:outline-none resize-none"
                  />
                  <div className="text-[11px] text-[#737373] pt-1 border-t border-[#303030]">
                    Do not submit classified credentials or live telemetry keys.
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="bg-[#FF6B35] text-white text-xs font-medium px-6 py-3 rounded-lg hover:bg-[#FF8255] transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Prepare message</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Research Information */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#202020] border border-[#383838] rounded-xl p-6">
              <h2 className="text-sm font-bold text-[#F5F5F5]">
                Defensive Prototype Lab
              </h2>
              <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
                GARDA-SIM AI is developed as an explainable decision-support workbench. Responses are evaluated deterministically against synthetic virtual topology constraints.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
