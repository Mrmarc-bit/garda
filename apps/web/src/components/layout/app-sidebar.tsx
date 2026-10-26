"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  PlayCircle,
  Network,
  FileSearch,
  Sparkles,
  FlaskConical,
  FileText,
  History,
  Settings,
  User,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  onCloseMobile?: () => void;
  isMobileOpen?: boolean;
}

const NAV_ITEMS = [
  { href: "/app", label: "Overview", icon: LayoutDashboard },
  { href: "/app/incidents", label: "Incidents", icon: AlertTriangle, badge: "1 Active" },
  { href: "/app/simulator", label: "Response Simulator", icon: PlayCircle },
  { href: "/app/digital-twin", label: "IT/OT Digital Twin", icon: Network },
  { href: "/app/evidence", label: "Evidence & Timeline", icon: FileSearch },
  { href: "/app/recommendations", label: "AI Recommendations", icon: Sparkles },
  { href: "/app/experiments", label: "Experiments", icon: FlaskConical },
  { href: "/app/reports", label: "Reports", icon: FileText },
  { href: "/app/audit-trail", label: "Audit Trail", icon: History },
];

const SECONDARY_ITEMS = [
  { href: "/app/settings", label: "Settings", icon: Settings },
  { href: "/app/profile", label: "Profile", icon: User },
];

export const AppSidebar: React.FC<AppSidebarProps> = ({ onCloseMobile, isMobileOpen }) => {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-bg-secondary border-r border-border flex flex-col justify-between transition-transform duration-200 ease-in-out",
        "lg:translate-x-0 lg:static lg:w-64",
        isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      )}
    >
      {/* Brand header */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-border">
        <Link href="/app" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center text-accent">
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <div>
            <div className="font-bold text-sm text-text-primary tracking-wide">GARDA-SIM AI</div>
            <div className="text-[10px] text-text-muted font-mono tracking-wider">DEFENSE SIMULATOR</div>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main navigation links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          Operations
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/app" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/15 text-accent border border-accent/25 font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-text-muted")} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-status-critical/15 text-status-critical font-semibold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-6 px-3 pb-2 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
          System & Config
        </div>
        {SECONDARY_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-accent/15 text-accent border border-accent/25 font-semibold"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-accent" : "text-text-muted")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Operator identity card */}
      <div className="p-4 border-t border-border bg-[#1A1A1A]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-elevated border border-border flex items-center justify-center text-xs font-semibold text-accent">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-text-primary truncate">analyst-demo-03</div>
            <div className="text-[10px] text-text-muted truncate">SOC Level 2 · Synthetic</div>
          </div>
        </div>
      </div>
    </aside>
  );
};
