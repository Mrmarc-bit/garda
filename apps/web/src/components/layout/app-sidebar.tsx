"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onCloseMobile?: () => void;
  isMobileOpen?: boolean;
}

interface NavSection {
  title: string;
  items: {
    href: string;
    label: string;
  }[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [{ href: "/app", label: "Overview" }],
  },
  {
    title: "INVESTIGATE",
    items: [
      { href: "/app/incidents", label: "Incidents" },
      { href: "/app/evidence", label: "Evidence & Timeline" },
    ],
  },
  {
    title: "SIMULATE",
    items: [
      { href: "/app/simulator", label: "Response Simulator" },
      { href: "/app/digital-twin", label: "IT/OT Digital Twin" },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [{ href: "/app/recommendations", label: "AI Recommendations" }],
  },
  {
    title: "EVALUATE",
    items: [
      { href: "/app/experiments", label: "Experiments & Evaluation" },
      { href: "/app/reports", label: "Reports" },
    ],
  },
  {
    title: "GOVERNANCE",
    items: [
      { href: "/app/audit-trail", label: "Audit Trail" },
      { href: "/app/settings", label: "Settings" },
    ],
  },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ onCloseMobile, isMobileOpen }) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-[248px] bg-[#171717] border-r border-[#303030] flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0",
        "lg:translate-x-0 lg:static lg:w-[248px]",
        isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex flex-col flex-1 overflow-y-auto">
        {/* Brand header from Figma */}
        <div className="p-6 pb-5 border-b border-[#303030]/60">
          <div className="flex items-center justify-between">
            <Link href="/app" className="block">
              <span className="font-bold text-sm tracking-wide text-[#F5F5F5] block">
                GARDA-SIM AI
              </span>
            </Link>
            {onCloseMobile && (
              <button
                type="button"
                onClick={onCloseMobile}
                className="lg:hidden p-1 text-[#A3A3A3] hover:text-[#F5F5F5]"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-[#A3A3A3] mt-2 cursor-pointer hover:text-[#F5F5F5]">
            <span>Simulation Lab</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
          </div>
          <p className="text-[11px] text-[#737373] mt-1">
            Synthetic design / demo
          </p>
        </div>

        {/* Navigation Sections */}
        <nav className="p-6 pt-4 space-y-5 flex-1" aria-label="Main sidebar navigation">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title} className="space-y-2">
              <h2 className="text-[11px] font-semibold text-[#737373] tracking-wider uppercase">
                {section.title}
              </h2>
              <ul className="space-y-1.5">
                {section.items.map((item) => {
                  const isActive =
                    item.href === "/app"
                      ? pathname === "/app"
                      : pathname.startsWith(item.href);

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onCloseMobile}
                        className={cn(
                          "block text-xs transition-colors py-0.5",
                          isActive
                            ? "text-[#FF6B35] font-medium"
                            : "text-[#A3A3A3] hover:text-[#F5F5F5]"
                        )}
                      >
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="text-[#FF6B35] text-[10px]">▸</span>
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          <span>{item.label}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {/* Persistent Bottom Footer from Figma */}
      <div className="p-6 border-t border-[#303030]/60 bg-[#171717] space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          No production connections.
        </div>
        <div className="text-xs text-[#A3A3A3]">
          No real response actions.
        </div>
        <div className="text-[10px] text-[#737373] tracking-widest uppercase pt-2">
          RESEARCH PROTOTYPE
        </div>
      </div>
    </aside>
  );
};
