"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";

interface AppHeaderProps {
  onOpenMobile?: () => void;
  breadcrumb?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMobile,
  breadcrumb,
}) => {
  const pathname = usePathname();

  // Derive breadcrumb default if not explicitly provided
  const getBreadcrumb = () => {
    if (breadcrumb) return breadcrumb;
    if (pathname === "/app") return "Workspace / Overview";
    if (pathname.startsWith("/app/incidents")) return "Workspace / Incidents";
    if (pathname.startsWith("/app/simulator")) return "Workspace / Response Simulator";
    if (pathname.startsWith("/app/digital-twin")) return "Workspace / IT/OT Digital Twin";
    if (pathname.startsWith("/app/evidence")) return "Workspace / Evidence & Timeline";
    if (pathname.startsWith("/app/recommendations")) return "Workspace / AI Recommendations";
    if (pathname.startsWith("/app/experiments")) return "Workspace / Experiments & Evaluation";
    if (pathname.startsWith("/app/reports")) return "Workspace / Reports";
    if (pathname.startsWith("/app/audit-trail")) return "Workspace / Audit Trail";
    if (pathname.startsWith("/app/settings")) return "Workspace / Settings";
    if (pathname.startsWith("/app/notifications")) return "Workspace / Notifications";
    if (pathname.startsWith("/app/profile")) return "Workspace / Profile";
    return "Workspace";
  };

  const breadcrumbText = getBreadcrumb();
  const parts = breadcrumbText.split(" / ");

  return (
    <header className="h-16 px-6 md:px-8 border-b border-[#303030] bg-[#171717] flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden p-1.5 text-[#A3A3A3] hover:text-[#F5F5F5] rounded"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Breadcrumb matching Figma */}
        <nav aria-label="Breadcrumbs" className="text-xs">
          <ol className="flex items-center gap-1.5 text-[#A3A3A3]">
            {parts.map((part, index) => {
              const isLast = index === parts.length - 1;
              return (
                <React.Fragment key={part}>
                  {index > 0 && <span className="text-[#737373]">/</span>}
                  <li className={isLast ? "text-[#F5F5F5] font-medium" : "text-[#A3A3A3]"}>
                    {part}
                  </li>
                </React.Fragment>
              );
            })}
          </ol>
        </nav>
      </div>

      <div className="flex items-center gap-4 text-xs">
        {/* Search workspace affordance */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#1D1D1D] border border-[#383838] text-[#A3A3A3] cursor-pointer hover:border-[#737373] transition-colors">
          <Search className="w-3.5 h-3.5 text-[#737373]" />
          <span>Search workspace</span>
          <kbd className="text-[10px] bg-[#252525] px-1 py-0.5 rounded text-[#737373] border border-[#383838] ml-2 font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notifications text link */}
        <Link
          href="/app/notifications"
          className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
        >
          Notifications
        </Link>

        <span className="text-[#383838]">/</span>

        {/* Profile AD link */}
        <Link
          href="/app/profile"
          className="text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors flex items-center gap-1.5"
        >
          <span>Profile AD</span>
        </Link>
      </div>
    </header>
  );
};
