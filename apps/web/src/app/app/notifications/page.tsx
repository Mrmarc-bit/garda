"use client";

import * as React from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/app-layout";
import { ChevronDown } from "lucide-react";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "unread" | "read">("all");

  return (
    <AppLayout breadcrumb="Workspace / Notifications">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/notifications
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Notifications
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Synthetic example notifications, not a live delivery feed or saved read state.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`pb-2.5 transition-colors ${
            activeTab === "all"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          All examples · 3
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("unread")}
          className={`pb-2.5 transition-colors ${
            activeTab === "unread"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Unread specimen · 2
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("read")}
          className={`pb-2.5 transition-colors ${
            activeTab === "read"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Read specimen · 1
        </button>
      </div>

      {/* Category selector & Mark all read */}
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1 cursor-pointer text-[#F5F5F5] hover:text-[#FF6B35]">
          <span className="underline">All categories</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#737373]" />
        </div>
        <span className="text-[#737373]">Mark all read — not connected</span>
      </div>

      {/* Notifications List */}
      <div className="space-y-4 mt-6">
        {/* Notification 1 */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Pending review
            </h2>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-2">
            REC-0042-01 needs a human demonstration decision.
          </p>
          <div className="text-xs text-[#737373] mt-2">
            Synthetic example · no delivery timestamp asserted
          </div>
          <div className="text-xs text-[#FF6B35] font-mono mt-1">
            · Unread specimen
          </div>
          <div className="mt-4">
            <Link
              href="/app/recommendations"
              className="text-xs text-[#FF6B35] hover:underline"
            >
              Open AI Recommendations ↗
            </Link>
          </div>
        </div>

        {/* Notification 2 */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B35]" />
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Evidence available
            </h2>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-2">
            EV-0042-01–03 belong to INC-2026-0042.
          </p>
          <div className="text-xs text-[#737373] mt-2">
            Synthetic example · no delivery timestamp asserted
          </div>
          <div className="text-xs text-[#FF6B35] font-mono mt-1">
            · Unread specimen
          </div>
          <div className="mt-4">
            <Link
              href="/app/evidence"
              className="text-xs text-[#FF6B35] hover:underline"
            >
              Open Evidence & Timeline ↗
            </Link>
          </div>
        </div>

        {/* Notification 3 */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#737373]" />
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Prototype orientation
            </h2>
          </div>
          <p className="text-xs text-[#A3A3A3] mt-2">
            Synthetic workspace boundaries are available in documentation.
          </p>
          <div className="text-xs text-[#737373] mt-2">
            Synthetic example · no delivery timestamp asserted
          </div>
          <div className="text-xs text-[#737373] font-mono mt-1">
            · Read specimen
          </div>
          <div className="mt-4">
            <Link
              href="/docs"
              className="text-xs text-[#FF6B35] hover:underline"
            >
              Open Documentation ↗
            </Link>
          </div>
        </div>
      </div>

      {/* Empty State Banner */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-8 text-center mt-6">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          No notifications — empty-state specimen
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 max-w-lg mx-auto">
          When the selected view has no examples, show this message. It does not assert a live inbox state.
        </p>
      </div>

      {/* Delivery Requirement Alert */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-4">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Notification delivery requires implementation
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
          Read status, preferences, routing, persistence and delivery have not been connected.
        </p>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
