"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Database,
  Loader2,
  Lock,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  ApiError,
  loadFailureHint,
  HealthInfo,
  SessionInfo,
  fetchHealth,
  fetchSession,
  logout,
} from "@/lib/api-client";
import { SkeletonCard } from "@/components/ui/skeleton";

type TabKey = "session" | "safety" | "storage";

/** The five deterministic invariants, described as they are actually evaluated server-side. */
const INVARIANTS: Array<{ id: string; name: string; description: string; gate: string }> = [
  {
    id: "SEC-OT-01",
    name: "Zero real-world containment",
    description:
      "The target must be a virtual asset in the synthetic inventory. No hostname resolution, socket or containment command is ever issued.",
    gate: "Asset inventory membership",
  },
  {
    id: "SEC-OT-02",
    name: "Operator clearance verification",
    description:
      "The operator must be a registered account whose clearance meets the configured minimum. Identity is taken from the server session, never the request body.",
    gate: "Session + clearance",
  },
  {
    id: "SEC-OT-03",
    name: "Core identity service availability",
    description:
      "Neither the target nor any asset the strategy would touch may be a protected identity service.",
    gate: "Protected asset set",
  },
  {
    id: "SEC-OT-04",
    name: "Uninterrupted OT telemetry stream",
    description:
      "A strategy whose modelled impact severs a telemetry-critical OT asset is blocked when strict OT mode is enabled.",
    gate: "Modelled impact ∩ OT-critical set",
  },
  {
    id: "SEC-OT-05",
    name: "Audit ledger integrity",
    description:
      "The HMAC-SHA256 chain is verified before a result is accepted. A broken chain fails the run instead of being reported as success.",
    gate: "Ledger chain verification",
  },
];

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = React.useState<TabKey>("session");
  const [session, setSession] = React.useState<SessionInfo | null>(null);
  const [health, setHealth] = React.useState<HealthInfo | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = React.useState<boolean>(false);
  const [signOutError, setSignOutError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [sessionData, healthData] = await Promise.all([fetchSession(), fetchHealth()]);
        if (cancelled) return;
        setSession(sessionData);
        setHealth(healthData);
      } catch (err) {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError ? loadFailureHint(err) : "Could not read the workspace configuration."
        );
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    setSignOutError(null);
    try {
      await logout();
      router.replace("/login");
    } catch (err) {
      setSignOutError(
        err instanceof ApiError ? err.message : "Sign-out failed. The session may still be active."
      );
      setIsSigningOut(false);
    }
  };

  const tabs: Array<[TabKey, string]> = [
    ["session", "Session & Operator"],
    ["safety", "Safety Policy"],
    ["storage", "Storage & Ledger"],
  ];

  return (
    <>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold tracking-wider text-[#FF6B35] uppercase">
            SIMULATION ONLY
          </span>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
            {health ? `ENV ${health.environment.toUpperCase()}` : "READING RUNTIME"}
          </span>
        </div>
        <div className="text-xs text-[#A3A3A3]">
          Runtime configuration reported by the API · nothing on this page is stored in the browser
        </div>
        <div className="text-xs font-mono text-[#737373]">/app/settings</div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F5]">Workspace Settings</h1>
          <p className="text-base text-[#A3A3A3] mt-2 max-w-3xl leading-relaxed">
            Operator identity, safety policy and storage facts are resolved from the running API.
            They are not editable from the browser because the server is the only authority.
          </p>
        </div>
      </div>

      {loadError ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-500/40 bg-red-950/30 p-5 text-xs text-red-200 flex items-start gap-2"
        >
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
          <div>
            <p className="font-semibold text-[#F5F5F5]">Configuration unavailable</p>
            <p className="mt-1">{loadError}</p>
          </div>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-[#383838] text-xs" role="tablist">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={activeTab === key}
            onClick={() => setActiveTab(key)}
            className={`pb-2.5 transition-colors cursor-pointer ${
              activeTab === key
                ? "text-[#FF6B35] border-b-2 border-[#FF6B35] font-medium"
                : "text-[#A3A3A3] hover:text-[#F5F5F5]"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <p role="status" aria-live="polite" className="sr-only">
            Reading runtime configuration
          </p>
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : null}

      {!isLoading && activeTab === "session" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-[#FF6B35]" aria-hidden="true" />
              <span>Authenticated operator</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#737373] block">Operator ID</span>
                <span className="font-mono text-[#F5F5F5]">{session?.operator_id ?? "—"}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Display name</span>
                <span className="font-mono text-[#F5F5F5]">{session?.display_name ?? "—"}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Clearance level</span>
                <span className="font-mono text-[#F5F5F5]">
                  {session ? `Level ${session.clearance}` : "—"}
                </span>
              </div>
              <div>
                <span className="text-[#737373] block">Session expires</span>
                <span className="font-mono text-[#F5F5F5]">{session?.expires_at ?? "—"}</span>
              </div>
            </div>

            <p className="text-[11px] text-[#737373] mt-4 leading-relaxed">
              Identity is resolved from the HttpOnly session cookie on every request. There is no
              operator field in the simulation or review payloads, so a client cannot claim another
              identity.
            </p>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#F5F5F5] mb-2">End this session</h2>
              <p className="text-xs text-[#A3A3A3] leading-relaxed">
                Signing out revokes the session token on the server. The token is not merely dropped
                from the browser, so a copied cookie stops working immediately.
              </p>

              {signOutError ? (
                <p role="alert" className="text-xs text-red-300 mt-3">
                  {signOutError}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => void handleSignOut()}
              disabled={isSigningOut}
              className="mt-4 self-start bg-red-950/40 border border-red-500/50 hover:bg-red-900/50 text-red-200 text-xs font-medium px-4 py-2.5 rounded-lg transition-colors inline-flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSigningOut ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                  <span>Signing out…</span>
                </>
              ) : (
                <>
                  <LogOut className="w-3.5 h-3.5 text-red-400" aria-hidden="true" />
                  <span>Sign out</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {!isLoading && activeTab === "safety" && (
        <div className="bg-[#252525] border border-[#383838] rounded-xl p-6 mt-6">
          <div className="flex items-center gap-2 text-[10px] font-bold text-[#FF6B35] tracking-wider uppercase">
            <Lock className="w-3 h-3" aria-hidden="true" />
            <span>Enforced by the deterministic safety gate</span>
          </div>
          <h2 className="text-base font-semibold text-[#F5F5F5] mt-1 mb-1">
            Active deterministic invariants (SEC-OT-01 to 05)
          </h2>
          <p className="text-xs text-[#A3A3A3] mb-4">
            Evaluated on the server for every simulation run and every review decision. They are not
            switchable from the browser.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#383838] text-[#737373] uppercase font-mono">
                  <th scope="col" className="pb-3">
                    Invariant
                  </th>
                  <th scope="col" className="pb-3">
                    Safety specification
                  </th>
                  <th scope="col" className="pb-3">
                    Evaluation gate
                  </th>
                  <th scope="col" className="pb-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#383838]/60">
                {INVARIANTS.map((rule) => (
                  <tr key={rule.id}>
                    <td className="py-3 font-mono text-[#FF6B35] font-bold align-top">{rule.id}</td>
                    <td className="py-3 align-top">
                      <span className="text-[#F5F5F5] font-semibold block">{rule.name}</span>
                      <span className="text-[#A3A3A3] text-[11px] leading-relaxed block mt-0.5">
                        {rule.description}
                      </span>
                    </td>
                    <td className="py-3 text-[#A3A3A3] font-mono text-[11px] align-top">
                      {rule.gate}
                    </td>
                    <td className="py-3 font-mono text-[11px] align-top">
                      <span className="text-emerald-400 font-bold">ENFORCED</span>
                      {rule.id === "SEC-OT-04" && health && !health.strict_ot_mode ? (
                        <span className="text-amber-400 font-bold block">
                          PERMISSIVE MODE
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5 pt-4 border-t border-[#383838] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-[#737373] block">Strict OT mode</span>
              <span className="font-mono text-[#F5F5F5]">
                {health ? (health.strict_ot_mode ? "ENABLED" : "DISABLED") : "—"}
              </span>
            </div>
            <div>
              <span className="text-[#737373] block">Minimum operator clearance</span>
              <span className="font-mono text-[#F5F5F5]">
                {health ? `Level ${health.min_operator_clearance}` : "—"}
              </span>
            </div>
            <div>
              <span className="text-[#737373] block">Session TTL</span>
              <span className="font-mono text-[#F5F5F5]">
                {health ? `${health.session_ttl_minutes} minutes` : "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {!isLoading && activeTab === "storage" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#FF6B35]" aria-hidden="true" />
              <span>Storage backend</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[#737373] block">Data backend</span>
                <span className="font-mono text-[#F5F5F5]">{health?.data_backend ?? "—"}</span>
              </div>
              <div>
                <span className="text-[#737373] block">Audit ledger</span>
                <span className="font-mono text-[#F5F5F5]">append-only, HMAC-SHA256 chained</span>
              </div>
              <div>
                <span className="text-[#737373] block">Simulation only</span>
                <span className="font-mono text-[#F5F5F5]">
                  {health ? (health.simulation_only ? "TRUE" : "FALSE") : "—"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#737373] mt-4 leading-relaxed">
              Ledger entries are protected by SQLite triggers that reject UPDATE and DELETE, and each
              entry hash covers the previous hash. Verification is available from the audit trail.
            </p>

            <Link
              href="/app/audit-trail"
              className="mt-4 inline-flex items-center gap-1 text-xs text-[#FF6B35] hover:underline"
            >
              <span>Open the audit trail</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="bg-[#252525] border border-[#383838] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#F5F5F5] mb-2">Resetting workspace data</h2>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              This build exposes no destructive reset endpoint, by design: an append-only ledger that
              any browser could truncate would not be append-only. To start from a clean baseline,
              stop the API, remove the local <code className="font-mono">.garda/</code> directory,
              and start it again.
            </p>
            <ul className="mt-4 space-y-1.5 text-[11px] text-[#737373] font-mono">
              <li>· .garda/garda.db — operators, sessions, ledger</li>
              <li>· .garda/audit-secret.key — HMAC key for the chain</li>
              <li>· .garda/demo-credentials.txt — generated demo password</li>
            </ul>
            <p className="text-[11px] text-[#737373] mt-4 leading-relaxed">
              The directory is git-ignored. Deleting it also invalidates every earlier entry hash, so
              only do it in a development environment.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 mb-4 p-4 rounded-xl bg-[#1C1C1C] border border-[#2E2E2E] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373]">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" aria-hidden="true" />
          <span>GARDA-SIM AI runtime configuration · server-resolved</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          <span>ENV: {health?.environment?.toUpperCase() ?? "—"}</span>
          <span>BACKEND: {health?.data_backend ?? "—"}</span>
          <span>OPERATOR: {session?.operator_id ?? "—"}</span>
        </div>
      </div>
    </>
  );
}
