"use client";

import * as React from "react";
import { AppLayout } from "@/components/layout/app-layout";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = React.useState<"account" | "password" | "sessions">("account");
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  return (
    <AppLayout breadcrumb="Workspace / Profile">
      {/* Top metadata tags */}
      <div className="space-y-1">
        <div className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
          SIMULATION ONLY
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Synthetic design/demo environment — not live
        </div>
        <div className="text-xs font-mono text-[#737373]">
          /app/profile
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="mt-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">
          Profile
        </h1>
        <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
          Synthetic demo account specimen. No authenticated identity, credentials or sessions are established.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-6 flex items-center gap-6 border-b border-[#383838] text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("account")}
          className={`pb-2.5 transition-colors ${
            activeTab === "account"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Account
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("password")}
          className={`pb-2.5 transition-colors ${
            activeTab === "password"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("sessions")}
          className={`pb-2.5 transition-colors ${
            activeTab === "sessions"
              ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
              : "text-[#A3A3A3] hover:text-[#F5F5F5]"
          }`}
        >
          Sessions
        </button>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        {/* Left Card: Demo Analyst */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5]">
              Demo Analyst
            </h2>
            <div className="text-xs text-[#737373] mt-1">
              · Synthetic demo account
            </div>

            <div className="space-y-2 text-xs mt-4">
              <div>
                <span className="text-[#A3A3A3]">Identity / </span>
                <span className="font-mono text-[#F5F5F5]">analyst-demo-03</span>
              </div>
              <div>
                <span className="text-[#A3A3A3]">Verification / </span>
                <span className="text-[#F5F5F5]">Unverified · specimen</span>
              </div>
            </div>

            <div className="space-y-3 mt-5">
              <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
                <span className="block text-[11px] text-[#737373]">Display name</span>
                <span className="text-xs text-[#F5F5F5] font-medium mt-0.5 block">
                  Demo Analyst
                </span>
              </div>

              <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3">
                <span className="block text-[11px] text-[#737373]">Email address · synthetic</span>
                <span className="text-xs font-mono text-[#F5F5F5] font-medium mt-0.5 block">
                  analyst@example.test
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-[#737373] mt-6">
            <div>Update profile — not connected</div>
            <div>Server validation, authorization and account persistence require implementation.</div>
          </div>
        </div>

        {/* Right Card: Change password · visual flow */}
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4">
              Change password · visual flow
            </h2>

            <div className="space-y-3">
              <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#737373]">Current password</span>
                  <span className="text-xs font-mono text-[#F5F5F5] mt-0.5 block">
                    {showPassword ? "CurrentPass123!" : "••••••••••"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#737373]">New password</span>
                  <span className="text-xs font-mono text-[#F5F5F5] mt-0.5 block">
                    {showPassword ? "NewSecurePassword456!" : "••••••••••"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="text-[11px] text-[#737373]">
                Intended minimum: 12 characters. No real credentials shown.
              </div>

              <div className="bg-[#1D1D1D] border border-[#383838] rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="block text-[11px] text-[#737373]">Confirm new password</span>
                  <span className="text-xs font-mono text-[#F5F5F5] mt-0.5 block">
                    {showPassword ? "NewSecurePassword456!" : "••••••••••"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-xs text-[#A3A3A3] hover:text-[#F5F5F5]"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs text-[#737373] mt-6">
            <div>Change password — not connected</div>
            <div>Reauthentication, server policy and session revocation require implementation. No password has been changed.</div>
          </div>
        </div>
      </div>

      {/* Session Controls Card */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-4">
        <h2 className="text-base font-semibold text-[#F5F5F5]">
          Session controls
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 leading-relaxed">
          No real session inventory exists. A future implementation should show device context, recent access and revoke controls only after verified server data.
        </p>
        <div className="mt-5 flex items-center gap-4 text-xs">
          <span className="text-[#A3A3A3]">Revoke other sessions</span>
          <button type="button" className="text-[#F5F5F5] underline hover:text-[#FF6B35]">
            Log out — visual control
          </button>
        </div>
      </div>

      {/* Implementation Required Alert */}
      <div className="bg-[#252525] border border-[#383838] rounded-xl p-5 mt-4">
        <h2 className="text-xs font-semibold text-[#F5F5F5]">
          Implementation required
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-1 leading-relaxed">
          Profile updates, verification checks, password changes and logout do not operate in this visual design.
        </p>
      </div>

      {/* Persistent Disclaimer */}
      <div className="text-xs text-[#737373] mt-8 mb-4">
        Visual design only — navigation, authentication, simulation, policy evaluation, AI, persistence, exports and email delivery require implementation.
      </div>
    </AppLayout>
  );
}
