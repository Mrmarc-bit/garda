import * as React from "react";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Scope of this prototype",
      desc: "GARDA-SIM AI is designed for synthetic incidents and virtual assets. The included names, identities and events are fictional. Do not provide real incident logs, credentials, personal data or sensitive infrastructure details.",
    },
    {
      title: "2. Information shown in the design",
      desc: "Account forms show intended name, email and password inputs. These editable visual specimens do not demonstrate collection, transmission or storage. Synthetic analyst-demo-03 is not a real account.",
    },
    {
      title: "3. Planned processing",
      desc: "A future implementation may need account management, session state, workspace preferences and review history. A responsible operator must define purposes, legal basis, retention and deletion behavior before collecting data. None is confirmed here.",
    },
    {
      title: "4. AI and third-party services",
      desc: "AI explanations are specimens. Provider integration, data routing, retention and training practices are unverified. Do not infer that information is sent to or protected by any provider. Email and export services are not configured.",
    },
    {
      title: "5. Access, retention and deletion",
      desc: "The visual settings express desired controls, not operational guarantees. Access requests, correction, export and deletion processes must be defined and implemented before use with real users.",
    },
    {
      title: "6. Cookies and analytics",
      desc: "No cookie, analytics or tracking integration is verified. Any future operator must disclose actual technologies and obtain consent where required.",
    },
    {
      title: "7. Review before release",
      desc: "This draft requires legal and security review against actual deployment behavior. An accountable operator and verified contact channel must be supplied before publication as a live policy.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#171717] text-[#F5F5F5] font-sans antialiased">
      <PublicHeader />

      {/* Header matching docs ui/Public ·/privacy · Desktop.png */}
      <section className="px-6 md:px-12 lg:px-16 pt-16 pb-12 border-b border-[#303030]">
        <div className="max-w-[1440px] mx-auto space-y-3">
          <div className="text-[11px] font-mono font-bold tracking-wider text-[#FF6B35] uppercase">
            LEGAL / DRAFT / /privacy
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-[#F5F5F5] leading-tight">
            Prototype privacy notice.
          </h1>
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-3xl leading-relaxed">
            Draft for legal and implementation review. This notice describes design intent; it does not verify an operating service or its data practices.
          </p>
        </div>
      </section>

      {/* Content Sections */}
      <section className="px-6 md:px-12 lg:px-16 py-12 flex-1">
        <div className="max-w-[1440px] mx-auto space-y-6">
          {/* Top Visual Specification Specimen Box */}
          <div className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-1">
            <h2 className="text-xs font-bold text-[#F5F5F5]">
              Visual specification — integrations unverified
            </h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              No live authentication, analytics, storage, AI provider or email delivery has been established by these screens.
            </p>
          </div>

          {/* 7 Section Cards */}
          {sections.map((sec) => (
            <div
              key={sec.title}
              className="bg-[#202020] border border-[#383838] rounded-xl p-6 space-y-2"
            >
              <h2 className="text-base font-bold text-[#F5F5F5]">
                {sec.title}
              </h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                {sec.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
