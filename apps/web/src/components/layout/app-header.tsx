"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Bell, Search, ShieldCheck } from "lucide-react";
import { SimulationBadge } from "@/components/layout/simulation-badge";

interface AppHeaderProps {
  onOpenMobile?: () => void;
  title?: string;
  subtitle?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onOpenMobile,
  title = "Overview Dashboard",
  subtitle = "Synthetic Incident Defense & Blast-Radius Simulator",
}) => {
  return (
    <header className="h-16 px-4 md:px-8 border-b border-border bg-bg-secondary flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {onOpenMobile && (
          <button
            type="button"
            onClick={onOpenMobile}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-sm md:text-base font-semibold text-text-primary leading-tight flex items-center gap-2">
            <span>{title}</span>
            <span className="hidden sm:inline-block text-xs font-normal text-text-muted">|</span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-status-success">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Engine: Deterministic Active</span>
            </span>
          </h1>
          {subtitle && <p className="text-[11px] text-text-muted hidden md:block">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Scenario context indicator */}
        <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-card border border-border text-xs">
          <span className="text-text-muted">Scenario:</span>
          <span className="font-mono font-medium text-text-primary">INC-2026-0042</span>
        </div>

        {/* Mandatory Safety Indicator */}
        <SimulationBadge />

        {/* Quick action buttons */}
        <Link
          href="/app/notifications"
          className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated relative transition-colors"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        </Link>
      </div>
    </header>
  );
};
