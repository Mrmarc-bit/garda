"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = React.useState<number>(1);
  const [isCompleted, setIsCompleted] = React.useState(false);

  const steps = [
    {
      num: 1,
      navTitle: "1. Welcome",
      title: "Welcome to the Simulation Lab.",
      subtitle: "Defensive research with synthetic incidents and virtual assets only. A human remains responsible for review.",
      cardTitle: "Understand the response, not just the alert",
      cardBody: (
        <p className="text-xs text-[#A3A3A3] leading-relaxed">
          Investigate → compare → inspect constraints → review. This short orientation introduces the workspace and its limits. No real credentials, production connections or automated remediation.
        </p>
      ),
    },
    {
      num: 2,
      navTitle: "2. Synthetic environment",
      title: "A bounded, synthetic environment.",
      subtitle: "Defensive research with synthetic incidents and virtual assets only. A human remains responsible for review.",
      cardTitle: "Your synthetic environment",
      cardBody: (
        <div className="space-y-3 text-xs text-[#A3A3A3] leading-relaxed">
          <p>One incident, three evidence records and six virtual IT/OT assets.</p>
          <div className="font-mono text-[11px] text-[#F5F5F5]">
            IDENTITY-SVC-01 / APP-GW-02 / MONITOR-01 / OPS-DASH-01 / OT-CONTROLLER-SIM-01 / TELEMETRY-SIM-01
          </div>
          <p>A → B means A depends on B. Virtual dependencies are assumptions, not measured infrastructure.</p>
        </div>
      ),
    },
    {
      num: 3,
      navTitle: "3. Evidence & simulation",
      title: "Follow the evidence, then compare.",
      subtitle: "Defensive research with synthetic incidents and virtual assets only. A human remains responsible for review.",
      cardTitle: "Synthetic evidence path",
      cardBody: (
        <div className="space-y-3 text-xs text-[#A3A3A3] leading-relaxed font-mono">
          <div className="text-[11px] text-[#737373]">2026-10-26 UTC</div>
          <div className="space-y-1 text-xs text-[#F5F5F5]">
            <div>EV-0042-01 / 09:14:00 / Role elevation requested</div>
            <div>EV-0042-02 / 09:14:08 / Privileged token issued</div>
            <div>EV-0042-03 / 09:15:10 / Privileged route accessed</div>
          </div>
          <p className="font-sans text-[#A3A3A3] pt-2">
            Keep Synthetic Evidence separate from Derived Assessment. Compare hypothetical strategies, not real response actions.
          </p>
        </div>
      ),
    },
    {
      num: 4,
      navTitle: "4. Constraints & review",
      title: "Constraints and people have distinct roles.",
      subtitle: "Defensive research with synthetic incidents and virtual assets only. A human remains responsible for review.",
      cardTitle: "The review boundary",
      cardBody: (
        <div className="space-y-3 text-xs text-[#A3A3A3] leading-relaxed">
          <p>
            <strong className="text-[#F5F5F5]">AI-Generated Explanation:</strong> narrative specimen linked to evidence; provider integration unverified.
          </p>
          <p>
            <strong className="text-[#F5F5F5]">Policy Validation:</strong> a separate proposed deterministic layer. Preserve monitoring, require review and protect the OT controller. No policy has been computed.
          </p>
          <p>
            <strong className="text-[#F5F5F5]">Human review:</strong> Pending Review → Approved for Demonstration / Rejected / Requires More Evidence.
          </p>
        </div>
      ),
    },
    {
      num: 5,
      navTitle: "5. Enter Simulation Lab",
      title: "Ready to explore the lab.",
      subtitle: "Defensive research with synthetic incidents and virtual assets only. A human remains responsible for review.",
      cardTitle: "Your first investigation",
      cardBody: (
        <div className="space-y-2 text-xs text-[#A3A3A3] leading-relaxed">
          <div className="text-sm font-semibold text-[#F5F5F5]">
            INC-2026-0042 — Suspicious Privilege Escalation
          </div>
          <div className="font-mono text-[11px] text-[#737373]">
            High / Awaiting Review / Simulation Lab
            <br />
            APP-GW-02 / analyst-demo-03
          </div>
          <p className="pt-2">
            Illustrative confidence 0.82 is not calibrated probability. Inspect evidence before comparing hypothetical actions. No experiment run yet.
          </p>
        </div>
      ),
    },
  ];

  const current = steps[step - 1];

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (isCompleted) {
      setIsCompleted(false);
      setStep(5);
    } else if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      {/* Top Header */}
      <header className="px-6 md:px-12 py-5 border-b border-[#303030] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm tracking-wide text-[#F5F5F5]">
          <span className="w-3 h-0.5 bg-[#FF6B35]" />
          <span>GARDA-SIM AI</span>
        </Link>
        <span className="text-[11px] font-mono text-[#FF6B35] uppercase tracking-wider">
          · SIMULATION ONLY
        </span>
      </header>

      {/* Main Content matching Figma */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto px-6 md:px-12 py-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="text-[11px] font-mono text-[#FF6B35] uppercase tracking-wider">
            ORIENTATION / {isCompleted ? "5 OF 5" : `${step} OF 5`}
          </div>

          <nav className="space-y-3 text-xs">
            {steps.map((s) => {
              const isActive = !isCompleted && s.num === step;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => {
                    setIsCompleted(false);
                    setStep(s.num);
                  }}
                  className={`block text-left transition-colors ${
                    isActive
                      ? "text-[#F5F5F5] font-semibold"
                      : "text-[#737373] hover:text-[#A3A3A3]"
                  }`}
                >
                  {isActive ? `▸ ${s.navTitle}` : s.navTitle}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Main Panel (9 cols) */}
        <main className="lg:col-span-9 space-y-8 max-w-4xl">
          {/* Title Area */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
              {isCompleted ? "Orientation complete — specimen." : current.title}
            </h1>
            <p className="text-sm md:text-base text-[#A3A3A3] leading-relaxed">
              {isCompleted
                ? "Defensive research with synthetic incidents and virtual assets only. A human remains responsible for review."
                : current.subtitle}
            </p>
          </div>

          {/* Orientation Specimen Box */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-8 space-y-4">
            <div className="text-[11px] font-mono text-[#FF6B35] uppercase tracking-wider">
              SIMULATION ONLY
            </div>

            <h2 className="text-lg font-bold text-[#F5F5F5]">
              {isCompleted ? "Completion specimen, not saved progress" : current.cardTitle}
            </h2>

            {isCompleted ? (
              <div className="space-y-3 text-xs text-[#A3A3A3] leading-relaxed">
                <p>The intended orientation is complete. No account state or returning-user preference has been persisted.</p>
                <p>Enter the lab at INC-2026-0042. Review evidence, assumptions and uncertainty. No experiment run yet.</p>
              </div>
            ) : (
              current.cardBody
            )}
          </div>

          {/* Visual onboarding disclaimer card */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-5 space-y-1.5">
            <h3 className="text-xs font-bold text-[#F5F5F5]">
              Visual onboarding, not saved progress
            </h3>
            <p className="text-xs text-[#737373] leading-relaxed">
              Returning-user detection, previous/next/skip behavior and completion persistence require implementation.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1 && !isCompleted}
              className={`text-xs ${
                step === 1 && !isCompleted
                  ? "text-[#525252] cursor-not-allowed"
                  : "text-[#A3A3A3] hover:text-[#F5F5F5]"
              }`}
            >
              Previous
            </button>

            {isCompleted ? (
              <Link
                href="/app"
                className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors"
              >
                Enter Simulation Lab
              </Link>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="bg-[#FF6B35] text-white text-xs font-medium px-5 py-2.5 rounded-lg hover:bg-[#FF8255] transition-colors"
              >
                {step === 5 ? "Enter Simulation Lab" : "Next"}
              </button>
            )}

            <Link
              href="/app"
              className="text-xs text-[#F5F5F5] underline hover:text-[#FF6B35] transition-colors ml-2"
            >
              Skip orientation
            </Link>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="px-6 md:px-12 py-6 border-t border-[#303030] text-xs text-[#737373]">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </footer>
    </div>
  );
}
