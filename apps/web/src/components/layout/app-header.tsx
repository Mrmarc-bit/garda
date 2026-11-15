"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Search, X, ArrowRight, Shield, Activity, FileText, Settings, Play, Menu, Bell } from "lucide-react";

interface AppHeaderProps {
  onOpenMobile?: () => void;
  breadcrumb?: string;
}

interface SearchItem {
  id: string;
  title: string;
  category: "Navigation" | "Virtual Asset" | "Incident";
  href: string;
  hint: string;
}

const SEARCH_ITEMS: SearchItem[] = [
  { id: "sim", title: "Response Simulator", category: "Navigation", href: "/app/simulator", hint: "Evaluate strategies & safety rules" },
  { id: "twin", title: "IT/OT Digital Twin", category: "Navigation", href: "/app/digital-twin", hint: "6 virtual assets & dependency graph" },
  { id: "audit", title: "Append-Only Audit Trail", category: "Navigation", href: "/app/audit-trail", hint: "HMAC-chained ledger with a verify endpoint" },
  { id: "recs", title: "Decision Support & Review", category: "Navigation", href: "/app/recommendations", hint: "Human-in-the-loop sign-off; no model connected" },
  { id: "rep", title: "Reports & Artifact Exports", category: "Navigation", href: "/app/reports", hint: "Download JSON, MD, CSV briefs" },
  { id: "exp", title: "Measured Run Harness", category: "Navigation", href: "/app/experiments", hint: "Repeat each strategy and measure latency" },
  { id: "inc", title: "INC-2026-0042", category: "Incident", href: "/app/incidents/INC-2026-0042", hint: "Suspicious Privilege Escalation on APP-GW-02" },
  { id: "inc2", title: "INC-2026-0043", category: "Incident", href: "/app/incidents/INC-2026-0043", hint: "Anomalous Modbus Read Probe on OT-CONTROLLER-SIM-01" },
  { id: "gw", title: "APP-GW-02", category: "Virtual Asset", href: "/app/digital-twin", hint: "Edge Application Gateway (compromised)" },
  { id: "ot", title: "OT-CONTROLLER-SIM-01", category: "Virtual Asset", href: "/app/digital-twin", hint: "Virtual Industrial Controller (healthy)" },
  { id: "id-svc", title: "IDENTITY-SVC-01", category: "Virtual Asset", href: "/app/digital-twin", hint: "Identity & Access Controller (healthy)" },
  { id: "set", title: "Workspace Settings", category: "Navigation", href: "/app/settings", hint: "Safety invariants & clearance" },
];

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMobile,
  breadcrumb,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = React.useState<boolean>(false);
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  // Global Cmd+K keyboard shortcut listener
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const getBreadcrumb = () => {
    if (breadcrumb) return breadcrumb;
    if (pathname === "/app") return "Workspace / Overview";
    // The incident detail route carries its id in the path, so the crumb names it
    // rather than stopping at the section.
    const incidentDetail = /^\/app\/incidents\/([^/]+)$/.exec(pathname);
    if (incidentDetail) return `Workspace / Incidents / ${decodeURIComponent(incidentDetail[1])}`;
    if (pathname.startsWith("/app/incidents")) return "Workspace / Incidents";
    if (pathname.startsWith("/app/simulator")) return "Workspace / Response Simulator";
    if (pathname.startsWith("/app/digital-twin")) return "Workspace / IT/OT Digital Twin";
    if (pathname.startsWith("/app/evidence")) return "Workspace / Evidence & Timeline";
    if (pathname.startsWith("/app/recommendations")) return "Workspace / AI Recommendations";
    if (pathname.startsWith("/app/experiments")) return "Workspace / Experiments & Benchmark";
    if (pathname.startsWith("/app/reports")) return "Workspace / Reports";
    if (pathname.startsWith("/app/audit-trail")) return "Workspace / Audit Trail";
    if (pathname.startsWith("/app/settings")) return "Workspace / Settings";
    if (pathname.startsWith("/app/notifications")) return "Workspace / Notifications";
    if (pathname.startsWith("/app/profile")) return "Workspace / Profile";
    return "Workspace";
  };

  const breadcrumbText = getBreadcrumb();
  const parts = breadcrumbText.split(" / ");

  const filteredItems = React.useMemo(() => {
    if (!searchQuery.trim()) return SEARCH_ITEMS;
    const q = searchQuery.toLowerCase();
    return SEARCH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectItem = (href: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <>
      <header className="h-14 px-3 sm:px-4 md:px-6 border-b border-[#282828] bg-[#171717] flex items-center justify-between gap-2 sticky top-0 z-30 rounded-t-xl shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SidebarTrigger className="-ml-1 size-10 xl:size-7 rounded-md border border-[#383838] bg-[#202020] text-[#A3A3A3] hover:text-[#F5F5F5] hover:bg-[#2A2A2A] transition-colors shrink-0" />
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

          {/* Breadcrumb matching Figma — collapses to the current page below sm
              so the trail never competes with the action cluster for width. */}
          <nav aria-label="Breadcrumbs" className="text-xs min-w-0">
            <ol className="flex items-center gap-1.5 text-[#A3A3A3] min-w-0">
              {parts.map((part, index) => {
                const isLast = index === parts.length - 1;
                return (
                  <React.Fragment key={part}>
                    {index > 0 && (
                      <span className="hidden sm:inline text-[#737373]" aria-hidden="true">/</span>
                    )}
                    <li
                      className={cn(
                        "truncate",
                        isLast ? "text-[#F5F5F5] font-medium" : "hidden sm:block text-[#A3A3A3]"
                      )}
                    >
                      {part}
                    </li>
                  </React.Fragment>
                );
              })}
            </ol>
          </nav>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 text-xs shrink-0">
          {/* Functional Search Workspace Trigger — icon-only on small screens,
              full label from md up. */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search workspace"
            className="flex items-center justify-center gap-2 size-10 lg:size-auto lg:min-h-10 lg:px-3 rounded-md bg-[#1D1D1D] border border-[#383838] text-[#A3A3A3] cursor-pointer hover:border-[#737373] hover:text-[#F5F5F5] transition-colors"
          >
            <Search className="w-4 h-4 lg:w-3.5 lg:h-3.5 text-[#737373]" aria-hidden="true" />
            <span className="hidden lg:inline">Search workspace</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-[#252525] px-1 py-0.5 rounded text-[#737373] border border-[#383838] ml-2 font-mono">
              ⌘K
            </kbd>
          </button>

          {/* Notifications — icon on phones, label from sm up. */}
          <Link
            href="/app/notifications"
            aria-label="Notifications"
            className="flex items-center justify-center size-10 xl:size-auto xl:p-0 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors"
          >
            <Bell className="w-4 h-4 xl:hidden" aria-hidden="true" />
            <span className="hidden xl:inline">Notifications</span>
          </Link>

          <span className="hidden xl:inline text-[#383838]" aria-hidden="true">/</span>

          {/* Profile link — avatar dot always, label from sm up. */}
          <Link
            href="/app/profile"
            aria-label="Profile"
            className="flex items-center justify-center gap-1.5 size-10 xl:size-auto xl:p-0 text-[#A3A3A3] hover:text-[#F5F5F5] transition-colors font-mono"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true"></span>
            <span className="hidden xl:inline">Profile</span>
          </Link>
        </div>
      </header>

      {/* Global Command Palette Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search workspace"
            className="w-full max-w-xl bg-[#202020] border border-[#383838] rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Search Bar */}
            <div className="p-4 border-b border-[#303030] flex items-center gap-3">
              <Search className="w-4 h-4 text-[#FF6B35]" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search routes, virtual assets, or incident IDs..."
                aria-label="Search routes, virtual assets, or incident IDs"
                className="w-full bg-transparent text-sm text-[#F5F5F5] placeholder-[#737373] focus:outline-none font-mono"
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                className="p-1 text-[#737373] hover:text-[#F5F5F5]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#2A2A2A]">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectItem(item.href)}
                    className="w-full text-left p-3 hover:bg-[#282828] rounded-xl cursor-pointer flex items-center justify-between transition-colors group focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF6B35]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F5F5F5] group-hover:text-[#FF6B35] transition-colors">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#171717] text-[#737373] border border-[#333]">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A3A3A3] mt-0.5">
                        {item.hint}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#737373] group-hover:text-[#FF6B35] transition-colors" aria-hidden="true" />
                  </button>
                ))
              ) : (
                <div className="p-8 text-center text-xs text-[#737373]">
                  No matching workspace items found.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-[#171717] border-t border-[#303030] flex items-center justify-between text-[11px] text-[#737373] font-mono">
              <span>Press ESC to close</span>
              <span>GARDA-SIM AI Navigator</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
